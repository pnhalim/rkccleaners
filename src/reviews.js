import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const bubbles = document.querySelectorAll('.review-bubble');

function toggleBubble(selected) {
  const opening = selected.getAttribute('aria-expanded') === 'false';
  bubbles.forEach((bubble) => {
    const expanded = opening && bubble === selected;
    bubble.setAttribute('aria-expanded', expanded);
    document.getElementById(bubble.getAttribute('aria-controls')).hidden =
      !expanded;
  });
  // Review lengths differ, so the scroll triggers below may have moved.
  ScrollTrigger.refresh();
}

bubbles.forEach((bubble) =>
  bubble.addEventListener('click', () => toggleBubble(bubble)),
);

const media = gsap.matchMedia();

media.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.utils.toArray('.scroll-comment').forEach((comment) => {
    gsap.from(comment, {
      opacity: 0,
      scale: 0.6,
      y: 60,
      duration: 0.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: comment,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play reverse play reverse',
      },
    });
  });
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => media.revert());
}
