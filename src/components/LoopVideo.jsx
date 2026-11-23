import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { sound } from '../sound.js';

// A looping video that only plays while it is on screen (and while `active` is true).
// It starts muted. The small speaker button turns the sound on (one video at a time).
export default function LoopVideo({ src, poster, className = '', active = true }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const owner = useSyncExternalStore(sound.subscribe, sound.get, () => null);
  const unmuted = owner === src;

  useEffect(() => {
    const v = ref.current;
    if (!v) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = !unmuted;
    if (inView && active) {
      const p = v.play();
      if (p && p.catch) p.catch(() => { v.muted = true; });
    } else {
      v.pause();
    }
  }, [inView, active, unmuted]);

  useEffect(() => {
    const v = ref.current;
    if (v && active) v.currentTime = 0;
  }, [active]);

  function toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    sound.toggle(src);
  }

  return (
    <>
      <video
        ref={ref}
        className={className}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <button
        type="button"
        className={unmuted ? 'sound-btn is-on' : 'sound-btn'}
        onClick={toggle}
        aria-label={unmuted ? 'Mute video' : 'Unmute video'}
        aria-pressed={unmuted}
      >
        {unmuted ? (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9.5v5h3.6L12.5 19V5L7.6 9.5H4z" fill="currentColor" stroke="none" />
            <path d="M16 9a4.2 4.2 0 0 1 0 6" /><path d="M18.6 6.4a8 8 0 0 1 0 11.2" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9.5v5h3.6L12.5 19V5L7.6 9.5H4z" fill="currentColor" stroke="none" />
            <path d="m16.5 9.5 5 5" /><path d="m21.5 9.5-5 5" />
          </svg>
        )}
      </button>
    </>
  );
}
