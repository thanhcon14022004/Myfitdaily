import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Danh sách Người Mẫu Thời Trang AI Người Thật (Bóc Nền Trong Suốt)
 * Hòa quyện hoàn toàn vào nền tối sang trọng của MyFitDaily
 */
const REAL_MODELS = [
  {
    id: 'male',
    gender: 'Nam',
    name: 'Mẫu Nam',
    heightStr: '1m78',
    defaultImage: '/assets/fits/model_male_sweat_cream_clean.png',
    defaultFallback: '/assets/fits/model_male_sweat_cream.jpg',
    tankImage: '/assets/fits/model_male_tank_cream_clean.png',
    tankFallback: '/assets/fits/model_male_tank_cream.jpg',
    sweatImage: '/assets/fits/model_male_sweat_cream_clean.png',
    sweatFallback: '/assets/fits/model_male_sweat_cream.jpg'
  },
  {
    id: 'female',
    gender: 'Nữ',
    name: 'Mẫu Nữ',
    heightStr: '1m65',
    defaultImage: '/assets/fits/model_female_clean.png',
    defaultFallback: '/assets/fits/fits_female_model.jpg',
    tankImage: '/assets/fits/model_female_clean.png',
    tankFallback: '/assets/fits/fits_female_model.jpg',
    sweatImage: '/assets/fits/model_female_clean.png',
    sweatFallback: '/assets/fits/fits_female_model.jpg'
  }
];

export default function VirtualMannequin({
  user = {},
  top = null,
  bottom = null,
  shoes = null,
  gender: propGender,
  compact = false
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

  // Quyết định ảnh hiển thị dựa trên món đồ người dùng chọn
  const isTankTop = top?.name?.toLowerCase().includes('ba lỗ') || 
                    top?.name?.toLowerCase().includes('tank') ||
                    top?.id === 201;

  const currentModelImage = isTankTop ? activeModel.tankImage : activeModel.sweatImage;
  const currentModelFallback = isTankTop ? activeModel.tankFallback : activeModel.sweatFallback;

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

      {/* 2. SÂN KHẤU NGƯỜI MẪU THẬT - TỰ ĐỘNG THAY ĐỒ VỪA KHÍT KHI CHỌN */}
      <div style={{
        position: 'relative',
        width: compact ? '290px' : '340px',
        height: compact ? '480px' : '540px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Ánh sáng Spotlight nhẹ từ trên đỉnh */}
        <div style={{
          position: 'absolute',
          top: '-15px',
          width: '260px',
          height: '140px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.22) 0%, rgba(212, 175, 55, 0.05) 55%, transparent 80%)',
          filter: 'blur(20px)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        {/* Bóng đổ tự nhiên trên mặt sàn tối */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          width: '220px',
          height: '35px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.85) 0%, rgba(212, 175, 55, 0.2) 45%, transparent 75%)',
          filter: 'blur(10px)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Ảnh Người Mẫu Thật Mặc Đồ Tương Ứng Đã Bóc Nền Sạch Sẽ */}
        <img
          key={currentModelImage}
          src={currentModelImage}
          alt={activeModel.name}
          onError={(e) => {
            if (e.target.src !== currentModelFallback) {
              e.target.src = currentModelFallback;
            }
          }}
          style={{
            position: 'relative',
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            zIndex: 2,
            filter: 'drop-shadow(0 15px 35px rgba(0, 0, 0, 0.75))',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            animation: 'fadeIn 0.3s ease'
          }}
        />
      </div>
    </div>
  );
}
