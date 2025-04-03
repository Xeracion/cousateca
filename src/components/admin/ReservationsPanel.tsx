
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ReservationsPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Reservas</CardTitle>
        <CardDescription>
          Administra todas las reservas de los clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center py-6 text-gray-500">
          Funcionalidad de gestión de reservas en desarrollo
        </p>
      </CardContent>
    </Card>
  );
};

export default ReservationsPanel;
