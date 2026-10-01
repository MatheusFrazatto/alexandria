// Marca arquitetônica do Alexandria — fonte única para todas as cópias do site.
// Geometria idêntica à canônica do produto (alexandria/adapters/gui/assets/mark.svg),
// com junções e pontas arredondadas: o ápice e a haste central fundem numa curva só,
// e os cantos do telhado e da base deixam de ser chanfrados.

export const MARK_VIEWBOX = "0 0 72 72";

export const MARK_STROKES = ["M6 29V19L36 4l30 15v10M36 4v20", "M6 42v-7l30-9 30 9v7", "M6 60V49h60v11M36 49v19"];

// Losango central um pouco menor, contornado no mesmo gradiente com junção redonda:
// mantém a área ótica do original e suaviza as quatro pontas.
export const MARK_GEM = "m36 34.4 3.6 3.6-3.6 3.6-3.6-3.6z";

export const MARK_STROKE = {
  width: 4.5,
  linecap: "round",
  linejoin: "round",
} as const;

export const MARK_GEM_STROKE = 2.2;

export const MARK_STOPS = [
  ["0", "#5A9BFF"],
  ["0.35", "#4D83F1"],
  ["0.6", "#3F6FE6"],
  ["0.78", "#3558D0"],
  ["1", "#263AB0"],
] as const;

/** SVG autônomo (favicon, arquivo público). */
export function markSvg(title = "Alexandria"): string {
  const stops = MARK_STOPS.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("");
  const strokes = MARK_STROKES.map((d) => `<path d="${d}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}" role="img" aria-labelledby="t"><title id="t">${title}</title><defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="21.176" y2="84.706">${stops}</linearGradient></defs><g fill="none" stroke="url(#g)" stroke-width="${MARK_STROKE.width}" stroke-linecap="${MARK_STROKE.linecap}" stroke-linejoin="${MARK_STROKE.linejoin}">${strokes}</g><path d="${MARK_GEM}" fill="url(#g)" stroke="url(#g)" stroke-width="${MARK_GEM_STROKE}" stroke-linejoin="round"/></svg>`;
}
