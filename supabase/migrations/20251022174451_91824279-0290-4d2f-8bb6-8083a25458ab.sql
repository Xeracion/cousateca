-- Añadir campo email a la tabla perfiles
ALTER TABLE public.perfiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Actualizar el trigger para copiar el email al crear el perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.perfiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Poblar emails existentes desde auth.users
UPDATE public.perfiles p
SET email = au.email
FROM auth.users au
WHERE p.id = au.id AND p.email IS NULL;