import React, { useMemo } from 'react';

/**
 * BỘ SƯU TẬP 9 SET TEMPLATE NGƯỜI MẪU STUDIO THỜI TRANG ĐỘ NÉT CAO (HD)
 * Được trích xuất trực tiếp từ catalog ảnh studio người mẫu chuẩn lookbook:
 * - SET 1:  Áo sơ mi trắng + Quần tây (đen) + Giày sneaker (trắng)
 * - SET 2:  Áo sơ mi xanh nhạt + Quần vải suông (beige) + Giày sneaker (trắng/xám)
 * - SET 3:  Áo sơ mi đen + Quần tây (xám) + Giày sneaker (đen/trắng)
 * - SET 4:  Áo sơ mi sọc (xanh dương) + Quần tây (xanh navy) + Giày tây (đen)
 * - SET 5:  Áo sơ mi linen (trắng) + Quần vải suông (be) + Giày sneaker (trắng/be)
 * - SET 6:  Áo sơ mi denim (xanh jean) + Quần vải suông (đen) + Giày sneaker (trắng/xám)
 * - SET 13: Áo thun tay dài (sọc ngang) + Quần ống suông (xanh navy) + Giày sneaker (trắng/xám)
 * - SET 14: Áo hoodie (xám) + Quần jogger (đen) + Giày sneaker (trắng)
 * - SET 15: Áo sơ mi (trắng) + Quần tây (be) + Giày da (đen)
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
    shortName: 'Sơ mi denim xanh + Quần suông đen',
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

    // 2. Tìm theo itemIds cụ thể của các set
    const currentItemIds = [topItem?.id, bottomItem?.id, shoesItem?.id].filter(Boolean);
    if (currentItemIds.length > 0) {
      for (const tpl of STUDIO_TEMPLATES) {
        if (tpl.itemIds && tpl.itemIds.some(id => currentItemIds.includes(id))) {
          return tpl;
        }
      }
    }

    // 3. Phân loại theo tên & thuộc tính món đồ
    const topName = (topItem?.name || '').toLowerCase();
    const botName = (bottomItem?.name || '').toLowerCase();
    const shoesName = (shoesItem?.name || '').toLowerCase();

    // Hoodie & Jogger (Set 14)
    if (topType === 'hoodie' || topName.includes('hoodie') || botName.includes('jogger')) {
      return STUDIO_TEMPLATES.find(t => t.id === 14) || STUDIO_TEMPLATES[7];
    }

    // Áo thun tay dài sọc / Retro Street (Set 13)
    if (topName.includes('sọc ngang') || topName.includes('thủy thủ') || (topName.includes('dài tay') && topName.includes('sọc'))) {
      return STUDIO_TEMPLATES.find(t => t.id === 13) || STUDIO_TEMPLATES[6];
    }

    // Áo sơ mi denim (Set 6)
    if (topName.includes('denim') || topName.includes('jean')) {
      return STUDIO_TEMPLATES.find(t => t.id === 6) || STUDIO_TEMPLATES[5];
    }

    // Áo sơ mi linen (Set 5)
    if (topName.includes('linen')) {
      return STUDIO_TEMPLATES.find(t => t.id === 5) || STUDIO_TEMPLATES[4];
    }

    // Áo sơ mi sọc xanh (Set 4)
    if (topName.includes('sọc') || shoesName.includes('derby') || shoesName.includes('tây')) {
      return STUDIO_TEMPLATES.find(t => t.id === 4) || STUDIO_TEMPLATES[3];
    }

    // Áo sơ mi đen (Set 3)
    if (topName.includes('đen') && (topName.includes('sơ mi') || topType === 'shirt_long')) {
      return STUDIO_TEMPLATES.find(t => t.id === 3) || STUDIO_TEMPLATES[2];
    }

    // Áo sơ mi xanh nhạt (Set 2)
    if (topName.includes('xanh nhạt') || topName.includes('oxford')) {
      return STUDIO_TEMPLATES.find(t => t.id === 2) || STUDIO_TEMPLATES[1];
    }

    // Quần tây be + Giày da (Set 15)
    if (botName.includes('be') && (shoesName.includes('da') || shoesName.includes('loafer'))) {
      return STUDIO_TEMPLATES.find(t => t.id === 15) || STUDIO_TEMPLATES[8];
    }

    // Quần vải suông be (Set 2 hoặc Set 5)
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
