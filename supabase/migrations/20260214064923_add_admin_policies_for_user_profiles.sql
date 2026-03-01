/*
  # Add Admin Policies for User Profiles

  1. Changes
    - Add SELECT policy for admins to view all user profiles
    - Add UPDATE policy for admins to modify any user profile (including role changes)
    - Add DELETE policy for admins to remove user profiles if needed
  
  2. Security
    - All policies check `is_admin()` function to verify admin role
    - Admins can perform full CRUD operations on user_profiles
    - Regular users can still only manage their own profiles
  
  3. Notes
    - This gives admins complete control over user management
    - Enables admins to assign/revoke admin roles through the UI
    - Allows admins to manage user accounts as needed
*/

-- Add admin SELECT policy for user_profiles
CREATE POLICY "Admins can read all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (is_admin());

-- Add admin UPDATE policy for user_profiles
CREATE POLICY "Admins can update all profiles"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Add admin DELETE policy for user_profiles
CREATE POLICY "Admins can delete profiles"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (is_admin());