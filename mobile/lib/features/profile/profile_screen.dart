import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../models/user_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/user_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';
import '../auth/login_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _heightController = TextEditingController();
  final _weightController = TextEditingController();
  final _chestController = TextEditingController();
  final _waistController = TextEditingController();
  final _hipsController = TextEditingController();
  String _selectedBodyShape = 'Đồng hồ cát';

  final List<String> _bodyShapes = [
    'Đồng hồ cát',
    'Quả lê',
    'Quả táo',
    'Chữ nhật',
    'Tam giác ngược',
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadProfile();
    });
  }

  Future<void> _loadProfile() async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    await userProvider.fetchProfile();
    final p = userProvider.profile;
    if (p != null && mounted) {
      if (p.height != null) _heightController.text = p.height.toString();
      if (p.weight != null) _weightController.text = p.weight.toString();
      if (p.chest != null) _chestController.text = p.chest.toString();
      if (p.waist != null) _waistController.text = p.waist.toString();
      if (p.hips != null) _hipsController.text = p.hips.toString();
      if (p.bodyShape != null && _bodyShapes.contains(p.bodyShape)) {
        _selectedBodyShape = p.bodyShape!;
      }
      setState(() {});
    }
  }

  @override
  void dispose() {
    _heightController.dispose();
    _weightController.dispose();
    _chestController.dispose();
    _waistController.dispose();
    _hipsController.dispose();
    super.dispose();
  }

  Future<void> _handleSave() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final p = userProvider.profile;

    final currentName = (p?.fullName.isNotEmpty == true && p!.fullName != 'Người dùng')
        ? p.fullName
        : (auth.user?.fullName.isNotEmpty == true
            ? auth.user!.fullName
            : ((p?.gender == 'Nam') ? 'Gentleman (Demo Nam)' : 'Fashionista (Demo Nữ)'));

    final success = await userProvider.updateProfile(
      UpdateProfileRequest(
        fullName: currentName,
        height: double.tryParse(_heightController.text),
        weight: double.tryParse(_weightController.text),
        chest: double.tryParse(_chestController.text),
        waist: double.tryParse(_waistController.text),
        hips: double.tryParse(_hipsController.text),
        bodyShape: _selectedBodyShape,
      ),
    );

    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cập nhật chỉ số vóc dáng thành công!'), backgroundColor: AppColors.success),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(userProvider.errorMessage ?? 'Cập nhật thất bại'), backgroundColor: AppColors.error),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final userProvider = Provider.of<UserProvider>(context);
    final p = userProvider.profile;

    final displayName = (p?.fullName.isNotEmpty == true && p!.fullName != 'Người dùng')
        ? p.fullName
        : (auth.user?.fullName.isNotEmpty == true 
            ? auth.user!.fullName 
            : ((p?.gender == 'Nam' || auth.user?.email == 'test@myfitdaily.com') 
                ? 'Gentleman (Demo Nam)' 
                : 'Fashionista (Demo Nữ)'));

    final displayEmail = (p?.email.isNotEmpty == true)
        ? p!.email
        : (auth.user?.email.isNotEmpty == true 
            ? auth.user!.email 
            : ((p?.gender == 'Nam' || auth.user?.email == 'test@myfitdaily.com') ? 'test@myfitdaily.com' : 'demo@myfitdaily.com'));

    final displayPlan = (p?.subscriptionType.isNotEmpty == true)
        ? p!.subscriptionType.toUpperCase()
        : (auth.user?.subscriptionType.toUpperCase() ?? 'PREMIUM');

    final displayGender = p?.gender ?? (displayEmail.contains('test') ? 'Nam' : 'Nữ');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Hồ sơ & Vóc dáng'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: AppColors.error),
            tooltip: 'Đăng xuất',
            onPressed: () async {
              await auth.logout();
              if (context.mounted) {
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                  (route) => false,
                );
              }
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // User Header Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.cardBorder),
              ),
              child: Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: displayGender == 'Nam'
                            ? [const Color(0xFF3B82F6), const Color(0xFF1D4ED8)]
                            : [const Color(0xFFD4AF37), const Color(0xFFB8860B)],
                      ),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        displayName.isNotEmpty ? displayName[0].toUpperCase() : 'F',
                        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          displayName,
                          style: const TextStyle(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          displayEmail,
                          style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: const Color(0xFFD4AF37).withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: const Color(0xFFD4AF37).withValues(alpha: 0.4)),
                              ),
                              child: Text(
                                displayPlan,
                                style: const TextStyle(
                                  color: Color(0xFFF3D98A),
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.08),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                displayGender == 'Nam' ? '👨 Nam' : '👩 Nữ',
                                style: const TextStyle(
                                  color: Colors.white70,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Quick Demo Account Switcher Card
            Container(
              margin: const EdgeInsets.only(top: 10, bottom: 20),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFD4AF37).withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFD4AF37).withValues(alpha: 0.25)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.swap_horiz, size: 16, color: Color(0xFFD4AF37)),
                  const SizedBox(width: 6),
                  const Expanded(
                    child: Text(
                      'Đổi Demo nhanh:',
                      style: TextStyle(color: Color(0xFFF3D98A), fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                  InkWell(
                    onTap: () async {
                      await auth.login('demo@myfitdaily.com', 'Password123!');
                      userProvider.setDemoProfile(isMale: false);
                      _loadProfile();
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Đã chuyển sang Demo Nữ (demo@myfitdaily.com)'), backgroundColor: AppColors.success),
                        );
                      }
                    },
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: displayEmail == 'demo@myfitdaily.com'
                            ? const Color(0xFFD4AF37).withValues(alpha: 0.3)
                            : Colors.white10,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: const Color(0xFFD4AF37).withValues(alpha: 0.5)),
                      ),
                      child: const Text('👩 Nữ', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(width: 6),
                  InkWell(
                    onTap: () async {
                      await auth.login('test@myfitdaily.com', 'Password123!');
                      userProvider.setDemoProfile(isMale: true);
                      _loadProfile();
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Đã chuyển sang Demo Nam (test@myfitdaily.com)'), backgroundColor: AppColors.success),
                        );
                      }
                    },
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: displayEmail == 'test@myfitdaily.com'
                            ? const Color(0xFF3B82F6).withValues(alpha: 0.3)
                            : Colors.white10,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: const Color(0xFF3B82F6).withValues(alpha: 0.5)),
                      ),
                      child: const Text('👨 Nam', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),

            // Section: Body Measurements for AI
            const Text(
              'Chỉ số vóc dáng (Cho Gemini AI)',
              style: TextStyle(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              'Thông số chính xác giúp AI tư vấn trang phục tôn dáng chuẩn nhất',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
            ),
            const SizedBox(height: 16),

            // Height & Weight
            Row(
              children: [
                Expanded(
                  child: CustomTextField(
                    controller: _heightController,
                    label: 'Chiều cao (cm)',
                    hint: '168',
                    keyboardType: TextInputType.number,
                    prefixIcon: Icons.height,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: CustomTextField(
                    controller: _weightController,
                    label: 'Cân nặng (kg)',
                    hint: '55',
                    keyboardType: TextInputType.number,
                    prefixIcon: Icons.monitor_weight_outlined,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // 3-Bust/Waist/Hips Measurements
            Row(
              children: [
                Expanded(
                  child: CustomTextField(
                    controller: _chestController,
                    label: 'Vòng 1 (cm)',
                    hint: '86',
                    keyboardType: TextInputType.number,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: CustomTextField(
                    controller: _waistController,
                    label: 'Vòng 2 (cm)',
                    hint: '64',
                    keyboardType: TextInputType.number,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: CustomTextField(
                    controller: _hipsController,
                    label: 'Vòng 3 (cm)',
                    hint: '92',
                    keyboardType: TextInputType.number,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Body Shape
            const Text(
              'Dáng người của bạn',
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
                child: DropdownButton<String>(
                  value: _selectedBodyShape,
                  isExpanded: true,
                  dropdownColor: AppColors.surfaceElevated,
                  items: _bodyShapes.map((shape) {
                    return DropdownMenuItem<String>(
                      value: shape,
                      child: Text(shape, style: const TextStyle(color: AppColors.textPrimary)),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedBodyShape = val);
                  },
                ),
              ),
            ),
            const SizedBox(height: 28),

            // Save Button
            CustomButton(
              text: 'Cập nhật vóc dáng',
              isLoading: userProvider.isLoading,
              onPressed: _handleSave,
            ),
          ],
        ),
      ),
    );
  }
}
