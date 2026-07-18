import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ImagePlus, X } from 'lucide-react';
import RichTextEditor from './components/RichTextEditor';
import {
  createArticle,
  updateArticle,
  uploadArticleImage,
  getAllArticlesForAdmin,
  type Article,
} from '../lib/articles';

const CATEGORIES = ['Cleaning Tips', 'Hygiene & Health', 'Company News', 'Sustainability'];
const ICONS = ['Sparkles', 'Droplets', 'Leaf', 'Building2'];

export default function Editor() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [icon, setIcon] = useState(ICONS[0]);
  const [readTime, setReadTime] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [currentStatus, setCurrentStatus] = useState<'draft' | 'published'>('draft');

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [error, setError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) return;

    getAllArticlesForAdmin()
      .then((articles) => {
        const found = articles.find((a: Article) => a.id === id);
        if (!found) {
          setError('That post could not be found.');
          return;
        }
        setTitle(found.title);
        setExcerpt(found.excerpt);
        setContent(found.content);
        setCategory(found.category || CATEGORIES[0]);
        setIcon(found.icon || ICONS[0]);
        setReadTime(found.read_time);
        setCoverImageUrl(found.cover_image_url);
        setCurrentStatus(found.status);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load post'))
      .finally(() => setIsLoading(false));
  }, [id, isEditing]);

  const handleCoverUpload = async (file: File) => {
    setIsUploadingCover(true);
    setError('');
    try {
      const url = await uploadArticleImage(file);
      setCoverImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload cover image');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const save = async (status: 'draft' | 'published') => {
    if (!title.trim()) {
      setError('Give the post a title before saving.');
      return;
    }

    setError('');
    setSavedMessage('');
    const setLoadingFlag = status === 'published' ? setIsPublishing : setIsSavingDraft;
    setLoadingFlag(true);

    const payload = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content,
      category,
      icon,
      read_time: readTime.trim(),
      cover_image_url: coverImageUrl,
      status,
    };

    try {
      if (isEditing && id) {
        await updateArticle({ id, ...payload });
        setCurrentStatus(status);
        setSavedMessage(status === 'published' ? 'Published.' : 'Draft saved.');
      } else {
        const created = await createArticle(payload);
        setSavedMessage(status === 'published' ? 'Published.' : 'Draft saved.');
        // Move to the real edit URL so subsequent saves update this post
        // instead of accidentally creating duplicates.
        navigate(`/admin/edit/${created.id}`, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setLoadingFlag(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="font-arial text-gray-500 text-sm">Loading post…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-charcoal-500 px-6 py-5 md:px-10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-charcoal-200 hover:text-white text-sm font-arial transition-colors shrink-0"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="flex items-center gap-3">
            {savedMessage && (
              <span className="font-arial text-xs text-charcoal-200">{savedMessage}</span>
            )}
            <button
              onClick={() => save('draft')}
              disabled={isSavingDraft || isPublishing}
              className="px-4 py-2 border border-charcoal-300 text-charcoal-100 rounded-lg font-arial text-sm font-semibold hover:bg-charcoal-400 transition-colors disabled:opacity-50"
            >
              {isSavingDraft ? 'Saving…' : 'Save draft'}
            </button>
            <button
              onClick={() => save('published')}
              disabled={isSavingDraft || isPublishing}
              className="px-5 py-2 bg-sage-400 text-white rounded-lg font-arial text-sm font-semibold hover:bg-sage-500 transition-colors disabled:opacity-50"
            >
              {isPublishing
                ? 'Publishing…'
                : currentStatus === 'published'
                ? 'Update live post'
                : 'Publish'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 md:px-10 py-8">
        {error && (
          <p className="font-arial text-sage-400 text-sm mb-4 bg-sage-50 border border-sage-100 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="w-full font-garamond text-3xl md:text-4xl font-bold text-charcoal-500 placeholder:text-gray-300 focus:outline-none mb-4 bg-transparent"
        />

        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="A one or two sentence summary shown on the Insights page…"
          rows={2}
          className="w-full font-arial text-gray-600 placeholder:text-gray-300 focus:outline-none mb-6 bg-transparent resize-none"
        />

        {/* Cover image */}
        <div className="mb-6">
          {coverImageUrl ? (
            <div className="relative rounded-lg overflow-hidden group">
              <img src={coverImageUrl} alt="" className="w-full h-56 object-cover" />
              <button
                onClick={() => setCoverImageUrl('')}
                className="absolute top-3 right-3 bg-white/90 text-gray-700 p-1.5 rounded-full hover:bg-white transition-colors"
                title="Remove cover image"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={isUploadingCover}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-charcoal-300 hover:text-charcoal-400 transition-colors disabled:opacity-60"
            >
              <ImagePlus size={22} />
              <span className="font-arial text-sm">
                {isUploadingCover ? 'Uploading…' : 'Add a cover image (optional)'}
              </span>
            </button>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleCoverUpload(file);
              e.target.value = '';
            }}
          />
        </div>

        {/* Metadata row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label="Icon">
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
            >
              {ICONS.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </Field>

          <Field label="Read time">
            <input
              type="text"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="4 min read"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
            />
          </Field>
        </div>

        {/* Body */}
        <RichTextEditor value={content} onChange={setContent} />

        <p className="font-arial text-xs text-gray-400 mt-3">
          Type directly, paste from Word or another site, or drag a photo straight into the text.
        </p>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
