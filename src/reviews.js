import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initReviewBubbles } from './review-bubbles.js';
import { initReviewStrip } from './review-strip.js';

gsap.registerPlugin(ScrollTrigger);

initReviewStrip(document.querySelector('#review-strip .review-carousel'));

// Created before Sketch 3 so the pins are set up in page order.
const bubblesMedia = initReviewBubbles(
  document.querySelector('#review-bubbles'),
);
const media = gsap.matchMedia();

const commentSection = document.querySelector('#review-scroll');
const commentFrame = document.querySelector('.scroll-comments-frame');
const commentList = document.querySelector('.scroll-comments');

media.add('(prefers-reduced-motion: no-preference)', () => {
  commentFrame.classList.add('is-clipped');
  const comments = [...commentList.children].map((item) => ({
    item,
    pop: gsap.from(item.querySelector('.scroll-comment'), {
      opacity: 0,
      scale: 0.6,
      y: 60,
      duration: 0.5,
      ease: 'back.out(1.7)',
      paused: true,
    }),
  }));

  // A comment shows while it's between 85% and 15% of the way down the
  // window, and only while the window is on screen, so whichever comment is in
  // it pops in each time the page brings the box back. Measure the list items,
  // since the pop moves the comments themselves.
  function updatePops() {
    const frame = commentFrame.getBoundingClientRect();
    const onScreen =
      frame.top < innerHeight * 0.7 && frame.bottom > innerHeight * 0.3;
    comments.forEach(({ item, pop }) => {
      const { top, bottom } = item.getBoundingClientRect();
      const inWindow =
        top < frame.top + frame.height * 0.85 &&
        bottom > frame.top + frame.height * 0.15;
      onScreen && inWindow ? pop.play() : pop.reverse();
    });
  }

  // The section holds still while scrolling the page moves the comments up
  // through the window, at the same speed as the scroll.
  const travel = () => commentList.offsetHeight - commentFrame.clientHeight;
  gsap.to(commentList, {
    y: () => -travel(),
    ease: 'none',
    scrollTrigger: {
      trigger: commentSection,
      start: 'top top',
      end: () => `+=${travel()}`,
      pin: true,
      anticipatePin: 1,
      scrub: true,
      invalidateOnRefresh: true,
      // Page scrolls move the window on and off screen; this catches the list
      // moving inside it, after its new position has been applied.
      onUpdate: updatePops,
    },
  });
  addEventListener('scroll', updatePops, { passive: true });
  updatePops();

  return () => {
    removeEventListener('scroll', updatePops);
    commentFrame.classList.remove('is-clipped');
  };
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    bubblesMedia.revert();
    media.revert();
  });
}
