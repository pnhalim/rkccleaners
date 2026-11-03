import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Wires up the up and down skip bubbles for a pinned section, found by
// data-skips-for="<section id>". Returns a function that shows or hides them.
export function initSkipBubbles(section) {
  const links = document.querySelectorAll(
    `[data-skips-for="${section.id}"] .skip-bubble`,
  );

  function skipPast(link) {
    // Jump instead of smooth scrolling, which would flip through the pinned
    // section. Skipping up leaves this section starting just below: at the end
    // of the section above, or at the end of that section's own pin, since
    // anywhere closer is still inside it.
    const target = document.querySelector(link.hash);
    if (link.classList.contains('skip-bubble-up')) {
      const pin = ScrollTrigger.getAll().find(
        (trigger) => trigger.pin === target,
      );
      if (pin) window.scrollTo({ top: pin.end, behavior: 'instant' });
      else target.scrollIntoView({ behavior: 'instant', block: 'end' });
    } else {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
    target.focus({ preventScroll: true });
  }

  links.forEach((link) =>
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

  return function showSkips(visible) {
    links.forEach((link) => {
      // A popped bubble stays invisible while it hides, and is reset only once
      // it shows again so it can't flash back while shrinking away.
      if (visible) link.classList.remove('is-popping');
      link.classList.toggle('is-visible', visible);
      if (visible) link.classList.add('has-shown');
    });
  };
}
