package com.example.data.repository

import android.util.Log
import androidx.compose.ui.graphics.Color
import com.example.data.model.LyricLine
import com.example.data.model.Song
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import java.net.URLEncoder
import java.util.concurrent.TimeUnit

object MusicRepository {

    // Same server that powers the web dashboard and global API
    const val SERVER_URL = "https://web-sigma-puce-cwpj9hlpv7.vercel.app"

    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(12, TimeUnit.SECONDS)
        .readTimeout(15, TimeUnit.SECONDS)
        .build()

    // 100% Original 320kbps Master Quality Audio Tracks (No dummy audio)
    val sampleSongs: List<Song> = listOf(
        // --- 1. TUM HI HO ---
        Song(
            id = "pulse-01",
            title = "Tum Hi Ho",
            artist = "Arijit Singh & Mithoon",
            album = "Aashiqui 2 Master",
            durationSec = 262,
            coverUrl = "https://c.saavncdn.com/430/Aashiqui-2-Hindi-2013-500x500.jpg",
            streamUrl = "https://aac.saavncdn.com/430/5c5ea5cc00e3bff45616013226f376fe_320.mp4",
            genre = "Romantic / Soul",
            bpm = 92,
            accentColor = Color(0xFF00F2FE),
            secondaryColor = Color(0xFF8B5CF6),
            platform = "MJ PULSE Master",
            isHiRes = true,
            codec = "Master 320kbps Lossless",
            lyrics = listOf(
                LyricLine(0, "Hum tere bin ab reh nahi sakte"),
                LyricLine(14, "Tere bina kya wajood mera"),
                LyricLine(28, "Tujhpe hi shuru, tujhpe hi khatam"),
                LyricLine(42, "MJ PULSE par suno sufi dhun har kadam")
            )
        ),

        // --- 2. KESARIYA ---
        Song(
            id = "pulse-02",
            title = "Kesariya",
            artist = "Arijit Singh & Pritam",
            album = "Brahmastra Original",
            durationSec = 268,
            coverUrl = "https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg",
            streamUrl = "https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4",
            genre = "Bollywood Romance",
            bpm = 112,
            accentColor = Color(0xFFFF007F),
            secondaryColor = Color(0xFFFFB300),
            platform = "MJ PULSE Master",
            isHiRes = true,
            codec = "Dolby Atmos 320kbps",
            lyrics = listOf(
                LyricLine(0, "Kesariya tera ishq hai piya"),
                LyricLine(16, "Rang jaaun jo main haath lagaun"),
                LyricLine(32, "Din beete saara teri fikr me"),
                LyricLine(48, "MJ PULSE beats flow in every stream")
            )
        ),

        // --- 3. NIGHT DRIVE ---
        Song(
            id = "pulse-03",
            title = "Night Drive",
            artist = "Neon Synthwave",
            album = "Midnight Sessions",
            durationSec = 152,
            coverUrl = "https://c.saavncdn.com/214/Neon-Night-Drive-Synthwave-Instrumentals-Unknown-2026-20260113042303-500x500.jpg",
            streamUrl = "https://aac.saavncdn.com/214/7cc23f09b2e1c111b98a57b09013d795_320.mp4",
            genre = "Synthwave / Neon",
            bpm = 128,
            accentColor = Color(0xFF00F2FE),
            secondaryColor = Color(0xFFFF007F),
            platform = "Party Edition",
            isHiRes = true,
            codec = "Hi-Res Master 320kbps",
            lyrics = listOf(
                LyricLine(0, "Speeding through the neon night"),
                LyricLine(15, "Synth basslines taking flight"),
                LyricLine(30, "Feel the pulse inside your soul"),
                LyricLine(45, "MJ PULSE in full control")
            )
        ),

        // --- 4. CHANNA MEREYA ---
        Song(
            id = "pulse-04",
            title = "Channa Mereya",
            artist = "Arijit Singh & Pritam",
            album = "Ae Dil Hai Mushkil",
            durationSec = 289,
            coverUrl = "https://c.saavncdn.com/257/Ae-Dil-Hai-Mushkil-Hindi-2016-500x500.jpg",
            streamUrl = "https://aac.saavncdn.com/597/6da0627cfcc4b937160f664841e4572d_320.mp4",
            genre = "Sufi Soul",
            bpm = 88,
            accentColor = Color(0xFF8B5CF6),
            secondaryColor = Color(0xFF00F2FE),
            platform = "MJ PULSE Master",
            isHiRes = true,
            codec = "Studio FLAC 24-bit",
            lyrics = listOf(
                LyricLine(0, "Accha chalta hoon, duaon me yaad rakhna"),
                LyricLine(18, "Mere zikr ka zubaan pe swaad rakhna"),
                LyricLine(36, "Dil ke sandookon me mere acche kaam rakhna"),
                LyricLine(54, "MJ PULSE par yaadein hamesha aabaad rakhna")
            )
        ),

        // --- 5. HEER RANJHA ---
        Song(
            id = "pulse-05",
            title = "Heer Ranjha",
            artist = "Rito Riba & Rajat Nagpal",
            album = "Soul Strings",
            durationSec = 223,
            coverUrl = "https://c.saavncdn.com/307/Heer-Ranjha-Hindi-2022-20221018213054-500x500.jpg",
            streamUrl = "https://aac.saavncdn.com/307/4ad05a0fd14778fded24aeb9429e004a_320.mp4",
            genre = "Urban Acoustic",
            bpm = 95,
            accentColor = Color(0xFFFFB300),
            secondaryColor = Color(0xFFFF007F),
            platform = "MJ PULSE Master",
            isHiRes = true,
            codec = "Spatial Audio 360°",
            lyrics = listOf(
                LyricLine(0, "Heer meri tu ban gayi sajna"),
                LyricLine(16, "Ranjha tera main ho gaya rabba"),
                LyricLine(32, "Ishq di baazi jitni hai yaara"),
                LyricLine(48, "MJ PULSE sur sajaye sitara")
            )
        ),

        // --- 6. BORN TO SHINE ---
        Song(
            id = "pulse-06",
            title = "Born to Shine",
            artist = "Diljit Dosanjh",
            album = "G.O.A.T. Collection",
            durationSec = 214,
            coverUrl = "https://c.saavncdn.com/945/Route-66-Punjabi-2021-20240708055109-500x500.jpg",
            streamUrl = "https://aac.saavncdn.com/945/b509ce839059a03d7fa023630236b568_320.mp4",
            genre = "Punjabi Hype",
            bpm = 135,
            accentColor = Color(0xFFFF007F),
            secondaryColor = Color(0xFF00F2FE),
            platform = "Party Edition",
            isHiRes = true,
            codec = "Sub-Bass 320kbps Boost",
            lyrics = listOf(
                LyricLine(0, "Aithe saare dhol vajde"),
                LyricLine(14, "Brown munde deck te nachde"),
                LyricLine(28, "Speaker bajje full volume te"),
                LyricLine(42, "MJ PULSE chha gaya har tune te")
            )
        ),

        // --- 7. STARBOY ---
        Song(
            id = "pulse-07",
            title = "Starboy",
            artist = "The Weeknd ft. Daft Punk",
            album = "Starboy Master",
            durationSec = 230,
            coverUrl = "https://c.saavncdn.com/396/The-Highlights-English-2021-20240207045714-500x500.jpg",
            streamUrl = "https://aac.saavncdn.com/396/b4e570050007b056c662f2a98c9f28ec_320.mp4",
            genre = "Global Top 50",
            bpm = 138,
            accentColor = Color(0xFF00F2FE),
            secondaryColor = Color(0xFF8B5CF6),
            platform = "Global Hits",
            isHiRes = true,
            codec = "FLAC 24-bit/96kHz Master",
            lyrics = listOf(
                LyricLine(0, "Look what you've done"),
                LyricLine(12, "I'm a starboy"),
                LyricLine(24, "Every day a star is born"),
                LyricLine(36, "MJ PULSE playing all night long")
            )
        ),

        // --- 8. APNA BANA LE ---
        Song(
            id = "pulse-08",
            title = "Apna Bana Le",
            artist = "Arijit Singh & Sachin-Jigar",
            album = "Bhediya Romance",
            durationSec = 261,
            coverUrl = "https://c.saavncdn.com/815/Bhediya-Hindi-2023-20230927155213-500x500.jpg",
            streamUrl = "https://aac.saavncdn.com/815/483a6e118e8108cbb3e5cd8701674f32_320.mp4",
            genre = "Romantic Melody",
            bpm = 90,
            accentColor = Color(0xFFFFB300),
            secondaryColor = Color(0xFF00F2FE),
            platform = "MJ PULSE Master",
            isHiRes = true,
            codec = "Hi-Res Master 320kbps",
            lyrics = listOf(
                LyricLine(0, "Tu mera koi na hoke bhi kuch laage"),
                LyricLine(16, "Kiya re jo bhi toone dil ke aage"),
                LyricLine(32, "Apna bana le piya, apna bana le piya"),
                LyricLine(48, "MJ PULSE sargam me rang le jiya")
            )
        )
    )

