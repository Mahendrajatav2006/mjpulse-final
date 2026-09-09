package com.example.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import kotlinx.coroutines.delay
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchScreen(
    onSongSelected: (Song) -> Unit,
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedPlatformFilter by remember { mutableStateOf<String?>(null) }
    val platforms = listOf("All", "MJ PULSE Master", "Party Edition", "Global Hits")

    var selectedMoodFilter by remember { mutableStateOf<String?>(null) }
    val moodFilters = listOf("Bollywood", "Punjabi", "Lo-Fi Chill", "Desi Hip-Hop", "EDM Fest")

    var searchResults by remember { mutableStateOf(MusicRepository.sampleSongs) }
    var isSearching by remember { mutableStateOf(false) }

    LaunchedEffect(searchQuery, selectedPlatformFilter, selectedMoodFilter) {
        val trimmed = searchQuery.trim()
        val effectivePlatform = if (selectedPlatformFilter == "All") null else selectedPlatformFilter
        val effectiveGenre = when (selectedMoodFilter) {
            "Bollywood" -> "Bollywood"
            "Punjabi" -> "Punjabi"
            "Lo-Fi Chill" -> "Lo-Fi"
            "Desi Hip-Hop" -> "Hip-Hop"
            "EDM Fest" -> "EDM"
            else -> null
        }

        if (trimmed.isBlank() && effectiveGenre == null && effectivePlatform == null) {
            searchResults = MusicRepository.sampleSongs
            isSearching = false
            return@LaunchedEffect
        }

        isSearching = true
        if (trimmed.isNotBlank()) {
            delay(350)
        }

        val targetQuery = if (trimmed.isNotBlank()) trimmed else (effectiveGenre ?: "Top Hits")
        val online = MusicRepository.searchOnline(targetQuery)
        searchResults = if (online.isNotEmpty()) online else MusicRepository.search(targetQuery, effectiveGenre, effectivePlatform)
        isSearching = false
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(PulseBackground),
        contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = 16.dp, bottom = 120.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Search Header
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.AutoAwesome,
                    contentDescription = null,
                    tint = NeonCyan,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Global & Desi Music Search",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            }
            Text(
                text = "Search any song, artist, album, or vibe in high fidelity",
                fontSize = 12.sp,
                color = TextSecondary,
                modifier = Modifier.padding(top = 4.dp, bottom = 10.dp)
            )
        }

        // Search Input Bar
        item {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("global_search_input"),
                placeholder = { Text("Search Kesariya, Diljit, Arijit, The Weeknd, Lo-Fi...", color = TextMuted) },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        tint = NeonCyan
                    )
                },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { searchQuery = "" }) {
                            Icon(Icons.Default.Close, contentDescription = "Clear", tint = TextSecondary)
                        }
                    }
                },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = NeonCyan,
                    unfocusedBorderColor = Color(0x4000F2FE),
                    focusedContainerColor = Color(0x22151A2E),
                    unfocusedContainerColor = Color(0x15151A2E),
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary
                ),
                shape = RoundedCornerShape(16.dp),
                singleLine = true
            )
        }

        if (isSearching) {
            item {
                LinearProgressIndicator(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(3.dp)
                        .clip(RoundedCornerShape(2.dp)),
                    color = NeonCyan,
                    trackColor = Color(0x2200F2FE)
                )
            }
        }

        // Platform Filter Row
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                platforms.forEach { platform ->
                    val isSelected = selectedPlatformFilter == platform || (platform == "All" && selectedPlatformFilter == null)
                    val color = when (platform) {
                        "MJ PULSE Master" -> NeonCyan
                        "Party Edition" -> NeonPink
                        "Global Hits" -> Color(0xFF8B5CF6)
                        else -> NeonCyan
                    }

                    GlassCard(
                        shape = RoundedCornerShape(16.dp),
                        borderColor = if (isSelected) color else Color(0x25FFFFFF),
                        backgroundColor = if (isSelected) color.copy(alpha = 0.22f) else Color(0x15151A2E),
                        onClick = {
                            selectedPlatformFilter = if (platform == "All") null else platform
                        }
                    ) {
                        Text(
                            text = platform,
                            color = if (isSelected) color else TextSecondary,
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 7.dp)
                        )
                    }
                }
            }
        }

        // Mood / Genre Quick Filters
        item {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(moodFilters) { mood ->
                    val isSelected = selectedMoodFilter == mood
                    GlassCard(
                        shape = RoundedCornerShape(16.dp),
                        borderColor = if (isSelected) NeonPink else Color(0x25FFFFFF),
                        backgroundColor = if (isSelected) NeonPink.copy(alpha = 0.22f) else Color(0x12151A2E),
                        onClick = {
                            selectedMoodFilter = if (isSelected) null else mood
                        }
                    ) {
                        Text(
                            text = mood,
                            color = if (isSelected) NeonPink else TextSecondary,
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                        )
                    }
                }
            }
        }

        // Music DNA Card
        item {
            GlassCard(
                modifier = Modifier.fillMaxWidth(),
                borderColor = NeonViolet.copy(alpha = 0.4f),
                glowColor = NeonViolet
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "DESI & GLOBAL MUSIC DNA",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = NeonViolet,
                            letterSpacing = 1.sp
                        )
                        NeonBadge(text = "SMART AI", color = NeonCyan)
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    DnaMetricRow(label = "Bollywood Melodic Romance", percentage = 0.85f, color = Color(0xFF2BC5B4))
                    DnaMetricRow(label = "Punjabi Dholak Bass", percentage = 0.92f, color = Color(0xFFE72C30))
                    DnaMetricRow(label = "Global Pop Energy", percentage = 0.78f, color = NeonCyan)
                }
            }
        }

        // Search Results List
        item {
            Text(
                text = if (searchResults.isEmpty()) "No tracks found for this filter" else "Found ${searchResults.size} Songs",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary,
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        items(searchResults) { song ->
            GlassCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("search_result_${song.id}"),
                borderColor = song.accentColor.copy(alpha = 0.35f),
                onClick = { onSongSelected(song) }
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(54.dp)
                            .clip(RoundedCornerShape(10.dp))
                    ) {
                        AsyncImage(
                            model = song.coverUrl,
                            contentDescription = song.title,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )
                    }

                    Spacer(modifier = Modifier.width(14.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = song.title,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Text(
                            text = "${song.artist} • ${song.album}",
                            fontSize = 12.sp,
                            color = TextSecondary
                        )
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            modifier = Modifier.padding(top = 4.dp)
                        ) {
                            NeonBadge(text = song.platform, color = song.accentColor)
                            Text(
                                text = "• ${song.bpm} BPM",
                                fontSize = 11.sp,
                                color = TextMuted
                            )
                        }
                    }

                    IconButton(
                        onClick = { onSongSelected(song) },
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(song.accentColor.copy(alpha = 0.2f))
                    ) {
                        Icon(
                            imageVector = Icons.Default.PlayArrow,
                            contentDescription = "Play",
                            tint = song.accentColor
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun DnaMetricRow(
    label: String,
    percentage: Float,
    color: Color
) {
    Column(modifier = Modifier.padding(vertical = 4.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(label, fontSize = 11.sp, color = TextSecondary)
            Text("${(percentage * 100).toInt()}%", fontSize = 11.sp, color = color, fontWeight = FontWeight.Bold)
        }
        Spacer(modifier = Modifier.height(3.dp))
        LinearProgressIndicator(
            progress = { percentage },
            modifier = Modifier
                .fillMaxWidth()
                .height(4.dp)
                .clip(CircleShape),
            color = color,
            trackColor = Color(0x33FFFFFF)
        )
    }
}
