import { patientData } from '../config/mockData.js';

export function renderData() {
    // Alergias
    document.getElementById('alergias-container').innerHTML = patientData.alergias.map(a => `
        <span class="bg-red-50 text-[#d32f2f] border border-red-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
            <i data-lucide="ban" class="w-3 h-3"></i> ${a}
        </span>
    `).join('');
    document.getElementById('sangre-text').innerText = patientData.perfil.sangre;

    // Contactos (CON EMPTY STATE)
    if (patientData.contactos && patientData.contactos.length > 0) {
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
    } else {
        document.getElementById('contactos-container').innerHTML = `
            <div class="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-5 text-center shadow-sm">
                <i data-lucide="users" class="w-6 h-6 text-slate-400 mx-auto mb-2"></i>
                <p class="text-sm font-bold text-slate-600">Sin contactos de emergencia</p>
                <p class="text-xs text-slate-500 mt-1">Añádelos editando tu <span class="font-bold text-[#00529b]">Perfil</span>.</p>
            </div>
        `;
    }

    // Medicación (CON EMPTY STATE Y BADGE DE TURNO)
    if (patientData.medicacion && patientData.medicacion.length > 0) {
        document.getElementById('medicacion-container').innerHTML = patientData.medicacion.map(m => {
            // Asignamos una combinación de estilos de Tailwind según el turno
            let turnoColor = "bg-amber-50 text-amber-700 border-amber-100"; // Mañana
            if (m.turno === 'tarde') turnoColor = "bg-blue-50 text-blue-700 border-blue-100"; // Tarde
            if (m.turno === 'noche') turnoColor = "bg-slate-100 text-slate-700 border-slate-200"; // Noche

            return `
            <div class="flex gap-4 p-3 bg-blue-50/50 rounded-2xl border border-blue-100/50 items-center justify-between">
                <div class="flex items-center gap-4">
                    <div class="bg-white p-2 rounded-lg shadow-sm h-fit shrink-0">
                        <i data-lucide="${m.icon || 'pill'}" class="text-blue-500 w-4 h-4"></i>
                    </div>
                    <div>
                        <p class="font-bold text-sm text-slate-800">${m.nombre}</p>
                        <p class="text-xs text-slate-500">${m.dosis} • <span class="text-blue-600 font-semibold uppercase">${m.frecuencia}</span></p>
                    </div>
                </div>
                <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${turnoColor} shrink-0">
                    ${m.turno}
                </span>
            </div>
            `;
        }).join('');
    } else {
        document.getElementById('medicacion-container').innerHTML = `
            <div class="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-5 text-center shadow-sm">
                <i data-lucide="pill" class="w-6 h-6 text-slate-400 mx-auto mb-2"></i>
                <p class="text-sm font-bold text-slate-600">Sin medicación activa</p>
                <p class="text-xs text-slate-500 mt-1">Regístrala en la pestaña de <span class="font-bold text-blue-600">Medicinas</span>.</p>
            </div>
        `;
    }

    // Seguro e Historial
    // Seguro Médico (CON EMPTY STATE)
    const tieneSeguro = patientData.seguro && patientData.seguro.compania && patientData.seguro.compania !== "" && patientData.seguro.compania !== "Ninguno";

    if (tieneSeguro) {
        document.getElementById('seguro-container').innerHTML = `
            <p class="text-lg font-bold">${patientData.seguro.compania}</p>
            <div class="flex justify-between items-end">
                <div>
                    <p class="text-[10px] uppercase text-slate-400 font-bold">Póliza</p>
                    <p class="font-mono text-xs">${patientData.seguro.poliza || '--'}</p>
                </div>
                <span class="text-xs font-bold text-blue-400 uppercase">${patientData.seguro.tipo || '--'}</span>
            </div>
        `;
    } else {
        document.getElementById('seguro-container').innerHTML = `
            <div class="text-center py-2">
                <i data-lucide="shield-off" class="w-6 h-6 text-slate-500 mx-auto mb-2"></i>
                <p class="text-sm font-bold text-slate-300">Sin seguro registrado</p>
                <p class="text-xs text-slate-500 mt-1">Añádelo editando tu <span class="font-bold text-blue-400">Perfil</span>.</p>
            </div>
        `;
    }

    const registrosOrdenadosHome = [...patientData.historial].sort((a, b) => {
        const datetimeA = `${a.fechaRaw || ''}T${a.hora || '00:00'}`;
        const datetimeB = `${b.fechaRaw || ''}T${b.hora || '00:00'}`;
        return datetimeB.localeCompare(datetimeA); // Descendente
    });

    document.getElementById('historial-container').innerHTML = registrosOrdenadosHome.map(h => `
        <div class="relative pl-6">
            <div class="absolute w-4 h-4 bg-[#00529b] rounded-full -left-[9px] top-1 border-4 border-slate-50"></div>
            <p class="text-xs font-bold text-slate-400 mb-1 tracking-widest uppercase">${h.fechaCompleta || h.mesAnio}</p>
            <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <h4 class="font-bold text-slate-800 mb-1">${h.titulo}</h4>
                <p class="text-xs text-[#00529b] font-semibold mb-2 flex items-center gap-1">
                    <i data-lucide="building" class="w-3 h-3"></i> ${h.lugar}
                </p>
                <p class="text-sm text-slate-500">${h.desc}</p>
            </div>
        </div>
    `).join('');

    // Perfil
    document.getElementById('perfil-nombre').innerText = patientData.perfil.nombre;
    document.getElementById('perfil-dni').innerText = patientData.perfil.dni || 'Sin DNI registrado';
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
    
    renderHistorialTab();
    
    // Renderizamos los iconos de los nuevos mensajes si acaban de aparecer
    if (window.lucide) window.lucide.createIcons();
}

