import { supabase } from './supabase';

export interface WorkSample {
  id: string;
  label: string;
  before_image_url: string;
  after_image_url: string;
  display_order: number;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface WorkSampleInput {
  id?: string;
  label: string;
  before_image_url?: string;
  after_image_url?: string;
  display_order?: number;
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

export async function getPublishedWorkSamples(): Promise<WorkSample[]> {
  const { data, error } = await supabase
    .from('work_samples')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// --- Admin reads (drafts included; see work-list function) ---

export async function getAllWorkSamplesForAdmin(): Promise<WorkSample[]> {
  const headers = await authHeader();
  const res = await fetch(`${FUNCTIONS_URL}/work-list`, { headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to load work samples');
  }
  const body = await res.json();
  return body.work_samples ?? [];
}

// --- Writes (all go through work-write, which verifies the session
//     server-side before using the service role key) ---

export async function createWorkSample(input: WorkSampleInput): Promise<WorkSample> {
  const headers = await authHeader();
  const res = await fetch(`${FUNCTIONS_URL}/work-write`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Failed to create work sample');
  return body.work_sample;
}

export async function updateWorkSample(input: WorkSampleInput & { id: string }): Promise<WorkSample> {
  const headers = await authHeader();
  const res = await fetch(`${FUNCTIONS_URL}/work-write`, {
    method: 'PATCH',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Failed to update work sample');
  return body.work_sample;
}

export async function deleteWorkSample(id: string): Promise<void> {
  const headers = await authHeader();
  const res = await fetch(`${FUNCTIONS_URL}/work-write?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to delete work sample');
  }
}

export async function uploadWorkImage(file: File): Promise<string> {
  const headers = await authHeader();
  const res = await fetch(`${FUNCTIONS_URL}/work-upload`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': file.type },
    body: file,
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Failed to upload image');
  return body.url;
}
