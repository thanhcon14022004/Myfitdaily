import React, { useState } from 'react';
import {
  Search,
  PanelLeftClose,
  SquarePen,
  Shirt,
  Layers,
  LayoutDashboard,
  Heart,
  Sparkles,
  Crown,
  User,
  LogOut,
  Plus,
  Compass,
  Trash2,
  MoreHorizontal,
  Settings
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Sidebar({
  isOpen,
  onToggle,
  currentTab,
  setCurrentTab,
  user,
  onOpenAuth,
  onLogout,
  onOpenAddModal,
  onOpenSearch,
  onOpenSettings,
  onNewChat,
  chatSessions = [],
  activeSessionId,
  onSelectChat,
  onDeleteChat,
  favoriteCount = 0
}) {
  const { t, language, text } = useLanguage();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // User display info
  const displayName = user?.fullName || 'Hà Trung Thành';
  const displayInitials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(-2).toUpperCase()
    : 'HT';
  const subType = user?.subscriptionType || 'Free';
  const displayPlan = (subType.toLowerCase() === 'premiumplus' || subType.toLowerCase() === 'premium_plus')
    ? '💎 Premium Plus'
    : subType.toLowerCase() === 'premium'
      ? '👑 VIP Premium'
      : 'Gói Free Cơ Bản';

  return (
    <aside
      className={`chatgpt-sidebar ${isOpen ? 'open' : 'closed'}`}
      style={{
        width: isOpen ? '260px' : '0px',
        minWidth: isOpen ? '260px' : '0px',
        height: '100vh',
        background: 'var(--bg-sidebar)',
        borderRight: isOpen ? '1px solid var(--border-subtle)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.22s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease',
        overflow: 'hidden',
        zIndex: 50,
        userSelect: 'none',
        flexShrink: 0
      }}
    >
      {/* Inner Fixed 260px container */}
      <div style={{
        width: '260px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.18s ease',
        boxSizing: 'border-box',
        padding: '8px 8px 8px',
      }}>

        {/* Top Header: Brand Name + Quick Search + Collapse Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 6px 8px',
          minHeight: '40px',
        }}>
          {/* Logo / Brand Name */}
          <div
            onClick={() => setCurrentTab('landing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
            title="MYFITDAILY"
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #C27D5E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
            }}>
              <Sparkles size={14} color="#080A0F" />
            </div>
            <span style={{
              fontWeight: 800,
              fontSize: '1.05rem',
              letterSpacing: '-0.02em',
              color: '#ECECEC',
              fontFamily: "'Outfit', sans-serif"
            }}>
              MYFIT<span style={{ color: '#D4AF37' }}>DAILY</span>
            </span>
          </div>

          {/* Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button
              onClick={onOpenSearch}
              className="chatgpt-icon-btn"
              title={text("Tìm kiếm (Ctrl+K)", "Search (Ctrl+K)")}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B4B4B4',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Search size={17} />
            </button>
            <button
              onClick={onToggle}
              className="chatgpt-icon-btn"
              title={text("Đóng thanh bên", "Close sidebar")}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B4B4B4',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <PanelLeftClose size={18} />
            </button>
          </div>
        </div>

        {/* Primary CTA: "Đoạn chat mới" */}
        <button
          onClick={onNewChat}
          className="chatgpt-new-chat-btn"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: '8px',
            background: currentTab === 'ai-stylist' && !activeSessionId ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            color: '#ECECEC',
            fontSize: '0.88rem',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            marginBottom: '6px',
          }}
        >
          <SquarePen size={17} color="#ECECEC" />
          <span style={{ flex: 1 }}>{t('nav_new_chat')}</span>
        </button>

        {/* Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '8px' }}>

          {/* Tủ Đồ Số (Wardrobe) */}
          <button
            onClick={() => setCurrentTab('wardrobe')}
            className={`sidebar-nav-item ${currentTab === 'wardrobe' ? 'active' : ''}`}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '8px',
              background: currentTab === 'wardrobe' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: currentTab === 'wardrobe' ? '#FFFFFF' : '#ECECEC',
              fontSize: '0.88rem',
              fontWeight: currentTab === 'wardrobe' ? 600 : 500,
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shirt size={17} color={currentTab === 'wardrobe' ? '#D4AF37' : '#B4B4B4'} />
              <span>{t('nav_wardrobe')}</span>
            </div>
            <span style={{
              fontSize: '0.62rem',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(212, 175, 55, 0.15)',
              color: '#F3D98A',
              fontWeight: 600,
              letterSpacing: '0.02em'
            }}>
              {language === 'vi' ? 'TỦ ĐỒ' : 'CLOSET'}
            </span>
          </button>

          {/* Atelier Phối Đồ (Outfit Studio) */}
          <button
            onClick={() => setCurrentTab('outfits')}
            className={`sidebar-nav-item ${currentTab === 'outfits' ? 'active' : ''}`}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: currentTab === 'outfits' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: currentTab === 'outfits' ? '#FFFFFF' : '#ECECEC',
              fontSize: '0.88rem',
              fontWeight: currentTab === 'outfits' ? 600 : 500,
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <Layers size={17} color={currentTab === 'outfits' ? '#D4AF37' : '#B4B4B4'} />
            <span>{t('nav_outfits')}</span>
          </button>

          {/* Trang Phục Yêu Thích (Favorite Outfits) */}
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`sidebar-nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '8px',
              background: currentTab === 'dashboard' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: currentTab === 'dashboard' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontSize: '0.88rem',
              fontWeight: currentTab === 'dashboard' ? 600 : 500,
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart 
                size={17} 
                color={currentTab === 'dashboard' ? '#F43F5E' : 'var(--text-muted)'} 
                fill={currentTab === 'dashboard' ? '#F43F5E' : 'none'} 
              />
              <span>{t('nav_dashboard')}</span>
            </div>
            {favoriteCount > 0 && (
              <span style={{
                fontSize: '0.7rem',
                background: 'rgba(244, 63, 94, 0.18)',
                color: '#FB7185',
                padding: '2px 7px',
                borderRadius: '10px',
                fontWeight: 700,
                border: '1px solid rgba(244, 63, 94, 0.3)'
              }}>
                {favoriteCount}
              </span>
            )}
          </button>

          {/* AI Stylist */}
          <button
            onClick={() => setCurrentTab('ai-stylist')}
            className={`sidebar-nav-item ${currentTab === 'ai-stylist' ? 'active' : ''}`}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '8px',
              background: currentTab === 'ai-stylist' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: currentTab === 'ai-stylist' ? '#FFFFFF' : '#ECECEC',
              fontSize: '0.88rem',
              fontWeight: currentTab === 'ai-stylist' ? 600 : 500,
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={17} color={currentTab === 'ai-stylist' ? '#D4AF37' : '#B4B4B4'} />
              <span>{t('nav_ai_stylist')}</span>
            </div>
            <span style={{
              fontSize: '0.62rem',
              background: 'linear-gradient(135deg, #D4AF37, #C27D5E)',
              color: '#080A0F',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 800,
            }}>
              AI
            </span>
          </button>

          {/* Hội Viên VIP (Premium) */}
          <button
            onClick={() => setCurrentTab('premium')}
            className={`sidebar-nav-item ${currentTab === 'premium' ? 'active' : ''}`}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: currentTab === 'premium' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              color: currentTab === 'premium' ? '#FDE68A' : '#F3D98A',
              fontSize: '0.88rem',
              fontWeight: currentTab === 'premium' ? 600 : 500,
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <Crown size={17} color="#D4AF37" />
            <span>{t('nav_premium', text('Hội Viên VIP', 'VIP Membership'))}</span>
          </button>

          {/* Thêm... (More: Khám phá, Thêm đồ nhanh) */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className="sidebar-nav-item"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: moreMenuOpen ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: '#ECECEC',
                fontSize: '0.88rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <MoreHorizontal size={17} color="#B4B4B4" />
              <span>{text('Thêm...', 'More...')}</span>
            </button>

            {/* More options popover */}
            {moreMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '10px',
                  width: '210px',
                  background: 'var(--bg-popover)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '12px',
                  padding: '6px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 100,
                }}
                onMouseLeave={() => setMoreMenuOpen(false)}
              >
                <button
                  onClick={() => { onOpenAddModal(); setMoreMenuOpen(false); }}
                  className="sidebar-popover-item"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    color: '#D4AF37',
                    fontSize: '0.84rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Plus size={15} />
                  <span>{text('Thêm món đồ mới', 'Add New Garment')}</span>
                </button>
                <button
                  onClick={() => { setCurrentTab('landing'); setMoreMenuOpen(false); }}
                  className="sidebar-popover-item"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    color: '#ECECEC',
                    fontSize: '0.84rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Compass size={15} />
                  <span>{text('Khám phá giới thiệu', 'Explore Features')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Center Area: Chat History */}
        <div
          className="sidebar-scrollable-content"
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            marginRight: '-4px',
            paddingRight: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {/* SECTION: Đoạn chat (Lịch sử cuộc trò chuyện) */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 12px 4px',
            }}>
              <span style={{
                fontSize: '0.74rem',
                fontWeight: 600,
                color: '#8E8E8E',
                letterSpacing: '0.01em',
              }}>
                {text('Đoạn chat', 'Chats')}
              </span>
              <span style={{ fontSize: '0.68rem', color: '#666' }}>
                {chatSessions.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {chatSessions.map((session) => {
                const isSelected = activeSessionId === session.id && currentTab === 'ai-stylist';
                return (
                  <div
                    key={session.id}
                    onClick={() => onSelectChat(session.id)}
                    className={`sidebar-chat-item ${isSelected ? 'active' : ''}`}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 10px 7px 12px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#C7C7C7',
                      fontSize: '0.86rem',
                      fontWeight: isSelected ? 500 : 400,
                      cursor: 'pointer',
                      transition: 'background 0.15s, color 0.15s',
                      position: 'relative',
                    }}
                    title={session.title}
                  >
                    <span style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      marginRight: '6px'
                    }}>
                      {session.title}
                    </span>

                    {/* Delete button on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDeleteChat) onDeleteChat(session.id);
                      }}
                      className="chat-delete-btn"
                      title={text("Xóa đoạn chat này", "Delete this chat")}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#71717A',
                        cursor: 'pointer',
                        padding: '2px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isSelected ? 0.9 : 0.4,
                        transition: 'opacity 0.15s, color 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#EF4444';
                        e.currentTarget.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#71717A';
                        e.currentTarget.style.opacity = isSelected ? '0.9' : '0.4';
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}

              {chatSessions.length === 0 && (
                <div style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  fontSize: '0.78rem',
                  color: '#71717A',
                }}>
                  {text(
                    'Chưa có lịch sử đoạn chat nào. Hãy bấm Đoạn chat mới để bắt đầu!',
                    'No chat history yet. Click New Chat to get started!'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: User Profile Card */}
        <div style={{ position: 'relative', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="sidebar-profile-card"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 8px',
              borderRadius: '8px',
              background: profileMenuOpen ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {/* Orange Circle Avatar */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#D95B00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.78rem',
              color: '#FFFFFF',
              flexShrink: 0,
            }}>
              {displayInitials}
            </div>

            {/* Name + Subtitle */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#ECECEC',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {displayName}
              </div>
              <div style={{
                fontSize: '0.7rem',
                color: '#8E8E8E',
                marginTop: '1px'
              }}>
                {displayPlan}
              </div>
            </div>
          </button>

          {/* Profile Popover Menu */}
          {profileMenuOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 6px)',
                left: '0px',
                right: '0px',
                background: 'var(--bg-popover)',
                border: '1px solid var(--border-medium)',
                borderRadius: '12px',
                padding: '6px',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 110,
              }}
              onMouseLeave={() => setProfileMenuOpen(false)}
            >
              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {displayName}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {user?.email || 'trungthanh@myfitdaily.vn'}
                </div>
              </div>

              <button
                onClick={() => { setCurrentTab('profile'); setProfileMenuOpen(false); }}
                className="sidebar-popover-item"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  color: '#ECECEC',
                  fontSize: '0.84rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <User size={15} />
                <span>{t('profile_menu_title')}</span>
              </button>

              <button
                onClick={() => { onOpenSettings?.(); setProfileMenuOpen(false); }}
                className="sidebar-popover-item"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  color: '#ECECEC',
                  fontSize: '0.84rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings size={15} />
                  <span>{t('settings_menu_title')}</span>
                </div>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#D4AF37',
                  fontWeight: 600
                }}>
                  {language === 'vi' ? '🇻🇳 VI' : '🇺🇸 EN'}
                </span>
              </button>

              <button
                onClick={() => { setCurrentTab('premium'); setProfileMenuOpen(false); }}
                className="sidebar-popover-item"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  color: '#FDE68A',
                  fontSize: '0.84rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Crown size={15} />
                <span>{t('upgrade_vip_title')}</span>
              </button>

              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />

              {user ? (
                <button
                  onClick={() => { onLogout(); setProfileMenuOpen(false); }}
                  className="sidebar-popover-item"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    color: '#EF4444',
                    fontSize: '0.84rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <LogOut size={15} />
                  <span>{t('logout_title')}</span>
                </button>
              ) : (
                <button
                  onClick={() => { onOpenAuth(); setProfileMenuOpen(false); }}
                  className="sidebar-popover-item"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    color: '#D4AF37',
                    fontSize: '0.84rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <User size={15} />
                  <span>{t('login_title')}</span>
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </aside>
  );
}
