import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface ThumbnailProps {
  src: string | null;
  alt: string;
  durationLabel?: string | null;
  className?: string;
}

/**
 * Lazy-loaded thumbnail with a graceful fallback. Renders a placeholder while
 * loading or when the image is missing or fails, and overlays an optional
 * duration badge. Uses native lazy loading — no eager network work.
 */
export function Thumbnail({ src, alt, durationLabel, className }: ThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div
      className={cn(
        'relative aspect-video w-28 shrink-0 overflow-hidden rounded-md bg-surface-elevated',
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="grid h-full w-full place-items-center text-content-tertiary">
          <ImageIcon size={18} />
        </div>
      )}
      {durationLabel && (
        <span className="absolute bottom-1 right-1 rounded bg-overlay/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
          {durationLabel}
        </span>
      )}
    </div>
  );
}
