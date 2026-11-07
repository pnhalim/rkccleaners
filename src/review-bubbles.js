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
    // Jump instead of smooth scrolling, which would open every bubble on the
    // way. The pinned section doesn't move, so the jump isn't seen.
    window.scrollTo({
      top: start + ((end - start) * (step + 0.5)) / bubbleSteps.length,
      behavior: 'instant',
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
  // screen, and so does reduced motion.
  media.add(
    '(min-width: 48rem) and (prefers-reduced-motion: no-preference)',
    () => {
      // The whole section holds still in the middle of the window, below any
      // fixed site header, while the scroll steps through the reviews.
      const header = document.querySelector('.site-header');
      bubbleScroll = ScrollTrigger.create({
        trigger: section,
        start: () =>
          `center ${(innerHeight + (header?.offsetHeight ?? 0)) / 2}px`,
        end: () => `+=${innerHeight * 9.5}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const step = Math.floor(self.progress * bubbleSteps.length);
          selectBubble(bubbleSteps[Math.min(step, bubbleSteps.length - 1)]);
        },
        onToggle: (self) => showSkips(self.isActive),
      });
      return () => {
        bubbleScroll = null;
        selectBubble(null);
        showSkips(false);
      };
    },
  );

  return media;
}
