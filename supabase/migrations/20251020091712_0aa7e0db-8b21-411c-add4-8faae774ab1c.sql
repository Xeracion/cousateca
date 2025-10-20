-- Políticas RLS para el bucket de imágenes "Imagenes"

-- Política para lectura pública de imágenes
CREATE POLICY "public_view_images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'Imagenes');

-- Política para que los administradores puedan subir imágenes
CREATE POLICY "admins_upload_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'Imagenes' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- Política para que los administradores puedan actualizar imágenes
CREATE POLICY "admins_update_images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'Imagenes' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- Política para que los administradores puedan eliminar imágenes
CREATE POLICY "admins_delete_images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'Imagenes' 
  AND public.has_role(auth.uid(), 'admin'::app_role)
);