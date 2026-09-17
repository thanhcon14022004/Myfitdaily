import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../models/weather_model.dart';

class LocationItem {
  final String name;
  final String shortName;
  final String group;
  final double lat;
  final double lon;

  const LocationItem({
    required this.name,
    required this.shortName,
    required this.group,
    required this.lat,
    required this.lon,
  });
}

class WeatherService {
  final Dio _dio = Dio(
    BaseOptions(
      connectTimeout: const Duration(seconds: 8),
      receiveTimeout: const Duration(seconds: 8),
    ),
  );

  // Danh sách các Quận & Huyện chi tiết của Hà Nội (đồng bộ 100% từ Web weatherService.js)
  static const List<LocationItem> hanoiDistricts = [
    LocationItem(name: 'Cầu Giấy, Hà Nội', shortName: 'Cầu Giấy', group: 'Hà Nội', lat: 21.0323, lon: 105.8007),
    LocationItem(name: 'Đống Đa, Hà Nội', shortName: 'Đống Đa', group: 'Hà Nội', lat: 21.0181, lon: 105.8299),
    LocationItem(name: 'Ba Đình, Hà Nội', shortName: 'Ba Đình', group: 'Hà Nội', lat: 21.0341, lon: 105.8244),
    LocationItem(name: 'Hoàn Kiếm, Hà Nội', shortName: 'Hoàn Kiếm', group: 'Hà Nội', lat: 21.0307, lon: 105.8524),
    LocationItem(name: 'Hai Bà Trưng, Hà Nội', shortName: 'Hai Bà Trưng', group: 'Hà Nội', lat: 21.0069, lon: 105.8522),
    LocationItem(name: 'Tây Hồ, Hà Nội', shortName: 'Tây Hồ', group: 'Hà Nội', lat: 21.0712, lon: 105.8236),
    LocationItem(name: 'Thanh Xuân, Hà Nội', shortName: 'Thanh Xuân', group: 'Hà Nội', lat: 20.9980, lon: 105.8115),
    LocationItem(name: 'Hoàng Mai, Hà Nội', shortName: 'Hoàng Mai', group: 'Hà Nội', lat: 20.9754, lon: 105.8524),
    LocationItem(name: 'Long Biên, Hà Nội', shortName: 'Long Biên', group: 'Hà Nội', lat: 21.0362, lon: 105.8927),
    LocationItem(name: 'Hà Đông, Hà Nội', shortName: 'Hà Đông', group: 'Hà Nội', lat: 20.9719, lon: 105.7725),
    LocationItem(name: 'Nam Từ Liêm, Hà Nội', shortName: 'Nam Từ Liêm', group: 'Hà Nội', lat: 21.0152, lon: 105.7656),
    LocationItem(name: 'Bắc Từ Liêm, Hà Nội', shortName: 'Bắc Từ Liêm', group: 'Hà Nội', lat: 21.0631, lon: 105.7562),
    LocationItem(name: 'Đông Anh, Hà Nội', shortName: 'Đông Anh', group: 'Hà Nội', lat: 21.1372, lon: 105.8453),
    LocationItem(name: 'Gia Lâm, Hà Nội', shortName: 'Gia Lâm', group: 'Hà Nội', lat: 21.0258, lon: 105.9405),
    LocationItem(name: 'Hoài Đức, Hà Nội', shortName: 'Hoài Đức', group: 'Hà Nội', lat: 21.0194, lon: 105.7072),
    LocationItem(name: 'Thanh Trì, Hà Nội', shortName: 'Thanh Trì', group: 'Hà Nội', lat: 20.9419, lon: 105.8483),
    LocationItem(name: 'Sóc Sơn, Hà Nội', shortName: 'Sóc Sơn', group: 'Hà Nội', lat: 21.2825, lon: 105.8483),
    LocationItem(name: 'Đan Phượng, Hà Nội', shortName: 'Đan Phượng', group: 'Hà Nội', lat: 21.1118, lon: 105.6708),
    LocationItem(name: 'Thường Tín, Hà Nội', shortName: 'Thường Tín', group: 'Hà Nội', lat: 20.8525, lon: 105.8711),
    LocationItem(name: 'Chương Mỹ, Hà Nội', shortName: 'Chương Mỹ', group: 'Hà Nội', lat: 20.8931, lon: 105.6983),
    LocationItem(name: 'Thạch Thất, Hà Nội', shortName: 'Thạch Thất', group: 'Hà Nội', lat: 21.0369, lon: 105.5567),
    LocationItem(name: 'Quốc Oai, Hà Nội', shortName: 'Quốc Oai', group: 'Hà Nội', lat: 20.9856, lon: 105.6264),
    LocationItem(name: 'Mê Linh, Hà Nội', shortName: 'Mê Linh', group: 'Hà Nội', lat: 21.1819, lon: 105.7197),
    LocationItem(name: 'Sơn Tây, Hà Nội', shortName: 'Sơn Tây', group: 'Hà Nội', lat: 21.1352, lon: 105.5074),
    LocationItem(name: 'Ba Vì, Hà Nội', shortName: 'Ba Vì', group: 'Hà Nội', lat: 21.2297, lon: 105.3789),
  ];

