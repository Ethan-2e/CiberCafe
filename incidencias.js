import { API_URL } from './api.js';

async function cargarDatosIniciales() {
    try {
        const resPuestos = await fetch(`${API_URL}/computadores`);
        const puestos = await resPuestos.json();
        
        let opciones = '<option value="">Seleccione un equipo...</option>';
        puestos.forEach(p => {
            opciones += `<option value="${p.id}">${p.id} (Sala ${p.sala}) - Actual: ${p.estado}</option>`;
        });
        document.getElementById('select-puesto').innerHTML = opciones;

        const resIncidencias = await fetch(`${API_URL}/incidencias`);
        const incidencias = await resIncidencias.json();

        if (incidencias.length === 0) {
            document.getElementById('lista-incidencias').innerHTML = '<p>No hay incidencias registradas.</p>';
            return;
        }

        let html = `
            <h3 style="margin-top: 0;">Historial de fallas</h3>
            <table>
                <thead>
                    <tr>
                        <th>Puesto</th>
                        <th>Descripción</th>
                        <th>Fecha/Hora</th>
                    </tr>
                </thead>
                <tbody>
        `;
        incidencias.forEach(inc => {
            html += `
                <tr>
                    <td><strong>${inc.puesto}</strong></td>
                    <td>${inc.descripcion}</td>
                    <td>${inc.fecha}</td>
                </tr>
            `;
        });
        html += '</tbody></table>';
        document.getElementById('lista-incidencias').innerHTML = html;

    } catch (error) {
        console.error(error);
        document.getElementById('lista-incidencias').innerHTML = '<p style="color:red">Error cargando datos.</p>';
    }
}

document.getElementById('form-incidencia').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const puesto = document.getElementById('select-puesto').value;
    const descripcion = document.getElementById('input-descripcion').value;
    
    const nuevaIncidencia = {
        puesto: puesto,
        descripcion: descripcion,
        fecha: new Date().toLocaleString()
    };

    try {
        await fetch(`${API_URL}/incidencias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaIncidencia)
        });

        await fetch(`${API_URL}/computadores/${puesto}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'falla' })
        });

        document.getElementById('form-incidencia').reset();
        cargarDatosIniciales();
        alert('Incidencia registrada. El equipo ha sido bloqueado.');

    } catch (error) {
        console.error(error);
        alert('Hubo un error al registrar la incidencia.');
    }
});

document.addEventListener("DOMContentLoaded", cargarDatosIniciales);