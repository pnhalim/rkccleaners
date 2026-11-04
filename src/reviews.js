import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initReviewBubbles } from './review-bubbles.js';
import { initReviewStrip } from './review-strip.js';
import { initSkipBubbles } from './skip-bubbles.js';

gsap.registerPlugin(ScrollTrigger);

initReviewStrip(document.querySelector('#review-strip .review-carousel'));

// Created before Sketch 3 so the pins are set up in page order.
const bubblesMedia = initReviewBubbles(
  document.querySelector('#review-bubbles'),
);
const media = gsap.matchMedia();

const commentSection = document.querySelector('#review-scroll');
const commentList = document.querySelector('.scroll-comments');
const comments = [...commentList.querySelectorAll('.scroll-comment')];
const showCommentSkips = initSkipBubbles(commentSection);

// Each comment stays up for this many window heights of scrolling.
const COMMENT_STEP = 2.5;
const COMMENT_HIDDEN = { opacity: 0, scale: 0.6, y: 60 };

media.add('(prefers-reduced-motion: no-preference)', (context) => {
  commentList.classList.add('is-stacked');
  gsap.set(comments, COMMENT_HIDDEN);
  let shown = -1;

  // Pops the old comment out, then the new one in after a short pause. The
  // pops play on a timer instead of following the scroll, so a comment is
  // always fully in or out. Added to the context so reverting clears them.
  context.add('showComment', (index) => {
    if (index === shown) return;
    const previous = comments[shown];
    shown = index;
    if (previous) {
      gsap.to(previous, {
        ...COMMENT_HIDDEN,
        duration: 0.25,
        ease: 'back.in(1.7)',
        overwrite: true,
      });
    }
    if (index < 0) return;
    gsap.to(comments[index], {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      ease: 'back.out(1.7)',
      delay: previous ? 0.4 : 0,
      overwrite: true,
    });
  });

  // The section holds still in the middle of the window for one step of
  // scrolling per comment. Comments show only while it's pinned, so the
  // current one pops in again whenever the page comes back to it.
  const stepAt = (self) =>
    self.isActive
      ? Math.min(
          Math.floor(self.progress * comments.length),
          comments.length - 1,
        )
      : -1;
  ScrollTrigger.create({
    trigger: commentSection,
    start: 'center center',
    end: () => `+=${innerHeight * COMMENT_STEP * comments.length}`,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => context.showComment(stepAt(self)),
    onToggle: (self) => {
      context.showComment(stepAt(self));
      showCommentSkips(self.isActive);
    },
  });

  return () => {
    showCommentSkips(false);
    commentList.classList.remove('is-stacked');
  };
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    bubblesMedia.revert();
    media.revert();
  });
}
