import { useState, useEffect } from 'react';
import { getProducts } from '../lib/shopify';
import type { Product } from '../types/shopify';

export interface UseShopifyProductsOptions {
  first?: number;
  query?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
}

export interface UseShopifyProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch products from Shopify Storefront API
 * 
 * @param options - Query options for filtering products
 * @returns Products array, loading state, error state, and pagination helpers
 */
export function useShopifyProducts(options: UseShopifyProductsOptions = {}): UseShopifyProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | undefined>();

  const fetchProducts = async (append = false) => {
    try {
      setLoading(true);
      setError(null);

      // Build query string for Shopify product filtering
      // If query is explicitly provided, use it. Otherwise, build from individual options
      let query: string | undefined;
      
      if (options.query !== undefined) {
        // Use the provided query directly (could be undefined to fetch all products)
        query = options.query;
      } else {
        // Build query from individual filter options
        const queryParts: string[] = [];
        
        if (options.category) {
          queryParts.push(`product_type:${options.category}`);
        }
        
        if (options.priceMin !== undefined) {
          queryParts.push(`variants.price:>=${options.priceMin}`);
        }
        
        if (options.priceMax !== undefined) {
          queryParts.push(`variants.price:<=${options.priceMax}`);
        }

        query = queryParts.length > 0 ? queryParts.join(' AND ') : undefined;
      }

      const result = await getProducts({
        first: options.first || 20,
        after: append ? endCursor : undefined,
        query,
      });

      if (append) {
        setProducts((prev) => [...prev, ...result.products]);
      } else {
        setProducts(result.products);
      }

      setHasNextPage(result.hasNextPage);
      setEndCursor(result.endCursor);
    } catch (err) {
      console.error('Error fetching products:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(new Error(errorMessage));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.category, options.priceMin, options.priceMax, options.query]);

  const loadMore = async () => {
    if (hasNextPage && !loading) {
      await fetchProducts(true);
    }
  };

  const refetch = async () => {
    setEndCursor(undefined);
    await fetchProducts(false);
  };

  return {
    products,
    loading,
    error,
    hasNextPage,
    loadMore,
    refetch,
  };
}

