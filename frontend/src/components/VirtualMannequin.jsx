import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Danh sách Người Mẫu Thời Trang AI Người Thật
 * Phông nền đen studio sang trọng, hòa quyện hoàn hảo vào giao diện MyFitDaily
 */
const REAL_MODELS = [
  {
    id: 'male',
    gender: 'Nam',
    name: 'Mẫu Nam',
    heightStr: '1m78',
    sweatImage: '/assets/fits/model_male_sweat_dark.jpg',
    tankImage: '/assets/fits/model_male_tank_dark.jpg',
    shirtImage: '/assets/fits/model_male_shirt_dark.jpg'
  },
  {
    id: 'female',
    gender: 'Nữ',
    name: 'Mẫu Nữ',
    heightStr: '1m65',
    sweatImage: '/assets/fits/model_female_sweat_dark.jpg',
    tankImage: '/assets/fits/model_female_tank_dark.jpg',
    shirtImage: '/assets/fits/model_female_shirt_dark.jpg'
  }
];

export default function VirtualMannequin({
  user = {},
  top = null,
  bottom = null,
  shoes = null,
  gender: propGender,
  compact = false,
  isAiProcessing = false,
  aiGeneratedModelImage = null
}) {
  const { text } = useLanguage();

  // Xác định giới tính người dùng
  const isUserMale = (user?.gender?.toLowerCase() === 'nam' ||
                      user?.gender?.toLowerCase() === 'male' ||
                      propGender?.toLowerCase() === 'nam' ||
                      propGender?.toLowerCase() === 'male');

  const [selectedGender, setSelectedGender] = useState(isUserMale ? 'Nam' : 'Nữ');

  useEffect(() => {
    setSelectedGender(isUserMale ? 'Nam' : 'Nữ');
  }, [isUserMale]);

  const activeModel = REAL_MODELS.find(m => m.gender === selectedGender) || REAL_MODELS[0];

  // Micro-adjustment cho trang phục tự thêm vào tủ đồ
  const [adjustTopY, setAdjustTopY] = useState(0);
  const [scaleTop, setScaleTop] = useState(1);
  const [showAdjustControls, setShowAdjustControls] = useState(false);

  // Kiểm tra phân loại áo: Chỉ 3 item ID preset mẫu chuẩn mới dùng ảnh chụp sẵn tĩnh
  const isTankTop = top?.id === 201 || (top?.imageUrl && top.imageUrl.includes('coolmate-tank-top.png'));
  const isSweat = top?.id === 202 || (top?.imageUrl && top.imageUrl.includes('frozen-sweatshirt.png'));
  const isShirt = top?.id === 205 || (top?.imageUrl && top.imageUrl.includes('navy-shirt-essential.png'));

  let currentModelImage = activeModel.sweatImage;
  if (isTankTop) {
    currentModelImage = activeModel.tankImage;
  } else if (isShirt) {
    currentModelImage = activeModel.shirtImage;
  } else if (isSweat) {
    currentModelImage = activeModel.sweatImage;
  }

  // Bất kỳ món áo nào khác (người dùng tự thêm vào tủ đồ) đều là custom top -> Áp dụng Dynamic 2D Garment Overlay
  const isCustomTop = Boolean(top && !isTankTop && !isShirt && !isSweat && top.imageUrl);

  // Quần preset là 203 (Quần suông cream)
  const isCreamPants = bottom?.id === 203 || (bottom?.imageUrl && bottom.imageUrl.includes('cream-relaxed-pants.png'));
  const isCustomBottom = Boolean(bottom && !isCreamPants && bottom.imageUrl);

  // Giày preset là 204 (Sneaker retro)
  const isRetroSneaker = shoes?.id === 204 || (shoes?.imageUrl && shoes.imageUrl.includes('retro-sneakers.png'));
  const isCustomShoes = Boolean(shoes && !isRetroSneaker && shoes.imageUrl);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '420px',
      margin: '0 auto',
      userSelect: 'none'
    }}>
      {/* 1. CHUYỂN ĐỔI NGƯỜI MẪU NAM / NỮ GỌN GÀNG TINH TẾ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '14px',
        background: 'rgba(255, 255, 255, 0.04)',
        padding: '3px 6px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {REAL_MODELS.map(m => {
          const isSelected = m.gender === selectedGender;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedGender(m.gender)}
              style={{
                background: isSelected 
                  ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(194, 125, 94, 0.3))' 
                  : 'transparent',
                border: isSelected ? '1px solid #D4AF37' : '1px solid transparent',
                color: isSelected ? '#FDE68A' : 'var(--text-muted)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 14px',
                fontSize: '0.74rem',
                fontWeight: isSelected ? 800 : 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{m.gender === 'Nam' ? '👨' : '👩'}</span>
              <span>{m.name} ({m.heightStr})</span>
            </button>
          );
        })}
      </div>

      {/* 2. SÂN KHẤU NGƯỜI MẪU THẬT - QUẦN ÁO NGUYÊN VẸN, KHÔNG BỊ RÁCH / LỖI PHÔNG */}
      <div style={{
        position: 'relative',
        width: compact ? '290px' : '340px',
        height: compact ? '480px' : '540px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: isAiProcessing 
          ? '0 0 35px rgba(246, 207, 112, 0.45), 0 20px 45px rgba(0, 0, 0, 0.75)' 
          : '0 20px 45px rgba(0, 0, 0, 0.65)',
        border: isAiProcessing ? '1.5px solid #f6cf70' : '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.3s ease'
      }}>
        {/* Ảnh Người Mẫu: Ưu tiên ảnh do AI Diffusion tạo ra nếu có */}
        <img
          key={aiGeneratedModelImage || currentModelImage}
          src={aiGeneratedModelImage || (isCustomTop ? activeModel.tankImage : currentModelImage)}
          alt={activeModel.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            transition: 'opacity 0.25s ease'
          }}
        />

        {/* Dynamic Garment Overlay - ÁO CUSTOM */}
        {isCustomTop && !aiGeneratedModelImage && (
          <div
            style={{
              position: 'absolute',
              top: `calc(${selectedGender === 'Nam' ? '18%' : '20%'} + ${adjustTopY}px)`,
              left: '50%',
              transform: `translateX(-50%) scale(${scaleTop})`,
              transformOrigin: 'top center',
              width: selectedGender === 'Nam' ? '56%' : '52%',
              zIndex: 10,
              pointerEvents: 'none',
              display: 'flex',
              justifyContent: 'center',
              filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.75)) drop-shadow(0 3px 8px rgba(0,0,0,0.45)) contrast(1.04)',
              transition: 'transform 0.15s ease, top 0.15s ease'
            }}
          >
            <img
              src={top.imageUrl}
              alt={top.name}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
        )}

        {/* Dynamic Garment Overlay - QUẦN CUSTOM */}
        {isCustomBottom && !aiGeneratedModelImage && (
          <div style={{
            position: 'absolute',
            top: selectedGender === 'Nam' ? '46%' : '48%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: selectedGender === 'Nam' ? '54%' : '50%',
            zIndex: 9,
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'center',
            filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.75)) contrast(1.04)'
          }}>
            <img
              src={bottom.imageUrl}
              alt={bottom.name}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
        )}

        {/* Dynamic Garment Overlay - GIÀY CUSTOM */}
        {isCustomShoes && !aiGeneratedModelImage && (
          <div style={{
            position: 'absolute',
            top: '88%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '46%',
            zIndex: 11,
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'center',
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.7))'
          }}>
            <img
              src={shoes.imageUrl}
              alt={shoes.name}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
        )}

        {/* AI Generated Badge */}
        {aiGeneratedModelImage && (
          <div style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: 'linear-gradient(135deg, rgba(246, 207, 112, 0.95), rgba(200, 149, 54, 0.95))',
            color: '#12151f',
            fontSize: '0.68rem',
            fontWeight: 900,
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            letterSpacing: '0.04em',
            zIndex: 15,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            boxShadow: '0 4px 14px rgba(0,0,0,0.6)'
          }}>
            <span>✨ Gemini Imagen AI Render</span>
          </div>
        )}

        {/* Dynamic Fit Indicator Badge */}
        {(isCustomTop || isCustomBottom || isCustomShoes) && !aiGeneratedModelImage && (
          <div style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(246, 207, 112, 0.4)',
            color: '#f6cf70',
            fontSize: '0.68rem',
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            letterSpacing: '0.04em',
            zIndex: 15,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            <span>✨ 2D Dynamic Fit</span>
          </div>
        )}

        {/* Nút bật tắt tinh chỉnh vị trí áo (khi mặc áo custom) */}
        {isCustomTop && !aiGeneratedModelImage && (
          <div style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            zIndex: 15
          }}>
            <button
              type="button"
              onClick={() => setShowAdjustControls(!showAdjustControls)}
              title="Căn chỉnh vị trí & kích cỡ áo"
              style={{
                background: showAdjustControls ? '#f6cf70' : 'rgba(0,0,0,0.65)',
                color: showAdjustControls ? '#17130a' : '#fff',
                border: '1px solid rgba(246,207,112,0.4)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              ⚙️ Căn chỉnh áo
            </button>
          </div>
        )}

        {/* Thanh công cụ tinh chỉnh vị trí Y và Scale áo */}
        {isCustomTop && showAdjustControls && !aiGeneratedModelImage && (
          <div style={{
            position: 'absolute',
            bottom: 44,
            left: 12,
            right: 12,
            background: 'rgba(15, 18, 26, 0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(246, 207, 112, 0.35)',
            borderRadius: 12,
            padding: '10px 14px',
            zIndex: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#f6cf70', fontWeight: 800 }}>CĂN CHỈNH FORM ÁO</span>
              <button
                type="button"
                onClick={() => { setAdjustTopY(0); setScaleTop(1); }}
                style={{
                  background: 'transparent',
                  border: 0,
                  color: 'var(--text-muted)',
                  fontSize: '0.68rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Mặc định
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.7rem' }}>
              <span style={{ minWidth: 50, color: 'var(--text-secondary)' }}>Vị trí:</span>
              <input
                type="range"
                min="-30"
                max="30"
                value={adjustTopY}
                onChange={(e) => setAdjustTopY(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#f6cf70', cursor: 'pointer' }}
              />
              <span style={{ minWidth: 32, textAlign: 'right', color: '#fff' }}>{adjustTopY}px</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.7rem' }}>
              <span style={{ minWidth: 50, color: 'var(--text-secondary)' }}>Kích cỡ:</span>
              <input
                type="range"
                min="0.8"
                max="1.25"
                step="0.02"
                value={scaleTop}
                onChange={(e) => setScaleTop(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#f6cf70', cursor: 'pointer' }}
              />
              <span style={{ minWidth: 32, textAlign: 'right', color: '#fff' }}>{Math.round(scaleTop * 100)}%</span>
            </div>
          </div>
        )}

        {/* Hiệu ứng quét tia Laser AI Scanner khi bấm Thử đồ AI */}
        {isAiProcessing && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 30%, rgba(246, 207, 112, 0.18) 50%, rgba(246, 207, 112, 0.45) 51%, transparent 55%)',
            animation: 'aiScannerMove 1.5s infinite linear',
            pointerEvents: 'none',
            zIndex: 20
          }} />
        )}

        <style>{`
          @keyframes aiScannerMove {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
        `}</style>
      </div>
    </div>
  );
}
