# Rapport de décision — Migration Prisma 7 (driver adapter)

**Projet :** `atomic-techs` (base [nowts](https://github.com/Melvynx/nowts))
**Branche :** `chore/prisma-7-driver-adapter` (créée depuis `develop`)
**Date :** 2026-06-25
**Statut :** ⏸️ **Bloqué sur 1 décision** — 3 des 4 vérifications passent, le `build` échoue.
**Rien n'est commité ni poussé.** Tout est local, sur la branche dédiée.

---

## 1. TL;DR — Décision attendue

La migration Prisma 7 (passage au *driver adapter* `@prisma/adapter-pg`) est **fonctionnellement terminée** : le schéma est valide, le client est généré, la migration `init` est **appliquée sur Neon**, et `typecheck` / `lint` / `tests` passent.

**Un seul blocage subsiste : `pnpm build` échoue** parce que le client Prisma généré (dans un dossier custom hors `node_modules`) ne peut pas résoudre le paquet `@prisma/client-runtime-utils` à cause de l'isolation stricte de pnpm.

👉 **Il faut choisir parmi 3 stratégies de correction** (détaillées en §7). Recommandation : **Option A (`.npmrc` hoist)**.

---

## 2. Contexte technique

| Élément | Valeur |
|---|---|
| Framework | Next.js **16.0.0** (App Router, Turbopack) |
| Gestionnaire de paquets | **pnpm 10.14.0** (node-linker isolé par défaut, **pas de `.npmrc`**) |
| Base de données | **PostgreSQL sur Neon** |
| ORM | **Prisma 7.8.0** (CLI + `@prisma/client`) |
| Generator | `prisma-client-js`, **output custom → `src/generated/prisma`** (hors `node_modules`, gitignoré) |
| Auth | Better-Auth (schéma multi-fichiers : `schema.prisma` + `better-auth.prisma`) |

**Point structurant :** le client Prisma est généré dans `src/generated/prisma`, **en dehors de `node_modules`**, et ce dossier est **gitignoré** (donc régénéré à chaque `install` via le hook `postinstall`). Ce détail est la cause profonde du problème de build (voir §6).

---

## 3. Objectif de la tâche

`package.json` était déjà en Prisma `^7.4.2`, mais le câblage manquait : le `datasource` du schéma contenait encore `url`/`directUrl`, **interdits en Prisma 7** → erreur **P1012** au `prisma generate` / `migrate`. Prisma 7 impose un *driver adapter*. La tâche : appliquer la recette officielle now.ts (`@prisma/adapter-pg`) puis valider.

Diagnostic P1012 confirmé en début de tâche :

```
Error code: P1012
error: The datasource property `url` is no longer supported in schema files.
       Move connection URLs for Migrate to `prisma.config.ts` and pass either
       `adapter` for a direct database connection ... to the PrismaClient constructor.
error: The datasource property `directUrl` is no longer supported in schema files.
```

---

## 4. Ce qui a été fait (le câblage Prisma 7)

Tous les changements sont **strictement le câblage Prisma** (aucune refacto hors-scope). Generator **inchangé** (`prisma-client-js`).

### 4.1 Dépendances ajoutées

```
+ @prisma/adapter-pg  ^7.8.0   (dependencies)
+ pg                  ^8.22.0  (dependencies)
+ @types/pg           ^8.20.0  (devDependencies)
```

### 4.2 `prisma/schema/schema.prisma` — `datasource` réduit

```diff
 datasource db {
-  provider  = "postgresql"
-  url       = env("DATABASE_URL")
-  directUrl = env("DATABASE_URL_UNPOOLED")
+  provider = "postgresql"
 }
```

### 4.3 `prisma.config.ts` — datasource porté dans la config

```diff
 import "dotenv/config";
 import path from "node:path";
-import type { PrismaConfig } from "prisma";
+import { defineConfig, env } from "prisma/config";

-export default {
+export default defineConfig({
   schema: path.join("prisma"),
-} satisfies PrismaConfig;
+  migrations: { path: "prisma/migrations" },
+  datasource: { url: env("DATABASE_URL") },
+});
```

> Note : `node:path` conservé (au lieu du `path` de la recette) pour rester cohérent avec le fichier existant ; aucune règle ESLint n'impose le préfixe `node:`, donc c'est neutre.

### 4.4 `src/lib/prisma.ts` — instanciation avec l'adapter

```diff
 import { PrismaClient } from "@/generated/prisma";
+import { PrismaPg } from "@prisma/adapter-pg";
+import "dotenv/config";
+
+const connectionString = `${process.env.DATABASE_URL}`;

 const prismaClientSingleton = () => {
-  return new PrismaClient();
+  const adapter = new PrismaPg({ connectionString });
+  return new PrismaClient({ adapter });
 };
```

### 4.5 Génération + migration

- `pnpm prisma generate` → ✅ `Generated Prisma Client (v7.8.0) to ./src/generated/prisma`
- `pnpm prisma migrate dev --name init` → ✅ migration `20260625003734_init` **créée et appliquée sur Neon**, sans seed.

> ⚠️ **Écart vs recette :** la recette demandait `migrate dev --skip-seed`. **Ce flag n'existe plus en Prisma 7** (`! unknown or unexpected option: --skip-seed`). En Prisma 7, le seed ne s'exécute que si `migrations.seed` est défini dans `prisma.config.ts` — ce qui **n'est pas le cas ici** — donc aucun seed démo n'a tourné. L'intention de `--skip-seed` est donc respectée, juste avec la bonne commande.

---

## 5. Résultats des 4 vérifications

| Commande | Résultat |
|---|---|
| `pnpm ts` (typecheck) | ✅ **Pass** (aucune erreur `tsc`) |
| `pnpm lint:ci` (ESLint) | ✅ **Pass** (1 warning pré-existant, sans rapport : import inutilisé `ChartTooltipContent` dans `app/app/_components/subscribers-charts.tsx`) |
| `pnpm test:ci` (Vitest) | ✅ **Pass** — 67 passés / 4 skippés (11 fichiers) |
| `pnpm build` (Next build) | ❌ **ÉCHEC** (voir §6) |

---

## 6. Le blocage : échec du `pnpm build`

### Message d'erreur

```
Module not found: Can't resolve '@prisma/client-runtime-utils'

Import trace:
  ./src/generated/prisma/runtime/client.js
  → ./src/lib/prisma.ts
  → ./src/lib/auth.ts
  → ./app/auth/signin/page.tsx
  (+ Middleware: ./proxy.ts → src/lib/middleware-utils.ts → src/lib/auth.ts → ...)
```

### Cause racine

1. Le generator `prisma-client-js` de **Prisma 7** émet un client qui **`require` statiquement `@prisma/client-runtime-utils`**.
2. Ce paquet **est bien installé** (c'est une dépendance directe de `@prisma/client@7.8.0` : `"@prisma/client-runtime-utils": "7.8.0"`), mais pnpm le garde **imbriqué** sous `@prisma/client` dans le store `.pnpm/`. Il **n'est PAS** symlinké à la racine `node_modules/@prisma/`.
3. Le client est généré dans **`src/generated/prisma`, hors `node_modules`**. Du code situé hors de `node_modules` ne peut résoudre que les paquets **hoistés à la racine** du projet.
4. **Aucun `.npmrc`** n'existe → pnpm reste en isolation stricte → `@prisma/client-runtime-utils` est **introuvable** depuis le dossier généré → Turbopack échoue.

> Pourquoi ce n'était pas visible avant ? Parce que `prisma generate` échouait sur P1012 : un client 7.8.0 « frais » n'avait donc jamais été bundlé. Comme `src/generated` est **gitignoré et régénéré à l'install**, ce build casserait pour **n'importe quel `pnpm install && pnpm build` propre** — ce n'est pas un artefact local.

### Preuves collectées

- `node_modules/@prisma/client-runtime-utils` → **absent** à la racine (présent uniquement dans `.pnpm/@prisma+client-runtime-utils@7.8.0`).
- Le client généré référence **18 modules `@prisma/*`**, **tous absents** de la racine `node_modules/@prisma/` :
  `adapter-d1, client-runtime-utils, config, debug, dmmf, driver-adapter-utils, engines, engines-version, extension-accelerate, fetch-engine, generator, generator-helper, get-platform, instrumentation-contract, internals, prisma-schema-wasm, schema-engine-wasm, schema-files-loader`.
- Le build ne casse **dur** que sur `@prisma/client-runtime-utils` (les 17 autres sont dans des chemins dynamiques/optionnels que le bundler ne résout pas statiquement). **Mais** une correction ciblée sur un seul paquet risque de révéler le suivant (effet *whack-a-mole*) — d'où l'intérêt d'une correction « par classe » (hoist).

---

## 7. Options de correction (LA décision à prendre)

| | Option A — `.npmrc` hoist ⭐ | Option B — dépendance directe | Option C — generator `prisma-client` |
|---|---|---|---|
| **Action** | Créer `.npmrc` avec `public-hoist-pattern[]=@prisma/*` puis `pnpm install` | `pnpm add @prisma/client-runtime-utils@7.8.0` | Remplacer `prisma-client-js` par le nouveau generator `prisma-client` |
| **Effet** | Symlink **tous** les `@prisma/*` à la racine → le client custom les résout tous | Rend résoluble **uniquement** ce paquet | Génère un client ESM **auto-contenu** (zéro `require @prisma/*`) |
| **Périmètre** | 1 fichier nouveau (`.npmrc`) + relock | `package.json` + lock | `schema.prisma` (generator) + adaptation des imports/output |
| **Robustesse** | ✅ Couvre toute la classe de modules manquants | ⚠️ Risque *whack-a-mole* sur les 17 autres | ✅ Élimine la cause racine |
| **Respect de la consigne** « garder `prisma-client-js` » | ✅ Oui | ✅ Oui | ❌ **Non** (change le generator) |
| **Idiomatique** | ✅ Solution pnpm + Prisma custom-output standard | ➖ Acceptable mais fragile | ✅ Voie recommandée par Prisma 7 à terme |
| **Risque** | Faible (config pnpm bien connue) | Moyen (itérations possibles) | Plus élevé (touche plus de surface, hors-scope recette) |

### Détail Option A (recommandée)

Créer `/.npmrc` :

```ini
public-hoist-pattern[]=@prisma/*
```

puis `pnpm install` (re-link), puis re-tester `pnpm build`. Cela hisse **tous** les paquets `@prisma/*` (y compris les dépendances transitives runtime) vers `node_modules/@prisma/`, les rendant résolubles depuis `src/generated/prisma`. Solution surgicale (un seul fichier), idiomatique, et qui traite la **classe entière** du problème — pas seulement le premier module manquant.

### Détail Option B

`pnpm add @prisma/client-runtime-utils@7.8.0` uniquement. Plus chirurgical, pas de `.npmrc`. **Mais** comme 17 autres `@prisma/*` sont aussi non-hoistés, un build ultérieur (ou un autre chemin de code) pourrait révéler un nouveau module manquant, nécessitant de les ajouter un par un.

### Détail Option C

Passer au generator `prisma-client` (nouveau, Prisma 7) : sortie ESM auto-contenue, **sans `require @prisma/*`**, pensée pour les dossiers d'output custom. **Plus propre à long terme**, mais : (1) **déroge à la consigne** « generator inchangé / garder `prisma-client-js` », (2) touche plus de surface (imports, éventuellement format d'output). À réserver si on accepte d'élargir le périmètre.

---

## 8. Points annexes à considérer (pour la décision projet)

1. **Effet de bord déjà présent sur Neon ⚠️** — La migration `init` a **déjà été appliquée** sur la base Neon (`neondb`) : les tables `user`, `session`, `account`, `verification`, `subscription`, `Feedback` existent (sans seed). C'est un **changement réel sur la DB**, effectué à l'étape `migrate dev` (avant le build). Si on veut repartir d'une base vierge, c'est une décision séparée (ex. `migrate reset`).

2. **Neon — pooler vs direct** — `DATABASE_URL` pointe sur l'endpoint **poolé** (`...-pooler...`), `DATABASE_URL_UNPOOLED` sur l'endpoint **direct**. La recette câble le CLI Prisma sur `DATABASE_URL` (poolé). **Bonne nouvelle : la migration `init` est passée sans problème** via le pooler — aucun blocage observé. À garder en tête si de futures migrations échouent (il faudrait alors basculer le CLI sur `DATABASE_URL_UNPOOLED`, sans toucher au `.env` côté agent).

3. **`prisma.ts` importé dans le middleware (edge)** — La trace d'import montre que `src/lib/prisma.ts` est tiré jusque dans le **middleware** (`proxy.ts`, runtime edge) via `auth.ts`. C'est l'architecture **nowts existante** (Better-Auth dans le middleware), **non modifiée** ici. L'erreur actuelle est une **résolution de module** (build), pas une incompatibilité edge runtime — mais c'est un point d'attention pour la suite (Prisma/pg ne tournent pas sur l'edge).

4. **`@types/pg`** — Ajouté en devDependency conformément à la recette, même si l'API `new PrismaPg({ connectionString })` n'en a pas strictement besoin pour typer. Sans impact.

---

## 9. Questions ouvertes pour Cowork

1. **Quelle option de correction du build** retient-on ? (A / B / C — recommandation : **A**.)
2. **Élargit-on le périmètre** au-delà du « câblage Prisma » si on choisit C (changement de generator) ?
3. **Faut-il committer la migration `init`** telle quelle, sachant qu'elle est **déjà appliquée sur Neon** ? Ou repartir d'une base vierge (`migrate reset`) avant de figer ?
4. **Acceptable d'ajouter un `.npmrc`** au repo (Option A) comme dépendance d'infrastructure assumée du setup pnpm + Prisma custom-output ?

---

## 10. Annexes

### 10.1 État git (rien de commité)

```
 M package.json
 M pnpm-lock.yaml
 M prisma.config.ts
 M prisma/schema/schema.prisma
 M src/lib/prisma.ts
?? prisma/migrations/        (20260625003734_init/migration.sql — non suivi)
```

### 10.2 Versions installées

```
prisma (CLI)          7.8.0
@prisma/client        7.8.0
@prisma/adapter-pg    7.8.0
pg                    8.22.0
@types/pg             8.20.0
```

### 10.3 Migration `20260625003734_init/migration.sql` (résumé)

6 tables créées : `user`, `session`, `account`, `verification`, `subscription`, `Feedback`.
Index uniques : `user.email`, `session.token`, `subscription.referenceId`.
Clés étrangères : `session→user` (CASCADE), `account→user` (CASCADE), `subscription→user` (CASCADE), `Feedback→user` (SET NULL).

### 10.4 Commandes de vérification (à rejouer après correction)

```bash
pnpm ts          # typecheck   ✅
pnpm lint:ci     # eslint       ✅
pnpm test:ci     # vitest       ✅
pnpm build       # next build   ❌ → à revérifier après le fix
```

### 10.5 Plan « commit » (Étape 4, NON exécuté — en attente)

Une fois les 4 vérifs au vert, commit local uniquement (pas de merge `develop`, pas de push) :

```
chore(prisma): complete Prisma 7 driver-adapter migration (@prisma/adapter-pg)
```
