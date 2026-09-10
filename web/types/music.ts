export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  thumbnail: string;
  streamUrl?: string;
  duration?: number;
  durationFormatted?: string;
  source?: string;
  plays?: string;
}

export interface SearchApiResponse {
  success: boolean;
  query: string;
  count: number;
  data: Track[];
  error?: string;
}

export type NavTab =
  | "android"
  | "music"
  | "equalizer"
  | "lyrics"
  | "library"
  | "download"
  | "settings";

export interface PlaylistItem {
  id: string;
  title: string;
  description: string;
  songCount: number;
  coverUrl: string;
  isPrivate?: boolean;
}
