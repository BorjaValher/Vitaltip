// src/js/core/authManager.js

import { supabase } from '../config/supabaseClient.js';
import { renderData, renderMedicationsTab, renderHistorialTab } from '../ui/render.js';
import { patientData } from '../config/mockData.js'; 
import { showCustomDialog } from '../ui/navigation.js';

// --- TABS Y VISTAS DE AUTH ---
export function toggleAuthTab(tab) {
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const btnLogin = document.getElementById('tab-login');
    const btnRegister = document.getElementById('tab-register');

    if (tab === 'login') {
        formLogin.classList.remove('hidden');
        formRegister.classList.add('hidden');
        btnLogin.className = "flex-1 py-2 rounded-lg bg-white text-slate-800 font-bold text-sm shadow-sm transition-all";
        btnRegister.className = "flex-1 py-2 rounded-lg text-slate-500 font-bold text-sm transition-all";
    } else {
        formLogin.classList.add('hidden');
        formRegister.classList.remove('hidden');
        btnRegister.className = "flex-1 py-2 rounded-lg bg-white text-slate-800 font-bold text-sm shadow-sm transition-all";
        btnLogin.className = "flex-1 py-2 rounded-lg text-slate-500 font-bold text-sm transition-all";
    }
}

// --- LOGIN (INICIO DE SESIÓN) ---
export async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value;
    const btn = event.target.querySelector('button[type="submit"]');

    btn.disabled = true;
    btn.innerText = "Accediendo...";

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });

    if (error) {
        showCustomDialog('Error de Acceso', "Credenciales incorrectas: " + error.message, 'error');
        btn.disabled = false;
        btn.innerText = "Entrar de forma segura";
        return;
    }
}

// --- REGISTER (REGISTRO RELACIONAL) ---
export async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-pass').value;
    const confirmPassword = document.getElementById('reg-pass-confirm').value;
    const blood = document.getElementById('reg-blood').value;
    const allergies = document.getElementById('reg-allergies').value.trim();
    
    const btn = event.target.querySelector('button[type="submit"]');

    // 1. VALIDACIÓN: Comprobar que las contraseñas coinciden
    if (password !== confirmPassword) {
        showCustomDialog('Contraseñas distintas', 'Las contraseñas introducidas no coinciden. Por favor, verifícalas.', 'warning');
        document.getElementById('reg-pass').value = '';
        document.getElementById('reg-pass-confirm').value = '';
        document.getElementById('reg-pass').focus();
        return;
    }

    btn.disabled = true;
    btn.innerText = "Creando cuenta...";

    // 2. Crear el usuario en Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
        showCustomDialog('Error de Registro', authError.message, 'error');
        btn.disabled = false;
        btn.innerText = "Registrar nueva cuenta";
        return;
    }

    const user = data.user;

    if (user) {
      
        const { error: profileError } = await supabase
            .from('perfiles')
            .insert([{
                id: user.id, // Vinculado al UUID de autenticación
                nombre: name,
                dni: '--',
                fecha_nacimiento: '',
                grupo_sanguineo: blood,
                peso: '--',
                altura: '--',
                direccion: 'No especificada',
                alergias: allergies ? [allergies] : [],
                seguro_compania: 'Ninguno',
                seguro_poliza: '--',
                seguro_tipo: '--'
            }]);

        if (profileError) {
            showCustomDialog('Error Perfil', "Usuario creado pero hubo un problema al inicializar tus tablas de datos: " + profileError.message, 'error');
            btn.disabled = false;
            btn.innerText = "Registrar nueva cuenta";
            return;
        }

        patientData.perfil = {
            nombre: name,
            sangre: blood,
            dni: '',
            altura: '',
            peso: '',
            direccion: '',
            nacimiento: ''
        };
        patientData.alergias = allergies ? [allergies] : [];
        patientData.contactos = [];
        patientData.medicacion = [];
        patientData.historial = [];
        patientData.historial_medicacion = [];

        // Forzamos el renderizado manual instantáneo de las vistas
        renderData();
        renderMedicationsTab('tarde');
        renderHistorialTab();
        // =========================================================================

        showCustomDialog('¡Cuenta creada!', 'Tu expediente digital ha sido inicializado con éxito.', 'success');
        toggleAuthTab('login');
        event.target.reset();
    }

    btn.disabled = false;
    btn.innerText = "Registrar nueva cuenta";
}

// --- LOGOUT (CERRAR SESIÓN) ---
export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        showCustomDialog('Error', "No se pudo cerrar la sesión.", 'error');
        return;
    }
    
    document.getElementById('app-container').classList.add('hidden');
    document.getElementById('auth-container').classList.remove('hidden');
    
    document.getElementById('form-login').reset();
    document.getElementById('form-register').reset();
}

// --- CONTROLADOR DE SESIÓN ACTIVA ---
export function checkSession() {
    supabase.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
            initAppWithUser(session.user);
        } else {
            document.getElementById('app-container').classList.add('hidden');
            document.getElementById('auth-container').classList.remove('hidden');
        }
    });
}

