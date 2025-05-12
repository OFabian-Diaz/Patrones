// ✅ Mostrar cualquier pantalla
function mostrarVista(idVista) {
  const vistas = document.querySelectorAll('.pantalla');
  vistas.forEach(vista => vista.style.display = 'none');
  document.getElementById(idVista).style.display = 'block';
}

function registrar() {
  const data = {
    nombre: document.getElementById("nombre").value,
    apellidos: document.getElementById("apellidos").value,
    direccion: document.getElementById("direccion").value,
    celular: document.getElementById("celular").value,
    cedula: document.getElementById("cedula").value,
    password: document.getElementById("password").value
  };

  if (data.celular.length !== 10 || isNaN(data.celular)) {
    alert("El celular debe tener 10 dígitos numéricos.");
    return;
  }

  if (data.cedula.length !== 10 || isNaN(data.cedula)) {
    alert("La cédula debe tener 10 dígitos numéricos.");
    return;
  }

  fetch('http://localhost:3000/api/registrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => {
    if (res.ok) {
      alert("¡Registro exitoso!");
      mostrarVista("login");
    } else {
      alert("Error al registrar.");
    }
  });
}

function iniciarSesion() {
  const data = {
    nombre: document.getElementById("login-nombre").value,
    cedula: document.getElementById("login-cedula").value,
    password: document.getElementById("login-password").value
  };

  fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => {
      if (res.ok) {
        localStorage.setItem("cedulaUsuario", data.cedula);
        alert("Inicio de sesión exitoso");

        // ✅ Mostrar el sidebar y el botón fijo para abrir/cerrar
        document.getElementById("sidebar").classList.add("visible");
        document.getElementById("btnSidebarFijo").style.display = "block";

        mostrarVista("formulario");
      } else {
        alert("Datos incorrectos o usuario no registrado");
      }
    })
    .catch(err => {
      console.error("Error al iniciar sesión", err);
      alert("Error en el servidor");
    });
}

function obtenerCedulaUsuario() {
  return localStorage.getItem("cedulaUsuario");
}

function cargarPerfil() {
  const cedula = obtenerCedulaUsuario();
  if (!cedula) {
    alert("No hay sesión iniciada.");
    mostrarVista("login");
    return;
  }

  fetch(`http://localhost:3000/api/usuario/${cedula}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('nombrePerfil').textContent = data.nombre;
      document.getElementById('apellidosPerfil').textContent = data.apellidos;
      document.getElementById('cedulaPerfil').textContent = data.cedula;
      document.getElementById('direccionPerfil').textContent = data.direccion;
      document.getElementById('celularPerfil').textContent = data.celular;
    });

  const formFoto = document.getElementById('form-foto');
  if (formFoto) {
    formFoto.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(formFoto);
      fetch(`http://localhost:3000/api/usuario/${cedula}/foto`, {
        method: 'POST',
        body: formData
      })
        .then(res => res.text())
        .then(msg => {
          alert(msg);
          cargarPerfil();
        });
    });
  }
}

function cerrarSesion() {
  localStorage.removeItem("cedulaUsuario");
  alert("Sesión cerrada");

  document.getElementById("sidebar").classList.remove("visible");
  document.getElementById("btnSidebarFijo").style.display = "none"; // Ocultar el botón fijo

  mostrarVista("inicio");
}


// ✅ Muestra alerta simple desde formulario
function enviarReporte() {
  alert("¡Reporte enviado correctamente!");
}

// ✅ Sidebar: abre/cierra usando clase .visible
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("visible");
}

// ==================== MAPA ====================

let mapaCargado = false;
let mapa;
let marcadorSeleccionado = null;
let ultimaUbicacion = null;

function inicializarMapa() {
  if (mapaCargado) return;
  mapaCargado = true;

  setTimeout(() => {
    mapa = L.map('mapaEmergencias').setView([4.60971, -74.08175], 13); // Bogotá

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapa);

    mapa.on('click', function (e) {
      const { lat, lng } = e.latlng;
      ultimaUbicacion = { lat, lng };

      const tipo = document.getElementById("tipoEmergencia").value;

      if (marcadorSeleccionado) {
        mapa.removeLayer(marcadorSeleccionado);
      }

      const icono = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background:${tipo};width:16px;height:16px;border-radius:50%;border:2px solid white;"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      marcadorSeleccionado = L.marker([lat, lng], { icon: icono }).addTo(mapa);
      marcadorSeleccionado.bindPopup(`Emergencia: ${tipo}<br>Lat: ${lat.toFixed(5)}<br>Lng: ${lng.toFixed(5)}`).openPopup();
    });

  }, 300);
}

function enviarAlertaDesdeMapa() {
  if (!ultimaUbicacion) {
    alert("Por favor, haz clic en el mapa para seleccionar una ubicación.");
    return;
  }

  const tipo = document.getElementById("tipoEmergencia").value;
  alert(`Alerta enviada:\nTipo: ${tipo}\nLat: ${ultimaUbicacion.lat.toFixed(5)}, Lng: ${ultimaUbicacion.lng.toFixed(5)}`);

  // Aquí podrías hacer un fetch POST para enviar esta info al backend si lo deseas
  // fetch('/api/alertas', { method: 'POST', body: JSON.stringify(...) })
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("visible");
}

function iniciarSesion() {
  const data = {
    nombre: document.getElementById("login-nombre").value,
    cedula: document.getElementById("login-cedula").value,
    password: document.getElementById("login-password").value
  };

  fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => {
      if (res.ok) {
        localStorage.setItem("cedulaUsuario", data.cedula);
        alert("Inicio de sesión exitoso");

        // ✅ Mostrar sidebar al iniciar sesión
        document.getElementById("sidebar").classList.add("visible");

        mostrarVista("formulario");
      } else {
        alert("Datos incorrectos o usuario no registrado");
      }
    })
    .catch(err => {
      console.error("Error al iniciar sesión", err);
      alert("Error en el servidor");
    });
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("visible");
}

