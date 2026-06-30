## 2026-06-30 - iOS Reskin Polish: Form Sheets, Admin & Layout (Spec 05 follow-up)

### 🎨 **Style & Components**

- **STYLE: CRUD form modals adopt the iOS 26 form-sheet pattern** — the bottom "save" button is gone; each sheet now has a sticky navigation header with a **cancel (X) on the left** and a **validate (✓) on the right** of the centered title, like the iPhone Calendar/Reminders "new" sheets. The checkmark keeps its automatic disabled-while-submitting state (still a `form.SubmitButton`). **Visual/UX only** — no validation, submit, mutation or schema logic changed.
- **Form sheets now render through the Dialog Manager** (`src/features/dialog-manager`) via `dialogManager.custom({ className, children })` instead of a raw `<Dialog>` — the projects/stacks/career/content-page sheets call `dialogManager.custom` and close themselves with `dialogManager.close(id)`. By default the custom dialog renders inside `AlertDialogContent` (no outside-click dismiss → in-progress form data is never lost, and no forced close button so the iOS header is the only chrome) and gets a `sr-only` title for a11y. **No Shadcn primitive in `src/components/ui/` was modified.**
- **Dialog Manager gains a `dismissible` option on `CustomDialogConfig`** — when `true` the custom dialog renders inside a regular `Dialog`/`DialogContent` (closes on outside-click, Escape **and** a visible close button) for surfaces like the command palette; when `false`/omitted it stays on the safe `AlertDialog`. All Dialog Manager surfaces (confirm/input/custom) are now `rounded-xl`.
- **New `IosSheetHeader`** (`src/components/ios/sheet-header.tsx`): sticky, blurred `grid-cols-[1fr_auto_1fr]` form-sheet bar with `leading`/`trailing` slots.
- **STYLE: user menu dropdown restyled iOS** (`src/features/auth/user-dropdown.tsx`) — blurred rounded-2xl card surface with rounded-xl pill rows; and the theme submenu's **Dark/Light icons were swapped** to the correct glyphs (Dark → moon, Light → sun).
- **STYLE: `/admin` back-office reskinned to match the iOS aesthetic** — the admin sidebar is now a `GroupedList` of `ListRow`s with tinted `IconTile`s (Dashboard/Users/Feedback) and active-state highlighting, the shell surfaces use `bg-ios-grouped`, the dashboard is a grouped management list, list tables sit on `bg-ios-card` rounded surfaces, and detail cards use the iOS card surface. Large bold page titles throughout.
- **`LayoutContent` gains a `size` prop** (`sm`/`default`/`lg`/`xl`) mirroring `Layout`, so wide pages can constrain inner content width for a better reading measure.
- **Search command chips**: the `⌘`/shortcut chips in the studio command bar now use white text on a tinted surface (was hard-to-read black).
- **Form-sheet header actions restyled** — the cancel (X) and validate (✓) buttons are now pill-shaped (`rounded-full`), borderless, with the **sidebar trigger's resting fill** (`bg-background` / `dark:bg-input/30` + `shadow-xs`) and icon-tinted on hover: **X turns destructive on hover**, ✓ gets the accent hover. Shared classes `iosSheetCancelButton`/`iosSheetSubmitButton` exported from `@/components/ios`.
- **Primary "add" CTAs** (Nouvelle stack / Nouveau projet / Nouveau poste / Nouvelle page) are now `rounded-xl`.
- **Command palette migrated to the Dialog Manager** — `app/studio/_navigation/app-command.tsx` no longer uses the Shadcn `CommandDialog` primitive; it renders the `cmdk` `Command` through `dialogManager.custom({ dismissible: true })` and toggles/closes via a tracked dialog id (outside-click, Escape and the close button all sync back through the optional `onClose` on `CustomDialogConfig`). The selected row now uses a soft iOS state (`bg-ios-separator/60`, `rounded-xl`) matching the sidebar active row instead of the harsh bright-blue accent. The Shadcn `DialogContent` close (X) is restyled to match the form-sheet cancel button (round, sidebar-trigger resting fill, destructive on hover) purely via `[&>button]` arbitrary-variant classes on the dialog `className` — **no `src/components/ui/` file modified.**
- **Logout dropdown item** (`src/features/auth/user-dropdown-logout.tsx`) now gets the `rounded-xl` pill styling to match the other menu rows.
- **`/admin` aligned with the `/studio` iOS design** — card surfaces that were `rounded-2xl` are now `rounded-xl` like the studio cards (user table, feedback table, user-details card); the user/feedback search filters adopt the studio sidebar search style (`rounded-full bg-background shadow-none`); and the remaining bare `<Card>`s (user sessions, auth providers, feedback detail) now use the iOS surface (`bg-ios-card border-0 shadow-sm`) instead of the default bordered white card. **Visual only.**
- **User dropdown migrated to the shared `Icon` component** (`src/features/auth/user-dropdown.tsx`) — all seven raw `lucide-react` icons (Dashboard, Account Settings, Admin, Theme, Dark, Light, System) now render through `<Icon name="…" />` from the central `ICONS_REGISTRY`, with five new registry entries added (`dashboard`, `settings`, `sun-moon`, `sun-medium`, `monitor`). The menu-row icons also **turn white on hover/highlight** (and the Theme sub-trigger when its submenu is open) instead of staying muted-gray, via `focus:[&_svg]:!text-white data-[state=open]:[&_svg]:!text-white` on the shared `iosMenuItem` class. **Visual only.**
- **iOS menu classes extracted to the shared kit** (`src/components/ios/menu.ts`, re-exported from `@/components/ios`): `iosMenuContent` (blurred rounded-2xl surface), `iosMenuItem` (rounded-xl pill + white-on-hover icon) and `iosMenuItemDestructive` (rounded-xl pill that keeps the destructive-red affordance). The user dropdown now imports these instead of defining them locally.
- **`/admin` dropdown menus reskinned to match the user menu** — the user-row, user-detail and feedback-row action menus (`app/admin/**`) now use the shared `iosMenuContent`/`iosMenuItem` classes: blurred rounded card, rounded-xl pill rows, icons that turn white on hover, while the "Ban User" item keeps its destructive-red icon/text. **Visual only** — no mutation, query or auth logic changed.
- **`/admin` nested tables softened** — the session and auth-provider tables inside the iOS detail cards (`user-sessions.tsx`, `user-providers.tsx`) swapped their heavy `rounded-md border` wrapper for an iOS hairline (`rounded-xl border-ios-separator overflow-hidden`) so they sit cleanly inside the card surface.
- **`/admin` raw icons migrated to the shared `Icon` component** — every `lucide-react` glyph across the admin back-office (search filters, device/provider icons, session trash, action-menu icons, feedback review faces) now renders through `<Icon name="…" />`, with fourteen new registry entries added (`search`, `smartphone`, `tablet`, `trash`, `loader`, `ban`, `crown`, `eye`, `user-check`, `more-horizontal`, `angry`, `frown`, `meh`, `smile-plus`). The only raw lucide reference left in `/admin` is the structural `Icon` field of the shared `NavigationLink` type (never rendered — the sidebar draws its glyphs via `IconTile`). **Visual only.**

