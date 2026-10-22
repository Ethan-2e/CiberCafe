import { API_URL } from './api.js';

async function cargarPuestosDisponibles() {
    try {
        const respuesta = await fetch(`${API_URL}/computadores?estado=disponible`);
        const puestosLibres = await respuesta.json();
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
        console.error("Error al cargar equipos:", error);
        document.getElementById('select-puesto').innerHTML = '<option value="">Error al cargar equipos</option>';
    }
}
document.getElementById('form-sesion').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const cliente = document.getElementById('input-cliente').value;
    const puesto = document.getElementById('select-puesto').value;
    
    const ahora = new Date();
    const horaInicio = ahora.getHours().toString().padStart(2, '0') + ':' + ahora.getMinutes().toString().padStart(2, '0');
    
    const nuevaSesion = {
        puesto: puesto,
        cliente: cliente,
        inicio: horaInicio
    };

    try {
        await fetch(`${API_URL}/sesiones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaSesion)
        });

        await fetch(`${API_URL}/computadores/${puesto}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'en_uso' })
        });

        alert(`Sesión iniciada correctamente para ${cliente} en el puesto ${puesto}`);
        
        window.location.href = 'sesiones.html';

    } catch (error) {
        console.error(error);
        alert('Hubo un error al iniciar la sesión.');
    }
});

document.addEventListener("DOMContentLoaded", cargarPuestosDisponibles);