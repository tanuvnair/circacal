---
name: CircaCal
description: Midnight energy check-in — soft rose-mauve utility on Inter
colors:
  primary: "oklch(0.514 0.222 16.935)"
  primary-dark: "oklch(0.455 0.188 13.697)"
  primary-foreground: "oklch(0.969 0.015 12.422)"
  background: "oklch(1 0 0)"
  background-dark: "oklch(0.145 0.008 326)"
  foreground: "oklch(0.145 0.008 326)"
  foreground-dark: "oklch(0.985 0 0)"
  card: "oklch(1 0 0)"
  card-dark: "oklch(0.212 0.019 322.12)"
  muted: "oklch(0.96 0.003 325.6)"
  muted-dark: "oklch(0.263 0.024 320.12)"
  muted-foreground: "oklch(0.542 0.034 322.5)"
  muted-foreground-dark: "oklch(0.711 0.019 323.02)"
  secondary: "oklch(0.967 0.001 286.375)"
  secondary-dark: "oklch(0.274 0.006 286.033)"
  border: "oklch(0.922 0.005 325.62)"
  border-dark: "oklch(1 0 0 / 10%)"
  destructive: "oklch(0.577 0.245 27.325)"
  destructive-dark: "oklch(0.704 0.191 22.216)"
  ring: "oklch(0.711 0.019 323.02)"
  surplus: "oklch(0.65 0.15 160)"
  maintenance: "oklch(0.55 0.15 250)"
typography:
  display:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter Variable, Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
rounded:
  sm: "0.525rem"
  md: "0.7rem"
  lg: "0.875rem"
  xl: "1.225rem"
  "2xl": "1.575rem"
  "3xl": "1.925rem"
  "4xl": "2.275rem"
  full: "9999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  "2xl": "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.4xl}"
    padding: "0.5rem 0.75rem"
    height: "2.25rem"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "oklch(0.514 0.222 16.935 / 0.8)"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.4xl}"
    padding: "0.5rem 0.75rem"
    height: "2.25rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.4xl}"
    padding: "0.5rem 0.75rem"
    height: "2.25rem"
  input-default:
    backgroundColor: "oklch(0.922 0.005 325.62 / 0.5)"
    textColor: "{colors.foreground}"
    rounded: "{rounded.3xl}"
    padding: "0.25rem 0.75rem"
    height: "2.25rem"
    typography: "{typography.body}"
  card-default:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.4xl}"
    padding: "1.5rem"
  estimate-radio:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "0.75rem 1rem"
---

# Design System: CircaCal

## Overview

**Creative North Star: "The Midnight Check-In"**

CircaCal’s interface is a dark-first personal utility for one honest daily question. Surfaces stay soft and mauve-tinted; the Smolder Rose primary and flame wordmark read as a quiet ember in a midnight room, not a fitness dashboard. Density is calm and task-first: narrow content column, clear hierarchy, minimal chrome.

The system rejects clinical fitness chrome, neon gamification, bright wellness pastels, loud marketing card stacks, purple-gradient AI chrome, and spreadsheet density. Marketing may use a faint radial-masked grid and light glass cards; the authenticated app stays flatter and more operational.

**Key Characteristics:**
- Dark mode is the product default; light mode is a first-class twin of the same mauve/rose tokens
- One type family (Inter Variable) across display through label
- Soft-confident pill geometry (`rounded-4xl` controls, full-round nav)
- Semantic energy triad (surplus / maintenance / deficit) carries meaning alongside brand primary
- Narrow `max-w-3xl` app column; landing centers the same restraint

## Colors

A mauve-rose palette: cool mauve neutrals with a warm Smolder Rose accent and a three-way semantic energy scale.

### Primary
- **Smolder Rose** (`oklch(0.514 0.222 16.935)` light / `oklch(0.455 0.188 13.697)` dark): Brand accent for logo, primary CTAs, and sparse emphasis. Paired with **Rose Mist** foreground text (`oklch(0.969 0.015 12.422)`).

### Secondary
- **Cool Mist** (`oklch(0.967 0.001 286.375)` light / `oklch(0.274 0.006 286.033)` dark): Secondary button fills and quiet chrome — not a competing accent.

### Neutral
- **Midnight Mauve** background dark (`oklch(0.145 0.008 326)`): Default canvas in dark mode.
- **Paper White** background light (`oklch(1 0 0)`): Light-mode canvas.
- **Mauve Ink** foreground light (`oklch(0.145 0.008 326)`): Body text on light surfaces.
- **Soft Snow** foreground dark (`oklch(0.985 0 0)`): Body text on dark surfaces.
- **Quiet Mauve** muted (`oklch(0.96 0.003 325.6)` light / `oklch(0.263 0.024 320.12)` dark): Muted fills, accents, and secondary surfaces.
- **Muted Mauve Text** (`oklch(0.542 0.034 322.5)` light / `oklch(0.711 0.019 323.02)` dark): Supporting copy and captions.
- **Mauve Card** dark (`oklch(0.212 0.019 322.12)`): Elevated card surface in dark mode.
- **Hairline Border** (`oklch(0.922 0.005 325.62)` light / `oklch(1 0 0 / 10%)` dark): Dividers and outlines.

### Semantic (energy estimates)
- **Surplus Green**: Emerald-tinted fills/borders for “ate over maintenance.”
- **Maintenance Blue**: Blue-tinted fills/borders for “around maintenance.”
- **Deficit Rose** (destructive token): Destructive/rose for “under maintenance” — shared with error chrome.

