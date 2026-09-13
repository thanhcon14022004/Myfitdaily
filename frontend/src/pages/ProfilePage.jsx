import React, { useState } from 'react';
import { 
  User, Mail, Shield, Crown, Check, Save, Activity, 
  Ruler, Sparkles, AlertCircle, Info, Flame, ChevronRight 
} from 'lucide-react';
import { apiRequest } from '../api/apiClient';

const BODY_SHAPES = [
  {
    id: 'Đồng hồ cát',
    name: 'Đồng hồ cát (Hourglass)',
    icon: '⏳',
    desc: 'Vòng 1 & 3 nở nang cân đối, eo thắt thon gọn rõ nét',
    tips: 'Ưu tiên đầm bodycon ôm dáng, áo sơ vin cạp cao, thắt lưng nhấn eo để khoe trọn đường cong chữ S hoàn mỹ.'
  },
  {
    id: 'Quả lê',
    name: 'Quả lê (Pear / Triangle)',
    icon: '🍐',
    desc: 'Hông & đùi đầy đặn, phần ngực và vai thanh mảnh',
    tips: 'Tạo điểm nhấn phần thân trên bằng áo cổ thuyền, tay bồng hoặc áo sáng màu, kết hợp quần ống suông tối màu để tạo sự cân bằng.'
  },
  {
    id: 'Thước kẻ',
    name: 'Thước kẻ (Rectangle)',
    icon: '📐',
    desc: '3 vòng tương đương nhau, vóc dáng suôn thẳng thể thao',
    tips: 'Tạo ảo giác đường cong bằng cách thắt đai eo, diện áo peplum, áo crop-top hoặc chân váy xếp ly bồng bềnh.'
  },
  {
    id: 'Tam giác ngược',
    name: 'Tam giác ngược (Inverted)',
    icon: '🔻',
    desc: 'Vai & ngực rộng hơn phần hông và đùi',
    tips: 'Chọn áo cổ chữ V thanh thoát, phối với chân váy chữ A xòe bồng hoặc quần ống rộng để tạo tỉ lệ cân xứng hoàn hảo.'
  },
  {
    id: 'Quả táo',
    name: 'Quả táo (Apple / Round)',
    icon: '🍏',
    desc: 'Thân trên & vòng eo tròn đầy, đôi chân thon gọn',
    tips: 'Ưu tiên váy suông chữ A thanh thoát, áo cổ chữ V khoét sâu có độ dài qua mông nhẹ để khoe khéo đôi chân dài thon gọn.'
  }
];

