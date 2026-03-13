# Dark Theme System Design

## Goal
Add a dark theme to TRXY that complements the existing light theme, with great contrast, no visible borders in dark mode, no layout shifts, and a theme picker in Settings.

## Approach
CSS custom property override via `[data-theme="dark"]` on `<html>`. All existing semantic tokens flip values. No `dark:` prefixes in templates. Theme state managed by Pinia + localStorage.

## Dark Color Palette

| Token | Light | Dark |
|---|---|---|
| `bg-primary` | `#FFFFFF` | `#111113` |
| `bg-secondary` | `#F8F9FB` | `#1A1A1E` |
| `bg-tertiary` | `#F3F4F6` | `#242428` |
| `text-primary` | `#1A1D1F` | `#F0F0F2` |
| `text-secondary` | `#6F767E` | `#9A9BA2` |
| `text-muted` | `#9A9FA5` | `#5C5D63` |
| `accent-primary` | `#2A2D30` | `#F0F0F2` |
| `accent-pink` | `#F2A7BB` | `#F2A7BB` (unchanged) |
| `accent-pink-light` | `#FDF2F5` | `#2A1F22` |
| `accent-orange` | `#FF6B35` | `#FF6B35` (unchanged) |
| `border-default` | `#E8E8E8` | `transparent` |
| `border-light` | `#EFEFEF` | `transparent` |
| `success` | `#22C55E` | `#34D16A` |
| `danger` | `#EF4444` | `#F06060` |
| `warning` | `#F59E0B` | `#FBBF24` |
| `shadow-card` | `0 2px 8px rgba(0,0,0,0.04)` | `none` |
| `shadow-card-hover` | `0 8px 24px rgba(242,167,187,0.15)` | `0 0 20px rgba(242,167,187,0.08)` |

## Border Strategy

Borders stay in DOM with `transparent` color in dark mode. Zero layout shift.

- Cards: differentiate via `bg-bg-secondary` against `bg-bg-primary` page
- Sidebar: bg-secondary vs bg-primary provides separation
- Calendar grid: cells differentiate by bg color instead of grid lines
- TabBar: accent-pink underline indicator still visible
- Tables: already borderless (hover rows only)

## bg-white Cleanup

Replace all 12 `bg-white` hardcodes with `bg-bg-primary`:
- `create/index.vue`, `dashboard/index.vue`, `calendar/index.vue`, `settings/index.vue`
- `AvatarPicker.vue`, `App.vue`, `PostCard.vue`, `FilterButton.vue`

## Special Cases

- `body { background }`: use `var(--color-bg-primary)`
- `PostCard.vue` status badge: replace `!bg-white/90` with token-based approach
- `:focus-visible`: outline uses token instead of hardcoded hex
- Scrollbar thumb: pink stays (works on both themes)
- `::selection`: stays (works on both themes)
- shadcn Button: add `--color-primary` / `--color-primary-foreground` to both theme blocks

## Theme Store (`src/stores/theme.js`)

- `theme` ref: `'light' | 'dark'`, default `'light'`
- `init()`: read localStorage, apply `data-theme` attribute to `<html>`
- `toggle()`: flip theme, save localStorage, update attribute
- Called from `main.js` on app creation

## Theme Picker

In Settings page, next to Role Switcher. Two buttons (Light / Dark), same pattern as role switcher using Button variant toggle.

## Transition

`transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease` on `html`.

## Files

- **New:** `src/stores/theme.js`
- **Modified:** `src/style.css`, `src/main.js`, `src/views/settings/index.vue`
- **bg-white fix:** 8 files (one-line change each)
- **PostCard.vue:** fix hardcoded white on status badge
