import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Sparkles,
  Ruler,
  RotateCcw,
  Check,
  Zap,
  Info,
  Layers,
  UserCheck,
  Sliders,
  Compass,
  Play,
  Pause
} from 'lucide-react';
import { extractGarmentImage } from '../utils/garmentExtractor';

/**
 * 5 Dáng Người Chuẩn Nhân Trắc Học (Standard Body Shapes)
 */
const BODY_SHAPE_DEFS = [
  {
    id: 'Đồng hồ cát',
    alias: ['dong ho cat', 'hourglass'],
    icon: '⏳',
    label: 'Đồng hồ cát',
    desc: 'Vòng 1 & 3 nở nang cân đối, eo thắt thon gọn chữ S rõ nét',
    modifiers: {
      shoulder: 1.0,
      chest: 1.08,
      waist: 0.76, // Eo thắt sâu
      hips: 1.16,  // Hông uốn lượn chữ S
      thigh: 1.05
    }
  },
  {
    id: 'Quả lê',
    alias: ['qua le', 'pear', 'triangle'],
    icon: '🍐',
    label: 'Quả lê',
    desc: 'Hông & đùi nở rộng đầy đặn, phần ngực và vai thon nhỏ',
    modifiers: {
      shoulder: 0.90, // Vai nhỏ
      chest: 0.92,    // Ngực nhỏ
      waist: 0.94,    // Eo thon
      hips: 1.28,     // HÔNG NỞ RỘNG ĐẶC BIỆT
      thigh: 1.25     // ĐÙI ĐẦY ĐẶN
    }
  },
  {
    id: 'Quả táo',
    alias: ['qua tao', 'apple', 'round'],
    icon: '🍏',
    label: 'Quả táo',
    desc: 'Vòng 2 & bụng đầy đặn tròn trịa, ngực nở, chân thon',
    modifiers: {
      shoulder: 1.05,
      chest: 1.12,    // Ngực lớn
      waist: 1.35,    // EO & BỤNG TO ĐẦY ĐẶN
      hips: 0.93,     // Hông gọn
      thigh: 0.88     // Chân thon
    }
  },
  {
    id: 'Tam giác ngược',
    alias: ['tam giac nguoc', 'inverted', 'v-shape'],
    icon: '🔻',
    label: 'Tam giác ngược',
    desc: 'Bờ vai rộng chữ V & ngực nở vạm vỡ, eo và hông thon nhỏ',
    modifiers: {
      shoulder: 1.28, // BỜ VAI RỘNG CHỮ V
      chest: 1.18,    // Ngực nở
      waist: 0.96,    // Eo thon
      hips: 0.84,     // Hông nhỏ
      thigh: 0.86
    }
  },
  {
    id: 'Thước kẻ',
    alias: ['thuoc ke', 'rectangle', 'straight', 'banana'],
    icon: '📐',
    label: 'Thước kẻ',
    desc: '3 vòng cân đối, vóc dáng suôn thẳng hình chữ nhật thể thao',
    modifiers: {
      shoulder: 1.0,
      chest: 0.96,
      waist: 1.08,    // Thân suôn, ít thắt eo
      hips: 0.96,
      thigh: 0.96
    }
  }
];

// Hàm nội suy Smoothstep mềm mại bậc 3 (C1 Continuity)
function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

// Nội suy tỷ lệ co giãn theo trục dọc
function interpolateScale(t, anchors) {
  if (t <= anchors[0][0]) return anchors[0][1];
  if (t >= anchors[anchors.length - 1][0]) return anchors[anchors.length - 1][1];

  for (let i = 0; i < anchors.length - 1; i++) {
    const [t0, s0] = anchors[i];
    const [t1, s1] = anchors[i + 1];
    if (t >= t0 && t <= t1) {
      const f = smoothstep(t0, t1, t);
      return s0 + f * (s1 - s0);
    }
  }
  return 1.0;
}

// Cache bóc tách nền trang phục tự động
const garmentBgRemovalCache = new Map();

/**
 * Component hiển thị trang phục đã bóc tách nền 100%
 * Đảm bảo chỉ hiển thị duy nhất quần áo, loại bỏ hoàn toàn khung cảnh, phòng ốc, sàn nhà, người mẫu
 */
