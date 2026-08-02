import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, CloudSnow, TrendingUp } from 'lucide-react';
import { useHistoryStore } from '@/core/engine';
import { useTokyoWeather, type Weather } from '../../hooks/useTokyoWeather';

/**
 * A slim horizontal row of ambient widgets, shown between the hero and the
 * downloads. Both are backed by real data:
 *   - Total downloads: the true count from history.
 *   - Tokyo weather: live from Open-Meteo (hidden if it can't load).
 * Nothing here is faked; a widget with no data simply doesn't render.
 */
export function WidgetsPanel() {
  const total = useHistoryStore((s) => s.entries.length);
  const weather = useTokyoWeather();

  return (
    <div className="flex flex-wrap items-stretch justify-center gap-4">
      <TotalDownloadsCard total={total} />
      {weather && <WeatherCard weather={weather} />}
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-w-[200px] flex-1 items-center justify-center rounded-2xl border border-white/10 bg-surface/40 px-5 py-4 backdrop-blur-xl"
    >
      {children}
    </motion.div>
  );
}

function TotalDownloadsCard({ total }: { total: number }) {
  return (
    <Panel>
      <div className="flex flex-col items-center text-center">
        <span className="mb-1 text-primary">
          <TrendingUp size={22} />
        </span>
        <p className="text-xs text-content-secondary">Total downloads</p>
        <p className="mt-1 text-2xl font-bold text-content-primary tabular-nums">
          {total.toLocaleString()}
        </p>
      </div>
    </Panel>
  );
}

function WeatherCard({ weather }: { weather: Weather }) {
  const Icon = weatherIcon(weather.label);
  return (
    <Panel>
      <div className="flex flex-col items-center text-center">
        <span className="mb-1 text-primary">
          <Icon size={26} />
        </span>
        <p className="text-xs text-content-secondary">Tokyo</p>
        <p className="mt-1 text-2xl font-bold text-content-primary">{weather.tempC}°C</p>
        <p className="text-xs text-content-secondary">{weather.label}</p>
      </div>
    </Panel>
  );
}

function weatherIcon(label: string) {
  if (label === 'Clear') return Sun;
  if (label.includes('Rain') || label.includes('Showers')) return CloudRain;
  if (label.includes('Snow')) return CloudSnow;
  return Cloud;
}
