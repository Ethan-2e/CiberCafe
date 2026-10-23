if (!sessionStorage.getItem('usuarioLogueado')) {
    window.location.href = 'login.html';
}
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const sidebarHTML = `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-name">Cibercafé Nova</div>
        <div class="brand-sub">Panel de operación</div>
      </div>
      <nav class="sidebar-section">
        <div class="sidebar-label">Principal</div>
        <a href="index.html" class="nav-item ${path.includes('index') || path === '/' ? 'active' : ''}">Panel operativo</a>
        <a href="nueva-sesion.html" class="nav-item ${path.includes('nueva-sesion') ? 'active' : ''}">Nueva sesión</a>
        <a href="sesiones.html" class="nav-item ${path.includes('sesiones') ? 'active' : ''}">Sesiones activas</a>
        <a href="incidencias.html" class="nav-item ${path.includes('incidencias') ? 'active' : ''}">Incidencias</a>
      </nav>
      
      <div style="margin-top: auto; padding: 20px;">
        <button id="btn-logout" class="btn" style="width: 100%; background-color: #f8f9fa; border: 1px solid #ddd; color: #dc3545;">Cerrar sesión</button>
      </div>
    </aside>
  `;
  document.getElementById("sidebar-container").innerHTML = sidebarHTML;
  document.getElementById('btn-logout').addEventListener('click', () => {
      sessionStorage.removeItem('usuarioLogueado');
      window.location.href = 'login.html';
  });
});