### 🧪 **Testing**

- Unit test for `IosSheetHeader` (`__tests__/components/ios/sheet-header.test.tsx`).

## 2026-06-30 - Back-Office iOS "Réglages" Reskin (Spec 05)

### 🎨 **Style & Components**

- **STYLE: `/studio` back-office reskinned in an iOS "Settings" (Réglages) style** — grouped inset lists, neutral surfaces and soft depth across the whole back-office. **Visual/UX only**: no Prisma model, server action, Zod schema, query, route, auth or form/DnD/TipTap logic was touched, and the **public site (`app/(public)/`) keeps its portfolio aesthetic untouched**.
- **New `--ios-*` theme tokens** (`app/globals.css`): grouped background, card, hairline separator and label/secondary/tertiary label colors, theme-aware for **both light and dark**, exposed as `bg-ios-card`, `text-ios-label`, etc.
- **New `src/components/ios/` kit**: `IconTile` (tinted rounded glyph square rendering the shared `Icon`), `SectionHeader`/`SectionFooter`, `GroupedList` (rounded card with inset hairline separators), `ListRow` (static/button/link with focus-visible ring + chevron), `Toggle` (Radix Switch reskin), `SegmentedControl` (iOS pill tabs).
- **iOS button variants** (`filled` / `tinted` / `plain`) added to the shared `Button` cva, and back-office glyphs added to the shared `ICONS_REGISTRY`.
- **Reskinned surfaces**: sidebar/navigation/breadcrumb/upgrade-card shell, dashboard (stat cards + contacts + chart), all CRUD forms (projects, stacks, person, org, career, content-page) as `max-w-2xl` grouped sections with borderless rows, the project `featured` and career "poste actuel" switches as iOS `Toggle`s, the sortable project/stack lists and about career/content-page lists as soft cards, and the **About page Accordion replaced by an iOS `SegmentedControl`** (all panels stay mounted).

