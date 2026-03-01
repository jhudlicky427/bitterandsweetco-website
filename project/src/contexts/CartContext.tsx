import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CartItem {
  id?: string;
  menuItemId: string;
  menuItemName: string;
  size: string;
  iceLevel: string;
  sweetener: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  currentOrder: any;
  syncCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadCurrentOrder();
    } else {
      setCartItems([]);
      setCurrentOrder(null);
    }
  }, [user]);

  const loadCurrentOrder = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (orderError) throw orderError;

      if (orders) {
        setCurrentOrder(orders);

        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orders.id);

        if (itemsError) throw itemsError;

        if (items) {
          setCartItems(items.map(item => ({
            id: item.id,
            menuItemId: item.menu_item_id,
            menuItemName: item.menu_item_name,
            size: item.size,
            iceLevel: item.ice_level,
            sweetener: item.sweetener,
            price: parseFloat(item.price),
            quantity: item.quantity
          })));
        }
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncCart = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      let orderId = currentOrder?.id;

      if (!orderId) {
        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            status: 'pending',
            total_amount: 0
          })
          .select()
          .single();

        if (orderError) throw orderError;
        orderId = newOrder.id;
        setCurrentOrder(newOrder);
      }

      const { error: deleteError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);

      if (deleteError) throw deleteError;

      if (cartItems.length > 0) {
        const { error: insertError } = await supabase
          .from('order_items')
          .insert(
            cartItems.map(item => ({
              order_id: orderId,
              menu_item_id: item.menuItemId,
              menu_item_name: item.menuItemName,
              quantity: item.quantity,
              size: item.size,
              ice_level: item.iceLevel,
              sweetener: item.sweetener,
              price: item.price
            }))
          );

        if (insertError) throw insertError;
      }

      await loadCurrentOrder();
    } catch (error) {
      console.error('Error syncing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (item: CartItem) => {
    setCartItems(prev => [...prev, item]);
  };

  const removeFromCart = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount,
      currentOrder,
      syncCart,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
