/*
  # Create Favorites System

  1. New Tables
    - `favorites`
      - `id` (uuid, primary key) - Unique identifier for the favorite
      - `user_id` (uuid, foreign key to auth.users) - User who created the favorite
      - `menu_item_id` (uuid, foreign key to menu_items) - The base menu item
      - `name` (text) - Custom name for this favorite (e.g., "My Usual", "Morning Pick-Me-Up")
      - `size` (text) - Selected size
      - `ice_level` (text) - Ice level preference
      - `sweetener` (text) - Sweetener preference
      - `toppings` (jsonb) - Array of selected topping IDs
      - `syrups` (jsonb) - Array of selected syrup IDs
      - `candy_straws` (jsonb) - Array of selected candy straw IDs
      - `created_at` (timestamptz) - When favorite was created

  2. Security
    - Enable RLS on `favorites` table
    - Users can only view their own favorites
    - Users can only create favorites for themselves
    - Users can only update their own favorites
    - Users can only delete their own favorites
    - Admins can view all favorites

  3. Notes
    - Stores complete drink customization for easy reordering
    - Each user can have multiple favorites
    - Customization options stored as JSONB for flexibility
*/

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  menu_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  name text NOT NULL,
  size text NOT NULL,
  ice_level text NOT NULL DEFAULT 'regular',
  sweetener text NOT NULL DEFAULT 'regular',
  toppings jsonb DEFAULT '[]'::jsonb,
  syrups jsonb DEFAULT '[]'::jsonb,
  candy_straws jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can create their own favorites
CREATE POLICY "Users can create own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own favorites
CREATE POLICY "Users can update own favorites"
  ON favorites FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can view all favorites
CREATE POLICY "Admins can view all favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (is_admin());

-- Create index for faster user queries
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_menu_item_id ON favorites(menu_item_id);