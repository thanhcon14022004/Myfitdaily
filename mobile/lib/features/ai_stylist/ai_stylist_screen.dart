import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../core/constants/app_colors.dart';
import '../../models/clothing_model.dart';
import '../../providers/ai_stylist_provider.dart';
import '../../providers/user_provider.dart';
import '../../providers/weather_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/virtual_mannequin_widget.dart';
import '../../widgets/location_picker_sheet.dart';

class AiStylistScreen extends StatefulWidget {
  const AiStylistScreen({super.key});

  @override
  State<AiStylistScreen> createState() => _AiStylistScreenState();
}

class _AiStylistScreenState extends State<AiStylistScreen> {
  String _selectedOccasion = 'Đi làm / Công sở';
  String _selectedStyle = 'Minimalist';

  final List<String> _occasions = [
    'Đi làm / Công sở',
    'Đi học',
    'Hẹn hò lãng mạn',
    'Tiệc tối / Sự kiện',
    'Dạo phố cuối tuần',
    'Thể thao / Năng động',
  ];

  final List<String> _styles = [
    'Minimalist',
    'Casual',
    'Streetwear',
    'Elegant / Sang trọng',
    'Vintage / Cổ điển',
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<WeatherProvider>(context, listen: false).fetchWeather();
      Provider.of<UserProvider>(context, listen: false).fetchProfile();
    });
  }

  Future<void> _handleRecommend() async {
    final aiProvider = Provider.of<AiStylistProvider>(context, listen: false);
    final weatherProv = Provider.of<WeatherProvider>(context, listen: false);
    final w = weatherProv.weather;

    // Tự động sử dụng thông số thời tiết thực tế từ Weather API
    final weatherText = w != null
        ? '${w.temperature.toStringAsFixed(0)}°C, ${w.condition}'
        : '29°C, Nắng ấm';

    final success = await aiProvider.recommendOutfit(
      occasion: _selectedOccasion,
      style: _selectedStyle,
      weather: weatherText,
    );

    if (!mounted) return;

    if (!success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(aiProvider.errorMessage ?? 'Không thể tạo gợi ý outfit'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final aiProvider = Provider.of<AiStylistProvider>(context);
    final weatherProv = Provider.of<WeatherProvider>(context);
    final userProvider = Provider.of<UserProvider>(context);
    final rec = aiProvider.recommendation;
    final w = weatherProv.weather;
    final profile = userProvider.profile;

    // Phân loại các món đồ để gắn vào Model người mẫu 3D ảo
    ClothingItem? mannequinTop;
    ClothingItem? mannequinBottom;
    ClothingItem? mannequinShoes;
    ClothingItem? mannequinOuterwear;

    if (rec != null) {
      for (final item in rec.recommendedItems) {
        final cat = item.categoryName.toLowerCase();
        final cItem = ClothingItem(
          id: item.id,
          userId: 0,
          categoryId: 1,
          categoryName: item.categoryName,
          name: item.name,
          color: item.color,
          style: item.style,
          season: 'AllSeason',
          imageUrl: item.imageUrl,
        );

        if (cat.contains('top') || cat.contains('áo thun') || cat.contains('sơ mi') || cat.contains('áo len')) {
          mannequinTop ??= cItem;
        } else if (cat.contains('bottom') || cat.contains('quần') || cat.contains('váy') || cat.contains('chân váy')) {
          mannequinBottom ??= cItem;
        } else if (cat.contains('shoe') || cat.contains('giày') || cat.contains('sneaker')) {
          mannequinShoes ??= cItem;
        } else if (cat.contains('outer') || cat.contains('khoác') || cat.contains('blazer')) {
          mannequinOuterwear ??= cItem;
        }
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.auto_awesome, color: AppColors.primaryLight, size: 20),
            SizedBox(width: 8),
            Text('Trợ lý AI Stylist'),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Controls Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.cardBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Live Weather Integration (Tự động từ Weather API)
                  InkWell(
                    borderRadius: BorderRadius.circular(14),
                    onTap: () => LocationPickerSheet.show(context),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF282A3E), Color(0xFF1B1D2C)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.primary.withValues(alpha: 0.35)),
                      ),
                      child: Row(
                        children: [
                          Text(w?.icon ?? '☀️', style: const TextStyle(fontSize: 24)),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Row(
                                  children: [
                                    Icon(Icons.satellite_alt, size: 12, color: AppColors.success),
                                    SizedBox(width: 4),
                                    Text(
                                      'THỜI TIẾT THỰC TẾ (CHẠM ĐỔI VỊ TRÍ)',
                                      style: TextStyle(
                                        color: AppColors.success,
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '${w?.city ?? "Hà Nội"} • ${w != null ? "${w.temperature.toStringAsFixed(0)}°C" : "28°C"} • ${w?.condition ?? "Nắng ấm"}',
                                  style: const TextStyle(
                                    color: AppColors.textPrimary,
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const Icon(Icons.edit_location_alt_outlined, size: 18, color: AppColors.primaryLight),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),

                  // 2. Select Occasion
                  const Text(
                    'Bạn muốn phối đồ cho dịp nào?',
                    style: TextStyle(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _occasions.map((occ) {
                      final isSelected = _selectedOccasion == occ;
                      return ChoiceChip(
                        label: Text(occ),
                        selected: isSelected,
                        onSelected: (_) => setState(() => _selectedOccasion = occ),
                        selectedColor: AppColors.primary.withValues(alpha: 0.3),
                        backgroundColor: AppColors.surfaceElevated,
                        labelStyle: TextStyle(
                          color: isSelected ? AppColors.primaryLight : AppColors.textSecondary,
                          fontSize: 11,
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(color: isSelected ? AppColors.primary : AppColors.cardBorder),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),

                  // 3. Style Dropdown
                  const Text(
                    'Phong cách yêu thích',
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceElevated,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.cardBorder),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _selectedStyle,
                        isExpanded: true,
                        dropdownColor: AppColors.surfaceElevated,
                        items: _styles.map((s) {
                          return DropdownMenuItem(
                            value: s,
                            child: Text(s, style: const TextStyle(color: AppColors.textPrimary, fontSize: 13)),
                          );
                        }).toList(),
                        onChanged: (val) => setState(() => _selectedStyle = val!),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Generate Button
                  CustomButton(
                    text: 'AI Stylist, Phối đồ ngay!',
                    icon: Icons.auto_awesome,
                    isLoading: aiProvider.isLoading,
                    onPressed: _handleRecommend,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // AI Recommendation Result with Virtual Mannequin Model
            if (rec != null) ...[
              // A. 3D Virtual Mannequin Model wearing the outfit
              SizedBox(
                height: 420,
                child: VirtualMannequinWidget(
                  topGarment: mannequinTop,
                  bottomGarment: mannequinBottom,
                  outerwearGarment: mannequinOuterwear,
                  shoesGarment: mannequinShoes,
                  bodyShape: profile?.bodyShape ?? 'Đồng hồ cát',
                  gender: profile?.gender ?? 'Nữ',
                  heightCm: profile?.height ?? 168,
                  weightKg: profile?.weight ?? 54,
                ),
              ),
              const SizedBox(height: 16),

              // B. Outfit Information & Stylist Notes
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppColors.surface, AppColors.surfaceElevated],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.primary.withValues(alpha: 0.5)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            rec.outfitName,
                            style: const TextStyle(
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                            ),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: AppColors.success.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: AppColors.success),
                          ),
                          child: Text(
                            '${rec.harmonyScore} Hài hòa',
                            style: const TextStyle(
                              color: AppColors.success,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),

                    // Stylist Notes
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.background.withValues(alpha: 0.6),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.tips_and_updates, color: AppColors.gold, size: 20),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              rec.stylistNotes,
                              style: const TextStyle(color: AppColors.textSecondary, fontSize: 13, height: 1.4),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // 3D Virtual Mannequin Model wearing the AI Outfit
                    const Text(
                      'Người mẫu 3D thử trang phục AI gợi ý:',
                      style: TextStyle(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 10),
                    SizedBox(
                      height: 440,
                      child: VirtualMannequinWidget(
                        topGarment: mannequinTop,
                        bottomGarment: mannequinBottom,
                        shoesGarment: mannequinShoes,
                        outerwearGarment: mannequinOuterwear,
                        bodyShape: profile?.bodyShape ?? 'Đồng hồ cát',
                        gender: profile?.gender ?? 'Nữ',
                        heightCm: profile?.height ?? 165,
                        weightKg: profile?.weight ?? 52,
                        chestCm: profile?.chest ?? (profile?.gender == 'Nam' ? 98 : 88),
                        waistCm: profile?.waist ?? (profile?.gender == 'Nam' ? 78 : 64),
                        hipsCm: profile?.hips ?? (profile?.gender == 'Nam' ? 95 : 92),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Items Grid
                    const Text(
                      'Chi tiết từng món trong Set:',
                      style: TextStyle(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 160,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: rec.recommendedItems.length,
                        separatorBuilder: (_, __) => const SizedBox(width: 12),
                        itemBuilder: (context, index) {
                          final item = rec.recommendedItems[index];
                          return Container(
                            width: 120,
                            decoration: BoxDecoration(
                              color: AppColors.background,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.cardBorder),
                            ),
                            clipBehavior: Clip.antiAlias,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Expanded(
                                  child: CachedNetworkImage(
                                    imageUrl: item.imageUrl,
                                    width: double.infinity,
                                    fit: BoxFit.cover,
                                    errorWidget: (_, __, ___) => const Center(
                                      child: Icon(Icons.checkroom, color: AppColors.textMuted),
                                    ),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(8),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        item.name,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(
                                          color: AppColors.textPrimary,
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      Text(
                                        item.categoryName,
                                        style: const TextStyle(
                                          color: AppColors.primaryLight,
                                          fontSize: 10,
                                        ),
                                      ),
                                    ],
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
            ] else ...[
              Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 36),
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.cardBorder),
                        ),
                        child: const Icon(
                          Icons.accessibility_new,
                          size: 48,
                          color: AppColors.primaryLight,
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Chưa có outfit nào được phối',
                        style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w600, fontSize: 16),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Bấm "AI Stylist, Phối đồ ngay!" để xem người mẫu 3D mặc thử outfit được tối ưu theo thời tiết thực tế!',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
