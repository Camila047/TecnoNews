document.addEventListener("DOMContentLoaded", () => {
  renderHeader("contact");
  renderFooter();

  const form = document.getElementById("contactForm");
  const successBox = document.getElementById("successBox");

  const campos = {
    name: document.getElementById("campoNombre"),
    email: document.getElementById("campoEmail"),
    phone: document.getElementById("campoTelefono"),
    message: document.getElementById("campoMensaje"),
  };

  function limpiarError(nombre) {
    const grupo = campos[nombre].closest(".form-group");
    grupo.classList.remove("error");
    const errorEl = grupo.querySelector(".error-text");
    if (errorEl) errorEl.remove();
  }

  function mostrarError(nombre, mensaje) {
    const grupo = campos[nombre].closest(".form-group");
    grupo.classList.add("error");
    let errorEl = grupo.querySelector(".error-text");
    if (!errorEl) {
      errorEl = document.createElement("p");
      errorEl.className = "error-text";
      grupo.appendChild(errorEl);
    }
    errorEl.textContent = mensaje;
  }

  function validar() {
    let valido = true;
    Object.keys(campos).forEach((n) => limpiarError(n));

    if (!campos.name.value.trim()) {
      mostrarError("name", "El nombre es requerido");
      valido = false;
    }

    const email = campos.email.value.trim();
    if (!email) {
      mostrarError("email", "El correo es requerido");
      valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      mostrarError("email", "Ingresa un correo válido");
      valido = false;
    }

    if (!campos.message.value.trim()) {
      mostrarError("message", "El mensaje es requerido");
      valido = false;
    }

    return valido;
  }

  Object.keys(campos).forEach((n) => {
    campos[n].addEventListener("input", () => limpiarError(n));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validar()) return;

    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Enviando...";

    // Simulación de envío (sin backend real)
    setTimeout(() => {
      form.style.display = "none";
      successBox.style.display = "block";
    }, 1200);
  });

  document.getElementById("btnOtroMensaje").addEventListener("click", () => {
    form.reset();
    Object.keys(campos).forEach((n) => limpiarError(n));
    form.style.display = "block";
    successBox.style.display = "none";
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = false;
    btn.textContent = "Enviar mensaje";
  });
});