  static const List<LocationItem> hcmDistricts = [
    LocationItem(name: 'Quận 1, TP. HCM', shortName: 'Quận 1', group: 'TP. HCM', lat: 10.7769, lon: 106.7009),
    LocationItem(name: 'Quận 3, TP. HCM', shortName: 'Quận 3', group: 'TP. HCM', lat: 10.7843, lon: 106.6843),
    LocationItem(name: 'Quận 7, TP. HCM', shortName: 'Quận 7', group: 'TP. HCM', lat: 10.7340, lon: 106.7218),
    LocationItem(name: 'TP. Thủ Đức, TP. HCM', shortName: 'TP. Thủ Đức', group: 'TP. HCM', lat: 10.8494, lon: 106.7717),
    LocationItem(name: 'Bình Thạnh, TP. HCM', shortName: 'Bình Thạnh', group: 'TP. HCM', lat: 10.8106, lon: 106.7091),
    LocationItem(name: 'Gò Vấp, TP. HCM', shortName: 'Gò Vấp', group: 'TP. HCM', lat: 10.8387, lon: 106.6653),
    LocationItem(name: 'Tân Bình, TP. HCM', shortName: 'Tân Bình', group: 'TP. HCM', lat: 10.7992, lon: 106.6534),
    LocationItem(name: 'Bình Tân, TP. HCM', shortName: 'Bình Tân', group: 'TP. HCM', lat: 10.7456, lon: 106.6045),
    LocationItem(name: 'Bình Chánh, TP. HCM', shortName: 'Bình Chánh', group: 'TP. HCM', lat: 10.6874, lon: 106.5939),
    LocationItem(name: 'Hóc Môn, TP. HCM', shortName: 'Hóc Môn', group: 'TP. HCM', lat: 10.8841, lon: 106.5934),
  ];

  static const List<LocationItem> otherProvinces = [
    LocationItem(name: 'Đà Nẵng', shortName: 'Đà Nẵng', group: 'Miền Trung', lat: 16.0544, lon: 108.2022),
    LocationItem(name: 'Hải Phòng', shortName: 'Hải Phòng', group: 'Miền Bắc', lat: 20.8449, lon: 106.6881),
    LocationItem(name: 'Cần Thơ', shortName: 'Cần Thơ', group: 'Miền Nam', lat: 10.0452, lon: 105.7469),
    LocationItem(name: 'Đà Lạt', shortName: 'Đà Lạt', group: 'Tây Nguyên', lat: 11.9404, lon: 108.4583),
    LocationItem(name: 'Nha Trang', shortName: 'Nha Trang', group: 'Miền Trung', lat: 12.2388, lon: 109.1967),
    LocationItem(name: 'Huế', shortName: 'Huế', group: 'Miền Trung', lat: 16.4637, lon: 107.5909),
    LocationItem(name: 'Quảng Ninh', shortName: 'Quảng Ninh', group: 'Miền Bắc', lat: 20.9599, lon: 107.0425),
    LocationItem(name: 'Vũng Tàu', shortName: 'Vũng Tàu', group: 'Miền Nam', lat: 10.3460, lon: 107.0843),
  ];

  static const List<LocationItem> allLocations = [
    ...hanoiDistricts,
    ...hcmDistricts,
    ...otherProvinces,
  ];

  /// Tìm quận/huyện gần nhất theo tọa độ GPS
  static LocationItem findNearestLocation(double lat, double lon) {
    LocationItem nearest = allLocations[0];
    double minDistance = double.infinity;

    for (final loc in allLocations) {
      final d = _calculateDistance(lat, lon, loc.lat, loc.lon);
      if (d < minDistance) {
        minDistance = d;
        nearest = loc;
      }
    }
    return nearest;
  }

