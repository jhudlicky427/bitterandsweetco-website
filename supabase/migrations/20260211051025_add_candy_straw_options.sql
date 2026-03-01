/*
  # Add Candy Straw Options

  1. Changes
    - Add a new category 'candy_straws' to customization_options
    - Insert various candy straw options (Sour Patch Kids, Gummy Worms, etc.)
  
  2. Candy Straw Options
    - Sour Patch Kids Straw
    - Gummy Worm Straw
    - Nerds Rope Straw
    - Twizzler Straw
    - Rainbow Sour Belt Straw
    - Airheads Xtremes Straw
  
  3. Notes
    - Each candy straw has a small price modifier
    - Only one candy straw can be selected per drink
*/

-- Insert candy straw options
INSERT INTO customization_options (name, category, price_modifier, is_active) VALUES
  ('Sour Patch Kids Straw', 'candy_straws', 1.50, true),
  ('Gummy Worm Straw', 'candy_straws', 1.50, true),
  ('Nerds Rope Straw', 'candy_straws', 1.50, true),
  ('Twizzler Straw', 'candy_straws', 1.25, true),
  ('Rainbow Sour Belt Straw', 'candy_straws', 1.75, true),
  ('Airheads Xtremes Straw', 'candy_straws', 1.50, true);
