import { Eye, ThumbsUp, Radio, ShieldAlert, ListVideo } from 'lucide-react';
import { Badge } from '@/shared/components/ui';
import { humanCount, humanDate, type RichMetadata } from '@/modules/metadata';

interface MetadataPreviewProps {
  info: RichMetadata;
}

/**
 * Compact secondary line with uploader, view count and upload date, plus
 * status badges (live, age-restricted, playlist). Every field is optional and
 * only rendered when present, so unknown values simply disappear.
 */
export function MetadataPreview({ info }: MetadataPreviewProps) {
  const views = humanCount(info.viewCount);
  const likes = humanCount(info.likeCount);
  const date = humanDate(info.uploadDate);
  const author = info.uploader ?? info.channel;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-content-tertiary">
        {author && <span className="truncate">{author}</span>}
        {views && (
          <span className="inline-flex items-center gap-1">
            <Eye size={12} /> {views}
          </span>
        )}
        {likes && (
          <span className="inline-flex items-center gap-1">
            <ThumbsUp size={12} /> {likes}
          </span>
        )}
        {date && <span>{date}</span>}
      </div>

      {(info.isLive || info.ageLimit || info.isPlaylist) && (
        <div className="flex flex-wrap gap-1.5">
          {info.isLive && (
            <Badge tone="danger" size="sm">
              <Radio size={12} /> Live
            </Badge>
          )}
          {info.ageLimit ? (
            <Badge tone="warning" size="sm">
              <ShieldAlert size={12} /> {info.ageLimit}+
            </Badge>
          ) : null}
          {info.isPlaylist && (
            <Badge tone="info" size="sm">
              <ListVideo size={12} /> Playlist
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
