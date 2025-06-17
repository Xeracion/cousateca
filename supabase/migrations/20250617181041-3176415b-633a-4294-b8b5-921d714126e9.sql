
-- Habilitar RLS en la tabla productos si no está habilitado
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- Política para que cualquiera pueda ver productos disponibles (público)
CREATE POLICY "Anyone can view available products" 
ON public.productos 
FOR SELECT 
USING (disponible = true);

-- Función de seguridad para verificar si el usuario es admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Políticas para administradores (todas las operaciones CRUD)
CREATE POLICY "Admins can view all products" 
ON public.productos 
FOR SELECT 
TO authenticated
USING (public.is_admin_user());

CREATE POLICY "Admins can insert products" 
ON public.productos 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can update products" 
ON public.productos 
FOR UPDATE 
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can delete products" 
ON public.productos 
FOR DELETE 
TO authenticated
USING (public.is_admin_user());

-- Habilitar realtime para la tabla productos
ALTER TABLE public.productos REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.productos;
