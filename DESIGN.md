---
name: Alexandria
description: "Don’t let your library burn down"
colors:
  matte-black: "#0b0b0b"
  black-raised: "#121211"
  ink: "#ecebe4"
  ink-2: "#b4b3ac"
  ink-3: "#8a8983"
  hairline: "#262624"
  hairline-strong: "#3a3a37"
  ghost: "#403f3c"
  grey-block: "#3a3a37"
  alexandria-blue: "#016efa"
  blue-text: "#5b9dff"
  signal-yellow: "#e3b521"
  signal-red: "#e0442f"
typography:
  display:
    fontFamily: "Saira Variable, Saira, Manrope Variable, sans-serif"
    fontSize: "clamp(3.75rem, 2rem + 5.2vw, 6rem)"
    fontWeight: 460
    lineHeight: 0.9
    letterSpacing: "0.1em"
    fontFeature: "tnum"
    fontVariation: "'wdth' 68"
  headline:
    fontFamily: "Saira Variable, Saira, Manrope Variable, sans-serif"
    fontSize: "clamp(2.75rem, 1.6rem + 4.2vw, 4.75rem)"
    fontWeight: 460
    lineHeight: 0.9
    letterSpacing: "0.09em"
    fontFeature: "tnum"
    fontVariation: "'wdth' 68"
  headline-caps:
    fontFamily: "Saira Variable, Saira, Manrope Variable, sans-serif"
    fontSize: "clamp(2.5rem, 1.2rem + 4.6vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 72"
  statement:
    fontFamily: "Manrope Variable, Manrope, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.1rem + 2.4vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Manrope Variable, Manrope, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Manrope Variable, Manrope, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "normal"
  label:
    fontFamily: "Saira Variable, Saira, Manrope Variable, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.26em"
    fontVariation: "'wdth' 112"
  label-sm:
    fontFamily: "Saira Variable, Saira, Manrope Variable, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.22em"
    fontVariation: "'wdth' 112"
  data:
    fontFamily: "Martian Mono Variable, Martian Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    letterSpacing: "0"
    fontFeature: "tnum"
rounded:
  none: "0px"
spacing:
  block-gap: "3px"
  gutter: "clamp(1rem, 3.2vw, 2.5rem)"
  column-gap: "clamp(1rem, 2vw, 2rem)"
  row-gap: "clamp(2.5rem, 5vw, 4rem)"
  section-y: "clamp(5rem, 11vw, 9.5rem)"
  max-width: "90rem"
components:
  action:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 1.4rem"
    height: "3.25rem"
  action-hover:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
  record-tab:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.none}"
    padding: "0 1.1rem"
    height: "2.75rem"
  record-tab-selected:
    textColor: "{colors.ink}"
  state-block:
    backgroundColor: "{colors.grey-block}"
    rounded: "{rounded.none}"
    size: "0.7rem"
  state-block-approved:
    backgroundColor: "{colors.alexandria-blue}"
  state-block-review:
    backgroundColor: "{colors.signal-yellow}"
  state-block-quarantine:
    backgroundColor: "{colors.signal-red}"
  state-block-plot:
    backgroundColor: "{colors.ink}"
  strip-block:
    backgroundColor: "{colors.grey-block}"
    rounded: "{rounded.none}"
    width: "1.55rem"
    height: "0.95rem"
  strip-block-current:
    backgroundColor: "{colors.alexandria-blue}"
  record:
    backgroundColor: "{colors.matte-black}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.none}"
    padding: "clamp(1.25rem, 2.5vw, 2rem)"
  sleeve-hover:
    backgroundColor: "{colors.black-raised}"
  citation-pin:
    backgroundColor: "{colors.matte-black}"
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    padding: "0.55rem 0.75rem"
  masthead:
    textColor: "{colors.ink-2}"
    height: "4rem"
  index-menu:
    backgroundColor: "{colors.black-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    width: "20rem"
---

# Design System: Alexandria

## Overview

**Creative North Star: "The Matte Black Catalog"**

The site is a record label's catalog printed on matte black. Every page, section, capability, release and evidence item is an entry with an ALX number, set in condensed Saira at the size a sleeve would carry it. Reading happens in Manrope, quietly, in a narrow column beside the number; handles, commits and commands are the only things that drop into Martian Mono. Most of the field is left unprinted. What is printed is hairline: 1px frames, 1px rules, 1px plot ink, square corners everywhere.

