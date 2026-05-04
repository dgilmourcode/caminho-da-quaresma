import "./styles.css"

// ============================================
// CAMINHO DA FÉ - MAIN.JS (VERSÃO PROFISSIONAL)
// Com suporte a Vite + Tailwind + data.json
// ============================================


// ============================================================================
//  CONFIGURAÇÕES GLOBAIS
// ============================================================================
const CONFIG = {
  dataUrl: '/data.json',

  selectors: {
    navbar: '#navbar',
    navToggle: '#navToggle',
    mobileMenu: '#mobileMenu',
    navLinks: '.nav-link',
    backToTop: '#backToTop',
    installBtn: '#installBtn',
    modal: '#imageModal',
    modalClose: '#modalClose',
    year: '#currentYear',
    counters: '[data-target]',
    sections: 'section[id]',
    grids: {
      quaresma: 'quaresmaGrid',
      semana: 'semanaGrid',
      'via-sacra': 'viaSacraGrid',
      triduo: 'triduoGrid',
      pascoa: 'pascoaGrid',
      dicas: 'dicasGrid',
    },
  },
  storage: {
    likesPrefix: 'caminho_fe_like_',
    viaSacraKey: 'via_sacra_progress',
  },
  animation: {
    particlesCount: 8,
    confettiCount: 60,
  },
};


// ============================================================================
//  UTILS
// ============================================================================
const Utils = {
  throttle(fn, limit) {
    let inThrottle = false;
    return (...args) => {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  animateNumber(el, start, end, duration = 2000) {
    const range = end - start;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(start + range * ease);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },

  createParticles(origin, count = 8) {
    const rect = origin.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const symbols = ['❤️', '💖', '✨', '💕', '🤍'];

    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.textContent = symbols[i % symbols.length];
      p.style.cssText = `
        position:fixed; left:${cx}px; top:${cy}px;
        font-size:${0.8 + Math.random() * 0.8}rem;
        pointer-events:none; z-index:9999; opacity:1;
        transition:transform ${600 + Math.random() * 300}ms cubic-bezier(.2,.8,.3,1), opacity ${600 + Math.random() * 300}ms ease-out;
      `;
      document.body.appendChild(p);

      requestAnimationFrame(() => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const vel = 40 + Math.random() * 60;
        p.style.transform = `translate(${Math.cos(angle) * vel}px, ${Math.sin(angle) * vel - 40}px) scale(0.3)`;
        p.style.opacity = '0';
      });

      setTimeout(() => p.remove(), 1200);
    }
  },

  shareWhatsApp(title, theme, message) {
    const text = `🌿 *${title}*\n📌 ${theme}\n\n${message}\n\n_Caminho da Fé_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  },

  shareFacebook(title, theme, message) {
    const quote = `${title} - ${theme}: ${message}`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(quote)}`,
      '_blank'
    );
  },

  shareInstagram(title, theme, message) {
    const text = `🌿 ${title}\n📌 ${theme}\n\n${message}\n\n#CaminhoDaFé #Fé #Católico`;
    navigator.clipboard.writeText(text)
      .then(() => this.showToast('📋 Copiado! Cole no Instagram'))
      .catch(() => alert('Copie o texto:\n\n' + text));
  },

  shareX(title, theme, message) {
    const text = `🌿 ${title} - ${theme}: ${message} #CaminhoDaFé`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  },

  showToast(message, duration = 3000) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur text-white px-5 py-3 rounded-full text-sm font-medium z-[10000] animate-fade-in-up';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  },

  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },
};

