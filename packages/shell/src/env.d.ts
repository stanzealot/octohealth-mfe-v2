/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SHARED_UI_URL?: string;
  readonly VITE_REMOTE_CRM_URL?: string;
  readonly VITE_REMOTE_ADMIN_URL?: string;
  readonly VITE_REMOTE_SALES_URL?: string;
  readonly VITE_API_BASE_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
