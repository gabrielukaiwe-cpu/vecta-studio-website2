const LOGOS = [
  { id: 'gospelcinema', name: 'GospelCinema' },
  { id: 'parentyn', name: 'Parentyn', src: './logos/parentyn.png' },
  { id: 'codematic', name: 'Codematic', src: './logos/codematic.png' },
  { id: 'conviso', name: 'Conviso', src: './logos/conviso.svg' },
];

function Logo({ l }) {
  if (l.id === 'gospelcinema') {
    return (
      <span className="logo-item logo-gospel">
        <img src="./logos/gospelcinema.png" alt="" width="34" height="34" />
        <span>GospelCinema</span>
      </span>
    );
  }
  return (
    <span className="logo-item">
      <img className="logo-img" src={l.src} alt={l.name} height={l.id === 'parentyn' ? 46 : 34} style={{ height: l.id === 'parentyn' ? 46 : 34 }} />
    </span>
  );
}

// the brands Vecta Studio has worked with, sliding slowly sideways
export default function Logos() {
  const row = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];
  return (
    <section className="logos" aria-label="Brands that work with Vecta Studio">
      <p className="logos-label">Trusted by innovative teams at</p>
      <div className="logos-marquee">
        <div className="logos-track">
          {row.map((l, i) => (
            <span key={i} aria-hidden={i >= LOGOS.length}>
              <Logo l={l} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
