import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import type { ShopifyCartLineItem } from '@/types/shopify';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: ShopifyCartLineItem;
  className?: string;
}

/**
 * CartItem component
 * 
 * Displays a cart item with image, details, quantity controls, and remove button
 */
export function CartItem({ item, className }: CartItemProps) {
  const { updateItem } = useCart();

  const productImage = item.merchandise.product.images.edges[0]?.node;
  const price = parseFloat(item.merchandise.price.amount);
  const totalPrice = parseFloat(item.cost.totalAmount.amount);
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: item.cost.totalAmount.currencyCode || 'USD',
  }).format(price);
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: item.cost.totalAmount.currencyCode || 'USD',
  }).format(totalPrice);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) {
      // Remove item by setting quantity to 0
      await updateItem(item.id, 0);
    } else {
      await updateItem(item.id, newQuantity);
    }
  };

  // Build variant title from selectedOptions, filtering out "Default Title"
  const variantTitle = item.merchandise.selectedOptions
    .filter((option) => {
      // Filter out "Default Title" and empty values
      const value = option.value?.trim().toLowerCase();
      return value && value !== 'default title' && value !== 'title';
    })
    .map((option) => `${option.name}: ${option.value}`)
    .join(', ');

  return (
    <div className={cn('flex gap-4 py-6 border-b last:border-0', className)}>
      {/* Product Image */}
      <Link
        to={`/shop/${item.merchandise.product.handle}`}
        className="flex-shrink-0"
        aria-label={`View ${item.merchandise.product.title}`}
      >
        <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-lunelle-cream">
          {productImage ? (
            <img
              src={productImage.url}
              alt={productImage.altText || item.merchandise.product.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <Link
              to={`/shop/${item.merchandise.product.handle}`}
              className="font-serif text-lg font-semibold hover:text-lunelle-pink transition-colors block"
            >
              {item.merchandise.product.title}
            </Link>
            {variantTitle && (
              <p className="text-sm text-muted-foreground mt-1">{variantTitle}</p>
            )}
            <p className="text-sm font-medium text-lunelle-taupe mt-2">{formattedPrice}</p>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleQuantityChange(0)}
            className="flex-shrink-0"
            aria-label="Remove item from cart"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-sm font-medium" aria-label="Quantity">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="font-semibold text-foreground">{formattedTotal}</p>
        </div>
      </div>
    </div>
  );
}

