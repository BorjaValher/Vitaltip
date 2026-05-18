// src/js/ui/dataHandlers.js

import { supabase } from '../config/supabaseClient.js';
import { patientData } from '../config/mockData.js';
import { renderData, renderMedicationsTab, renderHistorialTab } from './render.js';
import { toggleEditProfile, toggleMedicationForm, toggleHistoryView } from './navigation.js';

// --- PERFIL ---
// --- PERFIL BÁSICO ---
export async function saveProfile(event) {
    event.preventDefault();

    const nombre = document.getElementById('edit-nombre').value;
    const dni = document.getElementById('edit-dni').value;
    const altura = document.getElementById('edit-altura').value;
    const peso = document.getElementById('edit-peso').value;
    const direccion = document.getElementById('edit-direccion').value;
    const sangre = document.getElementById('edit-sangre').value;

    const { error } = await supabase.auth.updateUser({
        data: { full_name: nombre, dni: dni, altura: altura, peso: peso, direccion: direccion, blood_type: sangre }
    });

    if (error) { alert("Error: " + error.message); return; }

    patientData.perfil = { ...patientData.perfil, nombre, dni, altura, peso, direccion, sangre };
    renderData();
    toggleEditProfile(false);
}

// --- SEGURO MÉDICO ---
export async function saveSeguro(event) {
    event.preventDefault();
    const compania = document.getElementById('set-seguro-compania').value;
    const poliza = document.getElementById('set-seguro-poliza').value;
    const tipo = document.getElementById('set-seguro-tipo').value;

    const { error } = await supabase.auth.updateUser({
        data: { seguro_compania: compania, seguro_poliza: poliza, seguro_tipo: tipo }
    });
    if (error) { alert("Error: " + error.message); return; }

    patientData.seguro = { compania, poliza, tipo };
    renderData();
    closeSubSetting();
}

// --- CONTACTOS ---
export async function addContacto(event) {
    event.preventDefault();
    const nombre = document.getElementById('new-cont-nombre').value;
    const telefono = document.getElementById('new-cont-tel').value;
    const principal = document.getElementById('new-cont-principal').checked;

    if (!patientData.contactos) patientData.contactos = [];
    
    // Si marcamos este como principal, quitamos el principal a los demás
    if (principal) {
        patientData.contactos.forEach(c => c.principal = false);
    }
    
    patientData.contactos.push({ nombre, telefono, principal, relacion: principal ? "Principal" : "Secundario" });

    const { error } = await supabase.auth.updateUser({ data: { contactos: patientData.contactos } });
    if (error) { alert("Error: " + error.message); return; }

    event.target.reset();
    renderData();
    import('./render.js').then(m => m.renderSettingsLists()); // Refresca la sublista
}

export async function deleteContacto(index) {
    patientData.contactos.splice(index, 1);
    const { error } = await supabase.auth.updateUser({ data: { contactos: patientData.contactos } });
    if (error) { alert("Error: " + error.message); return; }
    
    renderData();
    import('./render.js').then(m => m.renderSettingsLists());
}

// --- ALERGIAS ---
export async function addAlergia(event) {
    event.preventDefault();
    const nuevaAlergia = document.getElementById('new-alergia-input').value.trim();
    if (!nuevaAlergia) return;

    if (!patientData.alergias) patientData.alergias = [];
    patientData.alergias.push(nuevaAlergia);

    const { error } = await supabase.auth.updateUser({ data: { allergies: patientData.alergias } });
    if (error) { alert("Error: " + error.message); return; }

    event.target.reset();
    renderData();
    import('./render.js').then(m => m.renderSettingsLists());
}

export async function deleteAlergia(index) {
    patientData.alergias.splice(index, 1);
    const { error } = await supabase.auth.updateUser({ data: { allergies: patientData.alergias } });
    if (error) { alert("Error: " + error.message); return; }
    
    renderData();
    import('./render.js').then(m => m.renderSettingsLists());
}

