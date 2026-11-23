import { useId } from 'react';

// The Vecta Studio "V", rebuilt as a glass-style vector.
// Violet piece behind, cyan-to-blue piece in front, soft light on the top edges.
function LogoMark({ size = 40, glow = true, className = '' }) {
  const id = useId().replace(/:/g, '');
  const left =
    'M33 32 L134 30 Q156 30 168 52 L234 172 L191 250 Q182 268 184 288 Q187 303 200 315 Q186 310 173 292 L33 41 Q30 36 33 32 Z';
  const right =
    'M309 74 L402 75 Q407 77 404 82 L281 299 Q262 322 238 324 Q212 326 196 311 Q184 296 187 270 L236 176 L287 86 Q296 74 309 74 Z';

  return (
    <svg
      className={className}
      width={size}
      height={size * 0.8}
      viewBox="20 20 400 320"
      role="img"
      aria-label="Vecta Studio"
    >
      <defs>
        <linearGradient id={`${id}-l`} x1="0.1" y1="0" x2="0.75" y2="1">
          <stop offset="0" stopColor="#6A2BFF" />
          <stop offset="0.55" stopColor="#3A10EE" />
          <stop offset="1" stopColor="#0A12B8" />
        </linearGradient>
        <linearGradient id={`${id}-r`} x1="0.95" y1="0" x2="0.15" y2="1">
          <stop offset="0" stopColor="#03F0FF" />
          <stop offset="0.5" stopColor="#0197FE" />
          <stop offset="1" stopColor="#0058F0" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.35" />
        </linearGradient>
        <clipPath id={`${id}-cl`}><path d={left} /></clipPath>
        <clipPath id={`${id}-cr`}><path d={right} /></clipPath>
        <filter id={`${id}-blur`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      {glow && (
        <g filter={`url(#${id}-blur)`} opacity="0.7">
          <path d={left} fill="#4A12F5" />
          <path d={right} fill="#03C8FD" />
        </g>
      )}

      <path d={left} fill={`url(#${id}-l)`} />
      <g clipPath={`url(#${id}-cl)`}>
        <rect x="20" y="20" width="260" height="150" fill={`url(#${id}-shine)`} opacity="0.55" />
      </g>
      <path d={left} fill="none" stroke={`url(#${id}-edge)`} strokeWidth="2" />

      <path d={right} fill={`url(#${id}-r)`} />
      <g clipPath={`url(#${id}-cr)`}>
        <rect x="180" y="60" width="240" height="140" fill={`url(#${id}-shine)`} />
      </g>
      <path d={right} fill="none" stroke={`url(#${id}-edge)`} strokeWidth="2" />
    </svg>
  );
}

export default LogoMark;
