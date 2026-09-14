// ==========================================================================
// MYFITDAILY - Live Real-Time Weather & Hyper-Local Geolocation Service
// Powered by Open-Meteo & GeoJS (100% Free, No API Key Required)
// Supports District-level weather (Quận / Huyện chi tiết)
// ==========================================================================

const CACHE_KEY = 'myfitdaily_live_weather_v3';
const MANUAL_CITY_KEY = 'myfitdaily_manual_city';
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes cache

// Danh sách các Quận & Huyện chi tiết của Hà Nội
export const HANOI_DISTRICTS = [
  { name: 'Cầu Giấy, Hà Nội', shortName: 'Cầu Giấy', group: 'Hà Nội', lat: 21.0323, lon: 105.8007 },
  { name: 'Đống Đa, Hà Nội', shortName: 'Đống Đa', group: 'Hà Nội', lat: 21.0181, lon: 105.8299 },
  { name: 'Ba Đình, Hà Nội', shortName: 'Ba Đình', group: 'Hà Nội', lat: 21.0341, lon: 105.8244 },
  { name: 'Hoàn Kiếm, Hà Nội', shortName: 'Hoàn Kiếm', group: 'Hà Nội', lat: 21.0307, lon: 105.8524 },
  { name: 'Hai Bà Trưng, Hà Nội', shortName: 'Hai Bà Trưng', group: 'Hà Nội', lat: 21.0069, lon: 105.8522 },
  { name: 'Tây Hồ, Hà Nội', shortName: 'Tây Hồ', group: 'Hà Nội', lat: 21.0712, lon: 105.8236 },
  { name: 'Thanh Xuân, Hà Nội', shortName: 'Thanh Xuân', group: 'Hà Nội', lat: 20.9980, lon: 105.8115 },
  { name: 'Hoàng Mai, Hà Nội', shortName: 'Hoàng Mai', group: 'Hà Nội', lat: 20.9754, lon: 105.8524 },
  { name: 'Long Biên, Hà Nội', shortName: 'Long Biên', group: 'Hà Nội', lat: 21.0362, lon: 105.8927 },
  { name: 'Hà Đông, Hà Nội', shortName: 'Hà Đông', group: 'Hà Nội', lat: 20.9719, lon: 105.7725 },
  { name: 'Nam Từ Liêm, Hà Nội', shortName: 'Nam Từ Liêm', group: 'Hà Nội', lat: 21.0152, lon: 105.7656 },
  { name: 'Bắc Từ Liêm, Hà Nội', shortName: 'Bắc Từ Liêm', group: 'Hà Nội', lat: 21.0631, lon: 105.7562 },
  { name: 'Đông Anh, Hà Nội', shortName: 'Đông Anh', group: 'Hà Nội', lat: 21.1372, lon: 105.8453 },
  { name: 'Gia Lâm, Hà Nội', shortName: 'Gia Lâm', group: 'Hà Nội', lat: 21.0258, lon: 105.9405 },
  { name: 'Hoài Đức, Hà Nội', shortName: 'Hoài Đức', group: 'Hà Nội', lat: 21.0194, lon: 105.7072 },
  { name: 'Thanh Trì, Hà Nội', shortName: 'Thanh Trì', group: 'Hà Nội', lat: 20.9419, lon: 105.8483 },
  { name: 'Sóc Sơn, Hà Nội', shortName: 'Sóc Sơn', group: 'Hà Nội', lat: 21.2825, lon: 105.8483 },
  { name: 'Đan Phượng, Hà Nội', shortName: 'Đan Phượng', group: 'Hà Nội', lat: 21.1118, lon: 105.6708 },
  { name: 'Thường Tín, Hà Nội', shortName: 'Thường Tín', group: 'Hà Nội', lat: 20.8525, lon: 105.8711 },
  { name: 'Chương Mỹ, Hà Nội', shortName: 'Chương Mỹ', group: 'Hà Nội', lat: 20.8931, lon: 105.6983 },
  { name: 'Thạch Thất, Hà Nội', shortName: 'Thạch Thất', group: 'Hà Nội', lat: 21.0369, lon: 105.5567 },
  { name: 'Quốc Oai, Hà Nội', shortName: 'Quốc Oai', group: 'Hà Nội', lat: 20.9856, lon: 105.6264 },
  { name: 'Mê Linh, Hà Nội', shortName: 'Mê Linh', group: 'Hà Nội', lat: 21.1819, lon: 105.7197 },
  { name: 'Sơn Tây, Hà Nội', shortName: 'Sơn Tây', group: 'Hà Nội', lat: 21.1352, lon: 105.5074 },
  { name: 'Ba Vì, Hà Nội', shortName: 'Ba Vì', group: 'Hà Nội', lat: 21.2297, lon: 105.3789 }
];

