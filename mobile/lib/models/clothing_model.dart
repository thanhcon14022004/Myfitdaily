class ClothingItem {
  final int id;
  final int userId;
  final int categoryId;
  final String categoryName;
  final String name;
  final String? brand;
  final String? size;
  final String color;
  final String style;
  final String season;
  final String imageUrl;
  final String? description;
  final DateTime? createdAt;

  ClothingItem({
    required this.id,
    required this.userId,
    required this.categoryId,
    required this.categoryName,
    required this.name,
    this.brand,
    this.size,
    required this.color,
    required this.style,
    required this.season,
    required this.imageUrl,
    this.description,
    this.createdAt,
  });

  factory ClothingItem.fromJson(Map<String, dynamic> json) {
    return ClothingItem(
      id: json['id'] ?? 0,
      userId: json['userId'] ?? 0,
      categoryId: json['categoryId'] ?? 1,
      categoryName: json['categoryName'] ?? 'Tops',
      name: json['name'] ?? '',
      brand: json['brand'],
      size: json['size'],
      color: json['color'] ?? '',
      style: json['style'] ?? 'Casual',
      season: json['season'] ?? 'AllSeason',
      imageUrl: json['imageUrl'] ?? '',
      description: json['description'],
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'])
          : null,
    );
  }
}

class CreateClothingItemRequest {
  final int categoryId;
  final String name;
  final String? brand;
  final String? size;
  final String color;
  final String style;
  final String season;
  final String imageUrl;
  final String? description;

  CreateClothingItemRequest({
    required this.categoryId,
    required this.name,
    this.brand,
    this.size,
    required this.color,
    required this.style,
    required this.season,
    required this.imageUrl,
    this.description,
  });

  Map<String, dynamic> toJson() => {
    'categoryId': categoryId,
    'name': name,
    'brand': brand,
    'size': size,
    'color': color,
    'style': style,
    'season': season,
    'imageUrl': imageUrl,
    'description': description,
  };
}

class ClothingCategory {
  final int id;
  final String name;
  final String? description;

  ClothingCategory({
    required this.id,
    required this.name,
    this.description,
  });

  factory ClothingCategory.fromJson(Map<String, dynamic> json) {
    return ClothingCategory(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'],
    );
  }
}
