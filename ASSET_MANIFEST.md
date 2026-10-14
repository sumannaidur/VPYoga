# Asset manifest

All artwork below was supplied by the client (`images.zip`), processed into web-ready files. No stock photography is used.

| Section | File(s) in `public/assets/` | Source file | Treatment |
|---|---|---|---|
| Hero | `hero/hero-bg.webp`, `hero/hero-yogi.webp` | hero-bg.png, hero-yogi.png | yogi cut out (transparent), sits on a CSS stone |
| A journey within | `journey/journey-bg.webp`, `journey/journey-warrior.webp` | journey-bg.png, journey-warrior.png | warrior cut out (floor and backdrop removed) |
| Programmes | `programmes/programmes-bg.webp`, `programmes/orb-{yoga,surya,meditation,therapy,training,corporate}.webp` | programmes-bg.png, orb-*.png | orb black backgrounds converted to transparency |
| Surya Namaskar | `surya/surya-bg.webp`, `surya/step-01..12.webp`, `surya/thumb-01..12.webp` | surya-bg.png, surya-01..12.png | 12 poses cut out, same 1024px canvas, feet aligned to one floor line |
| Meditation | `meditation/meditation-bg.webp`, `meditation/lotus.webp` | meditation-bg.png, lotus.png | lotus cut out; replaces the old procedural 3D lotus |
| Our centre | `about/centre-bg.webp` (+ real photo `organisation/instructor-portrait.webp`) | centre-bg.png | 2400px wide |
| Final CTA | `cta/cta-bg.webp` | cta-bg.png | 2400px wide; corner sparkle watermark removed |

Kept as before: `brand/*` (logo) and `organisation/*` (real photographs of the centre). Removed: all earlier generated images, the placeholder GLB model, the stock-photo loader and credits.

## Known limits
- Cut-outs were made automatically (GrabCut). A few poses (steps 5, 6, 7, 10) keep a faint light patch of floor under the hands; re-export those from the originals if it bothers you.
- Backgrounds are 1376x768 originals, so they are slightly soft on very large screens. Supply 2560px versions to sharpen them.
- Hero figure is seen from behind (as supplied); the mockup shows her from the front.
- Testimonials are omitted: the mockup's faces and quotes are not real, approved testimonials.
- Social icons from the mockup footer are omitted: no profile URLs were supplied.
- The quote attributed to Dr. Venkatesh T and the hero/section wording come from the mockup; confirm before launch (see TODO comments in `index.html`).
