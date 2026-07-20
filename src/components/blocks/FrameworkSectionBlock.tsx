import { useEffect, useRef, useState } from 'react';
import { Download, ClipboardCheck, Sparkles, Truck, MessageCircle } from 'lucide-react';

const ICONS: Record<string, typeof ClipboardCheck> = { ClipboardCheck, Sparkles, Truck, MessageCircle };

interface Pillar {
  number: string;
  name: string;
  description: string;
}

interface FrameworkSectionProps {
  content: {
    icon?: string;
    heading?: string;
    subtitle?: string;
    body?: string;
    pillars?: Pillar[];
    download_label?: string;
    download_url?: string;
    variant?: 'light' | 'shaded';
  };
}

export default function FrameworkSectionBlock({ content }: FrameworkSectionProps) {
  const IconComponent = ICONS[content.icon || ''] || ClipboardCheck;
  const isShaded = content.variant === 'shaded';
  const pillarCount = content.pillars?.length ?? 0;

  const lgCols =
    pillarCount === 5 ? 'lg:grid-cols-5'
    : pillarCount === 4 ? 'lg:grid-cols-4'
    : pillarCount === 7 ? 'lg:grid-cols-4'
    : 'lg:grid-cols-3';

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`relative overflow-hidden ${isShaded ? 'bg-gray-50' : 'bg-white'} section-padding`}>
      {/* A faint corner glow, kept extremely subtle since this page carries
          real operational content (the service delivery process) and
          should read as authoritative rather than decorative. */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.035] -translate-y-1/3 translate-x-1/4"
        style={{ background: 'radial-gradient(circle, #152A4A, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative container-main px-6 lg:px-20">
        <div
          ref={headerRef}
          className={`transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-sage-50 flex items-center justify-center shrink-0">
              <IconComponent size={28} className="text-sage-400" strokeWidth={1.5} />
            </div>
            {content.heading && (
              <h2 className="font-garamond text-charcoal-500 text-2xl md:text-3xl font-semibold">
                {content.heading}
              </h2>
            )}
          </div>

          {content.subtitle && (
            <p className="font-arial text-clay-500 text-sm uppercase tracking-wider font-semibold mb-6">
              {content.subtitle}
            </p>
          )}

          {content.body && (
            <p className="font-arial text-gray-600 text-base leading-relaxed mb-10 max-w-4xl">
              {content.body}
            </p>
          )}
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${lgCols} gap-6 mb-10`}>
          {content.pillars?.map((pillar, i) => (
            <PillarCard key={i} pillar={pillar} index={i} />
          ))}
        </div>

        {content.download_url && content.download_label && (
          <a
            href={content.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-clay-200 to-clay-300 px-6 py-3 font-arial text-sm font-semibold text-charcoal-600 shadow-[0_4px_16px_rgba(181,117,74,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(181,117,74,0.45)]"
          >
            <Download size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
            {content.download_label}
          </a>
        )}
      </div>
    </section>
  );
}

function PillarCard({
  pillar,
  index,
}: {
  pillar: Pillar;
  index: number;
}) {
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
      className={`rounded-xl border border-gray-200 bg-white p-6 lg:p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_30px_60px_-15px_rgba(21,24,26,0.3),inset_0_1px_0_rgba(255,255,255,0.6)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: isVisible ? `${index * 80}ms` : '0ms' }}
    >
      <div className="font-garamond text-clay-500 text-2xl font-semibold mb-1">
        {pillar.number}
      </div>
      <h4 className="font-garamond text-charcoal-500 text-base font-semibold mb-3">
        {pillar.name}
      </h4>
      <p className="font-arial text-gray-600 text-sm leading-relaxed">
        {pillar.description}
      </p>
    </div>
  );
}