// --- MEDICACIÓN ---
export async function saveMedication(event) {
    event.preventDefault();

    const nombre = document.getElementById('new-med-name').value;
    const dosis = document.getElementById('new-med-dose').value;
    const frecuencia = document.getElementById('new-med-freq').value;
    const turno = document.getElementById('new-med-turno').value;

    const newMed = {
        id: Date.now(), 
        nombre: nombre,
        dosis: dosis,
        frecuencia: frecuencia,
        turno: turno,
        proxima: "PENDIENTE",
        color: "slate", 
        icon: "pill"
    };

    patientData.medicacion.push(newMed);

    const { error } = await supabase.auth.updateUser({
        data: { medicacion: patientData.medicacion }
    });

    if (error) {
        alert("Error al guardar medicamento en la nube: " + error.message);
        return;
    }

    renderMedicationsTab(turno);
    if (window.lucide) window.lucide.createIcons();
    
    toggleMedicationForm(false);
    event.target.reset();
    
    
}

// --- HISTORIAL MÉDICO ---
export async function saveHistoryEvent(event) {
    event.preventDefault();

    const idEdit = document.getElementById('hist-id').value; // Si tiene algo, estamos editando
    
    const tipo = document.getElementById('hist-tipo').value;
    const titulo = document.getElementById('hist-titulo').value;
    const lugar = document.getElementById('hist-lugar').value;
    const medico = document.getElementById('hist-medico').value || "No especificado";
    const fecha = document.getElementById('hist-fecha').value;
    const hora = document.getElementById('hist-hora').value;
    const desc = document.getElementById('hist-desc').value;

    const dateObj = new Date(fecha);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormat = dateObj.toLocaleDateString('es-ES', opciones);
    const mesAnio = `${dateObj.toLocaleString('es-ES', { month: 'long' })} ${dateObj.getFullYear()}`.toUpperCase();

    if (idEdit) {
        // MODO EDICIÓN: Buscamos su posición y lo actualizamos
        const index = patientData.historial.findIndex(h => h.id == idEdit);
        if (index !== -1) {
            patientData.historial[index] = {
                ...patientData.historial[index],
                tipo, titulo, lugar, medico, desc, hora,
                fechaRaw: fecha, // Guardamos la fecha cruda para que el formulario la entienda al editar
                fechaCompleta: fechaFormat,
                mesAnio: mesAnio
            };
        }
    } else {
        // MODO CREACIÓN: Creamos uno nuevo
        const nuevoRegistro = {
            id: Date.now(),
            mesAnio: mesAnio,
            fechaRaw: fecha, // Guardamos la fecha cruda
            fechaCompleta: fechaFormat,
            hora: hora,
            tipo: tipo,
            titulo: titulo,
            lugar: lugar,
            medico: medico,
            desc: desc,
            especialidad: "General" 
        };
        patientData.historial.unshift(nuevoRegistro);
    }

    // Sincronizamos con Supabase
    const { error } = await supabase.auth.updateUser({
        data: { historial: patientData.historial }
    });

    if (error) {
        alert("Error al guardar en el historial en la nube: " + error.message);
        return;
    }

    renderHistorialTab();
    toggleHistoryView('list');
    
    // Limpiamos la basura por seguridad
    event.target.reset();
    document.getElementById('hist-id').value = "";
    
    alert(idEdit ? 'Registro actualizado con éxito.' : 'Registro añadido al historial de forma segura.');
}

export async function deleteHistoryEvent(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este registro permanentemente?")) {
        patientData.historial = patientData.historial.filter(h => h.id !== id);
        
        const { error } = await supabase.auth.updateUser({
            data: { historial: patientData.historial }
        });

        if (error) {
            alert("Error al eliminar en la nube: " + error.message);
            return;
        }
        
        renderHistorialTab();
        toggleHistoryView('list'); 
        alert("Registro eliminado correctamente.");
    }
}

export function editHistoryEvent(id) {
    // 1. Buscamos el registro en los datos locales
    const record = patientData.historial.find(h => h.id === id);
    if (!record) return;

    // 2. Rellenamos el formulario con sus datos
    document.getElementById('hist-id').value = record.id; // ¡Clave para saber que estamos editando!
    document.getElementById('hist-tipo').value = record.tipo;
    document.getElementById('hist-titulo').value = record.titulo;
    document.getElementById('hist-lugar').value = record.lugar;
    document.getElementById('hist-medico').value = record.medico && record.medico !== "No especificado" ? record.medico : '';
    document.getElementById('hist-fecha').value = record.fechaRaw || ''; 
    document.getElementById('hist-hora').value = record.hora || '';
    document.getElementById('hist-desc').value = record.desc || '';

    // 3. Cambiamos el título y abrimos la vista
    document.getElementById('form-hist-title').innerText = "Editar Registro";
    toggleHistoryView('form');
}