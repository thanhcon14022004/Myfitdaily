import React, { useState } from 'react';
import { Settings, X, Globe, Check, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function SettingsModal({ isOpen, onClose }) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, themes } = useTheme();
  const [toastMessage, setToastMessage] = useState('');
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setShowSavedNotification(true);
    setTimeout(() => {
      setShowSavedNotification(false);
    }, 2500);
  };

  const handleSelectLanguage = (newLang) => {
    if (newLang !== language) {
      setLanguage(newLang);
      showToast(t('settings_saved_toast'));
    }
  };

  const handleSelectTheme = (newThemeId) => {
    if (newThemeId !== theme) {
      setTheme(newThemeId);
      const isVi = language === 'vi';
      const msg = newThemeId === 'dark'
        ? (isVi ? 'Đã chuyển sang Giao diện Tối (Đen) chuẩn ChatGPT!' : 'Switched to ChatGPT Dark Mode (Black)!')
        : (isVi ? 'Đã chuyển sang Giao diện Sáng (Trắng) chuẩn ChatGPT!' : 'Switched to ChatGPT Light Mode (White)!');
      showToast(msg);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '88vh',
          background: 'var(--bg-modal)',
          borderRadius: '18px',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'background 0.3s ease, border-color 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--hover-bg-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--primary-glow)',
              border: '1px solid var(--border-highlight)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              transition: 'all 0.3s ease'
            }}>
              <Settings size={20} />
            </div>
            <div>
              <h3 style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
                fontFamily: "'Outfit', sans-serif"
              }}>
                {t('settings_title')}
              </h3>
              <p style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                margin: '2px 0 0 0'
              }}>
                {t('settings_subtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--hover-bg)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content - Scrollable */}
        <div style={{ 
          padding: '24px', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Section 1: Color Theme / Chế độ giao diện Đen - Trắng */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              {theme === 'dark' ? <Moon size={16} color="var(--primary)" /> : <Sun size={16} color="var(--primary)" />}
              <label style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {t('settings_theme_heading')}
              </label>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
              {t('settings_theme_desc')}
            </p>

            {/* Dark & Light Theme Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {themes.map((item) => {
                const isSelected = theme === item.id;
                const isItemDark = item.id === 'dark';
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectTheme(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: '14px',
                      background: isSelected 
                        ? 'var(--hover-bg)' 
                        : 'var(--hover-bg-subtle)',
                      border: isSelected 
                        ? '1.5px solid var(--primary)' 
                        : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: isSelected ? '0 4px 18px var(--primary-glow)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: isItemDark ? '#171717' : '#FFFFFF',
                        border: isItemDark ? '1px solid #333' : '1px solid #E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        {item.icon}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {language === 'en' ? item.nameEn : item.nameVi}
                          </span>
                          <span style={{
                            fontSize: '0.66rem',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            background: isSelected ? 'var(--primary-glow)' : 'var(--hover-bg)',
                            color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)'
                          }}>
                            {language === 'en' ? item.badgeEn : item.badgeVi}
                          </span>
                        </div>
                        <div style={{ 
                          fontSize: '0.78rem', 
                          color: 'var(--text-muted)', 
                          marginTop: '3px'
                        }}>
                          {language === 'en' ? item.descEn : item.descVi}
                        </div>
                      </div>
                    </div>

                    {/* Preview Swatches & Selection Radio */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0, marginLeft: '12px' }}>
                      {/* Mini ChatGPT Palette Preview */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 6px',
                        borderRadius: '6px',
                        background: 'var(--hover-bg-subtle)',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        <span style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '3px',
                          background: item.previewBg,
                          border: '1px solid rgba(125, 125, 125, 0.3)'
                        }} title="Sidebar" />
                        <span style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '3px',
                          background: item.previewCard,
                          border: '1px solid rgba(125, 125, 125, 0.3)'
                        }} title="Workspace" />
                        <span style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '3px',
                          background: item.previewText,
                          border: '1px solid rgba(125, 125, 125, 0.3)'
                        }} title="Typography" />
                      </div>

                      {/* Check Circle */}
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: isSelected ? '2px solid var(--primary)' : '2px solid var(--border-medium)',
                        background: isSelected ? 'var(--primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-inverse)',
                        transition: 'all 0.2s ease'
                      }}>
                        {isSelected && <Check size={13} strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

          {/* Section 2: Language Selection */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Globe size={16} color="var(--primary)" />
              <label style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {t('settings_lang_heading')}
              </label>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
              {t('settings_lang_desc')}
            </p>

            {/* Language Options Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Option 1: Tiếng Việt */}
              <div
                onClick={() => handleSelectLanguage('vi')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: language === 'vi' ? 'var(--hover-bg)' : 'var(--hover-bg-subtle)',
                  border: language === 'vi' ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: language === 'vi' ? '0 4px 18px var(--primary-glow)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>🇻🇳</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {t('lang_vi_name')}
                      </span>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: '9999px',
                        background: 'var(--primary-glow)',
                        color: 'var(--primary)',
                        border: '1px solid var(--border-highlight)'
                      }}>
                        {t('lang_vi_badge')}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                      {t('lang_vi_desc')}
                    </div>
                  </div>
                </div>

                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  border: language === 'vi' ? '2px solid var(--primary)' : '2px solid var(--border-medium)',
                  background: language === 'vi' ? 'var(--primary)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-inverse)',
                  flexShrink: 0
                }}>
                  {language === 'vi' && <Check size={13} strokeWidth={3} />}
                </div>
              </div>

              {/* Option 2: English */}
              <div
                onClick={() => handleSelectLanguage('en')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: language === 'en' ? 'var(--hover-bg)' : 'var(--hover-bg-subtle)',
                  border: language === 'en' ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: language === 'en' ? '0 4px 18px var(--primary-glow)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>🇺🇸</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {t('lang_en_name')}
                      </span>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: '9999px',
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#0284C7',
                        border: '1px solid rgba(56, 189, 248, 0.25)'
                      }}>
                        {t('lang_en_badge')}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                      {t('lang_en_desc')}
                    </div>
                  </div>
                </div>

                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  border: language === 'en' ? '2px solid var(--primary)' : '2px solid var(--border-medium)',
                  background: language === 'en' ? 'var(--primary)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-inverse)',
                  flexShrink: 0
                }}>
                  {language === 'en' && <Check size={13} strokeWidth={3} />}
                </div>
              </div>
            </div>
          </div>

          {/* Toast / Notification when changed */}
          {showSavedNotification && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#059669',
              fontSize: '0.82rem',
              fontWeight: 600,
              animation: 'fadeIn 0.2s ease'
            }}>
              <Check size={16} />
              <span>{toastMessage || t('settings_saved_toast')}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '10px',
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--hover-bg-subtle)',
        }}>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{
              padding: '8px 22px',
              fontSize: '0.86rem',
              fontWeight: 600
            }}
          >
            {t('settings_save')}
          </button>
        </div>
      </div>
    </div>
  );
}
