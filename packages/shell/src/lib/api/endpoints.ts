export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/passwordless',
    RESET_PASSWORD: '/auth/reset-password',
    PASSWORDLESS_CALLBACK: '/auth/passwordless/callback',
  },
  MFA: {
    SETUP: '/mfa/setup',
    ENABLE: '/mfa/enable',
    VERIFY: '/mfa/verify',
    DISABLE: '/mfa/disable',
  },
} as const;
