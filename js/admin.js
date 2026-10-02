document.addEventListener("DOMContentLoaded", async () => {
  let categorias = await obtenerCategorias();
  let articulos = await obtenerNoticias();

  let vista = "list"; // list | create | edit
  let editId = null;
  let deleteId = null;

  const vistaLista = document.getElementById("vistaLista");
  const vistaForm = document.getElementById("vistaForm");
  const navItems = document.querySelectorAll(".admin-nav-item[data-view]");
  const modal = document.getElementById("modalEliminar");

  const FORM_VACIO = { title: "", category: categorias[0].name, excerpt: "", content: "", author: "", image: "" };
  let formData = { ...FORM_VACIO };

  function setVista(v) {
    vista = v;
    vistaLista.style.display = v === "list" ? "block" : "none";
    vistaForm.style.display = v === "list" ? "none" : "block";
    navItems.forEach((n) => n.classList.toggle("active", n.dataset.view === v || (v !== "list" && n.dataset.view === "create")));
    if (v === "list") renderLista();
    else renderFormulario();
  }

  function renderLista() {
    document.getElementById("totalArticulos").textContent = `${articulos.length} artículos publicados`;
    const tbody = document.getElementById("tablaBody");
    tbody.innerHTML = articulos
      .map((n) => {
        const color = colorCategoria(categorias, n.category);
        return `
        <tr>
          <td>
            <div class="table-title-cell">
              <img src="${n.image}" alt="${escapeHtml(n.title)}">
              <span>${escapeHtml(n.title)}</span>
            </div>
          </td>
          <td><span class="cat-pill" style="background:${color}18;color:${color}">${n.category}</span></td>
          <td>${escapeHtml(n.author || "—")}</td>
          <td style="color:var(--texto-claro)">${n.date}</td>
          <td>
            <div class="table-actions">
              <button class="icon-btn edit" data-edit="${n.id}" title="Editar">✏️</button>
              <button class="icon-btn delete" data-delete="${n.id}" title="Eliminar">🗑</button>
            </div>
          </td>
        </tr>`;
      })
      .join("");

    tbody.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => iniciarEdicion(Number(btn.dataset.edit)));
    });
    tbody.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => abrirModalEliminar(Number(btn.dataset.delete)));
    });
  }

  function iniciarCreacion() {
    formData = { ...FORM_VACIO };
    editId = null;
    setVista("create");
  }

  function iniciarEdicion(id) {
    const n = articulos.find((a) => a.id === id);
    if (!n) return;
    formData = {
      title: n.title,
      category: n.category,
      excerpt: n.excerpt,
      content: n.content,
      author: n.author,
      image: n.image,
    };
    editId = id;
    setVista("edit");
  }

  function renderFormulario() {
    document.getElementById("formTitulo").textContent = vista === "create" ? "Crear noticia" : "Editar noticia";
    document.getElementById("formSubtitulo").textContent =
      vista === "create" ? "Completa los campos para publicar" : "Actualiza los datos de la noticia";

    document.getElementById("campoTitulo").value = formData.title;
    document.getElementById("campoExcerpt").value = formData.excerpt;
    document.getElementById("campoContent").value = formData.content;
    document.getElementById("campoAutor").value = formData.author;
    document.getElementById("campoImagen").value = formData.image;

    const selectCat = document.getElementById("campoCategoria");
    selectCat.innerHTML = categorias.map((c) => `<option value="${c.name}">${c.name}</option>`).join("");
    selectCat.value = formData.category;

    actualizarPreview();

    const btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.classList.remove("saved");
    btnGuardar.textContent = "💾 Guardar";
  }

  function actualizarPreview() {
    const preview = document.getElementById("imgPreview");
    const url = document.getElementById("campoImagen").value.trim();
    if (url) {
      preview.style.display = "block";
      preview.innerHTML = `<img src="${url}" alt="Preview" onerror="this.parentElement.style.display='none'">`;
    } else {
      preview.style.display = "none";
      preview.innerHTML = "";
    }
  }

  function calcularTiempoLectura(texto) {
    const palabras = texto.trim().split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.ceil(palabras / 200))} min de lectura`;
  }

  function guardarFormulario(e) {
    e.preventDefault();

    formData.title = document.getElementById("campoTitulo").value.trim();
    formData.category = document.getElementById("campoCategoria").value;
    formData.excerpt = document.getElementById("campoExcerpt").value.trim();
    formData.content = document.getElementById("campoContent").value.trim();
    formData.author = document.getElementById("campoAutor").value.trim();
    formData.image = document.getElementById("campoImagen").value.trim();

    if (!formData.title || !formData.excerpt || !formData.content || !formData.image) {
      alert("Por favor completa los campos obligatorios (título, descripción breve, contenido e imagen).");
      return;
    }

    if (vista === "create") {
      const nuevo = {
        ...formData,
        id: Date.now(),
        date: new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }),
        readTime: calcularTiempoLectura(formData.content),
      };
      articulos = [nuevo, ...articulos];
    } else if (editId !== null) {
      articulos = articulos.map((a) => (a.id === editId ? { ...a, ...formData } : a));
    }

    guardarNoticias(articulos);

    const btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.classList.add("saved");
    btnGuardar.textContent = "✓ Guardado";

    setTimeout(() => setVista("list"), 1000);
  }

  function abrirModalEliminar(id) {
    deleteId = id;
    modal.classList.add("open");
  }

  function cerrarModal() {
    deleteId = null;
    modal.classList.remove("open");
  }

  function confirmarEliminar() {
    articulos = articulos.filter((a) => a.id !== deleteId);
    guardarNoticias(articulos);
    cerrarModal();
    renderLista();
  }

  // Eventos
  navItems.forEach((n) => {
    n.addEventListener("click", () => {
      if (n.dataset.view === "create") iniciarCreacion();
      else setVista("list");
    });
  });

  document.getElementById("btnNuevaNoticia").addEventListener("click", iniciarCreacion);
  document.getElementById("btnVolverLista").addEventListener("click", () => setVista("list"));
  document.getElementById("btnCancelarForm").addEventListener("click", () => setVista("list"));
  document.getElementById("formAdmin").addEventListener("submit", guardarFormulario);
  document.getElementById("campoImagen").addEventListener("input", actualizarPreview);
  document.getElementById("btnCancelarModal").addEventListener("click", cerrarModal);
  document.getElementById("btnConfirmarEliminar").addEventListener("click", confirmarEliminar);

  setVista("list");
});
