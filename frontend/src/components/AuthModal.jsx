import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiRequest } from '../api/apiClient';
import { useLanguage } from '../context/LanguageContext';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const { text } = useLanguage();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: 'demo@myfitdaily.com',
    password: 'Password123!',
    fullName: 'Fashionista (Demo Nữ)',
    gender: 'Female',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
    const payload = isLoginMode 
      ? { email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password, fullName: formData.fullName, gender: formData.gender };

    const res = await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok && res.data?.success) {
      const authData = res.data.data;
      localStorage.setItem('myfitdaily_token', authData.token);
      localStorage.setItem('myfitdaily_user', JSON.stringify(authData.user));
      onAuthSuccess(authData.user);
      onClose();
    } else {
      // If backend is not available or returned an error
      const msg = res.data?.message || (res.data?.errors ? Object.values(res.data.errors).flat().join(', ') : null);
      if (msg) {
        setError(msg);
      } else {
        // Backend offline fallback option
        setError(text(
          "Không thể kết nối đến máy chủ API. Bạn có thể nhấn 'Trải Nghiệm Chế Độ Demo' bên dưới!",
          "Cannot reach the API server. You can click 'Demo Experience' below!"
        ));
      }
    }
  };

  const handleDemoLogin = (type = 'female') => {
    const isMale = type === 'male' || formData.email === 'test@myfitdaily.com';
    const demoUser = isMale ? {
      id: 998,
      fullName: 'Gentleman (Demo Nam)',
      email: 'test@myfitdaily.com',
      gender: 'Nam',
      height: 178,
      weight: 70,
      chest: 98,
      waist: 78,
      hips: 95,
      bodyShape: 'Tam giác ngược',
      role: 'User',
      subscriptionType: 'Premium',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    } : {
      id: 999,
      fullName: 'Fashionista (Demo Nữ)',
      email: 'demo@myfitdaily.com',
      gender: 'Nữ',
      height: 165,
      weight: 52,
      chest: 88,
      waist: 64,
      hips: 92,
      bodyShape: 'Đồng hồ cát',
      role: 'User',
      subscriptionType: 'Premium',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    };
    localStorage.setItem('myfitdaily_token', 'demo_jwt_token_2026');
    localStorage.setItem('myfitdaily_user', JSON.stringify(demoUser));
    onAuthSuccess(demoUser);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div 
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '32px',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '6px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {/* Brand Icon & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #D4AF37, #C27D5E)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px var(--primary-glow)',
            marginBottom: '14px',
          }}>
            <Sparkles size={26} color="#080A0F" />
          </div>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {isLoginMode ? text('Chào Mừng Trở Lại', 'Welcome Back') : text('Tạo Tài Khoản Mới', 'Create New Account')}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {isLoginMode 
              ? text('Đăng nhập để quản lý tủ đồ số và nhận gợi ý từ AI Stylist', 'Sign in to manage your digital wardrobe and get AI styling') 
              : text('Gia nhập cộng đồng thời trang thông minh MYFITDAILY', 'Join the MYFITDAILY smart fashion community')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 'var(--radius-full)',
          padding: '4px',
          marginBottom: '20px',
          border: '1px solid var(--border-subtle)',
        }}>
          <button
            type="button"
            onClick={() => { setIsLoginMode(true); setError(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.88rem',
              background: isLoginMode ? 'var(--primary)' : 'transparent',
              color: isLoginMode ? '#FFF' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {text('Đăng Nhập', 'Sign In')}
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginMode(false); setError(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.88rem',
              background: !isLoginMode ? 'var(--primary)' : 'transparent',
              color: !isLoginMode ? '#FFF' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {text('Đăng Ký', 'Register')}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(225, 29, 72, 0.15)',
            border: '1px solid rgba(225, 29, 72, 0.4)',
            color: '#FDA4AF',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.84rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Accounts Quick Select */}
        {isLoginMode && (
          <div style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '14px',
            padding: '12px 14px',
            marginBottom: '16px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: '#F3D98A',
              fontWeight: 700,
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={14} color="#D4AF37" />
                {text('Tài khoản Demo có sẵn (Bấm để điền)', 'Available Demo Accounts (Click to fill)')}
              </span>
              <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>Pass: Password123!</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                id="btn-fill-demo-female"
                onClick={() => setFormData({ ...formData, email: 'demo@myfitdaily.com', password: 'Password123!' })}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '9px 11px',
                  borderRadius: '10px',
                  background: formData.email === 'demo@myfitdaily.com' ? 'rgba(212, 175, 55, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1.5px solid ${formData.email === 'demo@myfitdaily.com' ? '#D4AF37' : 'rgba(255, 255, 255, 0.12)'}`,
                  color: '#FFF',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    👩 {text('Demo Nữ', 'Demo Female')}
                  </span>
                  {formData.email === 'demo@myfitdaily.com' && <CheckCircle2 size={13} color="#D4AF37" />}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>demo@myfitdaily.com</span>
                <span style={{ fontSize: '0.68rem', color: '#F3D98A', marginTop: '3px' }}>165cm • 52kg • 88-64-92</span>
              </button>

              <button
                type="button"
                id="btn-fill-demo-male"
                onClick={() => setFormData({ ...formData, email: 'test@myfitdaily.com', password: 'Password123!' })}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '9px 11px',
                  borderRadius: '10px',
                  background: formData.email === 'test@myfitdaily.com' ? 'rgba(212, 175, 55, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1.5px solid ${formData.email === 'test@myfitdaily.com' ? '#D4AF37' : 'rgba(255, 255, 255, 0.12)'}`,
                  color: '#FFF',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    👨 {text('Demo Nam', 'Demo Male')}
                  </span>
                  {formData.email === 'test@myfitdaily.com' && <CheckCircle2 size={13} color="#D4AF37" />}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>test@myfitdaily.com</span>
                <span style={{ fontSize: '0.68rem', color: '#F3D98A', marginTop: '3px' }}>178cm • 70kg • 98-78-95</span>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {!isLoginMode && (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px' }}>
                {text('Họ và Tên', 'Full Name')}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  id="input-auth-name"
                  placeholder={text("Nguyễn Văn A", "Alex Morgan")}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={{ width: '100%', paddingLeft: '38px' }}
                />
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px' }}>
              {text('Địa chỉ Email', 'Email Address')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                id="input-auth-email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', paddingLeft: '38px' }}
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px' }}>
              {text('Mật khẩu', 'Password')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                minLength={6}
                id="input-auth-password"
                placeholder={text("Ít nhất 6 ký tự", "At least 6 characters")}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ width: '100%', paddingLeft: '38px' }}
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          <button
            type="submit"
            id="btn-submit-auth"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: '6px',
              padding: '12px',
              fontSize: '0.95rem',
            }}
          >
            {loading 
              ? text('Đang xử lý...', 'Processing...') 
              : (isLoginMode ? text('Đăng Nhập Ngay', 'Sign In Now') : text('Tạo Tài Khoản', 'Create Account'))}
          </button>
        </form>

        {/* Demo Fast Login */}
        <div style={{
          marginTop: '18px',
          paddingTop: '14px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
        }}>
          <button
            type="button"
            onClick={() => handleDemoLogin('female')}
            id="btn-quick-female"
            style={{
              fontSize: '0.8rem',
              color: '#F3D98A',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              cursor: 'pointer',
            }}
          >
            <span>👩 Vào nhanh Demo Nữ</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('male')}
            id="btn-quick-male"
            style={{
              fontSize: '0.8rem',
              color: '#93C5FD',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              cursor: 'pointer',
            }}
          >
            <span>👨 Vào nhanh Demo Nam</span>
          </button>
        </div>
      </div>
    </div>
  );
}