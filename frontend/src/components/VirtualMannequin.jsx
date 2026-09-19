import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Sparkles,
  Download,
  Share2,
  Zap,
  Edit3,
  Layers,
  ChevronLeft,
  Check,
  X,
  UserCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Danh sách người mẫu AI người thật (Real Human AI Models)
 * Lấy cảm hứng từ chuẩn giao diện App FITS (Realistic VTON Studio)
 */
const FITS_MODELS = [
  {
    id: 'male_streetwear',
    gender: 'Nam',
    name: 'Minh Quân (Nam Á Đông - Streetwear)',
    tag: 'Dáng Chuẩn 1m78',
    image: '/assets/fits/fits_male_streetwear.jpg',
    thumb: '/assets/fits/fits_male_streetwear.jpg',
    description: 'Người mẫu nam Châu Á dáng thể thao, tư thế tự nhiên, tay buông lơi linh hoạt theo trang phục.'
  },
  {
    id: 'male_basic',
    gender: 'Nam',
    name: 'Tuấn Khang (Nam Á Đông - Casual)',
    tag: 'Fits Original',
    image: '/assets/fits/fits_model_male.png',
    thumb: '/assets/fits/fits_model_male.png',
    description: 'Người mẫu phong cách Fits Studio nguyên bản, dáng đứng thẳng tự tin chuẩn lookbook.'
  },
  {
    id: 'female_chic',
    gender: 'Nữ',
    name: 'Khánh Vy (Nữ Á Đông - Casual Chic)',
    tag: 'Dáng Chuẩn 1m65',
    image: '/assets/fits/fits_female_model.jpg',
    thumb: '/assets/fits/fits_female_model.jpg',
    description: 'Người mẫu nữ Châu Á nụ cười rạng rỡ, tay và vai mềm mại tự nhiên, form dáng thanh lịch.'
  }
];

