/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SHELL_URL?: string;
  readonly VITE_SHARED_UI_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