Color is never decoration. It is a state code, carried by small square blocks and by the strokes of the plots: Alexandria Blue means approved, eligible, current; signal yellow means review is due; signal red means quarantined; grey means draft or out of scope. Each section owns one figure drawn in the same radial grammar (seeded spokes, a closing budget ring, ghost spokes for ineligible evidence, one blue spoke carrying a pinned citation), so the figures read as a single series of pressings rather than illustrations. Motion explains the mechanism and then stops; the HTML ships already in its final state, and nothing depends on animation or JavaScript to be read.

The world deliberately rejects the developer-tool landing page: no terminal mock-ups, no glow, no feature-card grids, and none of the previous blueprint site's vocabulary.

**Key Characteristics:**
- Matte black field, warm off-white ink, three ink tiers, two hairline greys; dark only.
- ALX catalog numbers in condensed Saira as the primary typographic event of every section.
- Wide-tracked engraved caps for short labels; Manrope for anything that is read.
- Square state blocks as the only carriers of color; blue is the only trust color.
- Seeded radial plots in hairline ink: one figure per field.
- 1px frames and rules, zero radius, no shadows, depth by tone only.
- Motion is explanatory, pausable, and fully skipped under reduced motion.

## Colors

A near-neutral, slightly warm greyscale on matte black, with four signal colors that only ever mean a state.

### Primary
- **Alexandria Blue** (`alexandria-blue`): the brand's trust color and the only one. Fills the approved/eligible/current state block, the current block in the masthead code strip, the selected spoke and its citation tip in the query plot, the source ridge in the drift plot, the mechanism rail fill, the edge tab on actions and on the selected record tab, the citation pin's frame and leader rule, and text selection. It sits on less than a tenth of any viewport.
- **Blue Text** (`blue-text`): the same hue lifted for legibility on black. Used for any blue that is read as words: the problem section's answer line, the last row of a record (the validation verdict), the final mechanism step's data line, release channel labels, link hovers in the colophon and footer, focus outlines, and the caret.

### Secondary
- **Signal Yellow** (`signal-yellow`): review due, still eligible but flagged. State blocks, review spokes and tips in the query plot.
- **Signal Red** (`signal-red`): quarantined by the security scan. State blocks, quarantine spokes (always cut short inside the ring) and tips.

### Neutral
- **Matte Black** (`matte-black`): the page field, the html and body background, the fill behind the citation pin, the status chip under the plot, and the knock-out behind mechanism glyphs where the rail passes.
- **Raised Black** (`black-raised`): the only second surface. Hover fill on sleeves and catalog cells, and the background of the open index menu.
- **Ink** (`ink`): catalog numbers, headings, engraved caps, statements, strong text, plot ring and eligible spokes, and the "plot" state block.
- **Ink 2** (`ink-2`): body copy, section names under numbers, masthead links at rest, secondary captions.
- **Ink 3** (`ink-3`): metadata, definition-list terms, illustrative-data disclaimers, step numbers, ghost glyph strokes, the outline of the "planned" block, and the action's resting border.
- **Hairline** (`hairline`): section top rules, index-row rules, inner dividers.
- **Hairline Strong** (`hairline-strong`): frames (records, sleeves, mechanism band, language toggle, menu), outer rules of tenets and colophon, scrollbar thumb.
- **Ghost** (`ghost`): dashed ghost spokes in the query plot, evidence that exists but is not eligible.
- **Grey Block** (`grey-block`): the resting state block, draft or out of budget; the inactive blocks of every code strip.

### Named Rules
**The Color Is State Rule.** A color other than ink or grey appears only to state approval, review, quarantine, or currency. If a hue cannot be read as one of those four states, it does not belong on the page.

**The One Lit Block Rule.** In a positional code strip at most one block is lit and the rest stay grey: blue where the position is current or approved (masthead sections, catalog cells, the grounded record), Ink where it is only an index position (tenets). An all-grey strip is a statement in itself: the abstention record's strip has nothing lit. Legends and state columns may show several state colors at once because they are keys, not positions.

**The Readable Blue Rule.** Alexandria Blue fills and strokes; Blue Text speaks. Never set words in `alexandria-blue` on matte black (4.3:1); use `blue-text` (7.2:1).

## Typography

**Display Font:** Saira Variable (with Saira, Manrope Variable, sans-serif), self-hosted, driven on its `wdth` and `wght` axes
**Body Font:** Manrope Variable (with Manrope, system-ui, sans-serif), the brand face
**Label/Mono Font:** Martian Mono Variable (with Martian Mono, ui-monospace, monospace)

**Character:** Saira does two jobs at opposite ends of its width axis: condensed (wdth 68–80) for catalog numbers, expanded (wdth 112) and widely tracked for engraved caps. Manrope stays calm and humanist for everything a visitor actually reads. Martian Mono is reserved for the literal strings an engineer would copy.

