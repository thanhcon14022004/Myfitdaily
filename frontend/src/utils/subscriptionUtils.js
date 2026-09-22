/**
 * Tiện ích chuẩn hóa và kiểm tra gói thành viên VIP MyFitDaily
 */

export function getSubscriptionType(user) {
  if (!user) return 'Free';
  const raw = user.subscriptionType;
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw.trim();
  }
  // Xử lý trường hợp đối tượng bị lồng do dữ liệu cũ
  if (raw && typeof raw === 'object') {
    if (typeof raw.subscriptionType === 'string' && raw.subscriptionType.trim().length > 0) {
      return raw.subscriptionType.trim();
    }
    if (typeof raw.planId === 'string' && raw.planId.trim().length > 0) {
      return raw.planId.trim();
    }
  }
  return 'Free';
}

export function isPremiumUser(user) {
  const type = getSubscriptionType(user).toLowerCase();
  return type === 'premium' || type === 'premiumplus' || type === 'premium_plus';
}

export function isPremiumPlusUser(user) {
  const type = getSubscriptionType(user).toLowerCase();
  return type === 'premiumplus' || type === 'premium_plus';
}

export function sanitizeUser(user) {
  if (!user || typeof user !== 'object') return null;
  const clean = { ...user };
  clean.subscriptionType = getSubscriptionType(user);
  return clean;
}

/**
 * Tính toán thời gian còn lại của gói đăng ký (ngày, giờ, phút, giây)
 */
export function calculateRemainingTime(expiresAt) {
  if (!expiresAt) {
    return {
      hasExpiry: false,
      isExpired: false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      formattedText: '',
      shortText: ''
    };
  }

  const expiryDate = new Date(expiresAt);
  if (isNaN(expiryDate.getTime())) {
    return {
      hasExpiry: false,
      isExpired: false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      formattedText: '',
      shortText: ''
    };
  }

  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return {
      hasExpiry: true,
      isExpired: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      formattedText: 'Đã hết hạn',
      shortText: 'Hết hạn',
      expiryDate
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, '0');
  let formattedText = '';
  if (days > 0) {
    formattedText = `${days} ngày ${pad(hours)} giờ ${pad(minutes)} phút ${pad(seconds)} giây`;
  } else if (hours > 0) {
    formattedText = `${pad(hours)} giờ ${pad(minutes)} phút ${pad(seconds)} giây`;
  } else {
    formattedText = `${pad(minutes)} phút ${pad(seconds)} giây`;
  }

  const shortText = days > 0
    ? `${days} ngày ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return {
    hasExpiry: true,
    isExpired: false,
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    formattedText,
    shortText,
    expiryDate
  };
}
