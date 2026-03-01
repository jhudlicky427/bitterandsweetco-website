/*
  # Create Menu and Locations Tables for Bitter & Sweet Co.

  1. New Tables
    - `menu_items`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Name of the lemonade
      - `description` (text) - Description of the drink
      - `price` (decimal) - Price of the drink
      - `category` (text) - Category (signature, classic, seasonal)
      - `is_available` (boolean) - Whether the item is currently available
      - `image_url` (text, optional) - URL to drink image
      - `created_at` (timestamptz) - When the item was created
      - `display_order` (integer) - Order for display on menu
    
    - `locations`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Location name
      - `address` (text) - Full address
      - `date` (date) - Date the trailer will be there
      - `start_time` (time) - Opening time
      - `end_time` (time) - Closing time
      - `notes` (text, optional) - Additional information
      - `is_active` (boolean) - Whether this location is currently active
      - `created_at` (timestamptz) - When the location was created

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (anyone can view menu and locations)
    - Only authenticated users can modify (for future admin panel)
*/

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  category text NOT NULL DEFAULT 'classic',
  is_available boolean DEFAULT true,
  image_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Public read access for menu items
CREATE POLICY "Anyone can view menu items"
  ON menu_items
  FOR SELECT
  USING (true);

-- Public read access for locations
CREATE POLICY "Anyone can view locations"
  ON locations
  FOR SELECT
  USING (true);

-- Authenticated users can insert menu items (for admin)
CREATE POLICY "Authenticated users can insert menu items"
  ON menu_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update menu items (for admin)
CREATE POLICY "Authenticated users can update menu items"
  ON menu_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete menu items (for admin)
CREATE POLICY "Authenticated users can delete menu items"
  ON menu_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Authenticated users can insert locations (for admin)
CREATE POLICY "Authenticated users can insert locations"
  ON locations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update locations (for admin)
CREATE POLICY "Authenticated users can update locations"
  ON locations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete locations (for admin)
CREATE POLICY "Authenticated users can delete locations"
  ON locations
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, category, display_order) VALUES
  ('Classic Lemonade', 'Our signature recipe with fresh-squeezed lemons, pure cane sugar, and filtered water. Simple perfection.', 4.50, 'classic', 1),
  ('Strawberry Bliss', 'Fresh strawberries muddled with our classic lemonade base. Sweet, tart, and utterly refreshing.', 5.50, 'signature', 2),
  ('Mint Cucumber Cooler', 'Crisp cucumber and fresh mint infused into our lemonade. Light and revitalizing.', 5.50, 'signature', 3),
  ('Lavender Honey', 'Delicate lavender and local honey create a floral, sophisticated twist on tradition.', 6.00, 'signature', 4),
  ('Spicy Ginger Kick', 'Fresh ginger root adds a warming, spicy depth to our sweet and tart lemonade.', 5.50, 'signature', 5),
  ('Blackberry Sage', 'Wild blackberries and garden sage for an earthy, complex flavor profile.', 6.00, 'seasonal', 6),
  ('Peach Paradise', 'Sun-ripened peaches blended into our house lemonade. Summer in a cup.', 5.50, 'seasonal', 7),
  ('Arnold Palmer', 'Half lemonade, half sweet tea. A timeless classic done right.', 4.50, 'classic', 8);

-- Insert sample locations
INSERT INTO locations (name, address, date, start_time, end_time, notes) VALUES
  ('Downtown Farmers Market', '123 Market Street, Downtown', CURRENT_DATE + INTERVAL '2 days', '08:00', '14:00', 'Every Saturday morning! Look for the yellow trailer.'),
  ('City Park Festival', '456 Park Avenue, City Park', CURRENT_DATE + INTERVAL '5 days', '10:00', '18:00', 'Special event - live music all day!'),
  ('Riverside Food Truck Rally', '789 River Road, Riverside District', CURRENT_DATE + INTERVAL '7 days', '11:00', '20:00', 'Monthly food truck gathering, first Friday of the month.');