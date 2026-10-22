import { API_URL } from './api.js';

const params = new URLSearchParams(window.location.search);
const equipoId = params.get('id');

async function cargarDetalle() {
    if (!equipoId) {
        document.getElementById('titulo-equipo').innerText = 'Equipo no encontrado';
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/computadores/${equipoId}`);
        const equipo = await respuesta.json();

        document.getElementById('titulo-equipo').innerText = `Puesto ${equipo.id} - Sala ${equipo.sala}`;
        document.getElementById('estado-actual').innerText = equipo.estado.replace('_', ' ').toUpperCase();
        document.getElementById('select-estado').value = equipo.estado;
        
        if (equipo.motivo) {
            document.getElementById('motivo-actual').innerText = equipo.motivo;
        }

    } catch (error) {
        console.error("Error al cargar el detalle:", error);
    }
}

document.getElementById('form-detalle').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nuevoEstado = document.getElementById('select-estado').value;
    const inputMotivo = document.getElementById('input-motivo');
    const mensajeError = document.getElementById('error-motivo');
    const mensajeExito = document.getElementById('mensaje-exito');

    inputMotivo.classList.remove('input-error');
    mensajeError.style.display = 'none';
    mensajeExito.style.display = 'none';

    if (inputMotivo.value.trim() === '') {
        inputMotivo.classList.add('input-error');
        mensajeError.style.display = 'block'; 
        return; 
    }

    try {
        await fetch(`${API_URL}/computadores/${equipoId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                estado: nuevoEstado,
                motivo: inputMotivo.value.trim() 
            })
        });

        mensajeExito.style.display = 'block';
        document.getElementById('estado-actual').innerText = nuevoEstado.replace('_', ' ').toUpperCase();
        document.getElementById('motivo-actual').innerText = inputMotivo.value.trim();
        inputMotivo.value = ''; 

    } catch (error) {
        console.error(error);
        alert('Ocurrió un error al conectar con el servidor.');
    }
});

document.addEventListener("DOMContentLoaded", cargarDetalle);