### Hierarchy
- **Wordmark** (Manrope 500, tracking −0.035em, "Al" in Blue Text at 650): the brand name, never retyped in another face. Hero h1 at clamp 4–8.25rem (the one sanctioned break of the 6rem display cap: the product name is the cover); masthead 1.3rem; footer 1.6rem; opening 2.75–5rem.
- **Display** (Saira 460, wdth 68, tabular figures): ALX catalog numbers (section headlines clamp 2.75–4.75rem).
- **Headline** (Saira 460, wdth 68, clamp 2.75–4.75rem, line-height 0.9): the section catalog number. Number and section name together form one heading element; the name sits below it in engraved caps at 0.8125rem, tracking 0.28em, in Ink 2. Smaller catalog numbers (sleeves 2–2.75rem, records and next-cells 1.6–1.75rem, step and index numbers 1.15–1.5rem in Ink 3) use the same face and width.
- **Headline Caps** (Saira 400, wdth 72, uppercase, clamp 2.5–5.5rem, line-height 0.95, tracking 0.06em): the closing status statement and the download page's statement; the ledger's TODAY/NEXT titles at 2–3.25rem.
- **Statement** (Manrope 500, clamp 1.75–3rem, line-height 1.12, tracking −0.025em, balanced, max 22ch): the one-sentence claim that opens a section body.
- **Title** (Manrope 600, 1.1875rem, line-height 1.25): mechanism step names; Manrope 500 in Ink for row titles in index and ledger rows. Tenet names are the exception, set in Saira 400 caps at 1.125–1.4rem, tracking 0.12em.
- **Body** (Manrope 400, 1.0625rem, line-height 1.62, Ink 2, max 62ch, pretty wrapping): all prose. Hero lede at 1.125rem, max 46ch; secondary text at 0.9375rem.
- **Label** (Saira 500, wdth 112, 0.75rem, tracking 0.26em, uppercase, Ink): engraved caps for straplines, actions, legends titles, figure titles, badges, the masthead decode text. Masthead links at 0.6875rem / 0.24em.
- **Label Small** (Saira 500, wdth 112, 0.625rem, tracking 0.22em, uppercase, Ink 3): definition terms in records, colophon and release files; state captions.
- **Data** (Martian Mono, 0.8125rem, tabular, no ligatures): citation handles, commit hashes, file paths with line ranges, CLI commands, ledger numbers at 0.75rem.

### Named Rules
**The Engraved Caps Rule.** Wide-tracked caps are for labels of a few words, never running text. If it needs a second sentence, it is Manrope.

**The Number Is The Title Rule.** Every section's heading begins with its ALX number in condensed Saira; the human-readable name rides underneath as engraved caps inside the same heading element. No separate label floats above a heading.

**The Literal Strings Rule.** Martian Mono appears only for strings that exist verbatim in a repository or terminal: handles, commits, paths, commands. Never for labels or decoration.

## Layout

A 12-column grid (`column-gap` clamp 1–2rem) inside a 90rem container with a fluid gutter (clamp 1–2.5rem). Sections are separated by a 1px hairline at the top and generous vertical padding (`section-y`, clamp 5–9.5rem); the black between them is part of the design.

The canonical section split is a catalog column and a reading column: the heading spans columns 1–4, the body starts at column 5 and runs to the edge. Figures, sleeves, ledgers and mechanism bands break out to the full 12 columns, then secondary lists (alternatives, limits, colophon, download rows) return to start at column 5 with their own title in columns 1–4. Index rows use a fixed number column (5.5–7rem) beside a fluid text column, rules above each row and below the last.

The hero fills the first viewport below the 4rem masthead: copy on the left, the query plot on the right sized by height (`min(100%, 100svh − 22rem, 46rem)`) so the band of the next three catalog entries, as framed cells with their own number, name, strip and disc glyph, stays above the fold.

Responsive behavior, as built:
- At 1180px the masthead links collapse into an "Index" disclosure menu; the code strip stays centered.
- At 1080px the hero stacks in reading order: wordmark and strapline, then the plot, then lede, action, and legend. Proof records drop under their heading.
- At 960px every head/body split collapses to a single column; sleeves stack.
- At 760px the masthead becomes compact: smaller square strip blocks, no decode text; the current ALX number beside the mark is the strip's visible text equivalent.
- At 720–520px multi-column cells, records and colophon fall to one column; at 400px the strip blocks shrink to 0.5rem squares with 2px gaps.

**The Unprinted Black Rule.** Empty field is a material, not a gap to fill. Sections are separated by space and one hairline, never by bands of tinted background.

