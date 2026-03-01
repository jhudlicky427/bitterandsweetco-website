import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
  image_url?: string;
  display_order: number;
  created_at: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  date: string;
  start_time: string;
  end_time: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
}

export interface EventBooking {
  id: string;
  event_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  expected_guests: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}
