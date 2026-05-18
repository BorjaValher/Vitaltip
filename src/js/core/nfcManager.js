import { patientData } from '../config/mockData.js';
import { showDataModal } from '../ui/render.js';
import { showCustomDialog } from '../ui/navigation.js'; // <-- ¡Importamos tu modal moderno!
/*
export let nfcReader = null;
export let nfcAbortController = null;

export async function readNFC() {
    // 1. Control de compatibilidad física del chip
    if (!('NDEFReader' in window)) {
        showCustomDialog('No Soportado', 'Tu dispositivo o navegador actual no soporta la lectura de chips NFC.', 'error');
        return;
    }

    // 2. Control de Contexto Seguro (Evita que Chrome Android devuelva un falso "incompatible" en HTTP local)
    if (!window.isSecureContext) {
        showCustomDialog(
            'Entorno Inseguro', 
            'La API Web NFC requiere estrictamente una conexión cifrada (HTTPS). Configura tus flags de Chrome o abre la app mediante un túnel de ngrok.', 
            'warning'
        );
        return;
    }

    if (nfcAbortController) {
        nfcAbortController.abort();
        nfcAbortController = null;
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    nfcAbortController = new AbortController();

    try {
        nfcReader = new NDEFReader();
        await nfcReader.scan({ signal: nfcAbortController.signal });

        document.getElementById('nfc-title').innerText = "Esperando Etiqueta...";
        document.getElementById('nfc-overlay').classList.remove('hidden');

        nfcReader.onreading = null;
        nfcReader.onreading = (event) => {
            const message = event.message;
            try {
                const record = message.records.find(r => r.recordType === "text");
                if (record) {
                    const decoder = new TextDecoder();
                    const text = decoder.decode(record.data);
                    const jsonMatch = text.match(/\{.*\}/);
                    
                    if (jsonMatch) {
                        const rawData = JSON.parse(jsonMatch[0]);
                        const formattedData = {
                            perfil: { 
                                nombre: rawData.nombre || "Sin nombre", 
                                sangre: rawData.tipo_sangre || "--" 
                            },
                            telefono_emergencia: rawData.telefono_emergencia || "",
                            alergias: rawData.alergias || []
                        };

                        stopNFC(); 
                        document.getElementById('nfc-overlay').classList.add('hidden');
                        showDataModal(formattedData);
                    } else {
                        throw new Error("No JSON found");
                    }
                }
            } catch (err) {
                console.error("Fallo al parsear:", err);
                stopNFC();
                document.getElementById('nfc-overlay').classList.add('hidden');
                showCustomDialog('Error de Formato', 'La etiqueta NFC escaneada no contiene un expediente médico compatible o está vacía.', 'warning');
            }
        };

        nfcReader.onreadingerror = () => {
            console.warn("Error de lectura de hardware. Reintentando...");
        };

    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error("Error NFC:", err);
            stopNFC();
            document.getElementById('nfc-overlay').classList.add('hidden');
            showCustomDialog('Fallo de Lectura', 'No se pudo activar el escáner NFC: ' + err.message, 'error');
        }
    }
}

export async function writeNFC() {
    if (!('NDEFReader' in window)) {
        showCustomDialog('No Soportado', 'Tu dispositivo no puede escribir etiquetas NFC.', 'error');
        return;
    }

    if (!window.isSecureContext) {
        showCustomDialog('Entorno Inseguro', 'La escritura NFC requiere una URL HTTPS segura.', 'warning');
        return;
    }

    if (nfcAbortController) nfcAbortController.abort();
    nfcAbortController = new AbortController();

    try {
        // Conseguimos el número del contacto marcado como SOS
        const telefonoPrincipal = patientData.contactos.find(c => c.principal)?.telefono || "";
        
        const jsonData = JSON.stringify({
            nombre: patientData.perfil.nombre,
            tipo_sangre: patientData.perfil.sangre,
            telefono_emergencia: telefonoPrincipal,
            alergias: patientData.alergias
        });

        document.getElementById('nfc-title').innerText = "Escribiendo en Etiqueta...";
        document.getElementById('nfc-overlay').classList.remove('hidden');

        const writer = new NDEFReader();
        await writer.write({ records: [{ recordType: "text", data: jsonData }] }, 
                           { signal: nfcAbortController.signal });

        document.getElementById('nfc-overlay').classList.add('hidden');
        stopNFC();
        showCustomDialog('¡Tarjeta Grabada!', 'Los datos médicos de emergencia se han transferido a la etiqueta correctamente.', 'success');

    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error("Error al escribir:", error);
            stopNFC();
            document.getElementById('nfc-overlay').classList.add('hidden');
            showCustomDialog('Error de Escritura', 'No se pudieron volcar los datos. Mantén la etiqueta pegada al reverso del móvil de forma estable.', 'error');
        }
    }
}

export function stopNFC() {
    if (nfcAbortController) {
        nfcAbortController.abort();
        nfcAbortController = null;
    }
    if (nfcReader) {
        nfcReader.onreading = null;
        nfcReader.onreadingerror = null;
        nfcReader = null;
    }
}
*/

export async function readNFC() {
    // 1. Mostramos la pantalla de carga de aproximación
    document.getElementById('nfc-title').innerText = "Esperando Etiqueta...";
    document.getElementById('nfc-overlay').classList.remove('hidden');

    // 2. Simulamos un retraso de 1.5 segundos de lectura de hardware
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 3. Datos simulados (hardcodeados) que imitan la lectura de otra tarjeta VitalTip
    const formattedData = {
        perfil: { 
            nombre: "Carlos Mendoza Ortiz", 
            sangre: "A+" 
        },
        telefono_emergencia: "+34 612 345 678",
        alergias: ["Penicilina", "Frutos secos de cáscara"]
    };

    // 4. Ocultamos el overlay y lanzamos los modales de éxito
    document.getElementById('nfc-overlay').classList.add('hidden');
    
    
    
    // Inyectamos los datos en tu modal clínico
    if (typeof showDataModal === 'function') {
        showDataModal(formattedData);
    }
}



export function stopNFC() {
    // Limpieza de estados simulados si hiciese falta
    document.getElementById('nfc-overlay').classList.add('hidden');
}
export async function writeNFC() {
    // 1. Mostramos animación de escritura
    document.getElementById('nfc-title').innerText = "Escribiendo en Etiqueta...";
    document.getElementById('nfc-overlay').classList.remove('hidden');

    // 2. Simulamos el tiempo que tarda físicamente el chip en grabar (1.5 segundos)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 3. Cerramos y avisamos con tu modal flotante
    document.getElementById('nfc-overlay').classList.add('hidden');
    showCustomDialog('¡Tarjeta Grabada!', 'Los datos médicos de emergencia se han transferido a la etiqueta correctamente.', 'success');
}

