import { patientData } from '../config/mockData.js';
import { stopNFC } from '../core/nfcManager.js';
import { renderMedicationsTab, renderSettingsLists } from './render.js';

export function switchTab(tabId, btnElement) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.classList.add('hidden');
    });

    const selectedTab = document.getElementById(tabId);
    selectedTab.classList.add('active');
    selectedTab.classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.replace('text-[#00529b]', 'text-slate-300');
    });
    btnElement.classList.add('active');
    btnElement.classList.replace('text-slate-300', 'text-[#00529b]');

    const nfcHeader = document.getElementById('nfc-header');
    if (tabId === 'home') {
        nfcHeader.classList.remove('hidden');
    } else {
        nfcHeader.classList.add('hidden');
    }
}

export function triggerSOS() {
    const principal = patientData.contactos.find(c => c.principal);
    window.location.href = principal ? `tel:${principal.telefono}` : "tel:112";
}
/*
export function shareLocation() {
    // 1. Comprobación básica de API
    if (!navigator.geolocation) {
        showCustomDialog('No compatible', 'Tu navegador o dispositivo no soporta la geolocalización nativa.', 'error');
        return;
    }

    // 2. Control estricto de contexto seguro en Chrome Android
    if (!window.isSecureContext) {
        showCustomDialog(
            'Entorno Inseguro', 
            'Chrome bloquea el GPS en conexiones locales HTTP. Necesitas usar HTTPS, un túnel de ngrok, o autorizar tu IP en chrome://flags.', 
            'warning'
        );
        return;
    }

    // Levantamos un aviso de carga en la pantalla flotante
    showCustomDialog('Buscando...', 'Conectando con los servicios de localización de tu dispositivo...', 'info');

    // Configuración inicial exigente (GPS por satélite)
    const geoOptions = {
        enableHighAccuracy: true, 
        timeout: 6000, // Esperamos un máximo de 6 segundos antes de activar el plan B
        maximumAge: 0  // Forzamos localización en tiempo real, nada de caché vieja
    };

    const successCallback = (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Guardamos las coordenadas en tu objeto global por si las necesita el botón SOS
        if (window.patientData) {
            window.patientData.ultimaUbicacion = { lat, lon };
        }

        // Éxito: Pintamos el modal con los datos exactos obtenidos
        showCustomDialog(
            'Ubicación Obtenida', 
            `Coordenadas localizadas con éxito:\n\nLatitud: ${lat.toFixed(6)}\nLongitud: ${lon.toFixed(6)}\n\nTu posición se encuentra vinculada a la señal de emergencia.`, 
            'success'
        );
    };

    const errorFallback = (error) => {
        // PLAN B: Si da un TIMEOUT intentando buscar satélites (típico en interiores),
        // relajamos la precisión para usar triangulación por antenas y Wi-Fi.
        if (error.code === error.TIMEOUT && geoOptions.enableHighAccuracy) {
            console.warn("Timeout de alta precisión. Reintentando con localización por red...");
            geoOptions.enableHighAccuracy = false;
            navigator.geolocation.getCurrentPosition(successCallback, finalErrorCallback, geoOptions);
        } else {
            finalErrorCallback(error);
        }
    };

    const finalErrorCallback = (error) => {
        let titulo = 'Fallo de Ubicación';
        let mensaje = 'No se ha podido determinar la localización del dispositivo.';
        let tipo = 'error';

        switch (error.code) {
            case error.PERMISSION_DENIED:
                titulo = 'Permiso Denegado';
                mensaje = 'Has bloqueado el acceso al GPS en Chrome. Toca los tres puntos de arriba en Chrome -> Configuración -> Ajustes de sitios -> Ubicación, y dale permiso a la app.';
                tipo = 'warning';
                break;
            case error.POSITION_UNAVAILABLE:
                titulo = 'Señal Inaccesible';
                mensaje = 'Los servicios de ubicación del móvil están apagados o el dispositivo se encuentra en una zona sin cobertura de red ni satélite.';
                break;
            case error.TIMEOUT:
                titulo = 'Tiempo Agotado';
                mensaje = 'El dispositivo ha tardado demasiado en responder. Inténtalo de nuevo saliendo a un espacio abierto.';
                break;
        }

        showCustomDialog(titulo, mensaje, tipo);
    };

    // Disparamos la petición nativa
    navigator.geolocation.getCurrentPosition(successCallback, errorFallback, geoOptions);
}
*/
export function shareLocation() {
    // Coordenadas geográficas exactas de la Plaza Mayor de Salamanca
    const lat = 40.965012;
    const lon = -5.664063;

    // Levantamos un aviso visual realista de telemetría
    showCustomDialog('Enviando Señal...', 'Estableciendo conexión de emergencia con satélites de rescate...', 'info');

    // Sincronizamos en tu estado por si el botón de SOS necesita usar la última ubicación
    if (window.patientData) {
        window.patientData.ultimaUbicacion = { lat, lon };
    }

    // Simulamos 1 segundo de espera de red y lanzamos la acción
    setTimeout(() => {
        showCustomDialog(
            'Ubicación Compartida', 
            'Coordenadas de auxilio enviadas. Abriendo mapa de posicionamiento en Plaza Mayor de Salamanca.', 
            'success'
        );

        // API oficial de búsqueda de Google Maps por coordenadas precisas
        const urlMaps = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
        
        // En Android/iOS esto abrirá directamente la aplicación nativa de Google Maps
        window.open(urlMaps, '_blank');
    }, 1000);
}
export function toggleNfcOverlay(show) {
    if (!show) {
        stopNFC();
        document.getElementById('nfc-overlay').classList.add('hidden');
    }
}

