package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.DeleteOutline
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.QueueMusic
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
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
import com.example.audio.AudioPlayerManager
import com.example.data.model.Song
import com.example.data.repository.HistoryItem
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
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun HistoryScreen(
    audioPlayer: AudioPlayerManager,
    onSongSelected: (Song) -> Unit,
    onNavigateDiscover: () -> Unit,
    modifier: Modifier = Modifier
) {
    val historyItems by audioPlayer.playbackHistoryItems.collectAsState()
    val dynamicQueue by audioPlayer.dynamicQueue.collectAsState()
    val currentSong by audioPlayer.currentSong.collectAsState()
    val isPlaying by audioPlayer.isPlaying.collectAsState()
    val beatIntensity by audioPlayer.beatIntensity.collectAsState()

    var selectedTab by remember { mutableIntStateOf(0) } // 0 = Recently Played, 1 = Smart Recommendations
    var showClearDialog by remember { mutableStateOf(false) }

    if (showClearDialog) {
        AlertDialog(
            onDismissRequest = { showClearDialog = false },
            title = {
                Text(
                    text = "Clear Playback History?",
                    color = TextPrimary,
                    fontWeight = FontWeight.Bold
                )
            },
            text = {
                Text(
                    text = "This will remove all recently played tracks from your device. Smart auto-play recommendations will continue to adapt to new songs.",
                    color = TextSecondary,
                    fontSize = 13.sp
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        audioPlayer.clearHistory()
                        showClearDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = NeonPink)
                ) {
                    Text("Clear All", color = Color.White, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showClearDialog = false }) {
                    Text("Cancel", color = TextMuted)
                }
            },
            containerColor = Color(0xFF13172A),
            shape = RoundedCornerShape(16.dp)
        )
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(PulseBackground),
        contentPadding = PaddingValues(bottom = 120.dp)
    ) {
        // Top Header
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(NeonCyan.copy(alpha = 0.15f))
                                .border(1.dp, NeonCyan.copy(alpha = 0.5f), RoundedCornerShape(12.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.History,
                                contentDescription = "History",
                                tint = NeonCyan,
                                modifier = Modifier.size(24.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "PLAYBACK HISTORY",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Black,
                                color = TextPrimary,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = "Played tracks & related auto-play recommendations",
                                fontSize = 11.sp,
                                color = TextMuted
                            )
                        }
                    }

                    if (historyItems.isNotEmpty()) {
                        IconButton(
                            onClick = { showClearDialog = true },
                            modifier = Modifier.testTag("clear_history_btn")
                        ) {
                            Icon(
                                imageVector = Icons.Default.DeleteOutline,
                                contentDescription = "Clear History",
                                tint = NeonPink.copy(alpha = 0.8f),
                                modifier = Modifier.size(22.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Interactive Tab Selector: History vs Smart Queue
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(Color(0xFF101322))
                        .padding(4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (selectedTab == 0) NeonCyan.copy(alpha = 0.25f) else Color.Transparent)
                            .border(
                                1.dp,
                                if (selectedTab == 0) NeonCyan.copy(alpha = 0.6f) else Color.Transparent,
                                RoundedCornerShape(10.dp)
                            )
                            .clickable { selectedTab = 0 }
                            .padding(vertical = 10.dp)
                            .testTag("tab_recently_played"),
                        contentAlignment = Alignment.Center
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.History,
                                contentDescription = null,
                                tint = if (selectedTab == 0) NeonCyan else TextMuted,
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = "Recently Played (${historyItems.size})",
                                fontSize = 12.sp,
                                fontWeight = if (selectedTab == 0) FontWeight.Bold else FontWeight.Normal,
                                color = if (selectedTab == 0) NeonCyan else TextMuted
                            )
                        }
                    }

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (selectedTab == 1) NeonViolet.copy(alpha = 0.25f) else Color.Transparent)
                            .border(
                                1.dp,
                                if (selectedTab == 1) NeonViolet.copy(alpha = 0.6f) else Color.Transparent,
                                RoundedCornerShape(10.dp)
                            )
                            .clickable { selectedTab = 1 }
                            .padding(vertical = 10.dp)
                            .testTag("tab_smart_queue"),
                        contentAlignment = Alignment.Center
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.AutoAwesome,
                                contentDescription = null,
                                tint = if (selectedTab == 1) NeonViolet else TextMuted,
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = "Smart Queue (${dynamicQueue.size})",
                                fontSize = 12.sp,
                                fontWeight = if (selectedTab == 1) FontWeight.Bold else FontWeight.Normal,
                                color = if (selectedTab == 1) NeonViolet else TextMuted
                            )
                        }
                    }
                }
            }
        }

        // Tab Content
        if (selectedTab == 0) {
            // RECENTLY PLAYED TAB
            if (historyItems.isEmpty()) {
                item {
                    EmptyHistoryPlaceholder(onNavigateDiscover = onNavigateDiscover)
                }
            } else {
                items(historyItems, key = { "${it.song.id}_${it.playedAtMs}" }) { item ->
                    val isCurrentlyPlayingThis = currentSong?.id == item.song.id
                    HistoryTrackRow(
                        historyItem = item,
                        isCurrentSong = isCurrentlyPlayingThis,
                        isPlaying = isPlaying && isCurrentlyPlayingThis,
                        beatIntensity = beatIntensity,
                        onPlay = { onSongSelected(item.song) },
                        onRemove = { audioPlayer.removeHistoryItem(item.song.id) }
                    )
                }
            }
        } else {
            // SMART QUEUE / RELATED RECOMMENDATIONS TAB
            item {
                GlassCard(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 6.dp),
                    shape = RoundedCornerShape(14.dp),
                    borderColor = NeonViolet.copy(alpha = 0.4f),
                    backgroundColor = Color(0x6612102A)
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(NeonViolet.copy(alpha = 0.2f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.AutoAwesome,
                                contentDescription = null,
                                tint = NeonViolet,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Column {
                            Text(
                                text = "AI Dynamic Queue Active",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                            Text(
                                text = "When the current song ends, the next related song plays automatically without random hops.",
                                fontSize = 11.sp,
                                color = TextSecondary,
                                lineHeight = 15.sp
                            )
                        }
                    }
                }
            }

            if (dynamicQueue.isEmpty()) {
                item {
                    EmptyQueuePlaceholder(
                        currentSong = currentSong,
                        onPlaySample = {
                            if (currentSong == null) {
                                onSongSelected(com.example.data.repository.MusicRepository.sampleSongs.first())
                            } else {
                                audioPlayer.playNextRelated()
                            }
                        }
                    )
                }
            } else {
                items(dynamicQueue, key = { it.id }) { queueSong ->
                    QueueTrackRow(
                        song = queueSong,
                        onPlay = { onSongSelected(queueSong) }
                    )
                }
            }
        }
    }
}

