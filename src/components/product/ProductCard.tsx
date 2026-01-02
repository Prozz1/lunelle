import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/types/shopify';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

/**
 * ProductCard component
 * 
 * Displays a product in a card format with image, title, and price
 * Ready for Shopify product data structure
 */
export function ProductCard({ product, className }: ProductCardProps) {
  const firstImage = product.images[0];
  const price = parseFloat(product.price);
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.currencyCode || 'USD',
  }).format(price);

  // Extract available sizes from variants
  const availableSizes = new Set<string>();
  product.variants.forEach((variant) => {
    variant.selectedOptions.forEach((option) => {
      // Check if this is a size option (case-insensitive)
      if (option.name.toLowerCase() === 'size') {
        availableSizes.add(option.value);
      }
    });
  });
  const sizesArray = Array.from(availableSizes).sort();

  return (
    <Link
      to={`/shop/${product.handle}`}
      className={cn('group block', className)}
      aria-label={`View ${product.title}`}
    >
      <Card className="overflow-hidden border-0 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-lunelle-cream">
          {firstImage ? (
            <img
              src={firstImage.url}
              alt={firstImage.altText || product.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
          {!product.availableForSale && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white px-3 py-1 text-sm font-medium text-foreground">
                Sold Out
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-1 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-sm font-medium text-lunelle-taupe mb-1">
            {formattedPrice}
          </p>
          {sizesArray.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Sizes: {sizesArray.join(', ')}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

