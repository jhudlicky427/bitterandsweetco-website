/*
  # Fix Security and Performance Issues

  ## Performance Improvements
  1. Add missing index on foreign key `order_items.menu_item_id`
  2. Optimize RLS policies to use `(select auth.uid())` instead of `auth.uid()`
  3. Remove unused indexes that add overhead

  ## Security Fixes
  1. Remove overly permissive RLS policies that use `true` conditions
  2. Consolidate duplicate permissive policies (keep only admin policies)
  3. Fix function search paths to be immutable

  ## Changes by Table

  ### order_items
  - Add index on menu_item_id foreign key
  - Remove unused index on order_id
  - Fix RLS policies for performance
  - Remove duplicate policies (keep admin versions only)

  ### orders
  - Remove unused indexes
  - Fix RLS policies for performance
  - Consolidate duplicate policies

  ### user_profiles
  - Fix RLS policies for performance

  ### locations
  - Remove overly permissive policies (keep admin-only)

  ### menu_items
  - Remove overly permissive policies (keep admin-only)

  ### contact_submissions
  - Keep public submission but add rate limiting considerations

  ### event_bookings
  - Keep public booking submission
  - Remove duplicate SELECT policy

  ### Functions
  - Fix search_path to be immutable
*/

-- ============================================================================
-- 1. ADD MISSING INDEXES
-- ============================================================================

-- Add index on order_items.menu_item_id foreign key
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON order_items(menu_item_id);

-- ============================================================================
-- 2. REMOVE UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS idx_orders_user_id;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_order_items_order_id;

-- ============================================================================
-- 3. FIX FUNCTION SEARCH PATHS
-- ============================================================================

-- Recreate is_admin function with secure search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$;

-- Recreate handle_new_user function with secure search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, is_admin)
  VALUES (new.id, new.email, false);
  RETURN new;
END;
$$;

-- Recreate update_order_total function with secure search_path
CREATE OR REPLACE FUNCTION public.update_order_total()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE orders
  SET total_amount = (
    SELECT COALESCE(SUM(price), 0)
    FROM order_items
    WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
  )
  WHERE id = COALESCE(NEW.order_id, OLD.order_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- ============================================================================
-- 4. FIX USER_PROFILES RLS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own email" ON user_profiles;

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can update own email"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- ============================================================================
-- 5. FIX ORDERS RLS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own pending orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;

CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own pending orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()) AND status = 'pending')
  WITH CHECK (user_id = (select auth.uid()) AND status = 'pending');

CREATE POLICY "Admins can manage all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- 6. FIX ORDER_ITEMS RLS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create items in own orders" ON order_items;
DROP POLICY IF EXISTS "Users can delete items from own pending orders" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;

CREATE POLICY "Users can view own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can create items in own orders"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = (select auth.uid())
      AND orders.status = 'pending'
    )
  );

CREATE POLICY "Users can delete items from own pending orders"
  ON order_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = (select auth.uid())
      AND orders.status = 'pending'
    )
  );

CREATE POLICY "Admins can manage all order items"
  ON order_items
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- 7. FIX LOCATIONS RLS POLICIES (Remove overly permissive policies)
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can delete locations" ON locations;
DROP POLICY IF EXISTS "Authenticated users can insert locations" ON locations;
DROP POLICY IF EXISTS "Authenticated users can update locations" ON locations;

-- Keep only admin policies and public read access

-- ============================================================================
-- 8. FIX MENU_ITEMS RLS POLICIES (Remove overly permissive policies)
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can delete menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can insert menu items" ON menu_items;
DROP POLICY IF EXISTS "Authenticated users can update menu items" ON menu_items;

-- Keep only admin policies and public read access

-- ============================================================================
-- 9. FIX EVENT_BOOKINGS POLICIES (Remove duplicate)
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view confirmed bookings" ON event_bookings;

-- Keep only admin read policy and public submission policy