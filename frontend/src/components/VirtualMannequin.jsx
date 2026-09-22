import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Smartphone, UserRound, Sparkles, Check, Shirt, Scissors, Footprints } from 'lucide-react';

/**
 * Danh sách Người Mẫu Thời Trang Studio (Lookbook chuẩn)
 */
const REAL_MODELS = [
  {
    id: 'male',
    gender: 'Nam',
    name: 'Mẫu Nam',
    heightStr: '1m78',
    sweatImage: '/assets/fits/model_male_sweat_dark.jpg',
    tankImage: '/assets/fits/model_male_tank_dark.jpg',
    shirtImage: '/assets/fits/model_male_shirt_dark.jpg',
    pantsImage: '/assets/fits/model_male_pants_dark.jpg',
    mannequinImage: '/assets/mannequin_male.png'
  },
  {
    id: 'female',
    gender: 'Nữ',
    name: 'Mẫu Nữ',
    heightStr: '1m65',
    sweatImage: '/assets/fits/model_female_sweat_dark.jpg',
    tankImage: '/assets/fits/model_female_tank_dark.jpg',
    shirtImage: '/assets/fits/model_female_shirt_dark.jpg',
    pantsImage: '/assets/fits/model_female_pants_dark.jpg',
    mannequinImage: '/assets/mannequin_female.png'
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

  // Xác định giới tính
  const isUserMale = (user?.gender?.toLowerCase() === 'nam' ||
                      user?.gender?.toLowerCase() === 'male' ||
                      propGender?.toLowerCase() === 'nam' ||
                      propGender?.toLowerCase() === 'male');

  const [selectedGender, setSelectedGender] = useState(isUserMale ? 'Nam' : 'Nữ');
  // Chế độ hiển thị: 'fits' (Chuẩn app Fits: hiển thị trực tiếp đồ thật) hoặc 'model' (Mẫu studio lookbook)
  const [viewMode, setViewMode] = useState('fits');

  useEffect(() => {
    setSelectedGender(isUserMale ? 'Nam' : 'Nữ');
  }, [isUserMale]);

  const activeModel = REAL_MODELS.find(m => m.gender === selectedGender) || REAL_MODELS[0];

  // Nhận diện phân loại áo preset
  const isTankTop = top?.id === 201 || (top?.imageUrl && top.imageUrl.includes('coolmate-tank-top.png'));
  const isSweat = top?.id === 202 || (top?.imageUrl && top.imageUrl.includes('frozen-sweatshirt.png'));
  const isShirt = top?.id === 205 || (top?.imageUrl && top.imageUrl.includes('navy-shirt-essential.png'));

  // Nhận diện phân loại quần
  const bottomName = (bottom?.name || '').toLowerCase();
  const isBlackPants = bottomName.includes('đen') || 
                       bottomName.includes('tây') || 
                       (bottom?.imageUrl && bottom.imageUrl.includes('media_1790076823583'));

  // Trong chế độ Model: Chọn ảnh mẫu nền theo ÁO trước, tuyệt đối không bị đè bởi áo sơ mi trắng ngẫu nhiên
  let studioModelBase = activeModel.sweatImage;
  if (isTankTop) {
    studioModelBase = activeModel.tankImage;
  } else if (isShirt) {
    studioModelBase = activeModel.shirtImage;
  } else if (isSweat) {
    studioModelBase = activeModel.sweatImage;
  } else if (top?.imageUrl) {
    studioModelBase = activeModel.tankImage; // Làm phôi để đè áo custom lên
  }

  const isCustomTop = Boolean(top && !isTankTop && !isShirt && !isSweat && top.imageUrl);

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
      {/* THANH ĐIỀU HƯỚNG CHỌN CHẾ ĐỘ: FITS APP VS MẪU STUDIO & GIỚI TÍNH */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: compact ? '290px' : '340px',
        marginBottom: '12px',
        gap: 8,
        flexWrap: 'wrap'
      }}>
        {/* Toggle Chế Độ Hiển Thị */}
        <div style={{
          display: 'inline-flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '3px',
          borderRadius: 10,
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            type="button"
            onClick={() => setViewMode('fits')}
            style={{
              background: viewMode === 'fits' ? 'linear-gradient(135deg, #f6cf70, #c89536)' : 'transparent',
              color: viewMode === 'fits' ? '#17130a' : 'var(--text-muted)',
              border: 0,
              borderRadius: 8,
              padding: '4px 10px',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              transition: 'all 0.2s ease'
            }}
          >
            <Smartphone size={12} />
            <span>Kiểu Fits App</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('model')}
            style={{
              background: viewMode === 'model' ? 'linear-gradient(135deg, #f6cf70, #c89536)' : 'transparent',
              color: viewMode === 'model' ? '#17130a' : 'var(--text-muted)',
              border: 0,
              borderRadius: 8,
              padding: '4px 10px',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              transition: 'all 0.2s ease'
            }}
          >
            <UserRound size={12} />
            <span>Mẫu Studio</span>
          </button>
        </div>

        {/* Toggle Giới Tính */}
        <div style={{
          display: 'inline-flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '3px',
          borderRadius: 10,
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
                  background: isSelected ? 'rgba(246, 207, 112, 0.2)' : 'transparent',
                  border: isSelected ? '1px solid #D4AF37' : '1px solid transparent',
                  color: isSelected ? '#FDE68A' : 'var(--text-muted)',
                  borderRadius: 8,
                  padding: '3px 9px',
                  fontSize: '0.7rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{m.gender === 'Nam' ? '👨 Nam' : '👩 Nữ'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SÂN KHẤU CANVAS PHỐI ĐỒ CHUẨN FITS APP */}
      <div style={{
        position: 'relative',
        width: compact ? '290px' : '340px',
        height: compact ? '480px' : '540px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 20%, rgba(246, 207, 112, 0.07), transparent 60%), linear-gradient(180deg, #151821 0%, #0d0f14 100%)',
        border: '1px solid rgba(246, 207, 112, 0.2)',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* BADGE GÓC TRÊN */}
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
          padding: '3px 9px',
          borderRadius: 'var(--radius-full)',
          letterSpacing: '0.04em',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}>
          <Sparkles size={11} />
          <span>{viewMode === 'fits' ? '✨ Bàn Phối Đồ Chuẩn Fits' : '✨ Người Mẫu Studio 8K'}</span>
        </div>

        {/* ======================================================== */}
        {/* CHẾ ĐỘ 1: FITS DIGITAL CANVAS (ĐỒ THẬT CHUẨN XÁC 100%, 0MS DELAY) */}
        {/* ======================================================== */}
        {viewMode === 'fits' && (
          <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {/* Khung silhouette ma-nơ-canh mờ tối giản phía sau tạo form người mẫu thanh lịch */}
            <img
              src={activeModel.mannequinImage}
              alt="Mannequin Silhouette"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                height: '92%',
                objectFit: 'contain',
                opacity: 0.16,
                filter: 'grayscale(1) contrast(1.1) brightness(1.2)',
                pointerEvents: 'none',
                zIndex: 1
              }}
            />

            {/* 1. SLOT ÁO (TOP) */}
            <div style={{
              position: 'absolute',
              top: '9%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '64%',
              height: '38%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              transition: 'all 0.2s ease'
            }}>
              {top?.imageUrl ? (
                <img
                  src={top.imageUrl}
                  alt={top.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.75)) contrast(1.03)',
                    transition: 'transform 0.2s ease'
                  }}
                />
              ) : (
                <div style={{
                  border: '1.5px dashed rgba(255,255,255,0.18)',
                  borderRadius: 12,
                  padding: '12px 18px',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <Shirt size={14} /> + Chọn Áo
                </div>
              )}
            </div>

            {/* 2. SLOT QUẦN (BOTTOM) */}
            <div style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '52%',
              height: '46%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9,
              transition: 'all 0.2s ease'
            }}>
              {bottom?.imageUrl ? (
                <img
                  src={bottom.imageUrl}
                  alt={bottom.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.75)) contrast(1.03)',
                    transition: 'transform 0.2s ease'
                  }}
                />
              ) : (
                <div style={{
                  border: '1.5px dashed rgba(255,255,255,0.18)',
                  borderRadius: 12,
                  padding: '12px 18px',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <Scissors size={14} /> + Chọn Quần
                </div>
              )}
            </div>

            {/* 3. SLOT GIÀY (SHOES) */}
            <div style={{
              position: 'absolute',
              bottom: '4%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '46%',
              height: '18%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 11,
              transition: 'all 0.2s ease'
            }}>
              {shoes?.imageUrl ? (
                <img
                  src={shoes.imageUrl}
                  alt={shoes.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.8))',
                    transition: 'transform 0.2s ease'
                  }}
                />
              ) : (
                <div style={{
                  border: '1.5px dashed rgba(255,255,255,0.18)',
                  borderRadius: 12,
                  padding: '8px 14px',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}>
                  <Footprints size={13} /> + Chọn Giày
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* CHẾ ĐỘ 2: NGƯỜI MẪU STUDIO LOOKBOOK (CHUẨN FORM THEO ÁO) */}
        {/* ======================================================== */}
        {viewMode === 'model' && (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Ảnh người mẫu thật chuẩn theo món Áo đang chọn */}
            <img
              src={studioModelBase}
              alt={activeModel.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top'
              }}
            />

            {/* Nếu là áo custom của người dùng tải lên */}
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
                filter: 'drop-shadow(0 14px 24px rgba(0,0,0,0.75)) contrast(1.04)'
              }}>
                <img
                  src={top.imageUrl}
                  alt={top.name}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>
            )}

            {/* Nếu người dùng chọn quần đen: Phủ quần đen lên chân người mẫu (thay vì đổi áo sang sơ mi trắng) */}
            {isBlackPants && bottom?.imageUrl && (
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
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
