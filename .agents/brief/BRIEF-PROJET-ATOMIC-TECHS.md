# 📋 BRIEF PROJET — `Atomic Tech's`

(Inspiré de Portfolio avec Hygraph)

> **Template de cadrage projet — DWDeveloppement**
> Ce document est conçu pour être rempli **avec Cowork** en mode conversationnel.
> Chaque section terminée déclenche la génération de prompts d'implémentation pour Claude Code.
>
> **Usage :** copie ce fichier dans chaque nouveau projet sous `.agents/brief/BRIEF-{atomic-techs}.md`, remplis-le progressivement avec Cowork, puis lance `/apex` avec les prompts générés.
>
> **ATTENTION :** CE SITE EST UN TEST POUR UNE CRÉATION ONESHOOT. LES SPRINTS SONT A LIMITTER ! (section 17)
>
> **Convention :** `- [ ]` = à choisir · `- [x]` = retenu · `**Remarques :**` = précisions libres

---

## 📑 Table des matières

1. [Métadonnées projet](#1-métadonnées-projet)
2. [Vision & objectifs](#2-vision--objectifs)
3. [Stack & architecture](#3-stack--architecture)
4. [Pages & navigation](#4-pages--navigation)
5. [Contenu & sources](#5-contenu--sources)
6. [Design & UI system](#6-design--ui-system)
7. [Authentification & utilisateurs](#7-authentification--utilisateurs)
8. [Base de données & modèles](#8-base-de-données--modèles)
9. [Fonctionnalités métier](#9-fonctionnalités-métier)
10. [Forms & interactions](#10-forms--interactions)
11. [Emails & notifications](#11-emails--notifications)
12. [Storage & médias](#12-storage--médias)
13. [SEO, analytics & accessibilité](#13-seo-analytics--accessibilité)
14. [Tests & qualité](#14-tests--qualité)
15. [Déploiement & infrastructure](#15-déploiement--infrastructure)
16. [Sécurité & conformité](#16-sécurité--conformité)
17. [Roadmap & sprints](#17-roadmap--sprints)
18. [Instructions pour Cowork](#18-instructions-pour-cowork)

---

## 1. Métadonnées projet

### Identité

- **Nom du projet :** `atomic-techs`
- **Nom commercial :** `Atomic Tech's`
- **Client :** `DWDeveloppement (interne)`
- **Type de mandat :**
  - [ ] Site vitrine
  - [X] Site Portfolio/Gallerie
  - [ ] Application SaaS multi-tenant
  - [ ] Outil interne / dashboard
  - [X] Refonte d'un site existant
  - [X] Migration de stack

### Contraintes temporelles

- **Date de démarrage :** `24.06.2026`
- **Date de livraison MVP :** `Aucune`
- **Date de livraison V1 complète :** `Aucune`
- **Date de mise en production :** `Dès que possible`

### Contraintes juridiques

- [X] Conformité **nLPD** (Suisse)
- [X] Conformité **RGPD** (Europe)
- [X] Données hébergées exclusivement en EU
- [ ] Données médicales / sensibles
- [ ] Mineurs concernés (CRPD)

**Remarques :**

> Données hébergées sur Neon EU (voir ci-dessous point 3)

---

## 2. Vision & objectifs

### Audience cible

- [X] Grand public
- [ ] Professionnels B2B
- [ ] Clients existants uniquement
- [ ] Public mixte (visiteurs anonymes + utilisateurs authentifiés)
- [X] Destiné à la sandbox de DWDeveloppement par clients autorisés par l'administrateur

### Objectifs business

- [X] Génération de leads (contact / devis)
- [ ] Vente directe (e-commerce, abonnements)
- [X] Notoriété / image de marque
- [ ] Outil de productivité interne
- [X] Démonstration commerciale (sandbox)

### Indicateurs de succès (KPI)

- [X] Nombre de visiteurs uniques / mois
- [ ] Taux de conversion (formulaire / inscription)
- [X] Temps passé sur le site
- [ ] Performance Lighthouse > 90
- [ ] Position SEO sur mots-clés cibles

**Remarques :**

> On peux ajouter sur le Dashboard en plus des stack, projets... une vision du taux de visite et vues du site

---

## 3. Stack & architecture

### Framework principal

- [ ] **Next.js** (App Router) — projet existant Prisma / Postgres
- [ ] **TanStack Start** — NowStack / Convex
- [X] **Light.ts** — single-tenant simple

### Architecture data

- [X] Mono-app, single-tenant
- [ ] Multi-tenant avec organisations Better Auth
- [ ] Bac à sable / sandbox éphémère
- [ ] Hybride (vitrine publique + sandbox auth)

### Base de données

- [X] **Prisma + PostgreSQL Neon** (EU)
- [ ] **Convex** (vendor lock-in accepté)
- [ ] Pas de DB (statique uniquement)

### Cache & sessions

- [X] Redis (Upstash via Vercel)
- [ ] Cache Convex builtin
- [ ] Pas de cache externe

**Remarques :**

> Redis est la version par défaut, peut être changée en cas de nécéssité

---

## 4. Pages & navigation

### Routes publiques

- [X] `/` — Accueil (contient des données à propos inclues)
- [ ] `/a-propos` — À propos
- [X] `/portfolio` Portfolio
- [X] `/portfolio/[slug]` Page de présentation détaillée d'un projet
- [X] `/legal` (mentions, CGU, politique de confidentialité)
- [X] `/changelog`

- Routes authentifiées

- [X] `/auth/signin`, `/auth/signup` - Page accessible via une url `/` et pas de bouton Sign In sur le frontend
- [X] `/dashboard`
- [X] `/account` (profil utilisateur)
- [X] `/studio` (admin mono-tenant, accès par URL directe)
- [X] `/admin` (super-admin, existe par défaut dans l'application et doit rester)

### Layouts spéciaux

- [X] Modal interception (`@modal`)
- [X] Layout vitrine vs layout dashboard distincts
- [X] Sidebar fixe / collapsible

**Remarques :**

> Menu mobile sous forme de sidebar avec Shadcn Sheet

---

## 5. Contenu & sources

### Type de contenu

- [ ] **MDX** versionné dans `content/` (si présent a supprimer)
- [X] **CMS dynamique** (édition par client dans dashboard)
- [X] **Edition par CMS** pour toutes les pages du site
- [ ] Importé d'un site existant (à scraper)

### Langues

- [X] Français uniquement (`fr` ou `fr_CH`)
- [ ] Multilingue (fr / en / de / it)
- [X] Localisation Suisse (formats date, monnaie, téléphone)

### Volume estimé

- [X] **Petit** : < 10 pages, < 50 projets
- [ ] **Moyen** : 10-30 pages, 50-200 posts
- [ ] **Gros** : > 30 pages, blog actif récurrent

**Remarques :**

> Prévoir une pagination tous les 12 projets (md:cols-2 à 6 lignes de cards, lg:cols-3 à 4 lignes de cards)

---

## 6. Design & UI system

### Composants & UI

- [X] **Shadcn/ui** (base)
- [X] Annimation CSS prioritaire
- [X] **Framer Motion/Magic UI** (composants animés)
- [ ] **Aceternity UI** (effets visuels avancés)
- [ ] **Base UI** (primitifs React Aria)
- [X] Composants custom `@/components/nowts/`

**Remarques :**

> Utiliser les librairies d'annimation avec parcimonie

### Style & ambiance

- [ ] Sobre / corporate
- [ ] Chaleureux / familial
- [X] Tech / moderne
- [ ] Créatif / artistique
- [ ] Médical / institutionnel

### Couleurs

- **Primaire :** `#0055FF`
- **Secondaire :** `#DCDD58`
- **Accent :** `#0087ff`

- [X] Mode sombre supporté (default theme)
- [X] Mode système automatique

- **Ordre :** `LocalStorage → System → dark → light` (= next-themes `defaultTheme="dark"` + `enableSystem`) <!-- ✓ validé 2026-06-24 -->

### Typographie

- **Titres :** `IBM_Plex_Mono`
- **Texte courant :** `Inter`
- **Monospace :** `IBM_Plex_Mono` (réutilisée, pas de mono séparée) <!-- à confirmer -->

### Conventions

- [X] Pas d'emojis dans l'UI (icônes Lucide uniquement)
- [ ] Pas de gradients
- [X] Animations Motion / Framer Motion autorisées
- [X] Suivre `.agents/rules/ui-ux.md`

**Remarques :**

> Librairies d'annimations avec parcimonie

---

## 7. Authentification & utilisateurs

### Provider auth

- [X] **Better Auth** (recommandé NowTS/NowStack, via url admin)
- [ ] Pas d'authentification
- [X] Auth invitation-only (signup public désactivé)

**Copiez ce code dans le terminal pour générer une clé Better Auth :**

```bash
openssl rand -base64 32
# alternative officielle : npx @better-auth/cli@latest secret
```

Puis collez la valeur dans `.env` → `BETTER_AUTH_SECRET="<valeur générée>"`.

### Méthodes de login

- [X] Email + mot de passe
- [ ] Magic link (passwordless)
- [ ] OAuth Google
- [ ] OAuth GitHub
- [ ] OAuth Apple
- [X] OTP par email

### Rôles utilisateur

- [X] `owner` (Propriétaire du site - Achteur du site)
- [ ] `admin` (collaborateur)
- [X] `client` (utilisateur final)
- [ ] `visitor-logged` (commentateur authentifié)
- [ ] `(none)` — visiteur anonyme

### Organisations (multi-tenant)

- [X] Pas d'organisations
- [ ] Une seule org fixe
- [ ] Plusieurs orgs avec switch
- [ ] Permissions par org via Better Auth

**Remarques :** <!-- ✓ validé 2026-06-24 -->

> **V1 = mono-tenant owner-only**, sortie standalone hors sandbox. Le rôle `client` (lecture/démo) est reporté en **V2** (insertion dans la sandbox DWDeveloppement après 3 démos). Auth better-auth plugin `admin()` **sans** `organization()`. Signup public désactivé (accès par URL admin).

---

## 8. Base de données & modèles

### Schémas Prisma (si Prisma)

- [X] `schema.prisma` (commun)
- [ ] `better-auth.prisma` (auto-généré)
- [ ] Schémas métier séparés par domaine

**Après avoir écrit le schema — migrer (crée les tables dans Neon, sans le seed démo) :**

```bash
pnpm prisma migrate dev --skip-seed    # nomme la 1re migration "init"
```

> Neon : nécessite `DATABASE_URL_UNPOOLED` (directe/« unpooled ») en plus de `DATABASE_URL`. Sans migration → `ERROR P2021: table public.user does not exist`. Le `--skip-seed` évite le faux admin + 10 users démo de la base nowts.

### Entités métier (cocher + détailler en remarques)

- [X] User / Account (Owner editor CMS)
- [ ] Organization
- [X] Project / Portfolio
- [ ] BlogPost
- [ ] Comment
- [ ] Like
- [X] Contact (via formulaire sur le footer)
- [ ] DemoRequest (sandbox) — V2
- [ ] Service
- [ ] Subscription / Plan
- [X] **StackItem** (technos / KnowTech, `validatedAt` → ancienneté calculée)
- [X] **CareerEvent** (expériences pro, lié à PersonProfile)
- [X] **PersonProfile** (singleton — bio home + bio WorkExperience, TipTap)
- [X] **OrgProfile** (singleton — infos entreprise / contact)
- [X] **ContentPage** (pages texte : Legal, CGU, Changelog — corps TipTap, éditées en accordion dans À-propos)

### Relations & contraintes

- [X] Soft-delete (deletedAt)
- [X] Timestamps (createdAt, updatedAt)
- [X] Slugs uniques pour URL
- [ ] Index composites sur `(orgId, createdAt)` — N/A (mono-tenant)

**Remarques :** <!-- ✓ validé 2026-06-24 -->

> **Modèle mono-tenant — aucun `organizationId` ni `userId` sur le contenu :**
>
> - **Project** : `title`, `slug`, `longDescription` (**textarea**, pas TipTap), `imageUrl`, `liveUrl`, `githubUrl`, `featured`, `order` (DnD) + relation `stacks` via **ProjectStack**.
> - **ProjectStack** : jointure Projet ↔ StackItem (cases à cocher dans le form projet, depuis les Stacks saisies → zéro faute de frappe).
> - **StackItem** : `name`, `iconSvg`, `validatedAt`, `order` (DnD).
> - **CareerEvent** : `jobTitle`, `companyName`, `companyLogo?`, dates, `description` (TipTap) — **tri chronologique** (récent → ancien), pas de DnD.
> - **PersonProfile** / **OrgProfile** : singletons (`findFirst` / `upsert`).
> - **ContentPage** : `slug`, `title`, `body` (TipTap) — collection éditée en accordion sous À-propos.
> - **Contact** : soumissions du form (objet : Questions services / Demande de devis / Autre) stockées en DB + listées au dashboard (emails en V2).

---

## 9. Fonctionnalités métier

### Lecture

- [X] Listing avec pagination pour `/projects`
- [ ] Recherche fulltext (Postgres natif ou Algolia)
- [ ] Filtres et tri
- [X] Détail / page slug de projet
- [ ] Pages associées (related)

### Écriture (CRUD)

- [X] Création par user authentifié (owner / admin)
- [X] Édition par owner / admin
- [X] Suppression (soft ou hard)
- [X] Validation Zod stricte
- [X] Upload images / fichiers

### Engagement

- [ ] Système de commentaires (modération hybride)
- [ ] Likes / réactions
- [X] Partage social (OG meta)
- [ ] Notifications in-app

### Spécificités

- [ ] Système de réservation
- [ ] Calendrier / disponibilités
- [X] Demandes de devis
- [ ] Sandbox éphémère (reset 24h)

**Remarques :**

> Créer un champ select pour Object mail: Questions services, Demande de devis, Autre

---

## 10. Forms & interactions

### Librairie de forms

- [X] **TanStack Form** + Zod (recommandé)
- [ ] React Hook Form (legacy seulement)

### Dialogs & modals

- [X] Utiliser `dialogManager` (jamais de modal one-off)
- [X] Confirm dialogs
- [X] Input dialogs

### Notifications UI

- [X] **Sonner** (toasts)
- [X] Toast d'erreur API standardisé
- [X] Loading states avec Skeleton

### Validation

- [X] Côté client (Zod)
- [X] Côté serveur (Server Actions + Zod)
- [X] Sanitization HTML (rich text) — TipTap stocké en JSON, rendu sûr

**Remarques :**

---

## 11. Emails & notifications

### Provider

- [X] **Resend** (recommandé)
- [ ] Templates **React Email** dans `emails/`
- [ ] Preview server (`pnpm email`)

### Types d'emails

- [ ] Welcome / signup
- [ ] Reset password
- [ ] Magic link
- [ ] Invitation organisation
- [ ] Notification commentaire
- [ ] Notification demande de contact
- [ ] Notification accès sandbox accordé
- [ ] Confirmation rendez-vous / commande
- [ ] Newsletter

### Notifications autres canaux

- [ ] Webhook Slack
- [ ] Notification push (PWA)
- [ ] SMS (Twilio)

**Remarques :**

> Voir pour les e-mail dans un 2ème temps pas scope MVP.
> **MVP** : les soumissions du form contact sont **stockées en DB (entité Contact)** + listées au dashboard — aucun email envoyé en V1.

---

## 12. Storage & médias

### Provider de stockage

- [X] **Vercel Blob** (Next.js / Prisma stack)
- [ ] **Cloudflare R2** (NowStack)
- [ ] **Cloudinary** (transformations avancées)
- [ ] Pas d'upload utilisateur

### Types de fichiers

- [X] Images (jpg, png, webp, avif)
- [ ] PDF
- [ ] Vidéos
- [ ] Documents bureautiques

### Transformations

- [X] Resize côté serveur (Next/Image)
- [X] Compression automatique
- [ ] Watermarking
- [X] Formats responsive (srcSet)

### Nettoyage

- [X] Script de cleanup des orphelins (`cleanup:blobs`)
- [ ] Quotas par organisation
- [X] Limite taille par fichier

**Remarques :**

> Vercel Blob car projet pour sandbox.

---

## 13. SEO, analytics & accessibilité

### SEO

- [X] Metadata Next.js (`generateMetadata`)
- [X] Sitemap dynamique (`sitemap.tsx`)
- [X] `robots.ts` configuré
- [X] OpenGraph + Twitter Cards
- [X] Données structurées (Schema.org JSON-LD)
- [X] Canonical URLs

### Analytics

- [X] **Vercel Analytics** (privacy-first)
- [X] **Plausible** (RGPD-compliant)
- [ ] **Umami** (self-hosted)
- [ ] Google Analytics (à éviter sauf demande explicite)

### Accessibilité

- [X] Audit Lighthouse > 85 (min 90 de préférence)
- [X] ARIA labels sur composants interactifs
- [X] Navigation clavier complète
- [X] Contraste WCAG AA minimum
- [X] Alt texts obligatoires

**Remarques :**

---

## 14. Tests & qualité

### Tests unitaires

- [X] **Vitest** configuré
- [X] Coverage des helpers métier
- [X] Mocks Prisma / Convex

### Tests E2E

- [X] **Playwright** configuré
- [X] Scénarios critiques (signup, checkout, contact)
- [X] CI headless (`pnpm test:e2e:ci`)

### Linting & qualité

- [X] ESLint strict
- [X] Prettier + Tailwind plugin
- [X] Knip (détection code mort)
- [X] TypeScript strict (`pnpm ts`)

### Vérifications obligatoires avant push

- [X] `pnpm ts` passe
- [X] `pnpm lint:ci` passe
- [X] `pnpm test:ci` passe
- [X] `pnpm build` passe

**Remarques :**

> Pareil avant les merges sur develop. Seule develop est autorisée à être mergée sur main si tout ok.

---

## 15. Déploiement & infrastructure

### Hébergement

- [X] **Vercel Hobby** (100 deploys/jour)
- [ ] **Vercel Pro** (mutualisé multi-clients)
- [ ] **Hetzner VPS** + Docker
- [ ] Self-hosted

### CI/CD

- [X] GitHub Actions
- [X] Branches : `feature` → `develop` (preview) → `main` (prod)
- [X] Deploy preview sur chaque PR
- [X] Production manuelle uniquement

### Variables d'environnement

- [X] `.env-template` documenté
- [X] Secrets dans Vercel / 1Password
- [ ] Variables Convex séparées

### Monitoring

- [X] Logs Vercel
- [X] Sentry (errors)
- [ ] Uptime monitoring (BetterStack)
- [ ] Plan B fallback (site statique de secours)

**Remarques :**

---

## 16. Sécurité & conformité

### Headers HTTP

- [ ] CSP (Content Security Policy)
- [ ] HSTS
- [ ] X-Frame-Options
- [ ] Referrer-Policy

### Rate limiting

- [ ] Sur formulaires publics
- [ ] Sur API authentifiée
- [ ] Sur upload de fichiers

### Anti-spam

- [X] Honeypot sur forms publics
- [X] Cloudflare Turnstile / hCaptcha / Google reCaptcha
- [ ] Validation email (DNS MX check)

### Conformité

- [X] Bannière cookies si analytics
- [ ] Politique de confidentialité rédigée
- [ ] CGU rédigées
- [ ] Export données utilisateur (RGPD)
- [ ] Suppression compte utilisateur

**Remarques :**

> Google reCaptcha, CGU RGPD etc... inutiles pour sandbox.
> **MVP** : honeypot seul. Captcha (Turnstile) en option V2 si spam.

---

## 17. Roadmap & sprints

### MVP (livrable minimum)

- [X] Pages publiques avec contenu depuis DB
- [X] Auth fonctionnelle (si nécessaire)
- [X] Formulaire de contact
- [X] Déploiement production OK

### V1 (premier livrable commercial)

- [X] Toutes les pages prévues
- [X] CRUD admin opérationnel
- [X] Emails contact
- [X] SEO complet
- [X] Tests E2E sur parcours critiques

### V2+ (évolutions)

- [X] Insertion dans la **sandbox DWDeveloppement** (rôle `client`, accès invité) après 3 démos
- [X] **Emails** (Resend) : notification de contact, etc.
- [ ] _Autres selon retours_

### Découpage en sprints


| Sprint            | Objectif                                                                                                                               | Durée estimée |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| **S1 (OneShoot)** | Setup + schema Prisma + auth owner + admin CRUD (Projets / Stacks / À-propos / ContentPage) + pages publiques + form contact + deploy | 1 passe`/apex`  |

**Remarques :**

> Attention ! Tout petit projet alors OneShoot prévu.

---

## 18. Instructions pour Cowork

> **À LIRE AVANT DE REMPLIR :** ce document est un cadrage, pas une exécution. Cowork accompagne le remplissage, pose des questions de clarification, et **ne génère aucun code** depuis ici. La génération se fait dans une seconde étape via Claude Code.

### Workflow recommandé

1. **Phase remplissage (Cowork)**

   - Parcourir les sections dans l'ordre avec Cowork
   - Pour chaque case ambiguë, demander des exemples concrets
   - Compléter les **Remarques** avec les précisions du client / des décisions internes
   - Sauvegarder à `.agents/brief/BRIEF-{date}.md` à chaque section terminée
2. **Phase validation (Cowork)**

   - Une fois le brief complet, demander à Cowork :
     > *« Analyse ce brief et identifie les incohérences, contradictions ou points manquants. »*
     >
   - Itérer jusqu'à un brief cohérent
3. **Phase génération de prompts (Cowork)**

   - Demander à Cowork :
     > *« Sur la base de ce brief, génère les prompts d'implémentation pour Claude Code, regroupés par sprint, en suivant le format `/apex -a -s -i "tâche"`. »*
     >
   - Sauvegarder dans `.agents/prompts/sprint-NN.md`
4. **Phase exécution (Claude Code)**

   - Ouvrir l'onglet Claude Code de Claude Desktop ou le terminal dans le projet
   - Lancer `/apex -a -s -i "{prompt sprint 1}"`
   - Laisser APEX faire Analyze → Plan → Execute → Validate
   - Vérifier les outputs dans `.claude/output/apex/`

### Variables à remplacer en début de projet


| Variable           | Description                      |
| -------------------- | ---------------------------------- |
| `{PROJECT_NAME}`   | Nom interne kebab-case du projet |
| `{nom-kebab-case}` | Pour les chemins de fichiers     |
| `{Nom Public}`     | Nom commercial visible           |
| `{nom client}`     | Raison sociale du client         |

### Ce que Cowork ne doit PAS faire ici

- ❌ Générer du code applicatif (c'est le rôle de Claude Code via `/apex`)
- ❌ Modifier le brief sans confirmation explicite
- ❌ Décocher des cases déjà validées
- ❌ Inventer des décisions non discutées avec l'utilisateur

### Ce que Cowork DOIT faire

- ✅ Poser des questions de clarification section par section
- ✅ Proposer des choix par défaut justifiés selon la stack
- ✅ Marquer les sections complétées avec un commentaire `<!-- ✓ validée le YYYY-MM-DD -->`
- ✅ Détecter les incohérences (ex : Convex coché + Prisma coché)
- ✅ Sauvegarder régulièrement le fichier

---

*Template DWDeveloppement v1.0 — Mai 2026*
*Versionnez ce fichier dans `.agents/skills/project-brief/BRIEF-PROJET.template.md` pour réutilisation sur tous les projets futurs.*
