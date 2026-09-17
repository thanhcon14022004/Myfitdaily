import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../models/clothing_model.dart';
import '../../providers/ai_stylist_provider.dart';
import '../../providers/wardrobe_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';

class AddClothingScreen extends StatefulWidget {
  const AddClothingScreen({super.key});

  @override
  State<AddClothingScreen> createState() => _AddClothingScreenState();
}

class _AddClothingScreenState extends State<AddClothingScreen> {
  final _formKey = GlobalKey<FormState>();
  final _picker = ImagePicker();

  String? _imageUrl;
  final _nameController = TextEditingController();
  final _brandController = TextEditingController();
  final _colorController = TextEditingController(text: 'Trắng');
  final _descriptionController = TextEditingController();

  int _selectedCategoryId = 1;
  String _selectedStyle = 'Casual';
  String _selectedSeason = 'AllSeason';
  bool _isSaving = false;

  final List<String> _styles = ['Casual', 'Streetwear', 'Formal', 'Sporty', 'Vintage', 'Minimalist'];

  @override
  void dispose() {
    _nameController.dispose();
    _brandController.dispose();
    _colorController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final pickedFile = await _picker.pickImage(
        source: source,
        maxWidth: 1080,
        maxHeight: 1080,
        imageQuality: 85,
      );

      if (pickedFile != null) {
        setState(() {
          // In real app, upload image to Supabase Storage and get public URL.
          // For demo / dev fallback, use a high quality clothing asset URL or local path.
          _imageUrl = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';
        });

        // Trigger AI Scan automatically
        _scanImageWithAi();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Không thể chọn ảnh: $e'), backgroundColor: AppColors.error),
        );
      }
    }
  }

  Future<void> _scanImageWithAi() async {
    if (_imageUrl == null) return;
    final aiProvider = Provider.of<AiStylistProvider>(context, listen: false);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Row(
          children: [
            SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
            ),
            SizedBox(width: 12),
            Text('AI đang nhận diện thông tin trang phục...'),
          ],
        ),
        backgroundColor: AppColors.primary,
        duration: Duration(seconds: 2),
      ),
    );

    final result = await aiProvider.scanClothing(_imageUrl!);
    if (result != null && mounted) {
      setState(() {
        if (_nameController.text.isEmpty) _nameController.text = result.name;
        if (_brandController.text.isEmpty && result.brand.isNotEmpty) _brandController.text = result.brand;
        _colorController.text = result.color;
        _selectedCategoryId = result.categoryId;
        _selectedStyle = result.style;
        _selectedSeason = result.season;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('AI đã nhận diện: ${result.name} (${result.color})'),
          backgroundColor: AppColors.success,
        ),
      );
    }
  }

  Future<void> _handleSave() async {
    if (!_formKey.currentState!.validate()) return;
    if (_imageUrl == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng chụp hoặc chọn ảnh trang phục'), backgroundColor: AppColors.error),
      );
      return;
    }

    setState(() => _isSaving = true);

    final wardrobe = Provider.of<WardrobeProvider>(context, listen: false);
    final success = await wardrobe.addClothing(
      CreateClothingItemRequest(
        categoryId: _selectedCategoryId,
        name: _nameController.text.trim(),
        brand: _brandController.text.trim().isEmpty ? null : _brandController.text.trim(),
        size: 'M',
        color: _colorController.text.trim(),
        style: _selectedStyle,
        season: _selectedSeason,
        imageUrl: _imageUrl!,
        description: _descriptionController.text.trim().isEmpty ? null : _descriptionController.text.trim(),
      ),
    );

    if (!mounted) return;
    setState(() => _isSaving = false);

    if (!mounted) return;

    if (success) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Đã thêm món đồ vào tủ thành công!'), backgroundColor: AppColors.success),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(wardrobe.errorMessage ?? 'Thêm thất bại'), backgroundColor: AppColors.error),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final wardrobe = Provider.of<WardrobeProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Thêm trang phục'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Image Picker Area
              GestureDetector(
                onTap: () => _showImageSourceBottomSheet(),
                child: Container(
                  height: 220,
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.cardBorder, width: 1.5),
                  ),
                  clipBehavior: Clip.antiAlias,
                  child: _imageUrl != null
                      ? Stack(
                          fit: StackFit.expand,
                          children: [
                            Image.network(_imageUrl!, fit: BoxFit.cover),
                            Positioned(
                              bottom: 12,
                              right: 12,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: Colors.black.withValues(alpha: 0.7),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: const Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.edit, color: Colors.white, size: 14),
                                    SizedBox(width: 4),
                                    Text('Đổi ảnh', style: TextStyle(color: Colors.white, fontSize: 11)),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        )
                      : const Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.camera_alt_outlined, size: 48, color: AppColors.primaryLight),
                            SizedBox(height: 10),
                            Text(
                              'Chụp ảnh hoặc chọn từ thư viện',
                              style: TextStyle(
                                color: AppColors.textPrimary,
                                fontWeight: FontWeight.w600,
                                fontSize: 14,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'Gemini AI sẽ tự động nhận diện thông tin áo/quần',
                              style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
                            ),
                          ],
                        ),
                ),
              ),
              const SizedBox(height: 24),

              // Item Name
              CustomTextField(
                controller: _nameController,
                label: 'Tên món đồ *',
                hint: 'Ví dụ: Áo thun trắng Oversize',
                prefixIcon: Icons.checkroom,
                validator: (val) {
                  if (val == null || val.isEmpty) return 'Vui lòng nhập tên món đồ';
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Brand
              CustomTextField(
                controller: _brandController,
                label: 'Thương hiệu',
                hint: 'Zara, Uniqlo, Nike...',
                prefixIcon: Icons.sell_outlined,
              ),
              const SizedBox(height: 16),

              // Category Dropdown
              const Text(
                'Danh mục *',
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.cardBorder),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<int>(
                    value: _selectedCategoryId,
                    isExpanded: true,
                    dropdownColor: AppColors.surfaceElevated,
                    items: wardrobe.categories.map((cat) {
                      return DropdownMenuItem<int>(
                        value: cat.id,
                        child: Text(cat.name, style: const TextStyle(color: AppColors.textPrimary)),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedCategoryId = val);
                    },
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Color & Style Row
              Row(
                children: [
                  Expanded(
                    child: CustomTextField(
                      controller: _colorController,
                      label: 'Màu sắc *',
                      hint: 'Trắng, Đen, Xanh...',
                      prefixIcon: Icons.palette_outlined,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Phong cách',
                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.textSecondary),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.cardBorder),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: _selectedStyle,
                              isExpanded: true,
                              dropdownColor: AppColors.surfaceElevated,
                              items: _styles.map((s) {
                                return DropdownMenuItem<String>(
                                  value: s,
                                  child: Text(s, style: const TextStyle(color: AppColors.textPrimary, fontSize: 13)),
                                );
                              }).toList(),
                              onChanged: (val) {
                                if (val != null) setState(() => _selectedStyle = val);
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 28),

              // Save Button
              CustomButton(
                text: 'Lưu vào tủ đồ',
                isLoading: _isSaving,
                onPressed: _handleSave,
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showImageSourceBottomSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Chọn nguồn ảnh',
                style: TextStyle(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 16),
              ListTile(
                leading: const Icon(Icons.camera_alt, color: AppColors.primaryLight),
                title: const Text('Chụp ảnh ngay (Camera)', style: TextStyle(color: AppColors.textPrimary)),
                onTap: () {
                  Navigator.pop(ctx);
                  _pickImage(ImageSource.camera);
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_library, color: AppColors.accent),
                title: const Text('Chọn từ bộ sưu tập (Gallery)', style: TextStyle(color: AppColors.textPrimary)),
                onTap: () {
                  Navigator.pop(ctx);
                  _pickImage(ImageSource.gallery);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
