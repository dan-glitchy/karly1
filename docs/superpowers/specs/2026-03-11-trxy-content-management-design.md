# TRXY Content Management Tool — Design Spec

## Overview

TRXY is an internal tool for managing a team of content creators and posters across social platforms (Instagram, TikTok, etc.). Creators produce AI-assisted content (images, slideshows, reels). Finished content flows into a queue where posters pick items and publish them. The tool is platform-agnostic — nothing is specific to a single social network.

This phase covers UI/UX only. All data is dummy. No real auth, no AI editor internals, no platform API integrations.

## Roles

Stored in Pinia `useAuthStore`. Sidebar and routes filter based on role.

| Role | Access |
|------|--------|
| `admin` | All pages: Dashboard, Create, Queue, Calendar, Team, Settings |
| `creator` | Dashboard, Create, Queue (read-only), Settings |
| `poster` | Dashboard, Queue, Calendar, Settings |

## Data Model

All dummy data in `src/lib/data.js`. Stores provide filtered getters.

### Post
```js
{ id, title, type: 'image'|'slideshow'|'reel', status: 'draft'|'ready'|'queued'|'posted',
  platforms: ['instagram','tiktok',...], thumbnail, createdBy, createdAt, scheduledFor?,
  assignedTo?: posterId, platform?: string }
```

### TeamMember
```js
{ id, name, avatar, handle, role: 'admin'|'creator'|'poster',
  postsCount, status: 'active'|'inactive' }
```

### Post (extended fields for queue)
Posts with `status: 'ready'|'queued'` gain two additional fields on the same object:
- `assignedTo` — poster ID (null until claimed)
- `platform` — target platform for this posting

There is no separate QueueItem entity. The Queue page is a filtered view of the posts store (`status !== 'draft'`).

## Pinia Stores

- **`useAuthStore`** (`src/stores/auth.js`) — `currentUser: { id, name, avatar, handle, role, displayRole }`, `role` getter, `switchRole(role)` action for demo. `displayRole` is the human-readable label (e.g. "Lead Creator") while `role` is the enum used for access control
- **`usePostStore`** (`src/stores/posts.js`) — posts array, getters filtered by status/type, `claimPost(postId)` action that sets `assignedTo` to current user and status to `'queued'`
- **`useTeamStore`** (`src/stores/team.js`) — team members array

## Sidebar Navigation

| Icon | Label | Path | Roles |
|------|-------|------|-------|
| PhHouse | Dashboard | `/` | all |
| PhPencilLine | Create | `/create` | admin, creator |
| PhTray | Queue | `/queue` | all |
| PhCalendarBlank | Calendar | `/calendar` | admin, poster |
| PhUsersThree | Team | `/team` | admin |
| PhGear | Settings | `/settings` | all |

Menu items include a `roles` array. `App.vue` filters items by `useAuthStore().role` before passing to SidebarNav as props. SidebarNav remains a dumb layout component with no store imports. Structure and styling unchanged.

## Pages

### Dashboard (`/`)
Adapts current dashboard layout.

- **Stat cards:** Total Posts, Queued, Posted This Week, 3D Rose (stays)
- **Post grid:** Replaces asset cards — shows recent posts as cards (thumbnail, title, type badge, status pill)
- **Quick Actions card:** Replaces BalanceCard — "New Post" and "View Queue" buttons on dark bg
- **Activity feed:** Team activity (who created/posted what, with timestamps)

### Create (`/create`)
New page, same max-w container pattern.

- **Header:** Page title + "New Post" button
- **Filter bar:** Image / Slideshow / Reel tabs
- **Grid:** Draft posts as cards (thumbnail, title, type badge, platform icons, date)
- Clicking a card → editor view (stubbed as detail/form for now)

### Queue (`/queue`)
Adapts user-analytics table pattern.

- **Tab bar:** All / Ready / Queued / Posted
- **Table:** Thumbnail, Title, Type, Platform(s), Creator, Status, Scheduled Date
- Posters can claim "Ready" items
- Admins see all; creators see read-only

### Calendar (`/calendar`)
New page, same container.

- Monthly grid view
- Day cells show scheduled post thumbnails as small pills with platform icons
- Click a day to show a tooltip (shadcn-vue Tooltip or Popover) with post details
- No drag-and-drop — just visual schedule

### Team (`/team`)
Adapts TopAssetsTable pattern. Admin-only.

- **Table:** Avatar, Name, Handle, Role badge, Posts Count, Status pill
- "Invite Member" button at top

### Settings (`/settings`)
New page, same container.

- **Profile section:** Name, avatar, handle
- **Connected Platforms:** Instagram, TikTok toggles with status
- **Role Switcher:** Dev/demo tool to toggle admin/creator/poster (updates store, re-renders sidebar + routes)

## File Changes

### Keep as-is
- All `src/components/ui/*`, `ThreeRoseViewer.vue`, `style.css`, `src/lib/utils.js`

### Modify
- `src/App.vue` — import `useAuthStore`, filter menu items by role before passing to SidebarNav, source user from store
- `src/lib/data.js` — replace all mock data with posts, team members, queue items, new menu items (each item gains a `roles` array)
- `src/components/layout/SidebarNav.vue` — no structural changes, stays prop-driven (filtering happens in App.vue)
- `src/views/dashboard/index.vue` — swap stats, cards, and activity content
- `src/main.js` — new routes with `meta.roles` for guard, add `beforeEach` guard that redirects unauthorized roles to `/`

### New
- `src/stores/auth.js`
- `src/stores/posts.js`
- `src/stores/team.js`
- `src/views/create/index.vue`
- `src/views/queue/index.vue`
- `src/views/calendar/index.vue`
- `src/views/team/index.vue`
- `src/views/settings/index.vue`
- `src/components/PostCard.vue`
- `src/components/StatusBadge.vue` — wraps existing shadcn-vue `Badge` with status-to-color mapping

### Delete
- `src/views/placeholder/index.vue`
- `src/views/user-analytics/index.vue` — replaced by Queue page
- `src/components/AssetCard.vue`
- `src/components/BalanceCard.vue`
- `src/components/TopAssetsTable.vue` — no longer needed

## Design Constraints

- Existing layout patterns, spacing, animations, color system, sidebar style — all preserved
- No TypeScript
- All `<script setup>` SFCs
- Phosphor icons with `weight="duotone"` default
- shadcn-vue (new-york style) for all UI primitives
- Platform-agnostic — no Instagram/TikTok-specific UI, just platform labels/icons
