// Capturas de revisão: desktop 1440 e mobile 390, com o movimento de entrada já resolvido.
// Uso: npm run build && npm run capture [-- --base http://127.0.0.1:4321] [-- --variant reduced|nojs]
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};

const out = arg("out", ".impeccable/review");
const variant = arg("variant", "default");
const paths = (arg("paths", "/,/en/,/download/") ?? "").split(",");
let base = arg("base");
let server;

if (!base) {
  base = "http://127.0.0.1:4329";
  server = spawn(process.execPath, ["node_modules/astro/bin/astro.mjs", "preview", "--port", "4329", "--host", "127.0.0.1"], {
    stdio: "ignore",
  });
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(base);
      if (res.ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
}

mkdirSync(out, { recursive: true });

const channel = process.env.CAPTURE_CHANNEL ?? (process.platform === "win32" ? "msedge" : undefined);
const browser = await chromium.launch(channel ? { channel } : {});

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

try {
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      reducedMotion: variant === "reduced" ? "reduce" : "no-preference",
      javaScriptEnabled: variant !== "nojs",
    });
    const page = await context.newPage();
    for (const path of paths) {
      await page.goto(new URL(path, base).href, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      // Deixa a entrada do hero terminar antes da captura.
      await page.waitForTimeout(variant === "default" ? 6000 : 300);
      // Percorre a página para disparar observadores e voltar ao topo.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo({ top: y, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      await page.waitForTimeout(1600);
      const slug = path === "/" ? "home" : path.replace(/^\/|\/$/g, "").replace(/\//g, "-");
      const suffix = variant === "default" ? "" : `-${variant}`;
      const file = join(out, `${vp.name}${slug === "home" ? "" : `-${slug}`}${suffix}.png`);
      await page.screenshot({ path: file, fullPage: true });
      const first = join(out, `${vp.name}${slug === "home" ? "" : `-${slug}`}${suffix}-fold.png`);
      await page.screenshot({ path: first, fullPage: false });
      console.log(file);
    }
    await context.close();
  }
} finally {
  await browser.close();
  server?.kill();
}
