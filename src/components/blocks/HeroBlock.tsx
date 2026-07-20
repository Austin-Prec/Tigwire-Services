import { Link } from 'react-router-dom';
import { BeforeAfterCard } from '../shared/BeforeAfterSlider';

interface HeroButton {
  label: string;
  link: string;
  style: 'primary' | 'secondary';
}

interface HeroBlockProps {
  content: {
    background_image_url?: string;
    badge_text?: string;
    headline?: string;
    subheadline?: string;
    quote?: string;
    buttons?: HeroButton[];
  };
}

// A single before/after sample embedded directly in the hero -- the first
// interactive thing a visitor encounters is a drag-to-reveal transformation,
// which is specific to cleaning as a subject. This replaces the previous
// fanned three-card glass cluster (a generic SaaS/consulting hero pattern
// carried over from the original Austin Phiri Advisory build, only ever
// re-skinned with new numbers during the Tigwire content rebuild, never
// actually redesigned around this subject). content.floating_stats is no
// longer read by this component; see the retheme conversation this change
// came from for the reasoning, and WorkGalleryBlock.tsx on the Home page
// for the fuller four-sample version of the same interaction.
const HERO_SAMPLE = {
  label: 'Drag to compare',
  beforeColor: '#3A3530',
  afterColor: '#F4F2EE',
  beforeTexture: 'grime' as const,
  afterTexture: 'clean' as const,
};

export default function HeroBlock({ content }: HeroBlockProps) {
  return (
    <section
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at top right, #33383B 0%, #15181A 45%, #0B0C0E 100%)',
      }}
    >
      {/* Optional editable background photo, kept at the same very low
          opacity as before — it sits beneath the radial gradient's own
          color stops and the orbs, so it still reads as ambient texture
          rather than competing with either column's real content. */}
      {content.background_image_url && (
        <div className="absolute inset-0 opacity-10">
          <img
            src={content.background_image_url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Two soft gradient orbs, anchored top-right and bottom-left,
          replacing the previous drifting-grid + blob combination with a
          calmer, more deliberate pair of glows matching the deep-glass
          direction. */}
      <div
        className="absolute -top-48 -right-36 w-[600px] h-[600px] rounded-full blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(181,117,74,0.35), transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-48 -left-24 w-[450px] h-[450px] rounded-full blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(72,98,74,0.3), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 container-main px-6 lg:px-20 py-24 md:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-16 items-center">
          {/* Left column: text content */}
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {content.badge_text && (
              <div className="inline-flex items-center gap-2 rounded-full border border-clay-200/30 bg-clay-200/[0.12] backdrop-blur-md px-5 py-2 mb-8">
                <span className="w-2 h-2 rounded-full bg-clay-200 animate-badge-pulse" />
                <span className="font-arial text-clay-200 text-[13px] font-semibold">{content.badge_text}</span>
              </div>
            )}

            {content.headline && (
              <h1 className="font-garamond text-white text-4xl md:text-5xl lg:text-[3.4rem] font-semibold tracking-tight leading-[1.12] mb-6">
                {content.headline}
              </h1>
            )}

            {content.subheadline && (
              <p className="font-arial text-white/70 text-lg mb-6 max-w-lg">
                {content.subheadline}
              </p>
            )}

            {content.quote && (
              <p className="font-arial text-white/55 text-base italic mb-10 max-w-lg border-l-2 border-clay-200/40 pl-5 leading-relaxed">
                {content.quote}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              {content.buttons?.map((btn, i) =>
                btn.style === 'primary' ? (
                  <Link
                    key={i}
                    to={btn.link}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-clay-100 to-clay-200 px-8 py-4 font-arial text-[15px] font-bold text-charcoal-600 shadow-[0_10px_30px_-6px_rgba(181,117,74,0.5)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                    style={{ boxShadow: '0 10px 30px -6px rgba(181,117,74,0.5), inset 0 1px 0 rgba(255,255,255,0.4)' }}
                  >
                    {btn.label}
                  </Link>
                ) : (
                  <Link
                    key={i}
                    to={btn.link}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/18 bg-white/[0.06] backdrop-blur-xl px-7 py-4 font-arial text-[15px] font-semibold text-white transition-all duration-300 hover:bg-white/[0.12] hover:-translate-y-1"
                  >
                    {btn.label}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Right column: a single before/after slider. Hidden below lg,
              same reasoning as before — the text column takes full width
              on mobile, and this becomes the first thing visitors reach
              in WorkGalleryBlock further down the page instead. */}
          <div className="hidden lg:block animate-fade-up" style={{ animationDelay: '0.25s' }}>
            <BeforeAfterCard sample={HERO_SAMPLE} compact />
            <p className="mt-4 font-arial text-white/75 text-[13px] text-center">
              Drag to see the difference — placeholder sample, not a real job yet
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
