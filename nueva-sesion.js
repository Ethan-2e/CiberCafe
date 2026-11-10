import { apiFetch } from './api-client.js';

async function cargarPuestosDisponibles() {
  try {
    const puestosLibres = await apiFetch('/computadores?estado=disponible');
    if (!puestosLibres) return;

    let opciones = '<option value="">Seleccione un equipo disponible...</option>';

    if (puestosLibres.length === 0) {
      opciones = '<option value="">No hay equipos disponibles en este momento</option>';
    } else {
      puestosLibres.forEach(p => {
        opciones += `<option value="${p.id}">${p.id} (Sala ${p.sala})</option>`;
      });
    }

    document.getElementById('select-puesto').innerHTML = opciones;
  } catch (error) {
    console.error('Error al cargar equipos:', error);
    document.getElementById('select-puesto').innerHTML = '<option value="">Error al cargar equipos</option>';
  }
}

document.getElementById('form-sesion').addEventListener('submit', async (e) => {
  e.preventDefault();

  const cliente = document.getElementById('input-cliente').value.trim();
  const puesto = document.getElementById('select-puesto').value;

  if (!puesto) {
    alert('Selecciona un equipo disponible.');
    return;
  }

  const ahora = new Date();
  const horaInicio = ahora.getHours().toString().padStart(2, '0') + ':' + ahora.getMinutes().toString().padStart(2, '0');

  try {
    await apiFetch('/sesiones', {
      method: 'POST',
      body: JSON.stringify({ puesto, cliente, inicio: horaInicio })
    });

    alert(`Sesión iniciada correctamente para ${cliente} en el puesto ${puesto}`);
    window.location.href = 'sesiones.html';
  } catch (error) {
    console.error(error);
    alert(error.message || 'Hubo un error al iniciar la sesión.');
  }
});

document.addEventListener('DOMContentLoaded', cargarPuestosDisponibles);
