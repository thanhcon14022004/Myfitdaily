import React from 'react';
import { 
  Sparkles, 
  Shirt, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  Flame, 
  Star, 
  Compass,
  Zap,
  TrendingUp,
  Clock,
  HeartHandshake,
  UserCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage({ onGetStarted, onExploreWardrobe }) {
  const { text, isEnglish } = useLanguage();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const highlights = [
    {
      icon: Shirt,
      title: text("Số Hóa Tủ Đồ Thông Minh", "Smart Digital Wardrobe"),
      desc: text(
        "Chụp ảnh hoặc chọn danh mục. Quản lý toàn bộ áo, quần, váy đầm, giày dép bạn đang sở hữu một cách khoa học trên một màn hình.",
        "Photograph or select categories. Scientifically organize all your shirts, pants, dresses, and shoes on a single screen."
      ),
      badge: "Digital Closet 4.0",
      color: "#FB7185"
    },
    {
      icon: Layers,
      title: text("Atelier Phối Đồ Flat-Lay Ảo", "Virtual Flat-Lay Atelier"),
      desc: text(
        "Tự do mix & match trang phục trực quan dạng layout tạp chí phẳng mà không cần mất công mặc thử đồ lộn xộn trong phòng.",
        "Freely mix & match garments on a magazine-style visual flat-lay canvas without messy room try-ons."
      ),
      badge: "Lookbook Studio",
      color: "#818CF8"
    },
    {
      icon: Sparkles,
      title: text("Trợ Lý AI Stylist Riêng Biệt", "Personal AI Stylist"),
      desc: text(
        "AI tự động phân tích thời tiết địa phương, dịp sắp tới (đi làm, hẹn hò, tiệc tùng) và chọn đúng những món đồ sẵn có của bạn.",
        "AI analyzes local weather, upcoming occasions (work, date, party) and coordinates outfits from your actual clothes."
      ),
      badge: "AI Powered",
      color: "#FBBF24"
    },
    {
      icon: UserCheck,
      title: text("Phòng Thử Đồ Mannequin Ảo 3D", "3D Virtual Mannequin Studio"),
      desc: text(
        "Mô phỏng vóc dáng chuẩn 3D theo số đo chiều cao, cân nặng và form người. Ướm thử trực quan trang phục trước khi diện ra đường.",
        "Simulate true-to-life 3D body proportions from your height, weight, and silhouette. Visually preview fits before heading out."
      ),
      badge: "Virtual Fitting",
      color: "#10B981"
    },
  ];

  const stats = [
    { value: "15,000+", label: text("Món Đồ Đã Số Hóa", "Digitized Items"), sub: text("Tủ đồ người dùng", "User wardrobes") },
    { value: "25,000+", label: text("Gợi Ý Phối Đồ AI", "AI Outfits Curated"), sub: text("Tự động theo thời tiết & dịp đi", "Adaptive to weather & occasion") },
    { value: "30 " + text("Giây", "Sec"), label: text("Chuẩn Bị Buổi Sáng", "Morning Prep Time"), sub: text("Tiết kiệm 25 phút mỗi ngày", "Save 25 mins daily") },
    { value: "4.9 / 5★", label: text("Độ Hài Lòng", "Satisfaction"), sub: "Fashion Community" },
  ];

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Editorial Hero Section */}
      <section style={{
        padding: '70px 0 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Top Fashion Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 20px',
            borderRadius: 'var(--radius-full)',
            background: isLight 
              ? 'rgba(212, 175, 55, 0.12)' 
              : 'linear-gradient(135deg, rgba(212, 175, 55, 0.18), rgba(194, 125, 94, 0.18))',
            border: isLight ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid rgba(212, 175, 55, 0.4)',
            color: isLight ? '#996515' : '#F3D98A',
            fontSize: '0.86rem',
            fontWeight: 700,
            marginBottom: '28px',
            boxShadow: isLight ? '0 2px 10px rgba(212, 175, 55, 0.15)' : '0 4px 20px rgba(212, 175, 55, 0.25)',
          }}>
            <Sparkles size={16} color={isLight ? '#996515' : '#D4AF37'} />
            <span>{text('Nền Tảng Tủ Đồ Số & Trợ Lý Thời Trang AI Cho Giới Trẻ', 'Digital Wardrobe Platform & AI Fashion Stylist')}</span>
          </div>

          {/* Main Editorial Headline */}
          <h1 style={{
            fontSize: 'clamp(2.6rem, 5.5vw, 4.8rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            maxWidth: '960px',
            margin: '0 auto 24px',
            letterSpacing: '-0.035em',
            color: 'var(--text-primary)',
          }}>
            {text('Tái Khám Phá Tủ Đồ Của Bạn Với ', 'Rediscover Your Wardrobe With ')}
            <span className="gradient-text">MYFITDAILY</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            margin: '0 auto 38px',
            lineHeight: 1.65,
          }}>
            {text('Chấm dứt hoàn toàn nỗi lo', 'End the daily stress of')}{' '}
            <strong style={{ color: isLight ? '#0D0D0D' : '#FFF', fontWeight: 800 }}>
              {text('"Hôm nay mặc gì?"', '"What should I wear today?"')}
            </strong>. 
            {text(
              ' MYFITDAILY giúp bạn quản lý khoa học, tái kết hợp những món đồ bạn đang sở hữu và nhận gợi ý chuẩn stylist quốc tế trong tích tắc.',
              ' MYFITDAILY helps you organize, mix-and-match clothes you already own, and receive international styling suggestions in seconds.'
            )}
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '56px',
          }}>
            <button
              onClick={onGetStarted}
              id="btn-hero-start"
              className="btn-primary"
              style={{ padding: '16px 36px', fontSize: '1.05rem' }}
            >
              <span>{text('Trải Nghiệm Chế Độ Demo Ngay', 'Try Demo Mode Now')}</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onExploreWardrobe}
              id="btn-hero-explore"
              className="btn-secondary"
              style={{ padding: '16px 32px', fontSize: '1.05rem' }}
            >
              <Shirt size={18} color={isLight ? '#996515' : '#F3D98A'} />
              <span>{text('Khám Phá Tủ Đồ Mẫu', 'Explore Sample Wardrobe')}</span>
            </button>
          </div>

          {/* Floating Luxury Showcase Moodboard */}
          <div style={{
            position: 'relative',
            maxWidth: '1060px',
            margin: '0 auto',
          }}>
            <div className="glass-card" style={{
              padding: '28px',
              border: isLight ? '1px solid rgba(212, 175, 55, 0.35)' : '1px solid rgba(212, 175, 55, 0.22)',
              boxShadow: isLight ? '0 15px 45px rgba(0, 0, 0, 0.08)' : '0 25px 70px rgba(0, 0, 0, 0.75)',
              background: isLight 
                ? '#FFFFFF' 
                : 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.12) 0%, rgba(14, 18, 27, 0.95) 75%)',
            }}>
              {/* Header inside mockup */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-rose">{text('✦ AI LOOKBOOK HÔM NAY', "✦ TODAY'S AI LOOKBOOK")}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {text('Hà Nội & TP.HCM: Nắng ấm 28°C • Phong cách Minimalist', 'Sunny 28°C • Minimalist Quiet Luxury')}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge badge-gold">Harmony: 98.5%</span>
                  <span className="badge badge-emerald">{text('Chuẩn Dáng & Dịp Đi', 'Occasion & Fit Match')}</span>
                </div>
              </div>

              {/* 4-Item Lookbook Flat-lay Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}>
                {[
                  { name: text("Áo Sơ Mi Lụa Oversized", "Oversized Silk Shirt"), cat: "Tops", color: text("Trắng Nhã Nhặn", "Elegant White"), img: "/assets/clothes/shirt_white.svg" },
                  { name: text("Áo Blazer Dạ Nâu Cacao", "Cocoa Wool Blazer"), cat: "Outerwear", color: text("Nâu Đất", "Earthy Brown"), img: "/assets/clothes/blazer_brown.svg" },
                  { name: text("Quần Tây Xếp Ly Đen Tinh Tế", "Pleated Trousers"), cat: "Bottoms", color: text("Đen Tối Giản", "Minimalist Black"), img: "/assets/clothes/pants_black.svg" },
                  { name: text("Giày Loafer Da Khóa Ngựa", "Horsebit Leather Loafers"), cat: "Shoes", color: text("Đen Bóng", "Glossy Black"), img: "/assets/clothes/shoes_loafer.svg" },
                ].map((item, i) => (
                  <div 
                    key={i}
                    style={{
                      background: isLight ? '#F8F9FA' : 'rgba(7, 10, 17, 0.7)',
                      border: isLight ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{
                      width: '100%',
                      aspectRatio: '4 / 5',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      marginBottom: '10px',
                    }}>
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <span className="badge badge-rose" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>
                      {item.cat}
                    </span>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isLight ? '#0D0D0D' : '#FFF' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      {item.color}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Bar */}
      <section style={{ padding: '30px 0 60px' }}>
        <div className="container">
          <div className="glass-card" style={{
            padding: '32px 40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '28px',
            textAlign: 'center',
            background: isLight ? '#FFFFFF' : undefined,
            border: isLight ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: isLight ? '0 10px 30px rgba(0, 0, 0, 0.06)' : undefined,
          }}>
            {stats.map((st, idx) => (
              <div key={idx}>
                <div style={{
                  fontSize: '2.4rem',
                  fontWeight: 800,
                  color: isLight ? '#0D0D0D' : '#FFFFFF',
                  fontFamily: "'Outfit', sans-serif",
                  lineHeight: 1.1,
                  marginBottom: '6px',
                }}>
                  {st.value}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: isLight ? '#996515' : '#F3D98A' }}>
                  {st.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: isLight ? '#666666' : 'var(--text-muted)', marginTop: '3px' }}>
                  {st.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Core Highlights */}
      <section style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
            <span className="badge badge-indigo" style={{ marginBottom: '12px' }}>
              {text('Quy Trình Thời Trang Chuẩn Quốc Tế', 'International Fashion Standard')}
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '14px', color: 'var(--text-primary)' }}>
              {text('Bốn Trụ Cột Nâng Tầm Phong Cách Của Bạn', 'Four Pillars Elevating Your Style')}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              {text(
                'Tích hợp hoàn hảo giữa công nghệ số hóa hiện đại và triết lý thời trang bền vững.',
                'Seamless fusion of smart digitization and sustainable wardrobe aesthetics.'
              )}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}>
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div 
                  key={i}
                  className="glass-card"
                  style={{
                    padding: '32px 26px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: isLight ? '#FFFFFF' : undefined,
                    border: isLight ? '1px solid #E5E7EB' : undefined,
                    boxShadow: isLight ? '0 8px 25px rgba(0, 0, 0, 0.04)' : undefined,
                  }}
                >
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '22px',
                    }}>
                      <div style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '16px',
                        background: `linear-gradient(135deg, ${h.color}22, ${h.color}44)`,
                        border: `1px solid ${h.color}66`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: h.color,
                      }}>
                        <Icon size={26} />
                      </div>
                      <span className="badge badge-rose" style={{ color: h.color, borderColor: `${h.color}44` }}>
                        {h.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: isLight ? '#0D0D0D' : '#FFF' }}>
                      {h.title}
                    </h3>
                    <p style={{ color: isLight ? '#4B5563' : 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.65 }}>
                      {h.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before / After Transformation */}
      <section style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div className="glass-card" style={{
            padding: '48px 40px',
            border: isLight ? '1px solid rgba(212, 175, 55, 0.35)' : '1px solid rgba(212, 175, 55, 0.35)',
            background: isLight 
              ? '#FFFFFF' 
              : 'linear-gradient(135deg, rgba(14, 18, 27, 0.95), rgba(8, 10, 15, 0.95))',
            boxShadow: isLight ? '0 15px 40px rgba(0, 0, 0, 0.06)' : undefined,
          }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <span className="badge badge-gold" style={{ marginBottom: '10px' }}>
                {text('Sự Thay Đổi Đột Phá', 'Breakthrough Transformation')}
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {text('Tủ Đồ Trước & Sau Khi Có MYFITDAILY', 'Your Wardrobe: Before & After MYFITDAILY')}
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}>
              {/* Before */}
              <div style={{
                background: isLight ? 'rgba(239, 68, 68, 0.04)' : 'rgba(239, 68, 68, 0.06)',
                border: isLight ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
              }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#DC2626' : '#F87171', marginBottom: '16px' }}>
                  {text('❌ Trước khi sử dụng', '❌ Before MYFITDAILY')}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ fontSize: '0.9rem', color: isLight ? '#4B5563' : 'var(--text-secondary)' }}>
                    • {text('Mua sắm theo cảm tính, nhiều món chỉ mặc đúng 1 lần rồi cất tủ.', 'Impulse shopping; many garments worn once and forgotten in closet.')}
                  </li>
                  <li style={{ fontSize: '0.9rem', color: isLight ? '#4B5563' : 'var(--text-secondary)' }}>
                    • {text('Mất 20-30 phút mỗi sáng lục lọi tủ đồ và vẫn cảm thấy "không có gì để mặc".', 'Wasting 20-30 mins every morning rummaging through clothes with "nothing to wear".')}
                  </li>
                  <li style={{ fontSize: '0.9rem', color: isLight ? '#4B5563' : 'var(--text-secondary)' }}>
                    • {text('Phối đồ lặp đi lặp lại một vài cách an toàn, thiếu sự sáng tạo.', 'Repeating the same safe combinations, lacking fresh styling creativity.')}
                  </li>
                </ul>
              </div>

              {/* After */}
              <div style={{
                background: isLight ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.06)',
                border: isLight ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
              }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isLight ? '#059669' : '#34D399', marginBottom: '16px' }}>
                  {text('✨ Với MYFITDAILY', '✨ With MYFITDAILY')}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ fontSize: '0.9rem', color: isLight ? '#1F2937' : 'var(--text-primary)', fontWeight: 500 }}>
                    • {text('Nắm rõ 100% món đồ đang sở hữu ngay trên màn hình điện thoại.', '100% visibility over every item you own right on your screen.')}
                  </li>
                  <li style={{ fontSize: '0.9rem', color: isLight ? '#1F2937' : 'var(--text-primary)', fontWeight: 500 }}>
                    • {text('AI Stylist gợi ý bộ phối hoàn chỉnh trong 5 giây theo đúng thời tiết và dịp đi.', 'AI Stylist curates complete looks in 5 seconds matched with weather and occasions.')}
                  </li>
                  <li style={{ fontSize: '0.9rem', color: isLight ? '#1F2937' : 'var(--text-primary)', fontWeight: 500 }}>
                    • {text('Tái sử dụng và mix đồ cũ thành nhiều phong cách mới mẻ, tự tin rạng ngời.', 'Restyle existing clothes into fresh, sophisticated looks with effortless confidence.')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
