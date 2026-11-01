import './style.css';

const opening = document.querySelector('#home');
const header = document.querySelector('.site-header');
const headerObserver = new IntersectionObserver(([entry]) => {
  header.classList.toggle('is-at-home', entry.isIntersecting);
});
headerObserver.observe(opening);

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
  });
}
