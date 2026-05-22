# Vermilion & Gold Theme Redesign

## Purpose

Replace the current generic amber/brown palette with a distinctive warm-tone palette inspired by traditional Chinese aesthetics — vermilion lacquer (朱砂) and gold leaf (金箔). The goal is a richer, more memorable visual identity that suits the Chinese geography theme.

## Color Palette

### Core Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0d0b08` | Page background, deepest layer |
| Surface | `#161412` | Map background, elevated surfaces |
| Foreground | `#faf5ee` | Primary text |
| Foreground-muted | `rgba(250,245,238,0.40)` | Secondary text |
| Foreground-dim | `rgba(250,245,238,0.20)` | Tertiary text |
| Primary | `#e2483a` | Accent color — buttons, highlights, progress |
| Primary-light | `#f5c5b8` | Light vermilion for on-dark text |
| Gold | `#f59e0b` | Score numbers, leaderboard highlights |
| Gold-light | `#fbbf24` | Bright gold accents |
| Gold-dim | `rgba(245,158,11,0.20)` | Subtle gold glows |

### Glass Effects

- `glass`: `rgba(255,255,255,0.04)` + blur 20px + border `rgba(255,255,255,0.06)`
- `glass-strong`: `rgba(255,255,255,0.06)` + blur 24px + border `rgba(255,255,255,0.10)`

### Gradients

- **Hero background**: `from-red-900/10 via-transparent to-transparent` → use vermilion tone
- **Text gradient**: `from-white via-gold-light to-white/60` — warm cream to gold
- **Button glow**: `from-red-500/10 via-transparent to-gold/5`

### State Colors

- **Success**: `#22c55e` (green, unchanged — clear semantic meaning)
- **Error/failure**: `#ef4444` (red, matches vermilion family)
- **Map guess pin**: `#e2483a` (was `#f59e0b`)

## Component Changes

### globals.css
- `--color-background`: `#141311` → `#0d0b08`
- `--color-foreground`: `#f5f0e8` → `#faf5ee`
- Leaflet background: `#1c1a17` → `#161412`

### GlassCard (unchanged)
- Already uses neutral `bg-white/5 border-white/10` — no theme-specific colors

### GlassButton
- `primary` variant: `bg-amber-500/20 border-amber-400/30` → `bg-red-500/15 border-red-400/25 text-red-200 hover:bg-red-500/25`
- `ghost` variant: no change needed

### HeroSection
- Pin color: `text-amber-400/60` → `text-red-400/50`
- Background gradient: `from-amber-900/10` → `from-red-900/10`
- Subtitle: `text-amber-300/80` → `text-gold-light/70`
- Title gradient: keep `via-amber-200` → change to `via-red-200`

### StartButton
- Button: `bg-amber-500/20 border-amber-400/30 text-amber-100` → `bg-red-500/15 border-red-400/25 text-red-200`
- Glow: `from-amber-500/10` → `from-red-500/10`

### GameRules
- Icon color: `text-amber-400` → `text-red-400`

### GameHeader
- Score color: `text-amber-300` → `text-gold`

### GameProgress
- Completed dot: `bg-amber-400` → `bg-red-500`
- Current dot: `bg-white/60` (unchanged)

### LocationImage
- Skeleton gradient: `from-amber-900/20 to-amber-900/20` → `from-red-900/15 to-red-900/15`
- Error state: same

### GuessMap
- Guess pin: `#f59e0b` → `#e2483a` with `rgba(226,72,58,0.5)` shadow
- Real location pin: `#22c55e` (unchanged)
- Polyline: `#f59e0b` → `#e2483a`

### GuessConfirmation
- Selected text: `text-amber-300/60` → `text-gold-light/60`
- Button shadow: `shadow-amber-500/20` → `shadow-red-500/15`

### ResultReveal
- Score display: `text-amber-300` → `text-gold`
- City/province: unchanged

### RoundTransition
- Background: `bg-[#141311]` → `bg-[#0d0b08]`

### PercentileDisplay
- Percentage: `text-amber-300` → `text-gold`

### RoundBreakdown
- Score: `text-amber-300` → `text-gold`

### Leaderboard
- Player highlight: `bg-amber-500/10 border-amber-400/20` → `bg-red-500/10 border-red-400/15`
- Player name: `text-amber-200` → `text-red-200`
- Player score: `text-amber-300` → `text-gold`
- Top-3: `text-yellow-400` → `text-gold`

### LoadingSpinner
- Spinner color: `border-t-amber-400` → `border-t-red-400`

### ErrorBoundary
- Any amber references → vermilion/gold

### NotFound page
- Any amber references → vermilion/gold

## Tailwind v4 Notes

The project uses Tailwind v4 with `@theme inline`. CSS variables are defined in `@theme inline {}` block in globals.css. Tailwind's built-in color classes (`amber-*`, `red-*`, `yellow-*`) are available directly.

## Exclusions

- Layout, typography, animations, and component structure remain unchanged
- Game logic, scoring, and data files are not affected
- Map tile source stays the same

## Verification

1. Start dev server — all pages render without visual errors
2. Check home page — vermilion pins, gradient, button
3. Check game flow — progress dots, guess pin, confirmation button, result reveal
4. Check result page — score, leaderboard, percentile
5. Mobile responsive — no layout regression
