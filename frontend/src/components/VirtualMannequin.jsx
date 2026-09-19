import React, { useState, useEffect } from 'react';
import { Sparkles, UserCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Danh sách Người Mẫu Thời Trang AI Người Thật (Bóc Nền Trong Suốt)
 * Hòa quyện hoàn toàn vào nền tối sang trọng của MyFitDaily
 */
const REAL_MODELS = [
  {
    id: 'male_streetwear',
    gender: 'Nam',
    name: 'Người Mẫu Nam (Dáng Thể Thao)',
    image: '/assets/fits/model_male_cutout.png',
    fallback: '/assets/fits/fits_male_streetwear.jpg',
    heightStr: '1m78',
    description: 'Dáng đứng thẳng tự nhiên, hai tay buông lơi linh hoạt, vai mở rộng'
  },
  {
    id: 'female_chic',
    gender: 'Nữ',
    name: 'Người Mẫu Nữ (Dáng Thanh Lịch)',
    image: '/assets/fits/model_female_cutout.png',
    fallback: '/assets/fits/fits_female_model.jpg',
    heightStr: '1m65',
    description: 'Dáng đứng mềm mại, bờ vai và cánh tay tự nhiên chuẩn lookbook'
  }
];

export default function VirtualMannequin({
  user = {},
  top = null,
  topItem = null,
  outer = null,
  outerwearItem = null,
  bottom = null,
  bottomItem = null,
  shoes = null,
  shoesItem = null,
  accessory = null,
  gender: propGender,
  showControls = true,
  interactive = true,
  compact = false
}) {
  const { text } = useLanguage();
  const resolvedTop = top || topItem;
  const resolvedOuter = outer || outerwearItem;
  const resolvedBottom = bottom || bottomItem;
  const resolvedShoes = shoes || shoesItem;

  // Xác định giới tính người dùng để chọn người mẫu phù hợp
  const isUserMale = (user?.gender?.toLowerCase() === 'nam' ||
                      user?.gender?.toLowerCase() === 'male' ||
                      propGender?.toLowerCase() === 'nam' ||
                      propGender?.toLowerCase() === 'male');

  const [selectedModelId, setSelectedModelId] = useState(
    isUserMale ? 'male_streetwear' : 'female_chic'
  );

  useEffect(() => {
    setSelectedModelId(isUserMale ? 'male_streetwear' : 'female_chic');
  }, [isUserMale]);

  const activeModel = REAL_MODELS.find(m => m.id === selectedModelId) || REAL_MODELS[0];

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
        marginBottom: '16px',
        background: 'rgba(255, 255, 255, 0.04)',
        padding: '3px 6px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {REAL_MODELS.map(m => {
          const isSelected = m.id === selectedModelId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedModelId(m.id)}
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
              <span>{m.gender === 'Nam' ? 'Mẫu Nam' : 'Mẫu Nữ'} ({m.heightStr})</span>
            </button>
          );
        })}
      </div>

      {/* 2. SÂN KHẤU NGƯỜI MẪU THẬT - BÓC NỀN TRONG SUỐT HOÀN TOÀN, KHÔNG PHÔNG HỘP CHỮ NHẬT */}
      <div style={{
        position: 'relative',
        width: compact ? '290px' : '340px',
        height: compact ? '480px' : '540px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Ánh sáng Spotlight sân khấu từ đỉnh rọi xuống */}
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

        {/* Bóng đổ chân thực trên mặt sàn Showroom tối */}
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

        {/* Ảnh Người Mẫu Thật Đã Bóc Nền Sạch Sẽ (Transparent Cutout) */}
        <img
          src={activeModel.image}
          alt={activeModel.name}
          onError={(e) => {
            // Fallback sang ảnh gốc nếu trình duyệt chưa load kịp ảnh png
            if (e.target.src !== activeModel.fallback) {
              e.target.src = activeModel.fallback;
            }
          }}
          style={{
            position: 'relative',
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            zIndex: 2,
            filter: 'drop-shadow(0 15px 35px rgba(0, 0, 0, 0.75))',
            transition: 'opacity 0.3s ease, transform 0.3s ease'
          }}
        />
      </div>
    </div>
  );
}
