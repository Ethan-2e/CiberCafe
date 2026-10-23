import { API_URL } from './api.js';
let computadoresActuales = [];
async function cargarPanel() {
    try {
        const respuesta = await fetch(`${API_URL}/computadores`);
        computadoresActuales = await respuesta.json();
        const disponibles = computadoresActuales.filter(c => c.estado === 'disponible').length;
        const enUso = computadoresActuales.filter(c => c.estado === 'en_uso').length;
        const enFalla = computadoresActuales.filter(c => c.estado === 'falla').length;
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
        computadoresActuales.forEach(comp => {
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
            puestos.sort((a, b) => a.id.localeCompare(b.id, undefined, {numeric: true}));
            puestos.forEach(p => {
                htmlSalas += `<div class="puesto puesto-${p.estado}" title="Estado: ${p.estado}" onclick="window.location.href='detalle.html?id=${p.id}'">${p.id}</div>`;
            });   
            htmlSalas += `</div></div>`;
        }
        htmlSalas += '</div>';
        document.getElementById('salas-content').innerHTML = htmlSalas;
        let opcionesEliminar = '<option value="">Seleccione un equipo...</option>';
        const todosOrdenados = [...computadoresActuales].sort((a,b) => a.id.localeCompare(b.id, undefined, {numeric: true}));
        todosOrdenados.forEach(c => {
            opcionesEliminar += `<option value="${c.id}">${c.id} (Sala ${c.sala})</option>`;
        });
        document.getElementById('select-pc-eliminar').innerHTML = opcionesEliminar;
    } catch (error) {
        console.error("Error conectando a la API:", error);
        document.getElementById('dashboard-stats').innerHTML = `<p style="color:red">Error al conectar con la base de datos.</p>`;
    }
}
function generarProximoId(sala) {
    const prefijos = { 'General': 'G', 'Gamer': 'P', 'Grupal': 'E' };
    const prefijo = prefijos[sala];
    const pcsSala = computadoresActuales.filter(c => c.sala === sala);
    const numeros = pcsSala.map(c => parseInt(c.id.replace(prefijo, ''))).sort((a, b) => a - b);
    let proximoNum = 1;
    for (let i = 0; i < numeros.length; i++) {
        if (numeros[i] === proximoNum) {
            proximoNum++; 
        } else if (numeros[i] > proximoNum) {
            break; 
        }
    }   
    return prefijo + proximoNum.toString().padStart(2, '0');
}
document.getElementById('form-agregar-pc').addEventListener('submit', async (e) => {
    e.preventDefault();
    const salaSeleccionada = document.getElementById('select-area-agregar').value;
    const nuevoId = generarProximoId(salaSeleccionada);
    const nuevoPC = {
        id: nuevoId,
        sala: salaSeleccionada,
        estado: "disponible",
        motivo: ""
    };
    try {
        await fetch(`${API_URL}/computadores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoPC)
        });
        alert(`Éxito: Se ha creado el puesto ${nuevoId} en la Sala ${salaSeleccionada}.`);
        cargarPanel();
    } catch (error) {
        console.error(error);
        alert('Hubo un error al crear el equipo.');
    }
});
document.getElementById('form-eliminar-pc').addEventListener('submit', async (e) => {
    e.preventDefault();
    const pcId = document.getElementById('select-pc-eliminar').value;
    if (!pcId) {
        alert("Selecciona un equipo válido.");
        return;
    }
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar permanentemente el puesto ${pcId}?`);
    if (!confirmar) return;
    try {
        await fetch(`${API_URL}/computadores/${pcId}`, {
            method: 'DELETE'
        });
        alert(`El puesto ${pcId} ha sido eliminado.`);
        cargarPanel();
    } catch (error) {
        console.error(error);
        alert('Hubo un error al eliminar el equipo.');
    }
});
document.addEventListener("DOMContentLoaded", cargarPanel);