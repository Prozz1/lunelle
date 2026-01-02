import { useState, useEffect } from 'react';
import { getProduct } from '../lib/shopify';
import type { Product } from '../types/shopify';

export interface UseShopifyProductResult {
  product: Product | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch a single product by handle from Shopify Storefront API
 * 
 * @param handle - Product handle (slug)
 * @returns Product data, loading state, error state, and refetch function
 */
export function useShopifyProduct(handle: string | undefined): UseShopifyProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = async () => {
    if (!handle) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await getProduct(handle);
      setProduct(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch product'));
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle]);

  const refetch = async () => {
    await fetchProduct();
  };

  return {
    product,
    loading,
    error,
    refetch,
  };
}