// Danh sách các Quận chi tiết của TP. Hồ Chí Minh
export const HCM_DISTRICTS = [
  { name: 'Quận 1, TP. HCM', shortName: 'Quận 1', group: 'TP. HCM', lat: 10.7769, lon: 106.7009 },
  { name: 'Quận 3, TP. HCM', shortName: 'Quận 3', group: 'TP. HCM', lat: 10.7843, lon: 106.6843 },
  { name: 'Quận 7, TP. HCM', shortName: 'Quận 7', group: 'TP. HCM', lat: 10.7340, lon: 106.7218 },
  { name: 'TP. Thủ Đức, TP. HCM', shortName: 'TP. Thủ Đức', group: 'TP. HCM', lat: 10.8494, lon: 106.7717 },
  { name: 'Bình Thạnh, TP. HCM', shortName: 'Bình Thạnh', group: 'TP. HCM', lat: 10.8106, lon: 106.7091 },
  { name: 'Gò Vấp, TP. HCM', shortName: 'Gò Vấp', group: 'TP. HCM', lat: 10.8387, lon: 106.6653 },
  { name: 'Tân Bình, TP. HCM', shortName: 'Tân Bình', group: 'TP. HCM', lat: 10.7992, lon: 106.6534 },
  { name: 'Bình Tân, TP. HCM', shortName: 'Bình Tân', group: 'TP. HCM', lat: 10.7456, lon: 106.6045 },
  { name: 'Bình Chánh, TP. HCM', shortName: 'Bình Chánh', group: 'TP. HCM', lat: 10.6874, lon: 106.5939 },
  { name: 'Hóc Môn, TP. HCM', shortName: 'Hóc Môn', group: 'TP. HCM', lat: 10.8841, lon: 106.5934 }
];

// Các Tỉnh / Thành phố khác
export const OTHER_PROVINCES = [
  { name: 'Đà Nẵng', shortName: 'Đà Nẵng', group: 'Miền Trung', lat: 16.0544, lon: 108.2022 },
  { name: 'Hải Phòng', shortName: 'Hải Phòng', group: 'Miền Bắc', lat: 20.8449, lon: 106.6881 },
  { name: 'Cần Thơ', shortName: 'Cần Thơ', group: 'Miền Nam', lat: 10.0452, lon: 105.7469 },
  { name: 'Đà Lạt', shortName: 'Đà Lạt', group: 'Tây Nguyên', lat: 11.9404, lon: 108.4583 },
  { name: 'Nha Trang', shortName: 'Nha Trang', group: 'Miền Trung', lat: 12.2388, lon: 109.1967 },
  { name: 'Huế', shortName: 'Huế', group: 'Miền Trung', lat: 16.4637, lon: 107.5909 },
  { name: 'Quảng Ninh', shortName: 'Quảng Ninh', group: 'Miền Bắc', lat: 20.9599, lon: 107.0425 },
  { name: 'Vũng Tàu', shortName: 'Vũng Tàu', group: 'Miền Nam', lat: 10.3460, lon: 107.0843 }
];

export const ALL_LOCATIONS = [...HANOI_DISTRICTS, ...HCM_DISTRICTS, ...OTHER_PROVINCES];

