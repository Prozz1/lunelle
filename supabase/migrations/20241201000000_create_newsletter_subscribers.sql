-- Create newsletter_subscribers table
-- This table stores email addresses of users who subscribe to the Lunelle newsletter

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  source TEXT
);

-- Create index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- Create index on subscribed_at for querying active subscribers
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON newsletter_subscribers(subscribed_at);

-- Add constraint to ensure email format is valid (basic check)
ALTER TABLE newsletter_subscribers 
  ADD CONSTRAINT email_format_check 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Enable Row Level Security (RLS)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for newsletter signup)
CREATE POLICY "Allow public inserts" ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow service role to read all (for admin/backend access)
-- Note: Service role bypasses RLS, but this is for explicit access if needed
-- For public access, you may want to restrict SELECT policies

-- Optional: Create policy to allow users to read their own email
-- (Not needed for newsletter, but included for completeness)
-- CREATE POLICY "Users can read own email" ON newsletter_subscribers
--   FOR SELECT
--   USING (true);

