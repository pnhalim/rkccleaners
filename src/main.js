import './style.css';

const opening = document.querySelector('#home');
const header = document.querySelector('.site-header');
const headerObserver = new IntersectionObserver(([entry]) => {
  header.classList.toggle('is-at-home', entry.isIntersecting);
});
headerObserver.observe(opening);

const heroVideo = document.querySelector('.hero-video');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateHeroPlayback() {
  heroVideo.defaultPlaybackRate = 0.85;
  heroVideo.playbackRate = 0.85;
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

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    headerObserver.disconnect();
    reducedMotion.removeEventListener('change', updateHeroPlayback);
  });
}
