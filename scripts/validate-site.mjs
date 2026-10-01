// Validação do artefato publicado (dist/): estrutura, links, privacidade, afirmações públicas e paridade de idiomas.
// Uso: npm run build && npm run validate
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const base = (process.env.BASE_PATH ?? "/").replace(/\/?$/, "/");

const pages = {
  "pt-home": "index.html",
  "en-home": "en/index.html",
  "pt-download": "download/index.html",
  "en-download": "en/download/index.html",
  "404": "404.html",
};

const requiredFiles = [
  ...Object.values(pages),
  "mark.svg",
  "og.png",
  "licenses/Saira-OFL.txt",
  "licenses/Manrope-OFL.txt",
  "licenses/MartianMono-OFL.txt",
  "licenses/animejs-MIT.txt",
];

const requiredSections = ["inicio", "problema", "como-funciona", "prova", "interfaces", "principios", "hoje-e-proximo", "estado"];

const allowedExternal = [/^https:\/\/github\.com\/MatheusFrazatto\/?$/];

const forbiddenMarkup = [
  [/<form\b/i, "formulário"],
  [/<input\b/i, "campo de entrada"],
  [/<iframe\b/i, "embed de terceiro"],
  [/\b(?:gtag|googletagmanager|google-analytics|plausible|segment\.com|hotjar|mixpanel|clarity\.ms)\b/i, "analytics"],
  [/document\.cookie|localStorage|sessionStorage/, "armazenamento no navegador"],
];

// Afirmações que o produto proíbe. Ocorrências legítimas ficam na lista de permitidas.
const forbiddenClaims = [
  /pronto para produção/i,
  /production[- ]ready/i,
  /\bbeta\b/i,
  /\brelease candidate\b/i,
  /\bstable\b/i,
  /\bestável\b/i,
  /oficialmente suportad/i,
  /officially supported/i,
  /\bclientes?\b/i,
  /\bcustomers?\b/i,
  /\bbenchmark/i,
];
const allowedClaimContexts = [
  /antes de qualquer Beta/i,
  /before any Beta/i,
];

// Nada do contrato de direção ou de identificadores normativos privados no artefato.
const leaks = [
  /Direction contract/i,
  /\bTHESIS:/,
  /\bOWN-WORLD\b/,
  /\bFIRST VIEWPORT:/,
  /seed key/i,
  /\b(?:PRD|DOM|GOV|INT|REL|DEL|OPS|REP|RET|IDX)-[A-Z]+-\d{2}\b/,
];

const errors = [];
const fail = (msg) => errors.push(msg);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ");

if (!existsSync(dist)) {
  console.error("dist/ não existe. Rode `npm run build` antes.");
  process.exit(1);
}

for (const file of requiredFiles) {
  if (!existsSync(join(dist, file))) fail(`arquivo obrigatório ausente: ${file}`);
}

const htmlFiles = walk(dist).filter((f) => f.endsWith(".html"));
const allFiles = new Set(walk(dist).map((f) => relative(dist, f).replace(/\\/g, "/")));

function resolveInternal(url) {
  if (!url.startsWith(base)) return null;
  let path = decodeURI(url.slice(base.length).split("#")[0].split("?")[0]);
  if (path === "" || path.endsWith("/")) path += "index.html";
  return path;
}

for (const file of htmlFiles) {
  const rel = relative(dist, file).replace(/\\/g, "/");
  const html = readFileSync(file, "utf8");

  for (const [pattern, label] of forbiddenMarkup) if (pattern.test(html)) fail(`${rel}: ${label} não é permitido`);
  for (const pattern of leaks) if (pattern.test(html)) fail(`${rel}: vazamento de material de desenvolvimento (${pattern})`);

  if (!/<html lang="(pt-BR|en)"/.test(html)) fail(`${rel}: <html lang> ausente ou inesperado`);
  if ((html.match(/<h1\b/g) ?? []).length !== 1) fail(`${rel}: deve ter exatamente um <h1>`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) fail(`${rel}: <title> ausente`);
  if (!/<meta name="description" content="[^"]{40,}"/.test(html)) fail(`${rel}: meta description ausente`);
  if (!/class="skip-link"/.test(html)) fail(`${rel}: skip link ausente`);

  // Scripts e estilos: só arquivos do próprio site.
  for (const [, src] of html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)) {
    if (/^(https?:)?\/\//.test(src)) fail(`${rel}: script externo ${src}`);
  }
  for (const [tag, href] of html.matchAll(/<link\b[^>]*\shref="([^"]+)"[^>]*>/g)) {
    if (/^(https?:)?\/\//.test(href) && !/rel="(canonical|alternate)"/.test(tag)) fail(`${rel}: recurso externo ${href}`);
  }

  // Links e recursos internos precisam existir; externos só os permitidos.
  for (const [, attr, url] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    if (url.startsWith("#") || url.startsWith("data:") || url.startsWith("mailto:")) continue;
    if (/^https?:\/\//.test(url)) {
      const tag = html.slice(Math.max(0, html.indexOf(url) - 200), html.indexOf(url));
      if (/rel="(canonical|alternate)"|property="og:/.test(tag)) continue;
      if (!allowedExternal.some((p) => p.test(url))) fail(`${rel}: link externo não permitido ${url}`);
      continue;
    }
    const target = resolveInternal(url);
    if (target === null) {
      fail(`${rel}: ${attr} fora do base path: ${url}`);
      continue;
    }
    if (!allFiles.has(target)) fail(`${rel}: ${attr} quebrado: ${url}`);
  }

  // Afirmações públicas.
  let text = visibleText(html);
  for (const ok of allowedClaimContexts) text = text.replace(new RegExp(ok.source, "gi"), " ");
  for (const claim of forbiddenClaims) {
    const m = text.match(claim);
    if (m) fail(`${rel}: afirmação proibida "${m[0]}" em "…${text.slice(Math.max(0, m.index - 50), m.index + 50)}…"`);
  }
}

// Âncoras da home e paridade estrutural entre idiomas.
const count = (html, re) => (html.match(re) ?? []).length;
const ptHome = existsSync(join(dist, pages["pt-home"])) ? readFileSync(join(dist, pages["pt-home"]), "utf8") : "";
const enHome = existsSync(join(dist, pages["en-home"])) ? readFileSync(join(dist, pages["en-home"]), "utf8") : "";
for (const id of requiredSections) {
  if (!ptHome.includes(`id="${id}"`)) fail(`index.html: seção #${id} ausente`);
  if (!enHome.includes(`id="${id}"`)) fail(`en/index.html: seção #${id} ausente`);
}
for (const [a, b] of [
  ["pt-home", "en-home"],
  ["pt-download", "en-download"],
]) {
  const ha = readFileSync(join(dist, pages[a]), "utf8");
  const hb = readFileSync(join(dist, pages[b]), "utf8");
  for (const tag of ["h2", "h3", "li", "dt", "section", "a"]) {
    const re = new RegExp(`<${tag}\\b`, "g");
    if (count(ha, re) !== count(hb, re)) fail(`paridade ${a}/${b}: <${tag}> ${count(ha, re)} ≠ ${count(hb, re)}`);
  }
  if (!/hreflang="en"/.test(ha) || !/hreflang="pt-BR"/.test(ha)) fail(`${pages[a]}: hreflang ausente`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problema(s):\n` + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✓ ${htmlFiles.length} páginas validadas (${allFiles.size} arquivos em dist/).`);
