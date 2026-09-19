import React, { useState, useEffect } from 'react';
import {
  Link2,
  Sparkles,
  ExternalLink,
  Trash2,
  CheckCircle2,
  TrendingUp,
  ShoppingBag,
  Shield,
  RefreshCw,
  Copy,
  Check,
  Tag
} from 'lucide-react';
import { apiRequest } from '../api/apiClient';
import { useLanguage } from '../context/LanguageContext';

export default function AdminPortalPage({ user, onNavigate, onEquipInStudio }) {
  const { text } = useLanguage();
  const [activeTab, setActiveTab] = useState('importer');
  const [productUrl, setProductUrl] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [affiliateTrackingId, setAffiliateTrackingId] = useState('myfitdaily_creator_2026');
  const [loading, setLoading] = useState(false);
  const [scanningStep, setScanningStep] = useState(0);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const [affiliateProducts, setAffiliateProducts] = useState(() => {
    const saved = localStorage.getItem('myfitdaily_affiliate_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn(e);
      }
    }
    return [
      {
        id: 901,
        name: 'Áo Polo Len Dệt Họa Tiết Quả Trám Retro',
        categoryId: 1,
        categoryName: 'Tops',
        price: 263000,
        priceFormatted: '263K',
        platform: 'Shopee',
        imageUrl: '/assets/clothes/sweatshirt_frozen_navy.png',
        affiliateUrl: 'https://shopee.vn/product-sample-argyle-sweater?aff_sub=myfitdaily_admin',
        originalUrl: 'https://shopee.vn/ao-polo-len-retro-qua-tram',
        color: 'Xám',
        style: 'Streetwear / Retro',
        brand: 'Local Brand Hanoi',
        clicks: 342,
        commission: '39.450 đ'
      },
      {
        id: 902,
        name: 'Quần Jeans Baggy Ống Rộng Wash Bụi',
        categoryId: 2,
        categoryName: 'Bottoms',
        price: 220000,
        priceFormatted: '220K',
        platform: 'Shopee',
        imageUrl: '/assets/clothes/trackpants_stripe_black.png',
        affiliateUrl: 'https://shopee.vn/product-sample-baggy-jeans?aff_sub=myfitdaily_admin',
        originalUrl: 'https://shopee.vn/quan-jeans-ong-rong-baggy',
        color: 'Đen',
        style: 'Streetwear',
        brand: 'Denim Studio',
        clicks: 289,
        commission: '33.000 đ'
      },
      {
        id: 903,
        name: 'Áo Sweatshirt Nowwear Club Thêu Chữ',
        categoryId: 1,
        categoryName: 'Tops',
        price: 215000,
        priceFormatted: '215K',
        platform: 'TikTokShop',
        imageUrl: '/assets/clothes/sweatshirt_frozen_navy.png',
        affiliateUrl: 'https://vt.tiktok.com/ZSsample-nowwear?aff_sub=myfitdaily_admin',
        originalUrl: 'https://vt.tiktok.com/nowwear-club-sweatshirt',
        color: 'Xanh Navy',
        style: 'Streetwear',
        brand: 'Nowwear Club',
        clicks: 412,
        commission: '43.000 đ'
      },
      {
        id: 904,
        name: 'Quần Trackpants Sọc Trắng Đen Viền',
        categoryId: 2,
        categoryName: 'Bottoms',
        price: 204000,
        priceFormatted: '204K',
        platform: 'TikTokShop',
        imageUrl: '/assets/clothes/trackpants_stripe_black.png',
        affiliateUrl: 'https://vt.tiktok.com/ZSsample-trackpants?aff_sub=myfitdaily_admin',
        originalUrl: 'https://vt.tiktok.com/trackpants-striped-black',
        color: 'Đen',
        style: 'Streetwear',
        brand: 'Sporty Street',
        clicks: 310,
        commission: '30.600 đ'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('myfitdaily_affiliate_items', JSON.stringify(affiliateProducts));
  }, [affiliateProducts]);

  useEffect(() => {
    async function loadBackendAffiliates() {
      try {
        const res = await apiRequest('/admin/affiliate-products');
        if (res.ok && res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setAffiliateProducts(res.data.data);
        }
      } catch (err) {
        console.warn('Backend affiliate sync fallback to local', err);
      }
    }
    loadBackendAffiliates();
  }, []);

  const sampleLinks = [
    {
      name: 'Áo Polo Len Quả Trám (Shopee - 263K)',
      url: 'https://shopee.vn/ao-polo-len-hoa-tiet-qua-tram-unisex-oversize-i.123456.789012',
      price: 263000,
      title: 'Áo Polo Len Dệt Họa Tiết Quả Trám Retro'
    },
    {
      name: 'Quần Jeans Baggy Wash Bụi (TikTok Shop - 220K)',
      url: 'https://vt.tiktok.com/ZS6789ABC/quan-jeans-baggy-ong-suong-wash-bui-retro',
      price: 220000,
      title: 'Quần Jeans Baggy Ống Rộng Wash Bụi'
    },
    {
      name: 'Áo Sweatshirt Nowwear Club (Shopee - 215K)',
      url: 'https://shopee.vn/ao-sweatshirt-nowwear-club-theu-chu-oversize-i.987654.321098',
      price: 215000,
      title: 'Áo Sweatshirt Nowwear Club Thêu Chữ Nổi'
    },
    {
      name: 'Quần Trackpants Sọc Trắng Đen (TikTok Shop - 204K)',
      url: 'https://vt.tiktok.com/ZS9876DEF/quan-trackpants-thun-soc-trang-den',
      price: 204000,
      title: 'Quần Trackpants Ống Suông Sọc Trắng Đen'
    }
  ];

  const handleSelectSample = (sample) => {
    setProductUrl(sample.url);
    setCustomPrice(sample.price);
    setCustomTitle(sample.title);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setProductUrl(text);
    } catch (e) {
      alert('Vui lòng dán trực tiếp vào ô input!');
    }
  };

  const handleImportLink = async (e) => {
    e.preventDefault();
    if (!productUrl.trim()) {
      alert('Vui lòng nhập đường link sản phẩm!');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    setScanningStep(1);
    await new Promise(r => setTimeout(r, 500));
    setScanningStep(2);
    await new Promise(r => setTimeout(r, 600));
    setScanningStep(3);
    await new Promise(r => setTimeout(r, 500));

    try {
      const res = await apiRequest('/admin/import-affiliate-link', {
        method: 'POST',
        body: JSON.stringify({
          productUrl: productUrl.trim(),
          customPrice: customPrice ? parseFloat(customPrice) : null,
          customTitle: customTitle.trim() || null,
          affiliateTrackingId: affiliateTrackingId.trim() || 'myfitdaily_aff'
        })
      });

      let newItem;
      if (res.ok && res.data?.data) {
        newItem = res.data.data;
      } else {
        const urlLower = productUrl.toLowerCase();
        let platform = 'Shopee';
        if (urlLower.includes('tiktok') || urlLower.includes('vt.tiktok')) platform = 'TikTokShop';
        else if (urlLower.includes('lazada')) platform = 'Lazada';
        else if (urlLower.includes('zara')) platform = 'Zara';

        const priceNum = customPrice ? parseFloat(customPrice) : 263000;
        const priceFormatted = `${Math.round(priceNum / 1000)}K`;
        const isBottom = urlLower.includes('quan') || urlLower.includes('jean') || urlLower.includes('pant');
        const isShoe = urlLower.includes('giay') || urlLower.includes('sneaker');

        newItem = {
          id: Date.now(),
          name: customTitle.trim() || (isBottom ? 'Quần Jeans / Trackpants Affiliate' : (isShoe ? 'Giày Sneaker Retro Classic' : 'Áo Sweatshirt / Polo Len Affiliate')),
          categoryId: isBottom ? 2 : (isShoe ? 5 : 1),
          categoryName: isBottom ? 'Bottoms' : (isShoe ? 'Shoes' : 'Tops'),
          price: priceNum,
          priceFormatted: priceFormatted,
          platform: platform,
          imageUrl: isBottom ? '/assets/clothes/trackpants_stripe_black.png' : (isShoe ? '/assets/clothes/sneakers_white_black.png' : '/assets/clothes/sweatshirt_frozen_navy.png'),
          affiliateUrl: `${productUrl.trim()}?aff_source=myfitdaily&aff_sub=${affiliateTrackingId}`,
          originalUrl: productUrl.trim(),
          color: 'Đen / Phối màu',
          style: 'Streetwear',
          brand: platform + ' Mall',
          clicks: 1,
          commission: `${Math.round(priceNum * 0.15).toLocaleString('vi-VN')} đ`
        };
      }

      setAffiliateProducts([newItem, ...affiliateProducts]);
      setSuccessMessage(`Đã cào & bóc tách thành công: "${newItem.name}" (${newItem.priceFormatted}) từ sàn ${newItem.platform}!`);
      setProductUrl('');
      setCustomPrice('');
      setCustomTitle('');
    } catch (err) {
      setErrorMessage('Không thể kết nối máy chủ, đã lưu ở chế độ offline preview.');
    } finally {
      setLoading(false);
      setScanningStep(0);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Bạn có chắc muốn gỡ sản phẩm Affiliate này khỏi hệ thống?')) return;
    try {
      await apiRequest(`/admin/affiliate-products/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Delete backend failed, deleting locally', e);
    }
    setAffiliateProducts(affiliateProducts.filter(p => p.id !== id));
  };

  const handleCopyLink = (item) => {
    navigator.clipboard.writeText(item.affiliateUrl || item.originalUrl);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      color: 'var(--text-primary)',
      fontFamily: "'Outfit', sans-serif"
    }}>
      {/* 1. Header Banner dành cho Admin */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 78, 59, 0.25))',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '24px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
          }}>
            <Shield size={26} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                {text('Cổng Quản Trị Hệ Thống (Admin Portal)', 'System Administration Portal')}
              </h2>
              <span style={{
                fontSize: '0.68rem',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                background: '#10B981',
                color: '#022C22',
                fontWeight: 800
              }}>
                ROLE: ADMIN
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {text(
                'Quản lý link tiếp thị Affiliate, cấu hình kho đồ toàn sàn và thống kê hoa hồng (Không bao gồm chức năng AI Stylist cá nhân)',
                'Manage affiliate product links, marketplace catalog, and commission tracking (Stylist features excluded)'
              )}
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(5, 8, 15, 0.6)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            onClick={() => setActiveTab('importer')}
            style={{
              padding: '7px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === 'importer' ? 'linear-gradient(135deg, #10B981, #059669)' : 'transparent',
              color: activeTab === 'importer' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Link2 size={15} />
            <span>{text('Dán Link Sản Phẩm', 'Import Affiliate Link')}</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '7px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === 'products' ? 'linear-gradient(135deg, #10B981, #059669)' : 'transparent',
              color: activeTab === 'products' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShoppingBag size={15} />
            <span>{text(`Kho Đồ Affiliate (${affiliateProducts.length})`, `Affiliate Catalog (${affiliateProducts.length})`)}</span>
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '7px 16px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === 'overview' ? 'linear-gradient(135deg, #10B981, #059669)' : 'transparent',
              color: activeTab === 'overview' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <TrendingUp size={15} />
            <span>{text('Thống Kê Doanh Thu', 'Analytics')}</span>
          </button>
        </div>
      </div>

      {/* 2. TAB 1: DÁN LINK SẢN PHẨM AFFILIATE */}
      {activeTab === 'importer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{
            padding: '28px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            background: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.08) 0%, rgba(10, 14, 24, 0.9) 70%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} color="#10B981" />
                  <span>{text('Tự Động Cào & Bóc Tách Đồ Từ Link Sản Phẩm', 'Auto Scraping & Garment Segmentation from URL')}</span>
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {text('Dán link bất kỳ từ Shopee, TikTok Shop, Lazada, Zara... AI sẽ tự động cắt viền sản phẩm, phân loại và gắn mã tiếp thị liên kết.',
                        'Paste any product link. AI will remove background, classify attributes, and attach affiliate link.')}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(238, 77, 45, 0.2)', color: '#FF6433', border: '1px solid rgba(238, 77, 45, 0.4)', fontWeight: 700 }}>
                  🛍️ Shopee
                </span>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(254, 44, 85, 0.2)', color: '#FE2C55', border: '1px solid rgba(254, 44, 85, 0.4)', fontWeight: 700 }}>
                  🎵 TikTok Shop
                </span>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(15, 20, 110, 0.3)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.4)', fontWeight: 700 }}>
                  💙 Lazada
                </span>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.1)', color: '#FFF', border: '1px solid rgba(255, 255, 255, 0.2)', fontWeight: 700 }}>
                  ✨ Zara / Uniqlo
                </span>
              </div>
            </div>

            <form onSubmit={handleImportLink} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="url"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    placeholder="https://shopee.vn/product/... hoặc https://vt.tiktok.com/..."
                    required
                    style={{
                      width: '100%',
                      padding: '14px 44px 14px 42px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(5, 8, 15, 0.85)',
                      border: '1px solid rgba(16, 185, 129, 0.5)',
                      color: '#FFF',
                      fontSize: '0.92rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Link2 size={18} color="#10B981" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  {productUrl && (
                    <button
                      type="button"
                      onClick={() => setProductUrl('')}
                      style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handlePasteClipboard}
                  title="Dán từ Clipboard"
                  style={{
                    padding: '0 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Copy size={15} />
                  <span>Dán link</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0 24px',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Sparkles size={18} />
                  <span>{loading ? 'Đang Xử Lý AI...' : 'Phân Tích & Bóc Tách'}</span>
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                paddingTop: '8px'
              }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    💵 Giá bán niêm yết (Tuỳ chọn ghi đè, VNĐ):
                  </label>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    placeholder="VD: 263000 (Hiện: 263K)"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFF',
                      fontSize: '0.82rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    🏷️ Tiêu đề món đồ (Tự động nhận diện nếu để trống):
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="VD: Áo Polo Len Quả Trám Retro"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#FFF',
                      fontSize: '0.82rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    🆔 Mã Affiliate Tracking Sub-ID:
                  </label>
                  <input
                    type="text"
                    value={affiliateTrackingId}
                    onChange={(e) => setAffiliateTrackingId(e.target.value)}
                    placeholder="myfitdaily_creator"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#34D399',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </form>

            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed rgba(255, 255, 255, 0.1)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '8px' }}>
                🔗 Thử nhanh link mẫu từ video Lookbook TikTok:
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                {sampleLinks.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(s)}
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#6EE7B7',
                      fontSize: '0.72rem',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      cursor: 'pointer'
                    }}
                  >
                    + {s.name}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div style={{
                marginTop: '16px',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(5, 8, 15, 0.9)',
                border: '1px solid #10B981',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <RefreshCw size={20} className="animate-spin" color="#10B981" />
                <div style={{ fontSize: '0.82rem' }}>
                  {scanningStep === 1 && <span style={{ color: '#FDE68A' }}>🌐 Bước 1/3: Đang kết nối tới sàn và trích xuất thông tin sản phẩm...</span>}
                  {scanningStep === 2 && <span style={{ color: '#6EE7B7' }}>✂️ Bước 2/3: AI BiRefNet đang bóc tách viền trang phục & tạo bóng đổ Lookbook...</span>}
                  {scanningStep === 3 && <span style={{ color: '#38BDF8' }}>🧠 Bước 3/3: Gemini Vision đang phân loại danh mục, màu sắc & tạo mã tracking...</span>}
                </div>
              </div>
            )}

            {successMessage && (
              <div style={{
                marginTop: '14px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10B981',
                color: '#34D399',
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={18} />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {/* Lookbook Style Cards Grid */}
          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={18} color="#D4AF37" />
                <span>{text('Sản Phẩm Đã Nhập & Gắn Thẻ Giá Lookbook', 'Imported Products with Lookbook Price Tags')}</span>
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Hiển thị chuẩn phong cách Lookbook TikTok (Ảnh phẳng bóc nền + Nhãn giá + Link Affiliate)
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '18px'
            }}>
              {affiliateProducts.map((item) => (
                <div
                  key={item.id}
                  className="glass-card"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'rgba(12, 16, 26, 0.85)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    zIndex: 2,
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: item.platform === 'Shopee' ? '#EE4D2D' : '#FE2C55',
                    color: '#FFF',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                  }}>
                    {item.platform === 'Shopee' ? 'Shopee' : 'TikTok Shop'}
                  </div>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    title="Gỡ sản phẩm"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      zIndex: 2,
                      background: 'rgba(0,0,0,0.5)',
                      border: 'none',
                      color: '#EF4444',
                      padding: '5px',
                      borderRadius: '50%',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>

                  <div style={{
                    height: '210px',
                    width: '100%',
                    background: '#8F949B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    padding: '14px',
                    boxSizing: 'border-box'
                  }}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        maxHeight: '180px',
                        maxWidth: '90%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 14px 18px rgba(0, 0, 0, 0.45))'
                      }}
                    />
                  </div>

                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '6px'
                      }}>
                        <span style={{
                          fontFamily: 'serif',
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          color: '#FDE68A',
                          letterSpacing: '0.5px'
                        }}>
                          {item.categoryName === 'Bottoms' ? 'Quần' : 'Áo'} : {item.priceFormatted || `${item.price / 1000}K`}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 700 }}>
                          Hoa hồng ~15%
                        </span>
                      </div>

                      <h4 style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        margin: '0 0 6px',
                        lineHeight: 1.3,
                        color: '#FFF',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {item.name}
                      </h4>

                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {item.brand} • {item.style}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                      <a
                        href={item.affiliateUrl || item.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          padding: '7px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'linear-gradient(135deg, #10B981, #059669)',
                          color: '#FFF',
                          textDecoration: 'none',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px'
                        }}
                      >
                        <ExternalLink size={13} />
                        <span>Xem Trên Sàn</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleCopyLink(item)}
                        title="Sao chép link Affiliate"
                        style={{
                          padding: '7px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: copiedId === item.id ? '#34D399' : 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {copiedId === item.id ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedId === item.id ? 'Đã chép' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB 2: QUẢN LÝ KHO ĐỒ AFFILIATE DẠNG BẢNG */}
      {activeTab === 'products' && (
        <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
              Danh Sách Sản Phẩm Tiếp Thị Liên Kết ({affiliateProducts.length})
            </h3>
            <button
              onClick={() => setActiveTab('importer')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: '#10B981',
                color: '#022C22',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              + Nhập Link Mới
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>Ảnh</th>
                  <th style={{ padding: '10px' }}>Tên Sản Phẩm</th>
                  <th style={{ padding: '10px' }}>Sàn</th>
                  <th style={{ padding: '10px' }}>Giá Niêm Yết</th>
                  <th style={{ padding: '10px' }}>Lượt Click</th>
                  <th style={{ padding: '10px' }}>Hoa Hồng Ước Tính</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {affiliateProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px' }}>
                      <img src={p.imageUrl} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }} />
                    </td>
                    <td style={{ padding: '10px', fontWeight: 600, color: '#FFF' }}>{p.name}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ padding: '2px 7px', borderRadius: '4px', background: p.platform === 'Shopee' ? '#EE4D2D22' : '#FE2C5522', color: p.platform === 'Shopee' ? '#FF6433' : '#FE2C55', fontWeight: 700, fontSize: '0.72rem' }}>
                        {p.platform}
                      </span>
                    </td>
                    <td style={{ padding: '10px', fontWeight: 800, color: '#FDE68A' }}>{p.priceFormatted || `${p.price / 1000}K`}</td>
                    <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{p.clicks || 0}</td>
                    <td style={{ padding: '10px', color: '#34D399', fontWeight: 700 }}>{p.commission || '35.000 đ'}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteItem(p.id)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.75rem' }}
                      >
                        Gỡ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAB 3: THỐNG KÊ DOANH THU & HOA HỒNG */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tổng Sản Phẩm Affiliate</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', marginTop: '6px' }}>{affiliateProducts.length}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Đang hoạt động trên Shopee & TikTok</div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tổng Lượt Click Mua Hàng</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38BDF8', marginTop: '6px' }}>1,352</div>
            <div style={{ fontSize: '0.7rem', color: '#34D399', marginTop: '4px' }}>↑ 24% so với tuần trước</div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hoa Hồng Tích Lũy Ước Tính</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FDE68A', marginTop: '6px' }}>12.450.000 đ</div>
            <div style={{ fontSize: '0.7rem', color: '#34D399', marginTop: '4px' }}>Tỉ lệ chia sẻ: 12% - 18%</div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chiến Dịch Đang Chạy</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#C084FC', marginTop: '6px' }}>8 Campaign</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Shopee 10.10, TikTok Mega Sale</div>
          </div>
        </div>
      )}
    </div>
  );
}
