import { supabase } from './supabase';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category: string;
  author: string;
  read_time: string;
  icon: string;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleInput {
  id?: string;
  slug?: string;
  title: string;
  excerpt?: string;
  content?: string;
  cover_image_url?: string;
  category?: string;
  author?: string;
  read_time?: string;
  icon?: string;
  status?: 'draft' | 'published';
}

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    throw new Error('You need to be signed in to do that.');
  }
  return { Authorization: `Bearer ${token}` };
}

// --- Public reads (no auth required, RLS only exposes published rows) ---

export async function getPublishedArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getPublishedArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// --- Admin reads (relies on the caller's own session; drafts are only visible
//     to the signed-in owner because the write function is what created them,
//     and the public SELECT policy only allows published rows) ---

export async function getAllArticlesForAdmin(): Promise<Article[]> {
  const headers = await authHeader();
  const res = await fetch(`${FUNCTIONS_URL}/articles-list`, { headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to load articles');
  }
  const body = await res.json();
  return body.articles ?? [];
}

// --- Writes (all go through articles-write, which verifies the session
//     server-side before using the service role key) ---

export async function createArticle(input: ArticleInput): Promise<Article> {
  const headers = await authHeader();
  const res = await fetch(`${FUNCTIONS_URL}/articles-write`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Failed to create article');
  return body.article;
}

export async function updateArticle(input: ArticleInput & { id: string }): Promise<Article> {
  const headers = await authHeader();
  const res = await fetch(`${FUNCTIONS_URL}/articles-write`, {
    method: 'PATCH',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Failed to update article');
  return body.article;
}

export async function deleteArticle(id: string): Promise<void> {
  const headers = await authHeader();
  const res = await fetch(`${FUNCTIONS_URL}/articles-write?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to delete article');
  }
}

export async function uploadArticleImage(file: File): Promise<string> {
  const headers = await authHeader();
  const res = await fetch(`${FUNCTIONS_URL}/articles-upload`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': file.type },
    body: file,
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Failed to upload image');
  return body.url;
}
