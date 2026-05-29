import axios, {
  type InternalAxiosRequestConfig
} from "axios";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  setAuthSession
} from "@/utils/auth";

type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const baseURL = import.meta.env.VITE_API_URL as string;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

const redirectToLogin = () => {
  if (window.location.pathname !== "/") {
    window.location.href = "/";
  }
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  const { data } = await axios.post(
    `${baseURL}/auth/refresh`,
    { refreshToken },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  setAuthSession(data);

  return data.accessToken as string;
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    const status = error.response?.status;
    const isAuthRequest =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh");

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthRequest
    ) {
      return Promise.reject(error);
    }

    if (!getRefreshToken()) {
      clearAuthSession();
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;

      if (!newToken) {
        throw new Error("No se pudo renovar la sesión");
      }

      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAuthSession();
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
