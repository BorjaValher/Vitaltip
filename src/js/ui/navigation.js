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

export function shareLocation() {
    const btnText = document.getElementById('loc-btn-text');
    const originalText = btnText.innerText;
    btnText.innerText = "Buscando...";

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                window.open(`https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`, '_blank');
                btnText.innerText = originalText;
            },
            () => { alert("Activa el GPS."); btnText.innerText = originalText; },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    }
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