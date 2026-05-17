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
    renderHistorialTab()
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


export function renderMedicationsTab(turnoSeleccionado = 'tarde') {
    const container = document.getElementById('meds-cards-container');
    
    // AHORA SÍ: Filtramos la lista basándonos en el turno seleccionado
    const meds = patientData.medicacion.filter(m => m.turno === turnoSeleccionado);

    // Si el paciente no tiene pastillas en ese turno, mostramos un mensaje amigable
    if (meds.length === 0) {
        container.innerHTML = `
            <div class="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
                <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <i data-lucide="check-circle" class="w-6 h-6 text-green-500"></i>
                </div>
                <p class="text-slate-500 font-bold text-sm">No hay medicación para este turno.</p>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return; // Salimos de la función
    }

    // Si hay medicamentos, pintamos las tarjetas
    container.innerHTML = meds.map(m => {
        let borderColor = 'border-slate-200';
        let bgIcon = 'bg-slate-100 text-slate-500';
        let badgeStyle = 'text-slate-500 bg-slate-100 border border-slate-200';

        if (m.color === 'red') {
            borderColor = 'border-l-[#d32f2f]';
            bgIcon = 'bg-red-50 text-[#d32f2f]';
            badgeStyle = 'text-[#d32f2f] bg-red-50 border border-red-100';
        } else if (m.color === 'green') {
            borderColor = 'border-l-green-600';
            bgIcon = 'bg-blue-50 text-[#00529b]'; 
            badgeStyle = 'text-slate-500 bg-slate-100';
        }

        return `
        <div class="bg-white p-4 rounded-2xl shadow-sm border-l-4 ${borderColor} border-y border-r border-y-slate-100 border-r-slate-100 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div class="flex items-center gap-4 w-full">
                <div class="w-10 h-10 rounded-full flex items-center justify-center ${bgIcon}">
                    <i data-lucide="${m.icon}" class="w-5 h-5"></i>
                </div>
                <div class="flex-grow">
                    <h4 class="font-black text-slate-800">${m.nombre}</h4>
                    <p class="text-xs text-slate-500">${m.dosis}</p>
                    <div class="flex items-center justify-between mt-2">
                        <p class="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                            <i data-lucide="history" class="w-3 h-3"></i> ${m.frecuencia}
                        </p>
                        <span class="text-[9px] font-black uppercase px-2 py-1 rounded-md ${badgeStyle}">
                            ${m.proxima}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
}

export function renderHistorialTab() {
    const container = document.getElementById('historial-container');
    
    if (patientData.historial.length === 0) {
        container.innerHTML = '<p class="text-sm text-slate-500 ml-4">No hay registros en el historial.</p>';
        return;
    }

    container.innerHTML = patientData.historial.map(h => `
        <div class="relative pl-6 cursor-pointer group" onclick="renderHistoryDetail(${h.id})">
            <div class="absolute w-3 h-3 bg-[#00529b] rounded-full -left-[7px] top-1 border-2 border-white shadow-sm group-active:scale-125 transition-transform"></div>
            
            <p class="text-[10px] font-bold text-slate-400 mb-2 tracking-widest uppercase">${h.mesAnio || h.fechaCompleta}</p>
            
            <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group-active:bg-slate-50 transition-colors">
                <h4 class="font-black text-slate-800 mb-1 text-lg">${h.titulo}</h4>
                <p class="text-xs text-[#00529b] font-bold mb-2 flex items-center gap-1">
                    <i data-lucide="building-2" class="w-3.5 h-3.5"></i> ${h.lugar}
                </p>
                <p class="text-sm text-slate-500 line-clamp-2">${h.desc}</p>
            </div>
        </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
}

export function renderHistoryDetail(id) {
    const registro = patientData.historial.find(h => h.id === id);
    if (!registro) return;

    const container = document.getElementById('detail-container');
    
    container.innerHTML = `
        <div class="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-3 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1 h-full bg-[#00529b]"></div>
            <div class="flex items-center gap-1 text-[#00529b] bg-blue-50 w-fit px-2 py-1 rounded-md mb-3">
                <i data-lucide="clipboard-check" class="w-3 h-3"></i>
                <span class="text-[9px] font-black uppercase tracking-widest">${registro.tipo || 'REGISTRO MÉDICO'}</span>
            </div>
            <h3 class="text-2xl font-black text-slate-800 mb-2">${registro.titulo}</h3>
            <p class="text-xs text-slate-500 flex items-center gap-1.5 font-semibold">
                <i data-lucide="calendar" class="w-4 h-4"></i> ${registro.fechaCompleta} • ${registro.hora || '--:--'}
            </p>
        </div>

        <div class="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-3 flex items-start gap-4">
            <div class="bg-slate-50 p-2 rounded-xl text-slate-400">
                <i data-lucide="building-2" class="w-6 h-6"></i>
            </div>
            <div>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hospital/Centro</p>
                <p class="font-bold text-slate-800">${registro.lugar}</p>
            </div>
        </div>

        <div class="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-3 flex items-start gap-4">
            <div class="bg-slate-50 p-2 rounded-xl text-slate-400">
                <i data-lucide="stethoscope" class="w-6 h-6"></i>
            </div>
            <div>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Especialidad</p>
                <p class="font-bold text-slate-800">${registro.especialidad || 'General'}</p>
            </div>
        </div>

        <div class="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-3 flex items-start gap-4">
            <div class="bg-slate-50 p-2 rounded-xl text-slate-400">
                <i data-lucide="user-circle" class="w-6 h-6"></i>
            </div>
            <div>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Médico Tratante</p>
                <p class="font-bold text-slate-800">${registro.medico || 'No especificado'}</p>
            </div>
        </div>

        <div class="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-6">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <i data-lucide="align-left" class="w-4 h-4"></i> Notas o Comentarios
            </h4>
            <p class="text-sm text-slate-700 leading-relaxed bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                ${registro.desc}
            </p>
        </div>

        <div class="space-y-3 mt-8">
            <button class="w-full bg-[#00529b] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all">
                <i data-lucide="edit" class="w-5 h-5"></i> Editar Registro
            </button>
            <button onclick="deleteHistoryEvent(${registro.id})" class="w-full bg-white text-red-500 border border-red-100 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all">
                <i data-lucide="trash-2" class="w-5 h-5"></i> Eliminar Registro
            </button>
        </div>
    `;

    // Abrir la vista de detalle
    toggleHistoryView('detail');
    if (window.lucide) window.lucide.createIcons();
}