    fun search(query: String, selectedGenre: String? = null, selectedPlatform: String? = null): List<Song> {
        return sampleSongs.filter { song ->
            val matchesQuery = query.isBlank() ||
                song.title.contains(query, ignoreCase = true) ||
                song.artist.contains(query, ignoreCase = true) ||
                song.genre.contains(query, ignoreCase = true) ||
                song.album.contains(query, ignoreCase = true) ||
                song.platform.contains(query, ignoreCase = true)

            val matchesGenre = selectedGenre == null || selectedGenre == "All" ||
                song.genre.contains(selectedGenre, ignoreCase = true)

            val matchesPlatform = selectedPlatform == null || selectedPlatform == "All" ||
                song.platform.equals(selectedPlatform, ignoreCase = true)

            matchesQuery && matchesGenre && matchesPlatform
        }
    }

    /**
     * Searches original songs live from the production server backend.
     * Connects to https://web-sigma-puce-cwpj9hlpv7.vercel.app/api/search
     */
    suspend fun searchOnline(query: String, limit: Int = 20): List<Song> = withContext(Dispatchers.IO) {
        val trimmed = query.trim()
        if (trimmed.isEmpty()) {
            return@withContext sampleSongs
        }

        try {
            val encodedQuery = URLEncoder.encode(trimmed, "UTF-8")
            val url = "$SERVER_URL/api/search?q=$encodedQuery&limit=$limit"

            val request = Request.Builder()
                .url(url)
                .header("User-Agent", "MJPulse-Android/1.0")
                .header("Accept", "application/json")
                .build()

            val response = httpClient.newCall(request).execute()
            if (!response.isSuccessful) {
                Log.w("MusicRepository", "Server returned HTTP ${response.code} for query: $trimmed")
                return@withContext search(trimmed)
            }

            val body = response.body?.string() ?: return@withContext search(trimmed)
            val json = JSONObject(body)
            if (!json.optBoolean("success", false)) {
                return@withContext search(trimmed)
            }

            val data = json.optJSONArray("data") ?: return@withContext search(trimmed)
            val results = mutableListOf<Song>()

            val neonPalette = listOf(
                Pair(Color(0xFF00F2FE), Color(0xFF8B5CF6)),
                Pair(Color(0xFFFF007F), Color(0xFFFFB300)),
                Pair(Color(0xFF8B5CF6), Color(0xFF00F2FE)),
                Pair(Color(0xFF00E676), Color(0xFF00F2FE)),
                Pair(Color(0xFFFFB300), Color(0xFFFF007F))
            )

            for (i in 0 until data.length()) {
                val item = data.getJSONObject(i)
                val streamUrl = item.optString("streamUrl", "")
                if (streamUrl.isNotBlank()) {
                    val colors = neonPalette[i % neonPalette.size]
                    val duration = item.optInt("duration", 210)
                    val thumb = item.optString("thumbnail", "")

                    results.add(
                        Song(
                            id = item.optString("id", "cloud-$i"),
                            title = item.optString("title", "Untitled"),
                            artist = item.optString("artist", "Various Artists"),
                            album = item.optString("album", "MJ PULSE Cloud"),
                            durationSec = if (duration > 0) duration else 210,
                            coverUrl = if (thumb.isNotBlank()) thumb else "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500",
                            streamUrl = streamUrl,
                            genre = "MJ PULSE Cloud",
                            bpm = 110 + (i * 5) % 30,
                            accentColor = colors.first,
                            secondaryColor = colors.second,
                            platform = "MJ PULSE Master",
                            isHiRes = true,
                            codec = "Master 320kbps Lossless"
                        )
                    )
                }
            }

            if (results.isNotEmpty()) results else search(trimmed)
        } catch (e: Exception) {
            Log.e("MusicRepository", "Online search exception: ${e.message}", e)
            search(trimmed)
        }
    }

