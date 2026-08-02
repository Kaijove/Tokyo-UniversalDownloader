import { useEffect, useState } from 'react';

/** Tokyo coordinates. */
const TOKYO = { lat: 35.6762, lon: 139.6503 };

/**
 * WMO weather codes → a short human label. Only the common buckets; anything
 * unmapped falls back to a neutral word.
 */
function describe(code: number): string {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Cloudy';
  if (code <= 48) return 'Fog';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Showers';
  if (code <= 86) return 'Snow showers';
  return 'Storm';
}

export interface Weather {
  tempC: number;
  label: string;
}

/**
 * Fetches Tokyo's current weather from Open-Meteo — a free, key-less API.
 * Returns null while loading or on any failure (the widget then hides itself),
 * so a network hiccup never breaks the UI. Refreshes every 30 minutes.
 */
export function useTokyoWeather(): Weather | null {
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${TOKYO.lat}` +
          `&longitude=${TOKYO.lon}&current=temperature_2m,weather_code`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        const temp = data?.current?.temperature_2m;
        const code = data?.current?.weather_code;
        if (active && typeof temp === 'number' && typeof code === 'number') {
          setWeather({ tempC: Math.round(temp), label: describe(code) });
        }
      } catch {
        // Offline or blocked — leave it null; the widget hides.
      }
    };

    void load();
    const timer = window.setInterval(load, 30 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return weather;
}
