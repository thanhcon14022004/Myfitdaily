import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  Camera, 
  Link as LinkIcon, 
  Check, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  Ruler, 
  Scan, 
  ShieldCheck, 
  Zap, 
  Palette,
  Layers,
  Scissors,
  CheckCheck
} from 'lucide-react';
import { apiRequest } from '../api/apiClient';
import { extractGarmentImage, SEGMENTED_PRESET_ITEMS } from '../utils/garmentExtractor';

const PRESET_IMAGES_FEMALE = [
  { name: 'Áo Sơ Mi Trắng Lụa', url: '/assets/clothes/shirt_white.svg', cat: 1, brand: 'Zara', color: 'Trắng' },
  { name: 'Áo Thun Cotton Đen', url: '/assets/clothes/tshirt_black.svg', cat: 1, brand: 'Uniqlo', color: 'Đen' },
  { name: 'Quần Jeans Levi\'s 501', url: '/assets/clothes/jeans_blue.svg', cat: 2, brand: 'Levi\'s', color: 'Xanh Denim' },
  { name: 'Quần Tây Massimo Dutti', url: '/assets/clothes/pants_black.svg', cat: 2, brand: 'Massimo Dutti', color: 'Đen' },
  { name: 'Áo Blazer Dạ Nâu Mango', url: '/assets/clothes/blazer_brown.svg', cat: 4, brand: 'Mango', color: 'Nâu' },
  { name: 'Đầm Lụa Midi Slip Dress', url: '/assets/clothes/dress_silk.svg', cat: 3, brand: 'Zara', color: 'Hồng Nhạt' },
  { name: 'Giày Penny Loafer Da Bò', url: '/assets/clothes/shoes_loafer.svg', cat: 5, brand: 'Cole Haan', color: 'Đen' },
  { name: 'Sneakers Trắng Classic Retro', url: '/assets/clothes/shoes_sneaker.svg', cat: 5, brand: 'Nike', color: 'Trắng' },
  { name: 'Túi Da Baguette Minimalist', url: '/assets/clothes/bag_leather.svg', cat: 6, brand: 'Charles & Keith', color: 'Nâu Đất' },
];

const PRESET_IMAGES_MALE = [
  { name: 'Áo Sơ Mi Trắng Oxford', url: '/assets/clothes/shirt_white.svg', cat: 1, brand: 'Uniqlo', color: 'Trắng' },
  { name: 'Áo Thun Cotton Đen Boxy Fit', url: '/assets/clothes/tshirt_black.svg', cat: 1, brand: 'Zara Men', color: 'Đen' },
  { name: 'Quần Jeans Levi\'s 501', url: '/assets/clothes/jeans_blue.svg', cat: 2, brand: 'Levi\'s', color: 'Xanh Denim' },
  { name: 'Quần Tây Ống Suông Đen', url: '/assets/clothes/pants_black.svg', cat: 2, brand: 'Massimo Dutti', color: 'Đen' },
  { name: 'Áo Blazer Nam Nâu Tây', url: '/assets/clothes/blazer_brown.svg', cat: 4, brand: 'Mango Man', color: 'Nâu' },
  { name: 'Áo Polo Pique Lacoste', url: '/assets/clothes/shirt_white.svg', cat: 1, brand: 'Lacoste', color: 'Xanh Navy' },
  { name: 'Giày Penny Loafer Da Bò Nam', url: '/assets/clothes/shoes_loafer.svg', cat: 5, brand: 'Cole Haan', color: 'Đen' },
  { name: 'Sneakers Trắng Classic Retro Nam', url: '/assets/clothes/shoes_sneaker.svg', cat: 5, brand: 'Nike', color: 'Trắng' },
  { name: 'Túi Messenger Da Nam', url: '/assets/clothes/bag_leather.svg', cat: 6, brand: 'Coach', color: 'Nâu Đất' },
];

const CATEGORY_OPTIONS_FEMALE = [
  { id: 1, name: 'Áo (Tops)', icon: '👕', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], defaultSize: 'M' },
  { id: 2, name: 'Quần (Bottoms)', icon: '👖', sizes: ['28', '29', '30', '31', '32', '33', '34'], defaultSize: '30' },
  { id: 3, name: 'Đầm (Dresses)', icon: '👗', sizes: ['XS', 'S', 'M', 'L'], defaultSize: 'M' },
  { id: 4, name: 'Áo Khoác (Outerwear)', icon: '🧥', sizes: ['S', 'M', 'L', 'XL'], defaultSize: 'L' },
  { id: 5, name: 'Giày (Shoes)', icon: '👟', sizes: ['36', '37', '38', '39', '40', '41'], defaultSize: '38' },
  { id: 6, name: 'Phụ Kiện (Accessories)', icon: '👜', sizes: ['FreeSize', 'Standard'], defaultSize: 'FreeSize' }
];

