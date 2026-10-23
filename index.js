import { API_URL } from './api.js';
const ID_RE = /^[GPE]\d{2,}$/;
const PREFIJOS = { General: 'G', Gamer: 'P', Grupal: 'E' };
let computadoresActuales = [];
async function cargarPanel() {
    try {
        const respuesta = await fetch(`${API_URL}/computadores`, { cache: 'no-store' });
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
                    <div class="stat-value" style="color:#007bff">${enUso}</div>
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
        actualizarSelectoresGestion();
    } catch (error) {
        console.error("Error conectando a la API:", error);
        document.getElementById('dashboard-stats').innerHTML = `<p style="color:red">Error al conectar con la base de datos.</p>`;
    }
}
function numerosDeSala(lista, sala) {
    const prefijo = PREFIJOS[sala];
    return lista
        .filter(c => c.sala === sala)
        .map(c => {
            const m = String(c.id).match(new RegExp('^' + prefijo + '(\\d+)$'));
            return m ? parseInt(m[1], 10) : null;
        })
        .filter(n => Number.isFinite(n));
}
function siguienteLibre(lista, sala) {
    const usados = new Set(numerosDeSala(lista, sala));
    let n = 1;
    while (usados.has(n)) n++;
    return PREFIJOS[sala] + n.toString().padStart(2, '0');
}
async function obtenerComputadores() {
    const r = await fetch(`${API_URL}/computadores`, { cache: 'no-store' });
    if (!r.ok) throw new Error('No se pudo leer la lista de equipos');
    return r.json();
}
async function crearPuesto(sala, codigoPreferido) {
    for (let intento = 0; intento < 3; intento++) {
        const lista = await obtenerComputadores();
        const existentes = new Set(lista.map(c => String(c.id)));
        const codigo = (codigoPreferido && ID_RE.test(codigoPreferido) && !existentes.has(codigoPreferido))
            ? codigoPreferido
            : siguienteLibre(lista, sala);
        const res = await fetch(`${API_URL}/computadores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: codigo, sala: sala, estado: 'disponible', motivo: '' })
        });
        if (!res.ok) {
            codigoPreferido = null;
            continue;
        }
        const creado = await res.json();
        if (String(creado.id) === codigo) return codigo;
        await fetch(`${API_URL}/computadores/${encodeURIComponent(creado.id)}`, { method: 'DELETE' });
        codigoPreferido = null;
    }
    throw new Error('No se pudo crear un código válido');
}
async function repararCodigos() {
    const lista = await obtenerComputadores();
    const invalidos = lista.filter(c => !ID_RE.test(String(c.id)));
    for (const c of invalidos) {
        await fetch(`${API_URL}/computadores/${encodeURIComponent(c.id)}`, { method: 'DELETE' });
    }
    const validos = new Set(lista.filter(c => ID_RE.test(String(c.id))).map(c => String(c.id)));
    const [sesiones, incidencias] = await Promise.all([
        fetch(`${API_URL}/sesiones`, { cache: 'no-store' }).then(r => r.json()),
        fetch(`${API_URL}/incidencias`, { cache: 'no-store' }).then(r => r.json())
    ]);
    let huerfanos = 0;
    for (const s of sesiones) {
        if (!validos.has(String(s.puesto))) {
            await fetch(`${API_URL}/sesiones/${s.id}`, { method: 'DELETE' });
            huerfanos++;
        }
    }
    for (const i of incidencias) {
        if (!validos.has(String(i.puesto))) {
            await fetch(`${API_URL}/incidencias/${i.id}`, { method: 'DELETE' });
            huerfanos++;
        }
    }
    return { equipos: invalidos.length, huerfanos };
}
function actualizarSelectoresGestion() {
    let opcionesEliminar = '<option value="">Seleccione un equipo...</option>';
    const todosOrdenados = [...computadoresActuales].sort((a,b) => a.id.localeCompare(b.id, undefined, {numeric: true}));
    todosOrdenados.forEach(c => {
        opcionesEliminar += `<option value="${c.id}">${c.id} (Sala ${c.sala})</option>`;
    });
    document.getElementById('select-pc-eliminar').innerHTML = opcionesEliminar;
    let opcionesAgregar = '<option value="">Selecciona un código disponible...</option>';
    for (const [sala, prefijo] of Object.entries(PREFIJOS)) {
        const numeros = numerosDeSala(computadoresActuales, sala).sort((a, b) => a - b);
        const maxNum = numeros.length > 0 ? Math.max(...numeros) : 0;
        opcionesAgregar += `<optgroup label="Sala ${sala}">`;
        for (let i = 1; i <= maxNum; i++) {
            if (!numeros.includes(i)) {
                const idFomateado = prefijo + i.toString().padStart(2, '0');
                opcionesAgregar += `<option value="${idFomateado}" data-sala="${sala}">${idFomateado} (Espacio vacío)</option>`;
            }
        }
        for (let i = 1; i <= 2; i++) {
            const numNuevo = maxNum + i;
            const idFomateado = prefijo + numNuevo.toString().padStart(2, '0');
            opcionesAgregar += `<option value="${idFomateado}" data-sala="${sala}">${idFomateado} (Nuevo código)</option>`;
        }
        opcionesAgregar += `</optgroup>`;
    }
    document.getElementById('select-id-agregar').innerHTML = opcionesAgregar;
}
document.getElementById('form-agregar-pc').addEventListener('submit', async (e) => {
    e.preventDefault();
    const selectElement = document.getElementById('select-id-agregar');
    const nuevoId = selectElement.value;
    if (!nuevoId) {
        alert("Selecciona un código válido.");
        return;
    }
    const optionSeleccionada = selectElement.options[selectElement.selectedIndex];
    const salaSeleccionada = optionSeleccionada.getAttribute('data-sala');
    if (!salaSeleccionada) {
        alert("Selecciona una sala válida.");
        return;
    }
    try {
        const codigo = await crearPuesto(salaSeleccionada, nuevoId);
        alert(`Éxito: Se ha creado el puesto ${codigo} en la Sala ${salaSeleccionada}.`);
        cargarPanel();
    } catch (error) {
        console.error(error);
        alert('Hubo un error al crear el equipo.');
    }
});
const btnRepararCodigos = document.getElementById('btn-reparar-codigos');
if (btnRepararCodigos) {
    btnRepararCodigos.addEventListener('click', async () => {
        btnRepararCodigos.disabled = true;
        try {
            const { equipos, huerfanos } = await repararCodigos();
            if (equipos === 0 && huerfanos === 0) {
                alert('No se encontraron códigos inválidos.');
            } else {
                alert(`Se eliminaron ${equipos} equipos inválidos y ${huerfanos} registros huérfanos.`);
            }
            cargarPanel();
        } catch (error) {
            console.error(error);
            alert('Hubo un error al reparar los códigos.');
        } finally {
            btnRepararCodigos.disabled = false;
        }
    });
}
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
        await fetch(`${API_URL}/computadores/${encodeURIComponent(pcId)}`, {
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