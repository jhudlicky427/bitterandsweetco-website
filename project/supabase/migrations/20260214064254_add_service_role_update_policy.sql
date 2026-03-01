/*
  # Add Service Role UPDATE Policy

  1. Changes
    - Add UPDATE policy for service_role to allow role updates via SQL Editor
  
  2. Security
    - Service role can update any user profile (used for admin operations)
    - This allows updating user roles through the Supabase dashboard SQL Editor
*/

-- Add service role UPDATE policy for user_profiles
DROP POLICY IF EXISTS "Service role can update profiles" ON user_profiles;

CREATE POLICY "Service role can update profiles"
  ON user_profiles FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);