import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/user_model.dart';

class UserService {
  final Dio _dio = ApiClient().dio;

  Future<UserProfile> getProfile() async {
    try {
      final response = await _dio.get(ApiConstants.userProfile);
      final dynamic raw = response.data;
      final Map<String, dynamic> data = (raw is Map<String, dynamic> && raw.containsKey('data'))
          ? (raw['data'] as Map<String, dynamic>)
          : (raw as Map<String, dynamic>);
      return UserProfile.fromJson(data);
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? 'Không thể tải thông tin hồ sơ.';
      throw Exception(msg);
    }
  }

  Future<UserProfile> updateProfile(UpdateProfileRequest request) async {
    try {
      final response = await _dio.put(
        ApiConstants.updateProfile,
        data: request.toJson(),
      );
      final dynamic raw = response.data;
      final Map<String, dynamic> data = (raw is Map<String, dynamic> && raw.containsKey('data'))
          ? (raw['data'] as Map<String, dynamic>)
          : (raw as Map<String, dynamic>);
      return UserProfile.fromJson(data);
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? 'Cập nhật hồ sơ thất bại.';
      throw Exception(msg);
    }
  }
}
