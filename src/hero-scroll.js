import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHeroScroll(viewport) {
  const media = gsap.matchMedia();

  function start() {
    media.add(
      '(min-width: 641px) and (prefers-reduced-motion: no-preference)',
      () => {
        const title = viewport.querySelector('#hero-heading');
        const details = viewport.querySelector('.hero-details');
        const link = details.querySelector('.hero-link');
        const home = viewport.closest('#home');
        const content = document.createElement('div');
        const placeholder = document.createElement('div');
        const sections = [...home.parentElement.children].filter(
          (section) => section !== home,
        );

        // Keep the title's grid space while the strip joins the scrolling page.
        details.replaceWith(placeholder);
        home.after(content);
        content.append(details, ...sections);
        gsap.set(content, {
          position: 'relative',
          zIndex: 2,
        });
        const measure = () => {
          const height = details.offsetHeight;
          gsap.set(placeholder, { height });
          gsap.set(content, { marginTop: -height });
        };
        measure();
        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: viewport,
            start: 'top top',
            end: () => `+=${viewport.offsetHeight}`,
            pinSpacing: false,
            onRefreshInit: measure,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(title, { opacity: 0, duration: 0.3 }, 0)
          .to(link, { autoAlpha: 0, duration: 0.2 }, 0)
          // Keep the fades in the first part of the pinned scroll.
          .to({}, { duration: 0.23 }, 0.77);

        return () => {
          placeholder.replaceWith(details);
          content.before(...sections);
          content.remove();
        };
      },
    );
  }

  if (document.documentElement.classList.contains('hero-loading')) {
    document.addEventListener('hero-ready', start, { once: true });
  } else {
    start();
  }

  return () => {
    document.removeEventListener('hero-ready', start);
    media.revert();
  };
}
