package com.example.data.repository

import android.content.Context
import androidx.compose.ui.graphics.Color
import com.example.data.model.Song
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.json.JSONArray
import org.json.JSONObject

data class HistoryItem(
    val song: Song,
    val playedAtMs: Long
)

object HistoryManager {
    private const val PREFS_NAME = "mj_pulse_history_prefs"
    private const val KEY_HISTORY = "playback_history_json"
    private const val MAX_HISTORY_SIZE = 60

    private val _historyItems = MutableStateFlow<List<HistoryItem>>(emptyList())
    val historyItems: StateFlow<List<HistoryItem>> = _historyItems.asStateFlow()

    private val _historySongs = MutableStateFlow<List<Song>>(emptyList())
    val historySongs: StateFlow<List<Song>> = _historySongs.asStateFlow()

    private var isInitialized = false

    fun init(context: Context) {
        if (isInitialized) return
        loadHistory(context)
        isInitialized = true
    }

    private fun loadHistory(context: Context) {
        try {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val rawJson = prefs.getString(KEY_HISTORY, null) ?: return
            val jsonArray = JSONArray(rawJson)
            val items = mutableListOf<HistoryItem>()

            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                val songObj = obj.getJSONObject("song")
                val playedAt = obj.optLong("playedAtMs", System.currentTimeMillis())

                val song = Song(
                    id = songObj.getString("id"),
                    title = songObj.getString("title"),
                    artist = songObj.getString("artist"),
                    album = songObj.optString("album", "MJ PULSE"),
                    durationSec = songObj.optInt("durationSec", 210),
                    coverUrl = songObj.getString("coverUrl"),
                    streamUrl = songObj.getString("streamUrl"),
                    genre = songObj.optString("genre", "Soundtrack"),
                    bpm = songObj.optInt("bpm", 120),
                    accentColor = Color(songObj.optLong("accentColor", 0xFF00F2FEL)),
                    secondaryColor = Color(songObj.optLong("secondaryColor", 0xFF8B5CF6L)),
                    platform = songObj.optString("platform", "MJ PULSE Master"),
                    isHiRes = songObj.optBoolean("isHiRes", true),
                    codec = songObj.optString("codec", "Master 320kbps")
                )
                items.add(HistoryItem(song = song, playedAtMs = playedAt))
            }

            _historyItems.value = items
            _historySongs.value = items.map { it.song }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun recordSongPlay(context: Context, song: Song) {
        init(context)
        try {
            val currentList = _historyItems.value.toMutableList()
            // Deduplicate: if song was already played, remove older instance and place at top
            currentList.removeAll { it.song.id == song.id || it.song.streamUrl == song.streamUrl }
            currentList.add(0, HistoryItem(song = song, playedAtMs = System.currentTimeMillis()))

            val trimmedList = if (currentList.size > MAX_HISTORY_SIZE) {
                currentList.subList(0, MAX_HISTORY_SIZE)
            } else {
                currentList
            }

            _historyItems.value = trimmedList
            _historySongs.value = trimmedList.map { it.song }

            persistHistory(context, trimmedList)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun persistHistory(context: Context, items: List<HistoryItem>) {
        try {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val jsonArray = JSONArray()

            for (item in items) {
                val obj = JSONObject()
                obj.put("playedAtMs", item.playedAtMs)

                val songObj = JSONObject().apply {
                    put("id", item.song.id)
                    put("title", item.song.title)
                    put("artist", item.song.artist)
                    put("album", item.song.album)
                    put("durationSec", item.song.durationSec)
                    put("coverUrl", item.song.coverUrl)
                    put("streamUrl", item.song.streamUrl)
                    put("genre", item.song.genre)
                    put("bpm", item.song.bpm)
                    put("accentColor", item.song.accentColor.value.toLong())
                    put("secondaryColor", item.song.secondaryColor.value.toLong())
                    put("platform", item.song.platform)
                    put("isHiRes", item.song.isHiRes)
                    put("codec", item.song.codec)
                }

                obj.put("song", songObj)
                jsonArray.put(obj)
            }

            prefs.edit().putString(KEY_HISTORY, jsonArray.toString()).apply()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun clearHistory(context: Context) {
        try {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            prefs.edit().remove(KEY_HISTORY).apply()
            _historyItems.value = emptyList()
            _historySongs.value = emptyList()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun removeSong(context: Context, songId: String) {
        val currentList = _historyItems.value.filter { it.song.id != songId }
        _historyItems.value = currentList
        _historySongs.value = currentList.map { it.song }
        persistHistory(context, currentList)
    }
}
