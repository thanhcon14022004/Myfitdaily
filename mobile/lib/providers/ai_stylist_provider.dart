import 'package:flutter/material.dart';
import '../models/ai_stylist_model.dart';
import '../services/ai_stylist_service.dart';

class AiStylistProvider extends ChangeNotifier {
  final AiStylistService _aiService = AiStylistService();

  bool _isLoading = false;
  bool _isScanning = false;
  String? _errorMessage;
  AiRecommendResponse? _recommendation;
  ScanClothingResponse? _scanResult;

  bool get isLoading => _isLoading;
  bool get isScanning => _isScanning;
  String? get errorMessage => _errorMessage;
  AiRecommendResponse? get recommendation => _recommendation;
  ScanClothingResponse? get scanResult => _scanResult;

  Future<bool> recommendOutfit({
    required String occasion,
    required String style,
    required String weather,
    String? season,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _recommendation = await _aiService.recommendOutfit(
        AiRecommendRequest(
          occasion: occasion,
          style: style,
          weather: weather,
          season: season,
        ),
      );
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

  Future<ScanClothingResponse?> scanClothing(String imageUrl) async {
    _isScanning = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _scanResult = await _aiService.scanClothing(imageUrl);
      _isScanning = false;
      notifyListeners();
      return _scanResult;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isScanning = false;
      notifyListeners();
      return null;
    }
  }

  void clearScanResult() {
    _scanResult = null;
    notifyListeners();
  }
}
