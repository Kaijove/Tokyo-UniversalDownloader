import { Youtube, Instagram, Twitter, Facebook, Twitch, Music2 } from 'lucide-react';

/**
 * A quick visual signal of breadth — the platforms people recognise, plus a
 * "+1000 more" note. yt-dlp genuinely supports these and many more, so this is
 * honest, not decorative. Each icon shows its brand colour at all times.
 */
const PLATFORMS = [
  { icon: Youtube, label: 'YouTube', color: 'text-[#FF0000]' },
  { icon: Music2, label: 'TikTok', color: 'text-content-primary' },
  { icon: Instagram, label: 'Instagram', color: 'text-[#E4405F]' },
  { icon: Twitter, label: 'Twitter / X', color: 'text-[#1DA1F2]' },
  { icon: Facebook, label: 'Facebook', color: 'text-[#1877F2]' },
  { icon: Twitch, label: 'Twitch', color: 'text-[#9146FF]' },
];

export function SupportedPlatforms() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      <span className="text-sm font-semibold text-content-primary">Compatible amb:</span>
      <div className="flex items-center gap-3.5">
        {PLATFORMS.map(({ icon: Icon, label, color }) => (
          <span
            key={label}
            title={label}
            className={`${color} drop-shadow-[0_0_6px_currentColor] transition-transform hover:scale-110`}
          >
            <Icon size={20} />
          </span>
        ))}
      </div>
      <span className="text-sm font-semibold text-content-primary">+1000 més</span>
    </div>
  );
}
