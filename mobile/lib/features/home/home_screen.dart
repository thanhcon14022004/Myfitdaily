import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/auth_provider.dart';
import '../../providers/wardrobe_provider.dart';
import '../../providers/weather_provider.dart';
import '../ai_stylist/ai_stylist_screen.dart';
import '../studio/outfit_studio_screen.dart';
import '../wardrobe/add_clothing_screen.dart';
import '../../widgets/location_picker_sheet.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<WardrobeProvider>(context, listen: false).init();
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final wardrobe = Provider.of<WardrobeProvider>(context);
    final userName = auth.user?.fullName ?? 'Fashionista';

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () => wardrobe.fetchClothes(),
          color: AppColors.primary,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header: User Greeting & Notification
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Xin chào,',
                            style: TextStyle(fontSize: 14, color: AppColors.textSecondary),
                          ),
                          Text(
                            userName,
                            style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.cardBorder),
                      ),
                      child: const Icon(
                        Icons.notifications_none,
                        color: AppColors.textPrimary,
                        size: 20,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Weather Widget Card (Smart Context from Live Weather API)
                Builder(
                  builder: (context) {
                    final weatherProv = Provider.of<WeatherProvider>(context);
                    final w = weatherProv.weather;
                    return InkWell(
                      borderRadius: BorderRadius.circular(18),
                      onTap: () => LocationPickerSheet.show(context),
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF2C2D4A), Color(0xFF1E1F35)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: AppColors.primary.withValues(alpha: 0.25),
                                shape: BoxShape.circle,
                              ),
                              child: Text(
                                w?.icon ?? '☀️',
                                style: const TextStyle(fontSize: 26),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Text(
                                          'Hôm nay • ${w != null ? "${w.temperature.toStringAsFixed(0)}°C" : "28°C"} ${w?.condition ?? "Nắng ấm"}',
                                          style: const TextStyle(
                                            color: AppColors.textPrimary,
                                            fontSize: 13,
                                            fontWeight: FontWeight.w600,
                                          ),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          const Icon(Icons.location_on, size: 12, color: AppColors.primaryLight),
                                          const SizedBox(width: 2),
                                          Text(
                                            w?.city ?? 'Hà Nội',
                                            style: const TextStyle(
                                              color: AppColors.primaryLight,
                                              fontSize: 11,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    w?.outfitAdvice ?? 'Thời tiết lý tưởng cho áo sơ mi nhẹ hoặc blazer mỏng.',
                                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 24),

                // AI Stylist Callout Banner
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const AiStylistScreen()),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF6C5CE7), Color(0xFFFD79A8)],
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                      ),
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withValues(alpha: 0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.2),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: const Text(
                                  'GEMINI AI STYLIST',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                'Bạn phân vân hôm nay mặc gì?',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 17,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                'Để AI chọn set đồ đẹp nhất từ tủ của bạn',
                                style: TextStyle(color: Colors.white70, fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                        const Icon(
                          Icons.arrow_forward_ios,
                          color: Colors.white,
                          size: 18,
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // 3D Virtual Mannequin Fitting Room Banner
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const OutfitStudioScreen()),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFFD4AF37), Color(0xFFC27D5E)],
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                      ),
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFD4AF37).withValues(alpha: 0.35),
                          blurRadius: 14,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.2),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.accessibility_new, color: Colors.white, size: 26),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: Colors.black.withValues(alpha: 0.25),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: const Text(
                                  '3D FITTING ATELIER',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 6),
                              const Text(
                                'Người Mẫu Ảo 3D & Thử Đồ',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 3),
                              const Text(
                                'Mô hình người mẫu showroom xoay 360° theo số đo',
                                style: TextStyle(color: Colors.white70, fontSize: 11),
                              ),
                            ],
                          ),
                        ),
                        const Icon(
                          Icons.arrow_forward_ios,
                          color: Colors.white,
                          size: 18,
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 28),

                // Quick Wardrobe Summary
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Tủ đồ của bạn',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      '${wardrobe.clothes.length} món đồ',
                      style: const TextStyle(fontSize: 13, color: AppColors.primaryLight),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Quick Add Card if empty, or preview items
                if (wardrobe.clothes.isEmpty)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.cardBorder),
                    ),
                    child: Column(
                      children: [
                        const Icon(Icons.checkroom_outlined, size: 48, color: AppColors.textMuted),
                        const SizedBox(height: 12),
                        const Text(
                          'Tủ đồ của bạn còn trống',
                          style: TextStyle(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.w600,
                            fontSize: 15,
                          ),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'Hãy chụp ảnh quần áo đầu tiên để AI có thể bắt đầu phối đồ!',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const AddClothingScreen()),
                            );
                          },
                          icon: const Icon(Icons.camera_alt, size: 18),
                          label: const Text('Chụp ảnh thêm đồ'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                        ),
                      ],
                    ),
                  )
                else
                  SizedBox(
                    height: 180,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: wardrobe.clothes.take(6).length,
                      separatorBuilder: (_, __) => const SizedBox(width: 12),
                      itemBuilder: (context, index) {
                        final item = wardrobe.clothes[index];
                        return Container(
                          width: 130,
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: AppColors.cardBorder),
                          ),
                          clipBehavior: Clip.antiAlias,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Expanded(
                                child: _buildItemImage(item.imageUrl),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(8),
                                child: Text(
                                  item.name,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    color: AppColors.textPrimary,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildItemImage(String url) {
    if (url.isEmpty) {
      return Container(
        color: AppColors.surfaceElevated,
        child: const Icon(Icons.checkroom, color: AppColors.textMuted),
      );
    }
    final isSvg = url.toLowerCase().endsWith('.svg');
    final isAsset = url.startsWith('assets/');

    if (isAsset) {
      if (isSvg) {
        return Container(
          color: AppColors.surfaceElevated,
          padding: const EdgeInsets.all(8),
          child: SvgPicture.asset(
            url,
            fit: BoxFit.contain,
          ),
        );
      } else {
        return Image.asset(
          url,
          width: double.infinity,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => Container(
            color: AppColors.surfaceElevated,
            child: const Icon(Icons.checkroom, color: AppColors.textMuted),
          ),
        );
      }
    } else {
      if (isSvg) {
        return Container(
          color: AppColors.surfaceElevated,
          padding: const EdgeInsets.all(8),
          child: SvgPicture.network(
            url,
            fit: BoxFit.contain,
            placeholderBuilder: (_) => const Center(
              child: CircularProgressIndicator(strokeWidth: 1.5, color: AppColors.primaryLight),
            ),
          ),
        );
      } else {
        return CachedNetworkImage(
          imageUrl: url,
          width: double.infinity,
          fit: BoxFit.cover,
          placeholder: (context, url) => Container(
            color: AppColors.surfaceElevated,
            child: const Center(
              child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primaryLight),
            ),
          ),
          errorWidget: (context, url, error) => Container(
            color: AppColors.surfaceElevated,
            child: const Icon(Icons.checkroom, color: AppColors.textMuted),
          ),
        );
      }
    }
  }
}
