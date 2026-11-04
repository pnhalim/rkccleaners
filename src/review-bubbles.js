import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initSkipBubbles } from './skip-bubbles.js';

gsap.registerPlugin(ScrollTrigger);
// The browser restores a reload's scroll position before the review bubbles
// pin and add their scroll distance, which drops a reload from further down
// into the middle of the bubbles. Start reloads at the top instead. Setting
// history.scrollRestoration directly doesn't stick, since ScrollTrigger
// reapplies its own value after every refresh.
ScrollTrigger.clearScrollMemory('manual');

// While you scroll through the reviews the section creeps at SLOW times the
// scroll speed instead of stopping. Pinning holds it steady, since the browser
// keeps fixed positioning in step with scrolling, and only the small creep is
// animated, which keeps the one-frame lag of scroll-linked animation unseen.
const SLOW = 0.01;

// Sets up a review bubbles section and its up and down skip bubbles.
// Returns the gsap.matchMedia so the page can revert it.
export function initReviewBubbles(section) {
  const bubbles = [...section.querySelectorAll('.review-bubble')];
  const showSkips = initSkipBubbles(section);
  // Scrolling the pinned section steps from centered, through each review,
  // and back to centered before moving on.
  const bubbleSteps = [null, ...bubbles, null];
  let activeBubble = null;
  let bubbleScroll = null;

  function selectBubble(selected) {
    if (selected === activeBubble) return;
    const wasCentered = activeBubble === null;
    activeBubble = selected;
    bubbles.forEach((bubble) => {
      const expanded = bubble === selected;
      const review = document.getElementById(
        bubble.getAttribute('aria-controls'),
      );
      bubble.setAttribute('aria-expanded', expanded);
      review.inert = !expanded;
      // Let centered bubbles slide out of the way before the review appears.
      review.style.transitionDelay = expanded && wasCentered ? '0.45s' : '';
    });
  }

  function scrollToStep(step) {
    const { start, end } = bubbleScroll;
    window.scrollTo({
      top: start + ((end - start) * (step + 0.5)) / bubbleSteps.length,
    });
  }

  bubbles.forEach((bubble) =>
    bubble.addEventListener('click', () => {
      if (bubbleScroll) scrollToStep(bubbleSteps.indexOf(bubble));
      else selectBubble(bubble === activeBubble ? null : bubble);
    }),
  );

  const media = gsap.matchMedia();

  // Phones keep tap-to-read because the stacked layout is taller than the
  // screen, and so does reduced motion because the creep is a parallax.
  media.add(
    '(min-width: 48rem) and (prefers-reduced-motion: no-preference)',
    () => {
      const distance = () => window.innerHeight * 9.5;
      const creep = () => (distance() * SLOW) / 2;

      // Animate the contents, not the pinned section itself, as ScrollTrigger
      // recommends.
      const slowZone = gsap.fromTo(
        section.children,
        { y: creep },
        {
          y: () => -creep(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'center center',
            end: () => `+=${distance()}`,
            pin: true,
            anticipatePin: 1,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const step = Math.floor(self.progress * bubbleSteps.length);
              selectBubble(bubbleSteps[Math.min(step, bubbleSteps.length - 1)]);
            },
            onToggle: (self) => showSkips(self.isActive),
          },
        },
      );
      bubbleScroll = slowZone.scrollTrigger;
      return () => {
        bubbleScroll = null;
        selectBubble(null);
        showSkips(false);
      };
    },
  );

  return media;
}
