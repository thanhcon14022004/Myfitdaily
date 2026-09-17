import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../core/constants/app_colors.dart';
import '../models/clothing_model.dart';

class ClothingCard extends StatelessWidget {
  final ClothingItem item;
  final VoidCallback? onTap;
  final VoidCallback? onDelete;

  const ClothingCard({
    super.key,
    required this.item,
    this.onTap,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.cardBorder),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image with Category Badge & Delete Button
            Expanded(
              child: Stack(
                children: [
                  Positioned.fill(
                    child: _buildItemImage(item.imageUrl),
                  ),
                  // Category Badge
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.65),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        item.categoryName,
                        style: const TextStyle(
                          color: AppColors.primaryLight,
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  // Delete Button
                  if (onDelete != null)
                    Positioned(
                      top: 6,
                      right: 6,
                      child: GestureDetector(
                        onTap: onDelete,
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.65),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.close, size: 14, color: AppColors.error),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            // Details
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      if (item.brand != null) ...[
                        Text(
                          item.brand!,
                          style: const TextStyle(
                            color: AppColors.textMuted,
                            fontSize: 11,
                          ),
                        ),
                        const SizedBox(width: 6),
                        const Text(
                          '•',
                          style: TextStyle(color: AppColors.textMuted, fontSize: 10),
                        ),
                        const SizedBox(width: 6),
                      ],
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          item.color,
                          style: const TextStyle(
                            color: AppColors.textSecondary,
                            fontSize: 10,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildItemImage(String url) {
    if (url.isEmpty) {
      return Container(
        color: AppColors.surfaceElevated,
        child: const Icon(Icons.checkroom, color: AppColors.textMuted, size: 36),
      );
    }
    final isSvg = url.toLowerCase().endsWith('.svg');
    final isAsset = url.startsWith('assets/');

    if (isAsset) {
      if (isSvg) {
        return Container(
          color: AppColors.surfaceElevated,
          padding: const EdgeInsets.all(10),
          child: SvgPicture.asset(
            url,
            fit: BoxFit.contain,
          ),
        );
      } else {
        return Image.asset(
          url,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => Container(
            color: AppColors.surfaceElevated,
            child: const Icon(Icons.checkroom, color: AppColors.textMuted, size: 36),
          ),
        );
      }
    } else {
      if (isSvg) {
        return Container(
          color: AppColors.surfaceElevated,
          padding: const EdgeInsets.all(10),
          child: SvgPicture.network(
            url,
            fit: BoxFit.contain,
            placeholderBuilder: (_) => const Center(
              child: CircularProgressIndicator(strokeWidth: 1.5, color: AppColors.primaryLight),
            ),
          ),
        );
      } else {
        return CachedNetworkImage(
          imageUrl: url,
          fit: BoxFit.cover,
          placeholder: (context, url) => Container(
            color: AppColors.surfaceElevated,
            child: const Center(
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: AppColors.primaryLight,
              ),
            ),
          ),
          errorWidget: (context, url, error) => Container(
            color: AppColors.surfaceElevated,
            child: const Icon(Icons.checkroom, color: AppColors.textMuted, size: 36),
          ),
        );
      }
    }
  }
}
