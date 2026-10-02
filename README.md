# RKC Cleaners

A small static website built with Vite, Tailwind CSS, vanilla JavaScript, and GSAP + ScrollTrigger.

## First-time setup

Install [Git](https://git-scm.com/downloads) and Node.js 24 LTS (24.21.0 is pinned in `.nvmrc`). npm 11 comes with Node.js 24.

On macOS or Linux, [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) can install and switch Node versions. Once nvm is installed:

```sh
git clone https://github.com/pnhalim/rkccleaners.git
cd rkccleaners
nvm install
nvm use
npm ci
npm run dev
```

On Windows, or if you don't use nvm, install Node.js 24 from the [official downloads](https://nodejs.org/en/download), then run the same commands without `nvm install` and `nvm use`.

Open the local URL printed in the terminal. Press `Ctrl+C` to stop the server. Check your installation with `node --version` (24.x) and `npm --version` (11.x).

## Everyday development

Use `nvm use` when returning to the project if you use nvm. Run `npm ci` after pulling changes to `package-lock.json`, then start `npm run dev`. Vite updates the browser as you save files.

| Command                | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `npm ci`               | Install the exact dependencies in the lockfile |
| `npm run dev`          | Start the development server                   |
| `npm run build`        | Build the static site into `dist/`             |
| `npm run preview`      | Preview a completed build locally              |
| `npm run format`       | Format project files with Prettier             |
| `npm run format:check` | Check formatting without changing files        |

Use `npm install <package>` (or `npm install -D <package>` for development tools) when intentionally adding a dependency. Commit both `package.json` and `package-lock.json`. Don't commit `node_modules/` or `dist/`.

## Where things live

- `index.html`: page content, metadata, and Tailwind classes.
- `src/style.css`: Tailwind import and shared custom styles.
- `src/brand.css`: shared brand colors, fonts, and corner radii.
- `src/main.js`: JavaScript interactions and GSAP animations.
- `vite.config.js`: Vite and Tailwind integration.
- `public/`: static assets served unchanged, such as the favicon.
- `second-brain/`: short, reusable project learnings.
- `AGENTS.md`: coding and review conventions, also used by Claude.

The starter contains a simple coming-soon page. Replace its text with approved business information as we iterate. Content works without JavaScript; scroll animations respect the visitor's reduced-motion preference.

For visual exploration and designer handoff, start with the [design guide](docs/design.md).

## Before opening a pull request

Create a branch such as `feat/contact-section` or `fix/mobile-menu`. Run:

```sh
npm run format:check
npm run build
npm run preview
```

Check desktop and mobile layouts, keyboard navigation, links, and scrolling. For animation changes, also check resizing and reduced motion. Include a short description of your changes, checks, and screenshots for visual changes. Have one teammate review before merging.

See [Testing and pull requests](docs/testing-and-prs.md) for the shared test conventions, E2E requirements, screenshot handling, and Codex PR workflow. Automated test commands are planned there but are not installed yet. The PR template lives in `.github/pull_request_template.md`.

## Deployment

GitHub Pages publishes production at https://pnhalim.github.io/rkccleaners/.

- PRs run formatting, deployment tests, and a Vite build. Same-repository PRs get a preview at `/rkccleaners/previews/pr-<number>/`, linked in a bot comment after deployment. Fork PRs only run checks.
- Pushes to `main` update production while preserving previews. Closing or merging a PR removes its preview.
- A separate publisher on `main` stores the combined site on `gh-pages` and deploys it through GitHub Actions. PR code builds with a read-only token; the publisher copies compiled files without running them. Stale builds are skipped.

In Settings → Pages, use **GitHub Actions** as the source. Keep the `github-pages` environment restricted to `main`. The publishing workflow must be merged before it can react to PR builds; rerun an existing PR’s build after setup. Actions uses short-lived internal artifacts to transfer files, but reviewers use the preview URL. Preview pages are public, just like production.

Vite uses `/rkccleaners/` as its production base; PR builds override it with their preview path. Run `npm run build` and `npm run preview`, then open `/rkccleaners/` locally. Do not publish the source folder directly: Tailwind and JavaScript need Vite’s build step.

## Troubleshooting

- **Wrong Node version:** run `nvm install` and `nvm use`, or install Node.js 24 manually, then run `npm ci` again.
- **Dependencies fail to install:** check that you're in the project folder and have internet access. Use `npm ci` with the committed lockfile.
- **Port already in use:** open the URL Vite prints; it may choose the next available port.

Stack references: [Vite](https://vite.dev/guide/), [Tailwind with Vite](https://tailwindcss.com/docs/installation/using-vite), and [GSAP matchMedia](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>).
