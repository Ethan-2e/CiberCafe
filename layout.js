import { obtenerUsuarioActual, cerrarSesion } from './api-client.js';

const enlacesPorRol = {
  cliente: ['index.html'],
  operador: ['index.html', 'nueva-sesion.html', 'sesiones.html', 'incidencias.html'],
  administrador: ['index.html', 'nueva-sesion.html', 'sesiones.html', 'incidencias.html']
};

async function iniciarLayout() {
  const usuario = await obtenerUsuarioActual();

  if (!usuario) {
    if (!window.location.pathname.endsWith('login.html')) {
      window.location.href = 'login.html';
    }
    return;
  }

  document.body.dataset.rol = usuario.rol;

  const path = window.location.pathname;
  const permitidos = enlacesPorRol[usuario.rol] || ['index.html'];

  const item = (href, texto, activo) =>
    permitidos.includes(href)
      ? `<a href="${href}" class="nav-item ${activo ? 'active' : ''}">${texto}</a>`
      : '';

  const sidebarHTML = `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-name">Cibercafé Nova</div>
        <div class="brand-sub">${usuario.nombre} · ${usuario.rol}</div>
      </div>
      <nav class="sidebar-section">
        <div class="sidebar-label">Principal</div>
        ${item('index.html', 'Panel operativo', path.includes('index') || path === '/')}
        ${item('nueva-sesion.html', 'Nueva sesión', path.includes('nueva-sesion'))}
        ${item('sesiones.html', 'Sesiones activas', path.includes('sesiones'))}
        ${item('incidencias.html', 'Incidencias', path.includes('incidencias'))}
      </nav>
      <div style="margin-top: auto; padding: 20px;">
        <button id="btn-logout" class="btn" style="width: 100%; background-color: #f8f9fa; border: 1px solid #ddd; color: #dc3545;">Cerrar sesión</button>
      </div>
    </aside>
  `;

  const contenedor = document.getElementById('sidebar-container');
  if (contenedor) contenedor.innerHTML = sidebarHTML;

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) btnLogout.addEventListener('click', cerrarSesion);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarLayout);
} else {
  iniciarLayout();
}
