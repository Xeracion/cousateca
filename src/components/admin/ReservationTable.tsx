
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ReservationTableProps {
  reservas: any[];
  loading?: boolean;
  onEdit: (reserva: any) => void;
  onDelete: (reserva: any) => void;
  onUpdateStatus?: (id: string, newStatus: string) => Promise<void>;
}

const ReservationTable: React.FC<ReservationTableProps> = ({ 
  reservas, 
  loading = false,
  onEdit, 
  onDelete,
  onUpdateStatus 
}) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead>Producto</TableHead>
          <TableHead>Fecha Inicio</TableHead>
          <TableHead>Fecha Fin</TableHead>
          <TableHead>Precio Total</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">Cargando...</TableCell>
          </TableRow>
        ) : reservas.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">No hay reservas disponibles</TableCell>
          </TableRow>
        ) : (
          reservas.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.perfil?.email || r.usuario_id}</TableCell>
              <TableCell>{r.producto?.nombre || r.producto_id}</TableCell>
              <TableCell>{r.fecha_inicio?.slice(0, 10)}</TableCell>
              <TableCell>{r.fecha_fin?.slice(0, 10) || r.fecha_fin_prevista?.slice(0, 10)}</TableCell>
              <TableCell>{r.precio_total || "-"}</TableCell>
              <TableCell>{r.estado}</TableCell>
              <TableCell className="flex gap-2">
                {onUpdateStatus && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onUpdateStatus(r.id, r.estado === 'pendiente' ? 'confirmado' : 'pendiente')}
                  >
                    {r.estado === 'pendiente' ? 'Confirmar' : 'Pendiente'}
                  </Button>
                )}
                <Button size="sm" onClick={() => onEdit(r)}>
                  Editar
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(r.id)}>
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

export default ReservationTable;
