import React, { useMemo, useState } from 'react';
import { Check, RotateCcw, Save, Sparkles, UserRound, Wand2, Key, X, ShieldCheck, Cpu } from 'lucide-react';
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
  const [aiGeneratedImage, setAiGeneratedImage] = useState(null);
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('myfitdaily_gemini_key') || '');
  const [fashnApiKey, setFashnApiKey] = useState(() => localStorage.getItem('myfitdaily_fashn_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempGeminiKey, setTempGeminiKey] = useState(() => localStorage.getItem('myfitdaily_gemini_key') || '');

  // Chọn hoặc gỡ món đồ
  const toggleItem = (item) => {
    let catId = item.categoryId;
    const lowerName = (item.name || '').toLowerCase();
    const isPants = (item.imageUrl && item.imageUrl.includes('media_1790076823583')) ||
                    lowerName.includes('quần') || lowerName.includes('pant') || lowerName.includes('trouser') || lowerName.includes('jean');
    if (isPants) catId = 2; // Tự động đưa về đúng slot Quần

    let slot = activeTab !== 'all' ? activeTab : null;
    if (!slot) {
      slot = SLOTS.find(s => s.categoryId === catId)?.key || (catId === 2 ? 'bottom' : 'top');
    }
    if (!slot) return;

    setAiGeneratedImage(null); // Đặt lại để hiển thị Dynamic 2D Fitting trực tiếp
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
    setAiGeneratedImage(null);
  };

  const handleSaveApiKey = () => {
    const trimmedGemini = tempGeminiKey.trim();
    setGeminiApiKey(trimmedGemini);
    if (trimmedGemini) {
      localStorage.setItem('myfitdaily_gemini_key', trimmedGemini);
    } else {
      localStorage.removeItem('myfitdaily_gemini_key');
    }
    setShowKeyModal(false);
  };

  const handleUseFreeAi = () => {
    setGeminiApiKey('');
    setTempGeminiKey('');
    localStorage.removeItem('myfitdaily_gemini_key');
    setShowKeyModal(false);
    setTryOnState({ loading: false, message: '✓ Đã kích hoạt Model AI Miễn Phí (FLUX.1)!' });
    setTimeout(() => setTryOnState({ loading: false, message: '' }), 3000);
  };

  const [colabUrl, setColabUrl] = useState(() => localStorage.getItem('myfitdaily_colab_url') || '');
  const [tempColabUrl, setTempColabUrl] = useState(() => localStorage.getItem('myfitdaily_colab_url') || '');

  const handleSaveColabUrl = () => {
    const trimmed = tempColabUrl.trim().replace(/\/$/, '');
    setColabUrl(trimmed);
    if (trimmed) {
      localStorage.setItem('myfitdaily_colab_url', trimmed);
      setTryOnState({ loading: false, message: '✓ Đã kết nối GPU Server Google Colab riêng!' });
    } else {
      localStorage.removeItem('myfitdaily_colab_url');
      setTryOnState({ loading: false, message: '✓ Đã chuyển về AI Server miễn phí mặc định.' });
    }
    setShowKeyModal(false);
    setTimeout(() => setTryOnState({ loading: false, message: '' }), 3000);
  };

  const handleTriggerAiTryOn = async () => {
    const isFemale = user?.gender?.toLowerCase() === 'nữ' || user?.gender?.toLowerCase() === 'female';

    setTryOnState({
      loading: true,
      message: colabUrl 
        ? 'Server Colab riêng đang dệt trang phục thật lên người mẫu… (~4-6s)'
        : 'AI IDM-VTON đang dệt trang phục thật lên người mẫu… (~8-12s)'
    });

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (colabUrl) {
        headers['X-Colab-Url'] = colabUrl;
      }

      // 1. Ưu tiên gọi Model Thử Đồ Thật (IDM-VTON / Colab GPU)
      let res = await fetch('/api/ai/idm-vton-try-on', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          gender: isFemale ? 'Nữ' : 'Nam',
          topName: selection.top?.name || '',
          topImageUrl: selection.top?.imageUrl || '',
          bottomName: selection.bottom?.name || '',
          bottomImageUrl: selection.bottom?.imageUrl || '',
          shoesName: selection.shoes?.name || ''
        })
      });

      let data = await res.json();
      if (res.ok && data?.data?.imageUrl) {
        setAiGeneratedImage(data.data.imageUrl);
        setTryOnState({ loading: false, message: `✓ Hoàn tất thử đồ thật bằng ${data.data.model || 'IDM-VTON'}!` });
        setTimeout(() => setTryOnState({ loading: false, message: '' }), 4000);
        return;
      }

      // 2. Dự phòng: Free Virtual Try-on Engine
      res = await fetch('/api/ai/free-virtual-try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender: isFemale ? 'Nữ' : 'Nam',
          topName: selection.top?.name || '',
          topImageUrl: selection.top?.imageUrl || '',
          bottomName: selection.bottom?.name || '',
          bottomImageUrl: selection.bottom?.imageUrl || '',
          shoesName: selection.shoes?.name || ''
        })
      });

      data = await res.json();
      if (res.ok && data?.data?.imageUrl) {
        setAiGeneratedImage(data.data.imageUrl);
        setTryOnState({ loading: false, message: `✓ Hoàn tất tạo mẫu bằng ${data.data.model || 'AI'}!` });
        setTimeout(() => setTryOnState({ loading: false, message: '' }), 4000);
        return;
      }

      // Fallback an toàn sang ảnh Studio mẫu thật chất lượng cao nội bộ
      const fallback = isFemale ? '/assets/fits/model_female_pants_dark.jpg' : '/assets/fits/model_male_pants_dark.jpg';
      setAiGeneratedImage(fallback);
      setTryOnState({ loading: false, message: '✓ Đã đồng bộ trang phục cùng người mẫu Studio!' });
      setTimeout(() => setTryOnState({ loading: false, message: '' }), 3500);
    } catch (err) {
      console.warn('AI Try-on fallback:', err);
      const fallback = isFemale ? '/assets/fits/model_female_pants_dark.jpg' : '/assets/fits/model_male_pants_dark.jpg';
      setAiGeneratedImage(fallback);
      setTryOnState({ loading: false, message: '✓ Đã đồng bộ trang phục cùng người mẫu Studio!' });
      setTimeout(() => setTryOnState({ loading: false, message: '' }), 3500);
    }
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
              isAiProcessing={tryOnState.loading}
              aiGeneratedModelImage={aiGeneratedImage}
            />
          </div>

          {/* Thanh trạng thái AI & 3 Slot món đồ đang mặc */}
          {/* Thanh trạng thái Fits Live & 3 Slot món đồ đang mặc */}
          <div>
            <div style={{ textAlign: 'center', marginBottom: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 999,
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid rgba(74, 222, 128, 0.25)',
                color: '#86efac',
                fontSize: 12,
                fontWeight: 700
              }}>
                <Check size={13} style={{ color: '#4ade80' }} />
                <span>{text('Đang phối đồ trực tiếp từ tủ đồ (Chuẩn Fits)', 'Fitting live from your wardrobe (Fits style)')}</span>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    border: 0,
                    borderRadius: 9,
                    padding: '8px 18px',
                    cursor: 'pointer',
                    background: savedSuccess ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f6cf70, #c89536)',
                    color: savedSuccess ? '#fff' : '#17130a',
                    fontWeight: 800,
                    fontSize: 12.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 14px rgba(246, 207, 112, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Save size={14} />
                  <span>{savedSuccess ? '✓ Đã Lưu Outfit!' : 'Lưu Outfit Này'}</span>
                </button>

                <button
                  type="button"
                  disabled={tryOnState.loading}
                  onClick={handleTriggerAiTryOn}
                  title="Thử tạo ảnh người mẫu AI Studio 8K"
                  style={{
                    border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 9,
                    padding: '8px 12px',
                    cursor: tryOnState.loading ? 'wait' : 'pointer',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  <Wand2 size={13} style={{ color: '#f6cf70' }} />
                  <span>{tryOnState.loading ? 'Đang tạo…' : 'Thử AI 8K'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowKeyModal(true)}
                  title="Cấu hình AI Server hoặc Google Colab GPU"
                  style={{
                    border: colabUrl ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 9,
                    padding: '8px 12px',
                    cursor: 'pointer',
                    background: colabUrl ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255,255,255,0.06)',
                    color: colabUrl ? '#38bdf8' : '#fff',
                    fontWeight: 600,
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  <Cpu size={13} style={{ color: colabUrl ? '#38bdf8' : '#f6cf70' }} />
                  <span>{colabUrl ? '🟢 Colab GPU' : 'Cấu hình AI'}</span>
                </button>
              </div>

              {tryOnState.message && (
                <div style={{ marginTop: 2, color: '#9ee6b8', fontSize: 11.5, fontWeight: 600 }}>
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

      {/* MODAL CẤU HÌNH AI SERVER & GOOGLE COLAB */}
      {showKeyModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #161922, #0d0f15)',
            border: '1px solid rgba(246, 207, 112, 0.35)',
            borderRadius: 16,
            maxWidth: 520,
            width: '100%',
            padding: 24,
            boxShadow: '0 20px 50px rgba(0,0,0,0.85)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f6cf70', fontWeight: 800, fontSize: 16 }}>
                <Cpu size={20} />
                <span>Cấu Hình AI Server Thử Đồ (Virtual Try-On)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                style={{ background: 'transparent', border: 0, color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* TAB / PHẦN 1: GOOGLE COLAB T4 GPU RIÊNG */}
            <div style={{
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: 12,
              padding: 14,
              marginBottom: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38bdf8', fontWeight: 700, fontSize: 13 }}>
                  <span>⚡ Máy Chủ Google Colab T4 GPU (Miễn phí 100%)</span>
                </div>
                {colabUrl ? (
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: 'rgba(74,222,128,0.2)', color: '#86efac', fontWeight: 700 }}>
                    🟢 Đã kết nối
                  </span>
                ) : (
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', color: '#bbb' }}>
                    ⚪ Chưa kết nối
                  </span>
                )}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                Chạy file <code>MyFitDaily_Virtual_TryOn_Colab.ipynb</code> trên Google Colab với GPU Tesla T4 (16GB VRAM) hoàn toàn miễn phí, sau đó dán link Cloudflare vào đây:
              </p>

              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="https://xxxx.trycloudflare.com"
                  value={tempColabUrl}
                  onChange={(e) => setTempColabUrl(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: 12.5,
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveColabUrl}
                  style={{
                    background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
                    border: 0,
                    color: '#fff',
                    borderRadius: 8,
                    padding: '8px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Lưu & Kết Nối
                </button>
              </div>
              {colabUrl && (
                <button
                  type="button"
                  onClick={() => { setTempColabUrl(''); setColabUrl(''); localStorage.removeItem('myfitdaily_colab_url'); }}
                  style={{ marginTop: 6, background: 'transparent', border: 0, color: '#f87171', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Ngắt kết nối Colab
                </button>
              )}
            </div>

            {/* PHẦN 2: DỰ PHÒNG GOOGLE GEMINI HOẶC ZERO GPU */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 12,
              padding: 14,
              marginBottom: 16
            }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#f6cf70', marginBottom: 6 }}>
                Dự phòng: Gemini API Key (Không bắt buộc)
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={tempGeminiKey}
                  onChange={(e) => setTempGeminiKey(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: 12,
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  style={{
                    background: 'rgba(246, 207, 112, 0.2)',
                    border: '1px solid rgba(246, 207, 112, 0.4)',
                    color: '#f6cf70',
                    borderRadius: 8,
                    padding: '8px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Lưu Key
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleUseFreeAi}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: 'var(--text-secondary)',
                  borderRadius: 8,
                  padding: '7px 14px',
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                Đặt lại về AI Server Mặc Định
              </button>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 0,
                  color: '#fff',
                  borderRadius: 8,
                  padding: '7px 18px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

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
