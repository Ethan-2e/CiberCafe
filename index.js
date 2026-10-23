import { API_URL } from './api.js';
async function cargarPanel() {
    try {
        const respuesta = await fetch(`${API_URL}/computadores`);
        const computadores = await respuesta.json();
        const disponibles = computadores.filter(c => c.estado === 'disponible').length;
        const enUso = computadores.filter(c => c.estado === 'en_uso').length;
        const enFalla = computadores.filter(c => c.estado === 'falla').length;
        document.getElementById('dashboard-stats').innerHTML = `
            <div class="stats-row">
                <div class="stat-tile">
                    <div class="stat-label">Disponibles</div>
                    <div class="stat-value" style="color:#28a745">${disponibles}</div>
                </div>
                <div class="stat-tile">
                    <div class="stat-label">En uso</div>
                    <div class="stat-value" style="color:#6c757d">${enUso}</div>
                </div>
                <div class="stat-tile">
                    <div class="stat-label">Fallas</div>
                    <div class="stat-value" style="color:#dc3545">${enFalla}</div>
                </div>
            </div>
        `;
        const salas = {};
        computadores.forEach(comp => {
            if (!salas[comp.sala]) {
                salas[comp.sala] = [];
            }
            salas[comp.sala].push(comp);
        });
        let htmlSalas = '<div class="salas-container">';
        for (const [nombreSala, puestos] of Object.entries(salas)) {
            htmlSalas += `
                <div class="sala-card">
                    <h3 class="sala-title">Sala ${nombreSala}</h3>
                    <div class="puestos-grid">
            `;
            puestos.forEach(p => {
                htmlSalas += `<div class="puesto puesto-${p.estado}" title="Estado: ${p.estado}" onclick="window.location.href='detalle.html?id=${p.id}'">${p.id}</div>`;
            });           
            htmlSalas += `</div></div>`;
        }
        htmlSalas += '</div>';
        document.getElementById('salas-content').innerHTML = htmlSalas;
    } catch (error) {
        console.error("Error conectando a la API:", error);
        document.getElementById('dashboard-stats').innerHTML = `<p style="color:red">Error al conectar con la base de datos.</p>`;
    }
}
document.addEventListener("DOMContentLoaded", cargarPanel);