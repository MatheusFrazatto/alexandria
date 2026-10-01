// Movimento do catálogo. Melhoria progressiva: o HTML já chega no estado final;
// este módulo só anima a partir dele. Sem JS, ou com movimento reduzido, nada fica escondido.
import { animate, createDrawable, createSeededRandom, createTimeline, onScroll, splitText, stagger, utils } from "animejs";

const root = document.documentElement;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const motion = !reduceMotion.matches;

function safely(label: string, setup: () => void) {
  try {
    setup();
  } catch (error) {
    console.warn(`[alexandria] ${label}:`, error);
  }
}

// Valores por elemento no formato que o anime.js espera (alvo opcional).
const per =
  <R extends number | string | Array<number | string>>(f: (el: Element) => R) =>
  (target?: unknown) =>
    f(target as Element);

const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => scope.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(sel));

root.dataset.enhanced = "";
if (motion) root.dataset.motion = "";

/** Os dígitos de um número de catálogo giram e se acertam da esquerda para a direita. */
function decodeNumber(el: HTMLElement, duration = 800, seed = 1908) {
  const final = el.textContent ?? "";
  const random = createSeededRandom(seed);
  const counter = { n: 0 };
  let index = -1;
  return animate(counter, {
    n: [0, 1],
    duration,
    ease: "linear",
    onUpdate: () => {
      index = 0;
      el.textContent =
        counter.n >= 1
          ? final
          : final.replace(/\d/g, (digit) => {
              const settle = 0.3 + index++ * 0.18;
              return counter.n > settle ? digit : String(Math.floor(random() * 10));
            });
    },
    onComplete: () => {
      el.textContent = final;
    },
  });
}

/* ------------------------------------------------------------------
   Abertura: a marca se desenha, o wordmark entra, ALX 000 → 001, a cortina sobe.
   ------------------------------------------------------------------ */
function playIntro(): Promise<void> {
  const intro = $("[data-intro]");
  if (!intro || !root.classList.contains("intro-on") || !motion) {
    intro?.remove();
    root.classList.remove("intro-on");
    return Promise.resolve();
  }
  root.dataset.introRunning = "";

  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      intro.remove();
      root.classList.remove("intro-on");
      delete root.dataset.introRunning;
      window.removeEventListener("keydown", skip);
      resolve();
    };
    const curtain = () =>
      animate(intro, {
        clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"],
        duration: 800,
        ease: "inOutExpo",
        onComplete: finish,
      });

    const strokes = $$<SVGPathElement>("[data-mark-stroke]", intro);
    const gem = $("[data-mark-gem]", intro);
    const no = $("[data-intro-no]", intro);
    const fill = $("[data-intro-fill]", intro);
    const label = $(".intro__label", intro);
    const wordmark = $("[data-wordmark]", intro);
    const { chars } = wordmark ? splitText(wordmark, { chars: { wrap: "clip" } }) : { chars: [] as HTMLElement[] };

    if (gem) {
      gem.style.transformBox = "fill-box";
      gem.style.transformOrigin = "50% 50%";
    }
    utils.set(chars, { translateY: "105%" });
    utils.set([no, label].filter(Boolean) as HTMLElement[], { opacity: 0 });

    const timeline = createTimeline({ defaults: { ease: "outExpo" }, onComplete: curtain })
      .add(createDrawable(strokes), { draw: ["0 0", "0 1"], duration: 900, delay: stagger(160), ease: "inOutQuart" }, 0)
      .add(gem ?? [], { scale: [0, 1], rotate: ["-90deg", "0deg"], duration: 600, ease: "outBack(2.4)" }, 650)
      .add(chars, { translateY: ["105%", "0%"], duration: 900, delay: stagger(32) }, 500)
      .add([no, label].filter(Boolean) as HTMLElement[], { opacity: [0, 1], duration: 500 }, 900)
      .add(fill ?? [], { scaleX: [0, 1], duration: 1000, ease: "inOutQuart" }, 900)
      .call(() => {
        if (!no) return;
        no.textContent = "ALX 001";
        decodeNumber(no, 900, 2026);
      }, 950);

    // Qualquer tecla ou clique pula a abertura.
    function skip() {
      timeline.pause();
      curtain();
    }
    window.addEventListener("keydown", skip, { once: true });
    intro.addEventListener("pointerdown", skip, { once: true });
  });
}

