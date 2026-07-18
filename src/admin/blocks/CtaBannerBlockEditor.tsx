const SITE_PAGES = [
  { label: 'Home', value: '/' },
  { label: 'About', value: '/about' },
  { label: 'Services', value: '/services' },
  { label: 'Frameworks', value: '/frameworks' },
  { label: 'Insights', value: '/insights' },
  { label: 'Contact', value: '/contact' },
];

interface CtaBannerContent {
  body?: string;
  button_label?: string;
  button_link?: string;
}

interface CtaBannerBlockEditorProps {
  content: CtaBannerContent;
  onChange: (content: CtaBannerContent) => void;
}

export default function CtaBannerBlockEditor({ content, onChange }: CtaBannerBlockEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">Body text</label>
        <textarea
          value={content.body ?? ''}
          onChange={(e) => onChange({ ...content, body: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400 resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
            Button text
          </label>
          <input
            type="text"
            value={content.button_label ?? ''}
            onChange={(e) => onChange({ ...content, button_label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
          />
        </div>
        <div>
          <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
            Button links to
          </label>
          <select
            value={content.button_link ?? '/contact'}
            onChange={(e) => onChange({ ...content, button_link: e.target.value })}
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
