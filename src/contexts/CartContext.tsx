import { createContext, useContext, ReactNode } from 'react';
import { useShopifyCart } from '../hooks/useShopifyCart';
import type { ShopifyCart, ShopifyCartLineItem } from '../types/shopify';

interface CartContextType {
  cart: ShopifyCart | null;
  loading: boolean;
  error: Error | null;
  itemCount: number;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  checkoutUrl: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

/**
 * Cart Context Provider
 * 
 * Provides global cart state and functions to all components
 * Wraps the useShopifyCart hook for easy access throughout the app
 */
export function CartProvider({ children }: CartProviderProps) {
  const { cart, loading, error, addItem, updateItem, refreshCart } = useShopifyCart();

  const itemCount = cart?.totalQuantity || 0;
  const checkoutUrl = cart?.checkoutUrl || null;

  const value: CartContextType = {
    cart,
    loading,
    error,
    itemCount,
    addItem,
    updateItem,
    refreshCart,
    checkoutUrl,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook to access cart context
 * 
 * @throws Error if used outside of CartProvider
 * @returns Cart context value
 */
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

/**
 * Helper function to get cart items as a flat array
 */
export function getCartItems(cart: ShopifyCart | null): ShopifyCartLineItem[] {
  if (!cart) return [];
  return cart.lines.edges.map((edge) => edge.node);
}

