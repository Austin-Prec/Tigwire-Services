import { Plus, Trash2 } from 'lucide-react';

const SECTION_ICONS = ['Shield', 'Search', 'FileCheck', 'TrendingUp'];

interface Pillar {
  number: string;
  name: string;
  description: string;
}

interface FrameworkSectionContent {
  icon?: string;
  heading?: string;
  subtitle?: string;
  body?: string;
  pillars?: Pillar[];
  download_label?: string;
  download_url?: string;
  variant?: 'light' | 'shaded';
}

interface FrameworkSectionBlockEditorProps {
  content: FrameworkSectionContent;
  onChange: (content: FrameworkSectionContent) => void;
}

// Roman numerals for new pillars, continuing the sequence used throughout
// this page (I, II, III...) rather than defaulting every new pillar to "I".
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

export default function FrameworkSectionBlockEditor({
  content,
  onChange,
}: FrameworkSectionBlockEditorProps) {
  const pillars = content.pillars ?? [];

  const updatePillar = (index: number, field: keyof Pillar, value: string) => {
    const next = [...pillars];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...content, pillars: next });
  };

  const addPillar = () => {
    const nextNumber = ROMAN[pillars.length] ?? String(pillars.length + 1);
    onChange({ ...content, pillars: [...pillars, { number: nextNumber, name: '', description: '' }] });
  };

  const removePillar = (index: number) => {
    onChange({ ...content, pillars: pillars.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">Icon</label>
          <select
            value={content.icon ?? 'Shield'}
            onChange={(e) => onChange({ ...content, icon: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
          >
            {SECTION_ICONS.map((icon) => (
              <option key={icon} value={icon}>{icon}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
            Background style
          </label>
          <select
            value={content.variant ?? 'light'}
            onChange={(e) => onChange({ ...content, variant: e.target.value as 'light' | 'shaded' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
          >
            <option value="light">Light (white section)</option>
            <option value="shaded">Shaded (gray section, white cards)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">Heading</label>
        <input
          type="text"
          value={content.heading ?? ''}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
        />
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
          Subtitle (shown in clay, uppercase)
        </label>
        <input
          type="text"
          value={content.subtitle ?? ''}
          onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
        />
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">Body text</label>
        <textarea
          value={content.body ?? ''}
          onChange={(e) => onChange({ ...content, body: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400 resize-none"
        />
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-2">
          Pillars ({pillars.length})
        </label>
        <div className="space-y-3">
          {pillars.map((pillar, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={pillar.number}
                  onChange={(e) => updatePillar(i, 'number', e.target.value)}
                  placeholder="No."
                  className="w-14 px-2 py-1.5 border border-gray-300 rounded-lg font-arial text-sm text-center focus:outline-none focus:border-charcoal-400"
                />
                <input
                  type="text"
                  value={pillar.name}
                  onChange={(e) => updatePillar(i, 'name', e.target.value)}
                  placeholder="Pillar name"
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
                />
                <button
                  onClick={() => removePillar(i)}
                  className="p-1.5 text-gray-400 hover:text-sage-400 transition-colors"
                  title="Remove pillar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <textarea
                value={pillar.description}
                onChange={(e) => updatePillar(i, 'description', e.target.value)}
                placeholder="Pillar description"
                rows={2}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400 resize-none"
              />
            </div>
          ))}
        </div>
        <button
          onClick={addPillar}
          className="mt-2 flex items-center gap-1 text-xs text-charcoal-500 hover:underline font-arial"
        >
          <Plus size={12} /> Add pillar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
            Download button text
          </label>
          <input
            type="text"
            value={content.download_label ?? ''}
            onChange={(e) => onChange({ ...content, download_label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
          />
        </div>
        <div>
          <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
            Download file path
          </label>
          <input
            type="text"
            value={content.download_url ?? ''}
            onChange={(e) => onChange({ ...content, download_url: e.target.value })}
            placeholder="/your-file.html"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
          />
          <p className="font-arial text-[11px] text-gray-400 mt-1">
            Path to a file already uploaded to your site, not a page.
          </p>
        </div>
      </div>
    </div>
  );
}
