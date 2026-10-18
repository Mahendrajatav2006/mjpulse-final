import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

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
    try {
      if (!favorite.userId || !favorite.songId) return { success: false, id: "" };
      const favDocRef = doc(db, "users", favorite.userId, "favorites", favorite.songId);
      await setDoc(favDocRef, {
        ...favorite,
        savedAt: Date.now(),
      }, { merge: true });
      return {
        success: true,
        id: `${favorite.userId}_${favorite.songId}`,
      };
    } catch (e) {
      console.error("[FirebaseService] Error saving favorite:", e);
      return { success: false, id: "" };
    }
  }

  async removeFavorite(userId: string, songId: string): Promise<boolean> {
    try {
      if (!userId || !songId) return false;
      const favDocRef = doc(db, "users", userId, "favorites", songId);
      await deleteDoc(favDocRef);
      return true;
    } catch (e) {
      console.error("[FirebaseService] Error removing favorite:", e);
      return false;
    }
  }

  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    try {
      if (!userId) return [];
      const colRef = collection(db, "users", userId, "favorites");
      const snap = await getDocs(colRef);
      const list: UserFavorite[] = [];
      snap.forEach((d) => {
        list.push(d.data() as UserFavorite);
      });
      return list;
    } catch (e) {
      console.error("[FirebaseService] Error getting favorites:", e);
      return [];
    }
  }
}

export const firebaseService = new FirebaseService();