/* ------------------------------------------------------------------
   Faixa de código do cabeçalho: o bloco ativo acompanha a seção.
   ------------------------------------------------------------------ */
function setupStrip() {
  const strip = $(".strip");
  const links = $$<HTMLAnchorElement>("[data-strip-link]");
  const decode = $("[data-strip-decode]");
  const currentNo = $("[data-current-no]");
  const sections = $$("[data-section]");
  if (!strip || !links.length || !sections.length) return;

  let active = "";
  const label = (link: HTMLAnchorElement) => (link.dataset.no ? `${link.dataset.no} · ${link.dataset.name}` : link.dataset.name ?? "");
  const setDecode = (text: string) => {
    if (decode && decode.textContent !== text) decode.textContent = text;
  };

  const setActive = (id: string) => {
    if (id === active) return;
    active = id;
    for (const link of links) {
      const on = link.dataset.stripLink === id;
      if (!on) {
        link.removeAttribute("aria-current");
        continue;
      }
      link.setAttribute("aria-current", "true");
      setDecode(label(link));
      if (currentNo && currentNo.textContent !== link.dataset.no) {
        currentNo.textContent = link.dataset.no ?? "";
        if (motion) decodeNumber(currentNo, 500);
      }
    }
  };

  // A seção que cruza a linha de leitura (40% da altura) é a atual.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive((entry.target as HTMLElement).dataset.section ?? "");
      }
    },
    { rootMargin: "-40% 0px -59% 0px" },
  );
  sections.forEach((s) => observer.observe(s));

  // Decodificar ao apontar ou focar. O texto só volta quando o ponteiro sai da faixa inteira,
  // e a largura do rótulo é fixa: nada se desloca sob o cursor.
  const restore = () => {
    const current = links.find((l) => l.dataset.stripLink === active);
    if (current) setDecode(label(current));
  };
  for (const link of links) {
    link.addEventListener("pointerenter", () => setDecode(label(link)));
    link.addEventListener("focus", () => setDecode(label(link)));
    link.addEventListener("blur", restore);
  }
  strip.addEventListener("pointerleave", restore);
}

/* ------------------------------------------------------------------
   ALX 001 — o evento de consulta. O momento focal da página.
   ------------------------------------------------------------------ */
