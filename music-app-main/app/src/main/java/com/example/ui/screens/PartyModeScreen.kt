package com.example.ui.screens

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ElectricBolt
import androidx.compose.material.icons.filled.FlashOn
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Vibration
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Song
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
fun PartyModeScreen(
    currentSong: Song?,
    isPlaying: Boolean,
    beatIntensity: Float,
    hapticSyncEnabled: Boolean = true,
    onToggleHapticSync: (Boolean) -> Unit = {},
    onTogglePlayPause: () -> Unit,
    onTriggerHaptic: () -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    var strobeFlashEnabled by remember { mutableStateOf(false) }

    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseRing by infiniteTransition.animateFloat(
        initialValue = 0.8f,
        targetValue = 1.35f,
        animationSpec = infiniteRepeatable(
            animation = tween(600, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "ring"
    )

    val activeColor = currentSong?.accentColor ?: NeonPink
    val bpm = currentSong?.bpm ?: 128

    // Screen-level strobe flash simulation
    val strobeAlpha = if (strobeFlashEnabled && isPlaying && beatIntensity > 0.85f) 0.35f else 0f

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(PulseBackground)
    ) {
        // Strobe overlay
        if (strobeAlpha > 0f) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.White.copy(alpha = strobeAlpha))
            )
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
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
                            .background(NeonPink.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.ElectricBolt,
                            contentDescription = null,
                            tint = NeonPink,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                    Column {
                        Text(
                            text = "PARTY MODE ACTIVE",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Black,
                            color = NeonPink,
                            letterSpacing = 1.sp
                        )
                        Text(
                            text = "Beat-Synced Haptic & Visual Matrix",
                            fontSize = 11.sp,
                            color = TextSecondary
                        )
                    }
                }

                IconButton(
                    onClick = onClose,
                    modifier = Modifier.testTag("close_party_mode_btn")
                ) {
                    Icon(Icons.Default.Close, contentDescription = "Exit Party Mode", tint = TextPrimary)
                }
            }

            // Central Animated Pulsing Visualizer Core
            Box(
                modifier = Modifier
                    .size(280.dp)
                    .clickable {
                        onTriggerHaptic()
                    }
                    .testTag("party_mode_pulse_core"),
                contentAlignment = Alignment.Center
            ) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    val center = Offset(size.width / 2f, size.height / 2f)
                    val baseRadius = size.width / 3f

                    // Ring 1 - Dynamic Shockwave
                    drawCircle(
                        color = activeColor.copy(alpha = (0.12f + 0.38f * beatIntensity).coerceIn(0f, 1f)),
                        radius = baseRadius * (1f + 0.35f * beatIntensity) * pulseRing,
                        center = center
                    )

                    // Ring 2 - Beat punch outline
                    drawCircle(
                        color = NeonCyan.copy(alpha = (0.25f + 0.45f * beatIntensity).coerceIn(0f, 1f)),
                        radius = baseRadius * (0.92f + 0.22f * beatIntensity),
                        center = center,
                        style = Stroke(width = (2.5f + 4f * beatIntensity).dp.toPx())
                    )

                    // Ring 3 - Gradient sweep core ring
                    drawCircle(
                        brush = Brush.sweepGradient(listOf(NeonPink, NeonCyan, NeonGreen, NeonPink)),
                        radius = baseRadius * (0.80f + 0.15f * beatIntensity),
                        center = center,
                        style = Stroke(width = (3.5f + 3f * beatIntensity).dp.toPx())
                    )
                }

                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "$bpm",
                        fontSize = 48.sp,
                        fontWeight = FontWeight.Black,
                        color = TextPrimary
                    )
                    Text(
                        text = "BPM SYNCED",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = NeonCyan,
                        letterSpacing = 2.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    NeonBadge(text = if (isPlaying) "BEAT LOCKED" else "PAUSED", color = if (isPlaying) NeonGreen else NeonPink)
                }
            }

            // Real-time Audio Visualizer Spectrum
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = currentSong?.title ?: "Select a song to pulse",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Text(
                    text = currentSong?.artist ?: "MJ PULSE Sound Engine",
                    fontSize = 13.sp,
                    color = TextSecondary
                )

                Spacer(modifier = Modifier.height(16.dp))

                AudioVisualizerBars(
                    isPlaying = isPlaying,
                    beatIntensity = beatIntensity,
                    barCount = 28,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp),
                    barColor = activeColor
                )
            }

            // Controls & Toggle Toggles
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Toggles Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Haptic Beat Sync Toggle
                    GlassCard(
                        modifier = Modifier.weight(1f),
                        borderColor = if (hapticSyncEnabled) NeonPink else Color(0x33FFFFFF)
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Icon(
                                imageVector = Icons.Default.Vibration,
                                contentDescription = null,
                                tint = if (hapticSyncEnabled) NeonPink else TextMuted,
                                modifier = Modifier.size(20.dp)
                            )
                            Text("Haptic Sync", fontSize = 12.sp, color = TextPrimary, fontWeight = FontWeight.Bold)
                            Switch(
                                checked = hapticSyncEnabled,
                                onCheckedChange = {
                                    onToggleHapticSync(it)
                                    if (it) onTriggerHaptic()
                                },
                                colors = SwitchDefaults.colors(
                                    checkedThumbColor = Color.White,
                                    checkedTrackColor = NeonPink
                                ),
                                modifier = Modifier.size(36.dp)
                            )
                        }
                    }

                    // Strobe Flash Toggle
                    GlassCard(
                        modifier = Modifier.weight(1f),
                        borderColor = if (strobeFlashEnabled) NeonCyan else Color(0x33FFFFFF)
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Icon(
                                imageVector = Icons.Default.FlashOn,
                                contentDescription = null,
                                tint = if (strobeFlashEnabled) NeonCyan else TextMuted,
                                modifier = Modifier.size(20.dp)
                            )
                            Text("Strobe FX", fontSize = 12.sp, color = TextPrimary, fontWeight = FontWeight.Bold)
                            Switch(
                                checked = strobeFlashEnabled,
                                onCheckedChange = { strobeFlashEnabled = it },
                                colors = SwitchDefaults.colors(
                                    checkedThumbColor = Color.White,
                                    checkedTrackColor = NeonCyan
                                ),
                                modifier = Modifier.size(36.dp)
                            )
                        }
                    }
                }

                // Play / Pause in Party Mode
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(
                            brush = Brush.horizontalGradient(
                                listOf(NeonPink, NeonCyan)
                            )
                        )
                        .clickable(onClick = onTogglePlayPause)
                        .testTag("party_mode_play_btn"),
                    contentAlignment = Alignment.Center
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(
                            imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                            contentDescription = null,
                            tint = Color(0xFF0A0B14),
                            modifier = Modifier.size(28.dp)
                        )
                        Text(
                            text = if (isPlaying) "PAUSE PARTY" else "PULSE NOW",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFF0A0B14),
                            letterSpacing = 1.sp
                        )
                    }
                }
            }
        }
    }
}
