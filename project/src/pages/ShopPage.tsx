import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGrid } from '@/components/product/ProductGrid';
import { FilterSidebar, type FilterOptions } from '@/components/product/FilterSidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { SEO } from '@/components/ui/SEO';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Product } from '@/types/shopify';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name';

/**
 * ShopPage component
 * 
 * Features:
 * - Product grid with filtering and sorting
 * - Filter sidebar (desktop) / Sheet drawer (mobile)
 * - Breadcrumb navigation
 * - Empty states
 */
export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || undefined;

  const [filters, setFilters] = useState<FilterOptions>({
    category: categoryFromUrl,
  });
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [isMobile] = useState(window.innerWidth < 768);

  // Build query for Shopify
  // NOTE: Using product_type filter - this must match the productType field in Shopify
  // If products don't show, the category names might not match product types
  const shopifyQuery = useMemo(() => {
    if (!filters.category) {
      // No category filter - fetch all products
      return undefined;
    }
    // Use product_type filter to match against Shopify productType field
    return `product_type:${filters.category}`;
  }, [filters.category]);

  const { products, loading, error } = useShopifyProducts({
    query: shopifyQuery,
    first: 50,
  });

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortOption) {
      case 'price-low':
        return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price-high':
        return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'newest':
      default:
        return sorted;
    }
  }, [products, sortOption]);

  // Filter by price and color (client-side since Shopify query has limitations)
  const filteredProducts = useMemo(() => {
    let filtered = sortedProducts;

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      filtered = filtered.filter((product) => {
        const price = parseFloat(product.price);
        const min = filters.priceMin ?? 0;
        const max = filters.priceMax ?? Infinity;
        return price >= min && price <= max;
      });
    }

    // Note: Color filtering would need to be implemented based on product tags or variants
    // This is a placeholder for future implementation

    return filtered;
  }, [sortedProducts, filters.priceMin, filters.priceMax]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // Update URL if category changed
    if (newFilters.category !== categoryFromUrl) {
      if (newFilters.category) {
        setSearchParams({ category: newFilters.category });
      } else {
        setSearchParams({});
      }
    }
  };

  return (
    <>
      <SEO
        title="Shop - Lunelle"
        description="Browse our complete collection of luxury jewelry, bags, shoes, and clothing."
      />
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Shop</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="font-serif text-4xl font-semibold text-foreground md:text-5xl mb-4">
                Shop
              </h1>
              <p className="text-muted-foreground">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>

            {/* Filters and Sort Bar */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isMobile={isMobile}
              />
              <div className="flex items-center gap-4">
                <label htmlFor="sort" className="text-sm font-medium text-muted-foreground">
                  Sort by:
                </label>
                <Select
                  value={sortOption}
                  onValueChange={(value) => setSortOption(value as SortOption)}
                >
                  <SelectTrigger id="sort" className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {error ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-lg font-medium text-destructive mb-2">
                  Error loading products
                </p>
                <p className="text-sm text-muted-foreground">
                  {error.message}
                </p>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} loading={loading} />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

