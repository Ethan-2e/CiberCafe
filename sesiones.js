import { API_URL } from './api.js';
async function cargarSesiones() {
    try {
        const respuesta = await fetch(`${API_URL}/sesiones`);
        const sesiones = await respuesta.json();

        if (sesiones.length === 0) {
            document.getElementById('sesiones-content').innerHTML = '<p>No hay sesiones activas en este momento.</p>';
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Puesto</th>
                        <th>Cliente</th>
                        <th>Inicio</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
        `;

        sesiones.forEach(s => {
            html += `
                <tr>
                    <td><strong>${s.puesto}</strong></td>
                    <td>${s.cliente}</td>
                    <td>${s.inicio}</td>
                    <td>
                        <button class="btn btn-danger" onclick="finalizarSesion('${s.id}', '${s.puesto}')">
                            Finalizar
                        </button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        document.getElementById('sesiones-content').innerHTML = html;

    } catch (error) {
        console.error("Error:", error);
        document.getElementById('sesiones-content').innerHTML = '<p style="color:red">Error al cargar las sesiones.</p>';
    }
}

window.finalizarSesion = async (idSesion, idPuesto) => {
    const confirmar = confirm(`¿Estás seguro de finalizar la sesión del puesto ${idPuesto}?`);
    if (!confirmar) return;

    try {
        await fetch(`${API_URL}/sesiones/${idSesion}`, {
            method: 'DELETE'
        });

        await fetch(`${API_URL}/computadores/${idPuesto}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'disponible' })
        });

        cargarSesiones();
        
    } catch (error) {
        alert("Hubo un error al finalizar la sesión");
        console.error(error);
    }
};

document.addEventListener("DOMContentLoaded", cargarSesiones);