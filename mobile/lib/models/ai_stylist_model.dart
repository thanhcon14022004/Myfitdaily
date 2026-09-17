class AiRecommendRequest {
  final String occasion;
  final String style;
  final String weather;
  final String? season;

  AiRecommendRequest({
    required this.occasion,
    required this.style,
    required this.weather,
    this.season,
  });

  Map<String, dynamic> toJson() => {
    'occasion': occasion,
    'style': style,
    'weather': weather,
    'season': season ?? 'AllSeason',
  };
}

class RecommendedItem {
  final int id;
  final String name;
  final String categoryName;
  final String imageUrl;
  final String color;
  final String style;

  RecommendedItem({
    required this.id,
    required this.name,
    required this.categoryName,
    required this.imageUrl,
    required this.color,
    required this.style,
  });

  factory RecommendedItem.fromJson(Map<String, dynamic> json) {
    return RecommendedItem(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      categoryName: json['categoryName'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      color: json['color'] ?? '',
      style: json['style'] ?? '',
    );
  }
}

class AccompanyingOutfit {
  final int id;
  final String name;
  final String style;
  final String description;
  final String harmonyScore;
  final List<RecommendedItem> items;

  AccompanyingOutfit({
    required this.id,
    required this.name,
    required this.style,
    required this.description,
    required this.harmonyScore,
    required this.items,
  });

  factory AccompanyingOutfit.fromJson(Map<String, dynamic> json) {
    return AccompanyingOutfit(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      style: json['style'] ?? '',
      description: json['description'] ?? '',
      harmonyScore: json['harmonyScore'] ?? '95%',
      items: (json['items'] as List<dynamic>?)
              ?.map((item) => RecommendedItem.fromJson(item))
              .toList() ??
          [],
    );
  }
}

class AiRecommendResponse {
  final int id;
  final String outfitName;
  final String occasion;
  final String season;
  final String stylistNotes;
  final String harmonyScore;
  final String contrastLevel;
  final List<RecommendedItem> recommendedItems;
  final List<AccompanyingOutfit> accompanyingOutfits;
  final bool isWardrobeEmpty;
  final String? emptyWardrobeMessage;
  final bool requiresBodyMetrics;
  final String? bodyMetricsWarning;

  AiRecommendResponse({
    required this.id,
    required this.outfitName,
    required this.occasion,
    required this.season,
    required this.stylistNotes,
    required this.harmonyScore,
    required this.contrastLevel,
    required this.recommendedItems,
    required this.accompanyingOutfits,
    required this.isWardrobeEmpty,
    this.emptyWardrobeMessage,
    required this.requiresBodyMetrics,
    this.bodyMetricsWarning,
  });

  factory AiRecommendResponse.fromJson(Map<String, dynamic> json) {
    return AiRecommendResponse(
      id: json['id'] ?? 0,
      outfitName: json['outfitName'] ?? 'Outfit gợi ý từ AI',
      occasion: json['occasion'] ?? '',
      season: json['season'] ?? '',
      stylistNotes: json['stylistNotes'] ?? '',
      harmonyScore: json['harmonyScore'] ?? '95%',
      contrastLevel: json['contrastLevel'] ?? 'Hài hòa (Optimal)',
      recommendedItems: (json['recommendedItems'] as List<dynamic>?)
              ?.map((item) => RecommendedItem.fromJson(item))
              .toList() ??
          [],
      accompanyingOutfits: (json['accompanyingOutfits'] as List<dynamic>?)
              ?.map((outfit) => AccompanyingOutfit.fromJson(outfit))
              .toList() ??
          [],
      isWardrobeEmpty: json['isWardrobeEmpty'] ?? false,
      emptyWardrobeMessage: json['emptyWardrobeMessage'],
      requiresBodyMetrics: json['requiresBodyMetrics'] ?? false,
      bodyMetricsWarning: json['bodyMetricsWarning'],
    );
  }
}

class ScanClothingResponse {
  final String brand;
  final String name;
  final int categoryId;
  final String categoryName;
  final String color;
  final String style;
  final String season;
  final double confidence;
  final List<String> suggestedSizes;
  final String aiNotes;
  final bool isBrandIdentified;

  ScanClothingResponse({
    required this.brand,
    required this.name,
    required this.categoryId,
    required this.categoryName,
    required this.color,
    required this.style,
    required this.season,
    required this.confidence,
    required this.suggestedSizes,
    required this.aiNotes,
    required this.isBrandIdentified,
  });

  factory ScanClothingResponse.fromJson(Map<String, dynamic> json) {
    return ScanClothingResponse(
      brand: json['brand'] ?? '',
      name: json['name'] ?? '',
      categoryId: json['categoryId'] ?? 1,
      categoryName: json['categoryName'] ?? 'Tops',
      color: json['color'] ?? 'Trắng',
      style: json['style'] ?? 'Casual',
      season: json['season'] ?? 'AllSeason',
      confidence: (json['confidence'] as num?)?.toDouble() ?? 0.95,
      suggestedSizes: (json['suggestedSizes'] as List<dynamic>?)
              ?.map((s) => s.toString())
              .toList() ??
          [],
      aiNotes: json['aiNotes'] ?? '',
      isBrandIdentified: json['isBrandIdentified'] ?? false,
    );
  }
}
