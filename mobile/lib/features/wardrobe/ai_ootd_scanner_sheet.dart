import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../../core/constants/app_colors.dart';
import '../../models/clothing_model.dart';
import '../../models/ootd_scan_model.dart';
import '../../providers/wardrobe_provider.dart';
import '../../services/clothing_service.dart';

class AiOotdScannerSheet extends StatefulWidget {
  const AiOotdScannerSheet({super.key});

  @override
  State<AiOotdScannerSheet> createState() => _AiOotdScannerSheetState();
}

class _AiOotdScannerSheetState extends State<AiOotdScannerSheet> {
  final ClothingService _clothingService = ClothingService();
  final ImagePicker _picker = ImagePicker();

  String? _selectedImage;
  String _genderHint = 'nam';
  final TextEditingController _hintController = TextEditingController();

  bool _isAnalyzing = false;
  bool _isSaving = false;
  ScanOotdResult? _scanResult;

  // Demo OOTD images for 1-tap testing
  final List<Map<String, String>> _demoOotds = [
    {
      'name': 'OOTD Nam Lịch Lãm',
      'gender': 'nam',
      'asset': 'assets/mannequin_male.jpg',
      'hint': 'Outfit công sở smart casual gồm sơ mi, quần jeans, sneaker'
    },
    {
      'name': 'OOTD Nữ Thanh Lịch',
      'gender': 'nu',
      'asset': 'assets/mannequin_female.jpg',
      'hint': 'Outfit thanh lịch dự tiệc dạo phố'
    },
  ];

  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? photo = await _picker.pickImage(
        source: source,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );
      if (photo != null) {
        final bytes = await photo.readAsBytes();
        final base64String = 'data:image/jpeg;base64,${base64Encode(bytes)}';
        setState(() {
          _selectedImage = base64String;
          _scanResult = null;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Không thể tải ảnh: $e'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  Future<void> _handleScanOotd() async {
    if (_selectedImage == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng chọn hoặc chụp ảnh OOTD toàn thân'), backgroundColor: AppColors.error),
      );
      return;
    }

    setState(() {
      _isAnalyzing = true;
      _scanResult = null;
    });

    try {
      final result = await _clothingService.scanOotd(
        imageUrl: _selectedImage!,
        hint: _hintController.text.trim().isEmpty ? null : _hintController.text.trim(),
        genderHint: _genderHint,
      );

      if (mounted) {
        setState(() {
          _isAnalyzing = false;
          _scanResult = result;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isAnalyzing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi phân tích: $e'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  Future<void> _handleSaveSelectedItems() async {
    if (_scanResult == null) return;
    final selectedItems = _scanResult!.items.where((i) => i.isSelected).toList();

    if (selectedItems.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng chọn ít nhất 1 món đồ để thêm vào tủ'), backgroundColor: AppColors.error),
      );
      return;
    }

    setState(() => _isSaving = true);

    final requests = selectedItems.map((item) {
      return CreateClothingItemRequest(
        categoryId: item.categoryId,
        name: item.name,
        brand: item.brand.isEmpty ? null : item.brand,
        size: item.size,
        color: item.color,
        style: item.style,
        season: item.season,
        imageUrl: item.imageUrl,
        description: item.description.isEmpty ? null : item.description,
      );
    }).toList();

    final wardrobe = Provider.of<WardrobeProvider>(context, listen: false);
    final success = await wardrobe.batchAddClothing(requests);

    setState(() => _isSaving = false);

    if (mounted) {
      if (success) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✨ Đã thêm thành công ${selectedItems.length} món đồ từ ảnh OOTD vào tủ đồ!'),
            backgroundColor: AppColors.success,
            duration: const Duration(seconds: 3),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Thêm vào tủ đồ thất bại, vui lòng thử lại'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.92),
      decoration: const BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag handle
          Container(
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            width: 44,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.white24,
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.document_scanner, color: AppColors.primaryLight, size: 22),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Quét OOTD Bằng AI Vision',
                        style: TextStyle(color: AppColors.textPrimary, fontSize: 17, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        'Chụp ảnh toàn thân ➔ Tự động bóc tách Áo/Quần/Giày',
                        style: TextStyle(color: AppColors.textSecondary, fontSize: 11),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: AppColors.textMuted),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          const Divider(color: AppColors.cardBorder, height: 1),

          // Content body
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // 1. Photo Preview / Picker Area
                  _buildPhotoSelector(),
                  const SizedBox(height: 16),

                  // 2. Gender & Hint Inputs
                  _buildFilterControls(),
                  const SizedBox(height: 20),

                  // 3. Scan Button
                  SizedBox(
                    height: 50,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFD4AF37),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: _isAnalyzing ? null : _handleScanOotd,
                      icon: _isAnalyzing
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black),
                            )
                          : const Icon(Icons.auto_awesome, color: Colors.black),
                      label: Text(
                        _isAnalyzing ? 'AI Đang Bóc Tách Trang Phục...' : 'Phân Tích OOTD Bằng AI',
                        style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                    ),
                  ),

                  // 4. Scan Results Area
                  if (_scanResult != null) ...[
                    const SizedBox(height: 24),
                    _buildResultOverview(),
                    const SizedBox(height: 16),
                    _buildDetectedItemsList(),
                  ],
                ],
              ),
            ),
          ),

          // Bottom Confirm Action
          if (_scanResult != null && _scanResult!.items.isNotEmpty)
            _buildBottomSaveBar(),
        ],
      ),
    );
  }

  Widget _buildPhotoSelector() {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.cardBorder),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          if (_selectedImage != null) ...[
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: SizedBox(
                height: 180,
                width: double.infinity,
                child: _selectedImage!.startsWith('assets/')
                    ? Image.asset(_selectedImage!, fit: BoxFit.contain)
                    : Image.network(_selectedImage!, fit: BoxFit.contain, errorBuilder: (_, __, ___) => const Center(child: Icon(Icons.checkroom, size: 40))),
              ),
            ),
            const SizedBox(height: 12),
          ],

          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.primaryLight,
                    side: const BorderSide(color: AppColors.primary),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  onPressed: () => _pickImage(ImageSource.camera),
                  icon: const Icon(Icons.camera_alt, size: 18),
                  label: const Text('Chụp ảnh', style: TextStyle(fontSize: 12)),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: AppColors.cardBorder),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  onPressed: () => _pickImage(ImageSource.gallery),
                  icon: const Icon(Icons.photo_library, size: 18),
                  label: const Text('Thư viện', style: TextStyle(fontSize: 12)),
                ),
              ),
            ],
          ),

          const SizedBox(height: 10),
          const Align(
            alignment: Alignment.centerLeft,
            child: Text('Hoặc chọn ảnh mẫu OOTD để thử:', style: TextStyle(color: AppColors.textMuted, fontSize: 11)),
          ),
          const SizedBox(height: 6),
          Row(
            children: _demoOotds.map((demo) {
              final isSelected = _selectedImage == demo['asset'];
              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: InkWell(
                    onTap: () {
                      setState(() {
                        _selectedImage = demo['asset'];
                        _genderHint = demo['gender']!;
                        _hintController.text = demo['hint']!;
                        _scanResult = null;
                      });
                    },
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.primary.withValues(alpha: 0.25) : AppColors.surfaceElevated,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: isSelected ? AppColors.primary : Colors.transparent),
                      ),
                      child: Text(
                        demo['name']!,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: isSelected ? AppColors.primaryLight : AppColors.textSecondary,
                          fontSize: 11,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterControls() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Text('Giới tính người mặc:', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
            const Spacer(),
            ChoiceChip(
              label: const Text('👨 Nam'),
              selected: _genderHint == 'nam',
              onSelected: (_) => setState(() => _genderHint = 'nam'),
              backgroundColor: AppColors.surface,
              selectedColor: AppColors.primary.withValues(alpha: 0.3),
            ),
            const SizedBox(width: 8),
            ChoiceChip(
              label: const Text('👩 Nữ'),
              selected: _genderHint == 'nu',
              onSelected: (_) => setState(() => _genderHint = 'nu'),
              backgroundColor: AppColors.surface,
              selectedColor: AppColors.primary.withValues(alpha: 0.3),
            ),
          ],
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _hintController,
          style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
          decoration: InputDecoration(
            hintText: 'Gợi ý cho AI (VD: Outfit công sở, Đi chơi, Đồ thể thao...)',
            hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 12),
            filled: true,
            fillColor: AppColors.surface,
            prefixIcon: const Icon(Icons.lightbulb_outline, size: 18, color: AppColors.primaryLight),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.cardBorder)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.cardBorder)),
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          ),
        ),
      ],
    );
  }

  Widget _buildResultOverview() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1E2333),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFD4AF37).withValues(alpha: 0.35)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFD4AF37).withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  _scanResult!.overallStyle,
                  style: const TextStyle(color: Color(0xFFF3D98A), fontWeight: FontWeight.bold, fontSize: 12),
                ),
              ),
              const Spacer(),
              Text(
                'Nguồn: ${_scanResult!.aiModelUsed}',
                style: const TextStyle(color: AppColors.textMuted, fontSize: 11),
              ),
            ],
          ),
          if (_scanResult!.ootdDescription.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              _scanResult!.ootdDescription,
              style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, height: 1.3),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDetectedItemsList() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Món đồ bóc tách được (${_scanResult!.items.length})',
              style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14),
            ),
            TextButton(
              onPressed: () {
                final allSelected = _scanResult!.items.every((i) => i.isSelected);
                setState(() {
                  for (var i in _scanResult!.items) {
                    i.isSelected = !allSelected;
                  }
                });
              },
              child: Text(
                _scanResult!.items.every((i) => i.isSelected) ? 'Bỏ chọn tất cả' : 'Chọn tất cả',
                style: const TextStyle(color: AppColors.primaryLight, fontSize: 12),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ..._scanResult!.items.map((item) => _buildItemCard(item)),
      ],
    );
  }

  Widget _buildItemCard(DetectedOotdItem item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: item.isSelected ? AppColors.primary : AppColors.cardBorder,
          width: item.isSelected ? 1.5 : 1,
        ),
      ),
      child: Row(
        children: [
          Checkbox(
            value: item.isSelected,
            activeColor: AppColors.primary,
            checkColor: Colors.black,
            onChanged: (val) => setState(() => item.isSelected = val ?? false),
          ),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Container(
              width: 55,
              height: 55,
              color: AppColors.surfaceElevated,
              padding: const EdgeInsets.all(4),
              child: item.imageUrl.toLowerCase().endsWith('.svg')
                  ? SvgPicture.asset(item.imageUrl, fit: BoxFit.contain)
                  : Image.network(item.imageUrl, fit: BoxFit.cover, errorBuilder: (_, __, ___) => const Icon(Icons.checkroom, color: AppColors.textMuted)),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceElevated,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        item.categoryName,
                        style: const TextStyle(color: AppColors.primaryLight, fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ),
                    if (item.brand.isNotEmpty) ...[
                      const SizedBox(width: 6),
                      Text(item.brand, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
                    ],
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  item.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 13),
                ),
                const SizedBox(height: 2),
                Text(
                  '${item.color} • Size ${item.size} • ${item.style}',
                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomSaveBar() {
    final count = _scanResult!.items.where((i) => i.isSelected).length;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.cardBorder)),
      ),
      child: SafeArea(
        child: SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFD4AF37),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: (count == 0 || _isSaving) ? null : _handleSaveSelectedItems,
            icon: _isSaving
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black),
                  )
                : const Icon(Icons.add_task, color: Colors.black),
            label: Text(
              _isSaving ? 'Đang Lưu Vào Tủ Đồ...' : 'Thêm $count Món Đã Chọn Vào Tủ Đồ',
              style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 14),
            ),
          ),
        ),
      ),
    );
  }
}
