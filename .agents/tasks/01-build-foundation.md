---
id: 01
sprint: oneshoot-backend
branch: feat/01-foundation
depends_on: []
estimated_effort: ~3h (avec /apex)
---

# Spec 01 — Fondation back-office portfolio (schema + shell `/studio` + Utopia + TipTap)

> Première brique de la OneShoot « Atomic Tech's » — voir `.agents/brief/BRIEF-atomic-techs.md`.
> **Mono-tenant** : contenu global, **aucun `organizationId`/`userId`**. Le câblage Prisma 7 (driver adapter) + les tables de base (`user`/`session`/`account`/`verification`/`subscription`/`Feedback`) sont **déjà en place** (migration `init`). Ici on ajoute les **modèles métier portfolio**, le **shell admin `/studio`**, la **typo fluide Utopia** et l'**éditeur TipTap minimal**.
>
> **Prérequis** : la branche `chore/prisma-7-driver-adapter` doit être **mergée dans `develop`** avant de partir (sinon, brancher depuis elle).

## Modèle de données (source de vérité : brief §8)

Ajouter au schema Prisma — tous **mono-tenant**, avec `deletedAt` (soft-delete), timestamps, slugs uniques :

- **Project** : `title`, `slug`, `longDescription` (**String / textarea**, pas TipTap), `imageUrl?`, `liveUrl?`, `githubUrl?`, `featured`, `order` + relation `stacks` via **ProjectStack**.
- **ProjectStack** : jointure Project ↔ StackItem, `@@unique([projectId, stackItemId])`.
- **StackItem** : `name`, `iconSvg`, `validatedAt` (→ ancienneté calculée), `order`.
- **CareerEvent** : `jobTitle`, `companyName`, `companyLogo?`, `startMonth`, `startYear`, `endMonth?`, `endYear?`, `description` (Json TipTap).
- **PersonProfile** (singleton) : `bioHome` (Json), `bioWork` (Json) + champs identité.
- **OrgProfile** (singleton) : `logo?`, `name?`, `email?`, `phone?`, `website?`, adresse, réseaux.
- **Contact** : `name`, `email`, `subject` enum(`QUESTIONS_SERVICES`|`DEVIS`|`AUTRE`), `message`.
- **ContentPage** : `slug`, `title`, `body` (Json TipTap).

## Files

### 1) Schema Prisma — `prisma/schema/` (ajouter un fichier de domaine, ex. `portfolio.prisma`)
- Déclarer les 8 modèles ci-dessus (respecter le multi-fichiers existant `schema.prisma` + `better-auth.prisma`).
- `pnpm prisma migrate dev --name portfolio-models` → crée la migration + applique sur Neon.

### 2) Auth owner-only — config better-auth (`src/lib/auth.ts` ou équivalent de la base)
- Restreindre le signup à **`OWNER_EMAIL`** (env) : seul cet email peut créer un compte. Garder le plugin `admin()` **sans** `organization()` (déjà en place).
- Protéger le groupe de routes `/studio` derrière la session owner (redirection sinon).

### 3) Shell admin `/studio` — calqué sur le dashboard existant de la base (`app/app/…`)
- Layout + sidebar (shadcn **Sheet** en mobile) + breadcrumb.
- Pages **vides** : Dashboard, Projets, Stacks, À-propos (le CRUD vient en spec 02).

### 4) Typo fluide Utopia — `app/globals.css`
- Poser les 8 tokens `--step--2 … --step-5` dans `:root` (échelle 360→1240px, 18→20px, ratio 1.2→1.333 ; valeurs exactes dans le brief §B). Raw CSS vars, indépendantes du thème.

### 5) Éditeur TipTap minimal — `src/components/…/rich-text-editor.tsx` + `rich-text-renderer.tsx`
- `StarterKit.configure({ heading: { levels: [3,4,5] }, codeBlock: false })` + `Underline` + `Link.configure({ openOnClick: false })`. **Pas** d'image/table/code. Stockage **JSON**. `<RichTextRenderer>` = rendu sûr (sanitize).

### Divers
- `CHANGELOG.md` — section du jour, préfixe `FEAT:`.
- `.agents/tasks/README.md` — ligne d'index `01`.

## Acceptance criteria

- [ ] Les 8 modèles existent, migration `portfolio-models` appliquée, `prisma generate` OK.
- [ ] `/studio` protégé (redirige si non-owner) ; signup limité à `OWNER_EMAIL`.
- [ ] Shell `/studio` rendu (sidebar + breadcrumb + 4 pages vides), responsive (Sheet mobile).
- [ ] Les 8 tokens Utopia sont posés et exploitables.
- [ ] `<RichTextEditor>` + `<RichTextRenderer>` fonctionnels (sur un champ de test).
- [ ] `pnpm ts && pnpm lint:ci && pnpm test:ci && pnpm build` verts.
- [ ] `CHANGELOG.md` à jour.

## Implementation notes

- Respecter le `CLAUDE.md` du projet (conventions nowts : feature-colocation `_components/`/`_actions/`, `next-safe-action` `authAction`, **TanStack Form**, **sonner**, `dialogManager`).
- Storage images = **Vercel Blob** (la base fournit `src/lib/files/vercel-blob-adapter.ts`). Pas d'UploadThing.
- Lire d'abord 3+ fichiers de la base (dashboard existant, un form existant, le lib auth) avant d'écrire — Non-Negotiable Workflow.

## Out of scope

- CRUD des entités (formulaires, listes, DnD) → **spec 02**.
- Pages publiques + contact + SEO → **spec 03**.
- Emails (Resend), sandbox, rôle `client` → **V2**.
