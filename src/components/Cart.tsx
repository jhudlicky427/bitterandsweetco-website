import { useEffect, useState } from 'react';
import { Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Cart() {
  const { user } = useAuth();
  const { cartItems, removeFromCart, clearCart, cartTotal, cartCount, syncCart, isLoading } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    if (user && cartItems.length > 0 && !isLoading) {
      syncCart();
    }
  }, [cartItems.length]);

  const handleCheckout = async () => {
    await syncCart();
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      clearCart();
      setShowCheckout(false);
    }, 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-12 border border-gray-400/20 text-center transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-600/30 animate-fade-in-up">
            <ShoppingCart size={64} className="mx-auto mb-4 text-purple-400" />
            <h2 className="text-2xl font-bold text-white mb-2" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>Please Log In</h2>
            <p className="text-gray-200" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>You need to be logged in to view your cart and place orders.</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-12 border border-gray-400/20 text-center transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-600/30 animate-fade-in-up">
            <ShoppingCart size={64} className="mx-auto mb-4 text-purple-400" />
            <h2 className="text-2xl font-bold text-white mb-2" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>Your Cart is Empty</h2>
            <p className="text-gray-200" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>Add some delicious lemonades to get started!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-white mb-2" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.5)' }}>Your Order</h1>
          <p className="text-gray-200" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>{cartCount} {cartCount === 1 ? 'item' : 'items'} in cart</p>
        </div>

        <div className="glass-effect rounded-2xl border border-gray-400/20 overflow-hidden hover:shadow-2xl hover:shadow-purple-600/30 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-6 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="glass-effect border border-gray-400/20 rounded-xl p-4 flex items-start justify-between hover:border-purple-400/40 transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-600/20"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>{item.menuItemName}</h3>
                  <div className="space-y-1 text-sm text-gray-200">
                    <p>Size: {item.size}</p>
                    <p>Ice: {item.iceLevel}</p>
                    <p>Sweetener: {item.sweetener}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-purple-300 font-semibold mt-2">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-500 transform hover:scale-110 active:scale-95"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-400/20 p-6 bg-gradient-to-br from-indigo-600/30 to-purple-600/30">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xl text-gray-200">Total</span>
              <span className="text-3xl font-bold text-purple-300">${cartTotal.toFixed(2)}</span>
            </div>

            {checkoutSuccess ? (
              <div className="p-4 glass-effect border border-green-500/50 rounded-xl text-center animate-fade-in-up">
                <p className="text-green-300 font-semibold">Order Placed Successfully!</p>
                <p className="text-green-400/70 text-sm mt-1">We'll have your drinks ready soon.</p>
              </div>
            ) : showCheckout ? (
              <div className="space-y-4 animate-fade-in-up">
                <div className="p-4 glass-effect border border-purple-400/50 rounded-xl">
                  <p className="text-gray-200 text-sm mb-3">
                    For this demo, clicking "Complete Order" will save your order as pending.
                    In production, this would integrate with a payment processor.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCheckout}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-xl transition-all duration-500 shadow-xl hover:shadow-green-600/50 transform hover:scale-110 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <CreditCard size={20} />
                      Complete Order
                    </button>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="px-6 py-3 glass-effect border border-gray-400/20 hover:border-purple-400/40 text-gray-200 font-semibold rounded-xl transition-all duration-500 transform hover:scale-105 active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCheckout(true)}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-purple-600/50 transform hover:scale-110 active:scale-95 flex items-center justify-center gap-2"
                >
                  <CreditCard size={20} />
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="px-6 py-4 glass-effect border border-red-500/50 hover:bg-red-900/30 text-red-300 font-semibold rounded-xl transition-all duration-500 transform hover:scale-105 active:scale-95"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
