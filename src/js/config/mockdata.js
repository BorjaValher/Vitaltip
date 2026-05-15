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
        { nombre: "Ventolin", dosis: "1 inhalación", frecuencia: "SOS", icon: "wind" },
        { nombre: "Cetirizina 10mg", dosis: "1 comprimido", frecuencia: "Noche", icon: "moon" }
    ],
    seguro: {
        compania: "Sanitas / Adeslas",
        poliza: "998877665544",
        tipo: "Cobertura Total"
    },
    historial: [
        { fecha: "Marzo 2023", evento: "Apendicectomía", lugar: "Hospital La Paz", desc: "Cirugía general sin complicaciones." },
        { fecha: "Enero 2021", evento: "Fractura de radio", lugar: "Urgencias Clínicas", desc: "Brazo derecho. Reposo de 4 semanas." },
        { fecha: "Diciembre 2018", evento: "Diagnóstico Asma", lugar: "Neumología", desc: "Asma alérgica estacional leve." }
    ]
};