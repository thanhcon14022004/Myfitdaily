/**
 * Utility: Phân Loại Kiểu Áo Quần & Nhận Diện Màu Sắc / Họa Tiết
 * Dùng cho hệ thống Model Ma-nơ-canh Thời Trang 2D (Silhouette Fitting Engine)
 */

export const GARMENT_TEMPLATES = {
  // === KIỂU ÁO (TOPS) ===
  tshirt_short: {
    id: 'tshirt_short',
    category: 'Tops',
    name: 'Áo Thun Tay Ngắn',
    nameEn: 'Crewneck T-shirt',
    description: 'Áo thun cổ tròn tay ngắn phom regular/boxy thoải mái',
    defaultColor: '#E2E8F0',
    gender: 'All'
  },
  polo: {
    id: 'polo',
    category: 'Tops',
    name: 'Áo Polo Cổ Bẻ',
    nameEn: 'Pique Polo Shirt',
    description: 'Áo polo cộc tay dệt pique có cổ bẻ và nẹp cúc',
    defaultColor: '#1E293B',
    gender: 'All'
  },
  shirt_short: {
    id: 'shirt_short',
    category: 'Tops',
    name: 'Áo Sơ Mi Tay Ngắn',
    nameEn: 'Short Sleeve Shirt',
    description: 'Áo sơ mi cộc tay phom suông cổ bẻ vạt ngang',
    defaultColor: '#F8FAFC',
    gender: 'All'
  },
  shirt_long: {
    id: 'shirt_long',
    category: 'Tops',
    name: 'Áo Sơ Mi Dài Tay',
    nameEn: 'Oxford / Dress Shirt',
    description: 'Áo sơ mi dài tay cổ Đức chỉn chu lịch lãm',
    defaultColor: '#FFFFFF',
    gender: 'All'
  },
  tanktop: {
    id: 'tanktop',
    category: 'Tops',
    name: 'Áo Ba Lỗ Sát Nách',
    nameEn: 'Tank Top / Sleeveless',
    description: 'Áo ba lỗ ôm phom hoặc rộng nách thể thao',
    defaultColor: '#0F172A',
    gender: 'All'
  },
  hoodie: {
    id: 'hoodie',
    category: 'Tops',
    name: 'Áo Nỉ Hoodie Có Mũ',
    nameEn: 'Hoodie Sweatshirt',
    description: 'Áo hoodie nỉ ấm áp có mũ trùm và túi kangaroo',
    defaultColor: '#475569',
    gender: 'All'
  },
  sweater: {
    id: 'sweater',
    category: 'Tops',
    name: 'Áo Len Dệt Kim',
    nameEn: 'Crewneck Sweater',
    description: 'Áo len dài tay cổ tròn dệt kim mềm mại',
    defaultColor: '#D4C5B9',
    gender: 'All'
  },
  blazer: {
    id: 'blazer',
    category: 'Tops',
    name: 'Áo Khoác Blazer / Vest',
    nameEn: 'Tailored Blazer',
    description: 'Áo khoác blazer may đo phom đứng vai độn thanh lịch',
    defaultColor: '#334155',
    gender: 'All'
  },
  jacket_bomber: {
    id: 'jacket_bomber',
    category: 'Tops',
    name: 'Áo Khoác Bomber',
    nameEn: 'Bomber / Varsity Jacket',
    description: 'Áo khoác bomber bo chun thể thao phom phồng',
    defaultColor: '#1E293B',
    gender: 'All'
  },
  cardigan: {
    id: 'cardigan',
    category: 'Tops',
    name: 'Áo Cardigan Cài Cúc',
    nameEn: 'Knit Cardigan',
    description: 'Áo khoác len mỏng cổ tim cài cúc nhẹ nhàng',
    defaultColor: '#D4C5B9',
    gender: 'All'
  },
  croptop: {
    id: 'croptop',
    category: 'Tops',
    name: 'Áo Croptop Lửng',
    nameEn: 'Cropped Baby Tee',
    description: 'Áo thun ôm lửng khoe eo thon',
    defaultColor: '#F472B6',
    gender: 'Female'
  },
  camisole: {
    id: 'camisole',
    category: 'Tops',
    name: 'Áo 2 Dây Nữ',
    nameEn: 'Spaghetti Strap Camisole',
    description: 'Áo hai dây mảnh quai phom ôm hoặc suông nhẹ nữ tính',
    defaultColor: '#1E2024',
    gender: 'Female'
  },

  // === KIỂU QUẦN / VÁY (BOTTOMS) ===
  shorts: {
    id: 'shorts',
    category: 'Bottoms',
    name: 'Quần Đùi Trên Gối',
    nameEn: 'Above-Knee Shorts',
    description: 'Quần short năng động dài trên đầu gối 5-7cm',
    defaultColor: '#334155',
    gender: 'All'
  },
  shorts_denim: {
    id: 'shorts_denim',
    category: 'Bottoms',
    name: 'Quần Short Jean',
    nameEn: 'Denim Shorts',
    description: 'Quần đùi denim jeans xắn gấu bụi bặm năng động',
    defaultColor: '#2B4C7E',
    gender: 'All'
  },
  jeans_straight: {
    id: 'jeans_straight',
    category: 'Bottoms',
    name: 'Quần Jeans Ống Suông',
    nameEn: 'Straight-Leg Jeans',
    description: 'Quần jeans denim dài ống đứng/suông hack chiều cao',
    defaultColor: '#2563EB',
    gender: 'All'
  },
  trousers: {
    id: 'trousers',
    category: 'Bottoms',
    name: 'Quần Tây Xếp Ly',
    nameEn: 'Pleated Trousers',
    description: 'Quần âu xếp ly cạp cao đứng phom chỉn chu',
    defaultColor: '#0F172A',
    gender: 'All'
  },
  pants_wide: {
    id: 'pants_wide',
    category: 'Bottoms',
    name: 'Quần Suông Ống Rộng',
    nameEn: 'Wide-Leg Relaxed Pants',
    description: 'Quần vải rủ ống rộng dáng suông che khuyết điểm thời thượng',
    defaultColor: '#334155',
    gender: 'All'
  },
  cargo: {
    id: 'cargo',
    category: 'Bottoms',
    name: 'Quần Túi Hộp / Dù Rộng',
    nameEn: 'Cargo / Parachute Pants',
    description: 'Quần túi hộp ống rộng phong cách streetwear bụi bặm',
    defaultColor: '#4D7C0F',
    gender: 'All'
  },
  jogger: {
    id: 'jogger',
    category: 'Bottoms',
    name: 'Quần Thun Jogger Bo Gấu',
    nameEn: 'Athletic Joggers',
    description: 'Quần nỉ thể thao bo gấu thoải mái vận động',
    defaultColor: '#64748B',
    gender: 'All'
  },
  skirt_mini: {
    id: 'skirt_mini',
    category: 'Bottoms',
    name: 'Chân Váy Ngắn Chữ A',
    nameEn: 'A-Line Mini Skirt',
    description: 'Chân váy ngắn xòe chữ A tôn chân dài',
    defaultColor: '#1E293B',
    gender: 'Female'
  },
  skirt_midi: {
    id: 'skirt_midi',
    category: 'Bottoms',
    name: 'Chân Váy Midi Lụa / Xếp Ly',
    nameEn: 'Pleated Midi Skirt',
    description: 'Chân váy dài qua gối thướt tha nữ tính',
    defaultColor: '#E2E8F0',
    gender: 'Female'
  },
  dress: {
    id: 'dress',
    category: 'Bottoms',
    name: 'Đầm / Váy Liền Thân',
    nameEn: 'Slip / Midi Dress',
    description: 'Đầm suông liền thân thanh lịch',
    defaultColor: '#E11D48',
    gender: 'Female'
  },

  // === KIỂU GIÀY (SHOES) ===
  sneaker: {
    id: 'sneaker',
    category: 'Shoes',
    name: 'Giày Sneaker Thể Thao',
    nameEn: 'Classic Sneaker',
    description: 'Giày sneaker thể thao đế bệt cổ thấp',
    defaultColor: '#FFFFFF',
    gender: 'All'
  },
  loafer: {
    id: 'loafer',
    category: 'Shoes',
    name: 'Giày Loafer Da Bóng',
    nameEn: 'Penny Loafer',
    description: 'Giày da lười sang trọng có khóa kim loại',
    defaultColor: '#1A1817',
    gender: 'All'
  },
  boots: {
    id: 'boots',
    category: 'Shoes',
    name: 'Giày Bốt Cổ Cao / Chelsea',
    nameEn: 'Chelsea / Ankle Boots',
    description: 'Giày bốt da cao cổ qua mắt cá chân',
    defaultColor: '#2E1C14',
    gender: 'All'
  },
  heels: {
    id: 'heels',
    category: 'Shoes',
    name: 'Giày Cao Gót Mũi Nhọn',
    nameEn: 'Pointed High Heels',
    description: 'Giày cao gót quý phái mũi nhọn nữ',
    defaultColor: '#9F1239',
    gender: 'Female'
  },
  sandals: {
    id: 'sandals',
    category: 'Shoes',
    name: 'Dép Quai Hậu / Sandal',
    nameEn: 'Leather Sandals',
    description: 'Sandal quai da mùa hè thoáng mát',
    defaultColor: '#451A03',
    gender: 'All'
  }
};

