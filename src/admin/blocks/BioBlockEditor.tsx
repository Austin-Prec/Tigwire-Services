import { useRef } from 'react';
import { Bold, Plus, Trash2 } from 'lucide-react';

interface BioContent {
  name?: string;
  title?: string;
  quote?: string;
  paragraphs?: string[];
  footnote?: string;
}

interface BioBlockEditorProps {
  content: BioContent;
  onChange: (content: BioContent) => void;
}

export default function BioBlockEditor({ content, onChange }: BioBlockEditorProps) {
  const textareaRefs = useRef<Record<number, HTMLTextAreaElement | null>>({});
  const paragraphs = content.paragraphs ?? [];

  const updateParagraph = (index: number, value: string) => {
    const next = [...paragraphs];
    next[index] = value;
    onChange({ ...content, paragraphs: next });
  };

  const addParagraph = () => {
    onChange({ ...content, paragraphs: [...paragraphs, ''] });
  };

  const removeParagraph = (index: number) => {
    onChange({ ...content, paragraphs: paragraphs.filter((_, i) => i !== index) });
  };

  // Wraps the currently selected text in a paragraph with <strong> tags —
  // gives access to the same bold-emphasis the original bio paragraphs use
  // (e.g. highlighting "$300,000+ USD") without needing a full rich text
  // editor instance for what is otherwise a handful of plain paragraphs.
  const wrapSelectionInBold = (index: number) => {
    const el = textareaRefs.current[index];
    if (!el) return;
    const { selectionStart, selectionEnd, value } = el;
    if (selectionStart === selectionEnd) return; // nothing selected

    const before = value.slice(0, selectionStart);
    const selected = value.slice(selectionStart, selectionEnd);
    const after = value.slice(selectionEnd);
    const next = `${before}<strong>${selected}</strong>${after}`;
    updateParagraph(index, next);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">Name</label>
          <input
            type="text"
            value={content.name ?? ''}
            onChange={(e) => onChange({ ...content, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
          />
        </div>
        <div>
          <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">Title</label>
          <input
            type="text"
            value={content.title ?? ''}
            onChange={(e) => onChange({ ...content, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
          />
        </div>
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
          Pull quote (shown in a highlighted box)
        </label>
        <textarea
          value={content.quote ?? ''}
          onChange={(e) => onChange({ ...content, quote: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400 resize-none"
        />
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
          Bio paragraphs
        </label>
        <div className="space-y-3">
          {paragraphs.map((p, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <button
                  onClick={() => wrapSelectionInBold(i)}
                  title="Bold selected text"
                  className="p-1 text-gray-500 hover:bg-navy-50 hover:text-navy-500 rounded transition-colors"
                >
                  <Bold size={13} />
                </button>
                <button
                  onClick={() => removeParagraph(i)}
                  title="Remove paragraph"
                  className="p-1 text-gray-400 hover:text-sage-400 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <textarea
                ref={(el) => { textareaRefs.current[i] = el; }}
                value={p}
                onChange={(e) => updateParagraph(i, e.target.value)}
                rows={3}
                placeholder="Select text and click the bold icon to emphasize it, e.g. a figure or framework name."
                className="w-full px-2 py-1 font-arial text-sm focus:outline-none resize-none"
              />
            </div>
          ))}
        </div>
        <button
          onClick={addParagraph}
          className="mt-2 flex items-center gap-1 text-xs text-navy-500 hover:underline font-arial"
        >
          <Plus size={12} /> Add paragraph
        </button>
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
          Footnote (optional, shown in smaller gray text)
        </label>
        <input
          type="text"
          value={content.footnote ?? ''}
          onChange={(e) => onChange({ ...content, footnote: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
        />
      </div>
    </div>
  );
}
