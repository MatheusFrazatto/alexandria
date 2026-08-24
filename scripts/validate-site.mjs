import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = join(repositoryRoot, "docs");

const requiredFiles = [
  "index.html",
  "404.html",
  ".nojekyll",
  "assets/styles.css",
  "assets/mark.svg",
  "assets/favicon.svg",
  "assets/og-alexandria.png",
  "assets/fonts/Manrope-Variable.ttf",
  "assets/fonts/OFL.txt",
];

const requiredSections = [
  "inicio",
  "problema",
  "como-funciona",
  "principios",
  "limites",
  "status",
];

const requiredCopy = [
  "A mesma fonte. O contexto certo. A versão comprovável.",
  "Memória que não depende da conversa.",
  "contexto governado para agentes de IA",
  "repositório Git",
  "índice local é descartável",
  "Responsabilidade",
  "Rastreabilidade",
  "Determinismo",
  "Quando não existe evidência aprovada",
  "Alpha por convite",
  "ainda não indicado para produção",
  "Don’t let your library burn down",
];

const forbiddenMarkup = [
  [/<form\b/i, "formulário"],
  [/<input\b/i, "campo de entrada"],
  [/<button\b/i, "botão"],
  [/<iframe\b/i, "embed de terceiro"],
  [/<script\b/i, "JavaScript cliente"],
  [/\b(?:analytics|gtag|segment|hotjar|mixpanel)\b/i, "analytics"],
];

const forbiddenClaims = [
  /elimina(?:r|mos)? alucinações/i,
  /sempre atualizad[oa]/i,
  /respostas? determinísticas?/i,
  /pronto para produção/i,
  /suporte (?:oficial )?(?:a|para) (?:qualquer|todos)/i,
];

function read(relativePath) {
  return readFileSync(join(siteRoot, relativePath), "utf8");
}

function relativeLuminance(hex) {
  const channels = hex
    .replace("#", "")
    .match(/.{2}/g)
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function validateSite() {
  const errors = [];

  for (const relativePath of requiredFiles) {
    if (!existsSync(join(siteRoot, relativePath))) {
      errors.push(`Arquivo obrigatório ausente: docs/${relativePath}`);
    }
  }

  if (!existsSync(join(siteRoot, "index.html")) || !existsSync(join(siteRoot, "assets/styles.css"))) {
    return errors;
  }

  const html = read("index.html");
  const css = read("assets/styles.css");

  const checks = [
    [/<html\s+lang="pt-BR"/i, "O documento deve declarar lang=pt-BR."],
    [/<meta\s+charset="utf-8"/i, "A codificação UTF-8 deve ser declarada."],
    [/name="viewport"/i, "A viewport responsiva deve ser declarada."],
    [/name="description"/i, "A descrição de busca deve existir."],
    [/property="og:title"/i, "O título Open Graph deve existir."],
    [/property="og:description"/i, "A descrição Open Graph deve existir."],
    [/property="og:image"\s+content="\.\/assets\/og-alexandria\.png"/i, "A prévia social deve usar caminho relativo."],
    [/<a\s+class="skip-link"\s+href="#conteudo"/i, "O link para pular ao conteúdo deve existir."],
    [/<main\s+id="conteudo"/i, "O landmark principal deve ter o alvo do skip link."],
    [/@font-face/i, "A fonte editorial local deve ser declarada."],
    [/prefers-reduced-motion:\s*reduce/i, "A preferência por movimento reduzido deve ser respeitada."],
    [/:focus-visible/i, "O foco por teclado deve ser tematizado."],
    [/@media\s*\([^)]*max-width:\s*48rem/i, "O breakpoint móvel deve existir."],
    [/overflow-wrap:\s*(?:anywhere|break-word)/i, "A cópia expandida deve poder refluir."],
  ];

  for (const [pattern, message] of checks) {
    const source = message.includes("fonte") || message.includes("movimento") || message.includes("foco") || message.includes("breakpoint") || message.includes("refluir") ? css : html;
    if (!pattern.test(source)) errors.push(message);
  }

  if ((html.match(/<h1\b/gi) ?? []).length !== 1) {
    errors.push("A página deve conter exatamente um h1.");
  }

  if ((html.match(/data-i18n="[^"]+"/g) ?? []).length < 30) {
    errors.push("A fronteira de localização deve conter ao menos 30 chaves data-i18n.");
  }

  for (const id of requiredSections) {
    if (!new RegExp(`<section[^>]+id="${id}"`, "i").test(html)) {
      errors.push(`Seção obrigatória ausente: #${id}`);
    }
  }

  for (const copy of requiredCopy) {
    if (!html.includes(copy)) errors.push(`Cópia obrigatória ausente: “${copy}”`);
  }

  for (const [pattern, label] of forbiddenMarkup) {
    if (pattern.test(html)) errors.push(`Integração/controle proibido encontrado: ${label}.`);
  }

  for (const pattern of forbiddenClaims) {
    if (pattern.test(html)) errors.push(`Claim público inseguro encontrado: ${pattern}.`);
  }

  for (const match of html.matchAll(/(?:href|src|content)="([^"]+)"/gi)) {
    const value = match[1];
    if (/^(?:https?:)?\/\//i.test(value)) errors.push(`URL externa não permitida: ${value}`);
    if (/^\/(?!\/)/.test(value)) errors.push(`URL absoluta de raiz quebra project sites: ${value}`);
  }

  if (/<(?:a|button)\b[^>]*(?:class="[^"]*(?:cta|button)|download)/i.test(html)) {
    errors.push("A página não pode oferecer CTA ou download.");
  }

  if (/text-overflow:\s*ellipsis/i.test(css) || /line-clamp/i.test(css)) {
    errors.push("A cópia narrativa não pode ser truncada.");
  }

  if (!/aria-hidden="true"[^>]*>\s*Al\s*</i.test(html)) {
    errors.push("Os glifos monumentais Al devem ser decorativos.");
  }

  if (!/aria-label="Alexandria"/i.test(html)) {
    errors.push("A marca deve expor o nome acessível Alexandria.");
  }

  if (contrastRatio("#242B31", "#F8F7F5") < 4.5) {
    errors.push("A combinação principal de tinta e papel não alcança contraste 4.5:1.");
  }

  if (existsSync(join(repositoryRoot, ".github", "workflows"))) {
    errors.push("Um workflow de deployment foi encontrado sem autorização de publicação.");
  }

  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const errors = validateSite();
  if (errors.length) {
    console.error(`Validação falhou com ${errors.length} problema(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log("Site estático validado: estrutura, conteúdo, privacidade e ativos em conformidade.");
  }
}
