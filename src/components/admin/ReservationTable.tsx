
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ReservationTableProps {
  reservas: any[];
  onEdit: (reserva: any) => void;
  onDelete: (reserva: any) => void;
}

const ReservationTable: React.FC<ReservationTableProps> = ({ reservas, onEdit, onDelete }) => (
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
        {reservas.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.usuario_id}</TableCell>
            <TableCell>{r.producto_id}</TableCell>
            <TableCell>{r.fecha_inicio?.slice(0, 10)}</TableCell>
            <TableCell>{r.fecha_fin?.slice(0, 10) || r.fecha_fin_prevista?.slice(0, 10)}</TableCell>
            <TableCell>{r.precio_total || "-"}</TableCell>
            <TableCell>{r.estado}</TableCell>
            <TableCell className="flex gap-2">
              <Button size="sm" onClick={() => onEdit(r)}>
                Editar
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(r)}>
                Eliminar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default ReservationTable;
