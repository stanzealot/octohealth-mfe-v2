import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

type ColorMode = 'light' | 'dark';

const COLOR_MODE_KEY = 'octohealth-color-mode';

function readColorMode(): ColorMode {
  try {
    return (localStorage.getItem(COLOR_MODE_KEY) as ColorMode) ?? 'light';
  } catch {
    return 'light';
  }
}

/**
 * Sets data-theme="dark" on <html> — CSS var overrides in index.css
 * pick this up automatically, including in all federation remotes.
 */
function applyColorMode(mode: ColorMode) {
  if (mode === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

interface ColorModeState {
  colorMode: ColorMode;
}

interface ColorModeActions {
  /** Called once on mount — reads localStorage and applies to DOM */
  hydrateColorMode: () => void;
  setColorMode:     (mode: ColorMode) => void;
  toggleColorMode:  () => void;
}

export const useColorModeStore = create<ColorModeState & ColorModeActions>((set, get) => ({
  colorMode: 'light',

  hydrateColorMode: () => {
    const mode = readColorMode();
    applyColorMode(mode);
    set({ colorMode: mode });
  },

  setColorMode: (mode) => {
    try { localStorage.setItem(COLOR_MODE_KEY, mode); } catch { /* ignore */ }
    applyColorMode(mode);
    set({ colorMode: mode });
  },

  toggleColorMode: () => {
    const next: ColorMode = get().colorMode === 'light' ? 'dark' : 'light';
    try { localStorage.setItem(COLOR_MODE_KEY, next); } catch { /* ignore */ }
    applyColorMode(next);
    set({ colorMode: next });
  },
}));

// ─── Selectors ───────────────────────────────────────────────────────────────

export const useColorMode = () =>
  useColorModeStore(useShallow((s) => ({ colorMode: s.colorMode })));

export const useColorModeActions = () =>
  useColorModeStore(
    useShallow((s) => ({
      hydrateColorMode: s.hydrateColorMode,
      setColorMode:     s.setColorMode,
      toggleColorMode:  s.toggleColorMode,
    })),
  );
