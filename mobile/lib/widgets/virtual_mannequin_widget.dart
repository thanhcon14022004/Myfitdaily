import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:model_viewer_plus/model_viewer_plus.dart';
import '../models/clothing_model.dart';

class VirtualMannequinWidget extends StatefulWidget {
  final ClothingItem? topGarment;
  final ClothingItem? bottomGarment;
  final ClothingItem? shoesGarment;
  final ClothingItem? outerwearGarment;
  final String bodyShape;
  final String gender;
  final double heightCm;
  final double weightKg;
  final double chestCm;
  final double waistCm;
  final double hipsCm;
  final bool showControls;
  final bool compact;
  final ValueChanged<Map<String, double>>? onMeasurementsChanged;

  const VirtualMannequinWidget({
    super.key,
    this.topGarment,
    this.bottomGarment,
    this.shoesGarment,
    this.outerwearGarment,
    this.bodyShape = 'Đồng hồ cát',
    this.gender = 'Nữ',
    this.heightCm = 165,
    this.weightKg = 52,
    this.chestCm = 88,
    this.waistCm = 64,
    this.hipsCm = 92,
    this.showControls = true,
    this.compact = false,
    this.onMeasurementsChanged,
  });

  @override
  State<VirtualMannequinWidget> createState() => _VirtualMannequinWidgetState();
}

class _VirtualMannequinWidgetState extends State<VirtualMannequinWidget> {
  bool _isAutoRotating = true;
  String _active3dModelType = 'auto'; // 'auto', 'male', 'female', 'mannequin'

  // Active adjustable state
  late String _activeGender;
  late String _activeBodyShape;
  late double _heightCm;
  late double _weightKg;
  late double _chestCm;
  late double _waistCm;
  late double _hipsCm;

  @override
  void initState() {
    super.initState();
    _activeGender = widget.gender;
    _activeBodyShape = widget.bodyShape;
    _heightCm = widget.heightCm;
    _weightKg = widget.weightKg;
    _chestCm = widget.chestCm;
    _waistCm = widget.waistCm;
    _hipsCm = widget.hipsCm;
  }

