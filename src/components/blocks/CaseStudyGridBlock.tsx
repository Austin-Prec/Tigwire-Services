import { useEffect, useRef, useState } from 'react';
import { Home, Building2, Droplets, HardHat } from 'lucide-react';
import { Info } from 'lucide-react';

const ICONS: Record<string, typeof Home> = { Home, Building2, Droplets, HardHat };

interface Scenario {
  category: string;
  icon: string;
  situation: string;
  approach: string;
  expect: string;
}

interface CaseStudyGridBlockProps {
  content: {
    intro_note?: string;
    studies?: Scenario[];
  };
}

export default function CaseStudyGridBlock({ content }: CaseStudyGridBlockProps) {
  return (
    <section className="relative bg-white section-padding overflow-hidden">
      <div
        className="pointer-events-none absolute -top-1/3 -right-1/4 w-[800px] h-[800px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, #152A4A, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative container-main px-6 lg:px-20">
        {content.intro_note && (
          <div className="flex items-start gap-3 rounded-xl bg-charcoal-50 border border-charcoal-100 p-5 mb-12 max-w-3xl">
            <Info size={18} className="text-charcoal-400 shrink-0 mt-0.5" />
            <p className="font-arial text-charcoal-600 text-sm leading-relaxed">
              {content.intro_note}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {content.studies?.map((study, i) => (
            <CaseStudyCard key={i} study={study} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudyCard({ study, index }: { study: Scenario; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const IconComponent = ICONS[study.icon] || Home;

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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`rounded-2xl border border-gray-200 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-[0_30px_60px_-15px_rgba(21,24,26,0.3),inset_0_1px_0_rgba(255,255,255,0.6)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-xl bg-sage-50 flex items-center justify-center shrink-0">
          <IconComponent size={20} className="text-sage-400" strokeWidth={1.75} />
        </div>
        <span className="font-arial text-clay-500 text-xs font-semibold uppercase tracking-wider">
          {study.category}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="font-arial text-charcoal-500 text-xs font-semibold uppercase tracking-wide mb-1.5">
            Situation
          </p>
          <p className="font-arial text-gray-600 text-sm leading-relaxed">{study.situation}</p>
        </div>
        <div>
          <p className="font-arial text-charcoal-500 text-xs font-semibold uppercase tracking-wide mb-1.5">
            Our Approach
          </p>
          <p className="font-arial text-gray-600 text-sm leading-relaxed">{study.approach}</p>
        </div>
        <div className="pt-3 border-t border-gray-100">
          <p className="font-arial text-charcoal-500 text-xs font-semibold uppercase tracking-wide mb-1.5">
            What to Expect
          </p>
          <p className="font-arial text-charcoal-600 text-sm font-medium leading-relaxed">
            {study.expect}
          </p>
        </div>
      </div>
    </div>
  );
}
