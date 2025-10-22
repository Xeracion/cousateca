-- Insertar nuevos productos con precio de 5€ y sin depósito

INSERT INTO public.productos (nombre, descripcion, descripcion_corta, precio_diario, deposito, categoria_id, imagenes, disponible, destacado) 
VALUES 
(
  'Red de Voleibol', 
  'Red de voleibol profesional de alta calidad con postes ajustables y sistema de tensión. Ideal para partidos de playa o cancha interior. Incluye bolsa de transporte y anclajes.', 
  'Red profesional para voleibol de playa o interior', 
  5, 
  0, 
  '3c6a613e-3ebb-4a1c-b801-35256508feee', 
  ARRAY['https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1740&auto=format&fit=crop', 'https://images.unsplash.com/photo-1593786481097-7d1136e48f96?q=80&w=1740&auto=format&fit=crop'], 
  true, 
  false
),
(
  'Nivel de Burbuja', 
  'Nivel de burbuja de precisión profesional con marco de aluminio resistente. Múltiples burbujas para mediciones horizontales, verticales y en ángulo de 45 grados. Herramienta esencial para trabajos de construcción y bricolaje.', 
  'Nivel de precisión profesional para construcción', 
  5, 
  0, 
  '8fcc261a-3492-43ee-9609-9aee68216a76', 
  ARRAY['https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1740&auto=format&fit=crop', 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=1740&auto=format&fit=crop'], 
  true, 
  false
),
(
  'Proyector de Vídeo', 
  'Proyector de alta definición con 3000 lúmenes, resolución Full HD 1080p, conectividad HDMI y USB. Perfecto para presentaciones, eventos corporativos o proyecciones de cine. Incluye pantalla portátil y cables.', 
  'Proyector Full HD para eventos y presentaciones', 
  5, 
  0, 
  '0882c004-b0bf-47aa-a4ee-3443a6bd5df0', 
  ARRAY['https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1740&auto=format&fit=crop', 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=1740&auto=format&fit=crop'], 
  true, 
  false
);