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
import AdminPortalPage from './pages/AdminPortalPage';
import AiTrainingStudioPage from './pages/AiTrainingStudioPage';

import { apiRequest } from './api/apiClient';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_OUTFITS,
  getCategoriesForGender,
  getInitialClothesForGender,
  getInitialOutfitsForGender,
  sanitizeClothesForGender,
  isDemoUser
} from './data/initialWardrobe';
import { INITIAL_CHAT_SESSIONS } from './data/initialChatSessions';
import { useLanguage } from './context/LanguageContext';
import { getSubscriptionType, sanitizeUser, isPremiumUser, isPremiumPlusUser } from './utils/subscriptionUtils';
import { supabase } from './api/supabaseClient';
import { syncSocialUserWithBackend, signOutFromSupabase } from './services/supabaseAuthService';

export default function App() {
  const { text } = useLanguage();
  // Navigation State: 'landing' | 'dashboard' | 'wardrobe' | 'outfits' | 'ai-stylist' | 'profile' | 'premium' | 'admin'
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
  const [authModalMode, setAuthModalMode] = useState('login');
  const [pendingVerification, setPendingVerification] = useState(null);
  const [pendingOnboardingUser, setPendingOnboardingUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Clothing & Outfits state: User's own uploaded clothes (Starts empty for new users)
  const isMale = user?.gender?.toLowerCase() === 'nam' || user?.gender?.toLowerCase() === 'male';
  const categories = getCategoriesForGender(user?.gender);

  const [clothes, setClothes] = useState(() => {
    const savedUser = localStorage.getItem('myfitdaily_user');
    if (!savedUser) return getInitialClothesForGender('Nam');
    try {
      const u = JSON.parse(savedUser);
      if (isDemoUser(u)) return getInitialClothesForGender(u.gender || 'Nam');
      const cached = localStorage.getItem('myfitdaily_user_clothes');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const hasDemoSeed = parsed.some(item => [260, 261, 262, 263, 201, 202, 203].includes(item.id));
          if (hasDemoSeed) {
            localStorage.removeItem('myfitdaily_user_clothes');
            return [];
          }
          return parsed;
        }
      }
    } catch {}
    return [];
  });

  const [outfits, setOutfits] = useState(() => {
    const savedUser = localStorage.getItem('myfitdaily_user');
    if (!savedUser) return getInitialOutfitsForGender('Nam');
    try {
      const u = JSON.parse(savedUser);
      if (isDemoUser(u)) return getInitialOutfitsForGender(u.gender || 'Nam');
      const cached = localStorage.getItem('myfitdaily_outfits');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const hasDemoSeed = parsed.some(o => [311, 312, 313, 301, 302, 401, 402].includes(o.id));
          if (hasDemoSeed) {
            localStorage.removeItem('myfitdaily_outfits');
            return [];
          }
          return parsed;
        }
      }
    } catch {}
    return [];
  });

  // Load user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('myfitdaily_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const cleanUser = sanitizeUser(parsed);
        if (cleanUser) {
          localStorage.setItem('myfitdaily_user', JSON.stringify(cleanUser));
          setUser(cleanUser);
          if (cleanUser?.role === 'Admin') {
            setCurrentTab('admin');
          }
        }
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
  }, []);

  // Listen to Supabase OAuth Redirect Callback & Session synchronization
  useEffect(() => {
    let isMounted = true;

    const handleSocialSync = async (sessionUser, provider) => {
      try {
        console.log("[MyFitDaily OAuth] Syncing user with backend:", sessionUser?.email);
        const synced = await syncSocialUserWithBackend(sessionUser, provider);
        if (!isMounted) return;

        if (synced?.requiresVerification) {
          // Người dùng mới: Mở modal xác thực mã OTP 5 phút
          setPendingVerification(synced);
          setPendingOnboardingUser(null);
          setAuthModalMode('verify-otp');
          setIsAuthModalOpen(true);
        } else if (synced?.isNewUser || synced?.needsProfileSetup) {
          // Người dùng mới (đã xác thực qua link hoặc OAuth): Bắt buộc mở modal onboarding để nhập tên, giới tính, độ tuổi
          setUser(synced);
          setPendingVerification(null);
          setPendingOnboardingUser(synced);
          setAuthModalMode('onboarding');
          setIsAuthModalOpen(true);
        } else if (synced?.id) {
          // Người dùng đã có tài khoản: Vào luôn!
          setUser(synced);
          setIsAuthModalOpen(false);
          setPendingVerification(null);
          setPendingOnboardingUser(null);
          setAuthModalMode('login');
          if (synced.role === 'Admin') setCurrentTab('admin');
          else setCurrentTab('dashboard');
        }
        if (window.location.hash || window.location.search.includes('code=')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (e) {
        console.warn("[MyFitDaily OAuth] Could not sync OAuth session:", e);
      }
    };

    // 1. Initial check for existing Supabase session (e.g. immediately after Google/Facebook redirect)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && isMounted) {
        const provider = session.user.app_metadata?.provider === 'facebook' ? 'Facebook' : 'Google';
        handleSocialSync(session.user, provider);
      }
    });

    // 2. Fallback parser for URL hash if access_token was returned directly in URL
    if (window.location.hash && window.location.hash.includes('access_token=')) {
      try {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('access_token');
        if (accessToken) {
          const payloadBase64 = accessToken.split('.')[1];
          if (payloadBase64) {
            const tokenPayload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
            if (tokenPayload?.email) {
              const syntheticUser = {
                id: tokenPayload.sub || String(Date.now()),
                email: tokenPayload.email,
                user_metadata: tokenPayload.user_metadata || {},
                app_metadata: tokenPayload.app_metadata || {}
              };
              handleSocialSync(syntheticUser, 'Google');
            }
          }
        }
      } catch (err) {
        console.warn("Could not parse hash token:", err);
      }
    }

    // 3. Auth listener for Supabase OAuth login events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[MyFitDaily Supabase Auth Event]:", event, session?.user?.email);
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user && isMounted) {
        const provider = session.user.app_metadata?.provider === 'facebook' ? 'Facebook' : 'Google';
        await handleSocialSync(session.user, provider);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Admin route restriction: Admin role is strictly for managing the platform, affiliate links & catalog
  useEffect(() => {
    if (user?.role === 'Admin' && (currentTab === 'ai-stylist' || currentTab === 'outfits' || currentTab === 'landing')) {
      setCurrentTab('admin');
    }
  }, [user, currentTab]);

  // Fetch user's real wardrobe from database & sanitize by gender
  useEffect(() => {
    async function loadUserClothes() {
      // 1. Khách vãng lai (chưa đăng nhập): Nạp đồ mẫu để xem trước phong cách
      if (!user) {
        setClothes(getInitialClothesForGender('Nam'));
        return;
      }

      // 2. Tài khoản Demo: Luôn nạp bộ sưu tập đồ mẫu Studio
      if (isDemoUser(user)) {
        try {
          const res = await apiRequest('/clothes');
          if (res.ok && res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
            const items = isMale ? sanitizeClothesForGender(res.data.data, user?.gender) : res.data.data;
            setClothes(items);
            localStorage.setItem('myfitdaily_user_clothes', JSON.stringify(items));
          } else {
            setClothes(getInitialClothesForGender(user?.gender));
          }
        } catch {
          setClothes(getInitialClothesForGender(user?.gender));
        }
        return;
      }

      // 3. TÀI KHOẢN NGƯỜI DÙNG THỰC: Bắt đầu từ tủ đồ riêng của họ, rỗng [] nếu chưa tải đồ
      try {
        const res = await apiRequest('/clothes');
        if (res.ok && res.data?.data && Array.isArray(res.data.data)) {
          // Lọc triệt để đồ mẫu stylist cũ nếu còn dính
          const realItems = res.data.data.filter(item => 
            !item.brand?.includes('STYLIST EDIT') && 
            !item.brand?.includes('FROZEN.HN') &&
            !(item.imageUrl && item.imageUrl.includes('/assets/stylist/'))
          );
          setClothes(realItems);
          localStorage.setItem('myfitdaily_user_clothes', JSON.stringify(realItems));
        } else {
          setClothes([]);
          localStorage.setItem('myfitdaily_user_clothes', JSON.stringify([]));
        }
      } catch (err) {
        console.warn("Could not sync clothes from backend for real user", err);
        setClothes([]);
        localStorage.setItem('myfitdaily_user_clothes', JSON.stringify([]));
      }
    }
    loadUserClothes();
  }, [user, isMale]);

  // Fetch user's outfits from database / initial demo
  useEffect(() => {
    async function loadUserOutfits() {
      if (!user) {
        setOutfits(getInitialOutfitsForGender('Nam'));
        return;
      }
      if (isDemoUser(user)) {
        try {
          const res = await apiRequest('/outfits');
          if (res.ok && res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
            setOutfits(res.data.data);
          } else {
            setOutfits(getInitialOutfitsForGender(user?.gender));
          }
        } catch {
          setOutfits(getInitialOutfitsForGender(user?.gender));
        }
        return;
      }
      // Người dùng thực: Bắt đầu bằng danh sách rỗng [], lấy từ API nếu có
      try {
        const res = await apiRequest('/outfits');
        if (res.ok && res.data?.data && Array.isArray(res.data.data)) {
          setOutfits(res.data.data);
          localStorage.setItem('myfitdaily_outfits', JSON.stringify(res.data.data));
        } else {
          setOutfits([]);
          localStorage.setItem('myfitdaily_outfits', JSON.stringify([]));
        }
      } catch {
        setOutfits([]);
        localStorage.setItem('myfitdaily_outfits', JSON.stringify([]));
      }
    }
    loadUserOutfits();
  }, [user]);

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
  const handleOpenAuth = (mode = 'login') => {
    setPendingOnboardingUser(null);
    setPendingVerification(null);
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setPendingVerification(null);
    setPendingOnboardingUser(null);
    setAuthModalMode('login');

    if (isDemoUser(userData)) {
      setClothes(getInitialClothesForGender(userData?.gender));
      setOutfits(getInitialOutfitsForGender(userData?.gender));
    } else {
      // Người dùng thật: Dọn dẹp cache mẫu cũ và bắt đầu với tủ đồ trống
      const cachedClothes = localStorage.getItem('myfitdaily_user_clothes');
      if (cachedClothes && (cachedClothes.includes('260') || cachedClothes.includes('Coolmate') || cachedClothes.includes('Frozen.HN'))) {
        localStorage.removeItem('myfitdaily_user_clothes');
      }
      const cachedOutfits = localStorage.getItem('myfitdaily_outfits');
      if (cachedOutfits && (cachedOutfits.includes('311') || cachedOutfits.includes('Cream & Black'))) {
        localStorage.removeItem('myfitdaily_outfits');
      }
      setClothes([]);
      setOutfits([]);
    }

    if (userData?.role === 'Admin') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await signOutFromSupabase();
    } catch { }
    localStorage.removeItem('myfitdaily_token');
    localStorage.removeItem('myfitdaily_user');
    localStorage.removeItem('myfitdaily_user_clothes');
    localStorage.removeItem('myfitdaily_outfits');
    setUser(null);
    setClothes(getInitialClothesForGender('Nam'));
    setOutfits(getInitialOutfitsForGender('Nam'));
    setPendingVerification(null);
    setPendingOnboardingUser(null);
    setAuthModalMode('login');
    setIsAuthModalOpen(false);
    setCurrentTab('landing');
  };

  const handleAddClothing = async (newItem) => {
    const subType = getSubscriptionType(user);
    const isPlus = isPremiumPlusUser(user);
    const isPremium = isPremiumUser(user);
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

  const handleUpgradePremium = async (planOrUser = 'Premium', cycle = 'Monthly') => {
    // Trường hợp 1: Nhận trực tiếp đối tượng user đã nâng cấp từ modal thanh toán SePay
    if (typeof planOrUser === 'object' && planOrUser !== null) {
      const userObj = planOrUser.data?.user || planOrUser.user || planOrUser.data || planOrUser;
      const cleanUser = sanitizeUser({ ...user, ...userObj });
      setUser(cleanUser);
      localStorage.setItem('myfitdaily_user', JSON.stringify(cleanUser));
      return cleanUser;
    }

    // Trường hợp 2: Nhận chuỗi planId ('Premium', 'PremiumPlus', 'Free')
    const planId = typeof planOrUser === 'string' ? planOrUser : 'Premium';
    try {
      const res = await apiRequest('/subscription/upgrade', {
        method: 'POST',
        body: JSON.stringify({
          planId: planId,
          billingCycle: cycle === 'yearly' ? 'Yearly' : 'Monthly',
          paymentMethod: 'VietQR'
        })
      });

      const userFromApi = res?.data?.data || res?.data;
      const cleanUser = sanitizeUser(
        userFromApi && typeof userFromApi === 'object' && userFromApi.id
          ? userFromApi
          : { ...user, subscriptionType: planId }
      );
      setUser(cleanUser);
      localStorage.setItem('myfitdaily_user', JSON.stringify(cleanUser));
      return cleanUser;
    } catch (err) {
      console.error("Upgrade API error, fallback local:", err);
      const cleanUser = sanitizeUser({ ...user, subscriptionType: planId });
      setUser(cleanUser);
      localStorage.setItem('myfitdaily_user', JSON.stringify(cleanUser));
      return cleanUser;
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
        onOpenAuth={() => handleOpenAuth('login')}
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
          onOpenAuth={() => handleOpenAuth('login')}
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
                else handleOpenAuth('register');
              }}
              onExploreWardrobe={() => setCurrentTab('wardrobe')}
              onOpenAuth={(mode) => handleOpenAuth(mode || 'login')}
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
              chatSessions={chatSessions}
              selectedChatId={selectedChatId}
              onSelectChat={handleSelectChat}
              onDeleteChat={handleDeleteChat}
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

          {currentTab === 'admin' && (
            <AdminPortalPage
              user={user}
              onNavigate={setCurrentTab}
              onAddAffiliateProduct={(newItem) => {
                setClothes(prev => [newItem, ...prev]);
              }}
              onEquipInStudio={(item) => {
                setCurrentTab('wardrobe');
              }}
            />
          )}

          {currentTab === 'ai-training' && (
            <AiTrainingStudioPage
              user={user}
              clothes={clothes}
              onNavigate={setCurrentTab}
            />
          )}
        </main>

        {/* Footer (hidden on ai-stylist, admin portal and ai training pages) */}
        {currentTab !== 'ai-stylist' && currentTab !== 'admin' && currentTab !== 'ai-training' && (
          <footer style={{
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '36px 0 24px',
            marginTop: 'auto',
            flexShrink: 0,
            width: '100%',
            position: 'relative',
            zIndex: 10,
            transition: 'background 0.3s ease, border-color 0.3s ease'
          }}>
            <div className="container" style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px' }}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '28px',
                marginBottom: '28px',
                textAlign: 'left'
              }}>
                {/* Brand & Slogan */}
                <div style={{ maxWidth: '380px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                  }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      background: '#FFFFFF',
                      border: '1.2px solid rgba(212, 175, 55, 0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      padding: '2.5px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                      flexShrink: 0
                    }}>
                      <img 
                        src="/assets/logo.png" 
                        alt="MyFitDaily Logo" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                      />
                    </div>
                    <span>MyFit<span style={{ color: 'var(--primary)' }}>Daily</span></span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {text(
                      'Hệ sinh thái Tủ Đồ Số & Trợ Lý Stylist Cá Nhân Hóa công nghệ AI thông minh, mang phong cách thời trang chuẩn studio đến từng outfit mỗi ngày.',
                      'Smart Digital Wardrobe & AI Personal Stylist Platform empowering your daily fashion with studio lookbook precision.'
                    )}
                  </p>
                </div>

                {/* Quick Navigation Links */}
                <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                      {text('Tính năng', 'Features')}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <li><a href="#wardrobe" onClick={(e) => { e.preventDefault(); setCurrentTab('wardrobe'); }} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>{text('Tủ đồ số cá nhân', 'Digital Wardrobe')}</a></li>
                      <li><a href="#ai-stylist" onClick={(e) => { e.preventDefault(); setCurrentTab('ai-stylist'); }} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>{text('AI Stylist Studio', 'AI Stylist Studio')}</a></li>
                      <li><a href="#outfits" onClick={(e) => { e.preventDefault(); setCurrentTab('outfits'); }} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>{text('Phòng phối Lookbook', 'Outfit Atelier')}</a></li>
                      <li><a href="#premium" onClick={(e) => { e.preventDefault(); setCurrentTab('premium'); }} style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>{text('Gói Hội Viên VIP', 'VIP Membership')}</a></li>
                    </ul>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                      {text('Chính sách', 'Policies')}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <li><span style={{ cursor: 'pointer' }}>{text('Điều khoản dịch vụ', 'Terms of Service')}</span></li>
                      <li><span style={{ cursor: 'pointer' }}>{text('Chính sách bảo mật', 'Privacy Policy')}</span></li>
                      <li><span style={{ cursor: 'pointer' }}>{text('Bảo mật dữ liệu tủ đồ', 'Wardrobe Security')}</span></li>
                    </ul>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
                      {text('Hỗ trợ', 'Support')}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <li><span>support@myfitdaily.vn</span></li>
                      <li><span>Hotline: 1900 6868</span></li>
                      <li><span>{text('Hà Nội & TP. Hồ Chí Minh', 'Vietnam')}</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Copyright Divider */}
              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '16px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                <div>
                  {text(
                    `© ${new Date().getFullYear()} MyFitDaily Technology Platform. Tất cả các quyền được bảo lưu.`,
                    `© ${new Date().getFullYear()} MyFitDaily Technology Platform. All rights reserved.`
                  )}
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span>Tiếng Việt (VN)</span>
                  <span>Phiên bản v2.5 Official</span>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingVerification(null);
          setPendingOnboardingUser(null);
          setAuthModalMode('login');
        }}
        onAuthSuccess={handleAuthSuccess}
        pendingVerification={pendingVerification}
        pendingOnboardingUser={pendingOnboardingUser}
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
