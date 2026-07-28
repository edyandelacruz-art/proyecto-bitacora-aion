---
name: Organic Intelligence Core
colors:
  surface: '#131316'
  surface-dim: '#131316'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1e'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e5'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e5e1e5'
  inverse-on-surface: '#313033'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#e6c277'
  on-secondary: '#402d00'
  secondary-container: '#5e4504'
  on-secondary-container: '#d7b46b'
  tertiary: '#d0bcff'
  on-tertiary: '#3c0091'
  tertiary-container: '#7645e0'
  on-tertiary-container: '#ece1ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#ffdf9f'
  secondary-fixed-dim: '#e6c277'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5b4302'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#131316'
  on-background: '#e5e1e5'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  title-sm:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style

The design system is centered around the concept of **Organic Intelligence**—a synthesis of high-end luxury, biological fluidity, and advanced technological security. It targets a sophisticated audience that values precision, privacy, and aesthetic excellence.

The visual style is a blend of **Glassmorphism** and **Minimalism**. It utilizes deep, ink-like blacks paired with bioluminescent violet glows and metallic gold accents. The experience should feel like navigating a high-end physical interface: tactile yet ethereal, silent, and premium. We avoid rigid, boxy layouts in favor of "floating" surfaces and soft, contextual bubbles that feel as though they are suspended in a deep digital void.

**Key Principles:**
- **Fluidity:** Motion and shapes should feel natural and biological, not mechanical.
- **Luminance:** Light is used sparingly as a functional tool to guide the eye.
- **Negative Space:** Generous breathing room reinforces the premium, uncluttered nature of the core.

## Colors

The palette is designed for deep-immersion dark mode. The **Deep Black (#070709)** serves as the infinite canvas, while subsequent layers of violet-tinted greys build depth through subtle tonal shifts rather than harsh lines.

**Usage Guidelines:**
- **Violets:** Use as the primary functional color for actions, progress, and focus states.
- **Gold:** Reserved strictly for high-value status indicators, premium tier features, or micro-accents (e.g., a 1px border on a primary action or a small notification dot).
- **Glass Effects:** Use `soft border` with backdrop blurs to create the "Organic Intelligence" feel on elevated surfaces.

## Typography

This design system uses a pairing of **Hanken Grotesk** for structural clarity in headings and **Manrope** for technical yet approachable body text.

**Hierarchy Strategy:**
- **Display Levels:** Utilize tight letter spacing and a bold weight to create a "command center" authority.
- **Body Text:** Increased line height (1.6) is essential to maintain readability against the deep dark background and prevent "halation" (the glowing effect of white text on black).
- **Labels:** Use uppercase tracking sparingly for category headers or metadata to provide a technical, "Core" readout feel.

## Layout & Spacing

The layout philosophy rejects rigid grids in favor of **Contextual Floating Layouts**. Elements are grouped into "bubbles" of information that float within the negative space.

**Breakpoints & Reflow:**
- **Desktop (1440px+):** 12-column fluid grid with wide margins (64px+) to emphasize luxury and space.
- **Tablet (768px - 1024px):** 8-column grid; surfaces transition from floating bubbles to edge-to-edge containers with 24px internal padding.
- **Mobile (Under 768px):** 4-column grid. The full logo is swapped for the compact isotype. Content stacks vertically with a focus on thumb-reachable "sliding surfaces" from the bottom of the screen.

**Spacing Rhythm:**
Use a 4px baseline. Components should generally favor `lg` (40px) padding for external containers to maintain the high-end feel.

## Elevation & Depth

Hierarchy is established through **Tonal Stacking** and **Luminous Depth** rather than traditional drop shadows.

1.  **Level 0 (Background):** #070709. The void.
2.  **Level 1 (Navigation/Sidebar):** #0D0B12. Minimal separation.
3.  **Level 2 (Active Surface):** #111017. Features a subtle `soft border` (1px lavender at 12% opacity).
4.  **Level 3 (Modals/Floating Bubbles):** #1D1728. Enhanced with a **Violet Glow** (`box-shadow: 0 20px 40px rgba(124, 58, 237, 0.08)`).

**Glassmorphism:** Use `backdrop-filter: blur(12px)` on all Level 3 surfaces to simulate a physical lens effect, allowing the background colors to bleed through softly.

## Shapes

The shape language is **Organic and Refined**. We utilize a default `0.5rem (8px)` radius for standard UI elements like inputs and buttons to keep them feeling modern and precise.

For larger layout containers and "contextual bubbles," use `rounded-xl (1.5rem / 24px)` to emphasize the fluid, organic intelligence theme. This high-radius look distinguishes the system from corporate, sharp-edged competitors.

## Components

### Buttons
- **Primary Action:** Solid `Primary Violet` with white text. On hover, a subtle `Gold Light` 1px inner border appears.
- **Secondary Action:** Ghost style with `Soft Border`. Text is `Lavender`.
- **Micro-accents:** Use a 2px gold underline or dot for active states in navigation.

### Input Fields
- Background: `Surface-Secondary`.
- Border: `Hard Border` (#2B2338), transitioning to `Luminous Violet` on focus.
- Typography: `Body-md`.

### Cards & Bubbles
- Avoid heavy container backgrounds. Prefer a soft `0.5px` stroke of `Soft Border` and a very faint violet radial gradient (10% opacity) in the top-left corner of the card to simulate light hitting a surface.

### Chips & Tags
- Pill-shaped (fully rounded). 
- Background: `rgba(124, 58, 237, 0.1)`. 
- Border: `rgba(124, 58, 237, 0.2)`.
- Text: `Lavender`.

### Logo Integration
- **Full Logo:** Used in top-left navigation on desktop and on landing/splash screens.
- **Isotype (Shield/DNA):** Used for mobile headers, browser favicons, and as a watermark in the bottom-right of deep-dive data views.
