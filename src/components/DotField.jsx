import { useEffect, useRef } from 'react';

// Sparse blue dots on black that float like particles in water.
//  - every dot drifts on a slow, flowing current
//  - the cursor moves through the field like a hand through water:
//    nearby dots get carried along with it, then drift slowly back

const COLORS = [
  ['92,124,255', '86,108,235'],
  ['92,124,255', '86,108,235'],
  ['92,124,255', '86,108,235'],
  ['120,96,255', '125,98,235'],
  ['60,170,255', '50,140,235'],
];

function smooth(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function DotField({ avoidRef, show, reduceMotion, light = false }) {
  const canvasRef = useRef(null);
  const showRef = useRef(show);
  const lightRef = useRef(light);
  useEffect(() => { lightRef.current = light; }, [light]);

  useEffect(() => {
    showRef.current = show;
  }, [show]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const rand = seeded(1112026);

    const dots = Array.from({ length: 980 }, (_, idx) => {
      const r = rand();
      const kind = r < 0.7 ? 0 : r < 0.94 ? 1 : 2;
      return {
        fx: rand(),
        fy: rand(),
        kind,
        extra: idx >= 560,   // extra dots that only appear in light mode
        size: kind === 0 ? 0.6 + rand() * 0.5 : kind === 1 ? 1.2 + rand() * 0.8 : 1.3 + rand() * 0.5,
        len: kind === 2 ? 3 + rand() * 2.5 : 0,
        alpha: kind === 0 ? 0.3 + rand() * 0.45 : 0.55 + rand() * 0.4,
        phase: rand() * Math.PI * 2,
        speed: 0.6 + rand() * 0.8,
        weight: 0.6 + rand() * 0.8,   // heavier dots follow the cursor less
        color: COLORS[Math.floor(rand() * COLORS.length)],
        ox: 0,   // displacement caused by the cursor
        oy: 0,
        vx: 0,
        vy: 0,
      };
    });

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let t = 0;
    let intro = reduceMotion ? 1 : 0;
    let mix = lightRef.current ? 1 : 0;   // 0 = dark, 1 = light (eases between)

    const cursor = { x: 0, y: 0, px: 0, py: 0, vx: 0, vy: 0, active: false };
    const box = { l: 0, t: 0, r: 0, b: 0 };

    function measure() {
      const hostRect = host.getBoundingClientRect();
      const el = avoidRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        box.l = r.left - hostRect.left;
        box.r = r.right - hostRect.left;
        box.t = r.top - hostRect.top;
        box.b = r.bottom - hostRect.top;
      } else {
        box.l = w * 0.25; box.r = w * 0.75; box.t = h * 0.3; box.b = h * 0.7;
      }
    }

    function resize() {
      const rect = host.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      measure();
      if (reduceMotion) draw();
    }

    function onMove(e) {
      const rect = host.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) {
        cursor.active = false;
        return;
      }
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (cursor.active) {
        cursor.vx += x - cursor.x;   // accumulate movement since last frame
        cursor.vy += y - cursor.y;
      }
      cursor.x = x;
      cursor.y = y;
      cursor.active = true;
    }
    function onLeave() {
      cursor.active = false;
    }

    function textMask(x, y) {
      const ox = Math.max(box.l - 10 - x, 0, x - (box.r + 10));
      const oy = Math.max(box.t - 10 - y, 0, y - (box.b + 10));
      return 0.3 + 0.7 * smooth(0, 80, Math.hypot(ox, oy));
    }

    function step(dt) {
      // movement of the cursor during this frame, as a velocity
      const mvx = cursor.vx;
      const mvy = cursor.vy;
      cursor.vx = 0;
      cursor.vy = 0;
      const RADIUS = 190;

      for (let i = 0; i < dots.length; i += 1) {
        const d = dots[i];
        const bx = d.fx * w + Math.sin(t * 0.17 * d.speed + d.phase) * 9 + Math.sin(t * 0.07 + d.fy * 6) * 7;
        const by = d.fy * h + Math.cos(t * 0.15 * d.speed + d.phase) * 9 + Math.cos(t * 0.06 + d.fx * 6) * 7;

        if (cursor.active) {
          const dx = bx + d.ox - cursor.x;
          const dy = by + d.oy - cursor.y;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS) {
            const f = (1 - dist / RADIUS) ** 2;
            // carried along with the hand, plus a soft push to the sides
            d.vx += (mvx * 0.55 + (dx / (dist + 1)) * 6) * f * d.weight;
            d.vy += (mvy * 0.55 + (dy / (dist + 1)) * 6) * f * d.weight;
          }
        }
        // water: strong drag, very gentle pull back home
        const drag = Math.exp(-dt * 2.4);
        d.vx *= drag;
        d.vy *= drag;
        d.vx += -d.ox * dt * 1.1;
        d.vy += -d.oy * dt * 1.1;
        d.ox += d.vx * dt * 60;
        d.oy += d.vy * dt * 60;
        d.x = bx + d.ox;
        d.y = by + d.oy;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      if (intro <= 0.001) return;
      ctx.lineCap = 'round';
      const cx = w / 2;
      const cy = h / 2;
      for (let i = 0; i < dots.length; i += 1) {
        const d = dots[i];
        const x = d.x ?? d.fx * w;
        const y = d.y ?? d.fy * h;
        if (x < -10 || x > w + 10 || y < -10 || y > h + 10) continue;
        const twinkle = 0.72 + 0.28 * Math.sin(t * 1.0 * d.speed + d.phase * 3);
        const a = d.alpha * twinkle * intro * textMask(x, y) * (d.extra ? mix : 1) * (1 - 0.25 * mix);
        if (a < 0.02) continue;
        if (d.kind === 2) {
          const ang = Math.atan2(y - cy, x - cx);
          const ca = Math.cos(ang);
          const sa = Math.sin(ang);
          ctx.strokeStyle = `rgba(${d.color[mix > 0.5 ? 1 : 0]},${a.toFixed(3)})`;
          ctx.lineWidth = d.size * (1.7 + 0.05 * mix);
          ctx.beginPath();
          ctx.moveTo(x - ca * d.len * 0.5, y - sa * d.len * 0.5);
          ctx.lineTo(x + ca * d.len * 0.5, y + sa * d.len * 0.5);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${d.color[mix > 0.5 ? 1 : 0]},${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, d.size * (1 + 0.05 * mix), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      mix += ((lightRef.current ? 1 : 0) - mix) * Math.min(1, dt * 3);
      if (showRef.current && intro < 1) intro = Math.min(1, intro + dt / 1.6);
      measure();
      step(dt);
      draw();
    }

    resize();
    if (reduceMotion) { step(0.016); draw(); }
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(host);

    if (!reduceMotion) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [avoidRef, reduceMotion]);

  return <canvas ref={canvasRef} className="dot-field" aria-hidden="true" />;
}

export default DotField;