function setupQueryPlot(ready: Promise<void>) {
  const fig = $("[data-qplot]");
  if (!fig) return;

  const spokes = $$<SVGLineElement>(".spoke", fig);
  const live = spokes.filter((s) => s.dataset.kind !== "ghost");
  const ghosts = spokes.filter((s) => s.dataset.kind === "ghost");
  const chosen = spokes.filter((s) => s.dataset.kind === "selected");
  // Na abstenção nada fica azul, amarelo ou vermelho: a cor só descreve estado real.
  const flagged = spokes.filter((s) => s.dataset.kind !== "eligible" && s.dataset.kind !== "ghost");
  const plain = live.filter((s) => s.dataset.kind === "eligible");
  const tips = $$<SVGElement>("[data-tip]", fig);
  const ring = $<SVGCircleElement>("[data-qplot-ring]", fig);
  const ticks = $$<SVGLineElement>(".tick", fig);
  const sweep = $<SVGLineElement>("[data-qplot-sweep]", fig);
  const markStrokes = $$<SVGPathElement>("[data-qplot-core] [data-mark-stroke]", fig);
  const gem = $<SVGPathElement>("[data-qplot-core] [data-mark-gem]", fig);
  const pin = $("[data-qplot-pin] .qplot__pin-body", fig);
  const statusText = $("[data-qplot-status-text]", fig);
  const statusBlock = $("[data-qplot-status-block]", fig);
  const query = $("[data-qplot-query]");
  const toggle = $<HTMLButtonElement>("[data-qplot-toggle]");
  const toggleText = $("[data-qplot-toggle-text]");
  if (!ring || !pin || !statusText || !statusBlock || !query) return;

  // Raios crescem do centro: transform-box no view-box, origem no núcleo.
  for (const s of [...spokes, ...tips]) {
    s.style.transformBox = "view-box";
    s.style.transformOrigin = "50% 50%";
  }
  if (gem) {
    gem.style.transformBox = "fill-box";
    gem.style.transformOrigin = "50% 50%";
  }

  const setState = (state: "grounded" | "none") => {
    fig.dataset.state = state;
    statusText.textContent = state === "grounded" ? statusText.dataset.grounded ?? "" : statusText.dataset.none ?? "";
    statusBlock.dataset.state = state === "grounded" ? "approved" : "out";
    query.textContent = state === "grounded" ? query.dataset.a ?? "" : query.dataset.b ?? "";
  };

  if (!motion) return;

  const [ringDraw] = createDrawable(ring);
  const byLength = (el: Element) => Number((el as SVGLineElement).dataset.len ?? 0);

  // Estado de partida da entrada, aplicado só agora (o HTML segue no estado final sem JS).
  utils.set([...live, ...ghosts, ...tips], { scale: 0 });
  utils.set(ticks, { opacity: 0 });
  utils.set(pin, { opacity: 0 });
  if (gem) utils.set(gem, { scale: 0 });

  // Varredura contínua: o ponteiro percorre o acervo enquanto a consulta roda.
  const sweepLoop = sweep
    ? animate(sweep, { rotate: [0, 360], duration: 9000, ease: "linear", loop: true, autoplay: false })
    : null;

  const intro = () =>
    createTimeline({ defaults: { ease: "outExpo" } })
      .add(createDrawable(markStrokes), { draw: ["0 0", "0 1"], duration: 900, delay: stagger(120), ease: "inOutQuart" }, 0)
      .add(gem ?? [], { scale: [0, 1], duration: 500, ease: "outBack(2.4)" }, 500)
      .add(ticks, { opacity: [0, per((el) => (el.classList.contains("tick--major") ? 0.8 : 0.55))], duration: 900, delay: stagger(4) }, 100)
      .add(ringDraw!, { draw: ["0 0", "0 1"], duration: 1600, ease: "inOutQuart" }, 150)
      .add(live, { scale: [0, 1], duration: 1300, delay: stagger(4, { from: "first" }) }, 350)
      .add(ghosts, { scale: [0, 1], opacity: [0, 1], duration: 1100, delay: stagger(3, { from: "random", seed: 72 }) }, 800)
      .add(tips, { scale: [0, 1], duration: 600, ease: "outBack(2)", delay: stagger(80) }, 1600)
      .add(chosen, { strokeWidth: [1, 2.6], duration: 700 }, 1600)
      .add(pin, { opacity: [0, 1], translateX: [-12, 0], duration: 700 }, 1850)
      .call(() => {
        if (sweep) sweep.style.opacity = "0.55";
        if (!paused) sweepLoop?.play();
      }, 1600);

  // Abstenção: tudo recua para fantasma; o anel continua, vazio.
  const toNone = () =>
    createTimeline({ defaults: { ease: "outExpo", duration: 900 } })
      .add(pin, { opacity: 0, duration: 300 }, 0)
      .add(tips, { scale: 0, duration: 400 }, 0)
      .add(plain, { scale: per((el) => Math.max(0.12, 0.42 - byLength(el) / 2000)), opacity: 0.22, duration: 1100, delay: stagger(2) }, 120)
      .add(flagged, { scale: 0.2, duration: 600 }, 120)
      .add(ghosts, { opacity: 0.35 }, 120)
      .add(flagged, { opacity: 0, duration: 400 }, 120)
      .call(() => setState("none"), 300);

  const toGrounded = () =>
    createTimeline({ defaults: { ease: "outExpo" } })
      .call(() => setState("grounded"), 0)
      .add(live, { scale: 1, opacity: per((el) => (el.classList.contains("spoke--eligible") ? 0.7 : 1)), duration: 1200, delay: stagger(4) }, 0)
      .add(ghosts, { opacity: 1, duration: 900 }, 200)
      .add(tips, { scale: [0, 1], duration: 600, ease: "outBack(2)", delay: stagger(80) }, 900)
      .add(pin, { opacity: [0, 1], translateX: [-12, 0], duration: 600 }, 1100);

  let running: ReturnType<typeof createTimeline> | null = null;
  let timer = 0;
  let paused = false;
  let visible = true;
  let started = false;
  let state: "grounded" | "none" = "grounded";
  const HOLD = { grounded: 6400, none: 3800 };

  const schedule = () => {
    window.clearTimeout(timer);
    if (!started || paused || !visible || document.hidden) return;
    timer = window.setTimeout(() => {
      state = state === "grounded" ? "none" : "grounded";
      running = state === "none" ? toNone() : toGrounded();
      running.then(schedule);
    }, HOLD[state]);
  };

  ready.then(() => {
    started = true;
    running = intro();
    running.then(schedule);
  });

  const io = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting);
    if (visible) {
      schedule();
      if (started && !paused) sweepLoop?.play();
    } else {
      window.clearTimeout(timer);
      sweepLoop?.pause();
    }
  });
  io.observe(fig);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearTimeout(timer);
      sweepLoop?.pause();
    } else {
      schedule();
      if (started && !paused && visible) sweepLoop?.play();
    }
  });

  if (toggle && toggleText) {
    toggle.hidden = false;
    toggle.setAttribute("aria-pressed", "false");
    toggle.addEventListener("click", () => {
      paused = !paused;
      toggle.setAttribute("aria-pressed", String(paused));
      toggleText.textContent = paused ? toggle.dataset.play ?? "" : toggle.dataset.pause ?? "";
      if (paused) {
        window.clearTimeout(timer);
        running?.pause();
        sweepLoop?.pause();
      } else {
        running?.play();
        sweepLoop?.play();
        schedule();
      }
    });
  }
}