export function showDataModal(data) {
    const modalElement = document.getElementById('data-modal');
    document.getElementById('modal-nombre').innerText = data.perfil.nombre || "Desconocido";
    document.getElementById('modal-sangre').innerText = data.perfil.sangre || "--";
    
    const emergencyTel = data.telefono_emergencia || patientData.contactos.find(c => c.principal)?.telefono || "";
    
    // 1. Quitamos el .parentElement y apuntamos directo al contenedor
    const idContainer = document.getElementById('modal-id');
    
    // 2. Quitamos la etiqueta <p>Emergencia</p> de aquí porque ya está segura en el HTML
    idContainer.innerHTML = `
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
    const meds = patientData.medicacion.filter(m => m.turno === turnoSeleccionado);

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
        return;
    }

    container.innerHTML = meds.map(m => {
        let borderColor = 'border-slate-200';
        let bgIcon = 'bg-slate-100 text-slate-500';

        if (m.color === 'red') {
            borderColor = 'border-l-[#d32f2f]'; bgIcon = 'bg-red-50 text-[#d32f2f]';
        } else {
            borderColor = 'border-l-blue-600'; bgIcon = 'bg-blue-50 text-[#00529b]'; 
        }

        return `
        <div class="bg-white p-4 rounded-2xl shadow-sm border-l-4 ${borderColor} border-y border-r border-slate-100 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div class="flex items-center gap-4 w-full">
                <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bgIcon}">
                    <i data-lucide="${m.icon || 'pill'}" class="w-5 h-5"></i>
                </div>
                <div class="flex-grow">
                    <div class="flex justify-between items-start">
                        <h4 class="font-black text-slate-800">${m.nombre}</h4>
                        
                        <div class="flex gap-1 -mt-1">
                            <button onclick="editMedication(${m.id})" class="p-1 text-slate-400 hover:text-blue-600 active:scale-75 transition-transform">
                                <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                            </button>
                            <button onclick="deleteMedication(${m.id})" class="p-1 text-slate-400 hover:text-red-600 active:scale-75 transition-transform">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                    
                    <p class="text-xs text-slate-500">${m.dosis}</p>
                    <div class="flex items-center justify-between mt-2">
                        <p class="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                            <i data-lucide="history" class="w-3 h-3"></i> ${m.frecuencia}
                        </p>
                        
                        <button onclick="takeMedication(${m.id})" class="text-[9px] font-black uppercase px-2 py-1 rounded-md bg-green-50 text-green-700 border border-green-100 flex items-center gap-1 active:scale-95 shadow-sm transition-all">
                            <i data-lucide="check" class="w-2.5 h-2.5"></i> Confirmar Toma
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
}


