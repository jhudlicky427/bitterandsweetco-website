import { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface CustomizationOption {
  id: string;
  category: string;
  name: string;
  price_modifier: number;
  display_order: number;
  create_your_own_only?: boolean;
}

interface DrinkCustomizerProps {
  drink: {
    id: string;
    name: string;
    price: number;
    description: string;
    isCreateYourOwn?: boolean;
  };
  onClose: () => void;
  onAddToCart?: (customization: any) => void;
  onFavoriteSaved?: () => void;
}

export default function DrinkCustomizer({ drink, onClose, onAddToCart, onFavoriteSaved }: DrinkCustomizerProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [options, setOptions] = useState<CustomizationOption[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedSweetness, setSelectedSweetness] = useState<string>('');
  const [selectedSweetener, setSelectedSweetener] = useState<string>('');
  const [selectedIce, setSelectedIce] = useState<string>('');
  const [selectedSyrups, setSelectedSyrups] = useState<string[]>([]);
  const [selectedAddIns, setSelectedAddIns] = useState<string[]>([]);
  const [selectedCandyStraw, setSelectedCandyStraw] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [showSaveFavorite, setShowSaveFavorite] = useState(false);
  const [favoriteName, setFavoriteName] = useState('');
  const [savingFavorite, setSavingFavorite] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState('');

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    const { data } = await supabase
      .from('customization_options')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (data) {
      setOptions(data);
      const defaultSize = data.find((o) => o.category === 'size' && o.name.includes('Medium'));
      const defaultSweetness = data.find((o) => o.category === 'sweetness' && o.name.includes('Regular'));
      const defaultSweetener = data.find((o) => o.category === 'sweetener' && o.name.includes('Cane Sugar'));
      const defaultIce = data.find((o) => o.category === 'ice' && o.name.includes('Regular'));

      if (defaultSize) setSelectedSize(defaultSize.id);
      if (defaultSweetness) setSelectedSweetness(defaultSweetness.id);
      if (defaultSweetener) setSelectedSweetener(defaultSweetener.id);
      if (defaultIce) setSelectedIce(defaultIce.id);
    }
  };

  const getOptionsByCategory = (category: string) => {
    return options.filter((o) => {
      if (o.category !== category) return false;
      if (o.create_your_own_only && !drink.isCreateYourOwn) return false;
      return true;
    });
  };

  const calculateTotal = () => {
    let total = drink.price * quantity;

    const size = options.find((o) => o.id === selectedSize);
    if (size) total += size.price_modifier * quantity;

    selectedSyrups.forEach((syrupId) => {
      const syrup = options.find((o) => o.id === syrupId);
      if (syrup) total += syrup.price_modifier * quantity;
    });

    selectedAddIns.forEach((addInId) => {
      const addIn = options.find((o) => o.id === addInId);
      if (addIn) total += addIn.price_modifier * quantity;
    });

    if (selectedCandyStraw) {
      const candyStraw = options.find((o) => o.id === selectedCandyStraw);
      if (candyStraw) total += candyStraw.price_modifier * quantity;
    }

    return total;
  };

  const toggleSyrup = (id: string) => {
    setSelectedSyrups((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAddIn = (id: string) => {
    setSelectedAddIns((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginMessage(true);
      setTimeout(() => setShowLoginMessage(false), 3000);
      return;
    }

    const size = options.find((o) => o.id === selectedSize);
    const sweetener = options.find((o) => o.id === selectedSweetener);
    const ice = options.find((o) => o.id === selectedIce);

    addToCart({
      menuItemId: drink.id,
      menuItemName: drink.name,
      size: size?.name || 'Medium',
      iceLevel: ice?.name || 'Regular',
      sweetener: sweetener?.name || 'Cane Sugar',
      price: calculateTotal(),
      quantity
    });

    const customization = {
      drink,
      size,
      sweetness: options.find((o) => o.id === selectedSweetness),
      sweetener,
      ice,
      syrups: options.filter((o) => selectedSyrups.includes(o.id)),
      addIns: options.filter((o) => selectedAddIns.includes(o.id)),
      candyStraw: selectedCandyStraw ? options.find((o) => o.id === selectedCandyStraw) : null,
      quantity,
      total: calculateTotal(),
    };

    if (onAddToCart) {
      onAddToCart(customization);
    }
    onClose();
  };

  const handleSaveFavorite = async () => {
    if (!user) {
      setShowLoginMessage(true);
      setTimeout(() => setShowLoginMessage(false), 3000);
      return;
    }

    if (!favoriteName.trim()) {
      setFavoriteMessage('Please enter a name for your favorite');
      setTimeout(() => setFavoriteMessage(''), 3000);
      return;
    }

    setSavingFavorite(true);

    const size = options.find((o) => o.id === selectedSize);
    const sweetener = options.find((o) => o.id === selectedSweetener);
    const ice = options.find((o) => o.id === selectedIce);

    const { error } = await supabase.from('favorites').insert({
      user_id: user.id,
      menu_item_id: drink.id,
      name: favoriteName.trim(),
      size: size?.name || 'Medium',
      ice_level: ice?.name || 'Regular',
      sweetener: sweetener?.name || 'Cane Sugar',
      toppings: selectedAddIns,
      syrups: selectedSyrups,
      candy_straws: selectedCandyStraw ? [selectedCandyStraw] : []
    });

    setSavingFavorite(false);

    if (error) {
      setFavoriteMessage('Failed to save favorite');
      setTimeout(() => setFavoriteMessage(''), 3000);
    } else {
      setFavoriteMessage('Favorite saved successfully!');
      if (onFavoriteSaved) {
        onFavoriteSaved();
      }
      setTimeout(() => {
        setFavoriteMessage('');
        setShowSaveFavorite(false);
        setFavoriteName('');
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-effect-strong rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-400/20">
        <div className="sticky top-0 glass-effect-strong backdrop-blur-sm p-6 border-b border-gray-400/20 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white">{drink.name}</h2>
            <p className="text-gray-100/80 mt-1">{drink.description}</p>
            <p className="text-purple-300 font-semibold mt-2">Base Price: ${drink.price.toFixed(2)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-800/50 rounded-lg transition-colors text-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Size</h3>
            <div className="grid grid-cols-3 gap-3">
              {getOptionsByCategory('size').map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedSize(option.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedSize === option.id
                      ? 'border-purple-500 bg-purple-600/20 text-white'
                      : 'border-gray-400/20 glass-effect text-gray-100 hover:border-purple-600/50'
                  }`}
                >
                  <div className="font-medium">{option.name}</div>
                  {option.price_modifier > 0 && (
                    <div className="text-sm text-purple-300 mt-1">+${option.price_modifier.toFixed(2)}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Sweetness Level</h3>
            <div className="grid grid-cols-3 gap-3">
              {getOptionsByCategory('sweetness').map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedSweetness(option.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedSweetness === option.id
                      ? 'border-purple-500 bg-purple-600/20 text-white'
                      : 'border-gray-400/20 glass-effect text-gray-100 hover:border-purple-600/50'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Sweetener Type</h3>
            <div className="grid grid-cols-3 gap-3">
              {getOptionsByCategory('sweetener').map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedSweetener(option.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedSweetener === option.id
                      ? 'border-purple-500 bg-purple-600/20 text-white'
                      : 'border-gray-400/20 glass-effect text-gray-100 hover:border-purple-600/50'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Ice Level</h3>
            <div className="grid grid-cols-2 gap-3">
              {getOptionsByCategory('ice').map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedIce(option.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedIce === option.id
                      ? 'border-purple-500 bg-purple-600/20 text-white'
                      : 'border-gray-400/20 glass-effect text-gray-100 hover:border-purple-600/50'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          {drink.isCreateYourOwn && (
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-3">Syrup Flavors (Select Multiple)</h3>
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                {getOptionsByCategory('syrup').map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleSyrup(option.id)}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                      selectedSyrups.includes(option.id)
                        ? 'border-purple-500 bg-purple-600/20 text-white'
                        : 'border-gray-400/20 glass-effect text-gray-100 hover:border-purple-600/50'
                    }`}
                  >
                    <span>{option.name}</span>
                    <div className="flex items-center gap-2">
                      {option.price_modifier > 0 && (
                        <span className="text-sm text-purple-300">+${option.price_modifier.toFixed(2)}</span>
                      )}
                      {selectedSyrups.includes(option.id) && (
                        <Check size={18} className="text-purple-300" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {getOptionsByCategory('add_ins').length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-3">Add-Ins (Select Multiple)</h3>
              <div className="grid grid-cols-2 gap-3">
                {getOptionsByCategory('add_ins').map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleAddIn(option.id)}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                      selectedAddIns.includes(option.id)
                        ? 'border-purple-500 bg-purple-600/20 text-white'
                        : 'border-gray-400/20 glass-effect text-gray-100 hover:border-purple-600/50'
                    }`}
                  >
                    <span>{option.name}</span>
                    <div className="flex items-center gap-2">
                      {option.price_modifier > 0 && (
                        <span className="text-sm text-purple-300">+${option.price_modifier.toFixed(2)}</span>
                      )}
                      {selectedAddIns.includes(option.id) && (
                        <Check size={18} className="text-purple-300" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {getOptionsByCategory('candy_straws').length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-3">Candy Straws (Optional)</h3>
              <div className="grid grid-cols-2 gap-3">
                {getOptionsByCategory('candy_straws').map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedCandyStraw(selectedCandyStraw === option.id ? '' : option.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCandyStraw === option.id
                        ? 'border-purple-500 bg-purple-600/20 text-white'
                        : 'border-gray-400/20 glass-effect text-gray-100 hover:border-purple-600/50'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">{option.name}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-purple-300">+${option.price_modifier.toFixed(2)}</span>
                        {selectedCandyStraw === option.id && (
                          <Check size={18} className="text-purple-300" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 glass-effect hover:glass-effect-strong rounded-lg text-gray-100 transition-colors"
              >
                <Minus size={20} />
              </button>
              <span className="text-2xl font-bold text-white min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 glass-effect hover:glass-effect-strong rounded-lg text-gray-100 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 glass-effect-strong backdrop-blur-sm p-6 border-t border-gray-400/20">
          {showLoginMessage && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700/50 rounded-lg text-white text-center">
              Please log in to add items to your cart
            </div>
          )}
          {favoriteMessage && (
            <div className={`mb-4 p-3 border rounded-lg text-white text-center ${
              favoriteMessage.includes('success')
                ? 'bg-green-900/50 border-green-700/50'
                : 'bg-red-900/50 border-red-700/50'
            }`}>
              {favoriteMessage}
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg text-gray-100">Total</span>
            <span className="text-3xl font-bold text-purple-300">${calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowSaveFavorite(true)}
              className="px-6 py-4 glass-effect hover:glass-effect-strong text-gray-100 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Heart size={20} />
              Save
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Add to Order
            </button>
          </div>
        </div>
      </div>

      {showSaveFavorite && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="glass-effect-strong rounded-2xl p-6 max-w-md w-full border border-gray-400/20">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">Save as Favorite</h3>
              <button
                onClick={() => {
                  setShowSaveFavorite(false);
                  setFavoriteName('');
                }}
                className="p-2 hover:bg-purple-800/50 rounded-lg transition-colors text-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-100/80 mb-4">
              Give this customized drink a name so you can easily order it again later.
            </p>
            <input
              type="text"
              value={favoriteName}
              onChange={(e) => setFavoriteName(e.target.value)}
              placeholder="e.g., My Usual, Morning Boost..."
              className="w-full px-4 py-3 glass-effect border-2 border-gray-400/20 rounded-lg text-white placeholder-purple-300/40 focus:border-purple-500 focus:outline-none mb-4"
              maxLength={50}
            />
            <button
              onClick={handleSaveFavorite}
              disabled={savingFavorite}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-800 disabled:to-gray-800 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {savingFavorite ? 'Saving...' : 'Save Favorite'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
