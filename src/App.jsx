import { useEffect, useLayoutEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Logos from './components/Logos.jsx';
import Problem from './components/Problem.jsx';
import Studio from './components/Studio.jsx';
import Cases from './components/Cases.jsx';
import Steps from './components/Steps.jsx';
import Stories from './components/Stories.jsx';
import Pricing from './components/Pricing.jsx';
import Faq from './components/Faq.jsx';
import FinalCta from './components/FinalCta.jsx';
import Footer from './components/Footer.jsx';
import Developer from './pages/Developer.jsx';
import Community from './pages/Community.jsx';

// tiny hash router: #developer is the developer page, everything else is the home page
function useRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return { page: hash === '#developer' ? 'developer' : hash === '#community' ? 'community' : 'home', hash };
}

function App() {
  const { page, hash } = useRoute();

  // when the page changes, start at the top, or at the section that was asked for
  useLayoutEffect(() => {
    const target = page === 'home' && hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
    if (target) {
      target.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <Header page={page} />
      {page === 'developer' ? (
        <Developer />
      ) : page === 'community' ? (
        <Community />
      ) : (
        <main>
          <Hero />
          <Logos />
          <Problem />
          <Studio />
          <Cases />
          <Steps />
          <Stories />
          <Pricing />
          <Faq />
          <FinalCta />
        </main>
      )}
      <Footer />
    </>
  );
}

export default App;
