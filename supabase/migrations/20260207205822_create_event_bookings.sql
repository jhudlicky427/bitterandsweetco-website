/*
  # Create Event Bookings Table

  ## Overview
  This migration creates a table to manage event bookings for the coffee trailer service.
  
  1. **New Tables**
    - `event_bookings`
      - `id` (uuid, primary key) - Unique identifier for each booking
      - `event_name` (text) - Name of the event
      - `contact_name` (text) - Name of person booking
      - `contact_email` (text) - Email for confirmation
      - `contact_phone` (text) - Phone number for contact
      - `event_date` (date) - Date of the event
      - `start_time` (time) - When the event starts
      - `end_time` (time) - When the event ends
      - `location` (text) - Where the event will be held
      - `expected_guests` (integer) - Estimated number of attendees
      - `notes` (text, optional) - Additional details or requests
      - `status` (text) - Booking status: 'pending', 'confirmed', 'cancelled'
      - `created_at` (timestamptz) - When booking was made

  2. **Security**
    - Enable RLS on `event_bookings` table
    - Allow anyone to insert bookings (public booking form)
    - Only allow reading of confirmed bookings (for calendar display)

  3. **Important Notes**
    - Public can submit booking requests
    - Only confirmed bookings are visible to check availability
    - All bookings start as 'pending' until manually confirmed
*/

-- Create event bookings table
CREATE TABLE IF NOT EXISTS event_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  event_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  location text NOT NULL,
  expected_guests integer DEFAULT 50,
  notes text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE event_bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create booking requests
CREATE POLICY "Anyone can submit event booking requests"
  ON event_bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to view confirmed bookings (to see availability)
CREATE POLICY "Anyone can view confirmed bookings"
  ON event_bookings
  FOR SELECT
  TO anon, authenticated
  USING (status = 'confirmed');

-- Create index for efficient date queries
CREATE INDEX IF NOT EXISTS idx_event_bookings_date 
  ON event_bookings(event_date) 
  WHERE status = 'confirmed';
