
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ReservationTable from './ReservationTable';
import ReservationForm from './ReservationForm';
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ReservationsPanel = () => {
  const { toast } = useToast();
  const [reservas, setReservas] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  // Cargar reservas y productos
  const loadData = async () => {
    setLoading(true);
    try {
      // Cargar productos
      const { data: productsData, error: productsError } = await supabase
        .from('productos')
        .select('id, nombre');
      
      if (productsError) throw productsError;
      setProducts(productsData || []);
      
      // Cargar reservas con información de productos y perfiles (email)
      const { data: reservasData, error: reservasError } = await supabase
        .from('reservas')
        .select(`
          *,
          producto:productos!inner(id, nombre),
          perfil:perfiles!inner(id, email:id)
        `)
        .order('fecha_inicio', { ascending: false });
      
      if (reservasError) throw reservasError;
      setReservas(reservasData || []);
    } catch (error: any) {
      console.error('Error cargando datos:', error);
      toast({
        title: "Error",
        description: `No se pudieron cargar los datos: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Manejar la actualización de estado de reserva
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      // Obtener la reserva para saber el producto_id
      const reserva = reservas.find(r => r.id === id);
      
      const { error } = await supabase
        .from('reservas')
        .update({ estado: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      // Si la reserva se confirma, ocultar el producto
      if (newStatus === 'confirmado' && reserva?.producto_id) {
        const { error: productError } = await supabase
          .from('productos')
          .update({ disponible: false })
          .eq('id', reserva.producto_id);
        
        if (productError) {
          console.error('Error ocultando producto:', productError);
        }
      }
      
      toast({
        title: "Estado actualizado",
        description: newStatus === 'confirmado' 
          ? "La reserva ha sido confirmada y el producto se ha ocultado de la vista pública"
          : `La reserva ha sido actualizada a: ${newStatus}`
      });
      
      // Recargar datos
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: `No se pudo actualizar el estado: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  // Manejar la eliminación de reserva
  const handleDeleteReservation = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta reserva?")) {
      try {
        const { error } = await supabase
          .from('reservas')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "Reserva eliminada",
          description: "La reserva ha sido eliminada correctamente"
        });
        
        loadData();
      } catch (error: any) {
        toast({
          title: "Error",
          description: `No se pudo eliminar la reserva: ${error.message}`,
          variant: "destructive"
        });
      }
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    loadData();
    
    // Configurar suscripción en tiempo real
    const channel = supabase
      .channel('realtime-reservas')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'reservas' 
        },
        (payload) => {
          console.log('Cambio en reservas detectado:', payload);
          loadData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Reservas</CardTitle>
          <CardDescription>
            Visualiza y gestiona todas las reservas de productos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReservationTable 
            reservas={reservas} 
            loading={loading} 
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteReservation}
            onEdit={(reservation) => {
              setSelectedReservation(reservation);
              setIsReservationDialogOpen(true);
            }}
          />
        </CardContent>
      </Card>
      
      <Dialog 
        open={isReservationDialogOpen} 
        onOpenChange={setIsReservationDialogOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <ReservationForm 
            reserva={selectedReservation}
            products={products}
            onSave={() => {
              setIsReservationDialogOpen(false);
              loadData();
            }}
            onCancel={() => setIsReservationDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReservationsPanel;
