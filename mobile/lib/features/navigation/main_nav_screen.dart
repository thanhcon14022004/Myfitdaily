import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../home/home_screen.dart';
import '../wardrobe/wardrobe_screen.dart';
import '../ai_stylist/ai_stylist_screen.dart';
import '../studio/outfit_studio_screen.dart';
import '../profile/profile_screen.dart';

class MainNavScreen extends StatefulWidget {
  const MainNavScreen({super.key});

  @override
  State<MainNavScreen> createState() => _MainNavScreenState();
}

class _MainNavScreenState extends State<MainNavScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    WardrobeScreen(),
    OutfitStudioScreen(),
    AiStylistScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border(top: BorderSide(color: AppColors.cardBorder.withValues(alpha: 0.5))),
        ),
        child: SafeArea(
          child: SizedBox(
            height: 62,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(0, Icons.home_outlined, Icons.home, 'Home'),
                _buildNavItem(1, Icons.checkroom_outlined, Icons.checkroom, 'Tủ đồ'),
                _buildNavItem(2, Icons.accessibility_new_outlined, Icons.accessibility_new, 'Studio 3D'),
                _buildNavItem(3, Icons.auto_awesome_outlined, Icons.auto_awesome, 'AI Stylist'),
                _buildNavItem(4, Icons.person_outline, Icons.person, 'Hồ sơ'),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData unselectedIcon, IconData selectedIcon, String label) {
    final isSelected = _currentIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _currentIndex = index),
      behavior: HitTestBehavior.opaque,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isSelected ? selectedIcon : unselectedIcon,
              size: 22,
              color: isSelected ? AppColors.primaryLight : AppColors.textMuted,
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                color: isSelected ? AppColors.primaryLight : AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
