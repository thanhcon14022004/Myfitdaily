import 'package:flutter/foundation.dart';

class ApiConstants {
  // Automatically uses localhost for Web (Chrome) and 10.0.2.2 for Android Emulator
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:5240/api';
    }
    return 'http://10.0.2.2:5240/api';
  }

  // Auth Endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';

  // Clothes Endpoints
  static const String clothes = '/clothes';
  static const String batchCreateClothes = '/clothes/batch-create';
  static const String categories = '/clothes/categories';

  // AI Stylist Endpoints
  static const String aiRecommend = '/ai/recommend-outfit';
  static const String aiScan = '/ai/scan-clothing';
  static const String aiScanOotd = '/ai/scan-ootd';
  static const String aiChat = '/ai/chat';
  static const String aiTrends = '/ai/trends';
  static const String aiHistories = '/ai/histories';

  // User Endpoints
  static const String userProfile = '/users/profile';
  static const String updateProfile = '/users/profile';

  // External APIs
  static const String geoJsUrl = 'https://get.geojs.io/v1/ip/geo.json';
  static const String openMeteoForecastUrl = 'https://api.open-meteo.com/v1/forecast';
}
