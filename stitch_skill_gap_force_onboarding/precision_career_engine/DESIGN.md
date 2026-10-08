---
name: Precision Career Engine
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3d4947'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#0051d5'
  on-tertiary: '#ffffff'
  tertiary-container: '#316bf3'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#003ea8'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 3.5rem
    fontWeight: '800'
    lineHeight: 4rem
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '800'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  mono-metric:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes a high-trust, intelligent, and performance-driven environment tailored for AI-powered career orchestration and workforce upskilling. The design aesthetic balances executive authority with modern product utility: clean structural frames, generous breathing room, ultra-crisp interface elements, and data-dense readability. 

Drawing from modern technical SaaS and precision enterprise product design, it pairs deep navy foundational elements with vivid cyan-teal algorithmic accents. The visual character communicates competence, analytical clarity, and modern velocity, eliminating ambiguity while keeping dense career metrics, skill matching graphs, and parsing pipelines approachable and frictionless.

## Colors

The palette leverages high-contrast pairings to balance technical vibrancy and institutional stability:

- **Primary Accent (`#0D9488`)**: A vibrant, modern teal driving core focal points, high-confidence match scores, critical CTA buttons, and interactive progress states.
- **Secondary Base (`#0F172A`)**: Deep sapphire navy providing structural weight. Used for navigation bars, active heading typography, high-contrast badges, and primary hierarchy anchors.
- **Tertiary Accent (`#2563EB`)**: A clear technical cobalt blue dedicated to data-matching pipelines, analytical diagrams, and linked references.
- **Neutral System (`#64748B` slate base)**: Anchors backgrounds (`#F8FAFC`), elevated surfaces (`#FFFFFF`), borders (`#E2E8F0`), and muted interface typography (`#475569`).

Color semantics must strictly enforce accessible contrast ratios, maintaining at minimum WCAG AA standards (4.5:1 for body copy against cards and canvases).

## Typography

The typography strategy pairs **Plus Jakarta Sans** for structural display and section headings with **Inter** for UI utility, data tables, and dense metrics. 

Plus Jakarta Sans delivers geometric precision with rounded humanist terminals, creating confidence without corporate stiffness. Inter provides maximum legibility across dense resume analysis side-by-sides, skill tags, and form fields. For data visual metrics and compatibility percentages, tabular figures (`font-variant-numeric: tabular-nums`) must be applied globally to eliminate horizontal jitter during real-time AI calculations.

## Layout & Spacing

The layout is built upon an 8pt architectural rhythm, operating inside a 12-column responsive fluid grid on desktop systems (max-width `1440px`), collapsing to a 6-column grid on tablets (`768px - 1023px`), and a 4-column flow on mobile viewports (`<768px`).

- **Workspaces & Shells**: Use a fixed-to-fluid multi-pane model. Persistent 260px secondary-navy sidebars collapse into rail formats on smaller viewports, flanked by dynamic canvas zones.
- **Metric Grids**: Structured across 2, 3, or 4 column subdivisions with uniform gutter tracks (`1.5rem`).
- **Inner Spacing**: Component cards preserve strict internal breathing spaces using `space-lg` (`1.5rem`) for perimeter margins and `space-md` (`1rem`) for segmented child layouts.

## Elevation & Depth

Visual hierarchy uses a refined layered stack over the slate canvas (`#F8FAFC`):

1. **Base Layer (Canvas)**: Non-elevated neutral field (`#F8FAFC`).
2. **Surface Tier (Cards & Panels)**: Crisp, solid white (`#FFFFFF`) framed by a low-contrast 1px border (`#E2E8F0`). Elevated by an ambient double-layer shadow:
   - *Resting Card*: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 4px 12px 0 rgba(15, 23, 42, 0.03)`
   - *Hover / Selected*: `0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 12px 24px -4px rgba(15, 23, 42, 0.08)`
3. **Elevated Floating Layer (Dropdowns, Popovers, Modals)**: Pure white (`#FFFFFF`) with a 1px border (`#CBD5E1`) and high-impact ambient dispersion: `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`.
4. **Interactive States**: Elements react smoothly on elevation shifts with 150ms to 200ms cubic-bezier ease transitions.

## Shapes

The geometric signature uses approachable, calibrated curvatures (`rounded-xl` and `rounded-2xl` scales) to humanize technical content:

- **Cards & Data Modules**: Defined at `1rem` (16px, `rounded-xl`) to soften large dashboard panes.
- **Modals & Hero Modules**: Structured at `1.5rem` (24px, `rounded-2xl`) for prominent focal panels.
- **Controls & Form Elements**: Fixed at `0.5rem` (8px, `rounded-md` / base roundedness) for inputs, select menus, and action buttons to keep lines crisp and interactive.
- **Interactive Chips & Badges**: Fully pill-shaped (`9999px`) to immediately distinguish contextual tags from actionable surface containers.

## Components

### Buttons
- **Primary**: Solid teal background (`#0D9488`), white text (`#FFFFFF`), `0.5rem` border radius, medium label weight. Hover: `#0F766E`. Active: scale `0.99`.
- **Secondary**: Deep navy background (`#0F172A`), white text (`#FFFFFF`). Hover: `#1E293B`.
- **Outline / Ghost**: 1px border (`#CBD5E1`), slate text (`#334155`), transparent fill. Hover: background `#F1F5F9`.

### Interactive Tag Chips (Skills & Filters)
- Pill-shaped (`9999px`), 6px horizontal inner padding, 4px vertical.
- Default: Slate-tinted fill (`#F1F5F9`), slate text (`#475569`), border: 1px solid `#E2E8F0`.
- Verified / Matched: Soft teal wash (`#F0FDFA`), teal text (`#0F766E`), border: 1px solid `#99F6E4`.
- Missing Skill: Amber tint (`#FFFBEB`), text (`#B45309`), border: 1px solid `#FDE68A`.
- Removable: Trailing cross icon (`14px`) with a 150ms hover fade.

### Drag-and-Drop Resume / File Zones
- Surface: Crisp white or ultra-soft slate (`#F8FAFC`).
- Perimeter: 2px dashed border (`#94A3B8`). On dragover: transitions to solid 2px primary teal (`#0D9488`) with ambient teal wash (`#F0FDFA`).
- Typography: Prominent upload icon in deep navy, file format labels in muted `Inter label-sm`.

### Form Controls & Inputs
- Height: 42px baseline. Fill: `#FFFFFF`. Border: 1px solid `#CBD5E1`.
- Focus state: Border transitions to primary teal (`#0D9488`) paired with an accessible 3px outer glow ring (`rgba(13, 148, 136, 0.2)`).
- Error state: Border `#EF4444`, ring `rgba(239, 68, 68, 0.15)`.

### Checkboxes & Radio Controls
- Custom controls styled with `0.25rem` radius (checkbox) or circular (radio), 18px dimensions, 1.5px border (`#94A3B8`).
- Checked: Teal background (`#0D9488`) with white check/radio glyph and zero outline jitter.

### Skill Gap & Match Progress Indicators
- Linear track: 8px tall, neutral track (`#E2E8F0`), fully rounded capsule fill (`#0D9488` for direct matches, `#2563EB` for bridgeable potentials).
- Numerical displays: Paired adjacent to progress bars with `mono-metric` styling.