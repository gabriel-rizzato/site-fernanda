// GCLID - Captura de Parâmetros (variante sem modal, baseada na v3)
// Ao colar no GTM, envolva o conteúdo com <script>...</script>
// Instalar no GTM: Tag HTML Personalizada | Acionador: DOM Pronto
// Idêntico à v3 (../../track-gclid-botao-whatsapp/gads-trackeamento-gclid-botao-whatsapp-v3/) —
// a captura não depende de ter modal ou não. Alterar sempre: nada.

(function() {

  function getParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  // Parâmetros Google Ads
  var gclid  = getParam('gclid');
  var gbraid = getParam('gbraid');
  var wbraid = getParam('wbraid');

  // Parâmetros de outras mídias
  var fbclid  = getParam('fbclid');
  var ttclid  = getParam('ttclid');
  var msclkid = getParam('msclkid');

  // Parâmetros UTM
  var utmSource       = getParam('utm_source');
  var utmMedium       = getParam('utm_medium');
  var utmCampaign     = getParam('utm_campaign');
  var utmTerm         = getParam('utm_term');
  var utmContent      = getParam('utm_content');
  var utmId           = getParam('utm_id');
  var utmCampaignId   = getParam('utm_campaign_id');
  var utmCampaignName = getParam('utm_campaign_name');
  var utmAdgroupId    = getParam('utm_adgroup_id');
  var utmAdgroupName  = getParam('utm_adgroup_name');
  var utmMatchtype    = getParam('utm_matchtype');
  var utmDevice       = getParam('utm_device');
  var network         = getParam('network');
  var placement       = getParam('placement');

  // Salvar no localStorage (apenas se o parâmetro existir na URL)
  if (gclid)           localStorage.setItem('gclid',              gclid);
  if (gbraid)          localStorage.setItem('gbraid',             gbraid);
  if (wbraid)          localStorage.setItem('wbraid',             wbraid);
  if (fbclid)          localStorage.setItem('fbclid',             fbclid);
  if (ttclid)          localStorage.setItem('ttclid',             ttclid);
  if (msclkid)         localStorage.setItem('msclkid',            msclkid);
  if (utmSource)       localStorage.setItem('utm_source',         utmSource);
  if (utmMedium)       localStorage.setItem('utm_medium',         utmMedium);
  if (utmCampaign)     localStorage.setItem('utm_campaign',       utmCampaign);
  if (utmTerm)         localStorage.setItem('utm_term',           utmTerm);
  if (utmContent)      localStorage.setItem('utm_content',        utmContent);
  if (utmId)           localStorage.setItem('utm_id',             utmId);
  if (utmCampaignId)   localStorage.setItem('utm_campaign_id',    utmCampaignId);
  if (utmCampaignName) localStorage.setItem('utm_campaign_name',  utmCampaignName);
  if (utmAdgroupId)    localStorage.setItem('utm_adgroup_id',     utmAdgroupId);
  if (utmAdgroupName)  localStorage.setItem('utm_adgroup_name',   utmAdgroupName);
  if (utmMatchtype)    localStorage.setItem('utm_matchtype',      utmMatchtype);
  if (utmDevice)       localStorage.setItem('utm_device',         utmDevice);
  if (network)         localStorage.setItem('network',            network);
  if (placement)       localStorage.setItem('placement',          placement);

  // Salvar URL e título da página de entrada
  if (!localStorage.getItem('page_url'))   localStorage.setItem('page_url',   window.location.href);
  if (!localStorage.getItem('page_title')) localStorage.setItem('page_title', document.title);

  console.log('[Eleva - Fernanda] Parâmetros capturados:', {
    gclid: gclid, gbraid: gbraid, wbraid: wbraid,
    fbclid: fbclid, ttclid: ttclid,
    utmSource: utmSource, utmMedium: utmMedium, utmCampaign: utmCampaign
  });

})();
