import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface LinkPreviewBlockProps {
  content: {
    title?: string;
    body?: string;
    link_text?: string;
    link?: string;
  };
}

export default function LinkPreviewBlock({ content }: LinkPreviewBlockProps) {
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
    <section className="relative bg-gray-50 section-padding overflow-hidden">
      <div
        className="pointer-events-none absolute -top-1/4 -right-1/6 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, #152A4A, transparent 70%)' }}
        aria-hidden="true"
      />

      <div
        ref={ref}
        className={`relative container-main px-6 lg:px-20 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="max-w-3xl rounded-[24px] bg-white/60 backdrop-blur-sm border border-white/80 p-8 md:p-10 shadow-[0_20px_50px_-20px_rgba(21,24,26,0.15)]">
          {content.title && (
            <h2 className="font-garamond text-charcoal-500 text-2xl md:text-3xl font-semibold mb-6">
              {content.title}
            </h2>
          )}
          {content.body && (
            <p className="font-arial text-gray-600 text-base leading-relaxed mb-6">
              {content.body}
            </p>
          )}
          {content.link && content.link_text && (
            <Link
              to={content.link}
              className="group inline-flex items-center gap-2 font-arial text-sage-400 text-sm font-semibold uppercase tracking-wide transition-colors duration-200 hover:text-sage-500"
            >
              {content.link_text}
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
