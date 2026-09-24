# RM Industries website visual language

The company site is the shared front door for RM Industries. It uses the same Catppuccin palette and Fira typography as the project sites without making Forge and Etch look interchangeable.

## Company identity

- The RM monogram is the company mark. Use it in company navigation, the favicon, the web manifest, and company social cards.
- Keep the mark transparent outside explicitly designed surfaces. Do not place it inside an opaque padded square.
- Preserve the `96 × 64` logo aspect ratio and the favicon's intentional clear space.
- Lavender is the monogram accent in every format. The frame adapts between Latte and Mocha for browser-rendered assets.

## Visual motif

The company motif is **friction becoming a useful tool**. The homepage's directional path, soft radial fields, workshop language, and restrained grids support that story.

Forge owns content-pipeline and website-building imagery. Etch owns plans, modules, terminals, and environment-composition imagery. Project marks remain unchanged when shown on the company site and sit on a neutral surface so they do not compete with company branding.

## Color and type

- Use DaisyUI semantic tokens for interface colors. Hard-coded Catppuccin values are reserved for static SVG assets that cannot consume CSS theme tokens.
- Use Fira Sans for prose and interface text and Fira Code for labels, metadata, and technical text.
- Social graphics use the Mocha palette because social-image renderers do not expose the visitor's theme preference.

## Accessibility and responsive use

- Decorative graphics must use `aria-hidden="true"` or an empty alternative when equivalent text is adjacent.
- Informative project marks use concise project-name alternatives.
- Do not encode required meaning through color alone.
- Verify logos and illustrations at narrow mobile widths and in every supported Catppuccin theme.
- Preserve visible focus states and reduced-motion behavior around graphic treatments.

## Asset ownership

| Asset | Purpose | Rules |
| --- | --- | --- |
| `public/logo.svg` | Company navigation and footer | Transparent, theme-aware, `96 × 64` view box |
| `public/favicon.svg` | Browser and installed-app identity | Transparent, theme-aware, intentional clear space |
| `public/social-card.svg` | Social sharing | Static Mocha surface, `1200 × 630`, current monogram and Fira typography |
| `ProblemPath.astro` | Company story illustration | Decorative, company-only friction-to-tool motif |
| `/forge/favicon.svg` | Forge project card | Owned by Forge; preserve its geometry and transparency |
| `/etch/logo.svg` | Etch project card | Owned by Etch; preserve its geometry and transparency |

