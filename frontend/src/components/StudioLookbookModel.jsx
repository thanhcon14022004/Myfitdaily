import React, { useMemo } from 'react';

/**
 * 12 SET TEMPLATE MODEL STUDIO THỜI TRANG ĐỘ NÉT CAO (HD)
 * (Cắt từ các ảnh chất lượng cao người dùng cung cấp có sẵn các viền kẻ nhận diện vùng thay đổi màu sắc)
 *
 * Vùng nhận diện để thay đổi màu sắc:
 * - [Xanh dương] Áo / Áo khoác (Top)
 * - [Xanh lá] Quần / Short (Bottom)
 * - [Cam] Giày (Shoes)
 */
export const STUDIO_TEMPLATES = [
  {
    id: 1,
    key: 'tshirt_shorts',
    setNumber: 'SET 1',
    name: 'Áo thun + Quần short + Giày sneaker',
    shortName: 'Áo thun + Short',
    category: 'Casual Active',
    topType: 'tshirt_short',
    bottomType: 'shorts',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_1_model.jpg',
    cardImage: '/assets/templates/set_1_card.jpg',
    topName: 'Áo thun cổ tròn (xám đậm)',
    bottomName: 'Quần short (đen)',
    shoesName: 'Sneaker (trắng)',
    baseTopColor: '#475569',
    baseBottomColor: '#1E2024',
    baseShoesColor: '#FFFFFF'
  },
  {
    id: 2,
    key: 'shirt_trousers',
    setNumber: 'SET 2',
    name: 'Áo sơ mi + Quần dài + Giày sneaker',
    shortName: 'Sơ mi + Quần dài',
    category: 'Smart Casual',
    topType: 'shirt_long',
    bottomType: 'trousers',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_2_model.jpg',
    cardImage: '/assets/templates/set_2_card.jpg',
    topName: 'Sơ mi dài tay (trắng)',
    bottomName: 'Quần dài (đen)',
    shoesName: 'Sneaker (trắng)',
    baseTopColor: '#FFFFFF',
    baseBottomColor: '#1E2024',
    baseShoesColor: '#FFFFFF'
  },
  {
    id: 3,
    key: 'hoodie_jogger',
    setNumber: 'SET 3',
    name: 'Áo hoodie + Quần jogger + Giày sneaker',
    shortName: 'Hoodie đen + Jogger',
    category: 'Streetwear Warm',
    topType: 'hoodie',
    bottomType: 'jogger',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_3_model.jpg',
    cardImage: '/assets/templates/set_3_card.jpg',
    topName: 'Hoodie (đen)',
    bottomName: 'Quần jogger (xám)',
    shoesName: 'Sneaker (trắng)',
    baseTopColor: '#1E2024',
    baseBottomColor: '#94A3B8',
    baseShoesColor: '#FFFFFF'
  },
  {
    id: 4,
    key: 'polo_shorts',
    setNumber: 'SET 4',
    name: 'Áo polo + Quần short + Giày sneaker',
    shortName: 'Polo + Short',
    category: 'Smart Summer',
    topType: 'polo',
    bottomType: 'shorts',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_4_model.jpg',
    cardImage: '/assets/templates/set_4_card.jpg',
    topName: 'Polo (xanh navy)',
    bottomName: 'Short (beige)',
    shoesName: 'Sneaker (trắng)',
    baseTopColor: '#1E293B',
    baseBottomColor: '#D8C3A5',
    baseShoesColor: '#FFFFFF'
  },
  {
    id: 5,
    key: 'jacket_trousers',
    setNumber: 'SET 5',
    name: 'Áo khoác + Quần dài + Giày sneaker',
    shortName: 'Áo khoác gió + Quần dài',
    category: 'Sport Clean',
    topType: 'blazer',
    bottomType: 'trousers',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_5_model.jpg',
    cardImage: '/assets/templates/set_5_card.jpg',
    topName: 'Áo khoác gió (trắng kem)',
    bottomName: 'Quần dài (đen)',
    shoesName: 'Sneaker (trắng)',
    baseTopColor: '#FEF3C7',
    baseBottomColor: '#1E2024',
    baseShoesColor: '#FFFFFF'
  },
  {
    id: 6,
    key: 'longsleeve_cargo',
    setNumber: 'SET 6',
    name: 'Áo thun tay dài + Quần cargo + Giày sneaker',
    shortName: 'Tay dài + Cargo',
    category: 'Tactical Casual',
    topType: 'shirt_long',
    bottomType: 'cargo',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_6_model.jpg',
    cardImage: '/assets/templates/set_6_card.jpg',
    topName: 'Tay dài (xám đậm)',
    bottomName: 'Cargo (xanh rêu)',
    shoesName: 'Sneaker (trắng/xám)',
    baseTopColor: '#475569',
    baseBottomColor: '#3F4E22',
    baseShoesColor: '#E2E8F0'
  },
  {
    id: 7,
    key: 'denim_wide',
    setNumber: 'SET 7',
    name: 'Áo denim + Quần ống rộng + Giày sneaker',
    shortName: 'Denim + Ống rộng',
    category: 'Vintage Street',
    topType: 'jacket_bomber',
    bottomType: 'pants_wide',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_7_model.jpg',
    cardImage: '/assets/templates/set_7_card.jpg',
    topName: 'Áo khoác denim (xanh nhạt)',
    bottomName: 'Quần ống rộng (đen)',
    shoesName: 'Sneaker (trắng)',
    baseTopColor: '#60A5FA',
    baseBottomColor: '#1E2024',
    baseShoesColor: '#FFFFFF'
  },
  {
    id: 8,
    key: 'hoodie_jogger_grey',
    setNumber: 'SET 8',
    name: 'Áo hoodie + Quần jogger + Giày sneaker',
    shortName: 'Hoodie xám + Jogger',
    category: 'Minimal Street',
    topType: 'hoodie',
    bottomType: 'jogger',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_8_model.jpg',
    cardImage: '/assets/templates/set_8_card.jpg',
    topName: 'Hoodie (xám)',
    bottomName: 'Quần jogger (đen)',
    shoesName: 'Sneaker (trắng/xám)',
    baseTopColor: '#94A3B8',
    baseBottomColor: '#1E2024',
    baseShoesColor: '#E2E8F0'
  },
  {
    id: 9,
    key: 'sweater_khaki',
    setNumber: 'SET 9',
    name: 'Áo len cổ tròn + Quần kaki + Giày sneaker',
    shortName: 'Len navy + Kaki',
    category: 'Autumn Classic',
    topType: 'sweater',
    bottomType: 'trousers',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_9_model.jpg',
    cardImage: '/assets/templates/set_9_card.jpg',
    topName: 'Áo len cổ tròn (xanh navy)',
    bottomName: 'Quần kaki (be)',
    shoesName: 'Sneaker (trắng)',
    baseTopColor: '#1E293B',
    baseBottomColor: '#D8C3A5',
    baseShoesColor: '#FFFFFF'
  },
  {
    id: 10,
    key: 'graphic_cargo',
    setNumber: 'SET 10',
    name: 'Áo thun họa tiết + Quần cargo + Giày sneaker',
    shortName: 'Áo họa tiết + Cargo',
    category: 'Street Graphic',
    topType: 'tshirt_short',
    bottomType: 'cargo',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_10_model.jpg',
    cardImage: '/assets/templates/set_10_card.jpg',
    topName: 'Áo thun họa tiết (xám đậm)',
    bottomName: 'Quần cargo (xanh rêu)',
    shoesName: 'Sneaker (trắng/xám)',
    baseTopColor: '#334155',
    baseBottomColor: '#3F4E22',
    baseShoesColor: '#E2E8F0'
  },
  {
    id: 11,
    key: 'bomber_jeans',
    setNumber: 'SET 11',
    name: 'Áo khoác bomber + Quần jean + Giày sneaker',
    shortName: 'Bomber + Jean xanh',
    category: 'Modern Bomber',
    topType: 'jacket_bomber',
    bottomType: 'jeans_straight',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_11_model.jpg',
    cardImage: '/assets/templates/set_11_card.jpg',
    topName: 'Áo khoác bomber (đen)',
    bottomName: 'Quần jean (xanh nhạt)',
    shoesName: 'Sneaker (trắng)',
    baseTopColor: '#1E2024',
    baseBottomColor: '#93C5FD',
    baseShoesColor: '#FFFFFF'
  },
  {
    id: 12,
    key: 'sweater_trousers',
    setNumber: 'SET 12',
    name: 'Áo len cổ tròn + Quần tây + Giày sneaker',
    shortName: 'Len be + Quần tây',
    category: 'Quiet Luxury',
    topType: 'sweater',
    bottomType: 'trousers',
    shoesType: 'sneaker',
    modelImage: '/assets/templates/set_12_model.jpg',
    cardImage: '/assets/templates/set_12_card.jpg',
    topName: 'Áo len cổ tròn (be)',
    bottomName: 'Quần tây (xám đậm)',
    shoesName: 'Sneaker (trắng)',
    baseTopColor: '#E6D7C3',
    baseBottomColor: '#334155',
    baseShoesColor: '#FFFFFF'
  }
];

