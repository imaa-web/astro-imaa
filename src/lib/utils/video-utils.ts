const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#]+)/;

export function extractYouTubeId(url: string): string | null {
  return url.match(YOUTUBE_REGEX)?.[1] ?? null;
}
