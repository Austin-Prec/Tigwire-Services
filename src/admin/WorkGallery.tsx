import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutTemplate, Trash2, Plus, ArrowUp, ArrowDown, ImageUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  getAllWorkSamplesForAdmin,
  createWorkSample,
  updateWorkSample,
  deleteWorkSample,
  uploadWorkImage,
  type WorkSample,
} from '../lib/work';

// Manages the before/after gallery shown on the Home page (WorkGalleryBlock)
// and the compact slider in the hero (HeroBlock) — see the conversation
// this page came from: those two originally used a hardcoded placeholder
// array with no way to add real photos short of editing code. This is the
// upload path that closes that gap.

function SampleRow({
  sample,
  onSaved,
  onDeleted,
  onMove,
  isFirst,
  isLast,
}: {
  sample: WorkSample;
  onSaved: (updated: WorkSample) => void;
  onDeleted: (id: string) => void;
  onMove: (direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [label, setLabel] = useState(sample.label);
  const [uploadingSide, setUploadingSide] = useState<'before' | 'after' | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (side: 'before' | 'after', file: File) => {
    setUploadingSide(side);
    setError('');
    try {
      const url = await uploadWorkImage(file);
      const updated = await updateWorkSample({
        id: sample.id,
        label: sample.label,
        [side === 'before' ? 'before_image_url' : 'after_image_url']: url,
      });
      onSaved(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingSide(null);
    }
  };

  const handleLabelBlur = async () => {
    if (label.trim() === sample.label || !label.trim()) return;
    setIsSaving(true);
    setError('');
    try {
      const updated = await updateWorkSample({ id: sample.id, label: label.trim() });
      onSaved(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save label');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusToggle = async () => {
    setIsSaving(true);
    setError('');
    try {
      const nextStatus = sample.status === 'published' ? 'draft' : 'published';
      const updated = await updateWorkSample({
        id: sample.id,
        label: sample.label,
        status: nextStatus,
      });
      onSaved(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete "${sample.label}"? This can't be undone.`);
    if (!confirmed) return;
    setIsDeleting(true);
    try {
      await deleteWorkSample(sample.id);
      onDeleted(sample.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      setIsDeleting(false);
    }
  };

  const canPublish = Boolean(sample.before_image_url && sample.after_image_url);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleLabelBlur}
          placeholder="Label, e.g. Residential kitchen, Area 47"
          className="flex-1 font-arial text-base font-semibold text-charcoal-500 border-b border-transparent hover:border-gray-200 focus:border-sage-400 focus:outline-none pb-1 transition-colors"
        />
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onMove('up')}
            disabled={isFirst}
            className="p-1.5 rounded text-gray-400 hover:text-charcoal-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Move up"
          >
            <ArrowUp size={15} />
          </button>
          <button
            onClick={() => onMove('down')}
            disabled={isLast}
            className="p-1.5 rounded text-gray-400 hover:text-charcoal-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Move down"
          >
            <ArrowDown size={15} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {(['before', 'after'] as const).map((side) => {
          const url = side === 'before' ? sample.before_image_url : sample.after_image_url;
          const inputRef = side === 'before' ? beforeInputRef : afterInputRef;
          return (
            <div key={side}>
              <p className="font-arial text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {side}
              </p>
              <button
                onClick={() => inputRef.current?.click()}
                disabled={uploadingSide !== null}
                className="relative w-full aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 hover:border-sage-400 overflow-hidden flex items-center justify-center bg-gray-50 transition-colors disabled:opacity-60"
              >
                {url ? (
                  <img src={url} alt={`${label} — ${side}`} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-gray-400">
                    <ImageUp size={22} />
                    <span className="font-arial text-xs">Upload photo</span>
                  </div>
                )}
                {uploadingSide === side && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <span className="font-arial text-xs text-gray-500">Uploading…</span>
                  </div>
                )}
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(side, file);
                  e.target.value = '';
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handleStatusToggle}
          disabled={isSaving || (!canPublish && sample.status !== 'published')}
          title={!canPublish ? 'Upload both photos before publishing' : undefined}
          className={`font-arial text-xs font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            sample.status === 'published'
              ? 'bg-sage-100 text-sage-600 hover:bg-sage-200'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {sample.status === 'published' ? 'Published — click to unpublish' : 'Draft — click to publish'}
        </button>
        {error && <p className="font-arial text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default function WorkGallery() {
  const navigate = useNavigate();
  const [samples, setSamples] = useState<WorkSample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const load = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await getAllWorkSamplesForAdmin();
      setSamples(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load photos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    setIsCreating(true);
    try {
      const nextOrder = samples.length > 0 ? Math.max(...samples.map((s) => s.display_order)) + 1 : 0;
      const created = await createWorkSample({
        label: '',
        display_order: nextOrder,
        status: 'draft',
      });
      setSamples((prev) => [...prev, created]);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add entry');
    } finally {
      setIsCreating(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= samples.length) return;

    const reordered = [...samples];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    // Optimistic reorder in the UI immediately, then persist both changed
    // rows' display_order — a temporarily-stale order if the save fails is
    // low-stakes here (worst case: reload the page), so this favors a
    // snappy drag-like feel over waiting on the network first.
    setSamples(reordered);

    try {
      await Promise.all([
        updateWorkSample({ id: reordered[index].id, label: reordered[index].label, display_order: index }),
        updateWorkSample({ id: reordered[targetIndex].id, label: reordered[targetIndex].label, display_order: targetIndex }),
      ]);
      setSamples((prev) =>
        prev.map((s, i) => (i === index || i === targetIndex ? { ...s, display_order: i } : s))
      );
    } catch {
      load(); // fall back to the server's real order if the reorder save failed
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-charcoal-500 px-6 py-5 md:px-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-garamond text-white text-xl md:text-2xl font-bold">
              Work photos
            </h1>
            <p className="font-arial text-charcoal-200 text-xs mt-1">
              Before/after gallery — Home page and hero
            </p>
          </div>
          <div className="flex items-center gap-5">
            <Link
              to="/admin"
              className="flex items-center gap-2 text-charcoal-200 hover:text-white text-sm font-arial transition-colors"
            >
              <LayoutTemplate size={16} /> Your posts
            </Link>
            <Link
              to="/admin/pages"
              className="flex items-center gap-2 text-charcoal-200 hover:text-white text-sm font-arial transition-colors"
            >
              <LayoutTemplate size={16} /> Site pages
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-charcoal-200 hover:text-white text-sm font-arial transition-colors"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 md:px-10 py-8">
        <div className="rounded-2xl bg-white border border-gray-200 p-4 mb-6 font-arial text-sm text-gray-600 leading-relaxed">
          Upload a <strong>before</strong> and <strong>after</strong> photo for each entry, then
          publish it — published entries appear on the Home page gallery in
          the order shown here, and the first published entry also appears
          in the hero. Until at least one entry is published, the site shows
          placeholder samples instead (not real photos).
        </div>

        {loadError && (
          <p className="font-arial text-sm text-red-500 mb-4">{loadError}</p>
        )}

        {isLoading ? (
          <p className="font-arial text-sm text-gray-400">Loading…</p>
        ) : (
          <div className="space-y-4">
            {samples.map((sample, i) => (
              <SampleRow
                key={sample.id}
                sample={sample}
                onSaved={(updated) =>
                  setSamples((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
                }
                onDeleted={(id) => setSamples((prev) => prev.filter((s) => s.id !== id))}
                onMove={(direction) => handleMove(i, direction)}
                isFirst={i === 0}
                isLast={i === samples.length - 1}
              />
            ))}
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={isCreating}
          className="mt-6 flex items-center gap-2 bg-sage-400 text-white px-5 py-2.5 rounded-lg font-arial text-sm font-semibold hover:bg-sage-500 transition-colors disabled:opacity-60"
        >
          <Plus size={16} /> {isCreating ? 'Adding…' : 'Add entry'}
        </button>
      </main>
    </div>
  );
}
