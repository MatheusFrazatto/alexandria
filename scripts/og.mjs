// Gera public/og.png (1200×630) a partir do hero renderizado — nenhuma imagem externa ou gerada por IA.
// Uso: npm run build && node scripts/og.mjs
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const port = 4331;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/astro/bin/astro.mjs", "preview", "--port", String(port), "--host", "127.0.0.1"], {
  stdio: "ignore",
});
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(base)).ok) break;
  } catch {}
  await new Promise((r) => setTimeout(r, 250));
}

const channel = process.env.CAPTURE_CHANNEL ?? (process.platform === "win32" ? "msedge" : undefined);
const browser = await chromium.launch(channel ? { channel } : {});
try {
  const page = await (await browser.newContext({ viewport: { width: 1200, height: 630 }, reducedMotion: "reduce" })).newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: `
      .masthead, .hero__next, .hero__legend, .hero__actions, .hero__tagline, .fig-caption { display: none !important; }
      .hero { min-height: 630px !important; }
      .hero__grid { min-height: 630px; padding-block: 48px !important; grid-template-columns: 1fr 1fr !important; }
      .hero__fig { width: 540px !important; }
    `,
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: "public/og.png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log("public/og.png");
} finally {
  await browser.close();
  server.kill();
}
