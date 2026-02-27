
-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL,
  nombre TEXT NOT NULL,
  comentario TEXT NOT NULL,
  valoracion INTEGER NOT NULL CHECK (valoracion >= 1 AND valoracion <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
CREATE POLICY "public_view_reviews" ON public.reviews
  FOR SELECT USING (true);

-- Authenticated users can create reviews
CREATE POLICY "users_create_reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Users can delete their own reviews
CREATE POLICY "users_delete_own_reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = usuario_id);

-- Create index for faster product lookups
CREATE INDEX idx_reviews_producto_id ON public.reviews(producto_id);
