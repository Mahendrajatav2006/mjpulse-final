export class FirebaseService {
  async verifyToken(token: string) {
    if (!token) {
      throw new Error("No authorization token provided");
    }
    return {
      uid: "user_" + token.slice(-8),
      email: "user@mjpulse.app",
      name: "Pulse Listener",
    };
  }

  async saveFavorite(favorite: any) {
    return {
      saved: true,
      id: favorite?.id || "fav-" + Date.now(),
      timestamp: Date.now(),
    };
  }
}

export const firebaseService = new FirebaseService();
