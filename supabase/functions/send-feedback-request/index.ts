
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    // AUTHENTICATION: Require service role key for cron-triggered functions
    const authHeader = req.headers.get('Authorization');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!authHeader || !authHeader.includes(serviceRoleKey || '')) {
      console.error('Unauthorized access attempt to send-feedback-request');
      throw new Error('Unauthorized - Service role required');
    }

    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Processing feedback request notifications...');

    // Get today's date
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    console.log(`Checking for rentals that ended on ${todayStr}`);

    // Find reservations that ended today (fixed query - removed invalid users join)
    const { data: completedReservations, error } = await supabase
      .from("reservas")
      .select(`
        id, 
        usuario_id, 
        productos (nombre)
      `)
      .eq("estado", "completada")
      .like("fecha_fin", `${todayStr}%`);
      
    if (error) throw error;
    
    console.log(`Found ${completedReservations?.length || 0} completed reservations today`);
    
    // No reservations completed today
    if (!completedReservations || completedReservations.length === 0) {
      return new Response(
        JSON.stringify({ message: "No feedback requests to send" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    // For each completed reservation, create a feedback notification
    const notifications = completedReservations.map((reservation) => ({
      usuario_id: reservation.usuario_id,
      titulo: "¡Cuéntanos que tal ha sido tu experiencia con Cousateca!",
      mensaje: `Gracias por alquilar ${reservation.productos.nombre}. Nos encantaría conocer tu opinión. ¿Qué te ha parecido la experiencia? Tu feedback nos ayuda a mejorar.`,
      leido: false,
      tipo: "feedback",
      reserva_id: reservation.id
    }));
    
    // Insert notifications into the notifications table
    const { error: notificationError } = await supabase
      .from("notifications")
      .insert(notifications);
      
    if (notificationError) throw notificationError;
    
    return new Response(
      JSON.stringify({
        message: `Sent ${notifications.length} feedback requests successfully`,
        feedbackRequests: notifications,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-feedback-request function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: error.message?.includes('Unauthorized') ? 401 : 500,
      }
    );
  }
});
