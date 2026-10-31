import './style.css';

const opening = document.querySelector('#home');
const header = document.querySelector('.site-header');
const headerObserver = new IntersectionObserver(([entry]) => {
  header.classList.toggle('is-at-home', entry.isIntersecting);
});
headerObserver.observe(opening);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    headerObserver.disconnect();
  });
}
