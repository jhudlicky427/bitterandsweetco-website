import { Menu, X, ShoppingCart, LogIn, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

export default function Navigation({ currentSection, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
    setIsOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'locations', label: 'Locations' },
    { id: 'story', label: 'Our Story' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavigate = (section: string) => {
    onNavigate(section);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect-strong border-b border-gray-800/30 shadow-2xl backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => handleNavigate('home')}
            className="flex items-center transition-all duration-500 transform hover:scale-110 hover:drop-shadow-2xl"
          >
            <img
              src="/photoroom_20260115_231426-removebg-preview.png"
              alt="Bitter & Sweet Co."
              className="h-16 w-auto drop-shadow-2xl transition-all duration-500"
            />
          </button>

          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`px-4 py-2.5 text-base font-bold transition-all duration-500 rounded-xl relative group ${
                  currentSection === item.id
                    ? 'text-white glass-effect-strong scale-105'
                    : 'text-gray-300 hover:text-white hover:glass-effect hover:scale-105'
                }`}
              >
                {currentSection === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl animate-scale-in"></div>
                )}
                <span className="relative z-10">{item.label}</span>
                {currentSection === item.id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-slide-in shadow-lg shadow-indigo-400/50"></div>
                )}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => handleNavigate('admin')}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-500 shadow-xl hover:shadow-purple-500/50 transform hover:scale-110 ml-2 active:scale-95"
              >
                <User size={18} />
                Admin
              </button>
            )}
            <button
              onClick={() => handleNavigate('cart')}
              className="relative p-3 text-gray-300 hover:text-white glass-effect hover:glass-effect-strong rounded-xl transition-all duration-500 ml-2 transform hover:scale-110 active:scale-95 hover:shadow-lg"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2.5 glass-effect hover:glass-effect-strong text-gray-300 hover:text-white font-bold rounded-xl transition-all duration-500 border border-gray-700/40 hover:border-indigo-500/50 transform hover:scale-105 active:scale-95"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <button
                onClick={() => handleNavigate('login')}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-500 shadow-xl hover:shadow-indigo-500/50 transform hover:scale-110 active:scale-95"
              >
                <LogIn size={18} />
                Login
              </button>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white p-3 glass-effect rounded-xl transition-all duration-500 border border-gray-700/40 hover:border-indigo-500/50 transform hover:scale-110 active:scale-95"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass-effect-strong border-t border-gray-800/30 animate-slide-down backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`block w-full text-left px-4 py-3.5 rounded-xl text-base font-bold transition-all duration-500 animate-fade-in-up transform hover:scale-105 active:scale-95 ${
                  currentSection === item.id
                    ? 'glass-effect-strong text-white border border-indigo-500/40 bg-gradient-to-r from-indigo-600/10 to-purple-600/10'
                    : 'glass-effect text-gray-300 hover:glass-effect-strong hover:text-white border border-transparent hover:border-indigo-500/30'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {item.label}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => handleNavigate('admin')}
                className="flex items-center gap-2 w-full text-left px-4 py-3.5 rounded-xl text-base font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all duration-500 shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 active:scale-95"
              >
                <User size={20} />
                Admin Panel
              </button>
            )}
            <button
              onClick={() => handleNavigate('cart')}
              className={`flex items-center justify-between w-full text-left px-4 py-3.5 rounded-xl text-base font-bold transition-all duration-500 transform hover:scale-105 active:scale-95 ${
                currentSection === 'cart'
                  ? 'glass-effect-strong text-white border border-indigo-500/40 bg-gradient-to-r from-indigo-600/10 to-purple-600/10'
                  : 'glass-effect text-gray-300 hover:glass-effect-strong hover:text-white border border-transparent hover:border-indigo-500/30'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShoppingCart size={20} />
                Cart
              </span>
              {cartCount > 0 && (
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full text-left px-4 py-3.5 rounded-xl text-base font-bold glass-effect hover:glass-effect-strong text-gray-300 hover:text-white transition-all duration-500 border border-gray-700/40 hover:border-indigo-500/50 transform hover:scale-105 active:scale-95"
              >
                <LogOut size={20} />
                Logout
              </button>
            ) : (
              <button
                onClick={() => handleNavigate('login')}
                className="flex items-center gap-2 w-full text-left px-4 py-3.5 rounded-xl text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all duration-500 shadow-xl hover:shadow-indigo-500/50 transform hover:scale-105 active:scale-95"
              >
                <LogIn size={20} />
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
