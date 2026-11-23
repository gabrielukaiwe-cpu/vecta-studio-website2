import FinalCta from '../components/FinalCta.jsx';
import LoopVideo from '../components/LoopVideo.jsx';
import { DevSection } from './Developer.jsx';

const APP = 'https://app.vectastudio.ai/';

const SHOWCASE = [
  { id: 'c-creator', title: 'Podcast clips', by: 'Creators' },
  { id: 'c-market', title: 'Product promos', by: 'Marketing' },
  { id: 'f-voice', title: 'Talking-head videos', by: 'Voice & presence' },
  { id: 'c-anim', title: 'Animated stories', by: '3D animation' },
  { id: 'f-music', title: 'Music visuals', by: 'Music' },
  { id: 'c-learn', title: 'Explainers', by: 'Learning' },
];

export default function Community() {
  return (
    <main>
      <DevSection id="showcase" tone="dark" eyebrow="Community" lines={['Made with', 'Vecta Studio.']}
        sub="A look at the kinds of videos creators are making. Tap the speaker to hear one.">
        <div className="cm-grid">
          {SHOWCASE.map((s, i) => (
            <figure className="cm-card" style={{ '--d': `${i * 70}ms` }} key={s.id}>
              <div className="cm-media">
                <LoopVideo src={`./media/${s.id}.mp4`} poster={`./media/${s.id}.jpg`} />
                <span className="made-tag">Made with Vecta Studio</span>
              </div>
              <figcaption><strong>{s.title}</strong><span>{s.by}</span></figcaption>
            </figure>
          ))}
        </div>
      </DevSection>

      <FinalCta
        lines={['Make something', 'worth sharing.']}
        sub="Start free, then share what you make with the community."
        cta="Start Creating"
        href={APP}
        note="Turning creativity to reality."
      />
    </main>
  );
}
