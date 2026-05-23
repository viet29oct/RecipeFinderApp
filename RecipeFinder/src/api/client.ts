import axios from 'axios';
import { env } from '@/utils/env';
import { normalizeError } from '@/utils/errors';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach Bearer access token ──────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Lazy import to avoid circular dependency
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useAuthStore } = require('@/store/auth.store') as typeof import('@/store/auth.store');
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: normalize errors + silent token refresh on 401 ─────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useAuthStore } = require('@/store/auth.store') as typeof import('@/store/auth.store');
      const { refreshToken, setAuth, clearAuth } = useAuthStore.getState();

      if (!refreshToken) {
        clearAuth();
        return Promise.reject(normalizeError(error));
      }

      try {
        // Use a raw axios instance (not apiClient) to prevent infinite loop
        const { data } = await axios.post(
          `${env.apiUrl}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const authData = (data?.data ?? data) as import('@/types/auth').AuthResponse;
        setAuth(authData);

        // Retry the original request with the fresh token
        originalConfig.headers.Authorization = `Bearer ${authData.accessToken}`;
        return apiClient(originalConfig);
      } catch {
        clearAuth();
        return Promise.reject(normalizeError(error));
      }
    }

    return Promise.reject(normalizeError(error));
  }
);
