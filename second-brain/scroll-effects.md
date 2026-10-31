# Scroll effects

Date: 2026-10-31

Learned while building the review sketches on `reviews/index.html` (`src/reviews.js`, `src/style.css`).

- Tailwind v4's preflight hides `[hidden]` with `display: none !important`, so CSS can't keep a hidden element in the layout. To stack panels in one spot and cross-fade them without the page height changing, toggle `inert` and hide with `visibility` and `opacity` instead (see `.bubble-review[inert]`).
- Don't move content against the scroll with a scrubbed GSAP tween. The browser scrolls a frame before JavaScript catches up, so the content visibly shakes. Pin it with ScrollTrigger instead, since fixed positioning stays in step with scrolling, and animate only small offsets.
- Because `html` has `scroll-behavior: smooth`, ScrollTrigger writes an inline `scroll-behavior: smooth` back onto `<html>` after each refresh, and plain `scrollTo` calls animate. Pass `behavior: 'instant'` for jumps that must not animate, such as the review bubbles' Skip button.
- Steering scroll per gesture (GSAP Observer with momentum detection) was tried for the review bubbles and dropped as too fiddly. Scroll-position steps on a pinned section are what shipped.
