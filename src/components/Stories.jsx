import { useCallback, useEffect, useRef, useState } from 'react';
import useGrowIn from '../hooks/useGrowIn.js';
import TypedTitle from './TypedTitle.jsx';
import Avatar from './Avatar.jsx';

const LINES = ['Real creators.', 'Real stories.'];

const PEOPLE = [
  { who: 'gabriel', name: 'Gabriel Ukaiwe', role: 'Content Creator', quote: 'Setting up multiple aspect ratios used to take hours. Now it takes one second.' },
  { who: 'faustina', name: 'Faustina Oghenevwede', role: 'Social Media Manager', quote: 'An all-in-one platform. I never switched tools, and AI Assist refined my prompts for me.' },
  { who: 'uche', name: 'Uche Livingstone', role: 'Content Creator', quote: 'Cinematic results that pass for pro shots.' },
  { who: 'irobuisi', name: 'Irobuisi Chibuzor', role: 'Tech Reviewer', quote: 'The script generator is scarily good. It captures my voice perfectly.' },
  { who: 'tolu', name: 'Tolu Ola', role: 'Marketing Strategist', quote: 'We go from campaign brief to finished video in one afternoon, and it still sounds like our brand.' },
  { who: 'oluwaseyi', name: 'Oluwatobi Akintunlese', role: 'Software Engineer', quote: 'I describe what I need and get a finished video.' },
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

export default function Stories() {
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
    <section className="problem stories" id="stories" ref={ref}>
      <div className="problem-glow" aria-hidden="true" />
      <div className="problem-inner">
        <div className="problem-head">
          <span className="eyebrow">Beta testers</span>
          {seen ? (
            <TypedTitle lines={LINES} className="problem-title" reduce={reduce} onDone={onDone} />
          ) : (
            <h2 className="problem-title problem-ghost" aria-hidden="true">
              <span className="typed-line">{LINES[0]}</span>
              <span className="typed-line">{LINES[1]}</span>
            </h2>
          )}
          <p className={`problem-sub rise ${on(1)}`}>Vecta Studio is shaped by the creators who use it every day.</p>
        </div>

        <div className="stories-people">
          {PEOPLE.map((s, i) => (
            <figure className={`story-mini rise ${on(2)}`} style={{ '--d': `${i * 90}ms` }} key={s.who}>
              <blockquote>{s.quote}</blockquote>
              <figcaption>
                <Avatar who={s.who} size={56} />
                <span><strong>{s.name}</strong><em>{s.role}</em></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
