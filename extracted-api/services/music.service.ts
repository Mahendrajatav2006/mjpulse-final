import { Track } from "../types/music";
import { youtubeService } from "./youtube.service";
import { saavnService } from "./saavn.service";

// Curated collection of underground, unreleased, or court-banned songs
// that are missing from official streaming catalogs (JioSaavn/Spotify)
const SPECIAL_UNDERGROUND_TRACKS: Track[] = [
  {
    id: "mj-underground-vol-1",
    title: "Choot Vol-1 (Volume 1)",
    artist: "Yo Yo Honey Singh & Badshah",
    album: "Volume 1 (Explicit Underground)",
    thumbnail: "https://i.ytimg.com/vi/1e9OahQtawM/hqdefault.jpg",
    streamUrl: "/audio/volume1.mp3",
    duration: 258,
    durationFormatted: "4:18",
    source: "MJ PULSE Lossless Underground",
  },
  {
    id: "mj-underground-vol-1-official",
    title: "VOLUME 1 HONEY SINGH ft BADSHAH",
    artist: "Yo Yo Honey Singh Ft. Badshah",
    album: "Mafia Mundeer Records",
    thumbnail: "https://i.ytimg.com/vi/1e9OahQtawM/hqdefault.jpg",
    streamUrl: "/audio/volume1.mp3",
    duration: 258,
    durationFormatted: "4:18",
    source: "MJ PULSE Lossless Underground",
  },
];

