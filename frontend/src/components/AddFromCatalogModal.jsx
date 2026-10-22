import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Plus, 
  Check, 
  CheckCheck, 
  Filter, 
  Shirt, 
  Layers, 
  Tag
} from 'lucide-react';
import { STYLIST_CLOTHES } from '../data/initialWardrobe';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

function removeVietnameseTones(str = '') {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export default function AddFromCatalogModal({
  isOpen,
  onClose,
  user,
  existingClothes = [],
  onAddClothing,
  onBatchAddClothing
}) {
  const { text } = useLanguage();
  const { isLight } = useTheme();

  const isMale = user?.gender?.toLowerCase() === 'nam' || user?.gender?.toLowerCase() === 'male';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 1, 2, 3, 5
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [addingIds, setAddingIds] = useState(new Set());
  const [justAddedIds, setJustAddedIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState(null);

  // Danh sách đồ mẫu phù hợp theo giới tính của người dùng
  const catalogList = useMemo(() => {
    return STYLIST_CLOTHES.filter(item => {
      if (isMale) {
        // Loại bỏ đầm, váy, áo hai dây nữ cho tài khoản Nam
        if (item.categoryId === 3) return false;
        const lowerName = item.name.toLowerCase();
        if (lowerName.includes('váy') || lowerName.includes('đầm') || lowerName.includes('2 dây') || lowerName.includes('croptop')) {
          return false;
        }
      }
      return true;
    });
  }, [isMale]);

  // Kiểm tra xem món đồ đã có trong tủ đồ của người dùng chưa
  const existingNamesSet = useMemo(() => {
    return new Set(existingClothes.map(c => removeVietnameseTones(c.name?.trim())));
  }, [existingClothes]);

  const isItemInWardrobe = (item) => {
    return existingNamesSet.has(removeVietnameseTones(item.name?.trim())) ||
           justAddedIds.has(item.id);
  };

  // Danh mục tab
  const categoryTabs = useMemo(() => {
    const tabs = [
      { id: 'all', label: text('Tất Cả', 'All'), count: catalogList.length },
      { id: 1, label: text('Áo (Tops)', 'Tops'), count: catalogList.filter(c => c.categoryId === 1).length },
      { id: 2, label: text('Quần (Bottoms)', 'Bottoms'), count: catalogList.filter(c => c.categoryId === 2).length },
    ];
    if (!isMale) {
      tabs.push({ id: 3, label: text('Đầm & Váy', 'Dresses & Skirts'), count: catalogList.filter(c => c.categoryId === 3).length });
    }
    tabs.push({ id: 5, label: text('Giày (Shoes)', 'Shoes'), count: catalogList.filter(c => c.categoryId === 5).length });
    return tabs;
  }, [catalogList, isMale, text]);

  // Lọc danh sách theo tìm kiếm và bộ lọc
  const filteredCatalog = useMemo(() => {
    return catalogList.filter(item => {
      // Lọc theo danh mục
      if (selectedCategory !== 'all' && item.categoryId !== Number(selectedCategory)) {
        return false;
      }

      // Lọc theo từ khóa tìm kiếm (Tên áo, quần, giày, thương hiệu, màu sắc)
      if (searchQuery.trim()) {
        const queryNorm = removeVietnameseTones(searchQuery.trim());
        const nameNorm = removeVietnameseTones(item.name);
        const brandNorm = removeVietnameseTones(item.brand || '');
        const colorNorm = removeVietnameseTones(item.color || '');
        const styleNorm = removeVietnameseTones(item.style || '');
        const descNorm = removeVietnameseTones(item.description || '');

        const matches = nameNorm.includes(queryNorm) || 
                        brandNorm.includes(queryNorm) || 
                        colorNorm.includes(queryNorm) || 
                        styleNorm.includes(queryNorm) ||
                        descNorm.includes(queryNorm);
        if (!matches) return false;
      }

      return true;
    });
  }, [catalogList, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  // Thêm 1 món đơn lẻ
  const handleAddSingle = async (item) => {
    if (isItemInWardrobe(item) || addingIds.has(item.id)) return;

    setAddingIds(prev => new Set(prev).add(item.id));
    try {
      const payload = {
        name: item.name,
        categoryId: item.categoryId,
        color: item.color,
        style: item.style || 'Casual',
        season: item.season || 'AllSeason',
        imageUrl: item.imageUrl,
        description: item.description,
        brand: item.brand,
        size: isMale ? 'L' : 'M'
      };

      if (onAddClothing) {
        await onAddClothing(payload);
      }
      setJustAddedIds(prev => new Set(prev).add(item.id));
      showToast(text(`✓ Đã thêm "${item.name}" vào tủ đồ!`, `✓ Added "${item.name}" to wardrobe!`));
    } catch (err) {
      console.warn("Lỗi thêm món đồ từ kho:", err);
    } finally {
      setAddingIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  // Toggle chọn nhiều món
  const handleToggleSelect = (itemId) => {
    setSelectedItemIds(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  // Thêm tất cả các món đã tích chọn
  const handleAddSelectedBatch = async () => {
    const itemsToAdd = filteredCatalog.filter(c => selectedItemIds.includes(c.id) && !isItemInWardrobe(c));
    if (itemsToAdd.length === 0) return;

    const idsSet = new Set(itemsToAdd.map(i => i.id));
    setAddingIds(prev => new Set([...prev, ...idsSet]));

    try {
      if (onBatchAddClothing) {
        await onBatchAddClothing(itemsToAdd.map(item => ({
          name: item.name,
          categoryId: item.categoryId,
          color: item.color,
          style: item.style || 'Casual',
          season: item.season || 'AllSeason',
          imageUrl: item.imageUrl,
          description: item.description,
          brand: item.brand,
          size: isMale ? 'L' : 'M'
        })));
      } else if (onAddClothing) {
        for (const it of itemsToAdd) {
          await onAddClothing({
            name: it.name,
            categoryId: it.categoryId,
            color: it.color,
            style: it.style || 'Casual',
            season: it.season || 'AllSeason',
            imageUrl: it.imageUrl,
            description: it.description,
            brand: it.brand,
            size: isMale ? 'L' : 'M'
          });
        }
      }

      setJustAddedIds(prev => new Set([...prev, ...idsSet]));
      setSelectedItemIds([]);
      showToast(text(`✓ Đã thêm ${itemsToAdd.length} món vào tủ đồ thành công!`, `✓ Added ${itemsToAdd.length} items to your wardrobe!`));
    } catch (err) {
      console.warn("Lỗi thêm hàng loạt món đồ:", err);
    } finally {
      setAddingIds(prev => {
        const next = new Set(prev);
        idsSet.forEach(id => next.delete(id));
        return next;
      });
    }
  };

  // Toast thông báo
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(12px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1120px',
        height: '90vh',
        maxHeight: '880px',
        background: isLight 
          ? '#FFFFFF' 
          : 'linear-gradient(165deg, #181C26 0%, #0F121A 100%)',
        border: isLight ? '1.5px solid #CBD5E1' : '1px solid rgba(212, 175, 55, 0.4)',
        borderRadius: '24px',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 35px rgba(212, 175, 55, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: '#FFFFFF',
            padding: '10px 24px',
            borderRadius: '999px',
            fontSize: '0.9rem',
            fontWeight: 800,
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.45)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.25s ease'
          }}>
            <Check size={18} strokeWidth={3} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div style={{
          padding: '24px 30px 18px',
          borderBottom: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: isLight ? '#F8FAFC' : 'rgba(0, 0, 0, 0.25)'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#D4AF37',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '4px'
            }}>
              <Sparkles size={15} /> {text('Kho Trang Phục Có Sẵn Trong Database', 'Built-in Catalog Database')}
            </div>
            <h3 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 800,
              color: isLight ? '#0F172A' : '#FFFFFF'
            }}>
              {text('Chọn Món Đồ Chuẩn Vào Tủ Đồ', 'Select Ready-Made Clothes for Wardrobe')}
            </h3>
            <p style={{
              margin: '4px 0 0',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)'
            }}>
              {text(
                'Thêm nhanh các mẫu áo sơ mi, áo thun, hoodie, quần tây, jeans, sneaker có sẵn mà không cần chụp ảnh.',
                'Quickly add shirts, t-shirts, hoodies, trousers, jeans, and sneakers without taking photos.'
              )}
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            title={text('Đóng', 'Close')}
            style={{
              background: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isLight ? '#334155' : '#E5E7EB',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar & Filters Bar */}
        <div style={{
          padding: '16px 30px',
          background: isLight ? '#FFFFFF' : 'rgba(15, 18, 26, 0.95)',
          borderBottom: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {/* Big Search Input */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search 
              size={20} 
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#D4AF37'
              }} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={text(
                'Tìm kiếm theo tên áo, quần, giày (VD: Sơ mi trắng, Jeans ống rộng, Hoodie, Polo, Quần tây, Sneaker...)...',
                'Search item by name (e.g. White shirt, Wide-leg jeans, Hoodie, Polo, Trousers, Sneaker...)...'
              )}
              style={{
                width: '100%',
                padding: '14px 44px 14px 48px',
                borderRadius: '14px',
                border: isLight ? '1.5px solid #CBD5E1' : '1.5px solid rgba(212, 175, 55, 0.45)',
                background: isLight ? '#FFFFFF' : '#10131B',
                color: isLight ? '#0F172A' : '#FFFFFF',
                fontSize: '0.96rem',
                fontWeight: 500,
                outline: 'none',
                boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                transition: 'border-color 0.2s ease'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Category Tabs & Quick Batch Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categoryTabs.map(tab => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedCategory(tab.id)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '999px',
                      fontSize: '0.86rem',
                      fontWeight: isActive ? 800 : 600,
                      border: isActive 
                        ? '1.5px solid #D4AF37' 
                        : (isLight ? '1.5px solid #CBD5E1' : '1px solid rgba(255, 255, 255, 0.1)'),
                      background: isActive 
                        ? (isLight ? 'rgba(212, 175, 55, 0.18)' : 'rgba(212, 175, 55, 0.25)') 
                        : (isLight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.05)'),
                      color: isActive 
                        ? (isLight ? '#B8860B' : '#FDE68A') 
                        : (isLight ? '#334155' : '#D1D5DB'),
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tab.label} <span style={{ opacity: 0.75, fontSize: '0.78rem' }}>({tab.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Batch Add Button */}
            {selectedItemIds.length > 0 && (
              <button
                type="button"
                onClick={handleAddSelectedBatch}
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #C27D5E)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '9px 20px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(212, 175, 55, 0.35)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <Plus size={16} strokeWidth={3} />
                <span>{text(`Thêm ${selectedItemIds.length} Món Đã Chọn Vào Tủ`, `Add ${selectedItemIds.length} Selected to Wardrobe`)}</span>
              </button>
            )}
          </div>
        </div>

        {/* Items Grid Content */}
        <div style={{
          padding: '24px 30px',
          overflowY: 'auto',
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: '22px',
          alignContent: 'start'
        }}>
          {filteredCatalog.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-muted)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
              <h4 style={{ margin: '0 0 6px', fontSize: '1.15rem', color: isLight ? '#0F172A' : '#FFFFFF' }}>
                {text('Không tìm thấy trang phục phù hợp', 'No matching items found')}
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                {text(
                  `Thử tìm kiếm với từ khóa khác như "sơ mi", "quần", "jeans", "hoodie", "sneaker"...`,
                  `Try searching with other terms like "shirt", "pants", "jeans", "hoodie", "sneaker"...`
                )}
              </p>
            </div>
          ) : (
            filteredCatalog.map(item => {
              const inWardrobe = isItemInWardrobe(item);
              const isSelected = selectedItemIds.includes(item.id);
              const isAdding = addingIds.has(item.id);

              return (
                <div
                  key={item.id}
                  style={{
                    background: isLight ? '#FFFFFF' : '#141824',
                    border: inWardrobe 
                      ? '1.5px solid rgba(16, 185, 129, 0.5)' 
                      : isSelected 
                      ? '2px solid #D4AF37' 
                      : (isLight ? '1.5px solid #CBD5E1' : '1px solid rgba(255, 255, 255, 0.1)'),
                    borderRadius: '18px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '340px',
                    boxShadow: isLight ? '0 4px 12px rgba(0,0,0,0.06)' : '0 6px 20px rgba(0,0,0,0.3)',
                    position: 'relative',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  {/* Select Checkbox (nếu chưa có trong tủ) */}
                  {!inWardrobe && (
                    <button
                      type="button"
                      onClick={() => handleToggleSelect(item.id)}
                      title={isSelected ? text('Bỏ chọn', 'Deselect') : text('Chọn món này', 'Select item')}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        zIndex: 10,
                        background: isSelected ? '#D4AF37' : 'rgba(0, 0, 0, 0.65)',
                        border: isSelected ? 'none' : '1.5px solid rgba(255, 255, 255, 0.4)',
                        borderRadius: '7px',
                        width: '26px',
                        height: '26px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isSelected ? <Check size={16} strokeWidth={3} /> : null}
                    </button>
                  )}

                  {/* Brand & Category Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    zIndex: 10,
                    background: 'rgba(0, 0, 0, 0.72)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    color: '#FDE68A',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '4px 9px',
                    borderRadius: '7px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    {item.brand || item.categoryName}
                  </div>

                  {/* Image Container với chiều cao cố định rõ ràng */}
                  <div style={{
                    width: '100%',
                    height: '190px',
                    minHeight: '190px',
                    background: isLight 
                      ? '#F1F5F9' 
                      : 'linear-gradient(145deg, #1A1F2C 0%, #0E1119 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '14px',
                    boxSizing: 'border-box',
                    position: 'relative'
                  }}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.dataset.fallbackApplied) return;
                        img.dataset.fallbackApplied = 'true';
                        const catId = Number(item.categoryId);
                        img.src = catId === 2 || catId === 3 
                          ? '/assets/clothes/jeans_blue.svg' 
                          : (catId === 5 ? '/assets/clothes/shoes_sneaker.svg' : '/assets/clothes/shirt_white.svg');
                      }}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </div>

                  {/* Item Details */}
                  <div style={{
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div>
                      <h4 style={{
                        margin: '0 0 6px',
                        fontSize: '0.94rem',
                        fontWeight: 700,
                        lineHeight: 1.4,
                        color: isLight ? '#0F172A' : '#FFFFFF',
                        minHeight: '2.6em',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {item.name}
                      </h4>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)'
                      }}>
                        <span style={{
                          display: 'inline-block',
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: '#D4AF37'
                        }} />
                        <span>{item.color}</span>
                        {item.style && <span>• {item.style}</span>}
                      </div>
                    </div>

                    {/* Action Button: Thêm hoặc Đã Có */}
                    <div style={{ marginTop: 'auto' }}>
                      {inWardrobe ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: isLight ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.18)',
                          border: '1.5px solid rgba(16, 185, 129, 0.45)',
                          color: '#10B981',
                          borderRadius: '12px',
                          padding: '9px 12px',
                          fontSize: '0.84rem',
                          fontWeight: 800
                        }}>
                          <CheckCheck size={16} />
                          <span>{text('✓ Đã Có Trong Tủ Đồ', '✓ In Your Wardrobe')}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddSingle(item)}
                          disabled={isAdding}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            background: 'linear-gradient(135deg, #D4AF37 0%, #C27D5E 100%)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '9px 14px',
                            fontSize: '0.86rem',
                            fontWeight: 800,
                            cursor: isAdding ? 'wait' : 'pointer',
                            boxShadow: '0 4px 14px rgba(212, 175, 55, 0.3)',
                            transition: 'all 0.15s ease',
                            opacity: isAdding ? 0.7 : 1
                          }}
                        >
                          <Plus size={16} strokeWidth={2.5} />
                          <span>{isAdding ? text('Đang lưu...', 'Saving...') : text('+ Thêm Vào Tủ Đồ', '+ Add to Wardrobe')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 30px',
          borderTop: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
          background: isLight ? '#F8FAFC' : 'rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            ✦ {text(`Đang hiển thị ${filteredCatalog.length} món đồ chuẩn có sẵn`, `Showing ${filteredCatalog.length} ready-made items`)}
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {selectedItemIds.length > 0 && (
              <button
                type="button"
                onClick={handleAddSelectedBatch}
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #C27D5E)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 22px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(212, 175, 55, 0.3)'
                }}
              >
                <Plus size={16} strokeWidth={3} />
                <span>{text(`Thêm ${selectedItemIds.length} món vào tủ`, `Add ${selectedItemIds.length} to wardrobe`)}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 24px',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: isLight ? '#334155' : '#E5E7EB',
                cursor: 'pointer'
              }}
            >
              {text('Đóng', 'Close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
