import { Plan, DesignTemplate, Project, EventSettings, Guest, Blessing, EventPhoto, PaymentTransaction, AdminNotification } from '../types';

export const INITIAL_PLANS: Plan[] = [
  {
    id: 'bronce',
    name: 'Plan Bronce',
    price: 45000,
    currency: 'ARS',
    description: 'La opción esencial y elegante para compartir tu evento en celular con confirmación inmediata.',
    features: [
      'Invitación digital personalizada',
      'Imagen y portada principal destacada',
      'Nombre de homenajeados, fecha, hora y lugar',
      'Mensaje inicial y frase conmemorativa',
      'Música de fondo seleccionable',
      'Cuenta regresiva en tiempo real',
      'Confirmación de asistencia básica (RSVP)',
      'Enlace público personalizado',
      'Vista optimizada para celular',
      'Botón directo para compartir por WhatsApp',
      'Hasta 25 invitados'
    ],
    maxInvitationPhotos: 0,
    maxEventPhotos: 0,
    maxGuests: 25,
    hasEnvelopeAnimation: false,
    hasTvMode: false,
    hasGuestbook: false,
    hasCustomGuestLinks: false,
    hasWhatsappReminders: false,
    hasGoogleDriveExport: false,
    active: true
  },
  {
    id: 'plata',
    name: 'Plan Plata',
    price: 52000,
    currency: 'ARS',
    badge: 'Más Elegido',
    description: 'Control total de invitados, galería fotográfica y libro de buenos deseos en tiempo real.',
    features: [
      'Todo lo incluido en el Plan Bronce',
      'Hasta 50 invitados',
      'Carrusel de fotos de hasta 7 imágenes',
      'Fotos en alta definición sin marca de agua',
      'Libro de buenos deseos interactivo',
      'Panel de control de asistencia avanzado',
      'Estados de invitado: pendiente, confirmado, no asiste',
      'Enlace personalizado para cada invitado con parentesco',
      'Generador de envíos de invitaciones por WhatsApp',
      'Recordatorios automatizados por WhatsApp',
      'Registro de fecha de envío y actualización',
      'Resumen de cupos de adultos y menores'
    ],
    maxInvitationPhotos: 7,
    maxEventPhotos: 0,
    maxGuests: 50,
    hasEnvelopeAnimation: false,
    hasTvMode: false,
    hasGuestbook: true,
    hasCustomGuestLinks: true,
    hasWhatsappReminders: true,
    hasGoogleDriveExport: false,
    active: true
  },
  {
    id: 'oro',
    name: 'Plan Oro',
    price: 60000,
    currency: 'ARS',
    badge: 'Experiencia VIP',
    description: 'La experiencia completa e inmersiva: sobre animado, pantalla TV interactiva para la fiesta y fotos en vivo.',
    features: [
      'Todo lo incluido en el Plan Plata',
      'Más de 50 invitados (Ilimitados)',
      'Sobre animado interactivo con sello de cera y música al abrir',
      'Música de fondo con selector de temas y volumen',
      'Carrusel de hasta 15 fotos con vista Coverflow 3D',
      'Marca de agua opcional personalizada con nombre del invitado',
      'Hasta 100 fotos cargadas en vivo por los invitados el día del evento',
      'Página especial de subida de fotos desde celular para invitados',
      'Pantalla de presentación para TV con fotos y bendiciones en tiempo real',
      'Modo TV pantalla completa con carrusel 3D y velocidad regulable',
      'Exportación del libro de recuerdos a PDF',
      'Descarga organizada de fotos con servicio temporal Google Drive (10 días)',
      'Soporte preferencial y ajustes prioritarios'
    ],
    maxInvitationPhotos: 15,
    maxEventPhotos: 100,
    maxGuests: 9999,
    hasEnvelopeAnimation: true,
    hasTvMode: true,
    hasGuestbook: true,
    hasCustomGuestLinks: true,
    hasWhatsappReminders: true,
    hasGoogleDriveExport: true,
    active: true
  }
];

