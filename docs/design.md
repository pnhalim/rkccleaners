# Design playground

The current teal palette, system fonts, and rounded shapes are starter choices. They are ready to change as the brand develops.

## Get started

Follow the [README setup guide](../README.md#first-time-setup), create a branch such as `feat/brand-exploration`, and run `npm run dev`. Open the URL printed in the terminal; saved edits appear in the browser.

## Where to edit

| File            | What to change                                                        |
| --------------- | --------------------------------------------------------------------- |
| `src/brand.css` | Shared colors, body and heading fonts, button and panel corner radii  |
| `index.html`    | Content, layout, spacing, font sizes, and responsive Tailwind classes |
| `src/style.css` | Custom styles and keyboard focus treatment                            |
| `src/main.js`   | GSAP animation distance, timing, and scroll triggers                  |
| `public/`       | Static assets, including the separately styled favicon                |

`src/style.css` imports the brand file. Its Tailwind `@theme` variables generate classes used throughout the page, so changing a value updates every matching element. See [Tailwind theme variables](https://tailwindcss.com/docs/theme).

## Brand choices

| Variable                                       | Role                                                    |
| ---------------------------------------------- | ------------------------------------------------------- |
| `--color-page`, `--color-surface`              | Page background and raised surfaces                     |
| `--color-ink`, `--color-muted`, `--color-line` | Main text, secondary text, and dividers                 |
| `--color-brand`                                | Primary button background and accent text               |
| `--color-brand-hover`                          | Navigation link hover color                             |
| `--color-brand-deep`                           | Feature panel background and primary button hover color |
| `--color-on-brand`, `--color-on-brand-muted`   | Text on brand backgrounds                               |
| `--color-focus`                                | Keyboard focus outline                                  |
| `--font-body`, `--font-heading`                | Body and heading font families                          |
| `--radius-button`, `--radius-panel`            | Button and feature panel corner radii                   |

For a first experiment, change `--color-brand` to a hex color such as `#7c3aed` and save. The button and accent text will update. Adjust the hover, deep, and foreground colors together for a coordinated palette. Colors accept hex, RGB, or OKLCH values.

Use role-based classes when adding elements: `bg-brand text-on-brand` for a primary action, `text-muted` for supporting text, and `rounded-panel` for a panel. Layout still uses ordinary Tailwind utilities such as `px-6`, `max-w-6xl`, and `sm:text-7xl`.

Changing a font name doesn't download it. For a custom font, add licensed font files under `public/fonts/`, define `@font-face` in `src/style.css`, and use that family in `src/brand.css`. The favicon is a standalone SVG and must be updated separately when the brand changes.

## Share an exploration

Check desktop and mobile layouts, text contrast, keyboard focus, and navigation. Keep reduced-motion support intact. Include screenshots and a brief description of the direction in your PR, then ask a teammate to review. Run `npm run format:check` and `npm run build` before handing it off.
