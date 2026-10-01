# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static output, TypeScript strict), built-in i18n with `pt-br` as the
default locale at `/` and `en` at `/en/`. anime.js v4 bundled from npm for
motion. Deploy target: GitHub Pages (static files only).

## Users

The site's reader is a technically capable professional on a small technical
team (roughly 3 to 30 people: consultancies, agencies, product teams, platform
squads) who already uses AI agents daily and keeps knowledge in Markdown inside
Git. They are evaluating whether Alexandria is worth following before any
download exists. They understand repositories and agents; they do not need
Alexandria's internal vocabulary to understand the offer.

## Product Purpose

The site explains what Alexandria is, what it already does in its Alpha, and
what it is planned to do next. Today it is informative only: there is no
public download, invite form, or contact channel. Over time it becomes the
place where people download Alexandria (a `/download` route exists from the
start and renders release entries when they appear).

Alexandria itself is a local-first, governed context layer for the AI agents a
team already uses. It turns approved Markdown in the team's own Git repository
into budgeted context with immutable provenance, freshness signals, and
verifiable citations, and it abstains when the repository does not support an
answer.

Success: a visitor leaves understanding the mechanism (approved source →
bounded context → revalidatable citation), why it differs from pasting files
into a prompt, and the honest current maturity.

## Positioning

Every AI tool built on documents assumes the documents are correct; Alexandria
knows when they may have stopped being correct. It competes first with copying
files into a prompt, a single ever-growing instruction file, a wiki
disconnected from the agent, and isolated AI notebooks. Its differentiators, in
order: governed context for existing agents; deterministic eligibility,
provenance, and answer shape; measurable context economy; freshness and
dependency signals; customer-owned infrastructure and model credentials.
Citation alone is not the differentiator: citation to an approved, immutable
version with ownership and validity is.

It is not a chat app, document editor, model host, wiki, hosted knowledge
service, or autonomous agent.

## Operating Context

- Documents and policy stay in the team's Git repository; Git is the authority.
- A local SQLite/FTS5 index is a disposable projection, never the source of truth.
- Surfaces: read-only MCP server over stdio (primary consumption), the `alx`
  CLI (curation and administration), and a thin desktop client (PySide6).
- Governed writes always preview an exact plan and require fresh human confirmation.
- No telemetry, daemon, updater, or hosted Alexandria service.

## Capabilities and Constraints

Implemented in the current Alpha (`0.5.0-alpha.7`, invite-only):

- deterministic search, browse, read, and citation validation with opaque
  citation handles, immutable commit and line-level provenance;
- eligibility filters for lifecycle, access, freshness, dependencies, and
  security quarantine; correct abstention when evidence is missing;
- governed lifecycle (init, new, adopt, ready, approve, renew, archive, reopen)
  with local review or a narrow GitHub pull-request adapter;
- local secret scanning and quarantine before indexing;
- optional AI aliases and advisory review, disabled by default;
- local usage estimates (not provider billing);
- unpublished Linux x86_64 AppImage for invited testers.

Planned for v1, stated without dates: a Windows per-user installer, onboarding
that reaches a first cited answer without a terminal, connection to supported
agent hosts once a compatibility matrix is recorded, and external validation on
the way to Beta.

Claim constraints: never call any build Beta, RC, Stable, production-ready, or
a supported host/model pairing. No customers, benchmarks, pricing, or dates.
Determinism governs retrieval, not the model's answer.

Source of truth for public facts: `README.md` and `PRODUCT.md` of the product
repository. Its `docs/` and `specs/` are private: paraphrase only, never copy
text or normative identifiers.

## Brand Commitments

- Name **Alexandria**; tagline “Don't let your library burn down”.
- The architectural-library mark (canonical SVG in the product repository at
  `alexandria/adapters/gui/assets/mark.svg`); the legacy generic book icon is
  not an Alexandria identity.
- Alexandria Blue `#016efa` as the trust color; Manrope (SIL OFL) as a brand face.
- Durable qualities: responsibility, traceability, restraint, determinism.
  Provenance and limitations are shown, never replaced by a request for trust.
- Maintainer attribution: “Matheus Frazatto” with a link to
  https://github.com/MatheusFrazatto.
- Bilingual: Brazilian Portuguese first, English second, same content.

## Evidence on Hand

None yet. No screenshots, real CLI/MCP output, testimonials, customers, or
metrics are to be shown until v1 matures. Every demonstration is authored and
visibly labeled as illustrative/fictional data. The previous
blueprint-style site, which this one replaces, served as reference only.

## Product Principles

1. Show the mechanism, don't ask for trust.
2. Be exact about maturity: what exists now versus what is planned.
3. The boundary is part of the product: say what Alexandria is not.
4. Privacy by construction: no analytics, cookies, forms, or third-party requests.
5. Content works without JavaScript or motion; motion explains, never gates.

## Accessibility & Inclusion

WCAG 2.2 AA: keyboard path with visible focus, skip link, sufficient contrast,
`prefers-reduced-motion` honored, full content without JavaScript, layouts that
survive 200% text and long Portuguese strings.
