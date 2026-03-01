/*
  # Fix User Profile Creation

  1. Changes
    - Add INSERT policy to allow user profile creation during signup
    - The trigger function needs to be able to insert into user_profiles
  
  2. Security
    - Policy allows inserts for authenticated users creating their own profile
    - Ensures that users can only create a profile with their own ID
*/

-- Drop the existing trigger and function to recreate them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Recreate the function to handle new user signups
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'customer');
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add INSERT policy for user_profiles
-- This allows authenticated users to insert their own profile during signup
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Add a policy to allow service role to insert (for the trigger)
DROP POLICY IF EXISTS "Service role can insert profiles" ON user_profiles;

CREATE POLICY "Service role can insert profiles"
  ON user_profiles FOR INSERT
  TO service_role
  WITH CHECK (true);