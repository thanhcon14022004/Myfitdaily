import React, { useMemo } from 'react';

/**
 * BỘ SƯU TẬP 16 SET TEMPLATE NGƯỜI MẪU STUDIO THỜI TRANG ĐỘ NÉT CAO (HD)
 * Được trích xuất trực tiếp từ catalog ảnh studio người mẫu chuẩn lookbook:
 * - SET 1:  Áo sơ mi trắng + Quần tây (đen) + Giày sneaker (trắng)
 * - SET 2:  Áo sơ mi xanh nhạt + Quần vải suông (beige) + Giày sneaker (trắng/xám)
 * - SET 3:  Áo sơ mi đen + Quần tây (xám) + Giày sneaker (đen/trắng)
 * - SET 4:  Áo sơ mi sọc (xanh dương) + Quần tây (xanh navy) + Giày tây (đen)
 * - SET 5:  Áo sơ mi linen (trắng) + Quần vải suông (be) + Giày sneaker (trắng/be)
 * - SET 6:  Áo sơ mi denim (xanh jean) + Quần vải suông (đen) + Giày sneaker (trắng/xám)
 * - SET 7:  Áo thun oversize (trắng/họa tiết) + Quần jeans ống rộng (xanh nhạt) + Giày sneaker (trắng/xám)
 * - SET 8:  Áo hoodie (đen) + Quần jogger (xám đậm) + Giày sneaker (trắng/xám)
 * - SET 9:  Áo khoác gió (kem) + Quần cargo (xanh rêu) + Giày sneaker (trắng)
 * - SET 10: Áo thun họa tiết (xám đậm) + Quần cargo (xanh rêu) + Giày sneaker (trắng/xám)
 * - SET 11: Áo khoác bomber (đen) + Quần jean (xanh nhạt) + Giày sneaker (trắng)
 * - SET 12: Áo len cổ tròn (be) + Quần tây (xám đậm) + Giày sneaker (trắng)
 * - SET 13: Áo thun tay dài (sọc ngang) + Quần ống suông (xanh navy) + Giày sneaker (trắng/xám)
 * - SET 14: Áo hoodie (xám) + Quần jogger (đen) + Giày sneaker (trắng)
 * - SET 15: Áo sơ mi (trắng) + Quần tây (be) + Giày da (đen)
 * - SET 19: Áo polo (navy/trắng) + Quần vải suông/Quần âu + Giày sneaker / Derby
 */
