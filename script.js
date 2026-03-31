// ============================================
// KD O PIX - JavaScript Module
// Author: Carlos Henrique Tourinho Santana
// ============================================

const CONFIG = {
    moneyInterval: 900,
    moneyLifetime: 4000,
    maxMoney: 12,
    audioFiles: {
        main: 'media/kdopix.mp3',
        loop: 'media/policia.mp3'
    }
};

const state = {
    moneyCount: 0,
    audioPlaying: false,
    modalOpen: false,
    suspectModalOpen: false,
    currentSuspectId: null,
    iframeLoaded: false,
    shareCount: 2847
};

// ============================================
// SUSPECT DATA
// ============================================
const SUSPECT_DATA = {
    "1": {
        name: "Marcelo Valter A. M. L. Castro",
        role: "LIDERANÇA",
        status: "EM LIBERDADE",
        photo: "media/perfil/juca.png",
        desc: "Repórter da Record TV Itapoan à época. Acusado pelo MP-BA de ser um dos líderes do esquema que desviava doações feitas via PIX por telespectadores do programa Balanço Geral."
    },
    "2": {
        name: "Jamerson Birindiba Oliveira",
        role: "LIDERANÇA",
        status: "EM LIBERDADE",
        photo: "media/perfil/janderson.png",
        desc: "Editor do programa Balanço Geral. Apontado como peça-chave na articulação e indicação das chaves PIX para o recebimento dos valores desviados das vítimas."
    },
    "3": {
        name: "Lucas Costa Santos",
        role: "INTERMEDIÁRIO",
        status: "EM LIBERDADE",
        photo: "media/perfil/padrao.png",
        desc: "Atuava como intermediário no fluxo financeiro do esquema, facilitando a movimentação dos valores obtidos de forma ilícita através das doações."
    },
    "4": {
        name: "Carlos Eduardo S. M. S. de Jesus",
        role: "ASSOCIADO",
        status: "EM LIBERDADE",
        photo: "media/perfil/padrao.png",
        desc: "Denunciado por participação na associação criminosa, disponibilizando meios para a execução dos estelionatos qualificados contra as vítimas do Pix."
    },
    "5": {
        name: "Jakson da Silva de Jesus",
        role: "ASSOCIADO",
        status: "EM LIBERDADE",
        photo: "media/perfil/padrao.png",
        desc: "Integrante do grupo denunciado pelo Ministério Público da Bahia. Envolvimento em crimes de estelionato e associação criminosa no caso das doações."
    },
    "6": {
        name: "Daniele Cristina S. Monteiro",
        role: "ASSOCIADO",
        status: "EM LIBERDADE",
        photo: "media/perfil/padrao.png",
        desc: "Apontada como parte do núcleo que auxiliava na lavagem ou ocultação dos valores desviados de pessoas em situação de vulnerabilidade."
    },
    "7": {
        name: "Debora Cristina S. Monteiro",
        role: "ASSOCIADO",
        status: "EM LIBERDADE",
        photo: "media/perfil/padrao.png",
        desc: "Denunciada pelo MP-BA por envolvimento no esquema de desvios. Responde por estelionato e participação em organização criminosa."
    },
    "8": {
        name: "Rute Cruz da Costa",
        role: "ASSOCIADO",
        status: "EM LIBERDADE",
        photo: "media/perfil/padrao.png",
        desc: "Acusada de emprestar contas ou facilitar a movimentação financeira da quadrilha que lucrava sobre a dor de crianças com câncer."
    },
    "9": {
        name: "Gerson Santos Santana Jr.",
        role: "ASSOCIADO",
        status: "EM LIBERDADE",
        photo: "media/perfil/padrao.png",
        desc: "Participante do esquema de fraude eletrônica. Um dos 12 réus que aguardam julgamento marcado para maio de 2026."
    },
    "10": {
        name: "Eneida Sena Couto",
        role: "ASSOCIADO",
        status: "EM LIBERDADE",
        photo: "media/perfil/padrao.png",
        desc: "Ré no processo criminal nº 74077. Acusada de integrar a rede de apoio financeiro que sustentava os desvios de Pix na Record TV."
    },
    "11": {
        name: "Thais Pacheco da Costa",
        role: "ASSOCIADO",
        status: "EM LIBERDADE",
        photo: "media/perfil/padrao.png",
        desc: "Denunciada pelo Ministério Público da Bahia. Envolvida no fluxo de transferências que retirava o dinheiro das vítimas reais."
    },
    "12": {
        name: "Alessandra S. Oliveira de Jesus",
        role: "ASSOCIADO",
        status: "EM LIBERDADE",
        photo: "media/perfil/padrao.png",
        desc: "Integrante da lista de réus do caso. Responde em liberdade por crimes de estelionato e associação para o crime."
    }
};

