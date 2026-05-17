import { renderData, showDataModal, renderMedicationsTab, renderHistoryDetail } from './ui/render.js';
import { readNFC, writeNFC } from './core/nfcManager.js';
import { 
    switchTab, 
    triggerSOS, 
    shareLocation, 
    toggleNfcOverlay, 
    closeDataModal, 
    toggleEditProfile,
    toggleMedicationForm, 
    filterMedications,
    toggleHistoryView
} from './ui/navigation.js';
import { 
    saveProfile, 
    saveMedication,
    saveHistoryEvent,
    deleteHistoryEvent
} from './ui/dataHandlers.js';


// 2. EXPOSICIÓN AL ENTORNO GLOBAL (WINDOW)
// General y Perfil
window.readNFC = readNFC;
window.writeNFC = writeNFC;
window.switchTab = switchTab;
window.triggerSOS = triggerSOS;
window.shareLocation = shareLocation;
window.toggleNfcOverlay = toggleNfcOverlay;
window.closeDataModal = closeDataModal;
window.toggleEditProfile = toggleEditProfile;
window.saveProfile = saveProfile;

// Medicación
window.toggleMedicationForm = toggleMedicationForm;
window.filterMedications = filterMedications;
window.saveMedication = saveMedication;

// Historial
window.toggleHistoryView = toggleHistoryView;
window.renderHistoryDetail = renderHistoryDetail;
window.saveHistoryEvent = saveHistoryEvent;
window.deleteHistoryEvent = deleteHistoryEvent;

// 3. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    renderData();                  // Carga datos generales
    renderMedicationsTab('tarde'); // Carga pastillas de la tarde por defecto
    renderHistorialTab();          // Carga el timeline del historial
    
    if (window.lucide) {
        window.lucide.createIcons();
    }
});