### Named Rules
**The Ember Rarity Rule.** Smolder Rose is brand signal, not wallpaper. Prefer muted neutrals for structure; use primary on CTAs, logo, and sparse highlights.

**The Triad Meaning Rule.** Surplus / maintenance / deficit colors are semantic, not decoration. Do not recolor them for aesthetic variety on the daily picker.

## Typography

**Display Font:** Inter Variable (with Inter / system-ui)
**Body Font:** Inter Variable (same stack)
**Label/Mono Font:** Inter Variable (tabular-nums where dates/timers appear)

**Character:** A single variable sans — practical, modern, and quiet. Hierarchy comes from size and weight, not a display/serif pairing.

### Hierarchy
- **Display** (700, `clamp(2.25rem, 5vw, 3rem)`, tight tracking): Landing hero only.
- **Headline** (600, ~1.5–1.5rem / `text-xl`–`text-2xl`): App page titles (“Today”).
- **Title** (500, `text-base`): Card titles and estimate labels.
- **Body** (400, `text-sm`, pretty wrapping): Supporting sentences and field help. Prefer short lines in the narrow column.
- **Label** (500, `text-sm`): Buttons, nav items, form labels.

### Named Rules
**The One Voice Rule.** Do not introduce a second family for marketing or app chrome. Inter Variable is the system.

## Layout

Content lives in a centered column (`max-w-3xl`) with horizontal padding `1rem` → `1.5rem` and vertical section gaps `1.5rem` → `2rem`. The authenticated shell wraps primary content in a single large card that also holds section nav. Landing uses a centered hero stack plus a three-column feature grid from `sm` up. Touch targets stay generous (`min-h-11` nav on small screens, `min-h-14` estimate radios).

### Named Rules
**The Narrow Column Rule.** App screens stay inside `max-w-3xl`. Do not stretch operational UI to full-bleed dashboards.

## Elevation & Depth

Depth is mostly tonal: background → card → muted fills. Cards add a soft `shadow-md` and a faint ring (`ring-foreground/5`, stronger in dark). Landing marketing cards may use translucent fills and backdrop blur; the app shell does not rely on glass. Focus uses a 3px ring at ~30% ring color — structural, not decorative glow.

### Shadow Vocabulary
- **Card rest** (`shadow-md` + `ring-1 ring-foreground/5`): Default elevated surface.
- **Focus ring** (`ring-3 ring-ring/30`): Keyboard focus on controls.
- **Selected estimate** (`ring-2` in the semantic color): Selection, not elevation.

### Named Rules
**The Tonal First Rule.** Prefer background/card/muted contrast over stacking shadows. Shadows support cards; they do not create floating widget theater.

## Shapes

Base radius token is `0.875rem` (14px), scaled to `sm`–`4xl`. Primary controls and cards lean **pill-soft**: buttons and cards use `rounded-4xl` (~2.275rem); inputs use `rounded-3xl`; estimate radios use `rounded-xl`; app nav uses `rounded-full`. Corners are consistently soft — never sharp admin edges.

### Named Rules
**The Soft Pill Rule.** Interactive chrome defaults to near-pill radii. Sharp rectangles are out of system unless required by a data table cell.

## Components

Soft-confident: pill geometry, calm motion (`transition-all` / color transitions), decisive selected states.

### Buttons
- **Shape:** Near-pill (`rounded-4xl`)
- **Primary:** Smolder Rose fill, Rose Mist text; hover at 80% primary
- **Outline / Ghost / Secondary / Destructive:** Standard shadcn radix-luma variants; destructive is soft tinted fill, not solid alarm red
- **Focus:** Border + `ring-3` ring token
- **Active:** 1px translateY on press (no popup menus)

### Cards / Containers
- **Corner Style:** `rounded-4xl`
- **Background:** `bg-card` with optional translucent/`backdrop-blur` on landing only
- **Shadow Strategy:** Soft rest shadow + faint ring (see Elevation)
- **Internal Padding:** `1.5rem` default (`px-6 py-6`); `sm` size tightens

### Inputs / Fields
- **Style:** Transparent border, `bg-input/50`, `rounded-3xl`, height `2.25rem`
- **Focus:** Ring border + `ring-3 ring-ring/30`
- **Error:** Destructive border and ring

### Navigation
- In-app: four equal text links in a card header grid (2×2 mobile, 1×4 `sm+`), `rounded-full`, active state via bottom hairline (`after:h-0.5 bg-foreground`)
- Marketing header: logo left; theme toggle + ghost Sign In + primary Get Started

### Estimate radios (signature)
- Full-width stacked radio buttons for Surplus / Maintenance / Deficit
- Unselected: semantic-tinted border and wash from `ESTIMATE_CONFIG`
- Selected: stronger border + `ring-2` in the semantic color
- Icon tile in a rounded square beside label + short description

## Do's and Don'ts

### Do:
- **Do** keep dark mode as the default product atmosphere while preserving the light twin.
- **Do** use the surplus / maintenance / deficit triad for daily energy UI exactly as configured.
- **Do** keep primary actions and the CircaCal flame mark in Smolder Rose.
- **Do** prefer the narrow column and one-question hierarchy on the dashboard.

### Don't:
- **Don't** introduce a second display font or serif for “premium” marketing.
- **Don't** turn the app shell into a multi-panel analytics dashboard.
- **Don't** replace estimate semantics with brand-primary coloring.
- **Don't** add neon glows, purple AI gradients, or heavy glass stacks in the authenticated app.
- **Don't** invent calorie, meal, or coaching UI patterns that fight the check-in metaphor.