// ============================================================================
//  MODAL SYSTEM (CORRIGIDO)
// ============================================================================
const Modal = {
  overlay: null,
  container: null, 

  init() {
    this.overlay = document.getElementById('imageModal');
    this.container = this.overlay?.querySelector('.modal-container'); 
    if (!this.overlay || !this.container) {
      console.error('❌ Modal não encontrado!');
      return;
    }
    console.log('✅ Modal inicializado');
  },

  open(cardData) {
    if (!this.overlay || !this.container) {
      console.error('Modal não inicializado');
      return;
    }

    console.log('📱 Abrindo modal:', cardData.title);

    // Conteúdo do card (SEM botão de fechar dentro)
    const contentHtml = `
      <div class="bg-white rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
        ${cardData.image ? `
          <div class="relative h-64 overflow-hidden">
            <img src="${cardData.image}" alt="${Utils.escapeHtml(cardData.title)}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        ` : ''}
        <div class="p-6">
          <h3 class="font-serif font-bold text-2xl text-stone-900 mb-2">${Utils.escapeHtml(cardData.title)}</h3>
          
          ${cardData.theme ? `
            <span class="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold mb-4">
              ${Utils.escapeHtml(cardData.theme)}
            </span>
          ` : ''}
          
          ${cardData.verseText ? `
            <div class="bg-stone-50 rounded-xl p-4 mb-4 border-l-4 border-red-400">
              <p class="text-stone-700 italic text-sm">"${Utils.escapeHtml(cardData.verseText)}"</p>
              <p class="text-stone-400 text-xs mt-1">${Utils.escapeHtml(cardData.verse || '')}</p>
            </div>
          ` : ''}
          
          ${cardData.description ? `
            <div class="mb-4">
              <h4 class="font-semibold text-stone-900 mb-2 flex items-center gap-2">
                <i class="fas fa-info-circle text-red-500"></i> Descrição
              </h4>
              <p class="text-stone-600 text-sm leading-relaxed">${Utils.escapeHtml(cardData.description)}</p>
            </div>
          ` : ''}
          
          ${cardData.reflection ? `
            <div class="mb-4">
              <h4 class="font-semibold text-stone-900 mb-2 flex items-center gap-2">
                <i class="fas fa-heart text-red-500"></i> Reflexão
              </h4>
              <p class="text-stone-600 text-sm leading-relaxed">${Utils.escapeHtml(cardData.reflection)}</p>
            </div>
          ` : ''}
          
          ${cardData.activities?.length ? `
            <div class="mb-4">
              <h4 class="font-semibold text-stone-900 mb-2 flex items-center gap-2">
                <i class="fas fa-lightbulb text-amber-500"></i> Atividades
              </h4>
              <ul class="space-y-2">
                ${cardData.activities.map(a => `<li class="flex items-start gap-2 text-sm text-stone-600"><span class="text-amber-500">✝️</span> ${Utils.escapeHtml(a)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${cardData.suggestions?.length ? `
            <div class="mb-4">
              <h4 class="font-semibold text-stone-900 mb-2 flex items-center gap-2">
                <i class="fas fa-star text-yellow-500"></i> Sugestões
              </h4>
              <ul class="space-y-2">
                ${cardData.suggestions.map(s => `<li class="flex items-start gap-2 text-sm text-stone-600"><span class="text-yellow-500">✨</span> ${Utils.escapeHtml(s)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Botão de fechar FIXO (fora do scroll)
    const closeBtnHtml = `
      <button class="modal-close-btn absolute -top-3 -right-3 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-stone-600 hover:text-red-500 hover:scale-110 transition-all shadow-lg border border-stone-100">
        <i class="fas fa-times"></i>
      </button>
    `;

    this.container.innerHTML = closeBtnHtml + contentHtml;

    
    this.overlay.classList.remove('hidden');
    this.overlay.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Event listeners
    const closeBtn = this.container.querySelector('.modal-close-btn');
    closeBtn?.addEventListener('click', () => this.close());

    // Fechar ao clicar no overlay (fora do card)
    this.overlay.onclick = (e) => {
      if (e.target === this.overlay) this.close();
    };
  },

  close() {
    if (!this.overlay) return;
    this.overlay.classList.add('hidden');
    this.overlay.classList.remove('flex'); 
    document.body.style.overflow = '';
  }
};

// ============================================================================
//  LIKES SYSTEM
// ============================================================================
const Likes = {
  init() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.like-btn');
      if (!btn) return;
      const id = btn.dataset.id;
      if (!id) return;
      this.toggleLike(btn, id);
    });
  },

  toggleLike(btn, id) {
    const countSpan = btn.querySelector('.like-count');
    let count = parseInt(countSpan?.textContent || '0', 10);
    const isLiked = localStorage.getItem(`${CONFIG.storage.likesPrefix}${id}`) === 'true';

    if (!isLiked) {
      count++;
      countSpan.textContent = count;
      btn.classList.add('liked');
      localStorage.setItem(`${CONFIG.storage.likesPrefix}${id}`, 'true');
      Utils.createParticles(btn);
    } else {
      count--;
      countSpan.textContent = count;
      btn.classList.remove('liked');
      localStorage.setItem(`${CONFIG.storage.likesPrefix}${id}`, 'false');
    }
  },

  loadStates() {
    document.querySelectorAll('.like-btn').forEach(btn => {
      const id = btn.dataset.id;
      const isLiked = localStorage.getItem(`${CONFIG.storage.likesPrefix}${id}`) === 'true';
      if (isLiked) {
        btn.classList.add('liked');
      }
    });
  },
};

// ============================================================================
//  VIA SACRA PROGRESS
// ============================================================================
const ViaSacra = {
  completedStations: [],

  init() {
    this.loadProgress();
    this.updateUI();
    this.bindEvents();
  },

  loadProgress() {
    try {
      const saved = localStorage.getItem(CONFIG.storage.viaSacraKey);
      if (saved) {
        this.completedStations = JSON.parse(saved);
      } else {
        this.completedStations = [];
      }
    } catch (e) {
      console.warn('Erro ao carregar progresso:', e);
      this.completedStations = [];
    }
  },

  saveProgress() {
    localStorage.setItem(CONFIG.storage.viaSacraKey, JSON.stringify(this.completedStations));
  },

  toggleStation(num) {
    const index = this.completedStations.indexOf(num);
    if (index === -1) {
      this.completedStations.push(num);
      if (this.completedStations.length === 14) {
        this.celebrate();
      }
    } else {
      this.completedStations.splice(index, 1);
    }
    this.saveProgress();
    this.updateUI();
  },

  updateUI() {
    const progress = (this.completedStations.length / 14) * 100;
    const progressBar = document.getElementById('viaSacraProgress');
    const counter = document.getElementById('estacoesCompletadas');

    if (progressBar) progressBar.style.width = `${progress}%`;
    if (counter) counter.textContent = `${this.completedStations.length}/14`;

    document.querySelectorAll('.estacao-card').forEach(card => {
      const num = parseInt(card.dataset.estacao, 10);
      if (this.completedStations.includes(num)) {
        card.classList.add('completed');
      } else {
        card.classList.remove('completed');
      }
    });
  },

  celebrate() {
    Utils.showToast('🎉 Parabéns! Você completou a Via Sacra!', 4000);
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
          position: fixed; width: 10px; height: 10px;
          background: ${['#ef4444', '#eab308', '#22c55e'][Math.floor(Math.random() * 3)]};
          left: ${Math.random() * 100}vw; top: -10px;
          border-radius: 2px; pointer-events: none; z-index: 9999;
          animation: fall ${1 + Math.random() * 2}s linear forwards;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 2000);
      }, i * 30);
    }
  },

  bindEvents() {
    document.getElementById('resetViaSacra')?.addEventListener('click', () => {
      if (confirm('🔄 Recomeçar a Via Sacra? Todo o progresso será perdido.')) {
        this.completedStations = [];
        this.saveProgress();
        this.updateUI();
        Utils.showToast('✅ Via Sacra reiniciada!');
      }
    });
  },
};

