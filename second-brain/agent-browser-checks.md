# Agent browser checks

Date: 2026-10-31

Limits found while verifying the reviews page with Claude in Chrome, and how to work around them. These are about the automated browser, not the site.

- The automation tab reports `document.hidden`, so animation frames, CSS transitions and GSAP tweens barely advance, and scroll events arrive late. Each screenshot renders one frame.
  - Settle CSS transitions before capturing with `document.getAnimations().filter((a) => a.transitionProperty).forEach((a) => a.finish())`. Looping animations throw if you finish them.
  - Play a GSAP tween forward by taking a series of small screenshots.
  - Added 2026-11-03: to time GSAP tweens in that tab, drive the ticker by hand as described for the built-in browser below, but with a synchronous loop instead of `setInterval`. Hidden tabs run timers about once a second, and GSAP's lag smoothing caps each jump, so tweens hardly move. Call `gsap.ticker.lagSmoothing(0)`, then loop on `performance.now()` and call `gsap.ticker.tick()` every 16 ms. Tick once before scrolling, or the clock jumps by the idle gap and new tweens finish instantly. Keep each script under the tool's 45 s limit.
  - Reduced motion can't be emulated in this tab. Instead, `fetch` the dev page's HTML and load it in a `srcdoc` iframe whose first `<head>` script replaces `matchMedia` for `prefers-reduced-motion` queries, keeping its listeners so the setting can be flipped live. Match `': reduce'`, since every such query contains "reduce".
- Resizing the window had no effect. To check the 390 × 844 layout, load the page in a `390 × 844` iframe inside the tab.
- The scroll tool sends one wheel event that can't be cancelled, then scrolls by script, so it can't test code that blocks wheel input. Dispatch `new WheelEvent('wheel', { deltaY, cancelable: true, bubbles: true })` from the page instead.
- Screenshots taken mid-scroll can be out of sync with the page. Read positions with `getBoundingClientRect()` instead of judging from the image.

## Claude desktop app's built-in browser

Added 2026-11-01, while checking the scroll-in comments box.

- When the browser pane is hidden behind another panel, `requestAnimationFrame` never fires even though `document.hidden` is false, so GSAP tweens stay at their start state and any script awaiting a frame hangs.
- Drive GSAP by hand on the Vite dev server: find the page's `node_modules/.vite/deps/gsap.js?v=…` and `gsap_ScrollTrigger.js?v=…` URLs with `performance.getEntriesByType('resource')`, `import()` those exact URLs to get the page's own instances, then run `setInterval(() => gsap.ticker.tick(), 16)`. `ScrollTrigger.getAll()` then shows each trigger's start, end and state. The production build bundles GSAP, so this only works on the dev server.
  - ScrollTrigger also waits for a frame before reacting to page scrolls, so call `ScrollTrigger.update()` after each `window.scrollTo`. Without it, triggers never fire.
  - Chrome animates keyboard scrolling (Space, arrow keys) with frames too, so a key press moves a scroll box only a few pixels.
- The first screenshot after a change can show an older frame. Take a second one, or a tiny throwaway one first, and use the latest.
- `resize_window` with a width and height does change the viewport here, so the 390 × 844 iframe workaround isn't needed.
