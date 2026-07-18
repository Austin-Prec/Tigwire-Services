import { Plus, Trash2 } from 'lucide-react';

const CARD_ICONS = ['Shield', 'Search', 'FileCheck', 'TrendingUp'];

interface ValueCard {
  icon: string;
  title: string;
  description: string;
}

interface ValueCardsContent {
  title?: string;
  subtitle?: string;
  cards?: ValueCard[];
}

interface ValueCardsBlockEditorProps {
  content: ValueCardsContent;
  onChange: (content: ValueCardsContent) => void;
}

export default function ValueCardsBlockEditor({ content, onChange }: ValueCardsBlockEditorProps) {
  const cards = content.cards ?? [];

  const updateCard = (index: number, field: keyof ValueCard, value: string) => {
    const next = [...cards];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...content, cards: next });
  };

  const addCard = () => {
    onChange({ ...content, cards: [...cards, { icon: 'Shield', title: '', description: '' }] });
  };

  const removeCard = (index: number) => {
    onChange({ ...content, cards: cards.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">
          Section title
        </label>
        <input
          type="text"
          value={content.title ?? ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
        />
      </div>
      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-1">Subtitle</label>
        <input
          type="text"
          value={content.subtitle ?? ''}
          onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
        />
      </div>

      <div>
        <label className="block font-arial text-xs font-semibold text-gray-500 mb-2">Cards</label>
        <div className="space-y-3">
          {cards.map((card, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <select
                  value={card.icon}
                  onChange={(e) => updateCard(i, 'icon', e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded-lg font-arial text-xs focus:outline-none focus:border-navy-400"
                >
                  {CARD_ICONS.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <button
                  onClick={() => removeCard(i)}
                  className="p-1 text-gray-400 hover:text-sage-400 transition-colors"
                  title="Remove card"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <input
                type="text"
                value={card.title}
                onChange={(e) => updateCard(i, 'title', e.target.value)}
                placeholder="Card title"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400"
              />
              <textarea
                value={card.description}
                onChange={(e) => updateCard(i, 'description', e.target.value)}
                placeholder="Card description"
                rows={2}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm focus:outline-none focus:border-navy-400 resize-none"
              />
            </div>
          ))}
        </div>
        <button
          onClick={addCard}
          className="mt-2 flex items-center gap-1 text-xs text-navy-500 hover:underline font-arial"
        >
          <Plus size={12} /> Add card
        </button>
      </div>
    </div>
  );
}
