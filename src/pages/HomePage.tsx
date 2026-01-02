import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { SEO } from '@/components/ui/SEO';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProductCard } from '@/components/product/ProductCard';

/**
 * HomePage component
 * 
 * Features:
 * - Hero section with brand messaging
 * - Featured collections grid
 * - About brand section
 * - Newsletter signup
 * - Instagram feed placeholder
 */
export default function HomePage() {
  const { products: topProducts, loading: productsLoading } = useShopifyProducts({ first: 3 });
  
  // #region agent log
  React.useEffect(() => {
    setTimeout(() => {
      const pageContainer = document.querySelector('[class*="flex min-h-screen"]');
      const rootEl = document.getElementById('root');
      const shopButton = document.querySelector('button[class*="Shop Collection"]') || document.querySelector('a[href="/shop"] button');
      if (pageContainer) {
        const styles = getComputedStyle(pageContainer);
        fetch('http://127.0.0.1:7242/ingest/078eead1-c0e6-45d9-991e-8437a95e7a31',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HomePage.tsx:27',message:'Page container layout styles',data:{display:styles.display,minHeight:styles.minHeight,height:styles.height,width:styles.width},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
      }
      if (rootEl) {
        const rootStyles = getComputedStyle(rootEl);
        fetch('http://127.0.0.1:7242/ingest/078eead1-c0e6-45d9-991e-8437a95e7a31',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HomePage.tsx:32',message:'Root element styles from page',data:{maxWidth:rootStyles.maxWidth,width:rootStyles.width,padding:rootStyles.padding},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      }
      if (shopButton) {
        const btnStyles = getComputedStyle(shopButton);
        fetch('http://127.0.0.1:7242/ingest/078eead1-c0e6-45d9-991e-8437a95e7a31',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HomePage.tsx:37',message:'Shop button text color',data:{color:btnStyles.color,backgroundColor:btnStyles.backgroundColor},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      }
    }, 500);
  }, []);
  // #endregion

  return (
    <>
      <SEO
        title="Lunelle - Luxury Jewelry, Bags, Shoes & Clothing for Women"
        description="Discover elegant and feminine luxury pieces at Lunelle. Shop our curated collection of jewelry, handbags, shoes, and clothing designed for the modern woman."
      />
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-lunelle-blush/50 to-lunelle-cream">
            <div className="container mx-auto px-4 py-20 md:py-32 md:px-6">
              <div className="mx-auto max-w-3xl text-center">
                <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl lg:text-6xl mb-6">
                  Timeless Elegance, Modern Luxury
                </h1>
                <p className="text-lg text-muted-foreground mb-8 md:text-xl">
                  Discover our curated collection of jewelry, handbags, shoes, and clothing
                  designed for the modern woman who appreciates timeless beauty.
                </p>
                <Link to="/shop">
                  <Button size="lg" className="bg-lunelle-pink hover:bg-lunelle-pink/90 text-foreground">
                    Shop Collection
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Featured Products */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mb-12 text-center">
                <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl mb-4">
                  Featured Products
                </h2>
                <p className="text-muted-foreground">
                  Discover our most popular pieces
                </p>
              </div>

              {productsLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : topProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {topProducts.slice(0, 3).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products available</p>
                </div>
              )}
            </div>
          </section>

          {/* About Section */}
          <section className="bg-lunelle-blush/30 floral-pattern py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl mb-6">
                  About Lunelle
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Lunelle is a celebration of feminine elegance and timeless beauty. We believe
                  that every woman deserves to feel beautiful, confident, and inspired. Our
                  carefully curated collections reflect our commitment to quality, craftsmanship,
                  and the art of living beautifully.
                </p>
                <Link to="/about">
                  <Button variant="outline" className="border-lunelle-pink text-lunelle-pink hover:bg-lunelle-pink hover:text-white">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Newsletter Signup */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mx-auto max-w-2xl">
                <div className="rounded-xl bg-lunelle-blush/50 p-8 md:p-12">
                  <div className="text-center mb-8">
                    <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl mb-4">
                      Stay in the Loop
                    </h2>
                    <p className="text-muted-foreground">
                      Subscribe to receive updates on new collections and exclusive offers.
                    </p>
                  </div>
                  <NewsletterForm />
                </div>
              </div>
            </div>
          </section>

          {/* Instagram Feed */}
          <section className="py-16 md:py-24 bg-lunelle-cream">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mb-12 text-center">
                <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl mb-4">
                  Follow @lunelle
                </h2>
                <p className="text-muted-foreground">
                  Join us on Instagram for daily inspiration
                </p>
              </div>
              <div className="mt-8 text-center">
                <a
                  href="https://www.instagram.com/lunelleae?igsh=eG4yZzAydnFpZWg1&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="outline" className="border-lunelle-pink text-lunelle-pink hover:bg-lunelle-pink hover:text-foreground">
                    Follow on Instagram
                  </Button>
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

