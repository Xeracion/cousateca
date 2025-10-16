-- ✅ Asegurar que usuarios anónimos puedan ver productos disponibles
DROP POLICY IF EXISTS "public_view_available_products" ON public.productos;

CREATE POLICY "public_view_available_products" 
ON public.productos
FOR SELECT
TO anon, authenticated
USING (disponible = true);

-- ✅ Crear vista limpia para el catálogo público
CREATE OR REPLACE VIEW public.v_catalogo_productos AS
SELECT 
  id,
  nombre,
  descripcion,
  descripcion_corta,
  precio_diario,
  deposito,
  imagenes,
  categoria_id,
  valoracion,
  num_valoraciones,
  destacado,
  created_at
FROM public.productos
WHERE disponible = true;

-- ✅ Permitir lectura pública de la vista
GRANT SELECT ON public.v_catalogo_productos TO anon, authenticated;

-- ✅ Asegurar que categorías también sean públicamente visibles (ya existe pero confirmamos)
DROP POLICY IF EXISTS "public_view_categories" ON public.categories;

CREATE POLICY "public_view_categories" 
ON public.categories
FOR SELECT
TO anon, authenticated
USING (true);