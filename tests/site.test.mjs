import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import test from "node:test";
import { auditRelease } from "../scripts/audit-release.mjs";
import { validateSite } from "../scripts/validate-site.mjs";

const root = resolve(import.meta.dirname, "..");
const pagePath = join(root, "docs", "index.html");
const cssPath = join(root, "docs", "assets", "styles.css");

function page() {
  assert.ok(existsSync(pagePath), "docs/index.html deve existir");
  return readFileSync(pagePath, "utf8");
}

function styles() {
  assert.ok(existsSync(cssPath), "docs/assets/styles.css deve existir");
  return readFileSync(cssPath, "utf8");
}

test("o artefato estático cumpre o contrato integral", () => {
  assert.deepEqual(validateSite(), []);
});

test("a primeira história explica produto, problema e público em português", () => {
  const html = page();
  assert.match(html, /lang="pt-BR"/);
  assert.match(html, /contexto governado para agentes de IA/i);
  assert.match(html, /equipes técnicas pequenas/i);
  assert.match(html, /A mesma fonte\. O contexto certo\. A versão comprovável\./);
  assert.match(html, /documentação desatualizada/i);
});

test("a narrativa distingue Alexandria das alternativas comuns", () => {
  const html = page();
  for (const phrase of ["copiar arquivos", "arquivo de instruções", "wiki", "silo"]) {
    assert.match(html.toLowerCase(), new RegExp(phrase));
  }
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.ok((html.match(/data-i18n=/g) ?? []).length >= 30);
});

test("o mecanismo preserva ordem, autoridade e evidência", () => {
  const html = page();
  const mechanism = html.slice(html.indexOf('id="como-funciona"'), html.indexOf('id="principios"'));
  const phrases = ["Markdown aprovado", "versão imutável", "contexto delimitado", "citação revalidável"];
  const positions = phrases.map((phrase) => mechanism.indexOf(phrase));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.match(html, /Git permanece a fonte de autoridade/);
  assert.match(html, /índice local é descartável/);
});

test("determinismo e ausência de evidência são descritos sem extrapolação", () => {
  const html = page();
  assert.match(html, /políticas determinísticas de recorte, ordenação e orçamento/i);
  assert.match(html, /Quando não existe evidência aprovada/);
  assert.match(html, /não controla como o host ou o modelo usa essa resposta/i);
  assert.doesNotMatch(html, /respostas? determinísticas?/i);
});

test("o estado Alpha é honesto e não oferece conversão", () => {
  const html = page();
  assert.match(html, /Alpha por convite/);
  assert.match(html, /Interfaces podem mudar; ainda não indicado para produção\./);
  assert.doesNotMatch(html, /<(?:form|input|button|iframe|script)\b/i);
  assert.doesNotMatch(html, /(?:cadastre-se|entre na lista|baixar agora|preços|fale conosco)/i);
});

test("a superfície possui semântica e CSS acessíveis", () => {
  const html = page();
  const css = styles();
  for (const landmark of ["<header", "<main", "<footer"]) assert.ok(html.includes(landmark));
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-label="Alexandria"/);
  assert.match(html, /aria-hidden="true"/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(css, /animation-duration:\s*0\.01ms/);
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*\.specimen-state__glyph\s*\{[^}]*animation:\s*none/s);
});

test("a composição possui reflow móvel e não trunca traduções", () => {
  const css = styles();
  assert.match(css, /@media\s*\([^)]*max-width:\s*48rem/);
  assert.match(css, /clamp\(/);
  assert.match(css, /overflow-wrap:\s*(?:anywhere|break-word)/);
  assert.doesNotMatch(css, /text-overflow:\s*ellipsis|line-clamp/i);
});

test("os símbolos oficiais preservam a mesma geometria arquitetônica", () => {
  const mark = readFileSync(join(root, "docs", "assets", "mark.svg"), "utf8");
  const favicon = readFileSync(join(root, "docs", "assets", "favicon.svg"), "utf8");
  const pathData = (svg) => [...svg.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map((match) => match[1]);

  for (const svg of [mark, favicon]) {
    assert.match(svg, /viewBox="0 0 72 72"/);
    assert.match(svg, /id="alexandria-blue"/);
    assert.match(svg, /stroke="url\(#alexandria-blue\)"/);
    assert.match(svg, /stroke-width="4\.5"/);
  }

  assert.deepEqual(pathData(favicon), pathData(mark));
  assert.match(mark, /M36 4v20/);
  assert.match(mark, /M6 60V49h60v11M36 49v19/);
  assert.match(mark, /m36 33 5 5-5 5-5-5z/i);
});

test("cada espécime Al permanece inteiro no desktop sem alterar o mobile", () => {
  const css = styles();
  assert.match(css, /--glyph-scale:\s*0\.58/);
  assert.match(css, /transform:\s*scaleX\(var\(--glyph-scale\)\)/);
  assert.match(css, /\.specimen-state__glyph\s*\{[^}]*overflow:\s*visible/s);
  assert.match(css, /@media\s*\(max-width:\s*48rem\)[\s\S]*\.specimen-state__glyph\s*\{[^}]*transform:\s*none/s);
});

test("a candidata de lançamento cumpre contraste, expansão e desempenho", () => {
  const report = auditRelease();
  assert.deepEqual(report.errors, []);
  assert.ok(report.localization.localizedStrings >= 30);
  assert.ok(report.localization.expansionFactor >= 1.3);
  assert.ok(report.performance.estimatedPrincipalContentMs < 2500);
});
