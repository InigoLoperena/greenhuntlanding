import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase with service role for security monitoring
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get comprehensive security health check
    const { data: healthCheck, error: healthError } = await supabaseService
      .rpc('get_security_health_check');

    if (healthError) {
      throw new Error(`Security health check failed: ${healthError.message}`);
    }

    // Get recent security audit events
    const { data: recentEvents, error: eventsError } = await supabaseService
      .from('security_audit')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (eventsError) {
      console.error('Failed to fetch recent security events:', eventsError);
    }

    // Get rate limiting stats
    const { data: rateLimitStats, error: rateError } = await supabaseService
      .from('rate_limits')
      .select('action_type, request_count')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

    if (rateError) {
      console.error('Failed to fetch rate limit stats:', rateError);
    }

    // Calculate rate limiting summary
    const rateLimitSummary = rateLimitStats?.reduce((acc, item) => {
      acc[item.action_type] = (acc[item.action_type] || 0) + item.request_count;
      return acc;
    }, {} as Record<string, number>) || {};

    // Check wallet balances for consistency
    const { data: walletStats, error: walletError } = await supabaseService
      .from('wallets')
      .select('currency, balance')
      .order('balance', { ascending: false });

    if (walletError) {
      console.error('Failed to fetch wallet stats:', walletError);
    }

    // Calculate wallet statistics
    const walletSummary = walletStats?.reduce((acc, wallet) => {
      if (!acc[wallet.currency]) {
        acc[wallet.currency] = { total: 0, count: 0, max: 0, min: Infinity };
      }
      acc[wallet.currency].total += parseFloat(wallet.balance.toString());
      acc[wallet.currency].count += 1;
      acc[wallet.currency].max = Math.max(acc[wallet.currency].max, parseFloat(wallet.balance.toString()));
      acc[wallet.currency].min = Math.min(acc[wallet.currency].min, parseFloat(wallet.balance.toString()));
      return acc;
    }, {} as Record<string, any>) || {};

    // Get company wallet balance
    const { data: companyWallet, error: companyError } = await supabaseService
      .from('company_wallet')
      .select('balance')
      .single();

    if (companyError) {
      console.error('Failed to fetch company wallet:', companyError);
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [];
    
    if (recentEvents?.some(e => e.event_type.includes('rate_limit'))) {
      suspiciousPatterns.push('Rate limiting violations detected');
    }
    
    if (walletSummary.USD?.max > 50000) {
      suspiciousPatterns.push('Unusually high wallet balance detected');
    }

    const securityReport = {
      timestamp: new Date().toISOString(),
      status: healthCheck?.status || 'UNKNOWN',
      health_check: healthCheck,
      recent_events: recentEvents?.slice(0, 5) || [], // Only return top 5 for response size
      rate_limit_summary: rateLimitSummary,
      wallet_summary: walletSummary,
      company_balance: companyWallet?.balance || 0,
      suspicious_patterns: suspiciousPatterns,
      system_checks: {
        stripe_webhook_secret: !!Deno.env.get("STRIPE_WEBHOOK_SECRET"),
        stripe_secret_key: !!Deno.env.get("STRIPE_SECRET_KEY"),
        service_role_key: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
        database_accessible: !healthError,
        security_audit_enabled: !!recentEvents
      },
      recommendations: [
        ...(healthCheck?.recommendations || []),
        ...suspiciousPatterns.map(pattern => `Investigate: ${pattern}`)
      ]
    };

    // Log this security check
    await supabaseService.rpc('log_security_audit', {
      p_event_type: 'security_monitor_check',
      p_details: {
        status: securityReport.status,
        checks_performed: Object.keys(securityReport.system_checks).length,
        suspicious_patterns_count: suspiciousPatterns.length
      },
      p_severity: suspiciousPatterns.length > 0 ? 'high' : 'low'
    });

    return new Response(JSON.stringify(securityReport), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Enhanced security monitor error:', error);
    
    // Return basic error response without exposing internal details
    return new Response(JSON.stringify({
      error: 'Security monitoring failed',
      timestamp: new Date().toISOString(),
      status: 'ERROR'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});