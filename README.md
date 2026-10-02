# TecnoNews — Versión HTML / CSS / JavaScript puro

Conversión del prototipo de Figma Make (React) a código plano, cumpliendo con los
requisitos de la **Entrega 2 – Prototipo funcional (Semana 5)**:

- ✅ Desarrollo en HTML, CSS y JavaScript (sin frameworks ni build tools)
- ✅ Renderizado dinámico de noticias desde un archivo JSON (`data/news.json`, vía `fetch`)
- ✅ Funcionalidad de favoritos (persistente con `localStorage`)
- ✅ Formulario de contacto con validaciones en tiempo real
- ✅ Mini CRUD de noticias (crear, editar, eliminar) en el panel `admin.html`, guardado en `localStorage`
- ✅ Código estructurado en carpetas (`css/`, `js/`, `data/`)

## Estructura del proyecto

```
TecnoNews/
├── index.html          → Página de inicio
├── noticias.html        → Listado con filtros por categoría y búsqueda
├── detalle.html          → Detalle de una noticia (?id=)
├── favoritos.html        → Noticias guardadas como favoritas
├── contacto.html         → Formulario de contacto con validaciones
├── admin.html            → Panel de administración (mini CRUD)
├── css/
│   └── style.css        → Todos los estilos del sitio
├── js/
│   ├── utils.js          → Carga de datos, favoritos, header/footer compartidos
│   ├── home.js
│   ├── noticias.js
│   ├── detalle.js
│   ├── favoritos.js
│   ├── contacto.js
│   └── admin.js
└── data/
    └── news.json          → Fuente de datos (noticias + categorías)
```

## Cómo ejecutarlo

Como el sitio usa `fetch()` para cargar `data/news.json`, **no funciona abriendo el
archivo directamente con doble clic** (protocolo `file://` bloquea el `fetch` en
algunos navegadores). Debes servirlo con un servidor local:

**Opción 1 — VS Code (recomendado):**
Instala la extensión "Live Server" → clic derecho sobre `index.html` → "Open with Live Server".

**Opción 2 — Python (si lo tienes instalado):**
```bash
cd TecnoNews
python -m http.server 8000
```
Luego abre `http://localhost:8000` en el navegador.

**Opción 3 — GitHub Pages:**
Al subir el repositorio a GitHub y activar GitHub Pages (Settings → Pages), el sitio
funciona igual sin configuración adicional.

## Notas técnicas

- El admin guarda sus cambios (crear/editar/eliminar) en `localStorage`, bajo la
  clave `tecnonews_admin_noticias`. Si nunca se ha usado el admin, todas las páginas
  leen los datos originales desde `data/news.json`.
- Los favoritos se guardan en `localStorage` bajo la clave `tecnonews_favoritos`.
- Para "resetear" el proyecto a los datos originales, basta con borrar esas dos claves
  desde las herramientas de desarrollador del navegador (Application → Local Storage).
