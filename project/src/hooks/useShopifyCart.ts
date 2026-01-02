import { useState, useEffect } from 'react';
import { getCart, createCart, addToCart, updateCart } from '../lib/shopify';
import type { ShopifyCart } from '../types/shopify';

const CART_STORAGE_KEY = 'lunelle_cart_id';

export interface UseShopifyCartResult {
  cart: ShopifyCart | null;
  loading: boolean;
  error: Error | null;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

/**
 * Hook to manage Shopify cart
 * 
 * Persists cart ID in localStorage and provides functions to add/update items
 * 
 * @returns Cart data, loading state, error state, and cart manipulation functions
 */
export function useShopifyCart(): UseShopifyCartResult {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [cartId, setCartId] = useState<string | null>(() => {
    // Load cart ID from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem(CART_STORAGE_KEY);
    }
    return null;
  });

  // Save cart ID to localStorage whenever it changes
  useEffect(() => {
    if (cartId && typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, cartId);
    }
  }, [cartId]);

  const fetchCart = async (id: string | null) => {
    if (!id) {
      // Create new cart if no ID exists
      try {
        const newCart = await createCart();
        setCartId(newCart.id);
        setCart(newCart);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to create cart'));
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const fetchedCart = await getCart(id);
      
      if (fetchedCart) {
        setCart(fetchedCart);
      } else {
        // Cart doesn't exist, create a new one
        const newCart = await createCart();
        setCartId(newCart.id);
        setCart(newCart);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch cart'));
      // Try to create a new cart on error
      try {
        const newCart = await createCart();
        setCartId(newCart.id);
        setCart(newCart);
      } catch (createErr) {
        // Failed to create cart too
        setCart(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart(cartId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addItem = async (variantId: string, quantity: number = 1) => {
    if (!cartId) {
      // Create cart first if it doesn't exist
      try {
        const newCart = await createCart();
        setCartId(newCart.id);
        const updatedCart = await addToCart(newCart.id, variantId, quantity);
        setCart(updatedCart);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to add item to cart'));
        throw err;
      }
    } else {
      try {
        setError(null);
        const updatedCart = await addToCart(cartId, variantId, quantity);
        setCart(updatedCart);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to add item to cart'));
        throw err;
      }
    }
  };

  const updateItem = async (lineId: string, quantity: number) => {
    if (!cartId) {
      throw new Error('Cart not initialized');
    }

    try {
      setError(null);
      const updatedCart = await updateCart(cartId, lineId, quantity);
      setCart(updatedCart);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update cart item'));
      throw err;
    }
  };

  const refreshCart = async () => {
    if (cartId) {
      await fetchCart(cartId);
    }
  };

  return {
    cart,
    loading,
    error,
    addItem,
    updateItem,
    refreshCart,
  };
}

