const TITLE_START_MS = 80;
const TITLE_CHAR_MS = 32;
const TITLE_HOLD_MS = 120;

function typeHeroHeading(heading) {
  const box = heading.getBoundingClientRect();
  const lines = [...heading.children].flatMap((line) => {
    const text = line.firstChild;
    if (!text || text.nodeType !== Node.TEXT_NODE || text.length === 0)
      return [];
    const lineBox = line.getBoundingClientRect();
    const edges = [];
    for (let index = 0; index < text.length; index += 1) {
      const range = document.createRange();
      range.setStart(text, 0);
      range.setEnd(text, index + 1);
      edges.push(
        ((range.getBoundingClientRect().right - box.left) / box.width) * 100,
      );
    }
    return [
      {
        top: ((lineBox.top - box.top) / box.height) * 100,
        bottom: ((lineBox.bottom - box.top) / box.height) * 100,
        edges,
      },
    ];
  });
  const total = lines.reduce((sum, line) => sum + line.edges.length, 0);
  if (total === 0) return Promise.resolve();

  const paint = (count) => {
    if (count >= total) {
      heading.style.clipPath = '';
      return;
    }
    const revealed = [];
    let remaining = count;
    for (const line of lines) {
      const shown = Math.min(remaining, line.edges.length);
      remaining -= shown;
      if (shown === 0) continue;
      revealed.push({
        top: line.top,
        bottom: line.bottom,
        right: line.edges[shown - 1],
      });
    }
    if (revealed.length === 0) {
      heading.style.clipPath = 'inset(50%)';
      return;
    }
    const [first, second] = revealed;
    heading.style.clipPath = second
      ? `polygon(0% ${first.top}%, ${first.right}% ${first.top}%, ${first.right}% ${first.bottom}%, ${second.right}% ${second.top}%, ${second.right}% ${second.bottom}%, 0% ${second.bottom}%, 0% ${first.top}%)`
      : `polygon(0% ${first.top}%, ${first.right}% ${first.top}%, ${first.right}% ${first.bottom}%, 0% ${first.bottom}%)`;
  };

  paint(0);
  heading.classList.add('is-typing');

  return new Promise((resolve) => {
    let count = 0;
    let timer = 0;
    let stopped = false;

    const finish = () => {
      if (stopped) return;
      stopped = true;
      clearTimeout(timer);
      heading.style.clipPath = '';
      resolve();
    };

    const step = () => {
      count += 1;
      paint(count);
      if (count < total) {
        timer = setTimeout(step, TITLE_CHAR_MS);
        return;
      }
      timer = setTimeout(finish, TITLE_HOLD_MS);
    };

    timer = setTimeout(step, TITLE_START_MS);
    typeHeroHeading.stop = finish;
  });
}

typeHeroHeading.stop = () => {};

const SHIMMER_FRAMES = [
  { backgroundPosition: '0% 20%', easing: 'ease-in-out' },
  { backgroundPosition: '70% 0%', easing: 'ease-in-out' },
  { backgroundPosition: '100% 80%', easing: 'ease-in-out' },
  { backgroundPosition: '30% 100%', easing: 'ease-in-out' },
  { backgroundPosition: '0% 20%' },
];

const VIGNETTE_FRAMES = [
  {
    backgroundPosition: '0% 20%, 50% 50%',
    '--hero-vignette-x': '35%',
    '--hero-vignette-y': '35%',
    easing: 'ease-in-out',
  },
  {
    backgroundPosition: '70% 0%, 50% 50%',
    '--hero-vignette-x': '65%',
    '--hero-vignette-y': '40%',
    easing: 'ease-in-out',
  },
  {
    backgroundPosition: '100% 80%, 50% 50%',
    '--hero-vignette-x': '60%',
    '--hero-vignette-y': '65%',
    easing: 'ease-in-out',
  },
  {
    backgroundPosition: '30% 100%, 50% 50%',
    '--hero-vignette-x': '40%',
    '--hero-vignette-y': '60%',
    easing: 'ease-in-out',
  },
  {
    backgroundPosition: '0% 20%, 50% 50%',
    '--hero-vignette-x': '35%',
    '--hero-vignette-y': '35%',
  },
];

function startHeroMotion(element, frames, options = {}) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  element.animate(frames, {
    duration: 24000,
    iterations: Infinity,
    ...options,
  });
}

function startHeroShimmer(heading) {
  heading.style.animation = 'none';
  startHeroMotion(heading, SHIMMER_FRAMES);
}

function startHeroVignette(vignette) {
  startHeroMotion(vignette, VIGNETTE_FRAMES);
}

const VIGNETTE_FADE_MS = 1600;

function fadeHeroVignette(vignette) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  vignette.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: VIGNETTE_FADE_MS,
    easing: 'ease',
    fill: 'both',
  });
}

export function initHeroLoading(video) {
  const root = document.documentElement;
  const heading = document.querySelector('#hero-heading');
  const vignette = document.querySelector('.hero-vignette');
  if (heading) startHeroShimmer(heading);
  if (vignette) startHeroVignette(vignette);
  if (!root.classList.contains('hero-loading')) return () => {};

  const events = new AbortController();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let finished = false;
  let minimumTimeout;

  function reveal() {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    clearTimeout(minimumTimeout);
    typeHeroHeading.stop();
    events.abort();
    const curtain = document.querySelector('.hero-curtain');
    let opened = false;
    const finishCurtain = () => {
      if (opened) return;
      opened = true;
      root.classList.remove('hero-curtain-open');
      requestAnimationFrame(() => {
        const vignette = document.querySelector('.hero-vignette');
        if (vignette) fadeHeroVignette(vignette);
        root.classList.remove('hero-overlays');
      });
      document.dispatchEvent(new Event('hero-ready'));
    };
    // The scroll pin adds a transform that would trap the title under the curtain.
    if (curtain && root.classList.contains('hero-curtain-open')) {
      curtain.addEventListener('transitionend', (event) => {
        if (event.target !== curtain || event.propertyName !== 'transform')
          return;
        finishCurtain();
      });
      setTimeout(finishCurtain, 3000);
    } else {
      finishCurtain();
    }
    root.classList.remove('hero-loading');
  }

  // Keep navigation available even if the video or a font fails to load.
  const timeout = setTimeout(reveal, 8000);
  const frameReady = new Promise((resolve) => {
    if (video.readyState >= 2 || video.error) {
      resolve();
      return;
    }
    const options = { once: true, signal: events.signal };
    video.addEventListener('loadeddata', resolve, options);
    video.addEventListener('canplay', resolve, options);
    video.addEventListener('error', resolve, options);
  });

  const minimumDelay = new Promise((resolve) => {
    minimumTimeout = setTimeout(resolve, 1000);
  });
  const fontsReady = Promise.resolve(document.fonts?.ready).catch(() => {});
  const titleReady =
    reducedMotion.matches || !heading
      ? Promise.resolve()
      : fontsReady.then(() => {
          if (finished) return;
          return typeHeroHeading(heading);
        });
  reducedMotion.addEventListener(
    'change',
    () => {
      if (reducedMotion.matches) reveal();
    },
    { signal: events.signal },
  );
  Promise.all([frameReady, fontsReady, minimumDelay, titleReady]).then(reveal);
  return reveal;
}
