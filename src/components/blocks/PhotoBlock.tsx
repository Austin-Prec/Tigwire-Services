import { useEffect, useRef, useState } from 'react';
import { Briefcase, MapPin, Calendar, Award, Shield, Search, FileCheck, TrendingUp } from 'lucide-react';

const ICONS: Record<string, typeof Briefcase> = {
  Briefcase, MapPin, Calendar, Award, Shield, Search, FileCheck, TrendingUp,
};

interface PhotoBlockProps {
  content: {
    image_url?: string;
    alt?: string;
    badges?: { icon: string; text: string }[];
  };
}

export default function PhotoBlock({ content }: PhotoBlockProps) {
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

  if (!content.image_url) return null;

  return (
    <div
      ref={ref}
      className={`lg:col-span-1 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* A soft gradient glow sits behind the photo — restrained, since a
          real headshot should read as a portrait, not a marketing graphic
          wrapped in decoration. */}
      <div className="relative">
        <div
          className="absolute -inset-3 rounded-2xl opacity-20 blur-xl"
          style={{ background: 'linear-gradient(135deg, #B5754A, #152A4A)' }}
          aria-hidden="true"
        />
        <img
          src={content.image_url}
          alt={content.alt || ''}
          className="relative w-full rounded-xl shadow-[0_25px_50px_-15px_rgba(21,42,74,0.35)] transition-transform duration-500 hover:scale-[1.015]"
        />
      </div>

      {content.badges && content.badges.length > 0 && (
        <div className="mt-6 space-y-3">
          {content.badges.map((badge, i) => {
            const IconComponent = ICONS[badge.icon] || Briefcase;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 text-gray-600 transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                }`}
                style={{ transitionDelay: isVisible ? `${300 + i * 100}ms` : '0ms' }}
              >
                <div className="w-8 h-8 rounded-lg bg-sage-50 flex items-center justify-center shrink-0">
                  <IconComponent size={16} className="text-sage-400" />
                </div>
                <span className="font-arial text-sm">{badge.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
