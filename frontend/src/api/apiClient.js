// API Client kết nối trực tiếp với ASP.NET Core Web API (hỗ trợ JWT Bearer Token)

const API_BASE_URL = "/api";

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
