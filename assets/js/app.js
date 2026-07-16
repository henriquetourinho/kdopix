(() => {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const storage = {
    get(key, fallback = null) {
      try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
    }
  };
  const session = {
    get(key, fallback = null) {
      try { return sessionStorage.getItem(key) ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { sessionStorage.setItem(key, value); } catch { /* storage unavailable */ }
    }
  };

  // Broadcast scanline/vignette layers.
  const scanlines = document.createElement('div');
  scanlines.className = 'broadcast-scanlines';
  scanlines.setAttribute('aria-hidden', 'true');
  document.body.appendChild(scanlines);
  const vignette = document.createElement('div');
  vignette.className = 'broadcast-vignette';
  vignette.setAttribute('aria-hidden', 'true');
  document.body.appendChild(vignette);

  // Mobile navigation.
  const menuButton = $('[data-menu-toggle]');
  const menu = $('[data-menu]');
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    $$('.nav-link', menu).forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  // Live Salvador clock.
  const liveLabel = $('.live-label');
  if (liveLabel) {
    let clock = $('[data-broadcast-clock]', liveLabel);
    if (!clock) {
      clock = document.createElement('strong');
      clock.dataset.broadcastClock = '';
      liveLabel.append(' • ', clock);
    }
    const updateClock = () => {
      clock.textContent = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Bahia',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(new Date());
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // Global audio experience.
  const audio = $('#site-audio');
  const soundButton = $('[data-sound]');
  const audioSourceAttr = audio?.querySelector('source')?.getAttribute('src') || audio?.getAttribute('src') || '';
  const mediaUrl = (filename) => {
    if (audioSourceAttr) return new URL(filename, new URL(audioSourceAttr, document.baseURI)).href;
    return new URL(filename, document.baseURI).href;
  };
  let globalLoopStarted = false;

  const setSoundState = (playing) => {
    if (!soundButton) return;
    const icon = $('[data-sound-icon]', soundButton);
    const label = $('[data-sound-label]', soundButton);
    soundButton.classList.toggle('is-playing', playing);
    if (icon) icon.textContent = playing ? '▮▮' : '▶';
    if (label) label.textContent = playing ? 'Silenciar' : 'Áudio';
    storage.set('kdopix_audio', playing ? 'on' : 'off');
  };

  const playGlobalAudio = async () => {
    if (!audio) return false;
    try {
      audio.volume = 0.46;
      await audio.play();
      setSoundState(true);
      return true;
    } catch {
      setSoundState(false);
      return false;
    }
  };

  const pauseGlobalAudio = () => {
    if (!audio) return;
    audio.pause();
    setSoundState(false);
  };

  if (audio && soundButton) {
    soundButton.addEventListener('click', async () => {
      if (audio.paused) await playGlobalAudio();
      else pauseGlobalAudio();
    });
    audio.addEventListener('ended', async () => {
      if (!globalLoopStarted) {
        globalLoopStarted = true;
        audio.src = mediaUrl('policia.mp3');
        audio.loop = true;
        await playGlobalAudio();
      } else {
        setSoundState(false);
      }
    });
    audio.addEventListener('pause', () => {
      if (!audio.ended) setSoundState(false);
    });
  }

  // Immersive opening gate shown once per browser tab on the home page.
  const installGate = () => {
    if (!document.body.classList.contains('home-page') || session.get('kdopix_gate_seen')) return;
    const logo = $('.brand img')?.getAttribute('src') || 'assets/img/logo-kdopix.webp';
    const gate = document.createElement('div');
    gate.className = 'dossier-gate';
    gate.innerHTML = `
      <div class="dossier-gate-card" role="dialog" aria-modal="true" aria-labelledby="gate-title">
        <span>⚠ CONTEÚDO URGENTE • SALVADOR/BA</span>
        <img class="dossier-gate-logo" src="${logo}" alt="KD O PIX? — Dossiê independente">
        <h2 id="gate-title">A denúncia vai entrar no ar.</h2>
        <p>Sátira jornalística • fontes públicas • presunção de inocência</p>
        <div class="dossier-gate-actions">
          <button class="button button-primary" type="button" data-gate-enter>Entrar com áudio</button>
          <button class="button button-ghost" type="button" data-gate-silent>Entrar sem áudio</button>
        </div>
        <small>O áudio só começa após sua interação e pode ser silenciado no cabeçalho.</small>
      </div>`;
    document.body.appendChild(gate);
    document.body.classList.add('gate-open');

    const dismiss = async (withAudio) => {
      session.set('kdopix_gate_seen', '1');
      if (withAudio) await playGlobalAudio();
      gate.classList.add('is-leaving');
      document.body.classList.remove('gate-open');
      setTimeout(() => gate.remove(), 480);
    };
    $('[data-gate-enter]', gate)?.addEventListener('click', () => dismiss(true));
    $('[data-gate-silent]', gate)?.addEventListener('click', () => dismiss(false));
  };
  installGate();

  // LGPD / local preference popup.
  const cookieOverlay = $('[data-cookie-overlay]');
  if (cookieOverlay && !storage.get('kdopix_privacy_choice')) {
    cookieOverlay.hidden = false;
    if (!document.body.classList.contains('gate-open')) document.body.style.overflow = 'hidden';
  }
  const closeConsent = (value) => {
    storage.set('kdopix_privacy_choice', value);
    if (cookieOverlay) cookieOverlay.hidden = true;
    if (!document.body.classList.contains('gate-open')) document.body.style.overflow = '';
  };
  $('[data-cookie-accept]')?.addEventListener('click', () => closeConsent('essential'));
  $('[data-cookie-reject]')?.addEventListener('click', () => closeConsent('minimal'));

  // Back to top.
  const backTop = $('[data-back-top]');
  if (backTop) {
    const syncTopButton = () => backTop.classList.toggle('is-visible', window.scrollY > 700);
    window.addEventListener('scroll', syncTopButton, { passive: true });
    syncTopButton();
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Number animation.
  const counters = $$('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const format = (value, prefix = '') => `${prefix}${Math.round(value).toLocaleString('pt-BR')}`;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.target.dataset.done) return;
        entry.target.dataset.done = '1';
        const target = Number(entry.target.dataset.counter || 0);
        const prefix = entry.target.dataset.prefix || '';
        const start = performance.now();
        const duration = 1300;
        const tick = now => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 4);
          entry.target.textContent = format(target * eased, prefix);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.unobserve(entry.target);
      });
    }, { threshold: .35 });
    counters.forEach(counter => observer.observe(counter));
  }

  // Timeline filtering.
  const filterButtons = $$('[data-timeline-filter]');
  const timelineItems = $$('.timeline-item');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.timelineFilter;
    filterButtons.forEach(item => item.classList.toggle('is-active', item === button));
    timelineItems.forEach(item => {
      const phase = item.dataset.phase || '';
      let visible = filter === 'todos' || phase.includes(filter);
      if (filter === 'atual') visible = phase === 'atual' || phase === 'paralelo';
      item.hidden = !visible;
    });
  }));

  // People search.
  const peopleSearch = $('[data-people-search]');
  const peopleCards = $$('[data-person-card]');
  const peopleCount = $('[data-people-count]');
  if (peopleSearch) {
    peopleSearch.addEventListener('input', () => {
      const query = peopleSearch.value.trim().toLocaleLowerCase('pt-BR');
      let total = 0;
      peopleCards.forEach(card => {
        const visible = !query || (card.dataset.search || '').includes(query);
        card.hidden = !visible;
        if (visible) total += 1;
      });
      if (peopleCount) peopleCount.textContent = `${total} ${total === 1 ? 'resultado' : 'resultados'}`;
    });
  }

  // Person detail modal, with working local/server photo paths and preserved special audio.
  let personModal = null;
  let personAudio = null;

  const stopPersonAudio = () => {
    if (!personAudio) return;
    personAudio.pause();
    personAudio.currentTime = 0;
    personAudio = null;
  };

  const closePersonModal = () => {
    if (!personModal) return;
    const photo = $('[data-modal-photo]', personModal);
    photo?.classList.remove('is-expanded');
    personModal.hidden = true;
    document.body.classList.remove('has-modal');
    document.body.style.overflow = '';
    stopPersonAudio();
  };

  const ensurePersonModal = () => {
    if (personModal) return personModal;
    personModal = document.createElement('div');
    personModal.className = 'person-modal';
    personModal.hidden = true;
    personModal.innerHTML = `
      <article class="person-modal-card" role="dialog" aria-modal="true" aria-labelledby="person-modal-name">
        <button class="person-modal-close" type="button" aria-label="Fechar ficha">×</button>
        <img data-modal-photo alt="" title="Clique para ampliar a fotografia">
        <div class="person-modal-copy">
          <span data-modal-role></span>
          <h2 id="person-modal-name" data-modal-name></h2>
          <p data-modal-desc></p>
          <div class="person-audio-status" data-person-audio-status hidden><i></i><span>Áudio da ficha em reprodução</span></div>
          <small>Ficha editorial baseada nas fontes públicas do projeto. A condição de réu não equivale a condenação.</small>
        </div>
      </article>`;
    document.body.appendChild(personModal);
    $('.person-modal-close', personModal)?.addEventListener('click', closePersonModal);
    personModal.addEventListener('click', event => { if (event.target === personModal) closePersonModal(); });
    const modalPhoto = $('[data-modal-photo]', personModal);
    modalPhoto?.addEventListener('click', () => modalPhoto.classList.toggle('is-expanded'));
    return personModal;
  };

  const openPerson = async (button) => {
    let data = {};
    try { data = JSON.parse(button.dataset.personOpen || '{}'); } catch { return; }
    const card = button.closest('[data-person-card]');
    const cardPhoto = $('img', card || document);
    const rawPhoto = cardPhoto?.getAttribute('src') || data.photo || '';
    const photoUrl = cardPhoto?.currentSrc || (rawPhoto ? new URL(rawPhoto, document.baseURI).href : '');
    const dialog = ensurePersonModal();
    const modalPhoto = $('[data-modal-photo]', dialog);
    if (modalPhoto) {
      modalPhoto.src = photoUrl;
      modalPhoto.alt = `Imagem editorial de ${data.name || 'pessoa citada'}`;
      modalPhoto.onerror = () => {
        const fallback = cardPhoto?.getAttribute('data-fallback') || rawPhoto;
        if (fallback && modalPhoto.src !== new URL(fallback, document.baseURI).href) {
          modalPhoto.src = new URL(fallback, document.baseURI).href;
        }
      };
    }
    $('[data-modal-role]', dialog).textContent = data.role || '';
    $('[data-modal-name]', dialog).textContent = data.name || '';
    $('[data-modal-desc]', dialog).textContent = data.desc || '';

    stopPersonAudio();
    const status = $('[data-person-audio-status]', dialog);
    const audioFile = data.audio || ((data.id === '01' || data.id === '1') ? 'parar_de_cheirar.mp3' : '');
    if (audioFile) {
      try {
        personAudio = new Audio(mediaUrl(audioFile));
        personAudio.loop = true;
        personAudio.volume = .62;
        await personAudio.play();
        if (status) status.hidden = false;
      } catch {
        if (status) status.hidden = true;
      }
    } else if (status) {
      status.hidden = true;
    }

    dialog.hidden = false;
    document.body.classList.add('has-modal');
    document.body.style.overflow = 'hidden';
    $('.person-modal-close', dialog)?.focus();
  };

  $$('[data-person-open]').forEach(button => {
    button.addEventListener('click', () => openPerson(button));
    const cardPhoto = $('img', button.closest('[data-person-card]') || document);
    if (cardPhoto && !cardPhoto.dataset.personBound) {
      cardPhoto.dataset.personBound = '1';
      cardPhoto.tabIndex = 0;
      cardPhoto.setAttribute('role', 'button');
      cardPhoto.setAttribute('aria-label', `Abrir ficha e fotografia de ${JSON.parse(button.dataset.personOpen || '{}').name || 'pessoa citada'}`);
      cardPhoto.addEventListener('click', () => button.click());
      cardPhoto.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          button.click();
        }
      });
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && personModal && !personModal.hidden) closePersonModal();
  });

  // Real Google Maps location switcher.
  const mapFrame = $('[data-map-frame]');
  const mapButtons = $$('[data-map-location]');
  const mapTitle = $('[data-map-title]');
  const mapAddress = $('[data-map-address]');
  const mapExternal = $('[data-map-external]');
  const loadMapLocation = (button) => {
    if (!mapFrame || !button) return;
    const query = button.dataset.mapQuery || '';
    const title = button.dataset.mapTitle || '';
    const address = button.dataset.mapAddress || '';
    mapButtons.forEach(item => item.classList.toggle('is-active', item === button));
    mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    mapFrame.title = `Google Maps — ${title}`;
    if (mapTitle) mapTitle.textContent = title;
    if (mapAddress) mapAddress.textContent = address;
    if (mapExternal) mapExternal.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };
  mapButtons.forEach(button => button.addEventListener('click', () => loadMapLocation(button)));
  if (mapFrame && mapButtons.length) loadMapLocation(mapButtons.find(button => button.classList.contains('is-active')) || mapButtons[0]);

  // Decorative money evidence, capped for performance.
  if (document.body.classList.contains('home-page') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let activeMoney = 0;
    const spawnMoney = () => {
      if (document.hidden || activeMoney >= 7 || document.body.classList.contains('gate-open')) return;
      activeMoney += 1;
      const note = document.createElement('span');
      note.className = 'money-evidence';
      note.textContent = Math.random() > .35 ? '💸' : 'R$';
      note.style.left = `${Math.random() * 94}%`;
      note.style.setProperty('--drift', `${Math.round(Math.random() * 180 - 90)}px`);
      note.style.animationDuration = `${4.2 + Math.random() * 2.6}s`;
      document.body.appendChild(note);
      note.addEventListener('animationend', () => { note.remove(); activeMoney -= 1; }, { once: true });
    };
    setInterval(spawnMoney, 1250);
  }

})();

// Local preview adapter: clean directory URLs are preserved on the server,
// while direct file:// testing opens the corresponding index.html file.
if (window.location.protocol === 'file:') {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const rawHref = link.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) return;

    let url;
    try { url = new URL(rawHref, window.location.href); } catch { return; }
    if (url.protocol !== 'file:' || !url.pathname.endsWith('/')) return;
    event.preventDefault();
    window.location.href = new URL(`index.html${url.search}${url.hash}`, url).href;
  });
}
