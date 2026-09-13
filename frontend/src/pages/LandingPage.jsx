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
  HeartHandshake
} from 'lucide-react';

export default function LandingPage({ onGetStarted, onExploreWardrobe }) {
  const highlights = [
    {
      icon: Shirt,
      title: "Số Hóa Tủ Đồ Thông Minh",
      desc: "Chụp ảnh hoặc chọn danh mục. Quản lý toàn bộ áo, quần, váy đầm, giày dép bạn đang sở hữu một cách khoa học trên một màn hình.",
      badge: "Digital Closet 4.0",
      color: "#FB7185"
    },
    {
      icon: Layers,
      title: "Atelier Phối Đồ Flat-Lay Ảo",
      desc: "Tự do mix & match trang phục trực quan dạng layout tạp chí phẳng mà không cần mất công mặc thử đồ lộn xộn trong phòng.",
      badge: "Lookbook Studio",
      color: "#818CF8"
    },
    {
      icon: Sparkles,
      title: "Trợ Lý AI Stylist Riêng Biệt",
      desc: "AI tự động phân tích thời tiết địa phương, dịp sắp tới (đi làm, hẹn hò, tiệc tùng) và chọn đúng những món đồ sẵn có của bạn.",
      badge: "AI Powered",
      color: "#FBBF24"
    },
  ];

  const stats = [
    { value: "15,000+", label: "Món Đồ Đã Số Hóa", sub: "Tủ đồ người Việt" },
    { value: "98.5%", label: "Tỷ Lệ Vàng Màu Sắc", sub: "Thuật toán Color Theory" },
    { value: "30 Giây", label: "Chuẩn Bị Buổi Sáng", sub: "Tiết kiệm 25 phút mỗi ngày" },
    { value: "4.9 / 5★", label: "Độ Hài Lòng", sub: "Fashion Community" },
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
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.18), rgba(194, 125, 94, 0.18))',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            color: '#F3D98A',
            fontSize: '0.86rem',
            fontWeight: 700,
            marginBottom: '28px',
            boxShadow: '0 4px 20px rgba(212, 175, 55, 0.25)',
          }}>
            <Sparkles size={16} color="#D4AF37" />
            <span>Nền Tảng Tủ Đồ Số & Trợ Lý Thời Trang AI Độc Quyền Cho Người Việt</span>
          </div>

          {/* Main Editorial Headline */}
          <h1 style={{
            fontSize: 'clamp(2.6rem, 5.5vw, 4.8rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            maxWidth: '960px',
            margin: '0 auto 24px',
            letterSpacing: '-0.035em',
          }}>
            Tái Khám Phá Tủ Đồ Của Bạn Với{' '}
            <span className="gradient-text">MYFITDAILY</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            margin: '0 auto 38px',
            lineHeight: 1.65,
          }}>
            Chấm dứt hoàn toàn nỗi lo <strong style={{ color: '#FFF' }}>"Hôm nay mặc gì?"</strong>. 
            MYFITDAILY giúp bạn quản lý khoa học, tái kết hợp những món đồ bạn đang sở hữu và nhận gợi ý chuẩn stylist quốc tế trong tích tắc.
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
              <span>Trải Nghiệm Chế Độ Demo Ngay</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onExploreWardrobe}
              id="btn-hero-explore"
              className="btn-secondary"
              style={{ padding: '16px 32px', fontSize: '1.05rem' }}
            >
              <Shirt size={18} color="#F3D98A" />
              <span>Khám Phá Tủ Đồ Mẫu</span>
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
              border: '1px solid rgba(212, 175, 55, 0.22)',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.75)',
              background: 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.12) 0%, rgba(14, 18, 27, 0.95) 75%)',
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
                  <span className="badge badge-rose">✦ AI LOOKBOOK HÔM NAY</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Hà Nội & TP.HCM: Nắng ấm 28°C • Phong cách Minimalist
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge badge-gold">Harmony: 98.5%</span>
                  <span className="badge badge-emerald">Tỷ Lệ Vàng</span>
                </div>
              </div>

              {/* 4-Item Lookbook Flat-lay Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}>
                {[
                  { name: "Áo Sơ Mi Lụa Oversized", cat: "Tops", color: "Trắng Nhã Nhặn", img: "/assets/clothes/shirt_white.svg" },
                  { name: "Áo Blazer Dạ Nâu Cacao", cat: "Outerwear", color: "Nâu Đất", img: "/assets/clothes/blazer_brown.svg" },
                  { name: "Quần Tây Xếp Ly Đen Tinh Tế", cat: "Bottoms", color: "Đen Tối Giản", img: "/assets/clothes/pants_black.svg" },
                  { name: "Giày Loafer Da Khóa Ngựa", cat: "Shoes", color: "Đen Bóng", img: "/assets/clothes/shoes_loafer.svg" },
                ].map((item, i) => (
                  <div 
                    key={i}
                    style={{
                      background: 'rgba(7, 10, 17, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
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
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>
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
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            {stats.map((st, idx) => (
              <div key={idx}>
                <div style={{
                  fontSize: '2.4rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  fontFamily: "'Outfit', sans-serif",
                  lineHeight: 1.1,
                  marginBottom: '6px',
                }}>
                  {st.value}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F3D98A' }}>
                  {st.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                  {st.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Core Highlights */}
      <section style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
            <span className="badge badge-indigo" style={{ marginBottom: '12px' }}>
              Quy Trình Thời Trang Chuẩn Quốc Tế
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '14px' }}>
              Ba Trụ Cột Nâng Tầm Phong Cách Của Bạn
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Tích hợp hoàn hảo giữa công nghệ số hóa hiện đại và triết lý thời trang bền vững.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
          }}>
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div 
                  key={i}
                  className="glass-card"
                  style={{
                    padding: '36px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
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

                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '12px', color: '#FFF' }}>
                      {h.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.65 }}>
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
            border: '1px solid rgba(212, 175, 55, 0.35)',
            background: 'linear-gradient(135deg, rgba(14, 18, 27, 0.95), rgba(8, 10, 15, 0.95))',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <span className="badge badge-gold" style={{ marginBottom: '10px' }}>Sự Thay Đổi Đột Phá</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Tủ Đồ Trước & Sau Khi Có MYFITDAILY</h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}>
              {/* Before */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.06)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
              }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F87171', marginBottom: '16px' }}>
                  ❌ Trước khi sử dụng
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>• Mua sắm theo cảm tính, nhiều món chỉ mặc đúng 1 lần rồi cất tủ.</li>
                  <li style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>• Mất 20-30 phút mỗi sáng lục lọi tủ đồ và vẫn cảm thấy "không có gì để mặc".</li>
                  <li style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>• Phối đồ lặp đi lặp lại một vài cách an toàn, thiếu sự sáng tạo.</li>
                </ul>
              </div>

              {/* After */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
              }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34D399', marginBottom: '16px' }}>
                  ✨ Với MYFITDAILY
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>• Nắm rõ 100% món đồ đang sở hữu ngay trên màn hình điện thoại.</li>
                  <li style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>• AI Stylist gợi ý bộ phối hoàn chỉnh trong 5 giây theo đúng thời tiết và dịp đi.</li>
                  <li style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>• Tái sử dụng và mix đồ cũ thành nhiều phong cách mới mẻ, tự tin rạng ngời.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
