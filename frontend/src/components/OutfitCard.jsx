import React from 'react';
import { Heart, Trash2, Sparkles, Layers, Tag } from 'lucide-react';

export default function OutfitCard({ outfit, allItems, onToggleFavorite, onDelete }) {
  // Find clothing items in this outfit
  const items = (outfit.itemIds || [])
    .map(id => allItems.find(item => item.id === id))
    .filter(Boolean);

  return (
    <div 
      className="glass-card"
      id={`outfit-card-${outfit.id}`}
      style={{
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        border: outfit.isFavorite ? '1px solid rgba(212, 175, 55, 0.45)' : '1px solid var(--border-subtle)',
        boxShadow: outfit.isFavorite ? '0 12px 35px rgba(212, 175, 55, 0.15)' : 'var(--shadow-md)',
      }}
    >
      <div>
        {/* Header with Title, AI tag and Favorite Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '16px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <h4 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#FFF' }}>
                {outfit.name}
              </h4>
              {outfit.createdByAi && (
                <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>
                  <Sparkles size={11} /> AI Curated
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                {outfit.occasion || 'Thường ngày'}
              </span>
              <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                {outfit.season || 'Tất cả mùa'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onToggleFavorite(outfit.id)}
              id={`btn-fav-outfit-${outfit.id}`}
              title={outfit.isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: outfit.isFavorite ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                color: outfit.isFavorite ? '#F3D98A' : 'var(--text-muted)',
                border: '1px solid ' + (outfit.isFavorite ? 'var(--primary)' : 'var(--border-subtle)'),
                transition: 'var(--transition)',
              }}
            >
              <Heart size={16} fill={outfit.isFavorite ? 'currentColor' : 'none'} />
            </button>

            {onDelete && (
              <button
                onClick={() => onDelete(outfit.id)}
                id={`btn-del-outfit-${outfit.id}`}
                title="Xóa bộ phối này"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                  e.currentTarget.style.color = '#F3D98A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Thumbnail Collage Preview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.max(2, Math.min(items.length, 4))}, 1fr)`,
          gap: '8px',
          marginBottom: '16px',
        }}>
          {items.map((item, idx) => (
            <div 
              key={idx}
              style={{
                position: 'relative',
                aspectRatio: '1 / 1',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                background: '#0D1322',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <img 
                src={item.imageUrl} 
                alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{
                position: 'absolute',
                bottom: '4px',
                left: '4px',
                fontSize: '0.62rem',
                fontWeight: 700,
                color: '#FFF',
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '1px 5px',
                borderRadius: '4px',
              }}>
                {item.categoryName}
              </span>
            </div>
          ))}
        </div>

        {/* Description or Editorial Note */}
        {outfit.description && (
          <p style={{
            fontSize: '0.84rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            fontStyle: 'italic',
            borderLeft: '2px solid rgba(212, 175, 55, 0.5)',
            paddingLeft: '10px',
            marginBottom: '8px',
          }}>
            "{outfit.description}"
          </p>
        )}
      </div>

      {/* Footer Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={13} color="#D4AF37" />
          <span>{items.length} món kết hợp</span>
        </div>
        <span style={{ color: '#10B981', fontWeight: 600 }}>Tỷ lệ phối chuẩn</span>
      </div>
    </div>
  );
}
