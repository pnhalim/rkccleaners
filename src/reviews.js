import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
// The browser restores a reload's scroll position before the review bubbles
// pin and add their scroll distance, which drops a reload from further down
// into the middle of the bubbles. Start reloads at the top instead. Setting
// history.scrollRestoration directly doesn't stick, since ScrollTrigger
// reapplies its own value after every refresh.
ScrollTrigger.clearScrollMemory('manual');

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
const skips = document.querySelectorAll('.skip-bubble');
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

function skipPast(link) {
  // Jump instead of smooth scrolling, which would flip through every review.
  // Skipping up lands at the end of the section above, just before the
  // bubbles, since their own heading is already inside the pinned stretch.
  const section = document.querySelector(link.hash);
  const block = link.classList.contains('skip-bubble-up') ? 'end' : 'start';
  section.scrollIntoView({ behavior: 'instant', block });
  section.focus({ preventScroll: true });
}

skips.forEach((link) =>
  link.addEventListener('click', (event) => {
    event.preventDefault();
    if (link.classList.contains('is-popping')) return;
    if (reduceMotion.matches) return skipPast(link);
    link.classList.add('is-popping');
    link.addEventListener('animationend', () => skipPast(link), {
      once: true,
    });
  }),
);

function showSkips(visible) {
  skips.forEach((link) => {
    // A popped bubble stays invisible while it hides, and is reset only once
    // it shows again so it can't flash back while shrinking away.
    if (visible) link.classList.remove('is-popping');
    link.classList.toggle('is-visible', visible);
    if (visible) link.classList.add('has-shown');
  });
}

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

const commentList = document.querySelector('.scroll-comments');

media.add('(prefers-reduced-motion: no-preference)', () => {
  let boxInView = false;
  const comments = gsap.utils.toArray('.scroll-comment').map((comment) => {
    const pop = gsap.from(comment, {
      opacity: 0,
      scale: 0.6,
      y: 60,
      duration: 0.5,
      ease: 'back.out(1.7)',
      paused: true,
    });
    const inBox = ScrollTrigger.create({
      trigger: comment,
      scroller: commentList,
      start: 'top 85%',
      end: 'bottom 15%',
      onToggle: () => boxInView && show(),
    });
    const show = () =>
      boxInView && inBox.isActive ? pop.play() : pop.reverse();
    return show;
  });

  // Comments only pop while the box is on screen, so whichever comment the
  // box is scrolled to pops in each time the page brings the box back.
  ScrollTrigger.create({
    trigger: commentList,
    start: 'top 70%',
    end: 'bottom 30%',
    onToggle: (self) => {
      boxInView = self.isActive;
      comments.forEach((show) => show());
    },
  });
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => media.revert());
}
