# RM Industries website visual language

The company site is the shared front door for RM Industries.

It uses the same Catppuccin palette and Fira typography as the project sites. Forge and Etch remain visually distinct.

## Company identity

- The RM monogram is the company mark. Use it in company navigation, the favicon, the web manifest, and company social cards.
- Keep the mark transparent outside explicitly designed surfaces. Do not place it inside an opaque padded square.
- Preserve the `96 × 64` logo aspect ratio and the favicon's intentional clear space.
- Lavender is the monogram accent in every format. The frame adapts between Latte and Mocha for browser-rendered assets.

## Visual motif

The company motif is **friction becoming a useful tool**.

The homepage's directional path, soft radial fields, workshop language, and restrained grids support that story.

- Forge owns content-pipeline and website-building imagery.
- Etch owns plans, modules, terminals, and environment-composition imagery.
- Project marks remain unchanged on the company site and sit on neutral surfaces.

## Color and type

- Use DaisyUI semantic tokens for interface colors.
- Reserve hard-coded Catppuccin values for static SVG assets that cannot consume CSS theme tokens.
- Use Fira Sans for prose and interface text and Fira Code for labels, metadata, and technical text.
- Social graphics use the Mocha palette because social-image renderers do not expose the visitor's theme preference.

## Components and semantic roles

- `primary` identifies the principal action in a section. A project name or category does not change that hierarchy.
- `outline` identifies a meaningful alternative to the principal action.
- `ghost` is reserved for low-emphasis controls such as the mobile menu trigger.
- Neutral badges describe categories. Primary soft badges identify numbered company principles.
- `success`, `warning`, and `error` communicate real states. They are not decorative project colors.
- `secondary` and `accent` are available for supporting brand expression, not to distinguish otherwise equivalent actions.

Use DaisyUI cards, badges, buttons, menus, navigation, pagination, status,
and hero components before creating a custom primitive. Tailwind utilities
remain appropriate for spacing, responsive layout, and composition.

`ProblemPath.astro` is the intentional exception. It tells the company-specific
friction-to-tool story that DaisyUI does not model, while composing DaisyUI
cards and badges internally.

## Accessibility and responsive use

- Decorative graphics must use `aria-hidden="true"` or an empty alternative when equivalent text is adjacent.
- Informative project marks use concise project-name alternatives.
- Do not encode required meaning through color alone.
- Verify logos and illustrations at narrow mobile widths and in every supported Catppuccin theme.
- Preserve visible focus states and reduced-motion behavior around graphic treatments.

## Asset ownership

| Asset                    | Purpose                            | Rules                                                                    |
| ------------------------ | ---------------------------------- | ------------------------------------------------------------------------ |
| `public/logo.svg`        | Company navigation and footer      | Transparent, theme-aware, `96 × 64` view box                             |
| `public/favicon.svg`     | Browser and installed-app identity | Transparent, theme-aware, intentional clear space                        |
| `public/social-card.svg` | Social sharing                     | Static Mocha surface, `1200 × 630`, current monogram and Fira typography |
| `ProblemPath.astro`      | Company story illustration         | Decorative, company-only friction-to-tool motif                          |
| `/forge/favicon.svg`     | Forge project card                 | Owned by Forge; preserve its geometry and transparency                   |
| `/etch/logo.svg`         | Etch project card                  | Owned by Etch; preserve its geometry and transparency                    |