/* ------------------------------------------------------------------
   Entrada do hero: o wordmark sobe letra a letra, a linha de apoio se assenta.
   ------------------------------------------------------------------ */
function setupHeroCopy(ready: Promise<void>) {
  if (!motion) return;
  const wordmark = $<HTMLElement>(".hero [data-wordmark]");
  const strap = $("[data-hero-strap]");
  const copy = $$("[data-hero-copy]");
  if (!wordmark || !strap) return;

  const { chars } = splitText(wordmark, { chars: { wrap: "clip" } });
  utils.set(chars, { translateY: "105%" });
  utils.set([strap, ...copy], { opacity: 0 });

  ready.then(() =>
    createTimeline({ defaults: { ease: "outExpo" } })
      .add(chars, { translateY: ["105%", "0%"], duration: 1100, delay: stagger(40) }, 0)
      .add(strap, { opacity: [0, 1], letterSpacing: ["0.6em", "0.3em"], duration: 1200 }, 300)
      .add(copy, { opacity: [0, 1], translateY: [12, 0], duration: 900, delay: stagger(110) }, 550),
  );
}

/* ------------------------------------------------------------------
   Entrada de cada seção: a linha se estende, o número se decodifica,
   a frase sobe linha a linha e as listas entram em cascata.
   ------------------------------------------------------------------ */
