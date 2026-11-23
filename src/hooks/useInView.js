import { useEffect, useState } from 'react';

// true once the element has scrolled into view (stays true), plus a live "visible now" flag
export default function useInView(ref, { threshold = 0.35 } = {}) {
  const [seen, setSeen] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return { seen, visible };
}
