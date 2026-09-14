import React from 'react';
import { Crown, Check, Sparkles, Zap, Shield, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PremiumPage({ user, onUpgrade }) {
  const { text, isEnglish } = useLanguage();
  const isPremium = user?.subscriptionType === 'Premium';

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#FCD34D',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '16px',
        }}>
          <Crown size={16} />
          <span>{text('Gói Thành Viên Đặc Quyền', 'VIP Membership Plans')}</span>
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
          {text('Nâng Tầm Phong Cách Với ', 'Elevate Your Style With ')}
          <span className="gradient-text">MYFITDAILY VIP</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.6 }}>
          {text(
            'Mở khóa không giới hạn sức mạnh AI Stylist và khả năng lưu trữ tủ đồ tối đa cho cả gia đình.',
            'Unlock unlimited AI Stylist consultations and maximum wardrobe capacity for your fashion journey.'
          )}
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px',
        maxWidth: '880px',
        margin: '0 auto 60px',
      }}>
        {/* Free Tier */}
        <div className="glass-card" style={{ padding: '36px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{text('Gói Cơ Bản (Free)', 'Basic Plan (Free)')}</h3>
              <span className="badge badge-indigo">{text('Miễn Phí', 'Free')}</span>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFF' }}>0đ</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{text(' / vĩnh viễn', ' / forever')}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
              {text(
                'Trải nghiệm các tính năng cốt lõi để bắt đầu làm quen với tủ đồ số.',
                'Experience essential features to get started with your digital closet.'
              )}
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={18} color="#10B981" />
                <span>{text('Quản lý tối đa ', 'Manage up to ')}<strong>{text('25 món đồ', '25 items')}</strong></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={18} color="#10B981" />
                <span>{text('Tạo tối đa ', 'Create up to ')}<strong>{text('10 bộ phối đồ', '10 outfits')}</strong></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={18} color="#10B981" />
                <span>{text('5 lượt gợi ý AI Stylist mỗi ngày', '5 AI Stylist consultations daily')}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <span>{text('✕ Phân tích hình ảnh AI nâng cao', '✕ Advanced AI visual analysis')}</span>
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '36px' }}>
            <button
              disabled={!isPremium}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {!isPremium ? text('Đang Sử Dụng', 'Current Plan') : text('Chuyển Về Free', 'Switch to Free')}
            </button>
          </div>
        </div>

        {/* Premium VIP Tier */}
        <div className="glass-card" style={{
          padding: '36px 30px',
          border: '2px solid var(--primary)',
          boxShadow: '0 12px 40px var(--primary-glow)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: '-14px',
            right: '24px',
            background: 'linear-gradient(135deg, #D4AF37, #C27D5E)',
            color: '#080A0F',
            padding: '5px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)',
          }}>
            {text('Khuyên Dùng', 'Recommended')}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>VIP Premium</h3>
              <span className="badge badge-rose">Full Access</span>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFF' }}>69.000đ</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{text(' / tháng', ' / month')}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
              {text(
                'Dành cho tín đồ thời trang thực thụ muốn tối ưu hóa phong cách mỗi ngày.',
                'For true fashion enthusiasts seeking to elevate their signature style every day.'
              )}
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={18} color="#FB7185" />
                <span><strong>{text('Không giới hạn', 'Unlimited')}</strong> {text('số lượng món đồ trong tủ', 'wardrobe items capacity')}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={18} color="#FB7185" />
                <span><strong>{text('Không giới hạn', 'Unlimited')}</strong> {text('bộ phối đồ Outfit Studio', 'Outfit Studio combinations')}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={18} color="#FB7185" />
                <span><strong>{text('AI Stylist không giới hạn', 'Unlimited AI Stylist')}</strong> {text('theo mọi ngữ cảnh', 'for any occasion')}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={18} color="#FB7185" />
                <span>{text('Phân tích độ tương phản và hài hòa màu sắc', 'Color harmony & contrast ratio analytics')}</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={18} color="#FB7185" />
                <span>{text('Gợi ý độc quyền xu hướng thời trang mùa mới', 'Exclusive seasonal trend recommendations')}</span>
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '36px' }}>
            <button
              onClick={onUpgrade}
              id="btn-upgrade-premium"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
            >
              <Crown size={18} />
              <span>{isPremium ? text('Bạn Đang Là Thành Viên VIP', 'Active VIP Member') : text('Nâng Cấp Ngay Chỉ 69K/tháng', 'Upgrade Now for $2.99 / mo')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