export const INITIAL_TEMPLATES: DesignTemplate[] = [
  // 1. Bodas (3 modelos)
  {
    id: 'boda-champagne',
    eventType: 'boda',
    name: 'Clásico Champagne',
    description: 'Estilo señorial con detalles dorados, tipografía clásica y texturas marfil para bodas tradicionales.',
    previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'bronce',
    palette: {
      primary: '#d4af37',
      secondary: '#faf8f5',
      accent: '#2c2523',
      background: '#fffdfa',
      text: '#3b322f'
    },
    fontFamily: 'serif',
    envelopeColor: '#c5a059',
    waxSealSymbol: '⚜️',
    sampleHonoree: 'Valentina & Mateo',
    sampleDate: '2026-11-21',
    sampleLocation: 'Estancia La Candelaria, Buenos Aires',
    samplePhrase: 'Dos vidas, dos corazones, un solo amor para siempre.'
  },
  {
    id: 'boda-jardin',
    eventType: 'boda',
    name: 'Jardín Botánico',
    description: 'Fresco y natural, con acentos en verde eucalipto, motivos florales y calidez al aire libre.',
    previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'plata',
    palette: {
      primary: '#4a6741',
      secondary: '#f2f6f1',
      accent: '#a3845b',
      background: '#fcfdfb',
      text: '#223322'
    },
    fontFamily: 'script',
    envelopeColor: '#3d5835',
    waxSealSymbol: '🌿',
    sampleHonoree: 'Camila & Lucas',
    sampleDate: '2026-10-17',
    sampleLocation: 'Quinta Las Magnolias, San Isidro',
    samplePhrase: 'Bajo el sol y rodeados de flores queremos celebrar el inicio de nuestra historia.'
  },
  {
    id: 'boda-noche',
    eventType: 'boda',
    name: 'Noche Elegante',
    description: 'Lujo contemporáneo en negro azabache, plata y brillo nocturno para veladas de etiqueta.',
    previewImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'oro',
    palette: {
      primary: '#1a1a24',
      secondary: '#262838',
      accent: '#d4af37',
      background: '#0d0d12',
      text: '#f5f5f7'
    },
    fontFamily: 'cinzel',
    envelopeColor: '#181926',
    waxSealSymbol: '✨',
    sampleHonoree: 'Sofía & Nicolás',
    sampleDate: '2026-12-05',
    sampleLocation: 'Salón Alvear Palace Hotel, CABA',
    samplePhrase: 'Una noche única para brindar, soñar y celebrar que el amor nos unió.'
  },

  // 2. Cumpleaños (3 modelos)
  {
    id: 'cumple-colorido',
    eventType: 'cumpleanos',
    name: 'Fiesta Colorida',
    description: 'Vibrante, alegre y llena de confeti para festejos dinámicos de cualquier edad.',
    previewImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'bronce',
    palette: {
      primary: '#ff4081',
      secondary: '#fff0f5',
      accent: '#ffb300',
      background: '#ffffff',
      text: '#2d3748'
    },
    fontFamily: 'sans',
    envelopeColor: '#e91e63',
    waxSealSymbol: '🎈',
    sampleHonoree: 'Martín - ¡Mis 30!',
    sampleDate: '2026-09-26',
    sampleLocation: 'Terraza Palermo Soho, Buenos Aires',
    samplePhrase: '¡Llegaron los 30 y sobran motivos para festejarlo a lo grande con amigos y buena música!'
  },
  {
    id: 'cumple-minimal',
    eventType: 'cumpleanos',
    name: 'Minimal Cumple',
    description: 'Diseño sobrio, moderno y con espacios limpios para cumpleaños gourmet o íntimos.',
    previewImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'plata',
    palette: {
      primary: '#2d3748',
      secondary: '#edf2f7',
      accent: '#dd6b20',
      background: '#f7fafc',
      text: '#1a202c'
    },
    fontFamily: 'sans',
    envelopeColor: '#4a5568',
    waxSealSymbol: '🎂',
    sampleHonoree: 'Joaquín 40 Años',
    sampleDate: '2026-11-14',
    sampleLocation: 'Cava & Bistro Bellas Artes',
    samplePhrase: 'Una copa de buen vino, grandes anécdotas y las personas más queridas.'
  },
  {
    id: 'cumple-neon',
    eventType: 'cumpleanos',
    name: 'Neón Party',
    description: 'Estética electrónica y nocturna con destellos flúo y energía de pista de baile.',
    previewImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'oro',
    palette: {
      primary: '#00f2fe',
      secondary: '#131127',
      accent: '#f72585',
      background: '#0a0914',
      text: '#ffffff'
    },
    fontFamily: 'sans',
    envelopeColor: '#2b0938',
    waxSealSymbol: '⚡',
    sampleHonoree: 'Fede Fest DJ Night',
    sampleDate: '2026-10-31',
    sampleLocation: 'Club Hangar 18, Costanera',
    samplePhrase: 'Prepara tu mejor outfit neón porque la pista no descansa hasta que salga el sol.'
  },

  // 3. 15 Años (3 modelos)
  {
    id: '15-blush',
    eventType: '15anos',
    name: 'Blush Real',
    description: 'Tonalidades rosa empolvado, destellos de corona y elegancia digna de una princesa moderna.',
    previewImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'bronce',
    palette: {
      primary: '#d48b9f',
      secondary: '#fbf4f6',
      accent: '#c5a059',
      background: '#fffbfc',
      text: '#4a3840'
    },
    fontFamily: 'script',
    envelopeColor: '#c97890',
    waxSealSymbol: '👑',
    sampleHonoree: 'Mis 15 - Mía Guadalupe',
    sampleDate: '2026-11-07',
    sampleLocation: 'Salón Esplendor, San Isidro',
    samplePhrase: 'Una noche mágica donde los sueños comienzan a hacerse realidad.'
  },
  {
    id: '15-estrellas',
    eventType: '15anos',
    name: 'Estrellas & Galaxia',
    description: 'Fondo azul noche profundo con constelaciones doradas y glamour celestial.',
    previewImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'plata',
    palette: {
      primary: '#1d2a44',
      secondary: '#253556',
      accent: '#f9d342',
      background: '#0f172a',
      text: '#f8fafc'
    },
    fontFamily: 'cinzel',
    envelopeColor: '#1e293b',
    waxSealSymbol: '⭐',
    sampleHonoree: 'Lara - Noche de Estrellas',
    sampleDate: '2026-12-12',
    sampleLocation: 'Palacio San Miguel, CABA',
    samplePhrase: 'Brillaré con la luz de quienes me acompañaron en cada paso de estos quince años.'
  },
  {
    id: '15-jardin-ensueno',
    eventType: '15anos',
    name: 'Jardín de Ensueño',
    description: 'Flores en acuarela, toques de lila y mariposas con carrusel inmersivo y sobre de seda.',
    previewImage: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'oro',
    palette: {
      primary: '#8e7cc3',
      secondary: '#f7f4fc',
      accent: '#e06666',
      background: '#fefefe',
      text: '#3d3052'
    },
    fontFamily: 'script',
    envelopeColor: '#7b68a8',
    waxSealSymbol: '🦋',
    sampleHonoree: 'Victoria en su Jardín Mágico',
    sampleDate: '2026-10-24',
    sampleLocation: 'Finca Los Álamos, Mendoza',
    samplePhrase: 'Abro mis alas hacia una nueva etapa llena de ilusiones compartidas.'
  },

  // 4. Bautismo (3 modelos)
  {
    id: 'bautismo-celestial',
    eventType: 'bautismo',
    name: 'Luz Celestial',
    description: 'Suaves celestes, nubes y marfil que transmiten inocencia, pureza y bendición.',
    previewImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'bronce',
    palette: {
      primary: '#7ea8cf',
      secondary: '#f0f6fa',
      accent: '#d4af37',
      background: '#fafcff',
      text: '#2c3e50'
    },
    fontFamily: 'serif',
    envelopeColor: '#6896c2',
    waxSealSymbol: '🕊️',
    sampleHonoree: 'Bautismo de Benjamín',
    sampleDate: '2026-09-20',
    sampleLocation: 'Parroquia Nuestra Señora de la Merced',
    samplePhrase: 'Señor, toma sus pequeñas manos y guíalo siempre por el camino del amor.'
  },
  {
    id: 'bautismo-angel',
    eventType: 'bautismo',
    name: 'Dulce Ángel',
    description: 'Tonos pasteles cálidos en rosa y durazno suave con destellos tiernos de amor familiar.',
    previewImage: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'plata',
    palette: {
      primary: '#e8a598',
      secondary: '#fdf3f1',
      accent: '#c0a080',
      background: '#fffaf9',
      text: '#443330'
    },
    fontFamily: 'script',
    envelopeColor: '#d68b7e',
    waxSealSymbol: '👼',
    sampleHonoree: 'Bautismo de Emma',
    sampleDate: '2026-10-18',
    sampleLocation: 'Iglesia San Benito Abad & Té Familiar',
    samplePhrase: 'Un angelito que llegó a nuestras vidas para colmarla de infinita felicidad.'
  },
  {
    id: 'bautismo-olivo',
    eventType: 'bautismo',
    name: 'Olivo y Marfil',
    description: 'Estética botánica pastoral con ramas de olivo, texturas de lino y tipografía clásica.',
    previewImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'oro',
    palette: {
      primary: '#6b7a60',
      secondary: '#f4f6f2',
      accent: '#b89f70',
      background: '#fbfcf9',
      text: '#333b2e'
    },
    fontFamily: 'serif',
    envelopeColor: '#58674d',
    waxSealSymbol: '🌿',
    sampleHonoree: 'Bautismo de Bautista',
    sampleDate: '2026-11-08',
    sampleLocation: 'Capilla San José & Almuerzo Campestre',
    samplePhrase: 'Que la luz del Espíritu Santo ilumine y bendiga cada día de su vida.'
  },

  // 5. Primera Comunión (3 modelos) - Reference Core Model Included
  {
    id: 'comunion-sacramento',
    eventType: 'comunion',
    name: 'Sacramento Dorado',
    description: 'El diseño oficial de referencia con sobre animado, cáliz sacro, pan y uvas, música celestial y libro de deseos.',
    previewImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'oro',
    palette: {
      primary: '#b8860b',
      secondary: '#fdfbf7',
      accent: '#8b6508',
      background: '#fffdfa',
      text: '#2e261a'
    },
    fontFamily: 'serif',
    envelopeColor: '#c59b27',
    waxSealSymbol: '✝️',
    sampleHonoree: 'Santiago Tomás',
    sampleDate: '2026-10-10',
    sampleLocation: 'Catedral San Juan Bautista & Salón Los Robles',
    samplePhrase: 'Jesús, en este día tan especial, haz que mi corazón sea siempre un sagrario de tu amor y tu paz.'
  },
  {
    id: 'comunion-luz-fe',
    eventType: 'comunion',
    name: 'Luz de Fe',
    description: 'Diseño sereno en marfil y oro blanco con símbolos eucarísticos sutiles y confirmación rápida.',
    previewImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'bronce',
    palette: {
      primary: '#9e8557',
      secondary: '#fbf9f5',
      accent: '#6b5837',
      background: '#ffffff',
      text: '#383226'
    },
    fontFamily: 'cinzel',
    envelopeColor: '#967d4f',
    waxSealSymbol: '🕊️',
    sampleHonoree: 'María Pilar',
    sampleDate: '2026-11-15',
    sampleLocation: 'Parroquia Sagrado Corazón',
    samplePhrase: 'Doy gracias a Dios por recibir hoy el sagrado cuerpo de Cristo junto a mi familia.'
  },
  {
    id: 'comunion-clasico-sacro',
    eventType: 'comunion',
    name: 'Clásico Sacro',
    description: 'Acentos en azul marino sacral con filigranas de plata y carrusel de recuerdos litúrgicos.',
    previewImage: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'plata',
    palette: {
      primary: '#1a365d',
      secondary: '#edf2f7',
      accent: '#c5a059',
      background: '#f7fafc',
      text: '#1a202c'
    },
    fontFamily: 'serif',
    envelopeColor: '#1e3a8a',
    waxSealSymbol: '⛪',
    sampleHonoree: 'Ignacio Andrés',
    sampleDate: '2026-10-25',
    sampleLocation: 'Basílica de Nuestra Señora del Pilar',
    samplePhrase: 'Mi Primera Comunión: un paso de fe, amor y agradecimiento.'
  },

  // 6. Confirmación (3 modelos)
  {
    id: 'confirmacion-camino',
    eventType: 'confirmacion',
    name: 'Camino de Fe',
    description: 'Diseño solemne con tonos arena, cruz estilizada y lectura evangélica destacada.',
    previewImage: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'bronce',
    palette: {
      primary: '#8c6d46',
      secondary: '#f9f6f0',
      accent: '#5e482e',
      background: '#fffdf9',
      text: '#2e261e'
    },
    fontFamily: 'cinzel',
    envelopeColor: '#785b37',
    waxSealSymbol: '🔥',
    sampleHonoree: 'Confirmación de Lucas Gabriel',
    sampleDate: '2026-11-28',
    sampleLocation: 'Parroquia San Gabriel Arcángel',
    samplePhrase: 'Confirmo mi fe y asumo con alegría el compromiso de caminar junto al Señor.'
  },
  {
    id: 'confirmacion-espiritu',
    eventType: 'confirmacion',
    name: 'Espíritu Santo',
    description: 'Rojos bermellón y dorados que evocan la fuerza de Pentecostés y los dones espirituales.',
    previewImage: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'plata',
    palette: {
      primary: '#991b1b',
      secondary: '#fef2f2',
      accent: '#d97706',
      background: '#ffffff',
      text: '#450a0a'
    },
    fontFamily: 'serif',
    envelopeColor: '#7f1d1d',
    waxSealSymbol: '🕊️',
    sampleHonoree: 'Confirmación de Martina',
    sampleDate: '2026-10-17',
    sampleLocation: 'Santuario Jesús Misericordioso',
    samplePhrase: 'Recibe por esta señal el don del Espíritu Santo.'
  },
  {
    id: 'confirmacion-azul-sagrado',
    eventType: 'confirmacion',
    name: 'Azul Sagrado',
    description: 'Azul profundo de la gracia con detalles dorados, sobre interactivo y pantalla TV.',
    previewImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'oro',
    palette: {
      primary: '#1e3a8a',
      secondary: '#eff6ff',
      accent: '#eab308',
      background: '#f8fafc',
      text: '#0f172a'
    },
    fontFamily: 'cinzel',
    envelopeColor: '#172554',
    waxSealSymbol: '✨',
    sampleHonoree: 'Confirmación de Felipe',
    sampleDate: '2026-12-04',
    sampleLocation: 'Catedral San Isidro Labrador',
    samplePhrase: 'Un nuevo compromiso de esperanza, servicio y amor al prójimo.'
  },

  // 7. Otros Eventos (3 modelos)
  {
    id: 'otros-celebracion',
    eventType: 'otros',
    name: 'Celebración Dorada',
    description: 'Diseño versátil para aniversarios de boda, bodas de oro, graduaciones o galas.',
    previewImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'bronce',
    palette: {
      primary: '#b45309',
      secondary: '#fef3c7',
      accent: '#78350f',
      background: '#fffbeb',
      text: '#451a03'
    },
    fontFamily: 'serif',
    envelopeColor: '#92400e',
    waxSealSymbol: '🥂',
    sampleHonoree: 'Bodas de Oro: Marta & Jorge',
    sampleDate: '2026-11-20',
    sampleLocation: 'Club Náutico San Fernando',
    samplePhrase: '50 años de amor, complicidad y familia. Queremos brindar con quienes hicieron posible este camino.'
  },
  {
    id: 'otros-galeria',
    eventType: 'otros',
    name: 'Galería & Arte',
    description: 'Limpio y artístico para vernissages, lanzamientos, despedidas y eventos corporativos selectos.',
    previewImage: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'plata',
    palette: {
      primary: '#0f172a',
      secondary: '#f1f5f9',
      accent: '#0284c7',
      background: '#ffffff',
      text: '#334155'
    },
    fontFamily: 'sans',
    envelopeColor: '#1e293b',
    waxSealSymbol: '🎨',
    sampleHonoree: 'Inauguración Estudio Creativo',
    sampleDate: '2026-10-09',
    sampleLocation: 'Distrito de las Artes, La Boca',
    samplePhrase: 'Una invitación a descubrir nuevas perspectivas visuales y compartir un cocktail exclusivo.'
  },
  {
    id: 'otros-personalizado',
    eventType: 'otros',
    name: 'Gala Prestige',
    description: 'Personalización a medida con carrusel 3D, sobre virtual y pantalla TV para recepciones protocolares.',
    previewImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop&q=80',
    requiredPlan: 'oro',
    palette: {
      primary: '#312e81',
      secondary: '#eef2ff',
      accent: '#c084fc',
      background: '#faf5ff',
      text: '#1e1b4b'
    },
    fontFamily: 'cinzel',
    envelopeColor: '#3730a3',
    waxSealSymbol: '💎',
    sampleHonoree: 'Cena Anual de Beneficencia',
    sampleDate: '2026-12-18',
    sampleLocation: 'Hotel Four Seasons, CABA',
    samplePhrase: 'Uniendo voluntades para construir un futuro mejor.'
  }
];