const CATEGORY_OPTIONS_MALE = [
  { id: 1, name: 'Áo (Tops)', icon: '👕', sizes: ['S', 'M', 'L', 'XL', 'XXL'], defaultSize: 'L' },
  { id: 2, name: 'Quần (Bottoms)', icon: '👖', sizes: ['29', '30', '31', '32', '33', '34', '36'], defaultSize: '31' },
  { id: 4, name: 'Áo Khoác (Outerwear)', icon: '🧥', sizes: ['M', 'L', 'XL', 'XXL'], defaultSize: 'L' },
  { id: 5, name: 'Giày (Shoes)', icon: '👟', sizes: ['39', '40', '41', '42', '43', '44'], defaultSize: '41' },
  { id: 6, name: 'Phụ Kiện (Accessories)', icon: '👜', sizes: ['FreeSize', 'Standard'], defaultSize: 'FreeSize' }
];

const POPULAR_COLORS = [
  { name: 'Trắng', hex: '#FFFFFF', border: '#CBD5E1', label: 'Trắng' },
  { name: 'Đen', hex: '#0F172A', border: '#475569', label: 'Đen' },
  { name: 'Xanh Denim', hex: '#38BDF8', border: '#0284C7', label: 'Xanh Denim' },
  { name: 'Xanh Navy', hex: '#1E3A8A', border: '#1E40AF', label: 'Xanh Navy' },
  { name: 'Nâu', hex: '#78350F', border: '#92400E', label: 'Nâu' },
  { name: 'Be', hex: '#FDE68A', border: '#D97706', label: 'Be' },
  { name: 'Đỏ', hex: '#EF4444', border: '#B91C1C', label: 'Đỏ' },
  { name: 'Hồng', hex: '#F472B6', border: '#DB2777', label: 'Hồng' },
  { name: 'Xám', hex: '#94A3B8', border: '#64748B', label: 'Xám' },
  { name: 'Xanh Lá', hex: '#10B981', border: '#047857', label: 'Xanh Lá' },
  { name: 'Vàng', hex: '#EAB308', border: '#A16207', label: 'Vàng' },
  { name: 'Tím', hex: '#A855F7', border: '#7E22CE', label: 'Tím' },
];

// Phân tích hình ảnh: Nhận diện cả Màu Sắc và Phom Dáng (Áo hay Quần) qua HTML5 Canvas
function analyzeImageProperties(imageUrl, filename = '') {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const naturalWidth = img.naturalWidth || img.width || 1;
        const naturalHeight = img.naturalHeight || img.height || 1;
        const aspectRatio = naturalHeight / naturalWidth;

        // 1. Phân tích loại trang phục (Áo hay Quần)
        let detectedCategory = 1; // Mặc định là Áo
        const lowerName = (filename || '').toLowerCase();

        if (lowerName.includes('quan') || lowerName.includes('jean') || lowerName.includes('pant') || lowerName.includes('trouser') || lowerName.includes('short') || lowerName.includes('kaki') || lowerName.includes('jogger')) {
          detectedCategory = 2; // Quần
        } else if (lowerName.includes('ao') || lowerName.includes('shirt') || lowerName.includes('tee') || lowerName.includes('polo') || lowerName.includes('hoodie') || lowerName.includes('len') || lowerName.includes('sweater')) {
          detectedCategory = 1; // Áo
        } else if (!isMale && (lowerName.includes('dam') || lowerName.includes('dress') || lowerName.includes('vay'))) {
          detectedCategory = 3; // Đầm (chỉ cho nữ)
        } else if (lowerName.includes('khoac') || lowerName.includes('blazer') || lowerName.includes('jacket') || lowerName.includes('coat')) {
          detectedCategory = 4; // Áo khoác
        } else if (lowerName.includes('giay') || lowerName.includes('shoe') || lowerName.includes('sneaker') || lowerName.includes('loafer')) {
          detectedCategory = 5; // Giày
        } else if (lowerName.includes('tui') || lowerName.includes('bag')) {
          detectedCategory = 6; // Phụ kiện
        } else {
          // Dựa vào tỉ lệ phom dáng ảnh:
          if (aspectRatio >= 1.35) {
            detectedCategory = 2; // Ảnh dọc dài: dáng quần
          } else if (aspectRatio <= 0.75) {
            detectedCategory = 5; // Ảnh ngang bẹt: dáng giày
          } else {
            detectedCategory = 1; // Dáng áo
          }
        }

        // 2. Phân tích màu sắc thực tế từ điểm ảnh
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 64;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const imgData = ctx.getImageData(0, 0, size, size).data;
        const startX = Math.floor(size * 0.2);
        const endX = Math.floor(size * 0.8);
        const startY = Math.floor(size * 0.2);
        const endY = Math.floor(size * 0.8);

        let colorVotes = {
          'Đen': 0, 'Trắng': 0, 'Xám': 0, 'Đỏ': 0, 'Hồng': 0,
          'Xanh Navy': 0, 'Xanh Denim': 0, 'Xanh Lá': 0,
          'Vàng': 0, 'Nâu': 0, 'Be': 0, 'Tím': 0
        };

        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const idx = (y * size + x) * 4;
            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];
            const a = imgData[idx + 3];

            if (a < 128) continue;

            const rn = r / 255;
            const gn = g / 255;
            const bn = b / 255;
            const max = Math.max(rn, gn, bn);
            const min = Math.min(rn, gn, bn);
            let h = 0, s = 0;
            const l = (max + min) / 2;

            if (max !== min) {
              const d = max - min;
              s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
              switch (max) {
                case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
                case gn: h = (bn - rn) / d + 2; break;
                case bn: h = (rn - gn) / d + 4; break;
              }
              h /= 6;
            }

            const hDeg = h * 360;

            if (l < 0.18) {
              colorVotes['Đen']++;
            } else if (l > 0.86 && s < 0.2) {
              colorVotes['Trắng']++;
            } else if (s < 0.15) {
              if (l > 0.65) colorVotes['Be']++;
              else colorVotes['Xám']++;
            } else {
              if (hDeg >= 345 || hDeg < 15) {
                if (l > 0.65) colorVotes['Hồng']++;
                else colorVotes['Đỏ']++;
              } else if (hDeg >= 15 && hDeg < 45) {
                if (l < 0.45) colorVotes['Nâu']++;
                else colorVotes['Be']++;
              } else if (hDeg >= 45 && hDeg < 70) {
                if (s < 0.45 && l > 0.6) colorVotes['Be']++;
                else colorVotes['Vàng']++;
              } else if (hDeg >= 70 && hDeg < 165) {
                colorVotes['Xanh Lá']++;
              } else if (hDeg >= 165 && hDeg < 260) {
                if (l < 0.28) colorVotes['Xanh Navy']++;
                else if (s < 0.55) colorVotes['Xanh Denim']++;
                else colorVotes['Xanh Denim']++;
              } else if (hDeg >= 260 && hDeg < 320) {
                colorVotes['Tím']++;
              } else {
                colorVotes['Hồng']++;
              }
            }
          }
        }

        let bestColor = 'Trắng';
        let maxVotes = -1;
        for (const [col, votes] of Object.entries(colorVotes)) {
          if (votes > maxVotes) {
            maxVotes = votes;
            bestColor = col;
          }
        }

        resolve({
          color: bestColor,
          categoryId: detectedCategory,
          aspectRatio
        });
      } catch (err) {
        console.warn("Canvas image properties analysis error:", err);
        resolve({ color: 'Trắng', categoryId: 1, aspectRatio: 1 });
      }
    };
    img.onerror = () => resolve({ color: 'Trắng', categoryId: 1, aspectRatio: 1 });
    img.src = imageUrl;
  });
}