@Composable
fun HistoryTrackRow(
    historyItem: HistoryItem,
    isCurrentSong: Boolean,
    isPlaying: Boolean,
    beatIntensity: Float,
    onPlay: () -> Unit,
    onRemove: () -> Unit
) {
    val song = historyItem.song
    val relativeTime = formatRelativeTime(historyItem.playedAtMs)

    GlassCard(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 5.dp)
            .testTag("history_row_${song.id}"),
        shape = RoundedCornerShape(16.dp),
        borderColor = if (isCurrentSong) song.accentColor.copy(alpha = 0.7f) else Color(0x22FFFFFF),
        glowColor = if (isCurrentSong) song.accentColor else Color.Transparent,
        onClick = onPlay
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Cover Artwork + Play status
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                Box(
                    modifier = Modifier
                        .size(52.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .border(
                            1.dp,
                            if (isCurrentSong) song.accentColor else Color(0x33FFFFFF),
                            RoundedCornerShape(12.dp)
                        )
                ) {
                    AsyncImage(
                        model = song.coverUrl,
                        contentDescription = song.title,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )

                    if (isCurrentSong) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(Color.Black.copy(alpha = 0.4f)),
                            contentAlignment = Alignment.Center
                        ) {
                            AudioVisualizerBars(
                                isPlaying = isPlaying,
                                beatIntensity = beatIntensity,
                                barCount = 4,
                                barColor = song.accentColor,
                                modifier = Modifier
                                    .width(24.dp)
                                    .height(16.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.width(12.dp))

                // Song Title, Artist & Played timestamp
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = song.title,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isCurrentSong) song.accentColor else TextPrimary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = song.artist,
                        fontSize = 12.sp,
                        color = TextSecondary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        NeonBadge(
                            text = relativeTime,
                            color = if (isCurrentSong) NeonCyan else Color(0xFF8B5CF6)
                        )
                        Text(
                            text = "• ${song.codec.take(15)}",
                            fontSize = 10.sp,
                            color = TextMuted
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.width(8.dp))

            // Quick Play Button
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(if (isCurrentSong) song.accentColor else Color(0x22151A2E))
                    .clickable(onClick = onPlay),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.PlayArrow,
                    contentDescription = "Play",
                    tint = if (isCurrentSong) Color(0xFF080911) else TextPrimary,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}

@Composable
fun QueueTrackRow(
    song: Song,
    onPlay: () -> Unit
) {
    GlassCard(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 5.dp)
            .testTag("queue_row_${song.id}"),
        shape = RoundedCornerShape(16.dp),
        borderColor = song.accentColor.copy(alpha = 0.35f),
        onClick = onPlay
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .border(1.dp, song.accentColor.copy(alpha = 0.5f), RoundedCornerShape(10.dp))
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
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = "${song.artist} • ${song.genre}",
                        fontSize = 11.sp,
                        color = TextSecondary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "Auto-Play Match • ${song.bpm} BPM",
                        fontSize = 10.sp,
                        color = song.accentColor
                    )
                }
            }

            Box(
                modifier = Modifier
                    .size(34.dp)
                    .clip(CircleShape)
                    .background(Color(0x22151A2E))
                    .clickable(onClick = onPlay),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.PlayArrow,
                    contentDescription = "Play Now",
                    tint = TextPrimary,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}

