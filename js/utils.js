/* =========================================
   TecnoNews — Utilidades compartidas
   Carga de datos (JSON), favoritos (localStorage)
   y renderizado de header / footer en cada página.
   ========================================= */

const DATA_URL = "data/news.json";
const FAV_KEY = "tecnonews_favoritos";
const ADMIN_KEY = "tecnonews_admin_noticias";

/* ---------- Carga de datos ---------- */

// Trae el JSON base (categorías + noticias originales)
async function cargarDatosBase() {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error("No se pudo cargar data/news.json");
  return res.json();
}

// Devuelve las noticias "vivas": si el admin ya guardó cambios en
// localStorage, se usan esas; si no, se usan las del JSON original.
async function obtenerNoticias() {
  const guardadas = localStorage.getItem(ADMIN_KEY);
  if (guardadas) {
    try {
      return JSON.parse(guardadas);
    } catch (e) {
      console.warn("No se pudo leer el admin local, se usa el JSON original.");
    }
  }
  const base = await cargarDatosBase();
  return base.news;
}

async function obtenerCategorias() {
  const base = await cargarDatosBase();
  return base.categories;
}

function guardarNoticias(noticias) {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(noticias));
}

/* ---------- Favoritos ---------- */

function obtenerFavoritos() {
  const raw = localStorage.getItem(FAV_KEY);
  return raw ? new Set(JSON.parse(raw)) : new Set();
}

function guardarFavoritos(set) {
  localStorage.setItem(FAV_KEY, JSON.stringify([...set]));
}

function alternarFavorito(id) {
  const favs = obtenerFavoritos();
  if (favs.has(id)) favs.delete(id);
  else favs.add(id);
  guardarFavoritos(favs);
  actualizarBadgeFavoritos();
  return favs;
}

function actualizarBadgeFavoritos() {
  const favs = obtenerFavoritos();
  document.querySelectorAll("[data-fav-badge]").forEach((el) => {
    if (favs.size > 0) {
      el.textContent = favs.size;
      el.style.display = "inline-flex";
    } else {
      el.style.display = "none";
    }
  });
}

/* ---------- Header / Footer ---------- */

const NAV_LINKS = [
  { label: "Inicio", href: "index.html", page: "home" },
  { label: "Noticias", href: "noticias.html", page: "news-list" },
  { label: "Favoritos", href: "favoritos.html", page: "favorites" },
  { label: "Contacto", href: "contacto.html", page: "contact" },
];

function renderHeader(paginaActual) {
  const favs = obtenerFavoritos();
  const header = document.createElement("header");
  header.className = "site-header";

  const navHtml = NAV_LINKS.map((l) => {
    const activo = l.page === paginaActual ? "active" : "";
    const badge =
      l.page === "favorites"
        ? `<span class="badge-count" data-fav-badge style="display:${favs.size > 0 ? "inline-flex" : "none"}">${favs.size}</span>`
        : "";
    return `<a href="${l.href}" class="${activo}">${l.label}${badge}</a>`;
  }).join("");

  const mobileNavHtml = NAV_LINKS.map((l) => {
    const activo = l.page === paginaActual ? "active" : "";
    return `<a href="${l.href}" class="${activo}">${l.label}</a>`;
  }).join("");

  header.innerHTML = `
    <div class="container header-inner">
      <a href="index.html" class="logo">
        <span class="logo-badge">TN</span>
        <span>Tecno<span class="accent">News</span></span>
      </a>
      <nav class="main-nav">
        ${navHtml}
      </nav>
      <div class="header-actions">
        <a href="admin.html" class="btn-admin">⚙ Admin</a>
        <div class="avatar">A</div>
        <button class="mobile-toggle" id="mobileToggle" aria-label="Abrir menú">☰</button>
      </div>
    </div>
    <div class="container">
      <div class="mobile-nav" id="mobileNav">
        ${mobileNavHtml}
        <a href="admin.html">Panel Admin</a>
      </div>
    </div>
  `;

  document.body.prepend(header);

  const toggle = header.querySelector("#mobileToggle");
  const mobileNav = header.querySelector("#mobileNav");
  toggle.addEventListener("click", () => mobileNav.classList.toggle("open"));
}

function renderFooter() {
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="footer-grid">
      <div>
        <a href="index.html" class="logo" style="margin-bottom:16px;">
          <span class="logo-badge">TN</span>
          <span>Tecno<span class="accent">News</span></span>
        </a>
        <p class="footer-desc">Tu portal de noticias y experiencias en tecnología, educación, turismo y mucho más.</p>
        <div class="social-row">
          <a href="#" title="Twitter">🐦</a>
          <a href="#" title="Facebook">📘</a>
          <a href="#" title="Instagram">📷</a>
          <a href="#" title="LinkedIn">💼</a>
        </div>
      </div>
      <div>
        <h4>Enlaces</h4>
        <ul>
          <li><a href="index.html">Inicio</a></li>
          <li><a href="noticias.html">Noticias</a></li>
          <li><a href="favoritos.html">Favoritos</a></li>
          <li><a href="contacto.html">Contacto</a></li>
        </ul>
      </div>
      <div>
        <h4>Categorías</h4>
        <ul>
          <li><a href="noticias.html">Tecnología</a></li>
          <li><a href="noticias.html">Educación</a></li>
          <li><a href="noticias.html">Turismo</a></li>
          <li><a href="noticias.html">Comercio</a></li>
        </ul>
      </div>
      <div>
        <h4>Contacto</h4>
        <div class="footer-contact-item">✉️ info@tecnonews.com</div>
        <div class="footer-contact-item">📞 +57 300 123 4567</div>
        <div class="footer-contact-item">📍 Bogotá, Colombia</div>
      </div>
    </div>
    <div class="footer-bottom">© 2026 TecnoNews. Todos los derechos reservados.</div>
  `;
  document.body.appendChild(footer);
}

/* ---------- Helpers de render de tarjetas ---------- */

function colorCategoria(categorias, nombre) {
  const c = categorias.find((c) => c.name === nombre);
  return c ? c.color : "#00b8a2";
}

function iconoCategoria(categorias, nombre) {
  const c = categorias.find((c) => c.name === nombre);
  return c ? c.icon : "📰";
}

function tarjetaNoticiaHTML(noticia, categorias, esFavorito) {
  const color = colorCategoria(categorias, noticia.category);
  return `
    <article class="news-card">
      <div class="news-card-img">
        <img src="${noticia.image}" alt="${escapeHtml(noticia.title)}">
        <span class="cat-tag" style="background:${color}">${noticia.category}</span>
        <button class="fav-btn ${esFavorito ? "active" : ""}" data-fav-toggle="${noticia.id}" title="Favorito">
          ${esFavorito ? "♥" : "♡"}
        </button>
      </div>
      <div class="news-card-body">
        <h3>${escapeHtml(noticia.title)}</h3>
        <p>${escapeHtml(noticia.excerpt)}</p>
        <div class="news-card-footer">
          <span class="date">${noticia.date}</span>
          <a class="btn-ver-mas" href="detalle.html?id=${noticia.id}">Ver más →</a>
        </div>
      </div>
    </article>
  `;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

/* Delegación global: clic en cualquier botón de favorito */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-fav-toggle]");
  if (!btn) return;
  e.preventDefault();
  const id = Number(btn.dataset.favToggle);
  const favs = alternarFavorito(id);
  const esFav = favs.has(id);
  btn.classList.toggle("active", esFav);
  btn.textContent = esFav ? "♥" : "♡";
});