export default function AddClothingModal({ isOpen, onClose, onAdd, user }) {
  const isMale = user?.gender?.toLowerCase() === 'nam' || user?.gender?.toLowerCase() === 'male';
  const categoryOptions = isMale ? CATEGORY_OPTIONS_MALE : CATEGORY_OPTIONS_FEMALE;
  const presetImages = isMale ? PRESET_IMAGES_MALE : PRESET_IMAGES_FEMALE;
  const segmentedPresets = isMale 
    ? SEGMENTED_PRESET_ITEMS.filter(p => p.categoryId !== 3 && !p.name?.toLowerCase().includes('đầm') && !p.name?.toLowerCase().includes('váy')) 
    : SEGMENTED_PRESET_ITEMS;

  const [imageSourceTab, setImageSourceTab] = useState('file'); // 'file' | 'presets' | 'url'
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: 1,
    color: 'Trắng',
    style: 'Casual',
    season: 'AllSeason',
    imageUrl: '',
    description: '',
    brand: '',
    size: isMale ? 'L' : 'M',
  });

  const [suggestedSizes, setSuggestedSizes] = useState(isMale ? ['S', 'M', 'L', 'XL', 'XXL'] : ['XS', 'S', 'M', 'L', 'XL', 'XXL']);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Garment Extractor State (Bóc tách & Tách nền thông minh)
  const [isExtracting, setIsExtracting] = useState(false);
  const [rawImageUrl, setRawImageUrl] = useState('');
  const [isCutoutApplied, setIsCutoutApplied] = useState(false);
  const [cutoutTolerance, setCutoutTolerance] = useState(28);

  if (!isOpen) return null;

  // Xử lý khi người dùng bấm chuyển Loại trang phục (Áo / Quần / Đầm...)
  const handleSelectCategory = (catId) => {
    const opt = categoryOptions.find(c => c.id === catId);
    if (!opt) return;

    setFormData(prev => ({
      ...prev,
      categoryId: catId,
      size: opt.sizes.includes(prev.size) ? prev.size : opt.defaultSize
    }));
    setSuggestedSizes(opt.sizes);
  };

  // Kích hoạt AI Vision Scan nhận diện Hãng, Loại đồ (Áo/Quần), Màu sắc và Size
  const triggerAiScan = async (imageUrl, hint = '', explicitColor = '', explicitCategory = null) => {
    setIsScanning(true);
    setScanResult(null);

    // 1. Phân tích trực tiếp từ Canvas điểm ảnh và phom dáng
    const analysis = await analyzeImageProperties(imageUrl, hint, isMale);
    const detectedColor = explicitColor || analysis.color || 'Trắng';
    let detectedCatId = explicitCategory || analysis.categoryId || 1;
    if (isMale && detectedCatId === 3) detectedCatId = 1;

    // Cập nhật ngay danh mục và dải size đề xuất
    const catOpt = categoryOptions.find(c => c.id === detectedCatId) || categoryOptions[0];
    setSuggestedSizes(catOpt.sizes);

    setFormData(prev => ({
      ...prev,
      categoryId: detectedCatId,
      color: detectedColor,
      size: catOpt.sizes.includes(prev.size) ? prev.size : catOpt.defaultSize
    }));

    try {
      const res = await apiRequest('/ai/scan-clothing', {
        method: 'POST',
        body: JSON.stringify({ 
          imageUrl, 
          hint: hint || (detectedCatId === 2 ? `Quần màu ${detectedColor}` : `Áo màu ${detectedColor}`),
          colorHint: detectedColor,
          categoryHint: detectedCatId === 2 ? 'Bottoms' : detectedCatId === 3 ? 'Dresses' : detectedCatId === 5 ? 'Shoes' : 'Tops',
          aspectRatio: analysis.aspectRatio
        })
      });

      if (res.ok && res.data?.data) {
        const scan = res.data.data;
        setScanResult(scan);

        let finalCatId = scan.categoryId || detectedCatId;
        if (isMale && finalCatId === 3) finalCatId = 1;
        const targetCatOpt = categoryOptions.find(c => c.id === finalCatId) || catOpt;
        
        const sizes = scan.suggestedSizes && scan.suggestedSizes.length > 0 
          ? scan.suggestedSizes 
          : targetCatOpt.sizes;
        setSuggestedSizes(sizes);

        let defaultSize = sizes.includes('M') ? 'M' : sizes.includes('30') ? '30' : sizes[Math.min(1, sizes.length - 1)];
        const finalColor = scan.color || detectedColor;

        setFormData(prev => ({
          ...prev,
          imageUrl,
          brand: scan.brand || prev.brand || (finalCatId === 2 ? "Levi's" : "Zara"),
          name: scan.name || prev.name || (finalCatId === 2 ? `Quần Thời Trang Màu ${finalColor}` : `Áo Thời Trang Màu ${finalColor}`),
          categoryId: finalCatId,
          color: finalColor,
          style: scan.style || prev.style,
          season: scan.season || prev.season,
          size: defaultSize,
          description: scan.aiNotes || prev.description
        }));
      }
    } catch (err) {
      console.warn("AI Scan warning:", err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert("Dung lượng ảnh vượt quá 20MB. Vui lòng chọn ảnh nhỏ hơn.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Url = reader.result;
        setRawImageUrl(base64Url);
        setIsExtracting(true);

        // TỰ ĐỘNG BÓC TÁCH CẮT LỌC MỖI ITEM ÁO/QUẦN NGAY KHI TẢI LÊN
        let finalGarmentUrl = base64Url;
        let isSuccess = false;
        try {
          const result = await extractGarmentImage(base64Url, {
            tolerance: cutoutTolerance,
            autoCrop: true,
            removeHanger: true,
            removeHumanBody: true,
            edgeSmoothing: true
          });
          if (result.success && result.processedUrl) {
            finalGarmentUrl = result.processedUrl;
            isSuccess = true;
          }
        } catch (err) {
          console.warn("Auto garment extraction error:", err);
        } finally {
          setIsExtracting(false);
          setIsCutoutApplied(isSuccess);
        }

        setFormData(prev => ({
          ...prev,
          imageUrl: finalGarmentUrl
        }));

        // Tự động nhận diện Áo/Quần, Màu sắc và Hãng từ ảnh đã lọc
        triggerAiScan(finalGarmentUrl, file.name || '');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = async (preset) => {
    setRawImageUrl(preset.url);
    setIsCutoutApplied(false);
    setFormData(prev => ({
      ...prev,
      imageUrl: preset.url,
      categoryId: preset.cat,
      color: preset.color || prev.color,
      name: preset.name,
      brand: preset.brand || 'Zara'
    }));
    triggerAiScan(preset.url, preset.name, preset.color, preset.cat);
  };

  const handleUrlBlur = async (url) => {
    if (url && url.startsWith('http')) {
      setRawImageUrl(url);
      setIsExtracting(true);

      let finalGarmentUrl = url;
      let isSuccess = false;
      try {
        const result = await extractGarmentImage(url, {
          tolerance: cutoutTolerance,
          autoCrop: true,
          removeHanger: true,
          removeHumanBody: true,
          edgeSmoothing: true
        });
        if (result.success && result.processedUrl) {
          finalGarmentUrl = result.processedUrl;
          isSuccess = true;
        }
      } catch (err) {
        console.warn("Auto URL garment extraction error:", err);
      } finally {
        setIsExtracting(false);
        setIsCutoutApplied(isSuccess);
      }

      setFormData(prev => ({
        ...prev,
        imageUrl: finalGarmentUrl
      }));
      triggerAiScan(finalGarmentUrl);
    }
  };

  // Kích hoạt lại AI Bóc Tách Trang Phục & Xóa Nền (với độ nhạy tùy chỉnh)
  const handleExtractGarment = async (customTol) => {
    const currentImg = formData.imageUrl;
    if (!currentImg) {
      alert("Vui lòng tải ảnh lên trước khi bóc tách!");
      return;
    }

    const tol = typeof customTol === 'number' ? customTol : cutoutTolerance;
    setIsExtracting(true);
    try {
      const srcToProcess = rawImageUrl || currentImg;
      if (!rawImageUrl) setRawImageUrl(currentImg);

      const result = await extractGarmentImage(srcToProcess, {
        tolerance: tol,
        autoCrop: true,
        removeHanger: true,
        removeHumanBody: true,
        edgeSmoothing: true
      });

      if (result.success && result.processedUrl) {
        setFormData(prev => ({
          ...prev,
          imageUrl: result.processedUrl
        }));
        setIsCutoutApplied(true);
      } else {
        alert("Không thể tách nền ảnh này tự động. Bạn vẫn có thể dùng ảnh gốc bình thường!");
      }
    } catch (err) {
      console.warn("Garment extraction error:", err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleRevertCutout = () => {
    if (rawImageUrl) {
      setFormData(prev => ({
        ...prev,
        imageUrl: rawImageUrl
      }));
      setIsCutoutApplied(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên món đồ");
      return;
    }

    if (!formData.imageUrl) {
      alert("Vui lòng tải ảnh lên hoặc chọn ảnh minh họa cho món đồ");
      return;
    }

    setIsSubmitting(true);
    try {
      const categoryNames = {
        1: 'Tops',
        2: 'Bottoms',
        3: 'Dresses',
        4: 'Outerwear',
        5: 'Shoes',
        6: 'Accessories'
      };

      await onAdd({
        ...formData,
        categoryId: Number(formData.categoryId),
        categoryName: categoryNames[formData.categoryId],
        brand: formData.brand?.trim() || 'Chưa rõ hãng',
        size: formData.size?.trim() || 'FreeSize',
        color: formData.color?.trim() || 'Trắng'
      });

      // Reset form
      setFormData({
        name: '',
        categoryId: 1,
        color: 'Trắng',
        style: 'Casual',
        season: 'AllSeason',
        imageUrl: '',
        description: '',
        brand: '',
        size: 'M',
      });
      setScanResult(null);

      onClose();
    } catch (err) {
      console.error("Add clothing error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeColorObj = POPULAR_COLORS.find(c => c.name.toLowerCase() === formData.color?.toLowerCase()) || {
    name: formData.color || 'Trắng',
    hex: '#D4AF37',
    border: '#F3D98A'
  };

  const currentCatObj = categoryOptions.find(c => c.id === formData.categoryId) || categoryOptions[0];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(5, 8, 15, 0.88)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div 
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '94vh',
          overflowY: 'auto',
          padding: '28px',
          position: 'relative',
          border: '1px solid rgba(212, 175, 55, 0.45)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.85)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          <div>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: '#F3D98A', 
              fontSize: '0.78rem', 
              fontWeight: 800, 
              background: 'rgba(212, 175, 55, 0.12)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              marginBottom: '6px' 
            }}>
              <Sparkles size={13} color="#D4AF37" />
              <span>✦ AI VISION SMART CLOTHING SCANNER</span>
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFF' }}>
              Tự Động Nhận Diện Áo, Quần, Hãng & Màu Sắc
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              AI tự động đọc <strong style={{ color: '#F3D98A' }}>Áo hay Quần</strong>, <strong style={{ color: '#F3D98A' }}>Hãng</strong> và <strong style={{ color: '#F3D98A' }}>Màu sắc</strong>. Bạn chỉ cần <strong style={{ color: '#FFF' }}>chọn Size</strong>!
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Image Upload Zone */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#F3D98A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={15} /> Ảnh Món Đồ <span style={{ color: '#EF4444' }}>*</span>
              </label>
              {formData.imageUrl && (
                <button
                  type="button"
                  onClick={() => triggerAiScan(formData.imageUrl)}
                  disabled={isScanning}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#F3D98A',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Zap size={13} /> {isScanning ? 'Đang quét...' : 'Quét lại AI'}
                </button>
              )}
            </div>

            {/* Source Switcher Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => setImageSourceTab('file')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: imageSourceTab === 'file' ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: imageSourceTab === 'file' ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: imageSourceTab === 'file' ? '#F3D98A' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <Camera size={14} />
                <span>Tải ảnh từ máy / Chụp</span>
              </button>

              <button
                type="button"
                onClick={() => setImageSourceTab('presets')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: imageSourceTab === 'presets' ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: imageSourceTab === 'presets' ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: imageSourceTab === 'presets' ? '#F3D98A' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <Sparkles size={14} />
                <span>Chọn mẫu có sẵn</span>
              </button>

              <button
                type="button"
                onClick={() => setImageSourceTab('url')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: imageSourceTab === 'url' ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: imageSourceTab === 'url' ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: imageSourceTab === 'url' ? '#F3D98A' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <LinkIcon size={14} />
                <span>Nhập URL</span>
              </button>
            </div>

            {/* Hidden native file input */}
            <input 
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {/* File Upload Box */}
            {imageSourceTab === 'file' && (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isScanning ? '2px solid #F3D98A' : '2px dashed rgba(212, 175, 55, 0.4)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px 16px',
                  textAlign: 'center',
                  background: isScanning ? 'rgba(212, 175, 55, 0.1)' : 'rgba(212, 175, 55, 0.04)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'var(--transition)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '110px'
                }}
              >
                {/* Laser scan effect while scanning */}
                {isScanning && <div className="scanner-beam" />}

                {formData.imageUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', justifyContent: 'center' }}>
                    <div style={{
                      position: 'relative',
                      width: '80px',
                      height: '80px',
                      flexShrink: 0,
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: '2px solid var(--primary)',
                      background: 'repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%) 50% / 12px 12px'
                    }}>
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                      />
                      {isCutoutApplied && (
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          left: '2px',
                          right: '2px',
                          background: 'rgba(16, 185, 129, 0.92)',
                          color: '#FFF',
                          fontSize: '0.55rem',
                          fontWeight: 800,
                          padding: '1px 2px',
                          borderRadius: '2px',
                          textAlign: 'center'
                        }}>
                          ĐÃ LỌC CẢNH
                        </div>
                      )}
                      {(isScanning || isExtracting) && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(10, 15, 28, 0.65)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Scan size={22} color="#F3D98A" className="animate-spin" />
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      {isExtracting ? (
                        <div style={{ color: '#F3D98A', fontWeight: 800, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Scissors size={15} className="animate-spin" /> AI đang cắt lọc trang phục, loại bỏ cảnh vật...
                        </div>
                      ) : isScanning ? (
                        <div style={{ color: '#F3D98A', fontWeight: 800, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Sparkles size={15} className="animate-spin" /> AI đang phân tích Áo/Quần, Màu sắc & Thương hiệu...
                        </div>
                      ) : isCutoutApplied ? (
                        <div style={{ color: '#10B981', fontWeight: 800, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCheck size={16} /> Đã lọc sạch cảnh vật quanh {currentCatObj.name} (Chỉ giữ item)
                        </div>
                      ) : (
                        <div style={{ color: '#10B981', fontWeight: 800, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ShieldCheck size={16} /> AI đã nhận diện: {currentCatObj.name} • {formData.brand || 'Thương hiệu'}
                        </div>
                      )}
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Bấm vào đây nếu bạn muốn đổi sang ảnh khác
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(212, 175, 55, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#F3D98A',
                      marginBottom: '8px'
                    }}>
                      <Upload size={20} />
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>
                      Bấm để tải ảnh hoặc chụp Áo / Quần / Giày
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      Hỗ trợ JPG, PNG, WEBP (Tự động nhận diện Áo/Quần & Màu sắc tức thì)
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Preset selector with regular presets and studio cutout assets */}
            {imageSourceTab === 'presets' && (
              <div>
                <div style={{ fontSize: '0.74rem', color: '#F3D98A', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={12} />
                  <span>Bộ Trang Phục Mẫu Đã Tách Nền Chuẩn Studio (Thử đồ tức thì):</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px', marginBottom: '14px' }}>
                  {segmentedPresets.map((preset, idx) => {
                    const isSel = formData.imageUrl === preset.imageUrl;
                    return (
                      <div
                        key={preset.id || idx}
                        onClick={() => handleSelectPreset({
                          url: preset.imageUrl,
                          cat: preset.categoryId,
                          color: preset.color,
                          name: preset.name,
                          brand: preset.brand
                        })}
                        style={{
                          height: '74px',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          position: 'relative',
                          border: isSel ? '2px solid var(--primary)' : '1px solid rgba(212, 175, 55, 0.25)',
                          background: 'rgba(10, 15, 26, 0.8)',
                          opacity: isSel ? 1 : 0.85,
                          transition: 'var(--transition)',
                        }}
                        title={`${preset.brand} - ${preset.name} (Tách nền chuẩn)`}
                      >
                        <img src={preset.imageUrl} alt={preset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          background: 'rgba(16, 185, 129, 0.9)',
                          color: '#FFF',
                          fontSize: '0.55rem',
                          fontWeight: 800,
                          padding: '1px 4px',
                          borderRadius: '3px'
                        }}>
                          PNG CUTOUT
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'rgba(5, 8, 15, 0.85)',
                          fontSize: '0.62rem',
                          color: '#FFF',
                          padding: '2px 4px',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          <strong style={{ color: '#F3D98A' }}>{preset.brand}</strong> • {preset.color}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Các mẫu trang phục đời thường khác:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '8px' }}>
                  {presetImages.map((preset, idx) => {
                    const isSel = formData.imageUrl === preset.url;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectPreset(preset)}
                        style={{
                          height: '65px',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          position: 'relative',
                          border: isSel ? '2px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                          opacity: isSel ? 1 : 0.7,
                          transition: 'var(--transition)',
                        }}
                        title={`${preset.brand} - ${preset.name}`}
                      >
                        <img src={preset.url} alt={preset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'rgba(5, 8, 15, 0.85)',
                          fontSize: '0.6rem',
                          color: '#FFF',
                          padding: '2px 4px',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {preset.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom URL input */}
            {imageSourceTab === 'url' && (
              <div>
                <input
                  type="url"
                  id="input-clothing-image-url"
                  placeholder="Dán đường link ảnh (https://...)"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  onBlur={(e) => handleUrlBlur(e.target.value)}
                  style={{ width: '100%', fontSize: '0.88rem' }}
                />
              </div>
            )}

            {/* AI GARMENT EXTRACTOR ACTION PANEL */}
            {formData.imageUrl && (
              <div style={{
                marginTop: '12px',
                padding: '14px 18px',
                background: isCutoutApplied 
                  ? 'rgba(16, 185, 129, 0.12)' 
                  : 'rgba(212, 175, 55, 0.08)',
                border: isCutoutApplied 
                  ? '1px solid rgba(16, 185, 129, 0.4)' 
                  : '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isCutoutApplied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(212, 175, 55, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isCutoutApplied ? (
                        <CheckCheck size={18} color="#10B981" />
                      ) : (
                        <Scissors size={18} color="#D4AF37" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: isCutoutApplied ? '#A7F3D0' : '#F3D98A' }}>
                        {isCutoutApplied 
                          ? '✅ Đã Bóc Tách: Chỉ Lưu Item Áo/Quần (Không Lấy Cảnh Vật)' 
                          : 'AI Bóc Tách Quần Áo & Lọc Bỏ Cảnh Vật Xung Quanh'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        {isCutoutApplied 
                          ? 'Đã lọc sạch phòng ngủ, nền sàn, móc treo và người mặc để chỉ giữ lại món đồ chuẩn trong suốt.'
                          : 'Tự động cắt lọc chỉ lấy áo/quần/váy, loại bỏ phòng, sàn gạch, móc treo và da người.'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isCutoutApplied ? (
                      <button
                        type="button"
                        onClick={handleRevertCutout}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: 'var(--text-secondary)',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        So sánh với ảnh gốc
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleExtractGarment()}
                        disabled={isExtracting}
                        style={{
                          background: 'linear-gradient(135deg, #D4AF37, #C27D5E)',
                          color: '#080A0F',
                          border: 'none',
                          padding: '7px 16px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: isExtracting ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                        }}
                      >
                        <Scissors size={14} />
                        <span>{isExtracting ? 'Đang lọc...' : 'Cắt Lọc Cảnh Vật Ngay'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Sensitivity / Tolerance Adjuster */}
                {isCutoutApplied && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.72rem',
                    color: 'var(--text-secondary)',
                    flexWrap: 'wrap'
                  }}>
                    <span>Độ sâu cắt lọc cảnh vật:</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[
                        { label: 'Cơ Bản (24)', val: 24 },
                        { label: 'Tiêu Chuẩn (32)', val: 32 },
                        { label: 'Sâu Hơn (45)', val: 45 }
                      ].map(lvl => (
                        <button
                          key={lvl.val}
                          type="button"
                          onClick={() => {
                            setCutoutTolerance(lvl.val);
                            handleExtractGarment(lvl.val);
                          }}
                          style={{
                            background: cutoutTolerance === lvl.val ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                            border: cutoutTolerance === lvl.val ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                            color: cutoutTolerance === lvl.val ? '#F3D98A' : 'var(--text-muted)',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            fontWeight: 600
                          }}
                        >
                          {lvl.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI SCAN RESULT HERO: LOẠI ĐỒ (ÁO/QUẦN), BRAND, COLOR & SIZE */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(20, 24, 38, 0.8))',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {/* ROW 1: TỰ ĐỘNG NHẬN DIỆN LÀ ÁO HAY QUẦN (CATEGORY) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={16} color="#D4AF37" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#F3D98A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Loại Trang Phục (AI Phân Loại):
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ color: '#FFF', fontSize: '0.86rem' }}>{currentCatObj.icon} {currentCatObj.name}</strong>
                  <span className="badge badge-indigo" style={{ fontSize: '0.7rem', padding: '2px 7px' }}>
                    ✦ AI Category
                  </span>
                </div>
              </div>

              {/* Category selector pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {categoryOptions.map((cat) => {
                  const isSelected = formData.categoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        background: isSelected 
                          ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.35), rgba(212, 175, 55, 0.15))' 
                          : 'rgba(255, 255, 255, 0.05)',
                        border: isSelected ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.12)',
                        color: isSelected ? '#F3D98A' : 'var(--text-secondary)',
                        boxShadow: isSelected ? '0 0 12px rgba(212, 175, 55, 0.3)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                      {isSelected && <Check size={13} strokeWidth={3} color="#D4AF37" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ROW 2: BRAND (HÃNG THỜI TRANG) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={16} color="#D4AF37" />
                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#F3D98A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Hãng Quần Áo (Brand):
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end', minWidth: '220px' }}>
                <input
                  type="text"
                  required
                  id="input-clothing-brand"
                  placeholder="Hãng (VD: Zara, Uniqlo, Nike, Levi's...)"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    color: '#FFF',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(212, 175, 55, 0.5)',
                    maxWidth: '220px',
                    textAlign: 'center'
                  }}
                />
                <span className="badge badge-gold" style={{ fontSize: '0.72rem', padding: '4px 8px' }}>
                  ✦ AI Brand
                </span>
              </div>
            </div>

            {/* ROW 3: COLOR (MÀU SẮC NHẬN DIỆN ĐƯỢC TỪ ẢNH) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Palette size={16} color="#D4AF37" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#F3D98A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Màu Sắc Nhận Diện:
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: activeColorObj.hex,
                    border: `2px solid ${activeColorObj.border}`
                  }} />
                  <strong style={{ color: '#FFF', fontSize: '0.86rem' }}>{formData.color || 'Trắng'}</strong>
                  <span className="badge badge-emerald" style={{ fontSize: '0.7rem', padding: '2px 7px' }}>
                    ✦ AI Color
                  </span>
                </div>
              </div>

              {/* Quick 1-Click Color Selector Pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {POPULAR_COLORS.map((col) => {
                  const isSelected = formData.color?.toLowerCase() === col.name.toLowerCase();
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: col.name })}
                      style={{
                        padding: '5px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        background: isSelected ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: isSelected ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.12)',
                        color: isSelected ? '#F3D98A' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        backgroundColor: col.hex,
                        border: `1px solid ${col.border}`
                      }} />
                      <span>{col.label}</span>
                      {isSelected && <Check size={12} strokeWidth={3} color="#D4AF37" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ROW 4: SIZE SELECTOR (TỰ ĐỘNG CHUYỂN DẢI SIZE ÁO HOẶC QUẦN) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Ruler size={15} color="#D4AF37" />
                  <span>Chọn Size {formData.categoryId === 2 ? 'Quần' : formData.categoryId === 5 ? 'Giày' : 'Áo'}</span>
                  <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <span style={{ fontSize: '0.74rem', color: '#F3D98A', fontWeight: 600 }}>
                  (Bấm 1 chạm để chọn)
                </span>
              </div>

              {/* Quick Size Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {suggestedSizes.map((sz) => {
                  const isSelected = formData.size === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFormData({ ...formData, size: sz })}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        background: isSelected 
                          ? 'linear-gradient(135deg, #D4AF37, #B89628)' 
                          : 'rgba(255, 255, 255, 0.07)',
                        color: isSelected ? '#000' : '#FFF',
                        border: isSelected ? '1px solid #FFF' : '1px solid rgba(255, 255, 255, 0.12)',
                        boxShadow: isSelected ? '0 0 15px rgba(212, 175, 55, 0.5)' : 'none',
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} />}
                      <span>{sz}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Size Input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Hoặc nhập size tùy chỉnh:
                </span>
                <input
                  type="text"
                  id="input-clothing-size"
                  placeholder={formData.categoryId === 2 ? "VD: 29x32, 31..." : "VD: Oversize, FreeSize..."}
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.8rem',
                    width: '140px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#F3D98A',
                    fontWeight: 700
                  }}
                />
              </div>
            </div>

            {/* AI Note notification */}
            {formData.name && (
              <div style={{
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '3px solid #D4AF37'
              }}>
                <strong style={{ color: '#FFF' }}>AI Đã Nhận Diện: </strong> 
                <span style={{ color: '#F3D98A' }}>{currentCatObj.name}</span> • 
                <span style={{ color: '#FFF' }}> Hãng {formData.brand || 'Zara'}</span> • 
                <span style={{ color: activeColorObj.hex }}> Màu {formData.color}</span> • 
                <span style={{ color: '#FFF' }}> Size {formData.size}</span>
              </div>
            )}
          </div>

          {/* Toggle Advanced Details Accordion */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 0'
              }}
            >
              <span>{showAdvanced ? 'Ẩn thông số chi tiết nâng cao' : 'Xem & chỉnh sửa chi tiết món đồ (Tùy chọn)'}</span>
              {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Collapsible Advanced Form Section */}
          {showAdvanced && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Tên món đồ
                </label>
                <input
                  type="text"
                  required
                  id="input-clothing-name"
                  placeholder="VD: Áo sơ mi lụa trắng Zara..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', fontSize: '0.86rem' }}
                />
              </div>

              {/* Style & Season */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Phong cách (Style)
                  </label>
                  <select
                    id="select-clothing-style"
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                    style={{ width: '100%', fontSize: '0.86rem' }}
                  >
                    <option value="Casual">Casual (Thường ngày)</option>
                    <option value="Formal">Formal (Công sở / Thanh lịch)</option>
                    <option value="Minimalist">Minimalist (Tối giản)</option>
                    <option value="Streetwear">Streetwear (Cá tính)</option>
                    <option value="Vintage">Vintage (Cổ điển)</option>
                    <option value="Sporty">Sporty (Thể thao)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Mùa phù hợp (Season)
                  </label>
                  <select
                    id="select-clothing-season"
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    style={{ width: '100%', fontSize: '0.86rem' }}
                  >
                    <option value="AllSeason">Tất cả các mùa (All-Season)</option>
                    <option value="Summer">Mùa hè (Summer)</option>
                    <option value="Winter">Mùa đông (Winter)</option>
                    <option value="Spring">Mùa xuân (Spring)</option>
                    <option value="Fall">Mùa thu (Fall)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Ghi chú thêm
                </label>
                <textarea
                  rows={2}
                  id="input-clothing-description"
                  placeholder="Ghi chú về chất liệu hoặc phom dáng..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', fontSize: '0.86rem', resize: 'none' }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              id="btn-submit-add-clothing"
              className="btn-primary"
              disabled={isSubmitting || !formData.imageUrl}
              style={{ padding: '10px 24px', fontSize: '0.92rem' }}
            >
              <Sparkles size={16} />
              <span>{isSubmitting ? 'Đang Lưu...' : 'Lưu Vào Tủ Đồ Của Tôi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
