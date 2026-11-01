import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const strip = document.querySelector('.review-strip');
const previous = document.querySelector('.strip-prev');
const next = document.querySelector('.strip-next');

function updateArrows() {
  previous.disabled = strip.scrollLeft <= 0;
  next.disabled = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1;
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let stripTarget = 0;

function scrollStrip(direction) {
  const page =
    strip.clientWidth + parseFloat(getComputedStyle(strip).columnGap);
  const start = gsap.isTweening(strip) ? stripTarget : strip.scrollLeft;
  stripTarget = gsap.utils.clamp(
    0,
    strip.scrollWidth - strip.clientWidth,
    start + direction * page,
  );
  // Snapping fights each animated step, so pause it until the slide ends.
  strip.style.scrollSnapType = 'none';
  gsap.to(strip, {
    scrollLeft: stripTarget,
    duration: reduceMotion.matches ? 0 : 0.8,
    ease: 'power2.inOut',
    overwrite: true,
    onComplete: () => (strip.style.scrollSnapType = ''),
  });
}

previous.addEventListener('click', () => scrollStrip(-1));
next.addEventListener('click', () => scrollStrip(1));
strip.addEventListener('scroll', updateArrows, { passive: true });
window.addEventListener('resize', updateArrows);
updateArrows();

const bubbleSection = document.querySelector('#review-bubbles');
const bubbles = [...bubbleSection.querySelectorAll('.review-bubble')];
const skip = document.querySelector('.skip-bubble');
// Scrolling the pinned section steps from centered, through each review, and
// back to centered before moving on.
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

skip.addEventListener('click', (event) => {
  // Jump instead of smooth scrolling, which would flip through every review.
  event.preventDefault();
  const nextSection = document.querySelector(skip.hash);
  nextSection.scrollIntoView({ behavior: 'instant' });
  nextSection.focus({ preventScroll: true });
});

// While you scroll through the reviews the section creeps at SLOW times the
// scroll speed instead of stopping. Pinning holds it steady, since the browser
// keeps fixed positioning in step with scrolling, and only the small creep is
// animated, which keeps the one-frame lag of scroll-linked animation unseen.
const SLOW = 0.01;

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
      bubbleSection.children,
      { y: creep },
      {
        y: () => -creep(),
        ease: 'none',
        scrollTrigger: {
          trigger: bubbleSection,
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
          onToggle: (self) =>
            skip.classList.toggle('is-visible', self.isActive),
        },
      },
    );
    bubbleScroll = slowZone.scrollTrigger;
    return () => {
      bubbleScroll = null;
      selectBubble(null);
      skip.classList.remove('is-visible');
    };
  },
);

const commentList = document.querySelector('.scroll-comments');

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
        scroller: commentList,
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
