package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.filled.Subtitles
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ElectricBolt
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.FileDownload
import androidx.compose.material.icons.filled.FileDownloadDone
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Repeat
import androidx.compose.material.icons.filled.Shuffle
import androidx.compose.material.icons.filled.SkipNext
import androidx.compose.material.icons.filled.SkipPrevious
import androidx.compose.material.icons.filled.SpatialAudio
import androidx.compose.material.icons.filled.SurroundSound
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Song
import com.example.ui.components.AudioVisualizerBars
import com.example.ui.components.GlassCard
import com.example.ui.components.NeonBadge
import com.example.ui.components.RotatingVinylArt
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.NeonGreen
import com.example.ui.theme.NeonPink
import com.example.ui.theme.NeonViolet
import com.example.ui.theme.PulseBackground
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary

@Composable
fun PlayerScreen(
    song: Song,
    isPlaying: Boolean,
    isBuffering: Boolean,
    currentPositionMs: Int,
    totalDurationMs: Int,
    beatIntensity: Float,
    isSpatialAudio: Boolean,
    onTogglePlayPause: () -> Unit,
    onSeekTo: (Int) -> Unit,
    onSkipNext: () -> Unit,
    onSkipPrevious: () -> Unit,
    onToggleSpatialAudio: () -> Unit,
    onTogglePartyMode: () -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    var isFavorite by remember { mutableStateOf(false) }
    var isShuffle by remember { mutableStateOf(false) }
    var isRepeat by remember { mutableStateOf(false) }
    var showLyrics by remember { mutableStateOf(true) }

    val currentSeconds = currentPositionMs / 1000
    val totalSeconds = (if (totalDurationMs > 0) totalDurationMs else song.durationSec * 1000) / 1000
    val progressFraction = if (totalSeconds > 0) (currentSeconds.toFloat() / totalSeconds.toFloat()).coerceIn(0f, 1f) else 0f

    // Current lyric line finder
    val currentLyric = remember(currentSeconds, song.lyrics) {
        song.lyrics.lastOrNull { it.timeSec <= currentSeconds }?.text ?: "MJ PULSE • High Fidelity Audio Stream"
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        song.accentColor.copy(alpha = 0.18f),
                        PulseBackground,
                        Color(0xFF07080F)
                    )
                )
            )
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 20.dp, vertical = 20.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Top Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = onClose,
                    modifier = Modifier.testTag("player_back_btn")
                ) {
                    Icon(
                        imageVector = Icons.Default.ExpandMore,
                        contentDescription = "Minimize",
                        tint = TextPrimary,
                        modifier = Modifier.size(32.dp)
                    )
                }

                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "PLAYING FROM PULSE MATRIX",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = NeonCyan,
                        letterSpacing = 1.5.sp
                    )
                    Text(
                        text = song.album,
                        fontSize = 12.sp,
                        color = TextSecondary,
                        fontWeight = FontWeight.Medium
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    var isDownloaded by remember { mutableStateOf(false) }

                    IconButton(
                        onClick = { isDownloaded = !isDownloaded },
                        modifier = Modifier.testTag("player_download_btn")
                    ) {
                        Icon(
                            imageVector = if (isDownloaded) Icons.Default.FileDownloadDone else Icons.Default.FileDownload,
                            contentDescription = if (isDownloaded) "Offline Ready" else "Download Offline",
                            tint = if (isDownloaded) NeonCyan else TextSecondary
                        )
                    }

                    IconButton(
                        onClick = { isFavorite = !isFavorite },
                        modifier = Modifier.testTag("player_fav_btn")
                    ) {
                        Icon(
                            imageVector = if (isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                            contentDescription = "Favorite",
                            tint = if (isFavorite) NeonPink else TextSecondary
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // 3D Rotating Vinyl Artwork with ambient neon glow
            RotatingVinylArt(
                imageUrl = song.coverUrl,
                isPlaying = isPlaying,
                accentColor = song.accentColor,
                modifier = Modifier
                    .size(260.dp)
                    .testTag("rotating_vinyl_artwork")
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Title & Artist Info
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = song.title,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = song.artist,
                            fontSize = 15.sp,
                            color = TextSecondary
                        )
                        NeonBadge(text = song.platform, color = song.accentColor)
                    }
                }

                NeonBadge(text = "${song.bpm} BPM", color = song.accentColor)
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Codec & Hardware Audio Badges
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                GlassCard(
                    modifier = Modifier.weight(1f),
                    borderColor = NeonCyan.copy(alpha = 0.5f)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.SurroundSound,
                            contentDescription = null,
                            tint = NeonCyan,
                            modifier = Modifier.size(16.dp)
                        )
                        Text(
                            text = "320kbps Lossless",
                            fontSize = 11.sp,
                            color = NeonCyan,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }

                GlassCard(
                    modifier = Modifier.weight(1f),
                    borderColor = NeonGreen.copy(alpha = 0.5f)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.ElectricBolt,
                            contentDescription = null,
                            tint = NeonGreen,
                            modifier = Modifier.size(16.dp)
                        )
                        Text(
                            text = song.codec.split("•").firstOrNull()?.trim() ?: "Hi-Res Master",
                            fontSize = 11.sp,
                            color = NeonGreen,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Live Synchronized Lyrics Card
            val activeLyricIndex = remember(currentSeconds, song.lyrics) {
                song.lyrics.indexOfLast { it.timeSec <= currentSeconds }
            }

            GlassCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .animateContentSize(),
                borderColor = if (showLyrics) NeonViolet else Color(0x33FFFFFF),
                glowColor = NeonViolet
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Subtitles,
                                contentDescription = null,
                                tint = NeonViolet,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "SYNCED LYRICS",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = NeonViolet,
                                letterSpacing = 1.sp
                            )
                            if (song.lyrics.isNotEmpty()) {
                                Spacer(modifier = Modifier.width(8.dp))
                                NeonBadge(text = "${song.lyrics.size} LINES", color = NeonGreen)
                            }
                        }

                        Text(
                            text = if (showLyrics) "Minimize ▲" else "Expand Full ▼",
                            fontSize = 11.sp,
                            color = NeonCyan,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.clickable { showLyrics = !showLyrics }
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    if (song.lyrics.isNotEmpty()) {
                        if (showLyrics) {
                            val lyricsListState = rememberLazyListState()

                            LaunchedEffect(activeLyricIndex) {
                                if (activeLyricIndex >= 0) {
                                    lyricsListState.animateScrollToItem(
                                        (activeLyricIndex - 1).coerceAtLeast(0)
                                    )
                                }
                            }

                            LazyColumn(
                                state = lyricsListState,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(190.dp),
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                itemsIndexed(song.lyrics) { index, line ->
                                    val isActive = index == activeLyricIndex
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .clip(RoundedCornerShape(10.dp))
                                            .background(
                                                if (isActive) NeonViolet.copy(alpha = 0.25f)
                                                else Color.Transparent
                                            )
                                            .clickable {
                                                onSeekTo(line.timeSec * 1000)
                                            }
                                            .padding(horizontal = 12.dp, vertical = 7.dp)
                                    ) {
                                        Text(
                                            text = line.text,
                                            fontSize = if (isActive) 16.sp else 13.sp,
                                            fontWeight = if (isActive) FontWeight.ExtraBold else FontWeight.Normal,
                                            color = if (isActive) NeonCyan else TextSecondary.copy(alpha = 0.65f),
                                            lineHeight = 22.sp
                                        )
                                    }
                                }
                            }
                        } else {
                            Text(
                                text = currentLyric,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium,
                                color = TextPrimary,
                                textAlign = TextAlign.Center,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { showLyrics = true }
                            )
                        }
                    } else {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(16.dp),
                                color = NeonViolet,
                                strokeWidth = 2.dp
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = "Syncing master lyrics with audio...",
                                fontSize = 12.sp,
                                color = TextSecondary
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Audio Progress Slider
            Column(modifier = Modifier.fillMaxWidth()) {
                Slider(
                    value = progressFraction,
                    onValueChange = { frac ->
                        val targetMs = (frac * totalSeconds * 1000).toInt()
                        onSeekTo(targetMs)
                    },
                    colors = SliderDefaults.colors(
                        thumbColor = song.accentColor,
                        activeTrackColor = song.accentColor,
                        inactiveTrackColor = Color(0x33FFFFFF)
                    ),
                    modifier = Modifier.testTag("audio_seek_slider")
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "${currentSeconds / 60}:${(currentSeconds % 60).toString().padStart(2, '0')}",
                        fontSize = 12.sp,
                        color = TextSecondary
                    )
                    Text(
                        text = "${totalSeconds / 60}:${(totalSeconds % 60).toString().padStart(2, '0')}",
                        fontSize = 12.sp,
                        color = TextSecondary
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Playback Controls
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = { isShuffle = !isShuffle }) {
                    Icon(
                        imageVector = Icons.Default.Shuffle,
                        contentDescription = "Shuffle",
                        tint = if (isShuffle) NeonPink else TextMuted
                    )
                }

                IconButton(
                    onClick = onSkipPrevious,
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(Color(0x22151A2E))
                ) {
                    Icon(
                        imageVector = Icons.Default.SkipPrevious,
                        contentDescription = "Previous",
                        tint = TextPrimary,
                        modifier = Modifier.size(28.dp)
                    )
                }

                // Main Play/Pause Button with Neon Glow
                Box(
                    modifier = Modifier
                        .size(72.dp)
                        .clip(CircleShape)
                        .background(
                            brush = Brush.linearGradient(
                                listOf(song.accentColor, NeonPink)
                            )
                        )
                        .clickable(onClick = onTogglePlayPause)
                        .testTag("main_play_pause_btn"),
                    contentAlignment = Alignment.Center
                ) {
                    if (isBuffering) {
                        CircularProgressIndicator(
                            color = Color.White,
                            modifier = Modifier.size(32.dp),
                            strokeWidth = 3.dp
                        )
                    } else {
                        Icon(
                            imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                            contentDescription = if (isPlaying) "Pause" else "Play",
                            tint = Color(0xFF080911),
                            modifier = Modifier.size(40.dp)
                        )
                    }
                }

                IconButton(
                    onClick = onSkipNext,
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(Color(0x22151A2E))
                ) {
                    Icon(
                        imageVector = Icons.Default.SkipNext,
                        contentDescription = "Next",
                        tint = TextPrimary,
                        modifier = Modifier.size(28.dp)
                    )
                }

                IconButton(onClick = { isRepeat = !isRepeat }) {
                    Icon(
                        imageVector = Icons.Default.Repeat,
                        contentDescription = "Repeat",
                        tint = if (isRepeat) NeonCyan else TextMuted
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Signature Party Mode Quick Toggle
            GlassCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("player_party_toggle_card"),
                shape = RoundedCornerShape(16.dp),
                borderColor = NeonPink.copy(alpha = 0.6f),
                glowColor = NeonPink,
                onClick = onTogglePartyMode
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(NeonPink.copy(alpha = 0.2f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.ElectricBolt,
                                contentDescription = null,
                                tint = NeonPink,
                                modifier = Modifier.size(22.dp)
                            )
                        }
                        Column {
                            Text(
                                text = "MJ PULSE Party Mode",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Text(
                                text = "Haptic beat punch & strobe visualizer",
                                fontSize = 11.sp,
                                color = TextSecondary
                            )
                        }
                    }

                    NeonBadge(text = "ENGAGE", color = NeonPink)
                }
            }
        }
    }
}
