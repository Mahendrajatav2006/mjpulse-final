package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ElectricBolt
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Headphones
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.QueueMusic
import androidx.compose.material.icons.filled.Radio
import androidx.compose.material.icons.filled.SpatialAudio
import androidx.compose.material.icons.filled.SurroundSound
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.model.Song
import com.example.data.repository.HistoryManager
import com.example.data.repository.MusicRepository
import com.example.ui.components.AudioVisualizerBars
import com.example.ui.components.GlassCard
import com.example.ui.components.NeonBadge
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.NeonGreen
import com.example.ui.theme.NeonPink
import com.example.ui.theme.NeonViolet
import com.example.ui.theme.PulseBackground
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary

@Composable
fun HomeScreen(
    currentSong: Song?,
    isPlaying: Boolean,
    beatIntensity: Float,
    onSongSelected: (Song) -> Unit,
    onOpenPartyMode: () -> Unit,
    onOpenDjMode: () -> Unit,
    onOpenHistory: () -> Unit,
    onOpenPlayer: () -> Unit,
    onOpenPlaylist: () -> Unit = onOpenHistory,
    modifier: Modifier = Modifier
) {
    var allSongs by remember { mutableStateOf(MusicRepository.sampleSongs) }
    var selectedPlatform by remember { mutableStateOf("All") }
    var selectedGenre by remember { mutableStateOf("All") }
    val historySongs by HistoryManager.historySongs.collectAsState()

    val platforms = listOf("All", "MJ PULSE Master", "Party Edition", "Global Hits")
    val genres = listOf("All", "Bollywood", "Punjabi", "Pop", "Lo-Fi", "Hip-Hop", "EDM")

    LaunchedEffect(Unit) {
        val trending = MusicRepository.getTrendingOnline(limit = 20)
        if (trending.isNotEmpty()) {
            allSongs = trending
        }
    }

    val displayedSongs = remember(allSongs, selectedPlatform, selectedGenre) {
        val platformFilter = if (selectedPlatform == "All") null else selectedPlatform
        val genreFilter = if (selectedGenre == "All") null else selectedGenre

        val filtered = allSongs.filter { song ->
            val matchesGenre = genreFilter == null || song.genre.contains(genreFilter, ignoreCase = true)
            val matchesPlatform = platformFilter == null || song.platform.equals(platformFilter, ignoreCase = true)
            matchesGenre && matchesPlatform
        }
        if (filtered.isNotEmpty()) filtered else allSongs
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(PulseBackground),
        contentPadding = PaddingValues(bottom = 120.dp)
    ) {
        // Top Brand Header
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "MJ",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Black,
                            color = NeonCyan,
                            letterSpacing = 1.sp
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "PULSE",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = TextPrimary,
                            letterSpacing = 2.sp
                        )
                    }
                    Text(
                        text = "Next-Gen Spatial Audio & Music Hub",
                        fontSize = 11.sp,
                        color = TextMuted,
                        letterSpacing = 0.5.sp
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    // Playlist quick launch (Replaced History with Playlist)
                    GlassCard(
                        shape = RoundedCornerShape(12.dp),
                        borderColor = NeonPink.copy(alpha = 0.5f),
                        glowColor = NeonPink,
                        onClick = onOpenPlaylist,
                        modifier = Modifier.testTag("home_playlist_btn")
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.QueueMusic,
                                contentDescription = "Playlists",
                                tint = NeonPink,
                                modifier = Modifier.size(16.dp)
                            )
                            Text("PLAYLIST", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = NeonPink)
                        }
                    }

                    // Party mode quick launch
                    GlassCard(
                        shape = RoundedCornerShape(12.dp),
                        borderColor = NeonPink.copy(alpha = 0.5f),
                        glowColor = NeonPink,
                        onClick = onOpenPartyMode,
                        modifier = Modifier.testTag("home_party_mode_btn")
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.ElectricBolt,
                                contentDescription = "Party Mode",
                                tint = NeonPink,
                                modifier = Modifier.size(16.dp)
                            )
                            Text("PARTY", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = NeonPink)
                        }
                    }

                    // DJ Deck quick launch
                    GlassCard(
                        shape = RoundedCornerShape(12.dp),
                        borderColor = NeonCyan.copy(alpha = 0.5f),
                        glowColor = NeonCyan,
                        onClick = onOpenDjMode,
                        modifier = Modifier.testTag("home_dj_mode_btn")
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Tune,
                                contentDescription = "DJ Deck",
                                tint = NeonCyan,
                                modifier = Modifier.size(16.dp)
                            )
                            Text("DJ", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = NeonCyan)
                        }
                    }
                }
            }
        }

        // Streaming Platform Selector Tabs (Spotify, JioSaavn, Gaana, YT Music)
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 4.dp)
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                platforms.forEach { platform ->
                    val isSelected = selectedPlatform == platform
                    val badgeColor = when (platform) {
                        "MJ PULSE Master" -> NeonCyan
                        "Party Edition" -> NeonPink
                        "Global Hits" -> Color(0xFF8B5CF6)
                        else -> NeonCyan
                    }

                    GlassCard(
                        shape = RoundedCornerShape(18.dp),
                        borderColor = if (isSelected) badgeColor else Color(0x25FFFFFF),
                        backgroundColor = if (isSelected) badgeColor.copy(alpha = 0.22f) else Color(0x18151A2E),
                        onClick = { selectedPlatform = platform },
                        modifier = Modifier.testTag("platform_tab_$platform")
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .clip(CircleShape)
                                    .background(badgeColor)
                            )
                            Text(
                                text = if (platform == "All") "All Platforms" else platform,
                                color = if (isSelected) badgeColor else TextSecondary,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                            )
                        }
                    }
                }
            }
        }

        // Hero Spotlight Banner
        item {
            val heroSong = allSongs.first()
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 12.dp)
            ) {
                GlassCard(
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("hero_spotlight_card"),
                    borderColor = heroSong.accentColor.copy(alpha = 0.6f),
                    glowColor = heroSong.accentColor
                ) {
                    Box {
                        // Background Art Image with gradient overlay
                        AsyncImage(
                            model = heroSong.coverUrl,
                            contentDescription = null,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(210.dp)
                        )
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(210.dp)
                                .background(
                                    Brush.verticalGradient(
                                        listOf(
                                            Color(0x77080911),
                                            Color(0xF0080911),
                                            Color(0xFF080911)
                                        )
                                    )
                                )
                        )

                        // Hero Content
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(18.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                NeonBadge(text = "SPOTLIGHT HITS", color = heroSong.accentColor)
                                NeonBadge(text = heroSong.platform, color = heroSong.accentColor)
                            }

                            Spacer(modifier = Modifier.height(14.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = heroSong.title,
                                        fontSize = 20.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = TextPrimary
                                    )
                                    Text(
                                        text = "${heroSong.artist} • ${heroSong.genre}",
                                        fontSize = 13.sp,
                                        color = TextSecondary
                                    )
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(
                                        text = "${heroSong.bpm} BPM • Hi-Res Master",
                                        fontSize = 12.sp,
                                        color = heroSong.accentColor,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                }

                                Spacer(modifier = Modifier.width(12.dp))

                                Box(
                                    modifier = Modifier
                                        .size(54.dp)
                                        .clip(CircleShape)
                                        .background(
                                            brush = Brush.linearGradient(
                                                listOf(heroSong.accentColor, NeonCyan)
                                            )
                                        )
                                        .clickable { onSongSelected(heroSong) },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.PlayArrow,
                                        contentDescription = "Play Now",
                                        tint = Color(0xFF0A0B14),
                                        modifier = Modifier.size(30.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(14.dp))

                            // Visualizer bars
                            AudioVisualizerBars(
                                isPlaying = isPlaying && currentSong?.id == heroSong.id,
                                beatIntensity = beatIntensity,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(24.dp),
                                barColor = heroSong.accentColor
                            )
                        }
                    }
                }
            }
        }

        // Genre Filter Chips
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 6.dp)
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                genres.forEach { genre ->
                    val isSelected = selectedGenre == genre
                    GlassCard(
                        shape = RoundedCornerShape(16.dp),
                        borderColor = if (isSelected) NeonCyan else Color(0x33FFFFFF),
                        backgroundColor = if (isSelected) NeonCyan.copy(alpha = 0.2f) else Color(0x18151A2E),
                        onClick = { selectedGenre = genre },
                        modifier = Modifier.testTag("genre_chip_$genre")
                    ) {
                        Text(
                            text = genre,
                            color = if (isSelected) NeonCyan else TextSecondary,
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 7.dp)
                        )
                    }
                }
            }
        }

        // Recently Played Listening Trail (if user has played songs)
        if (historySongs.isNotEmpty()) {
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(start = 20.dp, end = 20.dp, top = 14.dp, bottom = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.History,
                            contentDescription = null,
                            tint = NeonGreen,
                            modifier = Modifier.size(18.dp)
                        )
                        Text(
                            text = "Recently Played",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                    }
                    Text(
                        text = "History (${historySongs.size}) →",
                        fontSize = 12.sp,
                        color = NeonGreen,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .clickable(onClick = onOpenHistory)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }

            item {
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 20.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(historySongs.take(8), key = { it.id }) { song ->
                        GlassCard(
                            modifier = Modifier
                                .width(130.dp)
                                .testTag("recent_mini_card_${song.id}"),
                            shape = RoundedCornerShape(14.dp),
                            borderColor = if (currentSong?.id == song.id) song.accentColor else Color(0x25FFFFFF),
                            glowColor = if (currentSong?.id == song.id) song.accentColor else Color.Transparent,
                            onClick = { onSongSelected(song) }
                        ) {
                            Column(modifier = Modifier.padding(8.dp)) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(100.dp)
                                        .clip(RoundedCornerShape(10.dp))
                                ) {
                                    AsyncImage(
                                        model = song.coverUrl,
                                        contentDescription = song.title,
                                        contentScale = ContentScale.Crop,
                                        modifier = Modifier.fillMaxSize()
                                    )
                                    if (currentSong?.id == song.id) {
                                        Box(
                                            modifier = Modifier
                                                .fillMaxSize()
                                                .background(Color.Black.copy(alpha = 0.45f)),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            AudioVisualizerBars(
                                                isPlaying = isPlaying,
                                                beatIntensity = beatIntensity,
                                                barCount = 4,
                                                barColor = song.accentColor,
                                                modifier = Modifier.size(24.dp, 16.dp)
                                            )
                                        }
                                    }
                                }
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = song.title,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = song.artist,
                                    fontSize = 10.sp,
                                    color = TextMuted,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }
                    }
                }
            }
        }

        // Section Title: Horizontal Featured Carousel
        item {
            Text(
                text = "Trending Master Hits",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary,
                modifier = Modifier.padding(start = 20.dp, end = 20.dp, top = 14.dp, bottom = 10.dp)
            )
        }

        // Horizontal Carousel Cards
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(displayedSongs) { song ->
                    GlassCard(
                        modifier = Modifier
                            .width(170.dp)
                            .testTag("carousel_card_${song.id}"),
                        borderColor = song.accentColor.copy(alpha = 0.4f),
                        glowColor = song.accentColor,
                        onClick = { onSongSelected(song) }
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(130.dp)
                                    .clip(RoundedCornerShape(12.dp))
                            ) {
                                AsyncImage(
                                    model = song.coverUrl,
                                    contentDescription = song.title,
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier.fillMaxSize()
                                )
                                // Platform badge on artwork
                                Box(
                                    modifier = Modifier
                                        .align(Alignment.TopStart)
                                        .padding(6.dp)
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(Color(0xDD080911))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = song.platform,
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = song.accentColor
                                    )
                                }

                                Box(
                                    modifier = Modifier
                                        .align(Alignment.BottomEnd)
                                        .padding(6.dp)
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(Color(0xCC080911))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = "${song.durationSec / 60}:${(song.durationSec % 60).toString().padStart(2, '0')}",
                                        fontSize = 10.sp,
                                        color = TextPrimary
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            Text(
                                text = song.title,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Text(
                                text = song.artist,
                                fontSize = 12.sp,
                                color = TextSecondary,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "${song.bpm} BPM",
                                    fontSize = 11.sp,
                                    color = song.accentColor,
                                    fontWeight = FontWeight.SemiBold
                                )
                                Icon(
                                    imageVector = Icons.Default.SurroundSound,
                                    contentDescription = "Hi-Res",
                                    tint = if (song.isHiRes) NeonGreen else TextMuted,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                }
            }
        }

        // Section Title: All Songs Vertical List (Quick Tap to Play)
        item {
            Spacer(modifier = Modifier.height(20.dp))
            Text(
                text = "Bollywood, Punjabi & Global Hot Picks",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary,
                modifier = Modifier.padding(horizontal = 20.dp, vertical = 6.dp)
            )
        }

        items(displayedSongs) { song ->
            val isCurrentPlaying = currentSong?.id == song.id && isPlaying
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 4.dp)
            ) {
                GlassCard(
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("hot_pick_${song.id}"),
                    borderColor = if (isCurrentPlaying) song.accentColor else Color(0x22FFFFFF),
                    glowColor = if (isCurrentPlaying) song.accentColor else null,
                    onClick = { onSongSelected(song) }
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(RoundedCornerShape(10.dp))
                        ) {
                            AsyncImage(
                                model = song.coverUrl,
                                contentDescription = song.title,
                                contentScale = ContentScale.Crop,
                                modifier = Modifier.fillMaxSize()
                            )
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = song.title,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isCurrentPlaying) song.accentColor else TextPrimary,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Text(
                                text = "${song.artist} • ${song.album}",
                                fontSize = 11.sp,
                                color = TextSecondary,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp),
                                modifier = Modifier.padding(top = 2.dp)
                            ) {
                                NeonBadge(text = song.platform, color = song.accentColor)
                                Text(
                                    text = "• ${song.bpm} BPM",
                                    fontSize = 10.sp,
                                    color = TextMuted
                                )
                            }
                        }

                        IconButton(
                            onClick = { onSongSelected(song) },
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(song.accentColor.copy(alpha = 0.2f))
                        ) {
                            Icon(
                                imageVector = if (isCurrentPlaying) Icons.Default.GraphicEq else Icons.Default.PlayArrow,
                                contentDescription = "Play",
                                tint = song.accentColor,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}
