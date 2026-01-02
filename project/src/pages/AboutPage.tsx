import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SEO } from '@/components/ui/SEO';
import { Link } from 'react-router-dom';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { ProductCard } from '@/components/product/ProductCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * AboutPage component
 * 
 * Features:
 * - Brand story section
 * - Mission and values
 * - Image gallery
 * - Sustainability/quality commitment
 */
export default function AboutPage() {
  const { products: topProducts, loading: productsLoading } = useShopifyProducts({ first: 5 });
  
  const values = [
    {
      title: 'Quality',
      description:
        'We source only the finest materials and work with skilled artisans to create pieces that last a lifetime.',
    },
    {
      title: 'Elegance',
      description:
        'Every design reflects timeless beauty and feminine grace, celebrating the modern woman.',
    },
    {
      title: 'Sustainability',
      description:
        "We're committed to ethical sourcing and sustainable practices, caring for both people and planet.",
    },
    {
      title: 'Craftsmanship',
      description:
        'Attention to detail and traditional techniques meet contemporary design in every piece.',
    },
  ];


  return (
    <>
      <SEO
        title="About Us - Lunelle"
        description="Learn about Lunelle's mission, values, and commitment to creating elegant luxury pieces for the modern woman."
      />
      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-lunelle-blush/50 to-lunelle-cream py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mx-auto max-w-3xl text-center">
                <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl lg:text-6xl mb-6">
                  About Lunelle
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  Where timeless elegance meets modern luxury
                </p>
              </div>
            </div>
          </section>

          {/* Brand Story */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mx-auto max-w-3xl">
                <div className="prose prose-lg max-w-none">
                  <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl mb-6">
                    Our Story
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Founded with a vision to celebrate feminine elegance, Lunelle was born from a
                    passion for creating pieces that transcend trends and become cherished
                    heirlooms. We believe that true luxury lies in the details—the careful
                    selection of materials, the dedication to craftsmanship, and the timeless
                    designs that speak to the heart.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Every piece in our collection is thoughtfully curated to embody grace,
                    sophistication, and the unique spirit of the modern woman. From delicate
                    jewelry that catches the light to handcrafted bags that accompany life's
                    moments, each item tells a story of artistry and intention.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    At Lunelle, we don't just create accessories—we create memories, empower
                    confidence, and honor the beauty that exists in every woman.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Mission and Values */}
          <section className="bg-lunelle-blush/30 floral-pattern py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mx-auto max-w-5xl">
                <div className="mb-12 text-center">
                  <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl mb-4">
                    Our Values
                  </h2>
                  <p className="text-muted-foreground">
                    The principles that guide everything we do
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {values.map((value, index) => (
                    <Card key={index} className="border-0 shadow-soft">
                      <CardContent className="p-6">
                        <h3 className="font-serif text-xl font-semibold mb-3">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {topProducts.slice(0, 5).map((product) => (
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

          {/* Call to Action */}
          <section className="py-16 md:py-24 bg-lunelle-cream">
            <div className="container mx-auto px-4 md:px-6">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl mb-6">
                  Discover Your Perfect Piece
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Explore our curated collections and find something beautiful that speaks to you.
                </p>
                <Link to="/shop">
                  <Button size="lg" className="bg-lunelle-pink hover:bg-lunelle-pink/90 text-foreground">
                    Shop Collection
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

