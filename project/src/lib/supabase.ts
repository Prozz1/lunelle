/**
 * Supabase Client Configuration
 * 
 * Initializes and exports the Supabase client for database operations.
 * Used for newsletter subscription storage.
 * 
 * TODO: Configure your Supabase credentials in .env.local:
 * - VITE_SUPABASE_URL=your_supabase_project_url
 * - VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
 * 
 * To get these credentials:
 * 1. Go to your Supabase project dashboard
 * 2. Navigate to Settings > API
 * 3. Copy the Project URL and anon/public key
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
  );
}

// Initialize Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * TypeScript types for newsletter_subscribers table
 */
export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
  source: string | null;
}

/**
 * Insert a new newsletter subscriber
 * 
 * @param email - Email address to subscribe
 * @param source - Optional source identifier (e.g., 'homepage', 'footer')
 * @returns Promise with the inserted subscriber or error
 */
export async function subscribeToNewsletter(
  email: string,
  source?: string
): Promise<{ data: NewsletterSubscriber | null; error: Error | null }> {
  if (!supabase) {
    return {
      data: null,
      error: new Error('Supabase client not initialized. Please configure your environment variables.'),
    };
  }

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: email.toLowerCase().trim(),
          source: source || null,
        },
      ])
      .select()
      .single();

    if (error) {
      // Handle duplicate email error gracefully
      if (error.code === '23505') {
        // PostgreSQL unique violation error code
        // Email already exists, treat as success
        return {
          data: null,
          error: null, // No error, but no data either (already subscribed)
        };
      }
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as NewsletterSubscriber, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Failed to subscribe to newsletter'),
    };
  }
}

