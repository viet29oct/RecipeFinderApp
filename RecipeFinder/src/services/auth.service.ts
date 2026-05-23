import { apiClient, endpoints } from '@/api';
import type { ApiResponse } from '@/types/api';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/auth';

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      endpoints.auth.login,
      payload
    );
    return data.data;
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      endpoints.auth.register,
      payload
    );
    return data.data;
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      endpoints.auth.refresh,
      { refreshToken }
    );
    return data.data;
  },

  /** Revokes the given refresh token (fire-and-forget on logout). */
  async logout(refreshToken: string): Promise<void> {
    await apiClient.post(endpoints.auth.logout, { refreshToken });
  },

  /** Revokes ALL refresh tokens for the current user (requires valid access token). */
  async logoutAll(): Promise<void> {
    await apiClient.post(endpoints.auth.logoutAll);
  },

  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>(endpoints.users.profile);
    return data.data;
  },
};
