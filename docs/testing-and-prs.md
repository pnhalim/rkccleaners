# Testing and pull requests

Keep checks proportional to this small static site. Test behavior that can break for customers or content editors; avoid assertions about exact marketing copy, Tailwind classes, or animation timing.

## Current tooling and conventions

Today, `package.json` provides `npm run format:check`, `npm run build`, and `npm run preview`. There is no automated test runner, content configuration, or CI test workflow yet. The following test layout and commands are conventions for when those features are introduced, not commands to run today:

| Layer                       | Location                      | Proposed command                                    | What it protects                                                                                         |
| --------------------------- | ----------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Unit and content processing | `tests/unit/*.test.js`        | `npm test` using `node --test tests/unit/*.test.js` | Validation, text escaping, defaults, and other meaningful logic                                          |
| Current content validation  | `scripts/validate-content.js` | `npm run content:check`                             | Required fields, field types, local image existence, meaningful image alt text, and allowed link formats |
| Browser E2E                 | `tests/e2e/*.spec.js`         | `npm run test:e2e` using Playwright                 | Built pages, navigation, contact links, accessibility basics, and affected interactions                  |

Add each command with its implementation. When configurable content is introduced, run validation during the build so invalid content cannot be published. Test valid and invalid inputs and helpful error messages. Keep core content in generated HTML so it remains available without JavaScript.

Use Node's built-in runner for small logic tests. Introduce Playwright when implementing repeatable browser tests; start with one Chromium smoke suite at desktop and mobile viewport sizes. Add other browsers only when supported browser requirements or bugs justify them. Keep tests independent; prefer roles and accessible names for selectors. Avoid arbitrary sleeps and assertions that merely repeat implementation details.

## Before a PR is ready

1. Review the final diff and preserve unrelated work. Use Node 24 and npm 11.
2. Run `npm run format:check` and `npm run build`. Run relevant unit tests and content validation when their commands exist.
3. For site changes, run the complete E2E suite against the freshly built `dist/`, not only the Vite development server. A future Playwright configuration should start `npm run preview` and use a predictable port with strict port checking. Until that suite exists, perform the browser checks below and report them as manual or agent browser verification, never as automated tests.
4. Inspect desktop and mobile layouts and affected interactions, then capture evidence for visual changes. Screenshots alone do not verify behavior.
5. Write the PR description from the final diff and actual results. If checks fail or required evidence is unavailable, keep the PR draft and state what remains. After a fix, rerun affected checks and refresh evidence from the resulting build.

Documentation-only changes require formatting and build checks; mark browser checks and screenshots as not applicable. Tooling changes need checks that exercise the changed tooling; run browser E2E when build output or runtime behavior is affected.

## Browser checks and screenshots

Use consistent viewports: desktop 1440 × 900 and mobile 390 × 844. These are viewport checks, not proof of real-device compatibility.

- Verify page content, local images, navigation targets, and affected links. Inspect telephone and email destinations without initiating calls or sending messages.
- Check keyboard access, visible focus, and the skip link. Check mobile overflow and readable content.
- For animation changes, scroll through reveal sections, resize, and enable reduced motion. Verify content remains visible and usable. Check core content with JavaScript disabled when content generation changes.
- Inspect browser errors and failed local asset requests; investigate failures introduced by the change.

For visual changes, capture the affected section or page at both viewports after images and animations settle. Scroll through reveal sections before a full-page capture so hidden animation states do not misrepresent the page. Record route, viewport, and state, including reduced motion when relevant. Inspect each image before attaching it. Include before screenshots when they help explain the change; do not manufacture missing before evidence.

Store temporary screenshots, reports, and traces under ignored `artifacts/`, `playwright-report/`, or `test-results/`. Do not commit generated evidence by default. Attach screenshots using an available authenticated GitHub upload interface, or link to uploaded CI artifacts. Verify links are accessible to reviewers. Local filesystem paths do not render as images in a GitHub PR; artifact download links should be labeled as links rather than embedded images. If upload is unavailable, provide the local files and mark attachment as outstanding.

## PR descriptions and automation

Keep the Change section to one purpose sentence and 1–3 short bullets covering the main changes. Group related changes; omit file inventories, implementation narration, and repeated rationale. Combine verification checks with the same status when clear. Add detail only for material risks or decisions a reviewer needs to make. When updating an existing PR, preserve the author's wording and change only what the task or scope requires.

Use consistent status labels in verification bullets: `✅ Passed`, `❌ Failed`, `⏭️ Not run` (with a reason), and `➖ Not applicable`. Keep the words alongside the emoji so the status remains clear.

Every PR needs a descriptive title and a completed description; a branch push alone does not create a PR or supply its description. Use `.github/pull_request_template.md`. Lead with the concrete problem and resulting behavior; include only relevant checks, screenshot evidence, and limitations. Remove inapplicable placeholders. Report each check as passed, failed, not run (with reason), or not applicable. Never infer success from a screenshot or an unexecuted command. After creating or updating a PR, read it back to confirm the description was saved. Update the title and description whenever the scope changes.

Codex can follow this workflow, run available commands, use connected browser tools, capture and inspect screenshots, and prepare a title and description. Ask: "Use $pr-ready to prepare this change for review." A skill supplies instructions; it does not install runners, schedule execution, or provide GitHub credentials. See the [official skills documentation](https://learn.chatgpt.com/docs/build-skills).

When opening or updating a PR is authorized, use an available GitHub connector or authenticated `gh`. For multiline descriptions, write the text to a file and use `gh pr create --body-file <file>` or `gh pr edit --body-file <file>`. Do not assume `gh` can upload local screenshots directly into the description. If publication is not authorized, prepare a local description and evidence without publishing them.

For checks that must run automatically on every PR, add a CI workflow when the test runners are implemented. CI should use Node 24, `npm ci`, formatting, content validation and unit tests when available, a build, and browser E2E, with reports and screenshot artifacts uploaded. Instructions and skills alone do not enforce a merge gate; required checks need repository branch protection configuration. Teammate review remains required. Do not merge or deploy without explicit authorization.
