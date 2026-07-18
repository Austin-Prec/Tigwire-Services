/*
  # Create article-images storage bucket

  1. New Storage Bucket
    - `article-images` (public bucket) — holds cover images and any images pasted or
      dropped into a blog post body. Public so images render on the live site without
      needing signed URLs.

  2. Security
    - Anyone can view files (bucket is public, matches how blog images need to work)
    - Only authenticated users can upload/update/delete files
      (in practice, only whoever is signed into the writing area, since there is no public sign-up flow)
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view article images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can upload article images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can update article images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can delete article images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'article-images');
