export interface ApiResponse<T = unknown> {
  status: number;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorData {
  message: string;
  statusCode: number;
  error?: string;
  details?: Record<string, unknown>;
  code?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface AuthApiResponseData {
  access_token: string;
  refresh_token: string;
  user: User;
  menu: MenuItem[];
}

export interface User {
  id: string;
  email: string;
  coreRoleId: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  role?: string;
  profilePicture?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  code: string;
  path: string;
  icon: string;
  sequence: number;
  partOf: string | null;
  moduleId: string;
  status: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  children: MenuItem[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
  token?: string;
}

export interface VerifyOTPRequest {
  code: string;
  email: string;
}
