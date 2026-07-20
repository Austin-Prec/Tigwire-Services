/*
  # Create work_samples table

  Backs the before/after gallery on the Home page (WorkGalleryBlock.tsx)
  and the compact slider in the hero (HeroBlock.tsx), replacing the
  hardcoded SAMPLES array and SVG placeholder textures those components
  used before this migration. See the conversation this came from: the
  gallery originally shipped with generated placeholder textures and no
  way to add real photos without editing code and redeploying -- this
  table plus work-upload/work-write edge functions and a new admin page
  (/admin/work) close that gap the same way articles/page_blocks already
  work for blog posts and page content.

  1. New Tables
    - `work_samples`
      - `id` (uuid, primary key)
      - `label` (text, not null) -- shown as the caption under each card,
        e.g. "Residential kitchen, Area 47"
      - `before_image_url` (text, not null)
      - `after_image_url` (text, not null)
      - `display_order` (integer, not null, default 0) -- controls sort
        order in the gallery grid; lower shows first
      - `status` (text, not null, default 'draft') -- 'draft' or 'published',
        same pattern as articles.status, so a new entry can be uploaded and
        reviewed before it goes live on the public site
      - `created_at` / `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `work_samples`
    - Public (anon) can SELECT only rows where status = 'published'
    - No public INSERT/UPDATE/DELETE -- all writes happen via the
      work-write edge function using the service role key, after the
      caller's Supabase Auth session has been verified there. Exactly
      the same pattern as articles and page_blocks.

  3. Notes
    - Unlike articles, there's no slug/URL for a work sample (nothing
      links directly to one), so no unique-slug handling is needed here.
    - before_image_url / after_image_url are plain text columns holding
      public Storage URLs, not foreign keys -- same approach
      cover_image_url on articles already uses.
*/

CREATE TABLE IF NOT EXISTS work_samples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  before_image_url text NOT NULL,
  after_image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT work_samples_status_check CHECK (status IN ('draft', 'published'))
);

CREATE INDEX IF NOT EXISTS work_samples_status_order_idx
  ON work_samples (status, display_order ASC);

ALTER TABLE work_samples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published work samples"
  ON work_samples FOR SELECT
  TO anon, authenticated
  USING (status = 'published');
