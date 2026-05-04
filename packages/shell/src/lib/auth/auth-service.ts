import { api } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import type { AuthUser, MenuItem } from '../../store/auth-store';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
  menu: MenuItem[];
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT).catch(() => {
      // Ignore logout API errors — always clear local state
    });
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const { data } = await api.post<{ accessToken: string; refreshToken: string }>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken },
    );
    return data;
  },
};
