// ============================================
// KD O PIX - JavaScript Module v2.4 (RECOVERY)
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
    shareCount: parseInt(localStorage.getItem('kdopix_shares')) || 4925
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
// TOOLS & SFX
// ============================================
function playClick() {
    if (!state.audioPlaying) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
        console.warn("SFX blocked by browser policy");
    }
}

function filterSuspects() {
    const query = document.getElementById('suspect-search').value.toLowerCase();
    const cards = document.querySelectorAll('.reu-card-new');
    cards.forEach(card => {
        const name = card.querySelector('.reu-name-new').textContent.toLowerCase();
        const tag = card.querySelector('.reu-tag').textContent.toLowerCase();
        if (name.includes(query) || tag.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// ============================================
// CLOCK & COUNTERS
// ============================================
function updateClock() {
    const el = document.getElementById('clock');
    if (!el) return;
    el.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateClock, 1000);
updateClock();

function animateCounter(el, target, duration, prefix, suffix, decimals) {
    if (!el) return;
    const start = performance.now();
    const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(progress - 1, 4);
        const val = target * eased;
        if (decimals) {
            el.textContent = prefix + val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + suffix;
        } else {
            el.textContent = prefix + Math.floor(val).toLocaleString('pt-BR') + suffix;
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

// Special audio for Marcelo Castro
let marceloAudio = null;

function openSuspectModal(id) {
    const data = SUSPECT_DATA[id];
    if (!data) return;

    // Marcelo Castro (id=1) gets a special looped audio
    if (id === '1') {
        if (!marceloAudio) {
            marceloAudio = new Audio('media/parar_de_cheirar.mp3');
            marceloAudio.loop = true;
        }
        marceloAudio.currentTime = 0;
        marceloAudio.play().catch(() => { });
    } else {
        playClick();
    }

    state.currentSuspectId = id;
    const overlay = document.getElementById('suspect-modal-overlay');
    const photo = document.getElementById('s-modal-photo');
    const name = document.getElementById('s-modal-name');
    const role = document.getElementById('s-modal-role');
    const status = document.getElementById('s-modal-status');
    const desc = document.getElementById('s-modal-desc');

    if (desc) desc.textContent = "ACESSANDO ARQUIVOS DO MP-BA...";

    if (photo) {
        photo.src = data.photo;
        photo.onerror = () => { photo.src = 'media/perfil/padrao.png'; };
    }
    if (name) name.textContent = data.name;
    if (role) role.textContent = data.role;
    if (status) status.textContent = data.status;

    setTimeout(() => {
        if (desc) desc.textContent = data.desc;
    }, 800);

    if (overlay) overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    state.suspectModalOpen = true;
}

function closeSuspectModal() {
    // Stop Marcelo Castro's special audio if playing
    if (marceloAudio) {
        marceloAudio.pause();
        marceloAudio.currentTime = 0;
    }
    const overlay = document.getElementById('suspect-modal-overlay');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
    state.suspectModalOpen = false;
    state.currentSuspectId = null;
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (state.modalOpen) toggleModal();
        if (state.suspectModalOpen) closeSuspectModal();
    }
});

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
        setTimeout(startCounters, 300);
        setTimeout(animateShareCount, 400);
        // Inicia mapa e diagrama APÓS conteúdo estar visível
        setTimeout(() => {
            initRelationshipMapWhenReady();
            initTacticalMapWhenReady();
        }, 200);
    }, 600);
}

// ============================================
// SHARE & AUTH
// ============================================
function shareWhatsApp() {
    state.shareCount++;
    localStorage.setItem('kdopix_shares', state.shareCount);
    const el = document.getElementById('share-num');
    if (el) el.textContent = state.shareCount.toLocaleString('pt-BR');

    const text = "Acesse o Dossiê Completo: Escândalo do Pix na Record TV - Tudo sobre Marcelo Castro e os 12 réus denunciados pelo MP-BA. Não deixe cair no esquecimento! https://kdopix.com.br";
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
}

function openEvidence(type) {
    const overlay = document.getElementById('auth-overlay');
    const input = document.getElementById('auth-input');
    const error = document.getElementById('auth-error');
    if (!overlay || !input) return;

    input.value = "";
    if (error) error.style.display = 'none';
    overlay.style.display = 'flex';
    input.focus();
}

function closeAuth() {
    const overlay = document.getElementById('auth-overlay');
    if (overlay) overlay.style.display = 'none';
}

function checkAuth() {
    const input = document.getElementById('auth-input');
    const error = document.getElementById('auth-error');
    const box = document.querySelector('.auth-box');
    const pass = input.value.trim().toLowerCase();

    if (pass === 'jucadrogado') {
        if (box) {
            box.innerHTML = `
                <div class="folder-icon" style="font-size:48px;margin-bottom:20px">🔓</div>
                <h3 style="color:var(--green)">ACESSO AUTORIZADO</h3>
                <p style="color:#fff; font-size:14px; margin-top:20px">
                    AUTENTICAÇÃO NÍVEL 4 CONFIRMADA.<br><br>
                    <span style="color:var(--muted); font-size:11px">
                    ESTE ARQUIVO ESTÁ SOB SIGILO JUDICIAL.<br>
                    DOWNLOAD LIBERADO APÓS AUDIÊNCIA (MAIO/2026).
                    </span>
                </p>
                <button onclick="closeAuth()" style="margin-top:24px;width:100%;background:var(--green);color:#000;border:none;font-family:var(--font-display);font-size:18px;padding:12px;cursor:pointer">FECHAR</button>
            `;
        }
    } else {
        if (error) error.style.display = 'block';
        input.value = "";
        input.focus();
    }
}

// ============================================
// RELATIONSHIP MAP
// ============================================
function initRelationshipMap() {
    const container = document.getElementById('relationship-map');
    if (!container) return;

    const nodes = [
        { id: '1', name: 'Marcelo Castro', type: 'principal', x: 50, y: 32 },
        { id: '2', name: 'Jamerson', type: 'principal', x: 50, y: 68 },
        { id: '3', name: 'Cardoso', type: 'intermediary', x: 25, y: 50 },
        { id: '4', name: 'L. Brandão', type: 'intermediary', x: 75, y: 50 },
        { id: '5', name: 'Felipe', type: 'assoc', x: 10, y: 30 },
        { id: '6', name: 'F. Bispo', type: 'assoc', x: 90, y: 30 },
        { id: '7', name: 'Debora', type: 'assoc', x: 10, y: 70 },
        { id: '8', name: 'Rute', type: 'assoc', x: 90, y: 70 },
        { id: '9', name: 'Gerson', type: 'assoc', x: 30, y: 15 },
        { id: '10', name: 'Eneida', type: 'assoc', x: 70, y: 15 },
        { id: '11', name: 'Thais', type: 'assoc', x: 30, y: 85 },
        { id: '12', name: 'Alessandra', type: 'assoc', x: 70, y: 85 }
    ];

    const connections = [
        ['1', '2'], ['1', '3'], ['1', '4'], ['2', '3'], ['2', '4'],
        ['3', '5'], ['3', '7'], ['3', '9'], ['3', '11'],
        ['4', '6'], ['4', '8'], ['4', '10'], ['4', '12']
    ];

    container.querySelectorAll('.node, .map-connection').forEach(el => el.remove());
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    if (w === 0) return;

    nodes.forEach(node => {
        const data = SUSPECT_DATA[node.id];
        const photo = data ? data.photo : 'media/perfil/padrao.png';
        const div = document.createElement('div');
        div.className = `node ${node.type === 'principal' ? 'principal' : ''}`;
        div.style.left = `${node.x}%`; div.style.top = `${node.y}%`;
        div.style.transform = 'translate(-50%, -50%)';
        div.innerHTML = `<img src="${photo}" onerror="this.src='media/perfil/padrao.png'"><div class="node-label">${node.name}</div>`;
        div.onclick = () => openSuspectModal(node.id);
        container.appendChild(div);
    });

    connections.forEach(([id1, id2]) => {
        const n1 = nodes.find(n => n.id === id1); const n2 = nodes.find(n => n.id === id2);
        const line = document.createElement('div'); line.className = 'map-connection';
        const x1 = (n1.x / 100) * w; const y1 = (n1.y / 100) * h;
        const x2 = (n2.x / 100) * w; const y2 = (n2.y / 100) * h;
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        line.style.width = `${length}px`; line.style.left = `${x1}px`; line.style.top = `${y1}px`;
        line.style.transform = `rotate(${angle}deg)`;
        container.appendChild(line);
    });
}

function initTacticalMap() {
    const mapEl = document.getElementById('tactical-map');
    if (!mapEl || typeof L === 'undefined') return;

    const map = L.map('tactical-map', {
        center: [-12.9714, -38.5014],
        zoom: 12,
        zoomControl: false,
        attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(map);

    const redIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:var(--red); width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 15px var(--red); opacity: 0.8; animation: pulse 2s infinite;'></div>",
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });

    const hotspots = [
        { lat: -12.9847, lng: -38.5028, label: "FEDERAÇÃO / RECORD TV" },
        { lat: -12.9811, lng: -38.4812, label: "BROTAS / QG OPERAÇÃO" },
        { lat: -12.9333, lng: -38.4833, label: "SUBÚRBIO / VÍTIMAS" }
    ];

    hotspots.forEach(pt => {
        L.marker([pt.lat, pt.lng], { icon: redIcon })
            .addTo(map)
            .bindTooltip(pt.label, { permanent: true, direction: 'bottom', className: 'map-tooltip' });
    });
}

// Exposing to window
window.enterSite = enterSite;
window.toggleSound = toggleSound;
window.toggleModal = toggleModal;
window.openSuspectModal = openSuspectModal;
window.closeSuspectModal = closeSuspectModal;
window.shareWhatsApp = shareWhatsApp;
window.openEvidence = openEvidence;
window.checkAuth = checkAuth;
window.closeAuth = closeAuth;
window.filterSuspects = filterSuspects;

// Final Initialization
document.body.style.overflow = 'hidden';

// Diagrama: inicializa com retry via ResizeObserver para garantir dimensões
function initRelationshipMapWhenReady() {
    const container = document.getElementById('relationship-map');
    if (!container) return;

    // Se já tem dimensão, inicializa direto
    if (container.offsetWidth > 0) {
        initRelationshipMap();
        return;
    }

    // Caso contrário, espera o container ter dimensão real
    const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
            if (entry.contentRect.width > 0) {
                ro.disconnect();
                initRelationshipMap();
                break;
            }
        }
    });
    ro.observe(container);
}

// Mapa: inicializa com polling até Leaflet estar disponível
function initTacticalMapWhenReady() {
    if (typeof L !== 'undefined') {
        initTacticalMap();
    } else {
        let tries = 0;
        const interval = setInterval(() => {
            tries++;
            if (typeof L !== 'undefined') {
                clearInterval(interval);
                initTacticalMap();
            } else if (tries > 20) {
                clearInterval(interval); // desiste após 10s
            }
        }, 500);
    }
}

window.addEventListener('resize', () => {
    initRelationshipMap();
});
