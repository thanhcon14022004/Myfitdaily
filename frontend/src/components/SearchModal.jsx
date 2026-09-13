import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Shirt, Layers, MessageSquare, ArrowRight, Folder } from 'lucide-react';

export default function SearchModal({
  isOpen,
  onClose,
  clothes = [],
  outfits = [],
  chatSessions = [],
  onNavigate,
  onSelectChat
}) {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalized = query.trim().toLowerCase();

  // Search results
  const filteredClothes = clothes.filter(c => 
    !normalized || c.name?.toLowerCase().includes(normalized) || c.brand?.toLowerCase().includes(normalized) || c.color?.toLowerCase().includes(normalized)
  ).slice(0, 5);

  const filteredOutfits = outfits.filter(o =>
    !normalized || o.name?.toLowerCase().includes(normalized) || o.style?.toLowerCase().includes(normalized)
  ).slice(0, 5);

  const sessionResults = chatSessions.filter(s => 
    !normalized || s.title.toLowerCase().includes(normalized)
  ).slice(0, 6);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '12vh',
    }}
    onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#1F1F1F',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '14px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 18px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <Search size={18} color="#8E8E8E" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm trang phục, outfit, hoặc đoạn chat..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ECECEC',
              fontSize: '0.95rem',
              padding: 0,
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: '#8E8E8E', cursor: 'pointer', padding: '2px' }}
            >
              <X size={16} />
            </button>
          )}
          <span style={{
            fontSize: '0.68rem',
            padding: '2px 6px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '4px',
            color: '#8E8E8E'
          }}>
            ESC
          </span>
        </div>

        {/* Filter Badges */}
        <div style={{
          display: 'flex',
          gap: '6px',
          padding: '8px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          background: '#181818'
        }}>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'wardrobe', label: `Tủ đồ (${filteredClothes.length})` },
            { id: 'outfits', label: `Outfits (${filteredOutfits.length})` },
            { id: 'chats', label: 'Đoạn chat' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                border: 'none',
                cursor: 'pointer',
                background: filterType === f.id ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: filterType === f.id ? '#FFF' : '#8E8E8E',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px' }}>
          {/* Chat Sessions Results */}
          {(filterType === 'all' || filterType === 'chats') && sessionResults.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '0.72rem', color: '#71717A', padding: '4px 8px', fontWeight: 600 }}>
                Lịch sử đoạn chat
              </div>
              {sessionResults.map((session) => (
                <div
                  key={session.id}
                  onClick={() => {
                    if (onSelectChat) onSelectChat(session.id);
                    onNavigate('ai-stylist');
                    onClose();
                  }}
                  className="search-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={15} color="#8E8E8E" />
                    <span style={{ fontSize: '0.86rem', color: '#ECECEC' }}>{session.title}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#D4AF37', background: 'rgba(212, 175, 55, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                    Đoạn chat
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Clothes Results */}
          {(filterType === 'all' || filterType === 'wardrobe') && filteredClothes.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '0.72rem', color: '#71717A', padding: '4px 8px', fontWeight: 600 }}>
                Món đồ trong tủ
              </div>
              {filteredClothes.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onNavigate('wardrobe');
                    onClose();
                  }}
                  className="search-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.84rem', color: '#ECECEC' }}>{item.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#71717A' }}>{item.categoryName || item.brand || 'Món đồ'}</div>
                  </div>
                  <ArrowRight size={14} color="#71717A" />
                </div>
              ))}
            </div>
          )}

          {/* Outfits Results */}
          {(filterType === 'all' || filterType === 'outfits') && filteredOutfits.length > 0 && (
            <div>
              <div style={{ fontSize: '0.72rem', color: '#71717A', padding: '4px 8px', fontWeight: 600 }}>
                Bộ phối đồ (Outfits)
              </div>
              {filteredOutfits.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onNavigate('outfits');
                    onClose();
                  }}
                  className="search-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <Layers size={16} color="#D4AF37" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.84rem', color: '#ECECEC' }}>{item.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#71717A' }}>{item.style || 'Phối đồ'}</div>
                  </div>
                  <ArrowRight size={14} color="#71717A" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
