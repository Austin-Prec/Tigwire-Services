import { Plus, Trash2 } from 'lucide-react';

const CHANNEL_ICONS = ['Mail', 'Phone', 'MapPin', 'Linkedin'];

interface ContactChannel {
  icon: string;
  label: string;
  value: string;
  link?: string;
  sub?: string;
}

interface ContactSidebarContent {
  heading?: string;
  channels?: ContactChannel[];
  response_time?: string;
}

interface ContactSidebarBlockEditorProps {
  content: ContactSidebarContent;
  onChange: (content: ContactSidebarContent) => void;
}

export default function ContactSidebarBlockEditor({
  content,
  onChange,
}: ContactSidebarBlockEditorProps) {
  const channels = content.channels ?? [];

  const updateChannel = (index: number, updates: Partial<ContactChannel>) => {
    const next = [...channels];
    next[index] = { ...next[index], ...updates };
    onChange({ ...content, channels: next });
  };

  const addChannel = () => {
    onChange({ ...content, channels: [...channels, { icon: 'Mail', label: '', value: '' }] });
  };

  const removeChannel = (index: number) => {
    onChange({ ...content, channels: channels.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
          Sidebar heading
        </label>
        <input
          type="text"
          value={content.heading ?? ''}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
        />
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-2">
          Contact channels
        </label>
        <div className="space-y-2">
          {channels.map((channel, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <select
                  value={channel.icon}
                  onChange={(e) => updateChannel(i, { icon: e.target.value })}
                  className="px-2 py-1.5 border border-gray-300 rounded-lg font-arial text-xs focus:outline-none focus:border-navy-400"
                >
                  {CHANNEL_ICONS.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={channel.label}
                  onChange={(e) => updateChannel(i, { label: e.target.value })}
                  placeholder="Label, e.g. Email"
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
                />
                <button
                  onClick={() => removeChannel(i)}
                  className="p-1.5 text-gray-400 hover:text-sage-400 transition-colors"
                  title="Remove channel"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <input
                type="text"
                value={channel.value}
                onChange={(e) => updateChannel(i, { value: e.target.value })}
                placeholder="Displayed value, e.g. you@example.com"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
              />
              <input
                type="text"
                value={channel.link ?? ''}
                onChange={(e) => updateChannel(i, { link: e.target.value })}
                placeholder="Link (optional), e.g. mailto:you@example.com"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-xs focus:outline-none focus:border-navy-400"
              />
              <input
                type="text"
                value={channel.sub ?? ''}
                onChange={(e) => updateChannel(i, { sub: e.target.value })}
                placeholder="Sub-text (optional), e.g. Southern Africa"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-xs focus:outline-none focus:border-navy-400"
              />
            </div>
          ))}
        </div>
        <button
          onClick={addChannel}
          className="mt-2 flex items-center gap-1 text-xs text-navy-500 hover:underline font-arial"
        >
          <Plus size={12} /> Add channel
        </button>
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
          Response time text
        </label>
        <input
          type="text"
          value={content.response_time ?? ''}
          onChange={(e) => onChange({ ...content, response_time: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
        />
      </div>
    </div>
  );
}
