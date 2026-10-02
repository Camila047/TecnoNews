document.addEventListener("DOMContentLoaded", async () => {
  renderHeader("news-list");
  renderFooter();

  const [noticias, categorias] = await Promise.all([obtenerNoticias(), obtenerCategorias()]);

  const params = new URLSearchParams(window.location.search);
  let categoriaActiva = params.get("categoria") || "Todas";
  let busqueda = params.get("buscar") || "";
  let orden = "recientes";

  const inputBusqueda = document.getElementById("inputBusqueda");
  const selectOrden = document.getElementById("selectOrden");
  const listaCategorias = document.getElementById("listaCategorias");
  const grid = document.getElementById("noticiasGrid");
  const contadorTexto = document.getElementById("contadorTexto");
  const totalTexto = document.getElementById("totalTexto");

  inputBusqueda.value = busqueda;

  function construirSidebar() {
    const todas = [{ name: "Todas", icon: "📰" }, ...categorias];
    listaCategorias.innerHTML = todas
      .map((c) => {
        const count = c.name === "Todas" ? noticias.length : noticias.filter((n) => n.category === c.name).length;
        const activo = categoriaActiva === c.name ? "active" : "";
        return `
          <li>
            <button class="${activo}" data-categoria="${c.name}">
              <span>${c.icon} ${c.name}</span>
              <span class="cat-count">${count}</span>
            </button>
          </li>`;
      })
      .join("");

    listaCategorias.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        categoriaActiva = btn.dataset.categoria;
        construirSidebar();
        render();
      });
    });
  }

  function filtrarYOrdenar() {
    let resultado = noticias.filter((n) => {
      const matchCat = categoriaActiva === "Todas" || n.category === categoriaActiva;
      const q = busqueda.toLowerCase();
      const matchBusqueda =
        !q || n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q);
      return matchCat && matchBusqueda;
    });

    resultado.sort((a, b) => {
      if (orden === "recientes") return b.id - a.id;
      if (orden === "antiguos") return a.id - b.id;
      return a.title.localeCompare(b.title);
    });

    return resultado;
  }

  function render() {
    const favoritos = obtenerFavoritos();
    const resultado = filtrarYOrdenar();

    totalTexto.textContent = `${resultado.length} artículo${resultado.length !== 1 ? "s" : ""} encontrado${resultado.length !== 1 ? "s" : ""}`;
    contadorTexto.innerHTML = `Mostrando <strong>${resultado.length}</strong> ${
      categoriaActiva !== "Todas" ? `en ${categoriaActiva}` : "noticias"
    }`;

    if (resultado.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="emoji">🔍</div>
          <h3>Sin resultados</h3>
          <p>No encontramos noticias que coincidan con tu búsqueda.</p>
          <button class="btn-primary" id="limpiarFiltros">Limpiar filtros</button>
        </div>`;
      document.getElementById("limpiarFiltros").addEventListener("click", () => {
        busqueda = "";
        categoriaActiva = "Todas";
        inputBusqueda.value = "";
        construirSidebar();
        render();
      });
    } else {
      grid.innerHTML = `<div class="news-grid">${resultado
        .map((n) => tarjetaNoticiaHTML(n, categorias, favoritos.has(n.id)))
        .join("")}</div>`;
    }
  }

  inputBusqueda.addEventListener("input", (e) => {
    busqueda = e.target.value;
    render();
  });

  selectOrden.addEventListener("change", (e) => {
    orden = e.target.value;
    render();
  });

  construirSidebar();
  render();
});
