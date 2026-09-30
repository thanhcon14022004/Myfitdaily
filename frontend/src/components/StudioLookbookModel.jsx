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

/**
 * BỘ SƯU TẬP 9 SET TEMPLATE NGƯỜI MẪU NỮ STUDIO THỜI TRANG ĐỘ NÉT CAO (HD)
 * Được trích xuất trực tiếp từ catalog ảnh studio người mẫu chuẩn lookbook:
 * - SET 1: Áo thun oversize + Quần jeans ống rộng + Giày sneaker + Túi tote
 * - SET 2: Áo cardigan + Áo thun + Chân váy ngắn xếp ly + Giày thể thao + Túi đeo chéo
 * - SET 3: Áo khoác denim + Áo tank top + Quần ống suông + Giày platform
 * - SET 4: Áo trễ vai + Quần ống rộng jean + Giày sneaker + Túi tote
 * - SET 5: Áo khoác blazer + Áo thun + Chân váy ngắn xếp ly + Giày thể thao + Túi đeo chéo
 * - SET 6: Áo cardigan + Áo tank top + Quần jeans ống suông + Giày sneaker + Túi xách
 * - SET 7: Áo thun + Áo khoác cardigan + Quần ống rộng + Giày sneaker + Túi tote
 * - SET 8: Áo sơ mi + Gile len + Chân váy ngắn xếp ly + Giày loafer + Túi đeo chéo
 * - SET 9: Áo hai dây + Áo khoác denim + Quần jeans ống suông + Giày sneaker + Túi xách
 */