export default function StudioLookbookModel({
  gender = 'Nam',
  templateId = null,
  showRecognitionBorders = false,

  topItem = null,
  bottomItem = null,
  shoesItem = null,

  topType = 'tshirt_short',
  topColor = '#F8FAFC',
  topAccent = '#CBD5E1',
  topPattern = 'solid',

  bottomType = 'shorts',
  bottomColor = '#1E293B',
  bottomAccent = '#0F172A',
  bottomPattern = 'solid',

  shoesType = 'sneaker',
  shoesColor = '#F8FAFC',
  shoesAccent = '#CBD5E1',

  compact = false
}) {
  const isMale = (gender || '').toLowerCase().includes('nam') || (gender || '').toLowerCase().includes('male');

  // 1. TỰ ĐỘNG CHỌN SET TEMPLATE PHÙ HỢP NHẤT DỰA VÀO ĐỒ TRONG TỦ
  const selectedTemplate = useMemo(() => {
    if (!isMale) return null;
    if (templateId) {
      const match = STUDIO_TEMPLATES.find(t => t.id === Number(templateId));
      if (match) return match;
    }

    const isShort = bottomType === 'shorts' || bottomType === 'shorts_denim' || bottomItem?.id === 220 || bottomItem?.id === 221;
    const isCargo = bottomType === 'cargo';
    const isJogger = bottomType === 'jogger';
    const isJeans = bottomType === 'jeans_straight' || bottomType === 'jeans' || bottomItem?.id === 222;
    const isWide = bottomType === 'pants_wide' || bottomItem?.id === 203;

    // A. Sơ mi
    if (topType === 'shirt_long' || topType === 'shirt_short' || topItem?.id === 205 || topItem?.id === 212) {
      if (isShort) return STUDIO_TEMPLATES[5]; // SET 6: Dài tay / sơ mi + Quần short
      return STUDIO_TEMPLATES[1]; // SET 2: Áo sơ mi trắng + Quần tây
    }

    // B. Áo len / Sweater / Sweatshirt
    if (topType === 'sweater' || topItem?.id === 202) {
      return STUDIO_TEMPLATES[8]; // SET 9: Áo len cổ tròn / sweatshirt
    }

    // C. Hoodie
    if (topType === 'hoodie') {
      return isJogger ? STUDIO_TEMPLATES[2] : STUDIO_TEMPLATES[7]; // SET 3 (đen) hoặc SET 8 (xám)
    }

    // D. Polo
    if (topType === 'polo' || topItem?.id === 211) {
      return STUDIO_TEMPLATES[3]; // SET 4: Polo + Short
    }

    // E. Áo khoác / Bomber / Blazer
    if (topType === 'jacket_bomber' || topType === 'blazer') {
      if (isJeans) return STUDIO_TEMPLATES[10]; // SET 11: Bomber + Jeans
      if (isWide) return STUDIO_TEMPLATES[6];   // SET 7: Denim + Quần ống rộng
      return STUDIO_TEMPLATES[4];              // SET 5: Áo khoác + Quần dài
    }

    // F. Quần Cargo / Túi hộp
    if (isCargo) {
      return STUDIO_TEMPLATES[9]; // SET 10: Áo thun họa tiết + Quần cargo
    }

    // G. Quần Jeans
    if (isJeans) {
      return STUDIO_TEMPLATES[10]; // SET 11: Quần jean
    }

    // H. Quần Ống Rộng / Quần Suông Dây Rút
    if (isWide) {
      return STUDIO_TEMPLATES[6]; // SET 7: Quần ống rộng
    }

    // I. Quần Jogger
    if (isJogger) {
      return STUDIO_TEMPLATES[2]; // SET 3: Quần jogger
    }

    // J. Quần Đùi / Short
    if (isShort) {
      return STUDIO_TEMPLATES[0]; // SET 1: Áo thun + Quần đùi
    }

    // K. Mặc định: SET 1
    return STUDIO_TEMPLATES[0];
  }, [isMale, templateId, topType, bottomType, topItem, bottomItem]);

  // Nguồn ảnh nền sắc nét
  const resolvedBaseImage = useMemo(() => {
    if (isMale) {
      if (!selectedTemplate) return '/assets/templates/set_1_model.jpg';
      return selectedTemplate.modelImage;
    } else {
      // Phom nữ
      if (bottomType === 'dress' || topType === 'dress') return '/assets/fits/model_female_dress.jpg';
      if (topType === 'camisole' || bottomType === 'skirt_mini') return '/assets/fits/model_female_cami_skirt.jpg';
      if (topType === 'croptop') return '/assets/fits/model_female_croptop_jeans.jpg';
      if (topType === 'tanktop') return '/assets/fits/model_female_tank_dark.jpg';
      if (topType === 'sweater') return '/assets/fits/model_female_sweat_dark.jpg';
      return '/assets/fits/model_female_croptop_jeans.jpg';
    }
  }, [isMale, selectedTemplate, topType, bottomType]);

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
      {/* ẢNH NÉT GỐC LOOKBOOK CHUẨN HD ĐÃ ĐƯỢC THIẾT KẾ VIỀN NHẬN DIỆN */}
      <img
        src={resolvedBaseImage}
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
