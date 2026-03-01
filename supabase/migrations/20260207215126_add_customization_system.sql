/*
  # Add Drink Customization System

  1. New Tables
    - `customization_options`
      - `id` (uuid, primary key)
      - `category` (text) - sweetness, ice, add_ins, size
      - `name` (text) - option name
      - `price_modifier` (decimal) - additional cost
      - `is_active` (boolean)
      - `display_order` (integer)
      - `created_at` (timestamptz)
    
    - `create_your_own_bases`
      - `id` (uuid, primary key)
      - `type` (text) - lemonade, tea, dirty_soda
      - `name` (text)
      - `base_price` (decimal)
      - `description` (text)
      - `is_active` (boolean)
      - `created_at` (timestamptz)

  2. Updates
    - Add `allows_customization` column to menu_items
    - Add `is_create_your_own` column to menu_items

  3. Security
    - Enable RLS on new tables
    - Public read access for all customization options
    - Admin-only write access
*/

CREATE TABLE IF NOT EXISTS customization_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  price_modifier decimal(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS create_your_own_bases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  name text NOT NULL,
  base_price decimal(10,2) NOT NULL,
  description text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menu_items' AND column_name = 'allows_customization'
  ) THEN
    ALTER TABLE menu_items ADD COLUMN allows_customization boolean DEFAULT true;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menu_items' AND column_name = 'is_create_your_own'
  ) THEN
    ALTER TABLE menu_items ADD COLUMN is_create_your_own boolean DEFAULT false;
  END IF;
END $$;

ALTER TABLE customization_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE create_your_own_bases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view customization options"
  ON customization_options FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert customization options"
  ON customization_options FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update customization options"
  ON customization_options FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete customization options"
  ON customization_options FOR DELETE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Anyone can view create your own bases"
  ON create_your_own_bases FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert create your own bases"
  ON create_your_own_bases FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update create your own bases"
  ON create_your_own_bases FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete create your own bases"
  ON create_your_own_bases FOR DELETE
  TO authenticated
  USING (is_admin());

INSERT INTO customization_options (category, name, price_modifier, display_order) VALUES
  ('sweetness', 'Light Sweet', 0, 1),
  ('sweetness', 'Regular Sweet', 0, 2),
  ('sweetness', 'Extra Sweet', 0, 3),
  ('ice', 'Light Ice', 0, 1),
  ('ice', 'Regular Ice', 0, 2),
  ('ice', 'Extra Ice', 0, 3),
  ('ice', 'No Ice', 0, 4),
  ('add_ins', 'Fresh Mint', 0.50, 1),
  ('add_ins', 'Cucumber Slices', 0.50, 2),
  ('add_ins', 'Fresh Strawberries', 1.00, 3),
  ('add_ins', 'Fresh Blueberries', 1.00, 4),
  ('add_ins', 'Fresh Raspberries', 1.00, 5),
  ('add_ins', 'Lavender', 0.50, 6),
  ('add_ins', 'Ginger', 0.50, 7),
  ('add_ins', 'Honey', 0.50, 8),
  ('add_ins', 'Agave', 0.50, 9),
  ('extras', 'Candy Straw', 2.00, 1),
  ('size', 'Small (12oz)', 0, 1),
  ('size', 'Medium (16oz)', 0, 2),
  ('size', 'Large (20oz)', 1.50, 3);

INSERT INTO create_your_own_bases (type, name, base_price, description) VALUES
  ('lemonade', 'Create Your Own Lemonade', 5.00, 'Start with our classic lemonade base and customize it your way!'),
  ('tea', 'Create Your Own Sweet Tea', 4.50, 'Choose your tea base and add your favorite flavors!'),
  ('dirty_soda', 'Create Your Own Dirty Soda', 5.50, 'Pick your soda and make it uniquely yours with fun add-ins!');