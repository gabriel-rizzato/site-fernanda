/* Fernanda Rodrigues — Configuração para publicação
 * Insira o número PROFISSIONAL confirmado, somente dígitos com DDI+DDD.
 * Nunca substituir por telefone de terceiros ou números não validados.
 * Exemplo de formato (não é telefone real): 55DDDNÚMERO.
 */
const WHATSAPP_NUMBER = '5511988323140';
const WHATSAPP_TEXT = 'Olá, Fernanda! Conheci seu trabalho pela página sobre gestação e puerpério. Gostaria de saber mais sobre o acompanhamento e como funcionam as sessões online.';

// Guarda gclid/fbclid/etc. da URL no localStorage para sobreviver a navegação dentro do site.
(function captureTrackingParams() {
  const params = new URLSearchParams(window.location.search);
  ['gclid', 'gbraid', 'wbraid', 'fbclid', 'ttclid', 'msclkid'].forEach(key => {
    const value = params.get(key);
    if (value) localStorage.setItem(key, value);
  });
})();

// Pega o primeiro click id disponível (URL ou localStorage) e devolve um ticket curto de 6
// caracteres para anexar na mensagem, sem poluir com o id completo (70+ caracteres).
function getTrackingTicket() {
  const params = new URLSearchParams(window.location.search);
  let rawId = null;
  for (const key of ['gclid', 'gbraid', 'wbraid', 'fbclid', 'ttclid', 'msclkid']) {
    const value = params.get(key) || localStorage.getItem(key);
    if (value) { rawId = value; break; }
  }
  return rawId && rawId.length > 26 ? rawId.slice(26, 32).toUpperCase() : null;
}

const nav = document.querySelector('#navegacao');
const navToggle = document.querySelector('.menu-toggle');
if (nav && navToggle) {
  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded','false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
  }));
}

document.querySelectorAll('.contact-trigger').forEach(link => {
  link.addEventListener('click', evt => {
    const number = WHATSAPP_NUMBER.replace(/\D/g,'');
    evt.preventDefault();
    if (number.length >= 12 && number.length <= 15) {
      const ticket = getTrackingTicket();
      const message = ticket ? `${WHATSAPP_TEXT}\n\n*id: ${ticket}*` : WHATSAPP_TEXT;
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    } else {
      alert('Configure o número profissional do WhatsApp no arquivo js/script.js.');
    }
  });
});

// Acessibilidade: mantém um painel educativo aberto de cada vez, sem remover conteúdos do HTML.
document.querySelectorAll('.education-grid .card-more').forEach(details => {
  details.addEventListener('toggle', () => {
    if(details.open) document.querySelectorAll('.education-grid .card-more').forEach(other => {
      if(other !== details) other.open = false;
    });
  });
});
// A mesma funcionalidade vale para as seis dúvidas; a leitura de apenas uma resposta por vez reduz ruído.
document.querySelectorAll('.faq-list details').forEach(details => {
  details.addEventListener('toggle', () => {
    if(details.open) document.querySelectorAll('.faq-list details').forEach(other => {
      if(other !== details) other.open = false;
    });
  });
});
const year = document.querySelector('#year');
if(year) year.textContent = String(new Date().getFullYear());

// Indica seção ativa na navegação, sem depender de biblioteca externa.
if ('IntersectionObserver' in window) {
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const observed = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const observer = new IntersectionObserver(entries => {
    const onscreen = entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
    if(!onscreen.length) return;
    const active = onscreen[0].target.id;
    navLinks.forEach(link => {
      const selected = link.getAttribute('href') === `#${active}`;
      link.classList.toggle('active', selected);
      if(selected) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  },{rootMargin:'-14% 0px -65% 0px',threshold:0});
  observed.forEach(section=>observer.observe(section));
}

// "Ver mais sobre essa fase": abre/fecha a caixa de texto completa fora da área da foto.
document.querySelectorAll('[data-expand]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const panel = document.getElementById(trigger.dataset.expand);
    if(!panel) return;
    const opening = panel.hidden;
    panel.hidden = !opening;
    document.querySelectorAll(`[data-expand="${panel.id}"][aria-expanded]`).forEach(btn => {
      btn.setAttribute('aria-expanded', String(opening));
      const label = btn.querySelector('span');
      if(label) label.textContent = opening ? 'Ver menos sobre essa fase' : 'Ver mais sobre essa fase';
    });
    if(opening) panel.scrollIntoView({behavior:'smooth', block:'nearest'});
    else document.querySelector(`[data-expand="${panel.id}"][aria-expanded]`)?.focus();
  });
});

// Movimento suave ao rolar: marca os blocos como "reveláveis" por aqui (o HTML não precisa mudar) e só dispara quando já estão visíveis.
// Sem animação para quem pediu "reduzir movimento"; sem JavaScript o conteúdo continua visível.
(() => {
  document.documentElement.classList.add('js');
  const blocos = ['.embrace-copy', '.edu-intro', '.edu-list', '.health-advice-copy', '.tp-intro', '.tp-grid', '.online-text', '.about-content', '.faq-heading', '.faq-list', '.closing-content'];
  const itens = [...document.querySelectorAll(blocos.join(','))];
  itens.forEach(item => item.setAttribute('data-reveal', ''));
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduzir) {
    const observador = new IntersectionObserver(entradas => entradas.forEach(entrada => {
      if (entrada.isIntersecting) { entrada.target.classList.add('visible'); observador.unobserve(entrada.target); }
    }), { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    itens.forEach(item => observador.observe(item));
  } else itens.forEach(item => item.classList.add('visible'));
})();

// Painel "Ver mais sobre essa fase" no celular: o conteúdo aparece em etapas (botões "Ver mais" discretos).
// No desktop os botões ficam ocultos por CSS e o painel mostra tudo de uma vez.
(() => {
  const box = document.querySelector('.fase-box');
  if(!box) return;
  box.querySelectorAll('[data-fase-next]').forEach(btn => {
    btn.addEventListener('click', () => { box.dataset.stage = btn.dataset.faseNext; });
  });
  document.querySelectorAll('[data-expand="fase-mais"]').forEach(btn => {
    btn.addEventListener('click', () => { box.dataset.stage = '0'; });
  });
})();
