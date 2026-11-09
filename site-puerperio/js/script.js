/* Fernanda Rodrigues — Configuração para publicação
 * Insira o número PROFISSIONAL confirmado, somente dígitos com DDI+DDD.
 * Nunca substituir por telefone de terceiros ou números não validados.
 * Exemplo de formato (não é telefone real): 55DDDNÚMERO.
 */
const WHATSAPP_NUMBER = '5511988323140';
const WHATSAPP_TEXT = 'Olá, Fernanda! Conheci seu trabalho pela página sobre gestação e puerpério. Gostaria de saber mais sobre o acompanhamento e como funcionam as sessões online.';

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

const contactDialog = document.querySelector('#contact-dialog');
document.querySelectorAll('.contact-trigger').forEach(link => {
  link.addEventListener('click', evt => {
    const number = WHATSAPP_NUMBER.replace(/\D/g,'');
    evt.preventDefault();
    if (number.length >= 12 && number.length <= 15) {
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(WHATSAPP_TEXT)}`, '_blank', 'noopener,noreferrer');
    } else if (contactDialog && typeof contactDialog.showModal === 'function') {
      contactDialog.showModal();
    } else {
      alert('Configure o número profissional do WhatsApp no arquivo js/script.js.');
    }
  });
});
if(contactDialog) {
  const close = contactDialog.querySelector('[data-dialog-close]');
  if(close) close.addEventListener('click', () => contactDialog.close());
  contactDialog.addEventListener('click', evt => {if (evt.target === contactDialog) contactDialog.close();});
}
const copyButton = document.querySelector('#copy-message');
if(copyButton) copyButton.addEventListener('click', async () => {
  const feedback = document.querySelector('#copy-feedback');
  try {
    await navigator.clipboard.writeText(WHATSAPP_TEXT);
    feedback.textContent = 'Mensagem copiada.';
  } catch(e) {
    feedback.textContent = 'Se a cópia automática estiver bloqueada, selecione a mensagem acima e copie manualmente.';
  }
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
