# GitHub PR workflow

Date: 2026-10-01

- Prefer authenticated `gh`; use browser control if API access is unavailable.
- Sandbox errors can resemble invalid credentials. Check approved network access before requesting another login; never print tokens.
- Use `--body-file` for multiline descriptions, then verify the published text and image links. Follow `.agents/skills/pr-ready/SKILL.md`.
- Prefer temporary screenshot files. Remote CI capture and hosting avoids local files; keep generated evidence out of commits.
- Commit and immediately push every second-brain update separately to the latest `main`, without a PR. Keep these commits out of PR branches.
