import { gsap } from 'gsap';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Sets up a review strip's previous and next arrows inside `carousel`.
export function initReviewStrip(carousel) {
  const strip = carousel.querySelector('.review-strip');
  const previous = carousel.querySelector('.strip-prev');
  const next = carousel.querySelector('.strip-next');
  let stripTarget = 0;

  function updateArrows() {
    previous.disabled = strip.scrollLeft <= 0;
    next.disabled =
      strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1;
  }

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
}
