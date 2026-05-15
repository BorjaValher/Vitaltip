import { patientData } from '../config/mockData.js';
import { renderData } from './render.js';
import { toggleEditProfile } from './navigation.js';

export function saveProfile(event) {
    event.preventDefault();

    patientData.perfil.nombre = document.getElementById('edit-nombre').value;
    patientData.perfil.altura = document.getElementById('edit-altura').value;
    patientData.perfil.peso = document.getElementById('edit-peso').value;
    patientData.perfil.direccion = document.getElementById('edit-direccion').value;
    patientData.perfil.sangre = document.getElementById('edit-sangre').value;

    renderData();
    if (window.lucide) window.lucide.createIcons();
    toggleEditProfile(false);
    alert('Perfil actualizado correctamente.');
}

export function addHistorial() {
    const fecha = prompt("Introduce la fecha del evento (por ejemplo, Marzo 2023):");
    const evento = prompt("Introduce el nombre del evento (por ejemplo, Consulta médica):");
    const lugar = prompt("Introduce el lugar del evento (por ejemplo, Hospital General):");
    const desc = prompt("Introduce una descripción breve del evento:");

    if (fecha && evento && lugar && desc) {
        patientData.historial.push({ fecha, evento, lugar, desc });
        renderData();
        if (window.lucide) window.lucide.createIcons();
        alert("Evento añadido correctamente.");
    } else {
        alert("Todos los campos son obligatorios.");
    }
}

export function deleteHistorial() {
    if (patientData.historial.length > 0) {
        if (confirm("¿Estás seguro de que deseas eliminar el último evento del historial?")) {
            patientData.historial.pop();
            renderData();
            if (window.lucide) window.lucide.createIcons();
            alert("Último evento eliminado correctamente.");
        }
    } else {
        alert("No hay eventos en el historial para eliminar.");
    }
}