// Reference project for Primera Comunión ("Santiago Tomás")
export const REFERENCE_PROJECT: Project = {
  id: 'proj-comunion-santiago-2026',
  orderNumber: 'ORD-COMU-8921',
  clientId: 'client-hrgq-demo',
  clientEmail: 'hrgq.1984@gmail.com',
  clientPhone: '+54 9 3835 438603',
  honoreeName: 'Santiago Tomás',
  eventDate: '2026-10-10',
  eventType: 'comunion',
  templateId: 'comunion-sacramento',
  planId: 'oro',
  amount: 60000,
  currency: 'ARS',
  status: 'published',
  publicSlug: 'comunion-santiago',
  previewToken: 'tok-prev-santiago-9941',
  paymentMethod: 'transfer',
  paidAt: '2026-09-12T14:30:00.000Z',
  previewAvailableAt: '2026-09-12T14:30:00.000Z',
  publishedAt: '2026-09-13T08:00:00.000Z',
  expiresAt: '2026-10-25T23:59:59.000Z',
  googleDriveUrl: 'https://drive.google.com/drive/folders/demo-invitarte-santiago-oro',
  googleDriveExpiresAt: '2026-10-20T23:59:59.000Z',
  createdAt: '2026-09-12T10:00:00.000Z',
  updatedAt: '2026-09-13T08:00:00.000Z'
};

