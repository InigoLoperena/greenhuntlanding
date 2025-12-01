import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== Coordinate purchase function started ===');
    
    // Create service role client for security logging
    const serviceSupabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error('No authorization header provided');
      await serviceSupabase.rpc('log_security_audit', {
        p_event_type: 'coordinate_purchase_no_auth',
        p_details: { ip: req.headers.get('x-forwarded-for') },
        p_severity: 'high'
      });
      throw new Error("No authorization header provided");
    }

    // Create client for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    );

    console.log('Getting user from auth header...');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user?.email) {
      console.error('Authentication failed:', userError?.message || 'User not found');
      throw new Error(`Authentication failed: ${userError?.message || 'User not found'}`);
    }

    console.log('User authenticated:', { userId: user.id, email: user.email });

    // Rate limiting check
    const rateLimitPassed = await serviceSupabase.rpc('check_rate_limit', {
      p_action_type: 'coordinate_purchase',
      p_max_requests: 10, // Max 10 coordinate purchases per minute
      p_window_minutes: 1
    });

    if (!rateLimitPassed) {
      throw new Error("Too many purchase requests. Please wait before trying again.");
    }

    console.log('Parsing request body...');
    const requestBody = await req.json();
    console.log('Request body received:', requestBody);
    
    const { amount, description, objectType = 'coordinate', currency = 'USD', objectId } = requestBody;
    
    // Enhanced validation with security logging
    console.log('Validating request parameters...');
    if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 50000) {
      console.error('Invalid amount:', amount);
      await serviceSupabase.rpc('log_security_audit', {
        p_event_type: 'coordinate_purchase_invalid_amount',
        p_user_id: user.id,
        p_details: { amount, objectId },
        p_severity: 'medium'
      });
      throw new Error(`Invalid amount: ${amount}. Must be between 0.01 and 50,000`);
    }

    if (!['USD', 'EUR'].includes(currency)) {
      console.error('Unsupported currency:', currency);
      await serviceSupabase.rpc('log_security_audit', {
        p_event_type: 'coordinate_purchase_invalid_currency',
        p_user_id: user.id,
        p_details: { currency, objectId },
        p_severity: 'medium'
      });
      throw new Error(`Unsupported currency: ${currency}`);
    }

    if (!objectId) {
      console.error('Object ID is required but not provided');
      await serviceSupabase.rpc('log_security_audit', {
        p_event_type: 'coordinate_purchase_no_object_id',
        p_user_id: user.id,
        p_details: { amount, currency },
        p_severity: 'high'
      });
      throw new Error('Object ID is required');
    }

    // Log successful validation
    await serviceSupabase.rpc('log_security_audit', {
      p_event_type: 'coordinate_purchase_initiated',
      p_user_id: user.id,
      p_details: { amount, currency, objectId, objectType },
      p_severity: 'low'
    });

    // Service role client already created above for security logging
    // No need to recreate it

    // Get object details to find the seller
    console.log('Fetching object details for objectId:', objectId);
    const { data: object, error: objectError } = await serviceSupabase
      .from('objects')
      .select('user_id, title, price_credits')
      .eq('id', objectId)
      .maybeSingle();

    if (objectError) {
      console.error('Error fetching object:', objectError);
      throw new Error(`Error fetching object: ${objectError.message}`);
    }

    if (!object) {
      console.error('Object not found for ID:', objectId);
      throw new Error('Object not found');
    }

    console.log('Object found:', object);

    const sellerId = object.user_id;
    
    console.log('Checking ownership:', {
      buyerId: user.id,
      sellerId: sellerId,
      isSameUser: sellerId === user.id
    });
    
    // Check if user is trying to buy their own object
    if (sellerId === user.id) {
      console.log('User trying to buy own object - returning error');
      return new Response(JSON.stringify({ 
        error: 'No puedes comprar una coordenada publicada por ti mismo!' 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log('Purchase validation passed, proceeding with payment');
    
    // Calculate amounts precisely - no commission for prices <= 10 cents
    const totalAmount = Number(amount);
    const shouldApplyCommission = totalAmount > 0.10; // 10 cents threshold
    const platformFee = shouldApplyCommission 
      ? Math.ceil(totalAmount * 0.2 * 100) / 100 // 20% platform fee rounded UP to nearest cent
      : 0; // No commission for low prices
    const sellerAmount = Math.round((totalAmount - platformFee) * 100) / 100; // Seller gets remainder with 2 decimals
    
    console.log('Payment breakdown:', {
      totalAmount: totalAmount,
      sellerAmount: sellerAmount,
      platformFee: platformFee
    });

    // Get or create buyer wallet for the specified currency
    console.log('Getting/creating buyer wallet for user:', user.id, 'currency:', currency);
    const { data: walletId, error: walletError } = await serviceSupabase
      .rpc('get_or_create_wallet', {
        p_user_id: user.id,
        p_currency: currency
      });

    if (walletError) {
      console.error('Error getting/creating buyer wallet:', walletError);
      throw new Error(`Failed to get/create buyer wallet: ${walletError.message}`);
    }

    console.log('Buyer wallet ID:', walletId);

    // 1. Deduct from buyer
    console.log('Processing buyer debit:', {
      walletId,
      amount: totalAmount,
      userId: user.id,
      description: description || `${objectType} purchase`
    });

    const { data: buyerResult, error: buyerError } = await serviceSupabase
      .rpc('update_wallet_balance_atomic', {
        p_wallet_id: walletId,
        p_amount: totalAmount,
        p_transaction_type: 'debit',
        p_user_id: user.id,
        p_description: description || `${objectType} purchase`,
        p_object_type: objectType,
        p_currency: currency
      });

    if (buyerError) {
      console.error('Buyer payment error:', buyerError);
      throw new Error(`Failed to process buyer payment: ${buyerError.message}`);
    }

    console.log('Buyer payment successful:', buyerResult);

    // 2. Add to seller
    console.log('Getting/creating seller wallet for user:', sellerId, 'currency:', currency);
    const { data: sellerWalletId, error: sellerWalletError } = await serviceSupabase
      .rpc('get_or_create_wallet', {
        p_user_id: sellerId,
        p_currency: currency
      });

    if (sellerWalletError) {
      console.error('Error getting/creating seller wallet:', sellerWalletError);
      throw new Error(`Failed to get/create seller wallet: ${sellerWalletError.message}`);
    }

    console.log('Seller wallet ID:', sellerWalletId);
    console.log('Processing seller credit:', {
      walletId: sellerWalletId,
      amount: sellerAmount,
      userId: sellerId
    });

    const { data: sellerResult, error: sellerError } = await serviceSupabase
      .rpc('update_wallet_balance_atomic', {
        p_wallet_id: sellerWalletId,
        p_amount: sellerAmount,
        p_transaction_type: 'credit',
        p_user_id: sellerId,
        p_description: `Venta de coordenadas: ${object.title} (${Math.round((sellerAmount/totalAmount)*100)}% after platform fee)`,
        p_object_type: 'coordinate_sale',
        p_currency: currency
      });

    if (sellerError) {
      console.error('Seller payment error:', sellerError);
      throw new Error(`Failed to process seller payment: ${sellerError.message}`);
    }

    console.log('Seller payment successful:', sellerResult);

    // 3. Add platform commission to company wallet (20%) - always process if amount > 0
    if (platformFee > 0) {
      console.log('Processing platform commission:', platformFee);
      const { data: companyResult, error: companyError } = await serviceSupabase
        .rpc('update_company_wallet_balance_atomic', {
          p_amount: platformFee,
          p_description: `Comisión 20% - Venta coordenadas: ${object.title}`
        });

      if (companyError) {
        console.error('Company wallet error:', companyError);
        throw new Error(`Failed to process platform commission: ${companyError.message}`);
      }
      console.log('Platform commission processed successfully:', companyResult);
    } else {
      console.log('Skipping platform commission (amount is 0)');
    }

    // 4. For abandoned objects, delete the object after successful purchase
    if (objectType === 'abandoned') {
      const { error: deleteError } = await serviceSupabase
        .from('objects')
        .delete()
        .eq('id', objectId);
      
      if (deleteError) {
        console.error('Failed to delete abandoned object:', deleteError.message);
        // Don't throw error here as payment was successful, just log
      }
    }

    // Type assertion for the RPC result
    const walletResult = buyerResult as {
      success: boolean;
      transaction_id: string;
      previous_balance: number;
      new_balance: number;
      currency: string;
    };

    return new Response(JSON.stringify({ 
      success: true,
      transaction_id: walletResult.transaction_id,
      new_balance: walletResult.new_balance,
      currency: currency,
      sellerAmount: sellerAmount,
      platformFee: platformFee,
      message: `Successfully purchased ${objectType} for ${currency === 'EUR' ? '€' : '$'}${amount}`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('=== ERROR in create-coordinate-payment ===');
    console.error('Error details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process coordinate payment';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error message:', errorMessage);
    console.error('Error stack:', errorStack);
    
    console.error('Returning error response:', errorMessage);
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: errorStack
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});