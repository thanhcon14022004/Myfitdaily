import React, { useMemo, useState } from 'react';
import { Check, RotateCcw, Save, Sparkles, UserRound } from 'lucide-react';
import VirtualMannequin from '../components/VirtualMannequin';
import { getInitialClothesForGender } from '../data/initialWardrobe';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const SLOTS = [
  { key: 'top', label: 'Áo', categoryIds: [1, 4], icon: '01' },
  { key: 'bottom', label: 'Quần', categoryIds: [2, 3], icon: '02' },
  { key: 'shoes', label: 'Giày', categoryIds: [5], icon: '03' }
];

function normalizeLabel(value = '') {
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}

function getItemSlot(item) {
  const categoryId = Number(item?.categoryId);
  const category = normalizeLabel(item?.categoryName);
  const name = normalizeLabel(`${item?.name || ''} ${item?.description || ''}`);
  if (categoryId === 6 || /accessor/.test(category)) return null;
  if (categoryId === 5 || /shoe|giay|dep/.test(category) || /sneaker|loafer|boots?|giay|sandal/.test(name)) return 'shoes';
  if ([2, 3].includes(categoryId) || /bottom|quan|dress|dam|vay/.test(category) || /quan|pant|trouser|jean|short|skirt|dress|dam|vay/.test(name)) return 'bottom';
  if ([1, 4].includes(categoryId) || /top|outerwear|ao/.test(category) || /ao|shirt|tee|polo|hoodie|sweater|blazer|jacket|coat/.test(name)) return 'top';
  return 'top';
}

