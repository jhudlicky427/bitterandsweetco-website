/*
  # Remove Add-Ins from Customization Options

  1. Changes
    - Mark all add-in options as inactive
    - This preserves the data but removes them from the customization interface
  
  2. Notes
    - Add-ins are no longer available for any drinks
    - Data is preserved for potential future reactivation
*/

-- Mark all add-in customization options as inactive
UPDATE customization_options
SET is_active = false
WHERE category = 'add_ins';
