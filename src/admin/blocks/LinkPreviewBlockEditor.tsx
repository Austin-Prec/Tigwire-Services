const SITE_PAGES = [
  { label: 'Home', value: '/' },
  { label: 'About', value: '/about' },
  { label: 'Services', value: '/services' },
  { label: 'Frameworks', value: '/frameworks' },
  { label: 'Insights', value: '/insights' },
  { label: 'Contact', value: '/contact' },
];

interface LinkPreviewContent {
  title?: string;
  body?: string;
  link_text?: string;
  link?: string;
}

interface LinkPreviewBlockEditorProps {
  content: LinkPreviewContent;
  onChange: (content: LinkPreviewContent) => void;
}

export default function LinkPreviewBlockEditor({ content, onChange }: LinkPreviewBlockEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">Title</label>
        <input
          type="text"
          value={content.title ?? ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
        />
      </div>
      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">Body text</label>
        <textarea
          value={content.body ?? ''}
          onChange={(e) => onChange({ ...content, body: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400 resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">Link text</label>
          <input
            type="text"
            value={content.link_text ?? ''}
            onChange={(e) => onChange({ ...content, link_text: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
          />
        </div>
        <div>
          <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">Links to</label>
          <select
            value={content.link ?? '/about'}
            onChange={(e) => onChange({ ...content, link: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
          >
            {SITE_PAGES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