// Pedidos ingresantes recientes para validación y gestión
export const ORDER_CAMILA_LAUTARO: Project = {
  id: 'proj-boda-camila-lautaro',
  orderNumber: 'ORD-BODA-5120',
  clientId: 'client-camila-lautaro',
  clientEmail: 'camila.lautaro.boda@gmail.com',
  clientPhone: '+54 9 11 5566 7788',
  honoreeName: 'Camila & Lautaro',
  eventDate: '2026-11-21',
  eventType: 'boda',
  templateId: 'boda-elegante',
  planId: 'oro',
  amount: 60000,
  currency: 'ARS',
  status: 'payment_review',
  publicSlug: 'boda-camila-y-lautaro',
  previewToken: 'tok-prev-camila-8812',
  paymentMethod: 'transfer',
  receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80',
  createdAt: '2026-09-16T10:15:00.000Z',
  updatedAt: '2026-09-16T10:15:00.000Z'
};

export const ORDER_VALENTINA_MORALES: Project = {
  id: 'proj-15anos-valentina',
  orderNumber: 'ORD-15AN-7842',
  clientId: 'client-valentina-morales',
  clientEmail: 'familia.morales.xv@gmail.com',
  clientPhone: '+54 9 3835 441122',
  honoreeName: 'Valentina Morales',
  eventDate: '2026-12-05',
  eventType: '15anos',
  templateId: '15anos-glamour',
  planId: 'plata',
  amount: 52000,
  currency: 'ARS',
  status: 'payment_review',
  publicSlug: 'mis15-valentina-morales',
  previewToken: 'tok-prev-valentina-3341',
  paymentMethod: 'transfer',
  receiptUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=900&auto=format&fit=crop&q=80',
  createdAt: '2026-09-16T09:40:00.000Z',
  updatedAt: '2026-09-16T09:40:00.000Z'
};

