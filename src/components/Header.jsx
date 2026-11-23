import { useEffect, useState } from 'react';
import LogoMark from './LogoMark.jsx';
import useTheme from '../hooks/useTheme.js';

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#steps' },
  { label: 'Stories', href: '#stories' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Community', href: '#community' },
  { label: 'Developer', href: '#developer' },
];

// which nav link each section belongs to (sections without a link of their own stay with the one above)
const SPY = [
  ['features', 'Features'],
  ['use-cases', 'Features'],
  ['steps', 'How it works'],
  ['stories', 'Stories'],
  ['pricing', 'Pricing'],
  ['faq', 'Pricing'],
];

function useActive(page) {
  const [active, setActive] = useState('');
  useEffect(() => {
    if (page !== 'home') {
      setActive('');
      return undefined;
    }
    let raf = 0;
    function update() {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let cur = '';
      for (const [id, label] of SPY) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) cur = label;
      }
      const end = document.getElementById('start');
      if (end && end.getBoundingClientRect().top <= line) cur = '';
      setActive(cur);
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [page]);
  return active;
}

function Header({ page = 'home' }) {
  const active = useActive(page);
  const [scrolled, setScrolled] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={(scrolled ? 'site-header is-scrolled' : 'site-header') + (open ? ' menu-open' : '')}>
      <a className="brand" href="#top" aria-label="Vecta Studio home">
        <LogoMark size={46} />
        <span className="brand-text">
          <span className="brand-name">vecta</span>
          <span className="brand-sub">STUDIO</span>
        </span>
      </a>

      <nav className="site-nav" aria-label="Main">
        {links.map((l) => (
          <a key={l.label} href={l.href} className={(page === 'developer' && l.label === 'Developer') || (page === 'community' && l.label === 'Community') || (page === 'home' && l.label === active) ? 'is-current' : ''} aria-current={(page === 'home' && l.label === active) || (page === 'developer' && l.label === 'Developer') || (page === 'community' && l.label === 'Community') ? 'true' : undefined}>{l.label}</a>
        ))}
      </nav>

      <div className="site-header-actions">
        <button
          type="button"
          className="theme-toggle theme-toggle-small"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light background' : 'Switch to dark background'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          <svg className="ico-sun" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4 7 7M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
          </svg>
          <svg className="ico-moon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.2 8.2 0 1 0 10.2 10.2z" />
          </svg>
        </button>
        <a className="btn btn-primary btn-small" href="https://app.vectastudio.ai/" target="_blank" rel="noopener">Login</a>
        <button type="button" className="menu-btn" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span /><span />
        </button>
      </div>
      <nav className="mobile-menu" aria-label="Mobile">
        {links.map((l) => (
          <a key={l.label} href={l.href} onClick={() => setOpen(false)} className={(page === 'developer' && l.label === 'Developer') || (page === 'community' && l.label === 'Community') || (page === 'home' && l.label === active) ? 'is-current' : ''} aria-current={(page === 'home' && l.label === active) || (page === 'developer' && l.label === 'Developer') || (page === 'community' && l.label === 'Community') ? 'true' : undefined}>{l.label}</a>
        ))}
      </nav>
    </header>
  );
}

export default Header;
