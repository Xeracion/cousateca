
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CartItem } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
}

const OrderSummary = ({ items, totalPrice }: OrderSummaryProps) => {
  const [loading, setLoading] = useState(false);
  
  // Calculate total deposit amount
  const totalDeposit = items.reduce((sum, item) => {
    const deposit = Number(item.product.deposit) || 0;
    return sum + deposit;
  }, 0);
  
  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let email = user?.email;
      
      if (!email) {
        email = "guest@example.com";
      }
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          cartItems: items,
          customerEmail: email
        }
      });
      
      if (error) throw error;
      
      window.location.href = data.url;
      
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Hubo un problema al procesar tu pago. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="sticky top-20">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
        
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.product.id} className="space-y-1 pb-3 border-b last:border-0">
              <div className="flex justify-between">
                <span className="font-medium">{item.product.name}</span>
                <span className="font-semibold">
                  {formatCurrency(item.product.dailyPrice * item.rentalDays)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatCurrency(item.product.dailyPrice || 0)} × {item.rentalDays} días</span>
                <span>Fianza: {formatCurrency(item.product.deposit || 0)}</span>
              </div>
            </div>
          ))}
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <div className="flex justify-between font-medium">
              <span>Subtotal alquileres</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total fianzas</span>
              <span>{formatCurrency(totalDeposit)}</span>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between font-bold text-lg mb-6">
          <span>Total</span>
          <span>{formatCurrency(totalPrice + totalDeposit)}</span>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            La fianza es un depósito de seguridad que se cobra junto con el alquiler.
          </p>
        </div>
        
        <Button 
          className="w-full bg-rental-500 hover:bg-rental-600 mb-3"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            "Proceder al Pago"
          )}
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          Al continuar, aceptas nuestros 
          <Link to="/terms" className="text-rental-500 hover:underline mx-1">
            Términos de Servicio
          </Link>
          y
          <Link to="/privacy" className="text-rental-500 hover:underline mx-1">
            Política de Privacidad
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
