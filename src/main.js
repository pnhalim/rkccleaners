import './style.css';
import { initReviewBubbles } from './review-bubbles.js';
import { initHeaderMenu } from './header-menu.js';
import { initHeroLoading } from './hero-loading.js';
import { initHeroScroll } from './hero-scroll.js';

const cleanupHeaderMenu = initHeaderMenu(
  document.querySelector('.site-header'),
);

const heroVideo = document.querySelector('.hero-video');
const cleanupHeroLoading = initHeroLoading(heroVideo);
const cleanupHeroScroll = initHeroScroll(document.querySelector('.video-wrap'));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateHeroPlayback() {
  heroVideo.defaultPlaybackRate = 0.75;
  heroVideo.playbackRate = 0.75;
  heroVideo.autoplay = !reducedMotion.matches;
  if (reducedMotion.matches) {
    heroVideo.pause();
  } else {
    heroVideo.play().catch(() => {});
  }
}

updateHeroPlayback();
reducedMotion.addEventListener('change', updateHeroPlayback);

const partnerMarquee = document.querySelector('[data-partner-marquee]');

if (partnerMarquee) {
  const track = partnerMarquee.querySelector('.partner-strip');
  const duplicate = track.cloneNode(true);
  duplicate.removeAttribute('aria-label');
  duplicate.setAttribute('aria-hidden', 'true');
  partnerMarquee.querySelector('.partner-marquee-content').append(duplicate);
  partnerMarquee.classList.add('is-auto-scrolling');
}

const reviewBubbles = initReviewBubbles(document.querySelector('#reviews'));

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cleanupHeaderMenu();
    reviewBubbles.revert();
    cleanupHeroScroll();
    cleanupHeroLoading();
    reducedMotion.removeEventListener('change', updateHeroPlayback);
  });
}
