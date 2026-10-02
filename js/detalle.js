document.addEventListener("DOMContentLoaded", async () => {
  renderHeader("news-list");
  renderFooter();

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));

  const [noticias, categorias] = await Promise.all([obtenerNoticias(), obtenerCategorias()]);
  const noticia = noticias.find((n) => n.id === id);
  const contenedor = document.getElementById("detalleContenedor");

  if (!noticia) {
    contenedor.innerHTML = `
      <div class="empty-state">
        <div class="emoji">📰</div>
        <h3>Noticia no encontrada</h3>
        <a class="btn-primary" href="noticias.html">Volver a noticias</a>
      </div>`;
    return;
  }

  document.title = `${noticia.title} — TecnoNews`;

  const color = colorCategoria(categorias, noticia.category);
  const favoritos = obtenerFavoritos();
  const esFav = favoritos.has(noticia.id);

  const parrafos = noticia.content
    .split("\n\n")
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");

  const highlightsHtml = noticia.highlights
    ? `
    <div class="highlights-box" style="background:${color}08;border-left-color:${color};color:${color}">
      <h3 style="color:#334155">⭐ Lo más destacado:</h3>
      <ul>
        ${noticia.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}
      </ul>
    </div>`
    : "";

  const relacionadas = noticias
    .filter((n) => n.id !== noticia.id && n.category === noticia.category)
    .slice(0, 3);

  const relacionadasHtml = relacionadas.length
    ? `
    <div class="related-card">
      <h3>Más en ${noticia.category}</h3>
      ${relacionadas
        .map(
          (r) => `
        <a class="related-item" href="detalle.html?id=${r.id}">
          <img src="${r.image}" alt="${escapeHtml(r.title)}">
          <div>
            <p class="title">${escapeHtml(r.title)}</p>
            <p class="date">${r.date}</p>
          </div>
        </a>`
        )
        .join("")}
    </div>`
    : "";

  contenedor.innerHTML = `
    <a href="noticias.html" class="back-link">← Volver a noticias</a>
    <div class="detail-layout">
      <article class="detail-article">
        <div class="detail-hero">
          <img src="${noticia.image}" alt="${escapeHtml(noticia.title)}">
        </div>
        <div class="detail-meta">
          <span class="cat-badge" style="background:${color}18;color:${color}">${noticia.category}</span>
          <span class="meta-item">📅 ${noticia.date}</span>
          <span class="meta-item">👤 Por ${escapeHtml(noticia.author)}</span>
          <span class="meta-item">⏱ ${noticia.readTime}</span>
        </div>
        <h1>${escapeHtml(noticia.title)}</h1>
        <div class="content">${parrafos}</div>
        ${highlightsHtml}
        <div class="share-row">
          <span class="label">Compartir:</span>
          <span class="share-btn" style="border-color:#25d36640;color:#25d366">💬 WhatsApp</span>
          <span class="share-btn" style="border-color:#1da1f240;color:#1da1f2">𝕏 Twitter</span>
          <span class="share-btn" style="border-color:#1877f240;color:#1877f2">f Facebook</span>
          <span class="share-btn" style="border-color:#0a66c240;color:#0a66c2">in LinkedIn</span>
        </div>
      </article>

      <aside class="detail-sidebar">
        <button class="fav-toggle-btn ${esFav ? "active" : ""}" id="favToggleBtn">
          ${esFav ? "♥ En favoritos" : "♡ Agregar a favoritos"}
        </button>
        <a class="contact-cta-btn" href="contacto.html">✉ Contactar</a>
        ${relacionadasHtml}
        <div class="author-card">
          <h3>Autor</h3>
          <div class="author-row">
            <div class="author-avatar" style="background:${color}">${noticia.author.charAt(0)}</div>
            <div>
              <p class="name">${escapeHtml(noticia.author)}</p>
              <p class="role">Redactor(a) TecnoNews</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  `;

  // Botón grande de favoritos del sidebar (manejo propio, independiente
  // de la delegación global de los corazones pequeños en las tarjetas).
  document.getElementById("favToggleBtn").addEventListener("click", () => {
    const favs = alternarFavorito(noticia.id);
    const nuevoFav = favs.has(noticia.id);
    const btn = document.getElementById("favToggleBtn");
    btn.classList.toggle("active", nuevoFav);
    btn.textContent = nuevoFav ? "♥ En favoritos" : "♡ Agregar a favoritos";
  });
});
