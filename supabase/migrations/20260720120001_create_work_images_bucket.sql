/*
  # Create work-images storage bucket

  Holds before/after photos uploaded for the work_samples gallery. Exact
  same pattern as article-images (see
  20260702194856_create_article_images_bucket.sql) -- public bucket so
  images render on the live site without signed URLs, writes restricted
  to authenticated users only.

  1. New Storage Bucket
    - `work-images` (public bucket)

  2. Security
    - Anyone can view files (bucket is public, matches how gallery images
      need to work on the public Home page)
    - Only authenticated users can upload/update/delete files (in practice,
      only whoever is signed into the writing area, since there is no
      public sign-up flow)
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('work-images', 'work-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view work images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'work-images');

CREATE POLICY "Authenticated users can upload work images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'work-images');

CREATE POLICY "Authenticated users can update work images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'work-images');

CREATE POLICY "Authenticated users can delete work images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'work-images');
