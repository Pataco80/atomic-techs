# Audit accessibilité — site public

**Standard :** WCAG 2.1 AA · **Date :** 2026-06-29 · **Périmètre :** pages publiques uniquement (/, /portfolio, détail projet, /legal, /privacy, /changelog, 404/erreur, formulaire de contact). Backend /studio et /admin exclus.

## Résumé

**Problèmes : 6** — 🔴 Critique : 1 · 🟡 Majeur : 3 · 🟢 Mineur : 2

Le gros du site est sain : structure de titres logique (un seul `<h1>` par page), images avec `alt`, champs de formulaire labellisés, noms accessibles sur tous les boutons/liens, aucun `tabindex` positif, aucun id dupliqué, focus-visible présents, dialog géré par Radix (focus trap + Échap). Les points ci-dessous sont les écarts.

## Findings

### Perceivable

| # | Problème | Critère WCAG | Sévérité | Correctif |
|---|----------|--------------|----------|-----------|
| 1 | Le sous-titre « .../xxx » du `SectionTitle` (mono, `text-primary`, petit) n'atteint pas 4.5:1 : **2.9:1** sur sections sombres, **3.3:1** sur le hero, **4.4:1** en light. | 1.4.3 Contrast (Minimum) | 🔴 Critique | Couleur plus contrastée et **theme-aware** pour ce libellé (clair en dark / foncé en light). Le token `accent` passe (~4.7:1) ; sinon définir un token dédié. La taille seule ne suffit pas (échoue même en « large » sur sections sombres). |
| 2 | Pas de landmark `<main>` sur les pages publiques (le contenu est dans un `<div>`). | 1.3.1 Info & Relationships | 🟡 Majeur | Envelopper le contenu du `BaseLayout` dans `<main id="contenu" tabIndex={-1}>`. |

### Operable

| # | Problème | Critère WCAG | Sévérité | Correctif |
|---|----------|--------------|----------|-----------|
| 3 | Aucun lien d'évitement (« Aller au contenu ») — l'utilisateur clavier doit retraverser logo + nav à chaque page. | 2.4.1 Bypass Blocks | 🟡 Majeur | Ajouter un skip-link en 1er élément focusable (visible au focus) pointant vers `#contenu`. |
| 4 | Aucune prise en charge de `prefers-reduced-motion` : scroll smooth (BackToTop, ancres), transitions/scale au survol des cards, fondu d'entrée du BackToTop. | 2.3.3 Animation from Interactions (AAA) + bonne pratique | 🟢 Mineur | Media query globale qui réduit/désactive les transitions et passe le scroll en `auto` si `prefers-reduced-motion: reduce`. |

### Understandable

| # | Problème | Critère WCAG | Sévérité | Correctif |
|---|----------|--------------|----------|-----------|
| 5 | `<html lang="en">` alors que tout le contenu est en français. | 3.1.1 Language of Page | 🟡 Majeur | `lang="fr"` dans `app/layout.tsx`. |

### Robust

| # | Problème | Critère WCAG | Sévérité | Correctif |
|---|----------|--------------|----------|-----------|
| 6 | La navbar `absolute` part au scroll mais reste dans l'ordre de tabulation (pas de `<main>` ni skip-link pour la contourner). | 2.4.3 Focus Order (cumulatif avec #2/#3) | 🟢 Mineur | Réglé par l'ajout de `<main>` + skip-link (#2, #3). |

## Contraste (calcul WCAG)

| Élément | Ratio dark | Ratio light | Requis | Verdict |
|---------|-----------|-------------|--------|---------|
| Corps (foreground/background) | 11.7:1 | 12.9:1 | 4.5 | ✅ |
| Texte muted (muted-foreground/bg) | 5.9:1 | 5.8:1 | 4.5 | ✅ |
| Texte muted sur card | 6.7:1 | 7.3:1 | 4.5 | ✅ |
| **Sous-titre « .../xxx » (primary)** | **2.9:1** | **4.4:1** | 4.5 | ❌ |
| Texte accent (dark) | 4.7:1 | — | 4.5 | ✅ (juste) |
| Badge techno (blue-ribbon-200/700) | 4.5:1 | 4.5:1 | 4.5 | ✅ (juste) |
| Champ contact (pale-sky-50/800) | 8.8:1 | 8.8:1 | 4.5 | ✅ |
| Placeholder contact (pale-sky-300/800) | 5.1:1 | 5.1:1 | 4.5 | ✅ |
| Hero — eyebrow (blue-ribbon-300) | 7.8:1 | — | 4.5 | ✅ |
| Hero — nom (pale-sky-50, large) | 14.7:1 | — | 3.0 | ✅ |
| Hero — description (pale-sky-400) | 6.7:1 | — | 4.5 | ✅ |
| Hero — lien retour (pale-sky-200) | 10.8:1 | — | 4.5 | ✅ |
| **Hero — sous-titre (primary)** | **3.3:1** | — | 4.5 | ❌ |

> Contrastes du hero calculés sur `bg-pale-sky-950` (#121315) ; le dégradé bleu ne fait qu'assombrir davantage la majeure partie (le halo radial éclaircit localement → à vérifier visuellement, mais le `text-shadow` aide).

## Clavier / focus

Tous les éléments interactifs (boutons Shadcn/nowts, liens nav, lien retour hero, champs du formulaire, lien texte nowts, theme-toggle, BackToTop) portent un `focus-visible:ring`. Le dialog de contact (Radix) gère le piège de focus, Échap et le retour de focus. Honeypot correctement masqué (`aria-hidden` + `tabIndex=-1`). **Manque uniquement** : skip-link + landmark `<main>` (cf. #2, #3).

## Priorités

1. 🔴 **Contraste du sous-titre `SectionTitle`** — touche chaque section + hero, sur toutes les pages. Couleur theme-aware ≥ 4.5:1.
2. 🟡 **`lang="fr"`** — une ligne, impact lecteurs d'écran (prononciation).
3. 🟡 **`<main>` + skip-link** — navigation clavier/lecteur d'écran (ajout dans `BaseLayout` + header).
4. 🟢 **`prefers-reduced-motion`** — confort/inclusion (media query globale).

> Mon audit couvre l'automatisable + le code. Un passage final au lecteur d'écran réel (VoiceOver/NVDA) reste recommandé pour valider l'annonce du hero forcé en `dark`, du BackToTop et du dialog.
