# Scroll effects

Date: 2026-10-31

Learned while building the review sketches on `reviews/index.html` (`src/reviews.js`, `src/style.css`).

- Tailwind v4's preflight hides `[hidden]` with `display: none !important`, so CSS can't keep a hidden element in the layout. To stack panels in one spot and cross-fade them without the page height changing, toggle `inert` and hide with `visibility` and `opacity` instead (see `.bubble-review[inert]`).
- Don't move content against the scroll with a scrubbed GSAP tween. The browser scrolls a frame before JavaScript catches up, so the content visibly shakes. Pin it with ScrollTrigger instead, since fixed positioning stays in step with scrolling, and animate only small offsets.
- Because `html` has `scroll-behavior: smooth`, ScrollTrigger writes an inline `scroll-behavior: smooth` back onto `<html>` after each refresh, and plain `scrollTo` calls animate. Pass `behavior: 'instant'` for jumps that must not animate, such as the review bubbles' Skip button.
- Steering scroll per gesture (GSAP Observer with momentum detection) was tried for the review bubbles and dropped as too fiddly. Scroll-position steps on a pinned section are what shipped.

## Reloads, dev styles and masks

Added 2026-11-02, while adding the review bubbles' up and down skip buttons on the `scroll-comments` branch.

- A reload from below a pinned section can land inside it. The browser restores the scroll position before ScrollTrigger adds the pin's scroll distance, and ScrollTrigger then keeps that raw number, so a reload at Sketch 3 came back mid-bubbles with the skip buttons showing. `src/reviews.js` calls `ScrollTrigger.clearScrollMemory('manual')` so reloads start at the top. Setting `history.scrollRestoration` directly doesn't stick, because ScrollTrigger reapplies the value it read at startup after every refresh.
- The Vite dev server injects CSS from JavaScript after the first paint, so a transition on an element's hidden state plays once on every dev load. The fixed skip bubbles flashed and shrank this way; production links the CSS in `<head>` and doesn't. Scope such transitions to a class set once the element has been shown (`.skip-bubble.has-shown`).
- `mask-image` also clips the element's own outline, so a masked scroll box loses its focus ring. Draw the ring on a wrapper with `:has(> :focus-visible)`. Sketch 3's earlier scroll box did this; the pinned version that replaced it has no focusable box.
- ScrollTrigger's `pinnedContainer` only shifts a trigger that starts at or after the pin starts. A trigger inside a pinned section that starts earlier, such as "box on screen" from its top at 70%, keeps an end that ignores the pin's scroll distance and switches off partway through the pin. Pinned Sketch 3 checks the box's on-screen position with `getBoundingClientRect()` on scroll instead (`updatePops` in `src/reviews.js`).
