import { patientData } from '../config/mockData.js';
import { stopNFC } from '../core/nfcManager.js';
import { renderMedicationsTab } from './render.js';

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
    const profileInfo = document.getElementById('profile-info');
    const form = document.getElementById('edit-profile-form');
    const editBtn = document.getElementById('edit-profile-btn');
    const nfcBtn = document.getElementById('write-nfc-btn');

    if (show) {
        document.getElementById('edit-nombre').value = patientData.perfil.nombre;
        document.getElementById('edit-altura').value = patientData.perfil.altura || '';
        document.getElementById('edit-peso').value = patientData.perfil.peso || '';
        document.getElementById('edit-direccion').value = patientData.perfil.direccion;
        document.getElementById('edit-sangre').value = patientData.perfil.sangre;

        profileInfo.classList.add('hidden');
        form.classList.remove('hidden');
        editBtn.classList.add('hidden');
        nfcBtn.classList.add('hidden');
    } else {
        profileInfo.classList.remove('hidden');
        form.classList.add('hidden');
        editBtn.classList.remove('hidden');
        nfcBtn.classList.remove('hidden');
    }
}

export function toggleMedicationForm(show) {
    const listView = document.getElementById('meds-list-view');
    const formView = document.getElementById('meds-form-view');

    if (show) {
        listView.classList.add('hidden');
        formView.classList.remove('hidden');
    } else {
        listView.classList.remove('hidden');
        formView.classList.add('hidden');
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

    // Ocultar todas
    listView.classList.add('hidden');
    formView.classList.add('hidden');
    detailView.classList.add('hidden');

    // Mostrar la solicitada
    if (view === 'list') listView.classList.remove('hidden');
    if (view === 'form') formView.classList.remove('hidden');
    if (view === 'detail') detailView.classList.remove('hidden');
}