export function renderMedsHistoryTab() {
    const container = document.getElementById('meds-history-container');
    if (!container) return;
    
    const historialtomas = patientData.historial_medicacion || [];
    
    if (historialtomas.length === 0) {
        container.innerHTML = `
            <div class="text-center p-8 bg-slate-50 border border-dashed border-slate-300 rounded-2xl shadow-inner">
                <i data-lucide="history" class="w-6 h-6 text-slate-400 mx-auto mb-2"></i>
                <p class="text-slate-500 font-bold text-sm">No hay tomas registradas todavía.</p>
                <p class="text-xs text-slate-400 mt-0.5">Pulsa en "Confirmar Toma" dentro de tus medicamentos diarios.</p>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
    }
    
    // Lo ordenamos para ver la toma más reciente arriba del todo
    const ordenado = [...historialtomas].sort((a, b) => b.timestamp - a.timestamp);
    
    container.innerHTML = ordenado.map(h => `
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center animate-in fade-in duration-200">
            <div class="flex items-center gap-3">
                <div class="bg-green-50 p-2 rounded-xl text-green-600 shadow-sm border border-green-100">
                    <i data-lucide="check-circle-2" class="w-5 h-5"></i>
                </div>
                <div>
                    <p class="font-black text-slate-800 text-sm">${h.nombre}</p>
                    <p class="text-xs text-slate-500">${h.dosis}</p>
                </div>
            </div>
            <p class="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md shadow-sm">${h.fechaFormateada}</p>
        </div>
    `).join('');
    
    if (window.lucide) window.lucide.createIcons();
}

export function renderHistorialTab() {
    const container = document.getElementById('historial-container');
    
    if (patientData.historial.length === 0) {
        container.innerHTML = '<p class="text-sm text-slate-500 ml-4">No hay registros en el historial.</p>';
        return;
    }

    // Ordenamos una copia del array por fecha y hora de forma descendente (lo más reciente arriba)
    const registrosOrdenados = [...patientData.historial].sort((a, b) => {
        const datetimeA = `${a.fechaRaw || ''}T${a.hora || '00:00'}`;
        const datetimeB = `${b.fechaRaw || ''}T${b.hora || '00:00'}`;
        return datetimeB.localeCompare(datetimeA);
    });

    container.innerHTML = registrosOrdenados.map(h => `
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
            <button onclick="editHistoryEvent(${registro.id})" class="w-full bg-[#00529b] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all">
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

export function renderSettingsLists() {
    // 1. Dibujar Alergias
    const contAlergias = document.getElementById('list-settings-alergias');
    if (contAlergias) {
        contAlergias.innerHTML = (patientData.alergias || []).map((a, index) => `
            <span class="bg-red-50 text-[#d32f2f] border border-red-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm">
                ${a}
                <button type="button" onclick="deleteAlergia(${index})" class="text-red-400 hover:text-red-700 ml-1"><i data-lucide="x" class="w-3 h-3"></i></button>
            </span>
        `).join('');
    }

    // 2. Dibujar Contactos
    const contContactos = document.getElementById('list-settings-contactos');
    if (contContactos) {
        contContactos.innerHTML = (patientData.contactos || []).map((c, index) => `
            <div class="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                <div>
                    <p class="font-bold text-sm text-slate-800">${c.nombre} ${c.principal ? '<span class="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded ml-1">PRINCIPAL</span>' : ''}</p>
                    <p class="text-xs text-slate-500 font-mono">${c.telefono}</p>
                </div>
                <button type="button" onclick="deleteContacto(${index})" class="bg-red-50 p-2 rounded-lg text-red-500 active:scale-90 transition-transform">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `).join('');
    }
    if (window.lucide) window.lucide.createIcons();
}