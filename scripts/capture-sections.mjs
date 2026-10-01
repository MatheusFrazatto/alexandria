// Capturas por seção para revisão de detalhe: node scripts/capture-sections.mjs <saída> [largura]
import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";
const out = process.argv[2];
const width = Number(process.argv[3] ?? 1440);
const server = spawn(process.execPath, ["node_modules/astro/bin/astro.mjs","preview","--port","4330","--host","127.0.0.1"], { stdio: "ignore" });
for (let i=0;i<60;i++){ try{ if((await fetch("http://127.0.0.1:4330/")).ok) break;}catch{} await new Promise(r=>setTimeout(r,250)); }
const b = await chromium.launch({ channel: "msedge" });
const p = await (await b.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" })).newPage();
await p.goto("http://127.0.0.1:4330/", { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
const ids = ["problema","como-funciona","prova","interfaces","principios","hoje-e-proximo","estado"];
for (const id of ids) { await p.locator(`section#${id}`).screenshot({ path: `${out}/s-${width}-${id}.png` }); }
await p.locator("footer").screenshot({ path: `${out}/s-${width}-footer.png` });
await b.close(); server.kill(); console.log("ok");
