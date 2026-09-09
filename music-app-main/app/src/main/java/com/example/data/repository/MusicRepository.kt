package com.example.data.repository

import androidx.compose.ui.graphics.Color
import com.example.data.model.LyricLine
import com.example.data.model.Song

object MusicRepository {

    val sampleSongs: List<Song> = listOf(
        // --- 1. TUM HI HO ---
        Song(
            id = "pulse-01",
            title = "Tum Hi Ho",
            artist = "Arijit Singh",
            album = "Aashiqui 2 Master",
            durationSec = 262,
            coverUrl = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
            streamUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            genre = "Romantic / Soul",
            bpm = 92,
            accentColor = Color(0xFF00F2FE),
            secondaryColor = Color(0xFF8B5CF6),
            platform = "MJ PULSE Master",
            isHiRes = true,
            codec = "FLAC 24-bit/96kHz • Lossless",
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
            durationSec = 269,
            coverUrl = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
            streamUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
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
            artist = "MJ PULSE Mix",
            album = "Midnight Sessions",
            durationSec = 230,
            coverUrl = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
            streamUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
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
            artist = "Arijit Singh",
            album = "Ae Dil Hai Mushkil",
            durationSec = 261,
            coverUrl = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
            streamUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
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
            artist = "Atif Aslam",
            album = "Soul Strings",
            durationSec = 213,
            coverUrl = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
            streamUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
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
            durationSec = 213,
            coverUrl = "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
            streamUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
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
            coverUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
            streamUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
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
            coverUrl = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
            streamUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
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
}
