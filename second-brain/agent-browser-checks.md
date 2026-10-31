# Agent browser checks

Date: 2026-10-31

Limits found while verifying the reviews page with Claude in Chrome, and how to work around them. These are about the automated browser, not the site.

- The automation tab reports `document.hidden`, so animation frames, CSS transitions and GSAP tweens barely advance, and scroll events arrive late. Each screenshot renders one frame.
  - Settle CSS transitions before capturing with `document.getAnimations().filter((a) => a.transitionProperty).forEach((a) => a.finish())`. Looping animations throw if you finish them.
  - Play a GSAP tween forward by taking a series of small screenshots.
- Resizing the window had no effect. To check the 390 × 844 layout, load the page in a `390 × 844` iframe inside the tab.
- The scroll tool sends one wheel event that can't be cancelled, then scrolls by script, so it can't test code that blocks wheel input. Dispatch `new WheelEvent('wheel', { deltaY, cancelable: true, bubbles: true })` from the page instead.
- Screenshots taken mid-scroll can be out of sync with the page. Read positions with `getBoundingClientRect()` instead of judging from the image.
