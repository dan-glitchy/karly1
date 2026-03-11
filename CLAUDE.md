# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
cd trxy-frontend
npm run dev      # Start dev server (Vite)
npm run build    # Production build
npm run preview  # Preview production build
```

No test runner or linter is configured.

## Architecture

- **Framework**: Vue 3 with `<script setup>` SFCs, JavaScript (no TypeScript)
- **Build**: Vite 7 with `@vitejs/plugin-vue` and `@tailwindcss/vite`
- **Styling**: Tailwind CSS v4 (using `@import "tailwindcss"` syntax, not a tailwind.config). Custom theme tokens defined in `src/style.css` (`--color-*`, `--shadow-*`, `--font-sans`)
- **State**: Pinia (stores go in `src/stores/`)
- **Routing**: Vue Router with `createWebHistory`. Routes defined inline in `src/main.js`
- **UI Components**: shadcn-vue (new-york style, zinc base color) with reka-ui primitives. Config in `components.json`
- **Icons**: @phosphor-icons/vue (use `weight="duotone"` for default style, `weight="fill"` for active/selected states). Import as `Ph*` components (e.g. `PhHouse`, `PhGear`)
- **Tables**: @tanstack/vue-table

## Path Alias

`@` maps to `./src` (configured in `vite.config.js`). Use `@/components`, `@/lib/utils`, etc.

## Component Organization

```
src/components/
  layout/                    # Structural/layout components
    SidebarNav.vue           #   App shell, headers, footers, navigation chrome
  ui/                        # Generic, reusable UI primitives
    filter-button/           #   Custom primitives follow shadcn-vue pattern:
      FilterButton.vue       #     PascalCase .vue file
      index.js               #     Barrel export
    tab-bar/
      TabBar.vue
      index.js
    button/                  #   shadcn-vue generated primitives
      Button.vue
      index.js
    ...
  AssetCard.vue              # Domain-specific components (used across views)
  BalanceCard.vue
  TopAssetsTable.vue
```

**Rules for placement:**

- **`layout/`** — Components that define page structure (sidebar, header, footer). Imported in `App.vue` or route layouts. One-per-app instances.
- **`ui/<name>/`** — Generic, reusable primitives with no domain knowledge. Prop-driven, no data imports. Follow shadcn-vue convention: kebab-case directory, PascalCase file, barrel `index.js` export. Import via `@/components/ui/<name>`.
- **`components/*.vue`** (root) — Domain-specific components that compose UI primitives. Prop-driven, may understand app domain concepts (assets, creators, balances). Used across multiple views.
- **`views/<feature>/`** — Page-level components. May import data, manage local state, and wire props into child components. One `index.vue` per feature.

**When to create a component:**

- Reused in 2+ places → extract it
- Generic with no domain knowledge → `ui/`
- Defines page structure → `layout/`
- Domain-specific but reusable → root `components/`
- Page-specific, single-use → keep inline in the view

## Key Conventions

- All components are prop-driven; data flows from views or `App.vue` via `src/lib/data.js`
- UI primitives use barrel `index.js` exports; import as `{ Component } from '@/components/ui/<name>'`
- Layout components import directly: `import SidebarNav from '@/components/layout/SidebarNav.vue'`
- Domain components import directly: `import AssetCard from '@/components/AssetCard.vue'`
- The `cn()` utility from `@/lib/utils` merges Tailwind classes (clsx + tailwind-merge)
- Font: Inter, loaded via Google Fonts in `index.html`
- Static data lives in `src/lib/data.js`

## Current State

Dashboard view is built with sidebar navigation, asset card grid, activity tabs, balance card, and top assets table. Single route at `/`.
