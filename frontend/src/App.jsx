import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import SearchModal from './components/SearchModal';
import AuthModal from './components/AuthModal';
import AddClothingModal from './components/AddClothingModal';
import SettingsModal from './components/SettingsModal';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import WardrobePage from './pages/WardrobePage';
import OutfitStudioPage from './pages/OutfitStudioPage';
import AiStylistPage from './pages/AiStylistPage';
import ProfilePage from './pages/ProfilePage';
import PremiumPage from './pages/PremiumPage';

import { apiRequest } from './api/apiClient';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_OUTFITS,
  getCategoriesForGender,
  getInitialOutfitsForGender,
  sanitizeClothesForGender
} from './data/initialWardrobe';
import { INITIAL_CHAT_SESSIONS } from './data/initialChatSessions';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { text } = useLanguage();
  // Navigation State: 'landing' | 'dashboard' | 'wardrobe' | 'outfits' | 'ai-stylist' | 'profile' | 'premium'
  const [currentTab, setCurrentTab] = useState('landing');

  // Chat History & Sessions State (ChatGPT dynamic history)
  const [chatSessions, setChatSessions] = useState(() => {
    const saved = localStorage.getItem('myfitdaily_chat_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn("Failed to parse chat sessions from storage", e);
      }
    }
    return INITIAL_CHAT_SESSIONS;
  });

  // Sidebar & Search State (ChatGPT UI)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('myfitdaily_sidebar_open');
    return saved !== null ? saved === 'true' : true;
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(() => {
    return INITIAL_CHAT_SESSIONS[0]?.id || null;
  });
  const [activeChatPrompt, setActiveChatPrompt] = useState(null);
  const [resetChatSignal, setResetChatSignal] = useState(0);

  // User State
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Clothing & Outfits state: User's own uploaded clothes (Starts empty for new users)
  const isMale = user?.gender?.toLowerCase() === 'nam' || user?.gender?.toLowerCase() === 'male';
  const categories = getCategoriesForGender(user?.gender);

  const [clothes, setClothes] = useState(() => {
    const saved = localStorage.getItem('myfitdaily_user_clothes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.warn("Failed to parse saved clothes", e);
      }
    }
    return [];
  });

  const [outfits, setOutfits] = useState(() => {
    const saved = localStorage.getItem('myfitdaily_outfits');
    return saved ? JSON.parse(saved) : INITIAL_OUTFITS;
  });

  // Load user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('myfitdaily_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
  }, []);

  // Fetch user's real wardrobe from database & sanitize by gender
  useEffect(() => {
    async function loadUserClothes() {
      try {
        const res = await apiRequest('/clothes');
        if (res.ok && res.data?.data && Array.isArray(res.data.data)) {
          const items = isMale ? sanitizeClothesForGender(res.data.data, user?.gender) : res.data.data;
          setClothes(items);
          localStorage.setItem('myfitdaily_user_clothes', JSON.stringify(items));
        }
      } catch (err) {
        console.warn("Could not sync clothes from backend, using local state", err);
      }
    }
    loadUserClothes();
  }, [user, isMale]);

  // Purge legacy female clothes from local state when male account is active
  useEffect(() => {
    if (isMale && clothes.length > 0) {
      const sanitized = sanitizeClothesForGender(clothes, user?.gender);
      if (sanitized.length !== clothes.length) {
        setClothes(sanitized);
        localStorage.setItem('myfitdaily_user_clothes', JSON.stringify(sanitized));
      }
    }
  }, [user, isMale, clothes.length]);

  // Save to localStorage when clothes/outfits change
  useEffect(() => {
    localStorage.setItem('myfitdaily_user_clothes', JSON.stringify(clothes));
  }, [clothes]);

  useEffect(() => {
    localStorage.setItem('myfitdaily_outfits', JSON.stringify(outfits));
  }, [outfits]);

  useEffect(() => {
    localStorage.setItem('myfitdaily_chat_sessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  // Handlers
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('myfitdaily_token');
    localStorage.removeItem('myfitdaily_user');
    setUser(null);
    setClothes([]);
    setCurrentTab('landing');
  };

  const handleAddClothing = async (newItem) => {
    const subType = user?.subscriptionType || 'Free';
    const isPlus = subType.toLowerCase() === 'premiumplus' || subType.toLowerCase() === 'premium_plus';
    const isPremium = subType.toLowerCase() === 'premium';
    const maxLimit = isPlus ? Infinity : (isPremium ? 100 : 15);

    if (clothes.length >= maxLimit) {
      alert(text(
        `Tủ đồ của bạn đã đạt giới hạn tối đa (${maxLimit} món) của gói ${subType}. Vui lòng nâng cấp lên gói Premium hoặc Premium Plus để mở rộng không gian lưu trữ!`,
        `Your wardrobe has reached the maximum limit (${maxLimit} items) for the ${subType} plan. Please upgrade to Premium or Premium Plus to expand your digital closet!`
      ));
      setCurrentTab('premium');
      return false;
    }

    try {
      const res = await apiRequest('/clothes', {
        method: 'POST',
        body: JSON.stringify({
          name: newItem.name,
          categoryId: newItem.categoryId,
          color: newItem.color,
          style: newItem.style,
          season: newItem.season,
          imageUrl: newItem.imageUrl,
          description: newItem.description,
          brand: newItem.brand,
          size: newItem.size
        })
      });
      if (res.ok && res.data?.data) {
        setClothes(prev => [res.data.data, ...prev]);
        return true;
      }
    } catch (err) {
      if (err?.message?.includes('hạn mức') || err?.message?.includes('giới hạn')) {
        alert(err.message);
        setCurrentTab('premium');
        return false;
      }
      console.warn("API add clothing failed, saving locally:", err);
    }
    // Local fallback
    setClothes(prev => [{ ...newItem, id: Date.now() }, ...prev]);
    return true;
  };

  const handleDeleteClothing = async (id) => {
    try {
      await apiRequest(`/clothes/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn("API delete clothing failed:", err);
    }
    setClothes(prev => prev.filter(item => item.id !== id));
    // Remove item from any outfits
    setOutfits(prev => prev.map(o => ({
      ...o,
      itemIds: o.itemIds ? o.itemIds.filter(itemId => itemId !== id) : [],
    })));
  };

  const handleBulkDeleteClothing = async (ids) => {
    if (!ids || ids.length === 0) return;
    try {
      await apiRequest('/clothes/bulk-delete', {
        method: 'POST',
        body: JSON.stringify(ids),
      });
    } catch (err) {
      console.warn("API bulk delete clothing failed, fallback to local:", err);
    }
    const idSet = new Set(ids);
    setClothes(prev => prev.filter(item => !idSet.has(item.id)));
    setOutfits(prev => prev.map(o => ({
      ...o,
      itemIds: o.itemIds ? o.itemIds.filter(itemId => !idSet.has(itemId)) : [],
    })));
  };

  const handleSaveOutfit = (newOutfit) => {
    setOutfits([newOutfit, ...outfits]);
  };

  const handleToggleFavoriteOutfit = (id) => {
    setOutfits(outfits.map(o => 
      o.id === id ? { ...o, isFavorite: !o.isFavorite } : o
    ));
  };

  const handleDeleteOutfit = (id) => {
    if (window.confirm(text("Bạn có chắc chắn muốn xóa bộ phối đồ này?", "Are you sure you want to delete this outfit?"))) {
      setOutfits(outfits.filter(o => o.id !== id));
    }
  };

  const handleSaveAiOutfit = (aiOutfit) => {
    setOutfits([aiOutfit, ...outfits]);
  };

  const handleToggleFavoriteAiOutfit = (aiOutfit) => {
    if (!aiOutfit) return false;
    let isNowFav = false;
    setOutfits(prevOutfits => {
      const existingIndex = prevOutfits.findIndex(o => 
        (aiOutfit.id && o.id === aiOutfit.id) || 
        (o.name && aiOutfit.name && o.name.toLowerCase() === aiOutfit.name.toLowerCase())
      );

      if (existingIndex >= 0) {
        const existing = prevOutfits[existingIndex];
        isNowFav = !existing.isFavorite;
        const updated = [...prevOutfits];
        updated[existingIndex] = { ...existing, isFavorite: isNowFav };
        return updated;
      } else {
        isNowFav = true;
        const newOutfit = {
          id: aiOutfit.id || Date.now(),
          name: aiOutfit.name,
          occasion: aiOutfit.occasion || 'Casual',
          season: aiOutfit.season || 'AllSeason',
          items: aiOutfit.items || [],
          itemIds: (aiOutfit.items || []).map(i => i.id),
          stylistNotes: aiOutfit.description || aiOutfit.stylistNotes,
          harmonyScore: aiOutfit.harmonyScore || '98%',
          createdByAi: true,
          isFavorite: true,
          createdAt: Date.now()
        };
        return [newOutfit, ...prevOutfits];
      }
    });
    return isNowFav;
  };

  const handleUpgradePremium = async (planId = 'Premium', cycle = 'Monthly') => {
    try {
      const res = await apiRequest('/api/subscription/upgrade', {
        method: 'POST',
        body: JSON.stringify({
          planId: planId,
          billingCycle: cycle === 'yearly' ? 'Yearly' : 'Monthly',
          paymentMethod: 'VietQR'
        })
      });

      const updated = res?.data || { ...user, subscriptionType: planId };
      setUser(updated);
      localStorage.setItem('myfitdaily_user', JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error("Upgrade API error, fallback local:", err);
      const updated = { ...user, subscriptionType: planId };
      setUser(updated);
      localStorage.setItem('myfitdaily_user', JSON.stringify(updated));
      return updated;
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => {
      const next = !prev;
      localStorage.setItem('myfitdaily_sidebar_open', String(next));
      return next;
    });
  };

  const handleNewChat = () => {
    setSelectedChatId(null);
    setActiveChatPrompt(null);
    setResetChatSignal(prev => prev + 1);
    setCurrentTab('ai-stylist');
  };

  const handleSelectChat = (sessionId) => {
    setSelectedChatId(sessionId);
    setActiveChatPrompt(null);
    setCurrentTab('ai-stylist');
  };

  const handleDeleteChat = (sessionId) => {
    setChatSessions(prev => {
      const updated = prev.filter(s => s.id !== sessionId);
      if (selectedChatId === sessionId) {
        setSelectedChatId(updated[0]?.id || null);
      }
      return updated;
    });
  };

  const handleSaveSession = (sessionId, messages, firstUserText) => {
    setChatSessions(prev => {
      const existingIndex = prev.findIndex(s => s.id === sessionId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          messages,
          updatedAt: Date.now()
        };
        return updated;
      } else {
        const newId = sessionId || ('chat-' + Date.now());
        const title = (firstUserText || 'Đoạn chat mới').slice(0, 32);
        const newSession = {
          id: newId,
          title,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages
        };
        setSelectedChatId(newId);
        return [newSession, ...prev];
      }
    });
  };

  const handleResetChat = () => {
    setResetChatSignal(prev => prev + 1);
  };

  const currentActiveSession = chatSessions.find(s => s.id === selectedChatId) || null;

  return (
    <div className="chatgpt-app-layout">
      {/* ChatGPT Style Left Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={handleToggleSidebar}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onNewChat={handleNewChat}
        chatSessions={chatSessions}
        activeSessionId={selectedChatId}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        favoriteCount={outfits.filter(o => o.isFavorite).length}
      />

      {/* Mobile Drawer Backdrop */}
      <div 
        className={`chatgpt-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Workspace Pane */}
      <div className="chatgpt-main-pane">
        {/* Clean TopBar */}
        <TopBar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          user={user}
        />

        {/* Page Content Body */}
        <main 
          style={{ 
            flex: currentTab === 'ai-stylist' ? '1 1 0%' : '1 0 auto',
            minHeight: currentTab === 'ai-stylist' ? 0 : 'auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {currentTab === 'landing' && (
            <LandingPage
              onGetStarted={() => {
                if (user) setCurrentTab('dashboard');
                else setIsAuthModalOpen(true);
              }}
              onExploreWardrobe={() => setCurrentTab('wardrobe')}
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardPage
              user={user}
              clothes={isMale ? sanitizeClothesForGender(clothes, user?.gender) : clothes}
              outfits={outfits}
              onNavigate={setCurrentTab}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onToggleFavoriteOutfit={handleToggleFavoriteOutfit}
              onDeleteOutfit={handleDeleteOutfit}
            />
          )}

          {currentTab === 'wardrobe' && (
            <WardrobePage
              clothes={isMale ? sanitizeClothesForGender(clothes, user?.gender) : clothes}
              categories={categories}
              user={user}
              onDeleteClothing={handleDeleteClothing}
              onDeleteItem={handleDeleteClothing}
              onBulkDeleteClothes={handleBulkDeleteClothing}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'outfits' && (
            <OutfitStudioPage
              clothes={isMale ? sanitizeClothesForGender(clothes, user?.gender) : clothes}
              outfits={outfits}
              onSaveOutfit={handleSaveOutfit}
              onToggleFavorite={handleToggleFavoriteOutfit}
              onDeleteOutfit={handleDeleteOutfit}
              onDeleteClothing={handleDeleteClothing}
              onNavigate={setCurrentTab}
              user={user}
            />
          )}

          {currentTab === 'ai-stylist' && (
            <AiStylistPage
              clothes={isMale ? sanitizeClothesForGender(clothes, user?.gender) : clothes}
              outfits={outfits}
              onToggleFavoriteAiOutfit={handleToggleFavoriteAiOutfit}
              onSaveAiOutfit={handleSaveAiOutfit}
              onNavigate={setCurrentTab}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              user={user}
              activeSession={currentActiveSession}
              onSaveSession={handleSaveSession}
              onNewChat={handleNewChat}
              activeChatPrompt={activeChatPrompt}
              resetChatSignal={resetChatSignal}
            />
          )}

          {currentTab === 'profile' && (
            <ProfilePage
              user={user}
              onUpdateUser={setUser}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'premium' && (
            <PremiumPage
              user={user}
              onUpgrade={handleUpgradePremium}
            />
          )}
        </main>

        {/* Footer (hidden on ai-stylist page so chat fits full screen without page scrolling) */}
        {currentTab !== 'ai-stylist' && (
          <footer style={{
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '32px 0 24px',
            textAlign: 'center',
            marginTop: 'auto',
            flexShrink: 0,
            width: '100%',
            position: 'relative',
            zIndex: 10,
            transition: 'background 0.3s ease, border-color 0.3s ease'
          }}>
            <div className="container">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '1rem',
                fontWeight: 800,
              }}>
                MYFIT<span style={{ color: 'var(--primary)' }}>DAILY</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {text(
                  'Nền tảng Tủ Đồ Số & Trợ Lý Phối Đồ AI Cho Giới Trẻ Việt Nam – PRN232 EXE201 Group 6',
                  'Digital Wardrobe & AI Stylist Platform – PRN232 EXE201 Group 6'
                )}
              </p>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {text(
                  `© ${new Date().getFullYear()} MYFITDAILY. Đã đăng ký bản quyền. Được xây dựng với React & ASP.NET Core 8.`,
                  `© ${new Date().getFullYear()} MYFITDAILY. All rights reserved. Built with React & ASP.NET Core 8.`
                )}
              </div>
            </div>
          </footer>
        )}
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <AddClothingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddClothing}
        user={user}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        clothes={clothes}
        outfits={outfits}
        chatSessions={chatSessions}
        onNavigate={setCurrentTab}
        onSelectChat={handleSelectChat}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
