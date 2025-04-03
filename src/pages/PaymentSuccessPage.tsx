
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [orderNumber, setOrderNumber] = useState("");
  
  useEffect(() => {
    // Clear the cart after successful payment
    clearCart();
    
    // Generate a random order number for display
    const randomOrderNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
    setOrderNumber(randomOrderNumber);
    
    // In a real implementation, you would verify the session with Stripe
    // and retrieve the order details from your database
  }, [clearCart]);

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
                Tu reserva ha sido procesada correctamente. Te hemos enviado un correo electrónico con los detalles.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <p className="text-sm text-gray-500 mb-1">Número de Orden</p>
                <p className="font-mono text-lg font-medium">{orderNumber}</p>
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
