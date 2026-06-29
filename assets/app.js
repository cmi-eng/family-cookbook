/* The Family Cookbook — zero-dependency static app.
   Reads recipes/index.json for the catalog and recipes/<slug>.json for each recipe.
   Hash routing (#/ and #/recipe/<slug>) keeps it working on GitHub Pages with no server.
   Bilingual: English + Boso Suroboyoan (Surabaya Javanese), toggled in the header.
   Editorial look inspired by America's Test Kitchen. */

const app = document.getElementById('app');
const searchEl = document.getElementById('search');
const langSwitch = document.getElementById('lang-switch');

// Fixed category order + emoji + Suroboyoan label. Keep in sync with the add-recipe skill's taxonomy.
const CATEGORIES = [
  ['Breakfast',            '🍳', 'Sarapan'],
  ['Mains',                '🍛', 'Masakan Utomo'],
  ['Soups',                '🍲', 'Sop & Kuah'],
  ['Noodles & Rice',       '🍜', 'Mie & Sego'],
  ['Vegetables & Sides',   '🥬', 'Sayur & Lawuh'],
  ['Dim Sum & Snacks',     '🥟', 'Dim Sum & Jajan'],
  ['Desserts & Sweets',    '🍰', 'Panganan Manis'],
  ['Baking',               '🥐', 'Roti & Kue'],
  ['Drinks',               '🧋', 'Omben-omben'],
  ['Sauces & Basics',      '🥄', 'Saus & Dhasar'],
];
const EMOJI  = Object.fromEntries(CATEGORIES.map(([n, e]) => [n, e]));
const CAT_SU = Object.fromEntries(CATEGORIES.map(([n, , s]) => [n, s]));

// UI strings
const STR = {
  en: {
    tagline: 'Home Cooking',
    searchPlaceholder: 'Search recipes, ingredients…',
    heroEyebrow: 'Recipes', heroTitle: 'The Cookbook',
    heroSub: 'Everything worth cooking, in one place.',
    browseEyebrow: 'Browse', browseTitle: 'Categories',
    ingredients: 'Ingredients', method: 'Method', notes: 'Notes',
    servings: 'servings', prep: 'Prep', cook: 'Cook', total: 'Total',
    back: '← All recipes', print: '🖨 Print', source: 'Source', added: 'Added',
    recipe: 'recipe', recipes: 'recipes', all: 'All', noSteps: 'No steps recorded.',
    savedBadge: 'Saved link', savedTitle: 'Saved for reference', savedHint: 'Saved as a link to revisit — open the original for the full recipe or video.', openOriginal: 'Open original', watch: 'Watch / open',
    searchEmpty: 'No recipes match your search.',
    noRecipes: 'No recipes yet.', noRecipesSub: 'Paste a recipe link to Claude to add your first one.',
    notFound: 'Recipe not found.', loading: 'Loading the cookbook…', loadingRecipe: 'Loading recipe…',
    min: 'min', hr: 'hr',
  },
  su: {
    tagline: 'Masakan Omah',
    searchPlaceholder: 'Goleki resep, bahan…',
    heroEyebrow: 'Resep', heroTitle: 'Buku Resep',
    heroSub: 'Kabeh sing pantes dimasak, ngumpul nang siji panggonan.',
    browseEyebrow: 'Pilih', browseTitle: 'Kategori',
    ingredients: 'Bahan-bahan', method: 'Carane Masak', notes: 'Cathetan',
    servings: 'porsi', prep: 'Nyiapno', cook: 'Masak', total: 'Total',
    back: '← Kabeh resep', print: '🖨 Cetak', source: 'Sumber', added: 'Ditambahno',
    recipe: 'resep', recipes: 'resep', all: 'Kabeh', noSteps: 'Durung ono langkah sing dicathet.',
    savedBadge: 'Disimpen', savedTitle: 'Disimpen kanggo cathetan', savedHint: 'Disimpen dadi link kanggo dibukak maneh — bukak asline kanggo resep utowo video lengkape.', openOriginal: 'Bukak asline', watch: 'Tonton / bukak',
    searchEmpty: 'Gak ono resep sing cocok.',
    noRecipes: 'Durung ono resep.', noRecipesSub: 'Tempelno link resep nang Claude kanggo nambah sing pertama.',
    notFound: 'Resepe gak ketemu.', loading: 'Lagi mbukak buku resep…', loadingRecipe: 'Lagi mbukak resep…',
    min: 'menit', hr: 'jam',
  },
};

