-- Crear una política que permita a los usuarios ver productos en sus propias reservas
-- Esto permite que los usuarios vean productos aunque estén marcados como no disponibles,
-- siempre y cuando tengan una reserva activa de ese producto
CREATE POLICY "users_view_own_reserved_products"
ON public.productos
FOR SELECT
USING (
  -- Permitir ver productos que el usuario ha reservado
  EXISTS (
    SELECT 1 FROM public.reservas
    WHERE reservas.producto_id = productos.id
    AND reservas.usuario_id = auth.uid()
  )
);