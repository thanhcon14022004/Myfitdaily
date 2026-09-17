import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';
import '../navigation/main_nav_screen.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController(text: 'demo@myfitdaily.com');
  final _passwordController = TextEditingController(text: 'Password123!');
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final success = await authProvider.login(
      _emailController.text.trim(),
      _passwordController.text,
    );

    if (!mounted) return;

    if (success) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const MainNavScreen()),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(authProvider.errorMessage ?? 'Đăng nhập thất bại'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Logo / Branding
                  Center(
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withValues(alpha: 0.15),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.auto_awesome,
                        size: 48,
                        color: AppColors.primaryLight,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'MYFITDAILY',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Your Personal AI Stylist',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      color: AppColors.textSecondary,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Demo Accounts Selector Card
                  Container(
                    padding: const EdgeInsets.all(12),
                    margin: const EdgeInsets.only(bottom: 20),
                    decoration: BoxDecoration(
                      color: const Color(0xFFD4AF37).withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFD4AF37).withValues(alpha: 0.35)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.auto_awesome, size: 14, color: Color(0xFFD4AF37)),
                                SizedBox(width: 6),
                                Text(
                                  'TÀI KHOẢN DEMO CÓ SẴN',
                                  style: TextStyle(
                                    color: Color(0xFFF3D98A),
                                    fontSize: 10.5,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ],
                            ),
                            Text(
                              'Pass: Password123!',
                              style: TextStyle(color: Colors.white54, fontSize: 9.5),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            // Demo Nữ
                            Expanded(
                              child: InkWell(
                                onTap: () {
                                  setState(() {
                                    _emailController.text = 'demo@myfitdaily.com';
                                    _passwordController.text = 'Password123!';
                                  });
                                },
                                borderRadius: BorderRadius.circular(10),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 10),
                                  decoration: BoxDecoration(
                                    color: _emailController.text == 'demo@myfitdaily.com'
                                        ? const Color(0xFFD4AF37).withValues(alpha: 0.22)
                                        : Colors.white.withValues(alpha: 0.04),
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(
                                      color: _emailController.text == 'demo@myfitdaily.com'
                                          ? const Color(0xFFD4AF37)
                                          : Colors.white12,
                                      width: 1.2,
                                    ),
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          const Text(
                                            '👩 Demo Nữ',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 12,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          if (_emailController.text == 'demo@myfitdaily.com')
                                            const Icon(Icons.check_circle, size: 13, color: Color(0xFFD4AF37)),
                                        ],
                                      ),
                                      const SizedBox(height: 3),
                                      const Text(
                                        'demo@myfitdaily.com',
                                        style: TextStyle(color: Colors.white70, fontSize: 10),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      const SizedBox(height: 2),
                                      const Text(
                                        '165cm • 52kg • 88-64-92',
                                        style: TextStyle(color: Color(0xFFF3D98A), fontSize: 9.5),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),

                            // Demo Nam
                            Expanded(
                              child: InkWell(
                                onTap: () {
                                  setState(() {
                                    _emailController.text = 'test@myfitdaily.com';
                                    _passwordController.text = 'Password123!';
                                  });
                                },
                                borderRadius: BorderRadius.circular(10),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 10),
                                  decoration: BoxDecoration(
                                    color: _emailController.text == 'test@myfitdaily.com'
                                        ? const Color(0xFFD4AF37).withValues(alpha: 0.22)
                                        : Colors.white.withValues(alpha: 0.04),
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(
                                      color: _emailController.text == 'test@myfitdaily.com'
                                          ? const Color(0xFFD4AF37)
                                          : Colors.white12,
                                      width: 1.2,
                                    ),
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          const Text(
                                            '👨 Demo Nam',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 12,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          if (_emailController.text == 'test@myfitdaily.com')
                                            const Icon(Icons.check_circle, size: 13, color: Color(0xFFD4AF37)),
                                        ],
                                      ),
                                      const SizedBox(height: 3),
                                      const Text(
                                        'test@myfitdaily.com',
                                        style: TextStyle(color: Colors.white70, fontSize: 10),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      const SizedBox(height: 2),
                                      const Text(
                                        '178cm • 70kg • 98-78-95',
                                        style: TextStyle(color: Color(0xFFF3D98A), fontSize: 9.5),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Email
                  CustomTextField(
                    controller: _emailController,
                    label: 'Email',
                    hint: 'nhapemail@example.com',
                    prefixIcon: Icons.email_outlined,
                    keyboardType: TextInputType.emailAddress,
                    validator: (val) {
                      if (val == null || val.isEmpty) return 'Vui lòng nhập email';
                      if (!val.contains('@')) return 'Email không hợp lệ';
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Password
                  CustomTextField(
                    controller: _passwordController,
                    label: 'Mật khẩu',
                    hint: '••••••••',
                    prefixIcon: Icons.lock_outline,
                    obscureText: _obscurePassword,
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword ? Icons.visibility_off : Icons.visibility,
                        color: AppColors.textMuted,
                        size: 20,
                      ),
                      onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                    ),
                    validator: (val) {
                      if (val == null || val.isEmpty) return 'Vui lòng nhập mật khẩu';
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),

                  // Login Button
                  CustomButton(
                    text: 'Đăng nhập',
                    isLoading: auth.isLoading,
                    onPressed: _handleLogin,
                  ),
                  const SizedBox(height: 16),

                  // Switch to Register
                  Wrap(
                    alignment: WrapAlignment.center,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      const Text(
                        'Chưa có tài khoản? ',
                        style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const RegisterScreen()),
                          );
                        },
                        child: const Text(
                          'Đăng ký ngay',
                          style: TextStyle(
                            color: AppColors.primaryLight,
                            fontWeight: FontWeight.w600,
                            fontSize: 13,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
