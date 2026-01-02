import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { NewsletterForm } from '@/components/forms/NewsletterForm';

// TikTok icon component (lucide-react doesn't have TikTok icon)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

/**
 * Footer component with links, social media, and newsletter signup
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: 'All Products', path: '/shop' },
      { label: 'Jewelry', path: '/shop?category=jewelry' },
      { label: 'Bags', path: '/shop?category=bags' },
      { label: 'Clothing', path: '/shop?category=clothing' },
    ],
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Shipping', path: '/shipping' },
      { label: 'Returns', path: '/returns' },
    ],
  };

  return (
    <footer className="bg-lunelle-blush/30 floral-pattern border-t border-lunelle-pink/20">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block px-2 py-1" aria-label="Lunelle Home">
              <img
                src="/image.png"
                alt="Lunelle"
                className="h-12 w-auto object-contain"
                loading="lazy"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Elegant luxury pieces designed for the modern woman. Discover timeless beauty
              in every detail.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/lunelleae?igsh=eG4yZzAydnFpZWg1&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-lunelle-pink transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://www.tiktok.com/@lunelle.ae?_r=1&_t=ZS-92juNVnl9E8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-lunelle-pink transition-colors"
                aria-label="Follow us on TikTok"
              >
                <TikTokIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-serif text-base font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-lunelle-pink transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-serif text-base font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-lunelle-pink transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif text-base font-semibold mb-4">Newsletter</h3>
            <NewsletterForm variant="compact" />
            <p className="mt-4 text-xs text-muted-foreground">
              Subscribe to receive updates on new collections and exclusive offers.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-lunelle-pink/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Lunelle. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-lunelle-pink transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-lunelle-pink transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