export const STUDIO_TEMPLATES = [
  {
    id: 1,
    key: 'set_1',
    setNumber: 'SET 1',
    name: 'Áo sơ mi trắng + Quần tây + Giày sneaker',
    shortName: 'Sơ mi trắng + Quần tây',
    category: 'Smart Casual',
    topType: 'shirt_long',
    bottomType: 'trousers',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_1_model.jpg',
    cardImage: '/assets/templates/set_1_card.jpg',
    topBoxImage: '/assets/templates/set_1_top_box.jpg',
    botBoxImage: '/assets/templates/set_1_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_1_shoes_box.jpg',
    topName: 'Áo sơ mi trắng (trắng)',
    bottomName: 'Quần tây (đen)',
    shoesName: 'Giày sneaker (trắng)',
    itemIds: [260, 261, 262]
  },
  {
    id: 2,
    key: 'set_2',
    setNumber: 'SET 2',
    name: 'Áo sơ mi xanh nhạt + Quần vải suông + Giày sneaker',
    shortName: 'Sơ mi xanh nhạt + Quần suông beige',
    category: 'Korean Minimal',
    topType: 'shirt_long',
    bottomType: 'pants_wide',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_2_model.jpg',
    cardImage: '/assets/templates/set_2_card.jpg',
    topBoxImage: '/assets/templates/set_2_top_box.jpg',
    botBoxImage: '/assets/templates/set_2_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_2_shoes_box.jpg',
    topName: 'Áo sơ mi xanh nhạt (xanh nhạt)',
    bottomName: 'Quần vải suông (beige)',
    shoesName: 'Giày sneaker (trắng/xám)',
    itemIds: [263, 264, 265]
  },
  {
    id: 3,
    key: 'set_3',
    setNumber: 'SET 3',
    name: 'Áo sơ mi đen + Quần tây + Giày sneaker',
    shortName: 'Sơ mi đen + Quần tây xám',
    category: 'Dark Chic',
    topType: 'shirt_long',
    bottomType: 'trousers',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_3_model.jpg',
    cardImage: '/assets/templates/set_3_card.jpg',
    topBoxImage: '/assets/templates/set_3_top_box.jpg',
    botBoxImage: '/assets/templates/set_3_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_3_shoes_box.jpg',
    topName: 'Áo sơ mi đen (đen)',
    bottomName: 'Quần tây (xám)',
    shoesName: 'Giày sneaker (đen/trắng)',
    itemIds: [266, 267, 268]
  },
  {
    id: 4,
    key: 'set_4',
    setNumber: 'SET 4',
    name: 'Áo sơ mi sọc + Quần tây + Giày tây',
    shortName: 'Sơ mi sọc xanh + Quần navy',
    category: 'Sartorial Modern',
    topType: 'shirt_long',
    bottomType: 'trousers',
    shoesType: 'derby',
    modelImage: '/assets/templates/set_4_model.jpg',
    cardImage: '/assets/templates/set_4_card.jpg',
    topBoxImage: '/assets/templates/set_4_top_box.jpg',
    botBoxImage: '/assets/templates/set_4_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_4_shoes_box.jpg',
    topName: 'Áo sơ mi sọc (xanh dương)',
    bottomName: 'Quần tây (xanh navy)',
    shoesName: 'Giày tây (đen)',
    itemIds: [269, 270, 271]
  },
  {
    id: 5,
    key: 'set_5',
    setNumber: 'SET 5',
    name: 'Áo sơ mi linen + Quần vải suông + Giày sneaker',
    shortName: 'Sơ mi linen trắng + Quần suông be',
    category: 'Summer Resort',
    topType: 'shirt_long',
    bottomType: 'pants_wide',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_5_model.jpg',
    cardImage: '/assets/templates/set_5_card.jpg',
    topBoxImage: '/assets/templates/set_5_top_box.jpg',
    botBoxImage: '/assets/templates/set_5_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_5_shoes_box.jpg',
    topName: 'Áo sơ mi linen (trắng)',
    bottomName: 'Quần vải suông (be)',
    shoesName: 'Giày sneaker (trắng/be)',
    itemIds: [272, 273, 274]
  },
  {
    id: 6,
    key: 'set_6',
    setNumber: 'SET 6',
    name: 'Áo sơ mi denim + Quần vải suông + Giày sneaker',
    shortName: 'Sơ mi denim + Quần suông đen',
    category: 'Denim Casual',
    topType: 'shirt_long',
    bottomType: 'pants_wide',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_6_model.jpg',
    cardImage: '/assets/templates/set_6_card.jpg',
    topBoxImage: '/assets/templates/set_6_top_box.jpg',
    botBoxImage: '/assets/templates/set_6_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_6_shoes_box.jpg',
    topName: 'Áo sơ mi denim (xanh jean)',
    bottomName: 'Quần vải suông (đen)',
    shoesName: 'Giày sneaker (trắng/xám)',
    itemIds: [275, 276, 277]
  },
  {
    id: 7,
    key: 'set_7',
    setNumber: 'SET 7',
    name: 'Áo thun oversize + Quần jeans ống rộng + Giày sneaker',
    shortName: 'Thun oversize + Jeans rộng',
    category: 'Street Graphic',
    topType: 'tshirt_short',
    bottomType: 'jeans_straight',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_7_model.jpg',
    cardImage: '/assets/templates/set_7_card.jpg',
    topBoxImage: '/assets/templates/set_7_top_box.jpg',
    botBoxImage: '/assets/templates/set_7_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_7_shoes_box.jpg',
    topName: 'Áo thun oversize (trắng/in họa tiết)',
    bottomName: 'Quần jeans ống rộng (xanh nhạt)',
    shoesName: 'Giày sneaker (trắng/xám)',
    itemIds: [287, 288, 265]
  },
  {
    id: 8,
    key: 'set_8',
    setNumber: 'SET 8',
    name: 'Áo hoodie + Quần jogger + Giày sneaker',
    shortName: 'Hoodie đen + Jogger xám',
    category: 'Streetwear Warm',
    topType: 'hoodie',
    bottomType: 'jogger',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_8_model.jpg',
    cardImage: '/assets/templates/set_8_card.jpg',
    topBoxImage: '/assets/templates/set_8_top_box.jpg',
    botBoxImage: '/assets/templates/set_8_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_8_shoes_box.jpg',
    topName: 'Hoodie (đen)',
    bottomName: 'Quần jogger (xám đậm)',
    shoesName: 'Giày sneaker (trắng/xám)',
    itemIds: [289, 290, 265]
  },
  {
    id: 9,
    key: 'set_9',
    setNumber: 'SET 9',
    name: 'Áo khoác gió + Quần cargo + Giày sneaker',
    shortName: 'Khoác gió kem + Quần cargo',
    category: 'Sport Clean',
    topType: 'blazer',
    bottomType: 'cargo',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_9_model.jpg',
    cardImage: '/assets/templates/set_9_card.jpg',
    topBoxImage: '/assets/templates/set_9_top_box.jpg',
    botBoxImage: '/assets/templates/set_9_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_9_shoes_box.jpg',
    topName: 'Áo khoác gió (kem)',
    bottomName: 'Quần cargo (xanh rêu)',
    shoesName: 'Giày sneaker (trắng)',
    itemIds: [291, 292, 262]
  },
  {
    id: 10,
    key: 'set_10',
    setNumber: 'SET 10',
    name: 'Áo thun họa tiết + Quần cargo + Giày sneaker',
    shortName: 'Thun họa tiết xám + Cargo xanh rêu',
    category: 'Urban Street',
    topType: 'tshirt_short',
    bottomType: 'cargo',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_10_model.jpg',
    cardImage: '/assets/templates/set_10_card.jpg',
    topBoxImage: '/assets/templates/set_10_top_box.jpg',
    botBoxImage: '/assets/templates/set_10_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_10_shoes_box.jpg',
    topName: 'Áo thun họa tiết (xám đậm)',
    bottomName: 'Quần cargo (xanh rêu)',
    shoesName: 'Giày sneaker (trắng/xám)',
    itemIds: [295, 292, 265]
  },
  {
    id: 11,
    key: 'set_11',
    setNumber: 'SET 11',
    name: 'Áo khoác bomber + Quần jeans + Giày sneaker',
    shortName: 'Bomber đen + Jeans xanh nhạt',
    category: 'City Casual',
    topType: 'blazer',
    bottomType: 'jeans_straight',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_11_model.jpg',
    cardImage: '/assets/templates/set_11_card.jpg',
    topBoxImage: '/assets/templates/set_11_top_box.jpg',
    botBoxImage: '/assets/templates/set_11_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_11_shoes_box.jpg',
    topName: 'Áo khoác bomber (đen)',
    bottomName: 'Quần jean (xanh nhạt)',
    shoesName: 'Giày sneaker (trắng)',
    itemIds: [293, 288, 262]
  },
  {
    id: 12,
    key: 'set_12',
    setNumber: 'SET 12',
    name: 'Áo len cổ tròn + Quần tây + Giày sneaker',
    shortName: 'Len cổ tròn be + Quần tây xám',
    category: 'Soft Minimal',
    topType: 'sweater',
    bottomType: 'trousers',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_12_model.jpg',
    cardImage: '/assets/templates/set_12_card.jpg',
    topBoxImage: '/assets/templates/set_12_top_box.jpg',
    botBoxImage: '/assets/templates/set_12_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_12_shoes_box.jpg',
    topName: 'Áo len cổ tròn (be)',
    bottomName: 'Quần tây (xám đậm)',
    shoesName: 'Giày sneaker (trắng)',
    itemIds: [294, 267, 262]
  },
  {
    id: 13,
    key: 'set_13',
    setNumber: 'SET 13',
    name: 'Áo thun tay dài + Quần ống suông + Giày',
    shortName: 'Thun dài sọc + Quần suông navy',
    category: 'Retro Street',
    topType: 'shirt_long',
    bottomType: 'pants_wide',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_13_model.jpg',
    cardImage: '/assets/templates/set_13_card.jpg',
    topBoxImage: '/assets/templates/set_13_top_box.jpg',
    botBoxImage: '/assets/templates/set_13_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_13_shoes_box.jpg',
    topName: 'Áo thun tay dài (sọc ngang)',
    bottomName: 'Quần ống suông (xanh navy)',
    shoesName: 'Sneaker (trắng/xám)',
    itemIds: [278, 279, 280]
  },
  {
    id: 14,
    key: 'set_14',
    setNumber: 'SET 14',
    name: 'Áo hoodie + Quần jogger + Giày sneaker',
    shortName: 'Hoodie xám + Quần jogger đen',
    category: 'Athleisure Comfort',
    topType: 'hoodie',
    bottomType: 'jogger',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_14_model.jpg',
    cardImage: '/assets/templates/set_14_card.jpg',
    topBoxImage: '/assets/templates/set_14_top_box.jpg',
    botBoxImage: '/assets/templates/set_14_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_14_shoes_box.jpg',
    topName: 'Hoodie (xám)',
    bottomName: 'Quần jogger (đen)',
    shoesName: 'Sneaker (trắng)',
    itemIds: [281, 282, 283]
  },
  {
    id: 15,
    key: 'set_15',
    setNumber: 'SET 15',
    name: 'Áo sơ mi + Quần tây + Giày da',
    shortName: 'Sơ mi trắng + Quần tây be + Giày da',
    category: 'Classic Formal',
    topType: 'shirt_long',
    bottomType: 'trousers',
    shoesType: 'derby',
    modelImage: '/assets/templates/set_15_model.jpg',
    cardImage: '/assets/templates/set_15_card.jpg',
    topBoxImage: '/assets/templates/set_15_top_box.jpg',
    botBoxImage: '/assets/templates/set_15_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_15_shoes_box.jpg',
    topName: 'Áo sơ mi (trắng)',
    bottomName: 'Quần tây (be)',
    shoesName: 'Giày da (đen)',
    itemIds: [284, 285, 286]
  },
  {
    id: 19,
    key: 'set_19',
    setNumber: 'SET 19',
    name: 'Áo polo + Quần vải suông / Quần âu + Giày sneaker',
    shortName: 'Áo polo cộc tay + Quần suông dài',
    category: 'Smart Casual',
    topType: 'polo',
    bottomType: 'pants_wide',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/model_polo_cream_trousers.jpg',
    cardImage: '/assets/templates/tpl_19_polo_trousers.jpg',
    topBoxImage: '/assets/templates/model_polo_white_trousers.jpg',
    botBoxImage: '/assets/templates/set_2_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_2_shoes_box.jpg',
    topName: 'Áo polo cộc tay (navy/trắng/be)',
    bottomName: 'Quần vải suông dài (cream/beige/đen)',
    shoesName: 'Giày sneaker / Derby da',
    itemIds: [211, 205, 251, 252, 203, 264]
  },
  {
    id: 20,
    key: 'set_20',
    setNumber: 'SET 20',
    name: 'Áo polo + Quần short + Giày sneaker',
    shortName: 'Áo polo cộc tay + Quần short',
    category: 'Summer Casual',
    topType: 'polo',
    bottomType: 'shorts',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/model_polo_navy.jpg',
    cardImage: '/assets/templates/card_4_polo_shorts.jpg',
    topBoxImage: '/assets/templates/model_polo_white_trousers.jpg',
    botBoxImage: '/assets/templates/set_1_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_1_shoes_box.jpg',
    topName: 'Áo polo cộc tay (navy)',
    bottomName: 'Quần short (beige/đen)',
    shoesName: 'Giày sneaker (trắng)',
    itemIds: [220, 221]
  }
];

