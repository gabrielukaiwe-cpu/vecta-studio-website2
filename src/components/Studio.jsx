import { useCallback, useEffect, useRef, useState } from 'react';
import useGrowIn from '../hooks/useGrowIn.js';
import TypedTitle from './TypedTitle.jsx';
import LoopVideo from './LoopVideo.jsx';

const LINES = ['One studio.', 'Every tool.'];

const CARDS = [
  { id: 'f-video', title: 'Video Creation', line: 'Scenes, transitions and sound, built from one brief.' },
  { id: 'f-image', title: 'Image Generator', line: 'Product visuals in any style, in seconds.' },
  { id: 'f-voice', title: 'Audio & Voice Over', line: 'Natural voices that read your script.' },
  { id: 'f-music', title: 'Music Creation', line: 'Original tracks that fit your video.' },
];

const MORE = [
  { title: 'Video Editing', line: 'Trim, restyle and refine without leaving the studio.' },
  { title: 'Clone Videos', line: 'Recreate a video you love with your own idea.' },
  { title: 'Voice Cloning', line: 'Use your own voice in every video.' },
  { title: 'Script Generator', line: 'A full script from a single sentence.' },
  { title: 'Caption Generation', line: 'Accurate captions, added automatically.' },
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

export default function Studio() {
  const reduce = usePrefersReducedMotion();
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const [stage, setStage] = useState(0);
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
    <section className="studio" id="features" ref={ref}>
      <div className="studio-glow" aria-hidden="true" />
      <div className="studio-inner">
        <div className="studio-head">
          <span className="eyebrow eyebrow-dark">Everything in one place</span>
          {seen ? (
            <TypedTitle lines={LINES} className="studio-title" reduce={reduce} onDone={onDone} />
          ) : (
            <h2 className="studio-title studio-ghost" aria-hidden="true">
              <span className="typed-line">{LINES[0]}</span>
              <span className="typed-line">{LINES[1]}</span>
            </h2>
          )}
          <p className={`studio-sub rise ${on(1)}`}>Everything Vecta Studio can do, working together in one place.</p>
        </div>

        <div className="studio-grid">
          {CARDS.map((c, i) => (
            <article className={`studio-card rise ${on(2)}`} style={{ '--d': `${i * 90}ms` }} key={c.id}>
              <LoopVideo src={`./media/${c.id}.mp4`} poster={`./media/${c.id}.jpg`} />
              <div className="studio-card-shade" aria-hidden="true" />
              <div className="studio-card-text">
                <h3>{c.title}</h3>
                <p>{c.line}</p>
              </div>
            </article>
          ))}
        </div>

        <ul className={`studio-extras rise ${on(2)}`} style={{ '--d': '420ms' }}>
          {MORE.map((m) => (
            <li key={m.title}>
              <strong>{m.title}</strong>
              <span>{m.line}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
