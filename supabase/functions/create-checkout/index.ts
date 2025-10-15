import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.1.1?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. AUTHENTICATION: Require authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authentication required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Invalid authentication');
    }

    // 2. INPUT VALIDATION: Parse and validate request body
    const requestBody = await req.json();
    const { cartItems, customerEmail } = requestBody;

    // Validate cartItems structure
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('Cart items must be a non-empty array');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail || !emailRegex.test(customerEmail) || customerEmail.length > 255) {
      throw new Error('Invalid email address');
    }

    // 3. FETCH PRICES FROM DATABASE (don't trust client)
    const lineItems = [];
    for (const item of cartItems) {
      // Validate item structure
      if (!item.productId || typeof item.productId !== 'string') {
        throw new Error('Invalid product ID format');
      }
      if (!item.rentalDays || typeof item.rentalDays !== 'number' || item.rentalDays < 1 || item.rentalDays > 365) {
        throw new Error('Rental days must be between 1 and 365');
      }

      // Fetch product from database to get actual price
      const { data: product, error: productError } = await supabase
        .from('productos')
        .select('id, nombre, precio_diario, imagenes, deposito')
        .eq('id', item.productId)
        .single();

      if (productError || !product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      // Use server-side price, not client-provided price
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: product.nombre,
            description: `Alquiler por ${item.rentalDays} días`,
            images: product.imagenes ? [product.imagenes[0]] : []
          },
          unit_amount: Math.round(product.precio_diario * 100), // Server price only
          tax_behavior: "exclusive",
        },
        quantity: item.rentalDays
      });
    }

    // 4. Initialize Stripe and create checkout session
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2022-11-15",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cart`,
      customer_email: customerEmail,
      metadata: {
        user_id: user.id,
        cart_items: JSON.stringify(cartItems.map(item => ({
          productId: item.productId,
          rentalDays: item.rentalDays
        })))
      }
    });

    console.log(`Checkout session created for user ${user.id}: ${session.id}`);

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Create checkout error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: error.message?.includes('Authentication') || error.message?.includes('Invalid') ? 401 : 400
      }
    );
  }
});