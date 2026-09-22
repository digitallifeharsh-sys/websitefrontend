const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

const getRefreshToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

const saveAccessToken = (token) => {
  if (typeof window !== "undefined" && token) {
    localStorage.setItem("accessToken", token);
  }
};

const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("authUser");
  window.dispatchEvent(new Event("auth-change"));
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!response.ok) {
    clearAuth();
    return null;
  }

  const data = await response.json();
  saveAccessToken(data.accessToken);
  return data.accessToken || null;
};

export const apiFetch = async (path, options = {}) => {
  const { auth = false, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers || {});

  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  let response = await fetch(
    `${API_URL}${path.startsWith("/") ? path : `/${path}`}`,
    { ...fetchOptions, headers, cache: fetchOptions.cache || "no-store" }
  );

  if (auth && response.status === 401) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      response = await fetch(
        `${API_URL}${path.startsWith("/") ? path : `/${path}`}`,
        { ...fetchOptions, headers, cache: fetchOptions.cache || "no-store" }
      );
    }
  }

  return response;
};

export const apiJson = async (path, options = {}) => {
  const response = await apiFetch(path, options);
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || data?.error || "Something went wrong"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export { API_URL, clearAuth };