export function closeDataModal() {
    document.getElementById('data-modal').classList.add('hidden');
    stopNFC();
    document.getElementById('nfc-title').innerText = "Acerca VitalTip";
}

export function toggleEditProfile(show) {
    const viewMode = document.getElementById('profile-view-mode');
    const editForm = document.getElementById('edit-profile-form');
    const nfcContainer = document.getElementById('nfc-action-container');
    const bottomNav = document.querySelector('nav'); 

    if (show) {
        // Solo cargamos los datos físicos e identidad
        document.getElementById('edit-nombre').value = patientData.perfil.nombre || '';
        document.getElementById('edit-nacimiento').value = patientData.perfil.nacimiento || '';
        document.getElementById('edit-dni').value = patientData.perfil.dni || '';
        document.getElementById('edit-altura').value = patientData.perfil.altura || '';
        document.getElementById('edit-peso').value = patientData.perfil.peso || '';
        document.getElementById('edit-direccion').value = patientData.perfil.direccion || '';
        document.getElementById('edit-sangre').value = patientData.perfil.sangre || 'O+';

        viewMode.classList.add('hidden');
        if (nfcContainer) nfcContainer.classList.add('hidden');
        editForm.classList.remove('hidden');
        if (bottomNav) bottomNav.classList.add('hidden');
    } else {
        editForm.classList.add('hidden');
        viewMode.classList.remove('hidden');
        if (nfcContainer) nfcContainer.classList.remove('hidden');
        if (bottomNav) bottomNav.classList.remove('hidden');
    }
}

export function toggleMedicationForm(show) {
    const listView = document.getElementById('meds-list-view');
    const formView = document.getElementById('meds-form-view');
    const bottomNav = document.querySelector('nav');

    if (show) {
        listView.classList.add('hidden');
        formView.classList.remove('hidden');
        if (bottomNav) bottomNav.classList.add('hidden'); // Ocultar
    } else {
        listView.classList.remove('hidden');
        formView.classList.add('hidden');
        if (bottomNav) bottomNav.classList.remove('hidden'); // Mostrar
    }
}