  @override
  void didUpdateWidget(covariant VirtualMannequinWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.gender != widget.gender) _activeGender = widget.gender;
    if (oldWidget.bodyShape != widget.bodyShape) _activeBodyShape = widget.bodyShape;
    if (oldWidget.heightCm != widget.heightCm) _heightCm = widget.heightCm;
    if (oldWidget.weightKg != widget.weightKg) _weightKg = widget.weightKg;
    if (oldWidget.chestCm != widget.chestCm) _chestCm = widget.chestCm;
    if (oldWidget.waistCm != widget.waistCm) _waistCm = widget.waistCm;
    if (oldWidget.hipsCm != widget.hipsCm) _hipsCm = widget.hipsCm;
  }

  String _getActiveGlbModelSrc(bool isMale) {
    String assetPath;
    if (_active3dModelType == 'mannequin') {
      assetPath = 'assets/models/mannequin_studio.glb';
    } else if (_active3dModelType == 'female') {
      assetPath = 'assets/models/avatar_female.glb';
    } else if (_active3dModelType == 'male') {
      assetPath = 'assets/models/outfit_streetwear.glb';
    } else {
      // Dynamic outfit fitting: map selected garments to 3D fitted models
      final topName = widget.topGarment?.name.toLowerCase() ?? '';
      final topColor = widget.topGarment?.color.toLowerCase() ?? '';
      final btmName = widget.bottomGarment?.name.toLowerCase() ?? '';
      final btmColor = widget.bottomGarment?.color.toLowerCase() ?? '';

      // Priority 1: Streetwear Sweater + Trackpants with Stripes + Retro Sneakers
      if (topName.contains('sweater') ||
          topName.contains('áo len') ||
          topName.contains('sweatshirt') ||
          topName.contains('hoodie') ||
          topName.contains('dệt kim') ||
          topName.contains('frozen') ||
          topName.contains('nỉ') ||
          topColor.contains('navy') ||
          btmName.contains('track') ||
          btmName.contains('sọc') ||
          btmName.contains('thun') ||
          btmName.contains('quần dài') ||
          btmName.contains('thể thao')) {
        // Frozen.HN Streetwear: Navy Sweater + Black Trackpants (white stripes) + Retro Sneakers
        assetPath = isMale ? 'assets/models/outfit_streetwear.glb' : 'assets/models/avatar_female.glb';
      } else if (topName.contains('sơ mi') ||
          topColor.contains('trắng') ||
          btmName.contains('jeans') ||
          btmColor.contains('denim')) {
        // Smart Chic: White silk shirt + Denim jeans + Sneakers
        assetPath = isMale ? 'assets/models/outfit_smartchic.glb' : 'assets/models/avatar_female.glb';
      } else if (topName.contains('thun') ||
          topColor.contains('đen') ||
          btmName.contains('tây')) {
        // Casual street: Black boxy tee + Black trousers
        assetPath = isMale ? 'assets/models/outfit_casual.glb' : 'assets/models/avatar_female.glb';
      } else {
        assetPath = isMale ? 'assets/models/outfit_streetwear.glb' : 'assets/models/avatar_female.glb';
      }
    }

    // On Flutter Web the model-viewer runs inside a platform view iframe.
    // Relative asset paths are not resolved correctly from that context, so
    // we must provide an absolute HTTP URL using the current page origin.
    if (kIsWeb) {
      final origin = Uri.base.origin;
      return '$origin/$assetPath';
    }
    return assetPath;
  }

  void _openMeasurementEditor(BuildContext context) {
    double tempHeight = _heightCm;
    double tempWeight = _weightKg;
    double tempChest = _chestCm;
    double tempWaist = _waistCm;
    double tempHips = _hipsCm;
    String tempShape = _activeBodyShape;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (sheetCtx, setSheetState) {
          final bmi = tempWeight / ((tempHeight / 100) * (tempHeight / 100));
          String bmiStatus = 'Cân đối';
          Color bmiColor = const Color(0xFF10B981);
          if (bmi < 18.5) {
            bmiStatus = 'Gầy nhẹ';
            bmiColor = const Color(0xFF3B82F6);
          } else if (bmi >= 23 && bmi < 25) {
            bmiStatus = 'Hơi đầy đặn';
            bmiColor = const Color(0xFFF59E0B);
          } else if (bmi >= 25) {
            bmiStatus = 'Thừa cân';
            bmiColor = const Color(0xFFEF4444);
          }

          return Container(
            padding: const EdgeInsets.fromLTRB(24, 20, 24, 30),
            decoration: const BoxDecoration(
              color: Color(0xFF141824),
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              border: Border(top: BorderSide(color: Color(0xFFD4AF37), width: 1.5)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Center(
                  child: Container(
                    width: 44,
                    height: 4,
                    decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2)),
                  ),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFD4AF37).withValues(alpha: 0.18),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.straighten, color: Color(0xFFD4AF37), size: 20),
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Tùy Chỉnh Thông Số Vóc Dáng', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                          Text('Đồng bộ tỷ lệ nhân trắc học lên người mẫu 3D', style: TextStyle(color: Colors.white60, fontSize: 11)),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(color: bmiColor.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(20), border: Border.all(color: bmiColor.withValues(alpha: 0.5))),
                      child: Text('BMI ${bmi.toStringAsFixed(1)} • $bmiStatus', style: TextStyle(color: bmiColor, fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _buildSliderRow(label: 'Chiều cao', value: tempHeight, unit: 'cm', min: 140, max: 200, onChanged: (v) => setSheetState(() => tempHeight = v)),
                _buildSliderRow(label: 'Cân nặng', value: tempWeight, unit: 'kg', min: 38, max: 120, onChanged: (v) => setSheetState(() => tempWeight = v)),
                _buildSliderRow(label: 'Vòng 1 (Ngực)', value: tempChest, unit: 'cm', min: 70, max: 130, onChanged: (v) => setSheetState(() => tempChest = v)),
                _buildSliderRow(label: 'Vòng 2 (Eo)', value: tempWaist, unit: 'cm', min: 50, max: 110, onChanged: (v) => setSheetState(() => tempWaist = v)),
                _buildSliderRow(label: 'Vòng 3 (Mông)', value: tempHips, unit: 'cm', min: 70, max: 130, onChanged: (v) => setSheetState(() => tempHips = v)),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 46,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFD4AF37),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () {
                      setState(() {
                        _heightCm = tempHeight;
                        _weightKg = tempWeight;
                        _chestCm = tempChest;
                        _waistCm = tempWaist;
                        _hipsCm = tempHips;
                        _activeBodyShape = tempShape;
                      });
                      widget.onMeasurementsChanged?.call({
                        'height': _heightCm,
                        'weight': _weightKg,
                        'chest': _chestCm,
                        'waist': _waistCm,
                        'hips': _hipsCm,
                      });
                      Navigator.pop(ctx);
                    },
                    child: const Text('Áp Dụng Thông Số Mới', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 15)),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildSliderRow({
    required String label,
    required double value,
    required String unit,
    required double min,
    required double max,
    required ValueChanged<double> onChanged,
  }) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: const TextStyle(color: Colors.white70, fontSize: 13)),
            Text('${value.round()} $unit', style: const TextStyle(color: Color(0xFFD4AF37), fontWeight: FontWeight.bold, fontSize: 14)),
          ],
        ),
        SliderTheme(
          data: SliderThemeData(
            activeTrackColor: const Color(0xFFD4AF37),
            inactiveTrackColor: Colors.white12,
            thumbColor: const Color(0xFFD4AF37),
            overlayColor: const Color(0xFFD4AF37).withValues(alpha: 0.2),
            trackHeight: 3,
            thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
          ),
          child: Slider(value: value.clamp(min, max), min: min, max: max, onChanged: onChanged),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isMale = _activeGender.toLowerCase().contains('nam') || _activeGender.toLowerCase().contains('male');
    final activeGlb = _getActiveGlbModelSrc(isMale);

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: const Color(0xFF0C101A),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFD4AF37).withValues(alpha: 0.35), width: 1.2),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.6), blurRadius: 24, offset: const Offset(0, 8)),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          // 1. TOP HEADER CONTROLS
          if (widget.showControls) ...[
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.5),
                border: const Border(bottom: BorderSide(color: Color(0xFF222838))),
              ),
              child: Column(
                children: [
                  // Row 1: 3D Engine Badge + Model Selector + AutoRotate Toggle
                  Row(
                    children: [
                      // 3D Tag
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(colors: [Color(0xFFD4AF37), Color(0xFFF3D98A)]),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.view_in_ar, size: 14, color: Colors.black),
                            SizedBox(width: 4),
                            Text('REAL 3D', style: TextStyle(color: Colors.black, fontWeight: FontWeight.w900, fontSize: 10)),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),

                      // Model Switcher Chips
                      Expanded(
                        child: SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: [
                              _buildModelChip(
                                label: '👕 Outfit 3D',
                                isSelected: _active3dModelType == 'auto',
                                onTap: () => setState(() => _active3dModelType = 'auto'),
                              ),
                              const SizedBox(width: 6),
                              _buildModelChip(
                                label: '🕺 Nam Châu Á',
                                isSelected: _active3dModelType == 'male',
                                onTap: () => setState(() => _active3dModelType = 'male'),
                              ),
                              const SizedBox(width: 6),
                              _buildModelChip(
                                label: '💃 Nữ Châu Á',
                                isSelected: _active3dModelType == 'female',
                                onTap: () => setState(() => _active3dModelType = 'female'),
                              ),
                              const SizedBox(width: 6),
                              _buildModelChip(
                                label: '🗿 Tượng Studio',
                                isSelected: _active3dModelType == 'mannequin',
                                onTap: () => setState(() => _active3dModelType = 'mannequin'),
                              ),
                            ],
                          ),
                        ),
                      ),

                      // Auto-rotate Button
                      IconButton(
                        icon: Icon(
                          _isAutoRotating ? Icons.pause_circle_filled : Icons.play_circle_filled,
                          color: const Color(0xFFD4AF37),
                          size: 22,
                        ),
                        tooltip: _isAutoRotating ? 'Dừng tự xoay' : 'Bật tự xoay 360°',
                        onPressed: () => setState(() => _isAutoRotating = !_isAutoRotating),
                      ),
                    ],
                  ),

                  const SizedBox(height: 8),

                  // Row 2: Measurements quick stats & Edit action
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${_heightCm.round()}cm • ${_weightKg.round()}kg • 3 vòng: ${_chestCm.round()}-${_waistCm.round()}-${_hipsCm.round()}cm',
                        style: const TextStyle(color: Color(0xFFF3D98A), fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                      InkWell(
                        onTap: () => _openMeasurementEditor(context),
                        borderRadius: BorderRadius.circular(8),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFFD4AF37).withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0xFFD4AF37).withValues(alpha: 0.4)),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.tune, color: Color(0xFFD4AF37), size: 12),
                              SizedBox(width: 4),
                              Text('Sửa số đo', style: TextStyle(color: Color(0xFFFDE68A), fontSize: 11, fontWeight: FontWeight.w600)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],

          // 2. MAIN 3D SHOWROOM STAGE
          Expanded(
            child: Stack(
              children: [
                // Real 3D Model Viewer with Google WebGL Engine
                Positioned.fill(
                  child: ModelViewer(
                    key: ValueKey(activeGlb + (_isAutoRotating ? '_spin' : '_pause')),
                    src: activeGlb,
                    alt: 'MyFitDaily 3D Fashion Avatar',
                    autoRotate: _isAutoRotating,
                    autoRotateDelay: 0,
                    rotationPerSecond: '20deg',
                    cameraControls: true,
                    backgroundColor: Colors.transparent,
                    shadowIntensity: 1.0,
                    shadowSoftness: 1.0,
                    exposure: 1.1,
                    cameraOrbit: '0deg 75deg 105%',
                    cameraTarget: '0m 0.95m 0m',
                    fieldOfView: '32deg',
                    interactionPrompt: InteractionPrompt.none,
                  ),
                ),

                // Subtle Studio Top Spotlight
                Positioned(
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 120,
                  child: IgnorePointer(
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: RadialGradient(
                          center: const Alignment(0, -0.9),
                          radius: 1.2,
                          colors: [
                            const Color(0xFFD4AF37).withValues(alpha: 0.15),
                            Colors.transparent,
                          ],
                        ),
                      ),
                    ),
                  ),
                ),

                // Interactive 3D Gesture Hint (Bottom)
                Positioned(
                  bottom: 12,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.65),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.white12),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.touch_app, color: Color(0xFFD4AF37), size: 14),
                          SizedBox(width: 6),
                          Text(
                            'Chạm vuốt xoay 360° • Zoom 2 ngón tay xem vải',
                            style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.w500),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildModelChip({required String label, required bool isSelected, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFD4AF37).withValues(alpha: 0.25) : Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: isSelected ? const Color(0xFFD4AF37) : Colors.white12),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? const Color(0xFFFDE68A) : Colors.white60,
            fontSize: 10,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}
