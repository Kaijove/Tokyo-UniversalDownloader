import { motion } from 'framer-motion';
import { Home, Download, History, Settings2, Sparkles, Info, PanelLeftClose } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export type NavKey = 'home' | 'downloads' | 'history' | 'settings' | 'help' | 'about';

interface SidebarProps {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  onClose: () => void;
}

const NAV: { key: NavKey; label: string; icon: typeof Home }[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'downloads', label: 'Downloads', icon: Download },
  { key: 'history', label: 'History', icon: History },
  { key: 'settings', label: 'Settings', icon: Settings2 },
  { key: 'help', label: 'How it works', icon: Sparkles },
  { key: 'about', label: 'About', icon: Info },
];

/**
 * Left navigation rail. The logo up top, primary destinations in the middle,
 * and a small promo card at the bottom. Purely presentational — every action
 * is delegated to the parent via onNavigate.
 */
export function Sidebar({ active, onNavigate, onClose }: SidebarProps) {
  return (
    <aside className="relative z-20 flex h-full w-60 shrink-0 flex-col border-r border-white/15 backdrop-blur-2xl">
      {/* Deep-blue glass surface — a cool, independent atmosphere that
          contrasts with the pink/purple Tokyo background, while the sakura
          stays faintly visible through the blur. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[hsl(230_45%_14%/0.9)] via-[hsl(235_48%_10%/0.92)] to-[hsl(240_50%_8%/0.94)]"
      />
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 -z-10 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent"
      />
      {/* Collapse button */}
      <div className="flex justify-end px-3 pt-3">
        <button
          onClick={onClose}
          aria-label="Amaga el panell"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-content-tertiary transition-colors hover:bg-white/5 hover:text-content-primary"
        >
          <PanelLeftClose size={17} />
        </button>
      </div>

      {/* Navigation — items distributed down the whole column */}
      <nav className="flex flex-1 flex-col justify-evenly px-3 py-2">
        {NAV.map((item) => {
          const isActive = item.key === active;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={cn(
                'relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
                isActive
                  ? 'text-primary-foreground'
                  : 'text-content-secondary hover:bg-white/5 hover:text-content-primary',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-accent/80 via-primary to-primary-hover shadow-glow"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <Icon size={18} />
              {item.label}
            </motion.button>
          );
        })}
      </nav>

      {/* Author credit */}
      <div className="px-3 pb-4">
        <p className="text-center text-[11px] text-content-tertiary">
          by <span className="font-semibold text-content-secondary">Kai Jové</span>
        </p>
      </div>
    </aside>
  );
}
