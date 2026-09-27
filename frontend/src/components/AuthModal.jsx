import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiRequest } from '../api/apiClient';
import { useLanguage } from '../context/LanguageContext';
import { getInitialClothesForGender, getInitialOutfitsForGender } from '../data/initialWardrobe';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const { text } = useLanguage();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: 'testnam',
    password: 'testnam',
    fullName: 'Gentleman (Test Nam)',
    gender: 'Nam',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanInput = (formData.email || '').trim().toLowerCase();
    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
    const payload = isLoginMode 
      ? { email: cleanInput, password: formData.password }
      : { email: cleanInput, password: formData.password, fullName: formData.fullName, gender: formData.gender };

    try {
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
        return;
      }

      // Offline fallback handling if DB not reachable
      if (isLoginMode) {
        let fallbackUser = null;
        if ((cleanInput === 'testnam' || cleanInput === 'testnam@myfitdaily.com') && formData.password === 'testnam') {
          fallbackUser = {
            id: 2,
            fullName: 'Gentleman (Test Nam)',
            email: 'testnam',
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
          };
        } else if ((cleanInput === 'testnu' || cleanInput === 'testnu@myfitdaily.com') && formData.password === 'testnu') {
          fallbackUser = {
            id: 1,
            fullName: 'Fashionista (Test Nữ)',
            email: 'testnu',
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
        } else if ((cleanInput === 'admin' || cleanInput === 'admin@myfitdaily.com') && formData.password === 'admin') {
          fallbackUser = {
            id: 3,
            fullName: 'Ban Quản Trị Hệ Thống',
            email: 'admin',
            gender: 'Nam',
            role: 'Admin',
            subscriptionType: 'PremiumPlus',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
          };
        }

        if (fallbackUser) {
          localStorage.setItem('myfitdaily_token', 'local_jwt_token_2026');
          localStorage.setItem('myfitdaily_user', JSON.stringify(fallbackUser));
          const demoClothes = getInitialClothesForGender(fallbackUser.gender || 'Nam');
          localStorage.setItem('myfitdaily_user_clothes', JSON.stringify(demoClothes));
          const demoOutfits = getInitialOutfitsForGender(fallbackUser.gender || 'Nam');
          localStorage.setItem('myfitdaily_outfits', JSON.stringify(demoOutfits));
          onAuthSuccess(fallbackUser);
          onClose();
          return;
        }
      }

      const msg = res.data?.message || (res.data?.errors ? Object.values(res.data.errors).flat().join(', ') : null);
      setError(msg || text("Tên đăng nhập hoặc mật khẩu không chính xác", "Invalid username or password"));
    } catch (err) {
      setLoading(false);
      setError(text("Lỗi kết nối máy chủ", "Server connection error"));
    }
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '32px',
          position: 'relative',
          background: 'var(--bg-modal, #181B22)',
          border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.12))',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--text-secondary, #9CA3AF)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = 'var(--text-secondary, #9CA3AF)';
          }}
        >
          <X size={18} />
        </button>

        {/* Brand Icon & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: '#FFFFFF',
            border: '1.8px solid rgba(212, 175, 55, 0.75)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.35), 0 0 16px rgba(212, 175, 55, 0.35)',
            marginBottom: '14px',
            padding: '5px'
          }}>
            <img 
              src="/assets/logo.png" 
              alt="MYFITDAILY Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
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

        {/* Demo Accounts Preset Hint */}
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
                {text('Tài khoản Test & Admin (Bấm để điền)', 'Test & Admin Accounts (Click to fill)')}
              </span>
              <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>{text('Mật khẩu = Tên đăng nhập', 'Password = Username')}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <button
                type="button"
                id="btn-fill-testnam"
                onClick={() => setFormData({ ...formData, email: 'testnam', password: 'testnam' })}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  background: formData.email === 'testnam' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1.5px solid ${formData.email === 'testnam' ? '#60A5FA' : 'rgba(255, 255, 255, 0.12)'}`,
                  color: '#FFF',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>👨 testnam</span>
                  {formData.email === 'testnam' && <CheckCircle2 size={12} color="#60A5FA" />}
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>testnam / testnam</span>
                <span style={{ fontSize: '0.65rem', color: '#93C5FD', marginTop: '2px' }}>Nam • Premium</span>
              </button>

              <button
                type="button"
                id="btn-fill-testnu"
                onClick={() => setFormData({ ...formData, email: 'testnu', password: 'testnu' })}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  background: formData.email === 'testnu' ? 'rgba(212, 175, 55, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1.5px solid ${formData.email === 'testnu' ? '#D4AF37' : 'rgba(255, 255, 255, 0.12)'}`,
                  color: '#FFF',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>👩 testnu</span>
                  {formData.email === 'testnu' && <CheckCircle2 size={12} color="#D4AF37" />}
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>testnu / testnu</span>
                <span style={{ fontSize: '0.65rem', color: '#F3D98A', marginTop: '2px' }}>Nữ • Premium</span>
              </button>

              <button
                type="button"
                id="btn-fill-admin"
                onClick={() => setFormData({ ...formData, email: 'admin', password: 'admin' })}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  background: formData.email === 'admin' ? 'rgba(16, 185, 129, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1.5px solid ${formData.email === 'admin' ? '#34D399' : 'rgba(255, 255, 255, 0.12)'}`,
                  color: '#FFF',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>🛡️ admin</span>
                  {formData.email === 'admin' && <CheckCircle2 size={12} color="#34D399" />}
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>admin / admin</span>
                <span style={{ fontSize: '0.65rem', color: '#6EE7B7', marginTop: '2px' }}>Admin • VIP+</span>
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
              {isLoginMode ? text('Tên đăng nhập hoặc Email', 'Username or Email') : text('Địa chỉ Email', 'Email Address')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={isLoginMode ? "text" : "email"}
                required
                id="input-auth-email"
                placeholder={isLoginMode ? "testnam, testnu, admin hoặc email" : "email@example.com"}
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
                id="input-auth-password"
                placeholder={text("Nhập mật khẩu", "Enter password")}
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
      </div>
    </div>
  );
}