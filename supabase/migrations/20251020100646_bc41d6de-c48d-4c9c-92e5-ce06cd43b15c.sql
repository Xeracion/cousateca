-- Eliminar políticas RLS existentes del bucket Imagenes
DROP POLICY IF EXISTS "Admin users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admin users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;

-- Crear nuevas políticas RLS más simples y efectivas
-- Política para que usuarios autenticados admin puedan subir imágenes
CREATE POLICY "Admins can upload to Imagenes bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'Imagenes' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Política para que usuarios autenticados admin puedan actualizar imágenes
CREATE POLICY "Admins can update Imagenes bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'Imagenes'
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
)
WITH CHECK (
  bucket_id = 'Imagenes'
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Política para que usuarios autenticados admin puedan eliminar imágenes
CREATE POLICY "Admins can delete from Imagenes bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'Imagenes'
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Política para que todos puedan ver las imágenes (bucket público)
CREATE POLICY "Anyone can view Imagenes bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'Imagenes');