export default function ProfilePage({ user, onUpdateUser, onNavigate }) {
  const [fullName, setFullName] = useState(user?.fullName || 'Người Dùng');
  const [gender, setGender] = useState(user?.gender || 'Female');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  // Thông số thể trạng & tỷ lệ cơ thể (Bắt buộc)
  const [height, setHeight] = useState(user?.height ? String(user.height) : '');
  const [weight, setWeight] = useState(user?.weight ? String(user.weight) : '');
  const [chest, setChest] = useState(user?.chest ? String(user.chest) : '');
  const [waist, setWaist] = useState(user?.waist ? String(user.waist) : '');
  const [hips, setHips] = useState(user?.hips ? String(user.hips) : '');
  const [bodyShape, setBodyShape] = useState(user?.bodyShape || 'Đồng hồ cát');
  const [age, setAge] = useState(user?.age ? String(user.age) : '');

  const [errors, setErrors] = useState({});
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [autoDetectNotice, setAutoDetectNotice] = useState('');
  const [loading, setLoading] = useState(false);

  // Tính toán Realtime BMI & Tỷ lệ WHR
  const numHeight = parseFloat(height) || 0;
  const numWeight = parseFloat(weight) || 0;
  const numChest = parseFloat(chest) || 0;
  const numWaist = parseFloat(waist) || 0;
  const numHips = parseFloat(hips) || 0;
  const numAge = parseInt(age, 10) || 0;

  const getAgeGroupInfo = (a) => {
    if (!a || a <= 0) return null;
    if (a <= 24) return {
      label: 'Gen Z (16 - 24 tuổi)',
      badge: 'TikTok Shop & Shopee Viral',
      color: '#FB7185',
      bg: 'rgba(251, 113, 133, 0.1)',
      styles: 'Y2K, Streetwear, Blokecore, Balletcore, Clean Girl',
      channels: 'TikTok Shop, Shopee, Taobao / Douyin',
      topItems: 'Baby tee, Quần suông cạp cao, Parachute pants, Giày Samba, Túi baguette'
    };
    if (a <= 34) return {
      label: 'Millennials & Công Sở Trẻ (25 - 34 tuổi)',
      badge: 'Zara & Uniqlo Smart Casual',
      color: '#818CF8',
      bg: 'rgba(129, 140, 248, 0.1)',
      styles: 'Smart Casual, Quiet Luxury, Minimalist Chic, Office Siren',
      channels: 'Shopee Mall, Zara, Uniqlo LifeWear, Mango',
      topItems: 'Blazer relaxed-fit, Quần tây xếp ly, Sơ mi poplin, Đầm midi lụa, Loafers'
    };
    if (a <= 49) return {
      label: 'Chững Chạc & Đĩnh Đạc (35 - 49 tuổi)',
      badge: 'Massimo Dutti & Ivy Moda Old Money',
      color: '#FBBF24',
      bg: 'rgba(251, 191, 36, 0.1)',
      styles: 'Old Money, Classic Elegance, Doanh nhân đĩnh đạc, May đo cao cấp',
      channels: 'Massimo Dutti, Uniqlo LifeWear, Ivy Moda, Elise',
      topItems: 'Sơ mi lụa tơ tằm, Quần âu may đo, Áo khoác Tweed, Đầm suông chữ A giấu bụng'
    };
    return {
      label: 'Trung Niên & Quý Phái (50+ tuổi)',
      badge: 'Linen & Lụa Tự Nhiên Cao Cấp',
      color: '#34D399',
      bg: 'rgba(52, 211, 153, 0.1)',
      styles: 'Quý phái, Nhã nhặn, Thoải mái tối đa, Phong cách Zen thư thái',
      channels: 'Thời trang thiết kế trung niên cao cấp, Lụa Nha Xá/Vạn Phúc',
      topItems: 'Áo dáng suông tay lỡ đũi/linen, Đầm suông thêu hoa, Quần cạp chun êm ái'
    };
  };

  const ageGroupInfo = getAgeGroupInfo(numAge);

  const bmi = (numHeight > 0 && numWeight > 0)
    ? (numWeight / Math.pow(numHeight / 100, 2)).toFixed(1)
    : null;

  const getBmiStatus = (val) => {
    if (!val) return null;
    const b = parseFloat(val);
    if (b < 18.5) return { label: 'Gầy thanh mảnh', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.12)' };
    if (b <= 24.9) return { label: 'Cân đối lý tưởng', color: '#34D399', bg: 'rgba(52, 211, 153, 0.12)' };
    if (b <= 29.9) return { label: 'Hơi đầy đặn', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.12)' };
    return { label: 'Mũm mĩm', color: '#FB7185', bg: 'rgba(251, 113, 133, 0.12)' };
  };

  const bmiStatus = getBmiStatus(bmi);
  const whr = (numWaist > 0 && numHips > 0) ? (numWaist / numHips).toFixed(2) : null;

  const isProfileIncomplete = !user?.height || !user?.weight || user.height <= 0 || user.weight <= 0;

  // Tự động nhận diện dáng người từ số đo 3 vòng
  const handleAutoDetectBodyShape = () => {
    if (numWaist <= 0 || numHips <= 0) {
      alert('Vui lòng nhập đầy đủ số đo Vòng 2 (Eo) và Vòng 3 (Mông) để AI tự động nhận diện dáng người!');
      return;
    }

    let detected = 'Đồng hồ cát';
    if (numChest > 0 && numWaist > 0 && numHips > 0) {
      if (numWaist <= 0.75 * numHips && Math.abs(numChest - numHips) <= 6) {
        detected = 'Đồng hồ cát';
      } else if (numHips - numChest >= 5 && numWaist < numHips) {
        detected = 'Quả lê';
      } else if (numChest - numHips >= 5) {
        detected = 'Tam giác ngược';
      } else if (numWaist >= 0.85 * numHips) {
        detected = 'Quả táo';
      } else {
        detected = 'Thước kẻ';
      }
    } else {
      if (numWaist / numHips <= 0.75) {
        detected = 'Đồng hồ cát';
      } else if (numWaist / numHips >= 0.85) {
        detected = 'Quả táo';
      } else {
        detected = 'Thước kẻ';
      }
    }

    setBodyShape(detected);
    setAutoDetectNotice(`✨ Đã nhận diện dáng người của bạn là "${detected}" dựa trên tỉ lệ số đo!`);
    setTimeout(() => setAutoDetectNotice(''), 4000);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validation chặt chẽ: Bắt buộc điền chiều cao, cân nặng
    const newErrors = {};
    if (!numHeight || numHeight < 50 || numHeight > 250) {
      newErrors.height = 'Chiều cao là bắt buộc (từ 50cm đến 250cm)';
    }
    if (!numWeight || numWeight < 20 || numWeight > 300) {
      newErrors.weight = 'Cân nặng là bắt buộc (từ 20kg đến 300kg)';
    }
    if (!fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
    }

    if (numChest && (numChest < 30 || numChest > 200)) {
      newErrors.chest = 'Số đo Vòng 1 phải từ 30cm đến 200cm';
    }
    if (numWaist && (numWaist < 30 || numWaist > 200)) {
      newErrors.waist = 'Số đo Vòng 2 phải từ 30cm đến 200cm';
    }
    if (numHips && (numHips < 30 || numHips > 200)) {
      newErrors.hips = 'Số đo Vòng 3 phải từ 30cm đến 200cm';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setErrors({});
    setLoading(true);

    const payload = {
      fullName: fullName.trim(),
      gender,
      avatarUrl: avatarUrl.trim() || null,
      height: numHeight,
      weight: numWeight,
      chest: numChest > 0 ? numChest : null,
      waist: numWaist > 0 ? numWaist : null,
      hips: numHips > 0 ? numHips : null,
      bodyShape,
      age: numAge > 0 ? numAge : null,
    };

    try {
      const res = await apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      const updated = {
        ...user,
        ...payload,
        ageGroup: ageGroupInfo?.label || null,
        bmi: bmi ? parseFloat(bmi) : null,
        hasBodyMetrics: true,
      };

      localStorage.setItem('myfitdaily_user', JSON.stringify(updated));
      onUpdateUser(updated);

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Lỗi cập nhật hồ sơ:', err);
      setErrors({ general: 'Không thể kết nối máy chủ. Vui lòng kiểm tra lại.' });
    } finally {
      setLoading(false);
    }
  };

  const selectedShapeObj = BODY_SHAPES.find(b => b.id === bodyShape) || BODY_SHAPES[0];

  return (
    <div className="container" style={{ padding: '40px 24px 100px', maxWidth: '820px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="badge badge-gold">MYFITDAILY BIOMETRICS</span>
          <span className="badge badge-subtle">Hồ Sơ Vóc Dáng</span>
        </div>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Hồ Sơ Cá Nhân & Chỉ Số Cơ Thể
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
          Thông tin chiều cao, cân nặng và tỷ lệ vóc dáng bắt buộc để kích hoạt tư vấn cá nhân hóa từ AI Stylist
        </p>
      </div>

      {/* Warning Banner if profile has no metrics */}
      {isProfileIncomplete && (
        <div style={{
          background: 'rgba(251, 113, 133, 0.12)',
          border: '1px solid rgba(251, 113, 133, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
        }}>
          <AlertCircle size={22} color="#FB7185" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: '#FB7185', fontWeight: 700, fontSize: '0.98rem', marginBottom: '4px' }}>
              Bắt buộc cập nhật thông số cơ thể để mở khóa AI Stylist!
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              Hiện tại bạn chưa cập nhật <strong>Chiều cao</strong> và <strong>Cân nặng</strong>. 
              Theo quy định của MYFITDAILY, AI Stylist chỉ có thể trò chuyện và phân tích outfit khi đã có đầy đủ thông số vóc dáng nhằm đảm bảo trang phục phối ra chuẩn form và tôn dáng nhất cho bạn.
            </p>
          </div>
        </div>
      )}

      {/* Main Glass Form */}
      <div className="glass-card" style={{ padding: '36px' }}>
        {/* User Avatar Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          paddingBottom: '28px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '28px',
          flexWrap: 'wrap',
        }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #D4AF37, #C27D5E)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            color: '#080A0F',
            boxShadow: '0 6px 25px var(--primary-glow)',
            overflow: 'hidden',
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              fullName[0]?.toUpperCase() || 'U'
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{fullName}</h3>
              <span className="badge badge-rose">
                <Crown size={12} /> {user?.subscriptionType || 'Free'}
              </span>
              {user?.height && user?.weight && (
                <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                  ✓ Đã có thông số vóc dáng
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {user?.email || 'user@myfitdaily.com'}
            </p>
            <div style={{ marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => onNavigate('premium')}
                style={{
                  fontSize: '0.82rem',
                  color: '#FB7185',
                  fontWeight: 700,
                  textDecoration: 'underline',
                }}
              >
                Nâng cấp tài khoản Premium →
              </button>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#6EE7B7',
            padding: '14px 18px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.92rem',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.3s ease',
          }}>
            <Check size={20} />
            <div>
              <strong>Đã lưu thông số vóc dáng thành công!</strong>
              <p style={{ fontSize: '0.84rem', margin: 0, opacity: 0.9 }}>
                AI Stylist đã nhận diện tỉ lệ cơ thể của bạn và sẵn sàng tư vấn phối đồ tôn dáng.
              </p>
            </div>
          </div>
        )}

        {errors.general && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#F87171',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            marginBottom: '20px',
          }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Section 1: Thông tin cơ bản */}
          <div>
            <h4 style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--primary)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <User size={18} />
              <span>1. Thông Tin Cơ Bản</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Họ và Tên <span style={{ color: '#FB7185' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  id="input-profile-fullname"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    borderColor: errors.fullName ? '#FB7185' : undefined,
                  }}
                />
                {errors.fullName && (
                  <span style={{ color: '#FB7185', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Giới tính <span style={{ color: '#FB7185' }}>*</span>
                </label>
                <select
                  id="select-profile-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Female">Nữ</option>
                  <option value="Male">Nam</option>
                  <option value="Other">Khác</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Độ Tuổi <span style={{ color: '#D4AF37' }}>* (TMĐT)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    id="input-profile-age"
                    placeholder="VD: 22"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="10"
                    max="120"
                    style={{ width: '100%', paddingRight: '48px' }}
                  />
                  <span style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    pointerEvents: 'none',
                    fontWeight: 700
                  }}>
                    tuổi
                  </span>
                </div>
              </div>
            </div>

            {/* Live Age-Group & E-Commerce Trend Radar Preview */}
            {ageGroupInfo && (
              <div style={{
                marginTop: '16px',
                padding: '14px 18px',
                background: ageGroupInfo.bg,
                border: `1px solid ${ageGroupInfo.color}50`,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.92rem', color: ageGroupInfo.color }}>
                      {ageGroupInfo.label}
                    </span>
                    <span style={{
                      background: 'rgba(255,255,255,0.08)',
                      color: '#FFF',
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 600
                    }}>
                      {ageGroupInfo.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    🛍️ <strong>Kênh TMĐT:</strong> {ageGroupInfo.channels} • <strong>Gu thời trang:</strong> {ageGroupInfo.styles}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    🔥 <strong>Món đồ viral:</strong> {ageGroupInfo.topItems}
                  </div>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#D4AF37', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  ✦ AI TMĐT Kích Hoạt
                </div>
              </div>
            )}

            <div style={{ marginTop: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Link Ảnh Đại Diện (Avatar URL)
              </label>
              <input
                type="url"
                id="input-profile-avatar"
                placeholder="https://images.unsplash.com/..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Section 2: THÔNG SỐ CƠ THỂ BẮT BUỘC (MANDATORY BIOMETRICS) */}
          <div style={{
            padding: '24px',
            background: 'rgba(212, 175, 55, 0.04)',
            border: '1px solid rgba(212, 175, 55, 0.22)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
              <h4 style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#D4AF37',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: 0,
              }}>
                <Ruler size={20} />
                <span>2. Thông Số Chiều Cao & Trọng Lượng Cơ Thể</span>
                <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>BẮT BUỘC</span>
              </h4>

              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                * AI Stylist cần thông số này để phân tích dáng
              </span>
            </div>

            {/* Height & Weight Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                  Chiều cao <span style={{ color: '#FB7185' }}>* (cm)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="0.5"
                    min="50"
                    max="250"
                    required
                    id="input-profile-height"
                    placeholder="Ví dụ: 168"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    style={{
                      width: '100%',
                      paddingRight: '48px',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      borderColor: errors.height ? '#FB7185' : undefined,
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    pointerEvents: 'none',
                  }}>
                    cm
                  </span>
                </div>
                {errors.height && (
                  <span style={{ color: '#FB7185', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                    {errors.height}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                  Trọng lượng / Cân nặng <span style={{ color: '#FB7185' }}>* (kg)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="0.5"
                    min="20"
                    max="300"
                    required
                    id="input-profile-weight"
                    placeholder="Ví dụ: 54"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    style={{
                      width: '100%',
                      paddingRight: '48px',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      borderColor: errors.weight ? '#FB7185' : undefined,
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    pointerEvents: 'none',
                  }}>
                    kg
                  </span>
                </div>
                {errors.weight && (
                  <span style={{ color: '#FB7185', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                    {errors.weight}
                  </span>
                )}
              </div>
            </div>

            {/* Realtime BMI Status Badge */}
            {bmi && (
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: bmiStatus?.bg || 'rgba(255,255,255,0.05)',
                border: `1px solid ${bmiStatus?.color || 'transparent'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color={bmiStatus?.color} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: bmiStatus?.color }}>
                    Chỉ số BMI: <strong>{bmi}</strong>
                  </span>
                  <span className="badge" style={{
                    background: bmiStatus?.color,
                    color: '#080A0F',
                    fontWeight: 700,
                    fontSize: '0.76rem',
                  }}>
                    {bmiStatus?.label}
                  </span>
                </div>

                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Chuẩn WHO dành cho người châu Á
                </span>
              </div>
            )}
          </div>

          {/* Section 3: SỐ ĐO 3 VÒNG & TỶ LỆ CƠ THỂ */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <h4 style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--primary)',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <Sparkles size={18} />
                <span>3. Số Đo Tỷ Lệ Cơ Thể 3 Vòng</span>
              </h4>

              <button
                type="button"
                onClick={handleAutoDetectBodyShape}
                style={{
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  color: '#D4AF37',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <Sparkles size={14} />
                <span>AI Tự Nhận Diện Dáng Người</span>
              </button>
            </div>

            {autoDetectNotice && (
              <div style={{
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                color: '#D4AF37',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '14px',
                animation: 'fadeIn 0.3s ease',
              }}>
                {autoDetectNotice}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                  Vòng 1 - Ngực (cm)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="0.5"
                    min="30"
                    max="200"
                    id="input-profile-chest"
                    placeholder="86"
                    value={chest}
                    onChange={(e) => setChest(e.target.value)}
                    style={{ width: '100%', paddingRight: '40px' }}
                  />
                  <span style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    pointerEvents: 'none',
                  }}>
                    cm
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                  Vòng 2 - Eo (cm)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="0.5"
                    min="30"
                    max="200"
                    id="input-profile-waist"
                    placeholder="64"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    style={{ width: '100%', paddingRight: '40px' }}
                  />
                  <span style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    pointerEvents: 'none',
                  }}>
                    cm
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px' }}>
                  Vòng 3 - Mông (cm)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="0.5"
                    min="30"
                    max="200"
                    id="input-profile-hips"
                    placeholder="92"
                    value={hips}
                    onChange={(e) => setHips(e.target.value)}
                    style={{ width: '100%', paddingRight: '40px' }}
                  />
                  <span style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    pointerEvents: 'none',
                  }}>
                    cm
                  </span>
                </div>
              </div>
            </div>

            {whr && (
              <div style={{
                marginTop: '12px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <Flame size={14} color="#D4AF37" />
                <span>
                  Tỷ lệ Eo/Mông (WHR): <strong style={{ color: '#D4AF37' }}>{whr}</strong>
                  {parseFloat(whr) <= 0.75 ? ' — Tỷ lệ vàng thắt eo quyến rũ ✨' : ' — Đường nét cân đối'}
                </span>
              </div>
            )}
          </div>

          {/* Section 4: LỰA CHỌN DÁNG NGƯỜI (BODY SHAPE CARDS) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px' }}>
              4. Dáng Người Của Bạn (Body Shape)
            </label>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
            }}>
              {BODY_SHAPES.map((shape) => {
                const isSelected = bodyShape === shape.id;
                return (
                  <div
                    key={shape.id}
                    onClick={() => setBodyShape(shape.id)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? '1.5px solid #D4AF37' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.4rem' }}>{shape.icon}</span>
                      <strong style={{ fontSize: '0.92rem', color: isSelected ? '#D4AF37' : 'var(--text-primary)' }}>
                        {shape.id}
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                      {shape.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Stylist Insights Box */}
            <div style={{
              marginTop: '16px',
              padding: '16px 20px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.03)',
              borderLeft: '4px solid #D4AF37',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Sparkles size={16} color="#D4AF37" />
                <strong style={{ fontSize: '0.9rem', color: '#D4AF37' }}>
                  Lời khuyên phối đồ AI cho {selectedShapeObj.name}:
                </strong>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {selectedShapeObj.tips}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '8px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <button
              type="button"
              onClick={() => onNavigate('stylist')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>Vào thử AI Stylist</span>
              <ChevronRight size={16} />
            </button>

            <button
              type="submit"
              id="btn-save-profile"
              className="btn-primary"
              disabled={loading}
              style={{ padding: '14px 36px', fontSize: '0.95rem' }}
            >
              <Save size={18} />
              <span>{loading ? 'Đang lưu...' : 'Lưu Thông Số Hồ Sơ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
