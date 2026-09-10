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
  | "dashboard"
  | "showcase"
  | "music"
  | "playlists"
  | "users"
  | "updates"
  | "announcements"
  | "analytics"
  | "features"
  | "settings";

export interface AppUpdateItem {
  id: string;
  version: string;
  title: string;
  date: string;
  status: "Published" | "Draft" | "Staging";
  description: string;
  highlights: string[];
}

export interface AnnouncementItem {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  iconType: "party" | "ai" | "playlist" | "system";
  badgeColor?: string;
}

export interface PlaylistItem {
  id: string;
  title: string;
  description: string;
  songCount: number;
  coverUrl: string;
  isPrivate?: boolean;
}
