import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/user_service.dart';

class UserProvider extends ChangeNotifier {
  final UserService _userService = UserService();

  UserProfile? _profile;
  bool _isLoading = false;
  String? _errorMessage;

  UserProfile? get profile => _profile;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchProfile() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _profile = await _userService.getProfile();
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _profile ??= UserProfile(
        id: 1,
        email: 'demo@myfitdaily.com',
        fullName: 'Fashionista (Demo Nữ)',
        gender: 'Nữ',
        role: 'User',
        subscriptionType: 'Premium',
        height: 165,
        weight: 52,
        chest: 88,
        waist: 64,
        hips: 92,
        bodyShape: 'Đồng hồ cát',
        age: 24,
        ageGroup: 'GenZ (18-24)',
      );
      _isLoading = false;
      notifyListeners();
    }
  }

  void setDemoProfile({required bool isMale}) {
    _profile = isMale
        ? UserProfile(
            id: 2,
            email: 'test@myfitdaily.com',
            fullName: 'Gentleman (Demo Nam)',
            gender: 'Nam',
            role: 'User',
            subscriptionType: 'Premium',
            height: 178,
            weight: 70,
            chest: 98,
            waist: 78,
            hips: 95,
            bodyShape: 'Tam giác ngược',
            age: 26,
            ageGroup: 'YoungAdult (25-34)',
          )
        : UserProfile(
            id: 1,
            email: 'demo@myfitdaily.com',
            fullName: 'Fashionista (Demo Nữ)',
            gender: 'Nữ',
            role: 'User',
            subscriptionType: 'Premium',
            height: 165,
            weight: 52,
            chest: 88,
            waist: 64,
            hips: 92,
            bodyShape: 'Đồng hồ cát',
            age: 24,
            ageGroup: 'GenZ (18-24)',
          );
    notifyListeners();
  }

  Future<bool> updateProfile(UpdateProfileRequest request) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _profile = await _userService.updateProfile(request);
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
}
