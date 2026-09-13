import React, { useState } from 'react';
import { 
  Sparkles, 
  Shirt, 
  Layers, 
  Crown, 
  User, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard,
  Plus,
  Compass,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  user, 
  onOpenAuth, 
  onLogout,
  onOpenAddModal 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Khám Phá', icon: Compass },
    { id: 'dashboard', label: 'Bàn Làm Việc', icon: LayoutDashboard },
    { id: 'wardrobe', label: 'Tủ Đồ Số', icon: Shirt },
    { id: 'outfits', label: 'Atelier Phối Đồ', icon: Layers },
    { id: 'ai-stylist', label: 'AI Stylist', icon: Sparkles, highlight: true },
    { id: 'premium', label: 'Hội Viên VIP', icon: Crown, isGold: true },
  ];

  return (
    <header className="nav-island">
      <div className="nav-inner">
        {/* Brand Logo */}
        <div 
          onClick={() => { setCurrentTab('landing'); setMobileMenuOpen(false); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          id="nav-brand-logo"
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #C27D5E 50%, #F3D98A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(212, 175, 55, 0.45)',
          }}>
            <Sparkles size={20} color="#080A0F" />
          </div>
          <div>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}>
              MYFIT<span style={{ color: 'var(--primary-light)' }}>DAILY</span>
            </div>
            <div style={{
              fontSize: '0.62rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginTop: '3px',
            }}>
              Quiet Luxury AI Stylist
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }} className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive 
                    ? '#FFFFFF' 
                    : item.highlight 
                      ? '#F3D98A' 
                      : item.isGold 
                        ? '#FDE68A' 
                        : 'var(--text-secondary)',
                  background: isActive 
                    ? item.highlight 
                      ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.35), rgba(194, 125, 94, 0.35))' 
                      : 'rgba(255, 255, 255, 0.1)'
                    : 'transparent',
                  border: isActive 
                    ? '1px solid ' + (item.highlight ? 'rgba(212, 175, 55, 0.6)' : 'rgba(255, 255, 255, 0.18)') 
                    : '1px solid transparent',
                  boxShadow: isActive && item.highlight ? '0 0 16px var(--primary-glow)' : 'none',
                  transition: 'var(--transition)',
                }}
              >
                {Icon && (
                  <Icon 
                    size={15} 
                    color={isActive ? '#FFF' : item.highlight ? '#F3D98A' : item.isGold ? '#D4AF37' : 'currentColor'} 
                  />
                )}
                <span>{item.label}</span>
                {item.highlight && (
                  <span style={{
                    fontSize: '0.62rem',
                    background: 'linear-gradient(135deg, #D4AF37, #C27D5E)',
                    color: '#080A0F',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 800,
                    boxShadow: '0 2px 8px rgba(212, 175, 55, 0.5)',
                  }}>
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Quick Add & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick Add Clothing Button */}
          <button
            onClick={onOpenAddModal}
            id="nav-quick-add"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.38)',
              color: '#F3D98A',
              fontSize: '0.84rem',
              fontWeight: 700,
              transition: 'var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.28)';
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.38)';
            }}
          >
            <Plus size={15} />
            <span className="desktop-nav">Thêm Món Đồ</span>
          </button>

          {/* User Account / Auth Trigger */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 12px 5px 6px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #D4AF37, #C27D5E)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  color: '#080A0F',
                }}>
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <div className="desktop-nav" style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFF' }}>
                    {user.fullName ? user.fullName.split(' ').slice(-1)[0] : 'User'}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#FDE68A', fontWeight: 600 }}>
                    {user.subscriptionType || 'Free Member'}
                  </div>
                </div>
                <ChevronDown size={14} color="var(--text-muted)" />
              </div>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div 
                  className="glass-card"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '230px',
                    padding: '12px',
                    zIndex: 100,
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-highlight)',
                  }}
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFF' }}>
                      {user.fullName || 'Thành viên'}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {user.email}
                    </div>
                  </div>

                  <button
                    onClick={() => { setCurrentTab('profile'); setUserDropdownOpen(false); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <User size={15} />
                    <span>Hồ Sơ Cá Nhân</span>
                  </button>

                  <button
                    onClick={() => { setCurrentTab('premium'); setUserDropdownOpen(false); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      color: '#FDE68A',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.12)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Crown size={15} />
                    <span>Nâng Cấp VIP</span>
                  </button>

                  <button
                    onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      color: '#FB7185',
                      textAlign: 'left',
                      marginTop: '4px',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(225, 29, 72, 0.12)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={15} />
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              id="nav-btn-login"
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '0.85rem' }}
            >
              <span>Đăng Nhập</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              background: 'rgba(255, 255, 255, 0.06)',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          className="glass-card"
          style={{
            margin: '10px 0 0',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-highlight)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setCurrentTab(item.id); setMobileMenuOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(225, 29, 72, 0.2)' : 'transparent',
                    textAlign: 'left',
                  }}
                >
                  {Icon && <Icon size={18} color={item.highlight ? '#FB7185' : 'currentColor'} />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
