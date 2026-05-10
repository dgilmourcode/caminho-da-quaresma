(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function s(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(a){if(a.ep)return;a.ep=!0;const n=s(a);fetch(a.href,n)}})();const m={dataUrl:"/caminho-da-quaresma/data.json",selectors:{navbar:"#navbar",navToggle:"#navToggle",mobileMenu:"#mobileMenu",navLinks:".nav-link",backToTop:"#backToTop",installBtn:"#installBtn",modal:"#imageModal",modalClose:"#modalClose",year:"#currentYear",counters:"[data-target]",sections:"section[id]",grids:{quaresma:"quaresmaGrid",semana:"semanaGrid","via-sacra":"viaSacraGrid",triduo:"triduoGrid",pascoa:"pascoaGrid",dicas:"dicasGrid"}},storage:{likesPrefix:"caminho_fe_like_",viaSacraKey:"via_sacra_progress"},animation:{particlesCount:8,confettiCount:60}},r={throttle(e,t){let s=!1;return(...o)=>{s||(e.apply(this,o),s=!0,setTimeout(()=>s=!1,t))}},animateNumber(e,t,s,o=2e3){const a=s-t,n=performance.now(),i=l=>{const d=Math.min((l-n)/o,1),c=1-Math.pow(1-d,4);e.textContent=Math.floor(t+a*c),d<1&&requestAnimationFrame(i)};requestAnimationFrame(i)},createParticles(e,t=8){const s=e.getBoundingClientRect(),o=s.left+s.width/2,a=s.top+s.height/2,n=["❤️","💖","✨","💕","🤍"];for(let i=0;i<t;i++){const l=document.createElement("span");l.textContent=n[i%n.length],l.style.cssText=`
        position:fixed; left:${o}px; top:${a}px;
        font-size:${.8+Math.random()*.8}rem;
        pointer-events:none; z-index:9999; opacity:1;
        transition:transform ${600+Math.random()*300}ms cubic-bezier(.2,.8,.3,1), opacity ${600+Math.random()*300}ms ease-out;
      `,document.body.appendChild(l),requestAnimationFrame(()=>{const d=Math.PI*2*i/t+Math.random()*.5,c=40+Math.random()*60;l.style.transform=`translate(${Math.cos(d)*c}px, ${Math.sin(d)*c-40}px) scale(0.3)`,l.style.opacity="0"}),setTimeout(()=>l.remove(),1200)}},shareWhatsApp(e,t,s){const o=`🌿 *${e}*
📌 ${t}

${s}

_Caminho da Fé_`;window.open(`https://wa.me/?text=${encodeURIComponent(o)}`,"_blank")},shareFacebook(e,t,s){const o=`${e} - ${t}: ${s}`;window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(o)}`,"_blank")},shareInstagram(e,t,s){const o=`🌿 ${e}
📌 ${t}

${s}

#CaminhoDaFé #Fé #Católico`;navigator.clipboard.writeText(o).then(()=>this.showToast("📋 Copiado! Cole no Instagram")).catch(()=>alert(`Copie o texto:

`+o))},shareX(e,t,s){const o=`🌿 ${e} - ${t}: ${s} #CaminhoDaFé`;window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(o)}&url=${encodeURIComponent(window.location.href)}`,"_blank")},showToast(e,t=3e3){const s=document.querySelector(".toast-notification");s&&s.remove();const o=document.createElement("div");o.className="toast-notification fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur text-white px-5 py-3 rounded-full text-sm font-medium z-[10000] animate-fade-in-up",o.textContent=e,document.body.appendChild(o),setTimeout(()=>o.remove(),t)},escapeHtml(e){if(!e)return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}},g={overlay:null,container:null,init(){var e;if(this.overlay=document.getElementById("imageModal"),this.container=(e=this.overlay)==null?void 0:e.querySelector(".modal-container"),!this.overlay||!this.container){console.error("❌ Modal não encontrado!");return}console.log("✅ Modal inicializado")},open(e){var a,n;if(!this.overlay||!this.container){console.error("Modal não inicializado");return}console.log("📱 Abrindo modal:",e.title);const t=`
      <div class="bg-white rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
        ${e.image?`
          <div class="relative h-64 overflow-hidden">
            <img src="${e.image}" alt="${r.escapeHtml(e.title)}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        `:""}
        <div class="p-6">
          <h3 class="font-serif font-bold text-2xl text-stone-900 mb-2">${r.escapeHtml(e.title)}</h3>
          
          ${e.theme?`
            <span class="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold mb-4">
              ${r.escapeHtml(e.theme)}
            </span>
          `:""}
          
          ${e.verseText?`
            <div class="bg-stone-50 rounded-xl p-4 mb-4 border-l-4 border-red-400">
              <p class="text-stone-700 italic text-sm">"${r.escapeHtml(e.verseText)}"</p>
              <p class="text-stone-400 text-xs mt-1">${r.escapeHtml(e.verse||"")}</p>
            </div>
          `:""}
          
          ${e.description?`
            <div class="mb-4">
              <h4 class="font-semibold text-stone-900 mb-2 flex items-center gap-2">
                <i class="fas fa-info-circle text-red-500"></i> Descrição
              </h4>
              <p class="text-stone-600 text-sm leading-relaxed">${r.escapeHtml(e.description)}</p>
            </div>
          `:""}
          
          ${e.reflection?`
            <div class="mb-4">
              <h4 class="font-semibold text-stone-900 mb-2 flex items-center gap-2">
                <i class="fas fa-heart text-red-500"></i> Reflexão
              </h4>
              <p class="text-stone-600 text-sm leading-relaxed">${r.escapeHtml(e.reflection)}</p>
            </div>
          `:""}
          
          ${(a=e.activities)!=null&&a.length?`
            <div class="mb-4">
              <h4 class="font-semibold text-stone-900 mb-2 flex items-center gap-2">
                <i class="fas fa-lightbulb text-amber-500"></i> Atividades
              </h4>
              <ul class="space-y-2">
                ${e.activities.map(i=>`<li class="flex items-start gap-2 text-sm text-stone-600"><span class="text-amber-500">✝️</span> ${r.escapeHtml(i)}</li>`).join("")}
              </ul>
            </div>
          `:""}
          
          ${(n=e.suggestions)!=null&&n.length?`
            <div class="mb-4">
              <h4 class="font-semibold text-stone-900 mb-2 flex items-center gap-2">
                <i class="fas fa-star text-yellow-500"></i> Sugestões
              </h4>
              <ul class="space-y-2">
                ${e.suggestions.map(i=>`<li class="flex items-start gap-2 text-sm text-stone-600"><span class="text-yellow-500">✨</span> ${r.escapeHtml(i)}</li>`).join("")}
              </ul>
            </div>
          `:""}
        </div>
      </div>
    `,s=`
      <button class="modal-close-btn absolute -top-3 -right-3 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-stone-600 hover:text-red-500 hover:scale-110 transition-all shadow-lg border border-stone-100">
        <i class="fas fa-times"></i>
      </button>
    `;this.container.innerHTML=s+t,this.overlay.classList.remove("hidden"),this.overlay.classList.add("flex"),document.body.style.overflow="hidden";const o=this.container.querySelector(".modal-close-btn");o==null||o.addEventListener("click",()=>this.close()),this.overlay.onclick=i=>{i.target===this.overlay&&this.close()}},close(){this.overlay&&(this.overlay.classList.add("hidden"),this.overlay.classList.remove("flex"),document.body.style.overflow="")}},f={init(){document.addEventListener("click",e=>{const t=e.target.closest(".like-btn");if(!t)return;const s=t.dataset.id;s&&this.toggleLike(t,s)})},toggleLike(e,t){const s=e.querySelector(".like-count");let o=parseInt((s==null?void 0:s.textContent)||"0",10);localStorage.getItem(`${m.storage.likesPrefix}${t}`)==="true"?(o--,s.textContent=o,e.classList.remove("liked"),localStorage.setItem(`${m.storage.likesPrefix}${t}`,"false")):(o++,s.textContent=o,e.classList.add("liked"),localStorage.setItem(`${m.storage.likesPrefix}${t}`,"true"),r.createParticles(e))},loadStates(){document.querySelectorAll(".like-btn").forEach(e=>{const t=e.dataset.id;localStorage.getItem(`${m.storage.likesPrefix}${t}`)==="true"&&e.classList.add("liked")})}},x={completedStations:[],init(){this.loadProgress(),this.updateUI(),this.bindEvents()},loadProgress(){try{const e=localStorage.getItem(m.storage.viaSacraKey);e?this.completedStations=JSON.parse(e):this.completedStations=[]}catch(e){console.warn("Erro ao carregar progresso:",e),this.completedStations=[]}},saveProgress(){localStorage.setItem(m.storage.viaSacraKey,JSON.stringify(this.completedStations))},toggleStation(e){const t=this.completedStations.indexOf(e);t===-1?(this.completedStations.push(e),this.completedStations.length===14&&this.celebrate()):this.completedStations.splice(t,1),this.saveProgress(),this.updateUI()},updateUI(){const e=this.completedStations.length/14*100,t=document.getElementById("viaSacraProgress"),s=document.getElementById("estacoesCompletadas");t&&(t.style.width=`${e}%`),s&&(s.textContent=`${this.completedStations.length}/14`),document.querySelectorAll(".estacao-card").forEach(o=>{const a=parseInt(o.dataset.estacao,10);this.completedStations.includes(a)?o.classList.add("completed"):o.classList.remove("completed")})},celebrate(){r.showToast("🎉 Parabéns! Você completou a Via Sacra!",4e3);for(let e=0;e<50;e++)setTimeout(()=>{const t=document.createElement("div");t.style.cssText=`
          position: fixed; width: 10px; height: 10px;
          background: ${["#ef4444","#eab308","#22c55e"][Math.floor(Math.random()*3)]};
          left: ${Math.random()*100}vw; top: -10px;
          border-radius: 2px; pointer-events: none; z-index: 9999;
          animation: fall ${1+Math.random()*2}s linear forwards;
        `,document.body.appendChild(t),setTimeout(()=>t.remove(),2e3)},e*30)},bindEvents(){var e;(e=document.getElementById("resetViaSacra"))==null||e.addEventListener("click",()=>{confirm("🔄 Recomeçar a Via Sacra? Todo o progresso será perdido.")&&(this.completedStations=[],this.saveProgress(),this.updateUI(),r.showToast("✅ Via Sacra reiniciada!"))})}},b=["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV"];function v(e){const t=e.image||"https://images.pexels.com/photos/2598347/pexels-photo-2598347.jpeg?w=400&h=300&fit=crop",s=e.week?`${e.week}ª SEMANA`:"TEMPO ESPECIAL",o={title:e.title,theme:e.theme||"",verse:e.verse||"",verseText:e.verseText||"",reflection:e.reflection||"",description:e.description||"",activities:e.activities||[],suggestions:e.suggestions||[],image:t};return JSON.stringify(o).replace(/'/g,"&#39;"),`
    <article class="quaresma-card group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer" data-id="${e.id}" data-period="${e.period}">
      <!-- Foto no topo - estilo Dribbble -->
      <div class="relative h-44 overflow-hidden rounded-t-2xl bg-gradient-to-br from-purple-100 to-purple-50">
        <img src="${t}" alt="${r.escapeHtml(e.title)}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <!-- Botão expand -->
        <button class="expand-btn absolute top-2 right-2 w-7 h-7 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-400 hover:text-purple-600 hover:scale-110 transition-all duration-300 shadow-md z-10" 
          data-modal="${encodeURIComponent(JSON.stringify(o))}"
          aria-label="Ver detalhes">
          <i class="fas fa-expand text-xs"></i>
        </button>
        
        <!-- Badge da semana -->
        <div class="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-purple-600 uppercase tracking-wider shadow-md">
          ${s}
        </div>
      </div>
      
      <!-- Conteúdo abaixo da foto -->
      <div class="p-5">
        <!-- Tema -->
        ${e.theme?`
          <div class="flex items-center gap-1.5 mb-2">
            <span class="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            <span class="text-[11px] font-semibold text-purple-600 uppercase tracking-wide">${r.escapeHtml(e.theme)}</span>
          </div>
        `:""}
        
        <!-- Título -->
        <h3 class="font-serif font-bold text-xl text-stone-900 mb-2 leading-tight group-hover:text-purple-700 transition-colors duration-300">
          ${r.escapeHtml(e.title)}
        </h3>
        
        <!-- Mensagem/Descrição -->
        <p class="text-sm text-stone-500 line-clamp-2 mb-4">
          ${r.escapeHtml(e.message||"")}
        </p>

        <!-- Footer com like e compartilhar -->
        <div class="flex items-center justify-between mt-1">
          <button class="like-btn flex items-center gap-1 text-[10px] text-stone-400 hover:text-red-500 transition-colors duration-200" data-id="${e.id}">
            <i class="far fa-heart text-[2xl]"></i>
            <span class="like-count">0</span>
          </button>
          
          <div class="flex items-center gap-1.5">
            <button class="share-btn share-whatsapp w-12 h-12 rounded-lg flex items-center justify-center text-white bg-[#25D366] hover:scale-110 transition-all"
              onclick="Utils.shareWhatsApp('${e.title.replace(/'/g,"\\'")}', '${(e.theme||"").replace(/'/g,"\\'")}', '${(e.message||"").replace(/'/g,"\\'")}')">
              <i class="fab fa-whatsapp text-[22px]"></i>
            </button>
            <button class="share-btn share-instagram w-12 h-12 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:scale-110 transition-all"
              onclick="Utils.shareInstagram('${e.title.replace(/'/g,"\\'")}', '${(e.theme||"").replace(/'/g,"\\'")}', '${(e.message||"").replace(/'/g,"\\'")}')">
              <i class="fab fa-instagram text-[22px]"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  `}function w(e){const t=e.image||"https://images.unsplash.com/photo-1711634998612-68a22cddb3c4?w=400&h=400&fit=crop",s={title:e.title,theme:e.theme||"",verse:e.verse||"",verseText:e.verseText||"",reflection:e.reflection||"",description:e.description||"",activities:e.activities||[],suggestions:e.suggestions||[],image:t};return JSON.stringify(s).replace(/'/g,"&#39;"),`
    <article class="semana-card group bg-white rounded-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer flex" data-id="${e.id}">
      <!-- Foto lateral esquerda -->
      <div class="w-22 h-22 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden ">
        <img src="${t}" alt="${r.escapeHtml(e.title)}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
      </div>
      
      <!-- Conteúdo lado direito -->
      <div class="flex-1 p-3 sm:p-4 relative">
        <!-- Botão expand -->
        <button class="expand-btn absolute top-2 right-2 w-7 h-7 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-stone-400 hover:text-purple-600 hover:scale-110 transition-all duration-300 shadow-md z-10"
          data-modal="${encodeURIComponent(JSON.stringify(s))}"
          aria-label="Ver detalhes">
          <i class="fas fa-expand text-xs"></i>
        </button>
        
        <!-- Tema badge -->
        ${e.theme?`
          <span class="inline-block p-2 m-4 bg-emerald-100 text-emerald-700 rounded-2xl text-[10px] font-semibold uppercase mb-1.5">
            ${r.escapeHtml(e.theme)}
          </span>
        `:""}
        
        <!-- Título -->
        <h3 class="font-serif font-bold text-base sm:text-lg text-stone-900 mb-1 leading-tight line-clamp-1 pr-6">
          ${r.escapeHtml(e.title)}
        </h3>
        
        <!-- Mensagem/Descrição -->
        <p class="text-xs text-stone-500 line-clamp-2 mb-2">
          ${r.escapeHtml(e.message||"")}
        </p>
        
        <!-- Versículo (se existir) -->
        ${e.verseText?`
          <p class="text-[10px] text-emerald-600 italic line-clamp-1 mb-2">
            "${r.escapeHtml(e.verseText.substring(0,60))}${e.verseText.length>60?"...":""}"
          </p>
        `:""}
        
        <!-- Footer com like e compartilhar -->
        <div class="flex items-center justify-between mt-1">
          <button class="like-btn flex items-center gap-1 text-[10px] text-stone-400 hover:text-red-500 transition-colors duration-200" data-id="${e.id}">
            <i class="far fa-heart text-[2xl]"></i>
            <span class="like-count">0</span>
          </button>
          
          <div class="flex items-center gap-1.5">
            <button class="share-btn share-whatsapp w-12 h-12 rounded-lg flex items-center justify-center text-white bg-[#25D366] hover:scale-110 transition-all"
              onclick="Utils.shareWhatsApp('${e.title.replace(/'/g,"\\'")}', '${(e.theme||"").replace(/'/g,"\\'")}', '${(e.message||"").replace(/'/g,"\\'")}')">
              <i class="fab fa-whatsapp text-[22px]"></i>
            </button>
            <button class="share-btn share-instagram w-12 h-12 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:scale-110 transition-all"
              onclick="Utils.shareInstagram('${e.title.replace(/'/g,"\\'")}', '${(e.theme||"").replace(/'/g,"\\'")}', '${(e.message||"").replace(/'/g,"\\'")}')">
              <i class="fab fa-instagram text-[22px]"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  `}function y(e,t){const s=b[t]||t+1,o=e.image||"https://images.unsplash.com/photo-1515169078309-8d9509396999?w=400&h=400&fit=crop",a={title:`Estação ${s}: ${e.title}`,theme:e.theme||"",verse:e.verse||"",verseText:e.verseText||"",reflection:e.reflection||"",description:e.description||"",activities:e.activities||[],suggestions:e.suggestions||[],image:o};return JSON.stringify(a).replace(/'/g,"&#39;"),`
    <article class="estacao-card group bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer" data-estacao="${e.week||t+1}" data-id="${e.id}">
      <div class="relative p-4">
        <!-- Botão expand -->
        <button class="expand-btn absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-stone-400 hover:text-red-500 transition-all z-10"
          data-modal="${encodeURIComponent(JSON.stringify(a))}">
          <i class="fas fa-expand text-xs"></i>
        </button>
        
        <div class="flex items-start gap-3">
          <div class="relative flex-shrink-0">
            <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow">
              <img src="${o}" alt="${r.escapeHtml(e.title)}" class="w-full h-full object-cover">
            </div>
            <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">${s}</div>
            <div class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full hidden items-center justify-center text-white text-[10px] font-bold estacao-check">✓</div>
          </div>
          
          <div class="flex-1">
            <h3 class="font-semibold text-stone-900 text-base">${r.escapeHtml(e.title)}</h3>
            <p class="text-xs text-red-500 font-medium mt-0.5">${r.escapeHtml(e.theme||"")}</p>
            <p class="text-xs text-stone-500 mt-1 line-clamp-2">${r.escapeHtml(e.message||"")}</p>
            ${e.verseText?`<p class="text-xs text-stone-400 italic mt-1">"${r.escapeHtml(e.verseText.substring(0,60))}..."</p>`:""}
          </div>
        </div>
        
        <div class="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
          <button class="like-btn flex items-center gap-1 text-xs text-stone-400 hover:text-red-500 transition" data-id="${e.id}">
            <i class="far fa-heart"></i>
            <span class="like-count">0</span>
          </button>
          <div class="estacao-activity text-xs text-stone-400">
            <i class="fas fa-hands-praying"></i> ${e.activities&&e.activities[0]?e.activities[0].substring(0,40):"Rezar e meditar"}
          </div>
        </div>
      </div>
    </article>
  `}function $(e){const t=e.image||"https://images.unsplash.com/photo-1532330383983-5c5213b97d36?w=400&h=400&fit=crop",o={"Quinta-feira Santa":"fa-bread-slice","Sexta-feira Santa":"fa-cross","Sábado Santo":"fa-moon"}[e.title]||"fa-church",n={"Quinta-feira Santa":"from-amber-600 to-orange-600","Sexta-feira Santa":"from-red-700 to-red-800","Sábado Santo":"from-indigo-600 to-purple-700"}[e.title]||"from-purple-600 to-indigo-700",i={title:e.title,theme:e.theme||"",verse:e.verse||"",verseText:e.verseText||"",reflection:e.reflection||"",description:e.description||"",activities:e.activities||[],suggestions:e.suggestions||[],image:t};return JSON.stringify(i).replace(/'/g,"&#39;"),`
    <div class="triduo-card group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 transition-all duration-500 hover:transform hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl cursor-pointer" data-id="${e.id}">
      <!-- Gradiente de fundo animado -->
      <div class="absolute inset-0 bg-gradient-to-br ${n} opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
      
      <!-- Botão expand -->
      <button class="expand-btn absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 z-10" 
        data-modal="${encodeURIComponent(JSON.stringify(i))}""
        aria-label="Ver detalhes">
        <i class="fas fa-expand text-sm"></i>
      </button>
      
      <div class="p-6 text-center relative z-10">
        <!-- Ícone animado -->
        <div class="triduo-icon-wrapper w-20 h-20 mx-auto mb-5 bg-gradient-to-br ${n} rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
          <i class="fas ${o} text-3xl text-white"></i>
        </div>
        
        <!-- Título -->
        <h3 class="font-serif font-bold text-2xl text-white mb-3 group-hover:text-amber-300 transition-colors duration-300">${r.escapeHtml(e.title)}</h3>
        
        <!-- Eventos/Tags -->
        <div class="flex flex-wrap justify-center gap-2 mb-4">
          ${e.events?e.events.map(l=>`
            <span class="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 backdrop-blur-sm">
              <i class="fas ${l.icon} mr-1"></i> ${l.name}
            </span>
          `).join(""):`
            <span class="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 backdrop-blur-sm">
              <i class="fas fa-church mr-1"></i> Celebração Especial
            </span>
          `}
        </div>
        
        <!-- Mensagem -->
        <p class="text-white/90 text-sm mb-4 line-clamp-2">${r.escapeHtml(e.message||"")}</p>
        
        <!-- Versículo -->
        ${e.verseText?`
          <blockquote class="text-white/60 text-xs italic border-l-2 border-amber-400/50 pl-3 text-left">
            <i class="fas fa-book-open mr-1 text-amber-400/70"></i>
            "${r.escapeHtml(e.verseText.substring(0,80))}${e.verseText.length>80?"...":""}"
          </blockquote>
        `:""}
      </div>
    </div>
  `}function S(e){const t=e.image||"https://images.pexels.com/photos/1040626/pexels-photo-1040626.jpeg?w=80&h=80&fit=crop",s=e.week?`${e.week}ª semana`:"Tempo Pascal",o={title:e.title,theme:e.theme||"",verse:e.verse||"",verseText:e.verseText||"",reflection:e.reflection||"",description:e.description||"",activities:e.activities||[],suggestions:e.suggestions||[],image:t};return JSON.stringify(o).replace(/'/g,"&#39;"),`
    <article class="pascoa-card group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer flex" data-id="${e.id}" data-period="${e.period}">
      <!-- Foto lateral pequena -->
      <div class="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden bg-amber-100">
        <img src="${t}" alt="${r.escapeHtml(e.title)}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">
      </div>
      
      <!-- Conteúdo -->
      <div class="flex-1 p-2.5 sm:p-3 relative">
        <!-- Botão expand -->
        <button class="expand-btn absolute top-1.5 right-1.5 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center text-stone-400 hover:text-amber-600 hover:scale-110 transition-all duration-200 shadow-sm" 
          data-modal="${encodeURIComponent(JSON.stringify(o))}">
          <i class="fas fa-expand text-[8px]"></i>
        </button>
        
        <!-- Badge da semana -->
        <div class="inline-block px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-semibold uppercase mb-1">
          ${s}
        </div>
        
        <!-- Título -->
        <h3 class="font-serif font-bold text-xs sm:text-sm text-stone-900 mb-0.5 leading-tight line-clamp-1 pr-4">
          ${r.escapeHtml(e.title)}
        </h3>
        
        <!-- Tema pequeno -->
        ${e.theme?`
          <p class="text-[9px] text-amber-600 font-medium mb-0.5 line-clamp-1">
            ${r.escapeHtml(e.theme)}
          </p>
        `:""}
        
        <!-- Mensagem -->
        <p class="text-[10px] text-stone-500 line-clamp-1 mb-1">
          ${r.escapeHtml(e.message||"").substring(0,50)}
        </p>
        
        <!-- Footer com like e compartilhar -->
        <div class="flex items-center justify-between mt-1">
          <button class="like-btn flex items-center gap-1 text-[10px] text-stone-400 hover:text-red-500 transition-colors duration-200" data-id="${e.id}">
            <i class="far fa-heart text-[2xl]"></i>
            <span class="like-count">0</span>
          </button>
          
          <div class="flex items-center gap-1.5">
            <button class="share-btn share-whatsapp w-12 h-12 rounded-lg flex items-center justify-center text-white bg-[#25D366] hover:scale-110 transition-all"
              onclick="Utils.shareWhatsApp('${e.title.replace(/'/g,"\\'")}', '${(e.theme||"").replace(/'/g,"\\'")}', '${(e.message||"").replace(/'/g,"\\'")}')">
              <i class="fab fa-whatsapp text-[22px]"></i>
            </button>
            <button class="share-btn share-instagram w-12 h-12 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:scale-110 transition-all"
              onclick="Utils.shareInstagram('${e.title.replace(/'/g,"\\'")}', '${(e.theme||"").replace(/'/g,"\\'")}', '${(e.message||"").replace(/'/g,"\\'")}')">
              <i class="fab fa-instagram text-[22px]"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  `}function L(e){const t=e.linkUrl||"#";return`
    <article class="dica-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div class="h-44 overflow-hidden">
        <img src="${e.image}" alt="${r.escapeHtml(e.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
      </div>
      <div class="p-5">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-9 h-9 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-xl">${e.icon}</span>
          <h3 class="font-semibold text-stone-900">${r.escapeHtml(e.title)}</h3>
        </div>
        <p class="text-stone-600 text-sm mb-4">${r.escapeHtml(e.description)}</p>
        <a href="${t}" rel="noopener noreferrer" class="text-emerald-600 font-medium text-sm hover:underline inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          ${e.linkText} <i class="fas fa-arrow-right text-xs"></i>
        </a>
      </div>
    </article>
  `}function k(){document.querySelectorAll("[data-target]").forEach(t=>{const s=parseInt(t.dataset.target,10);if(isNaN(s))return;const o=new IntersectionObserver(a=>{a.forEach(n=>{n.isIntersecting&&(r.animateNumber(t,0,s),o.unobserve(t))})},{threshold:.5});o.observe(t)})}function I(){["quaresmaGrid","semanaGrid","viaSacraGrid","triduoGrid","pascoaGrid","dicasGrid"].forEach(t=>{const s=document.getElementById(t);s&&!s.innerHTML.trim()&&(s.innerHTML=`
        <div class="col-span-full text-center py-12">
          <div class="text-6xl mb-4">⚠️</div>
          <h3 class="font-semibold text-stone-900 mb-2">Erro ao carregar conteúdo</h3>
          <p class="text-stone-500">Verifique se o arquivo <strong>public/data.json</strong> existe</p>
          <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">Tentar novamente</button>
        </div>
      `)})}async function T(){try{console.log("📡 Carregando dados de:",m.dataUrl);const e=await fetch(m.dataUrl);if(!e.ok)throw new Error(`HTTP ${e.status}`);const t=await e.json();console.log(`✅ Carregados ${t.length} cards do JSON`);const s={quaresma:[],semana:[],"via-sacra":[],triduo:[],pascoa:[],dicas:[]};t.forEach(c=>{s[c.period]&&s[c.period].push(c)});const o=document.getElementById("quaresmaGrid");o&&s.quaresma.length&&(o.innerHTML=s.quaresma.map(v).join(""));const a=document.getElementById("semanaGrid");a&&s.semana.length&&(a.innerHTML=s.semana.map(w).join(""));const n=document.getElementById("viaSacraGrid");if(n&&s["via-sacra"].length){const c=[...s["via-sacra"]].sort((p,u)=>(p.week||0)-(u.week||0));n.innerHTML=c.map((p,u)=>y(p,u)).join("")}const i=document.getElementById("triduoGrid");i&&s.triduo.length&&(i.innerHTML=s.triduo.map($).join(""));const l=document.getElementById("pascoaGrid");l&&s.pascoa.length&&(l.innerHTML=s.pascoa.map(S).join(""));const d=document.getElementById("dicasGrid");d&&s.dicas.length&&(d.innerHTML=s.dicas.map(L).join("")),document.querySelectorAll(".expand-btn").forEach(c=>{c.addEventListener("click",p=>{p.stopPropagation();const u=JSON.parse(decodeURIComponent(c.dataset.modal));g.open(u)})}),f.init(),f.loadStates(),x.init(),k(),console.log("🎉 Cards renderizados com sucesso!")}catch(e){console.error("❌ Erro ao carregar dados:",e),I()}}function E(){const e=document.getElementById("navToggle"),t=document.getElementById("mobileMenu"),s=document.getElementById("menuOverlay"),o=document.getElementById("closeMenuBtn");if(!e||!t)return;const a=()=>{t.classList.remove("translate-x-full"),s.classList.remove("opacity-0","pointer-events-none"),document.body.classList.add("overflow-hidden")},n=()=>{t.classList.add("translate-x-full"),s.classList.add("opacity-0","pointer-events-none"),document.body.classList.remove("overflow-hidden")};e.addEventListener("click",()=>{!t.classList.contains("translate-x-full")?n():a()}),s.addEventListener("click",n),o.addEventListener("click",n),document.querySelectorAll(".menu-link").forEach(i=>{i.addEventListener("click",n)}),window.addEventListener("resize",()=>{window.innerWidth>=1024&&n()})}function C(){const e=document.querySelectorAll("section[id]");document.querySelectorAll(".nav-link"),document.querySelectorAll("#mobileMenu a").forEach(a=>{a.classList.contains("nav-link")||a.classList.add("nav-link")});const s=document.querySelectorAll(".nav-link");function o(){let a="";const n=window.scrollY+200;e.forEach(i=>{const l=i.offsetTop,d=l+i.offsetHeight;n>=l&&n<d&&(a=i.getAttribute("id"))}),!a&&window.scrollY<150&&(a="intro"),s.forEach(i=>{const l=i.getAttribute("href"),d=l?l.replace("#",""):"";i.classList.remove("bg-emerald-100","text-emerald-700","bg-emerald-50","bg-purple-100","text-purple-600","bg-purple-50","bg-red-100","text-red-600","bg-red-50","bg-indigo-100","text-indigo-600","bg-indigo-50","bg-amber-100","text-amber-600","bg-amber-50","bg-orange-100","text-orange-600","bg-orange-50","active"),i.style.backgroundColor="",i.style.color="",i.classList.contains("hover"),d===a&&(i.classList.add("active"),a==="intro"?(i.classList.add("bg-emerald-100","text-emerald-700"),i.style.backgroundColor="#d1fae5",i.style.color="#047857"):a==="quaresma"?(i.classList.add("bg-purple-100","text-purple-600"),i.style.backgroundColor="#f3e8ff",i.style.color="#9333ea"):a==="semana-santa"?(i.classList.add("bg-emerald-100","text-emerald-600"),i.style.backgroundColor="#d1fae5",i.style.color="#059669"):a==="via-sacra"?(i.classList.add("bg-red-100","text-red-600"),i.style.backgroundColor="#fee2e2",i.style.color="#dc2626"):a==="triduo"?(i.classList.add("bg-indigo-100","text-indigo-600"),i.style.backgroundColor="#e0e7ff",i.style.color="#4f46e5"):a==="pascoa"?(i.classList.add("bg-amber-100","text-amber-600"),i.style.backgroundColor="#fef3c7",i.style.color="#d97706"):a==="pentecostes"?(i.classList.add("bg-orange-100","text-orange-600"),i.style.backgroundColor="#ffedd5",i.style.color="#ea580c"):a==="dicas"&&(i.classList.add("bg-amber-100","text-amber-600"),i.style.backgroundColor="#fef3c7",i.style.color="#d97706"))})}window.addEventListener("scroll",o),window.addEventListener("resize",o),o()}function M(){const e=document.getElementById("backToTop");e&&(window.addEventListener("scroll",()=>{window.scrollY>500?e.classList.remove("opacity-0","invisible"):e.classList.add("opacity-0","invisible")}),e.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})}))}function H(){const e=new IntersectionObserver(t=>{t.forEach(s=>{s.isIntersecting&&(s.target.classList.add("visible"),e.unobserve(s.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});document.querySelectorAll(".card, .estacao-card, .semana-card, .dica-card, section").forEach(t=>{t.classList.add("scroll-reveal"),e.observe(t)})}function j(){const e=document.getElementById("currentYear");e&&(e.textContent=new Date().getFullYear())}function q(){const e=document.getElementById("installBtn");if(!e)return;const t=document.querySelector("footer");if(!t)return;let s=!1;function o(){const a=t.getBoundingClientRect(),n=window.innerHeight,i=a.top<=n+100;i&&!s?(e.classList.add("visible"),e.classList.remove("hidden-btn"),s=!0):!i&&s&&(e.classList.remove("visible"),e.classList.add("hidden-btn"),s=!1)}e.classList.add("hidden-btn"),e.classList.remove("visible"),window.addEventListener("scroll",o),window.addEventListener("resize",o),o()}function B(){document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",function(t){const s=this.getAttribute("href");if(s==="#")return;const o=document.querySelector(s);o&&(t.preventDefault(),o.scrollIntoView({behavior:"smooth",block:"start"}))})})}async function h(){console.log("🌿 Caminho da Fé - Iniciando..."),E(),C(),M(),H(),j(),q(),B(),g.init(),window.Utils=r,await T(),console.log("✨ Aplicação inicializada com sucesso!")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",h):h();
