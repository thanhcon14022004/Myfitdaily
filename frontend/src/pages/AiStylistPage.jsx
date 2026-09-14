import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bookmark, 
  User, 
  RotateCcw, 
  Sliders, 
  Flame, 
  CheckCircle, 
  ExternalLink, 
  Layers, 
  ChevronRight, 
  X, 
  Ruler, 
  ShoppingBag, 
  Info,
  RefreshCw,
  CloudSun,
  MapPin,
  ChevronDown,
  Check,
  Search
} from 'lucide-react';

import { apiRequest } from '../api/apiClient';
import VirtualMannequin from '../components/VirtualMannequin';
import { useLanguage } from '../context/LanguageContext';
import { getLiveWeather, ALL_LOCATIONS, setManualCity, clearManualCity } from '../services/weatherService';

export default function AiStylistPage({ 
  clothes = [], 
  onSaveAiOutfit, 
  onNavigate, 
  onOpenAddModal, 
  user = {},
  activeSession = null,
  onSaveSession = null,
  onNewChat = null,
  activeChatPrompt = null,
  resetChatSignal = 0
}) {
  const { text, isEnglish } = useLanguage();
  // Thông số cơ thể người dùng
  const hasBodyMetrics = user?.height > 0 && user?.weight > 0;

  // Live Mannequin Garment States (Trang phục người ảo đang mặc thử)
  const [activeOutfitSet, setActiveOutfitSet] = useState(null);
  const [activeTop, setActiveTop] = useState(null);
  const [activeBottom, setActiveBottom] = useState(null);
  const [activeOuter, setActiveOuter] = useState(null);
  const [activeShoes, setActiveShoes] = useState(null);

  // Chatbot State
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Live Weather State (Tự động nhận diện khu vực và thời tiết theo thời gian thực)
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const cityPickerRef = useRef(null);

  const fetchWeather = async (force = false) => {
    setWeatherLoading(true);
    try {
      const data = await getLiveWeather(force);
      setWeather(data);
    } catch (err) {
      console.error('Failed to load live weather:', err);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(false);
  }, []);

  // Đóng city picker khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityPickerRef.current && !cityPickerRef.current.contains(e.target)) {
        setShowCityPicker(false);
      }
    };
    if (showCityPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCityPicker]);

  // Khởi tạo tin nhắn chào mừng thời thượng của AI Stylist
  const getInitialAiMessage = () => {
    return {
      id: 1,
      sender: 'ai',
      text: isEnglish
        ? `Hello ${user?.fullName ? user.fullName.split(' ').slice(-1)[0] : 'there'}! I am your **AI Wardrobe & Outfit Stylist** at MYFITDAILY ✨.\n\n` +
          `👗 **Current Wardrobe:** Connected with **${clothes.length} garments** (Tops, Bottoms, Dresses, Outerwear, Shoes & Accessories) from your personal closet.\n` +
          (user?.height && user?.weight ? `📏 **Silhouette Guide:** Recorded body profile (${user.height}cm • ${user.weight}kg${user.bodyShape ? ` • ${user.bodyShape} shape` : ''}) to prioritize flattering cuts and proportions.\n\n` : '\n') +
          `Here is how I can style you today:\n` +
          `• ✦ **Complete Outfits by Occasion:** Work & smart casual, romantic date night, wedding guest, weekend cafe, traveling...\n` +
          `• ✦ **Mix & Match Any Garment:** Click on any shirt, jeans, or blazer from the wardrobe slider below for immediate outfit ideas!\n` +
          `• ✦ **Color Rules & Layering:** The 60-30-10 color principle, tone-sur-tone harmony, and chic blazer layering.\n\n` +
          `Type your request or pick a wardrobe item below to start!`
        : `Xin chào ${user?.fullName ? user.fullName.split(' ').slice(-1)[0] : 'bạn'}! Tôi là **AI Stylist Cá Nhân Chuyên Sâu Về Quần Áo & Phối Đồ** của bạn tại MYFITDAILY ✨.\n\n` +
          `👗 **Tủ đồ hiện tại:** Đã kết nối với **${clothes.length} món trang phục** (Áo, Quần, Đầm, Áo khoác, Giày & Phụ kiện) trong tủ đồ cá nhân của bạn.\n` +
          (user?.height && user?.weight ? `📏 **Tối ưu form dáng:** Đã ghi nhận thông số vóc dáng (${user.height}cm • ${user.weight}kg${user.bodyShape ? ` • dáng ${user.bodyShape}` : ''}) để ưu tiên chọn phom quần áo tôn chiều cao và che khuyết điểm.\n\n` : '\n') +
          `Tôi có thể hỗ trợ bạn ngay hôm nay:\n` +
          `• ✦ **Gợi ý trọn bộ outfit theo dịp:** Đi làm công sở, hẹn hò lãng mạn, dự đám cưới, cafe dạo phố cuối tuần...\n` +
          `• ✦ **Mix & Match món đồ bất kỳ:** Click chọn một chiếc áo, quần hoặc váy trong thanh tủ đồ bên dưới để tôi gợi ý cách phối ngay!\n` +
          `• ✦ **Nguyên tắc phối màu & chất liệu:** Quy tắc 60-30-10, phối tone-sur-tone, cách phối layer sành điệu.\n\n` +
          `Hãy nhập yêu cầu hoặc click chọn một món đồ trong tủ bên dưới để bắt đầu nhé!`,
      isFashionRelated: true,
      accompanyingOutfits: [],
      suggestedFollowUpQuestions: isEnglish ? [
        "What should I wear for today's weather?",
        "Style an outfit with a white button-up shirt",
        "How to mix wide-leg vintage jeans",
        "Elegant office outfit from my closet",
        "Romantic weekend date outfit"
      ] : [
        "Thời tiết hôm nay ở khu vực của tôi nên mặc gì?",
        "Trời đang mưa phối đồ thế nào để không bẩn gấu quần?",
        "Phối đồ với áo sơ mi trắng",
        "Cách mix quần jeans ống suông tôn dáng",
        "Gợi ý outfit công sở thanh lịch từ tủ đồ"
      ]
    };
  };

  const [chatMessages, setChatMessages] = useState(() => {
    if (activeSession && Array.isArray(activeSession.messages) && activeSession.messages.length > 0) {
      return activeSession.messages;
    }
    return [getInitialAiMessage()];
  });
  const chatListRef = useRef(null);

  // Đồng bộ tin nhắn khi chọn phiên chat khác từ Sidebar
  useEffect(() => {
    if (activeSession && Array.isArray(activeSession.messages) && activeSession.messages.length > 0) {
      setChatMessages(activeSession.messages);
    } else if (!activeSession) {
      setChatMessages([getInitialAiMessage()]);
    }
  }, [activeSession?.id, isEnglish]);

  // Auto scroll xuống tin nhắn mới nhất
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [chatMessages, chatLoading]);

  // Khi có bộ outfit được chọn để mặc thử lên người ảo
  const handleWearOutfitOnMannequin = (outfitSet) => {
    setActiveOutfitSet(outfitSet);
    if (!outfitSet || !outfitSet.items) return;

    const top = outfitSet.items.find(i => i.categoryName?.toLowerCase() === 'tops') || null;
    const bottom = outfitSet.items.find(i => i.categoryName?.toLowerCase() === 'bottoms' || i.categoryName?.toLowerCase() === 'dresses') || null;
    const outer = outfitSet.items.find(i => i.categoryName?.toLowerCase() === 'outerwear') || null;
    const shoe = outfitSet.items.find(i => i.categoryName?.toLowerCase() === 'shoes') || null;

    setActiveTop(top);
    setActiveBottom(bottom);
    setActiveOuter(outer);
    setActiveShoes(shoe);
  };

  // Mặc định tự khoác set đồ đầu tiên lên người ảo nếu có đồ trong tủ
  useEffect(() => {
    if (!activeOutfitSet && clothes.length > 0) {
      const defaultTop = clothes.find(c => c.categoryId === 1) || null;
      const defaultBottom = clothes.find(c => c.categoryId === 2 || c.categoryId === 3) || null;
      const defaultOuter = clothes.find(c => c.categoryId === 4) || null;
      const defaultShoes = clothes.find(c => c.categoryId === 5) || null;

      setActiveTop(defaultTop);
      setActiveBottom(defaultBottom);
      setActiveOuter(defaultOuter);
      setActiveShoes(defaultShoes);
      setActiveOutfitSet({
        id: 'initial',
        name: 'Trang Phục Cơ Bản Trong Tủ',
        style: 'Daily Casual',
        description: 'Set đồ mặc định phối từ tủ đồ của bạn sẵn sàng để thử nghiệm các gợi ý mới từ AI Stylist.',
        harmonyScore: '95%',
        items: [defaultTop, defaultBottom, defaultOuter, defaultShoes].filter(Boolean)
      });
    }
  }, [clothes]);

  // Gửi tin nhắn chat với AI
  const handleSendMessage = async (customPrompt) => {
    const messageToSend = (customPrompt || chatInput).trim();
    if (!messageToSend || chatLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: messageToSend,
      isFashionRelated: true,
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const history = chatMessages.slice(-6).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await apiRequest('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: messageToSend,
          history: history,
          wardrobeItemIds: clothes?.map(c => c.id) || [],
          userLocation: weather?.city || '',
          temperature: weather?.temperature != null ? weather.temperature : null,
          weatherCondition: weather?.conditionText || ''
        })
      });

      if (res.ok && res.data?.data) {
        const data = res.data.data;
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'ai',
          text: data.reply,
          isFashionRelated: data.isFashionRelated,
          accompanyingOutfits: data.accompanyingOutfits || [],
          suggestedItems: data.suggestedItems || [],
          suggestedFollowUpQuestions: data.suggestedFollowUpQuestions || []
        };

        const updatedHistory = [...chatMessages, userMsg, aiMessage];
        setChatMessages(updatedHistory);
        if (onSaveSession) {
          onSaveSession(activeSession?.id, updatedHistory, messageToSend);
        }

        // Nếu câu trả lời có bộ outfit gợi ý, tự động khoác set 1 lên Người Ảo ngay lập tức!
        if (data.accompanyingOutfits && data.accompanyingOutfits.length > 0) {
          handleWearOutfitOnMannequin(data.accompanyingOutfits[0]);
        }
      } else {
        // Fallback tự nhiên nếu offline hoặc server bận
        const fallbackSet = {
          id: Date.now(),
          name: 'Gợi Ý Phối Đồ Tôn Dáng',
          style: 'Smart Casual / Quiet Luxury',
          description: 'Sự kết hợp tinh tế giữa áo phom chuẩn và quần ống suông, tôn chiều cao và che khuyết điểm hoàn hảo.',
          harmonyScore: '97%',
          items: clothes.slice(0, 3)
        };

        const isWeatherQuery = /thời tiết|thoi tiet|mưa|mua|nắng|nang|nhiệt độ|nhiet do|lạnh|lanh|nóng|nong|weather|rain|sun|hot|cold/i.test(messageToSend);
        let fallbackText = `Dựa trên câu hỏi "${messageToSend}", thông số vóc dáng và xu hướng sàn TMĐT hiện nay, tôi đã tuyển chọn set đồ tối ưu nhất từ tủ đồ của bạn!\n\n` +
              `✨ **Bản phối:** Áo phom gọn gàng sơ vin cùng quần cạp cao giúp "hack" thêm 5cm chiều dài đôi chân, kết hợp cùng giày thanh lịch. Mô hình người ảo bên phải đã lập tức mặc thử set đồ này để bạn ngắm nhìn trực quan!`;

        if (isWeatherQuery && weather) {
          fallbackText = `📍 **Thời tiết thực tế tại ${weather.city}:** Hiện tại khoảng **${weather.temperature}°C**, ${weather.conditionText.toLowerCase()}.\n\n` +
            (weather.temperature >= 28 
              ? `☀️ **Tư vấn phong cách trời nóng:** Với nền nhiệt ${weather.temperature}°C, bạn nên ưu tiên chất liệu cotton thoáng khí, sơ mi đũi mát mẻ hoặc áo thun phom rộng kết hợp quần ống suông nhẹ để giải nhiệt tối đa!`
              : weather.temperature <= 22
              ? `🧥 **Tư vấn phong cách trời se lạnh:** Với ${weather.temperature}°C, hãy chọn phối layer cùng áo khoác cardigan dệt kim hoặc blazer thanh lịch để vừa ấm áp vừa sang trọng!`
              : `🌤️ **Tư vấn phong cách lý tưởng:** Thời tiết ${weather.temperature}°C rất đẹp, cực kỳ thích hợp cho các set đồ Smart Casual năng động từ tủ đồ của bạn!`);
        }

        const fallbackMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: fallbackText,
          isFashionRelated: true,
          accompanyingOutfits: [fallbackSet],
          suggestedFollowUpQuestions: [
            "Thời tiết này mang giày gì phù hợp nhất?",
            "Gợi ý phụ kiện phối kèm cho set đồ này",
            "Mẹo diện đồ che bắp tay to hoặc bụng dưới"
          ]
        };

        const updatedHistory = [...chatMessages, userMsg, fallbackMsg];
        setChatMessages(updatedHistory);
        if (onSaveSession) {
          onSaveSession(activeSession?.id, updatedHistory, messageToSend);
        }

        handleWearOutfitOnMannequin(fallbackSet);
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setChatLoading(false);
    }
  };

  // Reset cuộc trò chuyện khi bấm nút "Đoạn chat mới" từ Sidebar
  useEffect(() => {
    if (resetChatSignal > 0) {
      setChatMessages([getInitialAiMessage()]);
    }
  }, [resetChatSignal]);

  // Tự động gửi prompt khi người dùng chọn đoạn chat từ Sidebar
  useEffect(() => {
    if (activeChatPrompt) {
      handleSendMessage(activeChatPrompt);
    }
  }, [activeChatPrompt]);

  const handleSaveToLookbook = (outfit) => {
    if (!outfit) return;
    onSaveAiOutfit({
      id: Date.now(),
      name: outfit.name,
      occasion: 'Casual',
      season: 'AllSeason',
      items: outfit.items || [],
      itemIds: (outfit.items || []).map(i => i.id),
      stylistNotes: outfit.description,
      harmonyScore: outfit.harmonyScore || '98%',
      createdByAi: true,
      isFavorite: true,
    });
    alert(`💖 Đã lưu bộ outfit "${outfit.name}" vào Lookbook của bạn!`);
  };

  return (
    <div className="container" style={{ padding: '24px 20px 80px', maxWidth: '1440px' }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-rose" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={13} />
              <span>{text('Chuyên Gia Phối Đồ & Quần Áo AI', 'AI Fashion & Wardrobe Stylist')}</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: '#F3D98A', fontWeight: 600 }}>
              {text('✦ Phối đồ từ tủ cá nhân & Bắt trọn xu hướng TMĐT', '✦ Style from personal closet & trending fashion')}
            </span>
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFF' }}>
            {text('AI Stylist Studio & Tủ Đồ Quần Áo', 'AI Stylist Studio & Wardrobe')}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate && onNavigate('profile')}
            className="btn-secondary"
            title={text('Đến trang Hồ Sơ Cá Nhân để xem và cập nhật vóc dáng', 'Open Profile to view and update body metrics')}
            style={{ padding: '9px 18px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Ruler size={15} color="#D4AF37" />
            <span>{text('Hồ Sơ Vóc Dáng', 'Body Profile')} ({user?.height || 165}cm • {user?.weight || 52}kg)</span>
          </button>

          <button
            onClick={() => onNavigate('wardrobe')}
            className="btn-secondary"
            style={{ padding: '9px 18px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ShoppingBag size={15} />
            <span>{text('Tủ Đồ', 'Wardrobe')} ({clothes.length} {text('món', 'items')})</span>
          </button>
        </div>
      </div>

      {/* Main Studio 2-Column Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.45fr) minmax(360px, 1fr)',
        gap: '24px',
        alignItems: 'start',
      }}>
        {/* COLUMN 1: FULL CHAT STREAM */}
        <div 
          className="glass-card" 
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 180px)',
            minHeight: '620px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            position: 'relative',
          }}
        >
          {/* Chat Stream Header */}
          <div style={{
            padding: '12px 18px',
            background: 'var(--card-bg)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), #D4AF37)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(225, 29, 72, 0.4)',
                color: '#FFF',
                flexShrink: 0
              }}>
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {activeSession?.title ? activeSession.title : 'MYFITDAILY Stylist AI'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                  <span>{text('Đang trực tuyến • Sẵn sàng tư vấn', 'Online • Ready to style')}</span>
                </div>
              </div>
            </div>

            {/* Live Weather Widget & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {weather ? (
                <div ref={cityPickerRef} style={{ position: 'relative' }}>
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '5px 12px',
                      background: 'var(--hover-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                  >
                    <span style={{ fontSize: '1rem', lineHeight: 1 }}>{weather.conditionIcon}</span>
                    
                    {/* Clickable City Name with Chevron */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCityPicker(prev => !prev);
                      }}
                      title={text('Nhấn để đổi thành phố / khu vực', 'Click to change city / region')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        padding: '0 2px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '0.78rem'
                      }}
                    >
                      <span>📍 {weather.city}</span>
                      <ChevronDown size={11} style={{ opacity: 0.7 }} />
                    </button>

                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                    
                    {/* Temperature & Condition Button (Click to ask AI) */}
                    <button
                      onClick={() => {
                        handleSendMessage(
                          isEnglish 
                            ? `The weather in ${weather.city} is currently ${weather.temperature}°C (${weather.conditionTextEn}). Suggest an outfit that is stylish and weather-appropriate!`
                            : `Thời tiết hiện tại ở ${weather.city} là ${weather.temperature}°C (${weather.conditionText}). Hãy tư vấn cho tôi một bộ outfit vừa thời thượng vừa phù hợp với thời tiết này!`
                        );
                      }}
                      title={text('Click để AI gợi ý trang phục theo thời tiết này', 'Click to ask AI for outfit tailored to this weather')}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.78rem'
                      }}
                    >
                      <span style={{ fontWeight: 800, color: '#D4AF37' }}>
                        {weather.temperature}°C
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {isEnglish ? weather.conditionTextEn : weather.conditionText}
                      </span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchWeather(true);
                      }}
                      title={text('Cập nhật lại thời tiết', 'Refresh weather')}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '2px 4px',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '4px',
                        marginLeft: '2px'
                      }}
                    >
                      <RefreshCw size={12} className={weatherLoading ? "spin-animation" : ""} />
                    </button>
                  </div>

                  {/* Dropdown Menu chọn thành phố / quận huyện */}
                  {showCityPicker && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        left: 0,
                        zIndex: 999,
                        background: 'var(--bg-modal)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        padding: '10px',
                        width: '280px',
                        boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(16px)'
                      }}
                    >
                      {/* Auto-detect button */}
                      <button
                        onClick={() => {
                          clearManualCity();
                          setShowCityPicker(false);
                          setLocationSearch('');
                          fetchWeather(true);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'rgba(225, 29, 72, 0.1)',
                          border: '1px solid rgba(225, 29, 72, 0.25)',
                          color: 'var(--primary)',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          marginBottom: '8px'
                        }}
                      >
                        <MapPin size={13} />
                        <span>{text('🎯 Tự động định vị GPS (Theo Quận/Huyện)', '🎯 Auto-detect GPS (District Level)')}</span>
                      </button>

                      {/* District / City Search Input */}
                      <div style={{ position: 'relative', marginBottom: '8px' }}>
                        <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="text"
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                          placeholder={text("Gõ tên quận, huyện (Cầu Giấy, Đông Anh...)", "Search district (Cau Giay, Dong Anh...)")}
                          style={{
                            width: '100%',
                            padding: '6px 10px 6px 28px',
                            background: 'var(--hover-bg)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            color: 'var(--text-primary)',
                            outline: 'none'
                          }}
                        />
                      </div>

                      {/* Quick District Chips */}
                      {!locationSearch && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                          {['Thạch Thất', 'Cầu Giấy', 'Hà Đông', 'Đông Anh', 'Đống Đa', 'Quận 1'].map(dName => {
                            const isCurrent = weather.city.includes(dName);
                            return (
                              <button
                                key={dName}
                                onClick={() => {
                                  const found = ALL_LOCATIONS.find(l => l.shortName === dName || l.name.includes(dName));
                                  if (found) {
                                    setManualCity(found.name);
                                    setShowCityPicker(false);
                                    fetchWeather(true);
                                  }
                                }}
                                style={{
                                  padding: '3px 8px',
                                  fontSize: '0.68rem',
                                  borderRadius: '12px',
                                  background: isCurrent ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
                                  color: isCurrent ? '#FFF' : 'var(--text-secondary)',
                                  border: isCurrent ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                                  cursor: 'pointer',
                                  fontWeight: isCurrent ? 700 : 500
                                }}
                              >
                                {dName}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', padding: '2px 6px 6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {locationSearch ? text('Kết quả tìm kiếm:', 'Search Results:') : text('Chọn Quận / Huyện / Tỉnh thành:', 'Select District / Province:')}
                      </div>

                      <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {ALL_LOCATIONS
                          .filter(l => {
                            if (!locationSearch.trim()) return true;
                            const q = locationSearch.toLowerCase();
                            return l.name.toLowerCase().includes(q) || l.shortName.toLowerCase().includes(q) || l.group.toLowerCase().includes(q);
                          })
                          .map((c) => {
                            const isSelected = weather.city === c.name || weather.city.includes(c.shortName);
                            return (
                              <button
                                key={c.name}
                                onClick={() => {
                                  setManualCity(c.name);
                                  setShowCityPicker(false);
                                  setLocationSearch('');
                                  fetchWeather(true);
                                }}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '6px 10px',
                                  border: 'none',
                                  background: isSelected ? 'var(--hover-bg)' : 'transparent',
                                  color: isSelected ? '#D4AF37' : 'var(--text-primary)',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.78rem',
                                  fontWeight: isSelected ? 700 : 500,
                                  textAlign: 'left'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span>{c.name}</span>
                                  <span style={{ fontSize: '0.62rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                                    {c.group}
                                  </span>
                                </div>
                                {isSelected && <Check size={13} color="#D4AF37" />}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              ) : weatherLoading ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  background: 'var(--hover-bg)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}>
                  <RefreshCw size={12} className="spin-animation" />
                  <span>{text('Đang xác định thời tiết...', 'Detecting weather...')}</span>
                </div>
              ) : null}

              <button
                onClick={() => {
                  if (onNewChat) onNewChat();
                  else setChatMessages([getInitialAiMessage()]);
                }}
                title={text('Bắt đầu đoạn chat mới', 'New chat')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem'
                }}
              >
                <RotateCcw size={14} />
                <span>{text('Đoạn chat mới', 'New chat')}</span>
              </button>
            </div>
          </div>

          {/* Chat Messages List */}
          <div 
            ref={chatListRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              background: 'radial-gradient(ellipse at top left, rgba(225, 29, 72, 0.05), transparent 70%)'
            }}
          >
            {chatMessages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div 
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: isAi ? 'row' : 'row-reverse',
                    gap: '12px',
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: isAi ? 'linear-gradient(135deg, #E11D48, #D4AF37)' : 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#FFF',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}>
                    {isAi ? <Sparkles size={16} /> : (user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={16} />)}
                  </div>

                  {/* Message Bubble */}
                  <div style={{
                    maxWidth: '82%',
                    background: isAi ? 'rgba(15, 23, 42, 0.85)' : 'linear-gradient(135deg, var(--primary), #9F1239)',
                    border: isAi ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(225, 29, 72, 0.4)',
                    padding: '14px 18px',
                    borderRadius: isAi ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                    color: '#FFF',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    boxShadow: isAi ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 16px rgba(225, 29, 72, 0.25)',
                  }}>
                    {/* Message text with basic markdown support */}
                    <div style={{ whiteSpace: 'pre-line' }}>
                      {msg.text.split('\n').map((line, lIdx) => {
                        // Highlight bold text
                        const parts = line.split(/(\*\*.*?\*\*)/g);
                        return (
                          <div key={lIdx} style={{ marginBottom: line ? '4px' : '8px' }}>
                            {parts.map((p, pIdx) => {
                              if (p.startsWith('**') && p.endsWith('**')) {
                                return <strong key={pIdx} style={{ color: isAi ? '#F3D98A' : '#FFF' }}>{p.slice(2, -2)}</strong>;
                              }
                              return p;
                            })}
                          </div>
                        );
                      })}
                    </div>

                    {/* Accompanying Outfits Embedded in AI Reply */}
                    {isAi && msg.accompanyingOutfits && msg.accompanyingOutfits.length > 0 && (
                      <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '14px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F3D98A', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Sparkles size={14} color="#D4AF37" />
                          <span>✦ Gợi Ý Phối Đồ Cho Dịp Này Từ Tủ Đồ:</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {msg.accompanyingOutfits.map((set, sIdx) => {
                            const isCurrentlyWearing = activeOutfitSet?.name === set.name;
                            return (
                              <div
                                key={sIdx}
                                style={{
                                  background: isCurrentlyWearing ? 'rgba(212, 175, 55, 0.12)' : 'rgba(7, 10, 17, 0.7)',
                                  border: isCurrentlyWearing ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                                  borderRadius: 'var(--radius-sm)',
                                  padding: '12px',
                                  transition: 'var(--transition)',
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFF' }}>{set.name}</span>
                                  <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>{set.style}</span>
                                </div>
                                
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.45 }}>
                                  {set.description}
                                </p>

                                {/* Garment Items Mini Grid */}
                                <div style={{
                                  display: 'grid',
                                  gridTemplateColumns: `repeat(${set.items.length}, minmax(0, 1fr))`,
                                  gap: '8px',
                                  marginBottom: '10px',
                                }}>
                                  {set.items.map((it, itI) => (
                                    <div key={itI} style={{ textAlign: 'center' }}>
                                      <img
                                        src={it.imageUrl}
                                        alt={it.name}
                                        style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}
                                      />
                                      <div style={{ fontSize: '0.66rem', color: '#FFF', fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {it.name}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button
                                    onClick={() => handleWearOutfitOnMannequin(set)}
                                    style={{
                                      flex: 1,
                                      padding: '7px 12px',
                                      fontSize: '0.76rem',
                                      fontWeight: 700,
                                      borderRadius: 'var(--radius-full)',
                                      background: isCurrentlyWearing ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
                                      color: '#FFF',
                                      border: '1px solid rgba(255, 255, 255, 0.15)',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '5px'
                                    }}
                                  >
                                    <span>💃 {isCurrentlyWearing ? 'Đang Mặc Trên Người Ảo' : 'Mặc Thử Lên Người Ảo'}</span>
                                  </button>

                                  <button
                                    onClick={() => handleSaveToLookbook(set)}
                                    className="btn-secondary"
                                    style={{
                                      padding: '7px 12px',
                                      fontSize: '0.76rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '5px'
                                    }}
                                  >
                                    <Bookmark size={13} />
                                    <span>Lưu</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Follow-up Question Chips */}
                    {isAi && msg.suggestedFollowUpQuestions && msg.suggestedFollowUpQuestions.length > 0 && (
                      <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {msg.suggestedFollowUpQuestions.map((q, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => handleSendMessage(q)}
                            style={{
                              background: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              color: '#F3D98A',
                              padding: '5px 12px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              transition: 'var(--transition)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.18)';
                              e.currentTarget.style.borderColor = 'var(--primary)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                            }}
                          >
                            <span>✦ {q}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {chatLoading && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #E11D48, #D4AF37)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                }}>
                  <Sparkles size={16} />
                </div>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  padding: '10px 16px',
                  borderRadius: '18px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.86rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span className="spinner" style={{ width: '14px', height: '14px' }} />
                  <span>{text('AI đang phân tích tỉ lệ vóc dáng, tủ đồ và xu hướng TMĐT...', 'AI is analyzing your wardrobe items and styling formulas...')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Wardrobe Quick-Select Carousel: Chọn đồ trong tủ để AI phối */}
          <div style={{
            padding: '10px 16px',
            background: 'rgba(10, 15, 28, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: '#F3D98A', fontWeight: 700 }}>
                <ShoppingBag size={13} color="#D4AF37" />
                <span>{text('Chọn món đồ trong tủ để AI phối đồ:', 'Select an item from your wardrobe to style:')}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {clothes.length > 0 ? `${clothes.length} ${text('món đồ', 'items')}` : text('Gợi ý đồ mẫu', 'Sample items')}
              </span>
            </div>

            <div style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'thin'
            }}>
              {(clothes.length > 0 ? clothes : [
                { id: 1, name: 'Áo Sơ Mi Lụa Trắng', categoryName: 'Tops', color: 'Trắng', imageUrl: '/assets/clothes/shirt_white.svg' },
                { id: 2, name: 'Áo Thun Cotton Đen', categoryName: 'Tops', color: 'Đen', imageUrl: '/assets/clothes/tshirt_black.svg' },
                { id: 4, name: 'Quần Jeans Ống Suông Vintage', categoryName: 'Bottoms', color: 'Xanh Denim', imageUrl: '/assets/clothes/jeans_blue.svg' },
                { id: 5, name: 'Quần Tây Xếp Ly Đen', categoryName: 'Bottoms', color: 'Đen', imageUrl: '/assets/clothes/pants_black.svg' },
                { id: 7, name: 'Đầm Lụa Midi Slip Dress', categoryName: 'Dresses', color: 'Hồng Nhạt', imageUrl: '/assets/clothes/dress_silk.svg' },
                { id: 8, name: 'Áo Blazer Dạ Nâu Cacao', categoryName: 'Outerwear', color: 'Nâu', imageUrl: '/assets/clothes/blazer_brown.svg' },
                { id: 10, name: 'Sneaker Trắng Retro Classic', categoryName: 'Shoes', color: 'Trắng', imageUrl: '/assets/clothes/shoes_sneaker.svg' },
                { id: 11, name: 'Giày Loafer Da Bóng', categoryName: 'Shoes', color: 'Đen', imageUrl: '/assets/clothes/shoes_loafer.svg' }
              ]).map((cItem, cIdx) => (
                <button
                  key={cIdx}
                  onClick={() => handleSendMessage(
                    isEnglish
                      ? `Give me the best styling tips and outfit combinations with "${cItem.name}" (${cItem.categoryName}, ${cItem.color || 'neutral'}) from my wardrobe`
                      : `Gợi ý các cách phối đồ đẹp, tôn dáng nhất với "${cItem.name}" (màu ${cItem.color || 'trung tính'}, ${cItem.categoryName || 'trang phục'}) từ tủ đồ của tôi`
                  )}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFF',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  title={`Click để yêu cầu AI phối đồ với ${cItem.name}`}
                >
                  <img
                    src={cItem.imageUrl}
                    alt={cItem.name}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '4px',
                      objectFit: 'cover',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#FFF' }}>{cItem.name}</span>
                    <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>{cItem.categoryName} • {cItem.color}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Prompt Bar */}
          <div style={{
            padding: '8px 16px',
            background: 'rgba(7, 10, 17, 0.9)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}>
            {(isEnglish ? [
              "Style with white button-up shirt",
              "How to mix wide-leg jeans",
              "Chic office outfit from wardrobe",
              "Layering tips with wool blazer",
              "Color harmony rules for outfits",
              "Weekend street style idea",
              "Garment tips to look taller"
            ] : [
              "Phối đồ với áo sơ mi trắng",
              "Cách mix quần jeans ống suông",
              "Set đồ công sở thanh lịch từ tủ",
              "Phối layer áo blazer dạ",
              "Quy tắc phối màu quần áo chuẩn gu",
              "Gợi ý outfit dạo phố cuối tuần",
              "Mẹo chọn form quần áo hack chân dài"
            ]).map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-secondary)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                ✦ {p}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{
              padding: '14px 18px',
              background: 'rgba(10, 15, 28, 0.95)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <input 
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={text(
                "Nhập câu hỏi tự nhiên (ví dụ: 'Tôi đi đám cưới bạn tối nay thì mặc gì đẹp?')...",
                "Ask naturally (e.g. 'What should I wear to an evening wedding party?')..."
              )}
              style={{
                flex: 1,
                height: '46px',
                borderRadius: 'var(--radius-full)',
                padding: '0 20px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFF',
                fontSize: '0.9rem',
              }}
            />

            <button
              type="submit"
              disabled={!chatInput.trim() || chatLoading}
              id="btn-send-ai-chat"
              className="btn-primary"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                opacity: !chatInput.trim() || chatLoading ? 0.5 : 1,
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* COLUMN 2: LIVE VIRTUAL MANNEQUIN FITTING PANEL */}
        <div 
          className="glass-card"
          style={{
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.1)',
            position: 'sticky',
            top: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Mannequin Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <span className="badge badge-gold" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                  💃 {text('MÔ HÌNH NGƯỜI ẢO 2.5D', '2.5D VIRTUAL MODEL')}
                </span>
                <span style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 600 }}>
                  ● Live Fitting
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
                {text('Thử Đồ Theo Vóc Dáng Của Bạn', 'Virtual Try-On Fitting')}
              </h3>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('profile')}
              title={text("Cập nhật thông tin trong Hồ Sơ Cá Nhân", "Update information in Personal Profile")}
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#F3D98A',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <User size={13} color="#D4AF37" />
              <span>{text('Chỉnh sửa hồ sơ →', 'Edit Profile →')}</span>
            </button>
          </div>

          {/* Vóc dáng metric chips lấy trực tiếp từ Profile người dùng */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '16px',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '0.74rem',
            color: 'var(--text-secondary)'
          }}>
            <span>👤 Cao: <strong style={{ color: '#FFF' }}>{user?.height || 165}cm</strong></span>
            <span>• Nặng: <strong style={{ color: '#FFF' }}>{user?.weight || 52}kg</strong></span>
            <span>• 3 vòng: <strong style={{ color: '#F3D98A' }}>{user?.chest || 86}-{user?.waist || 64}-{user?.hips || 92}cm</strong></span>
            <span>• Dáng: <strong style={{ color: '#FDA4AF' }}>{user?.bodyShape || 'Đồng hồ cát'}</strong> (Hồ sơ)</span>
          </div>

          {/* The Live Virtual Mannequin */}
          <div style={{
            background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.9), rgba(5, 7, 13, 0.98))',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '12px',
            marginBottom: '16px',
            boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8)'
          }}>
            <VirtualMannequin
              user={user}
              topItem={activeTop}
              bottomItem={activeBottom}
              outerwearItem={activeOuter}
              shoesItem={activeShoes}
            />
          </div>

          {/* Active Outfit Info & Actions */}
          {activeOutfitSet && (
            <div style={{
              background: 'rgba(7, 10, 17, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFF' }}>
                    {activeOutfitSet.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Phong cách: <span style={{ color: '#F3D98A' }}>{activeOutfitSet.style}</span> • Điểm hài hòa: <span style={{ color: '#10B981' }}>{activeOutfitSet.harmonyScore || '98%'}</span>
                  </div>
                </div>
              </div>

              {/* Items reel */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {[activeTop, activeBottom, activeOuter, activeShoes].filter(Boolean).map((item, iIdx) => (
                  <div 
                    key={iIdx}
                    style={{
                      width: '64px',
                      flexShrink: 0,
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '4px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    <img 
                      src={item.imageUrl} 
                      alt="" 
                      style={{ width: '100%', height: '64px', objectFit: 'cover', borderRadius: '4px', marginBottom: '2px' }} 
                    />
                    <div style={{ fontSize: '0.62rem', color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Save & Transfer to Studio Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleSaveToLookbook(activeOutfitSet)}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: '8px 14px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Bookmark size={14} />
                  <span>Lưu Vào Outfits</span>
                </button>

                <button
                  onClick={() => onNavigate('outfits')}
                  className="btn-secondary"
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ExternalLink size={14} />
                  <span>Mở Studio</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