### 🧪 **Testing**

- Unit tests for the iOS kit (`__tests__/components/ios/`): `IconTile`, `GroupedList`, `ListRow`, `Toggle`, `SegmentedControl`, `SectionHeader`/`SectionFooter`.

## 2026-06-26 - Public Portfolio Front + Contact + SEO (Spec 03)

### 🚀 **New Features & Components**

- **FEAT: Public portfolio front (feature-organized)** — new `app/(public)/` thin pages compose domain features under `src/features/` (home, projects, projects-details, work-experiences, knowtecks, content-page, seo) and shared primitives under `src/components/shared/` (section, section-title, animated circuit-divider); the base `contact` and `layout` features are extended, not duplicated.
- **Home `/`** (replacing the starter landing): hero + bio (`RichTextRenderer`), **KnowTech** cards (stacks + seniority), **featured projects**, chronological **work experience** (with the parcours bio + socials), animated **CircuitDividers** between sections.
- **Portfolio**: `/portfolio` paginated **12/page** (2/3 cols) and `/portfolio/[slug]` detail; `/legal` + `/changelog` render `ContentPage` bodies by slug.
- **Public contact**: anonymous `<ContactForm>` (name/email/subject/message + **honeypot**) via the **public `action` client** (never `authAction`) → `Contact` row + sonner toast, **zero email**; submissions listed in `/studio`.

### 🔍 **SEO, Theme & Infra**

- `generateMetadata` per page, `app/sitemap.ts`, `app/robots.ts`, OpenGraph/Twitter, **JSON-LD** (Person/CreativeWork), canonical; **dark theme** by default; a11y AA + empty states.
- Disabled `cacheComponents` (Next 16 Dynamic IO corrupted next-safe-action server actions); fixed TipTap links via `@tiptap/extension-link`.

### 🧪 **Testing**

- Unit tests for the pure helpers: `paginate` / `getTotalPages` and the JSON-LD builders.

## 2026-06-25 - Portfolio Back-Office CRUD (Spec 02)

### 🚀 **New Features & Components**

- **FEAT: Full CRUD for the `/studio` back-office** — the **Projets**, **Stacks** and **À-propos** pages are now fully editable by the owner; every write goes through an `authAction` server action with Zod validation and soft-delete (`deletedAt`)
- **Projets (`/studio/projects`)**: create / edit / delete projects with title, auto-generated (editable) slug, long description, **Vercel Blob image upload**, live & GitHub URLs, a `featured` switch and a display `order`; technologies are selected as **checkboxes** from existing stacks (writing the `ProjectStack` join) and the list supports **drag-and-drop reordering** (`@dnd-kit`)
- **Stacks (`/studio/stacks`)**: create / edit / delete technologies with name, inline **SVG icon**, mastery date and drag-and-drop order; the list shows a **computed seniority** badge (`dayjs`)
- **À-propos (`/studio/about`)**: a single accordion page managing the **PersonProfile** singleton (TipTap bios), the **OrgProfile** singleton (+ socials), the **CareerEvent** timeline (TipTap descriptions, chronological order, “poste actuel” open-ended dates, no DnD) and **ContentPage** entries (slug + title + TipTap body)

