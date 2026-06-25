---
id: 02
sprint: oneshoot-backend
branch: feat/02-admin-crud
depends_on: [01]
estimated_effort: ~4h (avec /apex)
---

# Spec 02 — CRUD du back-office `/studio`

> Deuxième brique de la OneShoot « Atomic Tech's ». La spec 01 a posé les 8 modèles, le shell `/studio` (pages vides Projets / Stacks / À-propos), l'éditeur TipTap (`richTextExtensions` dans `src/components/nowts/rich-text-shared.ts`) et la typo Utopia. Ici on **remplit les 3 pages** avec le CRUD complet.
>
> **Conventions (voir `CLAUDE.md`)** : mutations via `authAction` (next-safe-action) + Zod serveur ; forms **TanStack Form** + Zod client ; toasts **sonner** ; dialogs via `dialogManager` (confirm/input) ; skeletons de loading ; **soft-delete** (lecture filtre `deletedAt: null`, suppression = set `deletedAt`). Uploads images → **Vercel Blob** (`src/lib/files/vercel-blob-adapter.ts`).

## Files (par entité, sous `app/studio/`)

### 1) Projets — `app/studio/projects/`
- Liste : `_components/projects-list.tsx` (+ skeleton), tri par `order`, badge `featured`.
- Form create/edit : `_components/project-form.tsx` — `title`, `slug` (auto depuis `title`, éditable), `longDescription` (**textarea**, pas TipTap), `imageUrl` (**upload Vercel Blob**), `liveUrl`, `githubUrl`, `featured` (Switch), `order`.
- **Technos** : multi-select en **cases à cocher** listant les `StackItem` existants → écrit la jointure `ProjectStack` (aucune saisie libre). 
- Réordonnancement **DnD** (`@dnd-kit`) sur `order` → action `reorderProjects(ids[])`.
- Actions : `_actions/project.actions.ts` (create / update / softDelete / reorder), `authAction` + Zod.

### 2) Stacks — `app/studio/stacks/`
- Liste + CRUD. Champs `name`, `iconSvg` (textarea SVG), `validatedAt` (date).
- Afficher l'**ancienneté calculée** depuis `validatedAt` (`dayjs` est dispo dans la base).
- DnD sur `order`.

### 3) À-propos — `app/studio/about/` (page unique à accordions)
- **PersonProfile** (singleton, `findFirst` / `upsert`) : `fullName`, `headline`, `email`, `phone`, `location`, `avatarUrl` (upload), `bioHome` (**TipTap** via `<RichTextEditor>`), `bioWork` (**TipTap**).
- **Expériences** (`CareerEvent`) : CRUD, `description` (**TipTap**). **Tri chronologique** (`endYear`/`startYear` desc), `endMonth`/`endYear` null = poste en cours. **PAS de DnD**.
- **OrgProfile** (singleton) : infos entreprise + `socials` (Json).
- Accordion **« Pages »** (`ContentPage`) : liste (slug + title) + corps **TipTap**. Pour Legal / CGU / Changelog.

### Divers
- `CHANGELOG.md` — `FEAT:`.
- `.agents/tasks/README.md` — index `02`.

## Acceptance criteria

- [ ] Projets : create / edit / softDelete OK ; slug auto ; upload image Blob ; technos en cases à cocher → `ProjectStack` ; DnD réordonne et persiste `order`.
- [ ] Stacks : CRUD OK ; ancienneté affichée ; DnD OK.
- [ ] À-propos : Person/Org singletons éditables (upsert) ; `CareerEvent` CRUD trié chronologiquement ; accordion `ContentPage` CRUD.
- [ ] Tous les champs riches passent par `<RichTextEditor>` (stockage JSON via `richTextExtensions` de la spec 01 — ne pas re-déclarer les extensions).
- [ ] Toutes les mutations = `authAction` + Zod ; lectures filtrent `deletedAt: null` ; toasts sonner ; confirmations `dialogManager`.
- [ ] `pnpm ts && pnpm lint:ci && pnpm test:ci && pnpm build` verts.
- [ ] `CHANGELOG.md` à jour.

## Implementation notes

- Lire d'abord un CRUD existant de la base (`app/admin/users/` ou `app/admin/feedback/`) pour calquer le pattern liste / form / actions + `dialogManager`. **Non-Negotiable Workflow** (3+ fichiers).
- **Singletons** (Person/Org) : pas de page « liste » — un seul formulaire qui `upsert` la ligne unique.
- **DnD** : Projets + Stacks uniquement (jamais les expériences).
- Réutiliser le composant `<RichTextEditor>` / `richTextExtensions` de la spec 01.

## Out of scope

- Rendu **public** de ce contenu (`/`, `/portfolio`, `/legal`…) → **spec 03**.
- Form contact public + SEO + thème → **spec 03**.
- Emails (Resend), sandbox, rôle `client` → **V2**.
