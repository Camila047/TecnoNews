document.addEventListener("DOMContentLoaded", async () => {
  renderHeader("favorites");
  renderFooter();

  const [noticias, categorias] = await Promise.all([obtenerNoticias(), obtenerCategorias()]);
  const contenedor = document.getElementById("favoritosContenedor");
  const subtitulo = document.getElementById("favSubtitulo");

  function render() {
    const favs = obtenerFavoritos();
    const favNews = noticias.filter((n) => favs.has(n.id));

    subtitulo.textContent =
      favNews.length > 0
        ? `Aquí puedes ver las noticias que has guardado. ${favNews.length} artículo${favNews.length !== 1 ? "s" : ""}.`
        : "Aquí puedes ver las noticias que has guardado.";

    if (favNews.length === 0) {
      contenedor.innerHTML = `
        <div class="empty-state">
          <div class="emoji">🤍</div>
          <h3>No tienes favoritos aún</h3>
          <p>Explora las noticias y guarda las que más te interesen haciendo clic en el corazón.</p>
          <a class="btn-primary" href="noticias.html">Explorar noticias</a>
        </div>`;
      return;
    }

    contenedor.innerHTML =
      favNews
        .map((n) => {
          const color = colorCategoria(categorias, n.category);
          return `
        <div class="fav-item">
          <img src="${n.image}" alt="${escapeHtml(n.title)}">
          <div class="fav-body">
            <div class="top-row">
              <div>
                <span class="cat-tag" style="position:static;display:inline-block;margin-bottom:6px;background:${color}18;color:${color}">${n.category}</span>
                <h3><a href="detalle.html?id=${n.id}">${escapeHtml(n.title)}</a></h3>
                <p style="font-size:0.78rem;color:var(--texto-claro);margin:6px 0 0;">📅 ${n.date}</p>
              </div>
              <button class="remove-fav-btn" data-fav-toggle="${n.id}" title="Quitar de favoritos">🗑</button>
            </div>
            <a href="detalle.html?id=${n.id}" class="link-teal" style="display:inline-block;margin-top:8px;font-size:0.82rem;">Leer artículo →</a>
          </div>
        </div>`;
        })
        .join("") +
      `<div style="text-align:center;padding-top:16px;"><a href="noticias.html" class="btn-outline">Explorar más noticias</a></div>`;
  }

  // Cuando se quita un favorito desde esta página, hay que re-renderizar
  // toda la lista (el manejador global solo cambia el ícono).
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-fav-toggle]")) {
      setTimeout(render, 0);
    }
  });

  render();
});
