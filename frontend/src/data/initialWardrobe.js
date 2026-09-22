// Curated studio inventory: only the four supplied products are available.
export const STYLIST_CLOTHES = [
  { id: 201, name: 'Áo ba lỗ Coolmate Relaxed', categoryId: 1, categoryName: 'Tops', price: 179000, priceFormatted: '179K', platform: 'Coolmate', isAffiliate: false, color: 'Nâu taupe', style: 'Minimal Street', season: 'Summer', brand: 'COOLMATE', imageUrl: '/assets/stylist/coolmate-tank-top.png', description: 'Áo ba lỗ dáng relaxed màu taupe, chất liệu nhẹ và thoáng cho ngày nóng.' },
  { id: 202, name: 'Sweatshirt Frozen.HN Studio', categoryId: 1, categoryName: 'Tops', price: 263000, priceFormatted: '263K', platform: 'Frozen.HN', isAffiliate: false, color: 'Đen', style: 'Streetwear', season: 'Fall / Winter', brand: 'FROZEN.HN', imageUrl: '/assets/stylist/frozen-sweatshirt.png', description: 'Sweatshirt cổ tròn form rộng màu đen, logo studio tối giản.' },
  { id: 203, name: 'Quần suông dây rút Cream', categoryId: 2, categoryName: 'Bottoms', price: 320000, priceFormatted: '320K', platform: 'Curated', isAffiliate: false, color: 'Kem', style: 'Relaxed', season: 'AllSeason', brand: 'STYLIST EDIT', imageUrl: '/assets/stylist/cream-relaxed-pants.png', description: 'Quần ống suông dây rút màu kem, phom rủ thoải mái và thanh lịch.' },
  { id: 204, name: 'Sneaker Retro Cream / Black', categoryId: 5, categoryName: 'Shoes', price: 450000, priceFormatted: '450K', platform: 'Curated', isAffiliate: false, color: 'Kem / Đen', style: 'Retro', season: 'AllSeason', brand: 'RETRO CLUB', imageUrl: '/assets/stylist/retro-sneakers.png', description: 'Sneaker low-top màu kem với dải đen tương phản và đế gum retro.' }
];

export const INITIAL_CLOTHING_ITEMS_MALE = STYLIST_CLOTHES;
export const INITIAL_CLOTHING_ITEMS_FEMALE = STYLIST_CLOTHES;
export const INITIAL_CLOTHING_ITEMS = STYLIST_CLOTHES;
export const INITIAL_CATEGORIES_MALE = [
  { id: 1, name: 'Tops', label: 'Áo', count: 2, icon: 'Shirt' },
  { id: 2, name: 'Bottoms', label: 'Quần', count: 1, icon: 'Scissors' },
  { id: 5, name: 'Shoes', label: 'Giày', count: 1, icon: 'Footprints' }
];
export const INITIAL_CATEGORIES_FEMALE = INITIAL_CATEGORIES_MALE;
export const INITIAL_CATEGORIES = INITIAL_CATEGORIES_MALE;
export const INITIAL_OUTFITS_MALE = [{ id: 301, name: 'Cream & Black Signature', occasion: 'Casual', season: 'AllSeason', isFavorite: true, createdByAi: false, itemIds: [202, 203, 204], description: 'Sweatshirt đen, quần cream và sneaker retro: một set streetwear tối giản.' }];
export const INITIAL_OUTFITS_FEMALE = INITIAL_OUTFITS_MALE;
export const INITIAL_OUTFITS = INITIAL_OUTFITS_MALE;
export function getCategoriesForGender() { return INITIAL_CATEGORIES_MALE; }
export function getInitialClothesForGender() { return STYLIST_CLOTHES; }
export function getInitialOutfitsForGender() { return INITIAL_OUTFITS_MALE; }
export function sanitizeClothesForGender(items, gender) {
  if (!Array.isArray(items)) return [];
  const isMale = !gender || gender.toLowerCase() === 'nam' || gender.toLowerCase() === 'male';
  if (!isMale) return items;
  return items.filter(item => {
    if (item.categoryId === 3) return false;
    const name = (item.name || '').toLowerCase();
    return !(
      name.includes('váy') ||
      name.includes('đầm') ||
      name.includes('croptop') ||
      name.includes('tiểu thư') ||
      name.includes('cao gót') ||
      name.includes('chân váy') ||
      name.includes('dress') ||
      name.includes('skirt') ||
      name.includes('heels')
    );
  });
}
