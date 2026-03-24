/**
 * SEMANA SANTA INFANTIL - ANIMATIONS.JS
 * Animações e interatividade para crianças (2-11 anos)
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ==========================================
  // 1. SISTEMA DE SCROLL REVEAL (AOS-like)
  // ==========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Adiciona classe especial para animação em cascata
        if (entry.target.classList.contains('day-card')) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      }
    });
  }, observerOptions);

  // Observar todos os cards
  document.querySelectorAll('.day-card, .dica-extra, .versiculo').forEach(el => {
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
  
  // Carregar likes salvos
  function loadLikes() {
    likeButtons.forEach(btn => {
      const dayName = btn.getAttribute('data-day');
      const saved = localStorage.getItem(`semana_santa_like_${dayName}`);
      const count = saved ? parseInt(saved, 10) : 0;
      const countSpan = btn.querySelector('.like-count');
      
      if (countSpan) {
        countSpan.textContent = count;
      }
      
      // Restaurar estado "liked" se já tiver interação
      if (count > 0) {
        const icon = btn.querySelector('i');
        icon.classList.remove('far');
        icon.classList.add('fas', 'text-red-500');
      }
    });
  }

  // Salvar like
  function saveLike(dayName, count) {
    localStorage.setItem(`semana_santa_like_${dayName}`, count);
  }

  // Adicionar evento de clique
  likeButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const dayName = this.getAttribute('data-day');
      const countSpan = this.querySelector('.like-count');
      const icon = this.querySelector('i');
      let currentCount = parseInt(countSpan.textContent, 10);
      
      // Incrementar contador
      currentCount++;
      countSpan.textContent = currentCount;
      
      // Salvar no localStorage
      saveLike(dayName, currentCount);
      
      // Animação do coração
      icon.classList.remove('far');
      icon.classList.add('fas', 'text-red-500');
      this.classList.add('liked');
      
      // Efeito de partículas (corações)
      createHeartParticles(this);
      
      // Remover classe de animação após terminar
      setTimeout(() => {
        this.classList.remove('liked');
      }, 500);
    });
  });

  // Criar partículas de coração
  function createHeartParticles(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 5; i++) {
      const heart = document.createElement('span');
      heart.innerHTML = '❤️';
      heart.style.position = 'fixed';
      heart.style.left = `${centerX}px`;
      heart.style.top = `${centerY}px`;
      heart.style.fontSize = '1rem';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '9999';
      heart.style.opacity = '1';
      heart.style.transform = 'translate(-50%, -50%)';
      
      document.body.appendChild(heart);
      
      // Animação aleatória
      const angle = (Math.PI * 2 * i) / 5;
      const velocity = 50 + Math.random() * 50;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 50;
      
      let posX = centerX;
      let posY = centerY;
      let opacity = 1;
      
      const animate = () => {
        posX += vx * 0.02;
        posY += vy * 0.02;
        opacity -= 0.02;
        
        heart.style.left = `${posX}px`;
        heart.style.top = `${posY}px`;
        heart.style.opacity = opacity;
        heart.style.transform = `translate(-50%, -50%) scale(${opacity})`;
        
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          heart.remove();
        }
      };
      
      requestAnimationFrame(animate);
    }
  }

  // ==========================================
  // 4. NAVEGAÇÃO STICKY COM SCROLL
  // ==========================================
  const nav = document.querySelector('.sticky-nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Adicionar sombra quando scrollar
    if (currentScroll > 50) {
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ==========================================
  // 6. ANIMAÇÃO DE CONTADOR NOS LIKES
  // ==========================================
  function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      element.textContent = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // ==========================================
  // 7. HIGHLIGHT DO DIA ATUAL (OPCIONAL)
  // ==========================================
  function highlightCurrentDay() {
    const days = ['domingo', 'segunda', 'tercaquarta', 'quinta', 'sexta', 'sabado', 'pascoa'];
    // Aqui você pode adicionar lógica para destacar o dia atual baseado na data
    // Por exemplo, durante a Semana Santa de 2024/2025
  }

  // ==========================================
  // 8. PARALLAX SUAVE NO HEADER
  // ==========================================
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-decoration');
    if (parallax) {
      parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });

  // ==========================================
  // 9. INICIALIZAÇÃO
  // ==========================================
  loadLikes();
  
  // Adicionar classe de animação inicial aos cards com delay
  document.querySelectorAll('.day-card').forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('visible');
    }, index * 100);
  });

  console.log('🌿 Semana Santa Infantil - Sistema carregado com sucesso!');
});