/**
 * Bảng ánh xạ màu sắc chuẩn thời trang (Vietnamese & English)
 */
export const COLOR_PALETTE = {
  trang: { hex: '#F8FAFC', accent: '#E2E8F0', name: 'Trắng', textDark: true },
  white: { hex: '#F8FAFC', accent: '#E2E8F0', name: 'Trắng', textDark: true },
  kem: { hex: '#FEF3C7', accent: '#FDE68A', name: 'Kem / Ivory', textDark: true },
  cream: { hex: '#FDFBF7', accent: '#F5EBE1', name: 'Cream / Kem', textDark: true },
  taupe: { hex: '#8B7D77', accent: '#6E625D', name: 'Nâu Taupe', textDark: false },
  nga: { hex: '#FDFBF7', accent: '#F3EFE6', name: 'Trắng ngà', textDark: true },
  ivory: { hex: '#FFFFF0', accent: '#F5F5DC', name: 'Trắng ngà', textDark: true },

  den: { hex: '#1E2024', accent: '#121417', name: 'Đen Tuyển', textDark: false },
  black: { hex: '#1E2024', accent: '#121417', name: 'Đen', textDark: false },
  'da bong': { hex: '#1E2024', accent: '#121417', name: 'Đen Da Bóng', textDark: false },
  'da bo': { hex: '#262930', accent: '#191B20', name: 'Đen Da Bò', textDark: false },
  than: { hex: '#262930', accent: '#191B20', name: 'Than chì', textDark: false },

  navy: { hex: '#1E293B', accent: '#0F172A', name: 'Xanh Navy', textDark: false },
  'xanh navy': { hex: '#1E293B', accent: '#0F172A', name: 'Xanh Navy', textDark: false },
  'xanh than': { hex: '#1B2434', accent: '#0E141E', name: 'Xanh than chì', textDark: false },
  
  'xanh lam': { hex: '#2563EB', accent: '#1D4ED8', name: 'Xanh Lam', textDark: false },
  'xanh duong': { hex: '#2563EB', accent: '#1D4ED8', name: 'Xanh Dương', textDark: false },
  blue: { hex: '#3B82F6', accent: '#1D4ED8', name: 'Xanh Lam', textDark: false },
  denim: { hex: '#2B4C7E', accent: '#1E355B', name: 'Xanh Denim', textDark: false },
  
  'xanh nhat': { hex: '#93C5FD', accent: '#60A5FA', name: 'Xanh Pastel', textDark: true },
  'pastel blue': { hex: '#93C5FD', accent: '#60A5FA', name: 'Xanh Nhạt', textDark: true },

  be: { hex: '#D8C3A5', accent: '#C4AB89', name: 'Be Cát', textDark: true },
  beige: { hex: '#E6D7C3', accent: '#D1BC9E', name: 'Be Nhạt', textDark: true },
  khaki: { hex: '#B8A68B', accent: '#9E8B6F', name: 'Kaki', textDark: true },
  cat: { hex: '#D4C5B9', accent: '#BFA087', name: 'Be Cát Sa Mạc', textDark: true },

  nau: { hex: '#633A18', accent: '#45260C', name: 'Nâu Tây', textDark: false },
  brown: { hex: '#633A18', accent: '#45260C', name: 'Nâu', textDark: false },
  cacao: { hex: '#4A2C11', accent: '#301B08', name: 'Nâu Cacao', textDark: false },

  xam: { hex: '#64748B', accent: '#475569', name: 'Xám Khói', textDark: false },
  ghi: { hex: '#71717A', accent: '#52525B', name: 'Xám Ghi', textDark: false },
  gray: { hex: '#6B7280', accent: '#4B5563', name: 'Xám', textDark: false },

  reu: { hex: '#3F4E22', accent: '#2B3715', name: 'Xanh Rêu', textDark: false },
  'xanh reu': { hex: '#3F4E22', accent: '#2B3715', name: 'Xanh Rêu', textDark: false },
  olive: { hex: '#4A5B28', accent: '#33401A', name: 'Xanh Olive', textDark: false },

  'xanh la': { hex: '#16A34A', accent: '#15803D', name: 'Xanh Lá', textDark: false },
  mint: { hex: '#6EE7B7', accent: '#34D399', name: 'Xanh Bạc Hà (Mint)', textDark: true },

  do: { hex: '#DC2626', accent: '#B91C1C', name: 'Đỏ', textDark: false },
  red: { hex: '#DC2626', accent: '#B91C1C', name: 'Đỏ', textDark: false },
  'do do': { hex: '#881337', accent: '#4C0519', name: 'Đỏ Burgundy / Đô', textDark: false },
  burgundy: { hex: '#881337', accent: '#4C0519', name: 'Đỏ Đô', textDark: false },

  hong: { hex: '#F472B6', accent: '#DB2777', name: 'Hồng Phấn', textDark: true },
  pink: { hex: '#F472B6', accent: '#DB2777', name: 'Hồng', textDark: true },

  vang: { hex: '#EAB308', accent: '#CA8A04', name: 'Vàng Mustard', textDark: true },
  yellow: { hex: '#FBBF24', accent: '#D97706', name: 'Vàng', textDark: true },

  cam: { hex: '#EA580C', accent: '#C2410C', name: 'Cam', textDark: false },
  orange: { hex: '#EA580C', accent: '#C2410C', name: 'Cam', textDark: false },

  tim: { hex: '#7C3AED', accent: '#5B21B6', name: 'Tím', textDark: false },
  purple: { hex: '#7C3AED', accent: '#5B21B6', name: 'Tím', textDark: false }
};

