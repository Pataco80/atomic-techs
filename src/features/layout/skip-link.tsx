/**
 * Lien d'évitement clavier (WCAG 2.4.1 Bypass Blocks) : invisible, devient
 * visible au focus (premier élément tabulable) et saute vers `#contenu`.
 */
export function SkipLink() {
  return (
    <a
      href="#contenu"
      className="sr-only focus:not-sr-only focus:bg-blue-ribbon-700 focus:ring-blue-ribbon-300 focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:rounded-br-md focus:px-3 focus:py-1.5 focus:text-sm focus:font-medium focus:text-white focus:shadow-md focus:ring-2 focus:ring-inset focus:outline-none"
    >
      Aller au contenu
    </a>
  );
}
