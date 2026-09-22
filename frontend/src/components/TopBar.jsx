import React from 'react';
import { PanelLeftOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { isPremiumUser, isPremiumPlusUser } from '../utils/subscriptionUtils';
import SubscriptionCountdown from './SubscriptionCountdown';

export default function TopBar({
  isSidebarOpen,
  onToggleSidebar,
  currentTab,
  setCurrentTab,
  user
}) {
  const { t, text } = useLanguage();
  const isPlus = isPremiumPlusUser(user);
  const isPrem = isPremiumUser(user);
  return (
    <header style={{
      height: '52px',
      minHeight: '52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      background: 'var(--bg-topbar)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      transition: 'background 0.3s ease, border-color 0.3s ease',
    }}>
      {/* Left Area: Sidebar Toggle (visible if sidebar closed or on mobile) & Brand Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="chatgpt-icon-btn"
            title={text("Mở thanh bên", "Open sidebar")}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              background: 'var(--hover-bg)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <PanelLeftOpen size={18} />
          </button>
        )}

        {/* Brand & Current View Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '0.88rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.01em'
          }}>
            MYFIT<span style={{ color: 'var(--primary)' }}>DAILY</span>
          </span>
          <span style={{ color: 'var(--border-medium)', fontSize: '0.8rem' }}>/</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {currentTab === 'ai-stylist' && t('topbar_ai_stylist')}
            {currentTab === 'dashboard' && t('topbar_dashboard')}
            {currentTab === 'wardrobe' && t('topbar_wardrobe')}
            {currentTab === 'outfits' && t('topbar_outfits')}
            {currentTab === 'profile' && t('topbar_profile')}
            {currentTab === 'premium' && t('topbar_premium')}
            {currentTab === 'landing' && t('topbar_landing')}
          </span>
        </div>
      </div>

      {/* Right Area: VIP Badge & Countdown & User Profile Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* VIP Status Badge & Live Countdown */}
        <button
          onClick={() => setCurrentTab('premium')}
          id="btn-topbar-vip-badge"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.76rem',
            fontWeight: 700,
            background: isPlus
              ? 'linear-gradient(135deg, rgba(251, 113, 133, 0.25), rgba(225, 29, 72, 0.35))'
              : isPrem
                ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(194, 125, 94, 0.35))'
                : 'var(--hover-bg)',
            color: isPlus
              ? '#FB7185'
              : isPrem
                ? '#FCD34D'
                : 'var(--text-secondary)',
            border: isPlus
              ? '1px solid rgba(251, 113, 133, 0.5)'
              : isPrem
                ? '1px solid rgba(212, 175, 55, 0.5)'
                : '1px solid var(--border-subtle)',
            transition: 'all 0.2s ease',
          }}
          title={text("Xem chi tiết thời hạn & quyền lợi gói VIP", "View VIP membership benefits & time remaining")}
        >
          {isPlus ? (
            <>
              <span>💎</span>
              <span>Premium Plus</span>
            </>
          ) : isPrem ? (
            <>
              <span>👑</span>
              <span>VIP Premium</span>
            </>
          ) : (
            <>
              <span>⭐</span>
              <span>{text('Nâng Cấp VIP', 'Upgrade VIP')}</span>
            </>
          )}
        </button>

        {/* Live Pill Countdown for VIP Users */}
        {(isPrem || isPlus) && user?.subscriptionExpiresAt && (
          <div onClick={() => setCurrentTab('premium')} style={{ cursor: 'pointer' }}>
            <SubscriptionCountdown
              expiresAt={user.subscriptionExpiresAt}
              planType={user.subscriptionType}
              variant="pill"
            />
          </div>
        )}

        {/* User Workspace Profile Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px 4px 6px',
            borderRadius: '9999px',
            background: 'var(--hover-bg-subtle)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer',
          }}
          onClick={() => setCurrentTab('profile')}
          title={text("Không gian làm việc: Cá nhân", "Workspace: Personal")}
        >
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#D95B00',
            color: '#FFF',
            fontSize: '0.68rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {user?.fullName ? user.fullName[0].toUpperCase() : 'H'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }} className="hide-mobile">
            {text('Cá nhân', 'Personal')}
          </span>
        </div>
      </div>
    </header>
  );
}
