import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

/**
 * The hero title, made alive: a gradient that drifts through "Simply.", a soft
 * pink neon glow that breathes, and a very subtle cursor parallax so the whole
 * group feels like it floats in the scene. All transform/opacity based, and
 * fully static under reduced-motion.
 */
export function HeroTitle() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Cursor parallax: map pointer position (−0.5..0.5) to a few px of shift.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const titleX = useTransform(sx, [-0.5, 0.5], [-8, 8]);
  const titleY = useTransform(sy, [-0.5, 0.5], [-6, 6]);
  const subX = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  const subY = useTransform(sy, [-0.5, 0.5], [-3, 3]);

  const handleMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="flex flex-col items-center"
    >
      <motion.h1
        style={reduce ? undefined : { x: titleX, y: titleY }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-shadow-glow text-4xl font-bold tracking-tight text-content-primary sm:text-5xl"
      >
        Download anything.
        <br />
        <motion.span
          className="hero-shimmer bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
          animate={reduce ? undefined : { opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Simply.
        </motion.span>
      </motion.h1>

      <motion.p
        style={reduce ? undefined : { x: subX, y: subY }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5 }}
        className="mt-4 max-w-md text-base text-content-secondary"
      >
        Enganxa un enllaç i descarrega'l a l'instant.
      </motion.p>
    </div>
  );
}
