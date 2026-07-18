import { supabase } from './supabase';

export type BlockType =
  | 'header' | 'photo' | 'bio' | 'list' | 'credentials_panel'
  | 'hero' | 'value_cards' | 'stat_bar' | 'link_preview'
  | 'framework_section' | 'cta_banner'
  | 'service_grid' | 'pricing_notes'
  | 'contact_sidebar'
  | 'case_study_grid';

export interface PageBlock {
  id: string;
  page: string;
  type: BlockType;
  position: number;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
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

// --- Reads: page_blocks has no draft/published distinction, so both the
//     public page and the admin editor read the same way, directly via the
//     Supabase client (RLS allows anyone to SELECT all page_blocks rows). ---

export async function getPageBlocks(page: string): Promise<PageBlock[]> {
  const { data, error } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page', page)
    .order('position', { ascending: true });

  if (error) throw error;
  return (data ?? []) as PageBlock[];
}

// --- Writes: go through pages-write, which verifies the session before
//     using the service role key. ---

export async function createBlock(input: {
  page: string;
  type: BlockType;
  content: Record<string, unknown>;
  position?: number;
}): Promise<PageBlock> {
  const headers = await authHeader();
  const res = await fetch(`${FUNCTIONS_URL}/pages-write`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Failed to create block');
  return body.block;
}

export async function updateBlockContent(
  id: string,
  content: Record<string, unknown>
): Promise<PageBlock> {
  const headers = await authHeader();
  const res = await fetch(`${FUNCTIONS_URL}/pages-write`, {
    method: 'PATCH',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, content }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Failed to update block');
  return body.block;
}

export async function deleteBlock(id: string): Promise<void> {
  const headers = await authHeader();
  const res = await fetch(`${FUNCTIONS_URL}/pages-write?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to delete block');
  }
}

export async function reorderBlocks(page: string, orderedIds: string[]): Promise<void> {
  const headers = await authHeader();
  const res = await fetch(`${FUNCTIONS_URL}/pages-write`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ page, order: orderedIds }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to reorder blocks');
  }
}
