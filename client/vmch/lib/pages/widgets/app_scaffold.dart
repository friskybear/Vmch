import 'package:flutter/material.dart';
import 'package:vmch/config/theme.dart';

class AppScaffold extends StatelessWidget {
  final Widget body;
  final String? title;
  final List<Widget>? actions;
  final Widget? floatingActionButton;
  final Widget? drawer;
  final bool centerTitle;
  final PreferredSizeWidget? customAppBar;
  final TextStyle? titleStyle;
  final Widget? leadingTitle;
  final Widget? trailingTitle;

  const AppScaffold({
    super.key,
    required this.body,
    this.title,
    this.actions,
    this.floatingActionButton,
    this.drawer,
    this.centerTitle = true,
    this.customAppBar,
    this.titleStyle,
    this.leadingTitle,
    this.trailingTitle,
  });

  @override
  Widget build(BuildContext context) {
    String currentTheme = getCurrentTheme();
    return Scaffold(
      backgroundColor: Color(int.parse(themeColors[currentTheme]!['base-100']!.replaceAll('#', '0xFF'))),
      appBar: customAppBar ?? (title != null ? AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (leadingTitle != null) leadingTitle!,
            if (leadingTitle != null) const SizedBox(width: 8),
            Text(
              title!,
              style: titleStyle,
            ),
            if (trailingTitle != null) const SizedBox(width: 8),
            if (trailingTitle != null) trailingTitle!,
          ],
        ),
        centerTitle: centerTitle,
        actions: actions,
        backgroundColor: Color(int.parse(themeColors[currentTheme]!['primary']!.replaceAll('#', '0xFF'))),
      ) : null),
      body: body,
      floatingActionButton: floatingActionButton,
      drawer: drawer,
    );
  }
} 