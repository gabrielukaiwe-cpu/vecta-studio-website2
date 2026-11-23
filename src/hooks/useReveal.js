import { useCallback, useEffect, useRef, useState } from 'react';
import useGrowIn from './useGrowIn.js';

export function usePrefersReducedMotion() {
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

// shared choreography for a section: grow from a box, type the title, then reveal the rest
export default function useReveal() {
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
  return { reduce, ref, seen, onDone, on };
}