let lang = localStorage.getItem('cb_lang') === 'su' ? 'su' : 'en';
const t = k => (STR[lang] && STR[lang][k]) || STR.en[k] || k;
const L = (en, su) => (lang === 'su' && su) ? su : en;
const catLabel = n => (lang === 'su' ? (CAT_SU[n] || n) : n);
const slugify = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const countLabel = n => `${n} ${n === 1 ? t('recipe') : t('recipes')}`;

let INDEX = [];
let activeCategory = '';
let query = '';

async function loadIndex() {
  try {
    const res = await fetch('recipes/index.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    INDEX = Array.isArray(data) ? data : (data.recipes || []);
  } catch (e) { INDEX = []; }
  const countEl = document.getElementById('recipe-count');
  if (countEl) countEl.textContent = INDEX.length;
}

/* ---------- helpers ---------- */
function fmtTime(min) {
  if (!min && min !== 0) return '';
  if (min < 60) return min + ' ' + t('min');
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} ${t('hr')} ${m} ${t('min')}` : `${h} ${t('hr')}`;
}
function thumb(r) {
  if (r.hero_image) return `<img src="${r.hero_image}" alt="" loading="lazy" onerror="this.parentNode.innerHTML='<span class=&quot;placeholder&quot;>${EMOJI[r.type] || '🍽️'}</span>'">`;
  return `<span class="placeholder">${EMOJI[r.type] || '🍽️'}</span>`;
}
function matches(r) {
  if (activeCategory && r.type !== activeCategory) return false;
  if (!query) return true;
  const hay = [r.title, r.title_zh, r.title_su, r.type, r.cuisine, (r.tags || []).join(' ')].join(' ').toLowerCase();
  return hay.includes(query);
}

/* ---------- catalog view ---------- */
function renderCatalog() {
  const visible = INDEX.filter(matches);
  const byCat = {};
  visible.forEach(r => { (byCat[r.type] = byCat[r.type] || []).push(r); });
  const orderedCats = CATEGORIES.map(([n]) => n).filter(n => byCat[n]);
  Object.keys(byCat).filter(n => !EMOJI[n]).sort().forEach(n => orderedCats.push(n));

  // category tiles are built from ALL recipes so the browse bar stays stable while filtering
  const allByCat = {};
  INDEX.forEach(r => { (allByCat[r.type] = allByCat[r.type] || []).push(r); });
  const tileCats = CATEGORIES.map(([n]) => n).filter(n => allByCat[n]);
  Object.keys(allByCat).filter(n => !EMOJI[n]).sort().forEach(n => tileCats.push(n));

  const browse = INDEX.length ? `
    <section class="browse">
      <div class="section-head">
        <span class="eyebrow">${t('browseEyebrow')}</span>
        <h2>${t('browseTitle')}</h2>
      </div>
      <div class="cat-grid">
        <a class="cat-tile ${activeCategory === '' ? 'is-active' : ''}" href="#/" data-cat="">
          <span class="cat-emoji">🍽️</span><span class="cat-name">${t('all')}</span><span class="cat-count">${countLabel(INDEX.length)}</span>
        </a>
        ${tileCats.map(n => `
        <a class="cat-tile ${activeCategory === n ? 'is-active' : ''}" href="#/" data-cat="${n}">
          <span class="cat-emoji">${EMOJI[n] || '🍽️'}</span><span class="cat-name">${catLabel(n)}</span><span class="cat-count">${allByCat[n].length}</span>
        </a>`).join('')}
      </div>
    </section>` : '';

  const sections = orderedCats.map(n => `
    <section class="category" id="cat-${slugify(n)}">
      <div class="section-head">
        <h2>${catLabel(n)}</h2>
        <span class="section-count">${countLabel(byCat[n].length)}</span>
      </div>
      <div class="grid">${byCat[n].map(card).join('')}</div>
    </section>`).join('');

  const body = visible.length ? browse + sections : browse + emptyState();

  app.innerHTML = `
    <section class="hero">
      <span class="eyebrow">${t('heroEyebrow')}</span>
      <h1>${t('heroTitle')}</h1>
      <p>${t('heroSub')}</p>
    </section>
    ${body}`;

  app.querySelectorAll('.cat-tile').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    activeCategory = el.dataset.cat;
    renderCatalog();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }));
}

function card(r) {
  const sub = L(r.title_zh, r.title_su) || r.title_zh;
  const eyebrow = r.cuisine || catLabel(r.type);
  const showPlatform = r.source && r.source.platform && r.source.platform !== 'sample';
  return `
    <a class="card" href="#/recipe/${r.slug}">
      <div class="card-media">${thumb(r)}</div>
      <div class="card-text">
        <span class="eyebrow">${eyebrow}</span>
        <h3 class="card-title">${L(r.title, r.title_su) || r.title}</h3>
        ${sub ? `<span class="card-sub">${sub}</span>` : ''}
        <div class="card-meta">
          ${r.link_only ? `<span class="badge-saved">🔖 ${t('savedBadge')}</span>` : (r.time && r.time.total_min ? `<span>⏱ ${fmtTime(r.time.total_min)}</span>` : '')}
          ${(r.link_only || (r.time && r.time.total_min)) && showPlatform ? `<span class="dot">·</span>` : ''}
          ${showPlatform ? `<span class="platform">${r.source.platform}</span>` : ''}
        </div>
      </div>
    </a>`;
}

function emptyState() {
  if (INDEX.length === 0) return `<div class="empty"><p>${t('noRecipes')}</p><p class="muted">${t('noRecipesSub')}</p></div>`;
  return `<div class="empty"><p>${t('searchEmpty')}</p></div>`;
}

/* ---------- recipe detail view ---------- */
async function renderRecipe(slug) {
  app.innerHTML = `<div class="loading">${t('loadingRecipe')}</div>`;
  let r;
  try {
    const res = await fetch(`recipes/${slug}.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.status);
    r = await res.json();
  } catch (e) {
    app.innerHTML = `<div class="empty"><p>${t('notFound')}</p><a class="back" href="#/">${t('back')}</a></div>`;
    return;
  }

  const media = r.video_embed
    ? `<div class="hero-media"><div class="embed"><iframe src="${r.video_embed}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div></div>`
    : (r.hero_image
        ? `<div class="hero-media"><img src="${r.hero_image}" alt="${r.title}" onerror="this.parentNode.innerHTML='<div class=&quot;placeholder&quot;>${EMOJI[r.type] || '🍽️'}</div>'"></div>`
        : `<div class="hero-media"><div class="placeholder">${EMOJI[r.type] || '🍽️'}</div></div>`);

  const ingredients = (r.ingredients || []).map(i => {
    const qty = [i.qty, i.unit].filter(v => v !== undefined && v !== null && v !== '').join(' ');
    const item = L(i.item, i.item_su) || i.item;
    const note = L(i.note, i.note_su) || i.note;
    return `<li>
      <span>${item}${note ? ` <span class="ing-orig">(${note})</span>` : ''}</span>
      <span class="ing-qty">${qty || ''}${i.original ? `<br><span class="ing-orig">${i.original}</span>` : ''}</span>
    </li>`;
  }).join('');

  const steps = (r.steps || []).map(s => `
    <li class="step"><div class="step-body">
      <p>${L(s.text, s.text_su) || s.text}</p>
      ${s.image ? `<img src="${s.image}" alt="" loading="lazy" onerror="this.style.display='none'">` : ''}
    </div></li>`).join('');

  const notes = L(r.notes, r.notes_su) || r.notes;
  const eyebrow = r.cuisine || catLabel(r.type);

  const metaBits = [];
  if (r.servings) metaBits.push(`<span>🍽 <strong>${r.servings}</strong> ${t('servings')}</span>`);
  if (r.time && r.time.prep_min) metaBits.push(`<span>${t('prep')} <strong>${fmtTime(r.time.prep_min)}</strong></span>`);
  if (r.time && r.time.cook_min) metaBits.push(`<span>${t('cook')} <strong>${fmtTime(r.time.cook_min)}</strong></span>`);
  if (r.time && r.time.total_min) metaBits.push(`<span>${t('total')} <strong>${fmtTime(r.time.total_min)}</strong></span>`);

  const sub = L(r.title_zh, r.title_su) || r.title_zh;
  const isLink = r.link_only === true;

  const recipeBody = `
      <div class="detail-cols">
        <aside class="ingredients">
          <h2>${t('ingredients')}</h2>
          <ul>${ingredients || '<li>—</li>'}</ul>
        </aside>
        <div class="steps">
          <h2>${t('method')}</h2>
          <ol>${steps || `<li class="step"><div class="step-body"><p>${t('noSteps')}</p></div></li>`}</ol>
          ${notes ? `<div class="notes"><h2>${t('notes')}</h2><p>${notes}</p></div>` : ''}
          <div class="source-row">
            ${r.source && r.source.url ? `<span>${t('source')}: <a href="${r.source.url}" target="_blank" rel="noopener">${r.source.author || r.source.platform || 'original'} ↗</a></span>` : ''}
            ${r.added ? `<span>${t('added')} ${r.added}${r.added_by ? ` · ${r.added_by}` : ''}</span>` : ''}
            <button class="btn" onclick="window.print()">${t('print')}</button>
          </div>
        </div>
      </div>`;

  const linkBody = `
      <div class="saved-panel">
        <h2>🔖 ${t('savedTitle')}</h2>
        <p>${notes || t('savedHint')}</p>
        <div class="saved-actions">
          ${r.source && r.source.url ? `<a class="btn btn-primary" href="${r.source.url}" target="_blank" rel="noopener">${t('openOriginal')} ↗</a>` : ''}
        </div>
        ${(r.source && (r.source.author || r.source.platform)) || r.added ? `<p class="saved-source muted">${r.source && r.source.author ? r.source.author : (r.source ? r.source.platform : '')}${r.added ? ` · ${t('added')} ${r.added}` : ''}</p>` : ''}
      </div>`;

  app.innerHTML = `
    <article class="detail${isLink ? ' detail--link' : ''}">
      <a class="back" href="#/">${t('back')}</a>
      <span class="eyebrow">${eyebrow}</span>
      <h1>${L(r.title, r.title_su) || r.title}</h1>
      ${sub ? `<p class="zh">${sub}</p>` : ''}
      ${metaBits.length ? `<div class="detail-meta">${metaBits.join('')}</div>` : ''}
      ${media}
      ${isLink ? linkBody : recipeBody}
    </article>`;
  window.scrollTo(0, 0);
}

/* ---------- router ---------- */
function router() {
  const hash = location.hash || '#/';
  const m = hash.match(/^#\/recipe\/(.+)$/);
  if (m) renderRecipe(decodeURIComponent(m[1]));
  else renderCatalog();
}

/* ---------- language ---------- */
function applyLangChrome() {
  document.documentElement.lang = lang === 'su' ? 'jv' : 'en';
  const sub = document.querySelector('.brand-sub'); if (sub) sub.textContent = t('tagline');
  if (searchEl) searchEl.placeholder = t('searchPlaceholder');
  langSwitch.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
}
function setLang(next) {
  if (next === lang) return;
  lang = next;
  localStorage.setItem('cb_lang', lang);
  applyLangChrome();
  router();
}
langSwitch.querySelectorAll('button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

searchEl.addEventListener('input', () => {
  query = searchEl.value.trim().toLowerCase();
  if (!location.hash.startsWith('#/recipe/')) renderCatalog();
});
window.addEventListener('hashchange', router);

(async function init() {
  applyLangChrome();
  await loadIndex();
  router();
})();
