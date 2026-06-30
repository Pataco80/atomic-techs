---
id: 06
sprint: features-featured
branch: feat/featured-stacks-projects
depends_on: [01, 02, 05]
estimated_effort: ~4-5h (avec /apex)
---

# Spec — « Featured » stacks & projets + input stack filtrable

> Trois ajustements **fonctionnels** mal évalués au départ. On s'appuie sur le back-office **déjà refondu en iOS** (spec 05 : `@/components/ios` — `GroupedList`, `ListRow`, `Toggle`, `IconTile`, `SegmentedControl`…). **Réutiliser ces composants**, ne pas en réinventer.
>
> **Rappel mono-tenant** : pas d'`organizationId`/`userId` ; mutations en `authAction` ; soft-delete `deletedAt`.

---

> # ⚠️ DÉCISIONS (verrouillées — ne pas réinterpréter)
>
> 1. **Stacks** : la section « compétences » de la **home** n'affiche **QUE les stacks `featured`**, dans l'ordre **DnD** (`order`). Les non-featured = **réserve backend**, **non rendues** publiquement.
> 2. **Projets** : **/portfolio affiche TOUS les projets** (featured + non-featured), featured en tête (tri `order`) ; la **home** garde sa section **FeaturedProjects** = `featured` only (ordre `order`).
> 3. **DnD** : on ne réordonne que la **card Featured** (ça pilote l'ordre public). Les non-featured ne sont **pas** réordonnés.
> 4. **Input stack** (form projet) : filtre les stacks **existantes** uniquement (pas de création à la volée), validation clic **ou** Entrée, **chips supprimables**, pas de doublon.
> 5. Le **bouton featured** des listes backend **persiste immédiatement** (action serveur), en phase avec le switch du formulaire.

---

## Feature 1 — `featured` sur les stacks

### Modèle + migration
- `prisma/schema/portfolio.prisma` → `StackItem` : ajouter `featured Boolean @default(false)` ; remplacer `@@index([order])` par `@@index([featured, order])`. **Migration Prisma 7** (`pnpm prisma migrate dev`, driver adapter déjà en place — pas de seed).
- `stacks/_actions/stack.schema.ts` : ajouter `featured: z.boolean()` (défaut `false`).
- `stacks/_actions/stack.action.ts` : prendre en compte `featured` en create/update ; **ajouter** un `toggleStackFeaturedAction({ id, featured })` (authAction) ; le **reorder** existant (DnD) reste mais ne s'applique qu'aux featured.

### Backend (form + liste)
- `stacks/_components/stack-form.tsx` : ajouter une ligne `Toggle` « Mis en avant » dans une `GroupedList` « Options » (calquer le `featured` du `project-form` déjà fait).
- `stacks/_components/stacks-list.tsx` : **deux `GroupedList`** — **« Featured Stacks »** (les `featured`, triées `order`, **DnD actif** via `_components/sortable.tsx`) et **« Stacks »** (les non-featured, liste simple, pas de DnD). Chaque `ListRow` porte un **bouton/Toggle featured** (→ `toggleStackFeaturedAction`, optimistic + `router.refresh`) en plus de edit/supprimer.

### Lecture + frontend
- `src/query/portfolio/get-stacks.ts` : **ajouter** `getFeaturedStacks()` (`where { featured: true, deletedAt: null }`, `orderBy { order: 'asc' }`). Garder `getStacks()` (toutes) pour le backend.
- `src/features/knowtecks/know-techs.tsx` + sa source de données : alimenter la section home depuis **`getFeaturedStacks`** (au lieu de toutes les stacks). États vides gérés (aucune featured → section masquée).

## Feature 2 — input stack filtrable (form projet)

- `projects/_components/project-form.tsx` : **remplacer** la grille de checkboxes (section « Technos ») par un **combobox/tag-input** :
  - un `Input` qui **filtre** `stackItems` au fil de la frappe (insensible casse/accents) ;
  - une **liste déroulante** (s'appuyer sur `ui/command` / cmdk si présent) des correspondances **non déjà sélectionnées** ;
  - **clic** sur une option **ou** **Entrée** sur l'option surlignée → ajoute l'id à `stackItemIds` ; flèches ↑/↓ pour naviguer ;
  - stacks sélectionnées rendues en **chips supprimables** (croix) ;
  - pas de doublon ; si zéro résultat → message « Aucune techno » ; lien/indice « créez-en dans l'onglet Stacks » conservé.
- **Ne pas changer** le champ form `stackItemIds` (array), la validation Zod, ni l'action (transaction `deleteMany`+`create` du `ProjectStack` inchangée). Composant isolable : `projects/_components/stack-combobox.tsx`.

## Feature 3 — « featured » des projets (liste backend + tri public)

> Le modèle (`Project.featured` + `order` + `@@index([featured, order])`) et le switch du form **existent déjà**. Il manque la **liste 2-cards + toggle** et le **câblage public**.

- `projects/_actions/project.action.ts` : ajouter `toggleProjectFeaturedAction({ id, featured })` (authAction).
- `projects/_components/projects-list.tsx` : **deux `GroupedList`** — **« Featured Projects »** (featured, triés `order`, **DnD actif**) et **« Projets »** (non-featured, liste simple). `ListRow` avec **bouton featured** (→ `toggleProjectFeaturedAction`) + edit/supprimer.
- `src/query/portfolio/get-projects.ts` :
  - **ajouter** `getFeaturedProjects()` (`where { featured: true, deletedAt: null }`, `orderBy { order: 'asc' }`) → pour la home.
  - **modifier** `getProjects()` (catalogue /portfolio) → `orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }]` (featured en tête, puis le reste).
- Frontend : `src/features/home/featured-projects.tsx` (section home) alimentée par **`getFeaturedProjects`** ; `/portfolio` continue d'utiliser `getProjects` (désormais featured-first). États vides gérés.

## Acceptance criteria

- [ ] Migration `StackItem.featured` appliquée ; `pnpm prisma generate` OK.
- [ ] **Stacks** : form avec toggle featured ; `stacks-list` en 2 cards (Featured DnD + Stacks) ; bouton featured de liste persistant ; home « compétences » = featured-only dans l'ordre DnD ; non-featured invisibles côté public.
- [ ] **Input stack** : filtre live, validation clic/Entrée, navigation clavier, chips supprimables, pas de doublon ; create/édition d'un projet de bout en bout **inchangés** (action/Zod intacts).
- [ ] **Projets** : `projects-list` en 2 cards (Featured DnD + Projets) + bouton featured persistant ; home FeaturedProjects = featured-only ; **/portfolio = tous, featured en tête**.
- [ ] DnD ne réordonne que les **featured** (stacks & projets) ; `order` reflété sur le public.
- [ ] Réutilise les composants iOS existants (`@/components/ios`) ; light + dark propres ; a11y conservée (combobox = `role=combobox`/`listbox`/`aria-activedescendant`, focus-visible, labels).
- [ ] `pnpm ts && pnpm lint:ci && pnpm test:ci && pnpm build` verts ; `CHANGELOG.md` (`FEAT:`) à jour.

## Implementation notes

- **Lire avant d'écrire** : `project-form.tsx` (déjà iOS, modèle pour `stack-form`), `projects-list.tsx` + `_components/sortable.tsx` (DnD existant à scoper aux featured), les actions/queries existantes. Réutiliser, ne pas dupliquer.
- Le **toggle featured de liste** : action serveur dédiée + `router.refresh()` (ou optimistic) ; ne pas ré-ouvrir le form pour ça.
- **a11y combobox** : pattern WCAG combobox (input `aria-expanded`/`aria-controls`, options `role=option` + `aria-selected`, `aria-activedescendant`), Échap ferme, Entrée valide l'option active.
- **Pas de push** : apex en local, gate vert → c'est **toi** qui pushes/merges.

## Out of scope

- Refonte visuelle (faite en spec 05). Le site public au-delà du câblage featured (home compétences + section projets + /portfolio). Création de stack à la volée depuis le combobox (V2 éventuelle). Emails, SEO, blobs orphelins (specs dédiées).