// ============================================================================
//  VARIAVEL PARA A VIA-SACRA
// ============================================================================
const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV'];

// ============================================================================
//  CARD DA QUARESMA (ESTILO DRIBBBLE FOTO NO TOPO)
// ============================================================================
function renderQuaresmaCard(card) {
  const imgSrc = card.image || 'https://images.pexels.com/photos/2598347/pexels-photo-2598347.jpeg?w=400&h=300&fit=crop';
  const weekLabel = card.week ? `${card.week}ª SEMANA` : 'TEMPO ESPECIAL';

  const modalData = {
    title: card.title,
    theme: card.theme || '',
    verse: card.verse || '',
    verseText: card.verseText || '',
    reflection: card.reflection || '',
    description: card.description || '',
    activities: card.activities || [],
    suggestions: card.suggestions || [],
    image: imgSrc
  };

  const modalDataJson = JSON.stringify(modalData).replace(/'/g, "&#39;");

  return `
    <article class="quaresma-card group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer" data-id="${card.id}" data-period="${card.period}">
      <!-- Foto no topo - estilo Dribbble -->
      <div class="relative h-44 overflow-hidden bg-gradient-to-br from-purple-100 to-purple-50">
        <img src="${imgSrc}" alt="${Utils.escapeHtml(card.title)}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <!-- Botão expand -->
        <button class="expand-btn absolute top-3 right-3 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-400 hover:text-purple-600 hover:scale-110 transition-all duration-300 shadow-md z-10 opacity-0 group-hover:opacity-100" 
          data-modal="${encodeURIComponent(JSON.stringify(modalData))}"
          aria-label="Ver detalhes">
          <i class="fas fa-expand text-xs"></i>
        </button>
        
        <!-- Badge da semana -->
        <div class="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-purple-600 uppercase tracking-wider shadow-md">
          ${weekLabel}
        </div>
      </div>
      
      <!-- Conteúdo abaixo da foto -->
      <div class="p-5">
        <!-- Tema -->
        ${card.theme ? `
          <div class="flex items-center gap-1.5 mb-2">
            <span class="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            <span class="text-[11px] font-semibold text-purple-600 uppercase tracking-wide">${Utils.escapeHtml(card.theme)}</span>
          </div>
        ` : ''}
        
        <!-- Título -->
        <h3 class="font-serif font-bold text-xl text-stone-900 mb-2 leading-tight group-hover:text-purple-700 transition-colors duration-300">
          ${Utils.escapeHtml(card.title)}
        </h3>
        
        <!-- Mensagem/Descrição -->
        <p class="text-sm text-stone-500 line-clamp-2 mb-4">
          ${Utils.escapeHtml(card.message || '')}
        </p>

        <!-- Footer com like e compartilhar -->
        <div class="flex items-center justify-between mt-1">
          <button class="like-btn flex items-center gap-1 text-[10px] text-stone-400 hover:text-red-500 transition-colors duration-200" data-id="${card.id}">
            <i class="far fa-heart text-[2xl]"></i>
            <span class="like-count">0</span>
          </button>
          
          <div class="flex items-center gap-1.5">
            <button class="share-btn share-whatsapp w-12 h-12 rounded-lg flex items-center justify-center text-white bg-[#25D366] hover:scale-110 transition-all"
              onclick="Utils.shareWhatsApp('${card.title.replace(/'/g, "\\'")}', '${(card.theme || '').replace(/'/g, "\\'")}', '${(card.message || '').replace(/'/g, "\\'")}')">
              <i class="fab fa-whatsapp text-[22px]"></i>
            </button>
            <button class="share-btn share-instagram w-12 h-12 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:scale-110 transition-all"
              onclick="Utils.shareInstagram('${card.title.replace(/'/g, "\\'")}', '${(card.theme || '').replace(/'/g, "\\'")}', '${(card.message || '').replace(/'/g, "\\'")}')">
              <i class="fab fa-instagram text-[22px]"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

// ============================================================================
//  CARD DA SEMANA SANTA (ESTILO HORIZONTAL FOTO LATERAL)
// ============================================================================
function renderSemanaSantaCard(card) {
  const imgSrc = card.image || 'https://images.unsplash.com/photo-1711634998612-68a22cddb3c4?w=400&h=400&fit=crop';

  const modalData = {
    title: card.title,
    theme: card.theme || '',
    verse: card.verse || '',
    verseText: card.verseText || '',
    reflection: card.reflection || '',
    description: card.description || '',
    activities: card.activities || [],
    suggestions: card.suggestions || [],
    image: imgSrc
  };

  const modalDataJson = JSON.stringify(modalData).replace(/'/g, "&#39;");

  return `
    <article class="semana-card group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer flex" data-id="${card.id}">
      <!-- Foto lateral esquerda -->
      <div class="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden ">
        <img src="${imgSrc}" alt="${Utils.escapeHtml(card.title)}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
      </div>
      
      <!-- Conteúdo lado direito -->
      <div class="flex-1 p-3 sm:p-4 relative">
        <!-- Botão expand -->
        <button class="expand-btn absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-stone-400 hover:text-red-500 hover:scale-110 transition-all duration-200 shadow-sm z-10 opacity-0 group-hover:opacity-100" 
          data-modal="${encodeURIComponent(JSON.stringify(modalData))}">
          <i class="fas fa-expand text-[10px]"></i>
        </button>
        
        <!-- Tema badge -->
        ${card.theme ? `
          <span class="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-semibold uppercase mb-1.5">
            ${Utils.escapeHtml(card.theme)}
          </span>
        ` : ''}
        
        <!-- Título -->
        <h3 class="font-serif font-bold text-base sm:text-lg text-stone-900 mb-1 leading-tight line-clamp-1 pr-6">
          ${Utils.escapeHtml(card.title)}
        </h3>
        
        <!-- Mensagem/Descrição -->
        <p class="text-xs text-stone-500 line-clamp-2 mb-2">
          ${Utils.escapeHtml(card.message || '')}
        </p>
        
        <!-- Versículo (se existir) -->
        ${card.verseText ? `
          <p class="text-[10px] text-emerald-600 italic line-clamp-1 mb-2">
            "${Utils.escapeHtml(card.verseText.substring(0, 60))}${card.verseText.length > 60 ? '...' : ''}"
          </p>
        ` : ''}
        
        <!-- Footer com like e compartilhar -->
        <div class="flex items-center justify-between mt-1">
          <button class="like-btn flex items-center gap-1 text-[10px] text-stone-400 hover:text-red-500 transition-colors duration-200" data-id="${card.id}">
            <i class="far fa-heart text-[2xl]"></i>
            <span class="like-count">0</span>
          </button>
          
          <div class="flex items-center gap-1.5">
            <button class="share-btn share-whatsapp w-12 h-12 rounded-lg flex items-center justify-center text-white bg-[#25D366] hover:scale-110 transition-all"
              onclick="Utils.shareWhatsApp('${card.title.replace(/'/g, "\\'")}', '${(card.theme || '').replace(/'/g, "\\'")}', '${(card.message || '').replace(/'/g, "\\'")}')">
              <i class="fab fa-whatsapp text-[22px]"></i>
            </button>
            <button class="share-btn share-instagram w-12 h-12 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:scale-110 transition-all"
              onclick="Utils.shareInstagram('${card.title.replace(/'/g, "\\'")}', '${(card.theme || '').replace(/'/g, "\\'")}', '${(card.message || '').replace(/'/g, "\\'")}')">
              <i class="fab fa-instagram text-[22px]"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

// ============================================================================
//  CARD DA VIA SACRA (ESTILO HORIZONTAL SIMPLES)
// ============================================================================
function renderViaSacraCard(card, index) {
  const romanNum = romanNumerals[index] || (index + 1);
  const imgSrc = card.image || 'https://images.unsplash.com/photo-1515169078309-8d9509396999?w=400&h=400&fit=crop';

  const modalData = {
    title: `Estação ${romanNum}: ${card.title}`,
    theme: card.theme || '',
    verse: card.verse || '',
    verseText: card.verseText || '',
    reflection: card.reflection || '',
    description: card.description || '',
    activities: card.activities || [],
    suggestions: card.suggestions || [],
    image: imgSrc
  };

  const modalDataJson = JSON.stringify(modalData).replace(/'/g, "&#39;");

  return `
    <article class="estacao-card group bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer" data-estacao="${card.week || index + 1}" data-id="${card.id}">
      <div class="relative p-4">
        <button class="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-stone-400 hover:text-red-500 transition-all z-10"
          data-modal="${encodeURIComponent(JSON.stringify(modalData))}">
          <i class="fas fa-expand text-xs"></i>
        </button>
        
        <div class="flex items-start gap-3">
          <div class="relative flex-shrink-0">
            <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow">
              <img src="${imgSrc}" alt="${Utils.escapeHtml(card.title)}" class="w-full h-full object-cover">
            </div>
            <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">${romanNum}</div>
            <div class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full hidden items-center justify-center text-white text-[10px] font-bold estacao-check">✓</div>
          </div>
          
          <div class="flex-1">
            <h3 class="font-semibold text-stone-900 text-base">${Utils.escapeHtml(card.title)}</h3>
            <p class="text-xs text-red-500 font-medium mt-0.5">${Utils.escapeHtml(card.theme || '')}</p>
            <p class="text-xs text-stone-500 mt-1 line-clamp-2">${Utils.escapeHtml(card.message || '')}</p>
            ${card.verseText ? `<p class="text-xs text-stone-400 italic mt-1">"${Utils.escapeHtml(card.verseText.substring(0, 60))}..."</p>` : ''}
          </div>
        </div>
        
        <div class="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
          <button class="like-btn flex items-center gap-1 text-xs text-stone-400 hover:text-red-500 transition" data-id="${card.id}">
            <i class="far fa-heart"></i>
            <span class="like-count">0</span>
          </button>
          <div class="estacao-activity text-xs text-stone-400">
            <i class="fas fa-hands-praying"></i> ${card.activities && card.activities[0] ? card.activities[0].substring(0, 40) : 'Rezar e meditar'}
          </div>
        </div>
      </div>
    </article>
  `;
}

// ============================================================================
//  CARD DO TRÍDUO (ESTILO GLASSMORPHISM MODERNO)
// ============================================================================
function renderTriduoCard(card) {
  const imgSrc = card.image || 'https://images.unsplash.com/photo-1532330383983-5c5213b97d36?w=400&h=400&fit=crop';

  // Mapeamento de ícones por tema
  const iconMap = {
    'Quinta-feira Santa': 'fa-bread-slice',
    'Sexta-feira Santa': 'fa-cross',
    'Sábado Santo': 'fa-moon'
  };
  const iconClass = iconMap[card.title] || 'fa-church';

  // Mapeamento de cores do gradiente
  const gradientMap = {
    'Quinta-feira Santa': 'from-amber-600 to-orange-600',
    'Sexta-feira Santa': 'from-red-700 to-red-800',
    'Sábado Santo': 'from-indigo-600 to-purple-700'
  };
  const gradientClass = gradientMap[card.title] || 'from-purple-600 to-indigo-700';

  const modalData = {
    title: card.title,
    theme: card.theme || '',
    verse: card.verse || '',
    verseText: card.verseText || '',
    reflection: card.reflection || '',
    description: card.description || '',
    activities: card.activities || [],
    suggestions: card.suggestions || [],
    image: imgSrc
  };

  const modalDataJson = JSON.stringify(modalData).replace(/'/g, "&#39;");

  return `
    <div class="triduo-card group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-500 hover:transform hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl cursor-pointer" data-id="${card.id}">
      <!-- Gradiente de fundo animado -->
      <div class="absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
      
      <!-- Botão expand -->
      <button class="expand-btn absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 z-10 opacity-0 group-hover:opacity-100" 
        data-modal="${encodeURIComponent(JSON.stringify(modalData))}""
        aria-label="Ver detalhes">
        <i class="fas fa-expand text-sm"></i>
      </button>
      
      <div class="p-6 text-center relative z-10">
        <!-- Ícone animado -->
        <div class="triduo-icon-wrapper w-20 h-20 mx-auto mb-5 bg-gradient-to-br ${gradientClass} rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
          <i class="fas ${iconClass} text-3xl text-white"></i>
        </div>
        
        <!-- Título -->
        <h3 class="font-serif font-bold text-2xl text-white mb-3 group-hover:text-amber-300 transition-colors duration-300">${Utils.escapeHtml(card.title)}</h3>
        
        <!-- Eventos/Tags -->
        <div class="flex flex-wrap justify-center gap-2 mb-4">
          ${card.events ? card.events.map(event => `
            <span class="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 backdrop-blur-sm">
              <i class="fas ${event.icon} mr-1"></i> ${event.name}
            </span>
          `).join('') : `
            <span class="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 backdrop-blur-sm">
              <i class="fas fa-church mr-1"></i> Celebração Especial
            </span>
          `}
        </div>
        
        <!-- Mensagem -->
        <p class="text-white/90 text-sm mb-4 line-clamp-2">${Utils.escapeHtml(card.message || '')}</p>
        
        <!-- Versículo -->
        ${card.verseText ? `
          <blockquote class="text-white/60 text-xs italic border-l-2 border-amber-400/50 pl-3 text-left">
            <i class="fas fa-book-open mr-1 text-amber-400/70"></i>
            "${Utils.escapeHtml(card.verseText.substring(0, 80))}${card.verseText.length > 80 ? '...' : ''}"
          </blockquote>
        ` : ''}
      </div>
    </div>
  `;
}

// ============================================================================
//  CARD DA PÁSCOA (ESTILO COMPACTO 4 POR COLUNA)
// ============================================================================
function renderPascoaCard(card) {
  const imgSrc = card.image || 'https://images.pexels.com/photos/1040626/pexels-photo-1040626.jpeg?w=80&h=80&fit=crop';
  const weekLabel = card.week ? `${card.week}ª semana` : 'Tempo Pascal';

  const modalData = {
    title: card.title,
    theme: card.theme || '',
    verse: card.verse || '',
    verseText: card.verseText || '',
    reflection: card.reflection || '',
    description: card.description || '',
    activities: card.activities || [],
    suggestions: card.suggestions || [],
    image: imgSrc
  };

  const modalDataJson = JSON.stringify(modalData).replace(/'/g, "&#39;");

  return `
    <article class="pascoa-card group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer flex" data-id="${card.id}" data-period="${card.period}">
      <!-- Foto lateral pequena -->
      <div class="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden bg-amber-100">
        <img src="${imgSrc}" alt="${Utils.escapeHtml(card.title)}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">
      </div>
      
      <!-- Conteúdo -->
      <div class="flex-1 p-2.5 sm:p-3 relative">
        <!-- Botão expand -->
        <button class="expand-btn absolute top-1.5 right-1.5 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center text-stone-400 hover:text-amber-600 hover:scale-110 transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100" 
          data-modal="${encodeURIComponent(JSON.stringify(modalData))}">
          <i class="fas fa-expand text-[8px]"></i>
        </button>
        
        <!-- Badge da semana -->
        <div class="inline-block px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-semibold uppercase mb-1">
          ${weekLabel}
        </div>
        
        <!-- Título -->
        <h3 class="font-serif font-bold text-xs sm:text-sm text-stone-900 mb-0.5 leading-tight line-clamp-1 pr-4">
          ${Utils.escapeHtml(card.title)}
        </h3>
        
        <!-- Tema pequeno -->
        ${card.theme ? `
          <p class="text-[9px] text-amber-600 font-medium mb-0.5 line-clamp-1">
            ${Utils.escapeHtml(card.theme)}
          </p>
        ` : ''}
        
        <!-- Mensagem -->
        <p class="text-[10px] text-stone-500 line-clamp-1 mb-1">
          ${Utils.escapeHtml(card.message || '').substring(0, 50)}
        </p>
        
        <!-- Footer com like e compartilhar -->
        <div class="flex items-center justify-between mt-1">
          <button class="like-btn flex items-center gap-1 text-[10px] text-stone-400 hover:text-red-500 transition-colors duration-200" data-id="${card.id}">
            <i class="far fa-heart text-[2xl]"></i>
            <span class="like-count">0</span>
          </button>
          
          <div class="flex items-center gap-1.5">
            <button class="share-btn share-whatsapp w-12 h-12 rounded-lg flex items-center justify-center text-white bg-[#25D366] hover:scale-110 transition-all"
              onclick="Utils.shareWhatsApp('${card.title.replace(/'/g, "\\'")}', '${(card.theme || '').replace(/'/g, "\\'")}', '${(card.message || '').replace(/'/g, "\\'")}')">
              <i class="fab fa-whatsapp text-[22px]"></i>
            </button>
            <button class="share-btn share-instagram w-12 h-12 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:scale-110 transition-all"
              onclick="Utils.shareInstagram('${card.title.replace(/'/g, "\\'")}', '${(card.theme || '').replace(/'/g, "\\'")}', '${(card.message || '').replace(/'/g, "\\'")}')">
              <i class="fab fa-instagram text-[22px]"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

// ============================================================================
//  CARD DA DICAS (COM LIKS INDIVIDUAIS NO RENDER DO JSON)
// ============================================================================
function renderDicaCard(dica) {
  const linkUrl = dica.linkUrl || '#';

  return `
    <article class="dica-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div class="h-44 overflow-hidden">
        <img src="${dica.image}" alt="${Utils.escapeHtml(dica.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
      </div>
      <div class="p-5">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-9 h-9 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-xl">${dica.icon}</span>
          <h3 class="font-semibold text-stone-900">${Utils.escapeHtml(dica.title)}</h3>
        </div>
        <p class="text-stone-600 text-sm mb-4">${Utils.escapeHtml(dica.description)}</p>
        <a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-emerald-600 font-medium text-sm hover:underline inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          ${dica.linkText} <i class="fas fa-arrow-right text-xs"></i>
        </a>
      </div>
    </article>
  `;
}

// ============================================================================
//  CONTADOR DOS DIAS DA SECTION HERO
// ============================================================================
function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    if (isNaN(target)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Utils.animateNumber(counter, 0, target);
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(counter);
  });
}

// ============================================================================
//  MENSAGEM DE ERRO SE FALHAR O LOAD DO JSON
// ============================================================================
function showErrorMessage() {
  const grids = ['quaresmaGrid', 'semanaGrid', 'viaSacraGrid', 'triduoGrid', 'pascoaGrid', 'dicasGrid'];
  grids.forEach(gridId => {
    const grid = document.getElementById(gridId);
    if (grid && !grid.innerHTML.trim()) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="text-6xl mb-4">⚠️</div>
          <h3 class="font-semibold text-stone-900 mb-2">Erro ao carregar conteúdo</h3>
          <p class="text-stone-500">Verifique se o arquivo <strong>public/data.json</strong> existe</p>
          <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">Tentar novamente</button>
        </div>
      `;
    }
  });
}

// ============================================================================
//  LOAD DO JSON
// ============================================================================
async function loadAndRenderCards() {
  try {
    console.log('📡 Carregando dados de:', CONFIG.dataUrl);
    const response = await fetch(CONFIG.dataUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const cards = await response.json();
    console.log(`✅ Carregados ${cards.length} cards do JSON`);

    // Agrupar cards por período
    const grouped = {
      quaresma: [],
      semana: [],
      'via-sacra': [],
      triduo: [],
      pascoa: [],
      dicas: []
    };

    cards.forEach(card => {
      if (grouped[card.period]) {
        grouped[card.period].push(card);
      }
    });

    // Renderizar Quaresma
    const quaresmaGrid = document.getElementById('quaresmaGrid');
    if (quaresmaGrid && grouped.quaresma.length) {
      quaresmaGrid.innerHTML = grouped.quaresma.map(renderQuaresmaCard).join('');
    }

    // Renderizar Semana Santa
    const semanaGrid = document.getElementById('semanaGrid');
    if (semanaGrid && grouped.semana.length) {
      semanaGrid.innerHTML = grouped.semana.map(renderSemanaSantaCard).join('');
    }

    // Renderizar Via Sacra
    const viaSacraGrid = document.getElementById('viaSacraGrid');
    if (viaSacraGrid && grouped['via-sacra'].length) {
      const sortedViaSacra = [...grouped['via-sacra']].sort((a, b) => (a.week || 0) - (b.week || 0));
      viaSacraGrid.innerHTML = sortedViaSacra.map((card, idx) => renderViaSacraCard(card, idx)).join('');
    }

    // Renderizar Tríduo (dados vêm do JSON)
    const triduoGrid = document.getElementById('triduoGrid');
    if (triduoGrid && grouped.triduo.length) {
      triduoGrid.innerHTML = grouped.triduo.map(renderTriduoCard).join('');
    }

    // Renderizar Páscoa
    const pascoaGrid = document.getElementById('pascoaGrid');
    if (pascoaGrid && grouped.pascoa.length) {
      pascoaGrid.innerHTML = grouped.pascoa.map(renderPascoaCard).join('');
    }

    // Renderizar Dicas (dados vêm do JSON)
    const dicasGrid = document.getElementById('dicasGrid');
    if (dicasGrid && grouped.dicas.length) {
      dicasGrid.innerHTML = grouped.dicas.map(renderDicaCard).join('');
    }

    // Após renderizar todos os cards:
    document.querySelectorAll('.expand-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        // ⬇️ MUDANÇA: pegar do btn.dataset, não do card.dataset
        const modalData = JSON.parse(decodeURIComponent(btn.dataset.modal));
        Modal.open(modalData);
      });
    });

    // Inicializar sistemas
    Likes.init();
    Likes.loadStates();
    ViaSacra.init();
    initCounters();

    console.log('🎉 Cards renderizados com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao carregar dados:', error);
    showErrorMessage();
  }
}

