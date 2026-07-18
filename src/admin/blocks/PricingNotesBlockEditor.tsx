import { useRef } from 'react';
import { Bold, Plus, Trash2 } from 'lucide-react';

interface PricingNotesContent {
  heading?: string;
  items?: string[];
  framework_note?: string;
}

interface PricingNotesBlockEditorProps {
  content: PricingNotesContent;
  onChange: (content: PricingNotesContent) => void;
}

export default function PricingNotesBlockEditor({ content, onChange }: PricingNotesBlockEditorProps) {
  const itemRefs = useRef<Record<number, HTMLTextAreaElement | null>>({});
  const noteRef = useRef<HTMLTextAreaElement | null>(null);
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

  // Same selection-to-bold logic proven on the About page's bio editor,
  // applied here since pricing note items and the framework note both use
  // inline <strong> tags the same way bio paragraphs do.
  const wrapSelectionInBold = (
    ref: React.MutableRefObject<HTMLTextAreaElement | null>,
    applyChange: (next: string) => void
  ) => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value } = el;
    if (selectionStart === selectionEnd) return;

    const before = value.slice(0, selectionStart);
    const selected = value.slice(selectionStart, selectionEnd);
    const after = value.slice(selectionEnd);
    applyChange(`${before}<strong>${selected}</strong>${after}`);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
          Heading (emoji optional, e.g. 📌)
        </label>
        <input
          type="text"
          value={content.heading ?? ''}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
        />
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-2">
          Notes (bullet points)
        </label>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <button
                  onClick={() =>
                    wrapSelectionInBold({ current: itemRefs.current[i] }, (next) => updateItem(i, next))
                  }
                  title="Bold selected text"
                  className="p-1 text-gray-500 hover:bg-charcoal-50 hover:text-charcoal-500 rounded transition-colors"
                >
                  <Bold size={13} />
                </button>
                <button
                  onClick={() => removeItem(i)}
                  title="Remove note"
                  className="p-1 text-gray-400 hover:text-sage-400 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <textarea
                ref={(el) => { itemRefs.current[i] = el; }}
                value={item}
                onChange={(e) => updateItem(i, e.target.value)}
                rows={2}
                placeholder="Select text and click the bold icon to emphasize it."
                className="w-full px-2 py-1 font-arial text-sm focus:outline-none resize-none"
              />
            </div>
          ))}
        </div>
        <button
          onClick={addItem}
          className="mt-2 flex items-center gap-1 text-xs text-charcoal-500 hover:underline font-arial"
        >
          <Plus size={12} /> Add note
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block font-arial text-xs font-semibold text-gray-500">
            Framework note (shown centered below the notes)
          </label>
          <button
            onClick={() =>
              wrapSelectionInBold(noteRef, (next) => onChange({ ...content, framework_note: next }))
            }
            title="Bold selected text"
            className="p-1 text-gray-500 hover:bg-charcoal-50 hover:text-charcoal-500 rounded transition-colors"
          >
            <Bold size={13} />
          </button>
        </div>
        <textarea
          ref={noteRef}
          value={content.framework_note ?? ''}
          onChange={(e) => onChange({ ...content, framework_note: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400 resize-none"
        />
      </div>
    </div>
  );
}
