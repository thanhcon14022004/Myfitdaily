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

  // Kiểm tra phân loại áo đang chọn để hiển thị người mẫu mặc áo tương ứng
  const topName = (top?.name || '').toLowerCase();
  const isTankTop = topName.includes('ba lỗ') || topName.includes('tank') || top?.id === 201;
  const isShirt = topName.includes('sơ mi') || topName.includes('shirt') || topName.includes('thiết kế') || topName.includes('oxford') || top?.id === 205;
  const isSweat = topName.includes('sweatshirt') || topName.includes('frozen') || top?.id === 202;

  let currentModelImage = activeModel.sweatImage;
  if (isTankTop) {
    currentModelImage = activeModel.tankImage;
  } else if (isShirt) {
    currentModelImage = activeModel.shirtImage;
  } else if (isSweat) {
    currentModelImage = activeModel.sweatImage;
  }

  // Tự động nhận diện món đồ custom người dùng tải lên để apply dynamic overlay
  const isCustomTop = top && !isTankTop && !isShirt && !isSweat && top.imageUrl;

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
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.65)'
      }}>
        {/* Ảnh Người Mẫu Thật Mặc Quần Áo Đầy Đủ, Nét Căng */}
        <img
          key={currentModelImage}
          src={isCustomTop ? activeModel.tankImage : currentModelImage}
          alt={activeModel.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            transition: 'opacity 0.25s ease'
          }}
        />

        {/* Dynamic Garment Overlay cho bất kỳ món đồ custom nào người dùng tải lên */}
        {isCustomTop && (
          <div style={{
            position: 'absolute',
            top: selectedGender === 'Nam' ? '18%' : '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: selectedGender === 'Nam' ? '56%' : '52%',
            zIndex: 10,
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'center',
            filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.65)) drop-shadow(0 2px 6px rgba(0,0,0,0.4))'
          }}>
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
      </div>
    </div>
  );
}
