# Vishwa Poornima Yoga Centre website

Vite + vanilla JS + GSAP ScrollTrigger. `npm install`, then `npm run dev` (dev), `npm run build` (output in `dist/`), `npm run lint`, `npm run preview`.
Source: `index.html`, `src/` (`scroll.js` timelines, `surya.js` pose player, `enquiry.js` form, `data.js` content, `styles.css`). See `ASSET_MANIFEST.md`.
Original page preserved at `legacy/index.original.html`. Browser checks: `python3 scripts/e2e.py` while `npm run preview -- --port 4173` is running (needs `pip install playwright`).

---

# Vishwa Poornima Yoga — Website Asset Package

This package contains the complete visual asset collection and structured design system for the **Vishwa Poornima Yoga** website redesign.

---

## 1. Art Direction & Visual Identity

- **Theme**: Cinematic Indian landscapes, stylized 3D yoga figures, and sacred geometric elements.
- **Atmosphere**: Warm sunrise illumination, morning mist, reflective waters, and serene temple geometry.
- **Color Palette**:
  - **Midnight Blue**: `#0B132B` / `#1C2541` (Night sky, cosmic meditation backdrop)
  - **Deep Forest Green**: `#16302B` / `#0B2512` (Sacred nature, grounding energy)
  - **Ivory & Pearl**: `#FDFBF7` / `#F4EFE6` (Linen attire, negative space, clean typography)
  - **Radiant Gold**: `#D4AF37` / `#FFDF73` (Sunrise rays, prana energy, sacred dividers, accents)
  - **Terracotta & Sun**: `#E27A3F` / `#EFC94C` (Dawn horizon, authentic brand highlights)

---

## 2. Directory Structure (`public/assets/` & `assets/`)

```text
public/assets/
├── brand/
│   ├── logo.svg                   # Crisp vector brand identity
│   ├── logo.png                   # High-res authentic transparent logo (837 × 271)
│   └── logo.webp                  # Compressed WebP logo
├── hero/
│   ├── hero-sunrise.webp          # 2560 × 1440 cinematic Himalayan sunrise background
│   ├── hero-yogi.webp             # Stylised 3D yogi in Padmasana lotus pose
│   ├── hero-yogi-transparent.webp # Transparent background WebP of hero yogi
│   └── hero-yogi-transparent.png  # Transparent background PNG of hero yogi
├── poses/
│   ├── pose-warrior.webp          # Stylised 3D figure in Warrior II pose (Virabhadrasana)
│   ├── pose-tree.webp             # Stylised 3D figure in Tree pose (Vrikshasana)
│   ├── surya-sequence.webp        # Complete 12-step master sequence chart
│   ├── surya-01.webp              # Step 1: Pranamasana (Prayer Pose)
│   ├── surya-02.webp              # Step 2: Hastauttanasana (Raised Arms Pose)
│   ├── surya-03.webp              # Step 3: Hastapadasana (Standing Forward Bend)
│   ├── surya-04.webp              # Step 4: Ashwa Sanchalanasana (Equestrian Pose)
│   ├── surya-05.webp              # Step 5: Dandasana (Plank Pose)
│   ├── surya-06.webp              # Step 6: Ashtanga Namaskara (Eight-Limbed Salute)
│   ├── surya-07.webp              # Step 7: Bhujangasana (Cobra Pose)
│   ├── surya-08.webp              # Step 8: Adho Mukha Svanasana (Downward-Facing Dog)
│   ├── surya-09.webp              # Step 9: Ashwa Sanchalanasana (Low Lunge)
│   ├── surya-10.webp              # Step 10: Hastapadasana (Standing Forward Bend)
│   ├── surya-11.webp              # Step 11: Hastauttanasana (Raised Arms Pose)
│   └── surya-12.webp              # Step 12: Pranamasana (Prayer Pose)
├── programmes/
│   ├── yoga.webp                  # Yoga Classes (Fluid asana on wooden pedestal)
│   ├── surya.webp                 # Surya Namaskar (Solar mandala salute)
│   ├── meditation.webp            # Meditation (Seated Buddha in radiant forest aura)
│   ├── therapy.webp               # Yoga Therapy (Chakra alignment & healing light)
│   ├── training.webp              # Teacher Training (Master & student sacred transmission)
│   └── corporate.webp             # Corporate Yoga (Executive mindfulness in modern suite)
├── environments/
│   ├── meditation-lotus.webp      # Luminous golden lotus on reflective water, dark teal
│   └── cta-mountain.webp          # Panoramic sunrise mountain overlook with meditating figure
├── organisation/
│   ├── instructor-portrait.webp   # Authentic photograph of Dr. Venkatesh T, PhD (Founder)
│   ├── centre-studio.webp         # Authentic studio hall interior & practice mats
│   ├── centre-class.webp          # Authentic classroom practice in session
│   └── workshop.webp              # Authentic Teachers Training certification graduation
├── ui/
│   ├── paper-texture.webp         # Seamless subtle warm ivory paper grain
│   ├── lotus-icon.svg             # Minimalist sacred lotus line art
│   ├── sun-icon.svg               # Minimalist Surya sunburst line art
│   └── gold-divider.svg           # Elegant gold flourish divider
└── models/
    ├── yoga-character.glb         # Valid glTF 2.0 binary 3D model
    └── README.md                  # Three.js / React Three Fiber integration instructions
```

---

## 3. Usage in Web Applications

### Static HTML / Vanilla JS
All paths resolve directly from `assets/`:
```html
<img src="assets/brand/logo.svg" alt="Vishwa Poornima Yoga" />
<img src="assets/hero/hero-sunrise.webp" alt="Sunrise Valley" />
<img src="assets/hero/hero-yogi-transparent.webp" alt="Yogi in Meditation" />
```

### Modern Bundlers (Vite / Next.js / Astro)
Because assets reside in `public/assets/`, they are served from root `/assets/`:
```jsx
<img src="/assets/brand/logo.svg" alt="Vishwa Poornima Yoga" />
<img src="/assets/programmes/yoga.webp" alt="Yoga Classes" />
```
