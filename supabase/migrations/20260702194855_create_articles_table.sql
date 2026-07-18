/*
  # Create articles table

  1. New Tables
    - `articles`
      - `id` (uuid, primary key)
      - `slug` (text, unique, not null) — used for the public URL, e.g. /insights/why-governance-frameworks-fail
      - `title` (text, not null)
      - `excerpt` (text, default '')
      - `content` (text, not null, default '') — rich HTML body, rendered as-is on the Article page
      - `cover_image_url` (text, default '')
      - `category` (text, default '')
      - `author` (text, default 'Tigwire Services')
      - `read_time` (text, default '')
      - `icon` (text, default 'Sparkles')
      - `status` (text, not null, default 'draft') — 'draft' or 'published'
      - `published_at` (timestamptz) — set when a post is first published; drives sort order
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `articles` table
    - Public (anon) can SELECT only rows where status = 'published'
    - No public INSERT/UPDATE/DELETE — all writes happen via the admin edge functions using
      the service role key, after the caller's Supabase Auth session has been verified there.
      This mirrors the pattern used by contact_messages, where privileged writes go through
      an edge function rather than being granted directly to a Postgres role.

  3. Notes
    - status/published_at let a post be saved as a draft without appearing on the public
      Insights page, which the previous hardcoded articles.json file had no way to do.
*/

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image_url text DEFAULT '',
  category text DEFAULT '',
  author text DEFAULT 'Tigwire Services',
  read_time text DEFAULT '',
  icon text DEFAULT 'Sparkles',
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT articles_status_check CHECK (status IN ('draft', 'published'))
);

CREATE INDEX IF NOT EXISTS articles_status_published_at_idx
  ON articles (status, published_at DESC);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published articles"
  ON articles FOR SELECT
  TO anon, authenticated
  USING (status = 'published');