export const ORDER_MATEO_GAEL: Project = {
  id: 'proj-bautismo-mateo',
  orderNumber: 'ORD-BAUT-9204',
  clientId: 'client-mateo-gael',
  clientEmail: 'papas.de.mateo@gmail.com',
  clientPhone: '+54 9 351 9882233',
  honoreeName: 'Mateo Gael',
  eventDate: '2026-10-18',
  eventType: 'bautismo',
  templateId: 'bautismo-angelical',
  planId: 'bronce',
  amount: 45000,
  currency: 'ARS',
  status: 'preview_available',
  publicSlug: 'bautismo-mateo-gael',
  previewToken: 'tok-prev-mateo-6712',
  paymentMethod: 'transfer',
  paidAt: '2026-09-15T18:00:00.000Z',
  previewAvailableAt: '2026-09-15T18:00:00.000Z',
  expiresAt: '2026-09-17T18:00:00.000Z',
  receiptUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&auto=format&fit=crop&q=80',
  createdAt: '2026-09-15T17:30:00.000Z',
  updatedAt: '2026-09-15T18:00:00.000Z'
};

export const INITIAL_PROJECTS: Project[] = [
  ORDER_CAMILA_LAUTARO,
  ORDER_VALENTINA_MORALES,
  ORDER_MATEO_GAEL,
  REFERENCE_PROJECT
];

