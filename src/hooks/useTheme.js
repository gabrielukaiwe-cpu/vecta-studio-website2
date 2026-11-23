import { useCallback, useSyncExternalStore } from 'react';

// 'dark' (default) or 'light'. One shared value for the whole page, kept on <html data-theme>
// and remembered in the browser.
let theme = 'dark';
try { if (localStorage.getItem('vecta-theme') === 'light') theme = 'light'; } catch (e) { /* ignore */ }
if (typeof document !== 'undefined') document.documentElement.dataset.theme = theme;
const subs = new Set();

function set(next) {
  theme = next;
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('vecta-theme', next); } catch (e) { /* ignore */ }
  subs.forEach((f) => f());
}

export default function useTheme() {
  const t = useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => theme, () => 'dark');
  const toggle = useCallback(() => set(theme === 'dark' ? 'light' : 'dark'), []);
  return [t, toggle];
}
