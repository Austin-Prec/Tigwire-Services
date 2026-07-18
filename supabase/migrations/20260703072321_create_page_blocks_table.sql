/*
  # Create page_blocks table

  1. New Tables
    - `page_blocks`
      - `id` (uuid, primary key)
      - `page` (text, not null) — which public page this block belongs to, e.g. 'about'
      - `type` (text, not null) — the block type: 'photo', 'bio', 'list', etc.
      - `position` (integer, not null) — display order within the page, lower first
      - `content` (jsonb, not null, default '{}') — shape varies by type; see block type
        registry in the frontend for what each type expects
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `page_blocks`
    - Public (anon) can SELECT all rows — unlike articles, there is no draft/published
      distinction for page blocks; a page's blocks are simply what's on the page.
      Page content isn't something that benefits from a "draft" state the way a blog
      post does, since these pages don't have a publish workflow today.
    - No public INSERT/UPDATE/DELETE — all writes go through the pages-write edge
      function using the service role key, after verifying the caller's session,
      the same pattern used for articles.

  3. Notes
    - `position` is a plain integer rather than a fractional/linked-list scheme.
      Reordering rewrites the position of every block on that page in one request,
      which is simple to reason about and entirely sufficient at the scale of a
      handful of blocks per page.
    - jsonb (not json) is used for `content` so future migrations can query into
      block content if ever needed, though nothing does today.
*/

CREATE TABLE IF NOT EXISTS page_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  type text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS page_blocks_page_position_idx
  ON page_blocks (page, position);

ALTER TABLE page_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read page blocks"
  ON page_blocks FOR SELECT
  TO anon, authenticated
  USING (true);
