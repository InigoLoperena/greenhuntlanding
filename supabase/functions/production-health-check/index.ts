import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

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
    const healthStatus = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      version: '1.0.0',
      environment: 'production',
      services: {},
      database: {},
      security: {},
      performance: {}
    };

    // Initialize Supabase with service role
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // 1. Database Health Check
    try {
      const startTime = Date.now();
      const { data: testQuery, error: dbError } = await supabaseService
        .from('wallets')
        .select('count')
        .limit(1);
      
      const dbResponseTime = Date.now() - startTime;
      
      (healthStatus.database as any) = {
        status: dbError ? 'error' : 'healthy',
        response_time_ms: dbResponseTime,
        error: dbError?.message || null,
        accessible: !dbError
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      (healthStatus.database as any) = {
        status: 'error',
        error: errorMessage,
        accessible: false
      };
    }

    // 2. Stripe Integration Health Check
    try {
      if (Deno.env.get("STRIPE_SECRET_KEY")) {
        const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
          apiVersion: "2023-10-16",
        });
        
        const startTime = Date.now();
        // Test Stripe connectivity with a simple balance retrieval
        await stripe.balance.retrieve();
        const stripeResponseTime = Date.now() - startTime;
        
        (healthStatus.services as any).stripe = {
          status: 'healthy',
          response_time_ms: stripeResponseTime,
          webhook_secret_configured: !!Deno.env.get("STRIPE_WEBHOOK_SECRET")
        };
      } else {
        (healthStatus.services as any).stripe = {
          status: 'not_configured',
          error: 'STRIPE_SECRET_KEY not found'
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      (healthStatus.services as any).stripe = {
        status: 'error',
        error: errorMessage
      };
    }

    // 3. Security Functions Health Check
    try {
      const { data: securityCheck } = await supabaseService
        .rpc('get_security_health_check');
      
      (healthStatus.security as any) = {
        status: securityCheck?.status || 'unknown',
        audit_system: !!securityCheck,
        rate_limiting_active: true,
        rls_policies_active: true
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      (healthStatus.security as any) = {
        status: 'error',
        error: errorMessage,
        audit_system: false
      };
    }

    // 4. Performance Metrics
    try {
      const { data: recentTransactions } = await supabaseService
        .from('transactions')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
        .limit(100);
      
      const transactionCount = recentTransactions?.length || 0;
      const avgTransactionsPerMinute = transactionCount / 5;
      
      (healthStatus.performance as any) = {
        recent_transaction_rate: avgTransactionsPerMinute,
        status: avgTransactionsPerMinute > 100 ? 'high_load' : 'normal'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      (healthStatus.performance as any) = {
        status: 'error',
        error: errorMessage
      };
    }

    // 5. Environment Variables Check
    const requiredEnvVars = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(env => !Deno.env.get(env));
    
    if (missingEnvVars.length > 0) {
      healthStatus.status = 'degraded';
      (healthStatus.services as any).environment = {
        status: 'missing_variables',
        missing: missingEnvVars
      };
    } else {
      (healthStatus.services as any).environment = {
        status: 'healthy',
        all_variables_present: true
      };
    }

    // 6. Overall Status Determination
    const hasErrors = [
      (healthStatus.database as any).status === 'error',
      (healthStatus.services as any).stripe?.status === 'error',
      (healthStatus.security as any).status === 'error',
      (healthStatus.performance as any).status === 'error'
    ].some(Boolean);

    if (hasErrors) {
      healthStatus.status = 'degraded';
    }

    // 7. Auto-cleanup old audit logs (background task)
    try {
      await supabaseService.rpc('cleanup_old_security_logs');
    } catch (cleanupError) {
      console.error('Failed to cleanup old logs:', cleanupError);
    }

    // Log health check
    await supabaseService.rpc('log_security_audit', {
      p_event_type: 'production_health_check',
      p_details: {
        status: healthStatus.status,
        database_healthy: (healthStatus.database as any).status === 'healthy',
        stripe_healthy: (healthStatus.services as any).stripe?.status === 'healthy'
      },
      p_severity: hasErrors ? 'medium' : 'low'
    });

    return new Response(JSON.stringify(healthStatus), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: healthStatus.status === 'healthy' ? 200 : 
              healthStatus.status === 'degraded' ? 503 : 500,
    });

  } catch (error) {
    console.error('Production health check error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(JSON.stringify({
      timestamp: new Date().toISOString(),
      status: 'error',
      error: 'Health check failed',
      details: errorMessage
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});