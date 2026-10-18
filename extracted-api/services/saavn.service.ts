import { Track } from "../types/music";
import CryptoJS from "crypto-js";

export class SaavnService {
  private cleanHtmlEntities(str: string): string {
    if (!str) return "";
    return str
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }

  private formatDuration(secondsStr?: string): string {
    const sec = parseInt(secondsStr || "0", 10);
    if (!sec || isNaN(sec)) return "3:30";
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  }

  private decryptMediaUrl(encryptedUrl?: string): string {
    if (!encryptedUrl) return "";
    const clean = encryptedUrl.trim();
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }
    try {
      const key = CryptoJS.enc.Utf8.parse("38346591");
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(clean),
      });
      const decrypted = CryptoJS.DES.decrypt(cipherParams, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      const url = decrypted.toString(CryptoJS.enc.Utf8);
      if (!url) return "";
      // Return highest quality 320kbps MP4 audio
      return url.replace(/_\d+\.mp4/, "_320.mp4");
    } catch (err) {
      return "";
    }
  }

  private formatFallbackImage(rawImg?: string, seedText: string = ""): string {
    if (rawImg && typeof rawImg === "string" && rawImg.trim().length > 10 && !rawImg.includes("default_album") && !rawImg.includes("artist-default") && !rawImg.includes("default-film")) {
      return rawImg.replace("150x150", "500x500").replace("50x50", "500x500");
    }
    const seed = (seedText || "").toLowerCase();
    if (/(horror|bhoot|haveli|khoon|chudail|paranormal)/i.test(seed)) {
      return "https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=500";
    }
    if (/(standup|comedy|joke|zakir|bassi|upmanyu)/i.test(seed)) {
      return "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=500";
    }
    if (/(podcast|ranveer|trs|interview|crime)/i.test(seed)) {
      return "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500";
    }
    if (/(ram|krishna|shiv|bhajan|aarti|chalisa|hanuman|devotional)/i.test(seed)) {
      return "https://images.unsplash.com/photo-1604928141064-207cea6f5722?w=500";
    }
    return "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500";
  }

  async searchTracks(query: string, limit: number = 50, page: number = 1): Promise<Track[]> {
    if (!query || !query.trim()) return [];
    const trimmed = query.trim();
    const fetchCount = Math.min(Math.max(limit, 40), 50);

    try {
      let results: any[] = [];

      // 1. If page 1, fetch Page 1 & Page 2 in parallel for a massive result set (up to 80-100 tracks)
      if (page === 1) {
        const urlP1 = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=android&n=${fetchCount}&p=1&q=${encodeURIComponent(trimmed)}`;
        const urlP2 = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=android&n=${fetchCount}&p=2&q=${encodeURIComponent(trimmed)}`;

        const [resP1, resP2] = await Promise.allSettled([
          fetch(urlP1, {
            headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36" },
            next: { revalidate: 3600 },
          }),
          fetch(urlP2, {
            headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36" },
            next: { revalidate: 3600 },
          }),
        ]);

        if (resP1.status === "fulfilled" && resP1.value.ok) {
          const data1 = await resP1.value.json().catch(() => ({}));
          if (Array.isArray(data1.results)) results.push(...data1.results);
        }
        if (resP2.status === "fulfilled" && resP2.value.ok) {
          const data2 = await resP2.value.json().catch(() => ({}));
          if (Array.isArray(data2.results)) results.push(...data2.results);
        }
      } else {
        const url = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=android&n=${fetchCount}&p=${page}&q=${encodeURIComponent(trimmed)}`;
        const res = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36" },
          next: { revalidate: 3600 },
        });
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          if (Array.isArray(data.results)) results.push(...data.results);
        }
      }

      // Fallback 1: Web client search if few results
      if (results.length < 15) {
        const webUrl = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=${fetchCount}&p=${page}&q=${encodeURIComponent(trimmed)}`;
        const webRes = await fetch(webUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        }).catch(() => null);
        if (webRes && webRes.ok) {
          const webData = await webRes.json().catch(() => ({}));
          if (Array.isArray(webData.results) && webData.results.length > 0) {
            results.push(...webData.results);
          }
        }
      }

      // Fallback 2: Autocomplete match
      if (results.length < 5) {
        const acUrl = `https://www.jiosaavn.com/api.php?__call=autocomplete.get&_format=json&_marker=0&api_version=4&ctx=android&query=${encodeURIComponent(trimmed)}`;
        const acRes = await fetch(acUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 14)" },
        }).catch(() => null);
        if (acRes && acRes.ok) {
          const acData = await acRes.json().catch(() => ({}));
          if (Array.isArray(acData.songs?.data) && acData.songs.data.length > 0) {
            results.push(...acData.songs.data);
          }
        }
      }

      // Fallback 3: Lyrics / Google Query Bridge (resolves lyrics to canonical song name)
      if (results.length < 5) {
        try {
          const suggUrl = `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(trimmed + ' song')}`;
          const suggRes = await fetch(suggUrl).catch(() => null);
          if (suggRes && suggRes.ok) {
            const suggData = await suggRes.json().catch(() => []);
            const suggestions: string[] = (suggData?.[1] || []).slice(0, 3);
            for (const sugg of suggestions) {
              if (sugg && sugg.toLowerCase() !== trimmed.toLowerCase()) {
                const retryUrl = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=android&n=30&p=1&q=${encodeURIComponent(sugg)}`;
                const retryRes = await fetch(retryUrl, { headers: { "User-Agent": "Mozilla/5.0" } }).catch(() => null);
                if (retryRes && retryRes.ok) {
                  const retryData = await retryRes.json().catch(() => ({}));
                  if (Array.isArray(retryData.results) && retryData.results.length > 0) {
                    results.push(...retryData.results);
                    break;
                  }
                }
              }
            }
          }
        } catch (_) {}
      }

      // Deduplicate results by song id
      const seenIds = new Set<string>();
      const dedupedResults: any[] = [];
      for (const item of results) {
        const itemId = item.id || item.perma_url;
        if (itemId && !seenIds.has(itemId)) {
          seenIds.add(itemId);
          dedupedResults.push(item);
        }
      }

      return dedupedResults.slice(0, limit).map((item: any) => {
        const image = (item.image || "")
          .replace("150x150", "500x500")
          .replace("50x50", "500x500");

        const primaryArtists = item.more_info?.artistMap?.primary_artists
          ?.map((a: any) => a.name)
          .join(", ");

        const artist =
          primaryArtists ||
          this.cleanHtmlEntities(item.more_info?.music || item.subtitle || "Unknown Artist");

        const durationSec = parseInt(item.more_info?.duration || "0", 10);
        const encCandidate =
          item.more_info?.encrypted_media_url ||
          item.encrypted_media_url ||
          item.more_info?.encrypted_drm_media_url;

        let streamUrl = this.decryptMediaUrl(encCandidate);
        if (!streamUrl) {
          streamUrl =
            item.more_info?.vlink ||
            item.vlink ||
            item.more_info?.media_preview_url ||
            item.media_preview_url ||
            item.more_info?.preview_url ||
            item.preview_url ||
            "";
        }

        return {
          id: item.id || `saavn-${Math.random().toString(36).substring(2, 8)}`,
          title: this.cleanHtmlEntities(item.title || "Untitled"),
          artist,
          album: this.cleanHtmlEntities(item.more_info?.album || ""),
          thumbnail: this.formatFallbackImage(image, item.title || "Untitled"),
          streamUrl,
          duration: durationSec > 0 ? durationSec : undefined,
          durationFormatted: this.formatDuration(item.more_info?.duration),
          source: "MJ PULSE Cloud",
        };
      })
      .filter((track: Track) => !!track.streamUrl && track.streamUrl.length > 5)
      .slice(0, limit);
    } catch (error) {
      console.error("[SaavnService] Search error:", error);
      return [];
    }
  }

  async searchArtists(query: string, limit: number = 20) {
    if (!query || !query.trim()) return [];
    try {
      const url = `https://www.jiosaavn.com/api.php?__call=search.getArtistResults&q=${encodeURIComponent(query.trim())}&p=1&n=${limit}&_format=json&ctx=web6dot0`;
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) return [];
      const data = await res.json();
      const formatImage = (img: string) => img ? img.replace("150x150", "500x500").replace("50x50", "500x500") : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500";
      return (data.results || []).map((item: any) => ({
        id: item.id || item.artistId,
        name: this.cleanHtmlEntities(item.name || item.title),
        image: this.formatFallbackImage(item.image, item.name || item.title),
        role: item.role || item.description || "Artist",
      }));
    } catch (e) {
      return [];
    }
  }

  async searchAlbums(query: string, limit: number = 20) {
    if (!query || !query.trim()) return [];
    try {
      const url = `https://www.jiosaavn.com/api.php?__call=search.getAlbumResults&q=${encodeURIComponent(query.trim())}&p=1&n=${limit}&_format=json&ctx=web6dot0`;
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) return [];
      const data = await res.json();
      const formatImage = (img: string) => img ? img.replace("150x150", "500x500").replace("50x50", "500x500") : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500";
      return (data.results || []).map((item: any) => ({
        id: item.albumid || item.id,
        title: this.cleanHtmlEntities(item.title),
        artist: this.cleanHtmlEntities(item.music || item.primary_artists || "Unknown"),
        image: this.formatFallbackImage(item.image, item.title),
        year: item.year,
      }));
    } catch (e) {
      return [];
    }
  }

  async searchPlaylists(query: string, limit: number = 20) {
    if (!query || !query.trim()) return [];
    try {
      const url = `https://www.jiosaavn.com/api.php?__call=search.getPlaylistResults&q=${encodeURIComponent(query.trim())}&p=1&n=${limit}&_format=json&ctx=web6dot0`;
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) return [];
      const data = await res.json();
      const formatImage = (img: string) => img ? img.replace("150x150", "500x500").replace("50x50", "500x500") : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500";
      return (data.results || []).map((item: any) => ({
        id: item.listid || item.id,
        title: this.cleanHtmlEntities(item.title || item.listname),
        description: this.cleanHtmlEntities(item.subtitle || item.description || ""),
        coverUrl: this.formatFallbackImage(item.image, item.title || item.listname),
      }));
    } catch (e) {
      return [];
    }
  }

  async searchAll(query: string) {
    if (!query || !query.trim()) return null;
    try {
      const [songs, artists, albums, playlists] = await Promise.all([
        this.searchTracks(query, 25),
        this.searchArtists(query, 10),
        this.searchAlbums(query, 10),
        this.searchPlaylists(query, 10)
      ]);

      return {
        songs,
        albums,
        artists,
        playlists
      };
    } catch (e) {
      console.error("[SaavnService] searchAll error:", e);
      return null;
    }
  }

  async getArtistDetails(artistId: string) {
    if (!artistId) return null;
    try {
      const pageUrl = `https://www.jiosaavn.com/api.php?__call=artist.getArtistPageDetails&artistId=${artistId}&type=artist&p=1&n_song=50&_format=json&ctx=web6dot0`;
      const songsUrl = `https://www.jiosaavn.com/api.php?__call=artist.getArtistMoreSong&artistId=${artistId}&p=1&n_song=50&_format=json&ctx=web6dot0`;
      
      const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      };

      const [pageRes, songsRes] = await Promise.all([
        fetch(pageUrl, { headers }),
        fetch(songsUrl, { headers })
      ]);

      if (!pageRes.ok) return null;
      
      const data = await pageRes.json();
      let songsData: any = {};
      
      if (songsRes.ok) {
        try {
          songsData = await songsRes.json();
        } catch(e) {}
      }
      
      const formatImage = (img: string) => img ? img.replace("150x150", "500x500").replace("50x50", "500x500") : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500";
      
      const rawSongs = songsData.topSongs?.songs || songsData.topSongs || data.topSongs?.songs || data.topSongs || [];
      
      const songs = Array.isArray(rawSongs) ? rawSongs.map((item: any) => ({
        id: item.id,
        title: this.cleanHtmlEntities(item.title || item.song),
        artist: this.cleanHtmlEntities(item.primary_artists || item.more_info?.primary_artists || "Unknown"),
        album: this.cleanHtmlEntities(item.album || item.more_info?.album || ""),
        thumbnail: formatImage(item.image),
        streamUrl: this.decryptMediaUrl(item.encrypted_media_url || item.more_info?.encrypted_media_url) || item.vlink || item.more_info?.vlink || "",
        duration: parseInt(item.duration || item.more_info?.duration || "0", 10),
        durationFormatted: this.formatDuration(item.duration || item.more_info?.duration),
        source: "MJ PULSE Cloud",
      })) : [];
      
      return {
        id: data.artistId || artistId,
        name: this.cleanHtmlEntities(data.name || songsData.name || "Artist"),
        image: formatImage(data.image || songsData.image),
        followerCount: data.follower_count || songsData.follower_count || 0,
        isVerified: data.isVerified || songsData.isVerified || false,
        dominantType: data.dominantType || songsData.dominantType || "Artist",
        topSongs: songs,
      };
    } catch (e) {
      console.error("[SaavnService] getArtistDetails error:", e);
      return null;
    }
  }

  async getAlbumDetails(albumId: string) {
    if (!albumId) return null;
    try {
      const fetchJson = async (url: string) => {
        try {
          const res = await fetch(url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            }
          });
          if (!res.ok) return null;
          return await res.json();
        } catch {
          return null;
        }
      };

      let data: any = null;
      if (/^\d+$/.test(albumId)) {
        data = await fetchJson(`https://www.jiosaavn.com/api.php?__call=content.getAlbumDetails&albumid=${albumId}&_format=json&ctx=web6dot0`);
      }
      if (!data || (!data.title && !data.name)) {
        data = await fetchJson(`https://www.jiosaavn.com/api.php?__call=webapi.get&token=${albumId}&type=album&_format=json&ctx=web6dot0`);
      }
      if (!data || (!data.title && !data.name)) {
        data = await fetchJson(`https://www.jiosaavn.com/api.php?__call=content.getAlbumDetails&albumid=${albumId}&_format=json&ctx=web6dot0`);
      }

      if (!data || (!data.title && !data.name)) return null;

      const formatImage = (img: string) => img ? img.replace("150x150", "500x500").replace("50x50", "500x500") : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500";
      
      const songs = (data.songs || data.list || []).map((item: any) => ({
        id: item.id,
        title: this.cleanHtmlEntities(item.title || item.song),
        artist: this.cleanHtmlEntities(item.primary_artists || item.more_info?.primary_artists || "Unknown"),
        album: this.cleanHtmlEntities(data.title || data.name || item.album || ""),
        thumbnail: formatImage(item.image),
        streamUrl: this.decryptMediaUrl(item.encrypted_media_url || item.more_info?.encrypted_media_url) || item.vlink || item.more_info?.vlink || "",
        duration: parseInt(item.duration || item.more_info?.duration || "0", 10),
        durationFormatted: this.formatDuration(item.duration || item.more_info?.duration),
        source: "MJ PULSE Cloud",
      }));
      
      return {
        id: data.albumid || data.id || albumId,
        title: this.cleanHtmlEntities(data.title || data.name),
        image: formatImage(data.image),
        artist: this.cleanHtmlEntities(data.primary_artists || data.more_info?.music || "Unknown"),
        year: data.year,
        songCount: data.songs?.length || data.list?.length || 0,
        songs: songs,
      };
    } catch (e) {
      console.error("[SaavnService] getAlbumDetails error:", e);
      return null;
    }
  }

  async getPlaylistDetails(playlistId: string) {
    if (!playlistId) return null;
    try {
      const fetchJson = async (url: string) => {
        try {
          const res = await fetch(url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            }
          });
          if (!res.ok) return null;
          return await res.json();
        } catch {
          return null;
        }
      };

      let data: any = null;
      if (/^\d+$/.test(playlistId)) {
        data = await fetchJson(`https://www.jiosaavn.com/api.php?__call=playlist.getDetails&listid=${playlistId}&_format=json&ctx=web6dot0`);
      }
      if (!data || (!data.title && !data.listname)) {
        data = await fetchJson(`https://www.jiosaavn.com/api.php?__call=webapi.get&token=${playlistId}&type=playlist&_format=json&ctx=web6dot0`);
      }
      if (!data || (!data.title && !data.listname)) {
        data = await fetchJson(`https://www.jiosaavn.com/api.php?__call=playlist.getDetails&listid=${playlistId}&_format=json&ctx=web6dot0`);
      }

      if (!data || (!data.title && !data.listname)) return null;

      const formatImage = (img: string) => img ? img.replace("150x150", "500x500").replace("50x50", "500x500") : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500";
      
      const songs = (data.songs || data.list || []).map((item: any) => ({
        id: item.id,
        title: this.cleanHtmlEntities(item.title || item.song),
        artist: this.cleanHtmlEntities(item.primary_artists || item.more_info?.primary_artists || "Unknown"),
        album: this.cleanHtmlEntities(item.album || item.more_info?.album || ""),
        thumbnail: formatImage(item.image),
        streamUrl: this.decryptMediaUrl(item.encrypted_media_url || item.more_info?.encrypted_media_url) || item.vlink || item.more_info?.vlink || "",
        duration: parseInt(item.duration || item.more_info?.duration || "0", 10),
        durationFormatted: this.formatDuration(item.duration || item.more_info?.duration),
        source: "MJ PULSE Cloud",
      }));
      
      return {
        id: data.id || data.listid || playlistId,
        title: this.cleanHtmlEntities(data.listname || data.title || "Playlist"),
        image: formatImage(data.image),
        artist: this.cleanHtmlEntities(data.firstname || "Playlist"),
        followerCount: data.follower_count || 0,
        songCount: data.list_count || data.songs?.length || 0,
        songs: songs,
      };
    } catch (e) {
      console.error("[SaavnService] getPlaylistDetails error:", e);
      return null;
    }
  }

  async getSongDetails(songId: string): Promise<Track | null> {
    if (!songId || !songId.trim()) return null;
    try {
      const cleanId = songId.trim();
      const url = `https://www.jiosaavn.com/api.php?__call=song.getDetails&pids=${encodeURIComponent(
        cleanId
      )}&_format=json&ctx=web6dot0`;
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
        next: { revalidate: 3600 },
      });
      if (!res.ok) return null;
      const data = await res.json();
      const song = data.songs?.[0] || data[cleanId];
      if (!song) return null;

      const encCandidate =
        song.encrypted_media_url ||
        song.more_info?.encrypted_media_url ||
        song.encrypted_drm_media_url ||
        song.more_info?.encrypted_drm_media_url;

      const streamUrl =
        this.decryptMediaUrl(encCandidate) ||
        song.vlink ||
        song.more_info?.vlink ||
        song.media_preview_url ||
        song.more_info?.media_preview_url ||
        "";

      if (!streamUrl) return null;

      const primaryArtists =
        song.primary_artists ||
        song.more_info?.artistMap?.primary_artists?.map((a: any) => a.name).join(", ") ||
        song.singers ||
        song.more_info?.music ||
        song.subtitle ||
        "Unknown Artist";

      const durationSec = parseInt(song.duration || song.more_info?.duration || "0", 10);
      const image = (song.image || "").replace("150x150", "500x500").replace("50x50", "500x500");
      const title = this.cleanHtmlEntities(song.song || song.title || "Untitled");

      return {
        id: song.id || cleanId,
        title,
        artist: this.cleanHtmlEntities(primaryArtists),
        album: this.cleanHtmlEntities(song.album || song.more_info?.album || ""),
        thumbnail: this.formatFallbackImage(image, title),
        streamUrl,
        duration: durationSec > 0 ? durationSec : undefined,
        durationFormatted: this.formatDuration(song.duration || song.more_info?.duration),
        source: "MJ PULSE Cloud",
      };
    } catch (err) {
      console.error("[SaavnService] getSongDetails error:", err);
      return null;
    }
  }

  async getSongRecommendations(
    songId?: string,
    limit: number = 20,
    title?: string,
    artist?: string
  ): Promise<Track[]> {
    let cleanPid = songId?.trim() || "";
    // If cleanPid is synthetic or custom, treat as unverified
    if (
      cleanPid.startsWith("special-") ||
      cleanPid.startsWith("yt-") ||
      cleanPid.startsWith("fav-") ||
      cleanPid.startsWith("trending-") ||
      cleanPid.length < 3
    ) {
      cleanPid = "";
    }

    const fetchRecoByPid = async (pid: string): Promise<any[]> => {
      try {
        const url = `https://www.jiosaavn.com/api.php?__call=reco.getreco&_format=json&_marker=0&api_version=4&ctx=android&pid=${encodeURIComponent(
          pid.trim()
        )}`;
        const res = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          },
          next: { revalidate: 3600 },
        });
        if (res.ok) {
          const data = await res.json();
          const results = Array.isArray(data) ? data : data.results || [];
          if (Array.isArray(results) && results.length > 0) {
            return results;
          }
        }
      } catch (err) {
        console.warn("[SaavnService] fetchRecoByPid error:", err);
      }
      return [];
    };

    let rawResults: any[] = [];
    if (cleanPid) {
      rawResults = await fetchRecoByPid(cleanPid);
    }

    // If reco failed or cleanPid was missing, resolve real JioSaavn PID via autocomplete or search query
    if (rawResults.length === 0 && title && title.trim()) {
      try {
        const query = `${title.trim()} ${artist ? artist.trim() : ""}`.trim();
        const acUrl = `https://www.jiosaavn.com/api.php?__call=autocomplete.get&_format=json&_marker=0&api_version=4&ctx=android&query=${encodeURIComponent(
          query
        )}`;
        const acRes = await fetch(acUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          },
        });
        if (acRes.ok) {
          const acData = await acRes.json();
          const songObj = acData.songs?.data?.[0];
          if (songObj?.id) {
            cleanPid = songObj.id;
            rawResults = await fetchRecoByPid(cleanPid);
          }
        }
      } catch (e) {
        console.warn("[SaavnService] PID resolution error:", e);
      }
    }

    if (rawResults.length > 0) {
      return rawResults.slice(0, limit).map((item: any) => {
        const image = (item.image || "")
          .replace("150x150", "500x500")
          .replace("50x50", "500x500");

        const primaryArtists = item.more_info?.artistMap?.primary_artists
          ?.map((a: any) => a.name)
          .join(", ");

        const resolvedArtist =
          primaryArtists ||
          this.cleanHtmlEntities(item.more_info?.music || item.subtitle || "Unknown Artist");

        const durationSec = parseInt(item.more_info?.duration || item.duration || "0", 10);
        const encCandidate =
          item.more_info?.encrypted_media_url ||
          item.encrypted_media_url ||
          item.more_info?.encrypted_drm_media_url;

        let streamUrl = this.decryptMediaUrl(encCandidate);
        if (!streamUrl) {
          streamUrl =
            item.more_info?.vlink ||
            item.vlink ||
            item.more_info?.media_preview_url ||
            item.media_preview_url ||
            item.more_info?.preview_url ||
            item.preview_url ||
            "";
        }

        return {
          id: item.id || `saavn-${Math.random().toString(36).substring(2, 8)}`,
          title: this.cleanHtmlEntities(item.title || item.song || "Untitled"),
          artist: resolvedArtist,
          album: this.cleanHtmlEntities(item.more_info?.album || item.album || ""),
          thumbnail: this.formatFallbackImage(image, item.title || item.song || "Untitled"),
          streamUrl,
          duration: durationSec > 0 ? durationSec : undefined,
          durationFormatted: this.formatDuration(item.more_info?.duration || item.duration),
          source: "MJ PULSE Cloud",
        };
      });
    }

    return [];
  }
}

export const saavnService = new SaavnService();
