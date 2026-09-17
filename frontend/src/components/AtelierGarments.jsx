import React from 'react';

/**
 * Trích xuất tông màu và gradient tương ứng từ tên hoặc thuộc tính màu của món đồ
 */
export function parseGarmentPalette(item, defaultHex = '#1E293B') {
  const text = `${item?.color || ''} ${item?.name || ''}`.toLowerCase();

  // 1. Trắng / Kem / Sữa / Ivory
  if (text.includes('trắng') || text.includes('white') || text.includes('kem') || text.includes('ivory') || text.includes('sữa')) {
    return {
      type: 'white',
      primary: '#FFFFFF',
      secondary: '#F1F5F9',
      shadow: '#CBD5E1',
      stroke: '#94A3B8',
      stitch: '#CBD5E1',
      isLight: true
    };
  }

  // 2. Đen / Charcoal / Than / Tối
  if (text.includes('đen') || text.includes('black') || text.includes('than') || text.includes('charcoal')) {
    return {
      type: 'black',
      primary: '#1E2430',
      secondary: '#131923',
      shadow: '#090D14',
      stroke: '#334155',
      stitch: '#475569',
      isLight: false
    };
  }

  // 3. Xám / Ghi / Khói / Melange
  if (text.includes('xám') || text.includes('ghi') || text.includes('khói') || text.includes('grey') || text.includes('gray')) {
    return {
      type: 'grey',
      primary: '#64748B',
      secondary: '#475569',
      shadow: '#334155',
      stroke: '#1E293B',
      stitch: '#94A3B8',
      isLight: false
    };
  }

  // 4. Denim / Xanh bò / Indigo / Blue
  if (text.includes('jean') || text.includes('denim') || text.includes('bò') || text.includes('indigo') || text.includes('xanh dương')) {
    return {
      type: 'denim',
      primary: '#2563EB',
      secondary: '#1D4ED8',
      shadow: '#172554',
      stroke: '#1E3A8A',
      stitch: '#F59E0B',
      isLight: false
    };
  }

  // 5. Navy / Xanh đen / Xanh than
  if (text.includes('navy') || text.includes('xanh than') || text.includes('xanh đậm')) {
    return {
      type: 'navy',
      primary: '#1E293B',
      secondary: '#0F172A',
      shadow: '#020617',
      stroke: '#334155',
      stitch: '#64748B',
      isLight: false
    };
  }

  // 6. Be / Cát / Kaki / Chino / Nude
  if (text.includes('be') || text.includes('cát') || text.includes('kaki') || text.includes('chino') || text.includes('sand')) {
    return {
      type: 'beige',
      primary: '#D4B996',
      secondary: '#BFA482',
      shadow: '#8C7456',
      stroke: '#6E5B43',
      stitch: '#FDFBF7',
      isLight: true
    };
  }

  // 7. Nâu / Cacao / Da bò / Nâu tây
  if (text.includes('nâu') || text.includes('cacao') || text.includes('brown') || text.includes('caramel')) {
    return {
      type: 'brown',
      primary: '#6D4333',
      secondary: '#543124',
      shadow: '#381E15',
      stroke: '#24120C',
      stitch: '#D4AF37',
      isLight: false
    };
  }

  // 8. Rêu / Olive / Xanh lá
  if (text.includes('rêu') || text.includes('olive') || text.includes('green') || text.includes('lục')) {
    return {
      type: 'olive',
      primary: '#475B42',
      secondary: '#364632',
      shadow: '#222D20',
      stroke: '#182016',
      stitch: '#A3B18A',
      isLight: false
    };
  }

  // 9. Đỏ / Rượu / Burgundy
  if (text.includes('đỏ') || text.includes('rượu') || text.includes('burgundy') || text.includes('red')) {
    return {
      type: 'red',
      primary: '#881337',
      secondary: '#670C25',
      shadow: '#4C0519',
      stroke: '#2F030F',
      stitch: '#FDA4AF',
      isLight: false
    };
  }

  return {
    type: 'default',
    primary: defaultHex,
    secondary: '#151D2A',
    shadow: '#0A0E17',
    stroke: '#334155',
    stitch: '#64748B',
    isLight: false
  };
}

