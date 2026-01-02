import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ShopifyImage } from '@/types/shopify';

interface ProductGalleryProps {
  images: ShopifyImage[];
  productTitle: string;
  className?: string;
}

/**
 * ProductGallery component
 * 
 * Displays product images with thumbnail navigation
 * Supports zoom on hover for desktop
 */
export function ProductGallery({ images, productTitle, className }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = images[selectedImageIndex];

  if (images.length === 0) {
    return (
      <div className={cn('flex items-center justify-center bg-lunelle-cream aspect-square rounded-lg', className)}>
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-lunelle-cream group">
        <img
          src={selectedImage.url}
          alt={selectedImage.altText || `${productTitle} - Image ${selectedImageIndex + 1}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="eager"
        />
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={cn(
                'relative flex-shrink-0 aspect-square w-20 overflow-hidden rounded border-2 transition-all',
                selectedImageIndex === index
                  ? 'border-lunelle-pink ring-2 ring-lunelle-pink/20'
                  : 'border-transparent hover:border-lunelle-pink/50'
              )}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-pressed={selectedImageIndex === index}
            >
              <img
                src={image.url}
                alt={image.altText || `${productTitle} thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

