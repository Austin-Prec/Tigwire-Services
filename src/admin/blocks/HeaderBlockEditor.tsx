interface HeaderContent {
  title?: string;
  intro?: string;
}

interface HeaderBlockEditorProps {
  content: HeaderContent;
  onChange: (content: HeaderContent) => void;
}

export default function HeaderBlockEditor({ content, onChange }: HeaderBlockEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
          Page title
        </label>
        <input
          type="text"
          value={content.title ?? ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
        />
      </div>
      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
          Intro text
        </label>
        <textarea
          value={content.intro ?? ''}
          onChange={(e) => onChange({ ...content, intro: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400 resize-none"
        />
      </div>
    </div>
  );
}
