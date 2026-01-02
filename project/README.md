# Lunelle - Luxury E-Commerce Website

A modern, elegant e-commerce website for Lunelle - a feminine luxury brand selling jewelry, bags, shoes, and clothing for women. Built with React, TypeScript, Tailwind CSS, and integrated with Shopify Storefront API.

## Features

- 🎨 **Elegant Design**: Soft romantic aesthetic with muted pink/beige color palette and delicate floral elements
- 📱 **Fully Responsive**: Mobile-first design that looks stunning on all devices
- 🛍️ **E-Commerce Ready**: Complete shopping experience with cart, checkout, and product management
- 🚀 **Shopify Integration**: Seamlessly connected to Shopify Storefront API (no mock data)
- ⚡ **Performance Optimized**: Fast page loads, lazy loading, and optimized images
- ♿ **Accessible**: Built with accessibility in mind (ARIA labels, keyboard navigation, semantic HTML)
- 🔍 **SEO Optimized**: Meta tags, structured data, and SEO-friendly URLs

## Tech Stack

- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom brand colors
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **Form Validation**: React Hook Form + Zod
- **E-Commerce**: Shopify Storefront API
- **Notifications**: Sonner (toast notifications)

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer
│   ├── product/         # ProductCard, ProductGallery, ProductGrid, FilterSidebar
│   ├── cart/            # CartItem
│   ├── forms/           # NewsletterForm
│   └── ui/              # Reusable UI components (shadcn/ui)
├── contexts/            # CartContext for global state
├── hooks/               # Custom React hooks (Shopify integration)
├── lib/                 # Utilities (Shopify client, utils)
├── pages/               # Page components
├── types/               # TypeScript type definitions
└── App.tsx              # Main app component with routing
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Shopify store with Storefront API access

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
   ```

### Shopify Configuration

To get your Shopify credentials:

1. **Store Domain**:
   - Your store domain is your Shopify store URL (e.g., `your-store.myshopify.com`)

2. **Storefront API Access Token**:
   - Go to your Shopify Admin panel
   - Navigate to **Settings** > **Apps and sales channels**
   - Click **Develop apps** (or "Manage private apps" in older Shopify)
   - Create a new private app
   - Enable **Storefront API** access
   - Copy the **Storefront API access token**
   - Add it to your `.env.local` file

   **Note**: Make sure the Storefront API has the following permissions:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_write_customers`
   - `unauthenticated_read_customers`

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in the terminal).

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Pages

- **Home** (`/`): Hero section, featured collections, brand story, newsletter signup, Instagram feed
- **Shop** (`/shop`): Product grid with filtering and sorting options
- **Product Detail** (`/shop/:productHandle`): Product gallery, details, variant selection, add to cart
- **Cart** (`/cart`): Shopping cart with item management and checkout
- **About** (`/about`): Brand story, mission, values, and image gallery

## Key Components

### Shopify Integration

All product data is fetched from Shopify Storefront API. The integration includes:

- **`lib/shopify.ts`**: Shopify Storefront API client with GraphQL queries and mutations
- **`hooks/useShopifyProducts.ts`**: Hook for fetching products with filters
- **`hooks/useShopifyProduct.ts`**: Hook for fetching a single product
- **`hooks/useShopifyCart.ts`**: Hook for cart management
- **`hooks/useShopifyCollections.ts`**: Hook for fetching collections
- **`contexts/CartContext.tsx`**: Global cart state management with localStorage persistence

### No Mock Data

**Important**: This project does not include any hardcoded product data. All products, collections, and cart functionality require a valid Shopify store configuration. The site is structured to accept Shopify product data format:

- Products: `{ id, title, handle, description, images, variants, price, currencyCode }`
- Variants: `{ id, title, price, availableForSale, selectedOptions }`
- Cart: Shopify cart object with line items and checkout URL

## Styling

The design system uses Lunelle brand colors:

- **Lunelle Pink**: `#d4b5b0` - Primary brand color
- **Lunelle Blush**: `#f5e6e8` - Secondary accent
- **Lunelle Cream**: `#f8f6f3` - Background color
- **Lunelle Taupe**: `#a08d85` - Text accents

Typography:
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## Customization

### Brand Colors

Update colors in `tailwind.config.js`:

```js
colors: {
  'lunelle-pink': '#d4b5b0',
  'lunelle-blush': '#f5e6e8',
  'lunelle-cream': '#f8f6f3',
  'lunelle-taupe': '#a08d85',
}
```

### Logo

Replace the logo by updating the image path in:
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `public/image.png` (current logo location)

### Newsletter Integration

The newsletter form (`src/components/forms/NewsletterForm.tsx`) currently simulates submission. To integrate with a real service:

1. Update the `onSubmit` function in `NewsletterForm.tsx`
2. Connect to your email service (Mailchimp, ConvertKit, etc.)
3. Handle success/error responses appropriately

## Deployment

### Environment Variables

Make sure to set environment variables in your hosting platform:

- `VITE_SHOPIFY_STORE_DOMAIN`
- `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`

### Recommended Platforms

- **Vercel**: Excellent for React apps with automatic deployments
- **Netlify**: Great for static sites with form handling
- **Shopify Hosting**: Can be integrated with Shopify theme development
- **Any static hosting**: The built `dist/` folder can be deployed anywhere

### Build Command

```bash
npm run build
```

### Output Directory

```
dist/
```

## Troubleshooting

### Shopify API Errors

- **401 Unauthorized**: Check that your Storefront API access token is correct
- **404 Not Found**: Verify your store domain is correct (should end with `.myshopify.com`)
- **403 Forbidden**: Ensure Storefront API permissions are enabled in your Shopify app settings

### Products Not Showing

- Verify your Shopify store has products published
- Check that products are available for the Storefront API
- Review browser console for API errors
- Ensure environment variables are set correctly

### Cart Not Working

- Cart functionality requires valid Shopify credentials
- Check that cart mutations have proper permissions
- Verify localStorage is enabled in the browser

## Development Tips

- Use React DevTools for debugging component state
- Check Network tab for Shopify API requests/responses
- Review GraphQL queries in `lib/shopify.ts` for customization
- Use Tailwind CSS IntelliSense extension in VS Code for better autocomplete

## Future Enhancements

- Search functionality
- User accounts and wishlists
- Product reviews and ratings
- Payment integration (already handled by Shopify checkout)
- Email marketing integration
- Analytics integration
- Multi-language support
- Product recommendations

## License

This project is private and proprietary.

## Support

For questions or issues:
1. Check the troubleshooting section above
2. Review Shopify Storefront API documentation
3. Check React Router and shadcn/ui documentation for component usage

---

Built with ❤️ for Lunelle

