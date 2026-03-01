import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2 } from 'lucide-react';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_date: string;
  event_type: string;
  guest_count: number;
  message: string;
  created_at: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('event_bookings')
      .select('*')
      .order('event_date', { ascending: true });

    if (data) setBookings(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      const { error } = await supabase.from('event_bookings').delete().eq('id', id);
      if (!error) fetchBookings();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="text-amber-200">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-amber-50">Event Bookings</h2>
          <p className="text-amber-200/60 mt-1">{bookings.length} total bookings</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12 text-amber-200/60">
          No bookings yet
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-amber-900/20 p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-amber-50">{booking.name}</h3>
                  <p className="text-amber-400 mt-1">{booking.event_type}</p>
                </div>
                <button
                  onClick={() => handleDelete(booking.id)}
                  className="p-2 text-red-400 hover:bg-red-900/40 rounded transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-amber-200/60 text-sm">Event Date</p>
                  <p className="text-amber-100">{formatDate(booking.event_date)}</p>
                </div>
                <div>
                  <p className="text-amber-200/60 text-sm">Guest Count</p>
                  <p className="text-amber-100">{booking.guest_count} guests</p>
                </div>
                <div>
                  <p className="text-amber-200/60 text-sm">Email</p>
                  <p className="text-amber-100">{booking.email}</p>
                </div>
                <div>
                  <p className="text-amber-200/60 text-sm">Phone</p>
                  <p className="text-amber-100">{booking.phone}</p>
                </div>
              </div>

              {booking.message && (
                <div>
                  <p className="text-amber-200/60 text-sm mb-1">Message</p>
                  <p className="text-amber-100 bg-amber-950/30 p-3 rounded">{booking.message}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-amber-800/30">
                <p className="text-amber-200/40 text-xs">
                  Submitted {new Date(booking.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
