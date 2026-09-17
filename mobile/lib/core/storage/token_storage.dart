import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class TokenStorage {
  static const _storage = FlutterSecureStorage();
  static const String _keyToken = 'jwt_token';
  static const String _keyUserEmail = 'user_email';
  static const String _keyUserName = 'user_name';

  static Future<void> saveToken(String token) async {
    try {
      await _storage.write(key: _keyToken, value: token);
    } catch (_) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_keyToken, token);
    }
  }

  static Future<String?> getToken() async {
    try {
      final token = await _storage.read(key: _keyToken);
      if (token != null) return token;
    } catch (_) {}
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyToken);
  }

  static Future<void> saveUserInfo({required String email, required String name}) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyUserEmail, email);
    await prefs.setString(_keyUserName, name);
  }

  static Future<Map<String, String?>> getUserInfo() async {
    final prefs = await SharedPreferences.getInstance();
    return {
      'email': prefs.getString(_keyUserEmail),
      'name': prefs.getString(_keyUserName),
    };
  }

  static Future<void> clear() async {
    try {
      await _storage.delete(key: _keyToken);
    } catch (_) {}
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyToken);
    await prefs.remove(_keyUserEmail);
    await prefs.remove(_keyUserName);
  }
}
