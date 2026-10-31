# Homepage video and local preview

Date: 2026-10-24

- For live editing, use `npm run dev` and the URL Vite prints. `npm run preview` serves the last `dist/` build; saving source files does not update it. Check the server’s working directory before reusing a port: 5173 may belong to another project. During this exploration, RKC used 5174 for development and 4173 for production verification.
- The homepage exploration uses RKC’s YouTube video `Zqq2ikZ_5EY`. Its embed configuration is in `index.html`; playback speed and API setup are in `src/main.js`; desktop and mobile crop/overlay rules are in `src/style.css`.
- YouTube controls can be hidden, but channel/logo/loading overlays cannot reliably be removed. A supplied MP4 is needed for a fully controlled background video. Quality is adaptive; the iframe API cannot force maximum quality. Configure playback speed through `setPlaybackRate`, and reapply when playback starts after looping.
- Set initial bubble positions with `left` and `top` before constructing the GSAP sequence. Combining timeline position setters with immediate-render entrance tweens produced a central overlap during this exploration. Keep decorative bubbles hidden from assistive technology and scope the entrance to `prefers-reduced-motion: no-preference`.
- Keep homepage text in HTML and visible without JavaScript. The requested entrance deliberately fades the hero copy after the bubbles; this is a design experiment with the LCP tradeoff described in `seo-geo.md`, not a resolved performance improvement.

## Segment loops and glass filters

Date: 2026-10-31

- For a repeating YouTube segment, disable playlist looping and reload the video with both `startSeconds` and `endSeconds` on `ENDED`. `seekTo()` clears the end boundary. PR #7 verifies 52–167 seconds and normal 1× playback; configuration is in `index.html` and the restart handler is in `src/main.js`.
- Verify glass filters against the production CSS and `getComputedStyle(header).backdropFilter`. In this Vite/Tailwind build, placing `-webkit-backdrop-filter` after `backdrop-filter` left only the prefixed declaration in the output, so Chrome reported `none`. Keeping the standard declaration produced the expected blur/saturation in `src/style.css`.
