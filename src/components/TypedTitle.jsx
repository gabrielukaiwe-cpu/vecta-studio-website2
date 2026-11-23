import { useEffect } from 'react';
import useTypewriter from '../hooks/useTypewriter.js';

// A headline that types itself out, with the coloured caret. Mount it when it should start.
export default function TypedTitle({ lines, className = '', reduce, speed = 30, startDelay = 150, onDone }) {
  const text = lines.join('');
  const { count, done } = useTypewriter(text, { startDelay, speed, skip: reduce });
  useEffect(() => {
    if (done && onDone) onDone();
  }, [done, onDone]);

  let left = count;
  const parts = lines.map((line) => {
    const shown = line.slice(0, Math.max(0, Math.min(left, line.length)));
    left -= line.length;
    return { line, shown };
  });
  const caretAt = parts.findIndex((p) => p.shown.length < p.line.length);
  const caretLine = caretAt === -1 ? parts.length - 1 : caretAt;

  return (
    <h2 className={className} aria-label={lines.join(' ')}>
      {parts.map((p, i) => (
        <span className="typed-line" aria-hidden="true" key={p.line}>
          {p.shown}
          {i === caretLine && (count > 0 || done) && <span className={`caret ${done ? 'caret-idle' : ''}`} />}
          <span className="hero-title-rest">{p.line.slice(p.shown.length)}</span>
        </span>
      ))}
    </h2>
  );
}
