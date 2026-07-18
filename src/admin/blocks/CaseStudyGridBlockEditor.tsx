import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const STUDY_ICONS = ['Home', 'Building2', 'Droplets', 'HardHat'];

interface Scenario {
  category: string;
  icon: string;
  situation: string;
  approach: string;
  expect: string;
}

interface CaseStudyGridContent {
  intro_note?: string;
  studies?: Scenario[];
}

interface CaseStudyGridBlockEditorProps {
  content: CaseStudyGridContent;
  onChange: (content: CaseStudyGridContent) => void;
}

export default function CaseStudyGridBlockEditor({
  content,
  onChange,
}: CaseStudyGridBlockEditorProps) {
  const studies = content.studies ?? [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const updateStudy = (index: number, field: keyof Scenario, value: string) => {
    const next = [...studies];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...content, studies: next });
  };

  const addStudy = () => {
    onChange({
      ...content,
      studies: [
        ...studies,
        { category: '', icon: 'Home', situation: '', approach: '', expect: '' },
      ],
    });
    setExpandedIndex(studies.length);
  };

  const removeStudy = (index: number) => {
    onChange({ ...content, studies: studies.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
          Intro note (shown above the scenarios)
        </label>
        <textarea
          value={content.intro_note ?? ''}
          onChange={(e) => onChange({ ...content, intro_note: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400 resize-none"
        />
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-2">
          Scenarios ({studies.length})
        </label>
        <div className="space-y-2">
          {studies.map((study, i) => {
            const isExpanded = expandedIndex === i;
            return (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-arial text-sm text-gray-700 truncate">
                    {study.category || 'Untitled scenario'}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStudy(i);
                      }}
                      className="p-1 text-gray-400 hover:text-sage-400 transition-colors cursor-pointer"
                      title="Remove scenario"
                    >
                      <Trash2 size={13} />
                    </span>
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={study.category}
                        onChange={(e) => updateStudy(i, 'category', e.target.value)}
                        placeholder="Category, e.g. Office Cleaning"
                        className="px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
                      />
                      <select
                        value={study.icon}
                        onChange={(e) => updateStudy(i, 'icon', e.target.value)}
                        className="px-2 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
                      >
                        {STUDY_ICONS.map((icon) => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-arial text-[11px] text-gray-400 mb-1">Situation</label>
                      <textarea
                        value={study.situation}
                        onChange={(e) => updateStudy(i, 'situation', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block font-arial text-[11px] text-gray-400 mb-1">Our Approach</label>
                      <textarea
                        value={study.approach}
                        onChange={(e) => updateStudy(i, 'approach', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block font-arial text-[11px] text-gray-400 mb-1">What to Expect</label>
                      <textarea
                        value={study.expect}
                        onChange={(e) => updateStudy(i, 'expect', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={addStudy}
          className="mt-2 flex items-center gap-1 text-xs text-navy-500 hover:underline font-arial"
        >
          <Plus size={12} /> Add scenario
        </button>
      </div>
    </div>
  );
}
