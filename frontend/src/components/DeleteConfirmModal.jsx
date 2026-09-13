import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, Check } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  items = [], // Mảng 1 hoặc nhiều items cần xóa
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !items || items.length === 0) return null;

  const isBulk = items.length > 1;
  const singleItem = !isBulk ? items[0] : null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      if (isBulk) {
        await onConfirm(items.map(i => i.id));
      } else {
        await onConfirm(singleItem.id);
      }
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 7, 13, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px',
      animation: 'fadeIn 0.25s ease',
    }}>
      <div 
        className="glass-card" 
        style={{
          width: '100%',
          maxWidth: isBulk ? '520px' : '460px',
          padding: '28px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(225, 29, 72, 0.35)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(225, 29, 72, 0.15)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#FFF'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <X size={20} />
        </button>

        {/* Warning Icon Badge */}
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'rgba(225, 29, 72, 0.15)',
          border: '1px solid rgba(225, 29, 72, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FDA4AF',
          marginBottom: '18px',
          boxShadow: '0 0 20px rgba(225, 29, 72, 0.25)'
        }}>
          <Trash2 size={26} color="#F43F5E" />
        </div>

        {/* Modal Header */}
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>
          {isBulk ? `Xóa ${items.length} món quần áo đã chọn?` : 'Xác nhận xóa món đồ khỏi tủ?'}
        </h3>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '20px' }}>
          {isBulk ? (
            <span>
              Hành động này sẽ xóa vĩnh viễn <strong style={{ color: '#FDA4AF' }}>{items.length} món trang phục</strong> khỏi tủ đồ số của bạn và tự động gỡ chúng khỏi các bộ outfit đã lưu.
            </span>
          ) : (
            <span>
              Món đồ này sẽ bị xóa vĩnh viễn khỏi tủ đồ số và tự động gỡ khỏi các bộ phối đồ đã lưu liên quan.
            </span>
          )}
        </p>

        {/* Preview of Items to be deleted */}
        {!isBulk && singleItem && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '24px',
          }}>
            <img 
              src={singleItem.imageUrl} 
              alt={singleItem.name} 
              style={{
                width: '64px',
                height: '76px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: '#0F172A'
              }}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80";
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                {singleItem.categoryName || 'Quần áo'}
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
                {singleItem.name}
              </h4>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {singleItem.color && `Màu: ${singleItem.color}`}
                {singleItem.size && ` • Size: ${singleItem.size}`}
                {singleItem.brand && ` • ${singleItem.brand}`}
              </div>
            </div>
          </div>
        )}

        {/* Bulk items thumbnail reel */}
        {isBulk && (
          <div style={{
            maxHeight: '160px',
            overflowY: 'auto',
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {items.map(item => (
              <div 
                key={item.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  background: 'rgba(0, 0, 0, 0.25)',
                }}
              >
                <img 
                  src={item.imageUrl} 
                  alt="" 
                  style={{ width: '36px', height: '42px', objectFit: 'cover', borderRadius: '4px' }} 
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80";
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {item.categoryName || 'Quần áo'} {item.color ? `• ${item.color}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Warning Callout Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(225, 29, 72, 0.1)',
          border: '1px solid rgba(225, 29, 72, 0.25)',
          marginBottom: '24px',
          color: '#FDA4AF',
          fontSize: '0.8rem',
        }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>Thao tác này không thể hoàn tác sau khi đã xóa.</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="btn-secondary"
            style={{ padding: '10px 20px', fontSize: '0.88rem' }}
          >
            Hủy Bỏ
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            id="btn-confirm-delete-action"
            style={{
              padding: '10px 24px',
              fontSize: '0.88rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #E11D48, #9F1239)',
              color: '#FFF',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 4px 16px rgba(225, 29, 72, 0.4)',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'var(--transition)',
              opacity: isDeleting ? 0.7 : 1,
            }}
          >
            {isDeleting ? (
              <span>Đang xóa...</span>
            ) : (
              <>
                <Trash2 size={16} />
                <span>{isBulk ? `Xác Nhận Xóa ${items.length} Món` : 'Xóa Khỏi Tủ Đồ'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
