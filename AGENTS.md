# Project guidance

This is a small static website built with friends for a real small business. Keep the code and workflow simple.

Make small changes at a time, reduce complexity, and verify the result.

## Stack

- Vite for development and production builds.
- Tailwind CSS for styling; use custom CSS when it makes the result clearer.
- Vanilla JavaScript with ES modules for interactions.
- GSAP with ScrollTrigger for animation and scroll effects.
- Use Node.js 24 LTS (see `.nvmrc`) and npm 11. Commit `package-lock.json`; use `npm ci` to install the locked dependencies.

## Code

- Follow the existing structure and style. Use semantic HTML and straightforward JavaScript modules.
- Keep code concise and readable; use clear names and small, focused functions.
- Add comments only to explain a non-obvious decision or constraint, never to narrate the code.
- Avoid unnecessary dependencies, abstractions, tooling, or features.
- Use semantic HTML, accessible controls, and responsive layouts.
- Define shared brand colors, fonts, and corner radii in `src/brand.css`; use their role-based Tailwind classes. See `docs/design.md` for designer handoff.
- Respect reduced-motion preferences and keep content usable without animations.
- Keep changes focused on the task and preserve unrelated work.

## Checks

- For bugs, reproduce the problem, fix its cause, and verify the original case.
- Run the relevant build, lint, or test commands when available.
- Before review, run `npm run format:check` and `npm run build`. Use `npm run format` to fix formatting.
- For site changes, check desktop and mobile layouts, links, and any affected interactions in a browser.
- For animation changes, check scrolling, resizing, and reduced-motion behavior.
- Add tests when they protect meaningful behavior; skip tests for trivial content or styling changes.
- Report what was checked and anything that could not be verified.

## Shared learnings

- Use `second-brain/` for project-specific learnings that will help future tasks. Check relevant notes before starting work and confirm they still match the code.
- Save a note when you discover a useful gotcha, verify a fix, or make a decision whose reasoning is not obvious. Skip routine task logs and generic advice.
- Keep notes short, in Markdown files named by topic. Include the date, what was learned, why it matters, and relevant file paths or verification steps.
- Update an existing note rather than duplicating it; correct or remove stale guidance. Current code and project instructions take precedence over notes.
- Never store secrets or private customer information. Include note changes in the normal code review.

## Code review

- Review your own diff before handing it off; remove unused code and unnecessary comments.
- Use a branch and pull request for changes; have at least one teammate review before merging.
- Name branches `<type>/<short-description>` using lowercase and hyphens. Use `feat/` for features, `fix/` for bugs, `docs/` for documentation, and `chore/` for maintenance (for example, `feat/contact-section` or `fix/mobile-menu`). Follow any branch prefix required by your tool.
- Keep PRs small. Concisely explain what changed and how it was checked; include screenshots for visual changes.
- Review for correctness, readability, accessibility, and unnecessary complexity.
- Prioritize actionable issues; distinguish required fixes from optional suggestions.
- Do not merge or deploy unless explicitly asked.