const LIST_ITEMS = [
  ".alts__row",
  ".step",
  ".sleeve",
  ".tenet",
  ".limit",
  ".ledger__row",
  ".colophon__row",
  ".dl__row",
  ".record:not([hidden])",
  ".problem__fig",
].join(", ");

function setupSections() {
  if (!motion) return;
  const sections = $$(".section");

  for (const section of sections) {
    const no = $<HTMLElement>(".cat-head__no", section);
    const name = $(".cat-head__name", section);
    const statements = $$<HTMLElement>(".statement, .status__statement, .dl__statement", section);
    const prose = $$(".prose, .problem__answer, .mechanism__foot, .roadmap__note, .legend", section);
    const items = $$(LIST_ITEMS, section);

    utils.set([...statements, ...prose, ...items, ...(name ? [name] : [])], { opacity: 0 });
    section.dataset.revealPending = "";
    (section as HTMLElement & { _reveal?: () => void })._reveal = () => {
      section.classList.add("is-in");
      const tl = createTimeline({ defaults: { ease: "outExpo" } });
      if (no) tl.call(() => decodeNumber(no, 700, no.textContent?.length ?? 7), 0);
      if (name) tl.add(name, { opacity: [0, 1], translateX: [-10, 0], duration: 800 }, 150);
      statements.forEach((statement, i) => {
        utils.set(statement, { opacity: 1 });
        const split = splitText(statement, { lines: { wrap: "clip" } });
        let played = false;
        split.addEffect(({ lines }) => {
          if (played) return;
          played = true;
          return animate(lines, { translateY: ["105%", "0%"], duration: 1000, delay: stagger(90, { start: 150 + i * 120 }), ease: "outExpo" });
        });
      });
      if (prose.length) tl.add(prose, { opacity: [0, 1], translateY: [14, 0], duration: 900, delay: stagger(80) }, 450);
      if (items.length) tl.add(items, { opacity: [0, 1], translateY: [18, 0], duration: 900, delay: stagger(70) }, 550);
    };
  }

  // Checagem por posição, não por evento de interseção: toda seção cujo topo já passou da
  // linha de leitura é revelada — inclusive as puladas por âncora ou rolagem muito rápida.
  let pending = [...sections];
  let queued = false;
  const check = () => {
    queued = false;
    const line = window.innerHeight * 0.82;
    pending = pending.filter((section) => {
      if (section.getBoundingClientRect().top > line) return true;
      const el = section as HTMLElement & { _reveal?: () => void };
      delete el.dataset.revealPending;
      el._reveal?.();
      return false;
    });
    if (!pending.length) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  };
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(check);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();
}

/* ------------------------------------------------------------------
   ALX 002 — as cópias se afastam da fonte enquanto se rola.
   ------------------------------------------------------------------ */
function setupRidges() {
  if (!motion) return;
  const fig = $("[data-ridges]");
  if (!fig) return;
  const paths = $$<SVGPathElement>("path[data-a]", fig);
  animate(paths, {
    d: per((el) => [(el as SVGPathElement).dataset.a!, (el as SVGPathElement).dataset.b!]),
    ease: "linear",
    autoplay: onScroll({ target: fig, enter: "end start", leave: "center center", sync: 0.25 }),
  });
}

/* ------------------------------------------------------------------
   ALX 003 — o trilho avança pelo pipeline; cada glifo se desenha ao chegar.
   ------------------------------------------------------------------ */
function setupSteps() {
  const steps = $("[data-steps]");
  if (!steps || !motion) return;
  const rail = $("[data-steps-rail]", steps);
  if (rail && getComputedStyle(rail.parentElement!).display !== "none") {
    animate(rail, {
      scaleX: [0, 1],
      ease: "linear",
      autoplay: onScroll({ target: steps, enter: "end start", leave: "center end", sync: 0.3 }),
    });
  }

  const drawIn = (scope: Element) => {
    const lines = $$<SVGGeometryElement>(".g-draw", scope);
    if (!lines.length) return;
    animate(createDrawable(lines), {
      draw: ["0 0", "0 1"],
      duration: 1300,
      delay: stagger(40, { start: 250 }),
      ease: "inOutQuad",
    });
  };

  const once = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        once.unobserve(entry.target);
        drawIn(entry.target);
      }
    },
    { rootMargin: "0px 0px -15% 0px" },
  );
  $$("[data-step], [data-sleeve]").forEach((el) => once.observe(el));
}

