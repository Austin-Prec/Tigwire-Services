import { useEffect, useRef, useState } from 'react';

interface PricingNotesBlockProps {
  content: {
    heading?: string;
    items?: string[];
    framework_note?: string;
  };
}

export default function PricingNotesBlock({ content }: PricingNotesBlockProps) {
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
    <section className="bg-white pb-16 md:pb-24">
      <div
        ref={ref}
        className={`container-main px-6 lg:px-20 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="rounded-xl p-6 bg-gray-50 border border-gray-200 transition-all duration-300 hover:border-transparent hover:shadow-[0_20px_40px_-16px_rgba(21,24,26,0.2)]">
          {content.heading && (
            <h4 className="font-garamond text-charcoal-500 text-lg font-semibold mb-3">
              {content.heading}
            </h4>
          )}
          <ul className="space-y-2 text-sm text-gray-600">
            {content.items?.map((item, i) => (
              <li key={i}>
                • <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        </div>

        {content.framework_note && (
          <div className="mt-8 text-center">
            <p
              className="font-arial text-gray-500 text-sm"
              dangerouslySetInnerHTML={{
                __html: content.framework_note.replace(
                  /<strong>/g,
                  '<strong class="text-charcoal-600">'
                ),
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
