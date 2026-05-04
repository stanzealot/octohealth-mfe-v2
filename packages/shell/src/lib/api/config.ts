export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://dev-api.octohealth.io/admin/api/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  CACHE_TIME: 1000 * 60 * 5,
  STALE_TIME: 1000 * 60 * 2,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

export const ENV_CONFIG = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  enableLogging: import.meta.env.DEV,
} as const;
