import { Plus, Trash2 } from 'lucide-react';

interface Stat {
  value: string;
  label: string;
  detail: string;
}

interface StatBarContent {
  label?: string;
  stats?: Stat[];
}

interface StatBarBlockEditorProps {
  content: StatBarContent;
  onChange: (content: StatBarContent) => void;
}

export default function StatBarBlockEditor({ content, onChange }: StatBarBlockEditorProps) {
  const stats = content.stats ?? [];

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const next = [...stats];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...content, stats: next });
  };

  const addStat = () => {
    onChange({ ...content, stats: [...stats, { value: '', label: '', detail: '' }] });
  };

  const removeStat = (index: number) => {
    onChange({ ...content, stats: stats.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
          Section label (shown above the stats)
        </label>
        <input
          type="text"
          value={content.label ?? ''}
          onChange={(e) => onChange({ ...content, label: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
        />
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-2">Stats</label>
        <div className="space-y-2">
          {stats.map((stat, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 grid grid-cols-3 gap-2">
              <div className="col-span-3 flex justify-end">
                <button
                  onClick={() => removeStat(i)}
                  className="p-1 text-gray-400 hover:text-sage-400 transition-colors -mt-1"
                  title="Remove stat"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <div>
                <label className="block font-arial text-[11px] text-gray-400 mb-1">Value</label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(i, 'value', e.target.value)}
                  placeholder="e.g. 9"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
                />
              </div>
              <div>
                <label className="block font-arial text-[11px] text-gray-400 mb-1">Label</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(i, 'label', e.target.value)}
                  placeholder="e.g. Long-term Clients"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
                />
              </div>
              <div>
                <label className="block font-arial text-[11px] text-gray-400 mb-1">Detail</label>
                <input
                  type="text"
                  value={stat.detail}
                  onChange={(e) => updateStat(i, 'detail', e.target.value)}
                  placeholder="e.g. UN agencies, bilateral"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addStat}
          className="mt-2 flex items-center gap-1 text-xs text-navy-500 hover:underline font-arial"
        >
          <Plus size={12} /> Add stat
        </button>
      </div>
    </div>
  );
}
