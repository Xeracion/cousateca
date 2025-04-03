
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface PaymentFormProps {
  productId: string;
  productName: string;
  rentDays: number;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  deposit: number;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  productId,
  productName,
  rentDays,
  startDate,
  endDate,
  totalPrice,
  deposit,
  onCancel
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Verificar si el usuario está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Inicia sesión",
          description: "Debes iniciar sesión para continuar con la reserva",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      
      // Crear la reserva en la base de datos
      const { data: reserva, error: reservaError } = await supabase
        .from('reservas')
        .insert([
          {
            usuario_id: user.id,
            producto_id: productId,
            fecha_inicio: startDate.toISOString(),
            fecha_fin: endDate.toISOString(),
            precio_total: totalPrice,
            estado: 'pendiente'
          }
        ])
        .select()
        .single();
      
      if (reservaError) throw reservaError;
      
      // Crear sesión de pago con Stripe
      // Nota: Esto es un placeholder ya que realmente necesitaríamos una Edge Function
      // para crear la sesión de Stripe de forma segura en el backend
      toast({
        title: "Implementación de Stripe",
        description: "Aquí se integraría la redirección a Stripe para el pago",
      });
      
      // Simulamos un pago exitoso para demostración
      setTimeout(() => {
        toast({
          title: "Reserva confirmada",
          description: "Tu reserva ha sido registrada correctamente",
        });
        navigate("/profile");
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Error en el proceso de pago",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Confirmar Reserva</CardTitle>
        <CardDescription>
          Por favor revisa los detalles antes de proceder al pago
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">{productName}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Fecha de inicio</p>
              <p className="font-medium">{startDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Fecha de fin</p>
              <p className="font-medium">{endDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Duración</p>
              <p className="font-medium">{rentDays} días</p>
            </div>
            <div>
              <p className="text-gray-500">Depósito</p>
              <p className="font-medium">${deposit.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between font-medium mb-2">
            <span>Subtotal</span>
            <span>${(totalPrice - deposit).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium mb-2">
            <span>Depósito (reembolsable)</span>
            <span>${deposit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
            <span>Total a pagar</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-3 rounded-md text-sm text-yellow-800">
          <p className="font-medium mb-1">Información importante:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>El depósito es reembolsable si el producto se devuelve en buen estado.</li>
            <li>Puedes cancelar la reserva hasta 24 horas antes de la fecha de inicio.</li>
            <li>Necesitarás mostrar identificación al recoger el producto.</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          className="w-full sm:w-auto bg-rental-500 hover:bg-rental-600"
          onClick={handlePayment}
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
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
