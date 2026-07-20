import { useEffect, useRef, useState } from 'react';
import { BeforeAfterCard, type PlaceholderWorkSample } from '../shared/BeforeAfterSlider';
import { getPublishedWorkSamples, type WorkSample } from '../../lib/work';

// Four representative scenarios pulled directly from the service list in
// Executive_Summary.docx (kitchen/residential, office glass, floor
// disinfection, post-construction), not arbitrary examples -- same
// discipline as the What to Expect page's scenarios. Used only when there
// are zero published real work_samples rows yet (see the fetch below) --
// once real photos are uploaded through /admin/work and published, this
// array stops being shown at all.
const PLACEHOLDER_SAMPLES: PlaceholderWorkSample[] = [
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
  const [realSamples, setRealSamples] = useState<WorkSample[] | null>(null);

  useEffect(() => {
    getPublishedWorkSamples()
      .then(setRealSamples)
      .catch(() => setRealSamples([])); // fall back to placeholders on any fetch error too
  }, []);

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
      { rootMargin: '0px 0px -100px 0px' }
    );
    observer.observe(el);

    // Safety net: this is exactly the class of bug just fixed above (a
    // scroll-triggered reveal that can end up permanently opacity-0 if the
    // observer's condition is never met -- previously a threshold that
    // needed 15% of this section's own height, 1000px+, already in view).
    // A decorative fade-in should degrade to "show it anyway" in the
    // worst case, never to "hidden forever" -- so if intersection hasn't
    // fired within 2s of mount for any reason, show the section anyway.
    const fallback = window.setTimeout(() => setIsVisible(true), 2000);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  // Still loading: render nothing rather than flash placeholders and then
  // swap to real photos a moment later, which would look like a layout jump.
  if (realSamples === null) return null;

  const usingPlaceholders = realSamples.length === 0;

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
            {usingPlaceholders ? (
              <>
                Drag the slider on each panel to compare before and after. These
                are placeholder samples, not photos of completed jobs yet --
                Tigwire is a newly established company, so real before-and-after
                photos will replace these as we complete work. Nothing here is
                staged as an actual client site.
              </>
            ) : (
              'Drag the slider on each panel to compare before and after.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
          {usingPlaceholders
            ? PLACEHOLDER_SAMPLES.map((sample) => (
                <BeforeAfterCard key={sample.label} placeholder={sample} />
              ))
            : realSamples.map((sample) => (
                <BeforeAfterCard
                  key={sample.id}
                  photo={{
                    label: sample.label,
                    beforeImageUrl: sample.before_image_url,
                    afterImageUrl: sample.after_image_url,
                  }}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
