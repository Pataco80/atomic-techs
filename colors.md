Compris. Le portfolio définit ses tokens en **HSL** (`:root` light, `.dark` dark) ; atomic-techs est en **oklch**. Je vais convertir chaque valeur HSL → oklch et remplacer dans le globals actuel. Je lis d'abord les blocs de tokens actuels (structure + format oklch exact) :

Structure claire :

- `:root, .force-light-theme` = LIGHT, `.dark` = DARK, en oklch (4 décimales).
- Tokens à mapper depuis le portfolio : background, foreground, card(+fg), alt-section, hero, popover(+fg), muted(+fg), border, input, primary(+fg), secondary(+fg), accent(+fg), ring. Les extras shadcn (destructive, chart-_, sidebar-_, success/warning/info) **ne sont pas** dans le portfolio → je n'y touche pas.

Pour des conversions HSL→oklch exactes (pas à la main), j'écris un script et je le lance :

Conversions calculées (sanity check OK : `hsl(0 0% 100%)`→`oklch(1 0 0)` ; `hsl(220 100% 50%)`=#0055ff→`oklch(0.5332 0.2596 262.64)` ; les gris portent une légère teinte bleutée H≈261–268, fidèle au portfolio).

J'applique en 4 remplacements (blocs contigus, pour éviter toute collision de lignes identiques entre `:root` et `.dark`) :

Les 4 blocs sont remplacés. Je vérifie que le CSS compile (build), puis je te donne le tableau de correspondance pour ta vérification :

✅ Build exit 0 — le CSS oklch compile proprement. Voici le tableau de correspondance pour ta vérification (conversions **exactes** : round-trip sRGB, donc rendu identique à la source HSL).

### `:root` (LIGHT)

| Token                | HSL portfolio | → oklch                  |
| -------------------- | ------------- | ------------------------ |
| background           | 216 10% 90%   | `0.9212 0.0047 258.3256` |
| foreground           | 220 9% 12.9%  | `0.2427 0.0081 264.4139` |
| card                 | 0 0% 100%     | `1 0 0`                  |
| card-foreground      | 220 9% 12.9%  | `0.2427 0.0081 264.4139` |
| alt-section          | 223 10% 86.1% | `0.8883 0.0073 268.7329` |
| hero                 | 228 85% 14%   | `0.21 0.0932 266.2419`   |
| popover              | 0 0% 100%     | `1 0 0`                  |
| popover-foreground   | 220 9% 12.9%  | `0.2427 0.0081 264.4139` |
| muted                | 220 8% 82%    | `0.8567 0.0073 264.5237` |
| muted-foreground     | 218 9% 34.9%  | `0.4547 0.0182 261.4538` |
| border               | 220 8% 80%    | `0.8405 0.0081 264.5194` |
| input                | 220 8% 88%    | `0.9051 0.0048 264.5346` |
| primary              | 220 100% 50%  | `0.5332 0.2596 262.6358` |
| primary-foreground   | 0 0% 100%     | `1 0 0`                  |
| secondary            | 220 8% 88%    | `0.9051 0.0048 264.5346` |
| secondary-foreground | 220 9% 12.9%  | `0.2427 0.0081 264.4139` |
| accent               | 220 100% 47%  | `0.5097 0.2472 262.5891` |
| accent-foreground    | 0 0% 100%     | `1 0 0`                  |
| ring                 | 220 100% 50%  | `0.5332 0.2596 262.6358` |

### `.dark` (DARK)

| Token                | HSL portfolio  | → oklch                  |
| -------------------- | -------------- | ------------------------ |
| background           | 220 9% 12.9%   | `0.2427 0.0081 264.4139` |
| foreground           | 223 10% 86.1%  | `0.8883 0.0073 268.7329` |
| card                 | 220 8% 7.6%    | `0.1859 0.0045 264.4585` |
| card-foreground      | 223 10% 86.1%  | `0.8883 0.0073 268.7329` |
| alt-section          | 220 8% 7.6%    | `0.1859 0.0045 264.4585` |
| hero                 | 228 85% 14%    | `0.21 0.0932 266.2419`   |
| popover              | 220 9% 12.9%   | `0.2427 0.0081 264.4139` |
| popover-foreground   | 223 10% 86.1%  | `0.8883 0.0073 268.7329` |
| muted                | 218 9% 24.1%   | `0.355 0.0133 261.4602`  |
| muted-foreground     | 222 9% 62.2%   | `0.6896 0.0187 267.2421` |
| border               | 218 9% 24.1%   | `0.355 0.0133 261.4602`  |
| input                | 218 9% 24.1%   | `0.355 0.0133 261.4602`  |
| primary              | 220 100% 50%   | `0.5332 0.2596 262.6358` |
| primary-foreground   | 219 100% 93.9% | `0.9373 0.0298 262.9681` |
| secondary            | 218 9% 24.1%   | `0.355 0.0133 261.4602`  |
| secondary-foreground | 223 10% 86.1%  | `0.8883 0.0073 268.7329` |
| accent               | 220 100% 64%   | `0.6389 0.1931 262.3606` |
| accent-foreground    | 219 100% 93.9% | `0.9373 0.0298 262.9681` |
| ring                 | 220 100% 73.9% | `0.7318 0.1382 263.2083` |

**À noter :**

- **Non touchés** (absents du portfolio) : `destructive`, `chart-1..5`, `sidebar-*`, `success/warning/info`. Dis-moi si tu veux que je les aligne aussi.
- `card`/`popover`/`primary-foreground` en light = blanc pur → `oklch(1 0 0)` (inchangés).
- **Non commité** (working tree) — vérifie en `pnpm dev` ; je commit quand tu valides. Le script de conversion est dans le scratchpad si tu veux re-générer.
