import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user authentication
    const {
      data: { user },
      error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('Authentication error:', userError);
      throw new Error('No autenticado');
    }

    const { cartItems, customerEmail } = await req.json();

    console.log('Processing checkout for user:', user.id);
    console.log('Cart items:', JSON.stringify(cartItems, null, 2));

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // Validate cart items structure
    for (const item of cartItems) {
      if (!item.productId || !item.rentalDays || !item.startDate || !item.endDate) {
        console.error('Invalid item:', item);
        throw new Error('Formato de items del carrito inválido');
      }
    }

    // Fetch product prices from database
    const productIds = cartItems.map((item: any) => item.productId);
    const { data: products, error: productsError } = await supabaseClient
      .from('productos')
      .select('id, nombre, precio_diario, deposito')
      .in('id', productIds);

    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw new Error('Error al obtener información de productos');
    }

    if (!products || products.length === 0) {
      throw new Error('No se encontraron productos');
    }

    console.log('Products fetched:', products);

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of cartItems) {
      const product = products.find((p: any) => p.id === item.productId);
      if (!product) {
        throw new Error(`Producto no encontrado: ${item.productId}`);
      }

      // Add rental price line item
      const rentalAmount = Math.round(Number(product.precio_diario) * item.rentalDays * 100);
      console.log(`Adding rental for ${product.nombre}: ${rentalAmount} cents`);
      
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${product.nombre} - Alquiler`,
            description: `${item.rentalDays} días de alquiler`,
          },
          unit_amount: rentalAmount,
        },
        quantity: 1,
      });

      // Add deposit line item if deposit exists
      if (product.deposito && Number(product.deposito) > 0) {
        const depositAmount = Math.round(Number(product.deposito) * 100);
        console.log(`Adding deposit for ${product.nombre}: ${depositAmount} cents`);
        
        lineItems.push({
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${product.nombre} - Fianza`,
              description: 'Depósito de seguridad (reembolsable)',
            },
            unit_amount: depositAmount,
          },
          quantity: 1,
        });
      }
    }

    console.log('Total line items:', lineItems.length);

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cart`,
      customer_email: customerEmail,
      metadata: {
        userId: user.id,
        cartItems: JSON.stringify(cartItems),
      },
    });

    console.log('Stripe session created:', session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in create-checkout function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