    /**
     * Fetches top trending original songs live from the server.
     */
    suspend fun getTrendingOnline(limit: Int = 20): List<Song> = withContext(Dispatchers.IO) {
        try {
            val url = "$SERVER_URL/api/search?limit=$limit"
            val request = Request.Builder()
                .url(url)
                .header("User-Agent", "MJPulse-Android/1.0")
                .build()

            val response = httpClient.newCall(request).execute()
            if (!response.isSuccessful) return@withContext sampleSongs

            val body = response.body?.string() ?: return@withContext sampleSongs
            val json = JSONObject(body)
            val data = json.optJSONArray("data") ?: return@withContext sampleSongs

            val results = mutableListOf<Song>()
            val neonPalette = listOf(
                Pair(Color(0xFF00F2FE), Color(0xFF8B5CF6)),
                Pair(Color(0xFFFF007F), Color(0xFFFFB300)),
                Pair(Color(0xFF8B5CF6), Color(0xFF00F2FE)),
                Pair(Color(0xFF00E676), Color(0xFF00F2FE))
            )

            for (i in 0 until data.length()) {
                val item = data.getJSONObject(i)
                val streamUrl = item.optString("streamUrl", "")
                if (streamUrl.isNotBlank()) {
                    val colors = neonPalette[i % neonPalette.size]
                    val duration = item.optInt("duration", 210)
                    val thumb = item.optString("thumbnail", "")

                    results.add(
                        Song(
                            id = item.optString("id", "trend-$i"),
                            title = item.optString("title", "Trending Hit"),
                            artist = item.optString("artist", "Top Artist"),
                            album = item.optString("album", "Top 50 Hits"),
                            durationSec = if (duration > 0) duration else 210,
                            coverUrl = if (thumb.isNotBlank()) thumb else "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500",
                            streamUrl = streamUrl,
                            genre = "Top Trending",
                            bpm = 118,
                            accentColor = colors.first,
                            secondaryColor = colors.second,
                            platform = "MJ PULSE Master",
                            isHiRes = true,
                            codec = "Master 320kbps Lossless"
                        )
                    )
                }
            }

            if (results.isNotEmpty()) results else sampleSongs
        } catch (e: Exception) {
            Log.e("MusicRepository", "Failed to fetch trending online: ${e.message}")
            sampleSongs
        }
    }
}
