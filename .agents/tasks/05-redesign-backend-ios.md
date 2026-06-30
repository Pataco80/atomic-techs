---
id: 05
sprint: backend-redesign
branch: feat/backend-ios-redesign
depends_on: [01, 02, 03]
estimated_effort: ~5-6h (avec /apex)
---
# Spec — Refonte du back-office `/studio` en style iOS

> Le `/studio` (specs 01-02) fonctionne : CRUD complet (about, projects, stacks, users, dashboard). Ici on **ne touche qu'à la présentation** : on lui donne une esthétique **iOS / « Réglages »** (listes groupées en inset, surfaces neutres, profondeur douce). **Aucune logique métier ne change.**
>
> **Aide design (optionnelle)** : si le skill `design:design-system` / `design:design-handoff` est dispo, l'utiliser pour cadrer les tokens/composants. Sinon, la direction ci-dessous est auto-suffisante et exécutable telle quelle.

---

> # ⚠️ PÉRIMÈTRE — NON-NÉGOCIABLE
>
> **VISUEL / UX UNIQUEMENT.** Interdit de modifier : modèles Prisma, server actions, schémas Zod, queries `src/query/*`, routes, auth/`getRequiredAdmin`, la logique TanStack Form (validation, submit, mutations), le DnD `@dnd-kit`, TipTap. On **reskin** les composants, on ne réécrit pas leur comportement.
>
> **BACKEND UNIQUEMENT** : `app/studio/**` (et `app/admin/**` s'il partage les mêmes primitives). **Le site PUBLIC reste INTACT** (`app/(public)/**`, `src/features/<domaines publics>`, hero/navbar/cards/footer gardent l'esthétique portfolio/Hygraph — surtout **ne pas** y appliquer le style iOS).
>
> **Light + dark** : les deux thèmes doivent être propres (iOS a les deux). Tokens theme-aware.

---

