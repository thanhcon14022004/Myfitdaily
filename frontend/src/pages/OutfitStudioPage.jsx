import React, { useMemo, useState } from 'react';
import { Check, RotateCcw, Save, Sparkles, UserRound, Wand2 } from 'lucide-react';
import VirtualMannequin from '../components/VirtualMannequin';
import { getInitialClothesForGender } from '../data/initialWardrobe';
import { useLanguage } from '../context/LanguageContext';

const SLOTS = [
  { key: 'top', label: 'Áo', categoryId: 1, icon: '01' },
  { key: 'bottom', label: 'Quần', categoryId: 2, icon: '02' },
  { key: 'shoes', label: 'Giày', categoryId: 5, icon: '03' }
];

export default function OutfitStudioPage({ clothes, outfits = [], onSaveOutfit, onToggleFavorite, onDeleteOutfit, user }) {
  const { text } = useLanguage();
  const inventory = clothes?.length ? clothes : getInitialClothesForGender(user?.gender);

  const defaults = useMemo(() => ({
    top: inventory.find(item => item.id === 202 || item.name.includes('Sweatshirt')) || inventory.find(item => item.categoryId === 1),
    bottom: inventory.find(item => item.categoryId === 2),
    shoes: inventory.find(item => item.categoryId === 5)
  }), [inventory]);

  const [selection, setSelection] = useState(defaults);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'top', 'bottom', 'shoes'
  const [tryOnState, setTryOnState] = useState({ loading: false, message: '' });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Chọn hoặc gỡ món đồ
  const toggleItem = (item) => {
    const slot = SLOTS.find(s => s.categoryId === item.categoryId)?.key;
    if (!slot) return;
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
    const targetCatId = SLOTS.find(s => s.key === activeTab)?.categoryId;
    return inventory.filter(item => item.categoryId === targetCatId);
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
  };

  const handleTriggerAiTryOn = () => {
    setTryOnState({ loading: true, message: 'AI đang phân tích nếp vải và khớp dáng người mẫu…' });
    setTimeout(() => {
      setTryOnState({ loading: false, message: 'Đã hoàn tất thử đồ trên người mẫu.' });
      setTimeout(() => setTryOnState({ loading: false, message: '' }), 2500);
    }, 800);
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
          background: 'radial-gradient(circle at 50% 15%, rgba(224,184,91,.15), transparent 45%), linear-gradient(145deg, #15140f, #090b11 65%)',
          border: '1px solid rgba(246,207,112,.22)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
            <div>
              <div style={{ color: '#f6cf70', fontSize: 11, fontWeight: 800, letterSpacing: '.12em' }}>SÂN KHẤU THỬ ĐỒ</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginTop: 2 }}>Người mẫu & outfit</div>
            </div>
            <button type="button" onClick={reset} title="Đặt lại outfit mặc định" style={{ border: '1px solid rgba(255,255,255,.16)', background: 'rgba(0,0,0,.18)', color: '#fff', borderRadius: 9, padding: 8, cursor: 'pointer' }}>
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
            />
          </div>

          {/* Thanh trạng thái AI & 3 Slot món đồ đang mặc */}
          <div>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <button
                type="button"
                disabled={tryOnState.loading}
                onClick={handleTriggerAiTryOn}
                style={{
                  border: 0,
                  borderRadius: 9,
                  padding: '9px 18px',
                  cursor: tryOnState.loading ? 'wait' : 'pointer',
                  background: tryOnState.loading ? 'rgba(246,207,112,.45)' : 'linear-gradient(135deg,#f6cf70,#c89536)',
                  color: '#17130a',
                  fontWeight: 900,
                  fontSize: 13
                }}
              >
                <Wand2 size={15} style={{ verticalAlign: 'text-bottom', marginRight: 6 }}/>
                {tryOnState.loading ? 'Đang thử đồ…' : 'Thử đồ AI'}
              </button>
              {tryOnState.message && (
                <div style={{ marginTop: 6, color: '#9ee6b8', fontSize: 12, fontWeight: 600 }}>
                  {tryOnState.message}
                </div>
              )}
            </div>

            {/* 3 ô tóm tắt đồ đang mặc */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {SLOTS.map(slot => {
                const item = selection[slot.key];
                return (
                  <div
                    key={slot.key}
                    style={{
                      border: item ? '1px solid rgba(246,207,112,0.35)' : '1px solid rgba(255,255,255,.08)',
                      background: item ? 'rgba(246,207,112,.08)' : 'rgba(0,0,0,.25)',
                      color: '#fff',
                      borderRadius: 10,
                      padding: '8px 10px'
                    }}
                  >
                    <span style={{ display: 'block', color: '#f6cf70', fontSize: 10, fontWeight: 800 }}>
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
          border: '1px solid rgba(255,255,255,.10)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 640
        }}>
          <div>
            {/* Header tủ đồ */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ color: '#f6cf70', fontSize: 11, fontWeight: 800, letterSpacing: '.12em' }}>TỦ ĐỒ CỦA BẠN</div>
                <h2 style={{ fontSize: 20, margin: '4px 0 0', fontWeight: 800 }}>Chọn món muốn thử</h2>
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
                    border: 0,
                    cursor: 'pointer',
                    borderRadius: 999,
                    padding: '6px 14px',
                    color: activeTab === tab.key ? '#17130a' : 'var(--text-secondary)',
                    background: activeTab === tab.key ? '#f6cf70' : 'rgba(255,255,255,.07)',
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
                      background: isSelected ? 'rgba(246,207,112,.12)' : 'rgba(255, 255, 255, 0.035)',
                      border: isSelected ? '2px solid #f6cf70' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 14,
                      padding: 10,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 16px rgba(246,207,112,.2)' : 'none'
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
                    <div style={{ width: '100%', height: 105, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                        }}
                      />
                    </div>

                    {/* Tên món đồ */}
                    <div style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: isSelected ? '#f6cf70' : '#fff',
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
          <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,.08)' }}>
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
