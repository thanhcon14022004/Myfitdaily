import React, { useMemo, useState } from 'react';
import { Check, RotateCcw, Save, Sparkles, UserRound, Wand2, Key, X, ShieldCheck } from 'lucide-react';
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

  const handleTriggerAiTryOn = async () => {
    const geminiKey = geminiApiKey || localStorage.getItem('myfitdaily_gemini_key');
    const isFemale = user?.gender?.toLowerCase() === 'nữ' || user?.gender?.toLowerCase() === 'female';

    setTryOnState({ loading: true, message: 'Model AI đang phân tích trang phục và render người mẫu 8K…' });

    try {
      let res;
      if (geminiKey) {
        res = await fetch('/api/ai/gemini-virtual-try-on', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Gemini-Key': geminiKey
          },
          body: JSON.stringify({
            gender: isFemale ? 'Nữ' : 'Nam',
            topName: selection.top?.name || '',
            topDescription: selection.top?.description || selection.top?.name || '',
            topImageUrl: selection.top?.imageUrl || '',
            bottomName: selection.bottom?.name || '',
            bottomDescription: selection.bottom?.description || selection.bottom?.name || '',
            bottomImageUrl: selection.bottom?.imageUrl || '',
            shoesName: selection.shoes?.name || '',
            shoesDescription: selection.shoes?.description || selection.shoes?.name || ''
          })
        });
      } else {
        // Free AI Virtual Try-on Engine (FLUX.1)
        res = await fetch('/api/ai/free-virtual-try-on', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gender: isFemale ? 'Nữ' : 'Nam',
            topName: selection.top?.name || '',
            topDescription: selection.top?.description || selection.top?.name || '',
            bottomName: selection.bottom?.name || '',
            bottomDescription: selection.bottom?.description || selection.bottom?.name || '',
            shoesName: selection.shoes?.name || '',
            shoesDescription: selection.shoes?.description || selection.shoes?.name || ''
          })
        });
      }

      const data = await res.json();
      if (res.ok && data?.data?.imageUrl) {
        const img = new Image();
        img.src = data.data.imageUrl;
        img.onload = () => {
          setAiGeneratedImage(data.data.imageUrl);
          setTryOnState({ loading: false, message: `✓ Hoàn tất tạo mẫu bằng ${data.data.model || 'AI'}!` });
          setTimeout(() => setTryOnState({ loading: false, message: '' }), 4000);
        };
        img.onerror = () => {
          setAiGeneratedImage(data.data.imageUrl);
          setTryOnState({ loading: false, message: '✓ Hoàn tất tạo mẫu thời trang với AI!' });
          setTimeout(() => setTryOnState({ loading: false, message: '' }), 3000);
        };
        return;
      } else {
        // Fallback trực tiếp URL nếu API backend có vấn đề
        const prompt = `Full body studio fashion lookbook editorial photograph of a Vietnamese ${isFemale ? 'female' : 'male'} model wearing ${selection.top?.name || 'casual top'}, ${selection.bottom?.name || 'tailored pants'}, ${selection.shoes?.name || 'sneakers'}, dark luxury charcoal studio background, 8k`;
        const directUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=1024&seed=${Date.now()}&nologo=true&model=flux`;
        setAiGeneratedImage(directUrl);
        setTryOnState({ loading: false, message: '✓ Đã tạo mẫu thời trang bằng AI FLUX (Free)!' });
        setTimeout(() => setTryOnState({ loading: false, message: '' }), 3500);
      }
    } catch (err) {
      console.warn('AI Try-on fallback:', err);
      const prompt = `Full body studio fashion lookbook editorial photograph of a Vietnamese ${isFemale ? 'female' : 'male'} model wearing ${selection.top?.name || 'casual top'}, ${selection.bottom?.name || 'tailored pants'}, ${selection.shoes?.name || 'sneakers'}, dark luxury charcoal studio background, 8k`;
      const directUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=1024&seed=${Date.now()}&nologo=true&model=flux`;
      setAiGeneratedImage(directUrl);
      setTryOnState({ loading: false, message: '✓ Đã tạo mẫu thời trang bằng AI FLUX (Free)!' });
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
          <div>
            <div style={{ textAlign: 'center', marginBottom: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
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
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 16px rgba(246, 207, 112, 0.25)'
                  }}
                >
                  <Wand2 size={15} />
                  {tryOnState.loading ? 'Đang thử đồ…' : 'Thử đồ AI'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowKeyModal(true)}
                  title={fashnApiKey ? 'Đã cấu hình FASHN API Key' : 'Cấu hình FASHN API Key để Render AI thực tế'}
                  style={{
                    border: fashnApiKey ? '1px solid rgba(246,207,112,0.6)' : '1px solid rgba(255,255,255,0.15)',
                    background: fashnApiKey ? 'rgba(246,207,112,0.12)' : 'rgba(255,255,255,0.06)',
                    color: fashnApiKey ? '#f6cf70' : 'var(--text-muted)',
                    borderRadius: 9,
                    padding: '9px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Key size={15} />
                </button>
              </div>

              {tryOnState.message && (
                <div style={{ marginTop: 4, color: '#9ee6b8', fontSize: 12, fontWeight: 600 }}>
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

      {/* MODAL CẤU HÌNH GOOGLE GEMINI (IMAGEN 3) API KEY */}
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
            maxWidth: 480,
            width: '100%',
            padding: 24,
            boxShadow: '0 20px 50px rgba(0,0,0,0.85)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f6cf70', fontWeight: 800, fontSize: 16 }}>
                <Sparkles size={18} />
                <span>Render AI: Google Gemini (Imagen)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                style={{ background: 'transparent', border: 0, color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
              Để AI tự động vẽ và render người mẫu thật diện nguyên set đồ với ánh sáng studio 8K, vui lòng nhập <strong>Google Gemini API Key</strong>.
            </p>

            <div style={{
              background: 'rgba(246, 207, 112, 0.08)',
              border: '1px solid rgba(246, 207, 112, 0.2)',
              borderRadius: 10,
              padding: '10px 12px',
              fontSize: 12,
              marginBottom: 16,
              color: '#f6cf70'
            }}>
              💡 Bạn có thể tạo API Key hoàn toàn miễn phí tại{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#fff', textDecoration: 'underline', fontWeight: 700 }}
              >
                Google AI Studio (aistudio.google.com)
              </a>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                Gemini API Key (AIzaSy...):
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempGeminiKey}
                onChange={(e) => setTempGeminiKey(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  color: '#fff',
                  fontSize: 13,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Key được lưu an toàn trong máy cá nhân (localStorage) và gửi trực tiếp qua Header bảo mật.
              </span>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setShowKeyModal(false);
                  setTryOnState({ loading: true, message: 'Đang áp dụng ướm thử 2D Dynamic tức thì…' });
                  setTimeout(() => {
                    setTryOnState({ loading: false, message: '✓ Đã đồng bộ trang phục lên người mẫu!' });
                    setTimeout(() => setTryOnState({ loading: false, message: '' }), 2500);
                  }, 800);
                }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-secondary)',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Dùng 2D Fit (Không cần Key)
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                style={{
                  background: 'linear-gradient(135deg, #f6cf70, #c89536)',
                  border: 0,
                  color: '#17130a',
                  borderRadius: 8,
                  padding: '8px 18px',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Lưu & Bắt Đầu Thử AI
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