// WMO Weather interpretation codes (WW)
const WMO_WEATHER_MAP = {
  0: { textVi: 'Trời nắng trong xanh', textEn: 'Clear Sky', icon: '☀️', isRain: false },
  1: { textVi: 'Nắng nhẹ, quang đãng', textEn: 'Mainly Clear', icon: '🌤️', isRain: false },
  2: { textVi: 'Nắng gián đoạn, ít mây', textEn: 'Partly Cloudy', icon: '⛅', isRain: false },
  3: { textVi: 'Trời nhiều mây, âm u', textEn: 'Overcast', icon: '☁️', isRain: false },
  45: { textVi: 'Có sương mù', textEn: 'Foggy', icon: '🌫️', isRain: false },
  48: { textVi: 'Sương mù đọng', textEn: 'Depositing Rime Fog', icon: '🌫️', isRain: false },
  51: { textVi: 'Mưa phùn nhẹ', textEn: 'Light Drizzle', icon: '🌦️', isRain: true },
  53: { textVi: 'Mưa phùn vừa', textEn: 'Moderate Drizzle', icon: '🌦️', isRain: true },
  55: { textVi: 'Mưa phùn dày hạt', textEn: 'Dense Drizzle', icon: '🌧️', isRain: true },
  61: { textVi: 'Mưa rào nhẹ', textEn: 'Slight Rain', icon: '🌧️', isRain: true },
  63: { textVi: 'Mưa rào', textEn: 'Moderate Rain', icon: '🌧️', isRain: true },
  65: { textVi: 'Mưa to nặng hạt', textEn: 'Heavy Rain', icon: '🌧️', isRain: true },
  71: { textVi: 'Tuyết rơi nhẹ', textEn: 'Slight Snow', icon: '❄️', isRain: false },
  73: { textVi: 'Tuyết rơi vừa', textEn: 'Moderate Snow', icon: '❄️', isRain: false },
  75: { textVi: 'Tuyết rơi dày', textEn: 'Heavy Snow', icon: '❄️', isRain: false },
  80: { textVi: 'Mưa rào thoáng qua', textEn: 'Slight Rain Showers', icon: '🌦️', isRain: true },
  81: { textVi: 'Mưa rào từng cơn', textEn: 'Moderate Rain Showers', icon: '🌧️', isRain: true },
  82: { textVi: 'Mưa rào dữ dội', textEn: 'Violent Rain Showers', icon: '⛈️', isRain: true },
  95: { textVi: 'Có dông sét', textEn: 'Thunderstorm', icon: '⛈️', isRain: true },
  96: { textVi: 'Dông kèm mưa đá nhẹ', textEn: 'Thunderstorm with Hail', icon: '⛈️', isRain: true },
  99: { textVi: 'Dông kèm mưa đá lớn', textEn: 'Heavy Thunderstorm with Hail', icon: '⛈️', isRain: true }
};

/**
 * Tìm quận/huyện gần nhất theo tọa độ GPS
 */
export function findNearestDistrict(lat, lon) {
  let nearest = ALL_LOCATIONS[0];
  let minDistance = Infinity;

  for (const loc of ALL_LOCATIONS) {
    const dLat = loc.lat - lat;
    const dLon = loc.lon - lon;
    const distSq = dLat * dLat + dLon * dLon;
    if (distSq < minDistance) {
      minDistance = distSq;
      nearest = loc;
    }
  }

  // Nếu khoảng cách trong phạm vi hợp lý (~35km)
  if (minDistance < 0.15) {
    return nearest;
  }
  return null;
}

/**
 * Lấy tọa độ GPS thiết bị với độ chính xác cao
 */
const getBrowserCoordinates = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator?.geolocation) {
      return resolve(null);
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      }),
      (err) => {
        console.info('GPS not granted or unavailable, using IP geolocation:', err.message);
        resolve(null);
      },
      { timeout: 6000, maximumAge: 120000, enableHighAccuracy: true }
    );
  });
};

/**
 * Xác định vị trí địa lý chi tiết (Ưu tiên Người dùng chọn > GPS Quận/Huyện > IP)
 */
