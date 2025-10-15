-- ============================================
-- SECURITY FIX: Proper User Roles Architecture
-- ============================================

-- 1. Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create user_roles table (roles stored separately, not in perfiles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- 3. Create SECURITY DEFINER function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Update is_admin_user function to use user_roles table
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- ============================================
-- MIGRATE EXISTING ADMIN USERS BEFORE DROPPING COLUMN
-- ============================================

-- 5. Migrate existing admin users from perfiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM public.perfiles
WHERE role = 'admin'
ON CONFLICT (user_id, role) DO NOTHING;

-- Set all other users to 'user' role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user'::app_role
FROM public.perfiles
WHERE id NOT IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- CLEAN UP PRODUCTOS POLICIES (Drop policies that depend on perfiles.role)
-- ============================================

-- 6. Drop ALL existing productos policies
DROP POLICY IF EXISTS "Admins can delete products" ON public.productos;
DROP POLICY IF EXISTS "Admins can insert products" ON public.productos;
DROP POLICY IF EXISTS "Admins can update products" ON public.productos;
DROP POLICY IF EXISTS "Admins can view all products" ON public.productos;
DROP POLICY IF EXISTS "Allow public read access to products" ON public.productos;
DROP POLICY IF EXISTS "Anyone can view available products" ON public.productos;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.productos;
DROP POLICY IF EXISTS "Los administradores pueden actualizar productos" ON public.productos;
DROP POLICY IF EXISTS "Los administradores pueden eliminar productos" ON public.productos;
DROP POLICY IF EXISTS "Productos visible por todos" ON public.productos;
DROP POLICY IF EXISTS "Solo administradores pueden actualizar productos" ON public.productos;
DROP POLICY IF EXISTS "Solo administradores pueden eliminar productos" ON public.productos;
DROP POLICY IF EXISTS "Solo administradores pueden insertar productos" ON public.productos;
DROP POLICY IF EXISTS "Todos pueden ver productos" ON public.productos;

-- ============================================
-- CLEAN UP CATEGORIES POLICIES (Drop policies that depend on perfiles.role)
-- ============================================

-- 7. Drop ALL existing categories policies
DROP POLICY IF EXISTS "Allow admins to delete categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admins to select categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admins to update categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public to view categories" ON public.categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.categories;

-- ============================================
-- FIX PERFILES TABLE
-- ============================================

-- 8. Drop old perfiles policies
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.perfiles;
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.perfiles;

-- 9. NOW we can safely drop the role column
ALTER TABLE public.perfiles DROP COLUMN IF EXISTS role;

-- 10. Create new restrictive perfiles policies
CREATE POLICY "users_view_own_profile"
ON public.perfiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile_data"
ON public.perfiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "users_insert_own_profile"
ON public.perfiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- CREATE NEW PRODUCTOS POLICIES
-- ============================================

-- 11. Public can view available products
CREATE POLICY "public_view_available_products"
ON public.productos FOR SELECT
USING (disponible = true);

-- Admins can view all products
CREATE POLICY "admins_view_all_products"
ON public.productos FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can modify products (INSERT, UPDATE, DELETE)
CREATE POLICY "admins_modify_products"
ON public.productos FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- CREATE NEW CATEGORIES POLICIES
-- ============================================

-- 12. Public can view categories
CREATE POLICY "public_view_categories"
ON public.categories FOR SELECT
USING (true);

-- Admins can modify categories
CREATE POLICY "admins_modify_categories"
ON public.categories FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- SET SEARCH PATH ON EXISTING FUNCTIONS
-- ============================================

-- 13. Fix existing functions to have proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_item_state_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF OLD.estado_id IS DISTINCT FROM NEW.estado_id THEN
        INSERT INTO public.item_state_history (
            item_id,
            estado_anterior_id,
            estado_nuevo_id,
            usuario_id,
            notas
        ) VALUES (
            NEW.id,
            OLD.estado_id,
            NEW.estado_id,
            current_setting('request.jwt.claims', true)::json->>'sub',
            'Cambio automático de estado'
        );
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_item_availability(p_item_id UUID, p_fecha_inicio TIMESTAMP WITH TIME ZONE, p_fecha_fin TIMESTAMP WITH TIME ZONE)
RETURNS BOOLEAN
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    is_available BOOLEAN;
BEGIN
    SELECT disponible INTO is_available FROM public.items WHERE id = p_item_id;
    
    IF NOT FOUND OR NOT is_available THEN
        RETURN FALSE;
    END IF;
    
    RETURN NOT EXISTS (
        SELECT 1 FROM public.reservations
        WHERE item_id = p_item_id
        AND estado IN ('pendiente', 'activa')
        AND (
            (p_fecha_inicio >= fecha_inicio AND p_fecha_inicio < fecha_fin_prevista)
            OR (p_fecha_fin > fecha_inicio AND p_fecha_fin <= fecha_fin_prevista)
            OR (p_fecha_inicio <= fecha_inicio AND p_fecha_fin >= fecha_fin_prevista)
        )
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.update_item_availability()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF NEW.estado = 'activa' THEN
        UPDATE public.items SET disponible = FALSE WHERE id = NEW.item_id;
    ELSIF NEW.estado IN ('completada', 'cancelada') THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.reservations 
            WHERE item_id = NEW.item_id 
            AND estado = 'activa' 
            AND id != NEW.id
        ) THEN
            UPDATE public.items SET disponible = TRUE WHERE id = NEW.item_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;