/**
 * 1. QUẦN DÀI THẲNG TẮP CHẠM CỔ CHÂN (Tailored Full-Length Trousers / Jeans)
 * "quần dài ra quần dài": Che phủ trọn vẹn từ cạp quần (y=6) xuống sát mắt cá chân (y=276)
 */
export function AtelierTrousers({ item, isJeans = false }) {
  const pal = parseGarmentPalette(item, isJeans ? '#2563EB' : '#1E2430');
  const uid = Math.random().toString(36).substring(2, 8);

  const gradId = `trouserGrad_${uid}`;
  const dropId = `trouserDrop_${uid}`;
  const whiskerId = `whiskerGrad_${uid}`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 280" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={pal.primary} />
          <stop offset="45%" stopColor={pal.secondary} />
          <stop offset="85%" stopColor={pal.shadow} />
          <stop offset="100%" stopColor="#04070D" />
        </linearGradient>

        <linearGradient id={whiskerId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.35)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>

        <filter id={dropId} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="rgba(0,0,0,0.55)" />
        </filter>
      </defs>

      <g filter={`url(#${dropId})`}>
        {/* HAI ỐNG QUẦN DÀI SUÔNG THẲNG TẮP TỪ THẮT LƯNG ĐẾN MẮT CÁ CHÂN */}
        <path
          d="M 24,6 L 96,6 C 104,20 112,40 112,65 C 106,110 102,165 96,276 L 72,276 C 72,220 70,165 66,110 L 60,78 L 54,110 C 50,165 48,220 48,276 L 24,276 C 18,165 14,110 8,65 C 8,40 16,20 24,6 Z"
          fill={`url(#${gradId})`}
          stroke={pal.stroke}
          strokeWidth="0.9"
        />

        {/* Cạp quần may đo cao cấp */}
        <path d="M 24,6 L 96,6 L 97,18 L 23,18 Z" fill={pal.secondary} stroke={pal.stroke} strokeWidth="0.7" />

        {/* Nẹp khóa và khuy/cúc quần */}
        <rect x="54" y="6" width="12" height="12" fill={pal.shadow} stroke={pal.stroke} strokeWidth="0.5" />
        {isJeans && (
          <circle cx="60" cy="12" r="2.4" fill="#D97706" stroke="#78350F" strokeWidth="0.5" />
        )}

        {/* Con đỉa thắt lưng (Belt loops) */}
        <rect x="30" y="4" width="2.5" height="15" fill={pal.stroke} />
        <rect x="48" y="4" width="2.5" height="15" fill={pal.stroke} />
        <rect x="70" y="4" width="2.5" height="15" fill={pal.stroke} />
        <rect x="88" y="4" width="2.5" height="15" fill={pal.stroke} />

        {/* CHI TIẾT ĐẶC TRƯNG: QUẦN TÂY (Ly quần sắc lẹm) HOẶC QUẦN JEANS (Vết mài wash denim) */}
        {isJeans ? (
          <>
            {/* Vết wash mài đùi và đầu gối thời thượng */}
            <ellipse cx="32" cy="72" rx="10" ry="22" fill={`url(#${whiskerId})`} />
            <ellipse cx="88" cy="72" rx="10" ry="22" fill={`url(#${whiskerId})`} />
            <ellipse cx="36" cy="155" rx="7" ry="28" fill={`url(#${whiskerId})`} opacity="0.6" />
            <ellipse cx="84" cy="155" rx="7" ry="28" fill={`url(#${whiskerId})`} opacity="0.6" />

            {/* Túi xéo tròn và đinh tán đồng */}
            <path d="M 23,18 Q 32,32 46,26" stroke={pal.stitch} strokeWidth="0.8" fill="none" />
            <circle cx="46" cy="26" r="1.2" fill="#D97706" />
            <path d="M 97,18 Q 88,32 74,26" stroke={pal.stitch} strokeWidth="0.8" fill="none" />
            <circle cx="74" cy="26" r="1.2" fill="#D97706" />

            {/* Đường chỉ may đũng và sườn quần vàng đặc trưng */}
            <path d="M 60,78 L 48,276" stroke={pal.stitch} strokeWidth="0.6" strokeDasharray="2.5,1.5" />
            <path d="M 60,78 L 72,276" stroke={pal.stitch} strokeWidth="0.6" strokeDasharray="2.5,1.5" />
            <path d="M 8,65 C 14,110 18,165 24,276" stroke={pal.stitch} strokeWidth="0.5" strokeDasharray="2.5,1.5" fill="none" />
            <path d="M 112,65 C 106,110 102,165 96,276" stroke={pal.stitch} strokeWidth="0.5" strokeDasharray="2.5,1.5" fill="none" />
          </>
        ) : (
          <>
            {/* Đường ly quần thẳng tắp từ cạp xuống sát gấu quần (Tạo hiệu ứng kéo dài chân 175cm) */}
            <line x1="36" y1="18" x2="36" y2="272" stroke={pal.isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.22)'} strokeWidth="1.0" />
            <line x1="84" y1="18" x2="84" y2="272" stroke={pal.isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.22)'} strokeWidth="1.0" />

            {/* Túi xéo quần âu may đo */}
            <line x1="24" y1="18" x2="36" y2="44" stroke={pal.stroke} strokeWidth="1.0" />
            <line x1="96" y1="18" x2="84" y2="44" stroke={pal.stroke} strokeWidth="1.0" />
          </>
        )}

        {/* Đường gấu quần gấp may cẩn thận ở mắt cá chân */}
        <rect x="24" y="270" width="24" height="6" fill={pal.shadow} stroke={pal.stroke} strokeWidth="0.5" />
        <rect x="72" y="270" width="24" height="6" fill={pal.shadow} stroke={pal.stroke} strokeWidth="0.5" />
      </g>
    </svg>
  );
}

