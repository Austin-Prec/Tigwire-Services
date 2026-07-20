import { useEffect, useRef, useState } from 'react';
import { BeforeAfterCard, type WorkSample } from '../shared/BeforeAfterSlider';

// Four representative scenarios pulled directly from the service list in
// Executive_Summary.docx (kitchen/residential, office glass, floor
// disinfection, post-construction), not arbitrary examples -- same
// discipline as the What to Expect page's scenarios.
const SAMPLES: WorkSample[] = [
  {
    label: 'Residential kitchen',
    beforeColor: '#3A3530',
    afterColor: '#F4F2EE',
    beforeTexture: 'grime',
    afterTexture: 'clean',
  },
  {
    label: 'Office windows',
    beforeColor: '#4A4E52',
    afterColor: '#EAF2F7',
    beforeTexture: 'streaks',
    afterTexture: 'clean',
  },
  {
    label: 'Floor disinfection',
    beforeColor: '#3D3835',
    afterColor: '#F0EFE9',
    beforeTexture: 'dust',
    afterTexture: 'clean',
  },
  {
    label: 'Post-construction site',
    beforeColor: '#453F3A',
    afterColor: '#F5F3EE',
    beforeTexture: 'clutter',
    afterTexture: 'clean',
  },
];

export default function WorkGalleryBlock() {
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`bg-gray-50 section-padding transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="container-main px-6 lg:px-20">
        <div className="max-w-2xl mb-12">
          <h2 className="font-garamond text-charcoal-500 text-3xl md:text-4xl font-semibold tracking-tight mb-3">
            See the difference
          </h2>
          <p className="font-arial text-gray-600 text-base leading-relaxed">
            Drag the slider on each panel to compare before and after. These
            are placeholder samples, not photos of completed jobs yet -- Tigwire
            is a newly established company, so real before-and-after photos
            will replace these as we complete work. Nothing here is staged as
            an actual client site.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
          {SAMPLES.map((sample) => (
            <BeforeAfterCard key={sample.label} sample={sample} />
          ))}
        </div>
      </div>
    </section>
  );
}
