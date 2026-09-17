import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/constants/app_colors.dart';
import 'core/theme/app_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/wardrobe_provider.dart';
import 'providers/ai_stylist_provider.dart';
import 'providers/user_provider.dart';
import 'providers/weather_provider.dart';
import 'features/auth/login_screen.dart';
import 'features/navigation/main_nav_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyFitDailyApp());
}

class MyFitDailyApp extends StatelessWidget {
  const MyFitDailyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()..checkAuthStatus()),
        ChangeNotifierProvider(create: (_) => WardrobeProvider()),
        ChangeNotifierProvider(create: (_) => AiStylistProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => WeatherProvider()..fetchWeather()),
      ],
      child: MaterialApp(
        title: 'MYFITDAILY',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        home: const AuthGate(),
      ),
    );
  }
}

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    if (auth.isLoading) {
      return const Scaffold(
        backgroundColor: AppColors.background,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.auto_awesome, size: 56, color: AppColors.primaryLight),
              SizedBox(height: 20),
              CircularProgressIndicator(color: AppColors.primary),
            ],
          ),
        ),
      );
    }

    if (auth.isAuthenticated) {
      return const MainNavScreen();
    }

    return const LoginScreen();
  }
}