export default function StudioLookbookModel({
  gender = 'Nam',
  templateId = null,
  viewMode = 'model', // 'model' hoặc 'card'
  topItem = null,
  bottomItem = null,
  shoesItem = null,
  topType = 'shirt_long',
  topColor = '#FFFFFF',
  bottomType = 'trousers',
  bottomColor = '#1E293B',
  shoesType = 'sneaker',
  compact = false
}) {
  const isMale = (gender || '').toLowerCase().includes('nam') || (gender || '').toLowerCase().includes('male');

  // TỰ ĐỘNG CHỌN SET TEMPLATE PHÙ HỢP NHẤT DỰA VÀO ĐỒ ĐANG CHỌN
  const selectedTemplate = useMemo(() => {
    if (!isMale) return null;

    // 1. Nếu có templateId chỉ định rõ
    if (templateId) {
      const match = STUDIO_TEMPLATES.find(t => t.id === Number(templateId));
      if (match) return match;
    }

    // 2. Nếu có item Áo (topItem) khớp trực tiếp ID trong template
    if (topItem?.id) {
      const matchTop = STUDIO_TEMPLATES.find(t => t.itemIds && t.itemIds.includes(topItem.id));
      if (matchTop) return matchTop;
    }

    // 3. ƯU TIÊN SỐ 1 TUYỆT ĐỐI: DỰA TRÊN LOẠI ÁO (TOP)
    // Áo là thành phần quyết định cốt lõi form người mẫu, không bao giờ để giày hay quần ép đổi loại áo!
    const topName = (topItem?.name || '').toLowerCase();
    const botName = (bottomItem?.name || '').toLowerCase();
    const shoesName = (shoesItem?.name || '').toLowerCase();

    // A. ÁO POLO (Nhận diện chính xác cả topType === 'polo' lẫn từ khóa polo, pique, dệt kim cable knit, cổ bẻ)
    if (topType === 'polo' || topName.includes('polo') || topName.includes('pique') || topName.includes('cổ bẻ') || (topName.includes('cable knit') && topName.includes('dệt kim'))) {
      const isShorts = bottomType === 'shorts' || botName.includes('short') || botName.includes('đùi') || botName.includes('ngắn');
      if (isShorts) {
        return STUDIO_TEMPLATES.find(t => t.id === 20) || STUDIO_TEMPLATES.find(t => t.id === 19);
      }
      
      const poloTemplate = STUDIO_TEMPLATES.find(t => t.id === 19) || STUDIO_TEMPLATES[0];
      if (botName.includes('đen') || botName.includes('tối')) {
        return { ...poloTemplate, modelImage: '/assets/templates/model_polo_black_trousers.jpg' };
      }
      return { ...poloTemplate, modelImage: '/assets/templates/model_polo_cream_trousers.jpg' };
    }

    // B. ÁO SƠ MI (Chỉ khớp các Set Sơ Mi khi người dùng thực sự chọn áo sơ mi)
    const isShirt = topType === 'shirt_long' || topType === 'shirt_short' || topName.includes('sơ mi') || topName.includes('oxford') || topName.includes('linen') || topName.includes('denim') || topName.includes('shirt');

    if (isShirt) {
      // 1. Áo sơ mi denim (Set 6)
      if (topName.includes('denim') || topName.includes('jean')) {
        return STUDIO_TEMPLATES.find(t => t.id === 6) || STUDIO_TEMPLATES[5];
      }

      // 2. Áo sơ mi linen (Set 5)
      if (topName.includes('linen') || topName.includes('đũi')) {
        return STUDIO_TEMPLATES.find(t => t.id === 5) || STUDIO_TEMPLATES[4];
      }

      // 3. Áo sơ mi kẻ sọc / sọc xanh (Set 4)
      if (topName.includes('sọc') || topName.includes('kẻ') || topName.includes('stripe')) {
        return STUDIO_TEMPLATES.find(t => t.id === 4) || STUDIO_TEMPLATES[3];
      }

      // 4. Áo sơ mi đen (Set 3)
      if (topName.includes('đen') || topName.includes('tối')) {
        return STUDIO_TEMPLATES.find(t => t.id === 3) || STUDIO_TEMPLATES[2];
      }

      // 5. Áo sơ mi xanh nhạt (Set 2)
      if (topName.includes('xanh nhạt') || topName.includes('oxford')) {
        return STUDIO_TEMPLATES.find(t => t.id === 2) || STUDIO_TEMPLATES[1];
      }

      // 6. Quần tây be + Giày da / Sơ mi trắng (Set 15)
      if (botName.includes('be') && (shoesName.includes('da') || shoesName.includes('loafer') || shoesName.includes('derby') || shoesName.includes('tây'))) {
        return STUDIO_TEMPLATES.find(t => t.id === 15) || STUDIO_TEMPLATES[11];
      }

      // 7. Giày tây / Derby kết hợp với sơ mi (Set 4)
      if (shoesName.includes('derby') || shoesName.includes('tây')) {
        return STUDIO_TEMPLATES.find(t => t.id === 4) || STUDIO_TEMPLATES[3];
      }

      // 8. Quần vải suông be (Set 2)
      if (botName.includes('suông') && (botName.includes('beige') || botName.includes('cream'))) {
        return STUDIO_TEMPLATES.find(t => t.id === 2) || STUDIO_TEMPLATES[1];
      }

      // Mặc định cho Áo sơ mi: SET 1 (Sơ mi trắng + Quần tây đen + Sneaker)
      return STUDIO_TEMPLATES[0];
    }

    // C. HOODIE & SWEATSHIRT FORM DÀY
    if (topType === 'hoodie' || topName.includes('hoodie')) {
      if (topName.includes('đen') || botName.includes('xám')) {
        return STUDIO_TEMPLATES.find(t => t.id === 8) || STUDIO_TEMPLATES[7]; // Set 8: Hoodie đen + Jogger xám
      }
      return STUDIO_TEMPLATES.find(t => t.id === 14) || STUDIO_TEMPLATES[10]; // Set 14: Hoodie xám + Jogger đen
    }

    // D. ÁO KHOÁC / BOMBER / JACKET / BLAZER
    if (topType === 'blazer' || topName.includes('khoác') || topName.includes('jacket') || topName.includes('bomber') || topName.includes('vest')) {
      if (topName.includes('bomber') || topName.includes('đen')) {
        return STUDIO_TEMPLATES.find(t => t.id === 11) || STUDIO_TEMPLATES.find(t => t.id === 9); // Set 11: Bomber đen + Quần jean
      }
      return STUDIO_TEMPLATES.find(t => t.id === 9) || STUDIO_TEMPLATES[8]; // Set 9: Áo khoác gió kem + Quần cargo
    }

    // E. ÁO LEN / SWEATER / KNITWEAR (Set 12)
    if (topType === 'sweater' || topName.includes('len') || topName.includes('sweater') || (topName.includes('knit') && !topName.includes('polo'))) {
      return STUDIO_TEMPLATES.find(t => t.id === 12) || STUDIO_TEMPLATES[0]; // Set 12: Len cổ tròn be + Quần tây xám
    }

    // F. ÁO THUN DÀI TAY SỌC / RETRO STREET (Set 13) - Chỉ áo thun, không bao giờ nhầm sang sơ mi
    if ((topType === 'tshirt_long' || topName.includes('thun') || topName.includes('tee')) && (topName.includes('sọc') || topName.includes('thủy thủ'))) {
      return STUDIO_TEMPLATES.find(t => t.id === 13) || STUDIO_TEMPLATES[9];
    }

    // G. ÁO THUN / OVERSIZE / T-SHIRT (Set 7 hoặc Set 10)
    if (topType === 'tshirt_short' || topType === 'tshirt_long' || topName.includes('thun') || topName.includes('t-shirt') || topName.includes('tee') || topName.includes('oversize')) {
      if (topName.includes('oversize') || botName.includes('jeans') || botName.includes('bò') || topName.includes('trắng')) {
        return STUDIO_TEMPLATES.find(t => t.id === 7) || STUDIO_TEMPLATES[6]; // Set 7: Thun oversize trắng + Jeans ống rộng
      }
      if (topName.includes('xám') || botName.includes('cargo') || botName.includes('túi hộp') || botName.includes('rêu')) {
        return STUDIO_TEMPLATES.find(t => t.id === 10) || STUDIO_TEMPLATES.find(t => t.id === 7); // Set 10: Thun họa tiết xám + Cargo
      }
      return STUDIO_TEMPLATES.find(t => t.id === 7) || STUDIO_TEMPLATES[6]; // Mặc định áo thun: Set 7
    }

    // 4. Nếu chưa chọn Áo, phân loại theo Quần / Giày đã chọn
    const currentItemIds = [bottomItem?.id, shoesItem?.id].filter(Boolean);
    if (currentItemIds.length > 0) {
      for (const tpl of STUDIO_TEMPLATES) {
        if (tpl.itemIds && tpl.itemIds.some(id => currentItemIds.includes(id))) {
          return tpl;
        }
      }
    }

    if (botName.includes('be') && (shoesName.includes('da') || shoesName.includes('loafer'))) {
      return STUDIO_TEMPLATES.find(t => t.id === 15) || STUDIO_TEMPLATES[11];
    }
    if (botName.includes('suông') && botName.includes('beige')) {
      return STUDIO_TEMPLATES.find(t => t.id === 2) || STUDIO_TEMPLATES[1];
    }

    // Mặc định: SET 1
    return STUDIO_TEMPLATES[0];
  }, [isMale, templateId, topItem, bottomItem, shoesItem, topType, bottomType]);

  // Nguồn ảnh render
  const resolvedImage = useMemo(() => {
    if (isMale) {
      if (!selectedTemplate) return '/assets/templates/set_1_model.jpg';
      return viewMode === 'card' ? selectedTemplate.cardImage : selectedTemplate.modelImage;
    } else {
      // Phom nữ
      if (bottomType === 'dress' || topType === 'dress') return '/assets/fits/model_female_dress.jpg';
      if (topType === 'camisole' || bottomType === 'skirt_mini') return '/assets/fits/model_female_cami_skirt.jpg';
      if (topType === 'croptop') return '/assets/fits/model_female_croptop_jeans.jpg';
      if (topType === 'tanktop') return '/assets/fits/model_female_tank_dark.jpg';
      if (topType === 'sweater') return '/assets/fits/model_female_sweat_dark.jpg';
      return '/assets/fits/model_female_croptop_jeans.jpg';
    }
  }, [isMale, selectedTemplate, viewMode, topType, bottomType]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: 0,
      aspectRatio: 'auto',
      maxHeight: '100%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FFFFFF',
      borderRadius: '20px',
      boxShadow: '0 18px 45px rgba(0,0,0,0.65)'
    }}>
      <img
        src={resolvedImage}
        alt={selectedTemplate ? selectedTemplate.name : 'Model Studio'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center center'
        }}
      />
    </div>
  );
}
