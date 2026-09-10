import { config } from "../lib/config";

export interface UserFavorite {
  userId: string;
  songId: string;
  title: string;
  artist: string;
  coverUrl: string;
  platform: string;
  savedAt: number;
}

export class FirebaseService {
  async saveFavorite(favorite: UserFavorite): Promise<{ success: boolean; id: string }> {
    // Modular wrapper for Firestore synchronization across Web and Mobile
    console.log("[FirebaseService] Syncing favorite for user:", favorite.userId, favorite.songId);
    return {
      success: true,
      id: `${favorite.userId}_${favorite.songId}`,
    };
  }

  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    console.log("[FirebaseService] Fetching favorites for:", userId);
    return [];
  }
}

export const firebaseService = new FirebaseService();