export const REFERENCE_EVENT_SETTINGS: EventSettings = {
  projectId: 'proj-comunion-santiago-2026',
  title: 'Mi Primera Comunión',
  honoreeName: 'Santiago Tomás',
  subtitle: 'Un día de bendición, alegría y encuentro con Jesús',
  date: '2026-10-10',
  time: '11:00',
  ceremonyTime: '11:00',
  partyTime: '13:00',
  timezone: 'America/Argentina/Buenos_Aires',
  locationName: 'Parroquia Nuestra Señora del Carmen & Salón La Arboleda',
  address: 'Av. Libertador 4520, Palermo, Buenos Aires',
  mapsUrl: 'https://maps.google.com/?q=Av.+Libertador+4520+Buenos+Aires',
  initialPhrase: 'Jesús, en este día tan sagrado, te abro las puertas de mi corazón para que habites en él por siempre.',
  dressCode: 'Elegante Sport / Colores Claros',
  dressCodeNotes: 'Recomendamos calzado cómodo para el jardín y abrigo ligero para la tarde.',
  bankAlias: 'SANTIAGO.COMUNION.26',
  bankCvu: '0000003100084592019842',
  bankHolder: 'Horacio Gómez (Papá)',
  bankNotes: 'Tu presencia es nuestro mejor regalo. Si deseas hacerme un presente, puedes colaborar con mi alcancía de ahorros.',
  selectedMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3',
  musicTitle: 'Momentos de Paz (Piano & Cuerdas)',
  primaryColor: '#b8860b',
  secondaryColor: '#fdfbf7',
  accentColor: '#8b6508',
  fontFamily: 'serif',
  envelopeColor: '#c59b27',
  waxSealText: 'ST',
  coverPhotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
  carouselPhotos: [
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&auto=format&fit=crop&q=80'
  ],
  schedule: [
    {
      time: '11:00 hs',
      title: 'Ceremonia Religiosa',
      description: 'Misa de Primera Comunión en la Parroquia Nuestra Señora del Carmen.',
      iconName: 'Church'
    },
    {
      time: '13:00 hs',
      title: 'Recepción y Brindis',
      description: 'Cocktail de bienvenida y fotos familiares en los jardines de La Arboleda.',
      iconName: 'Wine'
    },
    {
      time: '14:30 hs',
      title: 'Almuerzo y Mesa Dulce',
      description: 'Almuerzo campestre, música y corte de la torta de comunión.',
      iconName: 'Utensils'
    },
    {
      time: '17:30 hs',
      title: 'Souvenirs y Despedida',
      description: 'Entrega de recuerdos bendecidos y agradecimiento a los presentes.',
      iconName: 'Gift'
    }
  ]
};

export const SETTINGS_CAMILA_LAUTARO: EventSettings = {
  projectId: 'proj-boda-camila-lautaro',
  title: 'Nuestra Boda',
  honoreeName: 'Camila & Lautaro',
  subtitle: 'El amor es paciente, es bondadoso. Los invitamos a celebrar nuestra unión.',
  date: '2026-11-21',
  time: '19:00',
  ceremonyTime: '19:00',
  partyTime: '21:00',
  timezone: 'America/Argentina/Buenos_Aires',
  locationName: 'Estancia San Ignacio & Capilla',
  address: 'Ruta 8 Km 65, Pilar, Buenos Aires',
  mapsUrl: 'https://maps.google.com/?q=Pilar+Buenos+Aires',
  initialPhrase: 'Porque la vida es un viaje que decidimos caminar juntos para siempre.',
  dressCode: 'Elegante',
  dressCodeNotes: 'Sugerimos tonos pasteles o neutros.',
  bankAlias: 'BODA.CAMI.LAU.26',
  bankCvu: '0000003100099882233445',
  bankHolder: 'Camila Rossi & Lautaro Benítez',
  bankNotes: 'Tu presencia es nuestro mejor obsequio. Si deseas contribuir a nuestra luna de miel, puedes hacerlo aquí.',
  selectedMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3',
  musicTitle: 'Melodía Romántica',
  primaryColor: '#c59b27',
  secondaryColor: '#fcfaf6',
  accentColor: '#8a6414',
  fontFamily: 'serif',
  envelopeColor: '#1c1b18',
  waxSealText: 'C&L',
  coverPhotoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80',
  carouselPhotos: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80'
  ],
  schedule: [
    { time: '19:00 hs', title: 'Ceremonia Religiosa', description: 'Capilla San Ignacio.' },
    { time: '21:00 hs', title: 'Recepción & Fiesta', description: 'Salón Principal.' }
  ]
};

export const SETTINGS_VALENTINA_MORALES: EventSettings = {
  projectId: 'proj-15anos-valentina',
  title: 'Mis 15 Años',
  honoreeName: 'Valentina Morales',
  subtitle: 'Una noche mágica para celebrar mis 15 primaveras junto a quienes más quiero.',
  date: '2026-12-05',
  time: '21:30',
  ceremonyTime: '21:30',
  partyTime: '22:00',
  timezone: 'America/Argentina/Buenos_Aires',
  locationName: 'Salón Palais Rouge',
  address: 'Jerónimo Salguero 1441, Palermo, Buenos Aires',
  mapsUrl: 'https://maps.google.com/?q=Jerónimo+Salguero+1441+Buenos+Aires',
  initialPhrase: 'Hay momentos que se sueñan toda la vida, y este es uno de ellos.',
  dressCode: 'Elegante',
  dressCodeNotes: '¡Prohibido vestir de color lavanda!',
  bankAlias: 'VALE.MIS15.2026',
  bankCvu: '0000003100088776655443',
  bankHolder: 'Marcelo Morales (Papá)',
  bankNotes: 'El mejor regalo es tu compañía. Si deseas obsequiarme algo, puedes colaborar con mi viaje de 15.',
  selectedMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3',
  musicTitle: 'Vals de Ensueño',
  primaryColor: '#a855f7',
  secondaryColor: '#faf5ff',
  accentColor: '#7e22ce',
  fontFamily: 'serif',
  envelopeColor: '#2e1065',
  waxSealText: 'VM',
  coverPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80',
  carouselPhotos: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
  ],
  schedule: [
    { time: '21:30 hs', title: 'Recepción', description: 'Entrada de invitados.' },
    { time: '22:30 hs', title: 'Entrada Triunfal & Vals', description: 'Vals con papá y corte de cinta.' },
    { time: '01:00 hs', title: 'Carioca & Baile', description: 'Cotillón luminoso.' }
  ]
};

