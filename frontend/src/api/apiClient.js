// API Client kết nối trực tiếp với ASP.NET Core Web API (hỗ trợ JWT Bearer Token)

function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.startsWith('http')) {
    return envUrl.replace(/\/+$/, '');
  }
  // Nếu đang mở trên Render static site (ví dụ myfitdaily-2.onrender.com), tự động gọi backend API trên myfitdaily.onrender.com
  if (typeof window !== 'undefined' && window.location.hostname.includes('onrender.com') && !window.location.hostname.startsWith('myfitdaily.')) {
    return 'https://myfitdaily.onrender.com/api';
  }
  return import.meta.env.VITE_API_URL || '/api';
}

export const API_BASE_URL = getApiBaseUrl();

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("myfitdaily_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.warn("Backend API not reachable, operating in client mode:", error.message);
    return {
      ok: false,
      status: 0,
      error: error.message,
    };
  }
}
