import { useEffect, useRef, useState } from 'react';
import { Award, Shield, Search, FileCheck, TrendingUp, Briefcase } from 'lucide-react';

const ICONS: Record<string, typeof Award> = {
  Award, Shield, Search, FileCheck, TrendingUp, Briefcase,
};

interface ListBlockProps {
  content: {
    title?: string;
    icon?: string;
    items?: string[];
    footnote?: string;
  };
}

export default function ListBlock({ content }: ListBlockProps) {
  const IconComponent = ICONS[content.icon || ''] || Award;
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
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-gray-50 section-padding">
      <div className="container-main px-6 lg:px-20">
        <div
          ref={headerRef}
          className={`flex items-center gap-3 mb-6 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-sage-50 flex items-center justify-center">
            <IconComponent size={20} className="text-sage-400" />
          </div>
          {content.title && (
            <h3 className="font-garamond text-charcoal-500 text-xl font-semibold">
              {content.title}
            </h3>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {content.items?.map((item, i) => (
            <ListItem key={i} item={item} index={i} />
          ))}
        </div>
        {content.footnote && (
          <p className="font-arial text-gray-400 text-sm mt-4">{content.footnote}</p>
        )}
      </div>
    </section>
  );
}

function ListItem({ item, index }: { item: string; index: number }) {
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
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`rounded-lg bg-white border border-gray-200 px-4 py-3 transition-all duration-500 hover:border-transparent hover:shadow-[0_20px_40px_-16px_rgba(21,24,26,0.25)] hover:-translate-y-0.5 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
      style={{ transitionDelay: isVisible ? `${index * 60}ms` : '0ms' }}
    >
      <p className="font-arial text-gray-700 text-sm">{item}</p>
    </div>
  );
}
