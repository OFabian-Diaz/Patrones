let usuarioRegistrado = null;

function mostrarFormulario(formularioId) {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("registro").style.display = "none";
  document.getElementById("formulario").style.display = "none";
  document.getElementById(formularioId).style.display = "block";
}

function registrar() {
  const nombre = document.getElementById("nombre").value;
  const apellidos = document.getElementById("apellidos").value;
  const direccion = document.getElementById("direccion").value;
  const celular = document.getElementById("celular").value;
  const cedula = document.getElementById("cedula").value;
  const password = document.getElementById("password").value;

  if (celular.length !== 10 || isNaN(celular)) {
    alert("El celular debe tener 10 dígitos numéricos.");
    return;
  }

  if (cedula.length !== 10 || isNaN(cedula)) {
    alert("La cédula debe tener 10 dígitos numéricos.");
    return;
  }

  usuarioRegistrado = {
    nombre,
    cedula,
    password
  };

  alert("¡Registro exitoso!");
  mostrarFormulario("login");
}

function iniciarSesion() {
  const nombre = document.getElementById("login-nombre").value;
  const cedula = document.getElementById("login-cedula").value;
  const password = document.getElementById("login-password").value;

  if (!usuarioRegistrado) {
    alert("Primero debes registrarte.");
    return;
  }

  if (
    nombre === usuarioRegistrado.nombre &&
    cedula === usuarioRegistrado.cedula &&
    password === usuarioRegistrado.password
  ) {
    mostrarFormulario("formulario");
  } else {
    alert("Datos incorrectos. Verifica e intenta de nuevo.");
  }
}

function enviarReporte() {
  alert("¡Reporte enviado correctamente!");
}

function toggleSidebar() {
  alert("Aquí se abriría un menú lateral (sidebar).");
}
