import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
}

interface SecurityHealthResponse {
  overall_status: string;
  critical_issues: number;
  warning_issues: number;
  recommendations: string[];
  metrics: {
    suspicious_transactions_1h: number;
    rate_limit_violations_1h: number;
    failed_auth_attempts_1h: number;
    large_wallet_operations_6h: number;
  };
  system_status: {
    database_health: string;
    auth_health: string;
    storage_health: string;
  };
  last_check: string;
  timestamp: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('[SECURITY-HEALTH-CHECK] Starting comprehensive health check');

    // Run the security health monitor function
    const { data: healthData, error: healthError } = await supabaseClient
      .rpc('security_health_monitor');

    if (healthError) {
      console.error('[SECURITY-HEALTH-CHECK] Health check error:', healthError);
      throw healthError;
    }

    // Additional system health checks
    const systemChecks = {
      database_health: 'HEALTHY',
      auth_health: 'HEALTHY',
      storage_health: 'HEALTHY'
    };

    try {
      // Test database connectivity
      const { error: dbTest } = await supabaseClient
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (dbTest) {
        systemChecks.database_health = 'ERROR';
        console.error('[SECURITY-HEALTH-CHECK] Database connectivity issue:', dbTest);
      }
    } catch (err) {
      systemChecks.database_health = 'ERROR';
      console.error('[SECURITY-HEALTH-CHECK] Database test failed:', err);
    }

    // Compile final response
    const response: SecurityHealthResponse = {
      ...healthData,
      system_status: systemChecks,
    };

    // Log the health check result
    await supabaseClient.rpc('log_security_audit', {
      p_event_type: 'automated_health_check',
      p_details: {
        overall_status: response.overall_status,
        critical_issues: response.critical_issues,
        warning_issues: response.warning_issues,
        system_status: systemChecks
      },
      p_severity: response.overall_status === 'CRITICAL' ? 'critical' : 
                  response.overall_status === 'WARNING' ? 'high' : 'low'
    });

    console.log('[SECURITY-HEALTH-CHECK] Health check completed:', {
      status: response.overall_status,
      critical: response.critical_issues,
      warnings: response.warning_issues
    });

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('[SECURITY-HEALTH-CHECK] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        error: 'Security health check failed',
        details: errorMessage,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})