// ============================================
// CLOCK
// ============================================
function updateClock() {
    const el = document.getElementById('clock');
    if (!el) return;
    el.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateClock, 1000);
updateClock();

// ============================================
// ANIMATED COUNTERS
// ============================================
function animateCounter(el, target, duration, prefix, suffix, decimals) {
    if (!el) return;
    const start = performance.now();
    const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = target * eased;
        if (decimals) {
            el.textContent = prefix + val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + suffix;
        } else {
            el.textContent = prefix + Math.floor(val) + suffix;
        }
        if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

function startCounters() {
    animateCounter(document.getElementById('main-counter'), 407143.78, 2200, 'R$ ', '', true);
    setTimeout(() => animateCounter(document.getElementById('counter-reus'), 12, 1000, '', '', false), 300);
    setTimeout(() => animateCounter(document.getElementById('counter-adiamentos'), 3, 800, '', '×', false), 500);
    setTimeout(() => animateCounter(document.getElementById('counter-presos'), 1, 600, '', '', false), 700);
    setTimeout(() => animateCounter(document.getElementById('counter-ibope'), 85, 1200, '', '%', false), 900);
}

function animateShareCount() {
    const el = document.getElementById('share-num');
    if (!el) return;
    animateCounter(el, state.shareCount, 1800, '', '', false);
}

// ============================================
// MONEY RAIN
// ============================================
function createMoney() {
    if (state.moneyCount >= CONFIG.maxMoney) return;
    state.moneyCount++;
    const m = document.createElement('div');
    m.className = 'money';
    m.textContent = '💸';
    m.setAttribute('aria-hidden', 'true');
    m.style.left = Math.random() * 95 + 'vw';
    m.style.animationDuration = (Math.random() * 2 + 3) + 's';
    document.body.appendChild(m);
    setTimeout(() => { m.remove(); state.moneyCount--; }, CONFIG.moneyLifetime);
}
setInterval(createMoney, CONFIG.moneyInterval);

// ============================================
// AUDIO
// ============================================
const audioEl = document.getElementById('audio-player');
const audioPill = document.getElementById('audio-pill');
const audioLabel = document.getElementById('audio-label');

function playAudio() {
    if (!audioEl) return;
    audioEl.play().then(() => {
        state.audioPlaying = true;
        audioPill?.classList.add('playing');
        if (audioLabel) audioLabel.textContent = 'SILENCIAR';
    }).catch(console.error);
}

function pauseAudio() {
    if (!audioEl) return;
    audioEl.pause();
    state.audioPlaying = false;
    audioPill?.classList.remove('playing');
    if (audioLabel) audioLabel.textContent = 'ÁUDIO';
}

function toggleSound() {
    state.audioPlaying ? pauseAudio() : playAudio();
}

if (audioEl) {
    audioEl.addEventListener('ended', function () {
        if (this.currentSrc.includes('kdopix.mp3')) {
            this.src = CONFIG.audioFiles.loop;
            this.loop = false;
            this.play().catch(console.error);
        }
    });
}

// ============================================
// MODALS
// ============================================
function toggleModal() {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;
    state.modalOpen = !state.modalOpen;
    overlay.style.display = state.modalOpen ? 'flex' : 'none';
    document.body.style.overflow = state.modalOpen ? 'hidden' : 'auto';

    if (state.modalOpen && !state.iframeLoaded) {
        const iframe = document.getElementById('modal-yt');
        if (iframe) {
            iframe.src = iframe.getAttribute('data-src');
            state.iframeLoaded = true;
        }
    }
}

// SUSPECT MODAL
function openSuspectModal(id) {
    const data = SUSPECT_DATA[id];
    if (!data) return;

    state.currentSuspectId = id;
    const overlay = document.getElementById('suspect-modal-overlay');
    const photo = document.getElementById('s-modal-photo');
    const name = document.getElementById('s-modal-name');
    const role = document.getElementById('s-modal-role');
    const status = document.getElementById('s-modal-status');
    const desc = document.getElementById('s-modal-desc');

    desc.textContent = "Acessando arquivos do MP-BA...";
    photo.src = data.photo;
    photo.onerror = () => { photo.src = 'media/perfil/padrao.png'; };
    name.textContent = data.name;
    role.textContent = data.role;
    status.textContent = data.status;

    setTimeout(() => {
        desc.textContent = data.desc;
    }, 600);

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    state.suspectModalOpen = true;
}

function closeSuspectModal(e) {
    const overlay = document.getElementById('suspect-modal-overlay');
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
    state.suspectModalOpen = false;
    state.currentSuspectId = null;
}

// Global key events
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (state.modalOpen) toggleModal();
        if (state.suspectModalOpen) closeSuspectModal();
    }
});

