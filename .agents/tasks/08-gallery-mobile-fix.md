---
id: 08
title: Galerie projet — swipe mobile + retrait des flèches (custom components)
sprint: portfolio
branch: fix/project-gallery-design
depends_on: [07]
estimated_effort: S
---

# 08 — Galerie : swipe-only sur mobile, flèches retirées (option custom components)

Sur mobile, la galerie doit se naviguer **au swipe** (déjà natif dans yarl v3) et **sans les boutons ‹ ›**, qui restent sur desktop pour la souris. On profite du passage pour désencombrer l'affichage mobile (padding) et ajouter les gestes de fermeture naturels. **Un seul fichier touché.**

Run : `/apex -a -b -s -t .agents/tasks/08-gallery-mobile-fix.md`

## ⚠️ Guardrails

- **Ne pas toucher** au design desktop du lightbox ni au bloc `.gallery-lightbox` de `app/globals.css` (travail validé de la session précédente).
- **Ne pas ajouter de librairie de swipe** : yarl gère le swipe nativement (`controller.disableSwipeNavigation` défaut = `false`).
- **Ne pas modifier** le layout des rangées alternées ni le backend (`gallery-editor.tsx`, `gallery-sync.ts`).
- `project-gallery.tsx` est déjà `"use client"` — garder.
- Ne pas commiter de `.env`.

## Fichiers

- `src/features/projects-details/project-gallery.tsx` — **modifier** (seul fichier).

## Critères d'acceptation

- [ ] Sur mobile (`< 768px`), les flèches ‹ › **ne s'affichent pas** ; la navigation se fait au **swipe**.
- [ ] Sur desktop (`≥ 768px`), les flèches **restent** (icônes Chevron actuelles, style CC inchangé).
- [ ] Le **padding** du carousel est réduit sur mobile (image non écrasée) et reste à `84px` sur desktop.
- [ ] Le lightbox se ferme au **glissé vers le bas** et au **tap sur le fond**.
- [ ] Avec **une seule image** : aucune flèche (grâce à `finite`).
- [ ] `pnpm ts` et `pnpm lint` verts.

## Notes d'implémentation

Hook `useMedia` (déjà dispo via `react-use`, installé) pour détecter le mobile, puis masquer les boutons via les **render functions** `buttonPrev` / `buttonNext` (retour `null` = pas de bouton) ; `padding` et gestes conditionnés.

```tsx
// import à ajouter
import { useMedia } from "react-use";

// dans le composant, après le useState existant
const isMobile = useMedia("(max-width: 767px)", false); // 2e arg = défaut SSR (desktop)

// <Lightbox … > — props modifiées / ajoutées :
carousel={{ padding: isMobile ? "16px" : "84px", finite: true }}
controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
render={{
  iconPrev: () => <ChevronLeft className="size-6" />,
  iconNext: () => <ChevronRight className="size-6" />,
  iconClose: () => <X className="size-5" />,
  ...(isMobile && {
    buttonPrev: () => null,
    buttonNext: () => null,
  }),
}}
```

Notes :
- `buttonPrev` / `buttonNext` retournant `null` supprime **tout le bouton** (icône incluse). Sur desktop, ces clés ne sont pas passées (spread conditionnel) → boutons par défaut avec les icônes Chevron actuelles + style `.gallery-lightbox` de CC.
- `useMedia(query, false)` : le `false` est l'état de rendu serveur (desktop). **Pas de mismatch d'hydratation** : les rangées utilisent des classes Tailwind (pas `isMobile`), et le lightbox n'est monté qu'à l'ouverture (post-hydratation, clic utilisateur).
- `finite: true` : supprime la boucle en bout de liste **et** masque nativement les flèches quand il n'y a qu'une image (cas vu en live sur `/portfolio/talent-forge`).
- Alternative de détection plus sémantique (tactile plutôt que largeur) : `useMedia("(pointer: coarse)", false)` — masque les flèches sur tout appareil **tactile** (téléphones + tablettes), les garde pour la souris. Au choix ; `max-width: 767px` colle au « smartphone » demandé.

## Hors périmètre

- Plugin `Counter` (« 1 / 3 ») — nice-to-have, à décider séparément.
- Refonte du layout des rangées / du style desktop du lightbox.
- Backend galerie (éditeur, sync, ordre d'affichage).

## Vérification finale

DevTools **device mode** (375 / 390 px) : ouvrir le lightbox → pas de flèches, navigation au **swipe**, image non écrasée, fermeture au **swipe-down** et au **tap sur le fond**. Puis desktop : flèches présentes, design CC inchangé. `pnpm ts` + `pnpm lint`.
