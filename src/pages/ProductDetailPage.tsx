import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SEO } from '@/components/ui/SEO';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useShopifyProduct } from '@/hooks/useShopifyProduct';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import type { ShopifyVariant, Product } from '@/types/shopify';
import { getProducts } from '@/lib/shopify';

/**
 * ProductDetailPage component
 * 
 * Features:
 * - Product gallery with thumbnails
 * - Product information and description
 * - Variant selectors (size, color, etc.)
 * - Add to cart functionality
 * - Related products section
 */
export default function ProductDetailPage() {
  const { productHandle } = useParams<{ productHandle: string }>();
  const { product, loading, error } = useShopifyProduct(productHandle);
  const { addItem } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Set default variant when product loads
  useEffect(() => {
    if (product && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // Fetch related products
  useEffect(() => {
    if (product) {
      getProducts({ first: 8 })
        .then(({ products }) => {
          // Filter out current product and limit to 4
          const filtered = products
            .filter((p) => p.id !== product.id)
            .slice(0, 4);
          setRelatedProducts(filtered);
        })
        .catch((error) => {
          console.error('Error fetching related products:', error);
        });
    }
  }, [product]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 md:px-6">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="font-serif text-2xl font-semibold mb-4">Product not found</h1>
            <p className="text-muted-foreground mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const currentVariant = selectedVariant || product.variants[0];
  const price = parseFloat(currentVariant.price.amount);
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currentVariant.price.currencyCode || 'USD',
  }).format(price);

  // Group variants by option type (e.g., Size, Color)
  const variantOptions = product.variants.reduce((acc, variant) => {
    variant.selectedOptions.forEach((option) => {
      if (!acc[option.name]) {
        acc[option.name] = new Set<string>();
      }
      acc[option.name].add(option.value);
    });
    return acc;
  }, {} as Record<string, Set<string>>);

  const handleAddToCart = async () => {
    if (!currentVariant) return;

    setIsAddingToCart(true);
    try {
      await addItem(currentVariant.id, quantity);
      toast.success('Added to cart', {
        description: `${product.title} has been added to your cart.`,
      });
      setQuantity(1);
    } catch (error) {
      toast.error('Failed to add to cart', {
        description: 'Please try again.',
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleVariantSelect = (optionName: string, optionValue: string) => {
    // Find variant that matches selected options
    const newSelectedOptions = currentVariant.selectedOptions.map((opt) =>
      opt.name === optionName ? { name: optionName, value: optionValue } : opt
    );

    const matchingVariant = product.variants.find((variant) => {
      return newSelectedOptions.every((selected) =>
        variant.selectedOptions.some(
          (opt) => opt.name === selected.name && opt.value === selected.value
        )
      );
    });

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  };

  return (
    <>
      <SEO
        title={`${product.title} - Lunelle`}
        description={product.description || `Shop ${product.title} at Lunelle`}
        image={product.images[0]?.url}
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
                  <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{product.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
              {/* Product Gallery */}
              <div>
                <ProductGallery images={product.images} productTitle={product.title} />
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl mb-4">
                    {product.title}
                  </h1>
                  <p className="text-2xl font-semibold text-lunelle-taupe">{formattedPrice}</p>
                </div>

                {product.description && (
                  <div>
                    <h2 className="font-serif text-lg font-semibold mb-2">Description</h2>
                    <div
                      className="text-muted-foreground prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                    />
                  </div>
                )}

                <Separator />

                {/* Variant Selectors */}
                {Object.keys(variantOptions).length > 0 ? (
                  Object.entries(variantOptions).map(([optionName, optionValues]) => (
                    <div key={optionName}>
                      <label className="text-sm font-medium mb-2 block">
                        {optionName}
                      </label>
                      <Select
                        value={
                          currentVariant.selectedOptions.find((opt) => opt.name === optionName)
                            ?.value || ''
                        }
                        onValueChange={(value) => handleVariantSelect(optionName, value)}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder={`Select ${optionName}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(optionValues).map((value) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))
                ) : null}

                {/* Quantity Selector */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Quantity</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  size="lg"
                  className="w-full bg-lunelle-pink hover:bg-lunelle-pink/90 text-foreground"
                  onClick={handleAddToCart}
                  disabled={!currentVariant.availableForSale || isAddingToCart}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {isAddingToCart ? 'Adding...' : currentVariant.availableForSale ? 'Add to Cart' : 'Sold Out'}
                </Button>

                {!currentVariant.availableForSale && (
                  <p className="text-sm text-muted-foreground text-center">
                    This item is currently out of stock.
                  </p>
                )}
              </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <div className="mt-16">
                <h2 className="font-serif text-2xl font-semibold mb-8 text-center">
                  You may also like
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <ProductCard key={relatedProduct.id} product={relatedProduct} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

