---
name: pr-ready
description: Prepare RKC Cleaners changes for PR review with project checks, browser verification, screenshots, and an evidence-based PR description. Use when preparing or updating a PR for this repository.
---

# Prepare a PR for review

Read `AGENTS.md` and `docs/testing-and-prs.md` from the repository root. Use `.github/pull_request_template.md` for the description; those files own the requirements.

Inspect the working tree and final diff before choosing checks. Preserve unrelated changes and include only task changes in any commit. Inspect `package.json` for available commands; the documented future test commands may not exist yet.

Run the required checks for the change type. For site changes, verify the freshly built production site at the documented viewports using the E2E runner if installed and available browser tools for visual inspection. Without a runner, report browser verification accurately. Investigate failures before marking the PR ready; keep unresolved work draft.

Prefix each verification bullet with its status: `✅ Passed`, `❌ Failed`, `⏭️ Not run` (include why), or `➖ Not applicable`. Keep the text label alongside the emoji and assign statuses only from actual results.

Keep the Change section concise: one sentence explaining the purpose, then 1–3 short bullets summarizing the main changes. Group related changes; omit file-by-file inventories, implementation narration, and repeated rationale. Combine checks with the same result when clear. Include extra detail only for a material risk or reviewer decision. Preserve the author's wording when updating an existing description; edit only what the task or changed scope requires.

Capture and inspect screenshots for visual changes, save them in ignored artifact directories, and record the route, viewport, and state. Upload through an available authenticated interface only when PR publication is authorized. Verify reviewer-accessible links; if attachment is unavailable, retain local evidence and state the missing attachment. Never use local paths as GitHub image URLs.

Write a concise title and completed description from the resulting behavior and actual verification results. Remove unused template sections. Prepare the description locally if publication is not authorized; otherwise create or update the PR using an available connector or `gh` with `--body-file` for multiline text. Always supply the description explicitly and read the published PR back to confirm it was saved. Keep the title and description aligned with the final scope. Report the PR URL or local description path, checks, and outstanding evidence. Teammate review is still required; do not merge or deploy unless explicitly asked.
