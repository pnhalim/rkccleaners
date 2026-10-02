# GitHub PR workflow

Date: 2026-10-01

- Prefer authenticated `gh`; use browser control if API access is unavailable.
- Sandbox errors can resemble invalid credentials. Check approved network access before requesting another login; never print tokens.
- Use `--body-file` for multiline descriptions, then verify the published text, build-run link, preview link, and image links. Follow `.agents/skills/pr-ready/SKILL.md`.
- Prefer temporary screenshot files. Remote CI capture and hosting avoids local files; keep generated evidence out of commits.
- Pages must deploy Vite’s `dist/`, with `/rkccleaners/` as the production base; serving source HTML leaves Tailwind uncompiled.
- PR previews use `/rkccleaners/previews/pr-<number>/`. The publisher preserves production and other previews on `gh-pages`, then removes closed PR previews. Builds pass files through one-day internal artifacts; reviewers use URLs.
- The publisher must be on `main` before previews activate. For an older PR with no checks, `gh pr update-branch <number> --repo pnhalim/rkccleaners` triggers its first build. A successful build alone does not confirm deployment.
- Do not monitor builds unless requested. Read status once and label pending preview links accurately.
- Commit and immediately push every second-brain update separately to the latest `main`, without a PR. Keep these commits out of PR branches.
