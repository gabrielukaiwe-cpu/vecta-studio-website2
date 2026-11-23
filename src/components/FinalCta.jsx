import { useRef } from 'react';
import TypedTitle from './TypedTitle.jsx';
import DotField from './DotField.jsx';
import useReveal from '../hooks/useReveal.js';

const LINES = ['Your next viral video', 'is one prompt away.'];

export default function FinalCta({ lines = LINES, sub = 'Stop paying for five tools that don\u2019t work together.', cta = 'Start Creating', href = 'https://app.vectastudio.ai/', note = 'No credit card needed for the free trial.' }) {
  const { reduce, ref, seen, onDone, on } = useReveal();
  const contentRef = useRef(null);
  return (
    <section className="cta" id="start" ref={ref}>
      <DotField avoidRef={contentRef} show={seen} reduceMotion={reduce} />
      <div className="cta-content" ref={contentRef}>
        {seen ? (
          <TypedTitle lines={lines} className="cta-title" reduce={reduce} onDone={onDone} />
        ) : (
          <h2 className="cta-title studio-ghost" aria-hidden="true">
            <span className="typed-line">{lines[0]}</span>
            <span className="typed-line">{lines[1]}</span>
          </h2>
        )}
        <p className={`cta-sub rise ${on(1)}`}>{sub}</p>
        <div className={`cta-actions rise ${on(2)}`}>
          <a className="btn btn-primary btn-large" href={href} target="_blank" rel="noopener">{cta}</a>
          <span className="cta-note">{note}</span>
        </div>
      </div>
    </section>
  );
}
