const COMUNAS_SECTORES = {
  'comuna-1': { nombre: 'Comuna 1 - Barrio Blanco', sectores: ['Sector Blanco', 'Sector La Floresta', 'Sector El Prado'] },
  'comuna-2': { nombre: 'Comuna 2 - El Taylorismo', sectores: ['Sector Industrial', 'Sector Los Olivos', 'Sector Las Granjas'] },
  'comuna-3': { nombre: 'Comuna 3 - Las Américas', sectores: ['Sector Las Américas', 'Sector La Cabaña', 'Sector Villa del Prado'] },
  'comuna-4': { nombre: 'Comuna 4 - Los Andes', sectores: ['Sector La Ceiba', 'Sector El Jardín', 'Sector Los Álamos'] },
  'comuna-5': { nombre: 'Comuna 5 - Antonia Santos', sectores: ['Sector Antonia Santos', 'Sector La Merced', 'Sector La Pampa'] },
  'comuna-6': { nombre: 'Comuna 6 - San Fernando', sectores: ['Sector San Fernando', 'Sector El Salado', 'Sector El Anillo'] },
  'comuna-7': { nombre: 'Comuna 7 - Los Caobos', sectores: ['Sector Los Caobos', 'Sector San Luis', 'Sector La Playa'] },
  'comuna-8': { nombre: 'Comuna 8 - Av. Guaimaral', sectores: ['Sector Guaimaral', 'Sector La Esquina', 'Sector El Mirador'] },
  'comuna-9': { nombre: 'Comuna 9 - Centro', sectores: ['Sector Centro', 'Sector Coliseo', 'Sector Parque'] },
  'comuna-10': { nombre: 'Comuna 10 - Juan Atalaya', sectores: ['Sector Juan Atalaya', 'Sector El Conuquero', 'Sector Las Isabelas', 'Sector Nazareth', 'Sector San Mateo'] }
};

function initDashboard() {
  const userData = JSON.parse(localStorage.getItem('userData') || 'null') || {};
  const name = userData.name || 'Usuario';
  const email = userData.email || 'usuario@example.com';

  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const userAvatar = document.getElementById('userAvatar');
  const configName = document.getElementById('configName');
  const configEmail = document.getElementById('configEmail');

  if (userName) userName.textContent = name;
  if (userEmail) userEmail.textContent = email;
  if (userAvatar) userAvatar.textContent = name.charAt(0).toUpperCase();
  if (configName) configName.value = name;
  if (configEmail) configEmail.value = email;

  const successBlock = document.getElementById('form-success');
  if (successBlock) successBlock.hidden = true;

  const previewBlock = document.getElementById('preview-foto');
  if (previewBlock) previewBlock.hidden = true;
}

function switchView(viewName, event) {
  document.querySelectorAll('.view-section').forEach((el) => { el.style.display = 'none'; });
  const selectedView = document.getElementById('view-' + viewName);
  if (!selectedView) return;
  selectedView.style.display = 'block';

  document.querySelectorAll('.sidebar-nav-item').forEach((el) => { el.classList.remove('active'); });
  const target = event && event.target ? event.target.closest('.sidebar-nav-item') : null;
  if (target) target.classList.add('active');
  else {
    const navItem = document.querySelector('.sidebar-nav-item[data-view="' + viewName + '"]');
    if (navItem) navItem.classList.add('active');
  }

  if (viewName === 'nuevo') resetForm();

  const subtitles = {
    resumen: 'Bienvenido a tu panel de control',
    reportes: 'Historial de todos tus reportes',
    nuevo: 'Reporta una nueva vía dañada',
    configuracion: 'Administra tu cuenta'
  };

  const subtitleSection = document.getElementById('subtitleSection');
  if (subtitleSection) subtitleSection.textContent = subtitles[viewName] || '';
}

function actualizarSectores() {
  const comunaSelect = document.getElementById('localidad');
  const sectorGroup = document.getElementById('sector-group');
  const sectorSelect = document.getElementById('sector');
  if (!comunaSelect || !sectorGroup || !sectorSelect) return;

  const comunaSeleccionada = comunaSelect.value;
  sectorSelect.innerHTML = '<option value="">Selecciona un sector...</option>';

  if (comunaSeleccionada && COMUNAS_SECTORES[comunaSeleccionada]) {
    COMUNAS_SECTORES[comunaSeleccionada].sectores.forEach((sector) => {
      const option = document.createElement('option');
      option.value = sector.toLowerCase().replace(/\s+/g, '-');
      option.textContent = sector;
      sectorSelect.appendChild(option);
    });
    sectorGroup.style.display = 'block';
  } else {
    sectorGroup.style.display = 'none';
  }
}