/**
 * Loại bỏ dấu tiếng Việt để tìm kiếm từ khóa chuẩn xác
 */
function normalizeText(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();
}

/**
 * Tự động nhận diện kiểu áo/quần/giày từ thông tin item
 * @param {object} item - Món đồ { name, categoryName, description, style, ... }
 * @param {string} fallbackCategory - 'Tops' | 'Bottoms' | 'Shoes'
 * @returns {string} - templateId ('tshirt_short', 'shorts', etc.)
 */
export function detectGarmentType(item, fallbackCategory = 'Tops') {
  if (!item) {
    if (fallbackCategory === 'Bottoms') return 'shorts';
    if (fallbackCategory === 'Shoes') return 'sneaker';
    return 'tshirt_short';
  }

  const cat = (item.categoryName || fallbackCategory || '').toLowerCase();
  const text = normalizeText(`${item.name || ''} ${item.description || ''} ${item.style || ''}`);

  // Honor an explicit template selected by an admin/import pipeline before
  // falling back to name-based detection.
  const explicitType = item.templateId || item.garmentType || item.silhouette;
  if (explicitType && GARMENT_TEMPLATES[explicitType]) return explicitType;

  if (cat.includes('outer')) {
    if (text.includes('bomber') || text.includes('windbreaker') || text.includes('ao gio')) return 'jacket_bomber';
    if (text.includes('cardigan')) return 'cardigan';
    return 'blazer';
  }

  // =========================================================================
  // 1. NHẬN DIỆN BOTTOMS (QUẦN / VÁY / ĐẦM)
  // =========================================================================
  if (cat.includes('bottom') || cat.includes('quan') || cat.includes('vay') || cat.includes('dress')) {
    // 1.1 Quần Đùi / Short (Ưu tiên số 1 theo yêu cầu của user)
    const isShort = (
      text.includes('dui') ||
      text.includes('short') ||
      text.includes('lung') ||
      text.includes('ngan') ||
      text.includes('tren goi') ||
      text.includes('bermuda') ||
      text.includes('boxer')
    );
    const isDenim = /\b(jean|jeans|denim)\b/i.test(text) || /\bquan bo\b/i.test(text) || /\bvai bo\b/i.test(text);

    if (isShort) {
      if (isDenim) {
        return 'shorts_denim';
      }
      return 'shorts';
    }

    // 1.2 Chân váy / Đầm
    if (text.includes('dam') || text.includes('dress') || text.includes('lien than')) {
      return 'dress';
    }
    if (text.includes('vay dai') || text.includes('midi') || text.includes('xep ly dai')) {
      return 'skirt_midi';
    }
    if (text.includes('vay') || text.includes('skirt') || text.includes('chu a')) {
      return 'skirt_mini';
    }

    // 1.3 Quần Túi Hộp / Parachute / Cargo
    if (text.includes('tui hop') || text.includes('cargo') || text.includes('parachute') || text.includes('du rong')) {
      return 'cargo';
    }

    // 1.4 Quần Jogger / Nỉ thun bo gấu
    if (text.includes('jogger') || text.includes('bo gau') || text.includes('thun dai')) {
      return 'jogger';
    }

    // 1.5 Quần Jeans / Denim Dài
    if (isDenim) {
      return 'jeans_straight';
    }

    // 1.6 Quần Suông Ống Rộng / Dây Rút Relaxed (Wide Leg)
    if (text.includes('ong rong') || text.includes('wide leg') || text.includes('suong rong') || text.includes('day rut') || text.includes('suong')) {
      return 'pants_wide';
    }

    // 1.7 Quần Tây / Quần Âu / Chinos / Quần Xếp Ly
    if (text.includes('tay') || text.includes('au') || text.includes('xep ly') || text.includes('trouser') || text.includes('chino') || text.includes('kaki') || text.includes('dai')) {
      return 'trousers';
    }

    return 'shorts'; // Mặc định Bottoms: Quần đùi trẻ trung
  }

  // =========================================================================
  // 2. NHẬN DIỆN SHOES (GIÀY DÉP)
  // =========================================================================
  if (cat.includes('shoe') || cat.includes('giay') || cat.includes('dep')) {
    if (text.includes('cao got') || text.includes('got nhon') || text.includes('heel')) return 'heels';
    if (text.includes('boot') || text.includes('bot') || text.includes('chelsea')) return 'boots';
    if (text.includes('loafer') || text.includes('luoi') || text.includes('derby') || text.includes('oxford')) return 'loafer';
    if (text.includes('sandal') || text.includes('dep quai') || text.includes('quai hau')) return 'sandals';
    return 'sneaker';
  }

  // =========================================================================
  // 3. NHẬN DIỆN TOPS (ÁO)
  // =========================================================================
  // 3.0 Áo 2 Dây / Cami / Hai Dây
  if (text.includes('2 day') || text.includes('hai day') || text.includes('camisole') || text.includes('cami') || text.includes('spaghetti')) {
    return 'camisole';
  }

  // 3.1 Croptop / Baby Tee
  if (text.includes('croptop') || text.includes('crop top') || text.includes('baby tee') || text.includes('ao lung')) {
    return 'croptop';
  }

  // 3.2 Áo Khoác Bomber / Áo Gió Thể Thao
  if (text.includes('bomber') || text.includes('varsity') || text.includes('khoac gio') || text.includes('ao gio')) {
    return 'jacket_bomber';
  }

  // 3.3 Áo Cardigan Len
  if (text.includes('cardigan')) {
    return 'cardigan';
  }

  // 3.4 Blazer / Vest
  if (text.includes('blazer') || text.includes('vest') || text.includes('suit') || text.includes('khoac da') || text.includes('jacket')) {
    return 'blazer';
  }

  // 3.3 Hoodie
  if (text.includes('hoodie') || text.includes('co mu') || text.includes('mu trum')) {
    return 'hoodie';
  }

  // 3.4 Áo Ba Lỗ / Sát Nách
  if (text.includes('ba lo') || text.includes('sat nach') || text.includes('tank top') || text.includes('tanktop') || text.includes('sleeveless')) {
    return 'tanktop';
  }

  // 3.5 Áo Polo
  if (text.includes('polo') || text.includes('co be') || text.includes('pique')) {
    return 'polo';
  }

  // 3.6 Áo Len / Sweatshirt
  if (text.includes('len') || text.includes('sweater') || text.includes('knit') || text.includes('det kim') || text.includes('sweatshirt')) {
    return 'sweater';
  }

  // 3.7 Áo Sơ Mi (Ngắn vs Dài tay)
  if (text.includes('so mi') || text.includes('shirt') || text.includes('oxford') || text.includes('poplin')) {
    if (text.includes('ngan tay') || text.includes('tay ngan') || text.includes('coc tay') || text.includes('camp') || text.includes('hawaii')) {
      return 'shirt_short';
    }
    return 'shirt_long';
  }

  // 3.8 Áo Thun Tay Ngắn (Mặc định phổ thông nhất)
  return 'tshirt_short';
}

