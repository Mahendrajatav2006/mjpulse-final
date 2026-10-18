export const config = {
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY || "",
    baseUrl: "https://www.googleapis.com/youtube/v3",
  },
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  }
};