export const SETTINGS_MATEO_GAEL: EventSettings = {
  projectId: 'proj-bautismo-mateo',
  title: 'Mi Bautismo',
  honoreeName: 'Mateo Gael',
  subtitle: 'Doy mi primer paso en la fe y quiero compartirlo con vos.',
  date: '2026-10-18',
  time: '12:00',
  ceremonyTime: '12:00',
  partyTime: '13:30',
  timezone: 'America/Argentina/Buenos_Aires',
  locationName: 'Basílica Santo Domingo',
  address: 'Av. Vélez Sarsfield 250, Córdoba',
  mapsUrl: 'https://maps.google.com/?q=Basílica+Santo+Domingo+Córdoba',
  initialPhrase: 'Ángel de mi guarda, dulce compañía, no me desampares ni de noche ni de día.',
  dressCode: 'Elegante Sport',
  dressCodeNotes: 'Colores pasteles o blanco.',
  bankAlias: 'MATEO.BAUTISMO.26',
  bankCvu: '0000003100077665544332',
  bankHolder: 'Esteban Gael',
  bankNotes: 'Gracias por acompañarme en este día tan especial.',
  selectedMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3',
  musicTitle: 'Melodía de Paz',
  primaryColor: '#0ea5e9',
  secondaryColor: '#f0f9ff',
  accentColor: '#0284c7',
  fontFamily: 'sans',
  envelopeColor: '#082f49',
  waxSealText: 'MG',
  coverPhotoUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1000&auto=format&fit=crop&q=80',
  carouselPhotos: [
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80'
  ],
  schedule: [
    { time: '12:00 hs', title: 'Ceremonia de Bautismo', description: 'Pila Bautismal.' },
    { time: '13:30 hs', title: 'Almuerzo Familiar', description: 'Brindis y agasajo.' }
  ]
};

export const INITIAL_EVENT_SETTINGS_MAP: Record<string, EventSettings> = {
  [REFERENCE_PROJECT.id]: REFERENCE_EVENT_SETTINGS,
  [ORDER_CAMILA_LAUTARO.id]: SETTINGS_CAMILA_LAUTARO,
  [ORDER_VALENTINA_MORALES.id]: SETTINGS_VALENTINA_MORALES,
  [ORDER_MATEO_GAEL.id]: SETTINGS_MATEO_GAEL
};

export const REFERENCE_GUESTS: Guest[] = [
  {
    id: 'g-1',
    projectId: 'proj-comunion-santiago-2026',
    name: 'Familia Gómez Pereyra',
    relationship: 'Tíos y Primos',
    phone: '5493835438603',
    adultsMax: 2,
    childrenMax: 2,
    inviteToken: 'fam-gomez-pereyra',
    sentAt: '2026-09-12T15:00:00.000Z',
    attendance: 'confirmed',
    adultsConfirmed: 2,
    childrenConfirmed: 2,
    notes: 'Confirmados con entusiasmo',
    updatedAt: '2026-09-12T16:15:00.000Z'
  },
  {
    id: 'g-2',
    projectId: 'proj-comunion-santiago-2026',
    name: 'Marta & Roberto (Padrinos)',
    relationship: 'Madrina y Padrino',
    phone: '5491144556677',
    adultsMax: 2,
    childrenMax: 0,
    inviteToken: 'padrinos-marta-roberto',
    sentAt: '2026-09-12T15:05:00.000Z',
    attendance: 'confirmed',
    adultsConfirmed: 2,
    childrenConfirmed: 0,
    notes: 'Estarán en primera fila de la iglesia',
    updatedAt: '2026-09-12T18:00:00.000Z'
  },
  {
    id: 'g-3',
    projectId: 'proj-comunion-santiago-2026',
    name: 'Familia Benítez',
    relationship: 'Compañeros del Colegio',
    phone: '5491155667788',
    adultsMax: 2,
    childrenMax: 1,
    inviteToken: 'fam-benitez',
    attendance: 'pending',
    adultsConfirmed: 0,
    childrenConfirmed: 0,
    updatedAt: '2026-09-12T15:10:00.000Z'
  },
  {
    id: 'g-4',
    projectId: 'proj-comunion-santiago-2026',
    name: 'Lucas Martínez (Amigo de fútbol)',
    relationship: 'Amigo',
    phone: '5491166778899',
    adultsMax: 1,
    childrenMax: 1,
    inviteToken: 'amigo-lucas',
    sentAt: '2026-09-12T15:12:00.000Z',
    attendance: 'declined',
    adultsConfirmed: 0,
    childrenConfirmed: 0,
    notes: 'Viaje familiar programado',
    updatedAt: '2026-09-12T19:20:00.000Z'
  }
];

