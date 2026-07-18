import { useRef, useState } from 'react';
import { ImagePlus, Plus, Trash2 } from 'lucide-react';
import { uploadArticleImage } from '../../lib/articles';

const BADGE_ICONS = ['Briefcase', 'MapPin', 'Calendar', 'Award'];

interface PhotoContent {
  image_url?: string;
  alt?: string;
  badges?: { icon: string; text: string }[];
}

interface PhotoBlockEditorProps {
  content: PhotoContent;
  onChange: (content: PhotoContent) => void;
}

export default function PhotoBlockEditor({ content, onChange }: PhotoBlockEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const badges = content.badges ?? [];

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError('');
    try {
      // Reuses the same image-upload edge function and storage bucket built
      // for blog post images — a photo is a photo, regardless of which part
      // of the admin panel is uploading it.
      const url = await uploadArticleImage(file);
      onChange({ ...content, image_url: url });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const updateBadge = (index: number, field: 'icon' | 'text', value: string) => {
    const next = [...badges];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...content, badges: next });
  };

  const addBadge = () => {
    onChange({ ...content, badges: [...badges, { icon: 'Briefcase', text: '' }] });
  };

  const removeBadge = (index: number) => {
    onChange({ ...content, badges: badges.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-2">Photo</label>
        {content.image_url ? (
          <div className="relative w-40">
            <img src={content.image_url} alt="" className="w-40 h-40 object-cover rounded-lg" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-xs text-charcoal-500 hover:underline font-arial"
            >
              Replace photo
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-charcoal-300 hover:text-charcoal-400 transition-colors"
          >
            <ImagePlus size={22} />
            <span className="font-arial text-xs">{isUploading ? 'Uploading…' : 'Add photo'}</span>
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
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-2">
          Badges (shown under the photo)
        </label>
        <div className="space-y-2">
          {badges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                value={badge.icon}
                onChange={(e) => updateBadge(i, 'icon', e.target.value)}
                className="px-2 py-1.5 border border-gray-300 rounded-lg font-arial text-xs focus:outline-none focus:border-charcoal-400"
              >
                {BADGE_ICONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <input
                type="text"
                value={badge.text}
                onChange={(e) => updateBadge(i, 'text', e.target.value)}
                placeholder="e.g. Southern Africa"
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
              />
              <button
                onClick={() => removeBadge(i)}
                className="p-1.5 text-gray-400 hover:text-sage-400 transition-colors"
                title="Remove badge"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addBadge}
          className="mt-2 flex items-center gap-1 text-xs text-charcoal-500 hover:underline font-arial"
        >
          <Plus size={12} /> Add badge
        </button>
      </div>
    </div>
  );
}