// ============================================
// ENTER SITE
// ============================================
function enterSite() {
    const screen = document.getElementById('start-screen');
    if (!screen) return;
    screen.classList.add('exiting');
    setTimeout(() => {
        screen.classList.add('hidden');
        document.body.style.overflow = 'auto';
        if (audioEl) {
            audioEl.src = CONFIG.audioFiles.main;
            playAudio();
        }
        const zap = document.getElementById('zap-float');
        if (zap) zap.classList.add('visible');
        setTimeout(startCounters, 300);
        setTimeout(animateShareCount, 400);
    }, 600);
}

// ============================================
// WHATSAPP
// ============================================
function shareWhatsApp() {
    state.shareCount++;
    const numEl = document.getElementById('share-num');
    if (numEl) numEl.textContent = state.shareCount.toLocaleString('pt-BR');

    let msg = "";
    if (state.suspectModalOpen && state.currentSuspectId) {
        const data = SUSPECT_DATA[state.currentSuspectId];
        msg = `🚨 *FICHA CRIMINAL: ${data.name.toUpperCase()}* 🚨\n\n📌 *Caso:* Escândalo do Pix na Bahia\n👤 *Função:* ${data.role}\n⚖️ *Status:* ${data.status}\n\n📂 *Dossiê Completo:* \n👉 https://kdopix.com.br\n\n⚠️ NÃO DEIXE ESSE CASO CAIR NO ESQUECIMENTO!`;
    } else {
        msg = `🚨 *ESCÂNDALO DO PIX NA BAHIA* 🚨\n\n💰 R$ 407 MIL DESVIADOS de crianças com câncer!\n\n⚖️ 12 RÉUS DENUNCIADOS pelo MP-BA\n\n🚔 Delegado-Geral da PC-BA VISITOU réu e entregou "moeda institucional"\n\n😱 Marcelo Castro VOLTOU A PEDIR PIX na TV!\n\n⏰ Audiência adiada pela 3ª vez — Maio/2026\n\n📂 DOSSIÊ COMPLETO:\n👉 https://kdopix.com.br\n\n⚠️ COMPARTILHE!`;
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
}

// Expoing to window
window.enterSite = enterSite;
window.toggleSound = toggleSound;
window.toggleModal = toggleModal;
window.openSuspectModal = openSuspectModal;
window.closeSuspectModal = closeSuspectModal;
window.shareWhatsApp = shareWhatsApp;

// Init
document.body.style.overflow = 'hidden';