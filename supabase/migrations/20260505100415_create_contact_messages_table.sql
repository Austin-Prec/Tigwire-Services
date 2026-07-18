/*
  # Create contact_messages table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `full_name` (text, not null)
      - `organisation` (text, default '')
      - `email` (text, not null)
      - `phone` (text, default '')
      - `enquiry_type` (text, not null)
      - `message` (text, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `contact_messages` table
    - Add INSERT policy for anonymous users (form submissions)
    - No SELECT/UPDATE/DELETE policies for anonymous or authenticated users
      (only service role can read messages via edge function)
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  organisation text DEFAULT '',
  email text NOT NULL,
  phone text DEFAULT '',
  enquiry_type text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous users can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon
  WITH CHECK (true);
