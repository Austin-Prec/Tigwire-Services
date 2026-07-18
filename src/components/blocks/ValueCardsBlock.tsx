import { useEffect, useRef, useState } from 'react';
import { Shield, Search, FileCheck, TrendingUp } from 'lucide-react';

const ICONS: Record<string, typeof Shield> = { Shield, Search, FileCheck, TrendingUp };

interface ValueCard {
  icon: string;
  title: string;
  description: string;
}

interface ValueCardsBlockProps {
  content: {
    title?: string;
    subtitle?: string;
    cards?: ValueCard[];
  };
}

export default function ValueCardsBlock({ content }: ValueCardsBlockProps) {
  return (
    <section className="relative bg-white section-padding overflow-hidden">
      {/* A softer, larger radial glow than before, echoing the hero's
          top-right anchored gradient rather than a centered blob — this is
          the deep-glass language's actual signature (a light source from
          one corner) carried onto a white surface where true glass/blur
          wouldn't read correctly against a flat background. */}
      <div
        className="pointer-events-none absolute -top-1/3 -right-1/4 w-[800px] h-[800px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #B5754A, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative container-main">
        <div className="text-center mb-14">
          {content.title && (
            <h2 className="font-garamond text-navy-500 text-3xl md:text-4xl font-semibold mb-3">
              {content.title}
            </h2>
          )}
          {content.subtitle && (
            <p className="font-arial text-gray-500 text-base max-w-2xl mx-auto">
              {content.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {content.cards?.map((card, i) => (
            <ValueCard key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueCard({ card, index }: { card: ValueCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const IconComponent = ICONS[card.icon] || Shield;

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
      className={`group relative rounded-[20px] border border-gray-200 bg-white p-8 lg:p-9 transition-all duration-500 hover:-translate-y-2.5 hover:border-transparent hover:shadow-[0_30px_60px_-12px_rgba(21,42,74,0.3),inset_0_1px_0_rgba(255,255,255,0.6)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
    >
      {/* A thin gradient top border that only appears on hover */}
      <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-[20px] bg-gradient-to-r from-clay-200 via-sage-300 to-clay-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div
        className="w-14 h-14 rounded-2xl bg-sage-50 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-sage-100 group-hover:scale-110"
        style={{ boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset' }}
      >
        <IconComponent size={26} className="text-sage-400" strokeWidth={1.75} />
      </div>

      <h3 className="font-garamond text-navy-500 text-xl font-semibold mb-3">
        {card.title}
      </h3>
      <p className="font-arial text-gray-600 text-sm leading-relaxed">
        {card.description}
      </p>
    </div>
  );
}
