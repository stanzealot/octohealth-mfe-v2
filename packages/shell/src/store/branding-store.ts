import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

export interface BrandingConfig {
  primaryColor:      string;  // e.g. '#0C6525'
  primaryLightColor: string;  // auto-generated: 90% white blend
  primaryDarkColor:  string;  // auto-generated: 30% black blend
  logoUrl:           string | null;
  companyName:       string;
}

const DEFAULT_BRANDING: BrandingConfig = {
  primaryColor:      '#0C6525',
  primaryLightColor: '#F0F9F5',
  primaryDarkColor:  '#094a1b',
  logoUrl:           null,
  companyName:       'Bastion',
};

const BRANDING_KEY = 'octohealth-branding';

function readBranding(): BrandingConfig {
  try {
    const raw = localStorage.getItem(BRANDING_KEY);
    return raw ? { ...DEFAULT_BRANDING, ...JSON.parse(raw) } : DEFAULT_BRANDING;
  } catch {
    return DEFAULT_BRANDING;
  }
}

function writeBranding(cfg: BrandingConfig) {
  try { localStorage.setItem(BRANDING_KEY, JSON.stringify(cfg)); } catch { /* quota */ }
}

/**
 * Sets CSS custom properties on <html> so ALL federation remotes pick them up
 * instantly — CSS vars cascade through the entire DOM regardless of shadow DOM.
 */
export function applyBranding(cfg: BrandingConfig) {
  const root = document.documentElement;
  root.style.setProperty('--brand-primary',       cfg.primaryColor);
  root.style.setProperty('--brand-primary-light', cfg.primaryLightColor);
  root.style.setProperty('--brand-primary-dark',  cfg.primaryDarkColor);
}

interface BrandingState {
  branding: BrandingConfig;
}

interface BrandingActions {
  /** Reads localStorage (later: calls API) and applies CSS vars */
  fetchBranding:    () => void;
  /** Saves to localStorage + API mock and applies CSS vars */
  saveBranding:     (cfg: BrandingConfig) => Promise<void>;
  /** Updates CSS vars instantly without saving — for live preview */
  previewBranding:  (cfg: BrandingConfig) => void;
}

export const useBrandingStore = create<BrandingState & BrandingActions>((set) => ({
  branding: DEFAULT_BRANDING,

  fetchBranding: () => {
    const cfg = readBranding();
    applyBranding(cfg);
    set({ branding: cfg });
  },

  previewBranding: (cfg) => {
    // Only update CSS vars — don't persist or update store
    applyBranding(cfg);
  },

  saveBranding: async (cfg) => {
    // MOCK: save to localStorage only.
    // Replace with real API call later:
    //   await api.post('/settings/branding', cfg)
    writeBranding(cfg);
    applyBranding(cfg);
    set({ branding: cfg });
  },
}));

// ─── Selectors ───────────────────────────────────────────────────────────────

export const useBranding = () =>
  useBrandingStore(useShallow((s) => ({ branding: s.branding })));

export const useBrandingActions = () =>
  useBrandingStore(
    useShallow((s) => ({
      fetchBranding:   s.fetchBranding,
      saveBranding:    s.saveBranding,
      previewBranding: s.previewBranding,
    })),
  );