export function filterMedications(turno) {
    // Solución al problema de la 'ñ' vs 'n' en el ID del HTML
    const idTurno = turno === 'mañana' ? 'manana' : turno;

    // 1. Resetear estilos de todos los botones
    document.querySelectorAll('.med-filter-btn').forEach(btn => {
        btn.classList.remove('bg-[#00529b]', 'text-white', 'shadow-md');
        btn.classList.add('text-slate-500');
        
        const icon = btn.querySelector('.lucide');
        if (icon) {
            icon.classList.add('hidden');
        }
    });

    // 2. Aplicar estilos al botón activo usando el ID corregido
    const activeBtn = document.getElementById(`btn-${idTurno}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-500');
        activeBtn.classList.add('bg-[#00529b]', 'text-white', 'shadow-md');
        
        const activeIcon = activeBtn.querySelector('.lucide');
        if (activeIcon) {
            activeIcon.classList.remove('hidden');
        }
    }

    // 3. ACTIVAMOS EL FILTRO REAL DE LAS TARJETAS
    renderMedicationsTab(turno);
}

export function toggleHistoryView(view) {
    const listView = document.getElementById('history-list-view');
    const formView = document.getElementById('history-form-view');
    const detailView = document.getElementById('history-detail-view');
    const bottomNav = document.querySelector('nav');

    // Ocultar todas primero
    listView.classList.add('hidden');
    formView.classList.add('hidden');
    detailView.classList.add('hidden');

    // Mostrar solo la solicitada y gestionar la barra inferior
    if (view === 'list') {
        listView.classList.remove('hidden');
        if (bottomNav) bottomNav.classList.remove('hidden'); // Mostrar en la lista
    }
    if (view === 'form') {
        formView.classList.remove('hidden');
        if (bottomNav) bottomNav.classList.add('hidden'); // Ocultar al añadir/editar
    }
    if (view === 'detail') {
        detailView.classList.remove('hidden');
        if (bottomNav) bottomNav.classList.add('hidden'); // Ocultar en el detalle para no estorbar
    }
}

export function openAddHistoryForm() {
    // 1. Limpiamos el ID oculto (para indicar que es nuevo)
    document.getElementById('hist-id').value = '';
    
    // 2. Vaciamos todos los campos
    document.getElementById('form-historial').reset();
    
    // 3. Cambiamos el título
    document.getElementById('form-hist-title').innerText = "Agregar Registro";
    
    // 4. Mostramos la vista
    toggleHistoryView('form');
}

export function toggleSettings(show) {
    const viewMode = document.getElementById('profile-view-mode');
    const settingsView = document.getElementById('settings-main-view');
    const nfcContainer = document.getElementById('nfc-action-container');
    const bottomNav = document.querySelector('nav');

    // Asegurarnos de que todos los submenús estén cerrados
    document.querySelectorAll('.settings-sub-view').forEach(el => el.classList.add('hidden'));

    if (show) {
        viewMode.classList.add('hidden');
        if (nfcContainer) nfcContainer.classList.add('hidden');
        settingsView.classList.remove('hidden');
        if (bottomNav) bottomNav.classList.add('hidden'); 
        if (window.lucide) window.lucide.createIcons();
    } else {
        settingsView.classList.add('hidden');
        viewMode.classList.remove('hidden');
        if (nfcContainer) nfcContainer.classList.remove('hidden');
        if (bottomNav) bottomNav.classList.remove('hidden'); 
    }
}

export function showDeleteConfirmation() {
    document.getElementById('init-delete-btn').classList.add('hidden');
    document.getElementById('delete-confirm-container').classList.remove('hidden');
    document.getElementById('delete-confirm-input').value = ''; // Vaciamos el input por si entra de nuevo
}

export function cancelDelete() {
    document.getElementById('delete-confirm-container').classList.add('hidden');
    document.getElementById('init-delete-btn').classList.remove('hidden');
}

export function initScrollNavigation() {
    const bottomNav = document.querySelector('nav');
    if (!bottomNav) return;

    // Le inyectamos las clases de Tailwind para que se mueva suavemente
    bottomNav.classList.add('transition-transform', 'duration-300', 'ease-in-out');

    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        // Si la barra ya está oculta (porque estamos en un formulario), ignoramos el scroll
        if (bottomNav.classList.contains('hidden')) return;

        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Si hacemos scroll hacia abajo y hemos bajado más de 50px de margen
        if (scrollTop > lastScrollTop && scrollTop > 50) {
            bottomNav.classList.add('translate-y-full'); // Esconde la barra desplazándola hacia abajo
        } else {
            bottomNav.classList.remove('translate-y-full'); // Vuelve a mostrar la barra
        }

        // Guardamos la posición actual para compararla en el siguiente movimiento
        // (El <= 0 evita un bug de parpadeo que ocurre en los iPhone al rebotar arriba)
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
    });
}

export function openSubSetting(viewId) {
    // Ocultar menú principal de ajustes
    document.getElementById('settings-main-view').classList.add('hidden');
    
    // Mostrar la vista solicitada
    document.getElementById(`settings-${viewId}-view`).classList.remove('hidden');

    // Si es seguro, rellenamos los datos actuales
    if (viewId === 'seguro') {
        document.getElementById('set-seguro-compania').value = patientData.seguro?.compania || '';
        document.getElementById('set-seguro-poliza').value = patientData.seguro?.poliza || '';
        document.getElementById('set-seguro-tipo').value = patientData.seguro?.tipo || '';
    }

    // Dibujar listas dinámicas si es necesario
    if (viewId === 'contactos' || viewId === 'alergias') {
        renderSettingsLists(); 
    }
    if (window.lucide) window.lucide.createIcons();
}

export function closeSubSetting() {
    // Ocultar todos los submenús
    document.querySelectorAll('.settings-sub-view').forEach(el => el.classList.add('hidden'));
    // Volver al menú principal de ajustes
    document.getElementById('settings-main-view').classList.remove('hidden');
}

export function openAddMedicationForm() {
    // 1. Limpiamos campos
    document.getElementById('med-id').value = '';
    document.getElementById('new-med-name').value = '';
    document.getElementById('new-med-dose').value = '';
    document.getElementById('new-med-freq').value = 'Cada 8 horas';
    document.getElementById('new-med-turno').value = 'tarde';
    
    // 2. Título en modo creación
    document.getElementById('form-med-title').innerText = "Añadir Medicación";
    
    // 3. Abrimos formulario
    toggleMedicationForm(true);
}

export function toggleMedsHistoryView(show) {
    const listView = document.getElementById('meds-list-view');
    const historyView = document.getElementById('meds-history-view');
    const bottomNav = document.querySelector('nav');

    if (show) {
        listView.classList.add('hidden');
        historyView.classList.remove('hidden');
        
        // Escondemos barra de navegación inferior para enfoque completo
        if (bottomNav) bottomNav.classList.add('hidden');
        
        // Disparamos el renderizado dinámico del historial
        import('./render.js').then(m => m.renderMedsHistoryTab());
    } else {
        historyView.classList.add('hidden');
        listView.classList.remove('hidden');
        if (bottomNav) bottomNav.classList.remove('hidden');
    }
}

export function showCustomDialog(title, message, type = 'info', isConfirm = false) {
    return new Promise((resolve) => {
        const modal = document.getElementById('custom-dialog');
        const titleEl = document.getElementById('dialog-title');
        const msgEl = document.getElementById('dialog-message');
        const iconContainer = document.getElementById('dialog-icon-container');
        const iconEl = document.getElementById('dialog-icon');
        const btnOk = document.getElementById('dialog-btn-ok');
        const btnCancel = document.getElementById('dialog-btn-cancel');

        titleEl.innerText = title;
        msgEl.innerText = message;

        iconContainer.className = 'w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm border-4 border-white ';
        btnOk.className = 'flex-1 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-md active:scale-95 transition-all text-white ';

        if (type === 'success') {
            iconContainer.classList.add('bg-green-100', 'text-green-600');
            iconEl.setAttribute('data-lucide', 'check-circle-2');
            btnOk.classList.add('bg-green-500');
        } else if (type === 'error') {
            iconContainer.classList.add('bg-red-100', 'text-[#d32f2f]');
            iconEl.setAttribute('data-lucide', 'alert-octagon');
            btnOk.classList.add('bg-[#d32f2f]');
        } else if (type === 'warning') {
            iconContainer.classList.add('bg-amber-100', 'text-amber-600');
            iconEl.setAttribute('data-lucide', 'alert-triangle');
            btnOk.classList.add('bg-amber-500');
        } else {
            iconContainer.classList.add('bg-blue-100', 'text-[#00529b]');
            iconEl.setAttribute('data-lucide', 'info');
            btnOk.classList.add('bg-[#00529b]');
        }

        if (isConfirm) {
            btnCancel.classList.remove('hidden');
        } else {
            btnCancel.classList.add('hidden');
        }

        if (window.lucide) window.lucide.createIcons();
        modal.classList.remove('hidden');

        const closeAndResolve = (result) => {
            modal.classList.add('hidden');
            btnOk.onclick = null;
            btnCancel.onclick = null;
            resolve(result);
        };

        btnOk.onclick = () => closeAndResolve(true);
        btnCancel.onclick = () => closeAndResolve(false);
    });
}