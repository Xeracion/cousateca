-- Aggiornare l'immagine del prodotto Taladro con la nuova immagine generata
UPDATE public.productos 
SET imagenes = ARRAY['/src/assets/products/taladro-drill.jpg']
WHERE id = '244ef652-e467-4732-a643-a20a60cec380';