import { useEffect, useState } from 'react';
import { supabase, EventBooking } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Users, X } from 'lucide-react';

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<EventBooking[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [currentDate]);

  const fetchBookings = async () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('event_bookings')
        .select('*')
        .eq('status', 'confirmed')
        .gte('event_date', startOfMonth.toISOString().split('T')[0])
        .lte('event_date', endOfMonth.toISOString().split('T')[0]);

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isDateBooked = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.some(booking => booking.event_date === dateStr);
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(booking => booking.event_date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="glass-effect-strong rounded-2xl p-8 border border-gray-400/20 hover:border-purple-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-600/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 relative">
          <h3 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/50 to-purple-600/50 flex items-center justify-center shadow-xl">
              <Calendar className="text-indigo-200" size={28} />
            </div>
            Event Calendar
          </h3>
          <button
            onClick={() => setShowBookingForm(true)}
            className="group/btn px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-600/50 transform hover:-translate-y-1 hover:scale-105 relative overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
            <span className="relative z-10">Request Booking</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-8 relative">
          <button
            onClick={previousMonth}
            className="group/nav p-3 glass-effect hover:glass-effect-strong rounded-xl transition-all duration-500 border border-gray-400/20 hover:border-indigo-400/60 transform hover:-translate-x-1"
          >
            <ChevronLeft className="text-indigo-300 group-hover/nav:text-indigo-200 transition-colors" size={24} />
          </button>
          <h4 className="text-2xl md:text-3xl font-bold text-white" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>{monthName}</h4>
          <button
            onClick={nextMonth}
            className="group/nav p-3 glass-effect hover:glass-effect-strong rounded-xl transition-all duration-500 border border-gray-400/20 hover:border-indigo-400/60 transform hover:translate-x-1"
          >
            <ChevronRight className="text-indigo-300 group-hover/nav:text-indigo-200 transition-colors" size={24} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-3 relative">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div
              key={day}
              className="text-center text-purple-300 font-bold py-3 text-sm md:text-base animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {day}
            </div>
          ))}

          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isBooked = isDateBooked(date);
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
            const dayBookings = getBookingsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <button
                key={day}
                onClick={() => {
                  setSelectedDate(date);
                  if (!isBooked && !isPast) {
                    setShowBookingForm(true);
                  }
                }}
                className={`aspect-square p-2 md:p-3 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group/day animate-fade-in-up ${
                  isToday
                    ? 'ring-2 ring-purple-400/50'
                    : ''
                } ${
                  isBooked
                    ? 'glass-effect border-pink-600/50 cursor-default shadow-lg shadow-pink-900/20'
                    : isPast
                    ? 'bg-gray-950/10 border-gray-900/20 text-gray-200/30 cursor-default'
                    : 'glass-effect border-gray-400/20 hover:glass-effect-strong hover:border-purple-600/60 hover:shadow-lg hover:shadow-purple-600/20 transform hover:-translate-y-1 hover:scale-105'
                }`}
                style={{ animationDelay: `${(i + startingDayOfWeek) * 0.02}s` }}
                disabled={isPast && !isBooked}
              >
                {!isPast && !isBooked && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover/day:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                )}
                <div className={`font-bold text-sm md:text-base relative z-10 ${
                  isBooked ? 'text-pink-300' : isToday ? 'text-purple-400' : 'text-gray-100'
                }`}>
                  {day}
                </div>
                {isBooked && (
                  <div className="mt-1 space-y-1 relative z-10">
                    {dayBookings.map(booking => (
                      <div
                        key={booking.id}
                        className="text-xs text-pink-300 truncate bg-pink-900/30 rounded px-1 py-0.5"
                        title={booking.event_name}
                      >
                        {booking.event_name}
                      </div>
                    ))}
                  </div>
                )}
                {isToday && !isBooked && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-lg"></div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-6 text-sm relative">
          <div className="flex items-center gap-2 glass-effect px-3 py-2 rounded-lg border border-gray-400/20">
            <div className="w-5 h-5 rounded-lg glass-effect border-2 border-pink-600/50 shadow-lg shadow-pink-900/20"></div>
            <span className="text-gray-200 font-medium">Booked</span>
          </div>
          <div className="flex items-center gap-2 glass-effect px-3 py-2 rounded-lg border border-gray-400/20">
            <div className="w-5 h-5 rounded-lg glass-effect border-2 border-gray-400/20"></div>
            <span className="text-gray-200 font-medium">Available</span>
          </div>
          <div className="flex items-center gap-2 glass-effect px-3 py-2 rounded-lg border border-gray-400/20">
            <div className="w-5 h-5 rounded-lg bg-gray-950/10 border-2 border-gray-900/20"></div>
            <span className="text-gray-200 font-medium">Past</span>
          </div>
        </div>
      </div>

      {showBookingForm && (
        <BookingForm
          onClose={() => {
            setShowBookingForm(false);
            setSelectedDate(null);
          }}
          onSuccess={fetchBookings}
          initialDate={selectedDate}
        />
      )}
    </div>
  );
}

interface BookingFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialDate: Date | null;
}

