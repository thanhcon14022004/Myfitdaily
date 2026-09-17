class DetectedOotdItem {
  final String itemType;
  final String brand;
  final String name;
  final int categoryId;
  final String categoryName;
  final String color;
  final String style;
  final String season;
  final String description;
  final String size;
  final List<String> suggestedSizes;
  final String imageUrl;
  final double confidence;
  bool isSelected;

  DetectedOotdItem({
    required this.itemType,
    required this.brand,
    required this.name,
    required this.categoryId,
    required this.categoryName,
    required this.color,
    required this.style,
    required this.season,
    required this.description,
    required this.size,
    required this.suggestedSizes,
    required this.imageUrl,
    required this.confidence,
    this.isSelected = true,
  });

  factory DetectedOotdItem.fromJson(Map<String, dynamic> json) {
    return DetectedOotdItem(
      itemType: json['itemType'] ?? 'Top',
      brand: json['brand'] ?? '',
      name: json['name'] ?? '',
      categoryId: json['categoryId'] ?? 1,
      categoryName: json['categoryName'] ?? 'Tops',
      color: json['color'] ?? 'Trắng',
      style: json['style'] ?? 'Casual',
      season: json['season'] ?? 'AllSeason',
      description: json['description'] ?? '',
      size: json['size'] ?? 'M',
      suggestedSizes: (json['suggestedSizes'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      imageUrl: json['imageUrl'] ?? '',
      confidence: (json['confidence'] is num) ? (json['confidence'] as num).toDouble() : 0.95,
      isSelected: true,
    );
  }
}

class ScanOotdResult {
  final String overallStyle;
  final String ootdDescription;
  final String aiModelUsed;
  final List<DetectedOotdItem> items;

  ScanOotdResult({
    required this.overallStyle,
    required this.ootdDescription,
    required this.aiModelUsed,
    required this.items,
  });

  factory ScanOotdResult.fromJson(Map<String, dynamic> json) {
    return ScanOotdResult(
      overallStyle: json['overallStyle'] ?? 'Smart Casual',
      ootdDescription: json['ootdDescription'] ?? '',
      aiModelUsed: json['aiModelUsed'] ?? 'AI Vision',
      items: (json['items'] as List<dynamic>?)
              ?.map((e) => DetectedOotdItem.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}
