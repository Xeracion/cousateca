-- ✅ Configurar la vista para usar permisos del usuario que la ejecuta (más seguro)
ALTER VIEW public.v_catalogo_productos SET (security_invoker = on);