export const FEMALE_STUDIO_TEMPLATES = [
  {
    id: 1,
    key: 'female_set_1',
    setNumber: 'SET 1',
    name: 'Áo thun + Quần jeans ống rộng + Giày sneaker + Túi tote',
    shortName: 'Thun oversize + Jeans ống rộng',
    category: 'Y2K Street',
    topType: 'tshirt_short',
    bottomType: 'jeans_straight',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_female_1_model.jpg',
    cardImage: '/assets/templates/set_female_1_card.jpg',
    topBoxImage: '/assets/templates/set_female_1_top_box.jpg',
    botBoxImage: '/assets/templates/set_female_1_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_female_1_shoes_box.jpg',
    topName: 'Áo thun oversize (trắng, in họa tiết)',
    bottomName: 'Quần jeans ống rộng (xanh nhạt)',
    shoesName: 'Giày sneaker (trắng/xám)',
    itemIds: [202, 212, 204]
  },
  {
    id: 2,
    key: 'female_set_2',
    setNumber: 'SET 2',
    name: 'Áo cardigan + Áo thun + Chân váy ngắn + Giày thể thao + Túi đeo chéo',
    shortName: 'Cardigan pastel + Chân váy ngắn',
    category: 'Soft Girl',
    topType: 'cardigan',
    bottomType: 'skirt_mini',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_female_2_model.jpg',
    cardImage: '/assets/templates/set_female_2_card.jpg',
    topBoxImage: '/assets/templates/set_female_2_top_box.jpg',
    botBoxImage: '/assets/templates/set_female_2_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_female_2_shoes_box.jpg',
    topName: 'Cardigan len mỏng (hồng pastel) + Áo thun basic',
    bottomName: 'Chân váy ngắn xếp ly (trắng)',
    shoesName: 'Giày thể thao (trắng/hồng)',
    itemIds: [242, 204]
  },
  {
    id: 3,
    key: 'female_set_3',
    setNumber: 'SET 3',
    name: 'Áo khoác denim + Áo tank top + Quần ống suông + Giày platform',
    shortName: 'Khoác denim + Quần ống suông đen',
    category: 'Chic Modern',
    topType: 'jacket_bomber',
    bottomType: 'pants_wide',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_female_3_model.jpg',
    cardImage: '/assets/templates/set_female_3_card.jpg',
    topBoxImage: '/assets/templates/set_female_3_top_box.jpg',
    botBoxImage: '/assets/templates/set_female_3_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_female_3_shoes_box.jpg',
    topName: 'Áo khoác denim (xanh nhạt) + Áo tank top (trắng)',
    bottomName: 'Quần ống suông (đen)',
    shoesName: 'Giày platform (trắng)',
    itemIds: [240, 264]
  },
  {
    id: 4,
    key: 'female_set_4',
    setNumber: 'SET 4',
    name: 'Áo trễ vai + Quần ống rộng + Giày sneaker + Túi tote',
    shortName: 'Áo trễ vai + Jeans ống rộng',
    category: 'Soft Girl Vibes',
    topType: 'croptop',
    bottomType: 'jeans_straight',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_female_4_model.jpg',
    cardImage: '/assets/templates/set_female_4_card.jpg',
    topBoxImage: '/assets/templates/set_female_4_top_box.jpg',
    botBoxImage: '/assets/templates/set_female_4_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_female_4_shoes_box.jpg',
    topName: 'Áo trễ vai (xanh pastel) + Áo hai dây (trắng)',
    bottomName: 'Quần ống rộng jean (xanh nhạt)',
    shoesName: 'Giày sneaker (trắng/xám)',
    itemIds: [212]
  },
  {
    id: 5,
    key: 'female_set_5',
    setNumber: 'SET 5',
    name: 'Áo khoác blazer + Áo thun + Chân váy ngắn + Giày thể thao + Túi đeo chéo',
    shortName: 'Blazer navy + Chân váy xếp ly',
    category: 'Cool Girl',
    topType: 'blazer',
    bottomType: 'skirt_mini',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_female_5_model.jpg',
    cardImage: '/assets/templates/set_female_5_card.jpg',
    topBoxImage: '/assets/templates/set_female_5_top_box.jpg',
    botBoxImage: '/assets/templates/set_female_5_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_female_5_shoes_box.jpg',
    topName: 'Blazer oversize (xanh navy) + Áo thun basic',
    bottomName: 'Chân váy ngắn xếp ly (trắng)',
    shoesName: 'Giày thể thao (trắng/xám)',
    itemIds: [242]
  },
  {
    id: 6,
    key: 'female_set_6',
    setNumber: 'SET 6',
    name: 'Áo cardigan + Áo tank top + Quần jeans ống suông + Giày sneaker + Túi xách',
    shortName: 'Cardigan kem + Jeans ống suông xám',
    category: 'Minimal Chic',
    topType: 'cardigan',
    bottomType: 'jeans_straight',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_female_6_model.jpg',
    cardImage: '/assets/templates/set_female_6_card.jpg',
    topBoxImage: '/assets/templates/set_female_6_top_box.jpg',
    botBoxImage: '/assets/templates/set_female_6_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_female_6_shoes_box.jpg',
    topName: 'Cardigan len (kem) + Áo tank top (trắng)',
    bottomName: 'Quần jeans ống suông (xám đậm)',
    shoesName: 'Giày sneaker (trắng/xám)',
    itemIds: [240]
  },
  {
    id: 7,
    key: 'female_set_7',
    setNumber: 'SET 7',
    name: 'Áo thun + Áo khoác cardigan + Quần ống rộng + Giày sneaker + Túi tote',
    shortName: 'Thun + Cardigan xanh + Quần rộng',
    category: 'Daily Casual',
    topType: 'cardigan',
    bottomType: 'pants_wide',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_female_7_model.jpg',
    cardImage: '/assets/templates/set_female_7_card.jpg',
    topBoxImage: '/assets/templates/set_female_7_top_box.jpg',
    botBoxImage: '/assets/templates/set_female_7_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_female_7_shoes_box.jpg',
    topName: 'Áo thun oversize + Cardigan len (xanh pastel)',
    bottomName: 'Quần ống rộng (xanh nhạt)',
    shoesName: 'Giày sneaker (trắng)',
    itemIds: [202, 212]
  },
  {
    id: 8,
    key: 'female_set_8',
    setNumber: 'SET 8',
    name: 'Áo sơ mi + Gile len + Chân váy ngắn + Giày loafer + Túi đeo chéo',
    shortName: 'Sơ mi + Gile len + Chân váy xếp ly',
    category: 'Preppy Academy',
    topType: 'shirt_long',
    bottomType: 'skirt_mini',
    shoesType: 'derby',
    modelImage: '/assets/templates/set_female_8_model.jpg',
    cardImage: '/assets/templates/set_female_8_card.jpg',
    topBoxImage: '/assets/templates/set_female_8_top_box.jpg',
    botBoxImage: '/assets/templates/set_female_8_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_female_8_shoes_box.jpg',
    topName: 'Áo sơ mi trắng (dáng rộng) + Gile len (xanh navy)',
    bottomName: 'Chân váy ngắn xếp ly (xám đậm)',
    shoesName: 'Giày loafer (đen)',
    itemIds: [242]
  },
  {
    id: 9,
    key: 'female_set_9',
    setNumber: 'SET 9',
    name: 'Áo hai dây + Áo khoác denim + Quần jeans ống suông + Giày sneaker + Túi xách',
    shortName: 'Áo hai dây + Khoác denim + Jeans suông',
    category: 'Trendy Street',
    topType: 'camisole',
    bottomType: 'jeans_straight',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_female_9_model.jpg',
    cardImage: '/assets/templates/set_female_9_card.jpg',
    topBoxImage: '/assets/templates/set_female_9_top_box.jpg',
    botBoxImage: '/assets/templates/set_female_9_bot_box.jpg',
    shoesBoxImage: '/assets/templates/set_female_9_shoes_box.jpg',
    topName: 'Áo hai dây (trắng) + Áo khoác denim (xanh nhạt)',
    bottomName: 'Quần jeans ống suông (xanh nhạt)',
    shoesName: 'Giày sneaker (trắng)',
    itemIds: [240, 212]
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
  const templates = isMale ? STUDIO_TEMPLATES : FEMALE_STUDIO_TEMPLATES;

  // TỰ ĐỘNG CHỌN SET TEMPLATE PHÙ HỢP NHẤT DỰA VÀO ĐỒ ĐANG CHỌN
  const selectedTemplate = useMemo(() => {
    // 1. Nếu có templateId chỉ định rõ
    if (templateId) {
      const match = templates.find(t => t.id === Number(templateId));
      if (match) return match;
    }

    // 2. KHỚP NGUYÊN BẢN THEO BỘ (FULL SET MATCH): Cả Áo VÀ Quần đều thuộc cùng 1 SET
    if (topItem?.id && bottomItem?.id) {
      const exactSet = templates.find(t => 
        t.itemIds && t.itemIds.includes(topItem.id) && t.itemIds.includes(bottomItem.id)
      );
      if (exactSet) return exactSet;
    }

    // 3. Nếu chỉ mới chọn Áo (chưa chọn Quần) -> Khớp set của Áo
    if (topItem?.id && !bottomItem) {
      const matchTop = templates.find(t => t.itemIds && t.itemIds.includes(topItem.id));
      if (matchTop) return matchTop;
    }

    // 4. Nếu chỉ mới chọn Quần (chưa chọn Áo) -> Khớp set của Quần
    if (!topItem && bottomItem?.id) {
      const matchBot = templates.find(t => t.itemIds && t.itemIds.includes(bottomItem.id));
      if (matchBot) return matchBot;
    }

    // 5. PHÂN TÍCH NHẬN DIỆN KIỂU DÁNG OUTFIT (SILHOUETTE / FORM DÁNG CHUẨN THỜI TRANG)
    // Nhận diện chuẩn xác theo KIỂU OUTFIT (Top Type + Bottom Type), KHÔNG phụ thuộc vào màu sắc!
    const normalizeStr = (v = '') => String(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd');
    const topName = normalizeStr(`${topItem?.name || ''} ${topItem?.description || ''}`);
    const botName = normalizeStr(`${bottomItem?.name || ''} ${bottomItem?.description || ''}`);

    // =========================================================================
    // A. MA TRẬN GHÉP OUTFIT CHO NỮ (FEMALE SILHOUETTE MATCHING MATRIX)
    // =========================================================================
    if (!isMale) {
      const isSkirt = bottomType === 'skirt_mini' || bottomType === 'skirt_midi' || 
        /chan vay|vay|skirt|xep ly|chu a/.test(botName);
      const isDenimBottom = bottomType === 'jeans_straight' || /jean|bo|denim/.test(botName);
      const isWidePants = bottomType === 'pants_wide' || /suong|ong rong|wide leg|vai suong/.test(botName);
      const isDarkPants = /den|toi|dark|black|xam than/.test(botName);

      const isCardigan = topType === 'cardigan' || /cardigan|khoac len|len mong/.test(topName);
      const isBlazer = topType === 'blazer' || /blazer|vest|suit/.test(topName);
      const isGileShirt = topType === 'shirt_long' || topType === 'shirt_short' || /so mi|shirt|gile|gilet/.test(topName);
      const isOffShoulder = /tre vai|lech vai|off shoulder/.test(topName);
      const isDenimJacket = /khoac denim|khoac jean|jean jacket|ao denim/.test(topName);
      const isCamiTank = topType === 'camisole' || topType === 'tanktop' || topType === 'croptop' || 
        /hai day|2 day|ba lo|tank|croptop|cami/.test(topName);
      const isTshirt = topType === 'tshirt_short' || topType === 'tshirt_long' || /thun|tee|t-shirt|oversize/.test(topName);
      const isSweater = topType === 'sweater' || /len|sweater|knit/.test(topName);

      // 1. Chân váy ngắn
      if (isSkirt) {
        if (isGileShirt) return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 8) || FEMALE_STUDIO_TEMPLATES[7]; // Set 8: Sơ mi + Gile len + Chân váy xếp ly + Loafer
        if (isBlazer) return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 5) || FEMALE_STUDIO_TEMPLATES[4]; // Set 5: Blazer + Áo thun + Chân váy xếp ly
        if (isCardigan || isSweater) return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 2) || FEMALE_STUDIO_TEMPLATES[1]; // Set 2: Cardigan len + Chân váy xếp ly
        if (isTshirt) return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 2) || FEMALE_STUDIO_TEMPLATES[4];
        return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 2) || FEMALE_STUDIO_TEMPLATES[1]; // Mặc định Chân váy: Set 2
      }

      // 2. Áo trễ vai
      if (isOffShoulder) {
        return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 4) || FEMALE_STUDIO_TEMPLATES[3]; // Set 4: Áo trễ vai + Quần ống rộng jean
      }

      // 3. Áo khoác Denim
      if (isDenimJacket) {
        if (isDarkPants || (isWidePants && !isDenimBottom)) {
          return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 3) || FEMALE_STUDIO_TEMPLATES[2]; // Set 3: Khoác denim + Quần ống suông đen
        }
        return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 9) || FEMALE_STUDIO_TEMPLATES[8]; // Set 9: Khoác denim + Quần jeans ống suông
      }

      // 4. Áo Cardigan / Áo Len
      if (isCardigan || isSweater) {
        if (isWidePants && !isDenimBottom) {
          return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 7) || FEMALE_STUDIO_TEMPLATES[6]; // Set 7: Cardigan xanh + Quần ống rộng
        }
        if (isDarkPants) {
          return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 6) || FEMALE_STUDIO_TEMPLATES[5]; // Set 6: Cardigan kem + Quần jeans xám đậm
        }
        return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 6) || FEMALE_STUDIO_TEMPLATES[5];
      }

      // 5. Áo hai dây / Tank top / Croptop
      if (isCamiTank) {
        if (isDarkPants || (isWidePants && !isDenimBottom)) {
          return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 3) || FEMALE_STUDIO_TEMPLATES[2]; // Set 3: Áo tank top + Quần ống suông đen
        }
        return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 9) || FEMALE_STUDIO_TEMPLATES[8]; // Set 9: Áo hai dây + Quần jeans suông
      }

      // 6. Áo Blazer
      if (isBlazer) {
        return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 5) || FEMALE_STUDIO_TEMPLATES[4];
      }

      // 7. Áo Sơ mi / Gile
      if (isGileShirt) {
        return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 8) || FEMALE_STUDIO_TEMPLATES[7];
      }

      // 8. Áo thun (T-shirt / Oversize)
      if (isTshirt) {
        return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 1) || FEMALE_STUDIO_TEMPLATES[0]; // Set 1: Áo thun oversize + Quần jeans ống rộng
      }

      // 9. Khi chỉ mới chọn Quần/Váy
      if (isSkirt) return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 2) || FEMALE_STUDIO_TEMPLATES[1];
      if (isDarkPants) return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 3) || FEMALE_STUDIO_TEMPLATES[2];
      if (isDenimBottom || isWidePants) return FEMALE_STUDIO_TEMPLATES.find(t => t.id === 1) || FEMALE_STUDIO_TEMPLATES[0];

      // Mặc định nữ: Set 1
      return FEMALE_STUDIO_TEMPLATES[0];
    }

    // =========================================================================
    // B. MA TRẬN GHÉP OUTFIT CHO NAM (MALE SILHOUETTE MATCHING MATRIX)
    // =========================================================================
    // --- Phân loại kiểu quần (Bottom Silhouette) ---
    const isShorts = bottomType === 'shorts' || bottomType === 'shorts_denim' || 
      /short|dui|ngan|lung/.test(botName);

    const isCargo = bottomType === 'cargo' || 
      /cargo|tui hop|parachute/.test(botName);

    const isJogger = bottomType === 'jogger' || 
      /jogger|bo gau|ni thun/.test(botName);

    const isJeans = bottomType === 'jeans_straight' || 
      /jean|denim|quan bo/.test(botName);

    // Quần Tây / Quần Âu: Nhận diện quần tây may đo, quần âu công sở, quần xếp ly
    const isTrousers = bottomType === 'trousers' || 
      /quan tay|quan au|xep ly|trouser|chino/.test(botName) ||
      (/\btay\b/.test(botName) && !/nau tay|ngan tay|dai tay/.test(botName));

    // Quần Suông: Là quần vải suông / ống rộng / dây rút mà không phải quần tây may đo
    const isLoosePants = !isTrousers && (bottomType === 'pants_wide' || 
      /suong|ong rong|wide leg|day rut|relaxed|vai suong/.test(botName));

    // --- Phân loại kiểu áo (Top Silhouette) ---
    const isPolo = topType === 'polo' || /polo|pique|co be/.test(topName);
    const isShirt = topType === 'shirt_long' || topType === 'shirt_short' || /so mi|shirt/.test(topName);
    const isHoodie = topType === 'hoodie' || /hoodie|co mu|mu trum/.test(topName);
    const isBomber = /bomber|varsity/.test(topName);
    const isWindbreaker = /ao gio|khoac gio|windbreaker/.test(topName);
    const isJacket = isBomber || isWindbreaker || topType === 'blazer' || topType === 'jacket_bomber' || /khoac|jacket|blazer|vest/.test(topName);
    const isSweater = topType === 'sweater' || (/len|sweater|sweatshirt/.test(topName) && !isPolo);
    const isLongsleeveStripe = (topType === 'tshirt_long' || /thun|tee/.test(topName)) && /soc|thuy thu/.test(topName);
    const isTshirt = topType === 'tshirt_short' || topType === 'tshirt_long' || /thun|t-shirt|tee|oversize/.test(topName);

    // 1. ÁO POLO
    if (isPolo) {
      if (isShorts) {
        return STUDIO_TEMPLATES.find(t => t.id === 20) || STUDIO_TEMPLATES[0]; // Set 20: Áo polo + Quần short
      }
      return STUDIO_TEMPLATES.find(t => t.id === 19) || STUDIO_TEMPLATES[0]; // Set 19: Áo polo + Quần dài
    }

    // 2. ÁO SƠ MI
    if (isShirt) {
      // Sơ mi + Quần Tây -> SET 1 (Chuẩn Smart Casual: Áo sơ mi + Quần tây + Sneaker)
      if (isTrousers) {
        return STUDIO_TEMPLATES.find(t => t.id === 1) || STUDIO_TEMPLATES[0];
      }
      // Sơ mi + Quần Vải Suông -> SET 2 (Chuẩn Korean Minimal: Áo sơ mi + Quần vải suông ống rộng)
      if (isLoosePants) {
        return STUDIO_TEMPLATES.find(t => t.id === 2) || STUDIO_TEMPLATES.find(t => t.id === 5);
      }
      // Sơ mi + Quần Jeans -> SET 6 (Sơ mi denim/casual + Quần suông/jeans)
      if (isJeans) {
        return STUDIO_TEMPLATES.find(t => t.id === 6) || STUDIO_TEMPLATES.find(t => t.id === 1);
      }
      // Sơ mi + Quần Short -> SET 20 (Sơ mi cộc + Quần short)
      if (isShorts) {
        return STUDIO_TEMPLATES.find(t => t.id === 20) || STUDIO_TEMPLATES[0];
      }
      // Mặc định Sơ mi + Quần dài: SET 1
      return STUDIO_TEMPLATES.find(t => t.id === 1) || STUDIO_TEMPLATES[0];
    }

    // 3. ÁO THUN / OVERSIZE (T-SHIRT)
    if (isTshirt) {
      // Thun + Quần Cargo -> SET 10 (Áo thun + Quần cargo túi hộp)
      if (isCargo) {
        return STUDIO_TEMPLATES.find(t => t.id === 10) || STUDIO_TEMPLATES.find(t => t.id === 7);
      }
      // Thun + Quần Short -> SET 20
      if (isShorts) {
        return STUDIO_TEMPLATES.find(t => t.id === 20) || STUDIO_TEMPLATES[0];
      }
      // Thun + Quần Jogger -> SET 14 hoặc SET 8
      if (isJogger) {
        return STUDIO_TEMPLATES.find(t => t.id === 14) || STUDIO_TEMPLATES.find(t => t.id === 8);
      }
      // Thun + Quần Jeans / Quần Suông / Quần dài -> SET 7 (Áo thun oversize + Quần jeans ống rộng)
      return STUDIO_TEMPLATES.find(t => t.id === 7) || STUDIO_TEMPLATES[0];
    }

    // 4. HOODIE / ÁO NỈ CÓ MŨ
    if (isHoodie) {
      // Hoodie + Quần Jogger / Quần dài -> SET 8 (Áo hoodie + Quần jogger)
      return STUDIO_TEMPLATES.find(t => t.id === 8) || STUDIO_TEMPLATES.find(t => t.id === 14);
    }

    // 5. ÁO KHOÁC (BOMBER / GIÓ / JACKET)
    if (isBomber) {
      return STUDIO_TEMPLATES.find(t => t.id === 11) || STUDIO_TEMPLATES.find(t => t.id === 9); // Set 11: Áo khoác bomber + Quần jeans
    }
    if (isWindbreaker || (isJacket && isCargo)) {
      return STUDIO_TEMPLATES.find(t => t.id === 9) || STUDIO_TEMPLATES.find(t => t.id === 11); // Set 9: Áo khoác gió + Quần cargo
    }
    if (isJacket) {
      return STUDIO_TEMPLATES.find(t => t.id === 11) || STUDIO_TEMPLATES.find(t => t.id === 9);
    }

    // 6. ÁO LEN (SWEATER)
    if (isSweater) {
      return STUDIO_TEMPLATES.find(t => t.id === 12) || STUDIO_TEMPLATES[0]; // Set 12: Áo len cổ tròn + Quần tây
    }

    // 7. ÁO THUN DÀI TAY SỌC
    if (isLongsleeveStripe) {
      return STUDIO_TEMPLATES.find(t => t.id === 13) || STUDIO_TEMPLATES[0]; // Set 13: Áo thun dài tay + Quần ống suông
    }

    // 8. KHI CHƯA CHỌN ÁO (CHỈ CHỌN QUẦN)
    if (isShorts) return STUDIO_TEMPLATES.find(t => t.id === 20) || STUDIO_TEMPLATES[0];
    if (isTrousers) return STUDIO_TEMPLATES.find(t => t.id === 1) || STUDIO_TEMPLATES[0];
    if (isLoosePants) return STUDIO_TEMPLATES.find(t => t.id === 2) || STUDIO_TEMPLATES[0];
    if (isCargo) return STUDIO_TEMPLATES.find(t => t.id === 9) || STUDIO_TEMPLATES[0];
    if (isJogger) return STUDIO_TEMPLATES.find(t => t.id === 8) || STUDIO_TEMPLATES[0];
    if (isJeans) return STUDIO_TEMPLATES.find(t => t.id === 7) || STUDIO_TEMPLATES[0];

    // Mặc định tổng thể: SET 1
    return STUDIO_TEMPLATES[0];
  }, [isMale, templates, templateId, topItem, bottomItem, shoesItem, topType, bottomType]);

  // Nguồn ảnh render
  const resolvedImage = useMemo(() => {
    if (!selectedTemplate) {
      return isMale ? '/assets/templates/set_1_model.jpg' : '/assets/templates/set_female_1_model.jpg';
    }
    return viewMode === 'card' ? selectedTemplate.cardImage : selectedTemplate.modelImage;
  }, [isMale, selectedTemplate, viewMode]);

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
      background: '#F8FAFC',
      borderRadius: '20px'
    }}>
      <img
        src={resolvedImage}
        alt={selectedTemplate ? selectedTemplate.name : 'Model Studio'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center center',
          display: 'block'
        }}
      />
    </div>
  );
}