@Composable
fun EmptyHistoryPlaceholder(onNavigateDiscover: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(40.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(80.dp)
                .clip(CircleShape)
                .background(Color(0xFF14182E))
                .border(1.5.dp, NeonCyan.copy(alpha = 0.4f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.History,
                contentDescription = null,
                tint = NeonCyan,
                modifier = Modifier.size(38.dp)
            )
        }

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "No Playback History Yet",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = TextPrimary
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Songs you listen to will automatically be recorded here so you can replay them anytime.",
            fontSize = 12.sp,
            color = TextSecondary,
            lineHeight = 18.sp,
            textAlign = androidx.compose.ui.text.style.TextAlign.Center
        )

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = onNavigateDiscover,
            colors = ButtonDefaults.buttonColors(containerColor = NeonCyan),
            shape = RoundedCornerShape(12.dp)
        ) {
            Text("Discover Music", color = Color(0xFF080911), fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun EmptyQueuePlaceholder(
    currentSong: Song?,
    onPlaySample: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(40.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(72.dp)
                .clip(CircleShape)
                .background(Color(0xFF14182E))
                .border(1.5.dp, NeonViolet.copy(alpha = 0.4f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.QueueMusic,
                contentDescription = null,
                tint = NeonViolet,
                modifier = Modifier.size(34.dp)
            )
        }

        Spacer(modifier = Modifier.height(18.dp))

        Text(
            text = if (currentSong != null) "Curating Next Vibe..." else "Queue is Standby",
            fontSize = 17.sp,
            fontWeight = FontWeight.Bold,
            color = TextPrimary
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = if (currentSong != null)
                "Analyzing '${currentSong.title}' to queue matching songs..."
            else
                "Play any song and the smart AI will automatically generate a dynamic playlist of matching tracks.",
            fontSize = 12.sp,
            color = TextSecondary,
            lineHeight = 18.sp,
            textAlign = androidx.compose.ui.text.style.TextAlign.Center
        )

        Spacer(modifier = Modifier.height(20.dp))

        Button(
            onClick = onPlaySample,
            colors = ButtonDefaults.buttonColors(containerColor = NeonViolet),
            shape = RoundedCornerShape(12.dp)
        ) {
            Text(if (currentSong != null) "Advance Track" else "Start Auto-Play", color = Color.White, fontWeight = FontWeight.Bold)
        }
    }
}

fun formatRelativeTime(playedAtMs: Long): String {
    val diff = System.currentTimeMillis() - playedAtMs
    val seconds = diff / 1000
    val minutes = seconds / 60
    val hours = minutes / 60
    val days = hours / 24

    return when {
        seconds < 45 -> "Just now"
        minutes < 60 -> "${minutes}m ago"
        hours < 24 -> "${hours}h ago"
        days == 1L -> "Yesterday"
        days < 7 -> "${days}d ago"
        else -> SimpleDateFormat("MMM d", Locale.getDefault()).format(Date(playedAtMs))
    }
}
