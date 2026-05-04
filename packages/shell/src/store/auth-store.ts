import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

export interface MenuItem {
  id: string;
  label: string;
  code: string;
  path: string;
  icon: string;
  sequence: number;
  partOf: string | null;
  moduleId: string;
  status?: boolean;
  createdAt?: string;
  children: MenuItem[];
}

export interface AuthUser {
  id: string;
  email: string;
  coreRoleId?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  role?: string;
  profilePicture?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  menu: MenuItem[];
}

interface AuthActions {
  login: (data: { user: AuthUser; accessToken: string; refreshToken: string; menu: MenuItem[] }) => void;
  logout: () => void;
  setTokens: (access: string, refresh: string) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  hydrateFromStorage: () => void;
}

// ─── Storage helpers ─────────────────────────────────────────────────────────
// We use plain sessionStorage instead of Zustand persist middleware.
// Zustand persist uses useSyncExternalStore which conflicts with React 19's
// concurrent commit phase in federation (causes Error #185 / infinite loop).

const STORAGE_KEY = 'auth-storage';

function readStorage(): Partial<AuthState> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStorage(state: Partial<AuthState>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* quota or private browsing */ }
}

function clearStorage() {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

// ─── Store ───────────────────────────────────────────────────────────────────
// This store is EXPOSED via federation as 'shell/auth-store'.
// Because zustand is shared as a singleton, all remotes read the SAME
// in-memory instance that the shell populated after login.

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  accessToken: null,
  refreshToken: null,
  menu: [],
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,

  // Called after a successful login — API call is done OUTSIDE the store
  login: ({ user, accessToken, refreshToken, menu }) => {
    writeStorage({ isAuthenticated: true, user, accessToken, refreshToken, menu });
    set({ isAuthenticated: true, isLoading: false, user, accessToken, refreshToken, menu });
  },

  logout: () => {
    clearStorage();
    set({ ...initialState, isLoading: false });
  },

  setTokens: (accessToken, refreshToken) => {
    const current = readStorage();
    writeStorage({ ...current, accessToken, refreshToken });
    set({ accessToken, refreshToken });
  },

  setLoading: (isLoading) => set({ isLoading }),

  clearAuth: () => {
    clearStorage();
    set({ ...initialState, isLoading: false });
  },

  // Called once on app mount (from bootstrap useEffect) — reads sessionStorage
  // and hydrates the in-memory store so the user stays logged in on refresh.
  hydrateFromStorage: () => {
    const saved = readStorage();
    if (saved.isAuthenticated && saved.user && saved.accessToken) {
      set({
        isAuthenticated: true,
        isLoading: false,
        user: saved.user ?? null,
        accessToken: saved.accessToken ?? null,
        refreshToken: saved.refreshToken ?? null,
        menu: saved.menu ?? [],
      });
    } else {
      clearStorage();
      set({ ...initialState, isLoading: false });
    }
  },
}));

// ─── Selectors ───────────────────────────────────────────────────────────────
// Selectors returning objects MUST use useShallow — otherwise Zustand sees a
// new object reference every render → schedules another render → infinite loop.

export const useAuth = () =>
  useAuthStore(
    useShallow((s) => ({
      isAuthenticated: s.isAuthenticated,
      isLoading:       s.isLoading,
      user:            s.user,
      menu:            s.menu,
      accessToken:     s.accessToken,
    })),
  );

export const useAuthActions = () =>
  useAuthStore(
    useShallow((s) => ({
      login:             s.login,
      logout:            s.logout,
      setTokens:         s.setTokens,
      clearAuth:         s.clearAuth,
      hydrateFromStorage: s.hydrateFromStorage,
      setLoading:        s.setLoading,
    })),
  );
