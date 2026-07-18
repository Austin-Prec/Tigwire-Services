import { useRef, useState } from 'react';
import { ImagePlus, Plus, Trash2 } from 'lucide-react';
import { uploadArticleImage } from '../../lib/articles';

// The real, public routes of the site — kept as a fixed list rather than free
// text so a button can never silently point at a page that doesn't exist.
const SITE_PAGES = [
  { label: 'Home', value: '/' },
  { label: 'About', value: '/about' },
  { label: 'Services', value: '/services' },
  { label: 'Frameworks', value: '/frameworks' },
  { label: 'Insights', value: '/insights' },
  { label: 'Contact', value: '/contact' },
];

interface HeroButton {
  label: string;
  link: string;
  style: 'primary' | 'secondary';
}

interface HeroContent {
  background_image_url?: string;
  headline?: string;
  subheadline?: string;
  quote?: string;
  buttons?: HeroButton[];
}

interface HeroBlockEditorProps {
  content: HeroContent;
  onChange: (content: HeroContent) => void;
}

export default function HeroBlockEditor({ content, onChange }: HeroBlockEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const buttons = content.buttons ?? [];

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError('');
    try {
      const url = await uploadArticleImage(file);
      onChange({ ...content, background_image_url: url });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const updateButton = (index: number, field: keyof HeroButton, value: string) => {
    const next = [...buttons];
    next[index] = { ...next[index], [field]: value } as HeroButton;
    onChange({ ...content, buttons: next });
  };

  const addButton = () => {
    onChange({
      ...content,
      buttons: [...buttons, { label: '', link: '/contact', style: 'secondary' }],
    });
  };

  const removeButton = (index: number) => {
    onChange({ ...content, buttons: buttons.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-2">
          Background image
        </label>
        {content.background_image_url ? (
          <div className="relative w-full max-w-xs">
            <img
              src={content.background_image_url}
              alt=""
              className="w-full h-28 object-cover rounded-lg"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-xs text-navy-500 hover:underline font-arial"
            >
              Replace image
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full max-w-xs h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-navy-300 hover:text-navy-400 transition-colors"
          >
            <ImagePlus size={20} />
            <span className="font-arial text-xs">{isUploading ? 'Uploading…' : 'Add background image'}</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = '';
          }}
        />
        {uploadError && <p className="text-sage-400 text-xs font-arial mt-1">{uploadError}</p>}
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">Headline</label>
        <textarea
          value={content.headline ?? ''}
          onChange={(e) => onChange({ ...content, headline: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400 resize-none"
        />
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">Subheadline</label>
        <input
          type="text"
          value={content.subheadline ?? ''}
          onChange={(e) => onChange({ ...content, subheadline: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
        />
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
          Pull quote (shown in italics below the subheadline)
        </label>
        <textarea
          value={content.quote ?? ''}
          onChange={(e) => onChange({ ...content, quote: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400 resize-none"
        />
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-2">Buttons</label>
        <div className="space-y-2">
          {buttons.map((btn, i) => (
            <div key={i} className="flex items-center gap-2 flex-wrap">
              <input
                type="text"
                value={btn.label}
                onChange={(e) => updateButton(i, 'label', e.target.value)}
                placeholder="Button text"
                className="flex-1 min-w-[140px] px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
              />
              <select
                value={btn.link}
                onChange={(e) => updateButton(i, 'link', e.target.value)}
                className="px-2 py-1.5 border border-gray-300 rounded-lg font-arial text-xs focus:outline-none focus:border-navy-400"
              >
                {SITE_PAGES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <select
                value={btn.style}
                onChange={(e) => updateButton(i, 'style', e.target.value)}
                className="px-2 py-1.5 border border-gray-300 rounded-lg font-arial text-xs focus:outline-none focus:border-navy-400"
              >
                <option value="primary">Primary (filled)</option>
                <option value="secondary">Secondary (outline)</option>
              </select>
              <button
                onClick={() => removeButton(i)}
                className="p-1.5 text-gray-400 hover:text-sage-400 transition-colors"
                title="Remove button"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        {buttons.length < 2 && (
          <button
            onClick={addButton}
            className="mt-2 flex items-center gap-1 text-xs text-navy-500 hover:underline font-arial"
          >
            <Plus size={12} /> Add button
          </button>
        )}
      </div>
    </div>
  );
}