/**
 * Tự động nhận diện màu sắc chủ đạo từ thông tin hoặc ảnh item
 * @param {object} item - Món đồ
 * @returns {{ hex: string, accent: string, name: string, textDark: boolean }}
 */
export function detectGarmentColor(item) {
  if (!item) return { hex: '#E2E8F0', accent: '#CBD5E1', name: 'Trắng Xám', textDark: true };

  // Nếu món đồ có trường color dạng hex (#fff, #1a2b3c)
  const rawHex = item.colorHex || item.color || item.hexColor;
  if (typeof rawHex === 'string' && /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(rawHex)) {
    const hex = rawHex.length === 4
      ? `#${rawHex[1]}${rawHex[1]}${rawHex[2]}${rawHex[2]}${rawHex[3]}${rawHex[3]}`
      : rawHex;
    const isDark = isColorDark(hex);
    return {
      hex,
      accent: shadeColor(hex, -20),
      name: item.name || 'Màu tùy chọn',
      textDark: !isDark
    };
  }

  // Quét từ khóa màu sắc trong tên và mô tả
  const searchStr = `${item.color || ''} ${item.name || ''} ${item.description || ''}`;
  let norm = normalizeText(searchStr)
    .replace(/\bkhoa\s+(vang|bac|dong|kim loai)\b/g, '')
    .replace(/\bkhuy\s+(vang|bac|dong|den|trang)\b/g, '')
    .replace(/\bvien\s+(trang|den|vang)\b/g, '');

  for (const [key, val] of Object.entries(COLOR_PALETTE)) {
    const normKey = normalizeText(key);
    // Khớp từ nguyên vẹn để tránh nhầm (vd: "đen" không nhầm với "đến")
    const regex = new RegExp(`\\b${normKey}\\b`, 'i');
    if (regex.test(norm)) {
      return val;
    }
  }

  // Nếu không thấy từ khóa, gán màu theo loại item phổ biến
  const cat = (item.categoryName || '').toLowerCase();
  if (cat.includes('bottom')) {
    return { hex: '#1E293B', accent: '#0F172A', name: 'Đen / Tối', textDark: false }; // Quần tối màu tôn dáng
  }
  if (cat.includes('shoe')) {
    return { hex: '#FFFFFF', accent: '#E2E8F0', name: 'Trắng', textDark: true }; // Giày sneaker trắng
  }

  // Mặc định áo: Trắng sáng
  return { hex: '#F8FAFC', accent: '#E2E8F0', name: 'Trắng Sáng', textDark: true };
}

