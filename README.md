# Alexandria Site

Landing page pública do Alexandria, criada para explicar o produto com
responsabilidade, rastreabilidade e determinismo.

## Acesso

**Site:** [matheusfrazatto.github.io/alexandria](https://matheusfrazatto.github.io/alexandria/)

## Sobre o site

Alexandria é uma camada de contexto governado para agentes de IA. O produto
parte de versões aprovadas de documentos Markdown mantidas no Git da própria
equipe e entrega contexto delimitado, com proveniência e citações revalidáveis.

Esta landing page apresenta:

- o problema causado por contexto repetido, convenções inventadas e
  documentação desatualizada;
- o caminho entre a fonte governada e o contexto entregue ao agente;
- os princípios de responsabilidade, rastreabilidade e determinismo;
- o que Alexandria não pretende substituir;
- o estado atual do produto: Alpha por convite e ainda não indicado para
  produção.

A página é informativa. Não possui formulário, cadastro, download, analytics,
cookies, autenticação ou integração com terceiros.

## Tecnologias

### Site

- **HTML5 semântico:** conteúdo completo, landmarks e hierarquia acessível.
- **CSS moderno:** Grid, Flexbox, propriedades customizadas, tipografia fluida,
  breakpoints responsivos e suporte a `prefers-reduced-motion`.
- **Manrope Variable:** fonte incorporada localmente e distribuída sob a SIL
  Open Font License 1.1.
- **SVG e PNG locais:** identidade visual, favicon e imagem de compartilhamento
  sem dependências externas.
- **GitHub Pages:** publicação estática da pasta `docs/` na branch `main`.

O site não utiliza framework, JavaScript cliente ou dependência de runtime.

### Qualidade e verificação

- **Node.js 22+:** execução dos testes e validadores locais.
- **`node:test`:** testes de estrutura, conteúdo, identidade e regressão visual
  estática.
- **Validador do site:** verifica metadados, links, ativos, privacidade,
  integrações proibidas e claims públicos.
- **Auditoria de lançamento:** verifica contraste, estrutura responsiva,
  pseudolocalização com expansão mínima de 30% e orçamento de carregamento.

## Desenvolvimento assistido por IA

O projeto foi desenvolvido de forma colaborativa com **OpenAI Codex**, usando
skills especializadas como parte do processo de engenharia e design:

- **[Spec Kit](https://github.com/github/spec-kit):** constituição do projeto,
  especificação, planejamento, tarefas, rastreabilidade de requisitos e gates
  de implementação.
- **[Impeccable](https://github.com/pbakaus/impeccable):** direção visual,
  composição da landing page, tipografia, responsividade, acessibilidade,
  desempenho e refinamento de frontend.
- **Codex:** implementação assistida, testes, auditorias, revisão do artefato
  público e operações versionadas no repositório.

Essas ferramentas participam apenas do desenvolvimento. Nenhuma skill ou
serviço de IA é carregado pelo site em produção, e a página não envia dados de
visitantes para modelos ou APIs.

## Estrutura

```text
docs/                         # artefato publicado pelo GitHub Pages
├── index.html                # landing page
├── 404.html                  # página de erro pública
└── assets/                   # CSS, fontes e identidade visual
scripts/
├── validate-site.mjs         # validação estrutural e de segurança pública
└── audit-release.mjs         # acessibilidade, localização e desempenho
tests/
└── site.test.mjs             # testes de contrato e regressão
```

## Desenvolvimento local

Requer Node.js 22 ou superior e Python 3 para o servidor estático opcional.

```bash
npm test
npm run build
npm run audit
python3 -m http.server 4173 --directory docs
```

Abra `http://127.0.0.1:4173/` para revisar o site localmente.

## Publicação

O GitHub Pages publica diretamente `main/docs`, com HTTPS, em
[matheusfrazatto.github.io/alexandria-site](https://matheusfrazatto.github.io/alexandria-site/).
Não há pipeline de aplicação, servidor, banco de dados ou etapa de build em
produção.

## Tipografia

A interface incorpora localmente a fonte variável Manrope. A licença acompanha
o arquivo em `docs/assets/fonts/OFL.txt`.
