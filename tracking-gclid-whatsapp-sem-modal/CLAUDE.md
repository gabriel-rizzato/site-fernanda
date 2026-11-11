# CLAUDE.md — tracking-gclid-whatsapp-sem-modal

Adaptação da v3 (projeto `track-gclid-botao-whatsapp`) para sites de WhatsApp sem
modal/formulário — o botão manda a mensagem direto pro WhatsApp no próprio clique,
usando a mensagem fixa já programada em `site-geral/script.js` e
`site-puerperio/js/script.js`, com um ticket de rastreamento embutido.

Não é uma versão nova da série v1→v2→v3 (que evoluem a mesma lógica genérica) —
é uma personalização pontual para clientes sem modal, por isso não leva número de
versão. Vive aqui (dentro do repositório `site-fernanda`) em vez do projeto
`track-gclid-botao-whatsapp` porque é específica dos dois sites deste repositório —
v1/v2/v3 continuam lá, genéricas.

## Por que essa adaptação

A v3 (`../../track-gclid-botao-whatsapp/gads-trackeamento-gclid-botao-whatsapp-v3/`) dispara
no *submit* de um modal com formulário (motivo/nome/mensagem) e grava esses três campos na
planilha. Sites sem modal não têm esse formulário, então esta variante:

- dispara no **clique do botão** (como a v2), não num submit;
- grava `lead_motivo`, `lead_nome` e `lead_mensagem` sempre como `"N/A"` — não há de onde
  ler esses dados;
- usa o **mesmo webhook (Apps Script) e a mesma planilha da v3** — só muda o nome da
  `aba` no payload. O `appscript-webhook-gclid-v3` já cria a aba automaticamente pelo
  campo `aba` do payload (`data.aba || "GCLID_SemCliente"`), então não é preciso
  implantar nada novo.

## Estrutura

```
tracking-gclid-whatsapp-sem-modal/
├── GCLID-01-captura-de-parametros.js         Tag GTM — captura URL params → localStorage (idêntica à v3)
└── GCLID-02-enviar-clique-wpp-para-sheets.js Tag GTM — envia tracking no clique do botão WPP (sem formulário)
```

## Fluxo de dados

1. Usuário chega na página com `?gclid=...` (ou `fbclid`, `ttclid`, `utm_*` etc.)
2. **GCLID-01** (DOM Pronto) captura os parâmetros → `localStorage`
3. Usuário clica em qualquer botão de WhatsApp da página
4. **GCLID-02** (Click trigger nos botões de WhatsApp) lê o `localStorage` →
   `sendBeacon` para o webhook v3 — em paralelo, o próprio clique já abre o `wa.me`
   (não depende do GTM pra isso: o envio do WhatsApp continua sendo feito pelo
   `script.js` de cada site, independente do GTM estar instalado ou não)
5. **appscript v3** recebe o POST e grava 16 colunas na aba `GCLID_fernanda`

## Instalação — Google Tag Manager

Pré-requisito: o GTM ainda precisa ser instalado nos sites da Fernanda (nenhum dos dois
tinha container até a criação destes arquivos) — criar o container, colar o snippet no
`<head>`/`<body>` de `site-geral/index.html` e `site-puerperio/index.html`.

### GCLID-01
- Tipo de tag: HTML Personalizada
- Acionador: DOM Pronto
- Conteúdo: colar `GCLID-01-captura-de-parametros.js` (envolvido em `<script>...</script>`)

### GCLID-02
- Tipo de tag: HTML Personalizada
- Acionador: criar novo acionador
  - Tipo: Cliques — Todos os Elementos
  - Aciona em: Alguns cliques
  - Condição: `Click Classes` — corresponde à RegEx — `js-whatsapp|contact-trigger`
    (`js-whatsapp` é a classe usada em `site-geral`, `contact-trigger` em `site-puerperio`;
    a RegEx cobre os dois mesmo se cada site tiver seu próprio container GTM)
- Conteúdo: colar `GCLID-02-enviar-clique-wpp-para-sheets.js` (envolvido em `<script>...</script>`)
- `URL_SCRIPT` já está preenchido com a URL do webhook v3 existente — não precisa trocar,
  a menos que o deploy do Apps Script mude

## Colunas da planilha — aba `GCLID_fernanda`

Mesmo schema de 16 colunas da v3 (ver `track-gclid-botao-whatsapp/gads-trackeamento-gclid-botao-whatsapp-v3/`,
no outro repositório), com `lead_motivo`, `lead_nome` e `lead_mensagem` sempre `"N/A"`.

## Configurações fixas

- Número WhatsApp: `5511988323140` (ambos os sites da Fernanda)
- Nome da aba: `GCLID_fernanda` (mesma planilha/Apps Script da v3, só uma aba nova)
- Webhook: reaproveita a URL já implantada para a v3 — nenhum deploy novo necessário
