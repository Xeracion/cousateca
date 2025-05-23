
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
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get tomorrow's date (for returns due tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    console.log(`Checking for returns due on ${tomorrowStr}`);

    // Find reservations that end tomorrow
    const { data: reservations, error } = await supabase
      .from("reservas")
      .select(`
        id, 
        fecha_fin, 
        usuario_id, 
        productos (nombre),
        users!reservas_usuario_id_fkey (email, nombre)
      `)
      .eq("estado", "activa")
      .like("fecha_fin", `${tomorrowStr}%`);
      
    if (error) throw error;
    
    console.log(`Found ${reservations?.length || 0} reservations due tomorrow`);
    
    // No reservations ending tomorrow
    if (!reservations || reservations.length === 0) {
      return new Response(
        JSON.stringify({ message: "No return reminders to send" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    // For each reservation, create a notification entry
    const notifications = reservations.map((reservation) => ({
      usuario_id: reservation.usuario_id,
      titulo: "Recordatorio de devolución",
      mensaje: `Recuerda devolver ${reservation.productos.nombre} mañana en Xeración. Tu período de alquiler finaliza el ${new Date(reservation.fecha_fin).toLocaleDateString('es-ES')}.`,
      leido: false,
      tipo: "recordatorio",
      reserva_id: reservation.id
    }));
    
    // Insert notifications into the notifications table
    const { error: notificationError } = await supabase
      .from("notifications")
      .insert(notifications);
      
    if (notificationError) throw notificationError;
    
    return new Response(
      JSON.stringify({
        message: `Sent ${notifications.length} return reminders successfully`,
        reminders: notifications,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-return-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
