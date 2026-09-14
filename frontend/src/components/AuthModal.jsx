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
    email: 'tester@myfitdaily.com',
    password: 'Password123!',
    fullName: 'Nguyễn Văn Test',
    gender: 'Male',
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

  const handleDemoLogin = () => {
    const demoUser = {
      id: 999,
      fullName: 'Fashion Lover (Demo)',
      email: 'demo@myfitdaily.com',
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
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
        }}>
          <button
            type="button"
            onClick={handleDemoLogin}
            id="btn-demo-login"
            style={{
              fontSize: '0.84rem',
              color: '#A78BFA',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(167, 139, 250, 0.1)',
              border: '1px solid rgba(167, 139, 250, 0.25)',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={14} />
            <span>{text('Trải Nghiệm Nhanh Bằng Tài Khoản Demo', 'Quick Try with Demo Account')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
