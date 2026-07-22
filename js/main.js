/* =================================================================
   ORQUESTRA JOVEM · FÁBRICA DE SONHOS
   Comportamento — vanilla, modular, acessível.
   ================================================================= */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------------------------------------------------------------
     1 · PRELOADER — a cortina do teatro sobe
     --------------------------------------------------------------- */
  function raiseCurtain() {
    document.body.classList.remove('is-loading');
    document.body.classList.add('curtain-up');
    const curtain = $('#curtain');
    if (curtain) {
      setTimeout(() => curtain.remove(), 1400);
    }
  }
  const minShow = prefersReduced ? 200 : 1500;
  const start = performance.now();
  window.addEventListener('load', () => {
    const elapsed = performance.now() - start;
    setTimeout(raiseCurtain, Math.max(0, minShow - elapsed));
  });
  // Failsafe: nunca deixar a cortina presa
  setTimeout(raiseCurtain, 4000);

  /* ---------------------------------------------------------------
     2 · HEADER — recolhe ao rolar
     --------------------------------------------------------------- */
  const header = $('#header');
  const setHeaderState = () => {
    if (!header) return;
    header.dataset.state = window.scrollY > window.innerHeight * 0.7 ? 'scrolled' : 'top';
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  /* ---------------------------------------------------------------
     3 · MENU MÓVEL
     --------------------------------------------------------------- */
  const toggle = $('#menuToggle');
  const mobileMenu = $('#mobileMenu');
  if (toggle && mobileMenu) {
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      if (open) return closeMenu();
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fechar menu');
      mobileMenu.classList.add('is-open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
    $$('a', mobileMenu).forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMenu();
    });
  }

  /* ---------------------------------------------------------------
     4 · REVELAÇÕES POR SCROLL
     --------------------------------------------------------------- */
  const reveals = $$('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------------
     5 · HERO — slider cinematográfico
     --------------------------------------------------------------- */
  const slides = $$('.hero__slide');
  const dots = $$('.hero__dot');
  if (slides.length) {
    let index = 0;
    let timer = null;
    const DURATION = 7000;

    const go = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      dots.forEach((d, i) => {
        const active = i === index;
        d.classList.toggle('is-active', active);
        d.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    };

    const play = () => {
      if (prefersReduced) return;
      stop();
      timer = setInterval(() => go(index + 1), DURATION);
    };
    const stop = () => { if (timer) clearInterval(timer); };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { go(i); play(); });
    });

    // Pausa quando o hero sai da tela (economia + respeito)
    if ('IntersectionObserver' in window) {
      const heroIO = new IntersectionObserver(entries => {
        entries.forEach(e => (e.isIntersecting ? play() : stop()));
      }, { threshold: 0.2 });
      heroIO.observe($('#hero'));
    } else {
      play();
    }

    // Navegação por teclado nas cenas
    const controls = $('.hero__controls');
    if (controls) {
      controls.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { go(index + 1); play(); }
        if (e.key === 'ArrowLeft')  { go(index - 1); play(); }
      });
    }
  }

  /* ---------------------------------------------------------------
     6 · PARALLAX DISCRETO (hero content)
     --------------------------------------------------------------- */
  if (!prefersReduced) {
    const hero = $('#hero');
    let ticking = false;
    const parallax = () => {
      const y = window.scrollY;
      if (hero && y < window.innerHeight) {
        const active = $('.hero__slide.is-active .hero__content');
        if (active) active.style.transform = `translateY(${y * 0.18}px)`;
        active && (active.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.75))));
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { window.requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
  }

  /* ---------------------------------------------------------------
     7 · CONTADORES DE IMPACTO
     --------------------------------------------------------------- */
  const counters = $$('.stat__num');
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    if (prefersReduced) { el.textContent = target + suffix; return; }
    const dur = 1600;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length && 'IntersectionObserver' in window) {
    const cIO = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { runCounter(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => cIO.observe(c));
  } else {
    counters.forEach(runCounter);
  }

  /* ---------------------------------------------------------------
     8 · VÍDEO INSTITUCIONAL — placeholder de intenção
     --------------------------------------------------------------- */
  const play = $('.film__play');
  if (play) {
    play.addEventListener('click', () => {
      const label = $('.film__play-label', play);
      if (label) label.textContent = 'Vídeo em breve';
    });
  }

  /* ---------------------------------------------------------------
     9 · FORMULÁRIO DE CONTATO
     --------------------------------------------------------------- */
  const form = $('#contactForm');
  const status = $('#formStatus');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) {
        status.textContent = 'Por favor, preencha os campos obrigatórios.';
        form.reportValidity();
        return;
      }
      status.textContent = 'Obrigado. Sua mensagem foi recebida — responderemos em breve.';
      form.reset();
    });
  }

})();
