// src/js/core/authManager.js

import { supabase } from '../config/supabaseClient.js';
import { renderData, renderMedicationsTab, renderHistorialTab } from '../ui/render.js';
import { patientData } from '../config/mockData.js'; 

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

// --- LOGIN Y REGISTRO ---
export async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-pass').value;

    // 1. Verificamos en consola qué estamos enviando exactamente antes de que salga
    console.log("🔍 Intentando login con -> Email:", email, "| Pass:", password);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        // 2. Imprimimos el error crudo que nos devuelve Supabase
        console.error("❌ Error detallado de Supabase:", error);
        alert("Error exacto: " + error.message);
    } else {
        initAppWithUser(data.user);
    }
}

export async function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-pass').value;
    const name = document.getElementById('reg-name').value;
    const bloodType = document.getElementById('reg-blood').value;
    const allergies = document.getElementById('reg-allergies').value;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
                blood_type: bloodType,
                allergies: allergies ? allergies.split(',').map(a => a.trim()) : []
            }
        }
    });

    if (error) {
        alert("Error al registrarse: " + error.message);
    } else {
        alert("Registro exitoso. Iniciando sesión...");
        initAppWithUser(data.user);
    }
}

// --- RECUPERACIÓN DE CONTRASEÑA ---
export function toggleForgotPassword(show) {
    const formLogin = document.getElementById('form-login');
    const formForgot = document.getElementById('form-forgot');
    const tabs = document.getElementById('auth-tabs');

    if (show) {
        formLogin.classList.add('hidden');
        tabs.classList.add('hidden');
        formForgot.classList.remove('hidden');
    } else {
        formForgot.classList.add('hidden');
        tabs.classList.remove('hidden');
        formLogin.classList.remove('hidden');
    }
}

export async function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('forgot-email').value;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname, 
    });

    if (error) {
        alert("Error: " + error.message);
    } else {
        alert("Te hemos enviado un correo electrónico con el enlace de recuperación.");
        toggleForgotPassword(false);
        document.getElementById('form-forgot').reset();
    }
}

export async function handleUpdatePassword(event) {
    event.preventDefault();
    const newPassword = document.getElementById('new-update-pass').value;

    const { data, error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        alert("Error al actualizar: " + error.message);
    } else {
        alert("¡Contraseña actualizada con éxito!");
        document.getElementById('form-update-pass').classList.add('hidden');
        document.getElementById('auth-tabs').classList.remove('hidden');
        initAppWithUser(data.user);
    }
}

// --- GESTIÓN DE CUENTA Y SESIÓN ---
export async function checkSession() {
    // 1. Comprobamos si hay sesión normal
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        initAppWithUser(session.user);
    }

    // 2. Escuchamos cambios de estado (Ej: Cuando volvemos tras pinchar el enlace del email)
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
            document.getElementById('form-login').classList.add('hidden');
            document.getElementById('form-register').classList.add('hidden');
            document.getElementById('form-forgot').classList.add('hidden');
            document.getElementById('auth-tabs').classList.add('hidden');
            
            document.getElementById('form-update-pass').classList.remove('hidden');
            
            if (window.lucide) window.lucide.createIcons();
        }
    });
}

export async function logout() {
    try {
        await supabase.auth.signOut();
    } catch (err) {
        console.error("Error al cerrar sesión en Supabase:", err);
    } finally {
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('app-container').classList.add('hidden');
        
        document.getElementById('form-login').reset();
        document.getElementById('form-register').reset();
    }
}

export async function handleDeleteAccount() {
    const confirmFirst = confirm("¿Estás completamente seguro de que deseas eliminar tu cuenta de VitalTip?\n\nEsta acción es irreversible y borrará de forma permanente todos tus datos.");
    if (!confirmFirst) return;

    const confirmSecond = prompt("Para confirmar la eliminación permanente, escribe la palabra 'ELIMINAR' en mayúsculas:");
    if (confirmSecond !== 'ELIMINAR') {
        alert("Confirmación incorrecta. El proceso de eliminación ha sido cancelado.");
        return;
    }

    try {
        const { error } = await supabase.rpc('delete_user_account');
        if (error) throw error;

        alert("Tu cuenta y todo tu expediente médico han sido eliminados correctamente.");
        
        document.getElementById('auth-container').classList.remove('hidden');
        document.getElementById('app-container').classList.add('hidden');
        document.getElementById('form-login').reset();
        document.getElementById('form-register').reset();

    } catch (err) {
        console.error("Error crítico al eliminar la cuenta:", err);
        alert("No se pudo eliminar la cuenta: " + err.message);
    }
}

// --- INICIALIZADOR DE APP ---
function initAppWithUser(user) {
    if (user && user.user_metadata) {
        const meta = user.user_metadata;
        
        // Mapeamos los datos de la nube al objeto dinámico de la app
        patientData.perfil.nombre = meta.full_name || "Usuario";
        patientData.perfil.sangre = meta.blood_type || "--";
        patientData.perfil.dni = meta.dni || "--";
        patientData.perfil.altura = meta.altura || "--";
        patientData.perfil.peso = meta.peso || "--";
        patientData.perfil.direccion = meta.direccion || "No especificada";
        
        if (meta.allergies) patientData.alergias = meta.allergies;
        
        patientData.seguro = {
            compania: meta.seguro_compania || "Ninguno",
            poliza: meta.seguro_poliza || "--",
            tipo: meta.seguro_tipo || "--"
        };
        
        patientData.contactos = meta.contactos || [];
        patientData.medicacion = meta.medicacion || [];
        patientData.historial = meta.historial || [];
    }

    // Ocultar formulario de acceso y desbloquear la SPA
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');

    // Forzar redibujado de todas las pestañas con información real
    renderData();
    renderMedicationsTab('tarde');
    renderHistorialTab();
    if (window.lucide) window.lucide.createIcons();
}