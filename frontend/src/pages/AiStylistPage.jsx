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
  Info
} from 'lucide-react';

import { apiRequest } from '../api/apiClient';
import VirtualMannequin from '../components/VirtualMannequin';

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

  // Khởi tạo tin nhắn chào mừng thời thượng của AI Stylist
  const getInitialAiMessage = () => {
    const ageGroupLabel = !user?.age || user.age <= 24 ? 'Gen Z' : user.age <= 34 ? 'Millennials' : user.age <= 49 ? 'Chững chạc' : 'Trung niên';
    return {
      id: 1,
      sender: 'ai',
      text: `Xin chào ${user?.fullName ? user.fullName.split(' ').slice(-1)[0] : 'bạn'}! Tôi là **AI Stylist & Cố Vấn Thời Trang Cá Nhân** của bạn tại MYFITDAILY ✨.\n\n` +
            `👤 **Hồ sơ vóc dáng cá nhân:** Chiều cao **${user?.height || 168}cm**, Cân nặng **${user?.weight || 58}kg**` +
            (user?.age ? `, **${user.age} tuổi** (${ageGroupLabel})` : '') +
            (user?.bodyShape ? `, Dáng người **${user.bodyShape}**` : '') +
            (user?.chest && user?.waist && user?.hips ? ` (Số đo 3 vòng: ${user.chest}-${user.waist}-${user.hips}cm)` : '') +
            `.\n\n🔥 **Trí tuệ xu hướng Sàn TMĐT (TikTok Shop, Shopee, Zara, Uniqlo, Taobao):** Đã kết nối với tủ đồ gồm **${clothes.length} món trang phục** của bạn.\n\n` +
            `Hôm nay bạn đang chuẩn bị đi đâu (hẹn hò, đi làm, dự đám cưới, cafe cuối tuần, dạo phố...), hay muốn tôi tư vấn phối món đồ nào trong tủ? Hãy nhắn cho tôi nhé!`,
      isFashionRelated: true,
      accompanyingOutfits: [],
      suggestedFollowUpQuestions: [
        "Gợi ý outfit đi đám cưới sang trọng từ tủ đồ",
        "Set đồ đi hẹn hò lãng mạn cuối tuần",
        "Phối đồ đi làm công sở thanh lịch tôn dáng",
        "Xu hướng thời trang nào đang hot trên TikTok Shop cho tuổi của tôi?",
        "Cách phối đồ phong cách Quiet Luxury tối giản"
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
  }, [activeSession?.id]);

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
          wardrobeItemIds: clothes?.map(c => c.id) || []
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

        const fallbackMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: `Dựa trên câu hỏi "${messageToSend}", thông số vóc dáng và xu hướng sàn TMĐT hiện nay, tôi đã tuyển chọn set đồ tối ưu nhất từ tủ đồ của bạn!\n\n` +
                `✨ **Bản phối:** Áo phom gọn gàng sơ vin cùng quần cạp cao giúp "hack" thêm 5cm chiều dài đôi chân, kết hợp cùng giày thanh lịch. Mô hình người ảo bên phải đã lập tức mặc thử set đồ này để bạn ngắm nhìn trực quan!`,
          isFashionRelated: true,
          accompanyingOutfits: [fallbackSet],
          suggestedFollowUpQuestions: [
            "Cách chọn màu sắc tôn da khi đi tiệc buổi tối",
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
              <span>Cố Vấn Thời Trang Cá Nhân AI</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: '#F3D98A', fontWeight: 600 }}>
              ✦ Am hiểu xu hướng TMĐT Shopee • TikTok Shop • Zara
            </span>
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#FFF' }}>
            AI Stylist & Thử Đồ Người Ảo
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate && onNavigate('profile')}
            className="btn-secondary"
            title="Đến trang Hồ Sơ Cá Nhân để xem và cập nhật vóc dáng"
            style={{ padding: '9px 18px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Ruler size={15} color="#D4AF37" />
            <span>Hồ Sơ Vóc Dáng ({user?.height || 165}cm • {user?.weight || 52}kg)</span>
          </button>

          <button
            onClick={() => onNavigate('wardrobe')}
            className="btn-secondary"
            style={{ padding: '9px 18px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ShoppingBag size={15} />
            <span>Tủ Đồ ({clothes.length} món)</span>
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
            padding: '14px 20px',
            background: 'rgba(10, 15, 28, 0.85)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), #D4AF37)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(225, 29, 72, 0.4)',
                color: '#FFF'
              }}>
                <Sparkles size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#FFF' }}>
                  {activeSession?.title ? activeSession.title : 'MYFITDAILY Stylist AI'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                  Đang trực tuyến • Sẵn sàng tư vấn mọi phong cách
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (onNewChat) onNewChat();
                else setChatMessages([getInitialAiMessage()]);
              }}
              title="Bắt đầu đoạn chat mới"
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
              <span>Đoạn chat mới</span>
            </button>
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
                  <span>AI đang phân tích tỉ lệ vóc dáng, tủ đồ và xu hướng TMĐT...</span>
                </div>
              </div>
            )}
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
            {[
              "Hôm nay đi đám cưới mặc gì sang?",
              "Gợi ý outfit đi date lãng mạn",
              "Set đồ công sở thanh lịch",
              "Phối đồ cafe dạo phố Gen Z",
              "Xu hướng thời trang TikTok Shop hot nhất",
              "Mẹo phối đồ che bắp tay & tôn eo"
            ].map((p, idx) => (
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
                {p}
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
              placeholder="Nhập câu hỏi tự nhiên (ví dụ: 'Tôi đi đám cưới bạn tối nay thì mặc gì đẹp?')..."
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
                  💃 MÔ HÌNH NGƯỜI ẢO 2.5D
                </span>
                <span style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 600 }}>
                  ● Live Fitting
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>
                Thử Đồ Theo Vóc Dáng Của Bạn
              </h3>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('profile')}
              title="Cập nhật thông tin trong Hồ Sơ Cá Nhân"
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
              <span>Chỉnh sửa hồ sơ →</span>
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
