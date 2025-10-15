-- Aggiornare l'immagine del prodotto Taladro con il path corretto in public
UPDATE public.productos 
SET imagenes = ARRAY['/products/taladro-drill.jpg']
WHERE id = '244ef652-e467-4732-a643-a20a60cec380';