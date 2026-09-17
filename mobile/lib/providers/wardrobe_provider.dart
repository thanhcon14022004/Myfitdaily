import 'package:flutter/material.dart';
import '../models/clothing_model.dart';
import '../services/clothing_service.dart';

class WardrobeProvider extends ChangeNotifier {
  final ClothingService _clothingService = ClothingService();

  List<ClothingItem> _clothes = [];
  List<ClothingCategory> _categories = [];
  int? _selectedCategoryId;
  String? _selectedStyle;
  bool _isLoading = false;
  String? _errorMessage;

  List<ClothingItem> get clothes => _clothes;
  List<ClothingCategory> get categories => _categories;
  int? get selectedCategoryId => _selectedCategoryId;
  String? get selectedStyle => _selectedStyle;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> init() async {
    await fetchCategories();
    await fetchClothes();
  }

  Future<void> fetchCategories() async {
    try {
      _categories = await _clothingService.getCategories();
      if (_categories.isEmpty) {
        _categories = _getDefaultCategories();
      }
      notifyListeners();
    } catch (_) {
      if (_categories.isEmpty) {
        _categories = _getDefaultCategories();
        notifyListeners();
      }
    }
  }

  Future<void> fetchClothes() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final fetched = await _clothingService.getClothes(
        categoryId: _selectedCategoryId,
        style: _selectedStyle,
      );
      if (fetched.isNotEmpty) {
        _clothes = fetched;
      } else {
        _clothes = _getFilteredStarterClothes();
      }
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _clothes = _getFilteredStarterClothes();
      _isLoading = false;
      notifyListeners();
    }
  }

  List<ClothingCategory> _getDefaultCategories() {
    return [
      ClothingCategory(id: 1, name: 'Tops', description: 'Áo thun, sơ mi, áo len, croptop'),
      ClothingCategory(id: 2, name: 'Bottoms', description: 'Quần jeans, quần tây, chân váy'),
      ClothingCategory(id: 3, name: 'Dresses', description: 'Đầm liền thân, váy dài'),
      ClothingCategory(id: 4, name: 'Outerwear', description: 'Áo khoác, blazer, cardigan'),
      ClothingCategory(id: 5, name: 'Shoes', description: 'Sneakers, giày tây, cao gót'),
      ClothingCategory(id: 6, name: 'Accessories', description: 'Túi xách, phụ kiện'),
    ];
  }

  List<ClothingItem> _getFilteredStarterClothes() {
    var list = _getStarterDemoClothes();
    if (_selectedCategoryId != null) {
      list = list.where((c) => c.categoryId == _selectedCategoryId).toList();
    }
    if (_selectedStyle != null) {
      list = list.where((c) => c.style.toLowerCase() == _selectedStyle!.toLowerCase()).toList();
    }
    return list;
  }

  List<ClothingItem> _getStarterDemoClothes() {
    return [
      ClothingItem(
        id: 101,
        userId: 1,
        categoryId: 1,
        categoryName: 'Tops',
        name: 'Áo sơ mi lụa trắng Zara',
        brand: 'Zara',
        size: 'M',
        color: 'Trắng',
        style: 'Minimalist',
        season: 'AllSeason',
        imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80',
        description: 'Sơ mi lụa mềm mại, cổ đức thanh lịch công sở',
      ),
      ClothingItem(
        id: 102,
        userId: 1,
        categoryId: 1,
        categoryName: 'Tops',
        name: 'Áo thun Baby Tee Cotton Uniqlo',
        brand: 'Uniqlo',
        size: 'S',
        color: 'Beige',
        style: 'Casual',
        season: 'Summer',
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
        description: 'Áo thun cotton thoáng mát dạo phố năng động',
      ),
      ClothingItem(
        id: 103,
        userId: 1,
        categoryId: 1,
        categoryName: 'Tops',
        name: 'Áo len dệt kim cổ lọ Mango',
        brand: 'Mango',
        size: 'M',
        color: 'Nâu nhạt',
        style: 'Chic',
        season: 'Winter',
        imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
        description: 'Áo len giữ ấm thanh lịch mùa thu đông',
      ),
      ClothingItem(
        id: 104,
        userId: 1,
        categoryId: 2,
        categoryName: 'Bottoms',
        name: 'Quần Jeans cạp cao Levi\'s',
        brand: 'Levi\'s',
        size: '27',
        color: 'Xanh denim',
        style: 'Casual',
        season: 'AllSeason',
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
        description: 'Jeans ống đứng hack chân tôn dáng',
      ),
      ClothingItem(
        id: 105,
        userId: 1,
        categoryId: 2,
        categoryName: 'Bottoms',
        name: 'Quần tây ống suông Massimo Dutti',
        brand: 'Massimo Dutti',
        size: 'M',
        color: 'Đen',
        style: 'Formal',
        season: 'AllSeason',
        imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop&q=80',
        description: 'Quần âu phom suông đứng dáng cao cấp',
      ),
      ClothingItem(
        id: 106,
        userId: 1,
        categoryId: 2,
        categoryName: 'Bottoms',
        name: 'Chân váy xếp ly dáng dài COS',
        brand: 'COS',
        size: 'S',
        color: 'Kem',
        style: 'Chic',
        season: 'AllSeason',
        imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop&q=80',
        description: 'Chân váy xếp ly uyển chuyển nữ tính',
      ),
      ClothingItem(
        id: 107,
        userId: 1,
        categoryId: 4,
        categoryName: 'Outerwear',
        name: 'Áo Blazer dáng rộng Zara',
        brand: 'Zara',
        size: 'M',
        color: 'Ghi xám',
        style: 'Minimalist',
        season: 'AllSeason',
        imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
        description: 'Blazer hiện đại thời thượng phối cùng jeans hoặc âu',
      ),
      ClothingItem(
        id: 108,
        userId: 1,
        categoryId: 5,
        categoryName: 'Shoes',
        name: 'Giày Sneaker Samba Adidas',
        brand: 'Adidas',
        size: '38',
        color: 'Trắng sọc đen',
        style: 'Streetwear',
        season: 'AllSeason',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
        description: 'Đôi sneaker kinh điển phối mọi trang phục',
      ),
      ClothingItem(
        id: 109,
        userId: 1,
        categoryId: 5,
        categoryName: 'Shoes',
        name: 'Giày Loafer đế bệt Charles & Keith',
        brand: 'Charles & Keith',
        size: '38',
        color: 'Nâu bò',
        style: 'Classic',
        season: 'AllSeason',
        imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
        description: 'Giày lười da êm ái lịch thiệp',
      ),
    ];
  }

  void filterByCategory(int? categoryId) {
    if (_selectedCategoryId == categoryId) {
      _selectedCategoryId = null; // Toggle off
    } else {
      _selectedCategoryId = categoryId;
    }
    fetchClothes();
  }

  void filterByStyle(String? style) {
    _selectedStyle = style;
    fetchClothes();
  }

  Future<bool> addClothing(CreateClothingItemRequest request) async {
    _isLoading = true;
    notifyListeners();

    try {
      final newItem = await _clothingService.createClothing(request);
      _clothes.insert(0, newItem);
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

  Future<bool> batchAddClothing(List<CreateClothingItemRequest> requests) async {
    _isLoading = true;
    notifyListeners();

    try {
      final newItems = await _clothingService.batchCreateClothing(requests);
      for (final item in newItems.reversed) {
        _clothes.insert(0, item);
      }
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _isLoading = false;
      // Fallback: create items locally
      final now = DateTime.now();
      for (int i = 0; i < requests.length; i++) {
        final req = requests[i];
        final fakeItem = ClothingItem(
          id: 9000 + i + (now.millisecondsSinceEpoch % 1000),
          userId: 1,
          categoryId: req.categoryId,
          categoryName: _categories.firstWhere(
            (c) => c.id == req.categoryId,
            orElse: () => ClothingCategory(id: req.categoryId, name: 'Tops', description: ''),
          ).name,
          name: req.name,
          brand: req.brand,
          size: req.size,
          color: req.color,
          style: req.style,
          season: req.season,
          imageUrl: req.imageUrl,
          description: req.description,
          createdAt: now,
        );
        _clothes.insert(0, fakeItem);
      }
      notifyListeners();
      return true;
    }
  }

  Future<bool> deleteClothing(int id) async {
    try {
      final success = await _clothingService.deleteClothing(id);
      if (success) {
        _clothes.removeWhere((item) => item.id == id);
        notifyListeners();
      }
      return success;
    } catch (_) {
      return false;
    }
  }
}
