import { readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = join(repositoryRoot, "docs");

const releaseProfile = Object.freeze({
  name: "Slow 4G conservador",
  downlinkBitsPerSecond: 1_600_000,
  roundTripTimeMs: 150,
  principalRoundTrips: 2,
  completeRoundTrips: 3,
  thresholdMs: 2_500,
});

function read(relativePath) {
  return readFileSync(join(siteRoot, relativePath), "utf8");
}

function relativeLuminance(hex) {
  const channels = hex
    .replace("#", "")
    .match(/.{2}/g)
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}

function stripMarkup(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function pseudoLocalize(value) {
  const characters = Array.from(value);
  const extensionLength = Math.ceil(characters.length * 0.3);
  const extensionSource = characters.filter((character) => /[\p{L}\p{N}]/u.test(character));
  const seed = extensionSource.length ? extensionSource : characters;
  const extension = Array.from({ length: extensionLength }, (_, index) => seed[index % seed.length]).join("");
  return `${value} ${extension}`;
}

function estimateTransferMs(bytes, roundTrips) {
  const transferMs = (bytes * 8 * 1_000) / releaseProfile.downlinkBitsPerSecond;
  return Math.round(transferMs + roundTrips * releaseProfile.roundTripTimeMs);
}

export function auditRelease() {
  const errors = [];
  const html = read("index.html");
  const css = read("assets/styles.css");

  const contrastPairs = [
    ["tinta principal sobre papel", "#242b31", "#f8f7f5", 4.5],
    ["tinta rica sobre papel", "#151a1f", "#f8f7f5", 4.5],
    ["texto secundário sobre papel", "#555c62", "#f8f7f5", 4.5],
    ["índices azuis sobre papel", "#0058d5", "#f8f7f5", 4.5],
    ["texto branco sobre azul", "#ffffff", "#016efa", 4.5],
    ["nota clara sobre tinta rica", "#a9cfff", "#151a1f", 4.5],
  ].map(([name, foreground, background, minimum]) => ({
    name,
    foreground,
    background,
    minimum,
    ratio: Number(contrastRatio(foreground, background).toFixed(2)),
  }));

  for (const pair of contrastPairs) {
    if (pair.ratio < pair.minimum) {
      errors.push(`Contraste insuficiente em ${pair.name}: ${pair.ratio}:1.`);
    }
  }

  if (!/\.status-grid__index,\s*\.status-grid__note\s*\{\s*color:\s*var\(--white\)/s.test(css)) {
    errors.push("As notas pequenas da superfície azul devem usar branco para atingir contraste AA.");
  }

  const headings = [...html.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
  for (let index = 1; index < headings.length; index += 1) {
    if (headings[index] > headings[index - 1] + 1) {
      errors.push(`A hierarquia de títulos salta de h${headings[index - 1]} para h${headings[index]}.`);
    }
  }

  const localizedEntries = [...html.matchAll(/<([a-z][a-z0-9-]*)\b[^>]*data-i18n="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((match) => ({ key: match[2], source: stripMarkup(match[3]) }))
    .filter((entry) => entry.source.length > 0);
  const uniqueKeys = new Set(localizedEntries.map((entry) => entry.key));
  if (uniqueKeys.size !== localizedEntries.length) errors.push("Existem chaves data-i18n duplicadas.");
  if (localizedEntries.length < 30) errors.push("A amostra de pseudolocalização deve cobrir ao menos 30 textos.");

  const expandedEntries = localizedEntries.map((entry) => {
    const expanded = pseudoLocalize(entry.source);
    return {
      ...entry,
      expanded,
      factor: Array.from(expanded).length / Array.from(entry.source).length,
    };
  });
  const minimumExpansion = Math.min(...expandedEntries.map((entry) => entry.factor));
  if (minimumExpansion < 1.3) errors.push("A pseudolocalização não expandiu todos os textos em pelo menos 30%.");

  const responsiveChecks = [
    [/@media\s*\(max-width:\s*76rem\)/, "breakpoint largo"],
    [/@media\s*\(max-width:\s*62rem\)/, "breakpoint de tablet"],
    [/@media\s*\(max-width:\s*48rem\)/, "breakpoint móvel"],
    [/@media\s*\(max-width:\s*28rem\)/, "breakpoint estreito"],
    [/body\s*\{[^}]*min-width:\s*20rem/s, "limite estrutural de 320px"],
    [/overflow-wrap:\s*(?:anywhere|break-word)/, "quebra de texto expandido"],
    [/\.specimen\s*\{[^}]*container-type:\s*inline-size/s, "dimensionamento pelo campo do espécime"],
    [/font-size:\s*clamp\(11rem,\s*31cqw,\s*27rem\)/, "limite fluido dos glifos ALEX"],
  ];
  for (const [pattern, label] of responsiveChecks) {
    if (!pattern.test(css)) errors.push(`Contrato responsivo ausente: ${label}.`);
  }
  if (/text-overflow:\s*ellipsis|line-clamp/i.test(css)) {
    errors.push("A cópia expandida não pode ser truncada.");
  }
  if (/--glyph-scale|scaleX\(/.test(css)) {
    errors.push("Os glifos ALEX devem preservar proporções naturais e caber no próprio campo.");
  }
  if (/animation-duration:\s*0\.01ms/i.test(css)) {
    errors.push("Movimento reduzido deve remover apenas a animação decorativa, sem corte global.");
  }
  if (!/prefers-reduced-motion:\s*reduce[\s\S]*\.specimen-state__glyph\s*\{[^}]*animation:\s*none/s.test(css)) {
    errors.push("O modo de movimento reduzido deve remover a calibração decorativa do espécime.");
  }

  const principalAssets = ["index.html", "assets/styles.css"];
  const completeCriticalAssets = [
    ...principalAssets,
    "assets/fonts/Manrope-Variable.ttf",
    "assets/mark.svg",
  ];
  const bytesFor = (paths) => paths.reduce((total, path) => total + statSync(join(siteRoot, path)).size, 0);
  const principalBytes = bytesFor(principalAssets);
  const completeCriticalBytes = bytesFor(completeCriticalAssets);
  const estimatedPrincipalContentMs = estimateTransferMs(principalBytes, releaseProfile.principalRoundTrips);
  const estimatedCompleteCriticalMs = estimateTransferMs(completeCriticalBytes, releaseProfile.completeRoundTrips);
  if (estimatedPrincipalContentMs >= releaseProfile.thresholdMs) {
    errors.push(`Conteúdo principal estimado em ${estimatedPrincipalContentMs}ms, acima do limite.`);
  }
  if (estimatedCompleteCriticalMs >= releaseProfile.thresholdMs) {
    errors.push(`Carga crítica completa estimada em ${estimatedCompleteCriticalMs}ms, acima do limite.`);
  }

  return {
    errors,
    accessibility: { contrastPairs, headingSequence: headings },
    localization: {
      localizedStrings: localizedEntries.length,
      expansionFactor: Number(minimumExpansion.toFixed(2)),
      longestExpandedCharacters: Math.max(...expandedEntries.map((entry) => Array.from(entry.expanded).length)),
    },
    performance: {
      profile: releaseProfile.name,
      downlinkBitsPerSecond: releaseProfile.downlinkBitsPerSecond,
      roundTripTimeMs: releaseProfile.roundTripTimeMs,
      principalBytes,
      completeCriticalBytes,
      estimatedPrincipalContentMs,
      estimatedCompleteCriticalMs,
      thresholdMs: releaseProfile.thresholdMs,
    },
    limitations: [
      "Sem navegador conectado: overflow visual, zoom, foco e Core Web Vitals reais ainda exigem confirmação humana.",
    ],
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const report = auditRelease();
  if (report.errors.length) {
    console.error(`Auditoria de lançamento falhou com ${report.errors.length} problema(s):`);
    for (const error of report.errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log("Auditoria de lançamento aprovada.");
    console.log(`- Contraste: ${report.accessibility.contrastPairs.length} combinações AA verificadas`);
    console.log(`- Pseudolocalização: ${report.localization.localizedStrings} textos, expansão mínima ${report.localization.expansionFactor}x`);
    console.log(`- Conteúdo principal: ${report.performance.estimatedPrincipalContentMs}ms estimados (${report.performance.profile})`);
    console.log(`- Carga crítica completa: ${report.performance.estimatedCompleteCriticalMs}ms estimados`);
    console.log(`- Limitação: ${report.limitations[0]}`);
  }
}
