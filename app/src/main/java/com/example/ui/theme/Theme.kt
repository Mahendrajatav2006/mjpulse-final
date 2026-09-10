package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable

@Composable
fun MjPulseTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = PulseDarkColorScheme,
        typography = Typography,
        content = content
    )
}
