import { Plus, Trash2 } from 'lucide-react';

interface CredentialField {
  label: string;
  value: string;
}

interface CredentialPanel {
  heading: string;
  fields: CredentialField[];
  note?: string;
  note2?: string;
}

interface CredentialsPanelContent {
  panels?: CredentialPanel[];
}

interface CredentialsPanelBlockEditorProps {
  content: CredentialsPanelContent;
  onChange: (content: CredentialsPanelContent) => void;
}

export default function CredentialsPanelBlockEditor({
  content,
  onChange,
}: CredentialsPanelBlockEditorProps) {
  const panels = content.panels ?? [];

  const updatePanel = (index: number, updates: Partial<CredentialPanel>) => {
    const next = [...panels];
    next[index] = { ...next[index], ...updates };
    onChange({ ...content, panels: next });
  };

  const addPanel = () => {
    onChange({ ...content, panels: [...panels, { heading: '', fields: [{ label: '', value: '' }] }] });
  };

  const removePanel = (index: number) => {
    onChange({ ...content, panels: panels.filter((_, i) => i !== index) });
  };

  const updateField = (panelIndex: number, fieldIndex: number, key: keyof CredentialField, value: string) => {
    const panel = panels[panelIndex];
    const nextFields = [...panel.fields];
    nextFields[fieldIndex] = { ...nextFields[fieldIndex], [key]: value };
    updatePanel(panelIndex, { fields: nextFields });
  };

  const addField = (panelIndex: number) => {
    const panel = panels[panelIndex];
    updatePanel(panelIndex, { fields: [...panel.fields, { label: '', value: '' }] });
  };

  const removeField = (panelIndex: number, fieldIndex: number) => {
    const panel = panels[panelIndex];
    updatePanel(panelIndex, { fields: panel.fields.filter((_, i) => i !== fieldIndex) });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {panels.map((panel, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={panel.heading}
                onChange={(e) => updatePanel(i, { heading: e.target.value })}
                placeholder="Panel heading, e.g. Legal Registration"
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-sm font-semibold focus:outline-none focus:border-navy-400"
              />
              <button
                onClick={() => removePanel(i)}
                className="p-1.5 text-gray-400 hover:text-sage-400 transition-colors"
                title="Remove panel"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="space-y-1.5 pl-2">
              {panel.fields.map((field, j) => (
                <div key={j} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(i, j, 'label', e.target.value)}
                    placeholder="Label"
                    className="w-1/3 px-2 py-1 border border-gray-300 rounded-lg font-arial text-xs focus:outline-none focus:border-navy-400"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => updateField(i, j, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded-lg font-arial text-xs focus:outline-none focus:border-navy-400"
                  />
                  <button
                    onClick={() => removeField(i, j)}
                    className="p-1 text-gray-400 hover:text-sage-400 transition-colors"
                    title="Remove field"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addField(i)}
                className="flex items-center gap-1 text-xs text-navy-500 hover:underline font-arial"
              >
                <Plus size={11} /> Add field
              </button>
            </div>

            <input
              type="text"
              value={panel.note ?? ''}
              onChange={(e) => updatePanel(i, { note: e.target.value })}
              placeholder="Note (optional, e.g. ✓ Certificate issued 08 May 2026)"
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-xs focus:outline-none focus:border-navy-400"
            />
            <input
              type="text"
              value={panel.note2 ?? ''}
              onChange={(e) => updatePanel(i, { note2: e.target.value })}
              placeholder="Second note (optional)"
              className="w-full px-3 py-1.5 border border-gray-300 rounded-lg font-arial text-xs focus:outline-none focus:border-navy-400"
            />
          </div>
        ))}
      </div>
      <button
        onClick={addPanel}
        className="flex items-center gap-1 text-xs text-navy-500 hover:underline font-arial"
      >
        <Plus size={12} /> Add panel
      </button>
    </div>
  );
}
