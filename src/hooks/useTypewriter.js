import { useEffect, useState } from 'react';

// Types a text out one letter at a time.
// Returns how many letters to show and whether it has finished.
export default function useTypewriter(text, { startDelay = 500, speed = 55, skip = false } = {}) {
  const [count, setCount] = useState(skip ? text.length : 0);

  useEffect(() => {
    if (skip) {
      setCount(text.length);
      return undefined;
    }
    let timer;
    let n = 0;
    function tick() {
      n += 1;
      setCount(n);
      if (n < text.length) {
        // tiny pauses after a full stop make it feel like a real person typing
        const prev = text[n - 1];
        const extra = prev === '.' ? 260 : prev === ' ' ? 20 : 0;
        timer = setTimeout(tick, speed + extra + Math.random() * 25);
      }
    }
    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
  }, [text, startDelay, speed, skip]);

  return { count, done: count >= text.length };
}
