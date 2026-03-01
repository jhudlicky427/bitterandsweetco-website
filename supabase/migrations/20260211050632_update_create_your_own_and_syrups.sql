/*
  # Update Create Your Own Pricing and Syrup Restrictions

  1. Changes to Existing Tables
    - Add `create_your_own_only` column to `customization_options`
      - Boolean flag to mark options only available for create-your-own drinks
      - Defaults to false for backwards compatibility
    
  2. Data Updates
    - Update all syrup options:
      - Set price_modifier to $0.75
      - Mark as create_your_own_only = true
    - Update all create_your_own_bases:
      - Set base_price to $6.00

  3. Notes
    - Syrups will now only appear when customizing create-your-own items
    - All create-your-own drinks now have a consistent $6.00 base price
    - Regular menu items cannot add syrups (only other customization options)
*/

-- Add create_your_own_only column to customization_options
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customization_options' AND column_name = 'create_your_own_only'
  ) THEN
    ALTER TABLE customization_options ADD COLUMN create_your_own_only boolean DEFAULT false;
  END IF;
END $$;

-- Update all syrup options to cost $0.75 and mark as create-your-own-only
UPDATE customization_options
SET 
  price_modifier = 0.75,
  create_your_own_only = true
WHERE category = 'syrup';

-- Update all create_your_own_bases to $6.00
UPDATE create_your_own_bases
SET base_price = 6.00
WHERE is_active = true;
