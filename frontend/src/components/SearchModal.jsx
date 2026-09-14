import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Shirt, Layers, MessageSquare, ArrowRight, Folder } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SearchModal({
  isOpen,
  onClose,
  clothes = [],
  outfits = [],
  chatSessions = [],
  onNavigate,
  onSelectChat
}) {
  const { text } = useLanguage();
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
          background: 'var(--bg-modal)',
          border: '1px solid var(--border-medium)',
          borderRadius: '14px',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'background 0.3s ease, border-color 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            ref={inputRef}
            type="text"
            placeholder={text("Tìm kiếm trang phục, outfit, hoặc đoạn chat...", "Search wardrobe, outfits, or chat sessions...")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.95rem',
              padding: 0,
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
            >
              <X size={16} />
            </button>
          )}
          <span style={{
            fontSize: '0.68rem',
            padding: '2px 6px',
            background: 'var(--hover-bg)',
            borderRadius: '4px',
            color: 'var(--text-muted)'
          }}>
            ESC
          </span>
        </div>

        {/* Filter Badges */}
        <div style={{
          display: 'flex',
          gap: '6px',
          padding: '8px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--hover-bg-subtle)'
        }}>
          {[
            { id: 'all', label: text('Tất cả', 'All') },
            { id: 'wardrobe', label: `${text('Tủ đồ', 'Closet')} (${filteredClothes.length})` },
            { id: 'outfits', label: `Outfits (${filteredOutfits.length})` },
            { id: 'chats', label: text('Đoạn chat', 'Chats') },
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
                background: filterType === f.id ? 'var(--hover-bg)' : 'transparent',
                color: filterType === f.id ? 'var(--text-primary)' : 'var(--text-muted)',
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
                {text('Lịch sử đoạn chat', 'Chat History')}
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
                    <MessageSquare size={15} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>{session.title}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', background: 'var(--primary-glow)', padding: '2px 6px', borderRadius: '4px' }}>
                    {text('Đoạn chat', 'Chat')}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Clothes Results */}
          {(filterType === 'all' || filterType === 'wardrobe') && filteredClothes.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '4px 8px', fontWeight: 600 }}>
                {text('Món đồ trong tủ', 'Wardrobe Items')}
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
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>{item.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.categoryName || item.brand || text('Món đồ', 'Item')}</div>
                  </div>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          )}

          {/* Outfits Results */}
          {(filterType === 'all' || filterType === 'outfits') && filteredOutfits.length > 0 && (
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '4px 8px', fontWeight: 600 }}>
                {text('Bộ phối đồ (Outfits)', 'Outfits & Looks')}
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
                  <Layers size={16} color="var(--primary)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>{item.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.style || text('Phối đồ', 'Outfit')}</div>
                  </div>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
