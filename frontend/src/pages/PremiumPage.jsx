import React, { useState, useEffect, useRef } from 'react';
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
  Sparkle,
  Copy,
  CheckCheck,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { apiRequest } from '../api/apiClient';
import { getSubscriptionType, isPremiumUser, isPremiumPlusUser, sanitizeUser } from '../utils/subscriptionUtils';
import SubscriptionCountdown from '../components/SubscriptionCountdown';

export default function PremiumPage({ user, onUpgrade }) {
  const { text, isEnglish } = useLanguage();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [modalCountdown, setModalCountdown] = useState(900); // 15 phút đếm ngược

  // Modal thanh toán SePay
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    plan: null,
    cycle: 'monthly',
    isCreating: false,
    orderData: null,
    isChecking: false,
    success: false,
    errorMessage: null,
    copiedField: null
  });

  const pollIntervalRef = useRef(null);

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  // Đếm ngược 15 phút cho modal thanh toán
  useEffect(() => {
    if (!paymentModal.isOpen || !paymentModal.orderData || paymentModal.success) return;
    setModalCountdown(900);
    const timer = setInterval(() => {
      setModalCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          stopPolling();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentModal.isOpen, paymentModal.orderData, paymentModal.success]);

  const formatModalTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const subType = getSubscriptionType(user);
  const isPremium = isPremiumUser(user);
  const isPremiumPlus = isPremiumPlusUser(user);

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
        { text: text('Hỗ trợ 1-1 chuyên sâu từ Fashion Stylist chuyên gia', '1-on-1 priority support from certified fashion stylist'), highlight: true },
        { text: text('Voucher & deal giảm giá VIP độc quyền đối tác liên kết', 'Exclusive VIP discount vouchers from partner brands'), highlight: false },
      ],
      notIncluded: []
    }
  ];

  const handleCloseModal = () => {
    stopPolling();
    setPaymentModal(prev => ({
      ...prev,
      isOpen: false,
      isCreating: false,
      orderData: null,
      isChecking: false,
      errorMessage: null,
      copiedField: null
    }));
  };

  const copyToClipboard = (textToCopy, fieldName) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(String(textToCopy));
    setPaymentModal(prev => ({ ...prev, copiedField: fieldName }));
    setTimeout(() => {
      setPaymentModal(prev => ({ ...prev, copiedField: null }));
    }, 2000);
  };

  const checkPaymentStatus = async (orderCode, isManual = false) => {
    if (!orderCode) return;
    if (isManual) {
      setPaymentModal(prev => ({ ...prev, isChecking: true }));
    }

    try {
      const res = await apiRequest(`/subscription/check-payment/${orderCode}`);
      if (res.ok && res.data?.data?.isSuccess) {
        stopPolling();
        const rawUser = res.data.data.user;
        const updatedUser = sanitizeUser(rawUser);
        if (updatedUser) {
          localStorage.setItem('myfitdaily_user', JSON.stringify(updatedUser));
          if (onUpgrade) {
            onUpgrade(updatedUser);
          }
        }

        setPaymentModal(prev => ({
          ...prev,
          isChecking: false,
          success: true
        }));

        setTimeout(() => {
          handleCloseModal();
        }, 2200);
      } else {
        if (isManual) {
          setPaymentModal(prev => ({
            ...prev,
            isChecking: false
          }));
        }
      }
    } catch (err) {
      console.warn("Check payment error:", err);
      if (isManual) {
        setPaymentModal(prev => ({ ...prev, isChecking: false }));
      }
    }
  };

  const startPolling = (orderCode) => {
    stopPolling();
    pollIntervalRef.current = setInterval(() => {
      checkPaymentStatus(orderCode, false);
    }, 3000);
  };

  const handleOpenPayment = async (plan) => {
    if (plan.id === 'Free') {
      if (subType !== 'Free') {
        if (window.confirm(text("Bạn có muốn chuyển về gói Free cơ bản?", "Switch back to Free tier?"))) {
          executeDirectFreeUpgrade();
        }
      }
      return;
    }

    stopPolling();
    setPaymentModal({
      isOpen: true,
      plan: plan,
      cycle: billingCycle,
      isCreating: true,
      orderData: null,
      isChecking: false,
      success: false,
      errorMessage: null,
      copiedField: null
    });

    try {
      const res = await apiRequest('/subscription/create-payment', {
        method: 'POST',
        body: JSON.stringify({
          planId: plan.id,
          billingCycle: billingCycle === 'yearly' ? 'Yearly' : 'Monthly'
        })
      });

      if (res.ok && res.data?.data) {
        const order = res.data.data;
        setPaymentModal(prev => ({
          ...prev,
          isCreating: false,
          orderData: order
        }));
        startPolling(order.orderCode);
      } else {
        setPaymentModal(prev => ({
          ...prev,
          isCreating: false,
          errorMessage: res.data?.message || text("Không thể tạo mã VietQR SePay, vui lòng thử lại.", "Failed to create SePay QR, please retry.")
        }));
      }
    } catch (err) {
      setPaymentModal(prev => ({
        ...prev,
        isCreating: false,
        errorMessage: err.message || text("Lỗi kết nối máy chủ thanh toán.", "Payment server connection error.")
      }));
    }
  };

  const executeDirectFreeUpgrade = async () => {
    try {
      const res = await apiRequest('/subscription/upgrade', {
        method: 'POST',
        body: JSON.stringify({
          planId: 'Free',
          billingCycle: 'Monthly',
          paymentMethod: 'Direct'
        })
      });
      if (res?.data?.data) {
        const clean = sanitizeUser(res.data.data);
        localStorage.setItem('myfitdaily_user', JSON.stringify(clean));
        if (onUpgrade) onUpgrade(clean);
      }
      alert(text("Đã chuyển về gói Free thành công!", "Switched to Free plan successfully!"));
    } catch (err) {
      console.error("Free upgrade error:", err);
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

      {/* Banner Đếm Ngược Thời Gian Gói VIP Đang Kích Hoạt */}
      {(isPremium || isPremiumPlus) && (
        <SubscriptionCountdown
          expiresAt={user?.subscriptionExpiresAt}
          planType={subType}
          variant="banner"
        />
      )}

      {/* 3 Pricing Cards Grid */}
      <div className="pricing-grid-3cols">
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
                padding: '32px 24px',
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
                    : '1px solid rgba(255, 255, 255, 0.12)',
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
                transition: 'all 0.3s ease',
                height: '100%',
              }}
            >
              {/* Badge trên cùng */}
              {plan.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  right: '20px',
                  zIndex: 20,
                  background: plan.isPopular
                    ? 'linear-gradient(135deg, #D4AF37, #C27D5E)'
                    : plan.isVipPlus
                      ? 'linear-gradient(135deg, #FB7185, #E11D48)'
                      : 'linear-gradient(135deg, #6366F1, #4F46E5)',
                  color: (plan.isPopular || plan.isVipPlus) ? '#080A0F' : '#FFFFFF',
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.76rem',
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '36px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>
                    {plan.name}
                  </h3>
                  {plan.isVipPlus && <Sparkles size={20} color="#FB7185" />}
                  {plan.isPopular && <Crown size={20} color="#D4AF37" />}
                  {plan.id === 'Free' && <span style={{ width: 20 }} />}
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', minHeight: '42px', marginBottom: '14px', lineHeight: 1.4 }}>
                  {plan.subtitle}
                </p>

                {/* Phân khúc mục tiêu */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '18px',
                  minHeight: '34px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{text('Mục tiêu:', 'Target:')}</span>
                  <span style={{ color: plan.accentColor, fontWeight: 600 }}>{plan.targetSegment}</span>
                </div>

                {/* Giá tiền */}
                <div style={{ marginBottom: '22px', paddingBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 'clamp(1.65rem, 2vw, 2.15rem)', fontWeight: 800, color: '#FFF', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                      {formattedPrice}
                    </span>
                    {price > 0 && (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                        {periodText}
                      </span>
                    )}
                  </div>
                  {price === 0 && (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '4px' }}>
                      {text('Miễn phí vĩnh viễn khi đăng ký', 'Forever free on registration')}
                    </span>
                  )}
                </div>

                {/* Danh sách tính năng */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '14px', fontWeight: 700 }}>
                    {text('Tính Năng & Quyền Lợi', 'Core Features & Benefits')}
                  </h4>

                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px', padding: 0, margin: 0 }}>
                    {plan.features.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', lineHeight: 1.35 }}>
                        <Check
                          size={16}
                          color={plan.accentColor}
                          style={{ minWidth: '16px', marginTop: '2px', flexShrink: 0 }}
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
                      <li key={`not-${idx}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                        <span style={{ minWidth: '16px', textAlign: 'center', opacity: 0.5, flexShrink: 0 }}>✕</span>
                        <span>{notFeat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Nút hành động đăng ký / nâng cấp */}
              <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                {isCurrentPlan && (plan.id === 'Premium' || plan.id === 'PremiumPlus') && (
                  <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
                    <SubscriptionCountdown
                      expiresAt={user?.subscriptionExpiresAt}
                      planType={subType}
                      variant="compact"
                    />
                  </div>
                )}
                {plan.id === 'Free' && (isPremium || isPremiumPlus) ? (
                  <div style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: '12px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px dashed rgba(255, 255, 255, 0.12)',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    minHeight: '48px'
                  }}>
                    <Check size={16} color="#10B981" />
                    <span>{text('Đã mở khóa bằng gói VIP cao cấp hơn', 'Unlocked via higher VIP plan')}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenPayment(plan)}
                    id={`btn-plan-${plan.id.toLowerCase()}`}
                    disabled={isCurrentPlan}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      borderRadius: '12px',
                      fontSize: '0.94rem',
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
                )}
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

      {/* Modal Thanh Toán Tự Động SePay VietQR */}
      {paymentModal.isOpen && paymentModal.plan && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 15, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-card" style={{
            maxWidth: '540px',
            width: '100%',
            padding: '28px 26px',
            borderRadius: '24px',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Nút đóng */}
            <button
              onClick={handleCloseModal}
              id="btn-close-payment-modal"
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
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
                transition: 'all 0.2s ease',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>

            {paymentModal.success ? (
              /* Màn hình thông báo kích hoạt VIP thành công */
              <div style={{ textAlign: 'center', padding: '36px 10px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '2px solid #10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
                }}>
                  <CheckCircle2 size={46} color="#10B981" />
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '10px', color: '#FFF' }}>
                  {text('Kích Hoạt VIP Thành Công!', 'VIP Activated Successfully!')}
                </h3>
                <p style={{ color: '#D1D5DB', fontSize: '1.02rem', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 16px' }}>
                  {text(
                    `Hệ thống SePay đã ghi nhận thanh toán! Bạn đã trở thành hội viên ${paymentModal.plan.name}. Tận hưởng ngay các đặc quyền thời trang cao cấp.`,
                    `SePay transaction confirmed! You are now a ${paymentModal.plan.name} member. Enjoy your exclusive fashion styling features.`
                  )}
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <Sparkles size={16} color="#D4AF37" />
                  <span>{text('Đang chuyển hướng về trang chính...', 'Redirecting to dashboard...')}</span>
                </div>
              </div>
            ) : paymentModal.isCreating ? (
              /* Đang khởi tạo mã thanh toán */
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Loader2 size={44} color="#D4AF37" className="spinning" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>
                  {text('Đang khởi tạo mã VietQR SePay...', 'Generating SePay VietQR...')}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {text('Hệ thống đang kết nối cổng ngân hàng để cấp mã đơn hàng riêng biệt.', 'Connecting to bank gateway for your unique transfer order.')}
                </p>
              </div>
            ) : paymentModal.errorMessage ? (
              /* Báo lỗi khởi tạo */
              <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <X size={32} color="#EF4444" />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>
                  {text('Khởi tạo thanh toán chưa thành công', 'Payment Initialization Failed')}
                </h4>
                <p style={{ color: '#F87171', fontSize: '0.9rem', marginBottom: '20px' }}>
                  {paymentModal.errorMessage}
                </p>
                <button
                  onClick={() => handleOpenPayment(paymentModal.plan)}
                  className="btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.9rem' }}
                >
                  {text('Thử Lại', 'Try Again')}
                </button>
              </div>
            ) : paymentModal.orderData ? (
              /* Giao diện quét mã VietQR SePay động */
              <div>
                {/* Header Tiêu Đề */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.05))',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Crown size={22} color="#D4AF37" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.28rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
                      {text(`Thanh Toán Gói ${paymentModal.plan.name}`, `Pay for ${paymentModal.plan.name}`)}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {text('Quét VietQR SePay – Tự động kích hoạt VIP tức thì', 'Scan VietQR via banking app – Instant auto-activation')}
                    </p>
                  </div>
                </div>

                {/* Đếm ngược thời hạn thanh toán 15 phút */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: modalCountdown < 60 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(212, 175, 55, 0.1)',
                  border: `1px solid ${modalCountdown < 60 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(212, 175, 55, 0.35)'}`,
                  padding: '9px 14px',
                  borderRadius: '12px',
                  marginBottom: '14px',
                  fontSize: '0.84rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={15} color={modalCountdown < 60 ? '#EF4444' : '#D4AF37'} />
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {text('Thời gian hiệu lực mã QR:', 'VietQR session valid for:')}
                    </span>
                  </div>
                  <strong style={{
                    fontFamily: 'monospace',
                    fontSize: '0.98rem',
                    color: modalCountdown < 60 ? '#F87171' : '#FCD34D'
                  }}>
                    {modalCountdown === 0 ? text('Đã hết hạn', 'Expired') : formatModalTime(modalCountdown)}
                  </strong>
                </div>

                {/* Hộp mã QR SePay */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '16px',
                  textAlign: 'center',
                  marginBottom: '16px',
                  color: '#080A0F',
                  boxShadow: '0 10px 35px rgba(0, 0, 0, 0.4)'
                }}>
                  {/* Logo ngân hàng & VietQR */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #E5E7EB', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 800, color: '#00529B', fontSize: '0.95rem', letterSpacing: '0.05em' }}>VietQR</span>
                      <span style={{ fontSize: '0.75rem', background: '#EFF6FF', color: '#1D4ED8', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        {paymentModal.orderData.bankName}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#4B5563', fontWeight: 600 }}>
                      ACB • HA TRUNG THANH
                    </span>
                  </div>

                  {/* Ảnh VietQR SePay thật */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                    <img
                      src={paymentModal.orderData.qrUrl}
                      alt="SePay VietQR Payment"
                      style={{
                        width: '210px',
                        height: '210px',
                        objectFit: 'contain',
                        borderRadius: '10px',
                        border: '1px solid #E5E7EB',
                        padding: '4px',
                        background: '#FFF'
                      }}
                    />
                  </div>

                  {/* Bảng chi tiết chuyển khoản có nút Copy */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', fontSize: '0.85rem' }}>
                    {/* Số tài khoản */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#F3F4F6',
                      padding: '8px 12px',
                      borderRadius: '8px'
                    }}>
                      <div>
                        <span style={{ color: '#6B7280', fontSize: '0.75rem', display: 'block' }}>Số tài khoản:</span>
                        <strong style={{ color: '#111827', fontSize: '0.95rem', letterSpacing: '0.02em' }}>
                          {paymentModal.orderData.accountNumber}
                        </strong>
                      </div>
                      <button
                        onClick={() => copyToClipboard(paymentModal.orderData.accountNumber, 'stk')}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: paymentModal.copiedField === 'stk' ? '#10B981' : '#E5E7EB',
                          color: paymentModal.copiedField === 'stk' ? '#FFF' : '#374151',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {paymentModal.copiedField === 'stk' ? <CheckCheck size={14} /> : <Copy size={14} />}
                        <span>{paymentModal.copiedField === 'stk' ? text('Đã chép!', 'Copied!') : text('Sao chép', 'Copy')}</span>
                      </button>
                    </div>

                    {/* Số tiền */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#F3F4F6',
                      padding: '8px 12px',
                      borderRadius: '8px'
                    }}>
                      <div>
                        <span style={{ color: '#6B7280', fontSize: '0.75rem', display: 'block' }}>Số tiền thanh toán:</span>
                        <strong style={{ color: '#059669', fontSize: '1.05rem', fontWeight: 800 }}>
                          {paymentModal.orderData.amount.toLocaleString('vi-VN')} VNĐ
                        </strong>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>
                        {paymentModal.cycle === 'yearly' ? text('Gói 1 Năm', '1 Year') : text('Gói 1 Tháng', '1 Month')}
                      </span>
                    </div>

                    {/* Nội dung chuyển khoản (bắt buộc) */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(212, 175, 55, 0.12)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      padding: '8px 12px',
                      borderRadius: '8px'
                    }}>
                      <div>
                        <span style={{ color: '#92400E', fontSize: '0.75rem', display: 'block', fontWeight: 700 }}>
                          Nội dung chuyển khoản (bắt buộc):
                        </span>
                        <strong style={{ color: '#B45309', fontSize: '1.05rem', fontWeight: 900, letterSpacing: '0.04em' }}>
                          {paymentModal.orderData.transferContent}
                        </strong>
                      </div>
                      <button
                        onClick={() => copyToClipboard(paymentModal.orderData.transferContent, 'content')}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: paymentModal.copiedField === 'content' ? '#10B981' : '#D4AF37',
                          color: paymentModal.copiedField === 'content' ? '#FFF' : '#080A0F',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {paymentModal.copiedField === 'content' ? <CheckCheck size={14} /> : <Copy size={14} />}
                        <span>{paymentModal.copiedField === 'content' ? text('Đã chép!', 'Copied!') : text('Sao chép', 'Copy')}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Thanh trạng thái tự động quét SePay */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#10B981',
                      boxShadow: '0 0 10px #10B981',
                      animation: 'pulse 1.8s infinite'
                    }} />
                    <span style={{ fontSize: '0.82rem', color: '#A7F3D0', fontWeight: 600 }}>
                      {text('SePay đang tự động quét giao dịch mỗi 3s...', 'SePay auto-checking every 3s...')}
                    </span>
                  </div>
                  <button
                    onClick={() => checkPaymentStatus(paymentModal.orderData.orderCode, true)}
                    disabled={paymentModal.isChecking}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: paymentModal.isChecking ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'underline'
                    }}
                  >
                    <RefreshCw size={12} className={paymentModal.isChecking ? 'spinning' : ''} style={{ animation: paymentModal.isChecking ? 'spin 1s linear infinite' : 'none' }} />
                    <span>{text('Kiểm tra ngay', 'Check now')}</span>
                  </button>
                </div>

                {/* Hướng dẫn ngắn */}
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 14px', lineHeight: 1.4 }}>
                  {text(
                    'Mở App Ngân hàng bất kỳ (Vietcombank, MB, Techcombank, ACB, MoMo...) và quét mã QR trên.',
                    'Open any banking App (Vietcombank, MB, Techcombank, ACB, MoMo...) and scan the QR code above.'
                  )}
                </p>

                {/* Nút hành động thủ công */}
                <button
                  onClick={() => checkPaymentStatus(paymentModal.orderData.orderCode, true)}
                  disabled={paymentModal.isChecking}
                  id="btn-verify-sepay-payment"
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    cursor: paymentModal.isChecking ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {paymentModal.isChecking ? (
                    <>
                      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>{text('Đang đối soát SePay...', 'Checking SePay...')}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      <span>{text('Tôi Đã Chuyển Khoản – Kiểm Tra Ngay', 'I Have Transferred – Check Now')}</span>
                    </>
                  )}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
