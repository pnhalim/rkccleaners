# SEO and GEO priorities

Date: 2026-10-03

Source: Google's [Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide). GEO is mostly ordinary SEO: Google says llms.txt files, content chunking, AI-specific writing and special schema aren't needed.

## Rendering

- Page text must be in the built HTML. Major AI crawlers, including ChatGPT's and Claude's, don't run JavaScript. Google does, but later. Text inserted by JavaScript is invisible to AI search.
- Read owner-editable content, such as a Google Sheet, at build time and rebuild when it changes. Never fetch it in the browser.
- Astro, which the research proposed, outputs static HTML by default and runs on Vite, so Tailwind, GSAP and vanilla JS carry over. It adds shared layouts and build-time data loading, which plain Vite lacks.

## Animation and Core Web Vitals

Targets: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.

- Never fade in the hero headline or main image because it delays LCP.
- Animate only `transform` and `opacity`.
- Let GSAP set hidden start states, as `gsap.from` does in `src/main.js`. Never hide content in CSS while waiting for JavaScript.
- Load GSAP only on pages that use it; use CSS for simple fades.

## Pages and content

- Give each page one audience and search intent, with a unique title, meta description, single H1 and clean URL. Planned pages: home, hotel and commercial (main focus), household, consulting, FAQ and contact.
- Hotel pages: turnaround, pickup schedule, capacity, service area, minimums and proof from hotel clients. The call to action is a quote request. Household pages: short, focused on convenience and price.
- Name the towns served, such as Elk Grove Village and the O'Hare corridor. The strongest nearby competitors do.
- Baseline: XML sitemap, a robots.txt that allows AI crawlers, HTTPS, one canonical URL format and a mobile-first layout.

## Redirects

- GitHub Pages can't send 301 redirects. Redirect an old URL with a stub page that has an instant meta refresh and a canonical link; Google treats an instant meta refresh as permanent. Let pages with no value return 404.
