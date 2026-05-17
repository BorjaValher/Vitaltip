import { patientData } from '../config/mockData.js';
import { renderData, renderMedicationsTab, renderHistorialTab } from './render.js';
import { toggleEditProfile, toggleMedicationForm, toggleHistoryView } from './navigation.js';

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

// --- MEDICACIÓN ---
export function saveMedication(event) {
    event.preventDefault();

    const nombre = document.getElementById('new-med-name').value;
    const dosis = document.getElementById('new-med-dose').value;
    const frecuencia = document.getElementById('new-med-freq').value;
    const turno = document.getElementById('new-med-turno').value;

    const newMed = {
        nombre: nombre,
        dosis: dosis,
        frecuencia: frecuencia,
        turno: turno,
        proxima: "PENDIENTE",
        color: "slate", 
        icon: "pill"
    };

    patientData.medicacion.push(newMed);

    renderMedicationsTab(turno);
    if (window.lucide) window.lucide.createIcons();
    
    toggleMedicationForm(false);
    event.target.reset();
    
    alert('Medicamento añadido con éxito');
}



// --- HISTORIAL MÉDICO ---
export function saveHistoryEvent(event) {
    event.preventDefault();

    const tipo = document.getElementById('hist-tipo').value;
    const titulo = document.getElementById('hist-titulo').value;
    const lugar = document.getElementById('hist-lugar').value;
    const fecha = document.getElementById('hist-fecha').value;
    const hora = document.getElementById('hist-hora').value;
    const desc = document.getElementById('hist-desc').value;

    // Formatear la fecha para el diseño
    const dateObj = new Date(fecha);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormat = dateObj.toLocaleDateString('es-ES', opciones);
    const mesAnio = `${dateObj.toLocaleString('es-ES', { month: 'long' })} ${dateObj.getFullYear()}`.toUpperCase();

    const nuevoRegistro = {
        id: Date.now(), // ID único temporal
        mesAnio: mesAnio,
        fechaCompleta: fechaFormat,
        hora: hora,
        tipo: tipo,
        titulo: titulo,
        lugar: lugar,
        desc: desc,
        especialidad: "General", 
        medico: "No especificado"
    };

    // Insertar al principio para que salga el más reciente primero
    patientData.historial.unshift(nuevoRegistro);

    renderHistorialTab();
    toggleHistoryView('list');
    event.target.reset(); // Limpiar el formulario
}

export function deleteHistoryEvent(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este registro permanentemente?")) {
        // Filtrar el array para quitar el elemento con ese ID
        patientData.historial = patientData.historial.filter(h => h.id !== id);
        
        renderHistorialTab();
        toggleHistoryView('list'); // Volver a la lista tras borrar
        alert("Registro eliminado correctamente.");
    }
}