import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:vmch/config/theme.dart';

class Category {
  Category({
    required this.name,
    required this.createdAt,
    required this.updatedAt,
  });

  final String name;     // matches 'name' field from DB
  final DateTime createdAt;  // matches 'created_at' field from DB
  final DateTime updatedAt;  // matches 'updated_at' field from DB

  // Map of specialty names to their corresponding SVG paths
  static final Map<String, String> specialtyIcons = {
    "متخصص مغز و اعصاب": "assets/icons/brain.svg",
    "متخصص گوش و حلق و بینی": "assets/icons/ear.svg",
    "متخصص روانپزشکی": "assets/icons/psychology.svg",
    "متخصص چشم پزشکی": "assets/icons/eye.svg",
    "متخصص جراحی مغز و اعصاب": "assets/icons/brain-surgery.svg",
    "متخصص قلب و عروق": "assets/icons/heart.svg",
    "متخصص ریه": "assets/icons/lungs.svg",
    "متخصص داخلی": "assets/icons/internal.svg",
    "متخصص جراحی قفسه سینه": "assets/icons/chest.svg",
    "متخصص گوارش و کبد": "assets/icons/digestive.svg",
    "متخصص تغذیه": "assets/icons/nutrition.svg",
    "متخصص جراحی عمومی": "assets/icons/surgery.svg",
    "متخصص کلیه و مجاری ادراری": "assets/icons/kidney.svg",
    "متخصص غدد": "assets/icons/endocrine.svg",
    "متخصص زنان و زایمان": "assets/icons/gynecology.svg",
  };

  // Get SVG widget for the specialty
  Widget? get iconWidget {
    final iconPath = specialtyIcons[name];
    if (iconPath == null) return null;
    
    return SvgPicture.asset(
      iconPath,
      height: 24,
      width: 24,
      colorFilter: ColorFilter.mode(color, BlendMode.srcIn),
    );
  }

  // Create a getter that returns the appropriate color based on current theme
  Color get color {
    final currentTheme = getCurrentTheme();
    final colorHex = themeColors[currentTheme]!['primary']!;
    return Color(int.parse(colorHex.substring(1), radix: 16) + 0xFF000000);
  }

  // Factory constructor to create Category from JSON
  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      name: json['name'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  // Convert Category to JSON
  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }
}