
const API_URL = 'https://100.51.163.177:8080'; 

async function cargarSalas() {
    const respuesta = await fetch(`${API_URL}/computadores`);
    const computadores = await respuesta.json();

}

document.addEventListener('DOMContentLoaded', cargarSalas);

//Dejemosla pa la tercer entrega mejor, no lo pide la rúbrica nueva