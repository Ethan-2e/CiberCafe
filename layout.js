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
        <a href="salas.html" class="nav-item ${path.includes('salas') ? 'active' : ''}">Salas y puestos</a>
        <a href="sesiones.html" class="nav-item ${path.includes('sesiones') ? 'active' : ''}">Sesiones activas</a>
      </nav>
    </aside>
  `;
  document.getElementById("sidebar-container").innerHTML = sidebarHTML;
});