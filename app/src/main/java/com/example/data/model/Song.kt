package com.example.data.model

import androidx.compose.ui.graphics.Color

data class Song(
    val id: String,
    val title: String,
    val artist: String,
    val album: String,
    val durationSec: Int,
    val coverUrl: String,
    val streamUrl: String,
    val genre: String,
    val bpm: Int,
    val accentColor: Color,
    val secondaryColor: Color,
    val platform: String = "MJ PULSE Master",
    val isHiRes: Boolean = true,
    val codec: String = "FLAC 24-bit/96kHz",
    val lyrics: List<LyricLine> = emptyList()
)

data class LyricLine(
    val timeSec: Int,
    val text: String
)

data class DjDeckState(
    val currentSong: Song?,
    val isPlaying: Boolean = false,
    val playbackProgress: Float = 0f,
    val bpmOffset: Float = 0f,
    val volume: Float = 1f,
    val filterFreq: Float = 0.5f // 0.0 = low pass, 1.0 = high pass
)
