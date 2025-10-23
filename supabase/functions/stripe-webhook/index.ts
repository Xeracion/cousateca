import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature');

  if (!signature) {
    console.error('No Stripe signature header found');
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    console.log('Webhook secret configured:', webhookSecret.substring(0, 10) + '...');
    console.log('Signature header:', signature.substring(0, 20) + '...');

    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    console.log('✅ Webhook signature verified successfully');
    console.log('Received webhook event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('Processing completed checkout session:', session.id);

      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const userId = session.metadata?.userId;
      const cartItemsStr = session.metadata?.cartItems;

      if (!userId || !cartItemsStr) {
        console.error('Missing metadata in session');
        return new Response('Missing metadata', { status: 400 });
      }

      const cartItems = JSON.parse(cartItemsStr);

      // Create reservations for each cart item
      for (const item of cartItems) {
        const { data: product, error: productError } = await supabaseClient
          .from('productos')
          .select('precio_diario, deposito')
          .eq('id', item.productId)
          .single();

        if (productError) {
          console.error('Error fetching product:', productError);
          continue;
        }

        const totalPrice = Number(product.precio_diario) * item.rentalDays + Number(product.deposito || 0);

        const { data: reservationData, error: reservationError } = await supabaseClient
          .from('reservas')
          .insert({
            usuario_id: userId,
            producto_id: item.productId,
            fecha_inicio: item.startDate,
            fecha_fin: item.endDate,
            precio_total: totalPrice,
            stripe_session_id: session.id,
            estado: 'confirmado'
          })
          .select();

        if (reservationError) {
          console.error('❌ Error creating reservation:', reservationError);
        } else {
          console.log('✅ Reservation created successfully:', {
            reservationId: reservationData?.[0]?.id,
            productId: item.productId,
            userId: userId,
            sessionId: session.id
          });

          // Hide product from public catalog
          const { error: productUpdateError } = await supabaseClient
            .from('productos')
            .update({ disponible: false })
            .eq('id', item.productId);

          if (productUpdateError) {
            console.error('❌ Error hiding product from catalog:', productUpdateError);
          } else {
            console.log('✅ Product hidden from catalog:', item.productId);
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
