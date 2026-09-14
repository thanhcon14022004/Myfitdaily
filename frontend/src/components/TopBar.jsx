import React from 'react';
import { PanelLeftOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TopBar({
  isSidebarOpen,
  onToggleSidebar,
  currentTab,
  setCurrentTab,
  user
}) {
  const { t, text } = useLanguage();
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

      {/* Right Area: User Workspace / Profile Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px 4px 6px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
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
          <span style={{ fontSize: '0.75rem', color: '#D1D5DB', fontWeight: 500 }} className="hide-mobile">
            {text('Cá nhân', 'Personal')}
          </span>
        </div>
      </div>
    </header>
  );
}
