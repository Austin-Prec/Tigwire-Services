import { useEffect, useRef, useState, useCallback } from 'react';

// Placeholder shape -- used until real photos exist for a given slot.
// Kept distinct from the real-photo shape (below) since they describe
// genuinely different things: generated SVG textures vs. actual image URLs.
export interface PlaceholderWorkSample {
  label: string;
  beforeColor: string;
  afterColor: string;
  beforeTexture: 'dust' | 'streaks' | 'grime' | 'clutter';
  afterTexture: 'clean';
}

// Real-photo shape -- matches work_samples table rows (see src/lib/work.ts).
export interface PhotoWorkSample {
  label: string;
  beforeImageUrl: string;
  afterImageUrl: string;
}

// Renders a placeholder "surface" as flat SVG rather than a real photo.
// Each texture is a distinct, deliberately abstract pattern so different
// samples still read as different scenarios even without photography.
export function PlaceholderSurface({
  color,
  texture,
}: {
  color: string;
  texture: PlaceholderWorkSample['beforeTexture'] | PlaceholderWorkSample['afterTexture'];
}) {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="none"
      viewBox="0 0 400 300"
      aria-hidden="true"
    >
      <rect width="400" height="300" fill={color} />
      {texture === 'grime' && (
        <g opacity="0.35">
          {Array.from({ length: 40 }).map((_, i) => (
            <circle
              key={i}
              cx={(i * 37) % 400}
              cy={(i * 53) % 300}
              r={2 + (i % 4)}
              fill="#1a1a1a"
            />
          ))}
        </g>
      )}
      {texture === 'streaks' && (
        <g opacity="0.3" stroke="#1a1a1a" strokeWidth="1.5">
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={i} x1={i * 30} y1="0" x2={i * 30 - 60} y2="300" />
          ))}
        </g>
      )}
      {texture === 'dust' && (
        <g opacity="0.3" fill="#1a1a1a">
          {Array.from({ length: 60 }).map((_, i) => (
            <circle key={i} cx={(i * 23) % 400} cy={(i * 41) % 300} r="1.5" />
          ))}
        </g>
      )}
      {texture === 'clutter' && (
        <g opacity="0.3" fill="#1a1a1a">
          {Array.from({ length: 10 }).map((_, i) => (
            <rect
              key={i}
              x={(i * 61) % 380}
              y={(i * 47) % 280}
              width={12 + (i % 3) * 6}
              height={8 + (i % 4) * 4}
              transform={`rotate(${i * 17} ${(i * 61) % 380} ${(i * 47) % 280})`}
            />
          ))}
        </g>
      )}
      {texture === 'clean' && (
        <g opacity="0.12" stroke="#15181A" strokeWidth="1">
          <line x1="0" y1="150" x2="400" y2="150" />
          <line x1="200" y1="0" x2="200" y2="300" />
        </g>
      )}
    </svg>
  );
}

interface BeforeAfterCardProps {
  /** Provide exactly one of these. `photo` takes priority if both are
   *  somehow given -- real images should always win over placeholders. */
  photo?: PhotoWorkSample;
  placeholder?: PlaceholderWorkSample;
  /** Compact mode drops the caption and uses lighter chrome, for embedding
   *  inside the dark hero rather than the light gallery section. */
  compact?: boolean;
}

export function BeforeAfterCard({ photo, placeholder, compact }: BeforeAfterCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Tracks the card's own rendered width so the "before" photo can stay
    // sized to the full card (see the comment further down) even as the
    // card itself resizes with the viewport — a one-time offsetWidth read
    // would go stale after any resize that isn't also a drag.
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      if (clientX !== undefined) updateFromClientX(clientX);
    };
    const handleUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, [updateFromClientX]);

  const label = photo?.label ?? placeholder?.label ?? '';
  if (!photo && !placeholder) return null;

  return (
    <div>
      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl cursor-ew-resize select-none touch-none bg-gray-200"
        onMouseDown={(e) => {
          draggingRef.current = true;
          updateFromClientX(e.clientX);
        }}
        onTouchStart={(e) => {
          draggingRef.current = true;
          const t = e.touches[0];
          if (t) updateFromClientX(t.clientX);
        }}
        role="slider"
        aria-label={`Before and after comparison: ${label}`}
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setPosition((p) => Math.max(0, p - 5));
          if (e.key === 'ArrowRight') setPosition((p) => Math.min(100, p + 5));
        }}
      >
        {/* After (base layer, fully visible) */}
        {photo ? (
          <img
            src={photo.afterImageUrl}
            alt={`${photo.label} — after`}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <PlaceholderSurface color={placeholder!.afterColor} texture={placeholder!.afterTexture} />
        )}

        {/* Before (clipped to the left of the handle). The image itself is
            sized to the full card, not to this shrinking wrapper — only
            the wrapper's width and overflow:hidden do the revealing, so
            the photo underneath never stretches or squishes as position
            changes, it's simply progressively uncovered. */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          {photo ? (
            <img
              src={photo.beforeImageUrl}
              alt={`${photo.label} — before`}
              className="absolute inset-0 h-full object-cover"
              style={{ width: containerWidth ? `${containerWidth}px` : '100%' }}
              draggable={false}
            />
          ) : (
            <PlaceholderSurface color={placeholder!.beforeColor} texture={placeholder!.beforeTexture} />
          )}
        </div>

        {/* Labels */}
        <span
          className={`absolute top-3 left-3 rounded-full backdrop-blur-sm px-3 py-1 font-arial text-white text-[11px] font-semibold uppercase tracking-wider pointer-events-none ${
            compact ? 'bg-white/15' : 'bg-charcoal-900/60'
          }`}
        >
          Before
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-sage-500/80 backdrop-blur-sm px-3 py-1 font-arial text-white text-[11px] font-semibold uppercase tracking-wider pointer-events-none">
          After
        </span>

        {/* Drag handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-[0_4px_16px_rgba(21,24,26,0.35)] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 4L2 8L5 12" stroke="#15181A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 4L14 8L11 12" stroke="#15181A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      {!compact && (
        <p className="mt-3 font-arial text-charcoal-500 text-sm font-semibold">{label}</p>
      )}
    </div>
  );
}
