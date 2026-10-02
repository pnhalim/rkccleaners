# GitHub PR access and screenshots

Date: 2026-10-01

- Prefer authenticated `gh` commands for PR creation and updates. The GitHub connector could not access this private repository during the sample theme PR; browser control worked as a fallback. Recheck connector access before assuming that limitation persists.
- `gh` is now installed and authenticated. Repository access was verified with `gh pr view 3 --repo pnhalim/rkccleaners --json number,title,url,state`.
- Inside the restricted sandbox, `gh auth status` reported an invalid token and the PR request failed to connect. The same PR request succeeded with approved access outside the sandbox. Check sandbox/network access before asking someone to log in again; never print tokens.
- Supply multiline PR descriptions with `--body-file` and read the published PR back to verify the description and image links. Follow `.agents/skills/pr-ready/SKILL.md` for concise wording and verification statuses.
- The user prefers API/CLI publishing and avoiding screenshot downloads on their computer. Temporary screenshot files still use local storage; capturing and hosting screenshots in remote CI would avoid that. The sample PR's captures are in ignored `artifacts/theme-preview/`, not committed.

Reference: [sample theme PR #3](https://github.com/pnhalim/rkccleaners/pull/3).