export const REFERENCE_BLESSINGS: Blessing[] = [
  {
    id: 'b-1',
    projectId: 'proj-comunion-santiago-2026',
    author: 'Tía Claudia y Tío Juan',
    message: '¡Querido Santi! Que Dios ilumine siempre tu camino y conserve en tu corazón la pureza y ternura de este día tan bendecido. Te amamos inmensamente.',
    status: 'approved',
    createdAt: '2026-09-12T16:20:00.000Z'
  },
  {
    id: 'b-2',
    projectId: 'proj-comunion-santiago-2026',
    author: 'Marta (Tu Madrina)',
    message: 'Es un honor infinito acompañarte como madrina en este día sagrado. Cuenta conmigo siempre en cada etapa de tu vida. ¡Feliz Comunión!',
    status: 'approved',
    createdAt: '2026-09-12T18:05:00.000Z'
  },
  {
    id: 'b-3',
    projectId: 'proj-comunion-santiago-2026',
    author: 'Abuela Rosa',
    message: 'Mi nieto hermoso: que el Niño Jesús te abrace hoy y todos los días de tu vida. Orgullosa de verte crecer con tanta fe y bondad.',
    status: 'approved',
    createdAt: '2026-09-13T07:45:00.000Z'
  }
];

export const REFERENCE_EVENT_PHOTOS: EventPhoto[] = [
  {
    id: 'p-1',
    projectId: 'proj-comunion-santiago-2026',
    source: 'invitation',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80',
    author: 'Foto Oficial',
    status: 'approved',
    watermarkEnabled: false,
    createdAt: '2026-09-12T10:00:00.000Z'
  },
  {
    id: 'p-2',
    projectId: 'proj-comunion-santiago-2026',
    source: 'event',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&auto=format&fit=crop&q=80',
    author: 'Tío Juan',
    status: 'approved',
    watermarkEnabled: true,
    createdAt: '2026-09-12T17:10:00.000Z'
  },
  {
    id: 'p-3',
    projectId: 'proj-comunion-santiago-2026',
    source: 'event',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80',
    author: 'Madrina Marta',
    status: 'approved',
    watermarkEnabled: true,
    createdAt: '2026-09-12T18:30:00.000Z'
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay-boda-5120',
    projectId: ORDER_CAMILA_LAUTARO.id,
    provider: 'transfer',
    providerPaymentId: 'TRF-11884422',
    amount: 60000,
    currency: 'ARS',
    status: 'review',
    receiptUrl: ORDER_CAMILA_LAUTARO.receiptUrl,
    createdAt: '2026-09-16T10:15:00.000Z'
  },
  {
    id: 'pay-15an-7842',
    projectId: ORDER_VALENTINA_MORALES.id,
    provider: 'transfer',
    providerPaymentId: 'TRF-99443311',
    amount: 52000,
    currency: 'ARS',
    status: 'review',
    receiptUrl: ORDER_VALENTINA_MORALES.receiptUrl,
    createdAt: '2026-09-16T09:40:00.000Z'
  },
  {
    id: 'pay-baut-9204',
    projectId: ORDER_MATEO_GAEL.id,
    provider: 'transfer',
    providerPaymentId: 'TRF-77665544',
    amount: 45000,
    currency: 'ARS',
    status: 'completed',
    paidAt: '2026-09-15T18:00:00.000Z',
    receiptUrl: ORDER_MATEO_GAEL.receiptUrl,
    createdAt: '2026-09-15T17:30:00.000Z'
  },
  {
    id: 'pay-ref-001',
    projectId: REFERENCE_PROJECT.id,
    provider: 'transfer',
    providerPaymentId: 'TRF-98421054',
    amount: 60000,
    currency: 'ARS',
    status: 'completed',
    paidAt: '2026-09-12T14:30:00.000Z',
    createdAt: '2026-09-12T14:28:00.000Z'
  }
];

export const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-boda-5120',
    type: 'receipt_uploaded',
    title: 'Nuevo Pedido #ORD-BODA-5120 (ORO)',
    message: 'Camila & Lautaro contrataron Boda Elegante. Comprobante bancario adjunto listo para validar y habilitar 24h.',
    projectId: ORDER_CAMILA_LAUTARO.id,
    paymentId: 'pay-boda-5120',
    read: false,
    createdAt: '2026-09-16T10:15:00.000Z'
  },
  {
    id: 'notif-15an-7842',
    type: 'receipt_uploaded',
    title: 'Nuevo Pedido #ORD-15AN-7842 (PLATA)',
    message: 'Valentina Morales contrató Mis 15 Años Glamour. Comprobante bancario adjunto listo para validar y habilitar 24h.',
    projectId: ORDER_VALENTINA_MORALES.id,
    paymentId: 'pay-15an-7842',
    read: false,
    createdAt: '2026-09-16T09:40:00.000Z'
  },
  {
    id: 'notif-baut-9204',
    type: 'order_created',
    title: 'Pedido en Revisión #ORD-BAUT-9204 (BRONCE)',
    message: 'Mateo Gael (Bautismo Angelical). En ventana de 24h de revisión previa por parte del cliente.',
    projectId: ORDER_MATEO_GAEL.id,
    paymentId: 'pay-baut-9204',
    read: true,
    createdAt: '2026-09-15T18:00:00.000Z'
  }
];
