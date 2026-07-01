---
id: 07
sprint: project-gallery
branch: feat/project-gallery
depends_on: [01, 02, 05]
estimated_effort: ~4-5h (avec /apex)
---

# Spec — Galerie par projet (lignes alternées) + lightbox

> Sur la page **détail projet** (`/portfolio/[slug]`), ajouter une **section galerie** : plusieurs visuels, chacun avec un **titre** + une **description courte**, disposés en **lignes alternées** (image/texte qui s'intervertissent), et cliquables pour ouvrir un **lightbox**. Parité **dwdeveloppement-v2**. On s'appuie sur le back-office **déjà en iOS** (spec 05, `@/components/ios`) et le DnD `@dnd-kit` existant.
>
> **Mono-tenant** : pas d'`organizationId`/`userId` ; mutations `authAction` ; soft-delete `deletedAt`.

---

> # ⚠️ DÉCISIONS (verrouillées)
>
> 1. **Modèle relationnel** `ProjectGalleryItem` (pas de JSON) — cohérent avec `ProjectStack`, permet DnD + soft-delete + nettoyage Blob. Champs : `imageUrl` (Blob), `title` (String, = **label du lightbox**), `shortDescription` (String, texte simple), `order` (Int).
> 2. **Lightbox** = `yet-another-react-lightbox` (+ plugin **Captions** pour afficher le `title`). Le grid `yet-another-react-photo-album` **n'est pas** utilisé pour la mise en page (elle est **custom** en lignes alternées) ; l'installer reste optionnel (parité dwdev) mais non requis.
> 3. **Layout alterné (modulo)** : chaque item façon **HighlightCard** (image + à côté : titre puis short description dessous). `index % 2 === 0` → **image à gauche / texte à droite** (comme Featured Projects) ; impair → **inversé** (texte à gauche / image à droite).
> 4. **Frontend** : la galerie n'affiche que les images du projet courant, triées `order`. Clic image → lightbox ouvert à cet index, slides = toutes les images de la galerie, caption = `title`.

---

## Backend

### Modèle + migration
- `prisma/schema/portfolio.prisma` :
  ```prisma
  model ProjectGalleryItem {
    id               String  @id @default(nanoid(11))
    projectId        String
    imageUrl         String
    title            String
    shortDescription String
    order            Int     @default(0)
    project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    deletedAt DateTime?
    @@index([projectId, order])
    @@index([deletedAt])
  }
  ```
  + sur `Project` : `gallery ProjectGalleryItem[]`. **Migration Prisma 7** (`pnpm prisma migrate dev`, driver adapter en place, pas de seed).

### Schéma + action
- `projects/_actions/project.schema.ts` : ajouter `galleryItems: z.array(z.object({ imageUrl, title, shortDescription }))` (order = index dans le tableau).
- `projects/_actions/project.action.ts` : dans la **même transaction** que les stacks, **synchroniser** la galerie (deleteMany des items du projet + recreate à partir du tableau, avec `order = index`). Réutiliser le pattern `ProjectStack`. **Nettoyage Blob** : supprimer de Vercel Blob les `imageUrl` retirés (cf. spec blobs).

### UI backend (form projet, déjà iOS)
- `projects/_components/project-form.tsx` : nouvelle `GroupedList` **« Galerie »** — liste ordonnable (DnD `sortable.tsx`) de lignes, chacune = **`ImageUploadField`** (vignette) + `Input` **Titre** + `Input`/textarea **Description courte** + bouton **supprimer** ; bouton **« Ajouter une image »**. Champ form `galleryItems` (array) ; `order` = position. États vides gérés (« Aucune image »). Isoler dans `projects/_components/gallery-editor.tsx`.

## Frontend

### Dépendance
- Installer **`yet-another-react-lightbox`** (`pnpm add yet-another-react-lightbox`). Importer sa CSS (`yet-another-react-lightbox/styles.css`) et celle du plugin Captions.

### Lecture
- `src/query/portfolio/get-projects.ts` : `projectInclude` inclut `gallery: { where: { deletedAt: null }, orderBy: { order: 'asc' } }` (donc `getProjectBySlug` renvoie la galerie).

### Composant galerie (client)
- `src/features/projects-details/project-gallery.tsx` (**"use client"**) :
  - props `items: { imageUrl, title, shortDescription }[]`.
  - Rendu : pour chaque item, une **ligne façon HighlightCard** (`flex flex-col gap-6 lg:flex-row lg:gap-12`, **`lg:flex-row-reverse` si `index % 2 !== 0`**) : `<Image>` (next/image, cliquable, `cursor-zoom-in`) d'un côté ; de l'autre, **titre** (`Typography variant="large"`) puis **short description** (`Typography variant="muted"`).
  - **Lightbox** : état `index` (−1 = fermé) ; clic image → `setIndex(i)` ; `<Lightbox open={index >= 0} index={index} close={…} slides={items.map(i => ({ src: i.imageUrl, title: i.title, description: i.shortDescription }))} plugins={[Captions]} />`.
- `src/features/projects-details/project-details.tsx` : intégrer `<ProjectGallery items={project.gallery} />` **après** le bloc image+description existant (dans une `SectionLayout` ou un `CircuitDivider` + section, cohérent avec le reste). Ne rendre la section que si `project.gallery.length > 0`.

## Acceptance criteria

- [ ] Migration `ProjectGalleryItem` appliquée ; `getProjectBySlug` renvoie `gallery` (triée `order`, `deletedAt: null`).
- [ ] Form projet : section « Galerie » — ajout/suppression/**réordonnancement DnD** d'items (image + titre + description courte) ; sauvegarde en transaction (sync comme `ProjectStack`) ; création/édition d'un projet **de bout en bout OK** (stacks + galerie).
- [ ] Détail projet : section galerie en **lignes alternées** (image/texte intervertis via modulo, 1er = image à gauche) ; masquée si vide.
- [ ] **Lightbox** : clic sur une image ouvre `yet-another-react-lightbox` à l'index, navigation entre toutes les images de la galerie, **caption = titre** (plugin Captions).
- [ ] a11y : images `alt` (= titre), déclencheurs au clavier (bouton/rôle), focus géré par le lightbox ; light + dark propres ; `prefers-reduced-motion` respecté.
- [ ] Nettoyage Blob des images retirées (au moins référencé/branché avec la logique existante).
- [ ] `pnpm ts && pnpm lint:ci && pnpm test:ci && pnpm build` verts ; `CHANGELOG.md` (`FEAT:`) à jour.

## Implementation notes

- **Lire avant d'écrire** : `project-form.tsx` (iOS + gestion stacks/transaction), `_components/sortable.tsx` (DnD), `image-upload-field.tsx`, `featured-projects.tsx` (HighlightCard = layout de référence), `project-details.tsx`. Réutiliser, ne pas dupliquer.
- Le lightbox est **client** ; le détail projet reste **serveur** et passe `project.gallery` en prop au composant client `ProjectGallery`.
- Layout alterné : un seul composant de ligne + `flex-row` / `flex-row-reverse` selon la parité de l'index (garder l'ordre DOM titre-avant-description pour le lecteur d'écran).
- **Pas de push** : apex en local, gate vert → c'est **toi** qui pushes/merges.

## Out of scope

- Le grid `yet-another-react-photo-album` (layout mosaïque) — non utilisé ici (layout custom). Édition avancée d'images (crop, ordre par drag dans le lightbox). Vidéos. Le reste du site.
