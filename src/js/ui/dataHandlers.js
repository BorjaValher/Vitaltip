// src/js/ui/dataHandlers.js

import { supabase } from '../config/supabaseClient.js';
import { patientData } from '../config/mockData.js';
import { renderData, renderMedicationsTab, renderHistorialTab } from './render.js';
import { toggleEditProfile, toggleMedicationForm, toggleHistoryView, showCustomDialog, closeSubSetting } from './navigation.js';

// --- PERFIL BÁSICO e IDENTIDAD ---
export async function saveProfile(event) {
    event.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const nombre = document.getElementById('edit-nombre').value;
    const nacimiento = document.getElementById('edit-nacimiento').value;
    const dni = document.getElementById('edit-dni').value;
    const altura = document.getElementById('edit-altura').value;
    const peso = document.getElementById('edit-peso').value;
    const direccion = document.getElementById('edit-direccion').value;
    const sangre = document.getElementById('edit-sangre').value;

    // Actualización directa en la tabla relacional 'perfiles'
    const { error } = await supabase
        .from('perfiles')
        .update({ 
            nombre: nombre, 
            fecha_nacimiento: nacimiento,
            dni: dni, 
            altura: altura, 
            peso: peso, 
            direccion: direccion, 
            grupo_sanguineo: sangre 
        })
        .eq('id', user.id);

    if (error) { 
        showCustomDialog('Error', "No se pudo actualizar el perfil: " + error.message, 'error'); 
        return; 
    }

    // Sincronizamos estado local
    patientData.perfil = { ...patientData.perfil, nombre, nacimiento, dni, altura, peso, direccion, sangre };
    renderData();
    toggleEditProfile(false);
    showCustomDialog('¡Guardado!', 'Tus datos personales se han actualizado correctamente.', 'success');
}

// --- SEGURO MÉDICO (Guardado dentro de la tabla 'perfiles') ---
export async function saveSeguro(event) {
    event.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const compania = document.getElementById('set-seguro-compania').value;
    const poliza = document.getElementById('set-seguro-poliza').value;
    const tipo = document.getElementById('set-seguro-tipo').value;

    const { error } = await supabase
        .from('perfiles')
        .update({ 
            seguro_compania: compania, 
            seguro_poliza: poliza, 
            seguro_tipo: tipo 
        })
        .eq('id', user.id);

    if (error) { 
        showCustomDialog('Error', "No se pudo guardar la póliza: " + error.message, 'error'); 
        return; 
    }

    patientData.seguro = { compania, poliza, tipo };
    renderData();
    closeSubSetting();
    showCustomDialog('¡Guardado!', 'Los datos de tu póliza médica están protegidos.', 'success');
}

// --- CONTACTOS DE EMERGENCIA ---
export async function addContacto(event) {
    event.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const nombre = document.getElementById('new-cont-nombre').value;
    const telefono = document.getElementById('new-cont-tel').value;
    const principal = document.getElementById('new-cont-principal').checked;
    const relacion = principal ? "Principal" : "Secundario";

    if (!patientData.contactos) patientData.contactos = [];
    
    // Si marcamos este como principal, desactivamos el flag principal de los anteriores en la BD
    if (principal) {
        await supabase
            .from('contactos')
            .update({ es_principal: false })
            .eq('user_id', user.id);
            
        patientData.contactos.forEach(c => c.principal = false);
    }
    
    // Inserción limpia en la tabla relacional 'contactos'
    const { data, error } = await supabase
        .from('contactos')
        .insert([{ 
            user_id: user.id,
            nombre: nombre, 
            telefono: telefono, 
            es_principal: principal, 
            relacion: relacion 
        }])
        .select();

    if (error) { 
        showCustomDialog('Error', "Error al añadir contacto: " + error.message, 'error'); 
        return; 
    }

    // Guardamos localmente usando el ID único e incremental devuelto por Postgres
    patientData.contactos.push({ 
        id: data[0].id, 
        nombre, 
        telefono, 
        principal, 
        relacion 
    });

    event.target.reset();
    renderData();
    import('./render.js').then(m => m.renderSettingsLists());
    showCustomDialog('¡Añadido!', 'El contacto de emergencia ha sido registrado.', 'success');
}

export async function deleteContacto(idOrIndex) {
    // Buscamos quirúrgicamente el ID de base de datos
    let idToDelete = idOrIndex;
    let indexInArray = -1;

    if (typeof idOrIndex === 'number' && idOrIndex < patientData.contactos.length && !patientData.contactos.find(c => c.id === idOrIndex)) {
        indexInArray = idOrIndex;
        idToDelete = patientData.contactos[indexInArray].id;
    } else {
        indexInArray = patientData.contactos.findIndex(c => c.id === idOrIndex);
    }

    const userConfirmed = await showCustomDialog(
        'Eliminar Contacto', 
        '¿Estás seguro de que deseas eliminar este contacto de emergencia?', 
        'error', 
        true
    );
    if (!userConfirmed) return;

    const { error } = await supabase
        .from('contactos')
        .delete()
        .eq('id', idToDelete);

    if (error) { 
        showCustomDialog('Error', "No se pudo borrar el contacto: " + error.message, 'error'); 
        return; 
    }

    if (indexInArray !== -1) patientData.contactos.splice(indexInArray, 1);
    
    renderData();
    import('./render.js').then(m => m.renderSettingsLists());
    showCustomDialog('¡Eliminado!', 'Contacto removido con éxito.', 'success');
}

