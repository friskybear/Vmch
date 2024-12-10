import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:vmch/config/theme.dart';

class CustomCard extends StatefulWidget {
  final String name;
  final String svgPath;

  const CustomCard({
    Key? key,
    required this.name,
    required this.svgPath,
  }) : super(key: key);

  @override
  _CustomCardState createState() => _CustomCardState();
}

class _CustomCardState extends State<CustomCard> {
  double _scale = 1.0;
  Color default_color = Colors.grey.shade300;

  @override
  Widget build(BuildContext context) {
    double width = MediaQuery.of(context).size.width;
    double height = MediaQuery.of(context).size.height;

    String currentTheme = getCurrentTheme();
    return MouseRegion(
      onEnter: (_) {
        setState(() {
          _scale = 1.05;
          default_color = Color(int.parse(
              themeColors[currentTheme]!['primary']!.replaceAll('#', '0xFF')));
        });
      },
      onExit: (_) {
        setState(() {
          _scale = 1.0;
          default_color = Colors.grey.shade300;
        });
      },
      child: Transform.scale(
        scale: _scale,
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.grey.shade300, width: 1),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                spreadRadius: 2,
                blurRadius: 5,
                offset: Offset(0, 3),
              ),
            ],
          ),
          width: width * 0.75,
          height: height * 0.4,
          margin: EdgeInsets.symmetric(vertical: 15),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Flexible(
                child: SvgPicture.asset(
                  widget.svgPath,
                  height: height * 0.2,
                  width: width * 0.5,
                  fit: BoxFit.contain,
                ),
              ),
              Container(
                width: double.infinity,
                height: height * 0.1,
                color: default_color,
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Text(
                    widget.name,
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 16),
                    overflow: TextOverflow.visible,
                    maxLines: null,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
