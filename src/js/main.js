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
    toggleHistoryView,
    openAddHistoryForm,
    toggleSettings,
    showDeleteConfirmation, 
    cancelDelete,
    initScrollNavigation,
    openSubSetting, closeSubSetting
} from './ui/navigation.js';
import { 
    saveProfile, 
    saveMedication,
    saveHistoryEvent,
    deleteHistoryEvent,
    editHistoryEvent,
    saveSeguro, addContacto, deleteContacto, addAlergia, deleteAlergia
} from './ui/dataHandlers.js';

import { 
    toggleAuthTab, handleLogin, handleRegister, 
    checkSession, logout, handleDeleteAccount,
    toggleForgotPassword, handleForgotPassword, handleUpdatePassword 
} from './core/authManager.js';

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
window.toggleAuthTab = toggleAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.toggleSettings = toggleSettings;
window.showDeleteConfirmation = showDeleteConfirmation; 
window.cancelDelete = cancelDelete;
window.openSubSetting = openSubSetting;
window.closeSubSetting = closeSubSetting;

window.saveSeguro = saveSeguro;
window.addContacto = addContacto;
window.deleteContacto = deleteContacto;
window.addAlergia = addAlergia;
window.deleteAlergia = deleteAlergia;

// Medicación
window.toggleMedicationForm = toggleMedicationForm;
window.filterMedications = filterMedications;
window.saveMedication = saveMedication;

// Historial
window.toggleHistoryView = toggleHistoryView;
window.renderHistoryDetail = renderHistoryDetail;
window.saveHistoryEvent = saveHistoryEvent;
window.deleteHistoryEvent = deleteHistoryEvent;
window.openAddHistoryForm = openAddHistoryForm;
window.editHistoryEvent = editHistoryEvent;

// Autenticación (Supabase)
window.toggleAuthTab = toggleAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.handleDeleteAccount = handleDeleteAccount;
window.toggleForgotPassword = toggleForgotPassword;
window.handleForgotPassword = handleForgotPassword;
window.handleUpdatePassword = handleUpdatePassword;

// 3. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    initScrollNavigation();
    if (window.lucide) {
        window.lucide.createIcons();
    }
});