/**
 * 2. ÁO SƠ MI / POLO CHUẨN MAY ĐO (Tailored Oxford/Poplin Shirt)
 * "áo ra áo": Ôm trọn chân cổ, mở rộng hai bờ vai, có 2 ống tay áo buông tự nhiên, phủ kín ngực bụng tới cạp quần
 */
export function AtelierShirt({ item }) {
  const pal = parseGarmentPalette(item, '#FFFFFF');
  const uid = Math.random().toString(36).substring(2, 8);

  const gradId = `shirtGrad_${uid}`;
  const sleeveLId = `shSleeveL_${uid}`;
  const sleeveRId = `shSleeveR_${uid}`;
  const dropId = `shirtDrop_${uid}`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 160" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={pal.primary} />
          <stop offset="45%" stopColor={pal.secondary} />
          <stop offset="85%" stopColor={pal.shadow} />
          <stop offset="100%" stopColor={pal.isLight ? '#94A3B8' : '#05070B'} />
        </linearGradient>

        <linearGradient id={sleeveLId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={pal.shadow} />
          <stop offset="50%" stopColor={pal.primary} />
          <stop offset="100%" stopColor={pal.secondary} />
        </linearGradient>

        <linearGradient id={sleeveRId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={pal.secondary} />
          <stop offset="50%" stopColor={pal.primary} />
          <stop offset="100%" stopColor={pal.shadow} />
        </linearGradient>

        <filter id={dropId} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="rgba(0,0,0,0.38)" />
        </filter>
      </defs>

      <g filter={`url(#${dropId})`}>
        {/* 1. TAY ÁO TRÁI BUÔNG DỌC BẮP TAY MA-NƠ-CANH */}
        <path d="M 16,26 C 12,48 11,90 12,148 L 28,146 C 29,95 32,52 35,46 Z" fill={`url(#${sleeveLId})`} stroke={pal.stroke} strokeWidth="0.8" />
        <line x1="12" y1="142" x2="28" y2="140" stroke={pal.stroke} strokeWidth="0.8" />
        <circle cx="20" cy="144" r="1.2" fill={pal.isLight ? '#FFFFFF' : '#D4AF37'} />

        {/* 2. TAY ÁO PHẢI BUÔNG DỌC BẮP TAY MA-NƠ-CANH */}
        <path d="M 124,26 C 128,48 129,90 128,148 L 112,146 C 111,95 108,52 105,46 Z" fill={`url(#${sleeveRId})`} stroke={pal.stroke} strokeWidth="0.8" />
        <line x1="128" y1="142" x2="112" y2="140" stroke={pal.stroke} strokeWidth="0.8" />
        <circle cx="120" cy="144" r="1.2" fill={pal.isLight ? '#FFFFFF' : '#D4AF37'} />

        {/* 3. THÂN CHÍNH ÔM TRỌN BỜ VAI, NGỰC VÀ BỤNG */}
        <path
          d="M 52,8 C 38,15 24,22 16,26 L 35,46 C 36,65 37,85 38,105 C 38,122 36,140 36,155 L 104,155 C 104,140 102,122 102,105 C 103,85 104,65 105,46 L 124,26 C 116,22 102,15 88,8 Q 70,14 52,8 Z"
          fill={`url(#${gradId})`}
          stroke={pal.stroke}
          strokeWidth="0.9"
        />

        {/* Nếp gấp vải dệt thanh lịch */}
        <path d="M 48,55 Q 52,105 48,150" stroke={pal.isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'} strokeWidth="0.9" fill="none" />
        <path d="M 92,55 Q 88,105 92,150" stroke={pal.isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'} strokeWidth="0.9" fill="none" />

        {/* Nẹp cúc chính giữa ngực */}
        <rect x="66" y="16" width="8" height="138" fill={pal.secondary} stroke={pal.stroke} strokeWidth="0.5" />
        <circle cx="70" cy="36" r="2.0" fill={pal.isLight ? '#FFFFFF' : '#E2E8F0'} stroke={pal.stroke} strokeWidth="0.5" />
        <circle cx="70" cy="62" r="2.0" fill={pal.isLight ? '#FFFFFF' : '#E2E8F0'} stroke={pal.stroke} strokeWidth="0.5" />
        <circle cx="70" cy="88" r="2.0" fill={pal.isLight ? '#FFFFFF' : '#E2E8F0'} stroke={pal.stroke} strokeWidth="0.5" />
        <circle cx="70" cy="114" r="2.0" fill={pal.isLight ? '#FFFFFF' : '#E2E8F0'} stroke={pal.stroke} strokeWidth="0.5" />
        <circle cx="70" cy="140" r="2.0" fill={pal.isLight ? '#FFFFFF' : '#E2E8F0'} stroke={pal.stroke} strokeWidth="0.5" />

        {/* Túi ngực bên trái */}
        <path d="M 44,58 L 58,58 L 58,78 L 51,82 L 44,78 Z" fill={pal.primary} stroke={pal.stroke} strokeWidth="0.7" opacity="0.95" />

        {/* Cổ áo sơ mi chữ V đứng phom */}
        <path d="M 52,8 Q 70,14 88,8 L 92,18 Q 70,22 48,18 Z" fill={pal.secondary} stroke={pal.stroke} strokeWidth="0.6" />
        <path d="M 54,8 L 46,28 L 68,22 Z" fill={pal.primary} stroke={pal.stroke} strokeWidth="0.8" />
        <path d="M 86,8 L 94,28 L 72,22 Z" fill={pal.primary} stroke={pal.stroke} strokeWidth="0.8" />
      </g>
    </svg>
  );
}

/**
 * 3. ÁO THUN / LEN PHOM BOXY REGULAR FIT (Combed Cotton Crewneck T-Shirt / Knit Sweater)
 * "áo ra áo": Bo cổ tròn dệt gân ôm sát chân cổ, vai áo vuông vức, tay ngắn ôm bắp tay, thân áo phủ kín bụng
 */
export function AtelierTShirt({ item }) {
  const pal = parseGarmentPalette(item, '#1E2430');
  const uid = Math.random().toString(36).substring(2, 8);

  const gradId = `tshirtGrad_${uid}`;
  const dropId = `tshirtDrop_${uid}`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 160" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={pal.primary} />
          <stop offset="40%" stopColor={pal.secondary} />
          <stop offset="80%" stopColor={pal.shadow} />
          <stop offset="100%" stopColor={pal.isLight ? '#CBD5E1' : '#04070B'} />
        </linearGradient>

        <filter id={dropId} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="rgba(0,0,0,0.42)" />
        </filter>
      </defs>

      <g filter={`url(#${dropId})`}>
        {/* Tay áo ngắn bên trái ôm bắp tay */}
        <path d="M 16,26 C 12,42 11,62 12,78 L 34,75 C 34,60 35,46 35,46 Z" fill={`url(#${gradId})`} stroke={pal.stroke} strokeWidth="0.8" />
        <line x1="12" y1="78" x2="34" y2="75" stroke={pal.stroke} strokeWidth="0.8" />

        {/* Tay áo ngắn bên phải ôm bắp tay */}
        <path d="M 124,26 C 128,42 129,62 128,78 L 106,75 C 106,60 105,46 105,46 Z" fill={`url(#${gradId})`} stroke={pal.stroke} strokeWidth="0.8" />
        <line x1="128" y1="78" x2="106" y2="75" stroke={pal.stroke} strokeWidth="0.8" />

        {/* Thân áo chính phom Boxy Regular Fit rộng rãi, phẳng phiu */}
        <path
          d="M 52,8 C 38,15 24,22 16,26 L 35,46 C 36,65 37,85 38,105 C 38,122 36,140 36,155 L 104,155 C 104,140 102,122 102,105 C 103,85 104,65 105,46 L 124,26 C 116,22 102,15 88,8 Q 70,16 52,8 Z"
          fill={`url(#${gradId})`}
          stroke={pal.stroke}
          strokeWidth="0.9"
        />

        {/* Nếp đổ bóng khối ngực và cơ bụng nam tính */}
        <path d="M 48,55 Q 52,105 48,150" stroke={pal.isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'} strokeWidth="1.2" fill="none" />
        <path d="M 92,55 Q 88,105 92,150" stroke={pal.isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'} strokeWidth="1.2" fill="none" />
        <path d="M 58,95 Q 70,105 82,95" stroke={pal.isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'} strokeWidth="1.2" fill="none" />

        {/* Bo cổ tròn dệt gân ôm khít đáy cổ */}
        <path d="M 52,8 Q 70,22 88,8 Q 70,14 52,8 Z" fill={pal.secondary} stroke={pal.stroke} strokeWidth="0.8" />
        <path d="M 54,8 Q 70,18 86,8 Q 70,14 54,8 Z" fill={pal.shadow} opacity="0.6" />

        {/* Đường chỉ may đôi gấu áo */}
        <line x1="36" y1="151" x2="104" y2="151" stroke={pal.stroke} strokeWidth="0.7" strokeDasharray="2,1" />
      </g>
    </svg>
  );
}

/**
 * 4. ÁO KHOÁC BLAZER / JACKET SANG TRỌNG (Tailored Notch-Lapel Blazer)
 * Ve áo bẻ chữ V sâu để lộ áo bên trong, vai áo có đệm, hai vạt áo phủ ngoài tự nhiên
 */
export function AtelierBlazer({ item }) {
  const pal = parseGarmentPalette(item, '#543124');
  const uid = Math.random().toString(36).substring(2, 8);

  const fabricId = `blzFabric_${uid}`;
  const sleeveLId = `blzSleeveL_${uid}`;
  const sleeveRId = `blzSleeveR_${uid}`;
  const lapelId = `blzLapel_${uid}`;
  const dropId = `blzDrop_${uid}`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 240" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={fabricId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={pal.primary} />
          <stop offset="35%" stopColor={pal.secondary} />
          <stop offset="70%" stopColor={pal.shadow} />
          <stop offset="100%" stopColor="#0B0F17" />
        </linearGradient>

        <linearGradient id={sleeveLId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={pal.shadow} />
          <stop offset="45%" stopColor={pal.primary} />
          <stop offset="100%" stopColor={pal.secondary} />
        </linearGradient>

        <linearGradient id={sleeveRId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={pal.secondary} />
          <stop offset="55%" stopColor={pal.primary} />
          <stop offset="100%" stopColor={pal.shadow} />
        </linearGradient>

        <linearGradient id={lapelId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={pal.primary} />
          <stop offset="50%" stopColor={pal.secondary} />
          <stop offset="100%" stopColor={pal.shadow} />
        </linearGradient>

        <filter id={dropId} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="rgba(0,0,0,0.55)" />
        </filter>
      </defs>

      <g filter={`url(#${dropId})`}>
        {/* 1. TAY ÁO KHOÁC TRÁI DÀI BUÔNG DỌC BẮP TAY ĐẾN CỔ TAY */}
        <path d="M 18,34 C 13,55 11,100 11,155 C 11,185 13,208 16,218 L 31,216 C 31,192 33,155 35,115 C 36,90 38,72 38,72 Z" fill={`url(#${sleeveLId})`} stroke={pal.stroke} strokeWidth="0.8" />
        <line x1="16" y1="211" x2="31" y2="209" stroke={pal.stroke} strokeWidth="0.8" />
        <circle cx="19" cy="204" r="1.4" fill="#0B0F17" />
        <circle cx="21" cy="198" r="1.4" fill="#0B0F17" />
        <circle cx="23" cy="192" r="1.4" fill="#0B0F17" />

        {/* 2. TAY ÁO KHOÁC PHẢI DÀI BUÔNG DỌC BẮP TAY ĐẾN CỔ TAY */}
        <path d="M 132,34 C 137,55 139,100 139,155 C 139,185 137,208 134,218 L 119,216 C 119,192 117,155 115,115 C 114,90 112,72 112,72 Z" fill={`url(#${sleeveRId})`} stroke={pal.stroke} strokeWidth="0.8" />
        <line x1="134" y1="211" x2="119" y2="209" stroke={pal.stroke} strokeWidth="0.8" />
        <circle cx="131" cy="204" r="1.4" fill="#0B0F17" />
        <circle cx="129" cy="198" r="1.4" fill="#0B0F17" />
        <circle cx="127" cy="192" r="1.4" fill="#0B0F17" />

        {/* 3. THÂN CHÍNH VỚI VẠT ÁO CHỮ V ĐỂ LỘ ÁO TRONG */}
        <path
          d="M 60,8 C 45,15 28,24 18,34 L 38,72 C 41,94 43,115 43,128 C 43,158 37,185 36,208 L 34,235 C 52,239 75,238 75,238 C 75,238 98,239 116,235 L 114,208 C 113,185 107,158 107,128 C 107,115 109,94 112,72 L 132,34 C 122,24 105,15 90,8 L 84,48 L 75,142 L 66,48 Z"
          fill={`url(#${fabricId})`}
          stroke={pal.stroke}
          strokeWidth="0.9"
        />

        {/* Ve áo khoác chữ V (Notch Lapels) */}
        <path d="M 61,8 L 54,48 L 43,56 L 54,62 L 75,142 L 75,124 L 61,52 Z" fill={`url(#${lapelId})`} stroke={pal.stroke} strokeWidth="0.8" />
        <path d="M 89,8 L 96,48 L 107,56 L 96,62 L 75,142 L 75,124 L 89,52 Z" fill={`url(#${lapelId})`} stroke={pal.stroke} strokeWidth="0.8" />

        {/* Túi ngực và túi nắp hai bên hông */}
        <line x1="49" y1="76" x2="65" y2="73" stroke={pal.stroke} strokeWidth="1.8" />
        <rect x="38" y="172" width="24" height="5.5" rx="1" fill={pal.shadow} stroke={pal.stroke} strokeWidth="0.6" />
        <rect x="88" y="172" width="24" height="5.5" rx="1" fill={pal.shadow} stroke={pal.stroke} strokeWidth="0.6" />

        {/* Khuy cúc áo blazer sang trọng */}
        <circle cx="75" cy="146" r="2.6" fill="#0B0F17" stroke="#D4AF37" strokeWidth="0.5" />
        <circle cx="75" cy="178" r="2.6" fill="#0B0F17" stroke="#D4AF37" strokeWidth="0.5" />
      </g>
    </svg>
  );
}

/**
 * 5. ĐÔI GIÀY SHOWROOM CHUẨN XÁC 2 BÀN CHÂN (Dual-Foot Atelier Footwear)
 * "giày cũng phải đi đúng kiểu": Bao bọc trọn vẹn cả 2 bàn chân ma-nơ-canh, đế giày vững chãi
 */
export function AtelierShoes({ item, isSneaker = true }) {
  const pal = parseGarmentPalette(item, isSneaker ? '#FFFFFF' : '#1E2430');
  const uid = Math.random().toString(36).substring(2, 8);

  const shoeGradId = `shoeGrad_${uid}`;
  const soleGradId = `soleGrad_${uid}`;
  const goldBitId = `goldBit_${uid}`;
  const dropId = `shoeDrop_${uid}`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 50" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={shoeGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={pal.primary} />
          <stop offset="50%" stopColor={pal.secondary} />
          <stop offset="100%" stopColor={pal.shadow} />
        </linearGradient>

        <linearGradient id={soleGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        <linearGradient id={goldBitId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        <filter id={dropId} x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>

      <g filter={`url(#${dropId})`}>
        {isSneaker ? (
          <>
            {/* GIÀY TRÁI: SNEAKER */}
            <g>
              <path d="M 8,36 Q 28,38 48,37 Q 54,35 55,30 L 55,42 C 48,47 24,47 8,45 C 4,44 3,38 8,36 Z" fill={`url(#${soleGradId})`} stroke="#94A3B8" strokeWidth="0.7" />
              <line x1="10" y1="41" x2="52" y2="41" stroke="#64748B" strokeWidth="0.6" strokeDasharray="3,2" />
              <path d="M 10,36 C 8,24 16,14 26,16 C 33,18 38,12 47,12 C 53,12 55,22 55,30 C 51,35 40,37 10,36 Z" fill={`url(#${shoeGradId})`} stroke={pal.stroke} strokeWidth="0.8" />
              <path d="M 20,28 Q 33,26 46,22 L 47,25 Q 33,30 19,31 Z" fill="#D4AF37" opacity="0.95" />
              <line x1="28" y1="18" x2="32" y2="21" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="32" y1="19" x2="36" y2="22" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
            </g>

            {/* GIÀY PHẢI: SNEAKER */}
            <g>
              <path d="M 112,36 Q 92,38 72,37 Q 66,35 65,30 L 65,42 C 72,47 96,47 112,45 C 116,44 117,38 112,36 Z" fill={`url(#${soleGradId})`} stroke="#94A3B8" strokeWidth="0.7" />
              <line x1="110" y1="41" x2="68" y2="41" stroke="#64748B" strokeWidth="0.6" strokeDasharray="3,2" />
              <path d="M 110,36 C 112,24 104,14 94,16 C 87,18 82,12 73,12 C 67,12 65,22 65,30 C 69,35 80,37 110,36 Z" fill={`url(#${shoeGradId})`} stroke={pal.stroke} strokeWidth="0.8" />
              <path d="M 100,28 Q 87,26 74,22 L 73,25 Q 87,30 101,31 Z" fill="#D4AF37" opacity="0.95" />
              <line x1="92" y1="18" x2="88" y2="21" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="88" y1="19" x2="84" y2="22" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          </>
        ) : (
          <>
            {/* GIÀY TRÁI: LOAFER DA BÓNG KHÓA NGỰA */}
            <g>
              <path d="M 8,38 L 20,38 L 20,44 C 15,44 9,43 8,41 Z" fill="#0A0E17" stroke="#334155" strokeWidth="0.6" />
              <path d="M 20,37 Q 38,39 55,34 L 55,39 C 38,44 20,42 20,37 Z" fill="#0A0E17" stroke="#334155" strokeWidth="0.6" />
              <path d="M 9,36 C 8,24 16,16 26,17 C 34,18 41,13 49,13 C 55,13 56,24 55,32 C 45,36 21,37 9,36 Z" fill={`url(#${shoeGradId})`} stroke={pal.stroke} strokeWidth="0.8" />
              <path d="M 32,17 Q 44,17 50,22 Q 52,27 47,30 Q 38,32 30,30" fill="none" stroke="#64748B" strokeWidth="0.6" strokeDasharray="1.5,1.2" />
              <rect x="25" y="24" width="10" height="2.5" rx="1" fill={`url(#${goldBitId})`} />
              <circle cx="25" cy="25" r="2.2" fill="none" stroke={`url(#${goldBitId})`} strokeWidth="0.8" />
              <circle cx="35" cy="25" r="2.2" fill="none" stroke={`url(#${goldBitId})`} strokeWidth="0.8" />
            </g>

            {/* GIÀY PHẢI: LOAFER DA BÓNG KHÓA NGỰA */}
            <g>
              <path d="M 112,38 L 100,38 L 100,44 C 105,44 111,43 112,41 Z" fill="#0A0E17" stroke="#334155" strokeWidth="0.6" />
              <path d="M 100,37 Q 82,39 65,34 L 65,39 C 82,44 100,42 100,37 Z" fill="#0A0E17" stroke="#334155" strokeWidth="0.6" />
              <path d="M 111,36 C 112,24 104,16 94,17 C 86,18 79,13 71,13 C 65,13 64,24 65,32 C 75,36 99,37 111,36 Z" fill={`url(#${shoeGradId})`} stroke={pal.stroke} strokeWidth="0.8" />
              <path d="M 88,17 Q 76,17 70,22 Q 68,27 73,30 Q 82,32 90,30" fill="none" stroke="#64748B" strokeWidth="0.6" strokeDasharray="1.5,1.2" />
              <rect x="85" y="24" width="10" height="2.5" rx="1" fill={`url(#${goldBitId})`} />
              <circle cx="85" cy="25" r="2.2" fill="none" stroke={`url(#${goldBitId})`} strokeWidth="0.8" />
              <circle cx="95" cy="25" r="2.2" fill="none" stroke={`url(#${goldBitId})`} strokeWidth="0.8" />
            </g>
          </>
        )}
      </g>
    </svg>
  );
}

/**
 * 6. ĐẦM LỤA THƯỚT THA (Silk Slip Dress)
 */
export function AtelierDress({ item }) {
  const pal = parseGarmentPalette(item, '#C2410C');
  const uid = Math.random().toString(36).substring(2, 8);
  const gradId = `dressGrad_${uid}`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 320" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={pal.primary} />
          <stop offset="50%" stopColor={pal.secondary} />
          <stop offset="100%" stopColor={pal.shadow} />
        </linearGradient>
      </defs>
      <path
        d="M 46,12 Q 65,22 84,12 L 92,42 C 96,65 98,90 98,125 C 98,160 106,240 114,310 L 16,310 C 24,240 32,160 32,125 C 32,90 34,65 38,42 Z"
        fill={`url(#${gradId})`}
        stroke={pal.stroke}
        strokeWidth="0.8"
      />
      {/* Dây áo quai mảnh spaghetti */}
      <line x1="46" y1="2" x2="46" y2="12" stroke={pal.stroke} strokeWidth="1.2" />
      <line x1="84" y1="2" x2="84" y2="12" stroke={pal.stroke} strokeWidth="1.2" />
    </svg>
  );
}

/**
 * 7. TÚI DA ĐEO CHÉO (Leather Crossbody Bag)
 */
export function AtelierBag({ item }) {
  const pal = parseGarmentPalette(item, '#1E2430');
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120" width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
      {/* Dây đeo da chéo qua vai */}
      <path d="M 0,0 Q 30,45 42,65" stroke={pal.secondary} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Thân túi da dáng Baguette */}
      <rect x="25" y="65" width="45" height="32" rx="4" fill={pal.primary} stroke={pal.stroke} strokeWidth="0.9" />
      {/* Nắp túi gập */}
      <path d="M 25,65 L 70,65 L 70,80 L 47,88 L 25,80 Z" fill={pal.secondary} stroke={pal.stroke} strokeWidth="0.8" />
      {/* Khóa xoay kim loại mạ vàng */}
      <circle cx="47.5" cy="84" r="2.2" fill="#D4AF37" stroke="#92400E" strokeWidth="0.4" />
    </svg>
  );
}
