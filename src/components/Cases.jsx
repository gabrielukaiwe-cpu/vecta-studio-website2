import { useCallback, useEffect, useRef, useState } from 'react';
import useGrowIn from '../hooks/useGrowIn.js';
import TypedTitle from './TypedTitle.jsx';
import LoopVideo from './LoopVideo.jsx';

const LINES = ['Endless', 'possibilities.'];

const CASES = [
  { id: 'c-market', title: 'Marketing & sales', line: 'Ads, product demos and promos that sell.' },
  { id: 'c-anim', title: '3D animation', line: 'Stylised characters and stories, no rendering software.' },
  { id: 'c-creator', title: 'Creators & podcasts', line: 'Talking-head videos and clips, ready to post.' },
  { id: 'c-learn', title: 'Tutorials & explainers', line: 'Turn complex topics into clear, captioned videos.' },
];

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(m.matches);
    const on = () => setReduce(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return reduce;
}

export default function Cases() {
  const reduce = usePrefersReducedMotion();
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const [stage, setStage] = useState(0);
  const [active, setActive] = useState(0);
  const onGrown = useCallback(() => setSeen(true), []);
  useGrowIn(ref, reduce, onGrown);

  const fired = useRef(false);
  const onDone = useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    setTimeout(() => setStage(1), 60);
    setTimeout(() => setStage(2), 300);
  }, []);
  const on = (n) => (stage >= n || reduce ? 'is-in' : '');

  return (
    <section className="problem cases" id="use-cases" ref={ref}>
      <div className="problem-glow" aria-hidden="true" />
      <div className="problem-inner">
        <div className="problem-head">
          <span className="eyebrow">Use cases</span>
          {seen ? (
            <TypedTitle lines={LINES} className="problem-title" reduce={reduce} onDone={onDone} />
          ) : (
            <h2 className="problem-title problem-ghost" aria-hidden="true">
              <span className="typed-line">{LINES[0]}</span>
              <span className="typed-line">{LINES[1]}</span>
            </h2>
          )}
          <p className={`problem-sub rise ${on(1)}`}>Whatever your niche, Vecta Studio fits.</p>
        </div>

        <div className="cases-row" role="list">
          {CASES.map((c, i) => (
            <article
              className={`case-card rise ${on(2)} ${active === i ? 'is-active' : ''}`}
              style={{ '--d': `${i * 90}ms` }}
              key={c.id}
              role="listitem"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              tabIndex={0}
            >
              <LoopVideo src={`./media/${c.id}.mp4`} poster={`./media/${c.id}.jpg`} />
              <div className="case-shade" aria-hidden="true" />
              <div className="case-text">
                <h3>{c.title}</h3>
                <p>{c.line}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