  static double _calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    const r = 6371.0; // Earth radius in km
    final dLat = (lat2 - lat1) * (pi / 180.0);
    final dLon = (lon2 - lon1) * (pi / 180.0);
    final a = sin(dLat / 2) * sin(dLat / 2) +
        cos(lat1 * (pi / 180.0)) * cos(lat2 * (pi / 180.0)) * sin(dLon / 2) * sin(dLon / 2);
    final c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return r * c;
  }

  /// Tự động lấy vị trí hiện tại qua IP Geolocation (GeoJS API giống hệt bản Web)
  Future<(double lat, double lon, String city)> detectCurrentLocation() async {
    try {
      final res = await _dio.get(ApiConstants.geoJsUrl);
      if (res.statusCode == 200 && res.data != null) {
        final data = res.data;
        final lat = double.tryParse(data['latitude']?.toString() ?? '') ?? 21.0285;
        final lon = double.tryParse(data['longitude']?.toString() ?? '') ?? 105.8542;
        final cityRaw = (data['city'] ?? data['region'] ?? 'Hanoi').toString();

        // Tìm quận/huyện gần nhất
        final nearest = findNearestLocation(lat, lon);
        final dist = _calculateDistance(lat, lon, nearest.lat, nearest.lon);
        if (dist <= 35.0) {
          return (lat, lon, nearest.name);
        }

        if (cityRaw.toLowerCase().contains('hanoi') || cityRaw.toLowerCase().contains('ha noi')) {
          return (lat, lon, 'Hà Nội');
        }

        return (lat, lon, cityRaw);
      }
    } catch (e) {
      debugPrint('[WeatherService] detectCurrentLocation warning: $e');
    }

    // Mặc định chuẩn Hà Nội theo hệ thống
    return (21.0285, 105.8542, 'Hà Nội');
  }

  /// Lấy thời tiết trực tiếp từ Open-Meteo theo vị trí chỉ định hoặc tự động định vị
  Future<WeatherData> getCurrentWeather({double? targetLat, double? targetLon, String? targetCity}) async {
    double lat = targetLat ?? 21.0285;
    double lon = targetLon ?? 105.8542;
    String city = targetCity ?? 'Hà Nội';

    // Nếu không truyền vị trí cụ thể, tự động xác định qua IP Geolocation
    if (targetLat == null || targetLon == null || targetCity == null) {
      final loc = await detectCurrentLocation();
      lat = loc.$1;
      lon = loc.$2;
      city = loc.$3;
    }

    try {
      final url =
          '${ApiConstants.openMeteoForecastUrl}?latitude=$lat&longitude=$lon&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto';

      final response = await _dio.get(url);
      if (response.statusCode == 200 && response.data != null) {
        final current = response.data['current'];
        // BUG-002 fix: guard against null current object
        if (current == null) {
          throw Exception('Weather API returned null current data');
        }
        final temp = (current['temperature_2m'] as num?)?.toDouble() ?? 28.0;
        final humidity = (current['relative_humidity_2m'] as num?)?.toInt() ?? 75;
        final wind = (current['wind_speed_10m'] as num?)?.toDouble() ?? 4.0;
        final weatherCode = (current['weather_code'] as num?)?.toInt() ?? 1;

        final (condition, icon, advice) = _interpretWeatherCode(weatherCode, temp);

        return WeatherData(
          city: city,
          temperature: temp,
          condition: condition,
          humidity: humidity,
          windSpeed: wind,
          outfitAdvice: advice,
          icon: icon,
        );
      }
    } catch (e) {
      debugPrint('[WeatherService] getCurrentWeather error: $e');
    }

    return WeatherData(
      city: city,
      temperature: 28.0,
      condition: 'Nắng ấm',
      humidity: 75,
      windSpeed: 4.0,
      outfitAdvice: 'Thời tiết Hà Nội ấm áp, phù hợp áo phông năng động, sơ mi cộc tay hoặc chân váy.',
      icon: '☀️',
    );
  }

  (String, String, String) _interpretWeatherCode(int code, double temp) {
    if (code == 0) {
      return (
        'Trời quang đãng, nắng đẹp',
        '☀️',
        temp >= 32
            ? 'Trời nắng gắt ($temp°C): Ưu tiên đồ chống nắng, áo thun trắng, mũ rộng vành, kính râm.'
            : 'Nắng đẹp dễ chịu ($temp°C): Rất dễ phối đồ, áo sơ mi cộc tay, polo hoặc quần jeans thoải mái.'
      );
    } else if (code >= 1 && code <= 3) {
      return (
        'Có mây, nắng dịu',
        '⛅',
        'Thời tiết lý tưởng ($temp°C): Thích hợp phối layer nhẹ nhàng, blazer mỏng, croptop hoặc chân váy dài.'
      );
    } else if (code >= 51 && code <= 67 || code >= 80 && code <= 82) {
      return (
        'Có mưa rào rải rác',
        '🌧️',
        'Trời mưa ẩm: Tránh mặc quần dài sáng màu dễ bẩn, nên đi giày da/sneaker chống nước hoặc sandals.'
      );
    } else if (code >= 71 && code <= 77) {
      return (
        'Trời lạnh',
        '❄️',
        'Nhiệt độ thấp ($temp°C): Cần giữ ấm với áo khoác dạ, hoodie, khăn choàng cổ và boots.'
      );
    } else if (code >= 95) {
      return (
        'Có dông sét',
        '⛈️',
        'Thời tiết xấu: Hạn chế mang phụ kiện kim loại, nên mặc đồ gọn gàng và mang theo ô/áo mưa.'
      );
    } else {
      return (
        'Mát mẻ',
        '🌤️',
        'Thời tiết ôn hòa ($temp°C): Phối đồ tự do theo phong cách cá nhân của bạn.'
      );
    }
  }
}
