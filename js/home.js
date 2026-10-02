document.addEventListener("DOMContentLoaded", async () => {
  renderHeader("home");
  renderFooter();

  const [noticias, categorias] = await Promise.all([obtenerNoticias(), obtenerCategorias()]);
  const favoritos = obtenerFavoritos();

  // Chips de categoría (hero)
  const chipsWrap = document.getElementById("categoryChips");
  chipsWrap.innerHTML = categorias
    .map(
      (c) => `<a href="noticias.html?categoria=${encodeURIComponent(c.name)}" class="chip">${c.icon} ${c.name}</a>`
    )
    .join("");

  // Destacadas (primeras 3)
  const destacadas = noticias.slice(0, 3);
  document.getElementById("destacadasGrid").innerHTML = destacadas
    .map((n) => tarjetaNoticiaHTML(n, categorias, favoritos.has(n.id)))
    .join("");

  // Más noticias (resto)
  const resto = noticias.slice(3);
  document.getElementById("masNoticiasGrid").innerHTML = resto
    .map((n) => tarjetaNoticiaHTML(n, categorias, favoritos.has(n.id)))
    .join("");

  // Showcase por categoría con conteo real
  const showcase = document.getElementById("showcaseGrid");
  showcase.innerHTML = categorias
    .map((c) => {
      const count = noticias.filter((n) => n.category === c.name).length;
      return `
        <a href="noticias.html?categoria=${encodeURIComponent(c.name)}" class="showcase-card" style="border-color:${c.color}30;background:${c.color}08;">
          <div class="icon">${c.icon}</div>
          <h3 style="color:${c.color}">${c.name}</h3>
          <p>${count} artículo${count !== 1 ? "s" : ""}</p>
        </a>`;
    })
    .join("");

  // Buscador del hero -> lleva a noticias.html con el término
  document.getElementById("heroSearchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("heroSearchInput").value.trim();
    window.location.href = "noticias.html" + (q ? `?buscar=${encodeURIComponent(q)}` : "");
  });
});