const getLocationInfo = async (coords) => {
  // 1. Kiểm tra nếu người dùng đã ghim/chọn cụ thể một Quận / Huyện
  try {
    const manualCity = localStorage.getItem(MANUAL_CITY_KEY);
    if (manualCity) {
      const matched = ALL_LOCATIONS.find(c => c.name === manualCity || c.shortName === manualCity);
      if (matched) {
        return {
          lat: matched.lat,
          lon: matched.lon,
          city: matched.name,
          isManual: true
        };
      }
    }
  } catch (e) {
    console.warn('Manual city read error:', e);
  }

  // 2. Nếu GPS thiết bị được người dùng cho phép -> Phân tích chính xác từng Quận/Huyện
  if (coords && coords.lat && coords.lon) {
    const nearestDistrict = findNearestDistrict(coords.lat, coords.lon);
    if (nearestDistrict) {
      return {
        lat: coords.lat,
        lon: coords.lon,
        city: nearestDistrict.name,
        isManual: false
      };
    }

    // Hoặc thử reverse geocoding
    try {
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.lat}&longitude=${coords.lon}&localityLanguage=vi`);
      if (res.ok) {
        const data = await res.json();
        const district = data.locality || data.principalSubdivision || 'Hà Nội';
        return {
          lat: coords.lat,
          lon: coords.lon,
          city: district,
          isManual: false
        };
      }
    } catch (e) {
      console.warn('Reverse geocoding error:', e);
    }
  }

  // 3. Dự phòng IP Geolocation qua GeoJS (xác định cấp độ Tỉnh/Thành phố)
  try {
    const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
    if (geoRes.ok) {
      const geoData = await geoRes.json();
      const rawCity = (geoData.city || geoData.region || 'Hanoi').toLowerCase();
      
      let defaultCity = 'Hà Nội';
      let defaultLat = 21.0285;
      let defaultLon = 105.8542;

      if (rawCity.includes('ho chi minh') || rawCity.includes('saigon')) {
        defaultCity = 'TP. Hồ Chí Minh';
        defaultLat = 10.8231;
        defaultLon = 106.6297;
      } else if (rawCity.includes('da nang')) {
        defaultCity = 'Đà Nẵng';
        defaultLat = 16.0544;
        defaultLon = 108.2022;
      }

      return {
        lat: defaultLat,
        lon: defaultLon,
        city: defaultCity,
        isManual: false
      };
    }
  } catch (e) {
    console.warn('GeoJS IP lookup error:', e);
  }

  // 4. Mặc định dự phòng an toàn
  return {
    lat: 21.0285,
    lon: 105.8542,
    city: 'Hà Nội',
    isManual: false
  };
};

/**
 * Đặt thủ công Quận / Huyện / Thành phố người dùng mong muốn
 */
export function setManualCity(locationName) {
  try {
    localStorage.setItem(MANUAL_CITY_KEY, locationName);
    sessionStorage.removeItem(CACHE_KEY);
  } catch (e) {
    console.warn('Set manual city error:', e);
  }
}

/**
 * Xóa lựa chọn thủ công để tự động bắt lại vị trí
 */
export function clearManualCity() {
  try {
    localStorage.removeItem(MANUAL_CITY_KEY);
    sessionStorage.removeItem(CACHE_KEY);
  } catch (e) {
    console.warn('Clear manual city error:', e);
  }
}

/**
 * Lấy thông tin thời tiết thời gian thực vi khí hậu theo từng Quận/Huyện
 */
export async function getLiveWeather(forceRefresh = false) {
  // Kiểm tra cache trong phiên
  if (!forceRefresh) {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_DURATION_MS) {
          return parsed.data;
        }
      }
    } catch (e) {
      console.warn('Cache read error:', e);
    }
  }

  try {
    // 1. Xác định tọa độ chi tiết và tên quận/huyện
    const coords = await getBrowserCoordinates();
    const location = await getLocationInfo(coords);

    // 2. Gọi Open-Meteo với tọa độ chính xác của quận/huyện đó
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    
    if (!weatherRes.ok) {
      throw new Error(`Open-Meteo returned status ${weatherRes.status}`);
    }

    const weatherData = await weatherRes.json();
    const current = weatherData.current || {};
    const temp = Math.round(current.temperature_2m ?? 26);
    const feelsLike = Math.round(current.apparent_temperature ?? temp);
    const code = current.weather_code ?? 0;
    const humidity = current.relative_humidity_2m ?? 80;
    const windSpeed = Math.round(current.wind_speed_10m ?? 12);
    const precipitation = current.precipitation ?? 0;

    const weatherMeta = WMO_WEATHER_MAP[code] || {
      textVi: 'Thời tiết mát mẻ',
      textEn: 'Mild Weather',
      icon: '⛅',
      isRain: false
    };

    const isRain = weatherMeta.isRain || precipitation > 0.1;
    const isHot = temp >= 30;
    const isCold = temp < 23;

    const result = {
      city: location.city,
      latitude: location.lat,
      longitude: location.lon,
      isManual: location.isManual,
      temperature: temp,
      feelsLike,
      humidity,
      windSpeed,
      isDay: current.is_day === 1,
      weatherCode: code,
      conditionText: weatherMeta.textVi,
      conditionTextEn: weatherMeta.textEn,
      conditionIcon: weatherMeta.icon,
      isRain,
      isHot,
      isCold,
      summaryVi: `${location.city} • ${temp}°C ${weatherMeta.icon} ${weatherMeta.textVi}`,
      summaryEn: `${location.city} • ${temp}°C ${weatherMeta.icon} ${weatherMeta.textEn}`,
      updatedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    // Lưu cache
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: result
      }));
    } catch (e) {
      console.warn('Cache write error:', e);
    }

    return result;
  } catch (error) {
    console.error('Failed to fetch live weather:', error);
    return {
      city: 'Cầu Giấy, Hà Nội',
      temperature: 26,
      feelsLike: 28,
      humidity: 82,
      windSpeed: 14,
      isDay: true,
      weatherCode: 51,
      conditionText: 'Mưa phùn nhẹ',
      conditionTextEn: 'Light Drizzle',
      conditionIcon: '🌦️',
      isRain: true,
      isHot: false,
      isCold: false,
      summaryVi: 'Cầu Giấy, Hà Nội • 26°C 🌦️ Mưa phùn nhẹ',
      summaryEn: 'Cau Giay, Hanoi • 26°C 🌦️ Light Drizzle',
      updatedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  }
}
