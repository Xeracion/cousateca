-- Update Taladro product to Herramientas category
UPDATE productos 
SET categoria_id = '8fcc261a-3492-43ee-9609-9aee68216a76',
    updated_at = now()
WHERE nombre = 'Taladro';