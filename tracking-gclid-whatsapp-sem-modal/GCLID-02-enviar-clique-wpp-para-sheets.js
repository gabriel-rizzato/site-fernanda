// GCLID - Enviar Clique WhatsApp para Sheets (variante sem modal, baseada na v3)
// Ao colar no GTM, envolva o conteúdo com <script>...</script>
//
// Instalar no GTM: Tag HTML Personalizada
// Acionador: Cliques — Todos os Elementos
//   Condição: Click Classes  corresponde à RegEx  js-whatsapp|contact-trigger
//   (cobre os dois sites da Fernanda; ajuste a RegEx se instalar em outro site sem modal)
//
// Diferença da v3 (../../track-gclid-botao-whatsapp/gads-trackeamento-gclid-botao-whatsapp-v3/):
// o site de destino não tem modal/formulário — o botão manda a mensagem direto pro
// WhatsApp no próprio clique. Por isso o disparo acontece no clique do botão
// (como na v2), não num submit de formulário, e lead_motivo/lead_nome/lead_mensagem
// ficam sempre "N/A" (não existe de onde ler esses dados).
// Usa o MESMO webhook/planilha da v3 — só muda a aba (ver CONFIG.ABA).
//
// Alterar por cliente: URL_SCRIPT, CONVERSION_SOURCE, ABA.

(function() {

  var CONFIG = {
    URL_SCRIPT:        'https://script.google.com/macros/s/AKfycbxaXoRrL_qFn-Rbnf9J3UWrgIszw9eHNaZou80ThDRIea5Prci8vk1aypnthzvBOPlm/exec',
    CONVERSION_SOURCE: 'whatsapp',
    ABA:               'GCLID_fernanda'
  };

  var payload = {
    aba:               CONFIG.ABA,
    conversion_source: CONFIG.CONVERSION_SOURCE,
    gclid:             localStorage.getItem('gclid')        || 'N/A',
    utm_source:        localStorage.getItem('utm_source')   || 'N/A',
    utm_medium:        localStorage.getItem('utm_medium')   || 'N/A',
    utm_campaign:      localStorage.getItem('utm_campaign') || 'N/A',
    utm_term:          localStorage.getItem('utm_term')     || 'N/A',
    utm_content:       localStorage.getItem('utm_content')  || 'N/A',
    utm_id:            localStorage.getItem('utm_id')       || 'N/A',
    fbclid:            localStorage.getItem('fbclid')       || 'N/A',
    ttclid:            localStorage.getItem('ttclid')       || 'N/A',
    page_url:          localStorage.getItem('page_url')     || window.location.href || 'N/A',
    page_title:        localStorage.getItem('page_title')   || document.title       || 'N/A',
    lead_motivo:       'N/A',
    lead_nome:         'N/A',
    lead_mensagem:     'N/A'
  };

  var hasAnyRelevantId =
    payload.gclid      !== 'N/A' ||
    payload.fbclid     !== 'N/A' ||
    payload.ttclid     !== 'N/A' ||
    payload.utm_source !== 'N/A';

  if (!hasAnyRelevantId) {
    console.log('[Eleva - Fernanda] Nenhum identificador de mídia encontrado — nada enviado.');
    return;
  }

  var blob = new Blob([JSON.stringify(payload)], { type: 'text/plain;charset=UTF-8' });
  var ok = navigator.sendBeacon(CONFIG.URL_SCRIPT, blob);

  console.log('[Eleva - Fernanda] sendBeacon enviado:', ok, payload);

})();
