// ============================================
// KD O PIX - JavaScript Module
// Author: Carlos Henrique Tourinho Santana
// ============================================

// ============================================
// CONSTANTS
// ============================================
const CONFIG = {
    moneyInterval: 800, // Increased interval for better performance
    moneyLifetime: 4000,
    maxMoneyElements: 15, // Limit simultaneous elements
    audioFiles: {
        main: "media/kdopix.mp3",
        loop: "media/policia.mp3"
    }
};

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    moneyCount: 0,
    isAudioPlaying: false,
    modalOpen: false,
    iframeLoaded: false
};

// ============================================
// DOM ELEMENTS CACHE
// ============================================
const elements = {
    startScreen: null,
    enterBtn: null,
    modal: null,
    playBtn: null,
    btnText: null,
    audioPlayer: null,
    clock: null,
    iframe: null
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Cache DOM elements on page load
 */
function cacheDOMElements() {
    elements.startScreen = document.getElementById('start-screen');
    elements.enterBtn = document.getElementById('enter-btn');
    elements.modal = document.getElementById('modal-processo');
    elements.playBtn = document.getElementById('play-btn');
    elements.btnText = document.getElementById('btn-text');
    elements.audioPlayer = document.getElementById('audio-player');
    elements.clock = document.getElementById('clock');
    elements.iframe = document.getElementById('yt-iframe');
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Update clock display
 */
function updateClock() {
    if (!elements.clock) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    elements.clock.textContent = timeString;
    elements.clock.setAttribute('datetime', now.toISOString());
}

/**
 * Lazy load YouTube iframe
 */
function loadIframe() {
    if (state.iframeLoaded || !elements.iframe) return;

    const src = elements.iframe.getAttribute('data-src');
    if (src) {
        elements.iframe.src = src;
        state.iframeLoaded = true;
    }
}

// ============================================
// MONEY ANIMATION
// ============================================

/**
 * Create and animate falling money emoji
 * Optimized with element limit and better cleanup
 */
function createMoney() {
    // Skip if reduced motion is preferred or limit reached
    if (prefersReducedMotion() || state.moneyCount >= CONFIG.maxMoneyElements) {
        return;
    }

    state.moneyCount++;

    const money = document.createElement('div');
    money.className = 'money';
    money.textContent = '💸';
    money.setAttribute('aria-hidden', 'true');

    // Random positioning
    money.style.left = Math.random() * 95 + 'vw';

    // Random animation duration
    const duration = Math.random() * 2 + 3;
    money.style.animationDuration = duration + 's';

    document.body.appendChild(money);

    // Cleanup after animation
    setTimeout(() => {
        money.remove();
        state.moneyCount--;
    }, CONFIG.moneyLifetime);
}

/**
 * Start money animation interval
 */
function startMoneyAnimation() {
    if (!prefersReducedMotion()) {
        setInterval(createMoney, CONFIG.moneyInterval);
    }
}

// ============================================
// AUDIO MANAGEMENT
// ============================================

/**
 * Handle audio ended event
 * Play policia.mp3 once after kdopix.mp3 ends, then stop
 */
function handleAudioEnded() {
    if (this.currentSrc.includes('kdopix.mp3')) {
        this.src = CONFIG.audioFiles.loop;
        this.loop = false; // Play only once
        this.play().catch(console.error);
    }
    // If policia.mp3 ends, do nothing (audio stops)
}

/**
 * Play audio with error handling
 */
function playAudio() {
    if (!elements.audioPlayer) return;

    elements.audioPlayer.play()
        .then(() => {
            state.isAudioPlaying = true;
            if (elements.btnText) {
                elements.btnText.textContent = "SILENCIAR";
            }
        })
        .catch(err => {
            console.error('Erro ao reproduzir áudio:', err);
            // User might need to interact first (autoplay policy)
        });
}

/**
 * Pause audio
 */
function pauseAudio() {
    if (!elements.audioPlayer) return;

    elements.audioPlayer.pause();
    state.isAudioPlaying = false;

    if (elements.btnText) {
        elements.btnText.textContent = "OUVIR ÁUDIO";
    }
}

/**
 * Toggle audio play/pause
 */
function toggleSound() {
    if (!elements.audioPlayer) return;

    if (state.isAudioPlaying || !elements.audioPlayer.paused) {
        pauseAudio();
    } else {
        playAudio();
    }
}

// ============================================
// WHATSAPP SHARE
// ============================================

/**
 * Share page on WhatsApp with strategic message
 */
function shareWhatsApp() {
    // Mensagem estratégica e viral
    const message = `🚨 *URGENTE: ESCÂNDALO DO PIX NA BAHIA* 🚨

💰 R$ 407 MIL DESVIADOS de doações para crianças com câncer!

⚖️ 12 RÉUS DENUNCIADOS pelo MP-BA
🎙️ Jornalistas da Record Bahia envolvidos

📂 Veja o DOSSIÊ COMPLETO com:
✅ Nomes dos 12 réus
✅ Valores desviados
✅ Provas e reportagens oficiais
✅ Processo judicial em andamento

👉 Acesse agora: https://kdopix.com.br

⚠️ COMPARTILHE! As vítimas precisam de justiça!

#KdOPix #EscândaloDoPix #Bahia #Justiça`;

    // URL encode da mensagem
    const encodedMessage = encodeURIComponent(message);

    // URL do WhatsApp Web/App
    const whatsappURL = `https://wa.me/?text=${encodedMessage}`;

    // Abrir em nova aba
    window.open(whatsappURL, '_blank', 'noopener,noreferrer');

    // Analytics (opcional - pode adicionar tracking aqui)
    console.log('📱 WhatsApp share clicked');
}

// ============================================
// MODAL MANAGEMENT
// ============================================

/**
 * Toggle modal visibility
 */
function toggleModal() {
    if (!elements.modal) return;

    state.modalOpen = !state.modalOpen;
    elements.modal.classList.toggle('hidden');

    // Load iframe when modal opens
    if (state.modalOpen) {
        loadIframe();
    }

    // Manage body scroll
    document.body.style.overflow = state.modalOpen ? 'hidden' : 'auto';

    // Focus management for accessibility
    if (state.modalOpen) {
        const closeBtn = elements.modal.querySelector('button');
        if (closeBtn) {
            setTimeout(() => closeBtn.focus(), 100);
        }
    }
}

/**
 * Close modal on ESC key
 */
function handleEscapeKey(event) {
    if (event.key === 'Escape' && state.modalOpen) {
        toggleModal();
    }
}

/**
 * Close modal on background click
 */
function handleModalBackdropClick(event) {
    if (event.target === elements.modal) {
        toggleModal();
    }
}

// ============================================
// START SCREEN
// ============================================

/**
 * Handle enter button click
 */
function handleEnterClick() {
    if (!elements.startScreen) return;

    // Hide start screen
    elements.startScreen.classList.add('hidden');

    // Setup and play audio
    if (elements.audioPlayer) {
        elements.audioPlayer.src = CONFIG.audioFiles.main;
        playAudio();
    }

    // Allow body scroll
    document.body.style.overflow = 'auto';
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Enter button
    if (elements.enterBtn) {
        elements.enterBtn.addEventListener('click', handleEnterClick);
    }

    // Audio ended event
    if (elements.audioPlayer) {
        elements.audioPlayer.addEventListener('ended', handleAudioEnded);
    }

    // Keyboard events
    document.addEventListener('keydown', handleEscapeKey);

    // Modal backdrop click
    if (elements.modal) {
        elements.modal.addEventListener('click', handleModalBackdropClick);
    }

    // Clock update interval
    setInterval(updateClock, 1000);
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize application
 */
function init() {
    console.log('🚨 KD O PIX - Iniciando aplicação...');

    // Cache DOM elements
    cacheDOMElements();

    // Setup event listeners
    setupEventListeners();

    // Start animations
    startMoneyAnimation();

    // Initial clock update
    updateClock();

    // Prevent body scroll on start screen
    document.body.style.overflow = 'hidden';

    console.log('✅ Aplicação inicializada com sucesso');
}

// ============================================
// EXPOSE GLOBAL FUNCTIONS
// ============================================

// Make functions available globally for inline event handlers
window.toggleSound = toggleSound;
window.toggleModal = toggleModal;
window.shareWhatsApp = shareWhatsApp;

// ============================================
// START APPLICATION
// ============================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// PERFORMANCE MONITORING (Development)
// ============================================

if (window.performance && console.table) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('⚡ Performance Metrics:');
        console.table({
            'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart + 'ms',
            'Load Complete': perfData.loadEventEnd - perfData.loadEventStart + 'ms',
            'Total Load Time': perfData.loadEventEnd - perfData.fetchStart + 'ms'
        });
    });
}