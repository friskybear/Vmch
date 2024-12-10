import 'package:flutter/material.dart';
import 'package:vmch/pages/widgets/app_scaffold.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:vmch/pages/widgets/custom_card.dart';
import 'package:vmch/pages/tabs/view_models/category.dart';

class TabsScreen extends StatelessWidget {
  Future<List<Category>> fetchCategories() async {
    return [
      Category(
          name: "متخصص مغز و اعصاب",
          createdAt: DateTime.now(),
          updatedAt: DateTime.now()),
      Category(
          name: "متخصص گوش و حلق و بینی",
          createdAt: DateTime.now(),
          updatedAt: DateTime.now()),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'مشاوره آنلاین پزشکی',
      centerTitle: true,
      leadingTitle: SvgPicture.asset(
        'assets/logos/logo-transparent.svg',
        height: 30,
        width: 30,
      ),
      body: FutureBuilder<List<Category>>(
        future: fetchCategories(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('No categories found'));
          }

          final categories = snapshot.data!;
          return GridView.builder(
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 1,
            ),
            itemCount: categories.length,
            itemBuilder: (context, index) {
              final category = categories[index];
              return CustomCard(
                name: category.name,
                svgPath: Category.specialtyIcons[category.name] ??
                    'assets/icons/default.svg',
              );
            },
          );
        },
      ),
    );
  }
}
