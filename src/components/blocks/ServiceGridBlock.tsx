import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Building2,
  Sparkles,
  Truck,
  Layers,
  AppWindow,
  ArrowUpFromDot,
  Droplets,
  Trees,
  Trash2,
  HardHat,
} from 'lucide-react';

const ICONS: Record<string, typeof Home> = {
  Home, Building2, Sparkles, Truck, Layers, AppWindow, ArrowUpFromDot,
  Droplets, Trees, Trash2, HardHat,
};

interface Service {
  icon: string;
  title: string;
  description: string;
  outcome: string;
  price: string;
  price_note: string;
  cta_type: 'fixed' | 'custom';
}

interface ServiceGridBlockProps {
  content: {
    services?: Service[];
  };
}

export default function ServiceGridBlock({ content }: ServiceGridBlockProps) {
  return (
    <section className="relative bg-white section-padding overflow-hidden">
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-[0.035]"
        style={{ background: 'radial-gradient(circle, #152A4A, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative container-main px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.services?.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const IconComponent = ICONS[service.icon] || Sparkles;
  const isCustom = service.cta_type === 'custom';

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
      className={`group relative rounded-2xl border p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(21,42,74,0.3),inset_0_1px_0_rgba(255,255,255,0.6)] ${
        isCustom ? 'border-clay-200/50 hover:border-transparent' : 'border-gray-200 hover:border-transparent'
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: isVisible ? `${index * 70}ms` : '0ms' }}
    >
      {/* Custom-quote services get a small marker distinguishing them as
          higher-touch engagements, without being a loud "premium" badge
          that would clash with the page's otherwise even-handed pricing
          presentation. */}
      {isCustom && (
        <div className="absolute -top-2.5 right-5 rounded-full bg-gradient-to-br from-clay-200 to-clay-300 px-3 py-1 text-[10px] font-arial font-bold uppercase tracking-wide text-navy-600 shadow-sm">
          Bespoke
        </div>
      )}

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${
          isCustom ? 'bg-clay-200/15 group-hover:bg-clay-200/25' : 'bg-sage-50 group-hover:bg-sage-100'
        }`}
      >
        <IconComponent
          size={24}
          className={isCustom ? 'text-clay-300' : 'text-sage-400'}
          strokeWidth={1.75}
        />
      </div>

      <h3 className="font-garamond text-navy-500 text-lg font-semibold mb-2">
        {service.title}
      </h3>
      <p className="text-sage-400 text-sm font-semibold mb-3">
        “{service.outcome}”
      </p>
      <p className="font-arial text-gray-500 text-sm leading-relaxed mb-4">
        {service.description}
      </p>
      <div className="pt-3 border-t border-gray-100">
        <p className="font-garamond text-navy-600 text-lg font-semibold">
          {service.price}
        </p>
        {service.price_note && (
          <p className="font-arial text-gray-400 text-xs mt-1">
            {service.price_note}
          </p>
        )}
      </div>
      <Link
        to="/contact"
        className={`inline-flex items-center justify-center w-full text-center mt-4 px-4 py-2.5 rounded-lg font-arial text-sm font-semibold transition-all duration-300 ${
          isCustom
            ? 'bg-gradient-to-br from-clay-200 to-clay-300 text-navy-600 hover:shadow-[0_6px_16px_rgba(181,117,74,0.35)]'
            : 'border border-navy-500 text-navy-500 hover:bg-navy-500 hover:text-white'
        }`}
      >
        {isCustom ? 'Request Quote' : 'Book Service'}
      </Link>
    </div>
  );
}
