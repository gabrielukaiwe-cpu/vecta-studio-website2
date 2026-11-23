import { useEffect, useRef, useState } from 'react';
import DotField from './DotField.jsx';
import useTypewriter from '../hooks/useTypewriter.js';
import useTheme from '../hooks/useTheme.js';

const LINES = ['Whatever you imagine,', 'Vecta Studio makes real.'];
const HEADLINE = LINES.join(' ');
const TYPED_TEXT = LINES.join('');
const SUB = 'Create videos, images and music. Edit and clone clips. All in one place.';

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduce(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduce;
}

function Hero() {
  const reduce = usePrefersReducedMotion();
  const [theme] = useTheme();
  const contentRef = useRef(null);
  const { count, done } = useTypewriter(TYPED_TEXT, { startDelay: 1800, speed: 42, skip: reduce });

  // what shows up after the typing is finished, one step at a time
  const [stage, setStage] = useState(reduce ? 4 : 0);
  useEffect(() => {
    if (!done) return undefined;
    if (reduce) {
      setStage(4);
      return undefined;
    }
    const timers = [
      setTimeout(() => setStage(1), 80),    // sub-text rises
      setTimeout(() => setStage(2), 450),   // buttons fade in
    ];
    return () => timers.forEach(clearTimeout);
  }, [done, reduce]);

  // split what has been typed so far across the three lines
  let left = count;
  const lines = LINES.map((line, i) => {
    const take = Math.min(left, line.length);
    left -= take;
    return { typed: line.slice(0, take), rest: line.slice(take), i };
  });
  const caretLine = (lines.find((l) => l.rest.length > 0) || lines[lines.length - 1]).i;

  return (
    <section className="hero" id="top">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-glow-light" aria-hidden="true" />
      <DotField avoidRef={contentRef} show reduceMotion={reduce} light={theme === 'light'} />

      <div className="hero-content" ref={contentRef}>
        <h1 className="hero-title" aria-label={HEADLINE}>
          {lines.map((l) => (
            <span className="hero-line hero-line-own" aria-hidden="true" key={l.i}>
              {l.typed}
              {l.i === caretLine && (count > 0 || done) && <span className={done ? 'caret caret-idle' : 'caret'} />}
              <span className="hero-title-rest">{l.rest}</span>
            </span>
          ))}
        </h1>

        <p className={stage >= 1 ? 'hero-sub is-in' : 'hero-sub'}>{SUB}</p>

        <div className={stage >= 2 ? 'hero-actions is-in' : 'hero-actions'}>
          <a className="btn btn-primary btn-large" href="https://app.vectastudio.ai/" target="_blank" rel="noopener">Start Creating</a>
          <a className="btn btn-glass btn-large" href="#steps">See how it works</a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
