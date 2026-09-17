import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/wardrobe_provider.dart';
import '../../widgets/clothing_card.dart';
import 'add_clothing_screen.dart';
import 'ai_ootd_scanner_sheet.dart';

class WardrobeScreen extends StatefulWidget {
  const WardrobeScreen({super.key});

  @override
  State<WardrobeScreen> createState() => _WardrobeScreenState();
}

class _WardrobeScreenState extends State<WardrobeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<WardrobeProvider>(context, listen: false).init();
    });
  }

  void _confirmDelete(int id, String name) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Xác nhận xóa', style: TextStyle(color: AppColors.textPrimary)),
        content: Text(
          'Bạn có chắc chắn muốn xóa "$name" khỏi tủ đồ không?',
          style: const TextStyle(color: AppColors.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Hủy', style: TextStyle(color: AppColors.textMuted)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              Provider.of<WardrobeProvider>(context, listen: false).deleteClothing(id);
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: const Text('Xóa', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _openOotdScanner() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const AiOotdScannerSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final wardrobe = Provider.of<WardrobeProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Tủ đồ thông minh'),
        actions: [
          IconButton(
            icon: const Icon(Icons.document_scanner, color: Color(0xFFD4AF37)),
            tooltip: 'Quét OOTD bằng AI',
            onPressed: _openOotdScanner,
          ),
          IconButton(
            icon: const Icon(Icons.add_circle_outline, color: AppColors.primaryLight),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const AddClothingScreen()),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // AI OOTD Scanner Banner
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 10),
            child: InkWell(
              onTap: _openOotdScanner,
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF2C2208), Color(0xFF151924)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFD4AF37).withValues(alpha: 0.5)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.35),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFD4AF37).withValues(alpha: 0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.auto_awesome, color: Color(0xFFF3D98A), size: 20),
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '✨ Quét OOTD Bằng AI Vision',
                            style: TextStyle(
                              color: Color(0xFFFDE68A),
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            'Chụp 1 ảnh toàn thân ➔ AI tự bóc tách Áo, Quần, Giày',
                            style: TextStyle(color: AppColors.textSecondary, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.arrow_forward_ios, size: 14, color: Color(0xFFD4AF37)),
                  ],
                ),
              ),
            ),
          ),
          // Category Filter Chips
          SizedBox(
            height: 46,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                _buildCategoryChip(null, 'Tất cả', wardrobe.selectedCategoryId == null, wardrobe),
                ...wardrobe.categories.map((cat) {
                  final isSelected = wardrobe.selectedCategoryId == cat.id;
                  return _buildCategoryChip(cat.id, cat.name, isSelected, wardrobe);
                }),
              ],
            ),
          ),
          const SizedBox(height: 12),

          // Main Content
          Expanded(
            child: wardrobe.isLoading
                ? const Center(
                    child: CircularProgressIndicator(color: AppColors.primary),
                  )
                : wardrobe.clothes.isEmpty
                    ? const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.checkroom, size: 64, color: AppColors.textMuted),
                            SizedBox(height: 16),
                            Text(
                              'Không có món đồ nào',
                              style: TextStyle(
                                color: AppColors.textPrimary,
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            SizedBox(height: 6),
                            Text(
                              'Bấm dấu (+) để thêm đồ mới vào tủ nhé!',
                              style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: () => wardrobe.fetchClothes(),
                        color: AppColors.primary,
                        child: GridView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            childAspectRatio: 0.72,
                            crossAxisSpacing: 14,
                            mainAxisSpacing: 14,
                          ),
                          itemCount: wardrobe.clothes.length,
                          itemBuilder: (context, index) {
                            final item = wardrobe.clothes[index];
                            return ClothingCard(
                              item: item,
                              onDelete: () => _confirmDelete(item.id, item.name),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChip(int? id, String label, bool isSelected, WardrobeProvider provider) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (_) => provider.filterByCategory(id),
        backgroundColor: AppColors.surface,
        selectedColor: AppColors.primary.withValues(alpha: 0.25),
        labelStyle: TextStyle(
          color: isSelected ? AppColors.primaryLight : AppColors.textSecondary,
          fontSize: 12,
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: isSelected ? AppColors.primary : AppColors.cardBorder,
          ),
        ),
      ),
    );
  }
}
