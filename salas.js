import { API_URL } from './api.js';

async function cargarSalas() {
    try {
        const respuesta = await fetch(`${API_URL}/computadores`);
        const computadores = await respuesta.json();
        
        const salas = {};
        computadores.forEach(comp => {
            if (!salas[comp.sala]) {
                salas[comp.sala] = [];
            }
            salas[comp.sala].push(comp);
        });

        let html = '<div class="salas-container">';
        
        for (const [nombreSala, puestos] of Object.entries(salas)) {
            html += `
                <div class="sala-card">
                    <h3 class="sala-title">Sala ${nombreSala}</h3>
                    <div class="puestos-grid">
            `;
            
            puestos.forEach(p => {
                html += `<div class="puesto puesto-${p.estado}" title="Estado: ${p.estado}" onclick="window.location.href='detalle.html?id=${p.id}'">${p.id}</div>`;
            });
            
            html += `</div></div>`;
        }
        
        html += '</div>';
        document.getElementById('salas-content').innerHTML = html;
        
    } catch (error) {
        console.error("Error cargando salas:", error);
        document.getElementById('salas-content').innerHTML = '<p style="color:red">Error al cargar la información de las salas.</p>';
    }
}

document.addEventListener("DOMContentLoaded", cargarSalas);