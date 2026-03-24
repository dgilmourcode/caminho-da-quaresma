/**
 * CALENDAR.JS
 * Calcula datas móveis da Páscoa e períodos litúrgicos
 */

const CalendarioLiturgico = (function() {
  
  // Configurações
  const CONFIG = {
    anos: {
      2025: { pascoa: new Date(2025, 3, 20),  // 20 de abril
              pentecostes: new Date(2025, 5, 8) }, // 8 de junho
      2026: { pascoa: new Date(2026, 3, 5),   // 5 de abril
              pentecostes: new Date(2026, 4, 24) }, // 24 de maio
      2027: { pascoa: new Date(2027, 2, 28),  // 28 de março
              pentecostes: new Date(2027, 4, 16) }  // 16 de maio
    }
  };

  // Calcular Páscoa (Algoritmo de Gauss)
  function calcularPascoa(ano) {
    const a = ano % 19;
    const b = Math.floor(ano / 100);
    const c = ano % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-11
    const dia = ((h + l - 7 * m + 114) % 31) + 1;
    
    return new Date(ano, mes, dia);
  }

  // Obter datas importantes baseado na Páscoa
  function getDatasImportantes(ano = new Date().getFullYear()) {
    const pascoa = CONFIG.anos[ano]?.pascoa || calcularPascoa(ano);
    
    // Subtrair dias
    const subtrairDias = (data, dias) => {
      const result = new Date(data);
      result.setDate(result.getDate() - dias);
      return result;
    };
    
    // Adicionar dias
    const adicionarDias = (data, dias) => {
      const result = new Date(data);
      result.setDate(result.getDate() + dias);
      return result;
    };

    return {
      cinzas: subtrairDias(pascoa, 46),        // 46 dias antes
      domingoRamos: subtrairDias(pascoa, 7),   // 7 dias antes
      quintaFeiraSanta: subtrairDias(pascoa, 3), // 3 dias antes
      sextaFeiraSanta: subtrairDias(pascoa, 2),  // 2 dias antes
      sabadoSanto: subtrairDias(pascoa, 1),      // 1 dia antes
      pascoa: pascoa,
      ascensao: adicionarDias(pascoa, 39),       // 39 dias depois (quinta)
      pentecostes: adicionarDias(pascoa, 49)     // 49 dias depois
    };
  }

  // Formatar data
  function formatarData(data) {
    const opcoes = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return data.toLocaleDateString('pt-BR', opcoes);
  }

  // Formatar curto
  function formatarCurto(data) {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  }

  // Verificar período atual
  function getPeriodoAtual() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const ano = hoje.getFullYear();
    const datas = getDatasImportantes(ano);
    
    // Ajustar para próximo ano se já passou
    if (hoje > datas.pentecostes) {
      return getPeriodoAtualProximoAno(ano + 1);
    }
    
    // Determinar período
    if (hoje < datas.cinzas) {
      return { nome: 'tempo-comum', label: 'Tempo Comum', cor: 'green' };
    } else if (hoje < datas.domingoRamos) {
      return { nome: 'quaresma', label: 'Quaresma', cor: 'purple', datas };
    } else if (hoje < datas.pascoa) {
      return { nome: 'semana-santa', label: 'Semana Santa', cor: 'red', datas };
    } else if (hoje < datas.pentecostes) {
      return { nome: 'pascoa', label: 'Tempo da Páscoa', cor: 'gold', datas };
    } else {
      return { nome: 'pentecostes', label: 'Pentecostes', cor: 'orange', datas };
    }
  }

  function getPeriodoAtualProximoAno(ano) {
    const datas = getDatasImportantes(ano);
    return { 
      nome: 'tempo-comum', 
      label: 'Tempo Comum', 
      cor: 'green',
      proximoAno: true,
      datas 
    };
  }

  // Dias até a Páscoa
  function getContagemRegressiva() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    let datas = getDatasImportantes(ano);
    
    // Se já passou, usar próximo ano
    if (hoje > datas.pentecostes) {
      datas = getDatasImportantes(ano + 1);
    }
    
    const diff = datas.pascoa - hoje;
    const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    return {
      dias,
      datas,
      pascoa: datas.pascoa
    };
  }

  // Gerar calendário visual
  function gerarCalendarioHTML(ano = new Date().getFullYear()) {
    const datas = getDatasImportantes(ano);
    
    const eventos = [
      { data: datas.cinzas, nome: 'Cinzas', icone: '✝️', cor: 'gray' },
      { data: datas.domingoRamos, nome: 'Ramos', icone: '🌿', cor: 'green' },
      { data: datas.quintaFeiraSanta, nome: 'Ceia', icone: '🍞', cor: 'purple' },
      { data: datas.sextaFeiraSanta, nome: 'Paixão', icone: '✝️', cor: 'red' },
      { data: datas.sabadoSanto, nome: 'Vigília', icone: '🕯️', cor: 'indigo' },
      { data: datas.pascoa, nome: 'Páscoa', icone: '☀️', cor: 'gold' },
      { data: datas.ascensao, nome: 'Ascensão', icone: '☁️', cor: 'blue' },
      { data: datas.pentecostes, nome: 'Pentecostes', icone: '🔥', cor: 'orange' }
    ];

    let html = '<div class="calendario-liturgico">';
    html += `<h4>📅 Calendário ${ano}</h4>`;
    html += '<div class="calendario-eventos">';
    
    eventos.forEach(evento => {
      const hoje = new Date();
      const passou = evento.data < hoje;
      const classe = passou ? 'passado' : 'futuro';
      
      html += `
        <div class="evento ${classe}" data-cor="${evento.cor}">
          <span class="evento-icone">${evento.icone}</span>
          <span class="evento-nome">${evento.nome}</span>
          <span class="evento-data">${formatarCurto(evento.data)}</span>
        </div>
      `;
    });
    
    html += '</div></div>';
    return html;
  }

  // Widget de contagem
  function criarWidgetContagem() {
    const container = document.getElementById('contagem-widget');
    if (!container) return;
    
    const { dias, pascoa } = getContagemRegressiva();
    const periodo = getPeriodoAtual();
    
    let mensagem = '';
    let icone = '';
    
    if (periodo.nome === 'quaresma') {
      mensagem = `${dias} dias para a Páscoa`;
      icone = '⏳';
    } else if (periodo.nome === 'semana-santa') {
      mensagem = `Faltam ${dias} dias!`;
      icone = '🌿';
    } else if (periodo.nome === 'pascoa') {
      mensagem = 'Tempo da Páscoa! Aleluia!';
      icone = '☀️';
    } else {
      mensagem = `Próxima Páscoa: ${formatarCurto(pascoa)}`;
      icone = '📅';
    }
    
    container.innerHTML = `
      <div class="widget-contagem periodo-${periodo.cor}">
        <span class="widget-icone">${icone}</span>
        <span class="widget-texto">${mensagem}</span>
      </div>
    `;
  }

  // Destacar seção atual
  function destacarSecaoAtual() {
    const periodo = getPeriodoAtual();
    const navPill = document.querySelector(`.nav-${periodo.nome === 'semana-santa' ? 'semana' : periodo.nome}`);
    
    if (navPill) {
      navPill.classList.add('active');
      navPill.style.animation = 'pulse 2s infinite';
    }
    
    // Scroll automático para seção atual (opcional)
    // const secao = document.getElementById(periodo.nome === 'semana-santa' ? 'semana-santa' : periodo.nome);
    // if (secao && !window.location.hash) {
    //   setTimeout(() => secao.scrollIntoView({ behavior: 'smooth' }), 1000);
    // }
  }

  // Exportar funções
  return {
    calcularPascoa,
    getDatasImportantes,
    getPeriodoAtual,
    getContagemRegressiva,
    formatarData,
    formatarCurto,
    gerarCalendarioHTML,
    criarWidgetContagem,
    destacarSecaoAtual
  };

})();

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  CalendarioLiturgico.criarWidgetContagem();
  CalendarioLiturgico.destacarSecaoAtual();
  
  // Atualizar a cada hora
  setInterval(() => {
    CalendarioLiturgico.criarWidgetContagem();
  }, 3600000);
});