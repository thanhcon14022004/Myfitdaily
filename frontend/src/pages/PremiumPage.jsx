import React, { useState } from 'react';
import {
  Crown,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  Star,
  Infinity as InfinityIcon,
  Layers,
  QrCode,
  X,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { apiRequest } from '../api/apiClient';

export default function PremiumPage({ user, onUpgrade }) {
  const { text, isEnglish } = useLanguage();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

  // Modal thanh toán
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    plan: null,
    cycle: 'monthly',
    isProcessing: false,
    success: false
  });

  const subType = user?.subscriptionType || 'Free';
  const isPremium = subType.toLowerCase() === 'premium';
  const isPremiumPlus = subType.toLowerCase() === 'premiumplus' || subType.toLowerCase() === 'premium_plus';

  const plans = [
    {
      id: 'Free',
      name: 'Free',
      subtitle: text('Khởi đầu phong cách cơ bản', 'Essential style starter'),
      targetSegment: text('Người dùng mới', 'New Users'),
      monthlyPrice: 0,
      yearlyPrice: 0,
      badge: text('Mặc Định', 'Default'),
      badgeClass: 'badge-indigo',
      accentColor: '#6366F1',
      maxClothes: '15',
      aiLimit: text('5 gợi ý outfit / ngày', '5 outfit recommendations / day'),
      features: [
        { text: text('Quản lý tối đa 15 món đồ trong tủ', 'Manage up to 15 wardrobe items'), highlight: false },
        { text: text('5 gợi ý outfit/ngày từ AI Stylist', '5 AI Stylist suggestions daily'), highlight: false },
        { text: text('Gợi ý mua sắm cơ bản', 'Basic shopping recommendations'), highlight: false },
        { text: text('Thử đồ mô phỏng 2D cơ bản', 'Basic 2D mannequin preview'), highlight: false },
      ],
      notIncluded: [
        text('Gợi ý AI không giới hạn', 'Unlimited AI recommendations'),
        text('Phối đồ theo thời tiết & sự kiện', 'Weather & event based styling'),
        text('Giả lập phom dáng AI (Body simulation)', 'AI body simulation & fit analyzer'),
        text('Lưu trữ không giới hạn tủ đồ', 'Unlimited wardrobe storage'),
      ]
    },
    {
      id: 'Premium',
      name: 'Premium',
      subtitle: text('Tối ưu hóa gu thẩm mỹ hằng ngày', 'Daily personal styling elevated'),
      targetSegment: text('Gen Z & Giới văn phòng trẻ', 'Gen Z & Young Professionals'),
      monthlyPrice: 49000,
      yearlyPrice: 499000,
      badge: text('Phổ Biến Nhất 🔥', 'Most Popular 🔥'),
      badgeClass: 'badge-gold',
      accentColor: '#D4AF37',
      isPopular: true,
      maxClothes: '100',
      aiLimit: text('Không giới hạn lượt hỏi', 'Unlimited consultations'),
      features: [
        { text: text('Quản lý tối đa 100 món đồ trong tủ', 'Manage up to 100 wardrobe items'), highlight: true },
        { text: text('Gợi ý AI không giới hạn lượt hỏi', 'Unlimited AI Stylist recommendations'), highlight: true },
        { text: text('Phối đồ theo thời tiết & sự kiện linh hoạt', 'Weather & event-adaptive styling'), highlight: true },
        { text: text('Lưu & tra cứu lịch sử outfit toàn diện', 'Outfit history & lookbook archive'), highlight: false },
        { text: text('Mặc thử đồ Haute Couture trên Mannequin ảo 3D', 'Haute Couture 3D mannequin fitting'), highlight: true },
        { text: text('Gợi ý mua sắm trực tiếp từ sàn TMĐT liên kết', 'E-commerce smart shopping matching'), highlight: false },
      ],
      notIncluded: [
        text('Giả lập phom dáng AI chuyên sâu', 'Advanced AI body simulation'),
        text('Lưu trữ không giới hạn số lượng', 'Unlimited storage capacity'),
      ]
    },
    {
      id: 'PremiumPlus',
      name: 'Premium Plus',
      subtitle: text('Đặc quyền vương giả Haute Couture', 'Haute Couture exclusive privileges'),
      targetSegment: text('Tín đồ thời trang', 'Fashion Enthusiasts & Stylists'),
      monthlyPrice: 99000,
      yearlyPrice: 999000,
      badge: text('Đặc Quyền VIP 💎', 'VIP Exclusive 💎'),
      badgeClass: 'badge-rose',
      accentColor: '#FB7185',
      isVipPlus: true,
      maxClothes: text('Không giới hạn', 'Unlimited'),
      aiLimit: text('Không giới hạn + Tốc độ cao', 'Unlimited + Ultra-fast'),
      features: [
        { text: text('Lưu trữ KHÔNG GIỚI HẠN số lượng món đồ', 'UNLIMITED wardrobe storage capacity'), highlight: true },
        { text: text('Giả lập phom dáng AI (AI body simulation)', 'AI 3D body simulation & proportion analytics'), highlight: true },
        { text: text('Phân tích tủ đồ nâng cao & báo cáo xu hướng', 'Advanced closet analytics & trend forecast'), highlight: true },
        { text: text('Tất cả đặc quyền của gói Premium', 'All features from Premium tier'), highlight: false },
        { text: text('AI Stylist tốc độ cao 0.5s ưu tiên máy chủ VIP', 'Priority 0.5s ultra-fast AI server processing'), highlight: true },
        { text: text('Trải nghiệm sớm các bộ sưu tập Haute Couture mới', 'Early access to exclusive haute couture collections'), highlight: false },
      ],
      notIncluded: []
    }
  ];

  const handleOpenPayment = (plan) => {
    if (plan.id === 'Free') {
      if (subType !== 'Free') {
        if (window.confirm(text("Bạn có muốn chuyển về gói Free cơ bản?", "Switch back to Free tier?"))) {
          executeUpgrade('Free', 'monthly');
        }
      }
      return;
    }

    setPaymentModal({
      isOpen: true,
      plan: plan,
      cycle: billingCycle,
      isProcessing: false,
      success: false
    });
  };

  const executeUpgrade = async (planId, cycle) => {
    setPaymentModal(prev => ({ ...prev, isProcessing: true }));
    try {
      if (onUpgrade) {
        await onUpgrade(planId, cycle);
      } else {
        // Fallback gọi API trực tiếp
        const res = await apiRequest('/api/subscription/upgrade', {
          method: 'POST',
          body: JSON.stringify({
            planId: planId,
            billingCycle: cycle === 'yearly' ? 'Yearly' : 'Monthly',
            paymentMethod: 'VietQR'
          })
        });
        if (res?.data) {
          localStorage.setItem('myfitdaily_user', JSON.stringify(res.data));
        }
      }
      setPaymentModal(prev => ({ ...prev, isProcessing: false, success: true }));
      setTimeout(() => {
        setPaymentModal(prev => ({ ...prev, isOpen: false }));
      }, 1800);
    } catch (err) {
      console.error("Upgrade error:", err);
      alert(err.message || text("Nâng cấp thất bại, vui lòng thử lại.", "Upgrade failed, please try again."));
      setPaymentModal(prev => ({ ...prev, isProcessing: false }));
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px 100px', maxWidth: '1240px' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 44px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 18px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(212, 175, 55, 0.15)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          color: '#FCD34D',
          fontSize: '0.88rem',
          fontWeight: 700,
          marginBottom: '18px',
          boxShadow: '0 4px 20px rgba(212, 175, 55, 0.2)'
        }}>
          <Crown size={18} />
          <span>{text('Hệ Thống Gói Thành Viên VIP MYFITDAILY', 'MYFITDAILY VIP Membership System')}</span>
        </div>

        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '14px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          {text('Nâng Tầm Tủ Đồ Với ', 'Elevate Your Wardrobe With ')}
          <span className="gradient-text">Đặc Quyền VIP</span>
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: 1.6 }}>
          {text(
            'Chọn gói dịch vụ phù hợp với phong cách sống của bạn: từ người dùng mới bắt đầu làm quen đến tín đồ thời trang thực thụ.',
            'Choose the right plan tailored to your lifestyle: from smart beginners to true high-fashion connoisseurs.'
          )}
        </p>

        {/* Billing Cycle Switch (Tháng / Năm) */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '6px',
          borderRadius: '9999px',
          marginTop: '28px',
        }}>
          <button
            onClick={() => setBillingCycle('monthly')}
            id="btn-billing-monthly"
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: billingCycle === 'monthly' ? 700 : 500,
              background: billingCycle === 'monthly' ? 'var(--primary)' : 'transparent',
              color: billingCycle === 'monthly' ? '#080A0F' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            {text('Thanh toán theo Tháng', 'Monthly Billing')}
          </button>

          <button
            onClick={() => setBillingCycle('yearly')}
            id="btn-billing-yearly"
            style={{
              padding: '8px 20px',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: billingCycle === 'yearly' ? 700 : 500,
              background: billingCycle === 'yearly' ? 'var(--primary)' : 'transparent',
              color: billingCycle === 'yearly' ? '#080A0F' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{text('Thanh toán theo Năm', 'Yearly Billing')}</span>
            <span style={{
              background: billingCycle === 'yearly' ? '#080A0F' : '#10B981',
              color: billingCycle === 'yearly' ? '#D4AF37' : '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '9999px'
            }}>
              {text('Tiết Kiệm 16%', 'Save 16%')}
            </span>
          </button>
        </div>
      </div>

      {/* 3 Pricing Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        marginBottom: '60px',
        alignItems: 'stretch',
        paddingTop: '20px',
      }}>
        {plans.map((plan) => {
          const isCurrentPlan =
            (plan.id === 'Free' && !isPremium && !isPremiumPlus) ||
            (plan.id === 'Premium' && isPremium) ||
            (plan.id === 'PremiumPlus' && isPremiumPlus);

          const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          const formattedPrice = price === 0 ? '0 VNĐ' : `${price.toLocaleString('vi-VN')} VNĐ`;
          const periodText = billingCycle === 'monthly'
            ? text('/ tháng', '/ month')
            : text('/ năm', '/ year');

          return (
            <div
              key={plan.id}
              className="glass-card"
              style={{
                padding: '36px 30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                borderRadius: '24px',
                overflow: 'visible',
                border: plan.isPopular
                  ? '2px solid rgba(212, 175, 55, 0.85)'
                  : plan.isVipPlus
                    ? '2px solid rgba(251, 113, 133, 0.85)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: plan.isPopular
                  ? '0 16px 50px rgba(212, 175, 55, 0.18)'
                  : plan.isVipPlus
                    ? '0 16px 50px rgba(251, 113, 133, 0.18)'
                    : '0 8px 30px rgba(0, 0, 0, 0.3)',
                background: plan.isPopular
                  ? 'linear-gradient(180deg, rgba(212, 175, 55, 0.08) 0%, rgba(17, 24, 39, 0.95) 100%)'
                  : plan.isVipPlus
                    ? 'linear-gradient(180deg, rgba(251, 113, 133, 0.08) 0%, rgba(17, 24, 39, 0.95) 100%)'
                    : 'rgba(17, 24, 39, 0.6)',
                transform: (plan.isPopular || plan.isVipPlus) ? 'scale(1.02)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Badge trên cùng */}
              {plan.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  right: '24px',
                  zIndex: 20,
                  background: plan.isPopular
                    ? 'linear-gradient(135deg, #D4AF37, #C27D5E)'
                    : plan.isVipPlus
                      ? 'linear-gradient(135deg, #FB7185, #E11D48)'
                      : 'linear-gradient(135deg, #6366F1, #4F46E5)',
                  color: (plan.isPopular || plan.isVipPlus) ? '#080A0F' : '#FFFFFF',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  lineHeight: '1.2',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                  boxShadow: plan.isPopular
                    ? '0 4px 14px rgba(212, 175, 55, 0.4)'
                    : plan.isVipPlus
                      ? '0 4px 14px rgba(251, 113, 133, 0.4)'
                      : '0 4px 14px rgba(99, 102, 241, 0.4)'
                }}>
                  {plan.badge}
                </div>
              )}

              {/* Phần trên: Tên gói & Giá & Phân khúc */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
                    {plan.name}
                  </h3>
                  {plan.isVipPlus && <Sparkles size={20} color="#FB7185" />}
                  {plan.isPopular && <Crown size={20} color="#D4AF37" />}
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', minHeight: '38px', marginBottom: '16px' }}>
                  {plan.subtitle}
                </p>

                {/* Phân khúc mục tiêu theo đề bài */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{text('Mục tiêu:', 'Target:')}</span>
                  <span style={{ color: plan.accentColor, fontWeight: 600 }}>{plan.targetSegment}</span>
                </div>

                {/* Giá tiền */}
                <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFF', letterSpacing: '-0.02em' }}>
                      {formattedPrice}
                    </span>
                    {price > 0 && (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        {periodText}
                      </span>
                    )}
                  </div>
                  {price === 0 && (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {text('Miễn phí vĩnh viễn khi đăng ký', 'Forever free on registration')}
                    </span>
                  )}
                </div>

                {/* Danh sách tính năng */}
                <div style={{ marginBottom: '28px' }}>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '14px', fontWeight: 700 }}>
                    {text('Tính Năng Chính', 'Core Features')}
                  </h4>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, margin: 0 }}>
                    {plan.features.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', lineHeight: 1.4 }}>
                        <Check
                          size={18}
                          color={plan.accentColor}
                          style={{ minWidth: '18px', marginTop: '2px' }}
                        />
                        <span style={{
                          color: feat.highlight ? '#FFFFFF' : 'var(--text-secondary)',
                          fontWeight: feat.highlight ? 600 : 400
                        }}>
                          {feat.text}
                        </span>
                      </li>
                    ))}

                    {plan.notIncluded.map((notFeat, idx) => (
                      <li key={`not-${idx}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        <span style={{ minWidth: '18px', textAlign: 'center', opacity: 0.5 }}>✕</span>
                        <span>{notFeat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Nút hành động đăng ký / nâng cấp */}
              <div style={{ marginTop: '16px' }}>
                <button
                  onClick={() => handleOpenPayment(plan)}
                  id={`btn-plan-${plan.id.toLowerCase()}`}
                  disabled={isCurrentPlan && plan.id !== 'Free'}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: isCurrentPlan ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    background: isCurrentPlan
                      ? 'rgba(255, 255, 255, 0.08)'
                      : plan.isPopular
                        ? 'linear-gradient(135deg, #D4AF37, #C27D5E)'
                        : plan.isVipPlus
                          ? 'linear-gradient(135deg, #FB7185, #E11D48)'
                          : 'rgba(255, 255, 255, 0.1)',
                    color: isCurrentPlan
                      ? 'var(--text-secondary)'
                      : (plan.isPopular || plan.isVipPlus) ? '#080A0F' : '#FFF',
                  }}
                >
                  {isCurrentPlan ? (
                    <>
                      <CheckCircle2 size={18} color="#10B981" />
                      <span>{text('Gói Bạn Đang Dùng', 'Current Active Plan')}</span>
                    </>
                  ) : plan.id === 'Free' ? (
                    <span>{text('Sử Dụng Gói Free', 'Use Free Plan')}</span>
                  ) : (
                    <>
                      <Crown size={18} />
                      <span>
                        {plan.id === 'Premium'
                          ? text('Nâng Cấp VIP Premium', 'Upgrade to Premium')
                          : text('Kích Hoạt Premium Plus 💎', 'Activate Premium Plus 💎')}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bảng so sánh tính năng chi tiết */}
      <div className="glass-card" style={{ padding: '36px 32px', borderRadius: '24px', marginBottom: '50px' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px', textAlign: 'center' }}>
          {text('So Sánh Chi Tiết Các Quyền Lợi & Hạn Mức', 'Detailed Feature & Quota Comparison')}
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <th style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>{text('Tính năng / Hạn mức', 'Feature / Limit')}</th>
                <th style={{ padding: '14px 16px', color: '#6366F1', fontWeight: 700, textAlign: 'center' }}>Free (0 VNĐ)</th>
                <th style={{ padding: '14px 16px', color: '#D4AF37', fontWeight: 700, textAlign: 'center' }}>Premium (49k/tháng)</th>
                <th style={{ padding: '14px 16px', color: '#FB7185', fontWeight: 700, textAlign: 'center' }}>Premium Plus (99k/tháng)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{text('Sức chứa tủ đồ (Quản lý món đồ)', 'Wardrobe item capacity')}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#F87171' }}>{text('Tối đa 15 món', 'Up to 15 items')}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#FCD34D' }}>{text('Tối đa 100 món', 'Up to 100 items')}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#34D399', fontWeight: 700 }}>{text('Không giới hạn (Unlimited)', 'Unlimited')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{text('Gợi ý phối đồ AI Stylist', 'AI Stylist consultations')}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#F87171' }}>{text('5 lượt / ngày', '5 daily')}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#34D399', fontWeight: 700 }}>{text('Không giới hạn', 'Unlimited')}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#34D399', fontWeight: 700 }}>{text('Không giới hạn (Ưu tiên VIP)', 'Unlimited + Priority')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{text('Phối đồ theo thời tiết & sự kiện', 'Weather & occasion styling')}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>✕</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#10B981' }}>✓</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#10B981' }}>✓</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{text('Thử đồ người ảo 3D Haute Couture', 'Haute Couture 3D Mannequin')}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>{text('Cơ bản', 'Basic')}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#10B981' }}>✓ {text('Đầy đủ', 'Full')}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#10B981' }}>✓ {text('Độc quyền', 'Exclusive')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{text('Giả lập phom dáng AI (AI body simulation)', 'AI body simulation & fit')}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>✕</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>✕</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#FB7185', fontWeight: 700 }}>✓ {text('Đặc quyền Plus', 'Plus Exclusive')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{text('Phân tích tủ đồ & báo cáo xu hướng', 'Closet analytics & trend reports')}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>✕</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>{text('Cơ bản', 'Basic')}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#FB7185', fontWeight: 700 }}>✓ {text('Nâng cao', 'Advanced')}</td>
              </tr>
              <tr>
                <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{text('Phân khúc người dùng mục tiêu', 'Target user segment')}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>{text('Người dùng mới', 'New Users')}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#D4AF37', fontWeight: 600 }}>{text('Gen Z & Giới văn phòng trẻ', 'Gen Z & Young Pros')}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#FB7185', fontWeight: 600 }}>{text('Tín đồ thời trang', 'Fashionistas')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thanh Toán Chuyên Nghiệp VietQR / MoMo */}
      {paymentModal.isOpen && paymentModal.plan && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 15, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-card" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '32px',
            borderRadius: '24px',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
            position: 'relative'
          }}>
            {/* Nút đóng */}
            <button
              onClick={() => setPaymentModal(prev => ({ ...prev, isOpen: false }))}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {paymentModal.success ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle2 size={64} color="#10B981" style={{ margin: '0 auto 18px' }} />
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '10px', color: '#FFF' }}>
                  {text('Kích Hoạt Thành Công!', 'Activation Successful!')}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  {text(
                    `Chúc mừng bạn đã nâng cấp gói ${paymentModal.plan.name} thành công. Tận hưởng mọi đặc quyền VIP ngay bây giờ!`,
                    `Congratulations! You have successfully upgraded to ${paymentModal.plan.name}. Enjoy your VIP privileges!`
                  )}
                </p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                  <Crown size={24} color="#D4AF37" />
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                      {text(`Xác Nhận Nâng Cấp Gói ${paymentModal.plan.name}`, `Confirm Upgrade to ${paymentModal.plan.name}`)}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {text('Thanh toán an toàn qua cổng VietQR ngân hàng Việt Nam', 'Secure payment via VietQR banking')}
                    </p>
                  </div>
                </div>

                {/* Tóm tắt thanh toán */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{text('Gói dịch vụ:', 'Plan:')}</span>
                    <span style={{ fontWeight: 700, color: '#FFF' }}>{paymentModal.plan.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{text('Chu kỳ thanh toán:', 'Billing Cycle:')}</span>
                    <span style={{ fontWeight: 600, color: '#D4AF37' }}>
                      {paymentModal.cycle === 'yearly' ? text('1 Năm (12 tháng)', '1 Year') : text('1 Tháng', '1 Month')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontWeight: 700, color: '#FFF' }}>{text('Tổng thanh toán:', 'Total Amount:')}</span>
                    <span style={{ fontWeight: 800, color: '#10B981', fontSize: '1.25rem' }}>
                      {paymentModal.cycle === 'yearly'
                        ? `${paymentModal.plan.yearlyPrice.toLocaleString('vi-VN')} VNĐ`
                        : `${paymentModal.plan.monthlyPrice.toLocaleString('vi-VN')} VNĐ`}
                    </span>
                  </div>
                </div>

                {/* Mã VietQR Giả lập sinh động */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '18px',
                  textAlign: 'center',
                  marginBottom: '20px',
                  color: '#080A0F',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontWeight: 800, color: '#00529B', fontSize: '0.9rem' }}>VietQR</span>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>| MBBank • STK: 098888888888</span>
                  </div>

                  {/* SVG VietQR Mockup */}
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                    <svg width="150" height="150" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100" height="100" fill="white" />
                      {/* 3 Corner squares */}
                      <rect x="10" y="10" width="24" height="24" fill="#0F172A" />
                      <rect x="14" y="14" width="16" height="16" fill="white" />
                      <rect x="18" y="18" width="8" height="8" fill="#0F172A" />

                      <rect x="66" y="10" width="24" height="24" fill="#0F172A" />
                      <rect x="70" y="14" width="16" height="16" fill="white" />
                      <rect x="74" y="18" width="8" height="8" fill="#0F172A" />

                      <rect x="10" y="66" width="24" height="24" fill="#0F172A" />
                      <rect x="14" y="70" width="16" height="16" fill="white" />
                      <rect x="18" y="74" width="8" height="8" fill="#0F172A" />

                      {/* Random Matrix Dots */}
                      <rect x="40" y="12" width="6" height="6" fill="#0F172A" />
                      <rect x="52" y="12" width="6" height="6" fill="#0F172A" />
                      <rect x="46" y="24" width="6" height="6" fill="#0F172A" />
                      <rect x="12" y="42" width="6" height="6" fill="#0F172A" />
                      <rect x="24" y="42" width="6" height="6" fill="#0F172A" />
                      <rect x="40" y="40" width="18" height="18" fill="#D4AF37" rx="3" />
                      <rect x="66" y="42" width="6" height="6" fill="#0F172A" />
                      <rect x="78" y="42" width="6" height="6" fill="#0F172A" />
                      <rect x="40" y="68" width="6" height="6" fill="#0F172A" />
                      <rect x="52" y="76" width="6" height="6" fill="#0F172A" />
                      <rect x="68" y="68" width="6" height="6" fill="#0F172A" />
                      <rect x="76" y="76" width="12" height="12" fill="#0F172A" />
                    </svg>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#4B5563', lineHeight: 1.4 }}>
                    {text('Nội dung chuyển khoản:', 'Transfer note:')} <strong>MFD VIP {user?.id || 1}</strong>
                  </div>
                </div>

                {/* Nút hành động thanh toán */}
                <button
                  onClick={() => executeUpgrade(paymentModal.plan.id, paymentModal.cycle)}
                  disabled={paymentModal.isProcessing}
                  id="btn-confirm-upgrade"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: paymentModal.isProcessing ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  {paymentModal.isProcessing ? (
                    <span>{text('Đang xác thực & kích hoạt VIP...', 'Activating VIP...')}</span>
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      <span>{text('Xác Nhận Đã Chuyển Khoản & Kích Hoạt Tức Thì', 'Confirm Transfer & Activate Now')}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
