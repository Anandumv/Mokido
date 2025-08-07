/*
  # Fix age groups in learning modules

  1. Updates
    - Update all learning modules to use '6-9 years' format
    - Ensure consistency with user profiles

  2. Data
    - All modules should be accessible to demo users
*/

-- Update learning modules to use consistent age group format
UPDATE learning_modules 
SET age_groups = ARRAY['6-9 years']
WHERE id IN ('1', '2', '3', '4', '5', '6');

-- Verify the update
SELECT id, title, age_groups FROM learning_modules;