import { en } from "./en";
import { pt, type Dict } from "./pt";

export type Locale = "pt-br" | "en";

const dicts: Record<Locale, Dict> = { "pt-br": pt, en };

export function t(locale: Locale): Dict {
  return dicts[locale];
}

/** Caminho interno respeitando o `base` (GitHub Pages em subcaminho). */
export function href(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}

export function homePath(locale: Locale): string {
  return href(locale === "en" ? "/en/" : "/");
}

export function downloadPath(locale: Locale): string {
  return href(locale === "en" ? "/en/download/" : "/download/");
}

/** Mesma página no outro idioma. */
export function alternatePath(locale: Locale, page: "home" | "download"): string {
  const other: Locale = locale === "en" ? "pt-br" : "en";
  return page === "home" ? homePath(other) : downloadPath(other);
}

export { type Dict };
