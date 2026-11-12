import { API_BASE_URL } from '../api/apiClient';

const VID_KEY = 'mfd_analytics_vid';
const SID_KEY = 'mfd_analytics_sid';

function getOrGenerateId(storage, key, prefix) {
  try {
    let id = storage.getItem(key);
    if (!id) {
      id = `${prefix}_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
      storage.setItem(key, id);
    }
    return id;
  } catch (e) {
    return `${prefix}_${Math.random().toString(36).substring(2, 10)}`;
  }
}

export function getVisitorId() {
  if (typeof window === 'undefined') return 'vid_server';
  return getOrGenerateId(localStorage, VID_KEY, 'vid');
}

export function getSessionId() {
  if (typeof window === 'undefined') return 'sid_server';
  return getOrGenerateId(sessionStorage, SID_KEY, 'sid');
}

export function detectDevice() {
  if (typeof navigator === 'undefined') return 'Desktop';
  const ua = navigator.userAgent || '';
  if (/iPad|Tablet/i.test(ua)) return 'Tablet';
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

export function detectOS() {
  if (typeof navigator === 'undefined') return 'Windows';
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Mac/i.test(ua)) return 'macOS';
  return 'Linux';
}

export function detectBrowser() {
  if (typeof navigator === 'undefined') return 'Chrome';
  const ua = navigator.userAgent || '';
  if (/CocCoc/i.test(ua)) return 'Cốc Cốc';
  if (/Edg/i.test(ua)) return 'Edge';
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) return 'Chrome';
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
  if (/Firefox/i.test(ua)) return 'Firefox';
  return 'Chrome';
}

export function detectReferrer() {
  if (typeof document === 'undefined') return 'Direct';
  const ref = document.referrer || '';
  const search = typeof window !== 'undefined' ? window.location.search : '';
  const params = new URLSearchParams(search);
  const utmSource = params.get('utm_source');
  if (utmSource) return utmSource;

  if (!ref) return 'Direct / Trực tiếp';
  if (/google\./i.test(ref)) return 'Google Organic Search';
  if (/tiktok\./i.test(ref)) return 'TikTok & TikTok Shop';
  if (/facebook\.|fb\./i.test(ref)) return 'Facebook & Meta Ads';
  if (/zalo\./i.test(ref)) return 'Zalo Chat & Nhóm';
  if (/instagram\./i.test(ref)) return 'Instagram Lookbook';
  return 'Website Giới Thiệu Khác';
}

/**
 * Ghi nhận lượt xem trang (Pageview Event)
 */
export async function trackPageView(pageKey, pageTitle = null, user = null) {
  try {
    const payload = {
      eventType: 'page_view',
      pageKey: pageKey || 'landing',
      pageTitle: pageTitle || pageKey,
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      referrer: detectReferrer(),
      deviceType: detectDevice(),
      operatingSystem: detectOS(),
      browser: detectBrowser(),
      screenResolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '1920x1080',
      durationSeconds: 5,
      userId: user?.id || null,
      userEmail: user?.email || null
    };

    const url = `${API_BASE_URL}/analytics/track`;
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    }
  } catch (err) {
    // Không làm gián đoạn trải nghiệm người dùng
  }
}

/**
 * Ghi nhận sự kiện hành vi tùy biến (Custom Event: Click thử đồ, thêm đồ, quét QR...)
 */
export async function trackEvent(eventName, properties = {}, pageKey = 'ai-stylist', user = null) {
  try {
    const payload = {
      eventType: 'custom_event',
      pageKey: pageKey || 'landing',
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      eventName: eventName,
      eventPropertiesJson: JSON.stringify(properties),
      referrer: detectReferrer(),
      deviceType: detectDevice(),
      operatingSystem: detectOS(),
      browser: detectBrowser(),
      userId: user?.id || null,
      userEmail: user?.email || null
    };

    fetch(`${API_BASE_URL}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});
  } catch (err) {
    // ignore
  }
}

/**
 * Lấy báo cáo thống kê Google Analytics nội bộ
 */
export async function fetchAnalyticsOverview(period = 'all') {
  const url = `${API_BASE_URL}/analytics/overview?period=${encodeURIComponent(period)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data?.success) {
    return data.data;
  }
  throw new Error(data?.message || 'Không thể tải báo cáo phân tích lưu lượng');
}

/**
 * Lấy danh sách khách online thời gian thực (Realtime)
 */
export async function fetchRealtimeVisitors() {
  const url = `${API_BASE_URL}/analytics/realtime`;
  const res = await fetch(url);
  const data = await res.json();
  if (data?.success) {
    return data.data;
  }
  return [];
}

