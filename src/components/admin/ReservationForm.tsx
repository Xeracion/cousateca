
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

interface ReservationFormProps {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (values: any) => void;
  defaultValues?: any;
  isEdit?: boolean;
  // Props for use in ReservationsPanel
  reserva?: any;
  products?: any[];
  onSave?: () => void;
  onCancel?: () => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  open,
  onClose,
  onSubmit,
  defaultValues,
  isEdit = false,
  // New props
  reserva,
  products,
  onSave,
  onCancel
}) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: reserva || defaultValues || {
      usuario_id: "",
      producto_id: "",
      fecha_inicio: "",
      fecha_fin: "",
      precio_total: ""
    }
  });

  useEffect(() => {
    reset(reserva || defaultValues || {
      usuario_id: "",
      producto_id: "",
      fecha_inicio: "",
      fecha_fin: "",
      precio_total: ""
    });
  }, [reserva, defaultValues, open, reset]);

  const handleFormSubmit = (data: any) => {
    if (onSubmit) {
      onSubmit(data);
    } else if (onSave) {
      onSave();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (onCancel) {
      onCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? "Editar Reserva" : "Nueva Reserva"}</DialogTitle>
          </DialogHeader>
          <Input {...register("usuario_id")} placeholder="ID Usuario" required />
          <Input {...register("producto_id")} placeholder="ID Producto" required />
          <Input {...register("fecha_inicio")} placeholder="Fecha de inicio (YYYY-MM-DD)" required />
          <Input {...register("fecha_fin")} placeholder="Fecha de fin (YYYY-MM-DD)" required />
          <Input {...register("precio_total")} placeholder="Precio Total" required type="number" />
          <DialogFooter>
            <Button type="submit">{isEdit ? "Actualizar" : "Crear"}</Button>
            <Button variant="outline" type="button" onClick={handleClose}>
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationForm;
