export type ContentType = "song" | "podcast" | "standup" | "story" | "devotional" | "other";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  thumbnail: string;
  streamUrl?: string;
  duration?: number;
  durationFormatted?: string;
  source?: string;
  plays?: string;
  contentType?: ContentType;
  category?: string;
  genre?: string;
  year?: string;
  language?: string;
  isExplicit?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  role?: string;
  url?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  image: string;
  year?: string;
  url?: string;
}

export interface SearchApiResponse {
  success: boolean;
  query: string;
  count: number;
  data?: Track[]; // For type=song
  artists?: Artist[]; // For type=artist
  albums?: Album[]; // For type=album
  playlists?: PlaylistItem[]; // For type=playlist
  topQuery?: any; // For type=all (mixed)
  error?: string;
}

export type NavTab =
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
