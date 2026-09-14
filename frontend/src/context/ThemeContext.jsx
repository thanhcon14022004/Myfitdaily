import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEME_MODES = [
  {
    id: 'dark',
    icon: '🌙',
    nameVi: 'Giao diện Tối (Đen)',
    nameEn: 'Dark Mode (Black)',
    descVi: 'Tông đen Charcoal & Obsidian chuẩn ChatGPT, sang trọng và êm dịu mắt.',
    descEn: 'ChatGPT Obsidian & Charcoal dark palette, sleek & comfortable for eyes.',
    badgeVi: 'Mặc định',
    badgeEn: 'Default',
    previewBg: '#171717',
    previewCard: '#212121',
    previewText: '#ECECEC'
  },
  {
    id: 'light',
    icon: '☀️',
    nameVi: 'Giao diện Sáng (Trắng)',
    nameEn: 'Light Mode (White)',
    descVi: 'Tông trắng Clean Editorial & Pearl chuẩn ChatGPT, sáng rõ và thanh lịch.',
    descEn: 'ChatGPT Pure White & Pearl editorial palette, crisp & minimalist.',
    badgeVi: 'Hiện đại',
    badgeEn: 'Modern',
    previewBg: '#F9F9F9',
    previewCard: '#FFFFFF',
    previewText: '#0D0D0D'
  }
];

const ThemeContext = createContext({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: true,
  isLight: false,
  currentMode: THEME_MODES[0],
  themes: THEME_MODES
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('myfitdaily_theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    // Backward compatibility if user had previous color names
    return 'dark';
  });

  // Apply theme to DOM (documentElement and body)
  useEffect(() => {
    const validTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', validTheme);
    document.body.setAttribute('data-theme', validTheme);
    try {
      localStorage.setItem('myfitdaily_theme', validTheme);
    } catch (e) {
      console.warn('Failed to persist theme preference', e);
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme);
    }
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const currentMode = THEME_MODES.find(m => m.id === theme) || THEME_MODES[0];

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    currentMode,
    themes: THEME_MODES
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
