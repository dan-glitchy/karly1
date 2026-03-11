# Component Structure Design

## Overview

Restructure the NFT marketplace from monolithic views into a componentized architecture. Each page becomes a folder with co-located components. Shared components live in `src/components/`.

## Directory Layout

```
src/
├── components/                    # Global shared components
│   ├── ui/                        # shadcn-vue primitives (unchanged)
│   ├── SidebarNav.vue             # Layout sidebar
│   ├── FilterSelect.vue           # Reusable filter pill
│   └── EthIcon.vue                # ETH diamond SVG
│
├── views/
│   ├── dashboard/
│   │   ├── index.vue              # Layout orchestrator (~50 lines)
│   │   ├── HeroBanner.vue         # Watermark, title, description, filters
│   │   ├── NftCard.vue            # Single NFT card (prop-driven)
│   │   ├── NftCardGrid.vue        # 4-col grid, maps sortedNfts -> NftCard
│   │   ├── CollectionCard.vue     # Gradient header + collection stats
│   │   ├── BalanceCard.vue        # White card, volume, address, CTA button
│   │   ├── ProfileSummary.vue     # Creator avatar + name + revenue
│   │   └── TopCreatorsTable.vue   # Table header + creator rows
│   ├── user-analytics/
│   │   └── index.vue
│   └── PlaceholderView.vue
│
├── stores/                        # Unchanged
│   ├── nftStore.js
│   ├── userStore.js
│   └── themeStore.js
│
├── lib/
│   └── utils.js
├── App.vue
├── main.js
└── style.css
```

## Component Specifications

### Global Components

**FilterSelect.vue** — Reusable filter pill used across pages.
- Props: `label` (string), `modelValue` (string), `options` (string[])
- Emits: `update:modelValue`
- No store access. Purely presentational.

**EthIcon.vue** — ETH diamond SVG used in 5+ places.
- Props: `size` (number, default 12), `class` (string)
- No store access.

### Dashboard Page Components

**dashboard/index.vue** — Layout orchestrator.
- Imports all dashboard components and all 3 stores.
- Passes store data as props to child components.
- Handles the page padding, background, and theme-aware page container.
- ~50 lines.

**HeroBanner.vue** — Hero section with watermark and filters.
- Props: none (accesses nftStore directly for filter v-models).
- Contains watermark text, title, description, 3 FilterSelect instances.
- Always dark (not theme-affected).

**NftCard.vue** — Single NFT card, fully presentational.
- Props: `nft` (object with name, price, rating, shapes, icon, verified).
- No store access. Renders gradient, emoji, icon, name, badge, price, rating.

**NftCardGrid.vue** — Grid wrapper.
- Props: `nfts` (array).
- Renders 4-col grid with negative margin overlap. Iterates NftCard.
- Always dark (not theme-affected).

**CollectionCard.vue** — Profile collection display.
- Props: `profile` (object with collectionName, pieces, rating).
- Accesses themeStore for dark/light styling.

**BalanceCard.vue** — Balance volume card.
- Props: `balance` (object with volume, address).
- Accesses themeStore. Contains "Check Transactions" button.

**ProfileSummary.vue** — Creator info + revenue.
- Props: `profile` (object), `balance` (object).
- Accesses themeStore. Shows avatar, name, role, revenue metric.

**TopCreatorsTable.vue** — Leaderboard table.
- Props: `creators` (array).
- Accesses themeStore. Header with currency FilterSelect, 6-column table.

## Conventions

1. Views are folders with `index.vue` as entry point.
2. View index files are layout-only: imports + grid/flex arrangement.
3. Page-specific components live flat alongside their view index.
4. Global components go in `src/components/` when used by 2+ pages.
5. Props over store access where practical. Theme store is the exception (cross-cutting).
6. PascalCase naming, descriptive names.
7. Router lazy-loads `views/dashboard/index.vue`.

## Router Update

```js
// Change from:
{ path: '/dashboard', component: () => import('./views/DashboardView.vue') }
// To:
{ path: '/dashboard', component: () => import('./views/dashboard/index.vue') }
```

## Migration

The old `DashboardView.vue` gets split into 8 files. No functionality changes, no visual changes. Pure structural refactor.
