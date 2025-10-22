import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reservationCount, setReservationCount] = useState(0);
  
  useEffect(() => {
    const verifyPayment = async () => {
      const session_id = searchParams.get("session_id");
      
      if (!session_id) {
        setError("No se encontró información de la sesión de pago");
        setLoading(false);
        return;
      }

      setSessionId(session_id);
      
      // Clear the cart
      clearCart();
      
      // Retry logic: try to verify reservations multiple times
      const maxRetries = 3;
      const delayBetweenRetries = 3000; // 3 seconds
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        // Wait before checking (5 seconds on first attempt, 3 seconds on retries)
        await new Promise(resolve => setTimeout(resolve, attempt === 1 ? 5000 : delayBetweenRetries));
        
        try {
          const { data: reservations, error: reservationsError } = await supabase
            .from('reservas')
            .select('*')
            .eq('stripe_session_id', session_id);

          if (reservationsError) {
            console.error('Error verifying reservations:', reservationsError);
            if (attempt === maxRetries) {
              toast.error('Hubo un problema al verificar tu reserva. Por favor, contacta con soporte.');
            }
          } else if (reservations && reservations.length > 0) {
            setReservationCount(reservations.length);
            toast.success(`${reservations.length} reserva(s) creada(s) exitosamente`);
            setLoading(false);
            return; // Exit successfully
          } else if (attempt < maxRetries) {
            console.log(`Attempt ${attempt}: No reservations found yet, retrying...`);
          }
        } catch (err) {
          console.error('Error:', err);
          if (attempt === maxRetries) {
            toast.error('Error al verificar tu reserva. Por favor, verifica tus reservas en tu perfil.');
          }
        }
      }
      
      // If we get here, all retries failed but payment was successful
      toast.info('Tu pago se completó correctamente. Las reservas pueden tardar unos minutos en aparecer.');
      setLoading(false);
    };

    verifyPayment();
  }, [clearCart, searchParams]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-10">
          <div className="container mx-auto px-4">
            <Card className="max-w-lg mx-auto">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <Loader2 className="h-16 w-16 text-rental-500 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Verificando tu pago...</h1>
                <p className="text-gray-600">Por favor espera mientras confirmamos tu reserva</p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-10">
          <div className="container mx-auto px-4">
            <Card className="max-w-lg mx-auto">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <AlertCircle className="h-16 w-16 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Error</h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link to="/">
                  <Button className="w-full bg-rental-500 hover:bg-rental-600">Volver al Inicio</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              
              <h1 className="text-2xl font-bold mb-2">¡Pago Completado!</h1>
              <p className="text-gray-600 mb-6">
                Tu pago ha sido procesado correctamente. {reservationCount > 0 ? `Se han creado ${reservationCount} reserva(s).` : ''} Te hemos enviado un correo electrónico con los detalles.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <p className="text-sm text-gray-500 mb-1">ID de Sesión</p>
                <p className="font-mono text-sm break-all">{sessionId}</p>
              </div>
              
              <div className="space-y-4">
                <Link to="/profile">
                  <Button className="w-full bg-rental-500 hover:bg-rental-600">
                    Ver Mis Reservas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Volver a la Página Principal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