function normalizeQuery(raw: string): string {
  if (!raw) return "";
  let q = raw.toLowerCase().trim();

  // Strip voice action commands and conversational words if present
  q = q
    .replace(/\b(hey|hay|hi|hello)?\s*(mj\s*pulse|mjpulse|mj|assistant)\b/gi, "")
    .replace(/\b(play song|play track|play music|play karo|play kar do|play)\b/gi, "")
    .replace(/\b(chala do na|chala do|chalao na|chalao|chala de|chalu karo|chalu kar do|chalu)\b/gi, "")
    .replace(/(चलाओ ना|चलाओ|चला दो ना|चला दो|चालू करो)/gi, "")
    .replace(/\b(baja do na|baja do|baja de|bajao na|bajao|baja)\b/gi, "")
    .replace(/(बजाओ ना|बजाओ|बजा दो)/gi, "")
    .replace(/\b(suna do na|suna do|sunao na|sunao|sunna hai)\b/gi, "")
    .replace(/(सुनाओ ना|सुनाओ|सुना दो|सुनना है)/gi, "")
    .replace(/\b(ke gane|ke gaane|k gane|k gaane|ka gana|ka gaana|ki song|ke songs|ka song|wala gana|wale gane)\b/gi, "")
    .replace(/(के गाने|का गाना|के सोंग|का सोंग)/gi, "")
    .replace(/\b(song|songs|track|tracks|gana|gaana|gane|gaane|geet)\b/gi, "")
    .replace(/(गाना|गाने|गीत|संगीत|सोंग)/gi, "");

  // Only strip trailing 'ke/ki/ka' if NOT part of a specific title phrase (like "case firing ke")
  if (!/(case|fireing|firing|phiring|fairing)\s+(ke|ki|ka)$/i.test(q)) {
    q = q.replace(/\b(ka|ki|ke|k)\s*$/gi, "");
  }

  // Fix common spelling variations and typos
  q = q
    .replace(/\b(fairing|fayring|firing|phiring)\b/gi, "fireing")
    .replace(/\bvolme\b/gi, "volume")
    .replace(/\bvol\b/gi, "volume")
    .replace(/\bhoney sing\b/gi, "honey singh")
    .replace(/\barjit\b/gi, "arijit")
    .replace(/\bsidhu musewala\b/gi, "sidhu moose wala")
    .replace(/\bkaran ojla\b/gi, "karan aujla")
    .replace(/\bchot\b/gi, "choot")
    .replace(/\bbadsa\b/gi, "badshah")
    .replace(/\bap dhilon\b/gi, "ap dhillon")
    .replace(/^[,\.\-\s]+|[,\.\-\s]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return q || raw.trim();
}

function matchSpecialTracks(query: string): Track[] {
  const norm = normalizeQuery(query);
  const isVol1 = norm.includes("volume 1") || norm.includes("vol 1") || norm.includes("choot");
  const isHoney = norm.includes("honey") || norm.includes("singh") || norm.includes("badshah");
  
  if (isVol1) {
    return SPECIAL_UNDERGROUND_TRACKS;
  }
  return [];
}

function filterCreatorTracks(query: string, tracks: Track[]): Track[] {
  const q = query.toLowerCase();

  const isZakir = q.includes("zakir");
  const isBassi = q.includes("bassi") || q.includes("anubhav");
  const isUpmanyu = q.includes("upmanyu") || q.includes("abhishek");
  const isMunawar = q.includes("munawar");
  const isHarsh = q.includes("harsh") || q.includes("gujral");
  const isRanveer = q.includes("ranveer") || q.includes("trs") || q.includes("beerbiceps");
  const isPremchand = q.includes("premchand");
  const isHaveli = q.includes("haveli");

  const isBhakti = /(bhajan|aarti|chalisa|bhakti|devotional|sundarkand|chaupai|stotram|ram|krishna|shiv|hanuman|ganesh|durga|gurbani)/i.test(q);
  const isHorrorGeneric = /(horror|chudail|darr|paranormal|aatma|midnight|khooni)/i.test(q);
  const isPodcastGeneric = /(podcast|interview|trs|talks|figuring out|dostcast)/i.test(q);
  const isStoryGeneric = /(story|stories|kahani|panchatantra|akbar|birbal|vikram|betal|kisse)/i.test(q);
  const isHaryanvi = /haryanvi/i.test(q);
  const isBhojpuri = /bhojpuri/i.test(q);

  if (
    !isZakir &&
    !isBassi &&
    !isUpmanyu &&
    !isMunawar &&
    !isHarsh &&
    !isRanveer &&
    !isPremchand &&
    !isHaveli &&
    !isBhakti &&
    !isHorrorGeneric &&
    !isPodcastGeneric &&
    !isStoryGeneric &&
    !isHaryanvi &&
    !isBhojpuri
  ) {
    return tracks;
  }

  return tracks.filter((t) => {
    const text = `${t.title || ""} ${t.artist || ""} ${t.album || ""}`.toLowerCase();

    if (isZakir) {
      const match = text.includes("zakir") || text.includes("जाकिर");
      const excluded =
        text.includes("bassi") ||
        text.includes("upmanyu") ||
        text.includes("munawar") ||
        text.includes("gujral") ||
        text.includes("aziz ansari");
      return match && !excluded;
    }

    if (isBassi) {
      const knownBassiTitles = [
        "ambulance",
        "roommate",
        "hostel",
        "cheating",
        "bas kar bassi",
        "flatmates",
        "12th class",
        "engineering",
        "disturbance",
        "dubai",
        "banker",
      ];
      const hasKnownTitle = knownBassiTitles.some((k) => text.includes(k));
      const match =
        text.includes("bassi") ||
        text.includes("anubhav") ||
        text.includes("बस्सी") ||
        text.includes("अनुभव") ||
        hasKnownTitle;
      const excluded =
        text.includes("zakir") ||
        text.includes("upmanyu") ||
        text.includes("munawar") ||
        text.includes("gujral");
      return match && !excluded;
    }

    if (isUpmanyu) {
      const match = text.includes("upmanyu") || text.includes("abhishek") || text.includes("उपमन्यु");
      const excluded = text.includes("zakir") || text.includes("bassi") || text.includes("munawar");
      return match && !excluded;
    }

    if (isMunawar) {
      const match = text.includes("munawar") || text.includes("faruqui") || text.includes("मुनव्वर");
      const excluded = text.includes("zakir") || text.includes("bassi");
      return match && !excluded;
    }

    if (isHarsh) {
      const match = text.includes("gujral") || text.includes("harsh") || text.includes("हर्ष");
      const excluded = text.includes("zakir") || text.includes("bassi");
      return match && !excluded;
    }

    if (isRanveer) {
      return (
        text.includes("ranveer") ||
        text.includes("trs") ||
        text.includes("beerbiceps") ||
        text.includes("the ranveer show")
      );
    }

    if (isPremchand) {
      return (
        text.includes("premchand") ||
        text.includes("प्रेमचंद") ||
        text.includes("godaan") ||
        text.includes("kafan")
      );
    }

    if (isHaveli) {
      return (
        text.includes("haveli") ||
        text.includes("bhoot") ||
        text.includes("bhootiya") ||
        text.includes("horror") ||
        text.includes("हवेली")
      );
    }

    const isBhakti = /(bhajan|aarti|chalisa|bhakti|devotional|sundarkand|chaupai|stotram|ram|krishna|shiv|hanuman|ganesh|durga|gurbani)/i.test(q);
    if (isBhakti) {
      const match = /(bhajan|aarti|chalisa|bhakti|devotional|sundarkand|chaupai|stotram|ram|krishna|shiv|hanuman|ganesh|durga|shri|gurbani|shabad|kirtan|mantra|stuti|peaceful|chants)/i.test(text);
      const excluded = /(remix|club|party|dj|edm|hip hop|rap|item song)/i.test(text);
      return match && !excluded;
    }

    const isHorrorGeneric = /(horror|chudail|darr|paranormal|aatma|midnight|khooni)/i.test(q);
    if (isHorrorGeneric) {
      return /(horror|bhoot|chudail|darr|raat|paranormal|aatma|midnight|khooni|ghost|dark|creepy|spine)/i.test(text);
    }

    const isPodcastGeneric = /(podcast|interview|trs|talks|figuring out|dostcast)/i.test(q);
    if (isPodcastGeneric) {
      return /(podcast|interview|show|talk|episode|trs|ranveer|shamani|conversation|vinamre)/i.test(text);
    }

    const isStoryGeneric = /(story|stories|kahani|panchatantra|akbar|birbal|vikram|betal|kisse)/i.test(q);
    if (isStoryGeneric) {
      return /(story|kahani|katha|kisse|premchand|panchatantra|akbar|birbal|vikram|betal|audiobook|tales)/i.test(text);
    }

    const isHaryanvi = /haryanvi/i.test(q);
    if (isHaryanvi) {
      return /(haryanvi|haryana|masoom|renuka|gulzaar|sapna|diler)/i.test(text);
    }

    const isBhojpuri = /bhojpuri/i.test(q);
    if (isBhojpuri) {
      return /(bhojpuri|pawan|khesari|nirahua|bhojpuriya)/i.test(text);
    }

    return true;
  });
}

function normalizeString(str: string): string {
  return (str || "")
    .toLowerCase()
    .replace(/\s*[\(\[].*?[\)\]]/gi, "")
    .replace(/[^\w\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function computeWordSimilarity(a: string, b: string): number {
  const normA = normalizeString(a);
  const normB = normalizeString(b);
  if (!normA || !normB) return 0;
  if (normA === normB) return 1.0;
  if (normA.includes(normB) || normB.includes(normA)) return 1.0;

  const wordsA = normA.split(" ").filter(w => w.length >= 2);
  const wordsB = normB.split(" ").filter(w => w.length >= 2);
  if (wordsA.length === 0 || wordsB.length === 0) return 0;

  const setB = new Set(wordsB);
  let common = 0;
  wordsA.forEach((w) => {
    if (setB.has(w)) common++;
  });
  return common / Math.min(wordsA.length, wordsB.length);
}

function isLyricsQuery(query: string): boolean {
  const q = query.trim().toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  if (/(lyrics|lyric|bol|lines|line\s+of)/i.test(q)) return true;
  const lyricPattern = /(mera|meri|mere|tera|teri|tere|humko|tumhe|tujhe|dil|jaan|ishq|pyar|pyaar|mohabbat|safar|manzil|rahoon|jawa|javan|jaye|rahein|hoke|dekh|sun|kaho|chal|baat|khuda|rabba|naina|ankhiyan|akhiyan|saath|sath|yaadon|paas|rehti|rahen)/i;
  const isGenericSearch = /(song|songs|album|artist|singers?|official|music|video|mix|dj|remix|hit|hits|all|playlist)/i.test(q);
  return words.length >= 4 && lyricPattern.test(q) && !isGenericSearch;
}

let cachedTrending: Track[] = [];
let lastTrendingFetchTime = 0;

export class MusicService {
  async searchTracks(query: string, limit: number = 60, page: number = 1): Promise<Track[]> {
    const trimmed = query?.trim() || "";

    if (!trimmed) {
      return this.getTrendingTracks(limit, page);
    }

    const norm = normalizeQuery(trimmed);
    const matchedSpecial = page === 1 ? matchSpecialTracks(trimmed) : [];

    const isSpokenOrSpecial = /(podcast|standup|comedy|horror|kahani|story|interview|bassi|zakir|upmanyu|munawar|gujral|ranveer|trs|bhoot|haveli|katha|mystery)/i.test(trimmed);

    try {
      const candidatesMap = new Map<string, Track>();

      // Step 1: Parallel JioSaavn Search (exact query + normalized query if different)
      const saavnPromises: Promise<Track[]>[] = [
        saavnService.searchTracks(trimmed, limit, page),
      ];
      if (norm && norm.toLowerCase() !== trimmed.toLowerCase()) {
        saavnPromises.push(saavnService.searchTracks(norm, limit, page));
      }
      if (isSpokenOrSpecial) {
        const simplified = trimmed
          .replace(/\b(standup|comedy|podcast|audio|stories|shows?|episodes?)\b/gi, "")
          .trim();
        if (simplified && simplified.toLowerCase() !== trimmed.toLowerCase()) {
          saavnPromises.push(saavnService.searchTracks(simplified, limit, page));
        }
      }

      const saavnSettled = await Promise.allSettled(saavnPromises);
      for (const res of saavnSettled) {
        if (res.status === "fulfilled" && Array.isArray(res.value)) {
          for (const track of res.value) {
            if (track && track.id && track.streamUrl && track.streamUrl.length > 5) {
              candidatesMap.set(track.id, track);
            }
          }
        }
      }

      // Step 2: YouTube Music Multi-Source Expansion (Page 1)
      // Captures unreleased songs, underground mashups, lofi mixes, covers, and exact lyrics
      if (page === 1) {
        try {
          const ytTracks = await youtubeService.searchTracks(trimmed, 25);
          if (Array.isArray(ytTracks) && ytTracks.length > 0) {
            // Pick top candidates from YouTube Music and resolve in JioSaavn
            const resolveCandidates = ytTracks.slice(0, 10);
            const resolvePromises = resolveCandidates.map(async (yt) => {
              try {
                const searchStr = `${yt.title} ${yt.artist || ""}`.trim();
                const matched = await saavnService.searchTracks(searchStr, 4);
                if (Array.isArray(matched) && matched.length > 0) {
                  const exact = matched.find(
                    (m) => computeWordSimilarity(yt.title, m.title) >= 0.4 ||
                           m.title.toLowerCase().includes(yt.title.toLowerCase()) ||
                           yt.title.toLowerCase().includes(m.title.toLowerCase())
                  );
                  const selected = exact || matched[0];
                  if (selected && selected.streamUrl && selected.streamUrl.length > 5) {
                    return {
                      ...selected,
                      source: "MJ PULSE Cloud",
                    } as Track;
                  }
                }
              } catch (_) {}
              return null;
            });

            const resolvedTracks = await Promise.allSettled(resolvePromises);
            for (const r of resolvedTracks) {
              if (r.status === "fulfilled" && r.value && r.value.id) {
                candidatesMap.set(r.value.id, r.value);
              }
            }
          }
        } catch (ytErr) {
          console.warn("[MusicService] YT expansion error:", ytErr);
        }
      }

      // Step 3: Google Suggestion Bridge (For lyrics or obscure song lines)
      if (candidatesMap.size < 10) {
        try {
          const suggUrl = `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(trimmed + ' song')}`;
          const suggRes = await fetch(suggUrl).catch(() => null);
          if (suggRes && suggRes.ok) {
            const suggData = await suggRes.json().catch(() => []);
            const suggestions: string[] = (suggData?.[1] || []).slice(0, 3);
            for (const sugg of suggestions) {
              if (sugg && sugg.toLowerCase() !== trimmed.toLowerCase()) {
                const extraTracks = await saavnService.searchTracks(sugg, 25);
                for (const t of extraTracks) {
                  if (t && t.id && t.streamUrl && t.streamUrl.length > 5) {
                    candidatesMap.set(t.id, t);
                  }
                }
              }
            }
          }
        } catch (_) {}
      }

      // Step 4: Special Underground / Banned Track Matches
      if (matchedSpecial.length > 0) {
        for (const sp of matchedSpecial) {
          candidatesMap.set(sp.id, sp);
        }
      }

      // Convert to array and filter creator content if specific person queried
      const allFound = Array.from(candidatesMap.values());
      const filtered = filterCreatorTracks(trimmed, allFound);
      const finalTracks = filtered.length > 0 ? filtered : allFound;

      // Special underground tracks always appear first if matched
      if (matchedSpecial.length > 0) {
        const specialIds = new Set(matchedSpecial.map((s) => s.id));
        const nonSpecial = finalTracks.filter((t) => !specialIds.has(t.id));
        return [...matchedSpecial, ...nonSpecial].slice(0, limit);
      }

      return finalTracks.slice(0, limit);
    } catch (err) {
      console.error("[MusicService] Search error:", err);
    }

    if (matchedSpecial.length > 0) {
      return matchedSpecial;
    }

    return [];
  }

  async getTrendingTracks(limit: number = 20, page: number = 1): Promise<Track[]> {
    if (page === 1) {
      try {
        // Fetch official live daily chart (Hindi: India Superhits Top 50) directly from platform
        const liveChart = await saavnService.getPlaylistDetails('1134543272');
        if (liveChart?.songs && liveChart.songs.length > 0) {
          const playable = (liveChart.songs as Track[]).filter(t => !!t.streamUrl && t.streamUrl.length > 5);
          if (playable.length >= 10) {
            cachedTrending = playable;
            lastTrendingFetchTime = Date.now();
            return playable.slice(0, limit);
          }
        }
      } catch (err) {
        console.warn("[MusicService] Live daily chart error, using rotating keywords:", err);
      }
    }

    const currentYear = new Date().getFullYear();
    const trendingKeywords = [
      "Global Top 50 Hits",
      `Viral Hindi Songs ${currentYear}`,
      "Latest Desi Hip Hop Releases",
      "Trending Instagram Audio",
      `Top Bollywood Hits ${currentYear}`,
      `New Punjabi Anthems ${currentYear}`,
      "Party Mix Dance Hits",
      "Arijit Singh Latest Songs",
      "Lo-Fi Bollywood Chill",
      `Top English Pop Hits ${currentYear}`,
      "Trending Workout Beats",
      "Top Viral Songs India",
      `New Bollywood Releases ${currentYear}`,
      "Best of Sidhu Moose Wala",
      `Diljit Dosanjh Hits ${currentYear}`,
      "Karan Aujla New Songs",
      `Romantic Hindi Songs ${currentYear}`,
      `Haryanvi Top Hits ${currentYear}`,
      "Trending Dance Anthems",
      "90s Bollywood Evergreen Hits",
      "MC Stan New Songs",
      "Imran Khan Hits",
      "AP Dhillon Latest Songs",
      "Badshah Party Songs",
      "Honey Singh New Hits",
      "Atif Aslam Latest Songs",
      "Neha Kakkar Latest Songs",
      "Divine Gully Gang",
      "Emiway Bantai New",
      "Sonu Nigam Classics",
    ];

    try {
      // Pick 3 different keywords with random offset so every refresh yields fresh hits
      const randOffset = Math.floor(Math.random() * trendingKeywords.length);
      const baseIdx = (((page - 1) * 3) + randOffset) % trendingKeywords.length;
      const idx1 = baseIdx % trendingKeywords.length;
      const idx2 = (baseIdx + 7) % trendingKeywords.length;
      const idx3 = (baseIdx + 17) % trendingKeywords.length;
      const saavnPage = Math.floor((page - 1) / (trendingKeywords.length / 3)) + 1;

      // Fetch from 3 different keyword groups simultaneously for maximum variety
      const [res1, res2, res3] = await Promise.allSettled([
        saavnService.searchTracks(trendingKeywords[idx1], Math.ceil(limit / 3) + 2, saavnPage),
        saavnService.searchTracks(trendingKeywords[idx2], Math.ceil(limit / 3) + 2, 1),
        saavnService.searchTracks(trendingKeywords[idx3], Math.ceil(limit / 3) + 2, 1),
      ]);

      const batch1 = res1.status === 'fulfilled' ? (res1.value || []) : [];
      const batch2 = res2.status === 'fulfilled' ? (res2.value || []) : [];
      const batch3 = res3.status === 'fulfilled' ? (res3.value || []) : [];

      // Interleave all 3 batches for a true mixed trending feel
      const interleaved: Track[] = [];
      const maxLen = Math.max(batch1.length, batch2.length, batch3.length);
      for (let i = 0; i < maxLen; i++) {
        if (batch1[i]) interleaved.push(batch1[i]);
        if (batch2[i]) interleaved.push(batch2[i]);
        if (batch3[i]) interleaved.push(batch3[i]);
      }

      if (interleaved.length > 0) {
        // Deduplicate by id and title
        const uniqueTracks = Array.from(new Map(interleaved.map(t => [t.id, t])).values());
        const uniqueByTitle = Array.from(new Map(uniqueTracks.map(t => [t.title, t])).values());

        // For page 1, save a light cache (30 sec only) so repeated mounts in same session don't re-fetch
        if (page === 1) {
          cachedTrending = uniqueByTitle;
          lastTrendingFetchTime = Date.now();
        }
        return uniqueByTitle.slice(0, limit);
      }

      // Fallback to single keyword
      const fallback = await saavnService.searchTracks(trendingKeywords[idx1], limit, saavnPage);
      if (fallback && fallback.length > 0) {
        return fallback.slice(0, limit);
      }

      return page === 1 ? SPECIAL_UNDERGROUND_TRACKS : [];
    } catch (err) {
      console.error("[MusicService] getTrendingTracks error:", err);
      return page === 1 && cachedTrending.length > 0 ? cachedTrending.slice(0, limit) : [];
    }
  }

  async searchAll(query: string) {
    if (!query) return null;
    const norm = normalizeQuery(query);
    const matchedSpecial = matchSpecialTracks(query);

    const [songs, rawAll] = await Promise.all([
      this.searchTracks(query, 25, 1),
      saavnService.searchAll(norm),
    ]);

    const results = {
      songs: songs || [],
      albums: rawAll?.albums || [],
      artists: rawAll?.artists || [],
      playlists: rawAll?.playlists || [],
    };

    if (matchedSpecial.length > 0) {
      const combined = [...matchedSpecial, ...(results.songs || [])];
      results.songs = Array.from(new Map(combined.map(t => [t.id, t])).values());
    }

    return results;
  }

  async searchArtists(query: string, limit: number = 20) {
    if (!query) return [];
    return saavnService.searchArtists(normalizeQuery(query), limit);
  }

  async searchAlbums(query: string, limit: number = 20) {
    if (!query) return [];
    return saavnService.searchAlbums(normalizeQuery(query), limit);
  }

  async searchPlaylists(query: string, limit: number = 20) {
    if (!query) return [];
    return saavnService.searchPlaylists(normalizeQuery(query), limit);
  }


  async getArtistDetails(artistId: string) {
    if (!artistId) return null;
    return saavnService.getArtistDetails(artistId);
  }

  async getAlbumDetails(albumId: string) {
    if (!albumId) return null;
    return saavnService.getAlbumDetails(albumId);
  }

  async getPlaylistDetails(playlistId: string) {
    if (!playlistId) return null;
    return saavnService.getPlaylistDetails(playlistId);
  }
}

export const musicService = new MusicService();

