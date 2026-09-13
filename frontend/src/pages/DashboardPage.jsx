import React from 'react';
import { 
  Shirt, 
  Layers, 
  Sparkles, 
  Heart, 
  Sun, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Compass,
  Crown,
  Calendar,
  Zap,
  CloudSun
} from 'lucide-react';
import OutfitCard from '../components/OutfitCard';

export default function DashboardPage({ 
  user, 
  clothes, 
  outfits, 
  onNavigate, 
  onOpenAddModal,
  onToggleFavoriteOutfit,
  onDeleteOutfit
}) {
  const favoriteCount = outfits.filter(o => o.isFavorite).length;

  // Category counts
  const categoryCounts = {
    tops: clothes.filter(c => c.categoryId === 1).length,
    bottoms: clothes.filter(c => c.categoryId === 2).length,
    dresses: clothes.filter(c => c.categoryId === 3).length,
    outerwear: clothes.filter(c => c.categoryId === 4).length,
    shoes: clothes.filter(c => c.categoryId === 5).length,
    accessories: clothes.filter(c => c.categoryId === 6).length,
  };

  const ootdOutfit = outfits.length > 0 ? outfits[0] : null;

  return (
    <div className="container" style={{ padding: '36px 24px 90px' }}>
      {/* Welcome Banner */}
      <div className="glass-card" style={{
        padding: '36px',
        marginBottom: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        background: 'linear-gradient(135deg, rgba(14, 18, 27, 0.95) 0%, rgba(20, 16, 12, 0.95) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="badge badge-rose">Bàn Làm Việc Thời Trang</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              ✦ Hôm nay: Thứ Sáu • 28°C Nắng Đẹp
            </span>
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '8px', fontWeight: 800 }}>
            Xin chào, <span className="gradient-text">{user?.fullName || 'Fashion Lover'}</span>! ✨
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', fontSize: '0.98rem', lineHeight: 1.6 }}>
            Tủ đồ số của bạn hiện có <strong style={{ color: '#FFF' }}>{clothes.length} món đồ</strong> và <strong style={{ color: '#FFF' }}>{outfits.length} bộ phối đồ</strong> được sắp xếp ngăn nắp.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={onOpenAddModal}
            id="btn-dash-add-cloth"
            className="btn-primary"
            style={{ padding: '12px 24px', fontSize: '0.92rem' }}
          >
            <Plus size={18} />
            <span>Thêm Món Đồ Mới</span>
          </button>

          <button
            onClick={() => onNavigate('ai-stylist')}
            id="btn-dash-ask-ai"
            className="btn-ai"
            style={{ padding: '12px 26px', fontSize: '0.92rem' }}
          >
            <Sparkles size={18} />
            <span>Tư Vấn AI Stylist</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
      }}>
        {/* Stat 1: Total Clothes */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 700 }}>TỔNG MÓN ĐỒ</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.15)', color: '#F3D98A' }}>
              <Shirt size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.3rem', fontWeight: 800, color: '#FFF', lineHeight: 1 }}>{clothes.length}</div>
          <div style={{ fontSize: '0.78rem', color: '#10B981', marginTop: '8px', fontWeight: 600 }}>
            ✓ Đã phân loại đủ 6 danh mục
          </div>
        </div>

        {/* Stat 2: Total Outfits */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 700 }}>BỘ OUTFIT ĐÃ TẠO</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(194, 125, 94, 0.15)', color: '#E6CCB2' }}>
              <Layers size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.3rem', fontWeight: 800, color: '#FFF', lineHeight: 1 }}>{outfits.length}</div>
          <div style={{ fontSize: '0.78rem', color: '#F3D98A', marginTop: '8px', fontWeight: 600 }}>
            Sẵn sàng mặc bất cứ lúc nào
          </div>
        </div>

        {/* Stat 3: Favorites */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 700 }}>OUTFIT YÊU THÍCH</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.15)', color: '#F3D98A' }}>
              <Heart size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.3rem', fontWeight: 800, color: '#FFF', lineHeight: 1 }}>{favoriteCount}</div>
          <div style={{ fontSize: '0.78rem', color: '#F3D98A', marginTop: '8px', fontWeight: 600 }}>
            Bộ trang phục ưu tiên
          </div>
        </div>

        {/* Stat 4: Membership Tier */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 700 }}>GÓI TÀI KHOẢN</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.15)', color: '#F3D98A' }}>
              <Crown size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FFF', lineHeight: 1 }}>
            {user?.subscriptionType || 'Free'}
          </div>
          <div 
            onClick={() => onNavigate('premium')}
            style={{ fontSize: '0.8rem', color: '#F3D98A', marginTop: '8px', cursor: 'pointer', fontWeight: 700 }}
          >
            Nâng cấp VIP Hoàng Gia →
          </div>
        </div>
      </div>

      {/* OOTD - Outfit of The Day Hero Section */}
      <div className="glass-card" style={{
        padding: '32px',
        marginBottom: '44px',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        background: 'radial-gradient(ellipse at top left, rgba(212, 175, 55, 0.15) 0%, rgba(14, 18, 27, 0.9) 75%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24' }}>
              <CloudSun size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Outfit Gợi Ý Hôm Nay (OOTD)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Thời tiết tại Việt Nam: 28°C Nắng ấm • Gợi ý tối ưu từ tủ đồ của bạn
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('ai-stylist')}
            id="btn-change-ootd"
            className="btn-secondary"
            style={{ padding: '10px 20px', fontSize: '0.86rem' }}
          >
            <Sparkles size={15} color="#FB7185" />
            <span>Nhờ AI Đổi Bộ Khác</span>
          </button>
        </div>

        {ootdOutfit ? (
          <div style={{ maxWidth: '440px' }}>
            <OutfitCard 
              outfit={ootdOutfit} 
              allItems={clothes}
              onToggleFavorite={onToggleFavoriteOutfit}
              onDelete={onDeleteOutfit}
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
            Chưa có outfit nào. Hãy vào Atelier hoặc nhờ AI Stylist tạo bộ phối đầu tiên!
          </div>
        )}
      </div>

      {/* Wardrobe Breakdown Category Progress Bar */}
      <div className="glass-card" style={{ padding: '28px', marginBottom: '44px' }}>
        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>
          Tỷ Lệ Phân Bổ Danh Mục Tủ Đồ
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Phân tích trực quan các loại trang phục bạn đang có để cân đối thói quen mua sắm thông minh.
        </p>

        {/* Multi-color progress bar */}
        <div style={{
          height: '12px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '16px',
        }}>
          <div style={{ width: `${(categoryCounts.tops / (clothes.length || 1)) * 100}%`, background: '#D4AF37' }} title="Áo (Tops)" />
          <div style={{ width: `${(categoryCounts.bottoms / (clothes.length || 1)) * 100}%`, background: '#C27D5E' }} title="Quần (Bottoms)" />
          <div style={{ width: `${(categoryCounts.dresses / (clothes.length || 1)) * 100}%`, background: '#F3D98A' }} title="Đầm (Dresses)" />
          <div style={{ width: `${(categoryCounts.outerwear / (clothes.length || 1)) * 100}%`, background: '#9A7B38' }} title="Áo Khoác (Outerwear)" />
          <div style={{ width: `${(categoryCounts.shoes / (clothes.length || 1)) * 100}%`, background: '#E6CCB2' }} title="Giày (Shoes)" />
          <div style={{ width: `${(categoryCounts.accessories / (clothes.length || 1)) * 100}%`, background: '#B08968' }} title="Phụ Kiện (Accessories)" />
        </div>

        {/* Legend pills */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.82rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D4AF37' }} /> Áo ({categoryCounts.tops})
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C27D5E' }} /> Quần ({categoryCounts.bottoms})
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F3D98A' }} /> Đầm ({categoryCounts.dresses})
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#9A7B38' }} /> Áo Khoác ({categoryCounts.outerwear})
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E6CCB2' }} /> Giày ({categoryCounts.shoes})
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#B08968' }} /> Phụ Kiện ({categoryCounts.accessories})
          </span>
        </div>
      </div>

      {/* Saved Outfits Gallery Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Bộ Sưu Tập Trang Phục Của Bạn</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Các outfit bạn đã tự tạo hoặc được AI Stylist tư vấn lưu lại.
            </p>
          </div>

          <button
            onClick={() => onNavigate('outfits')}
            id="btn-goto-studio"
            className="btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.86rem' }}
          >
            <span>Vào Atelier Phối Đồ</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {outfits.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            {outfits.map((outfit) => (
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
          <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <Layers size={42} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Chưa có bộ outfit nào</h4>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Hãy ghé qua Atelier hoặc hỏi AI Stylist để tạo ra bộ trang phục đầu tiên!
            </p>
            <button onClick={() => onNavigate('outfits')} className="btn-primary">
              Bắt Đầu Phối Đồ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
