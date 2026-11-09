const form = document.querySelector('#contact-form');
const errorBox = document.querySelector('#form-error');
const statusBox = document.querySelector('#form-status');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('input', (event) => {
  const field = event.target;
  if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;
  field.removeAttribute('aria-invalid');
  errorBox.hidden = true;
  statusBox.textContent = '';
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  errorBox.hidden = true;
  statusBox.textContent = '';

  const fields = [...form.querySelectorAll('input, textarea')];
  const invalid = fields.find((field) => !field.checkValidity());
  if (invalid) {
    invalid.setAttribute('aria-invalid', 'true');
    errorBox.textContent = invalid.validity.valueMissing
      ? 'Preencha este campo para continuar.'
      : invalid.validity.typeMismatch
        ? 'Confira se o e-mail está escrito corretamente.'
        : invalid.validity.tooShort
          ? 'Conte um pouco mais sobre o projeto (mínimo de 12 caracteres).'
          : 'Este campo passou do limite de caracteres.';
    errorBox.hidden = false;
    invalid.focus();
    return;
  }

  const data = new FormData(form);
  const subject = `Vamos conversar sobre ${data.get('brand')}`;
  const body = [
    `Olá! Meu nome é ${data.get('name')}.`,
    `Marca: ${data.get('brand')}`,
    `Segmento: ${data.get('segment')}`,
    `E-mail: ${data.get('email')}`,
    '',
    'Sobre meu projeto:',
    data.get('message'),
  ].join('\n');
  const mailto = `mailto:contato@vitorvalentino.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  submitButton.disabled = true;
  submitButton.textContent = 'Abrindo e-mail…';
  statusBox.textContent = 'Seu aplicativo de e-mail vai abrir com a mensagem pronta. Se isso não acontecer, escreva para contato@vitorvalentino.me.';
  window.location.href = mailto;
  window.setTimeout(() => {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Enviar <span aria-hidden="true">↗</span>';
  }, 1600);
});

document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('click', () => {
    const project = card.dataset.project;
    const brandInput = document.querySelector('#brand');
    const message = document.querySelector('#message');
    if (project && !brandInput.value) brandInput.value = project;
    if (project && !message.value) message.value = `Tenho interesse em conversar sobre um projeto inspirado no trabalho ${project}.`;
  });
});

// Revela conteúdo conforme entra na tela; sem IntersectionObserver, tudo fica visível.
const revealTargets = document.querySelectorAll('.section-heading, .project-card, .process-card, .contact-copy, .contact-form');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -35px 0px' });

  revealTargets.forEach((target, index) => {
    target.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 65}ms`);
    revealObserver.observe(target);
  });
}
