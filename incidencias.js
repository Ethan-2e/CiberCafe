import { apiFetch } from './api-client.js';

async function cargarDatosIniciales() {
  try {
    const puestos = await apiFetch('/computadores');
    const incidencias = await apiFetch('/incidencias');
    if (!puestos || !incidencias) return;

    let opciones = '<option value="">Seleccione un equipo...</option>';
    puestos.forEach(p => {
      opciones += `<option value="${p.id}">${p.id} (Sala ${p.sala}) - Actual: ${p.estado}</option>`;
    });
    document.getElementById('select-puesto').innerHTML = opciones;

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
            <th>Acción</th>
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
          <td>
            <button class="btn btn-danger" onclick="borrarIncidencia('${inc.id}', '${inc.puesto}')">Eliminar</button>
          </td>
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

window.borrarIncidencia = async (idIncidencia, idPuesto) => {
  const confirmar = confirm(`¿Estás seguro de borrar este registro y volver a habilitar el puesto ${idPuesto}?`);
  if (!confirmar) return;

  try {
    await apiFetch(`/incidencias/${idIncidencia}`, { method: 'DELETE' });
    cargarDatosIniciales();
  } catch (error) {
    alert(error.message || 'Hubo un error al eliminar el registro.');
    console.error(error);
  }
};

document.getElementById('form-incidencia').addEventListener('submit', async (e) => {
  e.preventDefault();

  const puesto = document.getElementById('select-puesto').value;
  const descripcion = document.getElementById('input-descripcion').value.trim();

  try {
    await apiFetch('/incidencias', {
      method: 'POST',
      body: JSON.stringify({
        puesto,
        descripcion,
        fecha: new Date().toLocaleString()
      })
    });

    document.getElementById('form-incidencia').reset();
    cargarDatosIniciales();
    alert('Incidencia registrada. El equipo ha sido bloqueado.');
  } catch (error) {
    console.error(error);
    alert(error.message || 'Hubo un error al registrar la incidencia.');
  }
});

document.addEventListener('DOMContentLoaded', cargarDatosIniciales);
