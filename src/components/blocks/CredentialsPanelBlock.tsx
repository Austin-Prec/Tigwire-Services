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

interface CredentialsPanelBlockProps {
  content: {
    panels?: CredentialPanel[];
  };
}

export default function CredentialsPanelBlock({ content }: CredentialsPanelBlockProps) {
  if (!content.panels || content.panels.length === 0) return null;

  return (
    <section className="bg-white pb-16 md:pb-24">
      <div className="container-main px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.panels.map((panel, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-gray-50 p-5 transition-all duration-300 hover:border-transparent hover:shadow-[0_16px_32px_-16px_rgba(21, 24, 26,0.2)]"
            >
              <p className="font-arial text-gray-400 text-xs uppercase tracking-wider mb-2">
                {panel.heading}
              </p>
              {panel.fields.map((field, j) => (
                <p key={j} className="font-arial text-charcoal-600 text-sm">
                  <span className="text-gray-400">{field.label}:</span> {field.value}
                </p>
              ))}
              {panel.note && (
                <p className="font-arial text-clay-500 text-xs mt-1">{panel.note}</p>
              )}
              {panel.note2 && (
                <p className="font-arial text-gray-400 text-xs mt-2">{panel.note2}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
