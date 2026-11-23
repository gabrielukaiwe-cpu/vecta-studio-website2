import { useId } from 'react';

/* Original 3D-style cartoon avatars, drawn in SVG so they stay sharp and need no image files. */
const LOOKS = {
  gabriel: { bg: ['#ffe3d1', '#f4b79a'], skin: ['#9a6a47', '#6e4529'], shirt: ['#3a3f66', '#1f2342'], hair: 'short', hairC: '#17120e', beard: true },
  faustina: { bg: ['#e9e0ff', '#bba8ff'], skin: ['#8a5a3b', '#5e3a22'], shirt: ['#e0527a', '#a8264c'], hair: 'puff', hairC: '#120d0a', earring: true },
  uche: { bg: ['#d7f1ff', '#8fd0f7'], skin: ['#b07c55', '#7d5233'], shirt: ['#2f8f83', '#17574f'], hair: 'cap', hairC: '#e8ecf8', capC: '#2a3070' },
  irobuisi: { bg: ['#ffeec2', '#f6c96a'], skin: ['#7a4d30', '#4f2f1b'], shirt: ['#f2f2f7', '#c3c6d6'], hair: 'short', hairC: '#120d0a', glasses: true },
  tolu: { bg: ['#ffdcec', '#f59ac1'], skin: ['#a36c48', '#6f4429'], shirt: ['#6a2bff', '#3c10b8'], hair: 'long', hairC: '#1a110c', earring: true },
  oluwaseyi: { bg: ['#d9f6e4', '#8ddcae'], skin: ['#86553a', '#583420'], shirt: ['#ff9a3c', '#c4600b'], hair: 'bald', hairC: '#120d0a', beard: true },
};

export default function Avatar({ who, size = 64 }) {
  const L = LOOKS[who];
  const id = useId().replace(/:/g, '');
  const g = (n) => `${n}-${id}`;
  return (
    <svg className="avatar-3d" viewBox="0 0 120 120" width={size} height={size} role="img" aria-hidden="true">
      <defs>
        <radialGradient id={g('bg')} cx="50%" cy="38%" r="70%">
          <stop offset="0" stopColor={L.bg[0]} /><stop offset="1" stopColor={L.bg[1]} />
        </radialGradient>
        <radialGradient id={g('skin')} cx="42%" cy="34%" r="75%">
          <stop offset="0" stopColor={L.skin[0]} /><stop offset="1" stopColor={L.skin[1]} />
        </radialGradient>
        <linearGradient id={g('shirt')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={L.shirt[0]} /><stop offset="1" stopColor={L.shirt[1]} />
        </linearGradient>
        <radialGradient id={g('hair')} cx="40%" cy="25%" r="80%">
          <stop offset="0" stopColor={L.hairC} stopOpacity="1" /><stop offset="1" stopColor="#000" stopOpacity=".55" />
        </radialGradient>
      </defs>
      <rect width="120" height="120" fill={`url(#${g('bg')})`} />
      {/* shoulders and neck */}
      <path d="M12 124c2-24 20-34 48-34s46 10 48 34z" fill={`url(#${g('shirt')})`} />
      <rect x="49" y="78" width="22" height="20" rx="9" fill={`url(#${g('skin')})`} />
      <ellipse cx="60" cy="90" rx="13" ry="6" fill="#000" opacity=".16" />
      {/* hair behind head */}
      {L.hair === 'puff' && <circle cx="60" cy="33" r="27" fill={`url(#${g('hair')})`} />}
      {L.hair === 'long' && <path d="M26 56c-4-30 12-42 34-42s38 12 34 42c-1 18 2 32 6 42H20c4-10 7-24 6-42z" fill={`url(#${g('hair')})`} />}
      {/* ears */}
      <circle cx="30" cy="58" r="8" fill={`url(#${g('skin')})`} />
      <circle cx="90" cy="58" r="8" fill={`url(#${g('skin')})`} />
      {L.earring && <><circle cx="30" cy="68" r="2.6" fill="#ffd25a" /><circle cx="90" cy="68" r="2.6" fill="#ffd25a" /></>}
      {/* head */}
      <ellipse cx="60" cy="56" rx="31" ry="34" fill={`url(#${g('skin')})`} />
      <ellipse cx="50" cy="40" rx="14" ry="9" fill="#fff" opacity=".13" />
      {/* hair on top */}
      {L.hair === 'short' && <path d="M29 50c-3-24 11-34 31-34s34 10 31 34c-6-10-14-14-31-14s-25 4-31 14z" fill={`url(#${g('hair')})`} />}
      {L.hair === 'puff' && <path d="M30 48c0-16 12-22 30-22s30 6 30 22c-8-8-16-10-30-10s-22 2-30 10z" fill={`url(#${g('hair')})`} />}
      {L.hair === 'long' && <path d="M29 52c-2-24 10-36 31-36s33 12 31 36c-4-12-12-20-31-20s-27 8-31 20z" fill={`url(#${g('hair')})`} />}
      {L.hair === 'cap' && (
        <>
          <path d="M28 52c-2-26 10-38 32-38s34 12 32 38z" fill={L.capC} />
          <path d="M28 50h64c4 0 6 3 6 5H22c0-2 2-5 6-5z" fill={L.capC} />
          <path d="M28 52c-2-26 10-38 32-38" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {/* face */}
      <path d="M43 47q5-4 11-1" stroke="#0e0a08" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <path d="M66 46q6-3 11 1" stroke="#0e0a08" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <ellipse cx="48" cy="57" rx="4.2" ry="5.4" fill="#0b0807" />
      <ellipse cx="72" cy="57" rx="4.2" ry="5.4" fill="#0b0807" />
      <circle cx="49.4" cy="55" r="1.4" fill="#fff" /><circle cx="73.4" cy="55" r="1.4" fill="#fff" />
      <ellipse cx="60" cy="68" rx="6.4" ry="7.4" fill={L.skin[1]} opacity=".55" />
      <ellipse cx="59" cy="66" rx="4" ry="4.4" fill="#fff" opacity=".14" />
      {L.beard && <path d="M33 66c2 22 12 31 27 31s25-9 27-31c-5 9-12 13-27 13S38 75 33 66z" fill={`url(#${g('hair')})`} />}
      <path d={L.beard ? 'M52 84q8 5 16 0' : 'M51 80q9 6 18 0'} stroke={L.beard ? '#f1d7c8' : '#2a110a'} strokeWidth="3" strokeLinecap="round" fill="none" />
      {L.glasses && (
        <g fill="none" stroke="#f6f7fb" strokeWidth="2.8">
          <circle cx="48" cy="57" r="11" /><circle cx="72" cy="57" r="11" /><path d="M59 56h2" />
        </g>
      )}
    </svg>
  );
}
