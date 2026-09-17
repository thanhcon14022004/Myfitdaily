import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  vi: {
    // Brand
    brand_name: 'MYFITDAILY',
    brand_subtitle: 'Nền tảng Tủ Đồ Số & Trợ Lý Phối Đồ AI Cho Giới Trẻ Việt Nam',

    // Sidebar & Navigation
    nav_explore: 'Khám phá phong cách',
    nav_dashboard: 'Trang phục yêu thích',
    nav_wardrobe: 'Tủ đồ cá nhân',
    nav_outfits: 'Phối đồ Studio',
    nav_ai_stylist: 'AI Stylist Studio',
    nav_add_item: 'Thêm đồ mới',
    nav_new_chat: 'Đoạn chat mới',
    nav_search: 'Tìm kiếm',
    nav_recent_chats: 'Các đoạn chat gần đây',
    nav_no_chats: 'Chưa có lịch sử đoạn chat nào. Hãy bấm Đoạn chat mới để bắt đầu!',
    nav_delete_chat: 'Xóa đoạn chat này',
    nav_close_sidebar: 'Đóng thanh bên',
    nav_open_sidebar: 'Mở thanh bên',

    // Profile Popover
    profile_menu_title: 'Hồ sơ cá nhân',
    settings_menu_title: 'Cài đặt',
    upgrade_vip_title: 'Nâng cấp gói Plus / VIP',
    logout_title: 'Đăng xuất',
    login_title: 'Đăng nhập / Đăng ký',
    free_plan: 'Gói Miễn Phí',
    vip_plan: 'Hội viên VIP',

    // TopBar
    topbar_ai_stylist: 'AI Stylist',
    topbar_dashboard: 'Trang phục yêu thích',
    topbar_wardrobe: 'Tủ đồ số',
    topbar_outfits: 'Atelier phối đồ',
    topbar_profile: 'Hồ sơ cá nhân',
    topbar_premium: 'Hội viên VIP',
    topbar_landing: 'Khám phá',

    // Settings Modal
    settings_title: 'Cài Đặt Hệ Thống',
    settings_subtitle: 'Tùy chỉnh ngôn ngữ & trải nghiệm ứng dụng MYFITDAILY',
    settings_lang_heading: 'Ngôn ngữ hiển thị (Language)',
    settings_lang_desc: 'Chọn ngôn ngữ giao diện và phong cách phản hồi của AI Stylist.',
    lang_vi_name: 'Tiếng Việt',
    lang_vi_badge: 'Mặc định',
    lang_vi_desc: 'Giao diện và tư vấn thời trang AI hoàn toàn bằng Tiếng Việt chuẩn gu.',
    lang_en_name: 'English',
    lang_en_badge: 'International',
    settings_theme_heading: 'Chế độ giao diện (Giao diện Đen / Trắng)',
    settings_theme_desc: 'Tùy chỉnh toàn bộ màu sắc giao diện theo phong cách ChatGPT Dark & Light mode.',
    theme_dark_name: 'Giao diện Tối (Đen)',
    theme_dark_badge: 'Mặc định',
    theme_dark_desc: 'Sắc đen Obsidian & Charcoal chuẩn ChatGPT, sang trọng và êm dịu mắt ban đêm.',
    theme_light_name: 'Giao diện Sáng (Trắng)',
    theme_light_badge: 'Hiện đại',
    theme_light_desc: 'Sắc trắng Editorial White & Pearl chuẩn ChatGPT, sáng rõ và thanh lịch.',
    settings_saved_theme_toast: 'Đã cập nhật chế độ giao diện thành công!',
    settings_close: 'Đóng',
    settings_save: 'Hoàn tất & Áp dụng',
    settings_saved_toast: 'Đã cập nhật cài đặt thành công!',

    // Common
    common_save: 'Lưu',
    common_cancel: 'Hủy',
    common_loading: 'Đang tải...'
  },
  en: {
    // Brand
    brand_name: 'MYFITDAILY',
    brand_subtitle: 'Digital Wardrobe & AI Stylist Platform for Modern Fashion',

    // Sidebar & Navigation
    nav_explore: 'Explore Styles',
    nav_dashboard: 'Favorite Outfits',
    nav_wardrobe: 'My Wardrobe',
    nav_outfits: 'Outfit Studio',
    nav_ai_stylist: 'AI Stylist Studio',
    nav_add_item: 'Add New Item',
    nav_new_chat: 'New Chat',
    nav_search: 'Search',
    nav_recent_chats: 'Recent Chats',
    nav_no_chats: 'No chat history yet. Click New Chat to start styling!',
    nav_delete_chat: 'Delete chat',
    nav_close_sidebar: 'Close sidebar',
    nav_open_sidebar: 'Open sidebar',

    // Profile Popover
    profile_menu_title: 'User Profile',
    settings_menu_title: 'Settings',
    upgrade_vip_title: 'Upgrade to Plus / VIP',
    logout_title: 'Log out',
    login_title: 'Log in / Sign up',
    free_plan: 'Free Plan',
    vip_plan: 'VIP Member',

    // TopBar
    topbar_ai_stylist: 'AI Stylist',
    topbar_dashboard: 'Favorite Outfits',
    topbar_wardrobe: 'Digital Wardrobe',
    topbar_outfits: 'Outfit Atelier',
    topbar_profile: 'Profile',
    topbar_premium: 'VIP Membership',
    topbar_landing: 'Explore',

    // Settings Modal
    settings_title: 'System Settings',
    settings_subtitle: 'Customize display language & application preferences',
    settings_lang_heading: 'Display Language',
    settings_lang_desc: 'Select your preferred interface language and AI Stylist tone.',
    lang_vi_name: 'Tiếng Việt (Vietnamese)',
    lang_vi_badge: 'Default',
    lang_vi_desc: 'Interface & AI styling consultations in authentic Vietnamese.',
    lang_en_name: 'English',
    lang_en_badge: 'International',
    settings_theme_heading: 'Theme (Dark & Light Mode)',
    settings_theme_desc: 'Switch the entire application between ChatGPT-style Dark Mode (Black) and Light Mode (White).',
    theme_dark_name: 'Dark Mode (Black)',
    theme_dark_badge: 'Default',
    theme_dark_desc: 'ChatGPT Obsidian & Charcoal dark palette, sleek and comfortable for eyes.',
    theme_light_name: 'Light Mode (White)',
    theme_light_badge: 'Modern',
    theme_light_desc: 'ChatGPT Pure White & Pearl editorial palette, crisp, bright and minimalist.',
    settings_saved_theme_toast: 'Interface theme updated successfully!',
    settings_close: 'Close',
    settings_save: 'Apply & Save',
    settings_saved_toast: 'Settings updated successfully!',

    // Common
    common_save: 'Save',
    common_cancel: 'Cancel',
    common_loading: 'Loading...'
  }
};

const LanguageContext = createContext({
  language: 'vi',
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
  text: (vi, en) => vi,
  isVietnamese: true,
  isEnglish: false,
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('myfitdaily_lang') || 'vi';
  });

  const setLanguage = (lang) => {
    const validLang = lang === 'en' ? 'en' : 'vi';
    setLanguageState(validLang);
    try {
      localStorage.setItem('myfitdaily_lang', validLang);
    } catch (e) {
      console.warn("Failed to persist language preference", e);
    }
  };

  const t = (key, fallback = '') => {
    const langDict = translations[language] || translations.vi;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    return fallback || key;
  };

  const text = (vi, en) => {
    return language === 'en' ? en : vi;
  };

  const value = {
    language,
    setLanguage,
    t,
    text,
    isVietnamese: language === 'vi',
    isEnglish: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
