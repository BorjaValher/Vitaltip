import { patientData } from '../config/mockData.js';
import { showDataModal } from '../ui/render.js';

export let nfcReader = null;
export let nfcAbortController = null;

export async function readNFC() {
    if (!('NDEFReader' in window)) {
        alert("Tu dispositivo no soporta NFC.");
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
                alert("La etiqueta no tiene el formato correcto o está vacía.");
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
        }
    }
}

export async function writeNFC() {
    if (!('NDEFReader' in window)) {
        alert("NFC no soportado.");
        return;
    }

    if (nfcAbortController) nfcAbortController.abort();
    nfcAbortController = new AbortController();

    try {
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
        alert("¡Datos guardados correctamente!");

    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error("Error al escribir:", error);
            alert("Error al grabar. Mantén la etiqueta pegada.");
            stopNFC();
            document.getElementById('nfc-overlay').classList.add('hidden');
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