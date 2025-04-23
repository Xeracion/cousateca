
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReservationForm from "./ReservationForm";
import ReservationTable from "./ReservationTable";

type ReservaRow = {
  id: string;
  usuario_id: string;
  producto_id: string;
  fecha_inicio: string;
  fecha_fin?: string;
  fecha_fin_prevista?: string;
  precio_total?: number;
  estado: string;
};

const ReservationsPanel: React.FC = () => {
  const { toast } = useToast();
  const [reservas, setReservas] = useState<ReservaRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editReserva, setEditReserva] = useState<ReservaRow | null>(null);

  const fetchReservas = async () => {
    setLoading(true);
    // Se busca tanto de 'reservas' como de 'reservations'
    const { data: data1 } = await supabase.from("reservas").select("*").order("created_at", { ascending: false });
    const { data: data2 } = await supabase.from("reservations").select("*").order("created_at", { ascending: false });
    // Unifica ambas si existen ambas tablas
    let all = [];
    if (Array.isArray(data1)) all = all.concat(data1);
    if (Array.isArray(data2)) all = all.concat(data2);
    setReservas(all);
    setLoading(false);
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  // Crear o editar reserva
  const handleFormSubmit = async (values: any) => {
    let result;
    const table = editReserva
      ? reservas.some((r) => r.id === editReserva.id && r.fecha_inicio && r.fecha_fin)
        ? "reservas"
        : "reservations"
      : values.fecha_fin
        ? "reservas"
        : "reservations";

    if (editReserva) {
      // Actualización
      const { error } = await supabase.from(table).update(values).eq("id", editReserva.id);
      if (error) {
        toast({
          title: "Error",
          description: "No se pudo actualizar la reserva",
          variant: "destructive"
        });
      } else {
        toast({ title: "Reserva actualizada" });
        setModalOpen(false);
        setEditReserva(null);
        fetchReservas();
      }
    } else {
      // Creación
      const { error } = await supabase.from(table).insert([values]);
      if (error) {
        toast({
          title: "Error",
          description: "No se pudo crear la reserva",
          variant: "destructive"
        });
      } else {
        toast({ title: "Reserva creada" });
        setModalOpen(false);
        fetchReservas();
      }
    }
  };

  // Eliminar reserva
  const handleDelete = async (reserva: ReservaRow) => {
    const table = reserva.fecha_fin ? "reservas" : "reservations";
    const { error } = await supabase.from(table).delete().eq("id", reserva.id);
    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la reserva",
        variant: "destructive"
      });
    } else {
      toast({ title: "Reserva eliminada" });
      fetchReservas();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Reservas</CardTitle>
        <CardDescription>Administra todas las reservas de los clientes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-end">
          <Button onClick={() => { setEditReserva(null); setModalOpen(true); }}>
            Añadir Reserva
          </Button>
        </div>
        {loading ? (
          <p className="text-center py-6 text-gray-500">Cargando reservas...</p>
        ) : (
          <ReservationTable
            reservas={reservas}
            onEdit={(r) => { setEditReserva(r); setModalOpen(true); }}
            onDelete={handleDelete}
          />
        )}

        <ReservationForm
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditReserva(null); }}
          onSubmit={handleFormSubmit}
          defaultValues={editReserva || undefined}
          isEdit={Boolean(editReserva)}
        />
      </CardContent>
    </Card>
  );
};

export default ReservationsPanel;
