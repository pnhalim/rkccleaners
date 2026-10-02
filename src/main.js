import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const media = gsap.matchMedia();

media.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.utils.toArray('[data-reveal]').forEach((element) => {
    gsap.from(element, {
      y: 24,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        once: true,
      },
    });
  });
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => media.revert());
}
