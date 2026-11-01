# Agent browser checks

Date: 2026-10-31

Limits found while verifying the reviews page with Claude in Chrome, and how to work around them. These are about the automated browser, not the site.

- The automation tab reports `document.hidden`, so animation frames, CSS transitions and GSAP tweens barely advance, and scroll events arrive late. Each screenshot renders one frame.
  - Settle CSS transitions before capturing with `document.getAnimations().filter((a) => a.transitionProperty).forEach((a) => a.finish())`. Looping animations throw if you finish them.
  - Play a GSAP tween forward by taking a series of small screenshots.
- Resizing the window had no effect. To check the 390 × 844 layout, load the page in a `390 × 844` iframe inside the tab.
- The scroll tool sends one wheel event that can't be cancelled, then scrolls by script, so it can't test code that blocks wheel input. Dispatch `new WheelEvent('wheel', { deltaY, cancelable: true, bubbles: true })` from the page instead.
- Screenshots taken mid-scroll can be out of sync with the page. Read positions with `getBoundingClientRect()` instead of judging from the image.

## Claude desktop app's built-in browser

Added 2026-11-01, while checking the scroll-in comments box.

- When the browser pane is hidden behind another panel, `requestAnimationFrame` never fires even though `document.hidden` is false, so GSAP tweens stay at their start state and any script awaiting a frame hangs.
- Drive GSAP by hand on the Vite dev server: find the page's `node_modules/.vite/deps/gsap.js?v=…` and `gsap_ScrollTrigger.js?v=…` URLs with `performance.getEntriesByType('resource')`, `import()` those exact URLs to get the page's own instances, then run `setInterval(() => gsap.ticker.tick(), 16)`. `ScrollTrigger.getAll()` then shows each trigger's start, end and state. The production build bundles GSAP, so this only works on the dev server.
- `resize_window` with a width and height does change the viewport here, so the 390 × 844 iframe workaround isn't needed.
