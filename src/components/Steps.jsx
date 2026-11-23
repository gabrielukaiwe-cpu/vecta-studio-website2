import { useCallback, useEffect, useRef, useState } from 'react';
import useGrowIn from '../hooks/useGrowIn.js';
import useInView from '../hooks/useInView.js';
import TypedTitle from './TypedTitle.jsx';
import LoopVideo from './LoopVideo.jsx';

const LINES = ['Idea to video', 'in four steps.'];
const STEP_MS = 6000;

const STEPS = [
  { id: 's-1', title: 'Vision', line: 'Describe your idea in plain English. Vecta Studio turns it into a story brief.' },
  { id: 's-2', title: 'Build', line: 'Scripts, scenes, voiceovers, music and visuals, generated from one idea.' },
  { id: 's-3', title: 'Refine', line: 'Swap a voice, redo a scene or auto-cut clips in seconds.' },
  { id: 's-4', title: 'Publish', line: 'Export to YouTube, TikTok and Instagram in one click.' },
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

export default function Steps() {
  const reduce = usePrefersReducedMotion();
  const ref = useRef(null);
  const bodyRef = useRef(null);
  const [seen, setSeen] = useState(false);
  const [stage, setStage] = useState(0);
  const [active, setActive] = useState(0);
  const { visible } = useInView(bodyRef, { threshold: 0.4 });
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

  // move to the next step on its own while the section is on screen
  useEffect(() => {
    if (!visible || stage < 2 || reduce) return undefined;
    const t = setTimeout(() => setActive((a) => (a + 1) % STEPS.length), STEP_MS);
    return () => clearTimeout(t);
  }, [active, visible, stage, reduce]);

  return (
    <section className="studio steps" id="steps" ref={ref}>
      <div className="studio-glow" aria-hidden="true" />
      <div className="studio-inner">
        <div className="studio-head">
          <span className="eyebrow eyebrow-dark">How it works</span>
          {seen ? (
            <TypedTitle lines={LINES} className="studio-title" reduce={reduce} onDone={onDone} />
          ) : (
            <h2 className="studio-title studio-ghost" aria-hidden="true">
              <span className="typed-line">{LINES[0]}</span>
              <span className="typed-line">{LINES[1]}</span>
            </h2>
          )}
          <p className={`studio-sub rise ${on(1)}`}>No learning curve. No technical setup.</p>
        </div>

        <div className={`steps-body rise ${on(2)}`} ref={bodyRef}>
          <ol className="steps-list">
            {STEPS.map((s, i) => (
              <li key={s.id} className={active === i ? 'is-active' : ''}>
                <button type="button" onClick={() => setActive(i)} aria-current={active === i}>
                  <span className="step-num">{i + 1}</span>
                  <span className="step-copy">
                    <strong>{s.title}</strong>
                    <span className="step-line">{s.line}</span>
                  </span>
                  <span className="step-bar" aria-hidden="true">
                    {active === i && <i key={`${i}-${visible}`} style={{ animationDuration: `${STEP_MS}ms` }} />}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="steps-screen">
            <div className="steps-clip is-active">
              <LoopVideo src="./media/s-1.mp4" poster="./media/s-1.jpg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
