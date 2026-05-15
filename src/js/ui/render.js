import { patientData } from '../config/mockData.js';

export function renderData() {
    // Alergias
    document.getElementById('alergias-container').innerHTML = patientData.alergias.map(a => `
        <span class="bg-red-50 text-[#d32f2f] border border-red-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
            <i data-lucide="ban" class="w-3 h-3"></i> ${a}
        </span>
    `).join('');
    document.getElementById('sangre-text').innerText = patientData.perfil.sangre;

    // Contactos
    document.getElementById('contactos-container').innerHTML = patientData.contactos.map(c => `
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div class="${c.principal ? 'bg-blue-50 text-[#00529b]' : 'bg-slate-50 text-slate-400'} p-3 rounded-xl">
                    <i data-lucide="${c.principal ? 'shield-check' : 'user'}" class="w-5 h-5"></i>
                </div>
                <div>
                    <p class="font-bold text-slate-800">${c.nombre}</p>
                    <p class="text-xs text-slate-500">${c.relacion}</p>
                </div>
            </div>
            <a href="tel:${c.telefono}" class="bg-green-500 p-3 rounded-xl text-white shadow-lg active:scale-90 transition-transform">
                <i data-lucide="phone" class="w-5 h-5"></i>
            </a>
        </div>
    `).join('');

    // Medicación
    document.getElementById('medicacion-container').innerHTML = patientData.medicacion.map(m => `
        <div class="flex gap-4 p-3 bg-blue-50/50 rounded-2xl border border-blue-100/50">
            <div class="bg-white p-2 rounded-lg shadow-sm h-fit">
                <i data-lucide="${m.icon}" class="text-blue-500 w-4 h-4"></i>
            </div>
            <div>
                <p class="font-bold text-sm text-slate-800">${m.nombre}</p>
                <p class="text-xs text-slate-500">${m.dosis} • <span class="text-blue-600 font-semibold uppercase">${m.frecuencia}</span></p>
            </div>
        </div>
    `).join('');

    // Seguro e Historial
    document.getElementById('seguro-compania').innerText = patientData.seguro.compania;
    document.getElementById('seguro-poliza').innerText = patientData.seguro.poliza;
    document.getElementById('seguro-tipo').innerText = patientData.seguro.tipo;

    document.getElementById('historial-container').innerHTML = patientData.historial.map(h => `
        <div class="relative pl-6">
            <div class="absolute w-4 h-4 bg-[#00529b] rounded-full -left-[9px] top-1 border-4 border-slate-50"></div>
            <p class="text-xs font-bold text-slate-400 mb-1 tracking-widest uppercase">${h.fecha}</p>
            <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <h4 class="font-bold text-slate-800 mb-1">${h.evento}</h4>
                <p class="text-xs text-[#00529b] font-semibold mb-2 flex items-center gap-1">
                    <i data-lucide="building" class="w-3 h-3"></i> ${h.lugar}
                </p>
                <p class="text-sm text-slate-500">${h.desc}</p>
            </div>
        </div>
    `).join('');

    // Perfil
    document.getElementById('perfil-nombre').innerText = patientData.perfil.nombre;
    document.getElementById('perfil-id').innerText = patientData.perfil.id;
    document.getElementById('perfil-direccion').innerHTML = `
        <i data-lucide="map-pin" class="w-4 h-4 text-[#00529b] mt-0.5 shrink-0"></i>
        <span>${patientData.perfil.direccion}</span>
    `;

    const stats = [
        { label: "Nacimiento", val: patientData.perfil.nacimiento },
        { label: "Peso", val: patientData.perfil.peso },
        { label: "Altura", val: patientData.perfil.altura },
        { label: "Sangre", val: patientData.perfil.sangre }
    ];
    
    document.getElementById('perfil-stats-container').innerHTML = stats.map(s => `
        <div class="bg-white p-3 rounded-xl shadow-sm border border-slate-200 text-center">
            <p class="text-[10px] text-slate-400 font-bold uppercase mb-1">${s.label}</p>
            <p class="text-sm font-black text-slate-800">${s.val}</p>
        </div>
    `).join('');
}

export function showDataModal(data) {
    const modalElement = document.getElementById('data-modal');
    document.getElementById('modal-nombre').innerText = data.perfil.nombre || "Desconocido";
    document.getElementById('modal-sangre').innerText = data.perfil.sangre || "--";
    
    const emergencyTel = data.telefono_emergencia || patientData.contactos.find(c => c.principal)?.telefono || "";
    const idContainer = document.getElementById('modal-id').parentElement;
    
    idContainer.innerHTML = `
        <p class="text-[9px] font-bold text-slate-400 uppercase">Emergencia</p>
        <a href="tel:${emergencyTel}" class="text-xs font-bold text-blue-600 flex items-center gap-1 mt-1">
            <i data-lucide="phone" class="w-3 h-3"></i> ${emergencyTel}
        </a>
    `;

    const container = document.getElementById('modal-alergias');
    container.innerHTML = (data.alergias || []).map(a => `
        <span class="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
            ${a}
        </span>
    `).join('');
    
    modalElement.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
}