/*
  # Secure missions table with Row Level Security

  1. Security Changes
    - Enable RLS on `missions` table
    - Add policy to allow all authenticated users to read missions
    - Add policy to allow only parents to insert new missions
    - Add policy to allow only parents to update missions
    - Add policy to allow only parents to delete missions

  2. Implementation Details
    - Policies check `is_parent_mode = true` in the profiles table
    - Uses `auth.uid()` to match the current user with their profile
    - Ensures children cannot modify missions even if they bypass frontend checks

  3. Notes
    - This prevents children from directly modifying missions via database queries
    - Parents must be in parent mode to manage missions
    - Children can still view missions to complete them
*/

-- Enable Row Level Security on missions table
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all authenticated users to read missions
-- This is needed so children can see missions to complete them
CREATE POLICY "Anyone can view missions"
  ON missions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow only parents to insert new missions
-- Checks if user is in parent mode via profiles table
CREATE POLICY "Only parents can add missions"
  ON missions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_parent_mode = true
    )
  );

-- Policy: Allow only parents to update missions
-- Checks if user is in parent mode via profiles table
CREATE POLICY "Only parents can update missions"
  ON missions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_parent_mode = true
    )
  );

-- Policy: Allow only parents to delete missions
-- Checks if user is in parent mode via profiles table
CREATE POLICY "Only parents can delete missions"
  ON missions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_parent_mode = true
    )
  );