function IsolatedClothingImage({ src, alt = '', style = {}, maxHeight = '250px' }) {
  const [cleanSrc, setCleanSrc] = useState(() => {
    if (!src) return '';
    return garmentBgRemovalCache.get(src) || src;
  });

  useEffect(() => {
    if (!src) {
      setCleanSrc('');
      return;
    }

    if (garmentBgRemovalCache.has(src)) {
      setCleanSrc(garmentBgRemovalCache.get(src));
      return;
    }

    // Nếu đã là SVG hoặc tài nguyên bóc tách sẵn trong /assets/clothes/
    if (src.endsWith('.svg') || src.includes('data:image/svg') || src.includes('/assets/clothes/')) {
      garmentBgRemovalCache.set(src, src);
      setCleanSrc(src);
      return;
    }

    let isMounted = true;
    extractGarmentImage(src, {
      tolerance: 32,
      autoCrop: true,
      removeHanger: true,
      removeHumanBody: true,
      edgeSmoothing: true
    }).then(res => {
      if (isMounted && res && res.processedUrl) {
        garmentBgRemovalCache.set(src, res.processedUrl);
        setCleanSrc(res.processedUrl);
      }
    }).catch(() => {
      if (isMounted) setCleanSrc(src);
    });

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <img
      src={cleanSrc || src}
      alt={alt}
      style={{
        width: '100%',
        height: 'auto',
        maxHeight,
        objectFit: 'contain',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        display: 'block',
        ...style
      }}
    />
  );
}

/**
 * Component Mô Hình Ma-nơ-canh Showroom Giữ Nguyên Hình Ảnh Thật
 * Nhưng Điều Chỉnh Form Người Chuẩn Xác Theo Dáng Người (Quả lê, Quả táo,...) & Số Đo
 */
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
  height: propHeight,
  weight: propWeight,
  chest: propChest,
  waist: propWaist,
  hips: propHips,
  bodyShape: propBodyShape,
  gender: propGender,
  showControls = true,
  interactive = true,
  compact = false
}) {
  const resolvedTop = top || topItem;
  const resolvedOuter = outer || outerwearItem;
  const resolvedBottom = bottom || bottomItem;
  const resolvedShoes = shoes || shoesItem;
  const resolvedAccessory = accessory;

  const isDress = resolvedBottom?.categoryName?.toLowerCase() === 'dresses' ||
                  resolvedBottom?.name?.toLowerCase().includes('đầm') ||
                  resolvedBottom?.name?.toLowerCase().includes('váy liền') ||
                  resolvedTop?.categoryName?.toLowerCase() === 'dresses' ||
                  resolvedTop?.name?.toLowerCase().includes('đầm');

  // Lấy profile người dùng trực tiếp từ props hoặc localStorage
  const resolvedUser = (user && Object.keys(user).length > 0)
    ? user
    : (() => {
      try {
        const stored = localStorage.getItem('myfitdaily_user');
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    })();

  const height = Number(resolvedUser?.height ?? propHeight) || 165;
  const weight = Number(resolvedUser?.weight ?? propWeight) || 52;
  const chest = Number(resolvedUser?.chest ?? propChest) || 86;
  const waist = Number(resolvedUser?.waist ?? propWaist) || 64;
  const hips = Number(resolvedUser?.hips ?? propHips) || 92;

  // TỰ ĐỘNG LẤY GIỚI TÍNH TỪ HỒ SƠ CỦA NGƯỜI DÙNG (Nam: Manocanh bên trái, Nữ: Manocanh bên phải)
  const profileGender = (
    resolvedUser?.gender ||
    user?.gender ||
    propGender ||
    'Female'
  ).toString().trim().toLowerCase();

  const isMale = profileGender === 'male' || profileGender === 'nam';

  // DÁNG NGƯỜI ĐƯỢC LẤY TRỰC TIẾP TỪ PROFILE NGƯỜI DÙNG (KHÔNG CHO CHỌN THỦ CÔNG)
  // Nếu profile người dùng chưa chọn tên dáng, tự động tính theo tỉ lệ số đo 3 vòng của hồ sơ
  const detectShapeFromMetrics = (c, w, h) => {
    if (w <= 0 || h <= 0) return 'Đồng hồ cát';
    if (c > 0 && w > 0 && h > 0) {
      if (w <= 0.75 * h && Math.abs(c - h) <= 6) return 'Đồng hồ cát';
      if (h - c >= 5 && w < h) return 'Quả lê';
      if (c - h >= 5) return 'Tam giác ngược';
      if (w >= 0.85 * h) return 'Quả táo';
      return 'Thước kẻ';
    }
    if (w / h <= 0.75) return 'Đồng hồ cát';
    if (w / h >= 0.85) return 'Quả táo';
    return 'Thước kẻ';
  };

  const normalizeText = (str) => {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .trim();
  };

  const userProfileShapeStr = (
    resolvedUser?.bodyShape ||
    user?.bodyShape ||
    propBodyShape ||
    detectShapeFromMetrics(chest, waist, hips)
  ).toString().trim();

  const findShapeDef = (inputStr) => {
    const norm = normalizeText(inputStr);
    return BODY_SHAPE_DEFS.find(b => {
      const bNorm = normalizeText(b.id);
      if (norm.includes(bNorm) || bNorm.includes(norm)) return true;
      return b.alias.some(a => {
        const aNorm = normalizeText(a);
        return norm.includes(aNorm) || aNorm.includes(norm);
      });
    }) || (isMale ? BODY_SHAPE_DEFS[3] : BODY_SHAPE_DEFS[0]);
  };

  const activeShapeObj = findShapeDef(userProfileShapeStr);

  // Tùy chọn hiển thị
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [activeSlotFocus, setActiveSlotFocus] = useState(null);

  // =========================================================================
  // HỆ THỐNG XOAY 3D SÂN KHẤU SHOWROOM (3D TURNTABLE ROTATION SYSTEM)
  // =========================================================================
  const [rotation, setRotation] = useState(0); // Góc xoay từ -180 đến +180 độ (0 = Mặt trước)
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const startRotationRef = useRef(0);
  const autoRotateAnimRef = useRef(null);

  // Vòng lặp xoay 360 độ tự động (Showroom Runway Turntable Loop)
  useEffect(() => {
    if (!isAutoRotating) {
      if (autoRotateAnimRef.current) cancelAnimationFrame(autoRotateAnimRef.current);
      return;
    }
    let lastTime = performance.now();
    const step = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      setRotation(prev => {
        let next = prev + dt * 36; // Tốc độ xoay 36 độ / giây mượt mà
        if (next > 180) next -= 360;
        return next;
      });
      autoRotateAnimRef.current = requestAnimationFrame(step);
    };
    autoRotateAnimRef.current = requestAnimationFrame(step);
    return () => {
      if (autoRotateAnimRef.current) cancelAnimationFrame(autoRotateAnimRef.current);
    };
  }, [isAutoRotating]);

  // Lắng nghe sự kiện kéo chuột toàn màn hình khi đang xoay
  useEffect(() => {
    const handleWindowMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartXRef.current;
      let next = startRotationRef.current + deltaX * 0.75;
      while (next > 180) next -= 360;
      while (next < -180) next += 360;
      setRotation(Math.round(next));
    };

    const handleWindowMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging]);

  const handleStageMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setIsAutoRotating(false);
    dragStartXRef.current = e.clientX;
    startRotationRef.current = rotation;
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setIsAutoRotating(false);
      dragStartXRef.current = e.touches[0].clientX;
      startRotationRef.current = rotation;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartXRef.current;
    let next = startRotationRef.current + deltaX * 0.75;
    while (next > 180) next -= 360;
    while (next < -180) next += 360;
    setRotation(Math.round(next));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const getAngleLabel = (deg) => {
    const d = Math.round(deg);
    if (d >= -15 && d <= 15) return 'Mặt Trước (0°)';
    if (d > 15 && d <= 65) return 'Nghiêng Phải (+45°)';
    if (d > 65 && d <= 115) return 'Cạnh Phải (+90°)';
    if (d > 115 && d <= 165) return 'Góc Sau (+135°)';
    if (d > 165 || d < -165) return 'Mặt Sau (180°)';
    if (d >= -165 && d < -115) return 'Góc Sau (-135°)';
    if (d >= -115 && d < -65) return 'Cạnh Trái (-90°)';
    if (d >= -65 && d < -15) return 'Nghiêng Trái (-45°)';
    return `${d}°`;
  };

  // Đường dẫn hình ảnh gốc của ma-nơ-canh (Chính xác từ ảnh showroom người dùng cung cấp)
  const mannequinImgSrc = isMale
    ? '/assets/mannequin_male.png'
    : '/assets/mannequin_female.png';

  // 1. TÍNH TOÁN CÁC HỆ SỐ FORM NGƯỜI (SHOULDER, CHEST, WAIST, HIPS)
  const formModifiers = useMemo(() => {
    const bmi = weight / Math.pow(height / 100, 2);
    const whr = hips > 0 ? (waist / hips) : 0.7;

    const baseChestRef = isMale ? 96 : 86;
    const baseWaistRef = isMale ? 78 : 64;
    const baseHipsRef = isMale ? 94 : 92;

    const chestRatio = chest / baseChestRef;
    const waistRatio = waist / baseWaistRef;
    const hipsRatio = hips / baseHipsRef;

    const mods = activeShapeObj.modifiers;

    // Tính hệ số co giãn thực tế theo dáng người và số đo
    const sShoulder = mods.shoulder * Math.max(0.85, Math.min(1.25, (chestRatio * 0.4 + 0.6)));
    const sChest = mods.chest * Math.max(0.78, Math.min(1.35, chestRatio));
    const sWaist = mods.waist * Math.max(0.75, Math.min(1.4, waistRatio));
    const sHips = mods.hips * Math.max(0.78, Math.min(1.4, hipsRatio));
    const sThigh = mods.thigh * Math.max(0.8, Math.min(1.35, hipsRatio));

    return {
      bmi: bmi.toFixed(1),
      whr: whr.toFixed(2),
      sShoulder,
      sChest,
      sWaist,
      sHips,
      sThigh
    };
  }, [height, weight, chest, waist, hips, isMale, activeShapeObj]);

  // 2. DUAL CANVAS WARP ENGINES: MẶT TRƯỚC (NGỰC/BỤNG) & MẶT SAU (LƯNG/MÔNG)
  const canvasFrontRef = useRef(null);
  const canvasBackRef = useRef(null);

  const frontImgSrc = isMale
    ? '/assets/mannequin_male.png'
    : '/assets/mannequin_female.png';

  const backImgSrc = isMale
    ? '/assets/mannequin_male_back.jpg'
    : '/assets/mannequin_female_back.jpg';

  // 2.1 Vẽ Mặt Trước: Khuôn mặt, Ngực, Bụng, Đùi trước
  useEffect(() => {
    const canvas = canvasFrontRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();

    const drawFront = () => {
      const renderW = 340;
      const renderH = 550;
      canvas.width = renderW * 2;
      canvas.height = renderH * 2;
      ctx.scale(2, 2);
      ctx.clearRect(0, 0, renderW, renderH);

      const { sShoulder, sChest, sWaist, sHips, sThigh } = formModifiers;

      const anchorsFront = isMale ? [
        [0.00, 1.0],
        [0.16, 1.0],
        [0.21, 1.0],
        [0.25, sShoulder],
        [0.31, sChest],
        [0.41, sWaist],
        [0.51, sHips],
        [0.63, sThigh],
        [0.75, (sThigh + 1.0) / 2],
        [0.86, 1.0],
        [0.94, 1.0],
        [1.00, 1.0]
      ] : [
        [0.00, 1.0],
        [0.17, 1.0],
        [0.22, 1.0],
        [0.26, sShoulder],
        [0.31, sChest],
        [0.40, sWaist],
        [0.50, sHips],
        [0.62, sThigh],
        [0.74, (sThigh + 1.0) / 2],
        [0.86, 1.0],
        [0.94, 1.0],
        [1.00, 1.0]
      ];

      const numSlices = 140;
      const sliceH = renderH / numSlices;
      const srcSliceH = img.height / numSlices;
      const baseDrawW = renderW * 0.88;

      for (let i = 0; i < numSlices; i++) {
        const t = (i + 0.5) / numSlices;
        const scaleX = interpolateScale(t, anchorsFront);
        const currentW = baseDrawW * scaleX;
        const currentX = (renderW - currentW) / 2;
        const currentY = i * sliceH;

        ctx.drawImage(
          img,
          0, i * srcSliceH, img.width, srcSliceH,
          currentX, currentY, currentW, sliceH + 0.5
        );
      }
    };

    img.onload = drawFront;
    img.src = frontImgSrc;
    if (img.complete) drawFront();
  }, [frontImgSrc, formModifiers, isMale]);

  // 2.2 Vẽ Mặt Sau: Lưng, Bả vai, Rãnh sống lưng, Eo lưng, MÔNG ĐẦY ĐẶN, Đùi sau và Thanh chống
  useEffect(() => {
    const canvas = canvasBackRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();

    const drawBack = () => {
      const renderW = 340;
      const renderH = 550;
      canvas.width = renderW * 2;
      canvas.height = renderH * 2;
      ctx.scale(2, 2);
      ctx.clearRect(0, 0, renderW, renderH);

      const { sShoulder, sChest, sWaist, sHips, sThigh } = formModifiers;

      // Mốc giải phẫu mặt sau: Vai sau, lưng trên, eo lưng, MÔNG CONG
      const anchorsBack = isMale ? [
        [0.00, 1.0],         // Đỉnh đầu sau (không có khuôn mặt)
        [0.16, 1.0],         // Gáy sau
        [0.21, 1.0],         // Cổ sau
        [0.25, sShoulder],   // Vai sau rộng
        [0.31, sChest],      // Lưng trên & cơ xô
        [0.41, sWaist],      // Thắt eo lưng
        [0.52, sHips],       // MÔNG NAM THỂ THAO & HÔNG
        [0.63, sThigh],      // Đùi sau
        [0.75, (sThigh + 1.0) / 2], // Khoeo gối
        [0.86, 1.0],         // Bắp chuối sau
        [0.94, 1.0],         // Cổ chân sau
        [1.00, 1.0]          // Gót chân & thanh chống chrome
      ] : [
        [0.00, 1.0],         // Đỉnh đầu sau
        [0.17, 1.0],         // Gáy sau
        [0.22, 1.0],         // Cổ sau
        [0.26, sShoulder],   // Bả vai sau
        [0.31, sChest],      // Lưng trên
        [0.40, sWaist],      // Thắt eo lưng sâu
        [0.52, sHips],       // MÔNG NỮ CONG TRÒN & HÔNG NỞ
        [0.62, sThigh],      // Đùi sau
        [0.74, (sThigh + 1.0) / 2], // Khoeo gối
        [0.86, 1.0],         // Bắp chân
        [0.94, 1.0],         // Cổ chân
        [1.00, 1.0]          // Gót chân & thanh chống chrome
      ];

      const numSlices = 140;
      const sliceH = renderH / numSlices;
      const srcSliceH = img.height / numSlices;
      const baseDrawW = renderW * 0.88;

      for (let i = 0; i < numSlices; i++) {
        const t = (i + 0.5) / numSlices;
        const scaleX = interpolateScale(t, anchorsBack);
        const currentW = baseDrawW * scaleX;
        const currentX = (renderW - currentW) / 2;
        const currentY = i * sliceH;

        ctx.drawImage(
          img,
          0, i * srcSliceH, img.width, srcSliceH,
          currentX, currentY, currentW, sliceH + 0.5
        );
      }
    };

    img.onload = drawBack;
    img.src = backImgSrc;
    if (img.complete) drawBack();
  }, [backImgSrc, formModifiers, isMale]);

  // Vị trí định vị trang phục theo form đã co giãn
  const { sShoulder, sChest, sWaist, sHips } = formModifiers;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      userSelect: 'none'
    }}>
      {/* 1. THANH THÔNG TIN VÓC DÁNG THEO PROFILE (TOP BAR) */}
      {showControls && (
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          padding: '8px 14px',
          background: 'rgba(12, 16, 26, 0.85)',
          backdropFilter: 'blur(12px)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          fontSize: '0.78rem',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {/* Thông số vóc dáng và Dáng người tự động theo Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              color: '#F3D98A',
              fontWeight: 700,
              fontSize: '0.74rem',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <UserCheck size={14} color="#D4AF37" />
              <span>{height}cm • {weight}kg • 3 vòng: {chest}-{waist}-{hips}cm</span>
            </span>

            <span style={{
              background: 'rgba(212, 175, 55, 0.15)',
              color: '#FDE68A',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              padding: '2px 9px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>{activeShapeObj.icon}</span>
              <span>Dáng {activeShapeObj.label} (Theo Hồ Sơ)</span>
            </span>
          </div>

          {/* Bật/Tắt Thước đo */}
          <button
            onClick={() => setShowMeasurements(!showMeasurements)}
            title="Bật/Tắt thước đo số đo 3 vòng"
            style={{
              background: showMeasurements ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              color: showMeasurements ? '#F3D98A' : 'var(--text-muted)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.72rem',
              fontWeight: 600,
              transition: 'var(--transition)'
            }}
          >
            <Ruler size={13} />
            <span>{showMeasurements ? 'Ẩn Số Đo' : 'Hiện Số Đo'}</span>
          </button>
        </div>
      )}

      {/* 2. SÂN KHẤU SHOWROOM (ATELIER SHOWROOM PODIUM) - HỖ TRỢ KÉO XOAY 360 ĐỘ */}
      <div
        onMouseDown={handleStageMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        title="Kéo chuột hoặc vuốt để xoay ma-nơ-canh 360 độ"
        style={{
          position: 'relative',
          width: compact ? '290px' : '350px',
          height: compact ? '480px' : '580px',
          borderRadius: 'var(--radius-lg)',
          background: 'radial-gradient(circle at 50% 25%, rgba(212, 175, 55, 0.12) 0%, rgba(13, 17, 28, 0.96) 65%, #07090E 100%)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.8), inset 0 0 50px rgba(212, 175, 55, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {/* Badge góc xoay hiện tại (Top-Left) */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 10,
          background: 'rgba(10, 14, 24, 0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: 'var(--radius-full)',
          padding: '3px 10px',
          fontSize: '0.68rem',
          color: '#F3D98A',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          pointerEvents: 'none'
        }}>
          <Compass size={12} color="#D4AF37" />
          <span>{getAngleLabel(rotation)}</span>
        </div>

        {/* Hướng dẫn kéo xoay 360 (Top-Right) */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10,
          background: isAutoRotating ? 'rgba(212, 175, 55, 0.2)' : 'rgba(10, 14, 24, 0.65)',
          border: isAutoRotating ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid rgba(255,255,255,0.08)',
          borderRadius: 'var(--radius-full)',
          padding: '3px 9px',
          fontSize: '0.64rem',
          color: isAutoRotating ? '#FDE68A' : 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          pointerEvents: 'none'
        }}>
          <span>{isAutoRotating ? '● Đang tự xoay 360°' : '↔ Kéo xoay 360°'}</span>
        </div>

        {/* Ánh sáng Spotlight sân khấu từ trên đỉnh */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          width: '240px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at top, rgba(255, 245, 220, 0.35) 0%, rgba(212, 175, 55, 0.08) 50%, transparent 80%)',
          filter: 'blur(16px)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        {/* Bục sàn ma-nơ-canh Showroom xoay 360 độ (Turntable Podium Disc) */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          width: '240px',
          height: '40px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.45) 0%, rgba(15, 21, 33, 0.85) 60%, transparent 85%)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.85), inset 0 0 15px rgba(212, 175, 55, 0.3)',
          zIndex: 1,
          transform: `scaleY(0.7) rotate(${rotation * 0.5}deg)`,
          transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}>
          {/* Vạch chia độ trên bục xoay */}
          <div style={{
            position: 'absolute',
            inset: '3px',
            borderRadius: '50%',
            border: '1px dashed rgba(212, 175, 55, 0.35)'
          }} />
        </div>

        {/* 3. KHỐI 3D CHỨA CANVAS & TRANG PHỤC XOAY THEO GÓC NHÌN */}
        <div style={{
          position: 'relative',
          width: '340px',
          height: '550px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          transform: `perspective(1000px) rotateY(${rotation}deg)`,
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
          filter: `drop-shadow(${Math.sin(rotation * Math.PI / 180) * 16}px 14px 24px rgba(0, 0, 0, 0.85))`
        }}>
          {/* 3.1 MẶT TRƯỚC (FRONT FACE) - NGỰC, BỤNG, MẶT, TRANG PHỤC */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(1px)',
            transformStyle: 'preserve-3d'
          }}>
            <canvas
              ref={canvasFrontRef}
              style={{
                width: '340px',
                height: '550px',
                objectFit: 'contain'
              }}
            />

          {/* ========================================================================= */}
          {/* LỚP TRANG PHỤC KHOÁC LÊN MA-NƠ-CANH (CO GIÃN VỪA KHUNG DÁNG)             */}
          {/* ========================================================================= */}

          {/* 1. DRESS (Đầm liền) - Khoác từ ngực/cổ xuống qua đầu gối */}
          {isDress && (resolvedBottom || resolvedTop) && (
            <div
              onClick={() => setActiveSlotFocus('bottom')}
              style={{
                position: 'absolute',
                top: isMale ? '20.5%' : '20.0%',
                left: isMale ? '50.0%' : '52.0%',
                transform: 'translate(-50%, 0)',
                width: `${Math.round((isMale ? 40 : 36) * Math.max(sChest, sHips))}%`,
                cursor: 'pointer',
                zIndex: 5,
                filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.65))',
                transition: 'all 0.3s ease'
              }}
            >
              <IsolatedClothingImage
                src={(resolvedBottom?.categoryName?.toLowerCase() === 'dresses' ? resolvedBottom : resolvedTop)?.imageUrl}
                alt={(resolvedBottom?.categoryName?.toLowerCase() === 'dresses' ? resolvedBottom : resolvedTop)?.name || 'Đầm liền'}
                maxHeight={compact ? '300px' : '360px'}
              />
            </div>
          )}

          {/* 2. BOTTOMS (Quần tây / Quần Jeans - Ôm từ eo xuống sát cổ chân) */}
          {!isDress && resolvedBottom && (
            <div
              onClick={() => setActiveSlotFocus('bottom')}
              style={{
                position: 'absolute',
                top: isMale ? '41.5%' : '41.0%',
                left: isMale ? '50.0%' : '51.2%',
                transform: 'translate(-50%, 0)',
                width: `${Math.round((isMale ? 37 : 33) * sHips)}%`,
                cursor: 'pointer',
                zIndex: 4,
                filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.7))',
                transition: 'all 0.3s ease'
              }}
            >
              <IsolatedClothingImage
                src={resolvedBottom.imageUrl}
                alt={resolvedBottom.name || ''}
                maxHeight={compact ? '235px' : '275px'}
              />
            </div>
          )}

          {/* 3. TOP (Áo sơ mi / Áo thun - Ôm vừa vặn vai và ngực ma-nơ-canh) */}
          {!isDress && resolvedTop && (
            <div
              onClick={() => setActiveSlotFocus('top')}
              style={{
                position: 'absolute',
                top: isMale ? '20.5%' : '20.2%',
                left: isMale ? '50.0%' : '53.0%',
                transform: 'translate(-50%, 0)',
                width: `${Math.round((isMale ? 42 : 38) * Math.max(sChest, sShoulder))}%`,
                cursor: 'pointer',
                zIndex: 5,
                filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.7))',
                transition: 'all 0.3s ease'
              }}
            >
              <IsolatedClothingImage
                src={resolvedTop.imageUrl}
                alt={resolvedTop.name || ''}
                maxHeight={compact ? '130px' : '155px'}
              />
            </div>
          )}

          {/* 4. OUTERWEAR (Áo khoác / Blazer - May đo ôm sát vai và tay suông tự nhiên) */}
          {resolvedOuter && (
            <div
              onClick={() => setActiveSlotFocus('outer')}
              style={{
                position: 'absolute',
                top: isMale ? '20.2%' : '19.8%',
                left: isMale ? '50.0%' : '53.0%',
                transform: 'translate(-50%, 0)',
                width: `${Math.round((isMale ? 46 : 41) * sShoulder)}%`,
                cursor: 'pointer',
                zIndex: 6,
                filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.8))',
                transition: 'all 0.3s ease'
              }}
            >
              <IsolatedClothingImage
                src={resolvedOuter.imageUrl}
                alt={resolvedOuter.name || ''}
                maxHeight={compact ? '210px' : '240px'}
              />
            </div>
          )}

          {/* 5. SHOES (Giày vừa vặn bàn chân) */}
          {resolvedShoes && (
            <div
              onClick={() => setActiveSlotFocus('shoes')}
              style={{
                position: 'absolute',
                bottom: '12px',
                left: isMale ? '50.0%' : '52.5%',
                transform: 'translate(-50%, 0)',
                width: isMale ? '21%' : '17%',
                cursor: 'pointer',
                zIndex: 4,
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))'
              }}
            >
              <IsolatedClothingImage
                src={resolvedShoes.imageUrl}
                alt={resolvedShoes.name || ''}
                maxHeight="34px"
              />
            </div>
          )}

          {/* 6. ACCESSORY (Túi xách) */}
          {resolvedAccessory && (
            <div
              onClick={() => setActiveSlotFocus('accessory')}
              style={{
                position: 'absolute',
                top: isMale ? '40%' : '38%',
                right: '8%',
                width: '24%',
                cursor: 'pointer',
                zIndex: 7,
                filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.7))'
              }}
            >
              <IsolatedClothingImage
                src={resolvedAccessory.imageUrl}
                alt={resolvedAccessory.name || ''}
                maxHeight="100px"
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* LỚP THƯỚC ĐO 3 VÒNG BÁM THEO FORM ĐÃ CO GIÃN                              */}
          {/* ========================================================================= */}
          {showMeasurements && (
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 8,
              opacity: Math.max(0.08, Math.cos(rotation * Math.PI / 180)),
              transition: 'opacity 0.25s ease'
            }}>
              {/* Vòng 1: Ngực */}
              <div style={{
                position: 'absolute',
                top: isMale ? '28%' : '27%',
                right: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '28px',
                  borderTop: '1px dashed #F472B6'
                }} />
                <div style={{
                  background: 'rgba(244, 114, 182, 0.95)',
                  color: '#080A0F',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  whiteSpace: 'nowrap'
                }}>
                  V1: {chest}cm
                </div>
              </div>

              {/* Vòng 2: Eo */}
              <div style={{
                position: 'absolute',
                top: isMale ? '38%' : '37%',
                left: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  background: 'rgba(212, 175, 55, 0.95)',
                  color: '#080A0F',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  whiteSpace: 'nowrap'
                }}>
                  V2: {waist}cm
                </div>
                <div style={{
                  width: '28px',
                  borderTop: '1px dashed #D4AF37'
                }} />
              </div>

              {/* Vòng 3: Hông */}
              <div style={{
                position: 'absolute',
                top: isMale ? '48%' : '47%',
                right: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '28px',
                  borderTop: '1px dashed #38BDF8'
                }} />
                <div style={{
                  background: 'rgba(56, 189, 248, 0.95)',
                  color: '#080A0F',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  whiteSpace: 'nowrap'
                }}>
                  V3: {hips}cm
                </div>
              </div>

              {/* Chiều cao bên trái */}
              <div style={{
                position: 'absolute',
                left: '6px',
                top: '12%',
                bottom: '8%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px'
              }}>
                <div style={{ width: '1px', flex: 1, background: 'rgba(255,255,255,0.3)' }} />
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  color: '#FFF',
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '4px 2px',
                  borderRadius: '3px'
                }}>
                  {height} cm
                </span>
                <div style={{ width: '1px', flex: 1, background: 'rgba(255,255,255,0.3)' }} />
              </div>
            </div>
          )}
        </div>

        {/* 3.2 MẶT SAU (BACK FACE) - LƯNG, BẢ VAI, EO VÀ MÔNG CHUẨN SHOWROOM */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg) translateZ(1px)',
          transformStyle: 'preserve-3d'
        }}>
          <canvas
            ref={canvasBackRef}
            style={{
              width: '340px',
              height: '550px',
              objectFit: 'contain'
            }}
          />

          {/* Thước đo mặt sau: Vòng 3 (Mông) & Vòng 2 (Eo Lưng) */}
          {showMeasurements && (
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 8,
              opacity: Math.max(0.08, -Math.cos(rotation * Math.PI / 180)),
              transition: 'opacity 0.25s ease'
            }}>
              {/* V3: Vòng Hông & Mông */}
              <div style={{
                position: 'absolute',
                top: isMale ? '48%' : '47%',
                left: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  background: 'rgba(56, 189, 248, 0.95)',
                  color: '#080A0F',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  whiteSpace: 'nowrap'
                }}>
                  V3 (Mông): {hips}cm
                </div>
                <div style={{
                  width: '28px',
                  borderTop: '1px dashed #38BDF8'
                }} />
              </div>

              {/* V2: Vòng Eo Lưng */}
              <div style={{
                position: 'absolute',
                top: isMale ? '38%' : '37%',
                right: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '28px',
                  borderTop: '1px dashed #D4AF37'
                }} />
                <div style={{
                  background: 'rgba(212, 175, 55, 0.95)',
                  color: '#080A0F',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  whiteSpace: 'nowrap'
                }}>
                  V2 (Eo): {waist}cm
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* Thông báo hướng dẫn nếu chưa chọn đồ */}
        {!resolvedTop && !resolvedBottom && !resolvedOuter && (
          <div style={{
            position: 'absolute',
            bottom: '48px',
            background: 'rgba(10, 14, 22, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            padding: '7px 16px',
            borderRadius: 'var(--radius-full)',
            color: '#F3D98A',
            fontSize: '0.74rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 9,
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.6)'
          }}>
            <Sparkles size={13} color="#D4AF37" />
            <span>Form Dáng {activeShapeObj.label} • Chọn trang phục để ướm thử</span>
          </div>
        )}
      </div>

      {/* 2.5 BẢNG ĐIỀU KHIỂN XOAY 360 ĐỘ (3D TURNTABLE ROTATION CONTROLLER) */}
      <div style={{
        width: '100%',
        maxWidth: compact ? '290px' : '350px',
        marginTop: '12px',
        padding: '10px 14px',
        background: 'rgba(12, 16, 26, 0.92)',
        backdropFilter: 'blur(12px)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.65)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {/* Hàng 1: Nút Xoay 360 Tự Động & 4 Nút Preset Góc Nhìn */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            title={isAutoRotating ? "Tạm dừng xoay tự động" : "Bật chế độ tự động xoay 360 độ"}
            style={{
              background: isAutoRotating
                ? 'linear-gradient(135deg, #D4AF37, #F59E0B)'
                : 'rgba(255, 255, 255, 0.06)',
              color: isAutoRotating ? '#0B0F19' : '#F3D98A',
              border: isAutoRotating ? '1px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 10px',
              fontSize: '0.72rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isAutoRotating ? '0 0 14px rgba(212, 175, 55, 0.5)' : 'none'
            }}
          >
            {isAutoRotating ? <Pause size={12} /> : <Play size={12} />}
            <span>{isAutoRotating ? 'Dừng Xoay' : 'Xoay 360°'}</span>
          </button>

          {/* 4 Nút Preset Góc Chuẩn */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { label: 'Trước', deg: 0 },
              { label: '45°', deg: 45 },
              { label: 'Sau', deg: 180 },
              { label: '-45°', deg: -45 }
            ].map(p => {
              const isActive = Math.abs(rotation - p.deg) < 12;
              return (
                <button
                  key={p.label}
                  onClick={() => {
                    setIsAutoRotating(false);
                    setRotation(p.deg);
                  }}
                  title={`Xoay đến góc ${p.label}`}
                  style={{
                    background: isActive ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#FDE68A' : 'var(--text-muted)',
                    border: isActive ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '3px 7px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {p.label}
                </button>
              );
            })}

            {/* Nút Reset 0 độ */}
            <button
              onClick={() => {
                setIsAutoRotating(false);
                setRotation(0);
              }}
              title="Đặt lại về góc 0° (Mặt trước)"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--text-muted)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '3px 6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>

        {/* Hàng 2: Thanh Trượt Góc Xoay Mịn */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={13} color="#D4AF37" />
          <input
            type="range"
            min="-180"
            max="180"
            value={rotation}
            onChange={(e) => {
              setIsAutoRotating(false);
              setRotation(Number(e.target.value));
            }}
            title="Kéo trượt để xoay ma-nơ-canh đến góc mong muốn"
            style={{
              flex: 1,
              accentColor: '#D4AF37',
              cursor: 'pointer',
              height: '4px'
            }}
          />
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#F3D98A',
            minWidth: '42px',
            textAlign: 'right'
          }}>
            {rotation > 0 ? `+${rotation}°` : `${rotation}°`}
          </span>
        </div>
      </div>

      {/* 3. BẢNG THÔNG TIN NHÂN TRẮC HỌC (BOTTOM INSIGHT RIBBON) */}
      {!compact && (
        <div style={{
          marginTop: '16px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          fontSize: '0.75rem',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(7, 10, 17, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px 6px',
            borderRadius: 'var(--radius-sm)'
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginBottom: '2px' }}>Dáng Người (Hồ Sơ)</div>
            <div style={{ fontWeight: 800, color: '#F3D98A' }}>
              {activeShapeObj.icon} {activeShapeObj.label}
            </div>
          </div>

          <div style={{
            background: 'rgba(7, 10, 17, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px 6px',
            borderRadius: 'var(--radius-sm)'
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginBottom: '2px' }}>Tỉ Lệ Eo/Hông (WHR)</div>
            <div style={{ fontWeight: 800, color: '#38BDF8' }}>{formModifiers.whr}</div>
          </div>

          <div style={{
            background: 'rgba(7, 10, 17, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px 6px',
            borderRadius: 'var(--radius-sm)'
          }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginBottom: '2px' }}>Chỉ Số BMI</div>
            <div style={{ fontWeight: 800, color: '#10B981' }}>{formModifiers.bmi}</div>
          </div>
        </div>
      )}
    </div>
  );
}
