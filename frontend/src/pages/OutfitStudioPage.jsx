import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Plus, 
  Heart, 
  Check, 
  Trash2, 
  Shirt, 
  RotateCcw,
  Footprints, 
  Watch,
  Wind,
  Sliders,
  Save,
  User,
  Ruler,
  ChevronRight,
  X,
  Tag
} from 'lucide-react';
import OutfitCard from '../components/OutfitCard';
import VirtualMannequin from '../components/VirtualMannequin';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { useLanguage } from '../context/LanguageContext';
import { sanitizeClothesForGender, getInitialClothesForGender } from '../data/initialWardrobe';

export default function OutfitStudioPage({ 
  clothes, 
  outfits, 
  onSaveOutfit, 
  onToggleFavorite, 
  onDeleteOutfit,
  onDeleteClothing,
  onNavigate,
  user
}) {
  const { text, isEnglish } = useLanguage();
  const isMale = user?.gender?.toLowerCase() === 'nam' || user?.gender?.toLowerCase() === 'male';
  const availableClothes = (clothes && clothes.length > 0) ? clothes : getInitialClothesForGender(user?.gender);
  const effectiveClothes = isMale ? sanitizeClothesForGender(availableClothes, user?.gender) : availableClothes;

  const [deleteModalItem, setDeleteModalItem] = useState(null);

  // Chế độ xem: 'mannequin' (Người Mẫu 2D Thử Đồ Trực Tiếp) | 'flatlay' (Sàn phẳng)
  const [studioMode, setStudioMode] = useState('mannequin');

  // Mặc định chọn ngay bộ 3 món Streetwear từ Mobile: Sweatshirt Navy Frozen.HN + Trackpants + Sneaker
  const defaultTop = effectiveClothes.find(c => c.id === 100 || c.imageUrl?.includes('sweatshirt_frozen_navy')) 
    || effectiveClothes.find(c => c.categoryId === 1) 
    || null;
  const defaultBottom = effectiveClothes.find(c => c.id === 107 || c.imageUrl?.includes('trackpants_stripe_black')) 
    || effectiveClothes.find(c => isMale ? c.categoryId === 2 : (c.categoryId === 2 || c.categoryId === 3)) 
    || null;
  const defaultShoes = effectiveClothes.find(c => c.id === 109 || c.imageUrl?.includes('sneakers_white_black')) 
    || effectiveClothes.find(c => c.categoryId === 5) 
    || null;

  // Flat-Lay & Try-On Garment Slots
  const [selectedTop, setSelectedTop] = useState(defaultTop);
  const [selectedOuter, setSelectedOuter] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(defaultBottom);
  const [selectedShoes, setSelectedShoes] = useState(defaultShoes);
  const [selectedAccessory, setSelectedAccessory] = useState(null);

  // Active drawer filter tab
  const [drawerCategory, setDrawerCategory] = useState('Tops'); // 'Tops' | 'Outerwear' | 'Bottoms' | 'Shoes' | 'Accessories'

  const [outfitName, setOutfitName] = useState('');
  const [outfitOccasion, setOutfitOccasion] = useState('Casual');
  const [outfitDescription, setOutfitDescription] = useState('');

  // Lookbook filter
  const [outfitFilter, setOutfitFilter] = useState('all');

  const filteredOutfits = outfits.filter(o => {
    if (outfitFilter === 'fav') return o.isFavorite;
    if (outfitFilter === 'ai') return o.createdByAi;
    return true;
  });

  const drawerItems = effectiveClothes.filter(c => {
    if (drawerCategory === 'Tops') return c.categoryId === 1;
    if (drawerCategory === 'Outerwear') return c.categoryId === 4;
    if (drawerCategory === 'Bottoms') return isMale ? c.categoryId === 2 : (c.categoryId === 2 || c.categoryId === 3);
    if (drawerCategory === 'Shoes') return c.categoryId === 5;
    if (drawerCategory === 'Accessories') return c.categoryId === 6;
    return true;
  });

  const handleSelectItem = (item) => {
    if (drawerCategory === 'Tops') setSelectedTop(item);
    else if (drawerCategory === 'Outerwear') setSelectedOuter(item);
    else if (drawerCategory === 'Bottoms') setSelectedBottom(item);
    else if (drawerCategory === 'Shoes') setSelectedShoes(item);
    else if (drawerCategory === 'Accessories') setSelectedAccessory(item);
  };

  const handleApplyStreetwearSet = () => {
    const swTop = effectiveClothes.find(c => c.id === 100 || c.imageUrl?.includes('sweatshirt_frozen_navy')) || effectiveClothes.find(c => c.categoryId === 1);
    const swBottom = effectiveClothes.find(c => c.id === 107 || c.imageUrl?.includes('trackpants_stripe_black')) || effectiveClothes.find(c => c.categoryId === 2);
    const swShoes = effectiveClothes.find(c => c.id === 109 || c.imageUrl?.includes('sneakers_white_black')) || effectiveClothes.find(c => c.categoryId === 5);
    
    if (swTop) setSelectedTop(swTop);
    if (swBottom) setSelectedBottom(swBottom);
    if (swShoes) setSelectedShoes(swShoes);
    setSelectedOuter(null);
    setSelectedAccessory(null);
    setOutfitName('Streetwear Frozen.HN Trẻ Trung');
    setOutfitOccasion('Casual');
    setOutfitDescription('Set đồ Streetwear Mobile gồm Áo Sweatshirt Navy Frozen.HN + Quần Trackpants sọc trắng + Giày Retro Classic.');
  };

  const handleApplySmartCasualSet = () => {
    const scTop = effectiveClothes.find(c => c.id === 101 || c.name?.includes('Oxford')) || effectiveClothes.find(c => c.categoryId === 1);
    const scOuter = effectiveClothes.find(c => c.categoryId === 4);
    const scBottom = effectiveClothes.find(c => c.id === 103 || c.name?.includes('tây') || c.name?.includes('âu')) || effectiveClothes.find(c => c.categoryId === 2);
    const scShoes = effectiveClothes.find(c => c.id === 108 || c.name?.includes('Loafer')) || effectiveClothes.find(c => c.categoryId === 5);
    
    if (scTop) setSelectedTop(scTop);
    if (scOuter) setSelectedOuter(scOuter);
    if (scBottom) setSelectedBottom(scBottom);
    if (scShoes) setSelectedShoes(scShoes);
    setSelectedAccessory(null);
    setOutfitName('Thanh Lịch Quý Ông Thứ Hai');
    setOutfitOccasion('Work');
  };

  const handleApplyWeekendSet = () => {
    const wTop = effectiveClothes.find(c => c.id === 102 || c.name?.includes('thun')) || effectiveClothes.find(c => c.categoryId === 1);
    const wBottom = effectiveClothes.find(c => c.id === 104 || c.name?.includes('Jeans')) || effectiveClothes.find(c => c.categoryId === 2);
    const wShoes = effectiveClothes.find(c => c.id === 109 || c.name?.includes('Sneaker')) || effectiveClothes.find(c => c.categoryId === 5);
    const wAcc = effectiveClothes.find(c => c.categoryId === 6);

    if (wTop) setSelectedTop(wTop);
    if (wBottom) setSelectedBottom(wBottom);
    if (wShoes) setSelectedShoes(wShoes);
    if (wAcc) setSelectedAccessory(wAcc);
    setSelectedOuter(null);
    setOutfitName('Weekend Coffee Chill');
    setOutfitOccasion('Casual');
  };

  const handleConfirmDeleteClothing = async (id) => {
    if (onDeleteClothing) {
      await onDeleteClothing(id);
    }
    if (selectedTop?.id === id) setSelectedTop(null);
    if (selectedOuter?.id === id) setSelectedOuter(null);
    if (selectedBottom?.id === id) setSelectedBottom(null);
    if (selectedShoes?.id === id) setSelectedShoes(null);
    if (selectedAccessory?.id === id) setSelectedAccessory(null);
    setDeleteModalItem(null);
  };

  const handleSaveOutfit = (e) => {
    e.preventDefault();
    if (!outfitName.trim()) {
      alert("Vui lòng đặt tên cho bộ phối đồ!");
      return;
    }

    const itemIds = [
      selectedTop?.id,
      selectedOuter?.id,
      selectedBottom?.id,
      selectedShoes?.id,
      selectedAccessory?.id
    ].filter(Boolean);

    if (itemIds.length === 0) {
      alert("Vui lòng chọn ít nhất một món đồ vào sàn phối!");
      return;
    }

    const newOutfit = {
      id: Date.now(),
      name: outfitName.trim(),
      occasion: outfitOccasion,
      season: 'AllSeason',
      isFavorite: false,
      createdByAi: false,
      itemIds: itemIds,
      description: outfitDescription.trim() || `Bộ phối đồ phong cách ${outfitOccasion} tạo tại Atelier Studio.`
    };

    onSaveOutfit(newOutfit);
    setOutfitName('');
    setOutfitDescription('');
    alert("🎉 Đã lưu bộ phối đồ vào bộ sưu tập của bạn!");
  };

  return (
    <div className="container" style={{ padding: '36px 24px 90px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-indigo">Virtual Atelier</span>
          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            {text('✦ Sàn Diễn Phối Đồ Kỹ Thuật Số', '✦ Digital Styling Runway')}
          </span>
        </div>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
          {text('Atelier Studio', 'Atelier Studio')} <span className="gradient-text">& Mix-Match</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem' }}>
          {text(
            'Thử nghiệm kết hợp các món đồ theo bố cục Flat-Lay, kiểm tra độ hài hòa màu sắc trước khi diện ra phố.',
            'Experiment combining garments on the Flat-Lay canvas, verify color harmony before heading out.'
          )}
        </p>
      </div>

      {/* 2-Column Atelier Layout: Left = Flat-Lay Mannequin Canvas, Right = Wardrobe Drawer */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(360px, 1.3fr) minmax(320px, 1fr)',
        gap: '32px',
        marginBottom: '64px',
      }}>
        {/* Left Column: Visual Canvas */}
        <div className="glass-card" style={{
          padding: '30px',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          background: 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.1) 0%, rgba(14, 18, 27, 0.95) 75%)',
        }}>
          {/* Canvas Mode Switcher & Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#D4AF37" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {studioMode === 'mannequin' 
                  ? text('Phòng Thử Đồ Người Mẫu 2D (Lookbook)', '2D Human Model Live Fitting') 
                  : text('Sàn Phối Đồ Flat-Lay', 'Flat-Lay Studio Canvas')}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.06)', padding: '4px', borderRadius: 'var(--radius-full)' }}>
              <button
                type="button"
                onClick={() => setStudioMode('mannequin')}
                style={{
                  background: studioMode === 'mannequin' ? 'linear-gradient(135deg, #D4AF37, #F3D98A)' : 'transparent',
                  color: studioMode === 'mannequin' ? '#080A0F' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                💃 {text('Người Mẫu 2D (Thử Đồ Trực Tiếp)', '2D Human Model (Live Fitting)')}
              </button>

              <button
                type="button"
                onClick={() => setStudioMode('flatlay')}
                style={{
                  background: studioMode === 'flatlay' ? 'linear-gradient(135deg, #D4AF37, #C27D5E)' : 'transparent',
                  color: studioMode === 'flatlay' ? '#080A0F' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                🖼️ {text('Sàn Flat-Lay', 'Flat-Lay Canvas')}
              </button>
            </div>
          </div>

          {/* Quick Outfit Presets Bar (Set phối sẵn 1-click) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            overflowX: 'auto',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            width: '100%'
          }}>
            <span style={{ fontSize: '0.74rem', color: '#D4AF37', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
              <Sparkles size={14} color="#D4AF37" /> {text('Mặc Thử Nhanh:', 'Quick Try-On:')}
            </span>
            <button
              type="button"
              onClick={handleApplyStreetwearSet}
              style={{
                background: (selectedTop?.imageUrl?.includes('sweatshirt_frozen_navy') && selectedBottom?.imageUrl?.includes('trackpants_stripe_black')) 
                  ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.35), rgba(194, 125, 94, 0.35))'
                  : 'rgba(212, 175, 55, 0.12)',
                border: (selectedTop?.imageUrl?.includes('sweatshirt_frozen_navy') && selectedBottom?.imageUrl?.includes('trackpants_stripe_black'))
                  ? '1px solid #D4AF37'
                  : '1px solid rgba(212, 175, 55, 0.3)',
                color: '#FDE68A',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: (selectedTop?.imageUrl?.includes('sweatshirt_frozen_navy') && selectedBottom?.imageUrl?.includes('trackpants_stripe_black'))
                  ? '0 0 12px rgba(212, 175, 55, 0.25)'
                  : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span>🔥</span>
              <span>{text('Set Streetwear Mobile (Sweatshirt + Trackpants + Sneaker)', 'Mobile Streetwear Set')}</span>
            </button>
            <button
              type="button"
              onClick={handleApplySmartCasualSet}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-secondary)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>👔</span>
              <span>{text('Quý Ông Lịch Lãm', 'Smart Casual')}</span>
            </button>
            <button
              type="button"
              onClick={handleApplyWeekendSet}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-secondary)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>☕</span>
              <span>{text('Weekend Chill', 'Weekend Chill')}</span>
            </button>
          </div>

          {/* Missing body metrics warning banner if user hasn't set custom dimensions */}
          {(!user?.height || !user?.weight) && onNavigate && (
            <div style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.76rem',
              gap: '8px'
            }}>
              <span style={{ color: '#F3D98A' }}>
                💡 Bạn đang xem mô hình người mẫu mặc định (165cm, 52kg). Hãy cập nhật số đo riêng để người ảo co giãn chuẩn vóc dáng của bạn!
              </span>
              <button
                onClick={() => onNavigate('profile')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFF',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  whiteSpace: 'nowrap'
                }}
              >
                Cập nhật số đo →
              </button>
            </div>
          )}

          {/* MODE 1: 2D HUMAN MODEL LIVE FITTING ROOM */}
          {studioMode === 'mannequin' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
              <VirtualMannequin
                user={user}
                top={selectedTop}
                outer={selectedOuter}
                bottom={selectedBottom}
                shoes={selectedShoes}
                accessory={selectedAccessory}
              />
            </div>
          )}

          {/* Shared Outfit Layers Strip & Total Price Banner for Lookbook & Mannequin */}
          {(studioMode === 'lookbook' || studioMode === 'mannequin') && (
            <div style={{ width: '100%', marginBottom: '24px' }}>

              {/* Quick Slot Selection & Remove Strip under Mannequin */}
              <div style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))',
                gap: '8px',
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(7, 10, 17, 0.75)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                {/* Top chip */}
                <div style={{
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: drawerCategory === 'Tops' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: drawerCategory === 'Tops' ? '1px solid var(--primary)' : '1px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }} onClick={() => setDrawerCategory('Tops')}>
                  <span style={{ fontSize: '0.62rem', color: '#FDA4AF', fontWeight: 800 }}>ÁO (TOP)</span>
                  <span style={{ fontSize: '0.72rem', color: '#FFF', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90px' }}>
                    {selectedTop ? selectedTop.name : '+ Chọn Áo'}
                  </span>
                  {selectedTop && (
                    <span style={{ fontSize: '0.66rem', color: '#FDE68A', fontWeight: 700, marginTop: '2px' }}>
                      {selectedTop.priceFormatted || '263K'}
                    </span>
                  )}
                  {selectedTop && (
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setSelectedTop(null); }}
                      style={{ marginTop: '3px', background: 'none', border: 'none', color: '#EF4444', fontSize: '0.65rem', cursor: 'pointer' }}
                    >
                      ✕ Gỡ
                    </button>
                  )}
                </div>

                {/* Outer chip */}
                <div style={{
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: drawerCategory === 'Outerwear' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: drawerCategory === 'Outerwear' ? '1px solid var(--primary)' : '1px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }} onClick={() => setDrawerCategory('Outerwear')}>
                  <span style={{ fontSize: '0.62rem', color: '#C084FC', fontWeight: 800 }}>KHOÁC</span>
                  <span style={{ fontSize: '0.72rem', color: '#FFF', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90px' }}>
                    {selectedOuter ? selectedOuter.name : '+ Chọn Khoác'}
                  </span>
                  {selectedOuter && (
                    <span style={{ fontSize: '0.66rem', color: '#FDE68A', fontWeight: 700, marginTop: '2px' }}>
                      {selectedOuter.priceFormatted || '580K'}
                    </span>
                  )}
                  {selectedOuter && (
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setSelectedOuter(null); }}
                      style={{ marginTop: '3px', background: 'none', border: 'none', color: '#EF4444', fontSize: '0.65rem', cursor: 'pointer' }}
                    >
                      ✕ Gỡ
                    </button>
                  )}
                </div>

                {/* Bottom chip */}
                <div style={{
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: drawerCategory === 'Bottoms' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: drawerCategory === 'Bottoms' ? '1px solid var(--primary)' : '1px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }} onClick={() => setDrawerCategory('Bottoms')}>
                  <span style={{ fontSize: '0.62rem', color: '#818CF8', fontWeight: 800 }}>{isMale ? 'QUẦN' : 'QUẦN/ĐẦM'}</span>
                  <span style={{ fontSize: '0.72rem', color: '#FFF', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90px' }}>
                    {selectedBottom ? selectedBottom.name : (isMale ? '+ Chọn Quần' : '+ Chọn Đồ')}
                  </span>
                  {selectedBottom && (
                    <span style={{ fontSize: '0.66rem', color: '#FDE68A', fontWeight: 700, marginTop: '2px' }}>
                      {selectedBottom.priceFormatted || '220K'}
                    </span>
                  )}
                  {selectedBottom && (
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setSelectedBottom(null); }}
                      style={{ marginTop: '3px', background: 'none', border: 'none', color: '#EF4444', fontSize: '0.65rem', cursor: 'pointer' }}
                    >
                      ✕ Gỡ
                    </button>
                  )}
                </div>

                {/* Shoes chip */}
                <div style={{
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: drawerCategory === 'Shoes' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: drawerCategory === 'Shoes' ? '1px solid var(--primary)' : '1px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }} onClick={() => setDrawerCategory('Shoes')}>
                  <span style={{ fontSize: '0.62rem', color: '#34D399', fontWeight: 800 }}>GIÀY</span>
                  <span style={{ fontSize: '0.72rem', color: '#FFF', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90px' }}>
                    {selectedShoes ? selectedShoes.name : '+ Chọn Giày'}
                  </span>
                  {selectedShoes && (
                    <span style={{ fontSize: '0.66rem', color: '#FDE68A', fontWeight: 700, marginTop: '2px' }}>
                      {selectedShoes.priceFormatted || '450K'}
                    </span>
                  )}
                  {selectedShoes && (
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setSelectedShoes(null); }}
                      style={{ marginTop: '3px', background: 'none', border: 'none', color: '#EF4444', fontSize: '0.65rem', cursor: 'pointer' }}
                    >
                      ✕ Gỡ
                    </button>
                  )}
                </div>

                {/* Accessory chip */}
                <div style={{
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: drawerCategory === 'Accessories' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: drawerCategory === 'Accessories' ? '1px solid var(--primary)' : '1px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }} onClick={() => setDrawerCategory('Accessories')}>
                  <span style={{ fontSize: '0.62rem', color: '#FBBF24', fontWeight: 800 }}>PHỤ KIỆN</span>
                  <span style={{ fontSize: '0.72rem', color: '#FFF', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90px' }}>
                    {selectedAccessory ? selectedAccessory.name : '+ Chọn Túi'}
                  </span>
                  {selectedAccessory && (
                    <span style={{ fontSize: '0.66rem', color: '#FDE68A', fontWeight: 700, marginTop: '2px' }}>
                      {selectedAccessory.priceFormatted || '250K'}
                    </span>
                  )}
                  {selectedAccessory && (
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setSelectedAccessory(null); }}
                      style={{ marginTop: '3px', background: 'none', border: 'none', color: '#EF4444', fontSize: '0.65rem', cursor: 'pointer' }}
                    >
                      ✕ Gỡ
                    </button>
                  )}
                </div>
              </div>

              {/* Total Set Price Banner with Lookbook Pricing */}
              {(selectedTop || selectedBottom || selectedShoes || selectedOuter) && (
                <div style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.18), rgba(194, 125, 94, 0.12))',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#F3D98A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Tag size={13} color="#D4AF37" />
                      <span>{text('Tổng Giá Set Đang Thử:', 'Total Outfit Price:')}</span>
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
                      {((selectedTop?.price || 263000) + (selectedBottom?.price || 220000) + (selectedShoes ? (selectedShoes.price || 450000) : 0)).toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                  <a
                    href={(selectedTop?.affiliateUrl || selectedBottom?.affiliateUrl || 'https://shopee.vn')}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      background: 'linear-gradient(135deg, #EE4D2D, #FF7337)',
                      color: '#FFF',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(238, 77, 45, 0.35)'
                    }}
                  >
                    🛒 Mua Nguyên Set
                  </a>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: FLAT-LAY SLOTS GRID */}
          {studioMode === 'flatlay' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '14px',
              marginBottom: '28px',
            }}>
              {/* Slot 1: Top */}
              <div 
                onClick={() => setDrawerCategory('Tops')}
                style={{
                  background: 'rgba(7, 10, 17, 0.7)',
                  border: drawerCategory === 'Tops' ? '2px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <span className="badge badge-rose" style={{ fontSize: '0.62rem', marginBottom: '6px' }}>ÁO (TOP)</span>
                {selectedTop ? (
                  <div>
                    <img src={selectedTop.imageUrl} alt="" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', marginBottom: '6px' }} />
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFF' }}>{selectedTop.name}</div>
                  </div>
                ) : (
                  <div style={{ height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    + Chọn Áo
                  </div>
                )}
              </div>

              {/* Slot 2: Outerwear */}
              <div 
                onClick={() => setDrawerCategory('Outerwear')}
                style={{
                  background: 'rgba(7, 10, 17, 0.7)',
                  border: drawerCategory === 'Outerwear' ? '2px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <span className="badge badge-purple" style={{ fontSize: '0.62rem', marginBottom: '6px' }}>ÁO KHOÁC</span>
                {selectedOuter ? (
                  <div>
                    <img src={selectedOuter.imageUrl} alt="" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', marginBottom: '6px' }} />
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFF' }}>{selectedOuter.name}</div>
                  </div>
                ) : (
                  <div style={{ height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    + Chọn Áo Khoác
                  </div>
                )}
              </div>

              {/* Slot 3: Bottom */}
              <div 
                onClick={() => setDrawerCategory('Bottoms')}
                style={{
                  background: 'rgba(7, 10, 17, 0.7)',
                  border: drawerCategory === 'Bottoms' ? '2px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <span className="badge badge-indigo" style={{ fontSize: '0.62rem', marginBottom: '6px' }}>{isMale ? 'QUẦN (BOTTOM)' : 'QUẦN / ĐẦM'}</span>
                {selectedBottom ? (
                  <div>
                    <img src={selectedBottom.imageUrl} alt="" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', marginBottom: '6px' }} />
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFF' }}>{selectedBottom.name}</div>
                  </div>
                ) : (
                  <div style={{ height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    + Chọn {isMale ? 'Quần' : 'Quần/Đầm'}
                  </div>
                )}
              </div>

              {/* Slot 4: Shoes */}
              <div 
                onClick={() => setDrawerCategory('Shoes')}
                style={{
                  background: 'rgba(7, 10, 17, 0.7)',
                  border: drawerCategory === 'Shoes' ? '2px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <span className="badge badge-emerald" style={{ fontSize: '0.62rem', marginBottom: '6px' }}>GIÀY DÉP</span>
                {selectedShoes ? (
                  <div>
                    <img src={selectedShoes.imageUrl} alt="" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', marginBottom: '6px' }} />
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFF' }}>{selectedShoes.name}</div>
                  </div>
                ) : (
                  <div style={{ height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    + Chọn Giày
                  </div>
                )}
              </div>

              {/* Slot 5: Accessories */}
              <div 
                onClick={() => setDrawerCategory('Accessories')}
                style={{
                  background: 'rgba(7, 10, 17, 0.7)',
                  border: drawerCategory === 'Accessories' ? '2px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <span className="badge badge-gold" style={{ fontSize: '0.62rem', marginBottom: '6px' }}>PHỤ KIỆN</span>
                {selectedAccessory ? (
                  <div>
                    <img src={selectedAccessory.imageUrl} alt="" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', marginBottom: '6px' }} />
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFF' }}>{selectedAccessory.name}</div>
                  </div>
                ) : (
                  <div style={{ height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    + Chọn Túi / Kính
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Save Outfit Form */}
          <form onSubmit={handleSaveOutfit} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                  {text('Đặt Tên Bộ Phối Đồ *', 'Outfit Name *')}
                </label>
                <input
                  type="text"
                  placeholder={text('Ví dụ: Set Cafe Chiều Thu, Đi Làm Thứ 2...', 'e.g., Autumn Coffee Look, Monday Office...')}
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                  {text('Dịp Mặc (Occasion)', 'Occasion')}
                </label>
                <select
                  value={outfitOccasion}
                  onChange={(e) => setOutfitOccasion(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Work">{text('Đi Làm / Công Sở', 'Work / Office')}</option>
                  <option value="Date">{text('Hẹn Hò Lãng Mạn', 'Romantic Date')}</option>
                  <option value="Casual">{text('Dạo Phố Cuối Tuần', 'Weekend Casual')}</option>
                  <option value="Party">{text('Dự Tiệc Tùng', 'Party / Evening')}</option>
                  <option value="Travel">{text('Du Lịch Dã Ngoại', 'Travel & Outdoor')}</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                {text('Ghi Chú Phong Cách', 'Style Notes')}
              </label>
              <input
                type="text"
                placeholder={text(
                  isMale ? 'Ví dụ: Phối cùng đồng hồ dây da nâu, thắt lưng da bò...' : 'Ví dụ: Phối cùng son đỏ, đồng hồ dây da nâu...',
                  isMale ? 'e.g., Pair with leather watch, belt...' : 'e.g., Pair with red lipstick, leather watch...'
                )}
                value={outfitDescription}
                onChange={(e) => setOutfitDescription(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '0.96rem' }}
            >
              <Save size={18} />
              <span>{text('Lưu Bộ Outfit Này Vào Tủ Đồ', 'Save Outfit to Wardrobe')}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Wardrobe Item Drawer */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>
              {text('Khay Chọn Đồ Từ Tủ', 'Wardrobe Item Selector')}
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {text('Nhấp vào món đồ để đưa trực tiếp vào sàn phối Flat-Lay bên trái', 'Click on an item to place it onto the canvas on the left')}
            </p>
          </div>

          {/* Drawer Category Tabs */}
          <div className="filter-pills" style={{ marginBottom: '18px' }}>
            {[
              { id: 'Tops', label: text('Áo', 'Tops') },
              { id: 'Outerwear', label: text('Khoác', 'Outerwear') },
              { id: 'Bottoms', label: isMale ? text('Quần', 'Bottoms') : text('Quần/Đầm', 'Bottoms/Dresses') },
              { id: 'Shoes', label: text('Giày', 'Shoes') },
              { id: 'Accessories', label: text('Phụ kiện', 'Accessories') },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDrawerCategory(tab.id)}
                className={`filter-pill ${drawerCategory === tab.id ? 'active' : ''}`}
                style={{ padding: '7px 14px', fontSize: '0.82rem' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Drawer Items Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            maxHeight: '480px',
            overflowY: 'auto',
            paddingRight: '4px',
          }}>
            {drawerItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item)}
                style={{
                  background: 'rgba(7, 10, 17, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'scale(1.0)';
                }}
              >
                {onDeleteClothing && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModalItem(item);
                    }}
                    title="Xóa món đồ này khỏi tủ"
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      color: '#FDA4AF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 3,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#E11D48';
                      e.currentTarget.style.color = '#FFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(15, 23, 42, 0.85)';
                      e.currentTarget.style.color = '#FDA4AF';
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
                <img 
                  src={item.imageUrl && item.imageUrl.startsWith('http') 
                    ? item.imageUrl 
                    : (item.imageUrl && item.imageUrl.startsWith('/') ? item.imageUrl : `/${item.imageUrl || ''}`)} 
                  alt={item.name} 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = item.categoryId === 1 
                      ? 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80'
                      : item.categoryId === 2
                      ? 'https://images.unsplash.com/photo-1542272604-780c96856592?w=400&auto=format&fit=crop&q=80'
                      : item.categoryId === 4
                      ? 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&auto=format&fit=crop&q=80'
                      : item.categoryId === 5
                      ? 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=80';
                  }}
                  style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px', marginBottom: '6px', background: 'rgba(255,255,255,0.03)' }} 
                />
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {item.color}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Lookbook Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              {text('Bộ Sưu Tập Lookbook Của Bạn', 'Your Lookbook Collection')}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {text('Xem lại toàn bộ trang phục đã được sáng tạo và lưu trữ.', 'Review all created and saved outfit combinations.')}
            </p>
          </div>

          <div className="filter-pills">
            <button
              onClick={() => setOutfitFilter('all')}
              className={`filter-pill ${outfitFilter === 'all' ? 'active' : ''}`}
            >
              {text('Tất Cả', 'All')} ({outfits.length})
            </button>
            <button
              onClick={() => setOutfitFilter('fav')}
              className={`filter-pill ${outfitFilter === 'fav' ? 'active' : ''}`}
            >
              {text('Yêu Thích', 'Favorites')} ({outfits.filter(o => o.isFavorite).length})
            </button>
            <button
              onClick={() => setOutfitFilter('ai')}
              className={`filter-pill ${outfitFilter === 'ai' ? 'active' : ''}`}
            >
              AI Curated ({outfits.filter(o => o.createdByAi).length})
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {filteredOutfits.map((outfit) => (
            <OutfitCard 
              key={outfit.id} 
              outfit={outfit} 
              allItems={clothes}
              onToggleFavorite={onToggleFavorite}
              onDelete={onDeleteOutfit}
            />
          ))}
        </div>
      </div>

      {/* Delete Garment Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteModalItem}
        items={deleteModalItem ? [deleteModalItem] : []}
        onClose={() => setDeleteModalItem(null)}
        onConfirm={handleConfirmDeleteClothing}
      />
    </div>
  );
}
