const DEFAULT_API_BASE = "/api";
const REQUEST_TIMEOUT_MS = 8000;

const trimSlash = (value) => value.replace(/\/$/, "");

export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  return envUrl ? trimSlash(envUrl) : DEFAULT_API_BASE;
};

export const isBackendEnabled = () => {
  const flag = import.meta.env.VITE_USE_BACKEND;
  return flag !== "false";
};

const buildUrl = (path) => {
  const base = getApiBaseUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

export const requestJson = async (path, options = {}) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(buildUrl(path), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(errorBody || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export const registerUserApi = (payload) => {
  return requestJson("/users/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const loginUserApi = (payload) => {
  return requestJson("/users/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const createPolicyApi = (payload) => {
  return requestJson("/policy/create", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const getClaimsApi = (userId) => {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return requestJson(`/claims${query}`);
};
