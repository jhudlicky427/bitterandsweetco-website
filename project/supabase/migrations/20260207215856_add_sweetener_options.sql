/*
  # Add Sweetener Options

  1. New Options
    - Add sweetener category options:
      - Cane Sugar (default, no additional cost)
      - Simple Syrup (no additional cost)
      - Allulose (no additional cost)
  
  2. Notes
    - Sweeteners are alternatives to the default sweetness levels
    - Customers can choose their preferred sweetener type
    - No price modifiers as these are standard sweetener options
*/

INSERT INTO customization_options (category, name, price_modifier, display_order) VALUES
  ('sweetener', 'Cane Sugar', 0, 1),
  ('sweetener', 'Simple Syrup', 0, 2),
  ('sweetener', 'Allulose', 0, 3);