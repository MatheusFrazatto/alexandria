# Alexandria — site

Site público do [Alexandria](https://github.com/MatheusFrazatto), a camada de
contexto governado para agentes de IA. Explica o que o produto é, o que ele já
faz no Alpha e o que vem a seguir, e já tem a rota onde as versões serão
publicadas.

**Site:** [matheusfrazatto.github.io/alexandria](https://matheusfrazatto.github.io/alexandria/)

- `/` é o catálogo em português (padrão)
- `/en/` é o mesmo catálogo em inglês
- `/download/` e `/en/download/` formam o catálogo de versões, vazio enquanto não houver download público

O site é informativo: sem formulário, cadastro, analytics, cookies ou
requisições a terceiros.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | [Astro](https://astro.build) 7, saída estática, TypeScript strict |
| Idiomas | i18n nativo do Astro (`pt-br` padrão, `en`), dicionários tipados em `src/i18n/` |
| Movimento | [anime.js](https://animejs.com) 4 (MIT), empacotado do npm, sem CDN |
| Figuras | SVG generativo com semente fixa (`src/lib/plots.ts`), inspirado nas famílias radial e noise do [Book of Shapes](https://bookofshapes.com) e recriado em código próprio |
| Tipografia | Saira, Manrope e Martian Mono (SIL OFL 1.1), auto-hospedadas via `@fontsource-variable` |
| Qualidade | `astro check`, `node:test`, validador do artefato, Playwright (capturas) |
| Design | Skill [Impeccable](https://github.com/pbakaus/impeccable) (`.claude/skills/impeccable`) |
| Publicação | GitHub Pages via Actions (`.github/workflows/pages.yml`) |

## Direção visual

Identidade de catálogo de gravadora: cada página, seção, capacidade e versão
recebe um número **ALX**; uma figura ocupa cada campo; a informação é codificada
por número e cor. Fundo preto fosco, tinta branca em linhas finas e molduras de
1px. A faixa de blocos quadrados usa cor só para estado: azul Alexandria
(aprovado/elegível), amarelo (revisão vencida), vermelho (quarentena) e cinza
(rascunho ou fora do orçamento).

O momento focal é a figura ALX 001: uma consulta em que os trechos candidatos
brotam do centro, o anel do orçamento se fecha, a evidência aprovada sobe em
azul com a citação presa à fonte e, no ciclo seguinte, a consulta sem fonte
mostra a abstenção.

Contexto e decisões de design:

- [`PRODUCT.md`](PRODUCT.md) — verdade do produto e regras de afirmação pública
- [`DESIGN.md`](DESIGN.md) — o sistema visual como foi construído
- `.impeccable/surfaces/` — briefing da superfície e contrato de direção (só desenvolvimento; nunca vai para o site)

## Desenvolvimento

Requer Node.js 22.12 ou superior.

```bash
npm install
npm run dev        # http://localhost:4321
npm run check      # tipos
npm run build      # gera dist/
npm run validate   # valida o dist/: links, privacidade, afirmações, paridade PT/EN
npm test           # testes (inclui a validação quando dist/ existe)
npm run capture    # capturas 1440/390 em .impeccable/review/ (usa o Edge no Windows)
node scripts/og.mjs  # regenera public/og.png a partir do hero renderizado
```

`npm run capture` aceita `--variant reduced` (movimento reduzido) e
`--variant nojs` (JavaScript desligado). Em outro sistema, defina
`CAPTURE_CHANNEL` ou instale o Chromium do Playwright.

## Conteúdo

Toda a cópia está em `src/i18n/pt.ts` e `src/i18n/en.ts`, com a mesma
estrutura (os testes exigem). Ao editar:

- use só fatos públicos (README e PRODUCT.md do produto);
- não chame nenhuma versão de Beta, RC, Stable ou pronta para produção, e não
  invente clientes, métricas ou datas — o validador bloqueia;
- demonstrações são ilustrativas e devem continuar rotuladas como tal.

## Publicar uma versão

Quando houver download público, crie um arquivo em `src/content/releases/`
seguindo `src/content/releases/FORMAT.txt` (número `ALX 101`, `ALX 102`…,
arquivos com SHA-256 e notas nos dois idiomas) e marque `"published": true`.
O `/download` passa a listar a versão sem mudança de layout.

## Publicação

O workflow `pages.yml` compila, valida e testa em todo push e pull request, e
publica no GitHub Pages a partir da `main`. `SITE_URL` e `BASE_PATH` vêm do
próprio Pages, então o site funciona em domínio próprio ou em subcaminho
(`/<repositório>/`).

## Imagens

`public/og.png` é uma captura do hero renderizado pelo próprio site
(`scripts/og.mjs`); não há fotografia, imagem de banco ou imagem gerada por IA.

## Licenças

As licenças das fontes e do anime.js são publicadas em `public/licenses/`.

Mantido por [Matheus Frazatto](https://github.com/MatheusFrazatto).
