/*
  # Add Parent PIN Hash Column

  1. Schema Changes
    - Add `parent_pin_hash` column to `profiles` table
    - Column stores securely hashed PIN for parent mode access
    - Optional field (nullable) for backward compatibility

  2. Security
    - PIN is hashed using bcrypt before storage
    - Never store plain text PINs
    - Enables secure parent mode verification
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'parent_pin_hash'
  ) THEN
    ALTER TABLE profiles ADD COLUMN parent_pin_hash text;
  END IF;
END $$;