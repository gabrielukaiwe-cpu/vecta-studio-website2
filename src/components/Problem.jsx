import { useCallback, useEffect, useRef, useState } from 'react';
import useTypewriter from '../hooks/useTypewriter.js';
import useGrowIn from '../hooks/useGrowIn.js';
import LoopVideo from './LoopVideo.jsx';

const LINE_A = 'Creating Content Should';
const LINE_B = 'Be Easy.';
const TYPED = LINE_A + LINE_B;
const SUB = 'Too many tabs. Too many subscriptions. Vecta Studio puts everything in one place.';

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

// mounted only once the section is on screen, so the typing starts when you arrive
function TypedHeading({ reduce, onDone }) {
  const { count, done } = useTypewriter(TYPED, { startDelay: 150, speed: 30, skip: reduce });
  useEffect(() => {
    if (done) onDone();
  }, [done, onDone]);
  const a = TYPED.slice(0, Math.min(count, LINE_A.length));
  const b = count > LINE_A.length ? TYPED.slice(LINE_A.length, count) : '';
  const caret = <span className={`caret ${done ? 'caret-idle' : ''}`} aria-hidden="true" />;
  return (
    <h2 className="problem-title" aria-label={`${LINE_A} ${LINE_B}`}>
      <span className="problem-line" aria-hidden="true">
        {a}
        {!b && caret}
        <span className="hero-title-rest">{LINE_A.slice(a.length)}</span>
      </span>
      <span className="problem-line" aria-hidden="true">
        {b}
        {b && caret}
        <span className="hero-title-rest">{LINE_B.slice(b.length)}</span>
      </span>
    </h2>
  );
}

export default function Problem() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const [seen, setSeen] = useState(false);
  const [stage, setStage] = useState(0);
  const onGrown = useCallback(() => setSeen(true), []);
  useGrowIn(sectionRef, reduce, onGrown);

  const finished = useRef(false);
  const onDone = useRef(() => {
    if (finished.current) return;
    finished.current = true;
    setTimeout(() => setStage(1), 60);
    setTimeout(() => setStage(2), 350);
  });

  return (
    <section className="problem" id="problem" ref={sectionRef}>
      <div className="problem-glow" aria-hidden="true" />
      <div className="problem-inner">
        <div className="problem-head" ref={headRef}>
          <span className="eyebrow">The problem</span>
          {seen ? <TypedHeading reduce={reduce} onDone={onDone.current} /> : <h2 className="problem-title problem-ghost" aria-hidden="true"><span className="problem-line">{LINE_A}</span><span className="problem-line">{LINE_B}</span></h2>}
          <p className={`problem-sub ${stage >= 1 || reduce ? 'is-in' : ''}`}>{SUB}</p>
        </div>

        <div className={`problem-stage ${stage >= 2 || reduce ? 'is-in' : ''}`}>
          <div className="problem-video">
            <LoopVideo src="./media/problem.mp4" poster="./media/problem.jpg" />
            <div className="problem-video-shade" aria-hidden="true" />
          </div>
        </div>

        <div className={`problem-compare ${stage >= 2 || reduce ? 'is-in' : ''}`}>
          <div className="compare-card">
            <span className="compare-tag">Before Vecta Studio</span>
            <strong>8–12 hours</strong>
            <span>to make one video, with 5–7 tools open</span>
          </div>
          <div className="compare-card compare-card-new">
            <span className="compare-tag compare-tag-new">With Vecta Studio</span>
            <strong>45 minutes</strong>
            <span>from idea to published video, in one studio</span>
          </div>
        </div>
      </div>
    </section>
  );
}
