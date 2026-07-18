import { useEffect, useRef, useState } from 'react';

interface BioBlockProps {
  content: {
    name?: string;
    title?: string;
    quote?: string;
    paragraphs?: string[];
    footnote?: string;
  };
  fullWidth?: boolean;
}

export default function BioBlock({ content, fullWidth }: BioBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${fullWidth ? '' : 'lg:col-span-2'} transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {content.name && (
        <h2 className="font-garamond text-navy-500 text-2xl font-semibold mb-2">
          {content.name}
        </h2>
      )}
      {content.title && (
        <p className="font-arial text-sage-400 text-sm uppercase tracking-wider font-semibold mb-4">
          {content.title}
        </p>
      )}

      {content.quote && (
        <div className="relative bg-navy-50 border-l-4 border-sage-400 rounded-r-lg p-5 mb-6 overflow-hidden shadow-[0_10px_30px_-15px_rgba(21,42,74,0.25)]">
          <div
            className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-[0.08]"
            style={{ background: 'radial-gradient(circle, #152A4A, transparent 70%)' }}
            aria-hidden="true"
          />
          <p className="relative font-arial text-navy-700 text-sm italic leading-relaxed">
            {content.quote}
          </p>
        </div>
      )}

      <div className="space-y-4 font-arial text-gray-600 text-base leading-relaxed">
        {content.paragraphs?.map((p, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
        {content.footnote && (
          <p className="text-gray-400 text-sm pt-2">{content.footnote}</p>
        )}
      </div>
    </div>
  );
}
