import 'package:flutter/material.dart';
import '../core/network/api_client.dart';
import '../models/auth_model.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();

  bool _isLoading = false;
  bool _isAuthenticated = false;
  String? _errorMessage;
  AuthResponse? _user;

  AuthProvider() {
    ApiClient.onUnauthorized = () {
      _isAuthenticated = false;
      _user = null;
      notifyListeners();
    };
  }

  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;
  String? get errorMessage => _errorMessage;
  AuthResponse? get user => _user;

  Future<void> checkAuthStatus() async {
    _isLoading = true;
    notifyListeners();
    try {
      _isAuthenticated = await _authService.isLoggedIn();
    } catch (_) {
      _isAuthenticated = false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _user = await _authService.login(email, password);
      _isAuthenticated = true;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> register({
    required String fullName,
    required String email,
    required String password,
    String? gender,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _user = await _authService.register(
        fullName: fullName,
        email: email,
        password: password,
        gender: gender,
      );
      _isAuthenticated = true;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    _isAuthenticated = false;
    _user = null;
    notifyListeners();
  }
}
