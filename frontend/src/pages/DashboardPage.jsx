import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Layers, 
  Shirt, 
  Search, 
  ArrowRight, 
  Plus,
  Filter,
  Flame,
  CheckCircle,
  Tag
} from 'lucide-react';
import OutfitCard from '../components/OutfitCard';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function DashboardPage({ 
  user, 
  clothes = [], 
  outfits = [], 
  onNavigate, 
  onOpenAddModal,
  onToggleFavoriteOutfit,
  onDeleteOutfit
}) {
  const { text, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'ai' | 'custom'
  const [searchQuery, setSearchQuery] = useState('');

  // Danh sách trang phục được đánh dấu yêu thích
  const favoriteOutfits = outfits.filter(o => o.isFavorite);

  // Phân loại đếm số lượng
  const aiFavCount = favoriteOutfits.filter(o => o.createdByAi).length;
  const customFavCount = favoriteOutfits.filter(o => !o.createdByAi).length;

  // Lọc theo tìm kiếm & tab
  const displayedOutfits = favoriteOutfits.filter(outfit => {
    // Lọc theo tab nguồn
    if (activeFilter === 'ai' && !outfit.createdByAi) return false;
    if (activeFilter === 'custom' && outfit.createdByAi) return false;

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = outfit.name && outfit.name.toLowerCase().includes(q);
      const matchOccasion = outfit.occasion && outfit.occasion.toLowerCase().includes(q);
      const matchNotes = (outfit.stylistNotes || outfit.description || '').toLowerCase().includes(q);
      return matchName || matchOccasion || matchNotes;
    }

    return true;
  });

  return (
    <div className="container" style={{ padding: '36px 24px 90px' }}>
      {/* Header Banner: Trang Phục Yêu Thích */}
      <div 
        className="glass-card" 
        style={{
          padding: '36px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          background: isLight 
            ? '#FFFFFF' 
            : 'linear-gradient(135deg, rgba(20, 14, 24, 0.95) 0%, rgba(14, 18, 27, 0.95) 100%)',
          border: isLight ? '1.5px solid rgba(244, 63, 94, 0.25)' : '1px solid rgba(244, 63, 94, 0.35)',
          boxShadow: isLight ? '0 15px 40px rgba(244, 63, 94, 0.08)' : '0 20px 50px rgba(0, 0, 0, 0.65)',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span 
              className="badge" 
              style={{ 
                background: 'rgba(244, 63, 94, 0.15)', 
                color: '#FB7185', 
                borderColor: 'rgba(244, 63, 94, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Heart size={13} fill="#F43F5E" color="#F43F5E" />
              {text('BỘ SƯU TẬP TRANG PHỤC YÊU THÍCH', 'FAVORITE OUTFITS COLLECTION')}
            </span>
            <span style={{ fontSize: '0.82rem', color: isLight ? '#4B5563' : 'var(--text-secondary)' }}>
              {text('✦ Đồng bộ tự động từ AI Stylist & Atelier', '✦ Auto synced from AI Stylist & Atelier')}
            </span>
          </div>

          <h2 style={{ 
            fontSize: '2.2rem', 
            marginBottom: '8px', 
            fontWeight: 800,
            color: 'var(--text-primary)'
          }}>
            {text('Trang Phục Yêu Thích Của ', 'Favorite Looks of ')}
            <span className="gradient-text">{user?.fullName || 'Bạn'}</span> ✨
          </h2>

          <p style={{ 
            color: isLight ? '#4B5563' : 'var(--text-secondary)', 
            maxWidth: '620px', 
            fontSize: '0.96rem', 
            lineHeight: 1.6 
          }}>
            {text(
              'Những bộ phối trang phục bạn đã thả tim (tym) từ AI Stylist và Lookbook Studio. Sẵn sàng để bạn chọn mặc nhanh trong 30 giây mỗi sáng!',
              'Outfits you favorited with a heart from AI Stylist and Lookbook Studio. Ready for effortless 30-second morning styling!'
            )}
          </p>
        </div>

        {/* Action Shortcuts */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('ai-stylist')}
            id="btn-fav-goto-ai"
            className="btn-ai"
            style={{ padding: '12px 24px', fontSize: '0.92rem' }}
          >
            <Sparkles size={18} />
            <span>{text('Hỏi AI Stylist Phối Thêm', 'Consult AI Stylist')}</span>
          </button>

          <button
            onClick={() => onNavigate('outfits')}
            id="btn-fav-goto-studio"
            className="btn-secondary"
            style={{ padding: '12px 22px', fontSize: '0.92rem' }}
          >
            <Layers size={18} color="#D4AF37" />
            <span>{text('Atelier Phối Đồ', 'Outfit Atelier')}</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Pills */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '18px',
        marginBottom: '32px',
      }}>
        {/* Stat 1: Total Favorites */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '22px',
            background: isLight ? '#FFFFFF' : undefined,
            border: isLight ? '1px solid rgba(244, 63, 94, 0.25)' : undefined,
            boxShadow: isLight ? '0 8px 25px rgba(0, 0, 0, 0.04)' : undefined,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: isLight ? '#6B7280' : 'var(--text-secondary)', fontWeight: 700 }}>
              {text('TỔNG OUTFIT YÊU THÍCH', 'TOTAL FAVORITES')}
            </span>
            <div style={{ padding: '7px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', color: '#F43F5E' }}>
              <Heart size={18} fill="#F43F5E" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: isLight ? '#0D0D0D' : '#FFF', lineHeight: 1 }}>
            {favoriteOutfits.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#F43F5E', marginTop: '8px', fontWeight: 600 }}>
            {text('Bộ trang phục ưu tiên diện', 'Priority curated looks')}
          </div>
        </div>

        {/* Stat 2: AI Curated Favorites */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '22px',
            background: isLight ? '#FFFFFF' : undefined,
            border: isLight ? '1px solid #E5E7EB' : undefined,
            boxShadow: isLight ? '0 8px 25px rgba(0, 0, 0, 0.04)' : undefined,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: isLight ? '#6B7280' : 'var(--text-secondary)', fontWeight: 700 }}>
              {text('GỢI Ý TỪ AI STYLIST', 'FROM AI STYLIST')}
            </span>
            <div style={{ padding: '7px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.15)', color: '#F3D98A' }}>
              <Sparkles size={18} color="#D4AF37" />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: isLight ? '#0D0D0D' : '#FFF', lineHeight: 1 }}>
            {aiFavCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10B981', marginTop: '8px', fontWeight: 600 }}>
            {text('Chuẩn dáng & thời tiết', 'Fit & weather optimized')}
          </div>
        </div>

        {/* Stat 3: Custom Studio Favorites */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '22px',
            background: isLight ? '#FFFFFF' : undefined,
            border: isLight ? '1px solid #E5E7EB' : undefined,
            boxShadow: isLight ? '0 8px 25px rgba(0, 0, 0, 0.04)' : undefined,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: isLight ? '#6B7280' : 'var(--text-secondary)', fontWeight: 700 }}>
              {text('TỰ PHỐI TẠI ATELIER', 'STUDIO CREATED')}
            </span>
            <div style={{ padding: '7px', borderRadius: '10px', background: 'rgba(129, 140, 248, 0.15)', color: '#818CF8' }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: isLight ? '#0D0D0D' : '#FFF', lineHeight: 1 }}>
            {customFavCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#818CF8', marginTop: '8px', fontWeight: 600 }}>
            {text('Sáng tạo theo gu riêng', 'Personal signature style')}
          </div>
        </div>

        {/* Stat 4: Total Wardrobe Items */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '22px',
            background: isLight ? '#FFFFFF' : undefined,
            border: isLight ? '1px solid #E5E7EB' : undefined,
            boxShadow: isLight ? '0 8px 25px rgba(0, 0, 0, 0.04)' : undefined,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: isLight ? '#6B7280' : 'var(--text-secondary)', fontWeight: 700 }}>
              {text('MÓN ĐỒ TRONG TỦ', 'WARDROBE ITEMS')}
            </span>
            <div style={{ padding: '7px', borderRadius: '10px', background: 'rgba(194, 125, 94, 0.15)', color: '#E6CCB2' }}>
              <Shirt size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: isLight ? '#0D0D0D' : '#FFF', lineHeight: 1 }}>
            {clothes.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: isLight ? '#6B7280' : 'var(--text-muted)', marginTop: '8px', fontWeight: 600 }}>
            {text('Đã số hóa ngăn nắp', 'Organized digitally')}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div 
        className="glass-card"
        style={{
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          background: isLight ? '#FFFFFF' : undefined,
          border: isLight ? '1px solid #E5E7EB' : undefined,
          boxShadow: isLight ? '0 4px 15px rgba(0, 0, 0, 0.03)' : undefined,
        }}
      >
        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setActiveFilter('all')}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeFilter === 'all' 
                ? '1px solid #F43F5E' 
                : (isLight ? '1px solid #E5E7EB' : '1px solid var(--border-subtle)'),
              background: activeFilter === 'all' ? 'rgba(244, 63, 94, 0.15)' : 'transparent',
              color: activeFilter === 'all' ? '#F43F5E' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            {text('Tất Cả', 'All')} ({favoriteOutfits.length})
          </button>

          <button
            onClick={() => setActiveFilter('ai')}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeFilter === 'ai' 
                ? '1px solid #D4AF37' 
                : (isLight ? '1px solid #E5E7EB' : '1px solid var(--border-subtle)'),
              background: activeFilter === 'ai' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              color: activeFilter === 'ai' ? '#D4AF37' : 'var(--text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <Sparkles size={14} />
            <span>{text('Gợi Ý Từ AI Stylist', 'AI Curated')}</span> ({aiFavCount})
          </button>

          <button
            onClick={() => setActiveFilter('custom')}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: activeFilter === 'custom' 
                ? '1px solid #818CF8' 
                : (isLight ? '1px solid #E5E7EB' : '1px solid var(--border-subtle)'),
              background: activeFilter === 'custom' ? 'rgba(129, 140, 248, 0.15)' : 'transparent',
              color: activeFilter === 'custom' ? '#818CF8' : 'var(--text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <Layers size={14} />
            <span>{text('Tự Phối Studio', 'Custom Lookbook')}</span> ({customFavCount})
          </button>
        </div>

        {/* Search Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: isLight ? '#F3F4F6' : 'rgba(0, 0, 0, 0.3)',
          border: isLight ? '1px solid #E5E7EB' : '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '6px 14px',
          minWidth: '240px',
        }}>
          <Search size={15} color={isLight ? '#6B7280' : 'var(--text-muted)'} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={text('Tìm tên outfit, dịp đi...', 'Search favorite outfits...')}
            style={{
              border: 'none',
              background: 'transparent',
              color: isLight ? '#0D0D0D' : 'var(--text-primary)',
              fontSize: '0.84rem',
              outline: 'none',
              width: '100%',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Outfits Gallery Grid */}
      {displayedOutfits.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {displayedOutfits.map((outfit) => (
            <OutfitCard 
              key={outfit.id} 
              outfit={outfit} 
              allItems={clothes}
              onToggleFavorite={onToggleFavoriteOutfit}
              onDelete={onDeleteOutfit}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div 
          className="glass-card" 
          style={{ 
            padding: '60px 24px', 
            textAlign: 'center',
            background: isLight ? '#FFFFFF' : undefined,
            border: isLight ? '1px solid #E5E7EB' : undefined,
            boxShadow: isLight ? '0 10px 30px rgba(0, 0, 0, 0.04)' : undefined,
            maxWidth: '680px',
            margin: '0 auto',
          }}
        >
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '1px solid rgba(244, 63, 94, 0.3)',
          }}>
            <Heart size={34} fill="#F43F5E" color="#F43F5E" />
          </div>

          <h4 style={{ 
            fontSize: '1.35rem', 
            fontWeight: 800, 
            marginBottom: '10px', 
            color: isLight ? '#0D0D0D' : '#FFF' 
          }}>
            {favoriteOutfits.length === 0 
              ? text('Chưa có trang phục yêu thích nào', 'No favorite outfits yet')
              : text('Không tìm thấy trang phục phù hợp bộ lọc', 'No outfits match this filter')}
          </h4>

          <p style={{ 
            color: isLight ? '#4B5563' : 'var(--text-secondary)', 
            marginBottom: '26px',
            maxWidth: '480px',
            margin: '0 auto 26px',
            lineHeight: 1.6,
            fontSize: '0.94rem'
          }}>
            {favoriteOutfits.length === 0
              ? text(
                  'Khi trò chuyện với AI Stylist hoặc phối đồ trong Atelier, hãy nhấn vào nút Trái Tim (❤️ Yêu Thích) trên bất kỳ bộ outfit nào để lưu vào đây!',
                  'When chatting with AI Stylist or styling in Atelier, click the Heart (❤️ Favorite) button on any outfit to save it here!'
                )
              : text(
                  'Hãy thử đổi từ khóa tìm kiếm hoặc chọn bộ lọc "Tất Cả" để xem toàn bộ danh sách.',
                  'Try adjusting your search terms or select "All" to view all favorite outfits.'
                )}
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onNavigate('ai-stylist')} 
              className="btn-primary"
              style={{ padding: '12px 26px', fontSize: '0.92rem' }}
            >
              <Sparkles size={16} />
              <span>{text('Hỏi AI Stylist Gợi Ý Ngay', 'Ask AI Stylist For Looks')}</span>
            </button>

            <button 
              onClick={() => onNavigate('outfits')} 
              className="btn-secondary"
              style={{ padding: '12px 22px', fontSize: '0.92rem' }}
            >
              <Layers size={16} color="#D4AF37" />
              <span>{text('Tự Phối Đồ Tại Studio', 'Create Outfits in Studio')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
