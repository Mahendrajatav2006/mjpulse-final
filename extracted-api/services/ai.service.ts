import { GoogleGenerativeAI, FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { musicService } from "./music.service";
import { saavnService } from "./saavn.service";
import { youtubeService } from "./youtube.service";

export class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    this.init();
  }

  private init() {
    // Check if key is available
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      
      const searchTrackFunction: FunctionDeclaration = {
        name: "search_and_play_track",
        description: "Search for a specific song, artist, or album and play it. Use this for ANY music request.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            query: {
              type: SchemaType.STRING,
              description: "The name of the song, artist, or album to search for. Fix any typos."
            }
          },
          required: ["query"]
        }
      };

      const controlPlaybackFunction: FunctionDeclaration = {
        name: "control_playback",
        description: "Control music playback like play, pause, next, previous, loop, shuffle.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            action: {
              type: SchemaType.STRING,
              description: "The action to perform: 'play', 'pause', 'next', 'previous', 'loop', 'shuffle'"
            }
          },
          required: ["action"]
        }
      };

      const searchInternetFunction: FunctionDeclaration = {
        name: "search_internet",
        description: "Search the internet for real-time information, trivia, or general questions.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            query: {
              type: SchemaType.STRING,
              description: "The search query."
            }
          },
          required: ["query"]
        }
      };

      // We use gemini-1.5-flash as it supports tool calling and is very fast
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        tools: [
          {
            functionDeclarations: [searchTrackFunction, controlPlaybackFunction, searchInternetFunction]
          }
        ],
        systemInstruction: "You are MJ Pulse, an AI Voice Assistant for a music app. You help users play music, control playback, and find information. Always use the provided tools if possible. Keep your responses very concise (1 short sentence) because they will be read aloud by TTS. Be playful and helpful."
      });
    }
  }

  private async processLocalIntent(command: string) {
    const lower = command.toLowerCase().trim();

    // Strip wake words first
    const wakeWordClean = lower
      .replace(/\b(hey|hay|he|hi|oye|ay|ae|hello|suno)?\s*(mj|mg|m\.j\.|mjpulse|mj\s*pulse|assistant)\b/gi, "")
      .trim();

    // 1. If only wake word or greeting was spoken ("Hay MJ", "Hey MJ", "Hello MJ", etc.)
    if (!wakeWordClean || wakeWordClean === "hi" || wakeWordClean === "hello" || wakeWordClean === "hey") {
      return {
        intent: "awake",
        chatResponse: "Yes, I am listening. What song should I play?",
      };
    }

    const effective = wakeWordClean;

    // 2. Playback controls
    if (effective === "pause" || effective.includes("pause music") || effective.includes("stop") || effective.includes("ruk jao") || effective.includes("roko") || effective.includes("band karo") || effective.includes("thahar jao")) {
      return {
        intent: "playback_control",
        action: "pause",
        chatResponse: "Paused playback.",
      };
    }

    if (effective === "resume" || effective === "play" || effective.includes("chalu karo") || effective.includes("shuru karo") || effective.includes("continue")) {
      return {
        intent: "playback_control",
        action: "play",
        chatResponse: "Resuming playback.",
      };
    }

    if (effective.includes("next") || effective.includes("agla") || effective.includes("skip") || effective.includes("change song") || effective.includes("badlo")) {
      return {
        intent: "playback_control",
        action: "next",
        chatResponse: "Playing next track.",
      };
    }

    if (effective.includes("previous") || effective.includes("pichhla") || effective.includes("pichla") || effective.includes("back")) {
      return {
        intent: "playback_control",
        action: "previous",
        chatResponse: "Playing previous track.",
      };
    }

    // 3. Play songs / search music: Smart Hindi & Hinglish cleaning
    let cleanQuery = effective
      // polite prefixes
      .replace(/^(can you |please |kindly |kya aap |kya tum |bhai |bro |yaar )/i, "")
      // action starters
      .replace(/^(play |chalao |chala do |chala de |baja do |baja de |bajao |sunao |suna do |suna de |gana lagao |lagao |play song |play track |search |find |mujhe sunna hai |mujhe sunao )/i, "")
      // conversational filler words
      .replace(/\b(mujhe|hume|humko|mere liye|hamaare liye|koi|kuch|ek|achha|accha|acche|naya|purana|best|top|hit|famous|latest|favorite|favourite)\b/gi, "")
      // trailing action phrases
      .replace(/( gana lagao| gana bajao| gaana bajao| gana chalao| gana sunao| gana| gaana| gane| gaane| geet| song| songs| track| tracks| sunao| bajao| chalao| lagao)$/i, "")
      // trailing relational particles
      .replace(/\b(ka|ki|ke|k|wala|wali|wale)\s*$/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    const candidateQueries = [
      cleanQuery,
      effective.replace(/^(play |chalao |baja do |sunao )/i, "").trim(),
      effective,
    ].filter(Boolean);

    // Multi-tier music search
    for (const q of candidateQueries) {
      try {
        const tracks = await musicService.searchTracks(q, 5);
        if (tracks && tracks.length > 0 && tracks[0].streamUrl) {
          return {
            intent: "play_music",
            chatResponse: `Playing ${tracks[0].title} by ${tracks[0].artist}!`,
            track: tracks[0],
          };
        }
      } catch (e) {
        console.error("[AIService] Search candidate error:", e);
      }
    }

    // Fallback: If query mentions known artists or genres, search for that
    const fallbackTerms = ["arijit singh", "diljit dosanjh", "sidhu moose wala", "badshah", "honey singh", "shreya ghoshal", "karan aujla", "romantic", "bollywood", "punjabi", "lofi"];
    for (const term of fallbackTerms) {
      if (effective.includes(term.split(" ")[0])) {
        try {
          const tracks = await musicService.searchTracks(term, 5);
          if (tracks && tracks.length > 0) {
            return {
              intent: "play_music",
              chatResponse: `Playing top hits by ${tracks[0].artist}!`,
              track: tracks[0],
            };
          }
        } catch {}
      }
    }

    return {
      intent: "chat",
      chatResponse: `I searched for "${cleanQuery || command}" but couldn't find a playable track right now. Try saying "Play Kesariya" or "Play Arijit Singh".`,
    };
  }

  public async processVoiceCommand(command: string) {
    if (!this.model) {
      this.init();
    }

    if (!this.model) {
      return this.processLocalIntent(command);
    }

    try {
      const chat = this.model.startChat();
      const result = await chat.sendMessage(command);
      
      // Check if the model wants to call a function
      const call = result.response.functionCalls()?.[0];

      if (call) {
        if (call.name === "search_and_play_track") {
          const query = call.args.query;
          const tracks = await musicService.searchTracks(query, 1);
          if (tracks && tracks.length > 0) {
            return {
              intent: "play_music",
              chatResponse: `Playing ${tracks[0].title} by ${tracks[0].artist}!`,
              track: tracks[0]
            };
          } else {
            return {
              intent: "chat",
              chatResponse: `Sorry, I couldn't find the song ${query}.`
            };
          }
        } 
        else if (call.name === "control_playback") {
          return {
            intent: "playback_control",
            action: call.args.action,
            chatResponse: `Sure, acting on your request.`
          };
        }
        else if (call.name === "search_internet") {
          const res = await chat.sendMessage(`User requested internet info: ${call.args.query}. Provide a concise 1-sentence answer.`);
          return {
            intent: "chat",
            chatResponse: res.response.text()
          };
        }
      }

      // No function call, just standard chat
      return {
        intent: "chat",
        chatResponse: result.response.text()
      };
    } catch (e: any) {
      console.warn("[AIService] Gemini error, falling back to local intent parser:", e?.message || e);
      return this.processLocalIntent(command);
    }
  }
}

export const aiService = new AIService();