function mostrarFoto(input) {
  const preview = document.getElementById('preview-foto');
  if (!preview) return;
  preview.innerHTML = '';
  if (!input.files || !input.files[0]) {
    preview.hidden = true;
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = document.createElement('img');
    img.src = event.target.result;
    preview.innerHTML = '';
    preview.appendChild(img);
    preview.hidden = false;
  };
  reader.readAsDataURL(input.files[0]);
}

function enviarReporte(event) {
  event.preventDefault();
  const direccion = document.getElementById('direccion');
  const localidad = document.getElementById('localidad');
  const sector = document.getElementById('sector');
  const tipoDano = document.getElementById('tipo-dano');
  const reporteForm = document.getElementById('reporte-form');
  const successDiv = document.getElementById('form-success');
  const codigoReporte = document.getElementById('codigo-reporte');

  if (!reporteForm || !successDiv || !codigoReporte) return;
  if (!localidad || !localidad.value || !sector || !sector.value) {
    alert('Por favor selecciona la comuna y el sector.');
    return;
  }

  const codigo = '#VIA-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 10000);
  const reportData = {
    codigo,
    direccion: direccion ? direccion.value : '',
    localidad: localidad.value,
    sector: sector.value,
    tipoDano: tipoDano ? tipoDano.value : ''
  };

  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  reports.unshift(reportData);
  localStorage.setItem('reports', JSON.stringify(reports));

  reporteForm.style.display = 'none';
  codigoReporte.textContent = codigo;
  successDiv.hidden = false;
}

function resetForm() {
  const reporteForm = document.getElementById('reporte-form');
  const successDiv = document.getElementById('form-success');
  const sectorGroup = document.getElementById('sector-group');
  const preview = document.getElementById('preview-foto');

  if (reporteForm) { reporteForm.style.display = 'block'; reporteForm.reset(); }
  if (successDiv) successDiv.hidden = true;
  if (sectorGroup) sectorGroup.style.display = 'none';
  if (preview) preview.hidden = true;
}

function saveConfig() {
  const name = document.getElementById('configName')?.value || '';
  const email = document.getElementById('configEmail')?.value || '';
  if (!name || !email) { alert('Completa tu nombre y correo para guardar la configuración.'); return; }

  localStorage.setItem('userData', JSON.stringify({ name, email }));
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const userAvatar = document.getElementById('userAvatar');
  if (userName) userName.textContent = name;
  if (userEmail) userEmail.textContent = email;
  if (userAvatar) userAvatar.textContent = name.charAt(0).toUpperCase();

  alert('✓ Configuración guardada exitosamente');
}

function logout() { if (confirm('¿Estás seguro de que deseas cerrar sesión?')) { localStorage.removeItem('userData'); localStorage.removeItem('sessionToken'); window.location.href = 'inicio_sesion.html'; }}

function openViewFromQuery() { const params = new URLSearchParams(window.location.search); const view = params.get('view'); if (view) switchView(view); }

function buscarEstado() {
  const codigo = document.getElementById('codigo-busqueda')?.value.trim();
  const resultado = document.getElementById('estado-resultado');
  if (!codigo) { alert('Por favor ingresa un código de reporte'); return; }
  if (resultado) resultado.hidden = false;
  const codigoLabel = document.getElementById('codigo-resultado');
  if (codigoLabel) codigoLabel.textContent = codigo;
}

function likeReporte(button) { const span = button.querySelector('span'); if (!span) return; let count = parseInt(span.textContent, 10) || 0; count += 1; span.textContent = count; button.classList.add('activo'); }
function toggleComentarios(button) { const comentariosBox = button.closest('.reporte-card')?.querySelector('.comentarios-box'); if (comentariosBox) comentariosBox.hidden = !comentariosBox.hidden; }
function enviarComentario(inputId, listaDiv) { const input = document.getElementById(inputId); const lista = typeof listaDiv === 'string' ? document.getElementById(listaDiv) : listaDiv; const texto = input?.value.trim(); if (!texto || !lista) return; const nuevoComentario = document.createElement('div'); nuevoComentario.className = 'comentario'; nuevoComentario.innerHTML = '<strong>Tú:</strong> ' + texto; lista.appendChild(nuevoComentario); input.value = ''; }