// --- ALERGIAS CRÍTICAS (Modificación del Array de texto TEXT[] en 'perfiles') ---
export async function addAlergia(event) {
    event.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const nuevaAlergia = document.getElementById('new-alergia-input').value.trim();
    if (!nuevaAlergia) return;

    if (!patientData.alergias) patientData.alergias = [];
    const nuevasAlergias = [...patientData.alergias, nuevaAlergia];

    const { error } = await supabase
        .from('perfiles')
        .update({ alergias: nuevasAlergias })
        .eq('id', user.id);

    if (error) { 
        showCustomDialog('Error', "No se pudo guardar la alergia: " + error.message, 'error'); 
        return; 
    }

    patientData.alergias.push(nuevaAlergia);
    event.target.reset();
    renderData();
    import('./render.js').then(m => m.renderSettingsLists());
    showCustomDialog('¡Registrada!', 'La alerta médica de alergia está activa.', 'success');
}

export async function deleteAlergia(index) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const userConfirmed = await showCustomDialog(
        'Eliminar Alergia', 
        '¿Deseas eliminar esta alergia crítica de tu expediente?', 
        'error', 
        true
    );
    if (!userConfirmed) return;

    const nuevasAlergias = [...patientData.alergias];
    nuevasAlergias.splice(index, 1);

    const { error } = await supabase
        .from('perfiles')
        .update({ alergias: nuevasAlergias })
        .eq('id', user.id);

    if (error) { 
        showCustomDialog('Error', "Error al remover alergia: " + error.message, 'error'); 
        return; 
    }

    patientData.alergias.splice(index, 1);
    renderData();
    import('./render.js').then(m => m.renderSettingsLists());
    showCustomDialog('¡Eliminada!', 'Alergia eliminada del historial.', 'success');
}

// --- MEDICACIÓN DIARIA ---
export async function saveMedication(event) {
    event.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const idEdit = document.getElementById('med-id').value; 
    const nombre = document.getElementById('new-med-name').value;
    const dosis = document.getElementById('new-med-dose').value;
    const frecuencia = document.getElementById('new-med-freq').value;
    const turno = document.getElementById('new-med-turno').value;

    if (idEdit) {
        // MODO EDICIÓN relacional
        const { error } = await supabase
            .from('medicamentos')
            .update({ nombre, dosis, frecuencia, turno })
            .eq('id', idEdit);

        if (error) { showCustomDialog('Error', error.message, 'error'); return; }

        const index = patientData.medicacion.findIndex(m => m.id == idEdit);
        if (index !== -1) {
            patientData.medicacion[index] = { ...patientData.medicacion[index], nombre, dosis, frecuencia, turno };
        }
    } else {
        // MODO CREACIÓN relacional
        const { data, error } = await supabase
            .from('medicamentos')
            .insert([{ 
                user_id: user.id, 
                nombre, 
                dosis, 
                frecuencia, 
                turno, 
                color: "slate", 
                icono: "pill" 
            }])
            .select();

        if (error) { showCustomDialog('Error', error.message, 'error'); return; }

        patientData.medicacion.push({
            id: data[0].id, 
            nombre, dosis, frecuencia, turno, 
            color: "slate", icon: "pill"
        });
    }

    renderMedicationsTab(turno);
    toggleMedicationForm(false);
    renderData();
    
    event.target.reset();
    document.getElementById('med-id').value = '';
    showCustomDialog('¡Guardado!', idEdit ? 'Medicamento actualizado.' : 'Nuevo tratamiento guardado.', 'success');
}

export function editMedication(id) {
    const med = patientData.medicacion.find(m => m.id === id);
    if (!med) return;

    document.getElementById('med-id').value = med.id;
    document.getElementById('new-med-name').value = med.nombre;
    document.getElementById('new-med-dose').value = med.dosis;
    document.getElementById('new-med-freq').value = med.frecuencia;
    document.getElementById('new-med-turno').value = med.turno;
    
    document.getElementById('form-med-title').innerText = "Editar Medicación";
    toggleMedicationForm(true);
}

export async function deleteMedication(id) {
    const userConfirmed = await showCustomDialog(
        'Eliminar Medicamento', 
        '¿Estás seguro de que deseas eliminar este medicamento de tu rutina?', 
        'error', 
        true
    );

    if (userConfirmed) {
        const med = patientData.medicacion.find(m => m.id === id);
        const turno = med ? med.turno : 'tarde';

        const { error } = await supabase
            .from('medicamentos')
            .delete()
            .eq('id', id);

        if (error) { showCustomDialog('Error', error.message, 'error'); return; }

        patientData.medicacion = patientData.medicacion.filter(m => m.id !== id);

        renderMedicationsTab(turno);
        renderData();
        showCustomDialog('¡Eliminado!', 'El medicamento ha sido removido.', 'success');
    }
}

