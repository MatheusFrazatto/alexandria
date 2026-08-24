# Alexandria Site

Landing page pública e estática do Alexandria, criada para explicar o produto com responsabilidade, rastreabilidade e determinismo.

O artefato publicável vive em `docs/` e não depende de framework, runtime, analytics, formulários ou JavaScript cliente. A estrutura é compatível com GitHub Pages usando uma fonte de publicação por branch em `/docs`.

## Desenvolvimento local

```bash
npm test
npm run build
npm run audit
python3 -m http.server 4173 --directory docs
```

Abra `http://127.0.0.1:4173/` para revisar o site.

`npm run audit` verifica contraste, estrutura responsiva, pseudolocalização com
expansão mínima de 30% e o orçamento de carregamento do conteúdo principal. A
auditoria registra quando a confirmação visual em navegador ainda é necessária.

## Publicação

Este repositório local ainda não possui remote configurado. A implementação não cria workflow, não altera configurações do GitHub Pages e não publica. Conectar o repositório, enviar commits ou ativar `/docs` como fonte exige autorização explícita separada.

## Tipografia

A interface incorpora localmente a fonte variável Manrope, distribuída sob SIL Open Font License 1.1. A licença acompanha o arquivo em `docs/assets/fonts/OFL.txt`.
