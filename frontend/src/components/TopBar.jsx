import React from 'react';
import { PanelLeftOpen } from 'lucide-react';

export default function TopBar({
  isSidebarOpen,
  onToggleSidebar,
  currentTab,
  setCurrentTab,
  user
}) {
  return (
    <header style={{
      height: '52px',
      minHeight: '52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      background: 'rgba(8, 10, 15, 0.65)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Left Area: Sidebar Toggle (visible if sidebar closed or on mobile) & Brand Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="chatgpt-icon-btn"
            title="Mở thanh bên"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#B4B4B4',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
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
            color: '#ECECEC',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.01em'
          }}>
            MYFIT<span style={{ color: 'var(--primary)' }}>DAILY</span>
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '0.8rem' }}>/</span>
          <span style={{ fontSize: '0.82rem', color: '#A1A1AA', fontWeight: 500 }}>
            {currentTab === 'ai-stylist' && 'AI Stylist'}
            {currentTab === 'dashboard' && 'Bàn làm việc'}
            {currentTab === 'wardrobe' && 'Tủ đồ số'}
            {currentTab === 'outfits' && 'Atelier phối đồ'}
            {currentTab === 'profile' && 'Hồ sơ cá nhân'}
            {currentTab === 'premium' && 'Hội viên VIP'}
            {currentTab === 'landing' && 'Khám phá'}
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
          title="Không gian làm việc: Trường học"
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
            H
          </div>
          <span style={{ fontSize: '0.75rem', color: '#D1D5DB', fontWeight: 500 }} className="hide-mobile">
            Trường học
          </span>
        </div>
      </div>
    </header>
  );
}
