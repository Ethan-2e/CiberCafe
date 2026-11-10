import { apiFetch } from './api-client.js';

async function cargarSesiones() {
  try {
    const sesiones = await apiFetch('/sesiones');
    if (!sesiones) return;

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
    console.error('Error:', error);
    document.getElementById('sesiones-content').innerHTML = '<p style="color:red">Error al cargar las sesiones.</p>';
  }
}

window.finalizarSesion = async (idSesion, idPuesto) => {
  const confirmar = confirm(`¿Estás seguro de finalizar la sesión del puesto ${idPuesto}?`);
  if (!confirmar) return;

  try {
    await apiFetch(`/sesiones/${idSesion}`, { method: 'DELETE' });
    cargarSesiones();
  } catch (error) {
    alert(error.message || 'Hubo un error al finalizar la sesión');
    console.error(error);
  }
};

document.addEventListener('DOMContentLoaded', cargarSesiones);
