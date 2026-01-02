/**
 * Shopify Storefront API Client
 * 
 * TODO: Configure your Shopify credentials in .env.local:
 * - VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
 * - VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
 * 
 * To get these credentials:
 * 1. Store domain: Your Shopify store URL
 * 2. Storefront access token: Shopify Admin > Settings > Apps and sales channels > Develop apps
 *    Create a private app and enable Storefront API access
 */

import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import type {
  ShopifyProduct,
  ShopifyCart,
  ShopifyCollection,
  Product,
} from '../types/shopify';

const storeDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = (import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-01') as '2024-01' | '2024-04' | '2024-07' | '2024-10' | '2025-01';

if (!storeDomain || !storefrontAccessToken) {
  console.warn(
    'Shopify credentials not configured. Please set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local'
  );
} else if (import.meta.env.DEV) {
  console.log('Shopify client initialized:', { storeDomain, apiVersion, hasToken: !!storefrontAccessToken });
}

// Initialize Shopify Storefront API client
export const shopifyClient = storeDomain && storefrontAccessToken
  ? createStorefrontApiClient({
      storeDomain: storeDomain,
      apiVersion: apiVersion,
      publicAccessToken: storefrontAccessToken,
    })
  : null;

/**
 * GraphQL query to fetch products with filters
 */
const PRODUCTS_QUERY = `
  query getProducts($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      edges {
        node {
          id
          title
          description
          descriptionHtml
          handle
          availableForSale
          productType
          vendor
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
                image {
                  id
                  url
                  altText
                  width
                  height
                }
                sku
                quantityAvailable
              }
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * GraphQL query to fetch a single product by handle
 */
const PRODUCT_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      availableForSale
      productType
      vendor
      tags
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
            image {
              id
              url
              altText
              width
              height
            }
            sku
            quantityAvailable
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to fetch collections
 */
const COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

/**
 * GraphQL mutation to create a cart
 */
const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          id
                          url
                          altText
                          width
                          height
                        }
                      }
                    }
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * GraphQL mutation to add items to cart
 */
const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          id
                          url
                          altText
                          width
                          height
                        }
                      }
                    }
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * GraphQL mutation to update cart lines
 */
const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          id
                          url
                          altText
                          width
                          height
                        }
                      }
                    }
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * GraphQL query to fetch cart by ID
 */
const CART_QUERY = `
  query getCart($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      totalQuantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  id
                  title
                  handle
                  images(first: 1) {
                    edges {
                      node {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Helper function to execute GraphQL queries/mutations
 */
async function shopifyRequest<T>(query: string, variables?: Record<string, any>): Promise<T> {
  if (!shopifyClient) {
    throw new Error('Shopify client not initialized. Please configure your environment variables.');
  }

  try {
    if (import.meta.env.DEV) {
      console.log('Shopify API request:', { variables });
    }
    const response = await shopifyClient.request(query, { variables });
    // Log response for debugging (remove in production if needed)
    if (import.meta.env.DEV) {
      console.log('Shopify API response:', response);
      console.log('Response structure:', {
        hasData: response && typeof response === 'object' && 'data' in response,
        hasProducts: response && typeof response === 'object' && 'products' in response,
        keys: response && typeof response === 'object' ? Object.keys(response) : 'not an object',
      });
    }
    
    // The @shopify/storefront-api-client wraps responses in a 'data' property
    // Extract the data if it exists, otherwise use the response directly
    const data = response && typeof response === 'object' && 'data' in response 
      ? (response as any).data 
      : response;
    
    return data as T;
  } catch (error) {
    console.error('Shopify API error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error(`Failed to fetch data from Shopify: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Transform Shopify product to simplified Product type
 */
function transformProduct(shopifyProduct: ShopifyProduct): Product {
  const images = shopifyProduct.images?.edges?.map((edge) => edge.node) || [];
  const variants = shopifyProduct.variants?.edges?.map((edge) => edge.node) || [];
  const firstVariant = variants[0];

  return {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    description: shopifyProduct.description,
    handle: shopifyProduct.handle,
    images,
    variants,
    price: firstVariant?.price?.amount || shopifyProduct.priceRange?.minVariantPrice?.amount || '0',
    currencyCode: firstVariant?.price?.currencyCode || shopifyProduct.priceRange?.minVariantPrice?.currencyCode || 'USD',
    availableForSale: shopifyProduct.availableForSale,
    productType: shopifyProduct.productType,
  };
}

/**
 * Fetch products from Shopify
 */
export async function getProducts(options: {
  first?: number;
  after?: string;
  query?: string;
} = {}): Promise<{ products: Product[]; hasNextPage: boolean; endCursor?: string }> {
  const { first = 20, after, query } = options;

  try {
    const response = await shopifyRequest<{
      products: {
        edges: Array<{ node: ShopifyProduct; cursor: string }>;
        pageInfo: { hasNextPage: boolean; endCursor?: string };
      };
    }>(PRODUCTS_QUERY, { first, after, query: query || undefined });

    if (!response || !response.products) {
      console.warn('Shopify API returned invalid response structure:', response);
      return {
        products: [],
        hasNextPage: false,
        endCursor: undefined,
      };
    }

    if (!response.products.edges) {
      console.warn('Shopify API returned products without edges:', response.products);
      return {
        products: [],
        hasNextPage: false,
        endCursor: undefined,
      };
    }

    const products = response.products.edges.map((edge) => transformProduct(edge.node));

    if (import.meta.env.DEV) {
      console.log(`Fetched ${products.length} products from Shopify`);
    }

    return {
      products,
      hasNextPage: response.products.pageInfo?.hasNextPage || false,
      endCursor: response.products.pageInfo?.endCursor || undefined,
    };
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
}

/**
 * Fetch a single product by handle
 */
export async function getProduct(handle: string): Promise<Product | null> {
  const response = await shopifyRequest<{
    product: ShopifyProduct | null;
  }>(PRODUCT_QUERY, { handle });

  if (!response.product) {
    return null;
  }

  return transformProduct(response.product);
}

/**
 * Fetch collections from Shopify
 */
export async function getCollections(first: number = 10): Promise<ShopifyCollection[]> {
  const response = await shopifyRequest<{
    collections: {
      edges: Array<{ node: ShopifyCollection }>;
    };
  }>(COLLECTIONS_QUERY, { first });

  if (!response.collections || !response.collections.edges) {
    return [];
  }

  return response.collections.edges.map((edge) => edge.node);
}

/**
 * Create a new cart
 */
export async function createCart(): Promise<ShopifyCart> {
  const response = await shopifyRequest<{
    cartCreate: {
      cart: ShopifyCart;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(CART_CREATE_MUTATION, { input: {} });

  if (response.cartCreate.userErrors.length > 0) {
    throw new Error(response.cartCreate.userErrors.map((e) => e.message).join(', '));
  }

  return response.cartCreate.cart;
}

/**
 * Add items to cart
 */
export async function addToCart(cartId: string, variantId: string, quantity: number = 1): Promise<ShopifyCart> {
  const response = await shopifyRequest<{
    cartLinesAdd: {
      cart: ShopifyCart;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });

  if (response.cartLinesAdd.userErrors.length > 0) {
    throw new Error(response.cartLinesAdd.userErrors.map((e) => e.message).join(', '));
  }

  return response.cartLinesAdd.cart;
}

/**
 * Update cart line items
 */
export async function updateCart(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const response = await shopifyRequest<{
    cartLinesUpdate: {
      cart: ShopifyCart;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  if (response.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(response.cartLinesUpdate.userErrors.map((e) => e.message).join(', '));
  }

  return response.cartLinesUpdate.cart;
}

/**
 * Fetch cart by ID
 */
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  try {
    const response = await shopifyRequest<{
      cart: ShopifyCart | null;
    }>(CART_QUERY, { id: cartId });

    return response.cart;
  } catch (error) {
    // Cart might not exist, return null
    return null;
  }
}

