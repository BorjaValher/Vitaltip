import { renderData } from './ui/render.js';
import { readNFC, writeNFC } from './core/nfcManager.js';
import { switchTab, triggerSOS, shareLocation, toggleNfcOverlay, closeDataModal, toggleEditProfile } from './ui/navigation.js';
import { saveProfile, addHistorial, deleteHistorial } from './ui/dataHandlers.js';

// Exponemos las funciones al objeto global 'window' 
// Esto permite que los atributos 'onclick' del HTML sigan funcionando sin tener que reescribir todo el DOM.
window.readNFC = readNFC;
window.writeNFC = writeNFC;
window.switchTab = switchTab;
window.triggerSOS = triggerSOS;
window.shareLocation = shareLocation;
window.toggleNfcOverlay = toggleNfcOverlay;
window.closeDataModal = closeDataModal;
window.toggleEditProfile = toggleEditProfile;
window.saveProfile = saveProfile;
window.addHistorial = addHistorial;
window.deleteHistorial = deleteHistorial;

// Inicialización de la aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    renderData();
    if (window.lucide) {
        window.lucide.createIcons();
    }
});