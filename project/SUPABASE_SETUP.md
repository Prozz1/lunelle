# Supabase Setup Guide for Lunelle Newsletter

This guide will walk you through setting up Supabase for storing newsletter subscriber emails.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Access to your Supabase project dashboard

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (or create an account)
2. Click "New Project" in your dashboard
3. Fill in the project details:
   - **Name**: `lunelle-newsletter` (or any name you prefer)
   - **Database Password**: Choose a strong password (save this securely)
   - **Region**: Select the region closest to your users
   - **Pricing Plan**: Free tier is sufficient for newsletter functionality
4. Click "Create new project"
5. Wait for the project to be provisioned (this takes 1-2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: This is your `VITE_SUPABASE_URL`
   - **anon/public key**: This is your `VITE_SUPABASE_ANON_KEY`
4. Copy both values - you'll need them for your `.env.local` file

**Important**: The `anon` key is safe to use in client-side code. Never commit your `service_role` key to version control or use it in client-side code.

## Step 3: Run the Migration

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. In your Supabase project dashboard, click on **SQL Editor** in the left sidebar
2. Click "New query"
3. Copy the entire contents of `supabase/migrations/20241201000000_create_newsletter_subscribers.sql`
4. Paste it into the SQL editor
5. Click "Run" (or press Ctrl+Enter / Cmd+Enter)
6. You should see a success message

### Option B: Using Supabase CLI (For advanced users)

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (You can find your project ref in the project settings)

3. Run the migration:
   ```bash
   supabase db push
   ```

## Step 4: Configure Environment Variables

1. In your project root, create a `.env.local` file (if it doesn't exist)
2. Add the following variables:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace:
- `your-project-ref` with your actual Supabase project reference ID
- `your-anon-key-here` with your actual anon/public key from Step 2

3. **Important**: Never commit `.env.local` to version control. It should already be in `.gitignore`

4. If you need to share environment variables with your team, use `.env.example` (which is already updated in this project)

## Step 5: Verify the Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see the `newsletter_subscribers` table
3. The table should have the following columns:
   - `id` (uuid)
   - `email` (text)
   - `created_at` (timestamptz)
   - `subscribed_at` (timestamptz)
   - `unsubscribed_at` (timestamptz, nullable)
   - `source` (text, nullable)

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your website and fill out the newsletter form
3. Submit the form with a test email
4. Go back to Supabase dashboard → **Table Editor** → `newsletter_subscribers`
5. You should see your test email in the table

## Security Notes

### Row Level Security (RLS)

The migration enables Row Level Security (RLS) on the `newsletter_subscribers` table. The current policy allows:
- **INSERT**: Anyone can insert (sign up for newsletter)
- **SELECT**: Restricted (service role can read all, but public access is limited)

For production, you may want to:
- Add a policy that allows authenticated admin users to read all records
- Consider using the service role key in a backend API for reading subscriber lists

### Email Privacy

- Emails are stored securely in Supabase's PostgreSQL database
- The database connection is encrypted
- Only authorized access (via API keys) can interact with the data
- Consider implementing GDPR-compliant unsubscribe functionality if required

## Troubleshooting

### "relation newsletter_subscribers does not exist"
- The migration hasn't been run yet. Follow Step 3 to run the migration.

### "duplicate key value violates unique constraint"
- This is expected behavior - the email already exists in the database
- The application handles this gracefully and shows a success message

### "new row violates row-level security policy"
- Check that RLS policies are correctly set up
- Verify you're using the `anon` key (not service_role) in your client code
- Check the Supabase dashboard → Authentication → Policies to verify the policy exists

### API Key Not Working
- Verify you're using the `anon/public` key, not the `service_role` key
- Check that the key is correctly set in `.env.local`
- Ensure there are no extra spaces or quotes around the values
- Restart your development server after changing environment variables

## Production Deployment

When deploying to production:

1. Add the environment variables to your hosting platform:
   - **Vercel**: Project Settings → Environment Variables
   - **Netlify**: Site Settings → Build & Deploy → Environment
   - **Other platforms**: Check their documentation for environment variable setup

2. Use the same Supabase project or create a separate production project
3. Run the migration in your production database
4. Test the newsletter form in production before going live

## Next Steps

- Monitor subscriber growth in the Supabase dashboard
- Consider adding unsubscribe functionality
- Set up email notifications for new subscribers (using Supabase Functions or external service)
- Export subscriber lists for email marketing campaigns

## Support

For issues with:
- **Supabase setup**: Check [Supabase Documentation](https://supabase.com/docs)
- **Application code**: Review the implementation in `src/components/forms/NewsletterForm.tsx` and `src/lib/supabase.ts`