// ============================================================================
//  MENU MOBILE
// ============================================================================
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('menuOverlay');
  const closeBtn = document.getElementById('closeMenuBtn');

  if (!toggle || !menu) return;

  const open = () => {
    menu.classList.remove('translate-x-full');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    document.body.classList.add('overflow-hidden');
  };

  const close = () => {
    menu.classList.add('translate-x-full');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('overflow-hidden');
  };

  toggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('translate-x-full');
    isOpen ? close() : open();
  });

  overlay.addEventListener('click', close);
  closeBtn.addEventListener('click', close);

  document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', close);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) close();
  });
}

// ============================================================================
//  DESTAQUE NO NAVBAR
// ============================================================================
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('#mobileMenu a');

  // Adicionar classe nav-link aos links do mobile
  mobileNavLinks.forEach(link => {
    if (!link.classList.contains('nav-link')) {
      link.classList.add('nav-link');
    }
  });

  // Atualizar todos os links (mobile + desktop)
  const allNavLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        current = section.getAttribute('id');
      }
    });

    // Se não achou nenhuma seção e está no topo
    if (!current && window.scrollY < 150) {
      current = 'intro';
    }

    // Atualizar cada link individualmente
    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      const linkId = href ? href.replace('#', '') : '';

      // Resetar todas as classes de estilo
      link.classList.remove(
        'bg-emerald-100', 'text-emerald-700', 'bg-emerald-50',
        'bg-purple-100', 'text-purple-600', 'bg-purple-50',
        'bg-red-100', 'text-red-600', 'bg-red-50',
        'bg-indigo-100', 'text-indigo-600', 'bg-indigo-50',
        'bg-amber-100', 'text-amber-600', 'bg-amber-50',
        'bg-orange-100', 'text-orange-600', 'bg-orange-50',
        'active'
      );

      // Resetar também estilos inline e cores padrão
      link.style.backgroundColor = '';
      link.style.color = '';

      // Adicionar classes base (hover)
      if (!link.classList.contains('hover')) {
        // As classes hover já estão no HTML
      }

      // Se for o link ativo, adicionar as cores correspondentes
      if (linkId === current) {
        link.classList.add('active');

        // Aplicar cores específicas por seção
        if (current === 'intro') {
          link.classList.add('bg-emerald-100', 'text-emerald-700');
          link.style.backgroundColor = '#d1fae5';
          link.style.color = '#047857';
        }
        else if (current === 'quaresma') {
          link.classList.add('bg-purple-100', 'text-purple-600');
          link.style.backgroundColor = '#f3e8ff';
          link.style.color = '#9333ea';
        }
        else if (current === 'semana-santa') {
          link.classList.add('bg-emerald-100', 'text-emerald-600');
          link.style.backgroundColor = '#d1fae5';
          link.style.color = '#059669';
        }
        else if (current === 'via-sacra') {
          link.classList.add('bg-red-100', 'text-red-600');
          link.style.backgroundColor = '#fee2e2';
          link.style.color = '#dc2626';
        }
        else if (current === 'triduo') {
          link.classList.add('bg-indigo-100', 'text-indigo-600');
          link.style.backgroundColor = '#e0e7ff';
          link.style.color = '#4f46e5';
        }
        else if (current === 'pascoa') {
          link.classList.add('bg-amber-100', 'text-amber-600');
          link.style.backgroundColor = '#fef3c7';
          link.style.color = '#d97706';
        }
        else if (current === 'pentecostes') {
          link.classList.add('bg-orange-100', 'text-orange-600');
          link.style.backgroundColor = '#ffedd5';
          link.style.color = '#ea580c';
        }
        else if (current === 'dicas') {
          link.classList.add('bg-amber-100', 'text-amber-600');
          link.style.backgroundColor = '#fef3c7';
          link.style.color = '#d97706';
        }
      }
    });
  }

  // Executar ao rolar e ao redimensionar
  window.addEventListener('scroll', updateActiveLink);
  window.addEventListener('resize', updateActiveLink);
  updateActiveLink();
}

