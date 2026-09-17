import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants/app_colors.dart';
import '../providers/weather_provider.dart';
import '../services/weather_service.dart';

class LocationPickerSheet extends StatefulWidget {
  const LocationPickerSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const LocationPickerSheet(),
    );
  }

  @override
  State<LocationPickerSheet> createState() => _LocationPickerSheetState();
}

class _LocationPickerSheetState extends State<LocationPickerSheet> {
  final TextEditingController _searchController = TextEditingController();
  String _query = '';

  final List<String> _quickHanoiChips = [
    'Cầu Giấy',
    'Đống Đa',
    'Ba Đình',
    'Hoàn Kiếm',
    'Hà Đông',
    'Thạch Thất',
    'Đông Anh',
    'Nam Từ Liêm',
    'Tây Hồ',
    'Hai Bà Trưng',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final weatherProv = Provider.of<WeatherProvider>(context);
    final currentCity = weatherProv.weather?.city ?? 'Hà Nội';

    final filtered = WeatherService.allLocations.where((loc) {
      if (_query.isEmpty) return true;
      final q = _query.toLowerCase();
      return loc.name.toLowerCase().contains(q) ||
          loc.shortName.toLowerCase().contains(q) ||
          loc.group.toLowerCase().contains(q);
    }).toList();

    return Container(
      height: MediaQuery.of(context).size.height * 0.75,
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 14),

          // Title
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                '📍 Chọn Vị Trí Của Bạn',
                style: TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close, color: AppColors.textSecondary, size: 20),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Auto-detect GPS button
          ElevatedButton.icon(
            onPressed: () async {
              Navigator.pop(context);
              await weatherProv.autoDetectLocation();
            },
            icon: const Icon(Icons.my_location, size: 16),
            label: const Text('🎯 Tự động định vị IP / GPS thực tế'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
          const SizedBox(height: 16),

          // Search input
          TextField(
            controller: _searchController,
            onChanged: (val) => setState(() => _query = val.trim()),
            style: const TextStyle(color: AppColors.textPrimary, fontSize: 14),
            decoration: InputDecoration(
              hintText: 'Tìm quận, huyện (Cầu Giấy, Thạch Thất, Đống Đa...)',
              hintStyle: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
              prefixIcon: const Icon(Icons.search, color: AppColors.primaryLight, size: 20),
              filled: true,
              fillColor: AppColors.background,
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppColors.cardBorder),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppColors.cardBorder),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppColors.primary),
              ),
            ),
          ),
          const SizedBox(height: 14),

          // Quick chips for Hanoi
          if (_query.isEmpty) ...[
            const Text(
              'GỢI Ý NHANH (HÀ NỘI):',
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 11,
                fontWeight: FontWeight.bold,
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _quickHanoiChips.map((chipName) {
                final isCurrent = currentCity.contains(chipName);
                return ActionChip(
                  label: Text(chipName),
                  labelStyle: TextStyle(
                    color: isCurrent ? Colors.white : AppColors.textPrimary,
                    fontSize: 12,
                    fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
                  ),
                  backgroundColor: isCurrent ? AppColors.primary : AppColors.background,
                  side: BorderSide(color: isCurrent ? AppColors.primary : AppColors.cardBorder),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  onPressed: () {
                    final found = WeatherService.allLocations.firstWhere(
                      (l) => l.shortName == chipName || l.name.contains(chipName),
                      orElse: () => WeatherService.hanoiDistricts[0],
                    );
                    Navigator.pop(context);
                    weatherProv.setLocation(found);
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 14),
            const Text(
              'DANH SÁCH KHU VỰC:',
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 11,
                fontWeight: FontWeight.bold,
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 6),
          ],

          // List of locations
          Expanded(
            child: ListView.separated(
              itemCount: filtered.length,
              separatorBuilder: (_, __) => const Divider(color: AppColors.cardBorder, height: 1),
              itemBuilder: (context, idx) {
                final item = filtered[idx];
                final isSelected = currentCity.contains(item.shortName) || currentCity == item.name;

                return ListTile(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  leading: Icon(
                    isSelected ? Icons.check_circle : Icons.location_on_outlined,
                    color: isSelected ? AppColors.primaryLight : AppColors.textSecondary,
                    size: 20,
                  ),
                  title: Text(
                    item.name,
                    style: TextStyle(
                      color: isSelected ? AppColors.primaryLight : AppColors.textPrimary,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                      fontSize: 14,
                    ),
                  ),
                  subtitle: Text(
                    item.group,
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
                  ),
                  trailing: isSelected
                      ? Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text('Hiện tại', style: TextStyle(color: AppColors.primaryLight, fontSize: 10)),
                        )
                      : null,
                  onTap: () {
                    Navigator.pop(context);
                    weatherProv.setLocation(item);
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
