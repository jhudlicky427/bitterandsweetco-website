/*
  # Admin Authentication System

  1. New Tables
    - `user_profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `role` (text, default 'customer')
      - `created_at` (timestamptz)
    
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - User profiles: Users can read own profile, only admins can update roles
    - Contact submissions: Public can insert, only admins can read
    - Menu items: Public can read, only admins can write
    - Locations: Public can read, only admins can write
    - Event bookings: Authenticated users can insert their own, only admins can read all

  3. Functions
    - Function to check if user is admin
    - Trigger to create user profile on signup
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'customer',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own email"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM user_profiles WHERE id = auth.uid()));

CREATE POLICY "Public can submit contact forms"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can delete contact submissions"
  ON contact_submissions FOR DELETE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert menu items"
  ON menu_items FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update menu items"
  ON menu_items FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete menu items"
  ON menu_items FOR DELETE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert locations"
  ON locations FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update locations"
  ON locations FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete locations"
  ON locations FOR DELETE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can read all bookings"
  ON event_bookings FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update bookings"
  ON event_bookings FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete bookings"
  ON event_bookings FOR DELETE
  TO authenticated
  USING (is_admin());