// ============================================================================
//  VOLTA AO TOPO
// ============================================================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.remove('opacity-0', 'invisible');
    } else {
      btn.classList.add('opacity-0', 'invisible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================================
//  SCROLL ANIMATION
// ============================================================================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.card, .estacao-card, .semana-card, .dica-card, section').forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
  });
}

// ============================================================================
//  ATUALIZAR ANO NO FOOTER
// ============================================================================
function initYear() {
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// ============================================================================
//  BOTÃO INSTALAR APP NO FOOTER
// ============================================================================
function initInstallButtonVisibility() {
  const installBtn = document.getElementById('installBtn');
  if (!installBtn) return;

  const footer = document.querySelector('footer');
  if (!footer) return;

  let isVisible = false;

  function checkVisibility() {
    const footerRect = footer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Mostrar botão quando o footer estiver próximo da viewport
    // (quando o topo do footer estiver a menos de 100px da parte inferior da tela)
    const shouldShow = footerRect.top <= windowHeight + 100;

    if (shouldShow && !isVisible) {
      installBtn.classList.add('visible');
      installBtn.classList.remove('hidden-btn');
      isVisible = true;
    } else if (!shouldShow && isVisible) {
      installBtn.classList.remove('visible');
      installBtn.classList.add('hidden-btn');
      isVisible = false;
    }
  }

  // Esconder inicialmente
  installBtn.classList.add('hidden-btn');
  installBtn.classList.remove('visible');

  // Verificar ao rolar
  window.addEventListener('scroll', checkVisibility);
  window.addEventListener('resize', checkVisibility);
  checkVisibility();
}

// ============================================================================
//  EVENT LISTENERS
// ============================================================================
function setupEventListeners() {
// Smooth scroll para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============================================================================
//  APP INIT
// ============================================================================
async function init() {
  console.log('🌿 Caminho da Fé - Iniciando...');

  initMobileMenu();
  initActiveNavLinks();
  initBackToTop();
  initScrollReveal();
  initYear();
  initInstallButtonVisibility();
  setupEventListeners();
  Modal.init();

  window.Utils = Utils;

  await loadAndRenderCards();

  console.log('✨ Aplicação inicializada com sucesso!');
}

// Start application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}