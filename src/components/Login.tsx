import { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onNavigate: (section: string) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const { signIn, signUp, user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    onNavigate('home');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        setSuccess('Account created successfully! You can now sign in.');
        setIsSignUp(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        await signIn(email, password);
        setSuccess('Welcome back!');
        setTimeout(() => {
          onNavigate('home');
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-md mx-auto">
        <div className="glass-effect rounded-2xl border border-gray-400/20 overflow-hidden transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-600/30 animate-fade-in-up">
          <div className="bg-gradient-to-r from-indigo-600/80 to-purple-600/80 p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
            <h1 className="text-3xl font-bold text-white mb-2 relative" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-100 relative" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
              {isSignUp ? 'Sign up to start ordering' : 'Sign in to your account'}
            </p>
          </div>

          <div className="flex border-b border-gray-400/20">
            <button
              onClick={() => {
                setIsSignUp(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-4 font-semibold transition-all duration-500 ${
                !isSignUp
                  ? 'bg-gradient-to-r from-indigo-600/40 to-purple-600/40 text-purple-200 border-b-2 border-purple-400 shadow-lg'
                  : 'text-gray-200 hover:bg-purple-900/20'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <LogIn size={20} />
                Sign In
              </div>
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-4 font-semibold transition-all duration-500 ${
                isSignUp
                  ? 'bg-gradient-to-r from-indigo-600/40 to-purple-600/40 text-purple-200 border-b-2 border-purple-400 shadow-lg'
                  : 'text-gray-200 hover:bg-purple-900/20'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <UserPlus size={20} />
                Sign Up
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-4 glass-effect border border-red-500/50 rounded-xl text-red-300 flex items-center gap-3 animate-fade-in-up">
                <AlertCircle size={20} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 glass-effect border border-green-500/50 rounded-xl text-green-300 flex items-center gap-3 animate-fade-in-up">
                <AlertCircle size={20} className="flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-gray-200 font-semibold">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 glass-effect border border-gray-400/20 rounded-xl text-gray-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-200 font-semibold">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 glass-effect border border-gray-400/20 rounded-xl text-gray-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2 animate-fade-in-up">
                <label className="block text-gray-200 font-semibold">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={20} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 glass-effect border border-gray-400/20 rounded-xl text-gray-100 placeholder-purple-300/40 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-600/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
