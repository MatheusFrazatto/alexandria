// Figuras generativas determinísticas: a mesma semente desenha sempre a mesma forma.
// Inspiradas nas famílias "radial" e "noise" do Book of Shapes, recriadas em código próprio.

export function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/* ------------------------------------------------------------------
   ALX 001 — evento de consulta.
   Cada raio é um trecho candidato; o comprimento é a relevância;
   o anel é o orçamento de contexto.
   ------------------------------------------------------------------ */

export type SpokeKind = "selected" | "eligible" | "review" | "quarantine" | "ghost";

export interface Spoke {
  angle: number;
  length: number;
  kind: SpokeKind;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface QueryPlot {
  size: number;
  center: number;
  ring: number;
  inner: number;
  spokes: Spoke[];
  ticks: { x1: number; y1: number; x2: number; y2: number; major: boolean }[];
  selectedTip: { x: number; y: number; angle: number };
}

export function queryPlot(seed = 1908, count = 288): QueryPlot {
  const size = 800;
  const center = size / 2;
  const ring = 336;
  const inner = 46;
  const random = seeded(seed);

  // Três lobos de relevância: a pergunta encontra três regiões do acervo.
  const lobes = [
    { at: -0.62, width: 0.22, gain: 1 },
    { at: 2.25, width: 0.32, gain: 0.62 },
    { at: 3.9, width: 0.26, gain: 0.48 },
  ];

  const raw = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2 + (random() - 0.5) * 0.03;
    let relevance = 0.2 + random() * 0.26;
    for (const lobe of lobes) {
      const d = Math.atan2(Math.sin(angle - lobe.at), Math.cos(angle - lobe.at));
      relevance += lobe.gain * Math.exp(-(d * d) / (2 * lobe.width * lobe.width)) * (0.6 + random() * 0.4);
    }
    // Picos raros e finos, como no registro de um evento.
    if (random() > 0.93) relevance += random() * 0.35;
    return { angle, relevance: Math.min(relevance, 1.08) };
  });

  const ranked = raw
    .map((s, i) => ({ ...s, i }))
    .sort((a, b) => b.relevance - a.relevance);

  const kinds = new Map<number, SpokeKind>();
  ranked.slice(0, 3).forEach((s) => kinds.set(s.i, "selected"));
  kinds.set(ranked[4]!.i, "review");
  kinds.set(ranked[6]!.i, "quarantine");
  for (const s of raw.keys()) {
    if (!kinds.has(s) && random() < 0.34) kinds.set(s, "ghost");
  }

  const spokes: Spoke[] = raw.map((s, i) => {
    const kind = kinds.get(i) ?? "eligible";
    let length = inner + s.relevance * (ring - inner);
    if (kind === "selected" || kind === "review") length = Math.min(length, ring - 14);
    if (kind === "quarantine") length = Math.min(length, ring * 0.62);
    if (kind === "ghost") length = Math.min(length * (0.55 + random() * 0.6), ring + 46);
    const cos = Math.cos(s.angle);
    const sin = Math.sin(s.angle);
    return {
      angle: s.angle,
      length: r2(length),
      kind,
      x1: r2(center + cos * inner),
      y1: r2(center + sin * inner),
      x2: r2(center + cos * length),
      y2: r2(center + sin * length),
    };
  });

  const ticks = Array.from({ length: 120 }, (_, i) => {
    const a = (i / 120) * Math.PI * 2;
    const major = i % 10 === 0;
    const len = major ? 16 : 7;
    return {
      x1: r2(center + Math.cos(a) * ring),
      y1: r2(center + Math.sin(a) * ring),
      x2: r2(center + Math.cos(a) * (ring + len)),
      y2: r2(center + Math.sin(a) * (ring + len)),
      major,
    };
  });

  const top = spokes.filter((s) => s.kind === "selected").sort((a, b) => b.length - a.length)[0]!;

  return { size, center, ring, inner, spokes, ticks, selectedTip: { x: top.x2, y: top.y2, angle: top.angle } };
}

/* ------------------------------------------------------------------
   ALX 002 — a mesma convenção colada em muitas conversas.
   A primeira linha é a fonte aprovada; cada cópia se afasta um pouco mais.
   ------------------------------------------------------------------ */

export interface Ridge {
  aligned: string;
  drifted: string;
  fillAligned: string;
  fillDrifted: string;
  source: boolean;
}

export function ridgelines(seed = 391, lines = 24, points = 96): { width: number; height: number; ridges: Ridge[] } {
  const width = 960;
  const step = 17;
  const top = 96;
  const height = top + (lines - 1) * step + 40;
  const random = seeded(seed);

  // Assinatura do documento: o mesmo relevo em todas as cópias.
  const signature = Array.from({ length: points }, (_, p) => {
    const x = p / (points - 1);
    const envelope = Math.exp(-((x - 0.5) ** 2) / 0.022);
    return envelope * (0.55 + 0.45 * Math.sin(x * 38) * Math.sin(x * 11 + 1.3));
  });

  const ridges: Ridge[] = [];
  for (let l = 0; l < lines; l++) {
    const base = top + l * step;
    const drift = l / (lines - 1);
    const offset = Math.round(drift * drift * 9 * (random() > 0.5 ? 1 : -1));
    const aligned: string[] = [];
    const drifted: string[] = [];
    for (let p = 0; p < points; p++) {
      const x = r2((p / (points - 1)) * width);
      const sig = signature[p]!;
      const shifted = signature[Math.min(points - 1, Math.max(0, p + offset))]!;
      const noise = (random() - 0.5) * (0.06 + drift * 0.75);
      const ya = base - sig * 62;
      const yd = base - (shifted * (1 - drift * 0.35) + noise * (0.4 + shifted)) * 62;
      aligned.push(`${p === 0 ? "M" : "L"}${x} ${r2(ya)}`);
      drifted.push(`${p === 0 ? "M" : "L"}${x} ${r2(yd)}`);
    }
    const close = ` L${width} ${height} L0 ${height} Z`;
    ridges.push({
      aligned: aligned.join(" "),
      drifted: drifted.join(" "),
      fillAligned: aligned.join(" ") + close,
      fillDrifted: drifted.join(" ") + close,
      source: l === 0,
    });
  }
  return { width, height, ridges };
}

/* ------------------------------------------------------------------
   Pequenos glifos radiais para o mecanismo e as interfaces.
   ------------------------------------------------------------------ */

export function glyphSpokes(seed: number, count: number, c = 60, min = 8, max = 52) {
  const random = seeded(seed);
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    const len = min + random() * (max - min);
    return {
      a,
      len: r2(len),
      x1: r2(c + Math.cos(a) * 4),
      y1: r2(c + Math.sin(a) * 4),
      x2: r2(c + Math.cos(a) * len),
      y2: r2(c + Math.sin(a) * len),
    };
  });
}

export function polar(c: number, r: number, a: number) {
  return { x: r2(c + Math.cos(a) * r), y: r2(c + Math.sin(a) * r) };
}
