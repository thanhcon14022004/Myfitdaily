import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/ai_stylist_model.dart';

class AiStylistService {
  final Dio _dio = ApiClient().dio;

  Future<AiRecommendResponse> recommendOutfit(AiRecommendRequest request) async {
    try {
      final response = await _dio.post(
        ApiConstants.aiRecommend,
        data: request.toJson(),
      );
      final dynamic raw = response.data;
      final Map<String, dynamic> data = (raw is Map<String, dynamic> && raw.containsKey('data'))
          ? (raw['data'] as Map<String, dynamic>)
          : (raw as Map<String, dynamic>);
      return AiRecommendResponse.fromJson(data);
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? 'AI không thể tạo outfit lúc này.';
      throw Exception(msg);
    }
  }

  Future<ScanClothingResponse> scanClothing(String imageUrl) async {
    try {
      final response = await _dio.post(
        ApiConstants.aiScan,
        data: {'imageUrl': imageUrl},
      );
      final dynamic raw = response.data;
      final Map<String, dynamic> data = (raw is Map<String, dynamic> && raw.containsKey('data'))
          ? (raw['data'] as Map<String, dynamic>)
          : (raw as Map<String, dynamic>);
      return ScanClothingResponse.fromJson(data);
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? 'Quét trang phục thất bại.';
      throw Exception(msg);
    }
  }

  Future<List<dynamic>> getHistories() async {
    try {
      final response = await _dio.get(ApiConstants.aiHistories);
      return response.data as List<dynamic>;
    } catch (_) {
      return [];
    }
  }
}
