import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../core/network/api_client.dart';
import '../models/clothing_model.dart';
import '../models/ootd_scan_model.dart';

class ClothingService {
  final Dio _dio = ApiClient().dio;

  Future<List<ClothingItem>> getClothes({
    int? categoryId,
    String? color,
    String? style,
    String? season,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (categoryId != null && categoryId > 0) queryParams['categoryId'] = categoryId;
      if (color != null && color.isNotEmpty) queryParams['color'] = color;
      if (style != null && style.isNotEmpty) queryParams['style'] = style;
      if (season != null && season.isNotEmpty) queryParams['season'] = season;

      final response = await _dio.get(
        ApiConstants.clothes,
        queryParameters: queryParams,
      );

      final dynamic raw = response.data;
      final List<dynamic> data = (raw is Map<String, dynamic> && raw.containsKey('data'))
          ? (raw['data'] as List<dynamic>? ?? [])
          : (raw as List<dynamic>);
      return data.map((json) => ClothingItem.fromJson(json)).toList();
    } on DioException catch (_) {
      // Fallback danh sách đồ mẫu nếu backend/database không kết nối được
      return _getDefaultFallbackClothes();
    }
  }

  static List<ClothingItem> _getDefaultFallbackClothes() {
    return [
      ClothingItem(
        id: 101,
        userId: 2,
        categoryId: 1,
        categoryName: 'Tops',
        name: 'Áo Sweater Dệt Kim Cổ Tròn Xanh Navy',
        brand: 'MyFitDaily Studio',
        size: 'L',
        color: 'Xanh Navy',
        style: 'Casual',
        season: 'Winter',
        imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
        description: 'Áo len sweater dệt kim phom rộng thoải mái, bo gấu tay và cổ tròn tối giản hiện đại.',
        createdAt: DateTime.now(),
      ),
      ClothingItem(
        id: 102,
        userId: 2,
        categoryId: 2,
        categoryName: 'Bottoms',
        name: 'Quần Thun Thể Thao Dài Sọc Trắng Đen Trackpants',
        brand: 'MyFitDaily Studio',
        size: 'L',
        color: 'Đen',
        style: 'Streetwear',
        season: 'AllSeason',
        imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format&fit=crop&q=80',
        description: 'Quần dài thun sọc trắng đôi hai bên hông phong cách thể thao đường phố năng động.',
        createdAt: DateTime.now(),
      ),
      ClothingItem(
        id: 103,
        userId: 2,
        categoryId: 4,
        categoryName: 'Shoes',
        name: 'Giày Sneaker Retro Cổ Thấp Trắng Đen Classic',
        brand: 'MyFitDaily Studio',
        size: '42',
        color: 'Trắng Đen',
        style: 'Casual',
        season: 'AllSeason',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
        description: 'Đôi giày sneaker đế bệt đệm cao su êm ái, phối màu trắng đen cổ điển dễ phối đồ.',
        createdAt: DateTime.now(),
      ),
      ClothingItem(
        id: 104,
        userId: 2,
        categoryId: 1,
        categoryName: 'Tops',
        name: 'Áo Blazer Relaxed Fit Nâu Tây Thanh Lịch',
        brand: 'MyFitDaily Studio',
        size: 'L',
        color: 'Nâu Tây',
        style: 'Smart Casual',
        season: 'Fall',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
        description: 'Áo vest blazer khoác ngoài lịch lãm, dễ dàng phối layer cùng áo thun hoặc sweater.',
        createdAt: DateTime.now(),
      ),
    ];
  }

  Future<ClothingItem> createClothing(CreateClothingItemRequest request) async {
    try {
      final response = await _dio.post(
        ApiConstants.clothes,
        data: request.toJson(),
      );
      final dynamic raw = response.data;
      final Map<String, dynamic> data = (raw is Map<String, dynamic> && raw.containsKey('data'))
          ? (raw['data'] as Map<String, dynamic>)
          : (raw as Map<String, dynamic>);
      return ClothingItem.fromJson(data);
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? 'Thêm trang phục thất bại.';
      throw Exception(msg);
    }
  }

  Future<bool> deleteClothing(int id) async {
    try {
      final response = await _dio.delete('${ApiConstants.clothes}/$id');
      return response.statusCode == 200 || response.statusCode == 204;
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? 'Xóa trang phục thất bại.';
      throw Exception(msg);
    }
  }

  Future<List<ClothingCategory>> getCategories() async {
    try {
      final response = await _dio.get(ApiConstants.categories);
      final dynamic raw = response.data;
      final List<dynamic> data = (raw is Map<String, dynamic> && raw.containsKey('data'))
          ? (raw['data'] as List<dynamic>? ?? [])
          : (raw as List<dynamic>);
      return data.map((json) => ClothingCategory.fromJson(json)).toList();
    } on DioException catch (_) {
      // Fallback categories if network offline
      return [
        ClothingCategory(id: 1, name: 'Tops', description: 'Áo thun, sơ mi, áo len, croptop'),
        ClothingCategory(id: 2, name: 'Bottoms', description: 'Quần jeans, quần tây, chân váy'),
        ClothingCategory(id: 3, name: 'Dresses', description: 'Đầm liền thân, váy dài'),
        ClothingCategory(id: 4, name: 'Outerwear', description: 'Áo khoác, blazer, hoodie'),
        ClothingCategory(id: 5, name: 'Shoes', description: 'Sneakers, giày tây, cao gót'),
      ];
    }
  }

  Future<ScanOotdResult> scanOotd({
    required String imageUrl,
    String? hint,
    String? genderHint,
  }) async {
    try {
      final response = await _dio.post(
        ApiConstants.aiScanOotd,
        data: {
          'imageUrl': imageUrl,
          'hint': hint,
          'genderHint': genderHint,
        },
      );
      final dynamic raw = response.data;
      final Map<String, dynamic> data = (raw is Map<String, dynamic> && raw.containsKey('data'))
          ? (raw['data'] as Map<String, dynamic>)
          : (raw as Map<String, dynamic>);
      return ScanOotdResult.fromJson(data);
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? 'Quét trang phục OOTD thất bại.';
      throw Exception(msg);
    }
  }

  Future<List<ClothingItem>> batchCreateClothing(List<CreateClothingItemRequest> items) async {
    try {
      final response = await _dio.post(
        ApiConstants.batchCreateClothes,
        data: {
          'items': items.map((e) => e.toJson()).toList(),
        },
      );
      final dynamic raw = response.data;
      final List<dynamic> data = (raw is Map<String, dynamic> && raw.containsKey('data'))
          ? (raw['data'] as List<dynamic>? ?? [])
          : (raw as List<dynamic>);
      return data.map((json) => ClothingItem.fromJson(json)).toList();
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] ?? 'Lưu các món đồ vào tủ thất bại.';
      throw Exception(msg);
    }
  }
}
