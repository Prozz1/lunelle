import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useShopifyCollections } from '@/hooks/useShopifyCollections';

export interface FilterOptions {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  colors?: string[];
}

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
  isMobile?: boolean;
}

const colors = ['Pink', 'Beige', 'White', 'Taupe', 'Black', 'Rose Gold', 'Pearl'];

/**
 * FilterSidebar component
 * 
 * Provides filtering options for products (category, price, color)
 * Renders as a sidebar on desktop, Sheet drawer on mobile
 */
export function FilterSidebar({
  filters,
  onFiltersChange,
  className,
  isMobile = false,
}: FilterSidebarProps) {
  // Fetch categories from Shopify collections
  const { collections, loading: collectionsLoading } = useShopifyCollections(20);
  const categories = collections.map((collection) => collection.title);
  
  const [priceRange, setPriceRange] = useState<number[]>([
    filters.priceMin || 0,
    filters.priceMax || 1000,
  ]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    updateFilter('priceMin', values[0]);
    updateFilter('priceMax', values[1]);
  };

  const handleCategoryToggle = (category: string) => {
    updateFilter('category', filters.category === category ? undefined : category);
  };

  const handleColorToggle = (color: string) => {
    const currentColors = filters.colors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter((c) => c !== color)
      : [...currentColors, color];
    updateFilter('colors', newColors.length > 0 ? newColors : undefined);
  };

  const clearFilters = () => {
    onFiltersChange({});
    setPriceRange([0, 1000]);
  };

  const hasActiveFilters = filters.category || filters.priceMin || filters.priceMax || (filters.colors && filters.colors.length > 0);

  const filterContent = (
    <div className="space-y-8">
      {/* Category Filter */}
      <div>
        <h3 className="font-serif text-lg font-semibold mb-4">Category</h3>
        {collectionsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-5 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.category === category}
                  onCheckedChange={() => handleCategoryToggle(category)}
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No categories available</p>
        )}
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-serif text-lg font-semibold mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h3 className="font-serif text-lg font-semibold mb-4">Color</h3>
        <div className="space-y-3">
          {colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={filters.colors?.includes(color) || false}
                onCheckedChange={() => handleColorToggle(color)}
              />
              <label
                htmlFor={`color-${color}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {color}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full md:hidden">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-lunelle-pink text-xs text-white">
                1
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">{filterContent}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className={cn('w-64 space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {filterContent}
    </aside>
  );
}

