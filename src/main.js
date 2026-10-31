import './style.css';
import { gsap } from 'gsap';

const opening = document.querySelector('#home');
const media = gsap.matchMedia();
const header = document.querySelector('.site-header');
const headerEvents = new AbortController();

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 0);
}

window.addEventListener('scroll', updateHeader, {
  passive: true,
  signal: headerEvents.signal,
});
updateHeader();

const videoFrame = opening.querySelector('iframe');
const videoUrl = new URL(videoFrame.src);
videoUrl.searchParams.set('origin', window.location.origin);
videoFrame.src = videoUrl.href;

function setVideoSpeed(event) {
  event.target.setPlaybackRate(1);
}

function initializePlayer() {
  new window.YT.Player(videoFrame, {
    events: {
      onReady: setVideoSpeed,
      onStateChange: (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) setVideoSpeed(event);
        if (event.data === window.YT.PlayerState.ENDED) {
          // Reload the segment so YouTube reapplies its end time on every loop.
          event.target.loadVideoById({
            videoId: videoUrl.pathname.split('/').pop(),
            startSeconds: Number(videoUrl.searchParams.get('start')),
            endSeconds: Number(videoUrl.searchParams.get('end')),
          });
        }
        if (event.data === window.YT.PlayerState.PAUSED)
          event.target.playVideo();
      },
    },
  });
}

if (window.YT?.Player) {
  initializePlayer();
} else {
  window.onYouTubeIframeAPIReady = initializePlayer;
  const script = document.createElement('script');
  script.src = 'https://www.youtube.com/iframe_api';
  script.async = true;
  document.head.append(script);
}

media.add('(prefers-reduced-motion: no-preference)', () => {
  const bubbles = document.createElement('div');
  bubbles.className = 'opening-bubbles';
  bubbles.setAttribute('aria-hidden', 'true');

  const positions = [
    [-70, -25],
    [-50, 55],
    [15, -90],
    [95, -55],
    [0, 0],
    [-85, 80],
  ];

  const sizes = [24, 60, 38, 40, 76, 18];

  positions.forEach(([x, y]) => {
    const bubble = document.createElement('span');
    bubble.className = 'opening-bubble';
    const centered = x === 0 && y === 0;
    bubble.style.left = `${opening.clientWidth / 2 + x + (centered ? 0 : gsap.utils.random(-4, 4))}px`;
    bubble.style.top = `${opening.clientHeight / 2 + y + (centered ? 0 : gsap.utils.random(-4, 4))}px`;
    bubbles.append(bubble);
  });

  opening.append(bubbles);
  const video = opening.querySelector('iframe');
  const text = opening.querySelectorAll(
    '.site-header, .about-blurb, .text-link, .down-link',
  );
  const entranceDelays = gsap.utils.shuffle([0, 0.14, 0.33, 0.51, 0.76, 0.95]);
  const timeline = gsap.timeline({ onComplete: () => bubbles.remove() });

  timeline
    .set(video, { opacity: 0 })
    .set(text, { opacity: 0 })
    .set(bubbles.children, {
      width: (index) => sizes[index],
      height: (index) => sizes[index],
      xPercent: -50,
      yPercent: -50,
    })
    .from(bubbles.children, {
      scale: 0,
      opacity: 0,
      duration: 0.55,
      stagger: (index) => entranceDelays[index],
      ease: 'power2.out',
    })
    .to(
      bubbles.children,
      {
        x: (index) =>
          (Math.sign(positions[index][0]) || 1) *
          (opening.clientWidth / 2 + 150),
        y: (index) => positions[index][1] * 2,
        scale: 3,
        opacity: 0,
        duration: 0.55,
        stagger: { each: 0.04, from: 'random' },
        ease: 'power2.out',
      },
      '+=0.02',
    )
    .to(video, { opacity: 1, duration: 0.9, ease: 'power1.inOut' }, '-=0.1')
    .to(text, { opacity: 1, duration: 0.6, stagger: 0.15 }, '-=0.15');

  return () => {
    timeline.revert();
    bubbles.remove();
  };
});

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    media.revert();
    headerEvents.abort();
  });
}