## Elevation & Depth

The system is flat. There are no drop shadows anywhere. Depth is conveyed by tone and line alone: matte black for the field, raised black for the one hover/open surface, and 1px frames in Hairline Strong to define a record, sleeve or menu. The single translucency is functional: the sticky masthead sits at 78% matte black with a 14px blur and reduced saturation (92% opaque without backdrop-filter support), so the plots scrolling beneath it never compete with the strip. The only inset line in the system is the 1px Ink 3 outline that draws the "planned" block, which is a drawn stroke, not a shadow.

**The Hairline Depth Rule.** A container is distinguished by a 1px line or by Raised Black, never by a shadow, glow, or gradient.

## Shapes

Every corner is square (0px radius): buttons, tabs, frames, menus, state blocks, plot tips. The recurring forms are the square (state blocks, square spoke tips for review and quarantine, the commit squares in glyphs), the hairline circle (plot ring, glyph rings, the disc), and the straight radial line. The only circle used as a fill is the selected evidence tip and the plot core. The Alpha badge's mark is a hairline square turned 45°, echoing the gem in the architectural mark. Dashes appear only to mean "present but not eligible" (ghost spokes, the empty download pressing).

**The Square Corner Rule.** Radius is zero everywhere. A rounded corner reads as a different product.

## Components

### Buttons
Outline catalog actions: quiet at rest, a blue tab on the edge when engaged.
- **Shape:** square corners (0px), 1px border in Ink 3, transparent fill, min-height 3.25rem, padding 0 1.4rem.
- **Primary (action):** engraved caps (Saira 500, 0.78rem, tracking 0.26em) in Ink, followed by a 24×12 hairline arrow.
- **Hover / Focus:** border brightens to Ink; a 0.6rem Alexandria Blue tab scales in from the right edge (scaleX 0→1, 0.35s, ease-out) and the arrow slides 0.35rem right. Focus also shows the global 2px Blue Text outline at 3px offset.
- **Secondary (figure toggle):** smaller outline control (Saira 0.625rem caps, 1px Hairline Strong) used to pause and resume the query plot; it is hidden until the script enables it.

### Record Tabs
- **Style:** outline tabs (1px Hairline Strong, min-height 2.75rem, Saira 0.6875rem caps in Ink 2) each carrying a small state block.
- **State:** selected tab turns Ink with an Ink border and a 0.4rem edge tab: Alexandria Blue for the grounded record, Ink 3 for the abstention record, because abstention is not approval. Tabs are progressive enhancement; without JavaScript both records render in sequence.

### State Blocks and Code Strips (signature)
- **Style:** solid squares (0.7rem default; 0.55–0.65rem inside rows and tabs), 3px apart, Grey Block at rest. Approved fills Alexandria Blue, review Signal Yellow, quarantine Signal Red, plot Ink; planned is an empty square outlined 1px in Ink 3.
- **Behavior:** in the masthead strip each section is a 1.55×0.95rem block; the block of the section crossing the 40% reading line lights blue and the current ALX number beside the mark updates. Hovering or focusing a block decodes it to "ALX 00N · NAME" in engraved caps; every block also carries a visually hidden text equivalent.

### Cards / Containers
- **Records** (proof): 1px Hairline Strong frame on matte black, padding clamp 1.25–2rem; a header row with the record's ALX number and state; a two-column definition table split by hairlines; the final row (validation) in Blue Text. The abstention record replaces the table with an intentionally empty field of at least 14rem.
- **Sleeves** (surfaces): three cells sharing one outer frame, separated by internal hairlines; number and engraved name top-left, glyph top-right, Mono command lines at the foot behind a hairline. Hover fills Raised Black (0.4s).
- **Catalog cells** (hero band): unframed cells divided by vertical hairlines, each with number, name, an 8-block strip with its own position lit, and a disc glyph.
- **Ledger** (roadmap): TODAY and NEXT as Headline Caps titles beside hairline rows of Mono number, state block, Manrope name, and text; NEXT titles and names drop to Ink 2.
- **Colophon and limits:** definition grids of hairline-topped rows; limits strike their name through in Ink 3.

### Navigation
The cover (hero) carries the wordmark and no catalog number; its figure is fig. ALX 000. Numbered entries start at ALX 001 (The problem) and run to ALX 007 (Status); releases occupy the 1xx series (ALX 100 is the release catalog). The masthead pairs the mark with the wordmark and the current ALX number after a hairline divider, hidden while on the cover. Below 760px the section strip gives way to the Index menu, which lists every ALX number in text. The strip's decode label has a fixed width so hovering never shifts the blocks under the pointer.

