/*
  CONFIGURAÇÃO DE PUBLICAÇÃO
  Preencha o número profissional confirmado pela Fernanda, apenas dígitos,
  com código do país e DDD. Ex.: '55' + '11' + '9xxxxxxxx'.
  Não use número de agência ou de terceiros.
  Defina GESTATION_URL somente quando a outra página estiver publicada.
*/
const WHATSAPP_NUMBER = '5511988323140';
const GESTATION_URL = '';
const WA_MESSAGE = 'Olá, Fernanda! Conheci seu site e gostaria de saber mais sobre o atendimento de psicanálise online. Poderia me explicar como funciona e quais são as condições?';

const nav = document.querySelector('#main-nav');
const menuToggle = document.querySelector('#menu-toggle');
const contactDialog = document.querySelector('#contact-dialog');
const pageDialog = document.querySelector('#page-dialog');
const pageLink = document.querySelector('#gestation-link');

function openDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

function closeNav() {
  nav?.classList.remove('nav--open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  if (menuToggle) menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
}
menuToggle?.addEventListener('click', () => {
  const open = !nav.classList.contains('nav--open');
  nav.classList.toggle('nav--open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
});
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', closeNav));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeNav(); });

// Todos os botões usam a mesma mensagem exata da copy aprovada.
document.querySelectorAll('.js-whatsapp').forEach(link => {
  if (/^\d{12,15}$/.test(WHATSAPP_NUMBER)) {
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  } else {
    link.addEventListener('click', event => { event.preventDefault(); openDialog(contactDialog); });
  }
});

document.querySelectorAll('#gestation-link, .js-gestation').forEach(btn => btn.addEventListener('click', (event) => {
  event.preventDefault();
  closeNav();
  if (GESTATION_URL.trim()) window.location.href = GESTATION_URL.trim();
  else openDialog(pageDialog);
}));
document.querySelectorAll('.dialog-dismiss').forEach(btn => btn.addEventListener('click', () => pageDialog?.close()));

const copyButton = document.querySelector('#copy-message');
copyButton?.addEventListener('click', async () => {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(WA_MESSAGE);
    else {
      const input = document.createElement('textarea'); input.value = WA_MESSAGE;
      input.style.position='fixed'; input.style.opacity='0'; document.body.appendChild(input);
      input.select(); document.execCommand('copy'); input.remove();
    }
    copyButton.textContent = 'Mensagem copiada';
  } catch {
    copyButton.textContent = 'Selecione e copie a mensagem acima';
  }
});

// Botão central abre/fecha todas as quatro descrições, e cada cartão é acionável individualmente.
const processEntries = [...document.querySelectorAll('.process-item')];
const processAll = document.querySelector('#process-all');
function updateProcessButton() {
  const allOpen = processEntries.every(entry => entry.open);
  processAll?.setAttribute('aria-expanded', String(allOpen));
  const label = processAll?.querySelector('span');
  if (label) label.textContent = allOpen ? 'Ocultar detalhes' : 'Ver mais detalhes';
}
processAll?.addEventListener('click', () => {
  const shouldOpen = !processEntries.every(entry => entry.open);
  processEntries.forEach(entry => { entry.open = shouldOpen; });
  updateProcessButton();
});
processEntries.forEach(entry => entry.addEventListener('toggle', updateProcessButton));

// Acordeões independentes e utilizáveis por teclado; cada resposta permanece no HTML.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(items => items.forEach(item => {
    if (item.isIntersecting) { item.target.classList.add('visible'); io.unobserve(item.target); }
  }), { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(element => io.observe(element));
} else document.querySelectorAll('[data-reveal]').forEach(element => element.classList.add('visible'));

const navLinks = [...document.querySelectorAll('.nav-link')];
if ('IntersectionObserver' in window) {
  const sections = ['inicio','psicanalise','atendimento','sobre','duvidas']
    .map(id => document.getElementById(id)).filter(Boolean);
  const spy = new IntersectionObserver(items => items.forEach(item => {
    if (!item.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === '#'+item.target.id));
  }), { rootMargin: '-25% 0px -58% 0px', threshold: 0 });
  sections.forEach(section => spy.observe(section));
}

// Cards de benefícios e etapas do atendimento ficam sempre abertos (layout fixo)
document.querySelectorAll('.benefit > summary, .process-item > summary').forEach(summary =>
  summary.addEventListener('click', event => event.preventDefault()));

// Garante a classe "js" (também definida no <head>) usada pelas animações de entrada
document.documentElement.classList.add('js');

// Botões "Ver mais" (só aparecem no celular): mostram ou escondem os parágrafos 2 e 3 de cada bloco.
document.querySelectorAll('.ver-mais').forEach(botao => {
  botao.addEventListener('click', () => {
    const bloco = botao.closest('[data-mais]');
    if (!bloco) return;
    const aberto = bloco.classList.toggle('mais-aberto');
    botao.setAttribute('aria-expanded', String(aberto));
    const rotulo = botao.querySelector('span');
    if (rotulo) rotulo.textContent = aberto ? 'Ver menos' : 'Ver mais';
  });
});
document.querySelectorAll('.faq-item').forEach(function (item) {
  item.addEventListener('toggle', function () {
    if (!item.open) return;
    document.querySelectorAll('.faq-item[open]').forEach(function (o) { if (o !== item) o.open = false; });
  });
});