function togglePass(inputId, btn) { const input = document.getElementById(inputId); if (!input || !btn) return; if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; } else { input.type = 'password'; btn.textContent = '👁'; }}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email')?.value.trim() || '';
  const password = document.getElementById('login-pass')?.value || '';
  const btn = document.querySelector('.auth-form button[type="submit"]');
  if (!email || !password) { alert('Por favor completa todos los campos'); return; }

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) { alert('Correo o contraseña incorrectos.'); return; }

  if (btn) { btn.textContent = '⏳ Iniciando sesión...'; btn.disabled = true; }
  localStorage.setItem('userData', JSON.stringify({ name: user.name, email: user.email }));
  localStorage.setItem('sessionToken', 'token_' + Date.now());
  window.location.href = 'dashboard.html';
}

function checkStrength(val) {
  const segs = [document.getElementById('seg1'), document.getElementById('seg2'), document.getElementById('seg3'), document.getElementById('seg4')];
  const label = document.getElementById('strength-label');
  let score = 0;
  if (val.length >= 8) score += 1;
  if (/[A-Z]/.test(val)) score += 1;
  if (/[0-9]/.test(val)) score += 1;
  if (/[^A-Za-z0-9]/.test(val)) score += 1;

  segs.forEach((seg, i) => { if (!seg) return; seg.className = 'strength-seg'; if (i < score) seg.classList.add(score <= 1 ? 'weak' : score <= 2 ? 'medium' : 'strong'); });
  const labels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
  if (label) { label.textContent = val.length ? labels[score] || 'Fuerte' : ''; label.style.color = score <= 1 ? '#e53935' : score <= 2 ? '#f97316' : '#22c55e'; }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name')?.value.trim() || '';
  const email = document.getElementById('reg-email')?.value.trim().toLowerCase() || '';
  const p1 = document.getElementById('reg-pass')?.value || '';
  const p2 = document.getElementById('reg-pass2')?.value || '';
  const terms = document.getElementById('terms')?.checked || false;
  const btn = document.getElementById('reg-btn');

  if (!name || !email) { alert('Por favor completa todos los campos'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Ingresa un correo electrónico válido.'); return; }
  if (p1.length < 8) { alert('La contraseña debe tener mínimo 8 caracteres'); return; }
  if (p1 !== p2) { const p2Input = document.getElementById('reg-pass2'); if (p2Input) { p2Input.classList.add('invalid'); p2Input.focus(); } alert('Las contraseñas no coinciden.'); return; }
  if (!terms) { alert('Debes aceptar los términos de uso y política de privacidad'); return; }

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.some((u) => u.email.toLowerCase() === email)) { alert('Este correo ya está registrado.'); return; }
  if (btn) { btn.textContent = '⏳ Creando cuenta...'; btn.disabled = true; }

  users.push({ name, email, password: p1, createdAt: new Date().toISOString() });
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('userData', JSON.stringify({ name, email }));

  setTimeout(() => {
    const form = document.getElementById('reg-form');
    const successScreen = document.getElementById('success-screen');
    if (form) form.style.display = 'none';
    if (successScreen) { successScreen.style.display = 'flex'; successScreen.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }, 600);
}

const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const mainNav = document.getElementById('main-nav');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    // Para index.html (usa clase 'abierto')
    if (mainNav) {
      mainNav.classList.toggle('abierto');
      console.log('main-nav abierto:', mainNav.classList.contains('abierto'));
    }
    
    // Para dashboard.html (usa clase 'sidebar-open' en body)
    if (sidebar) {
      document.body.classList.toggle('sidebar-open');
      console.log('sidebar-open:', document.body.classList.contains('sidebar-open'));
    }
  });
}

// Cerrar sidebar en dashboard.html al hacer click en un elemento de navegación
document.querySelectorAll('.sidebar-nav-item').forEach(item => {
  item.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      document.body.classList.remove('sidebar-open');
    }
  });
});

// Cerrar sidebar al hacer click en el overlay (dashboard.html)
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768 && document.body.classList.contains('sidebar-open')) {
    if (!e.target.closest('.dashboard-sidebar') && !e.target.closest('.menu-toggle-btn')) {
      document.body.classList.remove('sidebar-open');
    }
  }
  
  // Para index.html: cerrar menú al hacer click fuera
  if (window.innerWidth <= 768) {
    const mainNav = document.getElementById('main-nav');
    if (mainNav && mainNav.classList.contains('abierto')) {
      if (!e.target.closest('#main-nav') && !e.target.closest('.menu-toggle')) {
        mainNav.classList.remove('abierto');
      }
    }
  }
});

initDashboard();
openViewFromQuery();
