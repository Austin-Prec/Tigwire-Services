import { Plus, Trash2 } from 'lucide-react';

const LIST_ICONS = ['Award', 'Shield', 'Search', 'FileCheck', 'TrendingUp', 'Briefcase'];

interface ListContent {
  title?: string;
  icon?: string;
  items?: string[];
  footnote?: string;
}

interface ListBlockEditorProps {
  content: ListContent;
  onChange: (content: ListContent) => void;
}

export default function ListBlockEditor({ content, onChange }: ListBlockEditorProps) {
  const items = content.items ?? [];

  const updateItem = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange({ ...content, items: next });
  };

  const addItem = () => {
    onChange({ ...content, items: [...items, ''] });
  };

  const removeItem = (index: number) => {
    onChange({ ...content, items: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
            Section title
          </label>
          <input
            type="text"
            value={content.title ?? ''}
            onChange={(e) => onChange({ ...content, title: e.target.value })}
            placeholder="e.g. Certifications"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
          />
        </div>
        <div>
          <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">Icon</label>
          <select
            value={content.icon ?? 'Award'}
            onChange={(e) => onChange({ ...content, icon: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
          >
            {LIST_ICONS.map((icon) => (
              <option key={icon} value={icon}>{icon}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">Items</label>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(i, e.target.value)}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
              />
              <button
                onClick={() => removeItem(i)}
                className="p-1.5 text-gray-400 hover:text-sage-400 transition-colors"
                title="Remove item"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="mt-2 flex items-center gap-1 text-xs text-charcoal-500 hover:underline font-arial"
        >
          <Plus size={12} /> Add item
        </button>
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
          Footnote (optional)
        </label>
        <input
          type="text"
          value={content.footnote ?? ''}
          onChange={(e) => onChange({ ...content, footnote: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
        />
      </div>
    </div>
  );
}
