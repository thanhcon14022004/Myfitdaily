import React from 'react';
import { Trash2, Plus, Sparkles, Check, Heart, ExternalLink, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ClothingCard({ 
  item, 
  onDelete, 
  onAddToOutfit, 
  isSelected,
  isSelectionMode = false,
  isChecked = false,
  onToggleSelect,
}) {
  const { text } = useLanguage();
  const getCategoryBadgeClass = (categoryName) => {
    switch (categoryName?.toLowerCase()) {
      case 'tops': return 'badge-rose';
      case 'bottoms': return 'badge-indigo';
      case 'dresses': return 'badge-gold';
      case 'outerwear': return 'badge-purple';
      case 'shoes': return 'badge-emerald';
      default: return 'badge-rose';
    }
  };

  // Color dot helper
  const getColorHex = (colorName) => {
    const c = colorName?.toLowerCase() || '';
    if (c.includes('trắng') || c.includes('white')) return '#FFFFFF';
    if (c.includes('đen') || c.includes('black')) return '#1E293B';
    if (c.includes('xanh denim') || c.includes('blue')) return '#38BDF8';
    if (c.includes('nâu') || c.includes('brown')) return '#A16207';
    if (c.includes('hồng') || c.includes('pink')) return '#F472B6';
    if (c.includes('be') || c.includes('beige')) return '#FDE68A';
    if (c.includes('đỏ') || c.includes('red')) return '#EF4444';
    return '#94A3B8';
  };

  const handleCardClick = () => {
    if (isSelectionMode && onToggleSelect) {
      onToggleSelect(item.id);
    }
  };

  return (
    <div 
      className="glass-card"
      id={`clothing-card-${item.id}`}
      onClick={handleCardClick}
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 'var(--radius-md)',
        border: isChecked 
          ? '2px solid #F43F5E' 
          : isSelected 
          ? '2px solid var(--primary)' 
          : '1px solid rgba(255, 255, 255, 0.09)',
        boxShadow: isChecked 
          ? '0 0 25px rgba(244, 63, 94, 0.4)' 
          : isSelected 
          ? '0 0 30px var(--primary-glow)' 
          : 'var(--shadow-md)',
        transition: 'var(--transition)',
        cursor: isSelectionMode ? 'pointer' : 'default',
        transform: isChecked ? 'scale(0.98)' : 'none',
      }}
    >
      {/* 4:5 Fashion Aspect Ratio Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4 / 5',
        overflow: 'hidden',
        backgroundColor: '#0A0F1D',
      }}>
        <img 
          src={item.imageUrl} 
          alt={item.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: isChecked ? 'brightness(0.7)' : 'none',
          }}
          onMouseEnter={(e) => { if (!isChecked) e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80";
          }}
        />

        {/* Ambient Bottom Gradient Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(to top, rgba(7, 10, 17, 0.8), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Bulk Selection Checkbox Overlay */}
        {isSelectionMode && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleSelect) onToggleSelect(item.id);
            }}
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: isChecked ? '#F43F5E' : 'rgba(10, 15, 28, 0.8)',
              border: isChecked ? '2px solid #FFF' : '2px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              transition: 'var(--transition)',
            }}
          >
            {isChecked && <Check size={18} color="#FFF" strokeWidth={3} />}
          </div>
        )}

        {/* Category & Brand & Price Pill Tags */}
        <div style={{
          position: 'absolute',
          top: isSelectionMode ? '48px' : '12px',
          left: '12px',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          alignItems: 'flex-start'
        }}>
          <span className={`badge ${getCategoryBadgeClass(item.categoryName)}`} style={{ backdropFilter: 'blur(10px)' }}>
            {item.categoryName || text('Quần Áo', 'Garment')}
          </span>
          {item.brand && (
            <span className="badge badge-gold" style={{ backdropFilter: 'blur(10px)', fontWeight: 800, fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              🏷️ {item.brand}
            </span>
          )}
          {(item.priceFormatted || item.price) && (
            <span style={{
              background: 'rgba(0, 0, 0, 0.88)',
              border: '1px solid #D4AF37',
              color: '#FDE68A',
              padding: '3px 8px',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.74rem',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Tag size={11} color="#D4AF37" />
              <span>
                {item.categoryName === 'Tops' ? 'Áo : ' : item.categoryName === 'Bottoms' ? 'Quần : ' : ''}
                {item.priceFormatted || `${Number(item.price).toLocaleString()}đ`}
              </span>
            </span>
          )}
          {item.platform && (
            <span style={{
              background: item.platform?.toLowerCase().includes('tiktok') ? 'rgba(0, 0, 0, 0.85)' : 'rgba(238, 77, 45, 0.88)',
              border: item.platform?.toLowerCase().includes('tiktok') ? '1px solid #00F2FE' : '1px solid rgba(255,255,255,0.3)',
              color: '#FFFFFF',
              padding: '2px 7px',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '0.68rem',
              letterSpacing: '0.02em',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
            }}>
              {item.platform === 'TikTokShop' ? '🎵 TikTok' : item.platform}
            </span>
          )}
        </div>

        {/* Action button: Delete Single Item */}
        {onDelete && !isSelectionMode && (
          <button
            type="button"
            onClick={(e) => { 
              e.stopPropagation(); 
              onDelete(item); 
            }}
            id={`btn-delete-clothing-${item.id}`}
            title={text("Xóa món đồ này khỏi tủ", "Remove item from wardrobe")}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#FDA4AF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E11D48';
              e.currentTarget.style.color = '#FFF';
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(225, 29, 72, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.85)';
              e.currentTarget.style.color = '#FDA4AF';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
            }}
          >
            <Trash2 size={15} />
          </button>
        )}

        {/* Selection check indicator */}
        {isSelected && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px var(--primary-glow)',
            zIndex: 2,
          }}>
            <Check size={16} strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Card Details Body */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h4 style={{
            fontSize: '0.98rem',
            fontWeight: 700,
            marginBottom: '8px',
            color: '#FFFFFF',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {item.name}
          </h4>

          {/* Color and Style Metadata Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.74rem',
              color: 'var(--text-secondary)',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '3px 9px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getColorHex(item.color),
                border: '1px solid rgba(255,255,255,0.4)'
              }} />
              <span>{item.color || text('Đa sắc', 'Multicolor')}</span>
            </div>

            <div style={{
              fontSize: '0.74rem',
              color: 'var(--text-muted)',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
            }}>
              {item.style || 'Minimalist'}
            </div>

            {item.size && (
              <div style={{
                fontSize: '0.74rem',
                color: '#F3D98A',
                fontWeight: 700,
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
              }}>
                Size: {item.size}
              </div>
            )}
          </div>
        </div>

        {/* Action Button: Add To Outfit Studio */}
        {onAddToOutfit && (
          <button
            onClick={() => onAddToOutfit(item)}
            id={`btn-select-clothing-${item.id}`}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: isSelected 
                ? 'linear-gradient(135deg, var(--primary), #9F1239)' 
                : 'rgba(255, 255, 255, 0.07)',
              color: '#FFFFFF',
              border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: isSelected ? '0 4px 14px var(--primary-glow)' : 'none',
              transition: 'var(--transition)',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'rgba(225, 29, 72, 0.2)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              }
            }}
          >
            {isSelected ? (
              <>
                <Check size={14} />
                <span>{text('Đã Chọn Trong Studio', 'Selected in Studio')}</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>{text('Chọn Phối Đồ', 'Select to Style')}</span>
              </>
            )}
          </button>
        )}

        {/* Action Button: Affiliate Buy Direct Link */}
        {(item.affiliateUrl || item.originalUrl) && (
          <a
            href={item.affiliateUrl || item.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              marginTop: '8px',
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: item.platform?.toLowerCase().includes('tiktok') 
                ? '#0F172A' 
                : 'linear-gradient(135deg, #EA580C, #F97316)',
              color: '#FFFFFF',
              textDecoration: 'none',
              border: item.platform?.toLowerCase().includes('tiktok') 
                ? '1px solid #00F2FE' 
                : '1px solid rgba(249, 115, 22, 0.5)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 88, 12, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.25)';
            }}
          >
            <ExternalLink size={13} />
            <span>
              {text('🛒 Mua ngay', '🛒 Buy Now')} {item.priceFormatted ? `· ${item.priceFormatted}` : ''}
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
