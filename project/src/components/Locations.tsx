import { useEffect, useState } from 'react';
import { supabase, Location } from '../lib/supabase';
import { MapPin, Calendar, Clock, Info, Loader2 } from 'lucide-react';
import EventCalendar from './EventCalendar';

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .gte('date', today)
        .order('date', { ascending: true });

      if (error) throw error;
      setLocations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl text-red-400">Failed to load locations</p>
          <p className="text-gray-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-4 mb-16 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.5)' }}>
            Find Our Trailer
          </h2>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
            We're mobile and we're coming to you! Check out where you can find us next.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mt-6 animate-pulse-glow"></div>
        </div>

        {locations.length === 0 ? (
          <div className="text-center py-16 glass-effect rounded-2xl border border-gray-400/20 animate-fade-in-up">
            <p className="text-xl text-gray-200" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
              No upcoming locations scheduled yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {locations.map((location, index) => (
              <div
                key={location.id}
                className="glass-effect rounded-2xl p-8 border border-gray-400/20 hover:border-purple-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-600/30 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up relative overflow-hidden group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                <div className="space-y-6 relative">
                  <h3 className="text-3xl font-bold text-white" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
                    {location.name}
                  </h3>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-start space-x-3 glass-effect rounded-xl p-4 border border-gray-400/20 hover:border-indigo-400/40 transition-all duration-500">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/50 to-purple-600/50 flex items-center justify-center flex-shrink-0 shadow-xl">
                        <MapPin className="text-indigo-200" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-purple-300 font-bold mb-1 tracking-wider">
                          LOCATION
                        </p>
                        <p className="text-gray-100 leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                          {location.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 glass-effect rounded-xl p-4 border border-gray-400/20 hover:border-purple-400/40 transition-all duration-500">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/50 to-pink-600/50 flex items-center justify-center flex-shrink-0 shadow-xl">
                        <Calendar className="text-purple-200" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-purple-300 font-bold mb-1 tracking-wider">
                          DATE
                        </p>
                        <p className="text-gray-100 leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                          {formatDate(location.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 glass-effect rounded-xl p-4 border border-gray-400/20 hover:border-pink-400/40 transition-all duration-500">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/50 to-purple-600/50 flex items-center justify-center flex-shrink-0 shadow-xl">
                        <Clock className="text-pink-200" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-purple-300 font-bold mb-1 tracking-wider">
                          HOURS
                        </p>
                        <p className="text-gray-100 leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                          {formatTime(location.start_time)} - {formatTime(location.end_time)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {location.notes && (
                    <div className="flex items-start space-x-3 pt-6 border-t border-gray-400/20 glass-effect rounded-xl p-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/50 to-purple-600/50 flex items-center justify-center flex-shrink-0 shadow-xl">
                        <Info className="text-indigo-200" size={16} />
                      </div>
                      <p className="text-gray-100 leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                        {location.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16">
          <EventCalendar />
        </div>

        <div className="mt-12 text-center animate-fade-in-up">
          <div className="inline-block glass-effect rounded-2xl px-8 py-8 border border-gray-400/20 hover:border-purple-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-600/30 relative overflow-hidden group transform hover:scale-105">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <p className="text-white text-xl font-bold mb-3 relative" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
              Want us at your event?
            </p>
            <p className="text-gray-100 leading-relaxed relative" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
              We're available for private events, festivals, and gatherings. Use the calendar above to request a booking!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
