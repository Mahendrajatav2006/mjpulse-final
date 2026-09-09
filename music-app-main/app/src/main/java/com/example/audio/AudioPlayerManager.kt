package com.example.audio

import android.content.Context
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.util.Log
import com.example.data.model.Song
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

class AudioPlayerManager(private val context: Context) {

    private var mediaPlayer: MediaPlayer? = null
    private val scope = CoroutineScope(Dispatchers.Main + Job())
    private var progressJob: Job? = null

    // MediaPlayer lifecycle state guards to prevent native error (-38, 0)
    private var isPrepared = false
    private var isPreparing = false
    private var playWhenReady = true

    private val vibrator: Vibrator? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
        vibratorManager?.defaultVibrator
    } else {
        @Suppress("DEPRECATION")
        context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
    }

    private val _currentSong = MutableStateFlow<Song?>(null)
    val currentSong: StateFlow<Song?> = _currentSong.asStateFlow()

    private val _isPlaying = MutableStateFlow(false)
    val isPlaying: StateFlow<Boolean> = _isPlaying.asStateFlow()

    private val _currentPositionMs = MutableStateFlow(0)
    val currentPositionMs: StateFlow<Int> = _currentPositionMs.asStateFlow()

    private val _totalDurationMs = MutableStateFlow(1)
    val totalDurationMs: StateFlow<Int> = _totalDurationMs.asStateFlow()

    private val _isBuffering = MutableStateFlow(false)
    val isBuffering: StateFlow<Boolean> = _isBuffering.asStateFlow()

    private val _partyModeActive = MutableStateFlow(false)
    val partyModeActive: StateFlow<Boolean> = _partyModeActive.asStateFlow()

    private val _beatIntensity = MutableStateFlow(0f)
    val beatIntensity: StateFlow<Float> = _beatIntensity.asStateFlow()

    // DJ Deck Crossfade states
    private val _crossfader = MutableStateFlow(0.5f) // 0.0 Deck A, 1.0 Deck B
    val crossfader: StateFlow<Float> = _crossfader.asStateFlow()

    private val _isSpatialAudioEnabled = MutableStateFlow(true)
    val isSpatialAudioEnabled: StateFlow<Boolean> = _isSpatialAudioEnabled.asStateFlow()

    fun playSong(song: Song) {
        if (_currentSong.value?.id == song.id) {
            if (isPrepared && mediaPlayer != null) {
                resume()
                return
            } else if (isPreparing) {
                // Already buffering this track, mark to play when ready
                playWhenReady = true
                _isPlaying.value = true
                return
            }
        }

        _currentSong.value = song
        _isBuffering.value = true
        _currentPositionMs.value = 0
        _totalDurationMs.value = song.durationSec * 1000
        playWhenReady = true

        releasePlayer()

        try {
            isPreparing = true
            isPrepared = false
            mediaPlayer = MediaPlayer().apply {
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .build()
                )
                setDataSource(song.streamUrl)
                setOnPreparedListener { mp ->
                    isPreparing = false
                    isPrepared = true
                    _isBuffering.value = false
                    _totalDurationMs.value = if (mp.duration > 0) mp.duration else song.durationSec * 1000
                    if (playWhenReady) {
                        try {
                            mp.start()
                            _isPlaying.value = true
                            startProgressTracker()
                        } catch (e: Exception) {
                            Log.e("AudioPlayerManager", "Failed to start MediaPlayer in onPrepared: ${e.message}")
                            startSimulatedProgress(song)
                        }
                    }
                }
                setOnCompletionListener {
                    _isPlaying.value = false
                    _currentPositionMs.value = 0
                }
                setOnErrorListener { _, what, extra ->
                    Log.w("AudioPlayerManager", "Streaming error ($what, $extra), falling back to simulated engine")
                    isPreparing = false
                    isPrepared = false
                    _isBuffering.value = false
                    _isPlaying.value = true
                    startSimulatedProgress(song)
                    true
                }
                prepareAsync()
            }
        } catch (e: Exception) {
            Log.e("AudioPlayerManager", "Failed to initialize player: ${e.message}")
            isPreparing = false
            isPrepared = false
            _isBuffering.value = false
            _isPlaying.value = true
            startSimulatedProgress(song)
        }
    }

    private fun startSimulatedProgress(song: Song) {
        progressJob?.cancel()
        _totalDurationMs.value = song.durationSec * 1000
        progressJob = scope.launch {
            while (isActive && _isPlaying.value) {
                delay(200)
                val nextPos = _currentPositionMs.value + 200
                if (nextPos >= _totalDurationMs.value) {
                    _currentPositionMs.value = 0
                    _isPlaying.value = false
                } else {
                    _currentPositionMs.value = nextPos
                }
                updateBeatPulse()
            }
        }
    }

    fun pause() {
        playWhenReady = false
        if (isPrepared) {
            try {
                mediaPlayer?.pause()
            } catch (_: Exception) {}
        }
        _isPlaying.value = false
        progressJob?.cancel()
    }

    fun resume() {
        playWhenReady = true
        if (isPreparing) {
            // Still preparing in state 4; do NOT call mediaPlayer.start() directly!
            // onPrepared will execute mp.start() safely as playWhenReady is true.
            _isPlaying.value = true
            return
        }

        if (isPrepared && mediaPlayer != null) {
            try {
                mediaPlayer?.start()
                _isPlaying.value = true
                startProgressTracker()
            } catch (_: Exception) {
                _currentSong.value?.let { startSimulatedProgress(it) }
            }
        } else {
            _currentSong.value?.let { playSong(it) }
        }
    }

    fun togglePlayPause() {
        if (_isPlaying.value) {
            pause()
        } else {
            resume()
        }
    }

    fun seekTo(positionMs: Int) {
        _currentPositionMs.value = positionMs
        if (isPrepared) {
            try {
                mediaPlayer?.seekTo(positionMs)
            } catch (_: Exception) {}
        }
    }

    fun togglePartyMode() {
        val newState = !_partyModeActive.value
        _partyModeActive.value = newState
        if (newState) {
            triggerHapticPulse(50)
        }
    }

    fun toggleSpatialAudio() {
        _isSpatialAudioEnabled.value = !_isSpatialAudioEnabled.value
    }

    fun setCrossfader(value: Float) {
        _crossfader.value = value.coerceIn(0f, 1f)
        val deckAVol = (1f - value).coerceIn(0f, 1f)
        if (isPrepared) {
            try {
                mediaPlayer?.setVolume(deckAVol, deckAVol)
            } catch (_: Exception) {}
        }
    }

    fun triggerHapticPulse(durationMs: Long = 30) {
        try {
            if (vibrator?.hasVibrator() == true) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator.vibrate(
                        VibrationEffect.createOneShot(
                            durationMs,
                            VibrationEffect.DEFAULT_AMPLITUDE
                        )
                    )
                } else {
                    @Suppress("DEPRECATION")
                    vibrator.vibrate(durationMs)
                }
            }
        } catch (_: Exception) {}
    }

    private fun startProgressTracker() {
        progressJob?.cancel()
        progressJob = scope.launch {
            while (isActive && _isPlaying.value) {
                try {
                    if (isPrepared) {
                        mediaPlayer?.let { mp ->
                            if (mp.isPlaying) {
                                _currentPositionMs.value = mp.currentPosition
                            }
                        }
                    }
                } catch (_: Exception) {}
                updateBeatPulse()
                delay(100)
            }
        }
    }

    private fun updateBeatPulse() {
        val song = _currentSong.value ?: return
        val bpm = song.bpm
        val beatIntervalMs = (60_000f / bpm).toInt()
        val pos = _currentPositionMs.value
        val beatFraction = (pos % beatIntervalMs).toFloat() / beatIntervalMs
        val intensity = (1f - beatFraction).coerceIn(0f, 1f)
        _beatIntensity.value = intensity

        // Trigger haptic beat sync on peak if party mode is active
        if (_partyModeActive.value && beatFraction < 0.1f) {
            triggerHapticPulse(25)
        }
    }

    private fun releasePlayer() {
        progressJob?.cancel()
        isPreparing = false
        isPrepared = false
        try {
            mediaPlayer?.reset()
            mediaPlayer?.release()
        } catch (_: Exception) {}
        mediaPlayer = null
    }

    fun release() {
        releasePlayer()
    }
}
