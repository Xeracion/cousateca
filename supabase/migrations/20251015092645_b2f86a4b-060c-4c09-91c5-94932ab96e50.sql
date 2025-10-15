-- Insertar producto Tienda en la categoría Aire Libre
INSERT INTO public.productos (
  nombre,
  descripcion,
  descripcion_corta,
  categoria_id,
  precio_diario,
  deposito,
  disponible,
  destacado,
  imagenes
) VALUES (
  'Tienda',
  'Tienda de camping espaciosa y resistente, perfecta para tus aventuras al aire libre',
  'Tienda de camping para 4 personas',
  '4688951a-6979-4bc8-925c-85de45a88b2e',
  5.00,
  20.00,
  true,
  false,
  ARRAY['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800']
);