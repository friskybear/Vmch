import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class TabsScreen extends StatelessWidget {

  @override
  Widget build(BuildContext context) { 
    return Scaffold(
      body: Center(
        child: SvgPicture.asset(
          'assets/icons/ear.svg',
          width: 24,
          height: 24,
        ),
      ),
    );
  }
}