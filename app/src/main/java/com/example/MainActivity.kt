package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountTree
import androidx.compose.material.icons.filled.ElectricBolt
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.QueueMusic
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.SkipNext
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.audio.AudioPlayerManager
import com.example.data.model.Song
import com.example.data.repository.MusicRepository
import com.example.ui.components.AudioVisualizerBars
import com.example.ui.components.GlassCard
import com.example.ui.screens.ArchitectureHubScreen
import com.example.ui.screens.DjModeScreen
import com.example.ui.screens.HistoryScreen
import com.example.ui.screens.HomeScreen
import com.example.ui.screens.PartyModeScreen
import com.example.ui.screens.PlayerScreen
import com.example.ui.screens.PlaylistScreen
import com.example.ui.screens.SearchScreen
import com.example.ui.theme.MjPulseTheme
import com.example.ui.theme.NeonCyan
import com.example.ui.theme.NeonPink
import com.example.ui.theme.PulseBackground
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary

enum class PulseNavScreen {
    HOME,
    SEARCH,
    PARTY,
    DJ,
    PLAYLIST,
    HISTORY,
    ARCH
}

class MainActivity : ComponentActivity() {

    private lateinit var audioPlayerManager: AudioPlayerManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        audioPlayerManager = AudioPlayerManager(this)

