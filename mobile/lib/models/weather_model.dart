class WeatherData {
  final String city;
  final double temperature;
  final String condition;
  final int humidity;
  final double windSpeed;
  final String outfitAdvice;
  final String icon;

  WeatherData({
    required this.city,
    required this.temperature,
    required this.condition,
    required this.humidity,
    required this.windSpeed,
    required this.outfitAdvice,
    required this.icon,
  });

  factory WeatherData.fromJson(Map<String, dynamic> json) {
    return WeatherData(
      city: json['city'] ?? 'Việt Nam',
      temperature: (json['temperature'] as num?)?.toDouble() ?? 28.0,
      condition: json['condition'] ?? 'Nắng ấm',
      humidity: json['humidity'] ?? 75,
      windSpeed: (json['windSpeed'] as num?)?.toDouble() ?? 5.0,
      outfitAdvice: json['outfitAdvice'] ?? 'Trang phục thoáng mát, áo thun cotton',
      icon: json['icon'] ?? '☀️',
    );
  }
}
