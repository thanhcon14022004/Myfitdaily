import React, { useMemo } from 'react';

/**
 * MannequinSilhouetteModel:
 * Hệ thống Render Ma-nơ-canh Thời Trang 2D & Fitting Trang Phục Động
 * Dựa trên các mẫu kiểu dáng chuẩn (T-shirt, Polo, Shorts trên gối, Jeans, Trousers...)
 * Tự động đổi màu sắc, đổ bóng và áp họa tiết theo trang phục người dùng.
 */
export default function MannequinSilhouetteModel({
  gender = 'Nam', // 'Nam' | 'Nữ'
  topType = 'tshirt_short', // tshirt_short, polo, shirt_short, shirt_long, tanktop, hoodie, sweater, blazer, croptop
  topColor = '#F8FAFC',
  topAccent = '#E2E8F0',
  topPattern = 'solid', // solid, stripes, plaid, dots, denim
  topImage = null,
  
  bottomType = 'shorts', // shorts, jeans_straight, trousers, cargo, jogger, skirt_mini, skirt_midi, dress
  bottomColor = '#1E293B',
  bottomAccent = '#0F172A',
  bottomPattern = 'solid',
  bottomImage = null,

  shoesType = 'sneaker', // sneaker, loafer, boots, heels, sandals
  shoesColor = '#FFFFFF',
  shoesAccent = '#E2E8F0',

  width = '100%',
  height = '100%',
  showShadow = true
}) {
  const isMale = gender === 'Nam' || gender === 'male' || gender === 'Male';

  // Gradient màu da ma-nơ-canh sang trọng (Tone be sáng ngọc trai studio)
  const skinBase = isMale ? '#E8D3C0' : '#EFE0D2';
  const skinShadow = isMale ? '#D4B89F' : '#DEC5B2';
  const skinHighlight = isMale ? '#F5E6D8' : '#FAF0E6';

  // Unique IDs for SVG gradients & patterns to prevent collisions
  const uid = useMemo(() => Math.random().toString(36).substring(2, 7), []);
  const topFabricFill = topPattern === 'stripes'
    ? `url(#stripes-top-${uid})`
    : topPattern === 'plaid'
      ? `url(#plaid-top-${uid})`
      : `url(#top-grad-${uid})`;
  const bottomFabricFill = bottomPattern === 'denim'
    ? `url(#denim-bot-${uid})`
    : bottomPattern === 'stripes'
      ? `url(#stripes-bottom-${uid})`
      : bottomPattern === 'plaid'
        ? `url(#plaid-bottom-${uid})`
        : `url(#bottom-grad-${uid})`;

  return (
    <svg
      viewBox="0 0 360 620"
      width={width}
      height={height}
      style={{
        display: 'block',
        margin: '0 auto',
        overflow: 'visible',
        filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))'
      }}
    >
      <defs>
        {/* Đổ bóng nền sân khấu studio */}
        <radialGradient id={`floor-shadow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.65" />
          <stop offset="60%" stopColor="#000000" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Gradient màu da cơ thể */}
        <linearGradient id={`skin-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={skinShadow} />
          <stop offset="35%" stopColor={skinHighlight} />
          <stop offset="85%" stopColor={skinBase} />
          <stop offset="100%" stopColor={skinShadow} />
        </linearGradient>

        {/* Gradient áo Top */}
        <linearGradient id={`top-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={topAccent} />
          <stop offset="30%" stopColor={topColor} />
          <stop offset="80%" stopColor={topColor} />
          <stop offset="100%" stopColor={topAccent} />
        </linearGradient>

        {/* Gradient quần Bottom */}
        <linearGradient id={`bottom-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={bottomAccent} />
          <stop offset="35%" stopColor={bottomColor} />
          <stop offset="85%" stopColor={bottomColor} />
          <stop offset="100%" stopColor={bottomAccent} />
        </linearGradient>

        {/* Họa tiết Sọc kẻ (Stripes) */}
        <pattern id={`stripes-top-${uid}`} width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill={topColor} />
          <line x1="0" y1="0" x2="0" y2="12" stroke={topAccent || '#000000'} strokeWidth="3" strokeOpacity="0.35" />
        </pattern>

        {/* Họa tiết Kẻ Caro (Plaid) */}
        <pattern id={`plaid-top-${uid}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill={topColor} />
          <path d="M 0 0 L 16 0 M 0 8 L 16 8 M 0 0 L 0 16 M 8 0 L 8 16" stroke={topAccent || '#000000'} strokeWidth="1.5" strokeOpacity="0.3" />
        </pattern>

        {/* Texture Denim Quần Jeans */}
        <pattern id={`denim-bot-${uid}`} width="6" height="6" patternTransform="rotate(30 0 0)" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill={bottomColor} />
          <line x1="0" y1="0" x2="6" y2="6" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.15" />
        </pattern>
        <pattern id={`stripes-bottom-${uid}`} width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill={bottomColor} />
          <line x1="0" y1="0" x2="0" y2="12" stroke={bottomAccent} strokeWidth="3" strokeOpacity="0.4" />
        </pattern>
        <pattern id={`plaid-bottom-${uid}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill={bottomColor} />
          <path d="M 0 0 L 16 0 M 0 8 L 16 8 M 0 0 L 0 16 M 8 0 L 8 16" stroke={bottomAccent} strokeWidth="1.5" strokeOpacity="0.35" />
        </pattern>

        {/* Filter nếp nhăn và bóng đổ chân thực (Fabric Creases Shadow) */}
        <filter id={`fabric-shadow-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* 1. BÓNG ĐỔ DƯỚI CHÂN MA-NƠ-CANH TRÊN SÀN */}
      {showShadow && (
        <ellipse cx="180" cy="585" rx="90" ry="14" fill={`url(#floor-shadow-${uid})`} />
      )}

      {/* ========================================================================= */}
      {/* 2. BODY MA-NƠ-CANH (ĐẦU, CỔ, TAY, CHÂN, BÀN CHÂN) */}
      {/* ========================================================================= */}
      <g id="mannequin-body">
        {/* ĐẦU (HEAD OVAL MINIMALIST FASHION CHIC) */}
        <g id="head">
          <ellipse cx="180" cy="62" rx={isMale ? 22 : 19} ry={isMale ? 28 : 25} fill={`url(#skin-grad-${uid})`} />
          {/* Cằm & Hàm sắc nét thời trang */}
          <path
            d={isMale ? "M 166 75 Q 180 94 194 75 Z" : "M 168 76 Q 180 92 192 76 Z"}
            fill={skinShadow}
            opacity="0.5"
          />
          {/* Vệt bóng đổ mặt bên tạo khối 3D */}
          <ellipse cx="173" cy="58" rx={isMale ? 14 : 12} ry={isMale ? 19 : 17} fill={skinHighlight} opacity="0.35" />
        </g>

        {/* CỔ (NECK) */}
        <path
          d={isMale ? "M 172 86 L 172 110 L 188 110 L 188 86 Z" : "M 174 85 L 174 112 L 186 112 L 186 85 Z"}
          fill={`url(#skin-grad-${uid})`}
        />
        {/* Hõm xương quai xanh (Collarbone shadow) */}
        <path d="M 168 112 Q 180 117 192 112" stroke={skinShadow} strokeWidth="1.8" fill="none" opacity="0.6" strokeLinecap="round" />

        {/* CÁNH TAY & BÀN TAY (ARMS & HANDS) */}
        {/* Tay Trái (Left Arm - buông tự nhiên hoặc khép hờ) */}
        <path
          d={isMale
            ? "M 126 130 C 114 175 106 220 102 265 C 100 285 102 315 108 340 C 110 348 106 360 108 368 C 112 368 118 362 118 350 C 116 325 116 280 122 245 C 128 205 136 175 142 145 Z"
            : "M 132 135 C 122 175 116 220 114 260 C 112 285 115 315 120 340 C 121 348 119 358 121 364 C 124 364 128 358 128 348 C 126 325 124 280 128 245 C 132 205 140 175 146 145 Z"}
          fill={`url(#skin-grad-${uid})`}
        />

        {/* Tay Phải (Right Arm) */}
        <path
          d={isMale
            ? "M 234 130 C 246 175 254 220 258 265 C 260 285 258 315 252 340 C 250 348 254 360 252 368 C 248 368 242 362 242 350 C 244 325 244 280 238 245 C 232 205 224 175 218 145 Z"
            : "M 228 135 C 238 175 244 220 246 260 C 248 285 245 315 240 340 C 239 348 241 358 239 364 C 236 364 232 358 232 348 C 234 325 236 280 232 245 C 228 205 220 175 214 145 Z"}
          fill={`url(#skin-grad-${uid})`}
        />

        {/* CHÂN MA-NƠ-CANH (LEGS - Hiển thị rõ rệt khi mặc QUẦN ĐÙI SHORT hoặc CHÂN VÁY NGẮN) */}
        {/* Chân Trái (Left Leg) */}
        <path
          d={isMale
            ? "M 148 280 L 144 360 C 142 390 144 425 146 455 C 148 485 147 520 150 550 L 165 550 C 168 520 167 485 168 455 C 170 425 170 390 172 360 L 176 280 Z"
            : "M 152 280 L 148 360 C 146 390 147 425 149 455 C 151 485 150 520 153 550 L 164 550 C 166 520 165 485 166 455 C 168 425 168 390 170 360 L 173 280 Z"}
          fill={`url(#skin-grad-${uid})`}
        />
        {/* Đầu gối trái (Left Knee definition) */}
        <ellipse cx={isMale ? 157 : 157} cy="415" rx="8" ry="6" fill={skinShadow} opacity="0.35" />

        {/* Chân Phải (Right Leg) */}
        <path
          d={isMale
            ? "M 184 280 L 188 360 C 190 390 190 425 192 455 C 193 485 192 520 195 550 L 210 550 C 213 520 212 485 214 455 C 216 425 218 390 216 360 L 212 280 Z"
            : "M 187 280 L 190 360 C 192 390 192 425 194 455 C 195 485 194 520 197 550 L 208 550 C 210 520 209 485 211 455 C 213 425 214 390 212 360 L 208 280 Z"}
          fill={`url(#skin-grad-${uid})`}
        />
        {/* Đầu gối phải (Right Knee definition) */}
        <ellipse cx={isMale ? 203 : 203} cy="415" rx="8" ry="6" fill={skinShadow} opacity="0.35" />
      </g>

      {/* ========================================================================= */}
      {/* 3. LỚP BOTTOM (QUẦN / VÁY) */}
      {/* ========================================================================= */}
      <g id="garment-bottom" filter={`url(#fabric-shadow-${uid})`}>
        {/* KIỂU 1: QUẦN ĐÙI TRÊN GỐI (SHORTS - Dài trên gối 5-7cm đúng yêu cầu) */}
        {bottomType === 'shorts' && (
          <g id="shorts-above-knee">
            {/* Thân quần đùi */}
            <path
              d={isMale
                ? "M 134 242 L 226 242 L 232 375 L 188 375 L 180 305 L 172 375 L 128 375 Z"
                : "M 138 244 L 222 244 L 228 365 L 187 365 L 180 300 L 173 365 L 132 365 Z"}
              fill={bottomFabricFill}
              stroke={bottomAccent}
              strokeWidth="1.2"
            />
            {/* Cạp quần (Waistband) */}
            <path
              d={isMale ? "M 134 242 L 226 242 L 226 256 L 134 256 Z" : "M 138 244 L 222 244 L 222 256 L 138 256 Z"}
              fill={bottomAccent}
              opacity="0.3"
            />
            {/* Đỉa quần (Belt loops) */}
            <line x1="152" y1="242" x2="152" y2="256" stroke={bottomAccent} strokeWidth="2" opacity="0.6" />
            <line x1="208" y1="242" x2="208" y2="256" stroke={bottomAccent} strokeWidth="2" opacity="0.6" />
            <line x1="180" y1="242" x2="180" y2="256" stroke={bottomAccent} strokeWidth="2" opacity="0.6" />

            {/* Túi quần chéo 2 bên (Pockets) */}
            <path d="M 140 256 C 146 270 148 290 146 305" stroke={bottomAccent} strokeWidth="1.5" fill="none" opacity="0.5" />
            <path d="M 220 256 C 214 270 212 290 214 305" stroke={bottomAccent} strokeWidth="1.5" fill="none" opacity="0.5" />

            {/* Đường nẹp xắn gấu quần đùi (Folded Cuff hem) */}
            <line x1={isMale ? "128" : "132"} y1={isMale ? "365" : "356"} x2={isMale ? "172" : "173"} y2={isMale ? "365" : "356"} stroke={bottomAccent} strokeWidth="1.8" opacity="0.4" strokeDasharray="3 2" />
            <line x1={isMale ? "188" : "187"} y1={isMale ? "365" : "356"} x2={isMale ? "232" : "228"} y2={isMale ? "365" : "356"} stroke={bottomAccent} strokeWidth="1.8" opacity="0.4" strokeDasharray="3 2" />

            {/* Khóa kéo trung tâm (Fly) */}
            <path d="M 180 256 L 180 295 Q 186 295 186 285 L 186 256" stroke={bottomAccent} strokeWidth="1.2" fill="none" opacity="0.45" />
          </g>
        )}

        {/* KIỂU 1B: QUẦN SHORT JEAN XẮN GẤU (SHORTS DENIM) */}
        {bottomType === 'shorts_denim' && (
          <g id="shorts-denim">
            <path
              d={isMale
                ? "M 134 242 L 226 242 L 232 372 L 188 372 L 180 305 L 172 372 L 128 372 Z"
                : "M 138 244 L 222 244 L 228 362 L 187 362 L 180 300 L 173 362 L 132 362 Z"}
              fill={`url(#denim-bot-${uid})`}
              stroke={bottomAccent}
              strokeWidth="1.2"
            />
            {/* Chỉ vàng Jeans */}
            <line x1="180" y1="242" x2="180" y2="300" stroke="#CA8A04" strokeWidth="1.4" opacity="0.7" strokeDasharray="3 2" />
            <path d="M 140 256 C 148 270 150 286 148 298" stroke="#CA8A04" strokeWidth="1.2" fill="none" opacity="0.7" strokeDasharray="3 2" />
            <path d="M 220 256 C 212 270 210 286 212 298" stroke="#CA8A04" strokeWidth="1.2" fill="none" opacity="0.7" strokeDasharray="3 2" />
            {/* Gấu xắn denim bụi bặm */}
            <rect x={isMale ? "127" : "131"} y={isMale ? "360" : "350"} width={isMale ? "46" : "43"} height="12" rx="1" fill={bottomAccent} opacity="0.5" stroke="#CA8A04" strokeWidth="0.8" />
            <rect x={isMale ? "187" : "186"} y={isMale ? "360" : "350"} width={isMale ? "46" : "43"} height="12" rx="1" fill={bottomAccent} opacity="0.5" stroke="#CA8A04" strokeWidth="0.8" />
          </g>
        )}

        {/* KIỂU 2: QUẦN JEANS DÀI ỐNG SUÔNG (JEANS STRAIGHT) */}
        {bottomType === 'jeans_straight' && (
          <g id="jeans-straight">
            <path
              d={isMale
                ? "M 134 242 L 226 242 L 230 550 L 194 550 L 180 320 L 166 550 L 130 550 Z"
                : "M 138 244 L 222 244 L 224 550 L 193 550 L 180 315 L 167 550 L 136 550 Z"}
              fill={bottomFabricFill}
              stroke={bottomAccent}
              strokeWidth="1.2"
            />
            {/* Chỉ may vàng/đồng đặc trưng của Jeans denim */}
            <line x1="180" y1="242" x2="180" y2="315" stroke="#CA8A04" strokeWidth="1.2" opacity="0.6" strokeDasharray="4 2" />
            <path d="M 142 256 C 150 270 152 285 150 295" stroke="#CA8A04" strokeWidth="1.2" fill="none" opacity="0.6" strokeDasharray="3 2" />
            <path d="M 218 256 C 210 270 208 285 210 295" stroke="#CA8A04" strokeWidth="1.2" fill="none" opacity="0.6" strokeDasharray="3 2" />
            {/* Gấu quần may 2 đường chỉ */}
            <line x1={isMale ? "130" : "136"} y1="544" x2={isMale ? "166" : "167"} y2="544" stroke="#CA8A04" strokeWidth="1.2" opacity="0.5" strokeDasharray="3 2" />
            <line x1={isMale ? "194" : "193"} y1="544" x2={isMale ? "230" : "224"} y2="544" stroke="#CA8A04" strokeWidth="1.2" opacity="0.5" strokeDasharray="3 2" />
          </g>
        )}

        {/* KIỂU 3: QUẦN TÂY ÂU XẾP LY (TROUSERS PLEATED) */}
        {bottomType === 'trousers' && (
          <g id="trousers-pleated">
            <path
              d={isMale
                ? "M 135 240 L 225 240 L 227 552 L 194 552 L 180 325 L 166 552 L 133 552 Z"
                : "M 138 240 L 222 240 L 222 552 L 194 552 L 180 320 L 166 552 L 138 552 Z"}
              fill={bottomFabricFill}
              stroke={bottomAccent}
              strokeWidth="1.2"
            />
            {/* Đường xếp ly ủi ly thẳng tắp (Sharp crease lines) */}
            <line x1="156" y1="255" x2="149" y2="548" stroke="#FFFFFF" strokeWidth="1" opacity="0.25" />
            <line x1="156" y1="255" x2="149" y2="548" stroke="#000000" strokeWidth="1" opacity="0.3" />
            <line x1="204" y1="255" x2="211" y2="548" stroke="#FFFFFF" strokeWidth="1" opacity="0.25" />
            <line x1="204" y1="255" x2="211" y2="548" stroke="#000000" strokeWidth="1" opacity="0.3" />
            {/* Cạp quần tây có đai mỏng */}
            <rect x="135" y="240" width="90" height="14" fill={bottomAccent} opacity="0.35" />
          </g>
        )}

        {/* KIỂU 3B: QUẦN SUÔNG ỐNG RỘNG (WIDE-LEG PANTS) */}
        {bottomType === 'pants_wide' && (
          <g id="pants-wide-leg">
            <path
              d={isMale
                ? "M 134 240 L 226 240 L 236 554 L 190 554 L 180 330 L 170 554 L 124 554 Z"
                : "M 136 240 L 224 240 L 232 554 L 190 554 L 180 325 L 170 554 L 128 554 Z"}
              fill={bottomFabricFill}
              stroke={bottomAccent}
              strokeWidth="1.2"
            />
            {/* Đường rủ mềm mại của vải suông */}
            <line x1="156" y1="260" x2="148" y2="550" stroke="#FFFFFF" strokeWidth="1" opacity="0.2" />
            <line x1="204" y1="260" x2="212" y2="550" stroke="#FFFFFF" strokeWidth="1" opacity="0.2" />
            <line x1="156" y1="260" x2="148" y2="550" stroke="#000000" strokeWidth="1" opacity="0.25" />
            <line x1="204" y1="260" x2="212" y2="550" stroke="#000000" strokeWidth="1" opacity="0.25" />
            <rect x="135" y="240" width="90" height="12" fill={bottomAccent} opacity="0.3" />
          </g>
        )}

        {/* KIỂU 4: QUẦN TÚI HỘP DÙ RỘNG (CARGO) */}
        {bottomType === 'cargo' && (
          <g id="cargo-pants">
            <path
              d={isMale
                ? "M 134 242 L 226 242 L 236 546 L 198 546 L 180 325 L 162 546 L 124 546 Z"
                : "M 138 244 L 222 244 L 230 546 L 196 546 L 180 320 L 164 546 L 130 546 Z"}
              fill={bottomFabricFill}
              stroke={bottomAccent}
              strokeWidth="1.2"
            />
            {/* Túi hộp bên đùi trái (Left Cargo pocket) */}
            <rect x={isMale ? "124" : "130"} y="340" width="22" height="35" rx="3" fill={bottomAccent} opacity="0.5" stroke={bottomColor} strokeWidth="1" />
            <path d={isMale ? "M 124 340 L 135 348 L 146 340" : "M 130 340 L 141 348 L 152 340"} fill={bottomAccent} />
            {/* Túi hộp bên đùi phải (Right Cargo pocket) */}
            <rect x={isMale ? "214" : "208"} y="340" width="22" height="35" rx="3" fill={bottomAccent} opacity="0.5" stroke={bottomColor} strokeWidth="1" />
            <path d={isMale ? "M 214 340 L 225 348 L 236 340" : "M 208 340 L 219 348 L 230 340"} fill={bottomAccent} />
          </g>
        )}

        {/* KIỂU 5: QUẦN JOGGER NỈ THUN BO GẤU */}
        {bottomType === 'jogger' && (
          <g id="jogger-pants">
            <path
              d="M 136 242 L 224 242 L 222 535 L 202 535 L 180 330 L 158 535 L 138 535 Z"
              fill={bottomFabricFill}
              stroke={bottomAccent}
              strokeWidth="1.2"
            />
            {/* Bo chun gấu quần trái & phải */}
            <rect x="137" y="535" width="22" height="15" rx="2" fill={bottomAccent} opacity="0.6" stroke={bottomColor} />
            <rect x="201" y="535" width="22" height="15" rx="2" fill={bottomAccent} opacity="0.6" stroke={bottomColor} />
            {/* Dây rút cạp quần */}
            <path d="M 177 252 Q 174 265 170 272 M 183 252 Q 186 265 190 272" stroke="#FFFFFF" strokeWidth="1.6" fill="none" opacity="0.8" />
          </g>
        )}

        {/* KIỂU 6: CHÂN VÁY NGẮN CHỮ A (SKIRT MINI) */}
        {bottomType === 'skirt_mini' && (
          <g id="skirt-mini">
            <path
              d="M 142 242 L 218 242 L 236 360 L 124 360 Z"
              fill={bottomFabricFill}
              stroke={bottomAccent}
              strokeWidth="1.2"
            />
            {/* Nếp gợn sóng tà váy chữ A */}
            <path d="M 124 360 Q 152 368 180 360 Q 208 368 236 360" stroke={bottomAccent} strokeWidth="1.5" fill="none" opacity="0.5" />
          </g>
        )}

        {/* KIỂU 7: CHÂN VÁY MIDI DÀI QUA GỐI (SKIRT MIDI) */}
        {bottomType === 'skirt_midi' && (
          <g id="skirt-midi">
            <path
              d="M 142 242 L 218 242 L 244 470 L 116 470 Z"
              fill={bottomFabricFill}
              stroke={bottomAccent}
              strokeWidth="1.2"
            />
            {/* Nếp xếp ly dập nổi (Pleats) */}
            <line x1="150" y1="245" x2="135" y2="470" stroke={bottomAccent} strokeWidth="1" opacity="0.4" />
            <line x1="165" y1="245" x2="160" y2="470" stroke={bottomAccent} strokeWidth="1" opacity="0.4" />
            <line x1="180" y1="245" x2="180" y2="470" stroke={bottomAccent} strokeWidth="1" opacity="0.4" />
            <line x1="195" y1="245" x2="200" y2="470" stroke={bottomAccent} strokeWidth="1" opacity="0.4" />
            <line x1="210" y1="245" x2="225" y2="470" stroke={bottomAccent} strokeWidth="1" opacity="0.4" />
          </g>
        )}

        {/* KIỂU 8: ĐẦM LIỀN THÂN - render bodice and skirt as one garment */}
        {bottomType === 'dress' && (
          <g id="dress">
            <path
              d={isMale
                ? "M 160 114 Q 180 126 200 114 L 226 132 L 214 176 L 202 168 L 206 220 L 244 410 L 116 410 L 154 220 L 158 168 L 146 176 L 134 132 Z"
                : "M 162 114 Q 180 125 198 114 L 220 132 L 210 174 L 200 166 L 204 218 L 238 400 L 122 400 L 156 218 L 160 166 L 150 174 L 140 132 Z"}
              fill={bottomFabricFill}
              stroke={bottomAccent}
              strokeWidth="1.2"
            />
            <path d="M 180 126 L 180 220" stroke={bottomAccent} strokeWidth="1" opacity="0.35" />
            <path d="M 142 300 Q 180 310 218 300" stroke={bottomAccent} strokeWidth="1.5" fill="none" opacity="0.3" />
          </g>
        )}
      </g>

      {/* ========================================================================= */}
      {/* 4. LỚP TOP (ÁO) - NẰM TRÊN CẠP QUẦN */}
      {/* ========================================================================= */}
      <g id="garment-top" display={bottomType === 'dress' ? 'none' : undefined} filter={`url(#fabric-shadow-${uid})`}>
        {/* Fill pattern nếu có (stripes, plaid) */}
        {/* KIỂU 1: ÁO THUN CỔ TRÒN TAY NGẮN (TSHIRT SHORT - Đúng ví dụ của user) */}
        {topType === 'tshirt_short' && (
          <g id="tshirt-short">
            {/* Thân áo & 2 tay áo ngắn */}
            <path
              d={isMale
                ? "M 160 114 Q 180 126 200 114 L 246 136 L 230 190 L 212 180 L 214 260 L 146 260 L 148 180 L 130 190 L 114 136 Z"
                : "M 162 114 Q 180 125 198 114 L 238 136 L 224 185 L 208 176 L 210 258 L 150 258 L 152 176 L 136 185 L 122 136 Z"}
              fill={topFabricFill}
              stroke={topAccent}
              strokeWidth="1.2"
            />
            {/* Bo viền cổ áo tròn (Crewneck Ribbed Collar) */}
            <path
              d={isMale ? "M 160 114 Q 180 126 200 114 Q 180 132 160 114 Z" : "M 162 114 Q 180 125 198 114 Q 180 131 162 114 Z"}
              fill={topAccent}
              stroke={topColor}
              strokeWidth="0.8"
            />
            {/* Đường may gấu tay áo (Sleeve hems) */}
            <line x1={isMale ? "114" : "122"} y1={isMale ? "136" : "136"} x2={isMale ? "130" : "136"} y2={isMale ? "190" : "185"} stroke={topAccent} strokeWidth="1.2" opacity="0.4" strokeDasharray="3 2" />
            <line x1={isMale ? "246" : "238"} y1={isMale ? "136" : "136"} x2={isMale ? "230" : "224"} y2={isMale ? "190" : "185"} stroke={topAccent} strokeWidth="1.2" opacity="0.4" strokeDasharray="3 2" />
            {/* Đường may gấu áo dưới (Bottom hem) */}
            <line x1={isMale ? "146" : "150"} y1={isMale ? "254" : "252"} x2={isMale ? "214" : "210"} y2={isMale ? "254" : "252"} stroke={topAccent} strokeWidth="1.2" opacity="0.4" strokeDasharray="3 2" />
          </g>
        )}

        {/* KIỂU 2: ÁO POLO CỔ BẺ TAY NGẮN (POLO SHIRT) */}
        {topType === 'polo' && (
          <g id="polo-shirt">
            <path
              d={isMale
                ? "M 164 114 L 196 114 L 244 136 L 230 190 L 212 180 L 214 262 L 146 262 L 148 180 L 130 190 L 116 136 Z"
                : "M 166 114 L 194 114 L 238 136 L 224 185 L 208 176 L 210 260 L 150 260 L 152 176 L 136 185 L 122 136 Z"}
              fill={topFabricFill}
              stroke={topAccent}
              strokeWidth="1.2"
            />
            {/* Cổ bẻ Polo (Folded Collar) */}
            <path d="M 162 114 L 174 136 L 180 126 L 166 114 Z" fill={topAccent} stroke={topColor} strokeWidth="1" />
            <path d="M 198 114 L 186 136 L 180 126 L 194 114 Z" fill={topAccent} stroke={topColor} strokeWidth="1" />
            {/* Nẹp cúc Polo (Placket) & 2 Cúc áo */}
            <rect x="177" y="126" width="6" height="32" fill={topAccent} opacity="0.4" />
            <circle cx="180" cy="136" r="1.5" fill="#FFFFFF" opacity="0.9" />
            <circle cx="180" cy="148" r="1.5" fill="#FFFFFF" opacity="0.9" />
          </g>
        )}

        {/* KIỂU 3: ÁO SƠ MI TAY NGẮN (SHIRT SHORT) */}
        {topType === 'shirt_short' && (
          <g id="shirt-short">
            <path
              d={isMale
                ? "M 162 114 L 198 114 L 246 136 L 232 192 L 212 182 L 216 264 L 144 264 L 148 182 L 128 192 L 114 136 Z"
                : "M 164 114 L 196 114 L 238 136 L 226 188 L 208 178 L 212 262 L 148 262 L 152 178 L 134 188 L 122 136 Z"}
              fill={topFabricFill}
              stroke={topAccent}
              strokeWidth="1.2"
            />
            {/* Cổ sơ mi bẻ nhọn (Spread Collar) */}
            <path d="M 160 114 L 170 138 L 180 124 L 168 114 Z" fill={topAccent} stroke={topColor} strokeWidth="1" />
            <path d="M 200 114 L 190 138 L 180 124 L 192 114 Z" fill={topAccent} stroke={topColor} strokeWidth="1" />
            {/* Hàng cúc sơ mi dọc thân */}
            <line x1="180" y1="124" x2="180" y2="264" stroke={topAccent} strokeWidth="2" opacity="0.4" />
            <circle cx="180" cy="145" r="1.6" fill="#FFFFFF" opacity="0.9" />
            <circle cx="180" cy="175" r="1.6" fill="#FFFFFF" opacity="0.9" />
            <circle cx="180" cy="205" r="1.6" fill="#FFFFFF" opacity="0.9" />
            <circle cx="180" cy="235" r="1.6" fill="#FFFFFF" opacity="0.9" />
            {/* Túi ngực áo sơ mi */}
            <rect x="156" y="160" width="16" height="18" rx="2" fill="none" stroke={topAccent} strokeWidth="1" opacity="0.4" />
          </g>
        )}

        {/* KIỂU 4: ÁO SƠ MI DÀI TAY (SHIRT LONG) */}
        {topType === 'shirt_long' && (
          <g id="shirt-long">
            <path
              d={isMale
                ? "M 162 114 L 198 114 L 246 136 L 244 320 L 230 320 L 214 182 L 216 264 L 144 264 L 146 182 L 130 320 L 116 320 L 114 136 Z"
                : "M 164 114 L 196 114 L 238 136 L 236 320 L 224 320 L 208 178 L 212 262 L 148 262 L 152 178 L 136 320 L 124 320 L 122 136 Z"}
              fill={topFabricFill}
              stroke={topAccent}
              strokeWidth="1.2"
            />
            {/* Cổ sơ mi */}
            <path d="M 160 114 L 170 138 L 180 124 L 168 114 Z" fill={topAccent} stroke={topColor} strokeWidth="1" />
            <path d="M 200 114 L 190 138 L 180 124 L 192 114 Z" fill={topAccent} stroke={topColor} strokeWidth="1" />
            {/* Hàng cúc & Măng-sét cổ tay */}
            <line x1="180" y1="124" x2="180" y2="264" stroke={topAccent} strokeWidth="2" opacity="0.4" />
            <circle cx="180" cy="150" r="1.6" fill="#FFFFFF" opacity="0.9" />
            <circle cx="180" cy="180" r="1.6" fill="#FFFFFF" opacity="0.9" />
            <circle cx="180" cy="210" r="1.6" fill="#FFFFFF" opacity="0.9" />
            <circle cx="180" cy="240" r="1.6" fill="#FFFFFF" opacity="0.9" />
            {/* Cổ tay áo măng-sét */}
            <rect x={isMale ? "116" : "124"} y="310" width="14" height="10" rx="1" fill={topAccent} opacity="0.5" />
            <rect x={isMale ? "230" : "222"} y="310" width="14" height="10" rx="1" fill={topAccent} opacity="0.5" />
          </g>
        )}

        {/* KIỂU 5: ÁO BA LỖ SÁT NÁCH (TANK TOP) */}
        {topType === 'tanktop' && (
          <g id="tank-top">
            <path
              d={isMale
                ? "M 154 116 Q 180 135 206 116 L 216 145 C 196 170 206 195 212 258 L 148 258 C 154 195 164 170 144 145 Z"
                : "M 158 116 Q 180 135 202 116 L 210 145 C 194 170 202 195 208 256 L 152 256 C 158 195 166 170 150 145 Z"}
              fill={topFabricFill}
              stroke={topAccent}
              strokeWidth="1.2"
            />
            {/* Viền cổ khoét sâu & nách áo */}
            <path d={isMale ? "M 154 116 Q 180 135 206 116" : "M 158 116 Q 180 135 202 116"} stroke={topAccent} strokeWidth="1.5" fill="none" opacity="0.5" />
          </g>
        )}

        {/* KIỂU 6: ÁO HOODIE CÓ MŨ TAY DÀI */}
        {topType === 'hoodie' && (
          <g id="hoodie-sweater">
            {/* Mũ hoodie phía sau cổ */}
            <path d="M 154 112 Q 180 82 206 112 Z" fill={topAccent} stroke={topColor} strokeWidth="1" />
            {/* Thân hoodie rộng phom */}
            <path
              d={isMale
                ? "M 156 118 L 204 118 L 254 136 L 244 325 L 228 325 L 218 190 L 220 270 L 140 270 L 142 190 L 132 325 L 116 325 L 106 136 Z"
                : "M 158 118 L 202 118 L 246 136 L 238 325 L 224 325 L 214 186 L 216 268 L 144 268 L 146 186 L 136 325 L 122 325 L 114 136 Z"}
              fill={topFabricFill}
              stroke={topAccent}
              strokeWidth="1.2"
            />
            {/* Túi Kangaroo trước bụng */}
            <path
              d={isMale ? "M 155 220 L 205 220 L 215 258 L 145 258 Z" : "M 158 220 L 202 220 L 210 256 L 150 256 Z"}
              fill={topAccent}
              opacity="0.35"
              stroke={topColor}
              strokeWidth="1"
            />
            {/* Dây rút mũ hoodie */}
            <line x1="172" y1="120" x2="168" y2="160" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
            <line x1="188" y1="120" x2="192" y2="160" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
          </g>
        )}

        {/* KIỂU 7: ÁO LEN DỆT KIM (SWEATER) */}
        {topType === 'sweater' && (
          <g id="sweater-knit">
            <path
              d={isMale
                ? "M 160 114 Q 180 124 200 114 L 250 136 L 242 322 L 228 322 L 214 184 L 216 262 L 144 262 L 146 184 L 132 322 L 118 322 L 110 136 Z"
                : "M 162 114 Q 180 123 198 114 L 242 136 L 236 322 L 224 322 L 210 180 L 212 260 L 148 260 L 150 180 L 136 322 L 124 322 L 118 136 Z"}
              fill={topFabricFill}
              stroke={topAccent}
              strokeWidth="1.2"
            />
            {/* Bo cổ dệt kim dày */}
            <path d="M 160 114 Q 180 124 200 114 Q 180 132 160 114" fill={topAccent} opacity="0.6" stroke={topColor} />
            {/* Bo gấu áo len */}
            <rect x={isMale ? "144" : "148"} y="254" width={isMale ? "72" : "64"} height="8" fill={topAccent} opacity="0.4" />
          </g>
        )}

        {/* KIỂU 8: ÁO KHOÁC BLAZER / VEST */}
        {topType === 'blazer' && (
          <g id="blazer-jacket">
            {/* Áo sơ mi lót bên trong */}
            <polygon points="172,116 188,116 180,180" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            {/* Thân áo khoác Blazer 2 vạt chồng lên nhau */}
            <path
              d={isMale
                ? "M 158 114 L 202 114 L 252 136 L 244 322 L 230 322 L 216 186 L 220 274 L 140 274 L 144 186 L 130 322 L 116 322 L 108 136 Z"
                : "M 160 114 L 200 114 L 244 136 L 238 322 L 226 322 L 212 182 L 216 270 L 144 270 L 148 182 L 134 322 L 122 322 L 116 136 Z"}
              fill={topFabricFill}
              stroke={topAccent}
              strokeWidth="1.2"
            />
            {/* Ve áo chữ V (Lapels) */}
            <polygon points="158,114 146,170 178,210 172,118" fill={topAccent} stroke={topColor} strokeWidth="1" />
            <polygon points="202,114 214,170 182,210 188,118" fill={topAccent} stroke={topColor} strokeWidth="1" />
            {/* Cúc áo vest */}
            <circle cx="180" cy="225" r="2" fill="#D4AF37" />
            <circle cx="180" cy="245" r="2" fill="#D4AF37" />
            {/* Túi nắp 2 bên */}
            <rect x="146" y="240" width="18" height="3" fill="#000000" opacity="0.35" />
            <rect x="196" y="240" width="18" height="3" fill="#000000" opacity="0.35" />
          </g>
        )}

        {/* KIỂU 9: ÁO CROPTOP LỬNG ÔM EO (NỮ) */}
        {topType === 'croptop' && (
          <g id="croptop-tee">
            <path
              d="M 164 114 Q 180 126 196 114 L 236 136 L 222 180 L 206 172 L 208 205 L 152 205 L 154 172 L 138 180 L 124 136 Z"
              fill={topFabricFill}
              stroke={topAccent}
              strokeWidth="1.2"
            />
            {/* Bo cổ tròn */}
            <path d="M 164 114 Q 180 126 196 114 Q 180 131 164 114 Z" fill={topAccent} stroke={topColor} strokeWidth="0.8" />
            {/* Vòng eo lộ ra bên dưới áo croptop */}
            <path d="M 152 205 C 160 215 170 218 180 218 C 190 218 200 215 208 205 Z" fill={skinBase} opacity="0.5" />
          </g>
        )}

        {/* KIỂU 10: ÁO KHOÁC BOMBER / ÁO GIÓ BO CHUN */}
        {topType === 'jacket_bomber' && (
          <g id="bomber-jacket">
            <path
              d={isMale
                ? "M 160 116 L 200 116 L 254 138 L 244 322 L 230 322 L 218 190 L 220 268 L 140 268 L 142 190 L 130 322 L 116 322 L 106 138 Z"
                : "M 162 116 L 198 116 L 246 138 L 238 322 L 224 322 L 214 186 L 216 266 L 144 266 L 146 186 L 136 322 L 122 322 L 114 138 Z"}
              fill={topFabricFill}
              stroke={topAccent}
              strokeWidth="1.2"
            />
            {/* Bo cổ dệt bomber (Baseball rib collar) */}
            <path d="M 160 116 Q 180 128 200 116 Q 180 134 160 116" fill={topAccent} stroke={topColor} strokeWidth="1" />
            {/* Khóa kéo kim loại chính giữa */}
            <line x1="180" y1="126" x2="180" y2="260" stroke="#D4D4D8" strokeWidth="2.5" />
            <rect x="178" y="145" width="4" height="7" rx="1" fill="#71717A" />
            {/* Bo gấu áo và bo cổ tay */}
            <rect x={isMale ? "140" : "144"} y={isMale ? "260" : "258"} width={isMale ? "80" : "72"} height="8" rx="2" fill={topAccent} opacity="0.7" />
            <rect x={isMale ? "116" : "122"} y="312" width="14" height="10" rx="1" fill={topAccent} opacity="0.7" />
            <rect x={isMale ? "230" : "224"} y="312" width="14" height="10" rx="1" fill={topAccent} opacity="0.7" />
            {/* Túi khóa chéo bomber */}
            <line x1="150" y1="215" x2="162" y2="245" stroke={topAccent} strokeWidth="2.5" opacity="0.7" />
            <line x1="210" y1="215" x2="198" y2="245" stroke={topAccent} strokeWidth="2.5" opacity="0.7" />
          </g>
        )}

        {/* KIỂU 11: ÁO CARDIGAN LEN CỔ TIM CÀI CÚC */}
        {topType === 'cardigan' && (
          <g id="knit-cardigan">
            {/* Áo phông lót trắng bên trong */}
            <polygon points="166,114 194,114 180,175" fill="#FFFFFF" opacity="0.9" />
            {/* Thân cardigan */}
            <path
              d={isMale
                ? "M 160 114 L 200 114 L 250 136 L 242 322 L 228 322 L 214 184 L 216 264 L 144 264 L 146 184 L 132 322 L 118 322 L 110 136 Z"
                : "M 162 114 L 198 114 L 242 136 L 236 322 L 224 322 L 210 180 L 212 262 L 148 262 L 150 180 L 136 322 L 124 322 L 118 136 Z"}
              fill={topFabricFill}
              stroke={topAccent}
              strokeWidth="1.2"
            />
            {/* Viền cổ tim khoét sâu */}
            <polygon points="166,114 180,185 194,114 186,114 180,175 174,114" fill={topAccent} opacity="0.7" />
            {/* Nẹp cúc dọc và 4 cúc sừng */}
            <line x1="180" y1="185" x2="180" y2="264" stroke={topAccent} strokeWidth="3" opacity="0.6" />
            <circle cx="180" cy="195" r="2.2" fill="#522504" />
            <circle cx="180" cy="215" r="2.2" fill="#522504" />
            <circle cx="180" cy="235" r="2.2" fill="#522504" />
            <circle cx="180" cy="255" r="2.2" fill="#522504" />
            {/* 2 Túi ốp trước ngực / hông */}
            <rect x="148" y="225" width="16" height="18" rx="2" fill={topAccent} opacity="0.3" stroke={topColor} strokeWidth="0.8" />
            <rect x="196" y="225" width="16" height="18" rx="2" fill={topAccent} opacity="0.3" stroke={topColor} strokeWidth="0.8" />
          </g>
        )}
      </g>

      {/* ========================================================================= */}
      {/* 5. LỚP GIÀY DÉP (SHOES) */}
      {/* ========================================================================= */}
      <g id="garment-shoes" filter={`url(#fabric-shadow-${uid})`}>
        {/* KIỂU 1: GIÀY SNEAKER THỂ THAO ĐẾ BỆT */}
        {shoesType === 'sneaker' && (
          <g id="sneaker-shoes">
            {/* Giày trái */}
            <path d="M 148 548 L 166 548 C 172 556 174 572 170 578 L 138 578 C 136 572 138 556 148 548 Z" fill={shoesColor} stroke={shoesAccent} strokeWidth="1" />
            {/* Đế giày cao su trắng/tương phản */}
            <rect x="136" y="574" width="36" height="5" rx="2" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.8" />
            {/* Dây giày thể thao */}
            <line x1="148" y1="556" x2="160" y2="556" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="147" y1="562" x2="161" y2="562" stroke="#94A3B8" strokeWidth="1.5" />

            {/* Giày phải */}
            <path d="M 194 548 L 212 548 C 222 556 224 572 222 578 L 190 578 C 186 572 188 556 194 548 Z" fill={shoesColor} stroke={shoesAccent} strokeWidth="1" />
            {/* Đế giày cao su */}
            <rect x="188" y="574" width="36" height="5" rx="2" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.8" />
            {/* Dây giày */}
            <line x1="200" y1="556" x2="212" y2="556" stroke="#94A3B8" strokeWidth="1.5" />
            <line x1="199" y1="562" x2="213" y2="562" stroke="#94A3B8" strokeWidth="1.5" />
          </g>
        )}

        {/* KIỂU 2: GIÀY LOAFER DA BÓNG */}
        {shoesType === 'loafer' && (
          <g id="loafer-shoes">
            {/* Giày trái */}
            <path d="M 148 548 L 166 548 C 174 558 172 574 168 578 L 140 578 C 136 574 138 558 148 548 Z" fill={shoesColor} stroke={shoesAccent} strokeWidth="1" />
            {/* Khóa kim loại mui giày Loafer */}
            <rect x="146" y="558" width="16" height="3" rx="1" fill="#D4AF37" />
            <rect x="138" y="576" width="30" height="3" fill="#000000" opacity="0.4" />

            {/* Giày phải */}
            <path d="M 194 548 L 212 548 C 222 558 220 574 216 578 L 188 578 C 184 574 186 558 194 548 Z" fill={shoesColor} stroke={shoesAccent} strokeWidth="1" />
            {/* Khóa kim loại */}
            <rect x="194" y="558" width="16" height="3" rx="1" fill="#D4AF37" />
            <rect x="188" y="576" width="30" height="3" fill="#000000" opacity="0.4" />
          </g>
        )}

        {/* KIỂU 3: GIÀY BỐT CỔ CAO (BOOTS) */}
        {shoesType === 'boots' && (
          <g id="boots-shoes">
            {/* Bốt trái */}
            <path d="M 146 525 L 168 525 L 172 578 L 138 578 C 134 570 140 545 146 525 Z" fill={shoesColor} stroke={shoesAccent} strokeWidth="1" />
            <path d="M 157 525 L 157 555" stroke={shoesAccent} strokeWidth="1.5" opacity="0.6" />
            <rect x="136" y="574" width="36" height="5" fill="#000000" opacity="0.5" />

            {/* Bốt phải */}
            <path d="M 192 525 L 214 525 C 220 545 226 570 222 578 L 188 578 L 192 525 Z" fill={shoesColor} stroke={shoesAccent} strokeWidth="1" />
            <path d="M 203 525 L 203 555" stroke={shoesAccent} strokeWidth="1.5" opacity="0.6" />
            <rect x="188" y="574" width="36" height="5" fill="#000000" opacity="0.5" />
          </g>
        )}

        {/* KIỂU 4: GIÀY CAO GÓT MŨI NHỌN (NỮ) */}
        {shoesType === 'heels' && (
          <g id="high-heels">
            {/* Gót trái */}
            <path d="M 152 548 L 164 548 L 170 574 L 154 578 L 148 572 Z" fill={shoesColor} stroke={shoesAccent} strokeWidth="1" />
            <line x1="148" y1="572" x2="148" y2="584" stroke={shoesAccent} strokeWidth="2.5" />

            {/* Gót phải */}
            <path d="M 196 548 L 208 548 L 212 572 L 206 578 L 190 574 Z" fill={shoesColor} stroke={shoesAccent} strokeWidth="1" />
            <line x1="212" y1="572" x2="212" y2="584" stroke={shoesAccent} strokeWidth="2.5" />
          </g>
        )}
      </g>
    </svg>
  );
}