// --- CONFIRMAR TOMA (Se guarda automáticamente como evento en la tabla 'historial') ---
export async function takeMedication(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const med = patientData.medicacion.find(m => m.id === id);
    if (!med) return;

    const ahora = new Date();
    const opciones = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' };
    const fechaFormateada = ahora.toLocaleDateString('es-ES', opciones);

    // Guardamos directamente en la nueva tabla dedicada
    const { error } = await supabase
        .from('historial_tomas')
        .insert([{
            user_id: user.id,
            nombre: med.nombre,
            dosis: med.dosis,
            fecha_formateada: fechaFormateada,
            timestamp: ahora.getTime()
        }]);

    if (error) { 
        showCustomDialog('Error', "No se pudo registrar la toma: " + error.message, 'error'); 
        return; 
    }

    if (!patientData.historial_medicacion) patientData.historial_medicacion = [];
    
    patientData.historial_medicacion.unshift({
        id: Date.now(),
        nombre: med.nombre,
        dosis: med.dosis,
        timestamp: ahora.getTime(),
        fechaFormateada: fechaFormateada
    });

    renderMedicationsTab(med.turno);
    renderData();
    showCustomDialog('¡Toma Confirmada!', `Dosis de ${med.nombre} registrada correctamente.`, 'success');
}

// --- HISTORIAL CLÍNICO / CITAS ---
export async function saveHistoryEvent(event) {
    event.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const idEdit = document.getElementById('hist-id').value; 
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
        // MODO EDICIÓN relacional en la tabla 'historial'
        const { error } = await supabase
            .from('historial')
            .update({
                tipo: tipo,
                titulo: titulo,
                lugar: lugar,
                medico: medico,
                fecha_evento: fecha,
                hora_evento: hora || null,
                descripcion: desc
            })
            .eq('id', idEdit);

        if (error) { showCustomDialog('Error', error.message, 'error'); return; }

        const index = patientData.historial.findIndex(h => h.id == idEdit);
        if (index !== -1) {
            patientData.historial[index] = {
                ...patientData.historial[index],
                tipo, titulo, lugar, medico, desc, hora,
                fechaRaw: fecha, fechaCompleta: fechaFormat, mesAnio
            };
        }
    } else {
        // MODO CREACIÓN relacional
        const { data, error } = await supabase
            .from('historial')
            .insert([{
                user_id: user.id,
                tipo: tipo,
                titulo: titulo,
                lugar: lugar,
                medico: medico,
                fecha_evento: fecha,
                hora_evento: hora || null,
                descripcion: desc,
                especialidad: "General"
            }])
            .select();

        if (error) { showCustomDialog('Error', error.message, 'error'); return; }

        patientData.historial.unshift({
            id: data[0].id,
            mesAnio, fechaRaw: fecha, fechaCompleta: fechaFormat, hora,
            tipo, titulo, lugar, medico, desc, especialidad: "General"
        });
    }

    renderHistorialTab();
    toggleHistoryView('list');
    
    event.target.reset();
    document.getElementById('hist-id').value = "";
    showCustomDialog('¡Guardado!', idEdit ? 'Evento médico actualizado.' : 'Registro clínico archivado correctamente.', 'success');
}

export async function deleteHistoryEvent(id) {
    const userConfirmed = await showCustomDialog(
        'Eliminar Registro', 
        '¿Estás seguro de que deseas eliminar este registro médico permanentemente?', 
        'error', 
        true
    );

    if (userConfirmed) {
        const { error } = await supabase
            .from('historial')
            .delete()
            .eq('id', id);

        if (error) {
            showCustomDialog('Error', "Error al eliminar en la nube: " + error.message, 'error');
            return;
        }
        
        patientData.historial = patientData.historial.filter(h => h.id !== id);
        
        renderHistorialTab();
        toggleHistoryView('list'); 
        showCustomDialog('¡Eliminado!', 'El registro se ha borrado correctamente.', 'success');
    }
}

export function editHistoryEvent(id) {
    const record = patientData.historial.find(h => h.id === id);
    if (!record) return;

    document.getElementById('hist-id').value = record.id; 
    document.getElementById('hist-tipo').value = record.tipo;
    document.getElementById('hist-titulo').value = record.titulo;
    document.getElementById('hist-lugar').value = record.lugar;
    document.getElementById('hist-medico').value = record.medico && record.medico !== "No especificado" ? record.medico : '';
    document.getElementById('hist-fecha').value = record.fechaRaw || ''; 
    document.getElementById('hist-hora').value = record.hora || '';
    document.getElementById('hist-desc').value = record.desc || '';

    document.getElementById('form-hist-title').innerText = "Editar Registro";
    toggleHistoryView('form');
}