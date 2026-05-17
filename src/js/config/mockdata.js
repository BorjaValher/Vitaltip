export const patientData = {
    perfil: {
        nombre: "Alejandro García Martínez",
        id: "DNI: 12345678X",
        nacimiento: "12/05/1990",
        sangre: "O Positivo (O+)",
        peso: "78 kg",
        altura: "182 cm",
        direccion: "Calle Mayor 123, 4B, Madrid, España"
    },
    alergias: ["Penicilina", "Frutos secos", "Látex"],
    contactos: [
        { nombre: "Elena García", relacion: "Hermana", telefono: "+34600000000", principal: true },
        { nombre: "Dr. Roberto Sanz", relacion: "Médico de Cabecera", telefono: "+34912345678", principal: false }
    ],
    medicacion: [
        { 
            nombre: "Amoxicilina", 
            dosis: "500mg - Antibiótico", 
            frecuencia: "Cada 8 horas", 
            turno: "tarde", 
            proxima: "SIGUIENTE - 14:00", 
            color: "red",
            icon: "pill"
        },
        { 
            nombre: "Lisinopril", 
            dosis: "10mg - Presión Arterial", 
            frecuencia: "1 vez al día", 
            turno: "mañana", 
            proxima: "MAÑANA 08:00", 
            color: "green",
            icon: "activity"
        },
        { 
            nombre: "Ibuprofeno", 
            dosis: "400mg - Alivio del Dolor", 
            frecuencia: "Según necesidad", 
            turno: "noche", 
            proxima: "SEGÚN NECESIDAD", 
            color: "slate",
            icon: "thermometer"
        }
    ],
    seguro: {
        compania: "Sanitas / Adeslas",
        poliza: "998877665544",
        tipo: "Cobertura Total"
    },
    historial: [
        { 
            id: 1,
            mesAnio: "MARZO 2023",
            fechaCompleta: "12 de Marzo, 2023",
            hora: "08:30 AM",
            tipo: "Cirugía Programada",
            titulo: "Apendicectomía", 
            lugar: "Hospital La Paz", 
            especialidad: "Cirugía General",
            medico: "Dr. Roberto Sánchez",
            desc: "Intervención sin complicaciones. El paciente debe guardar reposo absoluto durante 48 horas. Dieta líquida por 24 horas y luego progresar a blanda según tolerancia. Control en 7 días para retiro de puntos." 
        },
        { 
            id: 2,
            mesAnio: "ENERO 2021",
            fechaCompleta: "15 de Enero, 2021",
            hora: "16:45 PM",
            tipo: "Urgencias",
            titulo: "Fractura de radio", 
            lugar: "Urgencias Clínicas", 
            especialidad: "Traumatología",
            medico: "Dra. Elena Gómez",
            desc: "Brazo derecho. Reposo de 4 semanas con inmovilización. Rehabilitación posterior." 
        },
        { 
            id: 3,
            mesAnio: "DICIEMBRE 2018",
            fechaCompleta: "03 de Diciembre, 2018",
            hora: "10:00 AM",
            tipo: "Consulta General",
            titulo: "Diagnóstico Asma", 
            lugar: "Neumología", 
            especialidad: "Neumología",
            medico: "Dr. Carlos Ruiz",
            desc: "Asma alérgica estacional leve. Se prescribe tratamiento inhalador SOS." 
        }
    ]
};