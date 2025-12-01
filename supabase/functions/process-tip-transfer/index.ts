import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TipRequest {
  senderId: string;
  recipientId: string;
  amount: number;
  message: string;
  currency: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create Supabase client with service role for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { senderId, recipientId, amount, message, currency }: TipRequest = await req.json();

    console.log('Processing tip transfer:', { senderId, recipientId, amount, currency });

    // Validate inputs
    if (!senderId || !recipientId || !amount || amount <= 0) {
      throw new Error('Invalid input parameters');
    }

    if (senderId === recipientId) {
      throw new Error('Cannot send tip to yourself');
    }

    if (amount < 0.01 || amount > 10000) {
      throw new Error('Amount must be between $0.01 and $10,000');
    }

    if (currency !== 'USD') {
      throw new Error('Only USD currency is supported currently');
    }

    // Verify sender is the authenticated user
    if (user.id !== senderId) {
      throw new Error('Unauthorized: can only send tips from your own account');
    }

    // Calculate amounts
    const tipAmount = Math.round(amount * 100) / 100; // Round to 2 decimals
    const commission = Math.round(tipAmount * 0.1 * 100) / 100; // 10% commission
    const recipientAmount = Math.round((tipAmount - commission) * 100) / 100; // 90% to recipient

    console.log('Calculated amounts:', { tipAmount, commission, recipientAmount });

    // Get sender wallet
    const senderWalletId = await supabase.rpc('get_or_create_wallet', {
      p_user_id: senderId,
      p_currency: currency
    });

    if (!senderWalletId.data) {
      throw new Error('Failed to get sender wallet');
    }

    // Get recipient wallet  
    const recipientWalletId = await supabase.rpc('get_or_create_wallet', {
      p_user_id: recipientId,
      p_currency: currency
    });

    if (!recipientWalletId.data) {
      throw new Error('Failed to get recipient wallet');
    }

    // Check sender balance
    const { data: senderWallet, error: senderWalletError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('id', senderWalletId.data)
      .single();

    if (senderWalletError || !senderWallet) {
      throw new Error('Failed to get sender wallet balance');
    }

    if (senderWallet.balance < tipAmount) {
      throw new Error('Insufficient balance');
    }

    // Process transactions atomically
    // 1. Deduct from sender
    const { data: senderResult, error: senderError } = await supabase.rpc('update_wallet_balance_atomic', {
      p_wallet_id: senderWalletId.data,
      p_amount: tipAmount,
      p_transaction_type: 'debit',
      p_user_id: senderId,
      p_description: `Tip sent to user: ${message}`,
      p_object_type: 'withdrawal',
      p_currency: currency
    });

    if (senderError || !senderResult?.success) {
      console.error('Sender transaction failed:', senderError);
      const msg = (senderError as any)?.message || 'Unknown error';
      throw new Error(`Failed to deduct tip from sender wallet: ${msg}`);
    }

    // 2. Credit recipient (90% of tip)
    const { data: recipientResult, error: recipientError } = await supabase.rpc('update_wallet_balance_atomic', {
      p_wallet_id: recipientWalletId.data,
      p_amount: recipientAmount,
      p_transaction_type: 'credit',
      p_user_id: recipientId,
      p_description: `Tip received: ${message}`,
      p_object_type: 'deposit',
      p_currency: currency
    });

    if (recipientError || !recipientResult?.success) {
      console.error('Recipient transaction failed:', recipientError);
      // Note: In a production system, you'd want to implement proper rollback here
      throw new Error('Failed to credit recipient wallet');
    }

    // 3. Add commission to company wallet (10%)
    const { data: companyResult, error: companyError } = await supabase.rpc('update_company_wallet_balance_atomic', {
      p_amount: commission,
      p_description: `Tip commission from ${senderId} to ${recipientId}: ${message}`
    });

    if (companyError || !companyResult?.success) {
      console.error('Company commission failed:', companyError);
      // Log but don't fail the transaction - tip was already processed
      console.log('Warning: Commission payment failed but tip was processed successfully');
    }

    console.log('Tip transfer completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Tip sent successfully',
        details: {
          tipAmount,
          recipientReceived: recipientAmount,
          commission,
          senderTransactionId: senderResult.transaction_id,
          recipientTransactionId: recipientResult.transaction_id
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error processing tip transfer:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});