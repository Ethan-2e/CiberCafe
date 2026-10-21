import { API_URL } from './api.js';
async function cargarDashboard() {
    try {
        const res = await fetch(`${API_URL}/computadores`);
        const computadores = await res.json();
        const disponibles = computadores.filter(c => c.estado === 'disponible').length;
        const enUso = computadores.filter(c => c.estado === 'en_uso').length;
        document.getElementById('dashboard-content').innerHTML = `
            <div class="stats-row">
                <div class="stat-tile">
                    <div class="stat-label">Disponibles</div>
                    <div class="stat-value" style="color:var(--ok)">${disponibles}</div>
                </div>
                <div class="stat-tile">
                    <div class="stat-label">En uso</div>
                    <div class="stat-value" style="color:var(--err)">${enUso}</div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error conectando a la API:", error);
        document.getElementById('dashboard-content').innerHTML = `<p style="color:red">Error al conectar con la base de datos en AWS.</p>`;
    }
}
document.addEventListener("DOMContentLoaded", cargarDashboard);