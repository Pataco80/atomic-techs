---
id: 03
sprint: oneshoot-backend
branch: feat/03-public-contact-seo
depends_on: [01, 02]
estimated_effort: ~4h (avec /apex)
---

# Spec 03 — Front public + contact + SEO + deploy

> Dernière brique de la OneShoot « Atomic Tech's ». Le back-office (specs 01-02) remplit la DB ; ici on **affiche** ce contenu publiquement, on ajoute le **formulaire de contact**, le **SEO**, et on prépare le **déploiement**.
>
> **Réutiliser l'existant** : la couche de lecture `src/query/portfolio/` (`getProjects`, `getProjectBySlug`, `getStacks`, `getAbout…` — déjà filtrées `deletedAt: null` + triées), le renderer `<RichTextRenderer>`, et les tokens Utopia. Thème : **dark par défaut** (next-themes `defaultTheme="dark"` + `enableSystem`).

---

> # ⚠️ ARCHITECTURE — organisation des fichiers (NON-NÉGOCIABLE)
>
> **Ne PAS entasser les composants dans un `app/(public)/_components/` à plat.** La base nowts, dwdeveloppement-v2 ET le portfolio Hygraph organisent TOUS le domaine en **`src/features/<domaine>/`** + **`src/components/`**. Les `app/(public)/*/page.tsx` et `layout.tsx` restent **fins** : ils importent et composent les features, ils n'hébergent **ni `_components/` ni `_actions/`**.
>
> **Règles :**
>
> - **Pages / layout** → `app/(public)/…` (fins).
> - **Composants de domaine réutilisables** → `src/features/<domaine>/`.
> - **Primitives partagées** (section, divider…) → `src/components/shared/` **ou** réutiliser l'existant (`src/components/nowts/divider.tsx`).
> - **ÉTENDRE** les features de base déjà présentes — **ne pas les recréer** : `src/features/contact`, `src/features/legal`, `src/features/layout`, `src/features/navigation` existent déjà.
>
> **Mapping obligatoire (chaque composant → sa cible) :**
>
> | Élément                                            | Cible                                                                |
> | -------------------------------------------------- | -------------------------------------------------------------------- |
> | `home-hero`, `featured-projects`                   | `src/features/home/`                                                 |
> | `project-card` + grille                            | `src/features/projects/`                                             |
> | vue détail projet                                  | `src/features/projects-details/`                                     |
> | `work-experience` (timeline)                       | `src/features/work-experiences/`                                     |
> | `know-techs`, `tech-badge`                         | `src/features/knowtecks/`                                            |
> | `contact-form` + `contact.action`/`contact.schema` | **`src/features/contact/`** (étendre l'existant)                     |
> | `content-page-view` (rendu Legal/CGU/Changelog)    | `src/features/content-page/`                                         |
> | `json-ld`                                          | `src/features/seo/` (ou `src/lib/seo/`)                              |
> | `public-header`, `public-footer`, `social-links`   | réutiliser/étendre `src/features/layout` + `src/features/navigation` |
> | `section`, `section-title`, `circuit-divider`      | `src/components/shared/` (ou réutiliser `nowts/divider`)             |

---

> ## ⚠️ PIÈGE #1 — l'action de contact est PUBLIQUE (jamais `authAction`)
>
> Le formulaire de contact est posté par un **visiteur anonyme, non connecté**. Son action serveur **DOIT** utiliser le client **`action`** de next-safe-action — **JAMAIS `authAction`** (qui exigerait une session et bloquerait 100 % des soumissions). Tout le `/studio` est en `authAction`, **mais le contact public NON**.

---

## Files

### 1) Pages (fines) — `app/(public)/…`

- `app/(public)/layout.tsx` : layout public (header + footer issus de `src/features/layout`/`navigation`, le footer contient le `<ContactForm>` importé de `src/features/contact`).
- `app/(public)/page.tsx` (`/`) : compose `src/features/home` (hero, bio `bioHome` via `<RichTextRenderer>`, cards KnowTech, expériences chronologiques, projets `featured`).
- `app/(public)/portfolio/page.tsx` : grille `src/features/projects`, **pagination 12/page** (`md:grid-cols-2` ×6, `lg:grid-cols-3` ×4), tri `order`.
- `app/(public)/portfolio/[slug]/page.tsx` : `src/features/projects-details` (détail + technos liées).
- `app/(public)/legal/page.tsx` + `app/(public)/changelog/page.tsx` : `src/features/content-page` (rendu `ContentPage` par slug via `<RichTextRenderer>`).

### 2) Features de domaine — `src/features/…` (voir mapping ci-dessus)

- `home/`, `projects/`, `projects-details/`, `work-experiences/`, `knowtecks/`, `content-page/`, `seo/`.
- **`contact/`** (étendre) : `<ContactForm>` (TanStack Form + Zod) — `name`, `email`, `subject` (select enum `QUESTIONS_SERVICES`/`DEVIS`/`AUTRE`), `message`, **honeypot** ; action **publique** (`action`) → `prisma.contact.create` → toast sonner ; **zéro email**.

### 3) SEO — `src/features/seo/` ou `src/lib/seo/`

- `generateMetadata` par page (pour `[slug]` : depuis le projet) ; `app/sitemap.ts` + `app/robots.ts` ; OG + Twitter Cards ; JSON-LD (Person / CreativeWork) ; `canonical`.

### 4) Dashboard contacts

- Lire les `Contact` dans `/studio` (query `getContacts` déjà créée, `deletedAt: null`, `createdAt desc`) — composant liste dans `app/studio/.../_components` (admin = colocation OK).

### 5) Thème + a11y + états vides

- `defaultTheme="dark"` + `enableSystem`. WCAG **AA** (ARIA, clavier, contraste, alt obligatoires), `next/image` responsive. **États vides** gérés (DB sans seed).

### Divers

- `CHANGELOG.md` (`FEAT:`), `.agents/tasks/README.md` (index `03`).

## Acceptance criteria

- [ ] **Architecture** : aucun composant/action de domaine dans `app/(public)/_components` ou `_actions` ; tout est dans `src/features/<domaine>/` ou `src/components/shared/` ; pages `app/(public)/` fines ; les features de base (contact/legal/layout/navigation) sont **étendues**, pas dupliquées.
- [ ] `/`, `/portfolio`, `/portfolio/[slug]`, `/legal`, `/changelog` rendent le contenu DB ; TipTap via `<RichTextRenderer>` ; expériences chronologiques ; KnowTech avec ancienneté.
- [ ] `/portfolio` pagine par 12 (2 col md / 3 col lg).
- [ ] Form contact via le client **`action`** (PUBLIC, **pas `authAction`**) : Zod, select objet, honeypot → `Contact` en DB + toast ; **zéro email**. Soumissions visibles au Dashboard `/studio`.
- [ ] Thème **dark par défaut**, system-aware, persistant.
- [ ] SEO complet (generateMetadata, sitemap.ts, robots.ts, OG/Twitter, JSON-LD, canonical) ; a11y AA ; états vides gérés.
- [ ] `pnpm ts && pnpm lint:ci && pnpm test:ci && pnpm build` verts.
- [ ] `CHANGELOG.md` à jour.

## Implementation notes

- **Non-Negotiable Workflow** : avant d'écrire, lire `src/features/contact`, `src/features/legal`, `src/features/layout`, `src/features/landing` de la base pour calquer la structure d'une feature (sous-dossiers, naming) **et** réutiliser ce qui existe.
- Réutiliser `src/query/portfolio/` (lectures) et `<RichTextRenderer>`. Ne pas ré-écrire.
- Contact = action **publique** (`action`), pas `authAction`.
- **Déploiement** : apex travaille en LOCAL et ne push pas. Gate vert → c'est **toi** qui push → preview Vercel.

## Out of scope

- Emails (Resend) → V2. Captcha (Turnstile) → V2 (honeypot suffit). Sandbox / rôle `client` → V2. Domaine/DNS prod → après preview.
