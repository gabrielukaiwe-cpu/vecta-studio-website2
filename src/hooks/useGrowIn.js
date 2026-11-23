import { useEffect } from 'react';

// As the section scrolls up from the bottom of the screen it grows from small to full size.
// Writes a 0..1 value to the CSS variable --p on the element.
export default function useGrowIn(ref, reduceMotion, onGrown) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reduceMotion) {
      el.style.setProperty('--p', '1');
      if (onGrown) onGrown();
      return undefined;
    }
    let raf = 0;
    function update() {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top edge is at the bottom of the screen, 1 when it is 55% up the screen
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.8)));
      const eased = 1 - (1 - p) ** 3;
      el.style.setProperty('--p', eased.toFixed(4));
      if (p > 0.9 && onGrown) onGrown();
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref, reduceMotion, onGrown]);
}
