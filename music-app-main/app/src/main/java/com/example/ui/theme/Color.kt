package com.example.ui.theme

import androidx.compose.ui.graphics.Color

// MJ PULSE Deep Obsidian & Neon Cyberpunk/Glassmorphic Palette
val PulseBackground = Color(0xFF080911)
val PulseSurface = Color(0xFF0E111F)
val PulseSurfaceGlass = Color(0x66151A2E)
val PulseCardGlass = Color(0x4D1B223C)
val PulseBorderGlass = Color(0x3300F2FE)
val PulseBorderSubtle = Color(0x22FFFFFF)

// Vivid Neon Accents
val NeonCyan = Color(0xFF00F2FE)
val NeonPink = Color(0xFFFF007F)
val NeonViolet = Color(0xFF9B51E0)
val NeonGreen = Color(0xFF00FF87)
val NeonAmber = Color(0xFFFFB300)

val TextPrimary = Color(0xFFF4F6FB)
val TextSecondary = Color(0xFF94A3B8)
val TextMuted = Color(0xFF64748B)

// Material 3 Color Mappings
val PulseDarkColorScheme = androidx.compose.material3.darkColorScheme(
    primary = NeonCyan,
    onPrimary = Color(0xFF001F28),
    primaryContainer = Color(0xFF003644),
    onPrimaryContainer = Color(0xFF70F3FF),
    secondary = NeonPink,
    onSecondary = Color(0xFF3E001B),
    secondaryContainer = Color(0xFF5D002B),
    onSecondaryContainer = Color(0xFFFFD9E2),
    tertiary = NeonViolet,
    onTertiary = Color(0xFF2E004E),
    tertiaryContainer = Color(0xFF4A0079),
    onTertiaryContainer = Color(0xFFEDDCFF),
    background = PulseBackground,
    onBackground = TextPrimary,
    surface = PulseSurface,
    onSurface = TextPrimary,
    surfaceVariant = Color(0xFF161B2E),
    onSurfaceVariant = TextSecondary,
    outline = Color(0x4000F2FE),
    outlineVariant = Color(0x20FFFFFF)
)
