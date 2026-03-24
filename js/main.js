/**
 * CAMINHO DA FÉ - MAIN.JS
 * Quaresma à Pentecostes - Versão Completa
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ==========================================
  // 1. SCROLL REVEAL COM INTERSECTION OBSERVER
  // ==========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Marcar Via Sacra como visitada
        if (entry.target.classList.contains('estacao-card')) {
          markEstacaoVisited(entry.target);
        }
      }
    });
  }, observerOptions);

  // Observar elementos
  document.querySelectorAll('.day-card, .estacao-card, .dica-card, .section-header').forEach(el => {
    scrollObserver.observe(el);
  });

  // ==========================================
  // 2. EFEITO DE BRILHO NO MOUSE (CARDS)
  // ==========================================
  document.querySelectorAll('.day-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // ==========================================
  // 3. SISTEMA DE LIKES COM LOCALSTORAGE
  // ==========================================
  const likeButtons = document.querySelectorAll('.like-btn');
  
  function loadLikes() {
    likeButtons.forEach(btn => {
      const dayName = btn.getAttribute('data-day');
      const saved = localStorage.getItem(`caminho_felike_${dayName}`);
      const count = saved ? parseInt(saved, 10) : 0;
      const countSpan = btn.querySelector('.like-count');
      
      if (countSpan) {
        countSpan.textContent = count;
      }
      
      if (count > 0) {
        const icon = btn.querySelector('i');
        icon.classList.remove('far');
        icon.classList.add('fas', 'text-red-500');
      }
    });
  }

  function saveLike(dayName, count) {
    localStorage.setItem(`caminho_felike_${dayName}`, count);
  }

  likeButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const dayName = this.getAttribute('data-day');
      const countSpan = this.querySelector('.like-count');
      const icon = this.querySelector('i');
      let currentCount = parseInt(countSpan.textContent, 10);
      
      currentCount++;
      countSpan.textContent = currentCount;
      saveLike(dayName, currentCount);
      
      icon.classList.remove('far');
      icon.classList.add('fas', 'text-red-500');
      this.classList.add('liked');
      
      createHeartParticles(this);
      
      setTimeout(() => {
        this.classList.remove('liked');
      }, 500);
    });
  });

  function createHeartParticles(button) {
    const rect = button.getBoundingClientRect();
    const colors = ['❤️', '💖', '💕', '💗', '💝'];
    
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('span');
      particle.textContent = colors[Math.floor(Math.random() * colors.length)];
      particle.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        font-size: ${1 + Math.random()}rem;
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
      `;
      
      document.body.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / 6;
      const velocity = 60 + Math.random() * 40;
      let x = 0, y = 0;
      let opacity = 1;
      
      const animate = () => {
        x += Math.cos(angle) * velocity * 0.02;
        y += Math.sin(angle) * velocity * 0.02 - 1;
        opacity -= 0.02;
        
        particle.style.transform = `translate(${x}px, ${y}px) scale(${opacity})`;
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };
      
      requestAnimationFrame(animate);
    }
  }

  // // ==========================================
  // // 4. VIA SACRA - PROGRESSO
  // // ==========================================
  // function markEstacaoVisited(estacao) {
  //   const numero = estacao.getAttribute('data-estacao');
  //   const visitadas = JSON.parse(localStorage.getItem('via_sacra_visitadas') || '[]');
    
  //   if (!visitadas.includes(numero)) {
  //     visitadas.push(numero);
  //     localStorage.setItem('via_sacra_visitadas', JSON.stringify(visitadas));
  //     updateViaSacraProgress();
  //   }
  // }

  // function updateViaSacraProgress() {
  //   const visitadas = JSON.parse(localStorage.getItem('via_sacra_visitadas') || '[]');
  //   const total = 14;
  //   const porcentagem = (visitadas.length / total) * 100;
    
  //   const progressBar = document.getElementById('viaSacraProgress');
  //   const contador = document.getElementById('estacoesCompletadas');
    
  //   if (progressBar) {
  //     progressBar.style.width = `${porcentagem}%`;
  //   }
    
  //   if (contador) {
  //     contador.textContent = visitadas.length;
  //   }
    
  //   // Marcar cards como completados
  //   visitadas.forEach(num => {
  //     const card = document.querySelector(`[data-estacao="${num}"]`);
  //     if (card) {
  //       card.classList.add('completed');
  //     }
  //   });
  // }

  // // Reset Via Sacra
  // const resetBtn = document.getElementById('resetViaSacra');
  // if (resetBtn) {
  //   resetBtn.addEventListener('click', () => {
  //     if (confirm('Deseja recomeçar a Via Sacra?')) {
  //       localStorage.removeItem('via_sacra_visitadas');
  //       document.querySelectorAll('.estacao-card').forEach(card => {
  //         card.classList.remove('completed');
  //       });
  //       updateViaSacraProgress();
  //     }
  //   });
  // }

  // ==========================================
  // 5. NAVEGAÇÃO STICKY
  // ==========================================
  const nav = document.querySelector('.sticky-nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // ==========================================
  // 6. BOTÃO VOLTAR AO TOPO
  // ==========================================
  const backToTopBtn = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================
  // 7. PWA - INSTALL PROMPT
  // ==========================================
  let deferredPrompt;
  const installBtn = document.getElementById('installBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove('hidden');
  });

  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA instalado!');
        installBtn.classList.add('hidden');
      }
      
      deferredPrompt = null;
    }
  });

  window.addEventListener('appinstalled', () => {
    installBtn.classList.add('hidden');
    deferredPrompt = null;
  });

  // ==========================================
  // 8. PARALLAX SUAVE
  // ==========================================
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-decoration');
        
        if (parallax) {
          parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  });

  // ==========================================
  // 9. HIGHLIGHT DO DIA ATUAL (baseado na data)
  // ==========================================
  function highlightCurrentPeriod() {
    const now = new Date();
    const year = now.getFullYear();
    
    // Calcular datas aproximadas (varia a cada ano)
    // Páscoa 2025: 20 de abril
    // Pentecostes 2025: 8 de junho
    
    // Simplificação: destacar baseado na URL hash ou scroll
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.classList.add('highlight-section');
        setTimeout(() => {
          target.classList.remove('highlight-section');
        }, 2000);
      }
    }
  }

  // ==========================================
  // 10. ANIMAÇÃO DE CONTADOR
  // ==========================================
  function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      element.textContent = Math.floor(easeOutQuart * (end - start) + start);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }

  // Animar contador da Quaresma
  const counterElement = document.querySelector('.counter-number');
  if (counterElement) {
    setTimeout(() => {
      animateCounter(counterElement, 0, 40, 2000);
    }, 500);
  }

  // ==========================================
  // 11. CONFETTI NA PÁSCOA
  // ==========================================
  function createConfetti() {
    const colors = ['#fbbf24', '#f59e0b', '#ef4444', '#10b981', '#3b82f6'];
    const container = document.querySelector('.confetti-container');
    
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('span');
      confetti.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        animation: confetti-fall ${3 + Math.random() * 2}s linear infinite;
        animation-delay: ${Math.random() * 3}s;
      `;
      
      container.appendChild(confetti);
    }
  }

  createConfetti();

  // ==========================================
  // 12. SERVICE WORKER REGISTRATION (PWA)
  // ==========================================
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(registration => {
          console.log('SW registrado:', registration);
        })
        .catch(error => {
          console.log('SW falhou:', error);
        });
    });
  }

  // ==========================================
  // 13. INICIALIZAÇÃO
  // ==========================================
  loadLikes();
  updateViaSacraProgress();
  highlightCurrentPeriod();

  // Animação inicial dos cards
  document.querySelectorAll('.day-card').forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('visible');
    }, index * 100);
  });/**
 * CAMINHO DA FÉ - MAIN.JS
 * Quaresma à Pentecostes - Versão Limpo (com módulos)
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ==========================================
  // 1. SCROLL REVEAL COM INTERSECTION OBSERVER
  // ==========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observar elementos
  document.querySelectorAll('.day-card, .estacao-card, .dica-card, .section-header').forEach(el => {
    scrollObserver.observe(el);
  });

  // ==========================================
  // 2. EFEITO DE BRILHO NO MOUSE (CARDS)
  // ==========================================
  document.querySelectorAll('.day-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // ==========================================
  // 3. SISTEMA DE LIKES COM LOCALSTORAGE
  // ==========================================
  const likeButtons = document.querySelectorAll('.like-btn');
  
  function loadLikes() {
    likeButtons.forEach(btn => {
      const dayName = btn.getAttribute('data-day');
      const saved = localStorage.getItem(`caminho_felike_${dayName}`);
      const count = saved ? parseInt(saved, 10) : 0;
      const countSpan = btn.querySelector('.like-count');
      
      if (countSpan) {
        countSpan.textContent = count;
      }
      
      if (count > 0) {
        const icon = btn.querySelector('i');
        icon.classList.remove('far');
        icon.classList.add('fas', 'text-red-500');
      }
    });
  }

  function saveLike(dayName, count) {
    localStorage.setItem(`caminho_felike_${dayName}`, count);
  }

  likeButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const dayName = this.getAttribute('data-day');
      const countSpan = this.querySelector('.like-count');
      const icon = this.querySelector('i');
      let currentCount = parseInt(countSpan.textContent, 10);
      
      currentCount++;
      countSpan.textContent = currentCount;
      saveLike(dayName, currentCount);
      
      icon.classList.remove('far');
      icon.classList.add('fas', 'text-red-500');
      this.classList.add('liked');
      
      createHeartParticles(this);
      
      setTimeout(() => {
        this.classList.remove('liked');
      }, 500);
    });
  });

  function createHeartParticles(button) {
    const rect = button.getBoundingClientRect();
    const colors = ['❤️', '💖', '💕', '💗', '💝'];
    
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('span');
      particle.textContent = colors[Math.floor(Math.random() * colors.length)];
      particle.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        font-size: ${1 + Math.random()}rem;
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
      `;
      
      document.body.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / 6;
      const velocity = 60 + Math.random() * 40;
      let x = 0, y = 0;
      let opacity = 1;
      
      const animate = () => {
        x += Math.cos(angle) * velocity * 0.02;
        y += Math.sin(angle) * velocity * 0.02 - 1;
        opacity -= 0.02;
        
        particle.style.transform = `translate(${x}px, ${y}px) scale(${opacity})`;
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };
      
      requestAnimationFrame(animate);
    }
  }

  // ==========================================
  // 4. NAVEGAÇÃO STICKY
  // ==========================================
  const nav = document.querySelector('.sticky-nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // ==========================================
  // 5. BOTÃO VOLTAR AO TOPO
  // ==========================================
  const backToTopBtn = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================
  // 6. PWA - INSTALL PROMPT
  // ==========================================
  let deferredPrompt;
  const installBtn = document.getElementById('installBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove('hidden');
  });

  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA instalado!');
        installBtn.classList.add('hidden');
      }
      
      deferredPrompt = null;
    }
  });

  window.addEventListener('appinstalled', () => {
    installBtn.classList.add('hidden');
    deferredPrompt = null;
  });

  // ==========================================
  // 7. PARALLAX SUAVE
  // ==========================================
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-decoration');
        
        if (parallax) {
          parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  });

  // ==========================================
  // 8. ANIMAÇÃO DE CONTADOR
  // ==========================================
  function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      element.textContent = Math.floor(easeOutQuart * (end - start) + start);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }

  const counterElement = document.querySelector('.counter-number');
  if (counterElement) {
    setTimeout(() => {
      animateCounter(counterElement, 0, 40, 2000);
    }, 500);
  }

  // ==========================================
  // 9. CONFETTI NA PÁSCOA
  // ==========================================
  function createConfetti() {
    const colors = ['#fbbf24', '#f59e0b', '#ef4444', '#10b981', '#3b82f6'];
    const container = document.querySelector('.confetti-container');
    
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('span');
      confetti.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        animation: confetti-fall ${3 + Math.random() * 2}s linear infinite;
        animation-delay: ${Math.random() * 3}s;
      `;
      
      container.appendChild(confetti);
    }
  }

  createConfetti();

  // ==========================================
  // 10. SERVICE WORKER REGISTRATION (PWA)
  // ==========================================
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(registration => {
          console.log('SW registrado:', registration);
        })
        .catch(error => {
          console.log('SW falhou:', error);
        });
    });
  }

  // ==========================================
  // 11. INICIALIZAÇÃO
  // ==========================================
  loadLikes();
  // ViaSacra e CalendarioLiturgico são inicializados nos próprios módulos

  document.querySelectorAll('.day-card').forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('visible');
    }, index * 100);
  });

  console.log('🌿 Caminho da Fé - Main.js carregado!');
});

  console.log('🌿 Caminho da Fé - Sistema carregado!');
  console.log('📖 Quaresma → Semana Santa → Páscoa → Pentecostes');
});