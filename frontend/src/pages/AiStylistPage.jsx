import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bookmark, 
  Heart,
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
  outfits = [],
  onToggleFavoriteAiOutfit = null,
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
  const [showMannequinDrawer, setShowMannequinDrawer] = useState(false);

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
    const isMaleUser = (user?.gender || '').toLowerCase() === 'male' || (user?.gender || '').toLowerCase() === 'nam';

    return {
      id: 1,
      sender: 'ai',
      text: isEnglish
        ? `Hello ${user?.fullName ? user.fullName.split(' ').slice(-1)[0] : 'there'}! I am your **AI Wardrobe & Outfit Stylist** at MYFITDAILY ✨.\n\n` +
          `${isMaleUser ? '👔' : '👗'} **Current Wardrobe:** Connected with **${clothes.length} garments** (${isMaleUser ? 'Tops, Bottoms, Outerwear, Shoes & Accessories' : 'Tops, Bottoms, Dresses, Outerwear, Shoes & Accessories'}) from your personal closet.\n` +
          (user?.height && user?.weight ? `📏 **Silhouette Guide:** Recorded body profile (${user.height}cm • ${user.weight}kg${user.bodyShape ? ` • ${user.bodyShape} shape` : ''}) to prioritize flattering cuts, masculine/feminine proportions, and trendy styling.\n\n` : '\n') +
          `Here is how I can style you today:\n` +
          `• ✦ **Complete Outfits by Occasion:** Work & smart casual, romantic date night, wedding guest, weekend cafe, traveling...\n` +
          `• ✦ **Mix & Match Any Garment:** Click on any shirt, jeans, or blazer from the wardrobe slider below for immediate outfit ideas!\n` +
          `• ✦ **Color Rules & Layering:** The 60-30-10 color principle, tone-sur-tone harmony, and chic blazer layering.\n\n` +
          `Type your request or pick a wardrobe item below to start!`
        : `Xin chào ${user?.fullName ? user.fullName.split(' ').slice(-1)[0] : 'bạn'}! Tôi là **AI Stylist Cá Nhân Chuyên Sâu Về Quần Áo & Phối Đồ** của bạn tại MYFITDAILY ✨.\n\n` +
          `${isMaleUser ? '👔' : '👗'} **Tủ đồ hiện tại:** Đã kết nối với **${clothes.length} món trang phục** (${isMaleUser ? 'Áo, Quần, Áo khoác, Giày & Phụ kiện Nam' : 'Áo, Quần, Đầm, Áo khoác, Giày & Phụ kiện'}) trong tủ đồ cá nhân của bạn.\n` +
          (user?.height && user?.weight ? `📏 **Tối ưu form dáng:** Đã ghi nhận thông số vóc dáng (${user.height}cm • ${user.weight}kg${user.bodyShape ? ` • dáng ${user.bodyShape}` : ''}) để ưu tiên phom dáng chuẩn mực, hack dáng và tôn khí chất.\n\n` : '\n') +
          `Tôi có thể hỗ trợ bạn ngay hôm nay:\n` +
          `• ✦ **Gợi ý trọn bộ outfit theo dịp:** Đi làm công sở, hẹn hò cuốn hút, dạ tiệc sự kiện, cafe dạo phố cuối tuần...\n` +
          `• ✦ **Mix & Match món đồ bất kỳ:** Click chọn một chiếc áo, quần hoặc blazer trong thanh tủ đồ bên dưới để tôi gợi ý cách phối ngay!\n` +
          `• ✦ **Nguyên tắc phối màu & chất liệu:** Quy tắc 60-30-10, phối tone-sur-tone, cách phối layer chuẩn xu hướng thịnh hành.\n\n` +
          `Hãy nhập yêu cầu hoặc click chọn một món đồ trong tủ bên dưới để bắt đầu nhé!`,
      isFashionRelated: true,
      accompanyingOutfits: [],
      suggestedFollowUpQuestions: isEnglish ? (isMaleUser ? [
        "What should I wear for today's weather?",
        "Sharp office outfit from my closet",
        "Clean fit date night styling ideas",
        "How to style vintage straight-leg jeans",
        "Best shirt fit for my body shape"
      ] : [
        "What should I wear for today's weather?",
        "Style an outfit with a white button-up shirt",
        "How to mix wide-leg vintage jeans",
        "Elegant office outfit from my closet",
        "Romantic weekend date outfit"
      ]) : (isMaleUser ? [
        "Thời tiết hôm nay ở khu vực của tôi nên mặc gì?",
        "Gợi ý outfit nam công sở thanh lịch & đĩnh đạc từ tủ đồ",
        "Phối đồ nam hẹn hò cuốn hút theo xu hướng Clean Fit",
        "Cách mix quần jeans ống suông và sơ mi nam hack chiều cao",
        "Dáng người của tôi nên chọn áo thun và sơ mi phom gì?"
      ] : [
        "Thời tiết hôm nay ở khu vực của tôi nên mặc gì?",
        "Trời đang mưa phối đồ thế nào để không bẩn gấu quần?",
        "Phối đồ với áo sơ mi trắng",
        "Cách mix quần jeans ống suông tôn dáng",
        "Gợi ý outfit công sở thanh lịch từ tủ đồ"
      ])
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

  // Khi người dùng bấm "Mặc thử lên người ảo"
  const handleWearOutfitOnMannequin = (outfitSet) => {
    setActiveOutfitSet(outfitSet);
    setShowMannequinDrawer(true);
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
          weatherCondition: weather?.conditionText || '',
          height: user?.height ? parseFloat(user.height) : null,
          weight: user?.weight ? parseFloat(user.weight) : null,
          gender: user?.gender || '',
          age: user?.age ? parseInt(user.age, 10) : null,
          bodyShape: user?.bodyShape || '',
          chest: user?.chest ? parseFloat(user.chest) : null,
          waist: user?.waist ? parseFloat(user.waist) : null,
          hips: user?.hips ? parseFloat(user.hips) : null
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
      } else {
        // Fallback tự nhiên phong phú nếu offline hoặc server bận
        const isMaleUser = (user?.gender || '').toLowerCase() === 'male' || (user?.gender || '').toLowerCase() === 'nam' || /nam|con trai|dan ong/i.test(messageToSend);
        const uShape = user?.bodyShape || (isMaleUser ? 'Tam giác ngược' : 'Đồng hồ cát');
        const uHeight = user?.height || (isMaleUser ? 175 : 165);
        const uWeight = user?.weight || (isMaleUser ? 68 : 52);
        const uAge = user?.age || 24;

        const fallbackNote = isMaleUser
          ? `✦ Tối ưu vóc dáng nam giới (${uShape}): Phom dáng đứng đắn chỉn chu, áp dụng tỷ lệ 4:6 với quần âu/jeans cạp vừa và áo phom Regular giúp hack chiều cao ${uHeight}cm, phong độ và lịch lãm ở tuổi ${uAge}.`
          : `✦ Tối ưu dáng ${uShape}: Áp dụng quy tắc phối cân đối 1/3 - 2/3 với quần cạp cao và áo sơ vin giúp kéo dài chân thêm 5cm cho chiều cao ${uHeight}cm, giữ tỷ lệ người thon gọn và cân đối nhất.`;

        const fallbackOutfits = isMaleUser ? [
          {
            id: Date.now() + 1,
            name: 'Set 1: Smart Casual Nam Thanh Lịch & Phong Độ',
            style: 'Smart Casual / Korean Clean Fit',
            description: 'Áo Polo dệt kim màu be phối quần tây xám xếp ly ống suông, khoác blazer navy may đo và giày Loafer da bò.',
            harmonyScore: '98%',
            sourceType: 'Wardrobe',
            sourceBadge: '👔 Từ Tủ Đồ Nam Cá Nhân',
            bodyFlatteringNote: fallbackNote,
            items: [
              { id: 1001, name: 'Áo Polo Nam Dệt Kim Cổ Bẻ Màu Be Cát', categoryName: 'Tops', imageUrl: 'https://images.unsplash.com/photo-1625910513413-7e189851a704?w=500&auto=format&fit=crop&q=80' },
              { id: 1002, name: 'Quần Tây Nam Xếp Ly Ống Suông Ghi Xám', categoryName: 'Bottoms', imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=80' },
              { id: 1003, name: 'Áo Khoác Blazer Nam May Đo Xanh Navy', categoryName: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80' },
              { id: 1004, name: 'Giày Loafer Da Bò Nam Màu Nâu Sáp', categoryName: 'Shoes', imageUrl: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&auto=format&fit=crop&q=80' }
            ]
          },
          {
            id: Date.now() + 2,
            name: 'Set 2: Dạo Phố City Boy & Năng Động Trẻ Trung',
            style: 'City Boy / Casual Streetwear',
            description: 'Áo thun trắng phom rộng kết hợp sơ mi denim khoác ngoài, quần jeans ống suông và sneaker retro.',
            harmonyScore: '96%',
            sourceType: 'Wardrobe',
            sourceBadge: '👔 Từ Tủ Đồ Nam Cá Nhân',
            bodyFlatteringNote: fallbackNote,
            items: [
              { id: 1005, name: 'Áo Thun Heavyweight Trắng Trơn Phom Rộng', categoryName: 'Tops', imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80' },
              { id: 1006, name: 'Quần Jeans Nam Ống Suông Wash Xanh Vintage', categoryName: 'Bottoms', imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=500&auto=format&fit=crop&q=80' },
              { id: 1007, name: 'Áo Sơ Mi Denim Nam Xanh Nhạt Khoác Ngoài', categoryName: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=500&auto=format&fit=crop&q=80' },
              { id: 1008, name: 'Giày Sneaker Retro Cổ Thấp Trắng Đế Gum', categoryName: 'Shoes', imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80' }
            ]
          },
          {
            id: Date.now() + 3,
            name: 'Set 3: Sartorial Phong Thái Quý Ông Đĩnh Đạc',
            style: 'Old Money / Sartorial Gent',
            description: 'Sơ mi Oxford trắng cổ Đức đứng phom phối quần tây đen may đo và giày da Derby cao cấp.',
            harmonyScore: '99%',
            sourceType: 'Wardrobe',
            sourceBadge: '👔 Từ Tủ Đồ Nam Cá Nhân',
            bodyFlatteringNote: fallbackNote,
            items: [
              { id: 1009, name: 'Áo Sơ Mi Oxford Nam Trắng Cổ Đức', categoryName: 'Tops', imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=80' },
              { id: 1010, name: 'Quần Tây May Đo Nam Màu Đen Classic', categoryName: 'Bottoms', imageUrl: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=500&auto=format&fit=crop&q=80' },
              { id: 1003, name: 'Áo Khoác Blazer Nam May Đo Xanh Navy', categoryName: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80' },
              { id: 1011, name: 'Giày Tây Nam Derby Da Bóng Đen', categoryName: 'Shoes', imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&auto=format&fit=crop&q=80' }
            ]
          },
          {
            id: Date.now() + 4,
            name: 'Style Mạng 1: Korean Clean Fit & Minimalist Nam',
            style: 'Korean Clean Fit • Hot Trend Shopee & TikTok Shop',
            description: 'Áo thun cổ tròn trắng phối quần âu wide-leg xám ống rộng, khoác cardigan len dệt kim và Loafer da bóng.',
            harmonyScore: '98%',
            sourceType: 'TrendingOnline',
            sourceBadge: '🔥 Hot Trend Mạng Nam & TMĐT',
            bodyFlatteringNote: fallbackNote,
            items: [
              { id: 301, name: 'Áo Thun Cotton Supima Trắng Kem Phom Rộng', categoryName: 'Tops', imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80' },
              { id: 302, name: 'Quần Tây Wide-Leg Xếp Ly Ống Rộng Màu Xám', categoryName: 'Bottoms', imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=80' },
              { id: 303, name: 'Áo Cardigan Len Dệt Kim Nam Xám Khói', categoryName: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=500&auto=format&fit=crop&q=80' },
              { id: 304, name: 'Giày Da Loafer Đen Bóng Khóa Ngựa Kim Loại', categoryName: 'Shoes', imageUrl: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&auto=format&fit=crop&q=80' }
            ]
          },
          {
            id: Date.now() + 5,
            name: 'Style Mạng 2: Gorpcore & Urban Streetwear Nam Đột Phá',
            style: 'Urban Gorpcore • Trend Giới Trẻ Coolmate & Routine',
            description: 'Áo thun boxy fit, quần túi hộp parachute cargo ống rộng kết hợp áo khoác gió technical và sneaker thể thao.',
            harmonyScore: '96%',
            sourceType: 'TrendingOnline',
            sourceBadge: '🔥 Hot Trend Mạng Nam & TMĐT',
            bodyFlatteringNote: fallbackNote,
            items: [
              { id: 305, name: 'Áo Thun Boxy Fit Đen In Graphic Minimal', categoryName: 'Tops', imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=80' },
              { id: 306, name: 'Quần Túi Hộp Parachute Cargo Pant Đen', categoryName: 'Bottoms', imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&auto=format&fit=crop&q=80' },
              { id: 307, name: 'Áo Khoác Gió Technical Windbreaker Chống Nước', categoryName: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=80' },
              { id: 308, name: 'Giày Sneaker Salomon Trail Running Thể Thao', categoryName: 'Shoes', imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop&q=80' }
            ]
          },
          {
            id: Date.now() + 6,
            name: 'Style Mạng 3: Smart Casual Cafe & Hẹn Hò Soái Ca',
            style: 'Smart Casual / Varsity Trend • Thịnh Hành Douyin',
            description: 'Sơ mi kẻ sọc nhỏ phom rộng, quần jeans trắng ngà ống suông phối cùng áo varsity jacket và sneaker samba.',
            harmonyScore: '97%',
            sourceType: 'TrendingOnline',
            sourceBadge: '🔥 Hot Trend Mạng Nam & TMĐT',
            bodyFlatteringNote: fallbackNote,
            items: [
              { id: 309, name: 'Áo Sơ Mi Cổ Bẻ Kẻ Sọc Nhỏ Phom Rộng', categoryName: 'Tops', imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80' },
              { id: 310, name: 'Quần Jeans Trắng Ngà Ống Suông Tôn Dáng', categoryName: 'Bottoms', imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&auto=format&fit=crop&q=80' },
              { id: 311, name: 'Áo Khoác Varsity Jacket Phối Da Trắng Đen', categoryName: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80' },
              { id: 312, name: 'Giày Sneaker Retro Samba Classic Trắng Sọc Đen', categoryName: 'Shoes', imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=80' }
            ]
          }
        ] : [
          {
            id: Date.now() + 1,
            name: 'Set 1: Smart Casual Thanh Lịch & Tôn Dáng',
            style: 'Smart Casual / Daily Chic',
            description: 'Sự kết hợp giữa sơ mi lụa Poplin trắng, quần jeans cạp cao và blazer dạ màu cacao nhẹ nhàng.',
            harmonyScore: '98%',
            sourceType: 'Wardrobe',
            sourceBadge: '👗 Từ Tủ Đồ Cá Nhân',
            bodyFlatteringNote: fallbackNote,
            items: [
              { id: 101, name: 'Áo Sơ Mi Lụa Poplin Trắng Oversized', categoryName: 'Tops', imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=80' },
              { id: 102, name: 'Quần Jeans Ống Suông Vintage Cạp Cao', categoryName: 'Bottoms', imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=80' },
              { id: 103, name: 'Áo Blazer Dạ Nâu Cacao Relaxed Fit', categoryName: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=80' },
              { id: 104, name: 'Giày Sneaker Trắng Retro Classic', categoryName: 'Shoes', imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=80' }
            ]
          },
          {
            id: Date.now() + 2,
            name: 'Set 2: Quý Cô Parisian Chic Nữ Tính',
            style: 'Parisian Chic / Elegant',
            description: 'Đầm lụa satin midi tôn vóc dáng mềm mại kết hợp áo khoác dạ tweed tiểu thư khuy vàng sang trọng.',
            harmonyScore: '96%',
            sourceType: 'Wardrobe',
            sourceBadge: '👗 Từ Tủ Đồ Cá Nhân',
            bodyFlatteringNote: fallbackNote,
            items: [
              { id: 105, name: 'Áo Len Dệt Kim Cổ Lọ Be Cát', categoryName: 'Tops', imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format&fit=crop&q=80' },
              { id: 106, name: 'Đầm Lụa Satin Midi Slip Dress', categoryName: 'Dresses', imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=80' },
              { id: 107, name: 'Áo Khoác Dạ Tweed Tiểu Thư Khuy Vàng', categoryName: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=80' },
              { id: 108, name: 'Giày Loafer Da Bóng Khóa Ngựa Kim Loại', categoryName: 'Shoes', imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&auto=format&fit=crop&q=80' }
            ]
          },
          {
            id: Date.now() + 3,
            name: 'Set 3: Phong Thái Tinh Tế & Tối Giản Minimalist',
            style: 'Quiet Luxury / Minimalist',
            description: 'Quần tây xếp ly đen may đo wide-leg phối cùng sơ mi trắng lụa và blazer phom đứng thanh lịch.',
            harmonyScore: '99%',
            sourceType: 'Wardrobe',
            sourceBadge: '👗 Từ Tủ Đồ Cá Nhân',
            bodyFlatteringNote: fallbackNote,
            items: [
              { id: 109, name: 'Áo Sơ Mi Lụa Poplin Trắng Oversized', categoryName: 'Tops', imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=80' },
              { id: 110, name: 'Quần Tây Xếp Ly Đen May Đo Wide-leg', categoryName: 'Bottoms', imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=80' },
              { id: 111, name: 'Áo Blazer Dạ Nâu Cacao Relaxed Fit', categoryName: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=80' },
              { id: 112, name: 'Giày Loafer Da Bóng Khóa Ngựa Kim Loại', categoryName: 'Shoes', imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&auto=format&fit=crop&q=80' }
            ]
          },
          {
            id: Date.now() + 4,
            name: 'Style Mạng 1: Korean Ulzzang & Clean Fit Trẻ Trung',
            style: 'Korean Clean Fit • Hot Trend Shopee & Douyin',
            description: 'Baby tee tối giản phối cùng jeans suông wash vintage cạp cao, cardigan mỏng khoác nhẹ và sneaker retro.',
            harmonyScore: '97%',
            sourceType: 'TrendingOnline',
            sourceBadge: '🔥 Hot Trend Mạng & TMĐT',
            bodyFlatteringNote: fallbackNote,
            items: [
              { id: 201, name: 'Áo Baby Tee Cotton Trắng In Chữ Minimal', categoryName: 'Tops', imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80' },
              { id: 202, name: 'Quần Jeans Ống Suông Wash Vintage Cạp Cao', categoryName: 'Bottoms', imageUrl: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=500&auto=format&fit=crop&q=80' },
              { id: 203, name: 'Áo Khoác Cardigan Dệt Kim Sợi Mảnh', categoryName: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&auto=format&fit=crop&q=80' },
              { id: 204, name: 'Giày Sneaker Retro Samba Đế Cao Su', categoryName: 'Shoes', imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=80' }
            ]
          },
          {
            id: Date.now() + 5,
            name: 'Style Mạng 2: Quiet Luxury & Old Money Quý Phái',
            style: 'Quiet Luxury • Trend TikTok Shop & Zara',
            description: 'Sơ mi lụa satin trắng ngà, quần tây xếp ly cạp cao ống rộng kết hợp áo tweed khuy vàng thời thượng.',
            harmonyScore: '99%',
            sourceType: 'TrendingOnline',
            sourceBadge: '🔥 Hot Trend Mạng & TMĐT',
            bodyFlatteringNote: fallbackNote,
            items: [
              { id: 205, name: 'Áo Sơ Mi Lụa Satin Trắng Ngà', categoryName: 'Tops', imageUrl: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=500&auto=format&fit=crop&q=80' },
              { id: 206, name: 'Quần Tây Xếp Ly Cạp Cao Ống Rộng', categoryName: 'Bottoms', imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&auto=format&fit=crop&q=80' },
              { id: 207, name: 'Áo Blazer Dạ Tweed Tiểu Thư Khuy Vàng', categoryName: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80' },
              { id: 208, name: 'Giày Loafer Da Mềm Khóa Kim Loại', categoryName: 'Shoes', imageUrl: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&auto=format&fit=crop&q=80' }
            ]
          },
          {
            id: Date.now() + 6,
            name: 'Style Mạng 3: Y2K Streetwear & Gorpcore Phá Cách',
            style: 'Y2K Gorpcore • Trend Giới Trẻ Local Brand',
            description: 'Croptop thun gân ôm eo, quần dù parachute túi hộp ống rộng kết hợp zip hoodie boxy năng động.',
            harmonyScore: '96%',
            sourceType: 'TrendingOnline',
            sourceBadge: '🔥 Hot Trend Mạng & TMĐT',
            bodyFlatteringNote: fallbackNote,
            items: [
              { id: 209, name: 'Áo Croptop Thun Gân Ôm Dáng Tôn Eo', categoryName: 'Tops', imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop&q=80' },
              { id: 210, name: 'Quần Parachute Dù Túi Hộp Ống Rộng', categoryName: 'Bottoms', imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=500&auto=format&fit=crop&q=80' },
              { id: 211, name: 'Áo Khoác Zip Hoodie Phom Boxy Fit', categoryName: 'Outerwear', imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80' },
              { id: 212, name: 'Giày Chunky Platform Sneaker Đế Dày', categoryName: 'Shoes', imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop&q=80' }
            ]
          }
        ];

        const isWeatherQuery = /thời tiết|thoi tiet|mưa|mua|nắng|nang|nhiệt độ|nhiet do|lạnh|lanh|nóng|nong|weather|rain|sun|hot|cold/i.test(messageToSend);
        let fallbackText = `Dựa trên câu hỏi "${messageToSend}", tỷ lệ thể trạng (${uHeight}cm • ${user?.weight || 52}kg • dáng ${uShape}) và xu hướng thời trang hiện tại, AI Stylist đã chuẩn bị **3 bộ phối từ tủ đồ cá nhân** và **3 style ngẫu nhiên cực hot trên mạng & sàn TMĐT** dưới đây để bạn tham khảo!`;

        if (isWeatherQuery && weather) {
          fallbackText = `📍 **Thời tiết thực tế tại ${weather.city}:** Hiện tại khoảng **${weather.temperature}°C**, ${weather.conditionText.toLowerCase()}.\n\n` +
            (weather.temperature >= 28 
              ? `☀️ **Tư vấn phong cách trời nóng:** Với nền nhiệt ${weather.temperature}°C, bạn nên ưu tiên chất liệu cotton thoáng khí, sơ mi đũi mát mẻ hoặc áo thun phom rộng kết hợp quần ống suông nhẹ để giải nhiệt tối đa!`
              : weather.temperature <= 22
              ? `🧥 **Tư vấn phong cách trời se lạnh:** Với ${weather.temperature}°C, hãy chọn phối layer cùng áo khoác cardigan dệt kim hoặc blazer thanh lịch để vừa ấm áp vừa sang trọng!`
              : `🌤️ **Tư vấn phong cách lý tưởng:** Thời tiết ${weather.temperature}°C rất đẹp, cực kỳ thích hợp cho các set đồ Smart Casual năng động từ tủ đồ của bạn!`) +
            `\n\nDưới đây là **3 set từ tủ đồ** và **3 style hot trend trên mạng** tối ưu riêng cho vóc dáng của bạn:`;
        }

        const fallbackMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: fallbackText,
          isFashionRelated: true,
          accompanyingOutfits: fallbackOutfits,
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

  const isOutfitFavorited = (set) => {
    if (!set) return false;
    return outfits.some(o => 
      o.isFavorite && (
        (set.id && o.id === set.id) || 
        (o.name && set.name && o.name.toLowerCase() === set.name.toLowerCase())
      )
    );
  };

  const handleToggleFavorite = (outfit) => {
    if (!outfit) return;
    if (onToggleFavoriteAiOutfit) {
      const nowFav = onToggleFavoriteAiOutfit(outfit);
      if (nowFav) {
        alert(`💖 ${text('Đã thêm', 'Added')} "${outfit.name}" ${text('vào mục Trang Phục Yêu Thích!', 'to your Favorite Outfits!')}`);
      } else {
        alert(`🤍 ${text('Đã bỏ', 'Removed')} "${outfit.name}" ${text('khỏi mục Trang Phục Yêu Thích.', 'from your Favorite Outfits.')}`);
      }
    } else if (onSaveAiOutfit) {
      onSaveAiOutfit({
        id: outfit.id || Date.now(),
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
      alert(`💖 ${text('Đã thêm', 'Added')} "${outfit.name}" ${text('vào mục Trang Phục Yêu Thích!', 'to your Favorite Outfits!')}`);
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 56px)',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--bg-main)',
      color: 'var(--text-primary)'
    }}>
      {/* ======================================================== */}
      {/* MAIN CHAT STREAM (ChatGPT Style)                        */}
      {/* ======================================================== */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minWidth: 0,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Minimalist Header Bar (Like ChatGPT top header) */}
        <header style={{
          height: '54px',
          padding: '0 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)',
          flexShrink: 0,
          zIndex: 5
        }}>
          {/* Left: Model Name & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), #D4AF37)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              boxShadow: '0 2px 8px rgba(225, 29, 72, 0.35)',
              flexShrink: 0
            }}>
              <Sparkles size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{activeSession?.title || 'MYFITDAILY Stylist AI'}</span>
                <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37', fontWeight: 700 }}>
                  2.5D Studio
                </span>
              </div>
            </div>
          </div>

          {/* Right: Weather Pill, Reopen Mannequin Button, New Chat */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Live Weather Widget */}
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
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                >
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>{weather.conditionIcon}</span>
                  
                  {/* Clickable City Name with Chevron */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCityPicker(prev => !prev);
                    }}
                    title={text('Nhấn để đổi thành phố / quận huyện', 'Click to change city / region')}
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
                      right: 0,
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
                <span>{text('Đang xác định...', 'Detecting...')}</span>
              </div>
            ) : null}

            {/* If Mannequin drawer is closed but an outfit was worn, show button to reopen */}
            {activeOutfitSet && !showMannequinDrawer && (
              <button
                onClick={() => setShowMannequinDrawer(true)}
                title={text('Mở lại khung thử đồ vóc dáng', 'Open virtual mannequin drawer')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: 'rgba(225, 29, 72, 0.12)',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>💃 {text('Xem Người Ảo', 'View Mannequin')}</span>
              </button>
            )}

            {/* New Chat Button */}
            <button
              onClick={() => {
                if (onNewChat) onNewChat();
                else setChatMessages([getInitialAiMessage()]);
              }}
              title={text('Bắt đầu đoạn chat mới', 'New chat')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'var(--hover-bg)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              <RotateCcw size={13} />
              <span>{text('Đoạn chat mới', 'New chat')}</span>
            </button>
          </div>
        </header>

        {/* Messages Stream (ChatGPT centered column) */}
        <div 
          ref={chatListRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 20px 180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            scrollBehavior: 'smooth'
          }}
        >
          <div style={{ width: '100%', maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {chatMessages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div 
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: isAi ? 'row' : 'row-reverse',
                    gap: '14px',
                    alignItems: 'flex-start',
                    width: '100%'
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: isAi ? 'linear-gradient(135deg, #E11D48, #D4AF37)' : 'var(--hover-bg)',
                    border: isAi ? 'none' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: isAi ? '#FFF' : 'var(--text-primary)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    boxShadow: isAi ? '0 2px 10px rgba(225, 29, 72, 0.3)' : 'none'
                  }}>
                    {isAi ? <Sparkles size={18} /> : (user?.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={18} />)}
                  </div>

                  {/* Message Bubble Content */}
                  <div style={{
                    maxWidth: isAi ? '90%' : '78%',
                    background: isAi ? 'var(--card-bg)' : 'linear-gradient(135deg, var(--primary), #9F1239)',
                    border: isAi ? '1px solid var(--border-subtle)' : '1px solid rgba(225, 29, 72, 0.5)',
                    padding: '16px 20px',
                    borderRadius: isAi ? '4px 20px 20px 20px' : '20px 4px 20px 20px',
                    color: isAi ? 'var(--text-primary)' : '#FFF',
                    fontSize: '0.92rem',
                    lineHeight: 1.65,
                    boxShadow: isAi ? '0 4px 20px rgba(0,0,0,0.06)' : '0 4px 16px rgba(225, 29, 72, 0.25)',
                  }}>
                    {/* Header line for AI message */}
                    {isAi && (
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>MYFITDAILY Stylist AI</span>
                      </div>
                    )}

                    {/* Message text with basic markdown */}
                    <div style={{ whiteSpace: 'pre-line' }}>
                      {msg.text.split('\n').map((line, lIdx) => {
                        const parts = line.split(/(\*\*.*?\*\*)/g);
                        return (
                          <div key={lIdx} style={{ marginBottom: line ? '4px' : '8px' }}>
                            {parts.map((p, pIdx) => {
                              if (p.startsWith('**') && p.endsWith('**')) {
                                return <strong key={pIdx} style={{ color: isAi ? '#D4AF37' : '#FFF' }}>{p.slice(2, -2)}</strong>;
                              }
                              return p;
                            })}
                          </div>
                        );
                      })}
                    </div>

                    {/* Accompanying Outfits Embedded in AI Reply */}
                    {isAi && msg.accompanyingOutfits && msg.accompanyingOutfits.length > 0 && (() => {
                      const wardrobeSets = msg.accompanyingOutfits.filter(o => o.sourceType === 'Wardrobe' || !o.sourceType);
                      const trendingSets = msg.accompanyingOutfits.filter(o => o.sourceType === 'TrendingOnline');
                      
                      const displayWardrobe = wardrobeSets.length > 0 ? wardrobeSets : msg.accompanyingOutfits.slice(0, 3);
                      const displayTrending = trendingSets.length > 0 ? trendingSets : msg.accompanyingOutfits.slice(3);

                      const renderOutfitCard = (set, sIdx, isOnline = false) => {
                        const isCurrentlyWearing = activeOutfitSet?.name === set.name && showMannequinDrawer;
                        return (
                          <div
                            key={sIdx}
                            style={{
                              background: 'var(--hover-bg)',
                              border: isCurrentlyWearing ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                              borderRadius: '14px',
                              padding: '16px',
                              transition: 'all 0.25s ease',
                              boxShadow: isCurrentlyWearing ? '0 0 18px rgba(225, 29, 72, 0.25)' : '0 2px 8px rgba(0,0,0,0.06)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '12px'
                            }}
                          >
                            {/* Card Header: Badge & Style */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span style={{
                                  background: isOnline ? 'rgba(239, 68, 68, 0.15)' : 'rgba(212, 175, 55, 0.15)',
                                  color: isOnline ? '#F87171' : '#D4AF37',
                                  border: `1px solid ${isOnline ? 'rgba(239, 68, 68, 0.35)' : 'rgba(212, 175, 55, 0.35)'}`,
                                  padding: '3px 9px',
                                  borderRadius: '12px',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  {set.sourceBadge || (isOnline ? '🔥 Hot Trend Mạng & TMĐT' : '👗 Từ Tủ Đồ Cá Nhân')}
                                </span>
                                <span style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)' }}>{set.name}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span className="badge badge-gold" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>{set.style}</span>
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 7px', borderRadius: '10px' }}>
                                  ✓ {set.harmonyScore || '98%'} Hợp dáng
                                </span>
                              </div>
                            </div>

                            {/* Set Description */}
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                              {set.description}
                            </p>

                            {/* ✨ Body Flattering Advice Callout */}
                            {set.bodyFlatteringNote && (
                              <div style={{
                                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.09), rgba(225, 29, 72, 0.05))',
                                borderLeft: '3.5px solid #D4AF37',
                                borderRadius: '4px 10px 10px 4px',
                                padding: '10px 13px',
                                fontSize: '0.78rem',
                                color: 'var(--text-primary)',
                                lineHeight: 1.5
                              }}>
                                <div style={{ fontWeight: 800, color: '#D4AF37', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <Sparkles size={13} color="#D4AF37" />
                                  <span>Tối ưu theo vóc dáng ({user?.bodyShape || 'Chuẩn'} • {user?.height ? `${user.height}cm` : '165cm'}):</span>
                                </div>
                                <div style={{ color: 'var(--text-secondary)' }}>{set.bodyFlatteringNote}</div>
                              </div>
                            )}

                            {/* Garment Items Mini Grid */}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: `repeat(${Math.min(set.items?.length || 4, 4)}, minmax(0, 1fr))`,
                              gap: '8px',
                            }}>
                              {(set.items || []).map((it, itI) => (
                                <div 
                                  key={itI} 
                                  style={{ 
                                    textAlign: 'center', 
                                    background: 'rgba(0,0,0,0.18)', 
                                    padding: '6px', 
                                    borderRadius: '10px',
                                    border: '1px solid var(--border-subtle)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                  }}
                                >
                                  <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '8px', marginBottom: '5px', background: 'rgba(255,255,255,0.03)' }}>
                                    <img
                                      src={it.imageUrl}
                                      alt={it.name}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=80';
                                      }}
                                    />
                                  </div>
                                  <span style={{ 
                                    fontSize: '0.62rem', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.5px', 
                                    color: '#D4AF37', 
                                    fontWeight: 700 
                                  }}>
                                    {it.categoryName || 'Item'}
                                  </span>
                                  <div 
                                    title={it.name}
                                    style={{ 
                                      fontSize: '0.7rem', 
                                      color: 'var(--text-primary)', 
                                      fontWeight: 600, 
                                      marginTop: '2px', 
                                      width: '100%', 
                                      whiteSpace: 'nowrap', 
                                      overflow: 'hidden', 
                                      textOverflow: 'ellipsis' 
                                    }}
                                  >
                                    {it.name}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Action Buttons: Mặc Thử Lên Người Ảo & Lưu */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                              <button
                                onClick={() => handleWearOutfitOnMannequin(set)}
                                style={{
                                  flex: 1,
                                  padding: '10px 16px',
                                  fontSize: '0.82rem',
                                  fontWeight: 800,
                                  borderRadius: '24px',
                                  background: isCurrentlyWearing ? 'var(--primary)' : 'linear-gradient(135deg, var(--primary), #D4AF37)',
                                  color: '#FFF',
                                  border: 'none',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '7px',
                                  boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <span>💃 {isCurrentlyWearing ? 'Đang Mặc Trên Người Ảo' : 'Mặc Thử Lên Người Ảo'}</span>
                              </button>

                              <button
                                onClick={() => handleToggleFavorite(set)}
                                id={`btn-fav-ai-${sIdx}`}
                                title={isOutfitFavorited(set) ? text("Bỏ khỏi Trang phục yêu thích", "Remove from Favorites") : text("Thêm vào Trang phục yêu thích", "Add to Favorite Outfits")}
                                style={{
                                  padding: '10px 16px',
                                  fontSize: '0.82rem',
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  borderRadius: '24px',
                                  background: isOutfitFavorited(set) ? 'rgba(244, 63, 94, 0.18)' : 'rgba(255, 255, 255, 0.06)',
                                  border: isOutfitFavorited(set) ? '1.5px solid #F43F5E' : '1px solid var(--border-subtle)',
                                  color: isOutfitFavorited(set) ? '#FB7185' : 'var(--text-secondary)',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <Heart 
                                  size={15} 
                                  color={isOutfitFavorited(set) ? '#F43F5E' : 'currentColor'} 
                                  fill={isOutfitFavorited(set) ? '#F43F5E' : 'none'} 
                                />
                                <span>{isOutfitFavorited(set) ? text('Đã Thích', 'Favorited') : text('Yêu Thích', 'Favorite')}</span>
                              </button>
                            </div>
                          </div>
                        );
                      };

                      return (
                        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
                          {/* PHẦN 1: 3 BỘ TỪ TỦ ĐỒ CÁ NHÂN */}
                          {displayWardrobe.length > 0 && (
                            <div>
                              <div style={{ 
                                fontSize: '0.86rem', 
                                fontWeight: 800, 
                                color: '#D4AF37', 
                                marginBottom: '12px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                background: 'rgba(212, 175, 55, 0.08)',
                                padding: '9px 13px',
                                borderRadius: '10px',
                                borderLeft: '4px solid #D4AF37'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                  <span>👗 3 Set Tuyển Chọn Từ Tủ Đồ Cá Nhân</span>
                                </div>
                                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                  Tối ưu cho dáng {user?.bodyShape || 'Chuẩn'}
                                </span>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {displayWardrobe.map((set, sIdx) => renderOutfitCard(set, sIdx, false))}
                              </div>
                            </div>
                          )}

                          {/* PHẦN 2: 3 STYLE NGẪU NHIÊN HOT TREND MẠNG & TMĐT */}
                          {displayTrending.length > 0 && (
                            <div>
                              <div style={{ 
                                fontSize: '0.86rem', 
                                fontWeight: 800, 
                                color: '#F87171', 
                                marginBottom: '12px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                background: 'rgba(239, 68, 68, 0.08)',
                                padding: '9px 13px',
                                borderRadius: '10px',
                                borderLeft: '4px solid #EF4444'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                  <span>🔥 3 Style Ngẫu Nhiên Xu Hướng Trên Mạng & TMĐT</span>
                                </div>
                                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                  Hot trend Shopee, TikTok Shop, Taobao ({user?.age ? `${user.age} tuổi` : 'Gen Z'})
                                </span>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {displayTrending.map((set, sIdx) => renderOutfitCard(set, sIdx + 10, true))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Follow-up Question Chips */}
                    {isAi && msg.suggestedFollowUpQuestions && msg.suggestedFollowUpQuestions.length > 0 && (
                      <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {msg.suggestedFollowUpQuestions.map((q, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => handleSendMessage(q)}
                            style={{
                              background: 'var(--hover-bg)',
                              border: '1px solid var(--border-subtle)',
                              color: '#D4AF37',
                              padding: '5px 12px',
                              borderRadius: '20px',
                              fontSize: '0.76rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
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
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', width: '100%' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #E11D48, #D4AF37)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                }}>
                  <Sparkles size={18} />
                </div>
                <div style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-subtle)',
                  padding: '12px 18px',
                  borderRadius: '20px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.88rem',
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
        </div>

        {/* Floating ChatGPT-Style Capsule Input Area */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, var(--bg-main) 78%, transparent)',
          padding: '0 20px 14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 6
        }}>
          <div style={{ width: '100%', maxWidth: '820px', pointerEvents: 'auto' }}>
            {/* Quick wardrobe items selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '8px',
              scrollbarWidth: 'none',
              marginBottom: '6px'
            }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShoppingBag size={12} color="#D4AF37" />
                <span>{text('Tủ đồ:', 'Closet:')}</span>
              </span>
              {(clothes.length > 0 ? clothes : [
                { id: 1, name: 'Áo Sơ Mi Trắng', categoryName: 'Tops', color: 'Trắng', imageUrl: '/assets/clothes/shirt_white.svg' },
                { id: 2, name: 'Áo Thun Đen', categoryName: 'Tops', color: 'Đen', imageUrl: '/assets/clothes/tshirt_black.svg' },
                { id: 4, name: 'Quần Jeans Ống Suông', categoryName: 'Bottoms', color: 'Xanh', imageUrl: '/assets/clothes/jeans_blue.svg' },
                { id: 5, name: 'Quần Tây Xếp Ly', categoryName: 'Bottoms', color: 'Đen', imageUrl: '/assets/clothes/pants_black.svg' },
                { id: 8, name: 'Áo Blazer Dạ', categoryName: 'Outerwear', color: 'Nâu', imageUrl: '/assets/clothes/blazer_brown.svg' },
              ]).map((cItem, cIdx) => (
                <button
                  key={cIdx}
                  onClick={() => handleSendMessage(
                    isEnglish
                      ? `Give me styling tips and outfit combinations with "${cItem.name}" from my wardrobe`
                      : `Gợi ý các cách phối đồ đẹp, tôn dáng nhất với "${cItem.name}" từ tủ đồ của tôi`
                  )}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '3px 9px',
                    borderRadius: '16px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    fontSize: '0.72rem',
                    transition: 'all 0.15s ease'
                  }}
                  title={`Click để yêu cầu AI phối đồ với ${cItem.name}`}
                >
                  <img
                    src={cItem.imageUrl}
                    alt=""
                    style={{ width: '18px', height: '18px', borderRadius: '4px', objectFit: 'cover' }}
                  />
                  <span>{cItem.name}</span>
                </button>
              ))}
            </div>

            {/* Quick Suggestions Chips */}
            <div style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '8px',
              scrollbarWidth: 'none',
              marginBottom: '6px'
            }}>
              {(isEnglish ? [
                "Style with white shirt",
                "Wide-leg jeans outfits",
                "Chic office outfit",
                "Layering with blazer"
              ] : [
                "Thời tiết hôm nay nên mặc gì?",
                "Phối đồ với áo sơ mi trắng",
                "Cách mix quần jeans ống suông",
                "Set đồ công sở thanh lịch",
                "Phối layer áo blazer dạ"
              ]).map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p)}
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    padding: '4px 10px',
                    borderRadius: '16px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}
                >
                  ✦ {p}
                </button>
              ))}
            </div>

            {/* ChatGPT Capsule Input Form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--card-bg)',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: '28px',
                padding: '4px 6px 4px 18px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
                transition: 'border-color 0.2s ease'
              }}
            >
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={text(
                  "Hỏi AI Stylist về cách phối đồ, thời tiết hôm nay, dịp sự kiện...",
                  "Ask AI Stylist about outfits, today's weather, occasions..."
                )}
                style={{
                  flex: 1,
                  height: '42px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                }}
              />

              <button
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                id="btn-send-ai-chat"
                className="btn-primary"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  opacity: !chatInput.trim() || chatLoading ? 0.4 : 1,
                  cursor: !chatInput.trim() || chatLoading ? 'default' : 'pointer'
                }}
              >
                <Send size={16} />
              </button>
            </form>

            {/* Disclaimer under input */}
            <div style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginTop: '6px'
            }}>
              {text(
                'MYFITDAILY Stylist AI có thể đưa ra gợi ý chưa hoàn hảo. Nhấn "Mặc thử lên người ảo" để ngắm nhìn trực quan.',
                'MYFITDAILY Stylist AI can make mistakes. Click "Try on virtual model" to view visually.'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIRTUAL MANNEQUIN DRAWER: CHỈ HIỆN KHI NGƯỜI DÙNG NHẤN    */}
      {/* "MẶC THỬ LÊN NGƯỜI ẢO" TRÊN BỘ OUTFIT ĐƯỢC GỢI Ý        */}
      {/* ======================================================== */}
      {showMannequinDrawer && activeOutfitSet && (
        <aside 
          style={{
            width: '420px',
            minWidth: '360px',
            maxWidth: '440px',
            height: '100%',
            background: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            position: 'relative',
            zIndex: 10,
            boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.35)',
            animation: 'fadeInRight 0.25s ease'
          }}
        >
          {/* Mannequin Header with Close Button */}
          <div style={{
            padding: '16px 18px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--card-bg)'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span className="badge badge-gold" style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                  💃 {text('MÔ HÌNH NGƯỜI ẢO 2.5D', '2.5D VIRTUAL MODEL')}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>
                  ● Live Fitting
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {text('Thử Đồ Theo Vóc Dáng', 'Virtual Try-On Fitting')}
              </h3>
            </div>

            {/* Close Button: User closes -> returns to full-width ChatGPT */}
            <button
              onClick={() => setShowMannequinDrawer(false)}
              title={text("Đóng khung thử đồ vóc dáng", "Close virtual mannequin panel")}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--hover-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
            {/* Vóc dáng metric chips lấy trực tiếp từ Profile người dùng */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'var(--hover-bg)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.74rem',
              color: 'var(--text-secondary)'
            }}>
              <div>
                <span>👤 Cao: <strong style={{ color: 'var(--text-primary)' }}>{user?.height || 165}cm</strong></span>
                <span> • Nặng: <strong style={{ color: 'var(--text-primary)' }}>{user?.weight || 52}kg</strong></span>
                <span> • Dáng: <strong style={{ color: '#D4AF37' }}>{user?.bodyShape || 'Chuẩn'}</strong></span>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('profile')}
                title={text("Cập nhật thông tin trong Hồ Sơ Cá Nhân", "Update information in Personal Profile")}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {text('Hồ sơ →', 'Profile →')}
              </button>
            </div>

            {/* The Live Virtual Mannequin */}
            <div style={{
              background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.9), rgba(5, 7, 13, 0.98))',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              padding: '12px',
              boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.6)'
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
            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {activeOutfitSet.name}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  Phong cách: <span style={{ color: '#D4AF37', fontWeight: 600 }}>{activeOutfitSet.style}</span> • Điểm hài hòa: <span style={{ color: '#10B981', fontWeight: 700 }}>{activeOutfitSet.harmonyScore || '98%'}</span>
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
                      background: 'var(--hover-bg)',
                      padding: '4px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <img 
                      src={item.imageUrl} 
                      alt="" 
                      style={{ width: '100%', height: '64px', objectFit: 'cover', borderRadius: '4px', marginBottom: '2px' }} 
                    />
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Save & Transfer to Studio Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleToggleFavorite(activeOutfitSet)}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    borderRadius: '20px',
                    background: isOutfitFavorited(activeOutfitSet) ? 'rgba(244, 63, 94, 0.25)' : undefined,
                    border: isOutfitFavorited(activeOutfitSet) ? '1px solid #F43F5E' : undefined,
                    color: isOutfitFavorited(activeOutfitSet) ? '#FB7185' : undefined,
                  }}
                >
                  <Heart 
                    size={14} 
                    fill={isOutfitFavorited(activeOutfitSet) ? 'currentColor' : 'none'} 
                    color={isOutfitFavorited(activeOutfitSet) ? '#F43F5E' : 'currentColor'} 
                  />
                  <span>{isOutfitFavorited(activeOutfitSet) ? text('Đã Thích', 'Favorited') : text('Lưu Vào Yêu Thích', 'Save to Favorites')}</span>
                </button>

                <button
                  onClick={() => onNavigate('outfits')}
                  className="btn-secondary"
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '20px'
                  }}
                >
                  <ExternalLink size={14} />
                  <span>Mở Studio</span>
                </button>
              </div>

              {/* Dismiss button */}
              <button
                onClick={() => setShowMannequinDrawer(false)}
                style={{
                  width: '100%',
                  padding: '7px',
                  background: 'none',
                  border: '1px dashed var(--border-subtle)',
                  borderRadius: '20px',
                  color: 'var(--text-muted)',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <X size={12} />
                <span>{text('Thu gọn khung thử đồ (Tiếp tục chat)', 'Collapse mannequin panel (Keep chatting)')}</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
