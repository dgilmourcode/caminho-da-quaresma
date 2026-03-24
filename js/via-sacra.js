/**
 * VIA SACRA.JS
 * Módulo específico para as 14 estações da Via Sacra
 */

const ViaSacra = (function() {
  
  // Configurações
  const CONFIG = {
    totalEstacoes: 14,
    storageKey: 'via_sacra_progresso',
    animationDuration: 500
  };

  // Estado
  let estado = {
    visitadas: [],
    atual: 1,
    completada: false
  };

  // Inicialização
  function init() {
    carregarProgresso();
    renderizarEstacoes();
    atualizarUI();
    bindEvents();
  }

  // Carregar do localStorage
  function carregarProgresso() {
    const salvo = localStorage.getItem(CONFIG.storageKey);
    if (salvo) {
      estado = JSON.parse(salvo);
    }
  }

  // Salvar no localStorage
  function salvarProgresso() {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(estado));
  }

  // Renderizar estações dinamicamente (opcional)
  function renderizarEstacoes() {
    const container = document.querySelector('.via-sacra-grid');
    if (!container) return;

    // Se já existe HTML estático, apenas marcar como visitadas
    estado.visitadas.forEach(num => {
      const estacao = container.querySelector(`[data-estacao="${num}"]`);
      if (estacao) {
        estacao.classList.add('completed', 'visited');
        estacao.setAttribute('aria-label', `Estação ${num} - Visitada`);
      }
    });
  }

  // Marcar estação como visitada
  function marcarVisitada(numeroEstacao) {
    if (!estado.visitadas.includes(numeroEstacao)) {
      estado.visitadas.push(numeroEstacao);
      estado.atual = Math.max(...estado.visitadas) + 1;
      
      // Verificar se completou
      if (estado.visitadas.length === CONFIG.totalEstacoes) {
        estado.completada = true;
        celebrarCompletude();
      }
      
      salvarProgresso();
      atualizarUI();
      
      // Feedback visual
      mostrarFeedback(numeroEstacao);
    }
  }

  // Desmarcar estação
  function desmarcarVisitada(numeroEstacao) {
    estado.visitadas = estado.visitadas.filter(n => n !== numeroEstacao);
    estado.atual = estado.visitadas.length > 0 ? Math.max(...estado.visitadas) + 1 : 1;
    estado.completada = false;
    
    salvarProgresso();
    atualizarUI();
  }

  // Atualizar interface
  function atualizarUI() {
    // Barra de progresso
    const progressBar = document.getElementById('viaSacraProgress');
    const contador = document.getElementById('estacoesCompletadas');
    
    if (progressBar) {
      const porcentagem = (estado.visitadas.length / CONFIG.totalEstacoes) * 100;
      progressBar.style.width = `${porcentagem}%`;
    }
    
    if (contador) {
      contador.textContent = estado.visitadas.length;
    }

    // Atualizar cards
    document.querySelectorAll('.estacao-card').forEach(card => {
      const num = parseInt(card.getAttribute('data-estacao'));
      
      if (estado.visitadas.includes(num)) {
        card.classList.add('completed', 'visited');
        card.querySelector('.estacao-status')?.remove();
        
        const status = document.createElement('span');
        status.className = 'estacao-status completed-badge';
        status.innerHTML = '✓ Concluída';
        card.querySelector('.estacao-content').appendChild(status);
      } else {
        card.classList.remove('completed', 'visited');
        const badge = card.querySelector('.completed-badge');
        if (badge) badge.remove();
      }

      // Destacar próxima
      if (num === estado.atual && !estado.visitadas.includes(num)) {
        card.classList.add('proxima');
      } else {
        card.classList.remove('proxima');
      }
    });
  }

  // Feedback visual ao marcar
  function mostrarFeedback(numero) {
    const card = document.querySelector(`[data-estacao="${numero}"]`);
    if (!card) return;

    // Animação de pulso
    card.style.animation = 'none';
    card.offsetHeight; // Trigger reflow
    card.style.animation = 'pulse-success 0.6s ease';

    // Confetti sutil
    if (window.confetti) {
      const rect = card.getBoundingClientRect();
      confetti({
        particleCount: 30,
        spread: 50,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight
        },
        colors: ['#22c55e', '#10b981', '#059669']
      });
    }
  }

  // Celebrar quando completar todas
  function celebrarCompletude() {
    setTimeout(() => {
      if (window.confetti) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#eab308', '#f59e0b', '#ef4444']
        });
      }

      // Modal de parabéns
      mostrarModalParabens();
    }, 500);
  }

  // Modal de parabéns
  function mostrarModalParabens() {
    const modal = document.createElement('div');
    modal.className = 'modal-via-sacra';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-icon">🎉</div>
        <h3>Parabéns!</h3>
        <p>Você completou toda a Via Sacra!</p>
        <p class="modal-versiculo">"Se alguém quiser vir após mim, renuncie-se a si mesmo, tome a sua cruz e siga-me."</p>
        <button class="modal-btn" onclick="this.closest('.modal-via-sacra').remove()">
          Continuar
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animação de entrada
    requestAnimationFrame(() => {
      modal.classList.add('visible');
    });
  }

  // Event listeners
  function bindEvents() {
    // Clique nas estações
    document.querySelectorAll('.estacao-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Não marcar se clicou em botão específico
        if (e.target.closest('.estacao-actions')) return;
        
        const num = parseInt(card.getAttribute('data-estacao'));
        
        if (estado.visitadas.includes(num)) {
          // Toggle: desmarcar se já estiver marcada
          if (confirm('Deseja desmarcar esta estação?')) {
            desmarcarVisitada(num);
          }
        } else {
          marcarVisitada(num);
        }
      });

      // Hover effect
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateX(10px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    // Botão reset
    const resetBtn = document.getElementById('resetViaSacra');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja recomeçar a Via Sacra? Todo o progresso será perdido.')) {
          resetarTudo();
        }
      });
    }

    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && estado.atual < CONFIG.totalEstacoes) {
        scrollToEstacao(estado.atual + 1);
      } else if (e.key === 'ArrowLeft' && estado.atual > 1) {
        scrollToEstacao(estado.atual - 1);
      }
    });
  }

  // Scroll para estação específica
  function scrollToEstacao(numero) {
    const estacao = document.querySelector(`[data-estacao="${numero}"]`);
    if (estacao) {
      estacao.scrollIntoView({ behavior: 'smooth', block: 'center' });
      estacao.classList.add('highlight');
      setTimeout(() => estacao.classList.remove('highlight'), 1000);
    }
  }

  // Resetar tudo
  function resetarTudo() {
    estado = {
      visitadas: [],
      atual: 1,
      completada: false
    };
    salvarProgresso();
    atualizarUI();
    
    // Feedback
    const btn = document.getElementById('resetViaSacra');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Reiniciado!';
    setTimeout(() => {
      btn.innerHTML = originalText;
    }, 2000);
  }

  // API pública
  return {
    init,
    marcarVisitada,
    desmarcarVisitada,
    getProgresso: () => ({ ...estado }),
    resetar: resetarTudo
  };

})();

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ViaSacra.init);
} else {
  ViaSacra.init();
}