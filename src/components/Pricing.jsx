import TypedTitle from './TypedTitle.jsx';
import useReveal from '../hooks/useReveal.js';

const LINES = ['One platform.', 'Choose your scale.'];

const PLANS = [
  {
    name: 'Free trial',
    note: 'Try every tool before you pay',
    price: '$0',
    per: '',
    sub: '100 credits, once. About 15 seconds of video.',
    items: ['Every creative tool', 'Script and story writing', 'AI narration and voices', 'Captions and shot edits', 'Credits expire after 30 days'],
    cta: 'Start free',
    href: 'https://app.vectastudio.ai/',
  },
  {
    name: 'Pro',
    note: 'For creators publishing every month',
    price: '$30',
    per: '/month',
    sub: 'or $300 a year (2 months free)',
    items: ['1,000 credits every month', 'About 2½ minutes of video', 'Every creative tool', 'Up to 1080p export', 'Top-ups: $30 for 1,000 credits'],
    cta: 'Start Pro',
    href: 'https://app.vectastudio.ai/start?plan=pro',
    popular: true,
  },
  {
    name: 'Creator',
    note: 'For high-volume creators and teams',
    price: '$99',
    per: '/month',
    sub: 'or $990 a year (2 months free)',
    items: ['3,300 credits every month', 'About 9 minutes of video', 'Every creative tool', 'Up to 1080p export', 'Top-ups: $30 for 1,000 credits'],
    cta: 'Start Creator',
    href: 'https://app.vectastudio.ai/start?plan=creator',
  },
];

export default function Pricing() {
  const { reduce, ref, seen, onDone, on } = useReveal();
  return (
    <section className="studio pricing" id="pricing" ref={ref}>
      <div className="studio-glow" aria-hidden="true" />
      <div className="studio-inner">
        <div className="studio-head">
          <span className="eyebrow eyebrow-dark">Pricing</span>
          {seen ? (
            <TypedTitle lines={LINES} className="studio-title" reduce={reduce} onDone={onDone} />
          ) : (
            <h2 className="studio-title studio-ghost" aria-hidden="true">
              <span className="typed-line">{LINES[0]}</span>
              <span className="typed-line">{LINES[1]}</span>
            </h2>
          )}
          <p className={`studio-sub rise ${on(1)}`}>
            Every plan includes every tool. You pay in credits: one second of standard video is 6 credits.
          </p>
        </div>

        <div className="plans">
          {PLANS.map((p, i) => (
            <article className={`plan rise ${on(2)} ${p.popular ? 'plan-pop' : ''}`} style={{ '--d': `${i * 100}ms` }} key={p.name}>
              {p.popular && <span className="plan-badge">Most popular</span>}
              <h3>{p.name}</h3>
              <p className="plan-note">{p.note}</p>
              <p className="plan-price"><strong>{p.price}</strong><span>{p.per}</span></p>
              <p className="plan-sub">{p.sub}</p>
              <ul>
                {p.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <a className={`btn btn-large ${p.popular ? 'btn-primary' : 'btn-glass'}`} href={p.href} target="_blank" rel="noopener">{p.cta}</a>
            </article>
          ))}
        </div>

        <p className={`plans-foot rise ${on(2)}`} style={{ '--d': '380ms' }}>
          Secure payment · Cancel anytime · No card needed for the free trial
        </p>
      </div>
    </section>
  );
}