/* ------------------------------------------------------------------
   ALX 004 — abas acessíveis entre resposta fundamentada e abstenção.
   ------------------------------------------------------------------ */
function setupProof() {
  const tablist = $("[data-proof-tabs]");
  if (!tablist) return;
  const tabs = $$<HTMLButtonElement>("[data-proof-tab]", tablist);
  const panels = $$("[data-proof-panel]");
  tablist.hidden = false;

  const select = (key: string, focus = false, animateIn = true) => {
    for (const tab of tabs) {
      const on = tab.dataset.proofTab === key;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
    }
    let shown: HTMLElement | undefined;
    for (const panel of panels) {
      const on = panel.dataset.proofPanel === key;
      panel.hidden = !on;
      if (on) shown = panel;
    }
    if (shown && motion && animateIn) {
      utils.set(shown, { opacity: 1 });
      const rows = $$("[data-record-row], .record__query, .record__status, .record__none-text", shown);
      animate(rows, { opacity: [0, 1], translateY: [8, 0], duration: 500, delay: stagger(35), ease: "outExpo" });
    }
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab.dataset.proofTab!));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") return;
      event.preventDefault();
      const next =
        event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (i + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
      select(tabs[next]!.dataset.proofTab!, true);
    });
  });

  select("a", false, false);
}

/* ------------------------------------------------------------------
   ALX 007 — os blocos de estado do índice se acendem um a um.
   ------------------------------------------------------------------ */
function setupLedger() {
  if (!motion) return;
  const ledgers = $$("[data-ledger]");
  const once = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        once.unobserve(entry.target);
        const blocks = $$(".ledger__state .block", entry.target);
        animate(blocks, { scale: [0, 1], duration: 500, delay: stagger(70, { start: 500 }), ease: "outBack(2)" });
      }
    },
    { rootMargin: "0px 0px -20% 0px" },
  );
  ledgers.forEach((l) => once.observe(l));
}

/* ------------------------------------------------------------------
   Assinatura do rodapé: a marca se desenha e o slogan sobe quando chega.
   ------------------------------------------------------------------ */
function setupSign() {
  if (!motion) return;
  const sign = $("[data-sign]");
  if (!sign) return;
  const strokes = $$<SVGPathElement>("[data-mark-stroke]", sign);
  const line = $<HTMLElement>("[data-sign-line]", sign);
  if (line) utils.set(line, { opacity: 0 });
  const once = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      once.disconnect();
      animate(createDrawable(strokes), { draw: ["0 0", "0 1"], duration: 1100, delay: stagger(150), ease: "inOutQuart" });
      if (line) {
        utils.set(line, { opacity: 1 });
        const split = splitText(line, { lines: { wrap: "clip" } });
        let played = false;
        split.addEffect(({ lines }) => {
          if (played) return;
          played = true;
          return animate(lines, { translateY: ["105%", "0%"], duration: 1100, delay: stagger(110, { start: 250 }), ease: "outExpo" });
        });
      }
    },
    { rootMargin: "0px 0px -15% 0px" },
  );
  once.observe(sign);
}

let introDone: Promise<void> = Promise.resolve();
safely("intro", () => {
  introDone = playIntro();
});
safely("strip", setupStrip);
safely("hero copy", () => setupHeroCopy(introDone));
safely("query plot", () => setupQueryPlot(introDone));
safely("sections", setupSections);
safely("ridges", setupRidges);
safely("steps", setupSteps);
safely("proof", setupProof);
safely("ledger", setupLedger);
safely("sign", setupSign);
