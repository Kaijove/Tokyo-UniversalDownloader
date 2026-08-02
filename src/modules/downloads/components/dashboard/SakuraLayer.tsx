import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Petal counts per depth layer. Kept reasonable in total so the effect is lush
 * but never costs performance (pure CSS transform/opacity, GPU-composited).
 */
const LAYERS = {
  back: 22, // small, faint, slow, slightly blurred — far away
  mid: 20, // medium, normal speed
  front: 8, // large, sharp-ish, faster, a touch of blur — close to camera
} as const;

interface Petal {
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  opacity: number;
  blur: number;
  sway: number;
}

function makePetals(
  count: number,
  opts: {
    sizeMin: number;
    sizeMax: number;
    durMin: number;
    durMax: number;
    opacityMin: number;
    opacityMax: number;
    blur: number;
  },
): Petal[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    delay: -Math.random() * opts.durMax, // negative → already mid-fall on load, no visible "start"
    duration: opts.durMin + Math.random() * (opts.durMax - opts.durMin),
    size: opts.sizeMin + Math.random() * (opts.sizeMax - opts.sizeMin),
    drift: (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 160),
    opacity: opts.opacityMin + Math.random() * (opts.opacityMax - opts.opacityMin),
    blur: opts.blur * (0.6 + Math.random() * 0.8),
    sway: 20 + Math.random() * 40,
  }));
}

/**
 * A rich, cinematic layer of falling sakura petals across the whole screen, in
 * three parallax depths (far/mid/near). Pure CSS animation — cheap and smooth.
 * Sits above the background but below the UI (z-index between them), and never
 * intercepts clicks. Renders nothing under reduced-motion.
 */
export function SakuraLayer() {
  const reduce = useReducedMotion();

  const petals = useMemo(() => {
    return [
      ...makePetals(LAYERS.back, {
        sizeMin: 6,
        sizeMax: 11,
        durMin: 14,
        durMax: 22,
        opacityMin: 0.25,
        opacityMax: 0.5,
        blur: 1.5,
      }),
      ...makePetals(LAYERS.mid, {
        sizeMin: 11,
        sizeMax: 18,
        durMin: 9,
        durMax: 15,
        opacityMin: 0.45,
        opacityMax: 0.75,
        blur: 0.3,
      }),
      ...makePetals(LAYERS.front, {
        sizeMin: 20,
        sizeMax: 30,
        durMin: 6,
        durMax: 10,
        opacityMin: 0.5,
        opacityMax: 0.8,
        blur: 2.5,
      }),
    ];
  }, []);

  if (reduce) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
    >
      <style>{sakuraKeyframes}</style>
      {petals.map((p, i) => (
        <span
          key={i}
          className="sakura-petal"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size * 0.82}px`,
              opacity: p.opacity,
              filter: `drop-shadow(0 0 4px hsl(328 90% 62% / 0.5)) blur(${p.blur}px)`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--drift': `${p.drift}px`,
              '--sway': `${p.sway}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

const sakuraKeyframes = `
  .sakura-petal {
    position: absolute;
    top: -6vh;
    background: radial-gradient(
      circle at 30% 30%,
      hsl(330 95% 80%),
      hsl(328 85% 60%)
    );
    border-radius: 100% 0 100% 0;
    animation-name: sakura-fall;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    will-change: transform;
  }
  @keyframes sakura-fall {
    0% {
      transform: translate3d(0, 0, 0) rotate(0deg);
    }
    25% {
      transform: translate3d(calc(var(--sway) * 0.5), 28vh, 0) rotate(160deg);
    }
    50% {
      transform: translate3d(calc(var(--drift) * 0.6), 55vh, 0) rotate(320deg);
    }
    75% {
      transform: translate3d(var(--drift), 82vh, 0) rotate(500deg);
    }
    100% {
      transform: translate3d(calc(var(--drift) + var(--sway)), 112vh, 0) rotate(680deg);
    }
  }
`;