> # ⚠️ DIRECTION VISUELLE iOS — le système à implémenter
>
> Référence mentale : l'app **Réglages iOS** (listes groupées inset) + cartes du Centre de contrôle.
>
> **1. Surfaces (nouveaux tokens, theme-aware, dans `app/globals.css`)**
>
> - `--ios-grouped-bg` (fond de page) — light ≈ `oklch(0.965 0.003 260)` (#F2F2F7) · dark ≈ `oklch(0.12 0 0)` (quasi noir).
> - `--ios-card` (cartes/lignes) — light = blanc · dark ≈ `oklch(0.19 0.004 260)` (#1C1C1E).
> - `--ios-separator` (filet hairline) — light ≈ `oklch(0.85 0 0 / 0.5)` · dark ≈ `oklch(1 0 0 / 0.12)`.
> - Hiérarchie de texte : `--ios-label` (foreground), `--ios-secondary-label` (~60%), `--ios-tertiary-label` (~30%).
> - **Teinte (tint)** : réutiliser le bleu existant (`--primary`/`--accent`) comme couleur d'accent iOS.
>
> **2. Formes & rythme**
>
> - Cartes groupées : `rounded-xl`, ombre **très** douce (`shadow-sm` discret), pas de bordure dure (juste les hairlines internes).
> - Boutons : `rounded-xl` (ou `rounded-full` pour les pills/segmented).
> - Lignes de liste : hauteur min **44px**, padding confortable (`px-4 py-2.5`), **séparateur en inset** (commence après l'icône/le label, pas pleine largeur).
> - Espacement généreux entre groupes (`gap-8`), conteneur centré max-w-2xl pour les formulaires.
>
> **3. Typo (garder les polices, adapter l'échelle iOS)**
>
> - Large title 30-34 / bold (titres de page) · headline 17 / semibold · body 17 · subhead 15 · footnote 13.
> - **En-tête de groupe** : 13px, UPPERCASE, `--ios-secondary-label`, `tracking-wide`. **Pied de groupe** : 13px secondary (texte d'aide).
>
> **4. Composants iOS à créer** (`src/components/ios/`)
>
> - `IconTile` — conteneur d'icône carré arrondi (`size-7 rounded-md`) à fond teinté coloré, façon SF Symbols dans Réglages. **Le glyphe est rendu par le composant `Icon` existant** (`@/components/shared/icons`, blanc, centré) — **pas d'import lucide direct** dans les composants iOS. On **étend `ICONS_REGISTRY`** avec les icônes du back-office.
> - `SectionHeader` / `SectionFooter` — label uppercase + texte d'aide.
> - `GroupedList` — section : header optionnel + carte `--ios-card rounded-xl` qui contient des lignes séparées par des hairlines inset + footer optionnel.
> - `ListRow` — `IconTile?` + label (+ sous-label) à gauche, valeur/`chevron`/contrôle à droite ; variantes `as={Link}`/`button`/statique ; focus-visible ring.
> - `Toggle` — reskin de `ui/switch` en interrupteur iOS (piste arrondie, pastille, vert/teinte à l'état on).
> - `SegmentedControl` — pill avec sélection glissante (pour onglets/filtres).
> - Variantes de bouton iOS : `filled` (teinte pleine), `tinted` (teinte/10 + texte teinte), `plain` (texte teinte) — soit un variant ajouté à `ui/button`, soit un wrapper.

---

## Files

### 1) Tokens & composants iOS (à créer)

- `app/globals.css` : ajouter le bloc de tokens `--ios-*` (light dans `:root`, dark dans `.dark`) + `@theme`/utilities si besoin (`bg-ios-card`, `bg-ios-grouped`, `border-ios-separator`…).
- `src/components/ios/icon-tile.tsx` (enveloppe le `Icon` existant), `section-header.tsx`, `grouped-list.tsx`, `list-row.tsx`, `toggle.tsx`, `segmented-control.tsx`, `index.ts` (ré-exports).
- `src/components/shared/icons.tsx` : **étendre `ICONS_REGISTRY`** avec les icônes du back-office (nav : dashboard, à-propos/user, projets, stacks, users, réglages ; actions : pencil, trash, chevron-right, plus, grip/poignée DnD). Garder le pattern « on n'ajoute que les icônes réellement utilisées ».

### 2) Shell back-office (reskin)

- `app/studio/_navigation/app-navigation.tsx`, `app-sidebar.tsx`, `app-breadcrumb.tsx`, `upgrade-app-card.tsx` : sidebar façon **iPadOS Réglages** (items de nav en lignes avec `IconTile`, groupes, sélection teintée) ; barre de titre **large-title** ; fond `--ios-grouped-bg`.

### 3) Dashboard

- `app/studio/page.tsx` + `_components/information-cards.tsx`, `subscribers-charts.tsx`, `contacts-list.tsx` : cartes de stats groupées iOS ; la liste des contacts en `GroupedList`/`ListRow` (icône, expéditeur, sujet, chevron).

### 4) Formulaires → listes groupées inset (le gros morceau)

- `about/_components/{person-form,org-form,career-form,content-page-form}.tsx`, `projects/_components/project-form.tsx`, `stacks/_components/stack-form.tsx` : **chaque champ = une `ListRow`** (label + champ inline) regroupés en sections `GroupedList` avec `SectionHeader`/`SectionFooter` (aide/erreurs) ; toggles → `Toggle` ; selects/segments → `SegmentedControl` quand pertinent. **Garder** TanStack Form, les `field.*`, la validation et le submit — on ne change que l'habillage des `field.Field`/`field.Content`.
- `_components/image-upload-field.tsx` : ligne d'upload façon iOS (vignette + bouton tinted).

### 5) Listes / sections

- `about/_components/{career-section,content-pages-section}.tsx`, `projects/_components/projects-list.tsx`, `stacks/_components/stacks-list.tsx`, `users/page.tsx` : `GroupedList` de `ListRow` (IconTile + titre + sous-titre `/slug` + actions trailing edit/supprimer) ; conserver le **DnD `@dnd-kit`** (`_components/sortable.tsx`) — juste reskiner la poignée/ligne.

### 6) Divers

- `CHANGELOG.md` (`STYLE:` refonte iOS du back-office). `.agents/tasks/README.md` : ajouter l'entrée au tableau d'index.

## Acceptance criteria

- [ ] **Aucune** modif de schéma/action/query/route/auth/validation : `git diff` ne touche que présentation (markup/classes/tokens) + les nouveaux composants `src/components/ios/`.
- [ ] **Public intact** : `git diff` ne touche pas `app/(public)/**` ni les features publiques ; le rendu public est inchangé (vérif visuelle accueil + /portfolio).
- [ ] Tokens `--ios-*` définis (light + dark) ; composants iOS (`IconTile`, `GroupedList`, `ListRow`, `SectionHeader/Footer`, `Toggle`, `SegmentedControl`) créés et réutilisés.
- [ ] Shell `/studio` (sidebar + barre de titre) en style iOS ; dashboard en cartes/listes groupées.
- [ ] **Tous** les formulaires (person, org, career, content-page, project, stack) en listes groupées inset, validation + submit **toujours fonctionnels** (créer/éditer un projet, un stack, une page de contenu de bout en bout).
- [ ] Listes (projects, stacks, career, content-pages, users, contacts) en `GroupedList`/`ListRow` ; **DnD toujours fonctionnel** (réordonner projets/stacks).
- [ ] Lisible et propre en **light ET dark** ; a11y conservée (labels, focus-visible, hit targets ≥ 44px, contraste AA).
- [ ] `pnpm ts && pnpm lint:ci && pnpm test:ci && pnpm build` verts ; `CHANGELOG.md` à jour.

## Implementation notes

- **Lire avant d'écrire** : `app/studio/layout.tsx`, `_navigation/*`, un formulaire (`project-form.tsx`) et une liste (`projects-list.tsx`) pour calquer la structure, **puis** introduire les composants iOS et reskiner — fichier par fichier, sans casser le câblage TanStack/dnd.
- Réutiliser au maximum les primitives Shadcn (`Switch`, `Button`, `Card`) en les **étendant/reskinant**, plutôt que de tout réécrire. `Toggle` = `ui/switch` restylé ; `SegmentedControl` peut s'appuyer sur `ui/tabs`.
- `ListRow` doit accepter `asChild`/`as={Link}` pour les lignes cliquables (focus-visible obligatoire).
- Garder le thème system-aware existant. Ne pas forcer light : l'iOS doit être beau dans les deux.
- **Pas de push** : apex travaille en local, gate vert → c'est **toi** qui pushes/merges.

## Out of scope

- Le site public (intouchable). Le modèle de données, les actions, le SEO, les emails. Toute nouvelle fonctionnalité métier (on **réhabille**, on n'ajoute pas de feature). Le nettoyage des blobs orphelins (spec dédiée). Les animations avancées (garder sobre + respecter `prefers-reduced-motion` déjà en place).
