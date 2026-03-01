import { useState } from 'react';
import { Mail, Phone, Send, MapPin, Clock, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        });

      if (error) throw error;

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.5)' }}>
            Get In Touch
          </h2>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
            Have questions or want to book us for your event? We'd love to hear from you!
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mt-6 animate-pulse-glow"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="glass-effect rounded-2xl p-8 border border-gray-400/20 hover:border-purple-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-600/30 transform hover:scale-105 animate-fade-in-up relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <h3 className="text-2xl font-bold text-white mb-6 relative" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>Contact Information</h3>

              <div className="space-y-6 relative">
                <div className="flex items-start space-x-4 glass-effect rounded-xl p-4 border border-gray-400/20 hover:border-purple-400/40 transition-all duration-500 group/item">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/50 to-purple-600/50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover/item:shadow-indigo-500/40 transition-all duration-500">
                    <Phone className="text-indigo-200" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-purple-300 font-bold mb-1 tracking-wider">PHONE</p>
                    <a
                      href="tel:720-735-2700"
                      className="text-lg text-gray-100 hover:text-purple-300 transition-colors font-semibold"
                      style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}
                    >
                      (720) 735-2700
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 glass-effect rounded-xl p-4 border border-gray-400/20 hover:border-purple-400/40 transition-all duration-500 group/item">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/50 to-pink-600/50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover/item:shadow-purple-500/40 transition-all duration-500">
                    <Mail className="text-purple-200" size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-purple-300 font-bold mb-1 tracking-wider">EMAIL</p>
                    <a
                      href="mailto:info@bitterandsweetco.com"
                      className="text-lg text-gray-100 hover:text-purple-300 transition-colors break-words font-semibold"
                      style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}
                    >
                      info@bitterandsweetco.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 glass-effect rounded-xl p-4 border border-gray-400/20 hover:border-pink-400/40 transition-all duration-500 group/item">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500/50 to-purple-600/50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover/item:shadow-pink-500/40 transition-all duration-500">
                    <MapPin className="text-pink-200" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-purple-300 font-bold mb-1 tracking-wider">MOBILE TRAILER</p>
                    <p className="text-lg text-gray-100 font-semibold" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                      Serving the Denver Metro Area
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 glass-effect rounded-xl p-4 border border-gray-400/20 hover:border-indigo-400/40 transition-all duration-500 group/item">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/50 to-purple-600/50 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover/item:shadow-indigo-500/40 transition-all duration-500">
                    <Clock className="text-indigo-200" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-purple-300 font-bold mb-1 tracking-wider">HOURS</p>
                    <p className="text-base text-gray-100 font-semibold" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                      Varies by Location
                    </p>
                    <p className="text-sm text-gray-200 mt-1">
                      Check our Locations page for current schedule
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-8 border border-gray-400/20 hover:border-purple-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-600/30 transform hover:scale-105 animate-fade-in-up relative overflow-hidden group" style={{ animationDelay: '0.1s' }}>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <h3 className="text-2xl font-bold text-white mb-6 relative" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>Why Choose Us?</h3>
              <ul className="space-y-4 text-gray-100 relative">
                <li className="flex items-start space-x-3 group/item">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500/50 to-purple-600/50 flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:shadow-indigo-500/40 transition-all duration-500 mt-0.5">
                    <span className="text-indigo-200 text-sm font-bold">✓</span>
                  </div>
                  <span className="leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>Beverages using premium ingredients</span>
                </li>
                <li className="flex items-start space-x-3 group/item">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500/50 to-pink-600/50 flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:shadow-purple-500/40 transition-all duration-500 mt-0.5">
                    <span className="text-purple-200 text-sm font-bold">✓</span>
                  </div>
                  <span className="leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>Professional mobile service for any event</span>
                </li>
                <li className="flex items-start space-x-3 group/item">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-pink-500/50 to-purple-600/50 flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:shadow-pink-500/40 transition-all duration-500 mt-0.5">
                    <span className="text-pink-200 text-sm font-bold">✓</span>
                  </div>
                  <span className="leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>Customizable menu options</span>
                </li>
                <li className="flex items-start space-x-3 group/item">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500/50 to-pink-600/50 flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:shadow-indigo-500/40 transition-all duration-500 mt-0.5">
                    <span className="text-indigo-200 text-sm font-bold">✓</span>
                  </div>
                  <span className="leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>Friendly and experienced staff</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-8 border border-gray-400/20 hover:border-purple-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-600/30 transform hover:scale-105 animate-fade-in-up relative overflow-hidden group" style={{ animationDelay: '0.2s' }}>
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 relative" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/50 to-purple-600/50 flex items-center justify-center shadow-xl">
                <Send className="text-indigo-200" size={20} />
              </div>
              Send Us a Message
            </h3>

            {success ? (
              <div className="text-center py-12 relative animate-fade-in-up">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-900/30 animate-float">
                  <Send className="text-green-400" size={40} />
                </div>
                <h4 className="text-3xl font-bold text-green-400 mb-4">Message Sent!</h4>
                <p className="text-gray-100 mb-8 text-lg leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                  Thank you for reaching out. We'll get back to you as soon as possible!
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-500 shadow-xl hover:shadow-purple-600/50 transform hover:scale-110 active:scale-95"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative">
                <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                  <label className="block text-gray-200 font-semibold mb-2.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3.5 glass-effect border border-gray-400/20 rounded-xl text-gray-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-500/60 focus:glass-effect-strong transition-all duration-500"
                    placeholder="John Doe"
                  />
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <label className="block text-gray-200 font-semibold mb-2.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 glass-effect border border-gray-400/20 rounded-xl text-gray-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-500/60 focus:glass-effect-strong transition-all duration-500"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                  <label className="block text-gray-200 font-semibold mb-2.5">Message *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3.5 glass-effect border border-gray-400/20 rounded-xl text-gray-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-500/60 focus:glass-effect-strong transition-all duration-500 resize-none"
                    placeholder="Tell us about your event or inquiry..."
                  />
                </div>

                {error && (
                  <div className="p-4 glass-effect border border-red-700/50 rounded-xl text-red-300 animate-fade-in-up">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group/btn w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-600/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-110 active:scale-95 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin relative z-10" size={20} />
                      <span className="relative z-10">Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} className="relative z-10 transition-transform duration-500 group-hover/btn:rotate-12" />
                      <span className="relative z-10">Send Message</span>
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-200 text-center animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                  We typically respond within 24 hours
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
