package com.example.ui.screens

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Loop
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Song
import com.example.data.repository.MusicRepository
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
fun DjModeScreen(
    currentSong: Song?,
    isPlaying: Boolean,
    onTogglePlayPause: () -> Unit,
    onCrossfaderChanged: (Float) -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    val songs = remember { MusicRepository.sampleSongs }
    var deckASong by remember { mutableStateOf(currentSong ?: songs[0]) }
    var deckBSong by remember { mutableStateOf(songs.getOrNull(1) ?: songs[0]) }
    var isDeckBPlaying by remember { mutableStateOf(false) }

    var crossfaderPos by remember { mutableFloatStateOf(0.5f) }
    var deckAFilter by remember { mutableFloatStateOf(0.5f) }
    var deckBFilter by remember { mutableFloatStateOf(0.5f) }

    var isSynced by remember { mutableStateOf(true) }

    val infiniteTransition = rememberInfiniteTransition(label = "dj")
    val deckARotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(animation = tween(4000, easing = LinearEasing), repeatMode = RepeatMode.Restart),
        label = "spinA"
    )
    val deckBRotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(animation = tween(4000, easing = LinearEasing), repeatMode = RepeatMode.Restart),
        label = "spinB"
    )

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(PulseBackground)
            .verticalScroll(rememberScrollState())
            .padding(20.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(NeonCyan.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Tune,
                            contentDescription = null,
                            tint = NeonCyan,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                    Column {
                        Text(
                            text = "MJ PULSE DJ STUDIO",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Black,
                            color = NeonCyan,
                            letterSpacing = 1.sp
                        )
                        Text(
                            text = "Dual-Deck Synchronized Mix Console",
                            fontSize = 11.sp,
                            color = TextSecondary
                        )
                    }
                }

                IconButton(
                    onClick = onClose,
                    modifier = Modifier.testTag("close_dj_mode_btn")
                ) {
                    Icon(Icons.Default.Close, contentDescription = "Close DJ Deck", tint = TextPrimary)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Sync BPM Master Button
            GlassCard(
                shape = RoundedCornerShape(14.dp),
                borderColor = if (isSynced) NeonGreen else Color(0x33FFFFFF),
                glowColor = if (isSynced) NeonGreen else null,
                onClick = { isSynced = !isSynced },
                modifier = Modifier.testTag("dj_sync_bpm_btn")
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Sync,
                        contentDescription = null,
                        tint = if (isSynced) NeonGreen else TextMuted,
                        modifier = Modifier.size(18.dp)
                    )
                    Text(
                        text = if (isSynced) "BPM SYNC LOCKED: ${deckASong.bpm} BPM" else "BPM SYNC: MANUAL",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isSynced) NeonGreen else TextSecondary
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Dual Decks Display (Deck A and Deck B side by side)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Deck A
                GlassCard(
                    modifier = Modifier
                        .weight(1f)
                        .testTag("dj_deck_a"),
                    borderColor = NeonCyan.copy(alpha = 0.6f),
                    glowColor = NeonCyan
                ) {
                    Column(
                        modifier = Modifier.padding(12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        NeonBadge(text = "DECK A", color = NeonCyan)
                        Spacer(modifier = Modifier.height(8.dp))

                        // Vinyl turntable platter
                        Box(
                            modifier = Modifier
                                .size(110.dp)
                                .rotate(if (isPlaying) deckARotation else 0f)
                                .clip(CircleShape)
                                .background(Color(0xFF101322))
                                .border(BorderStroke(2.dp, NeonCyan))
                                .padding(8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(NeonCyan.copy(alpha = 0.3f))
                                    .border(BorderStroke(1.dp, Color.White))
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = deckASong.title,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary,
                            maxLines = 1
                        )
                        Text(
                            text = "${deckASong.bpm} BPM",
                            fontSize = 11.sp,
                            color = NeonCyan
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        // Deck A Play / Cue
                        Box(
                            modifier = Modifier
                                .size(42.dp)
                                .clip(CircleShape)
                                .background(NeonCyan.copy(alpha = 0.25f))
                                .clickable { onTogglePlayPause() },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                                contentDescription = "Play A",
                                tint = NeonCyan
                            )
                        }

                        Spacer(modifier = Modifier.height(6.dp))
                        Text("HP/LP Filter", fontSize = 10.sp, color = TextMuted)
                        Slider(
                            value = deckAFilter,
                            onValueChange = { deckAFilter = it },
                            colors = SliderDefaults.colors(thumbColor = NeonCyan, activeTrackColor = NeonCyan),
                            modifier = Modifier.height(24.dp)
                        )
                    }
                }

                // Deck B
                GlassCard(
                    modifier = Modifier
                        .weight(1f)
                        .testTag("dj_deck_b"),
                    borderColor = NeonPink.copy(alpha = 0.6f),
                    glowColor = NeonPink
                ) {
                    Column(
                        modifier = Modifier.padding(12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        NeonBadge(text = "DECK B", color = NeonPink)
                        Spacer(modifier = Modifier.height(8.dp))

                        // Vinyl turntable platter
                        Box(
                            modifier = Modifier
                                .size(110.dp)
                                .rotate(if (isDeckBPlaying) deckBRotation else 0f)
                                .clip(CircleShape)
                                .background(Color(0xFF101322))
                                .border(BorderStroke(2.dp, NeonPink))
                                .padding(8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(NeonPink.copy(alpha = 0.3f))
                                    .border(BorderStroke(1.dp, Color.White))
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = deckBSong.title,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary,
                            maxLines = 1
                        )
                        Text(
                            text = if (isSynced) "${deckASong.bpm} BPM (SYNC)" else "${deckBSong.bpm} BPM",
                            fontSize = 11.sp,
                            color = NeonPink
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        // Deck B Play / Cue
                        Box(
                            modifier = Modifier
                                .size(42.dp)
                                .clip(CircleShape)
                                .background(NeonPink.copy(alpha = 0.25f))
                                .clickable { isDeckBPlaying = !isDeckBPlaying },
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (isDeckBPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                                contentDescription = "Play B",
                                tint = NeonPink
                            )
                        }

                        Spacer(modifier = Modifier.height(6.dp))
                        Text("HP/LP Filter", fontSize = 10.sp, color = TextMuted)
                        Slider(
                            value = deckBFilter,
                            onValueChange = { deckBFilter = it },
                            colors = SliderDefaults.colors(thumbColor = NeonPink, activeTrackColor = NeonPink),
                            modifier = Modifier.height(24.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Crossfader Console Section
            GlassCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("dj_crossfader_console"),
                borderColor = Color(0x33FFFFFF)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("DECK A (${( (1f - crossfaderPos) * 100 ).toInt()}%)", color = NeonCyan, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        Text("CROSSFADER", color = TextPrimary, fontWeight = FontWeight.Black, fontSize = 13.sp, letterSpacing = 1.sp)
                        Text("DECK B (${(crossfaderPos * 100).toInt()}%)", color = NeonPink, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Slider(
                        value = crossfaderPos,
                        onValueChange = {
                            crossfaderPos = it
                            onCrossfaderChanged(it)
                        },
                        colors = SliderDefaults.colors(
                            thumbColor = Color.White,
                            activeTrackColor = NeonCyan,
                            inactiveTrackColor = NeonPink
                        ),
                        modifier = Modifier.testTag("dj_crossfader_slider")
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("◄ FULL A", fontSize = 10.sp, color = NeonCyan, modifier = Modifier.clickable { crossfaderPos = 0f; onCrossfaderChanged(0f) })
                        Text("CENTER", fontSize = 10.sp, color = TextSecondary, modifier = Modifier.clickable { crossfaderPos = 0.5f; onCrossfaderChanged(0.5f) })
                        Text("FULL B ►", fontSize = 10.sp, color = NeonPink, modifier = Modifier.clickable { crossfaderPos = 1f; onCrossfaderChanged(1f) })
                    }
                }
            }
        }
    }
}
