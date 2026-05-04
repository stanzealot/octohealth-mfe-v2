/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import NProgress from 'nprogress';
import { API_CONFIG, ENV_CONFIG } from './config';
import { ApiError, type ApiErrorData } from '../../types/api';
import { useAuthStore } from '../../store/auth-store';

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    NProgress.start();
    const { accessToken } = useAuthStore.getState();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (ENV_CONFIG.enableLogging) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error: AxiosError) => {
    NProgress.done();
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    NProgress.done();
    return response;
  },
  async (error: AxiosError<ApiErrorData>) => {
    NProgress.done();

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new ApiError('Request timeout. Please check your connection.', 408));
    }

    if (!error.response) {
      return Promise.reject(new ApiError('Network error. Please check your internet connection.', 0));
    }

    const { status } = error.response;

    if (status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
    }

    return Promise.reject(error);
  },
);

export const api = {
  get: <T = unknown>(url: string, config?: any): Promise<AxiosResponse<T>> =>
    apiClient.get<T>(url, config),
  post: <T = unknown>(url: string, data?: unknown, config?: any): Promise<AxiosResponse<T>> =>
    apiClient.post<T>(url, data, config),
  put: <T = unknown>(url: string, data?: unknown, config?: any): Promise<AxiosResponse<T>> =>
    apiClient.put<T>(url, data, config),
  patch: <T = unknown>(url: string, data?: unknown, config?: any): Promise<AxiosResponse<T>> =>
    apiClient.patch<T>(url, data, config),
  delete: <T = unknown>(url: string, config?: any): Promise<AxiosResponse<T>> =>
    apiClient.delete<T>(url, config),
};

export default apiClient;
