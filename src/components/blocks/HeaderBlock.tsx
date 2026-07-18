import { useEffect, useRef, useState } from 'react';

interface HeaderBlockProps {
  content: {
    title?: string;
    intro?: string;
  };
}

export default function HeaderBlock({ content }: HeaderBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // No IntersectionObserver needed here — this block always sits at the
    // very top of the page, already in view on load, so the reveal fires
    // immediately rather than waiting on a scroll trigger.
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top right, #33383B 0%, #15181A 45%, #0B0C0E 100%)',
      }}
    >
      <div
        className="absolute -top-24 -right-16 w-[400px] h-[400px] rounded-full blur-[70px] opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(181,117,74,0.35), transparent 70%)' }}
        aria-hidden="true"
      />

      <div
        ref={ref}
        className={`relative container-main px-6 lg:px-20 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h1 className="font-garamond text-white text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
          {content.title}
        </h1>
        {content.intro && (
          <p className="font-arial text-charcoal-100 text-base md:text-lg leading-relaxed max-w-3xl">
            {content.intro}
          </p>
        )}
      </div>
    </section>
  );
}
