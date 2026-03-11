import 'package:flutter/material.dart';

class AppTheme {
  static const Color obsidianBg = Color(0xFF030303);
  static const Color obsidianCard = Color(0xFF121214);
  static const Color aiAmethyst = Color(0xFF8B5CF6);
  static const Color aiElectric = Color(0xFF3B82F6);

  static ThemeData get darkAiTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: obsidianBg,
      colorScheme: const ColorScheme.dark(
        primary: Colors.white,
        secondary: aiAmethyst,
        surface: obsidianCard,
      ),
      cardTheme: CardTheme(
        color: obsidianCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(20)),
          side: BorderSide(color: Colors.white.withOpacity(0.05)),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: obsidianBg.withOpacity(0.9),
        elevation: 0,
        centerTitle: true,
        titleTextStyle: const TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          letterSpacing: -0.5,
        ),
      ),
    );
  }
}
