document.addEventListener("DOMContentLoaded", () => {
  const sidebarHTML = `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-name">Cibercafé Nova</div>
        <div class="brand-sub">Panel de operación</div>
      </div>
      <nav class="sidebar-section">
        <div class="sidebar-label">Principal</div>
        <a href="index.html" class="nav-item ${window.location.pathname.includes('index') || window.location.pathname === '/' ? 'active' : ''}">Panel operativo</a>
        <a href="salas.html" class="nav-item ${window.location.pathname.includes('salas') ? 'active' : ''}">Salas y puestos</a>
      </nav>
    </aside>
  `;
  document.getElementById("sidebar-container").innerHTML = sidebarHTML;
});