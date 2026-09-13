import React from 'react';
import { Crown, Check, Sparkles, Zap, Shield, Star } from 'lucide-react';

export default function PremiumPage({ user, onUpgrade }) {
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
          <span>Gói Thành Viên Đặc Quyền</span>
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
          Nâng Tầm Phong Cách Với <span className="gradient-text">MYFITDAILY VIP</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: 1.6 }}>
          Mở khóa không giới hạn sức mạnh AI Stylist và khả năng lưu trữ tủ đồ tối đa cho cả gia đình.
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
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Gói Cơ Bản (Free)</h3>
              <span className="badge badge-indigo">Miễn Phí</span>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFF' }}>0đ</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}> / vĩnh viễn</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
              Trải nghiệm các tính năng cốt lõi để bắt đầu làm quen với tủ đồ số.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={18} color="#10B981" />
                <span>Quản lý tối đa <strong>25 món đồ</strong></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={18} color="#10B981" />
                <span>Tạo tối đa <strong>10 bộ phối đồ</strong></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={18} color="#10B981" />
                <span>5 lượt gợi ý AI Stylist mỗi ngày</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <span>✕ Phân tích hình ảnh AI nâng cao</span>
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '36px' }}>
            <button
              disabled={!isPremium}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {!isPremium ? 'Đang Sử Dụng' : 'Chuyển Về Free'}
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
            Khuyên Dùng
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>VIP Premium</h3>
              <span className="badge badge-rose">Full Access</span>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFF' }}>69.000đ</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}> / tháng</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
              Dành cho tín đồ thời trang thực thụ muốn tối ưu hóa phong cách mỗi ngày.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={18} color="#FB7185" />
                <span><strong>Không giới hạn</strong> số lượng món đồ trong tủ</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={18} color="#FB7185" />
                <span><strong>Không giới hạn</strong> bộ phối đồ Outfit Studio</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={18} color="#FB7185" />
                <span><strong>AI Stylist không giới hạn</strong> theo mọi ngữ cảnh</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={18} color="#FB7185" />
                <span>Phân tích độ tương phản và hài hòa màu sắc</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={18} color="#FB7185" />
                <span>Gợi ý độc quyền xu hướng thời trang mùa mới</span>
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
              <span>{isPremium ? 'Bạn Đang Là Thành Viên VIP' : 'Nâng Cấp Ngay Chỉ 69K/tháng'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