// --- INICIALIZADOR RELACIONAL ---
async function initAppWithUser(user) {
    try {
        // Añadimos la quinta consulta para traernos las tomas de medicamentos
        const [profileRes, contactosRes, medicamentosRes, historialRes, tomasRes] = await Promise.all([
            supabase.from('perfiles').select('*').eq('id', user.id).maybeSingle(),
            supabase.from('contactos').select('*').eq('user_id', user.id),
            supabase.from('medicamentos').select('*').eq('user_id', user.id),
            supabase.from('historial').select('*').eq('user_id', user.id),
            supabase.from('historial_tomas').select('*').eq('user_id', user.id) // <-- NUEVA
        ]);

        // 1. Mapear 'perfiles'
        if (profileRes.data) {
            const p = profileRes.data;
            patientData.perfil = {
                nombre: p.nombre || "Usuario",
                sangre: p.grupo_sanguineo || "--",
                dni: p.dni || "--",
                altura: p.altura || "--",
                peso: p.peso || "--",
                direccion: p.direccion || "No especificada",
                nacimiento: p.fecha_nacimiento || ""
            };
            patientData.alergias = p.alergias || [];
            patientData.seguro = {
                compania: p.seguro_compania || "Ninguno",
                poliza: p.seguro_poliza || "--",
                tipo: p.seguro_tipo || "--"
            };
        }

        // 2. Mapear 'contactos'
        patientData.contactos = (contactosRes.data || []).map(c => ({
            id: c.id,
            nombre: c.nombre,
            telefono: c.telefono,
            principal: c.es_principal,
            relacion: c.relacion
        }));

        // 3. Mapear 'medicamentos'
        patientData.medicacion = (medicamentosRes.data || []).map(m => ({
            id: m.id,
            nombre: m.nombre,
            dosis: m.dosis,
            frecuencia: m.frecuencia,
            turno: m.turno,
            color: m.color || "slate",
            icon: m.icono || "pill"
        }));

        // 4. Mapear 'historial' (Consultas y citas)
        patientData.historial = (historialRes.data || []).map(h => {
            const dateObj = new Date(h.fecha_evento);
            const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
            const fechaFormat = dateObj.toLocaleDateString('es-ES', opciones);
            const mesAnio = `${dateObj.toLocaleString('es-ES', { month: 'long' })} ${dateObj.getFullYear()}`.toUpperCase();

            return {
                id: h.id,
                tipo: h.tipo,
                titulo: h.titulo,
                lugar: h.lugar,
                medico: h.medico || "No especificado",
                fechaRaw: h.fecha_evento,
                hora: h.hora_evento ? h.hora_evento.substring(0, 5) : '',
                desc: h.descripcion || '',
                fechaCompleta: fechaFormat,
                mesAnio: mesAnio
            };
        });

        // 5. Mapear el nuevo Historial de Tomas independiente
        patientData.historial_medicacion = (tomasRes.data || []).map(t => ({
            id: t.id,
            nombre: t.nombre,
            dosis: t.dosis,
            timestamp: t.timestamp,
            fechaFormateada: t.fecha_formateada
        }));

    } catch (err) {
        console.error("Error estructurando datos relacionales:", err);
    }

    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');

    renderData();
    renderMedicationsTab('tarde');
    renderHistorialTab();
}

// --- ELIMINAR CUENTA ---
export async function handleDeleteAccount() {
    const confirm = await showCustomDialog(
        'Dar de Baja', 
        '¿Confirmas que deseas eliminar permanentemente tu expediente de salud digital? Esta acción destruirá todos tus registros médicos de inmediato.', 
        'error', 
        true
    );
    
    if (!confirm) return;

    const { error } = await supabase.rpc('delete_user_account');

    if (error) {
        showCustomDialog('Error', "No se pudo procesar la baja: " + error.message, 'error');
    } else {
        showCustomDialog('Expediente Eliminado', 'Tu información ha sido completamente borrada de nuestros servidores.', 'success');
        logout();
    }
}

// --- GESTIÓN DE CONTRASEÑAS ---
export function toggleForgotPassword(show) {
    const formLogin = document.getElementById('form-login');
    const formForgot = document.getElementById('form-forgot');
    if (show) {
        formLogin.classList.add('hidden');
        formForgot.classList.remove('hidden');
    } else {
        formForgot.classList.add('hidden');
        formLogin.classList.remove('hidden');
    }
}

export async function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('forgot-email').value;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/index.html?type=recovery',
    });

    if (error) {
        showCustomDialog('Error', error.message, 'error');
    } else {
        showCustomDialog('Correo Enviado', 'Te hemos remitido un enlace de restauración a tu e-mail.', 'success');
        toggleForgotPassword(false);
    }
}

export async function handleUpdatePassword(event) {
    event.preventDefault();
    const newPass = document.getElementById('recovery-pass').value;

    const { error } = await supabase.auth.updateUser({ password: newPass });

    if (error) {
        showCustomDialog('Error', "No se pudo actualizar: " + error.message, 'error');
    } else {
        showCustomDialog('Clave Actualizada', 'Tu nueva contraseña ya se encuentra activa.', 'success');
        document.getElementById('recovery-container').classList.add('hidden');
        document.getElementById('auth-container').classList.remove('hidden');
    }
}