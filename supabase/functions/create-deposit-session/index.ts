import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Enhanced security logging
    const serviceSupabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      await serviceSupabase.rpc('log_security_audit', {
        p_event_type: 'deposit_no_auth_header',
        p_details: { ip: req.headers.get('x-forwarded-for') },
        p_severity: 'medium'
      });
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      await serviceSupabase.rpc('log_security_audit', {
        p_event_type: 'deposit_invalid_user',
        p_details: { token_prefix: token.substring(0, 10) },
        p_severity: 'medium'
      });
      throw new Error("User not authenticated");
    }

    // Rate limiting check
    const rateLimitPassed = await serviceSupabase.rpc('check_rate_limit', {
      p_action_type: 'deposit_request',
      p_max_requests: 5, // Max 5 deposit requests per minute
      p_window_minutes: 1
    });

    if (!rateLimitPassed) {
      throw new Error("Too many deposit requests. Please wait before trying again.");
    }

    const { amount, currency = 'USD' } = await req.json();
    
    // Enhanced validation
    if (!amount || typeof amount !== 'number' || amount < 10 || amount > 50000) {
      await serviceSupabase.rpc('log_security_audit', {
        p_event_type: 'deposit_invalid_amount',
        p_user_id: user.id,
        p_details: { amount, currency },
        p_severity: 'medium'
      });
      throw new Error("Invalid deposit amount. Must be between $10 and $50,000");
    }

    if (currency !== 'USD') {
      await serviceSupabase.rpc('log_security_audit', {
        p_event_type: 'deposit_invalid_currency',
        p_user_id: user.id,
        p_details: { currency },
        p_severity: 'medium'
      });
      throw new Error("This function only handles USD deposits");
    }

    // Log successful validation
    await serviceSupabase.rpc('log_security_audit', {
      p_event_type: 'deposit_session_requested',
      p_user_id: user.id,
      p_details: { amount, currency },
      p_severity: 'low'
    });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customerId = null;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create Stripe checkout session
    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Wallet Deposit (USD)',
              description: `Deposit $${amount} to your wallet`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get("origin")}/app/wallet?success=true`,
      cancel_url: `${req.headers.get("origin")}/app/wallet?canceled=true`,
      metadata: {
        user_id: user.id,
        amount: amount.toString(),
        currency: 'USD',
        type: 'wallet_deposit'
      }
    };

    // Add customer info - either existing customer ID or email for new customers
    if (customerId) {
      sessionConfig.customer = customerId;
    } else {
      sessionConfig.customer_email = user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Get or create USD wallet for user
    const walletSupabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: walletId } = await walletSupabase
      .rpc('get_or_create_wallet', {
        p_user_id: user.id,
        p_currency: 'USD'
      });

    // Create pending transaction
    await walletSupabase
      .from('transactions')
      .insert({
        user_id: user.id,
        wallet_id: walletId,
        type: 'deposit',
        amount: amount,
        currency: 'USD',
        status: 'pending',
        stripe_session_id: session.id,
        description: `Wallet deposit of $${amount}`,
      });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating USD deposit session:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});