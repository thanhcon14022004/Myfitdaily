import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../core/constants/app_colors.dart';
import '../../models/clothing_model.dart';
import '../../providers/user_provider.dart';
import '../../providers/wardrobe_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/virtual_mannequin_widget.dart';

class OutfitStudioScreen extends StatefulWidget {
  const OutfitStudioScreen({super.key});

  @override
  State<OutfitStudioScreen> createState() => _OutfitStudioScreenState();
}

class _OutfitStudioScreenState extends State<OutfitStudioScreen> {
  int _selectedTopIndex = 0;
  int _selectedBottomIndex = 0;
  int _selectedShoesIndex = 0;

  @override
  Widget build(BuildContext context) {
    final wardrobe = Provider.of<WardrobeProvider>(context);
    final userProvider = Provider.of<UserProvider>(context);
    final profile = userProvider.profile;

    // Filter items by category
    final tops = wardrobe.clothes.where((i) => i.categoryId == 1 || i.categoryName.toLowerCase().contains('top')).toList();
    final bottoms = wardrobe.clothes.where((i) => i.categoryId == 2 || i.categoryName.toLowerCase().contains('bottom')).toList();
    final shoes = wardrobe.clothes.where((i) => i.categoryId == 5 || i.categoryName.toLowerCase().contains('shoe')).toList();

    final currentTop = tops.isNotEmpty && _selectedTopIndex < tops.length ? tops[_selectedTopIndex] : null;
    final currentBottom = bottoms.isNotEmpty && _selectedBottomIndex < bottoms.length ? bottoms[_selectedBottomIndex] : null;
    final currentShoes = shoes.isNotEmpty && _selectedShoesIndex < shoes.length ? shoes[_selectedShoesIndex] : null;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Phòng Thử Đồ & Studio 3D'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          children: [
            const Text(
              'Xoay 360° người mẫu để xem chi tiết outfit khi phối',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
            ),
            const SizedBox(height: 12),

            // Outfit Presets Card (1-tap to try on ready-made outfits from Database)
            Container(
              margin: const EdgeInsets.only(bottom: 14),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF2C2208), Color(0xFF151924)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFD4AF37).withValues(alpha: 0.5)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.star, color: Color(0xFFF3D98A), size: 16),
                      SizedBox(width: 6),
                      Text(
                        'Bộ Phối Mẫu Sẵn Có (1-Chạm Thử Đồ)',
                        style: TextStyle(color: Color(0xFFFDE68A), fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildPresetChip(
                          label: '🔥 Frozen.HN Streetwear',
                          onTap: () {
                            final topIdx = tops.indexWhere((t) => t.name.toLowerCase().contains('frozen') || t.name.toLowerCase().contains('sweatshirt'));
                            final btmIdx = bottoms.indexWhere((b) => b.name.toLowerCase().contains('track') || b.name.toLowerCase().contains('sọc'));
                            final shIdx = shoes.indexWhere((s) => s.color.toLowerCase().contains('trắng') && s.color.toLowerCase().contains('đen'));
                            setState(() {
                              if (topIdx != -1) _selectedTopIndex = topIdx;
                              if (btmIdx != -1) _selectedBottomIndex = btmIdx;
                              if (shIdx != -1) _selectedShoesIndex = shIdx;
                            });
                          },
                        ),
                        const SizedBox(width: 8),
                        _buildPresetChip(
                          label: '✨ Smart Chic (Sơ mi + Jeans)',
                          onTap: () {
                            final topIdx = tops.indexWhere((t) => t.name.toLowerCase().contains('sơ mi') || t.color.toLowerCase().contains('trắng'));
                            final btmIdx = bottoms.indexWhere((b) => b.name.toLowerCase().contains('jeans') || b.color.toLowerCase().contains('denim'));
                            final shIdx = shoes.indexWhere((s) => s.name.toLowerCase().contains('sneaker') && !s.name.toLowerCase().contains('frozen'));
                            setState(() {
                              if (topIdx != -1) _selectedTopIndex = topIdx;
                              if (btmIdx != -1) _selectedBottomIndex = btmIdx;
                              if (shIdx != -1) _selectedShoesIndex = shIdx;
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // 1. Virtual Mannequin Stage (Interactive 3D Model)
            SizedBox(
              height: 450,
              child: VirtualMannequinWidget(
                topGarment: currentTop,
                bottomGarment: currentBottom,
                shoesGarment: currentShoes,
                bodyShape: profile?.bodyShape ?? 'Đồng hồ cát',
                gender: profile?.gender ?? 'Nữ',
                heightCm: profile?.height ?? 165,
                weightKg: profile?.weight ?? 52,
                chestCm: profile?.chest ?? (profile?.gender == 'Nam' ? 98 : 88),
                waistCm: profile?.waist ?? (profile?.gender == 'Nam' ? 78 : 64),
                hipsCm: profile?.hips ?? (profile?.gender == 'Nam' ? 95 : 92),
              ),
            ),
            const SizedBox(height: 20),

            // 2. Garment Selection Slots
            // Slot 1: Tops
            _buildSlotCard(
              title: 'ÁO (TOPS)',
              items: tops,
              currentIndex: _selectedTopIndex,
              onPrev: () => setState(() {
                if (_selectedTopIndex > 0) _selectedTopIndex--;
              }),
              onNext: () => setState(() {
                if (_selectedTopIndex < tops.length - 1) _selectedTopIndex++;
              }),
            ),
            const SizedBox(height: 14),

            // Slot 2: Bottoms
            _buildSlotCard(
              title: 'QUẦN / VÁY (BOTTOMS)',
              items: bottoms,
              currentIndex: _selectedBottomIndex,
              onPrev: () => setState(() {
                if (_selectedBottomIndex > 0) _selectedBottomIndex--;
              }),
              onNext: () => setState(() {
                if (_selectedBottomIndex < bottoms.length - 1) _selectedBottomIndex++;
              }),
            ),
            const SizedBox(height: 14),

            // Slot 3: Shoes
            _buildSlotCard(
              title: 'GIÀY (SHOES)',
              items: shoes,
              currentIndex: _selectedShoesIndex,
              onPrev: () => setState(() {
                if (_selectedShoesIndex > 0) _selectedShoesIndex--;
              }),
              onNext: () => setState(() {
                if (_selectedShoesIndex < shoes.length - 1) _selectedShoesIndex++;
              }),
            ),
            const SizedBox(height: 24),

            // Save Outfit Button
            CustomButton(
              text: 'Lưu bộ phối đồ này',
              icon: Icons.bookmark_border,
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Đã lưu outfit vào Bộ sưu tập yêu thích!'),
                    backgroundColor: AppColors.success,
                  ),
                );
              },
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildSlotCard({
    required String title,
    required List<ClothingItem> items,
    required int currentIndex,
    required VoidCallback onPrev,
    required VoidCallback onNext,
  }) {
    final hasItems = items.isNotEmpty;
    final currentItem = hasItems && currentIndex < items.length ? items[currentIndex] : null;

    return Container(
      height: 120,
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: AppColors.primaryLight,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1,
                ),
              ),
              if (hasItems)
                Text(
                  '${currentIndex + 1} / ${items.length}',
                  style: const TextStyle(color: AppColors.textMuted, fontSize: 11),
                ),
            ],
          ),
          const SizedBox(height: 6),
          Expanded(
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back_ios, size: 16),
                  color: currentIndex > 0 ? AppColors.textPrimary : AppColors.textMuted,
                  onPressed: currentIndex > 0 ? onPrev : null,
                ),
                Expanded(
                  child: currentItem != null
                      ? Row(
                          children: [
                            Container(
                              width: 65,
                              height: 65,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: AppColors.cardBorder),
                              ),
                              clipBehavior: Clip.antiAlias,
                              child: _buildItemThumbnail(currentItem.imageUrl),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    currentItem.name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      color: AppColors.textPrimary,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${currentItem.color} • ${currentItem.style}',
                                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        )
                      : const Center(
                          child: Text(
                            'Chưa có đồ mục này trong tủ',
                            style: TextStyle(color: AppColors.textMuted, fontSize: 12),
                          ),
                        ),
                ),
                IconButton(
                  icon: const Icon(Icons.arrow_forward_ios, size: 16),
                  color: (hasItems && currentIndex < items.length - 1) ? AppColors.textPrimary : AppColors.textMuted,
                  onPressed: (hasItems && currentIndex < items.length - 1) ? onNext : null,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildItemThumbnail(String url) {
    if (url.isEmpty) {
      return const Center(child: Icon(Icons.checkroom, color: AppColors.textMuted));
    }
    final isSvg = url.toLowerCase().endsWith('.svg');
    final isAsset = url.startsWith('assets/');

    if (isAsset) {
      if (isSvg) {
        return Padding(
          padding: const EdgeInsets.all(4),
          child: SvgPicture.asset(
            url,
            fit: BoxFit.contain,
          ),
        );
      } else {
        return Image.asset(
          url,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => const Center(
            child: Icon(Icons.checkroom, color: AppColors.textMuted),
          ),
        );
      }
    } else {
      if (isSvg) {
        return Padding(
          padding: const EdgeInsets.all(4),
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
          fit: BoxFit.cover,
          errorWidget: (_, __, ___) => const Center(
            child: Icon(Icons.checkroom, color: AppColors.textMuted),
          ),
        );
      }
    }
  }

  Widget _buildPresetChip({required String label, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: AppColors.primary.withValues(alpha: 0.2),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.primary.withValues(alpha: 0.5)),
        ),
        child: Text(
          label,
          style: const TextStyle(color: Color(0xFFFDE68A), fontSize: 11, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}
