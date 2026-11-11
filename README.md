# Site Fernanda Rodrigues

Landing pages da psicanalista Fernanda Rodrigues.

| Pasta | Conteúdo |
|---|---|
| `site-geral/` | Página geral de psicanálise online (`index.html`, `styles.css`, `script.js`, `assets/`). |
| `site-puerperio/` | Página de gestação e puerpério, versão final (`index.html`, `css/style-v2.css`, `js/script.js`, `assets/`). |
| `tracking-gclid-whatsapp-sem-modal/` | Tags de GTM para rastrear gclid/fbclid/etc. até a planilha, prontas pra instalar quando o GTM for configurado nos dois sites. Ver o `CLAUDE.md` da pasta. |

Cada site (`site-geral/`, `site-puerperio/`) é um site estático independente: basta abrir o `index.html` no navegador ou publicar a pasta em qualquer hospedagem estática.
As fontes (DM Sans e Cormorant) são carregadas do Google Fonts.

Publicados no Vercel: https://site-fernanda-site-geral.vercel.app/ e https://site-fernanda-puerperio.vercel.app/

Pendências: confirmar o número de WhatsApp profissional, revisar as políticas de privacidade (texto de demonstração) e instalar o GTM nos dois sites para ativar o rastreamento de `tracking-gclid-whatsapp-sem-modal/`.