function BookingForm({ onClose, onSuccess, initialDate }: BookingFormProps) {
  const [formData, setFormData] = useState({
    event_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    event_date: initialDate ? initialDate.toISOString().split('T')[0] : '',
    start_time: '09:00',
    end_time: '17:00',
    location: '',
    expected_guests: 50,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from('event_bookings')
        .insert([{ ...formData, status: 'pending' }]);

      if (submitError) throw submitError;

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit booking request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in-up">
      <div className="glass-effect-strong rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-400/20 shadow-2xl hover:shadow-purple-600/30 transition-all duration-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>

        <div className="flex items-center justify-between mb-8 relative">
          <h3 className="text-3xl font-bold text-white" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>Request Event Booking</h3>
          <button
            onClick={onClose}
            className="p-2.5 glass-effect hover:glass-effect-strong rounded-xl transition-all duration-500 border border-gray-400/20 hover:border-purple-400/60 group"
          >
            <X className="text-purple-300 group-hover:text-purple-200 transition-colors" size={24} />
          </button>
        </div>

        {success ? (
          <div className="text-center py-12 relative animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-900/30 animate-float">
              <Calendar className="text-green-400" size={36} />
            </div>
            <h4 className="text-3xl font-bold text-green-400 mb-3">Request Submitted!</h4>
            <p className="text-gray-200/90 text-lg">
              We'll review your booking request and get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                <label className="block text-gray-200 font-semibold mb-2.5">Event Name *</label>
                <input
                  type="text"
                  required
                  value={formData.event_name}
                  onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                  className="w-full px-4 py-3.5 glass-effect border border-gray-800/40 rounded-xl text-gray-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-500/60 focus:glass-effect-strong transition-all duration-300"
                  placeholder="Wedding, Birthday Party, etc."
                />
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <label className="block text-gray-200 font-semibold mb-2.5">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  className="w-full px-4 py-3.5 glass-effect border border-gray-800/40 rounded-xl text-gray-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-500/60 focus:glass-effect-strong transition-all duration-300"
                  placeholder="John Doe"
                />
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                <label className="block text-gray-200 font-semibold mb-2.5">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full px-4 py-3.5 glass-effect border border-gray-800/40 rounded-xl text-gray-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-500/60 focus:glass-effect-strong transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <label className="block text-gray-200 font-semibold mb-2.5">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full px-4 py-3.5 glass-effect border border-gray-800/40 rounded-xl text-gray-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-500/60 focus:glass-effect-strong transition-all duration-300"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                <label className="block text-gray-200 font-semibold mb-2.5 flex items-center gap-2">
                  <Calendar size={18} className="text-purple-400" />
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="w-full px-4 py-3.5 glass-effect border border-gray-800/40 rounded-xl text-gray-100 focus:outline-none focus:border-purple-500/60 focus:glass-effect-strong transition-all duration-300"
                />
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <label className="block text-gray-200 font-semibold mb-2.5 flex items-center gap-2">
                  <Users size={18} className="text-purple-400" />
                  Expected Guests *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.expected_guests}
                  onChange={(e) => setFormData({ ...formData, expected_guests: parseInt(e.target.value) })}
                  className="w-full px-4 py-3.5 glass-effect border border-gray-800/40 rounded-xl text-gray-100 focus:outline-none focus:border-purple-500/60 focus:glass-effect-strong transition-all duration-300"
                />
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
                <label className="block text-gray-200 font-semibold mb-2.5 flex items-center gap-2">
                  <Clock size={18} className="text-purple-400" />
                  Start Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-full px-4 py-3.5 glass-effect border border-gray-800/40 rounded-xl text-gray-100 focus:outline-none focus:border-purple-500/60 focus:glass-effect-strong transition-all duration-300"
                />
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <label className="block text-gray-200 font-semibold mb-2.5 flex items-center gap-2">
                  <Clock size={18} className="text-purple-400" />
                  End Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="w-full px-4 py-3.5 glass-effect border border-gray-800/40 rounded-xl text-gray-100 focus:outline-none focus:border-purple-500/60 focus:glass-effect-strong transition-all duration-300"
                />
              </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
              <label className="block text-gray-200 font-semibold mb-2.5 flex items-center gap-2">
                <MapPin size={18} className="text-purple-400" />
                Event Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3.5 glass-effect border border-gray-800/40 rounded-xl text-gray-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-500/60 focus:glass-effect-strong transition-all duration-300"
                placeholder="123 Main St, City, State"
              />
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <label className="block text-gray-200 font-semibold mb-2.5">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full px-4 py-3.5 glass-effect border border-gray-800/40 rounded-xl text-gray-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-500/60 focus:glass-effect-strong transition-all duration-300 resize-none"
                placeholder="Any special requests or details we should know about..."
              />
            </div>

            {error && (
              <div className="p-4 glass-effect border border-red-700/50 rounded-xl text-red-300 animate-fade-in-up">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.55s' }}>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3.5 glass-effect hover:glass-effect-strong text-gray-200 hover:text-gray-100 font-bold rounded-xl transition-all duration-300 border border-gray-800/40 hover:border-gray-600/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="group/btn flex-1 px-6 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-600/40 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 relative overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-400 to-red-400 opacity-0 group-hover/btn:opacity-30 transition-opacity duration-300"></span>
                <span className="relative z-10">{submitting ? 'Submitting...' : 'Submit Request'}</span>
              </button>
            </div>

            <p className="text-sm text-gray-200/70 text-center leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              * Your booking request will be reviewed and confirmed within 24-48 hours
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
