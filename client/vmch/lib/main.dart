import 'package:flutter/material.dart';
import 'package:vmch/pages/tabs/views/tabs.dart';
void main() {
  runApp(
    const App(),
  );
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: TabsScreen(),
    );
  }
}
