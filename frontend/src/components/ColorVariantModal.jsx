import React, { useState, useMemo } from 'react';
import { X, Sparkles, Check, CheckCheck, Palette, Plus, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const FASHION_COLOR_PALETTE = [
  { 
    name: 'Đen', 
    labelVi: 'Đen Tuyển', 
    labelEn: 'Deep Black', 
    hex: '#111827', 
    border: '#4B5563',
    textColor: '#FFFFFF'
  },
  { 
    name: 'Trắng', 
    labelVi: 'Trắng Tinh Khôi', 
    labelEn: 'Clean White', 
    hex: '#FFFFFF', 
    border: '#CBD5E1',
    textColor: '#0F172A'
  },
  { 
    name: 'Xanh Navy', 
    labelVi: 'Xanh Navy Lịch Lãm', 
    labelEn: 'Navy Blue', 
    hex: '#1E3A8A', 
    border: '#3B82F6',
    textColor: '#FFFFFF'
  },
  { 
    name: 'Xanh Nhạt', 
    labelVi: 'Xanh Nhạt Pastel', 
    labelEn: 'Light Pastel Blue', 
    hex: '#93C5FD', 
    border: '#60A5FA',
    textColor: '#0F172A'
  },
  { 
    name: 'Xám Ghi', 
    labelVi: 'Xám Ghi Trung Tính', 
    labelEn: 'Charcoal Grey', 
    hex: '#64748B', 
    border: '#94A3B8',
    textColor: '#FFFFFF'
  },
  { 
    name: 'Be Cát', 
    labelVi: 'Be Cát / Kem', 
    labelEn: 'Beige / Cream', 
    hex: '#EADBC8', 
    border: '#D97706',
    textColor: '#0F172A'
  },
  { 
    name: 'Nâu Tây', 
    labelVi: 'Nâu Tây / Mocha', 
    labelEn: 'Mocha Brown', 
    hex: '#78350F', 
    border: '#B45309',
    textColor: '#FFFFFF'
  },
  { 
    name: 'Xanh Rêu', 
    labelVi: 'Xanh Rêu / Olive', 
    labelEn: 'Olive Green', 
    hex: '#3F6212', 
    border: '#65A30D',
    textColor: '#FFFFFF'
  }
];

// Helper tìm ảnh phù hợp theo Danh mục + Màu sắc
export function resolveVariantImage(categoryId, colorName, currentImage = '') {
  const cat = Number(categoryId);
  const colorNorm = (colorName || '').toLowerCase();

  // 1. ÁO (TOPS)
  if (cat === 1 || cat === 4) {
    if (colorNorm.includes('trang') || colorNorm.includes('white')) {
      return '/assets/clothes/tshirt_basic_white.jpg';
    }
    if (colorNorm.includes('den') || colorNorm.includes('black')) {
      return '/assets/clothes/polo_pique_black.jpg';
    }
    if (colorNorm.includes('navy')) {
      return '/assets/clothes/sweatshirt_frozen_navy.png';
    }
    if (colorNorm.includes('xanh') || colorNorm.includes('blue')) {
      return '/assets/clothes/shirt_oxford_light_blue.jpg';
    }
    if (colorNorm.includes('xam') || colorNorm.includes('grey')) {
      return '/assets/clothes/tshirt_graphic_grey.jpg';
    }
    if (colorNorm.includes('be') || colorNorm.includes('kem') || colorNorm.includes('cream')) {
      return '/assets/clothes/polo_pazzin_beige.png';
    }
    return currentImage || '/assets/clothes/tshirt_basic_white.jpg';
  }

  // 2. QUẦN & VÁY (BOTTOMS)
  if (cat === 2 || cat === 3) {
    if (colorNorm.includes('den') || colorNorm.includes('black')) {
      return '/assets/clothes/pants_trousers_black.jpg';
    }
    if (colorNorm.includes('xam') || colorNorm.includes('grey')) {
      return '/assets/clothes/trousers_pleated_grey.png';
    }
    if (colorNorm.includes('be') || colorNorm.includes('kem') || colorNorm.includes('cream')) {
      return '/assets/clothes/pants_wide_beige.jpg';
    }
    if (colorNorm.includes('navy')) {
      return '/assets/clothes/pants_trousers_navy.jpg';
    }
    if (colorNorm.includes('xanh') || colorNorm.includes('jean') || colorNorm.includes('denim')) {
      return '/assets/clothes/jeans_vintage_blue.jpg';
    }
    return currentImage || '/assets/clothes/pants_trousers_black.jpg';
  }

  // 3. GIÀY (SHOES)
  if (cat === 5) {
    if (colorNorm.includes('den') || colorNorm.includes('black')) {
      return '/assets/clothes/shoes_penny_loafer_black.jpg';
    }
    if (colorNorm.includes('trang') || colorNorm.includes('white')) {
      return '/assets/clothes/shoes_sneaker_white_real.jpg';
    }
    if (colorNorm.includes('xam') || colorNorm.includes('grey')) {
      return '/assets/clothes/shoes_sneaker_grey_white.jpg';
    }
    return currentImage || '/assets/clothes/shoes_sneaker_white_real.jpg';
  }

  return currentImage;
}

export default function ColorVariantModal({
  isOpen,
  onClose,
  sourceItem,
  existingClothes = [],
  onAddVariants
}) {
  const { text } = useLanguage();
  const { isLight } = useTheme();

  const [selectedColors, setSelectedColors] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [successCount, setSuccessCount] = useState(null);

  // Chuẩn hóa tên để so sánh màu sắc
  const normalizeStr = (v = '') => String(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');

  // Xác định màu gốc của món đồ hiện tại
  const sourceColor = useMemo(() => {
    if (!sourceItem) return '';
    return sourceItem.color || '';
  }, [sourceItem]);

  // Kiểm tra màu nào đã có trong tủ đồ (cùng phom dáng / category)
  const existingColorSet = useMemo(() => {
    if (!sourceItem) return new Set();
    const set = new Set();
    const sourceBaseName = normalizeStr(sourceItem.name)
      .replace(/\b(den|trang|navy|xanh navy|xanh nhat|xam|ghi|be|kem|nau|reu|black|white|blue|grey|beige|brown)\b/g, '')
      .trim();

    existingClothes.forEach(c => {
      if (Number(c.categoryId) === Number(sourceItem.categoryId)) {
        const cColor = normalizeStr(c.color || '');
        const cName = normalizeStr(c.name || '');
        if (cColor) set.add(cColor);
        FASHION_COLOR_PALETTE.forEach(pal => {
          const palNorm = normalizeStr(pal.name);
          if (cName.includes(palNorm) || cColor.includes(palNorm)) {
            set.add(palNorm);
          }
        });
      }
    });

    // Thêm chính màu của sourceItem
    if (sourceColor) {
      set.add(normalizeStr(sourceColor));
    }
    return set;
  }, [sourceItem, existingClothes, sourceColor]);

  // Chọn / bỏ chọn màu
  const toggleColor = (color) => {
    const key = color.name;
    if (selectedColors.includes(key)) {
      setSelectedColors(prev => prev.filter(c => c !== key));
    } else {
      setSelectedColors(prev => [...prev, key]);
    }
  };

  // Chọn tất cả màu chưa có
  const selectAllMissing = () => {
    const missing = FASHION_COLOR_PALETTE
      .filter(c => !existingColorSet.has(normalizeStr(c.name)))
      .map(c => c.name);
    setSelectedColors(missing);
  };

  // Xử lý gen màu
  const handleGenerate = async () => {
    if (!sourceItem || selectedColors.length === 0) return;
    setIsGenerating(true);

    try {
      // Làm sạch tên gốc để loại bỏ màu cũ (ví dụ "Áo Sơ Mi Đen Slim-Fit" -> "Áo Sơ Mi Slim-Fit")
      const baseCleanName = sourceItem.name
        .replace(/\s*\b(Đen|Trắng|Xanh Navy|Xanh Nhạt|Xám Ghi|Xám|Be Cát|Be|Kem|Nâu Tây|Nâu|Xanh Rêu|Black|White|Navy|Blue|Grey|Beige)\b\s*/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const newVariants = selectedColors.map((colorName, idx) => {
        const pal = FASHION_COLOR_PALETTE.find(p => p.name === colorName);
        const resolvedImg = resolveVariantImage(sourceItem.categoryId, colorName, sourceItem.imageUrl);

        return {
          id: Date.now() + idx + Math.floor(Math.random() * 1000),
          name: `${baseCleanName} ${pal ? pal.name : colorName}`,
          categoryId: sourceItem.categoryId,
          categoryName: sourceItem.categoryName || (sourceItem.categoryId === 1 ? 'Tops' : sourceItem.categoryId === 2 ? 'Bottoms' : 'Shoes'),
          price: sourceItem.price || 299000,
          priceFormatted: sourceItem.priceFormatted || '299K',
          platform: sourceItem.platform || 'MyFitDaily Studio',
          isAffiliate: false,
          color: pal ? pal.name : colorName,
          style: sourceItem.style || 'Smart Casual',
          season: sourceItem.season || 'AllSeason',
          brand: sourceItem.brand || 'STUDIO EDIT',
          imageUrl: resolvedImg,
          description: `${baseCleanName} phiên bản màu ${pal ? pal.name : colorName} thanh lịch, chất vải cao cấp giữ phom chuẩn.`
        };
      });

      await onAddVariants?.(newVariants);
      setSuccessCount(newVariants.length);
      setTimeout(() => {
        setSuccessCount(null);
        setSelectedColors([]);
        onClose?.();
      }, 1600);
    } catch (err) {
      console.error('Lỗi khi gen màu:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen || !sourceItem) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 16
    }}>
      <div style={{
        background: isLight ? '#FFFFFF' : '#14161D',
        border: isLight ? '1.5px solid #CBD5E1' : '1px solid rgba(246, 207, 112, 0.3)',
        borderRadius: 20,
        width: '100%',
        maxWidth: 580,
        padding: 24,
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Nút đóng */}
        <button
          onClick={onClose}
          type="button"
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            border: 0,
            background: isLight ? '#F1F5F9' : 'rgba(255,255,255,0.08)',
            color: isLight ? '#475569' : '#fff',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #f6cf70, #c89536)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#17130a'
          }}>
            <Palette size={20} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: isLight ? '#B8860B' : '#f6cf70', letterSpacing: '.08em', textTransform: 'uppercase' }}>
              BỘ TẠO BIẾN THỂ MÀU SẮC AI
            </div>
            <h3 style={{ margin: '2px 0 0', fontSize: 19, fontWeight: 800, color: isLight ? '#0F172A' : '#FFFFFF' }}>
              Tạo Thêm Màu Cho Món Đồ
            </h3>
          </div>
        </div>

        {/* Preview món đồ nguồn */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: 12,
          borderRadius: 14,
          background: isLight ? '#F8FAFC' : 'rgba(255,255,255,0.04)',
          border: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255,255,255,0.08)',
          marginBottom: 18
        }}>
          <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <img 
              src={sourceItem.imageUrl || '/assets/clothes/shirt_white_formal.jpg'} 
              alt={sourceItem.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: isLight ? '#0F172A' : '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {sourceItem.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, display: 'flex', gap: 8, alignItems: 'center' }}>
              <span>Phân loại: <strong>{sourceItem.categoryName || 'Trang phục'}</strong></span>
              <span>•</span>
              <span>Màu hiện tại: <strong>{sourceItem.color || 'Đen / Trắng'}</strong></span>
            </div>
          </div>
        </div>

        {/* Hướng dẫn & Chọn tất cả */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
            Chọn các màu bạn muốn tạo thêm ({selectedColors.length} màu đã chọn):
          </span>
          <button
            type="button"
            onClick={selectAllMissing}
            style={{
              border: 0,
              background: 'transparent',
              color: isLight ? '#B8860B' : '#f6cf70',
              fontSize: 11,
              fontWeight: 800,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Chọn tất cả màu chưa có
          </button>
        </div>

        {/* Lưới danh sách màu sắc */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 10,
          marginBottom: 20
        }}>
          {FASHION_COLOR_PALETTE.map((pal) => {
            const isSelected = selectedColors.includes(pal.name);
            const isAlreadyInWardrobe = existingColorSet.has(normalizeStr(pal.name));

            return (
              <div
                key={pal.name}
                onClick={() => !isAlreadyInWardrobe && toggleColor(pal)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 12,
                  cursor: isAlreadyInWardrobe ? 'default' : 'pointer',
                  opacity: isAlreadyInWardrobe ? 0.6 : 1,
                  background: isSelected 
                    ? (isLight ? '#FEF9C3' : 'rgba(246,207,112,0.14)') 
                    : (isLight ? '#F8FAFC' : 'rgba(255,255,255,0.03)'),
                  border: isSelected 
                    ? '2px solid #D4AF37' 
                    : (isLight ? '1px solid #E2E8F0' : '1px solid rgba(255,255,255,0.08)'),
                  transition: 'all 0.18s ease'
                }}
              >
                {/* Vòng tròn màu */}
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: pal.hex,
                  border: `2px solid ${pal.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}>
                  {isSelected && (
                    <Check size={14} color={pal.textColor} strokeWidth={3} />
                  )}
                </div>

                {/* Tên màu */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isLight ? '#0F172A' : '#FFFFFF' }}>
                    {pal.labelVi}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {isAlreadyInWardrobe ? '✓ Đã có trong tủ đồ' : pal.labelEn}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Nút xác nhận Gen màu */}
        <div>
          {successCount !== null && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: '#059669',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 13,
              textAlign: 'center',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}>
              <CheckCheck size={17} />
              Đã tạo thành công {successCount} biến thể màu mới vào Tủ Đồ!
            </div>
          )}

          <button
            type="button"
            disabled={selectedColors.length === 0 || isGenerating}
            onClick={handleGenerate}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: 12,
              border: 0,
              cursor: selectedColors.length === 0 || isGenerating ? 'not-allowed' : 'pointer',
              background: selectedColors.length === 0 || isGenerating
                ? (isLight ? '#E2E8F0' : 'rgba(255,255,255,0.1)')
                : 'linear-gradient(135deg, #f6cf70, #c89536)',
              color: selectedColors.length === 0 || isGenerating ? 'var(--text-muted)' : '#17130a',
              fontWeight: 900,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: selectedColors.length > 0 ? '0 4px 18px rgba(246, 207, 112, 0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={16} />
            {isGenerating
              ? 'Đang tạo mẫu màu mới...'
              : `Tự Động Gen ${selectedColors.length > 0 ? selectedColors.length : ''} Mẫu Màu Mới Vào Tủ Đồ`}
          </button>
        </div>
      </div>
    </div>
  );
}
