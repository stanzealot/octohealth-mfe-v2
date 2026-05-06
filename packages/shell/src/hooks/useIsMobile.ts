import { useState, useEffect } from 'react';

/**
 * Reactive hook that returns `true` when the viewport is narrower than `breakpoint` (default 768px).
 * Uses `window.matchMedia` so it updates on resize without a scroll/resize event listener.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    setIsMobile(mql.matches); // sync on mount
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
}
