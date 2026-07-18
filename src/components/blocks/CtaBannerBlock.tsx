import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface CtaBannerProps {
  content: {
    body?: string;
    button_label?: string;
    button_link?: string;
  };
}

export default function CtaBannerBlock({ content }: CtaBannerProps) {
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
    <section
      className="relative py-14 md:py-20 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top right, #33383B 0%, #15181A 45%, #0B0C0E 100%)',
      }}
    >
      <div
        className="absolute -top-32 -right-24 w-[450px] h-[450px] rounded-full blur-[80px] opacity-35"
        style={{ background: 'radial-gradient(circle, rgba(181,117,74,0.35), transparent 70%)' }}
        aria-hidden="true"
      />

      <div
        ref={ref}
        className={`relative container-main px-6 lg:px-20 text-center transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {content.body && (
          <p className="font-arial text-charcoal-100 text-base leading-relaxed max-w-3xl mx-auto mb-7">
            {content.body}
          </p>
        )}
        {content.button_link && content.button_label && (
          <Link
            to={content.button_link}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-clay-100 to-clay-200 px-8 py-4 font-arial text-[15px] font-bold text-charcoal-600 shadow-[0_8px_24px_rgba(181,117,74,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(181,117,74,0.5),inset_0_1px_0_rgba(255,255,255,0.4)]"
          >
            {content.button_label}
          </Link>
        )}
      </div>
    </section>
  );
}
