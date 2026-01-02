import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartItem } from '@/components/cart/CartItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { SEO } from '@/components/ui/SEO';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useCart, getCartItems } from '@/contexts/CartContext';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

/**
 * CartPage component
 * 
 * Features:
 * - Cart items list with quantity controls
 * - Order summary with totals
 * - Checkout button (links to Shopify checkout)
 * - Empty cart state
 */
export default function CartPage() {
  const { cart, loading, checkoutUrl } = useCart();
  const cartItems = getCartItems(cart);

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

  const subtotal = cart?.cost.subtotalAmount.amount || '0';
  const total = cart?.cost.totalAmount.amount || '0';
  const currencyCode = cart?.cost.totalAmount.currencyCode || 'USD';

  const formattedSubtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(subtotal));

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(total));

  const handleCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  return (
    <>
      <SEO title="Shopping Cart - Lunelle" description="Review your cart and proceed to checkout." />
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
                  <BreadcrumbPage>Shopping Cart</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <h1 className="font-serif text-4xl font-semibold text-foreground md:text-5xl mb-8">
              Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
              /* Empty Cart State */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="font-serif text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-8">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Link to="/shop">
                  <Button size="lg" className="bg-lunelle-pink hover:bg-lunelle-pink/90 text-foreground">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="rounded-lg border bg-card p-6">
                    {cartItems.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>

                  <Link to="/shop" className="mt-6 inline-flex items-center text-sm text-muted-foreground hover:text-lunelle-pink transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Link>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{formattedSubtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">Calculated at checkout</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>{formattedTotal}</span>
                      </div>
                      <Button
                        size="lg"
                        className="w-full bg-lunelle-pink hover:bg-lunelle-pink/90 text-foreground"
                        onClick={handleCheckout}
                        disabled={!checkoutUrl}
                      >
                        Proceed to Checkout
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Shipping will be calculated at checkout
                      </p>
                    </CardContent>
                  </Card>
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

