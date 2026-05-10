import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = './public';
const BLOG_POSTS_DIR = './public/blog/posts';

const blogPath = path.join(PUBLIC_DIR, 'blog.json');

if (!fs.existsSync(blogPath)) {
  console.error('❌ blog.json não encontrado');
  process.exit(1);
}

const blogData = JSON.parse(fs.readFileSync(blogPath, 'utf-8'));

if (!fs.existsSync(BLOG_POSTS_DIR)) {
  fs.mkdirSync(BLOG_POSTS_DIR, { recursive: true });
}

function generatePostHTML(post) {

  const sectionsHTML = (post.blogContent?.sections || [])
    .map(section => {
      return `
      <section class="fade">
        <h2 class="text-xl font-semibold mb-3">
          ${section.title}
        </h2>
        <p class="text-stone-600 leading-relaxed">
          ${section.content}
        </p>
      </section>`;
    })
    .join('');

  const tipsHTML = post.blogContent?.tips?.length
    ? `
    <section class="fade glass p-6 rounded-xl">
      <h3 class="font-semibold mb-3 text-amber-600">
        ✨ Dicas
      </h3>
      <ul class="space-y-2 text-stone-600">
        ${post.blogContent.tips.map(t => `<li>• ${t}</li>`).join('')}
      </ul>
    </section>`
    : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${post.title}</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>

<style>
body {
  font-family: 'Inter', sans-serif;
  background: #fafaf9;
  color: #1c1917;
}

.fade {
  opacity: 0;
  transform: translateY(30px) scale(.98);
  transition: all .7s cubic-bezier(0.22,1,0.36,1);
}
.fade.show {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.glass {
  backdrop-filter: blur(8px);
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(0,0,0,0.06);
}

.hero-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.18), rgba(0,0,0,0.02));
}

html {
  scroll-behavior: smooth;
}

/* SCROLL INVISÍVEL (CHROME, EDGE, SAFARI) */
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

/* FIREFOX */
html {
  scrollbar-width: none;
}
</style>
</head>

<body>

<!-- BOTÃO VOLTAR -->
<button onclick="
if (history.length > 1) {
  history.back();
} else {
  location.href = '/caminho-da-quaresma/';
}
"
class="fixed top-4 left-4 z-50 glass text-sm px-4 py-2 rounded-full text-stone-600 hover:text-black shadow-sm hover:scale-105 transition">
← Voltar
</button>

<!-- IMAGEM LIMPA -->
<section class="w-full h-[40vh] md:h-[50vh] overflow-hidden">
  <img src="${post.image}" class="w-full h-full object-cover">
</section>

<!-- HEADER LIMPO (ESTILO APPLE) -->
<section class="max-w-3xl mx-auto px-6 py-10">

  <h1 class="text-3xl md:text-5xl font-bold text-stone-900 fade">
    ${post.title}
  </h1>

  <p class="text-stone-500 mt-4 text-lg fade">
    ${post.blogContent?.subtitle || post.description}
  </p>

</section>

<main class="max-w-3xl mx-auto px-6 py-12 space-y-10">

  <p class="text-lg text-stone-600 fade">
    ${post.description}
  </p>

  ${sectionsHTML}

  ${tipsHTML}

</main>

<footer class="text-center py-10 text-stone-400 text-sm">
  Caminho da Fé ✝️
</footer>

<script>
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('show');
  });
});

document.querySelectorAll('.fade').forEach(el => observer.observe(el));
</script>

</body>
</html>`;
}

// gerar arquivos
blogData.forEach(post => {
  const filePath = path.join(BLOG_POSTS_DIR, `${post.id}.html`);
  fs.writeFileSync(filePath, generatePostHTML(post));
});

console.log('✅ Páginas geradas corretamente!');