/**
 * Tự động nhận diện họa tiết (Solid / Stripes / Plaid / Graphic)
 * @param {object} item 
 * @returns {'solid' | 'stripes' | 'plaid' | 'dots' | 'denim'}
 */
export function detectGarmentPattern(item) {
  if (!item) return 'solid';
  const text = normalizeText(`${item.name || ''} ${item.description || ''} ${item.style || ''}`);

  if (text.includes('soc') || text.includes('ke soc') || text.includes('striped') || text.includes('pinstripe')) {
    return 'stripes';
  }
  if (text.includes('caro') || text.includes('ke caro') || text.includes('plaid') || text.includes('gingham') || text.includes('tartan')) {
    return 'plaid';
  }
  if (text.includes('cham bi') || text.includes('polka dot') || /\bbi\b/.test(text)) {
    return 'dots';
  }
  if (text.includes('jean') || text.includes('denim') || text.includes('wash')) {
    return 'denim';
  }
  return 'solid';
}

/**
 * Lấy mẫu màu chủ đạo trực tiếp từ pixel ảnh của trang phục bằng Canvas
 */
export async function sampleDominantColorFromImage(imageUrl) {
  if (!imageUrl) return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 64, 64);
        const data = ctx.getImageData(16, 16, 32, 32).data; // Lấy mẫu vùng trung tâm áo/quần
        
        let rTot = 0, gTot = 0, bTot = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          // Bỏ qua pixel trong suốt hoặc nền trắng/đen tuyệt đối
          if (a > 100 && !(r > 245 && g > 245 && b > 245) && !(r < 15 && g < 15 && b < 15)) {
            rTot += r;
            gTot += g;
            bTot += b;
            count++;
          }
        }
        if (count > 10) {
          const rAvg = Math.round(rTot / count);
          const gAvg = Math.round(gTot / count);
          const bAvg = Math.round(bTot / count);
          const hex = `#${((1 << 24) + (rAvg << 16) + (gAvg << 8) + bAvg).toString(16).slice(1)}`;
          resolve(hex);
        } else {
          resolve(null);
        }
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
}

function isColorDark(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114) < 140;
}

function shadeColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}