### 🧪 **Testing**

- Added unit tests for the pure helpers backing the feature: `slugify`, `computeSeniority`, `sortCareerEventsChrono` and `emptyToNull`

## 2026-06-25 - Portfolio Back-Office Foundation (Spec 01)

### 🚀 **New Features & Components**

- **Portfolio Back-Office (`/studio`)**: The owner-only back-office lives at `/studio` — the authenticated dashboard (route renamed from `/app`) now hosts **Projets**, **Stacks**, and **À-propos** pages in the sidebar (Portfolio group) with French breadcrumb labels, on the existing responsive navigation and mobile Sheet drawer
- **Administration shortcut**: the `/studio` sidebar gains an **Administration** group linking to the existing super-admin section (`/admin`, Users, Feedback), so the single owner starts from one place; `/admin` keeps its own shell
- **Rich Text Editor & Renderer**: Minimal TipTap 3 editor (`RichTextEditor`) and a safe read-only renderer (`RichTextRenderer`) sharing one restricted schema; content is stored as JSON
- **Utopia Fluid Type Scale**: Eight viewport-fluid `--step--2`…`--step-5` `clamp()` tokens added to the global theme for consistent responsive typography

### 🗄️ **Database & Domain Model**

- **Portfolio schema (mono-tenant)**: Added `Project`, `ProjectStack`, `StackItem`, `CareerEvent`, `PersonProfile`, `OrgProfile`, `Contact`, and `ContentPage` models in `prisma/schema/portfolio.prisma` with the `ContactSubject` enum; migration `20260625093533_portfolio_models`
- Content is global (no `organizationId`/`userId`); `nanoid(11)` ids and soft-delete (`deletedAt`) on content entities

### 🔐 **Authentication**

- **Owner-only access**: The whole `/studio` section is gated by the existing `getRequiredAdmin()` guard (owner = the single `admin` user). Public sign-up is disabled via Better Auth (`emailAndPassword.disableSignUp: true`)
- **Impersonation redirect fix**: starting an impersonation from `/admin` now lands on `/account` (reachable by any role) instead of the owner-only `/studio`, which would have thrown `unauthorized()` when the impersonated target is a non-admin user

### 🧪 **Testing**

- Added unit tests for the rich-text renderer (stored JSON → DOM, marks and headings) and the Utopia token contract in `app/globals.css`

## 2025-08-23 - Major Platform Updates & Infrastructure Improvements

### 🚀 **New Features & Components**

- **GridBackground Component**: Added customizable grid background component for visual design
- **Admin Feedback System**: Complete feedback management with filters, tables, and detailed views
- **Documentation System**: New docs section with dynamic content management and sidebar navigation
- **Last Used Provider Tracking**: Enhanced sign-in experience with provider preference storage
- **Contact Pages**: Added about and contact pages for improved user engagement

### 📦 **Major Dependency Updates**

- **Next.js**: Updated to 15.5.0 with latest App Router features
- **React**: Updated to 19.1.1 with new React capabilities
- **AI SDK**: Updated to v5 with enhanced AI functionality
- **Radix UI**: Updated all component packages to latest versions
- **Development Tools**: Updated testing dependencies and build tools

### 🛠️ **Infrastructure & Development Workflow**

- **Claude Code Integration**: Enhanced workflow with new agents, commands, and formatting hooks
- **API Standards**: Improved file organization and API documentation structure
- **TypeScript Formatting**: Automated formatting hook for consistent code quality
- **Billing System**: Enhanced organization-level billing with improved error handling
- **Authentication**: Better user experience with provider tracking and improved layouts

## 2025-08-13 - Admin Interface & Organization Billing Migration

### 🛠️ **Complete Admin Interface Overhaul**

- **Built comprehensive admin dashboard from scratch**
  - Created admin navigation with sidebar layout and routing
  - Added admin-only authentication guards with proper role checking
  - Implemented consistent Layout components across all admin pages