- **Masthead:** sticky, 4rem, three-column grid: architectural mark plus current ALX number left, code strip with decode text centered, catalog links (Saira 0.6875rem caps, Ink 2, Ink on hover) and a framed PT/EN toggle right. The current page link carries a 0.5rem blue square before it.
- **Index menu (≤1180px):** an "Index" summary in a 1px frame opens a Raised Black panel listing every section as number (condensed Saira, Ink 3) and name; rows hover to Hairline.

### Query Plot (signature)
The first viewport's figure and the template for every other figure. A seeded radial field (288 spokes) of hairline ink spokes grows outward from a budget ring; ticks mark the circumference. Ineligible evidence falls to dashed Ghost spokes; review and quarantine spokes take their signal colors and square tips; the one chosen spoke is Alexandria Blue (2.6 stroke) with a round tip and an HTML citation pin (Mono handle, path with line range, blue 1px frame, blue leader rule) that opens inward toward the field. A status chip under the ring pairs a state block with an engraved caption. The plot cycles grounded (held 6.4s) to abstention (held 3.8s): spokes collapse toward the core, the pin and tips disappear, the chip reports that nothing is documented. The cycle pauses off-screen, on hidden tabs and via the toggle; under reduced motion or without JavaScript the grounded state is shown, static and complete. Every plot is captioned as illustrative data.

### Glyphs
Small 120×120 radial marks in the same grammar (source rings with commit squares, approved spoke, budget ring, citation bracket, MCP rings, CLI rows, desktop frame, disc). Hairline Ink strokes with non-scaling width, dashed Ghost spokes, one blue element each. They draw in on entry and are always `aria-hidden`.

### Motion
One easing for UI state (`cubic-bezier(0.16, 1, 0.3, 1)`, 0.3–0.4s on borders, fills and tabs) and anime.js `outExpo` for choreography.

- **Opening** (first external visit only; skipped under reduced motion, back/forward, hash links and internal navigation; any key or click skips; a CSS failsafe hides it after 4.2s): the mark draws stroke by stroke, the gem turns into place, the wordmark rises letter by letter through clip masks, a blue hairline fills while the counter decodes to ALX 001, then the curtain lifts (clip-path, 0.8s inOutExpo).
- **Hero**: wordmark letters rise through clip masks (40ms stagger), the strapline's tracking settles from 0.6em to 0.3em, copy follows; the plot draws the core mark, closes the ring, blooms its spokes, and starts a 9s sweep hand that pauses with the figure.
- **Section entrance** (once, when the section top crosses 82% of the viewport, or immediately if it was skipped): the top hairline extends left to right, the ALX number decodes digit by digit, statements rise line by line through clip masks, prose and list rows cascade (70–80ms).
- **Continuity**: cross-document view transitions between pages; the masthead number decodes when the current section changes; catalog discs turn 120° on hover. Ridge drift and the mechanism rail are scroll-synced; proof rows and ledger blocks cascade once. Everything is skipped under `prefers-reduced-motion`, and the static HTML already shows the final state.

## Do's and Don'ts

### Do:
- **Do** give every new page, section, release or evidence item an ALX number in condensed Saira and make that number the start of its heading.
- **Do** use a square state block whenever a state is shown, and keep color tied to the four meanings: blue approved/current, yellow review due, red quarantined, grey draft or out.
- **Do** light at most one block in a positional strip, and always pair a strip with visible or visually hidden text.
- **Do** draw new figures in the radial hairline grammar (spokes, ring, ghosts, one blue line) and caption them as illustrative until real data exists.
- **Do** set Blue Text (`#5b9dff`) for blue words and focus outlines; keep `#016efa` for fills, strokes, and tabs.
- **Do** separate sections with one 1px hairline and the `section-y` padding, with headings in columns 1–4 and reading in columns 5–12.
- **Do** ship every animated element in its final state in HTML and skip the motion under reduced motion.
- **Do** use the canonical architectural-library mark as the only logo, rendered from its own SVG.

### Don't:
- **Don't** introduce a second trust color, a brand gradient, or any hue that does not encode a state; the gradient inside the canonical mark is the mark's own and stays there.
- **Don't** round corners, add drop shadows or glows, or tint section backgrounds.
- **Don't** set running text in engraved caps or Martian Mono.
- **Don't** add a separate label above a section heading; the catalog number is the heading's first line.
- **Don't** build terminal mock-ups, glowing hero effects, or icon-headed feature-card grids.
- **Don't** use dashed lines except to mean "present but not eligible" or "not yet pressed".
- **Don't** use the legacy generic book icon as an Alexandria identity.
