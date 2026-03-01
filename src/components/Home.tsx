import { useState, useEffect } from 'react';
import { Droplet, Heart, Leaf, Sparkles, ShoppingCart } from 'lucide-react';
import { supabase, MenuItem } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import DrinkCustomizer from './DrinkCustomizer';

interface HomeProps {
  onNavigate: (section: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [featuredDrinks, setFeaturedDrinks] = useState<MenuItem[]>([]);
  const [customizingDrink, setCustomizingDrink] = useState<MenuItem | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchFeaturedDrinks();
  }, []);

  const fetchFeaturedDrinks = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('available', true)
      .limit(3);

    if (!error && data) {
      setFeaturedDrinks(data);
    }
  };

  const handleOrderNow = (drink: MenuItem) => {
    setCustomizingDrink(drink);
  };

  const handleAddToCart = (customization: any) => {
    addToCart({ drink: customizingDrink, customization });
    setCustomizingDrink(null);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };


  return (
    <>
      <div className="min-h-screen px-4 py-20">
        <div className="fixed top-20 left-0 right-0 z-40 animate-fade-in-up">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white py-4 px-6 shadow-2xl border-b-4 border-amber-600">
            <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
              <Sparkles className="animate-pulse" size={24} />
              <p className="text-lg md:text-xl font-bold tracking-wide text-center">
                Coming Soon to a Location Near You!
              </p>
              <Sparkles className="animate-pulse" size={24} />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-16">
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-20">
            <div className="space-y-4 animate-fade-in-up">
              <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 8px 24px rgba(0, 0, 0, 0.6), 0 0 60px rgba(200, 200, 255, 0.5), 0 0 80px rgba(180, 180, 255, 0.3)' }}>
                Bitter & Sweet Co.
              </h1>
              <p className="text-2xl md:text-3xl text-gray-100 font-light tracking-wide" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.9), 0 4px 16px rgba(0, 0, 0, 0.7), 0 0 30px rgba(200, 200, 255, 0.3)' }}>
                Squeeze the Moment
              </p>
            </div>

            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto animate-pulse-glow"></div>

            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10" style={{ animationDelay: '0.2s', textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
              Every recipe crafted with care, every sip a celebration of quality.
              Hand-squeezed, perfectly balanced, undeniably refreshing.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => onNavigate('menu')}
                className="group relative px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl text-xl font-bold transition-all duration-500 shadow-2xl hover:shadow-indigo-600/60 transform hover:-translate-y-2 hover:scale-110 active:scale-95 flex items-center gap-3 overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <ShoppingCart size={24} className="relative z-10 transition-transform duration-500 group-hover:rotate-12" />
                <span className="relative z-10">Order Now</span>
              </button>
              <button
                onClick={() => onNavigate('story')}
                className="group relative px-8 py-4 glass-effect text-gray-100 rounded-2xl text-lg font-semibold transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 active:scale-95 border border-gray-500/50 hover:border-indigo-400/60"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></span>
                <span className="relative z-10">Our Story</span>
              </button>
              <button
                onClick={() => onNavigate('locations')}
                className="group relative px-8 py-4 glass-effect text-gray-100 rounded-2xl text-lg font-semibold transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 active:scale-95 border border-gray-500/50 hover:border-purple-400/60"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></span>
                <span className="relative z-10">Find Us</span>
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
              <div className="group space-y-3 text-center glass-effect rounded-2xl p-8 transition-all duration-500 hover:scale-110 transform border border-gray-400/20 hover:border-indigo-400/60 hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer animate-fade-in-up">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/50 to-purple-600/50 text-indigo-200 mb-2 shadow-xl group-hover:shadow-indigo-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                  <Droplet size={36} className="animate-float" />
                </div>
                <h3 className="text-xl font-bold text-white transition-colors duration-500" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>Fresh Squeezed</h3>
                <p className="text-gray-100 leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>Real lemons, squeezed daily</p>
              </div>

              <div className="group space-y-3 text-center glass-effect rounded-2xl p-8 transition-all duration-500 hover:scale-110 transform border border-gray-400/20 hover:border-purple-400/60 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/50 to-pink-600/50 text-purple-200 mb-2 shadow-xl group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                  <Heart size={36} className="animate-float" style={{ animationDelay: '0.5s' }} />
                </div>
                <h3 className="text-xl font-bold text-white transition-colors duration-500" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>Made with Love</h3>
                <p className="text-gray-100 leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>Perfected recipes, crafted for you</p>
              </div>

              <div className="group space-y-3 text-center glass-effect rounded-2xl p-8 transition-all duration-500 hover:scale-110 transform border border-gray-400/20 hover:border-pink-400/60 hover:shadow-2xl hover:shadow-pink-500/20 cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/50 to-purple-600/50 text-pink-200 mb-2 shadow-xl group-hover:shadow-pink-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                  <Leaf size={36} className="animate-float" style={{ animationDelay: '1s' }} />
                </div>
                <h3 className="text-xl font-bold text-white transition-colors duration-500" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>Quality First</h3>
                <p className="text-gray-100 leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>Premium ingredients only</p>
              </div>
            </div>
          </div>

          {featuredDrinks.length > 0 && (
            <div id="featured-drinks" className="mt-24 animate-fade-in-up">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.5)' }}>
                  <Sparkles className="text-purple-300 animate-float transition-colors duration-500" />
                  Featured Favorites
                  <Sparkles className="text-pink-300 animate-float transition-colors duration-500" style={{ animationDelay: '1s' }} />
                </h2>
                <p className="text-xl text-gray-100" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)' }}>Try our most popular drinks</p>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mt-6 animate-pulse-glow"></div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {featuredDrinks.map((drink, index) => (
                  <div
                    key={drink.id}
                    className="group glass-effect rounded-2xl p-6 border-2 border-gray-400/20 hover:border-purple-400/60 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-600/30 transform hover:-translate-y-3 hover:scale-105 animate-fade-in-up cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="mb-4 relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/30 to-pink-600/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                      <h3 className="text-2xl font-bold text-white mb-2 relative transition-colors duration-500" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
                        {drink.name}
                      </h3>
                      <p className="text-gray-100 text-sm leading-relaxed mb-4 relative" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                        {drink.description}
                      </p>
                      <div className="flex items-center justify-between relative">
                        <span className="text-3xl font-bold text-purple-200 transition-colors duration-500" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(168, 85, 247, 0.4)' }}>
                          ${drink.price.toFixed(2)}
                        </span>
                        {drink.category && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-100 rounded-full text-xs font-semibold border border-purple-500/50 backdrop-blur-sm">
                            {drink.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleOrderNow(drink)}
                      className="w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-600/50 flex items-center justify-center gap-2 transform hover:scale-110 active:scale-95 relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                      <ShoppingCart size={20} className="relative z-10 transition-transform duration-500 group-hover:rotate-12" />
                      <span className="relative z-10">Order Now</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={() => onNavigate('menu')}
                  className="group px-10 py-4 glass-effect text-gray-100 hover:text-white rounded-2xl text-lg font-bold transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-indigo-600/40 border border-gray-500/40 hover:border-indigo-400/60 transform hover:-translate-y-2 hover:scale-110 active:scale-95"
                >
                  <span className="relative z-10">View Full Menu</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {customizingDrink && (
        <DrinkCustomizer
          drink={customizingDrink}
          onClose={() => setCustomizingDrink(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {showSuccessMessage && (
        <div className="fixed top-24 right-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-slide-down border border-green-400/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="animate-pulse" />
            <span className="font-semibold">Added to cart successfully!</span>
          </div>
        </div>
      )}
    </>
  );
}
