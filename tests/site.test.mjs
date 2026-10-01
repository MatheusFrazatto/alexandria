import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

import { queryPlot, ridgelines, seeded } from "../src/lib/plots.ts";
import { pt } from "../src/i18n/pt.ts";
import { en } from "../src/i18n/en.ts";

test("PRNG com semente é determinístico", () => {
  const a = seeded(42);
  const b = seeded(42);
  const seqA = Array.from({ length: 8 }, a);
  assert.deepEqual(seqA, Array.from({ length: 8 }, b));
  assert.ok(seqA.every((n) => n >= 0 && n < 1));
});

test("evento de consulta: mesma forma a cada build e estados coerentes", () => {
  const first = queryPlot();
  assert.deepEqual(first, queryPlot());
  const kinds = first.spokes.reduce((acc, s) => ({ ...acc, [s.kind]: (acc[s.kind] ?? 0) + 1 }), {});
  assert.equal(kinds.selected, 3, "três trechos citados");
  assert.equal(kinds.review, 1, "um trecho marcado para revisão");
  assert.equal(kinds.quarantine, 1, "um trecho em quarentena");
  for (const s of first.spokes) {
    if (s.kind === "selected" || s.kind === "review") assert.ok(s.length < first.ring, "evidência cabe no orçamento");
  }
});

test("cristas: estados alinhado e derivado têm a mesma estrutura (necessário para o morph)", () => {
  const { ridges } = ridgelines();
  assert.equal(ridges.length, 24);
  assert.equal(ridges.filter((r) => r.source).length, 1);
  const tokens = (d) => d.match(/-?\d+(\.\d+)?/g).length;
  for (const r of ridges) {
    assert.equal(tokens(r.aligned), tokens(r.drifted));
    assert.equal(tokens(r.fillAligned), tokens(r.fillDrifted));
  }
});

function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((k) => [k, shape(value[k])]));
  return typeof value;
}

test("PT e EN têm exatamente a mesma estrutura de conteúdo", () => {
  assert.deepEqual(shape(en), shape(pt));
});

test("seções têm os mesmos ids e números nos dois idiomas", () => {
  assert.deepEqual(
    en.sections.map((s) => [s.id, s.no]),
    pt.sections.map((s) => [s.id, s.no]),
  );
});

test("a cópia não promete o que o produto proíbe", () => {
  const text = JSON.stringify([pt, en]);
  for (const pattern of [/pronto para produção/i, /production[- ]ready/i, /\bstable\b/i, /oficialmente suportad/i, /officially supported/i]) {
    assert.doesNotMatch(text, pattern);
  }
  const betas = text.match(/\bbeta\b/gi) ?? [];
  assert.equal(betas.length, 2, "Beta só aparece como 'antes de qualquer Beta' / 'before any Beta'");
});

test("artefato publicado passa na validação", { skip: !existsSync("dist/index.html") && "rode npm run build antes" }, () => {
  const run = spawnSync(process.execPath, ["scripts/validate-site.mjs"], { encoding: "utf8" });
  assert.equal(run.status, 0, run.stderr || run.stdout);
});

test("a cópia evita marcas de escrita automática (travessão, ponto e vírgula, dois-pontos em prosa)", () => {
  // Literais de código e dados mantêm sua notação própria.
  const literals = new Set(["ref: main", "commit: 9f3c2a1"]);
  const strings = [];
  const walk = (value) => {
    if (typeof value === "string") strings.push(value);
    else if (value && typeof value === "object") Object.values(value).forEach(walk);
  };
  walk([pt, en]);
  for (const s of strings) {
    assert.doesNotMatch(s, /—/, `travessão em: ${s}`);
    assert.doesNotMatch(s, /;/, `ponto e vírgula em: ${s}`);
    if (!literals.has(s)) assert.doesNotMatch(s, /\p{L}: /u, `dois-pontos em: ${s}`);
  }
});
