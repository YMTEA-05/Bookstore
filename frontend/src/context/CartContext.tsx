import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // We need auth to get the token

const API_URL = 'http://localhost:4000';

interface CartItem {
  Book_ID: number;
  Title: string;
  Author: string;
  Price: number;
  Stock: number;
  Quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  fetchCart: () => void;
  addItemToCart: (bookId: number, quantity: number) => Promise<void>;
  removeItemFromCart: (bookId: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { token, isAuthenticated } = useAuth(); // Get user's auth state

  // Create an axios instance that includes the auth token
  const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // Fetch the cart from the DB when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]); // Clear cart on logout
    }
  }, [isAuthenticated, token]); // Re-run if auth state changes

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await authAxios.get('/cart');
      setCartItems(data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = async (bookId: number, quantity: number) => {
    try {
      await authAxios.post('/cart', { bookId, quantity });
      // After adding, refresh the cart to show the new item
      await fetchCart();
    } catch (error) {
      console.error('Failed to add item', error);
      throw error; // Re-throw so the component can handle it
    }
  };

  const removeItemFromCart = async (bookId: number) => {
    try {
      await authAxios.delete(`/cart/${bookId}`);
      // After deleting, refresh the cart
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove item', error);
      throw error; // Re-throw
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, loading, fetchCart, addItemToCart, removeItemFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};