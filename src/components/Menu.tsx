import { useEffect, useState } from 'react';
import { supabase, MenuItem } from '../lib/supabase';
import { Loader2, DollarSign, Sparkles, ShoppingCart, CreditCard, Heart, Trash2, Clock, Package, Plus } from 'lucide-react';
import DrinkCustomizer from './DrinkCustomizer';
import CheckoutModal from './CheckoutModal';
import { useAuth } from '../contexts/AuthContext';

interface CreateYourOwnBase {
  id: string;
  type: string;
  name: string;
  base_price: number;
  description: string;
}

interface CartItem {
  drink: any;
  customization: any;
}

interface Favorite {
  id: string;
  menu_item_id: string;
  name: string;
  size: string;
  ice_level: string;
  sweetener: string;
  toppings: string[];
  syrups: string[];
  candy_straws: string[];
  menu_item?: MenuItem;
}

interface OrderItem {
  id: string;
  menu_item_name: string;
  quantity: number;
  size: string;
  ice_level: string;
  sweetener: string;
  price: number;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  order_items: OrderItem[];
}

export default function Menu() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [createYourOwnBases, setCreateYourOwnBases] = useState<CreateYourOwnBase[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customizingDrink, setCustomizingDrink] = useState<any | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutDrink, setCheckoutDrink] = useState<any | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    fetchMenuData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchFavorites();
      fetchOrders();
    } else {
      setFavorites([]);
      setOrders([]);
    }
  }, [user]);

  const fetchMenuData = async () => {
    try {
      const [menuResponse, createYourOwnResponse] = await Promise.all([
        supabase
          .from('menu_items')
          .select('*')
          .eq('is_available', true)
          .order('display_order'),
        supabase
          .from('create_your_own_bases')
          .select('*')
          .eq('is_active', true)
      ]);

      if (menuResponse.error) throw menuResponse.error;
      if (createYourOwnResponse.error) throw createYourOwnResponse.error;

      setMenuItems(menuResponse.data || []);
      setCreateYourOwnBases(createYourOwnResponse.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        menu_item:menu_items(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setFavorites(data.map(fav => ({
        ...fav,
        menu_item: Array.isArray(fav.menu_item) ? fav.menu_item[0] : fav.menu_item
      })));
    }
  };

  const handleDeleteFavorite = async (favoriteId: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', favoriteId);

    if (!error) {
      setFavorites(favorites.filter(f => f.id !== favoriteId));
    }
  };

  const handleAddFavoriteToCart = (favorite: Favorite) => {
    if (!favorite.menu_item) return;

    const customization = {
      drink: {
        id: favorite.menu_item_id,
        name: favorite.menu_item.name,
        price: favorite.menu_item.price,
        description: favorite.menu_item.description
      },
      size: { name: favorite.size },
      ice: { name: favorite.ice_level },
      sweetener: { name: favorite.sweetener },
      syrups: [],
      addIns: [],
      candyStraw: favorite.candy_straws.length > 0 ? { id: favorite.candy_straws[0] } : null,
      quantity: 1,
      total: favorite.menu_item.price
    };

    setCart([...cart, { drink: customization.drink, customization }]);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  const fetchOrders = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        total_amount,
        created_at,
        order_items (
          id,
          menu_item_name,
          quantity,
          size,
          ice_level,
          sweetener,
          price
        )
      `)
      .eq('user_id', user.id)
      .in('status', ['paid', 'completed'])
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setOrders(data as Order[]);
    }
  };

  const handleReorderItem = (item: OrderItem) => {
    const customization = {
      drink: {
        name: item.menu_item_name,
        price: item.price
      },
      size: { name: item.size },
      ice: { name: item.ice_level },
      sweetener: { name: item.sweetener },
      syrups: [],
      addIns: [],
      candyStraw: null,
      quantity: item.quantity,
      total: item.price * item.quantity
    };

    setCart([...cart, { drink: customization.drink, customization }]);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  const handleReorderEntireOrder = (order: Order) => {
    const newCartItems = order.order_items.map(item => {
      const customization = {
        drink: {
          name: item.menu_item_name,
          price: item.price
        },
        size: { name: item.size },
        ice: { name: item.ice_level },
        sweetener: { name: item.sweetener },
        syrups: [],
        addIns: [],
        candyStraw: null,
        quantity: item.quantity,
        total: item.price * item.quantity
      };
      return { drink: customization.drink, customization };
    });

    setCart([...cart, ...newCartItems]);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  const handleAddToCart = (customization: any) => {
    setCart([...cart, { drink: customizingDrink, customization }]);
  };

  const handleCheckoutComplete = () => {
    setCheckoutDrink(null);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const getCategoryTitle = (category: string) => {
    const titles: Record<string, string> = {
      classic: 'Classic Favorites',
      signature: 'Signature Creations',
      seasonal: 'Seasonal Specials',
      tea: 'Flavored Teas',
      dirty_soda: 'Dirty Sodas',
    };
    return titles[category] || category;
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

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
          <p className="text-xl text-red-400">Failed to load menu</p>
          <p className="text-gray-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-24">
      <div className="max-w-6xl mx-auto">
        {cart.length > 0 && (
          <div className="fixed top-24 right-6 z-40 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-purple-600/50 transition-all duration-500 hover:scale-105 flex items-center gap-2">
            <ShoppingCart size={20} />
            <span className="font-semibold">{cart.length} items</span>
          </div>
        )}

        {showSuccessMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-bounce">
            <span className="font-semibold">Order placed successfully!</span>
          </div>
        )}

        <div className="text-center space-y-4 mb-16 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
            Our Menu
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
            Each recipe is uniquely ours, tweaked to perfection with premium ingredients and a passion for flavor.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-6 animate-pulse-glow"></div>
        </div>

        {user && favorites.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-bold text-purple-300 mb-3 flex items-center justify-center gap-3" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
                <Heart className="text-pink-400 fill-pink-400" />
                My Favorites
                <Heart className="text-pink-400 fill-pink-400" />
              </h3>
              <p className="text-gray-200" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>Your saved customized drinks for quick ordering</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-400/20 hover:border-pink-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-600/20 hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-1" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                        {favorite.name}
                      </h4>
                      <p className="text-purple-300 font-medium" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                        {favorite.menu_item?.name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteFavorite(favorite.id)}
                      className="p-2 hover:bg-pink-900/50 rounded-lg transition-all duration-500 text-pink-400 hover:text-pink-300 hover:scale-110"
                      title="Remove favorite"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="space-y-1 text-sm text-gray-200 mb-4" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                    <p>Size: {favorite.size}</p>
                    <p>Ice: {favorite.ice_level}</p>
                    <p>Sweetener: {favorite.sweetener}</p>
                    {favorite.syrups.length > 0 && (
                      <p className="text-purple-300">+ Custom syrups</p>
                    )}
                    {favorite.toppings.length > 0 && (
                      <p className="text-purple-300">+ Add-ins</p>
                    )}
                    {favorite.candy_straws.length > 0 && (
                      <p className="text-purple-300">+ Candy straw</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddFavoriteToCart(favorite)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-500 shadow-md hover:shadow-lg hover:shadow-purple-600/50 hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {user && orders.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-bold text-purple-300 mb-3 flex items-center justify-center gap-3" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
                <Clock className="text-indigo-400" />
                Previous Orders
                <Clock className="text-indigo-400" />
              </h3>
              <p className="text-gray-200" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>Your recent order history - reorder with one click</p>
            </div>
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-400/20 hover:border-indigo-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-600/20"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="text-indigo-400" size={24} />
                        <div>
                          <p className="text-white font-semibold text-lg" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                            Order #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-gray-200 text-sm" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed'
                            ? 'bg-green-900/50 text-green-300 border border-green-600/30'
                            : 'bg-indigo-900/50 text-indigo-300 border border-indigo-600/30'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                        <span className="text-purple-400 font-bold text-lg" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                          ${order.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleReorderEntireOrder(order)}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-500 shadow-md hover:shadow-lg hover:shadow-purple-600/50 hover:scale-105 flex items-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Reorder All
                    </button>
                  </div>

                  <div className="space-y-3 border-t border-gray-400/20 pt-4">
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-purple-950/20 rounded-lg p-4 border border-gray-400/20"
                      >
                        <div className="flex-1">
                          <p className="text-white font-semibold mb-1" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                            {item.quantity}x {item.menu_item_name}
                          </p>
                          <div className="flex gap-4 text-sm text-gray-200" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                            <span>{item.size}</span>
                            <span>•</span>
                            <span>{item.ice_level} ice</span>
                            <span>•</span>
                            <span>{item.sweetener}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-purple-400 font-semibold" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleReorderItem(item)}
                            className="px-4 py-2 bg-purple-700/40 hover:bg-purple-600/60 text-white font-medium rounded-lg transition-all duration-500 border border-gray-400/20 hover:border-purple-500 hover:scale-105 flex items-center gap-2"
                          >
                            <Plus size={16} />
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {createYourOwnBases.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-bold text-purple-300 mb-3 flex items-center justify-center gap-3" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
                <Sparkles className="text-pink-400" />
                Create Your Own
                <Sparkles className="text-pink-400" />
              </h3>
              <p className="text-gray-200" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>Build your perfect drink exactly how you want it!</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {createYourOwnBases.map((base, index) => (
                <div
                  key={base.id}
                  className="group glass-effect rounded-2xl p-8 border-2 border-gray-400/20 hover:border-pink-400/70 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-600/40 cursor-pointer transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setCustomizingDrink({ id: base.id, name: base.name, price: base.base_price, description: base.description, isCreateYourOwn: true })}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="text-center relative">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600/40 to-purple-800/40 mb-4 shadow-lg group-hover:shadow-purple-600/50 transition-all duration-500">
                      <Sparkles className="text-pink-300 animate-float" size={36} />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
                      {base.name}
                    </h4>
                    <p className="text-gray-200 mb-6 leading-relaxed" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                      {base.description}
                    </p>
                    <div className="flex items-center justify-center text-purple-400 font-bold text-2xl mb-6">
                      <span className="text-gray-200 text-base mr-2" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>Starting at </span>
                      <span className="bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent flex items-center">
                        <DollarSign size={20} className="text-purple-400" />
                        {base.base_price.toFixed(2)}
                      </span>
                    </div>
                    <button className="w-full px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold rounded-xl transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-purple-600/40 transform hover:scale-105 relative overflow-hidden group/btn">
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover/btn:opacity-30 transition-opacity duration-500"></span>
                      <span className="relative z-10">Customize Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-16">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-3xl font-bold text-purple-300 mb-8 text-center md:text-left" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
                {getCategoryTitle(category)}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="group glass-effect rounded-2xl p-6 border border-gray-400/20 hover:border-purple-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/30 transform hover:-translate-y-1 hover:scale-105 animate-fade-in-up relative overflow-hidden"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="flex justify-between items-start mb-3 relative">
                      <h4 className="text-2xl font-bold text-white" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
                        {item.name}
                      </h4>
                      <div className="flex items-center text-purple-400 font-bold text-xl ml-4 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                        <DollarSign size={18} className="text-purple-400" />
                        {item.price.toFixed(2)}
                      </div>
                    </div>
                    <p className="text-gray-200 leading-relaxed mb-4 relative" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
                      {item.description}
                    </p>
                    <div className="flex gap-2 relative">
                      <button
                        onClick={() => setCustomizingDrink({ id: item.id, name: item.name, price: item.price, description: item.description })}
                        className="flex-1 px-4 py-2.5 glass-effect hover:glass-effect text-white hover:text-white font-semibold rounded-xl transition-all duration-500 border border-gray-400/20 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-600/50 transform hover:scale-105"
                      >
                        Customize
                      </button>
                      <button
                        onClick={() => setCheckoutDrink({ id: item.id, name: item.name, price: item.price, description: item.description })}
                        className="group/btn flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-500 hover:to-pink-600 text-white font-bold rounded-xl transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-purple-600/40 flex items-center justify-center gap-2 transform hover:scale-105 relative overflow-hidden"
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-400 to-pink-400 opacity-0 group-hover/btn:opacity-30 transition-opacity duration-500"></span>
                        <CreditCard size={16} className="relative z-10" />
                        <span className="relative z-10">Buy Now</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center space-y-4">
          <div className="inline-block bg-purple-900/30 rounded-lg px-8 py-6 border border-gray-400/20">
            <p className="text-white text-lg font-semibold mb-2" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
              Every drink is fully customizable!
            </p>
            <p className="text-gray-200" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
              Choose your size, sweetness, ice level, add-ins, and don't forget the candy straw!
            </p>
          </div>
        </div>
      </div>

      {customizingDrink && (
        <DrinkCustomizer
          drink={customizingDrink}
          onClose={() => setCustomizingDrink(null)}
          onAddToCart={handleAddToCart}
          onFavoriteSaved={fetchFavorites}
        />
      )}

      {checkoutDrink && (
        <CheckoutModal
          drink={checkoutDrink}
          onClose={() => setCheckoutDrink(null)}
          onComplete={handleCheckoutComplete}
        />
      )}
    </div>
  );
}