- **User management interface**
  - User list with search, pagination, and role-based filtering
  - Individual user detail pages with session management
  - Better Auth integration for user impersonation, banning, and role changes
  - Real-time session tracking with device detection and revocation capabilities
  - Authentication provider display (GitHub, Google, Email/Password)
- **Organization management interface**
  - Organization list with search and pagination
  - Organization detail pages with member management
  - Subscription management with plan changes and billing controls
  - Payment history and Stripe integration for admin billing oversight
- **UI/UX consistency improvements**
  - Replaced Card hover effects with clean, professional styling
  - Made organization/user names clickable instead of separate "View" buttons
  - Added organization logos with avatar fallbacks matching user interface
  - Created reusable AutomaticPagination component for consistent pagination

### 💳 **Stripe Billing Architecture Refactor**

- **Moved billing ownership from User to Organization level**
  - Migrated `stripeCustomerId` from User model to Organization model
  - Updated all webhook handlers and billing actions for organization-based billing
  - Replaced Better-Auth subscription methods with custom server actions
- **Enhanced type safety and removed deprecated patterns**
  - Eliminated all `any` type usage in Stripe webhook handlers
  - Created proper TypeScript interfaces for Stripe webhook events
  - Fixed type compatibility issues across the billing system

### 🎨 **Billing Page UI Improvements**

- Refactored billing page with Card components and Typography
- Added plan limits section with progress bars showing current usage
- Simplified subscription details layout with clean key-value pairs
- Integrated real plan limits from auth-plans configuration

## 2025-07-14 - NOW.TS Claude Migration

### 🔧 **Prisma Configuration Migration**

- Migrate from deprecated `package.json#prisma` property to `prisma.config.ts`

### 🧪 **Playwright CI/CD Improvements**

- **Migrated Playwright workflow from Vercel deployment testing to local CI testing**
  - Changed trigger from `deployment_status` to `pull_request` and `push` events
  - Added PostgreSQL service container for database testing
  - Configured complete local environment with all required secrets
- **Enhanced test reliability and debugging**
  - Fixed delete account test case sensitivity issue (Delete vs delete)
  - Added comprehensive logging throughout all E2E tests
  - Improved button state validation and error handling
  - Added step-by-step emoji logging for better CI debugging
- **Build and deployment fixes**
  - Fixed NotifyNowts API call error handling to prevent build failures
  - Added proper error catching for external API dependencies
  - Updated Prisma migration strategy for CI environments

### 🔧 **Technical Improvements**

- **Environment configuration**
  - Added all required GitHub secrets for CI testing
  - Fixed DATABASE_URL_UNPOOLED configuration for Prisma
  - Properly configured OAuth secrets (renamed GITHUB*\* to OAUTH_GITHUB*\*)
- **Test infrastructure**
  - Enhanced Playwright reporter configuration for CI visibility
  - Improved test isolation and cleanup procedures
  - Added better error context and retry mechanisms
- Rename `RESEND_EMAIL_FROM` to `EMAIL_FROM`

## 2025-06-01

- Add a "orgs-list" page to view the list
- Fix the error of "API Error : No active organization"
- Add a "adapter" system for e-mail and upload of images
- Upgrade library to latest

## 2025-05-03

- Add NOW.TS deployed app tracker (can be removed)
- Add functional seed

## 2025-04-17

- Upgrade Prisma with output directory
- Replace redirect method
- Add resend contact support
- Fix navigation styles
- Fix hydratation error
- Upgrade to next 15.3.0
- Update `getOrg` logic to avoid any bugs

## 2025-04-06

- Replace `AuthJS` by `Better-Auth`
- Upgrade to Tailwind V4
- Use `Better-Auth` organization plugin
- Use `Better-Auth` Stripe plugin
- Upgrade layout and pages
- Use `Better-Auth` permissions
- Use middleware to handle authentification

## 2024-09-12

- Add `NEXT_PUBLIC_EMAIL_CONTACT` env variable
- Add `RESEND_EMAIL_FROM` env variable

## 2024-09-08

- Add `slug` to organizations
- Update URL with `slug` instead of `id`

## 2024-09-01

- Update NOW.TS to version 2 with organizations