export default function VirtualMannequin({
  user = {},
  top = null,
  topItem = null,
  outer = null,
  outerwearItem = null,
  bottom = null,
  bottomItem = null,
  shoes = null,
  shoesItem = null,
  accessory = null,
  gender: propGender,
  showControls = true,
  interactive = true,
  compact = false
}) {
  const { text } = useLanguage();
  const resolvedTop = top || topItem;
  const resolvedOuter = outer || outerwearItem;
  const resolvedBottom = bottom || bottomItem;
  const resolvedShoes = shoes || shoesItem;
  const resolvedAccessory = accessory;

  // Xác định giới tính người dùng
  const isUserMale = (user?.gender?.toLowerCase() === 'nam' ||
                      user?.gender?.toLowerCase() === 'male' ||
                      propGender?.toLowerCase() === 'nam' ||
                      propGender?.toLowerCase() === 'male');

  // Chọn người mẫu mặc định phù hợp với giới tính
  const [selectedModelId, setSelectedModelId] = useState(
    isUserMale ? 'male_streetwear' : 'female_chic'
  );

  // Khi giới tính user thay đổi thì tự động chuyển sang model tương ứng
  useEffect(() => {
    setSelectedModelId(isUserMale ? 'male_streetwear' : 'female_chic');
  }, [isUserMale]);

  const activeModel = FITS_MODELS.find(m => m.id === selectedModelId) || FITS_MODELS[0];

  // Trạng thái xử lý AI mô phỏng Virtual Try-On
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [aiCredits, setAiCredits] = useState(15);
  const [isFastMode, setIsFastMode] = useState(true);

  // Modal / Drawer popup điều khiển
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showClothesModal, setShowClothesModal] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('Đứng thẳng tự nhiên trước ống kính studio, hai tay thả lỏng nhẹ nhàng theo thân người');
  const [savedNotification, setSavedNotification] = useState('');

  // Hàm kích hoạt hiệu ứng Virtual Try-On sinh mẫu AI
  const triggerAiRegenerate = () => {
    setIsGenerating(true);
    setGenerationStep('1/3: Phân tích DensePose & Khớp Cử Động Cánh Tay...');
    
    setTimeout(() => {
      setGenerationStep('2/3: Khuếch Tán Nếp Gấp Vải & Đổ Bóng Tự Nhiên...');
    }, 600);

    setTimeout(() => {
      setGenerationStep('3/3: Hoàn thiện ảnh Studio High-Definition...');
    }, 1100);

    setTimeout(() => {
      setIsGenerating(false);
      setGenerationStep('');
      if (aiCredits > 0) setAiCredits(c => c - 1);
    }, 1500);
  };

  // Tự động kích hoạt AI regeneration khi người dùng thay đổi đồ
  useEffect(() => {
    if (resolvedTop || resolvedBottom || resolvedOuter) {
      triggerAiRegenerate();
    }
  }, [resolvedTop?.id, resolvedBottom?.id, resolvedOuter?.id]);

  // Xử lý tải ảnh lookbook về máy
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = activeModel.image;
    link.download = `myfitdaily_fits_${activeModel.id}_outfit.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSavedNotification('Đã tải ảnh người mẫu thử đồ thành công!');
    setTimeout(() => setSavedNotification(''), 3000);
  };

  // Xử lý chia sẻ
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'MyFitDaily AI Virtual Try-On (Fits Style)',
        text: 'Xem set đồ tôi vừa thử trên người mẫu AI chân thực!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSavedNotification('Đã sao chép liên kết outfit vào clipboard!');
      setTimeout(() => setSavedNotification(''), 3000);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '430px',
      margin: '0 auto',
      userSelect: 'none'
    }}>
      {/* Thông báo dạng toast ngắn khi lưu/tải */}
      {savedNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          zIndex: 9999,
          background: 'rgba(16, 185, 129, 0.95)',
          color: '#FFF',
          padding: '8px 18px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.82rem',
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <Check size={16} />
          <span>{savedNotification}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. KHUNG APP FITS STUDIO CHÍNH (FITS STUDIO CONTAINER)                   */}
      {/* ========================================================================= */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '380px',
        borderRadius: '24px',
        overflow: 'hidden',
        background: '#0B0F19',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75)'
      }}>

        {/* 1.1 TOP BAR CHUẨN FITS: <  |  ↓  ↑  → */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'rgba(11, 15, 25, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          zIndex: 10
        }}>
          <button
            type="button"
            onClick={() => setShowModelPicker(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              cursor: 'pointer'
            }}
            title="Đổi người mẫu"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Model info pill */}
          <div 
            onClick={() => setShowModelPicker(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}
          >
            <span style={{ fontSize: '0.72rem', color: '#FDE68A', fontWeight: 800 }}>
              {activeModel.name.split('(')[0]}
            </span>
            <span style={{ fontSize: '0.62rem', background: '#D4AF37', color: '#000', padding: '1px 5px', borderRadius: '4px', fontWeight: 900 }}>
              {activeModel.gender}
            </span>
          </div>

          {/* Top Actions: Download, Share */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleDownload}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                cursor: 'pointer'
              }}
              title="Tải ảnh về máy"
            >
              <Download size={16} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                cursor: 'pointer'
              }}
              title="Chia sẻ set đồ"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* 1.2 KHU VỰC ẢNH NGƯỜI MẪU THẬT STUDIO (REAL HUMAN PHOTO HERO CARD) */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '510px',
          background: '#EAEAEA',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Ảnh người mẫu thật (Photorealistic Human Model) */}
          <img
            src={activeModel.image}
            alt={activeModel.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              filter: isGenerating ? 'blur(3px) brightness(0.9)' : 'none',
              transform: isGenerating ? 'scale(0.98)' : 'scale(1)'
            }}
          />

          {/* Watermark "Fits" phong cách chuyên nghiệp */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'rgba(255, 255, 255, 0.65)',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            fontSize: '0.86rem',
            fontWeight: 800,
            letterSpacing: '0.5px',
            pointerEvents: 'none'
          }}>
            <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>⟡</span>
            <span>Fits AI</span>
          </div>

          {/* Loading Animation Quét AI Virtual Try-On */}
          {isGenerating && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5, 8, 16, 0.55)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 15
            }}>
              {/* Vòng quay tia sáng AI */}
              <div style={{
                position: 'relative',
                width: '60px',
                height: '60px',
                marginBottom: '16px'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '3px solid rgba(212, 175, 55, 0.2)',
                  borderTopColor: '#D4AF37',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <div style={{
                  position: 'absolute',
                  inset: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={24} color="#FDE68A" />
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.85)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                borderRadius: '12px',
                padding: '10px 18px',
                textAlign: 'center',
                boxShadow: '0 8px 30px rgba(0,0,0,0.8)'
              }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF', marginBottom: '4px' }}>
                  AI VIRTUAL TRY-ON (FITS VTON)
                </div>
                <div style={{ fontSize: '0.74rem', color: '#FDE68A', fontWeight: 600 }}>
                  {generationStep}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 1.3 THANH TRẠNG THÁI CREDITS CHUẨN FITS: "0 AI credits (+)" */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '10px 16px 6px',
          background: '#0B0F19'
        }}>
          <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600 }}>
            {aiCredits} AI credits
          </span>
          <button
            type="button"
            onClick={() => setAiCredits(c => c + 10)}
            style={{
              background: '#FFF',
              border: 'none',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              cursor: 'pointer',
              fontWeight: 900,
              fontSize: '0.8rem'
            }}
            title="Nạp thêm lượt thử AI"
          >
            +
          </button>
        </div>

        {/* 1.4 DOCK ĐIỀU KHIỂN CHUẨN 5 ICON CỦA APP FITS:
            [Regenerate] [Background / Model] [Clothes] [Fast] [Prompt] */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '6px',
          padding: '8px 12px 14px',
          background: '#0B0F19',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          {/* Nút 1: Regenerate (Thử lại / Tạo dáng mới) */}
          <button
            type="button"
            onClick={triggerAiRegenerate}
            disabled={isGenerating}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '10px 4px',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              color: '#FFF',
              transition: 'all 0.2s ease'
            }}
          >
            <RotateCcw size={19} color="#FFF" style={{ animation: isGenerating ? 'spin 1s linear infinite' : 'none' }} />
            <span style={{ fontSize: '0.64rem', fontWeight: 600, color: '#DDD' }}>Regenerate</span>
          </button>

          {/* Nút 2: Background / Model (Đổi Người Mẫu) */}
          <button
            type="button"
            onClick={() => setShowModelPicker(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              background: showModelPicker ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: showModelPicker ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '10px 4px',
              cursor: 'pointer',
              color: '#FFF',
              transition: 'all 0.2s ease'
            }}
          >
            {/* Thumbnail người mẫu nhỏ dạng avatar chuẩn Fits */}
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1.5px solid #D4AF37'
            }}>
              <img src={activeModel.thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: '0.64rem', fontWeight: 600, color: '#DDD' }}>Model</span>
          </button>

          {/* Nút 3: Clothes (Khay Đồ Đang Thử) */}
          <button
            type="button"
            onClick={() => setShowClothesModal(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              background: showClothesModal ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: showClothesModal ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '10px 4px',
              cursor: 'pointer',
              color: '#FFF',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ position: 'relative' }}>
              <Layers size={19} color="#FFF" />
              {(resolvedTop || resolvedBottom || resolvedShoes) && (
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-5px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#10B981'
                }} />
              )}
            </div>
            <span style={{ fontSize: '0.64rem', fontWeight: 600, color: '#DDD' }}>Clothes</span>
          </button>

          {/* Nút 4: Fast (Chế độ tạo nhanh) */}
          <button
            type="button"
            onClick={() => {
              setIsFastMode(!isFastMode);
              setSavedNotification(isFastMode ? 'Đã bật chế độ Ultra HD Inpainting' : 'Đã bật chế độ Fast AI Preview');
              setTimeout(() => setSavedNotification(''), 2500);
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              background: isFastMode ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.05)',
              border: isFastMode ? '1px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '10px 4px',
              cursor: 'pointer',
              color: isFastMode ? '#FBBF24' : '#FFF',
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={19} color={isFastMode ? '#FBBF24' : '#FFF'} fill={isFastMode ? '#FBBF24' : 'none'} />
            <span style={{ fontSize: '0.64rem', fontWeight: 600, color: isFastMode ? '#FBBF24' : '#DDD' }}>Fast</span>
          </button>

          {/* Nút 5: Prompt (Chỉnh dáng đứng / Phong cách AI) */}
          <button
            type="button"
            onClick={() => setShowPromptModal(true)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              background: showPromptModal ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: showPromptModal ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '10px 4px',
              cursor: 'pointer',
              color: '#FFF',
              transition: 'all 0.2s ease'
            }}
          >
            <Edit3 size={19} color="#FFF" />
            <span style={{ fontSize: '0.64rem', fontWeight: 600, color: '#DDD' }}>Prompt</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MODAL 1: CHỌN NGƯỜI MẪU AI THẬT (MODEL PICKER MODAL)                   */}
      {/* ========================================================================= */}
      {showModelPicker && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: '#121724',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '420px',
            padding: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={20} color="#D4AF37" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#FFF', fontWeight: 800 }}>
                  Chọn Người Mẫu AI (Real Models)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModelPicker(false)}
                style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Tất cả người mẫu đều được tạo sinh từ công nghệ AI Diffusion chân thực, dáng đứng tự nhiên và tay buông lơi linh hoạt.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {FITS_MODELS.map(m => {
                const isSelected = m.id === selectedModelId;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedModelId(m.id);
                      setShowModelPicker(false);
                      triggerAiRegenerate();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(212, 175, 55, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '1.5px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img
                      src={m.thumb}
                      alt=""
                      style={{
                        width: '46px',
                        height: '56px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFF' }}>
                          {m.name}
                        </span>
                        <span style={{
                          fontSize: '0.62rem',
                          background: m.gender === 'Nam' ? '#3B82F6' : '#EC4899',
                          color: '#FFF',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          fontWeight: 800
                        }}>
                          {m.tag}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {m.description}
                      </div>
                    </div>
                    {isSelected && (
                      <div style={{ color: '#D4AF37' }}>
                        <Check size={18} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL 2: XEM LAYER ĐỒ ĐANG MẶC (CLOTHES MODAL)                         */}
      {/* ========================================================================= */}
      {showClothesModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: '#121724',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '380px',
            padding: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="#D4AF37" />
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#FFF', fontWeight: 800 }}>
                  Trang Phục Trên Người Mẫu
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowClothesModal(false)}
                style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#FDA4AF', fontWeight: 700 }}>Áo (Top):</span>
                <span style={{ fontSize: '0.8rem', color: '#FFF' }}>{resolvedTop?.name || 'Áo thun basic'}</span>
              </div>
              <div style={{ padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#818CF8', fontWeight: 700 }}>Quần (Bottom):</span>
                <span style={{ fontSize: '0.8rem', color: '#FFF' }}>{resolvedBottom?.name || 'Quần jeans/trackpants'}</span>
              </div>
              {resolvedOuter && (
                <div style={{ padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: '#C084FC', fontWeight: 700 }}>Khoác (Outer):</span>
                  <span style={{ fontSize: '0.8rem', color: '#FFF' }}>{resolvedOuter.name}</span>
                </div>
              )}
              <div style={{ padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#34D399', fontWeight: 700 }}>Giày (Shoes):</span>
                <span style={{ fontSize: '0.8rem', color: '#FFF' }}>{resolvedShoes?.name || 'Sneakers retro'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowClothesModal(false);
                triggerAiRegenerate();
              }}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '10px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #D4AF37, #B8860B)',
                color: '#000',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Áp Dụng Thử Đồ (Try-On Now)
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL 3: ĐIỀU CHỈNH AI PROMPT & DÁNG ĐỨNG (PROMPT MODAL)               */}
      {/* ========================================================================= */}
      {showPromptModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: '#121724',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '400px',
            padding: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} color="#D4AF37" />
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#FFF', fontWeight: 800 }}>
                  Tùy Chỉnh Tư Thế & Dáng Đứng AI
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPromptModal(false)}
                style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Gợi ý dáng đứng tự nhiên để AI điều chỉnh tư thế tay và khớp cử động:
            </p>

            {/* Quick Prompt Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {[
                'Hai tay thả lỏng tự nhiên bên hông',
                'Một tay đút túi quần, vai mở rộng',
                'Khoanh tay nhẹ nhàng trước ngực',
                'Tư thế bước đi tự tin trong studio'
              ].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCustomPrompt(p)}
                  style={{
                    background: customPrompt === p ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: customPrompt === p ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: customPrompt === p ? '#FDE68A' : 'var(--text-secondary)',
                    borderRadius: '8px',
                    padding: '5px 10px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '8px 10px',
                color: '#FFF',
                fontSize: '0.8rem',
                resize: 'none',
                marginBottom: '16px'
              }}
            />

            <button
              type="button"
              onClick={() => {
                setShowPromptModal(false);
                triggerAiRegenerate();
              }}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #D4AF37, #B8860B)',
                color: '#000',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Sinh Lại Dáng Người Mẫu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
