import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  X,
  MessageSquare,
  TrendingUp,
  Flame,
  ArrowRight,
  Filter,
  CheckCircle2,
  HelpCircle,
  Compass
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { POPULAR_PROMPT_CATEGORIES, POPULAR_STYLIST_PROMPTS } from '../data/popularStylistPrompts';

export default function PopularPromptsModal({ isOpen, onClose, onSelectPrompt }) {
  const { text, isEnglish } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPrompts = useMemo(() => {
    let list = POPULAR_STYLIST_PROMPTS;
    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        (p.questionVi && p.questionVi.toLowerCase().includes(q)) ||
        (p.questionEn && p.questionEn.toLowerCase().includes(q)) ||
        (p.tag && p.tag.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(10px)',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        border: '1.5px solid rgba(212, 175, 55, 0.4)',
        background: 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.12) 0%, rgba(13, 17, 28, 0.98) 75%)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '22px 26px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #D4AF37, #E11D48)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(212, 175, 55, 0.35)'
              }}>
                <Flame size={18} color="#FFFFFF" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
                {text('Câu Hỏi Người Dùng Thường Hỏi AI Stylist Nhất', 'Most Asked AI Stylist Questions')}
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {text('Chọn câu hỏi bên dưới để AI Stylist phân tích vóc dáng và tủ đồ của bạn ngay tức thì.',
                    'Select any question below to get instant personalized styling advice.')}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Search & Category Filter Pills */}
        <div style={{ padding: '16px 26px 12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(5, 8, 15, 0.7)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Search size={16} color="var(--text-secondary)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={text('Tìm câu hỏi theo từ khóa: sơ mi, dáng quả lê, 1m55, đi làm, đám cưới...', 
                                'Search prompts: white shirt, pear shape, petite, office, wedding...')}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: '0.84rem',
                width: '100%'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'none'
          }}>
            {POPULAR_PROMPT_CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(225, 29, 72, 0.25))' : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#FDE68A' : 'var(--text-secondary)',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s'
                  }}
                >
                  {isEnglish ? cat.labelEn : cat.labelVi}
                </button>
              );
            })}
          </div>
        </div>

        {/* List of Prompts */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '4px 26px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {filteredPrompts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <HelpCircle size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: '0.88rem' }}>
                {text('Không tìm thấy câu hỏi phù hợp với từ khóa này.', 'No matching questions found.')}
              </p>
            </div>
          ) : (
            filteredPrompts.map((p) => {
              const qText = isEnglish ? p.questionEn : p.questionVi;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectPrompt(qText);
                    onClose();
                  }}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(212, 175, 55, 0.2)',
                        color: '#FDE68A',
                        border: '1px solid rgba(212, 175, 55, 0.35)'
                      }}>
                        {p.badge}
                      </span>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: 'var(--text-secondary)'
                      }}>
                        {p.tag}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 600 }}>
                        🔥 {(p.askedCount || 0).toLocaleString('vi-VN')} {text('lượt hỏi', 'asked')}
                      </span>
                    </div>

                    <div style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#FFFFFF',
                      lineHeight: 1.45
                    }}>
                      "{qText}"
                    </div>
                  </div>

                  <button
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37, #C27D5E)',
                      border: 'none',
                      color: '#FFFFFF',
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)'
                    }}
                  >
                    <span>{text('Hỏi Ngay', 'Ask')}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '12px 26px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(5, 8, 15, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#D4AF37" />
            <span>{text('Dữ liệu được cập nhật dựa trên 10.000+ cuộc trò chuyện thực tế', 'Curated from 10,000+ real styling queries')}</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            {text('Đóng', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
}

