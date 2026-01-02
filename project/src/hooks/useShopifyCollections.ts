import { useState, useEffect } from 'react';
import { getCollections } from '../lib/shopify';
import type { ShopifyCollection } from '../types/shopify';

export interface UseShopifyCollectionsResult {
  collections: ShopifyCollection[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch collections from Shopify Storefront API
 * 
 * @param first - Number of collections to fetch (default: 10)
 * @returns Collections array, loading state, error state, and refetch function
 */
export function useShopifyCollections(first: number = 10): UseShopifyCollectionsResult {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getCollections(first);
      setCollections(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch collections'));
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [first]);

  const refetch = async () => {
    await fetchCollections();
  };

  return {
    collections,
    loading,
    error,
    refetch,
  };
}

