import LogoMark from './LogoMark.jsx';

const SOCIALS = [
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@vectastudio.ai',
    icon: <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.8 5.8 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z" fill="currentColor" stroke="none" />,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/vectastudio.ai',
    icon: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@vecta_studio',
    icon: (
      <>
        <rect x="2.8" y="5.8" width="18.4" height="12.4" rx="4" />
        <path d="M10.2 9.4v5.2l4.6-2.6z" fill="currentColor" stroke="none" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-about">
          <a className="brand" href="#top" aria-label="Vecta Studio home">
            <LogoMark size={46} />
            <span className="brand-text">
              <span className="brand-name">vecta</span>
              <span className="brand-sub">STUDIO</span>
            </span>
          </a>
          <p>The unified creative studio for creators who want to produce more, stress less and grow faster.</p>
        </div>
        <nav className="footer-col" aria-label="Product">
          <h4>Product</h4>
          <a href="#features">Features</a>
          <a href="#steps">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#community">Community</a>
          <a href="#developer">Developer Docs</a>
        </nav>
        <nav className="footer-col" aria-label="Company">
          <h4>Company</h4>
          <a href="https://vectastudio.ai/terms" target="_blank" rel="noopener">Terms of Use</a>
          <a href="https://vectastudio.ai/privacy" target="_blank" rel="noopener">Privacy Policy</a>
          <a href="https://vectastudio.ai/contact" target="_blank" rel="noopener">Contact Us</a>
        </nav>
        <div className="footer-col" role="group" aria-label="Follow us">
          <h4>Follow us</h4>
          <div className="footer-social">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`Vecta Studio on ${s.name}`} title={s.name}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{s.icon}</svg>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-word" aria-hidden="true">vecta studio</div>
      <div className="footer-family">
        <span>A product of</span>
        <a href="https://codematic.io" target="_blank" rel="noopener noreferrer" aria-label="Codematic Technology">
          <img src="./logos/codematic.png" alt="Codematic" height="30" />
        </a>
        <span className="footer-family-name">Codematic Technology</span>
      </div>
      <p className="footer-legal">&copy; 2026 Vecta Studio. All rights reserved. Built for creators, by creators.</p>
    </footer>
  );
}
