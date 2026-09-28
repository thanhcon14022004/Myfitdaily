import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import StudioLookbookModel, { STUDIO_TEMPLATES } from './StudioLookbookModel';
import { 
  detectGarmentType, 
  detectGarmentColor, 
  detectGarmentPattern
} from '../utils/garmentClassifier';

/**
 * Danh sách Người Mẫu Thời Trang Studio (Lookbook chuẩn)
 */
const REAL_MODELS = [
  {
    id: 'male',
    gender: 'Nam',
    name: 'Mẫu Nam',
    heightStr: '1m78',
    baseImage: '/assets/fits/model_male_shirt_dark_896.jpg'
  },
  {
    id: 'female',
    gender: 'Nữ',
    name: 'Mẫu Nữ',
    heightStr: '1m65',
    baseImage: '/assets/fits/model_female_shirt_dark_896.jpg'
  }
];

export { STUDIO_TEMPLATES };

export default function VirtualMannequin({
  user = {},
  top = null,
  bottom = null,
  shoes = null,
  gender: propGender,
  compact = false
}) {
  const { text } = useLanguage();

  // Xác định giới tính
  const isUserMale = (user?.gender?.toLowerCase() === 'nam' ||
                      user?.gender?.toLowerCase() === 'male' ||
                      propGender?.toLowerCase() === 'nam' ||
                      propGender?.toLowerCase() === 'male');

  const [selectedGender, setSelectedGender] = useState(isUserMale ? 'Nam' : 'Nữ');

  useEffect(() => {
    setSelectedGender(isUserMale ? 'Nam' : 'Nữ');
  }, [isUserMale]);

  // Nhận diện loại đồ và màu sắc
  const detectedTopType = detectGarmentType(top, 'Tops');
  const detectedTopColorObj = detectGarmentColor(top);
  const detectedTopPattern = detectGarmentPattern(top);

  const detectedBottomType = detectGarmentType(bottom, 'Bottoms');
  const detectedBottomColorObj = detectGarmentColor(bottom);
  const detectedBottomPattern = detectGarmentPattern(bottom);

  const detectedShoesType = detectGarmentType(shoes, 'Shoes');
  const detectedShoesColorObj = detectGarmentColor(shoes);

  const activeModel = REAL_MODELS.find(m => m.gender === selectedGender) || REAL_MODELS[0];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '430px',
      margin: '0 auto',
      userSelect: 'none'
    }}>
      {/* THANH CHỌN GIỚI TÍNH */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: compact ? '290px' : '340px',
        marginBottom: '10px'
      }}>
        <div style={{
          display: 'inline-flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '3px',
          borderRadius: 12,
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
                  background: isSelected ? 'rgba(246, 207, 112, 0.22)' : 'transparent',
                  border: isSelected ? '1px solid #D4AF37' : '1px solid transparent',
                  color: isSelected ? '#FDE68A' : 'var(--text-muted)',
                  borderRadius: 9,
                  padding: '4px 14px',
                  fontSize: '0.72rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{m.gender === 'Nam' ? '👨 Nam' : '👩 Nữ'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SÂN KHẤU CANVAS NGƯỜI MẪU */}
      <div style={{
        position: 'relative',
        width: compact ? '290px' : '340px',
        aspectRatio: '896 / 1200',
        maxHeight: '560px',
        borderRadius: '22px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 25%, rgba(246, 207, 112, 0.08), transparent 65%), linear-gradient(180deg, #151821 0%, #0B0D13 100%)',
        border: '1.5px solid rgba(246, 207, 112, 0.25)',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.75)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* NGƯỜI MẪU STUDIO THỜI TRANG CHUẨN LOOKBOOK */}
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          <StudioLookbookModel
            gender={selectedGender}
            modelBaseImage={activeModel.baseImage}
            topItem={top}
            bottomItem={bottom}
            shoesItem={shoes}
            topType={detectedTopType}
            topColor={detectedTopColorObj?.hex || '#F8FAFC'}
            topPattern={detectedTopPattern}
            bottomType={detectedBottomType}
            bottomColor={detectedBottomColorObj?.hex || '#1E293B'}
            bottomPattern={detectedBottomPattern}
            shoesType={detectedShoesType}
            shoesColor={detectedShoesColorObj?.hex || '#F8FAFC'}
          />
        </div>
      </div>
    </div>
  );
}
