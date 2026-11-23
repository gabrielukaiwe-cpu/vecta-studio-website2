import { useState } from 'react';
import TypedTitle from './TypedTitle.jsx';
import useReveal from '../hooks/useReveal.js';

const LINES = ['Got questions?'];

const QA = [
  {
    q: 'Do I need editing or technical skills?',
    a: 'Not at all. Describe what you want in a sentence and Vecta Studio handles the script, visuals, audio, editing and export. Most people publish their first video within 45 minutes.',
  },
  {
    q: 'How is this different from Runway, ElevenLabs or Midjourney?',
    a: 'Those are great single tools. Vecta Studio connects script, voice, images, video and export in one flow, so you never switch apps or re-upload files.',
  },
  {
    q: 'Can I use my own brand voice, style and assets?',
    a: 'Yes. Pro and Creator plans include brand voice training, style presets and an asset library, so every script, voice and visual stays on brand.',
  },
  {
    q: 'What kinds of videos can I create?',
    a: 'YouTube videos, TikToks, Reels, LinkedIn content, product demos, explainers and short ads, fully edited and ready to publish.',
  },
];

export default function Faq() {
  const { reduce, ref, seen, onDone, on } = useReveal();
  const [open, setOpen] = useState(0);
  return (
    <section className="problem faq" id="faq" ref={ref}>
      <div className="problem-glow" aria-hidden="true" />
      <div className="problem-inner">
        <div className="problem-head">
          <span className="eyebrow">FAQ</span>
          {seen ? (
            <TypedTitle lines={LINES} className="problem-title" reduce={reduce} onDone={onDone} />
          ) : (
            <h2 className="problem-title problem-ghost" aria-hidden="true">
              <span className="typed-line">{LINES[0]}</span>
            </h2>
          )}
          <p className={`problem-sub rise ${on(1)}`}>What creators ask us most before they start.</p>
        </div>

        <div className={`faq-list rise ${on(2)}`}>
          {QA.map((item, i) => (
            <div className={`faq-item ${open === i ? 'is-open' : ''}`} key={item.q}>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{item.q}</span>
                <i aria-hidden="true" />
              </button>
              <div className="faq-body"><div><p>{item.a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