        setContent {
            MjPulseTheme {
                MainApp(audioPlayerManager)
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        audioPlayerManager.release()
    }
}

@Composable
fun MainApp(audioPlayer: AudioPlayerManager) {
    var currentNavScreen by remember { mutableStateOf(PulseNavScreen.HOME) }
    var isPlayerExpanded by remember { mutableStateOf(false) }

    val currentSong by audioPlayer.currentSong.collectAsState()
    val isPlaying by audioPlayer.isPlaying.collectAsState()
    val isBuffering by audioPlayer.isBuffering.collectAsState()
    val currentPosMs by audioPlayer.currentPositionMs.collectAsState()
    val totalDurationMs by audioPlayer.totalDurationMs.collectAsState()
    val beatIntensity by audioPlayer.beatIntensity.collectAsState()
    val isSpatialAudio by audioPlayer.isSpatialAudioEnabled.collectAsState()
    val isHapticSyncEnabled by audioPlayer.hapticSyncEnabled.collectAsState()

    // Handle back button when full player is open
    BackHandler(enabled = isPlayerExpanded) {
        isPlayerExpanded = false
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(PulseBackground)
            .windowInsetsPadding(WindowInsets.statusBars)
    ) {
        // Main Screen Viewport
        Box(modifier = Modifier.fillMaxSize()) {
            when (currentNavScreen) {
                PulseNavScreen.HOME -> {
                    HomeScreen(
                        currentSong = currentSong,
                        isPlaying = isPlaying,
                        beatIntensity = beatIntensity,
                        onSongSelected = { song ->
                            audioPlayer.playSong(song)
                        },
                        onOpenPartyMode = { currentNavScreen = PulseNavScreen.PARTY },
                        onOpenDjMode = { currentNavScreen = PulseNavScreen.DJ },
                        onOpenHistory = { currentNavScreen = PulseNavScreen.PLAYLIST },
                        onOpenPlaylist = { currentNavScreen = PulseNavScreen.PLAYLIST },
                        onOpenPlayer = { isPlayerExpanded = true }
                    )
                }
                PulseNavScreen.SEARCH -> {
                    SearchScreen(
                        onSongSelected = { song ->
                            audioPlayer.playSong(song)
                        }
                    )
                }
                PulseNavScreen.PLAYLIST -> {
                    PlaylistScreen(
                        onSongSelected = { song ->
                            audioPlayer.playSong(song)
                        },
                        onNavigateBack = { currentNavScreen = PulseNavScreen.HOME }
                    )
                }
                PulseNavScreen.HISTORY -> {
                    HistoryScreen(
                        audioPlayer = audioPlayer,
                        onSongSelected = { song ->
                            audioPlayer.playSong(song)
                        },
                        onNavigateDiscover = { currentNavScreen = PulseNavScreen.SEARCH }
                    )
                }
                PulseNavScreen.PARTY -> {
                    DisposableEffect(Unit) {
                        audioPlayer.setPartyMode(true)
                        onDispose {
                            audioPlayer.setPartyMode(false)
                        }
                    }
                    PartyModeScreen(
                        currentSong = currentSong ?: MusicRepository.sampleSongs.first(),
                        isPlaying = isPlaying,
                        beatIntensity = beatIntensity,
                        hapticSyncEnabled = isHapticSyncEnabled,
                        onToggleHapticSync = { enabled ->
                            audioPlayer.setHapticSyncEnabled(enabled)
                        },
                        onTogglePlayPause = {
                            if (currentSong == null) {
                                audioPlayer.playSong(MusicRepository.sampleSongs.first())
                            } else {
                                audioPlayer.togglePlayPause()
                            }
                        },
                        onTriggerHaptic = {
                            audioPlayer.triggerHapticPulse(45, 255, true)
                        },
                        onClose = { currentNavScreen = PulseNavScreen.HOME }
                    )
                }
                PulseNavScreen.DJ -> {
                    DjModeScreen(
                        currentSong = currentSong ?: MusicRepository.sampleSongs.first(),
                        isPlaying = isPlaying,
                        onTogglePlayPause = {
                            if (currentSong == null) {
                                audioPlayer.playSong(MusicRepository.sampleSongs.first())
                            } else {
                                audioPlayer.togglePlayPause()
                            }
                        },
                        onCrossfaderChanged = { crossfade ->
                            audioPlayer.setCrossfader(crossfade)
                        },
                        onClose = { currentNavScreen = PulseNavScreen.HOME }
                    )
                }
                PulseNavScreen.ARCH -> {
                    ArchitectureHubScreen()
                }
            }
        }

        // Persistent Bottom Area: Mini Player + Floating Bottom Nav Bar
        // (Hidden when party mode or dj mode full view is taking over the screen)
        if (currentNavScreen != PulseNavScreen.PARTY && currentNavScreen != PulseNavScreen.DJ) {
            Column(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
                    .windowInsetsPadding(WindowInsets.navigationBars)
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Persistent Glassmorphic Mini Audio Player Bar
                currentSong?.let { song ->
                    PersistentMiniPlayer(
                        song = song,
                        isPlaying = isPlaying,
                        isBuffering = isBuffering,
                        beatIntensity = beatIntensity,
                        onTogglePlayPause = { audioPlayer.togglePlayPause() },
                        onNext = { audioPlayer.playNextRelated() },
                        onExpand = { isPlayerExpanded = true }
                    )
                }

                // Floating Glass Navigation Bar
                FloatingGlassNavBar(
                    currentScreen = currentNavScreen,
                    onScreenSelected = { currentNavScreen = it }
                )
            }
        }

        // Full Screen 3D Glassmorphism Audio Player Overlay
        AnimatedVisibility(
            visible = isPlayerExpanded && currentSong != null,
            enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
            exit = slideOutVertically(targetOffsetY = { it }) + fadeOut(),
            modifier = Modifier.fillMaxSize()
        ) {
            currentSong?.let { song ->
                PlayerScreen(
                    song = song,
                    isPlaying = isPlaying,
                    isBuffering = isBuffering,
                    currentPositionMs = currentPosMs,
                    totalDurationMs = totalDurationMs,
                    beatIntensity = beatIntensity,
                    isSpatialAudio = isSpatialAudio,
                    onTogglePlayPause = { audioPlayer.togglePlayPause() },
                    onSeekTo = { pos -> audioPlayer.seekTo(pos) },
                    onSkipNext = {
                        audioPlayer.playNextRelated()
                    },
                    onSkipPrevious = {
                        audioPlayer.playPreviousHistory()
                    },
                    onToggleSpatialAudio = { audioPlayer.toggleSpatialAudio() },
                    onTogglePartyMode = {
                        isPlayerExpanded = false
                        currentNavScreen = PulseNavScreen.PARTY
                    },
                    onClose = { isPlayerExpanded = false }
                )
            }
        }
    }
}

@Composable
fun PersistentMiniPlayer(
    song: Song,
    isPlaying: Boolean,
    isBuffering: Boolean,
    beatIntensity: Float,
    onTogglePlayPause: () -> Unit,
    onNext: () -> Unit,
    onExpand: () -> Unit
) {
    GlassCard(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("persistent_mini_player"),
        shape = RoundedCornerShape(16.dp),
        borderColor = song.accentColor.copy(alpha = 0.5f),
        glowColor = song.accentColor,
        onClick = onExpand
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Artwork & Song Metadata
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                Box(
                    modifier = Modifier
                        .size(42.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .border(1.dp, song.accentColor.copy(alpha = 0.6f), RoundedCornerShape(8.dp))
                ) {
                    AsyncImage(
                        model = song.coverUrl,
                        contentDescription = song.title,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                }

                Spacer(modifier = Modifier.width(10.dp))

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
                        text = "${song.artist} • ${song.bpm} BPM",
                        fontSize = 11.sp,
                        color = TextSecondary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            Spacer(modifier = Modifier.width(6.dp))

            // Mini visualizer
            AudioVisualizerBars(
                isPlaying = isPlaying,
                beatIntensity = beatIntensity,
                barCount = 6,
                barColor = song.accentColor,
                modifier = Modifier
                    .width(28.dp)
                    .height(20.dp)
            )

            Spacer(modifier = Modifier.width(8.dp))

            // Mini Skip Next (Related Track) button
            Box(
                modifier = Modifier
                    .size(34.dp)
                    .clip(CircleShape)
                    .background(Color(0x22FFFFFF))
                    .clickable(onClick = onNext)
                    .testTag("mini_player_skip_next"),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.SkipNext,
                    contentDescription = "Next Related Song",
                    tint = TextPrimary,
                    modifier = Modifier.size(18.dp)
                )
            }

            Spacer(modifier = Modifier.width(6.dp))

            // Mini Play/Pause button
            Box(
                modifier = Modifier
                    .size(38.dp)
                    .clip(CircleShape)
                    .background(song.accentColor)
                    .clickable(onClick = onTogglePlayPause)
                    .testTag("mini_player_play_pause"),
                contentAlignment = Alignment.Center
            ) {
                if (isBuffering) {
                    CircularProgressIndicator(
                        color = Color.Black,
                        modifier = Modifier.size(18.dp),
                        strokeWidth = 2.dp
                    )
                } else {
                    Icon(
                        imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                        contentDescription = if (isPlaying) "Pause" else "Play",
                        tint = Color(0xFF080911),
                        modifier = Modifier.size(22.dp)
                    )
                }
            }
        }
    }
}

@Composable
fun FloatingGlassNavBar(
    currentScreen: PulseNavScreen,
    onScreenSelected: (PulseNavScreen) -> Unit
) {
    GlassCard(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("floating_glass_nav_bar"),
        shape = RoundedCornerShape(22.dp),
        borderColor = Color(0x3300F2FE),
        backgroundColor = Color(0x990E111F)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 6.dp),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            NavItem(
                icon = Icons.Default.Home,
                label = "Home",
                isSelected = currentScreen == PulseNavScreen.HOME,
                selectedColor = NeonCyan,
                onClick = { onScreenSelected(PulseNavScreen.HOME) },
                tag = "nav_home"
            )
            NavItem(
                icon = Icons.Default.Search,
                label = "Discover",
                isSelected = currentScreen == PulseNavScreen.SEARCH,
                selectedColor = NeonCyan,
                onClick = { onScreenSelected(PulseNavScreen.SEARCH) },
                tag = "nav_search"
            )
            NavItem(
                icon = Icons.Default.QueueMusic,
                label = "Playlists",
                isSelected = currentScreen == PulseNavScreen.PLAYLIST,
                selectedColor = NeonPink,
                onClick = { onScreenSelected(PulseNavScreen.PLAYLIST) },
                tag = "nav_playlists"
            )
            NavItem(
                icon = Icons.Default.ElectricBolt,
                label = "Party",
                isSelected = currentScreen == PulseNavScreen.PARTY,
                selectedColor = NeonPink,
                onClick = { onScreenSelected(PulseNavScreen.PARTY) },
                tag = "nav_party"
            )
            NavItem(
                icon = Icons.Default.Tune,
                label = "DJ Deck",
                isSelected = currentScreen == PulseNavScreen.DJ,
                selectedColor = NeonCyan,
                onClick = { onScreenSelected(PulseNavScreen.DJ) },
                tag = "nav_dj"
            )
        }
    }
}

@Composable
fun NavItem(
    icon: ImageVector,
    label: String,
    isSelected: Boolean,
    selectedColor: Color,
    onClick: () -> Unit,
    tag: String
) {
    Column(
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 10.dp, vertical = 6.dp)
            .testTag(tag),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = if (isSelected) selectedColor else TextMuted,
            modifier = Modifier.size(20.dp)
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = label,
            fontSize = 10.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
            color = if (isSelected) selectedColor else TextMuted
        )
    }
}