export default function OutfitStudioPage({ clothes, outfits = [], onSaveOutfit, onToggleFavorite, onDeleteOutfit, user }) {
  const { text } = useLanguage();
  const { isLight } = useTheme();
  const inventory = clothes?.length ? clothes : getInitialClothesForGender(user?.gender);

  const defaults = useMemo(() => ({
    top: inventory.find(item => item.id === 260) || inventory.find(item => item.id === 210) || inventory.find(item => item.categoryId === 1),
    bottom: inventory.find(item => item.id === 261) || inventory.find(item => item.id === 220) || inventory.find(item => item.categoryId === 2),
    shoes: inventory.find(item => item.id === 262) || inventory.find(item => item.id === 204) || inventory.find(item => item.categoryId === 5)
  }), [inventory]);

  const [selection, setSelection] = useState(defaults);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'top', 'bottom', 'shoes'
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [aiGeneratedImage, setAiGeneratedImage] = useState(null);

  // Chọn hoặc gỡ món đồ
  const toggleItem = (item) => {
    let slot = activeTab !== 'all' ? activeTab : null;
    if (!slot) {
      slot = getItemSlot(item);
    }
    if (!slot) return;

    setAiGeneratedImage(null);
    setSelection(prev => ({
      ...prev,
      [slot]: prev[slot]?.id === item.id ? null : item
    }));
  };

  const selectedIds = Object.values(selection).filter(Boolean).map(item => item.id);
  const selectedItems = Object.values(selection).filter(Boolean);

  // Lọc đồ theo tab
  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return inventory;
    const targetCatIds = SLOTS.find(s => s.key === activeTab)?.categoryIds || [];
    return inventory.filter(item => targetCatIds.includes(Number(item.categoryId)));
  }, [inventory, activeTab]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedIds.length) return;
    const outfitName = selectedItems.map(i => i.name).slice(0, 2).join(' + ') || 'Outfit Studio';
    onSaveOutfit?.({
      id: Date.now(),
      name: outfitName,
      occasion: 'Casual',
      season: 'AllSeason',
      isFavorite: false,
      createdByAi: false,
      itemIds: selectedIds,
      description: 'Look được lưu từ Phòng Thử Đồ.'
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const reset = () => {
    setSelection(defaults);
    setActiveTab('all');
    setAiGeneratedImage(null);
  };




  return (
    <div className="container model-stylist" style={{ padding: '32px 24px 60px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 18, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'inline-flex', gap: 7, alignItems: 'center', color: '#f6cf70', fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase' }}>
            <Sparkles size={14}/> Phòng Thử Đồ Người Mẫu Thật
          </div>
          <h1 style={{ margin: '8px 0 6px', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '-.04em', lineHeight: 1 }}>
            Phòng Thử Đồ <span className="gradient-text">Studio</span>
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>
            {text('Chạm vào các ô đồ trong tủ để ướm thử trực tiếp lên người mẫu.', 'Tap items in your wardrobe to fit directly on the model.')}
          </p>
        </div>
        <div style={{ padding: '8px 14px', border: '1px solid rgba(246,207,112,.25)', borderRadius: 999, color: '#f6cf70', background: 'rgba(246,207,112,.07)', fontSize: 12, fontWeight: 700 }}>
          <UserRound size={14} style={{ verticalAlign: 'text-bottom', marginRight: 6 }}/>
          Người Mẫu Thực Tế
        </div>
      </header>

      {/* Grid: Trái là Người Mẫu, Phải là Lưới Ô Đồ Trong Tủ */}
      <div className="model-stylist-grid">
        {/* CỘT TRÁI: NGƯỜI MẪU & OUTFIT ĐANG MẶC */}
        <section className="glass-card" style={{
          padding: 18,
          minHeight: 640,
          position: 'relative',
          overflow: 'hidden',
          background: isLight 
            ? 'linear-gradient(145deg, #F8FAFC, #EDF2F7)' 
            : 'radial-gradient(circle at 50% 15%, rgba(224,184,91,.15), transparent 45%), linear-gradient(145deg, #15140f, #090b11 65%)',
          border: isLight ? '1.5px solid #CBD5E1' : '1px solid rgba(246,207,112,.22)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
            <div>
              <div style={{ color: isLight ? '#B8860B' : '#f6cf70', fontSize: 11, fontWeight: 800, letterSpacing: '.12em' }}>SÂN KHẤU THỬ ĐỒ</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginTop: 2, color: isLight ? '#0F172A' : '#FFFFFF' }}>Người mẫu & outfit</div>
            </div>
            <button type="button" onClick={reset} title="Đặt lại outfit mặc định" style={{ border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(255,255,255,.16)', background: isLight ? '#FFFFFF' : 'rgba(0,0,0,.18)', color: isLight ? '#475569' : '#fff', borderRadius: 9, padding: 8, cursor: 'pointer' }}>
              <RotateCcw size={16}/>
            </button>
          </div>

          {/* Người mẫu hiển thị với trang phục thực tế */}
          <div style={{ margin: '8px 0', display: 'flex', justifyContent: 'center' }}>
            <VirtualMannequin
              user={user}
              top={selection.top}
              bottom={selection.bottom}
              shoes={selection.shoes}
              selectionKey={selectedIds.join('|')}
            />
          </div>

          {/* Thanh trạng thái AI & 3 Slot món đồ đang mặc */}
          {/* Thanh trạng thái Fits Live & 3 Slot món đồ đang mặc */}
          <div>
            <div style={{ textAlign: 'center', marginBottom: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    border: 0,
                    borderRadius: 9,
                    padding: '8px 24px',
                    cursor: 'pointer',
                    background: savedSuccess ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f6cf70, #c89536)',
                    color: savedSuccess ? '#fff' : '#17130a',
                    fontWeight: 800,
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    boxShadow: '0 4px 14px rgba(246, 207, 112, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Save size={15} />
                  <span>{savedSuccess ? '✓ Đã Lưu Outfit!' : 'Lưu Outfit Này'}</span>
                </button>
              </div>
            </div>

            {/* 3 ô tóm tắt đồ đang mặc */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {SLOTS.map(slot => {
                const item = selection[slot.key];
                return (
                  <div
                    key={slot.key}
                    style={{
                      border: item ? (isLight ? '1px solid rgba(184, 134, 11, 0.4)' : '1px solid rgba(246,207,112,0.35)') : (isLight ? '1px solid #E2E8F0' : '1px solid rgba(255,255,255,.08)'),
                      background: item ? (isLight ? 'rgba(184, 134, 11, 0.08)' : 'rgba(246,207,112,.08)') : (isLight ? '#FFFFFF' : 'rgba(0,0,0,.25)'),
                      color: isLight ? '#0F172A' : '#fff',
                      borderRadius: 10,
                      padding: '8px 10px'
                    }}
                  >
                    <span style={{ display: 'block', color: isLight ? '#B8860B' : '#f6cf70', fontSize: 10, fontWeight: 800 }}>
                      {slot.icon} / {slot.label.toUpperCase()}
                    </span>
                    <span style={{ display: 'block', fontSize: 12, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>
                      {item?.name || 'Chưa chọn'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CỘT PHẢI: CHỈ LƯỚI CÁC Ô ĐỒ TRONG TỦ ĐỒ (GỌN GÀNG, KHÔNG RỐI MẮT) */}
        <aside className="glass-card" style={{
          padding: 20,
          border: isLight ? '1.5px solid #CBD5E1' : '1px solid rgba(255,255,255,.10)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 640
        }}>
          <div>
            {/* Header tủ đồ */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ color: isLight ? '#B8860B' : '#f6cf70', fontSize: 11, fontWeight: 800, letterSpacing: '.12em' }}>TỦ ĐỒ CỦA BẠN</div>
                <h2 style={{ fontSize: 20, margin: '4px 0 0', fontWeight: 800, color: 'var(--text-primary)' }}>Chọn món muốn thử</h2>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {inventory.length} món có sẵn
              </span>
            </div>

            {/* Các tab phân loại đơn giản */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'top', label: 'Áo' },
                { key: 'bottom', label: 'Quần' },
                { key: 'shoes', label: 'Giày' }
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    border: isLight && activeTab !== tab.key ? '1.5px solid #CBD5E1' : 0,
                    cursor: 'pointer',
                    borderRadius: 999,
                    padding: '6px 14px',
                    color: activeTab === tab.key ? '#17130a' : (isLight ? '#1E293B' : 'var(--text-secondary)'),
                    background: activeTab === tab.key ? (isLight ? '#D4AF37' : '#f6cf70') : (isLight ? '#FFFFFF' : 'rgba(255,255,255,.07)'),
                    boxShadow: isLight ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
                    fontWeight: 800,
                    fontSize: 12,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* LƯỚI CÁC Ô ĐỒ (WARDROBE TILES GRID) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 12,
              maxHeight: '440px',
              overflowY: 'auto',
              paddingRight: 4
            }}>
              {filteredItems.map(item => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item)}
                    style={{
                      position: 'relative',
                      background: isSelected 
                        ? (isLight ? '#FEF9C3' : 'rgba(246,207,112,.12)') 
                        : (isLight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.035)'),
                      border: isSelected 
                        ? '2px solid #D4AF37' 
                        : (isLight ? '1.5px solid #CBD5E1' : '1px solid rgba(255, 255, 255, 0.1)'),
                      borderRadius: 14,
                      padding: 10,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected 
                        ? '0 4px 16px rgba(212,175,55,.25)' 
                        : (isLight ? '0 1px 3px rgba(0,0,0,0.06)' : 'none')
                    }}
                  >
                    {/* Badge đã chọn */}
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        background: '#f6cf70',
                        color: '#000',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2
                      }}>
                        <Check size={13} strokeWidth={3} />
                      </div>
                    )}

                    {/* Ảnh sản phẩm */}
                    <div style={{ width: '100%', height: 105, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, background: 'linear-gradient(145deg, #F4F2ED, #E7E4DC)', borderRadius: 10, overflow: 'hidden' }}>
                      <img
                        src={item.imageUrl || (Number(item.categoryId) === 2 || Number(item.categoryId) === 3 ? '/assets/clothes/pants_wide_beige.jpg' : Number(item.categoryId) === 5 ? '/assets/clothes/shoes_sneaker_white_real.jpg' : '/assets/clothes/shirt_white_formal.jpg')}
                        alt={item.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                        }}
                        onError={(e) => {
                          const image = e.currentTarget;
                          if (image.dataset.fallbackApplied) {
                            image.src = '/assets/stylist/navy-shirt-essential.png';
                            return;
                          }
                          image.dataset.fallbackApplied = 'true';
                          const categoryId = Number(item.categoryId);
                          image.src = (categoryId === 2 || categoryId === 3)
                            ? '/assets/clothes/pants_wide_beige.jpg'
                            : categoryId === 5
                              ? '/assets/clothes/shoes_sneaker_white_real.jpg'
                              : '/assets/clothes/shirt_white_formal.jpg';
                        }}
                      />
                    </div>

                    {/* Tên món đồ */}
                    <div style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: isSelected 
                        ? (isLight ? '#92400E' : '#f6cf70') 
                        : (isLight ? '#0F172A' : '#fff'),
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: 31
                    }}>
                      {item.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NÚT LƯU OUTFIT ĐƠN GIẢN */}
          <div style={{ marginTop: 20, paddingTop: 14, borderTop: isLight ? '1px solid #E2E8F0' : '1px solid rgba(255,255,255,.08)' }}>
            {savedSuccess && (
              <div style={{ color: '#9ee6b8', fontSize: 12, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>
                ✓ Đã lưu bộ đồ vào Tủ đồ thành công!
              </div>
            )}
            <button
              type="button"
              onClick={handleSave}
              style={{
                width: '100%',
                border: 0,
                borderRadius: 10,
                padding: '12px 16px',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #f6cf70, #c89536)',
                color: '#17130a',
                fontWeight: 900,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <Save size={17} />
              Lưu Outfit Này
            </button>
          </div>
        </aside>
      </div>

      <style>{`
        .model-stylist-grid {
          display: grid;
          grid-template-columns: minmax(380px, 1.1fr) minmax(320px, 0.9fr);
          gap: 24px;
        }
        @media (max-width: 850px) {
          .model-stylist-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
