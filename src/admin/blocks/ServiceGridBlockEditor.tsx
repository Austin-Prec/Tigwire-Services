import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const SERVICE_ICONS = ['Shield', 'Search', 'FileCheck', 'GraduationCap', 'BookOpen', 'TrendingUp', 'ClipboardCheck'];

interface Service {
  icon: string;
  title: string;
  description: string;
  outcome: string;
  price: string;
  price_note: string;
  cta_type: 'fixed' | 'custom';
}

interface ServiceGridContent {
  services?: Service[];
}

interface ServiceGridBlockEditorProps {
  content: ServiceGridContent;
  onChange: (content: ServiceGridContent) => void;
}

export default function ServiceGridBlockEditor({ content, onChange }: ServiceGridBlockEditorProps) {
  const services = content.services ?? [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const updateService = (index: number, field: keyof Service, value: string) => {
    const next = [...services];
    next[index] = { ...next[index], [field]: value } as Service;
    onChange({ ...content, services: next });
  };

  const addService = () => {
    onChange({
      ...content,
      services: [
        ...services,
        { icon: 'Shield', title: '', description: '', outcome: '', price: '', price_note: '', cta_type: 'fixed' },
      ],
    });
    setExpandedIndex(services.length);
  };

  const removeService = (index: number) => {
    onChange({ ...content, services: services.filter((_, i) => i !== index) });
  };

  return (
    <div>
      <label className="block font-arial text-xs font-semibold text-gray-500 mb-2">
        Services ({services.length})
      </label>
      <div className="space-y-2">
        {services.map((service, i) => {
          const isExpanded = expandedIndex === i;
          return (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="font-arial text-sm text-gray-700 truncate">
                  {service.title || 'Untitled service'}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      removeService(i);
                    }}
                    className="p-1 text-gray-400 hover:text-sage-400 transition-colors cursor-pointer"
                    title="Remove service"
                  >
                    <Trash2 size={13} />
                  </span>
                  {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-arial text-[11px] text-gray-400 mb-1">Icon</label>
                      <select
                        value={service.icon}
                        onChange={(e) => updateService(i, 'icon', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
                      >
                        {SERVICE_ICONS.map((icon) => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-arial text-[11px] text-gray-400 mb-1">
                        Button says
                      </label>
                      <select
                        value={service.cta_type}
                        onChange={(e) => updateService(i, 'cta_type', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
                      >
                        <option value="fixed">Book Service</option>
                        <option value="custom">Request Quote</option>
                      </select>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => updateService(i, 'title', e.target.value)}
                    placeholder="Service title"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
                  />

                  <div>
                    <label className="block font-arial text-[11px] text-gray-400 mb-1">
                      Outcome (shown in a highlighted quote)
                    </label>
                    <input
                      type="text"
                      value={service.outcome}
                      onChange={(e) => updateService(i, 'outcome', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
                    />
                  </div>

                  <textarea
                    value={service.description}
                    onChange={(e) => updateService(i, 'description', e.target.value)}
                    placeholder="Description"
                    rows={2}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400 resize-none"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-arial text-[11px] text-gray-400 mb-1">Price</label>
                      <input
                        type="text"
                        value={service.price}
                        onChange={(e) => updateService(i, 'price', e.target.value)}
                        placeholder="e.g. $2,500 - $4,500 USD"
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
                      />
                    </div>
                    <div>
                      <label className="block font-arial text-[11px] text-gray-400 mb-1">
                        Price note
                      </label>
                      <input
                        type="text"
                        value={service.price_note}
                        onChange={(e) => updateService(i, 'price_note', e.target.value)}
                        placeholder="e.g. per month"
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-charcoal-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button
        onClick={addService}
        className="mt-2 flex items-center gap-1 text-xs text-charcoal-500 hover:underline font-arial"
      >
        <Plus size={12} /> Add service
      </button>
    </div>
  );
}
