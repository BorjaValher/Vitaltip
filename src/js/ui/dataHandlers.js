import { patientData } from '../config/mockData.js';
import { renderData, renderMedicationsTab, renderHistorialTab } from './render.js';
import { toggleEditProfile, toggleMedicationForm, toggleHistoryView } from './navigation.js';
import { supabase } from '../config/supabaseClient.js';


export async function saveProfile(event) {
    event.preventDefault();

    // 1. Capturar todos los campos del cuestionario
    const nombre = document.getElementById('edit-nombre').value;
    const dni = document.getElementById('edit-dni').value;
    const altura = document.getElementById('edit-altura').value;
    const peso = document.getElementById('edit-peso').value;
    const direccion = document.getElementById('edit-direccion').value;
    const sangre = document.getElementById('edit-sangre').value;

    const seguro_compania = document.getElementById('edit-seguro-compania').value;
    const seguro_poliza = document.getElementById('edit-seguro-poliza').value;
    const seguro_tipo = document.getElementById('edit-seguro-tipo').value;

    const contactos = [];
    const c1Nombre = document.getElementById('edit-contacto1-nombre').value;
    const c1Tel = document.getElementById('edit-contacto1-tel').value;
    if (c1Nombre || c1Tel) {
        contactos.push({ nombre: c1Nombre, telefono: c1Tel, relacion: "Principal" });
    }

    const c2Nombre = document.getElementById('edit-contacto2-nombre').value;
    const c2Tel = document.getElementById('edit-contacto2-tel').value;
    if (c2Nombre || c2Tel) {
        contactos.push({ nombre: c2Nombre, telefono: c2Tel, relacion: "Secundario" });
    }

    // 2. GUARDAR EN LA NUBE (Supabase Auth Metadata)
    const { data, error } = await supabase.auth.updateUser({
        data: {
            full_name: nombre,
            dni: dni,
            altura: altura,
            peso: peso,
            direccion: direccion,
            blood_type: sangre,
            seguro_compania: seguro_compania,
            seguro_poliza: seguro_poliza,
            seguro_tipo: seguro_tipo,
            contactos: contactos
        }
    });

    if (error) {
        alert("Error al sincronizar con Supabase: " + error.message);
        return;
    }

    // 3. Si la nube responde OK, actualizamos nuestro objeto global local
    patientData.perfil = { nombre, dni, altura, peso, direccion, sangre };
    patientData.seguro = { compania: seguro_compania, poliza: seguro_poliza, tipo: seguro_tipo };
    patientData.contactos = contactos;

    // 4. Refrescar los componentes visuales e iconos
    renderData();
    if (window.lucide) window.lucide.createIcons();
    
    toggleEditProfile(false);
    alert('Perfil guardado con éxito y sincronizado en la nube.');
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