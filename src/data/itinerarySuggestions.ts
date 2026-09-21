import { EventType, EventScheduleItem } from '../types';

export const DEFAULT_ITINERARIES: Record<EventType, EventScheduleItem[]> = {
  boda: [
    { time: '18:00', title: 'Ceremonia Religiosa / Civil', description: 'Intercambio de alianzas y votos de amor' },
    { time: '19:30', title: 'Recepción & Cóctel', description: 'Bebidas de bienvenida, bocaditos y sesión de fotos' },
    { time: '21:00', title: 'Entrada al Salón & Cena', description: 'Entrada triunfal de los novios y plato principal' },
    { time: '23:30', title: 'Brindis & Torta', description: 'Palabras emotivas, corte de torta y ramo' },
    { time: '00:00', title: 'Vals & Pista de Baile', description: 'Apertura de baile con amigos y familia' },
    { time: '02:30', title: 'Carnaval Carioca', description: 'Cotillón luminoso, música y mucha diversión' }
  ],
  '15anos': [
    { time: '21:30', title: 'Recepción de Invitados', description: 'Bienvenida con música y fotos en el banner' },
    { time: '22:30', title: 'Entrada Triunfal & Vals', description: 'El vals tradicional con papá, familia y amigos' },
    { time: '23:00', title: 'Cena Principal', description: 'Plato principal y videos de recuerdos' },
    { time: '00:30', title: 'Ceremonia de las 15 Velas', description: 'Dedicatorias y entrega de velas a personas especiales' },
    { time: '01:00', title: 'Apertura de Pista', description: 'Música de DJ, luces y diversión' },
    { time: '03:30', title: 'Cotillón & Mesa Dulce', description: 'Cierre festivo y mesa de postres' }
  ],
  bautismo: [
    { time: '11:00', title: 'Ceremonia de Bautismo', description: 'Sacramento y bendición en la pila bautismal' },
    { time: '12:30', title: 'Llegada al Salón / Casa', description: 'Recepción y bienvenida a familiares y padrinos' },
    { time: '13:00', title: 'Almuerzo Compartido', description: 'Asado o menú especial de festejo' },
    { time: '15:30', title: 'Torta, Brindis & Souvenirs', description: 'Entrega de recuerdos y agradecimiento' }
  ],
  comunion: [
    { time: '10:30', title: 'Misa de Primera Comunión', description: 'Celebración religiosa junto a catequistas y familia' },
    { time: '12:30', title: 'Almuerzo de Comunión', description: 'Recepción en el salón o quinta' },
    { time: '14:30', title: 'Juegos & Animación', description: 'Espacio recreativo para niños y familia' },
    { time: '16:00', title: 'Torta & Entrega de Estampitas', description: 'Bendición y souvenirs de recuerdo' }
  ],
  confirmacion: [
    { time: '18:00', title: 'Misa de Confirmación', description: 'Sacramento de Confirmación en la parroquia' },
    { time: '20:00', title: 'Recepción & Brindis', description: 'Encuentro con padrinos y amigos' },
    { time: '21:00', title: 'Cena & Festejo', description: 'Cena compartida en familia' },
    { time: '23:00', title: 'Brindis & Postre', description: 'Cierre emotivo de la celebración' }
  ],
  cumpleanos: [
    { time: '21:30', title: 'Recepción & Tragos', description: 'Música de bienvenida y llegada de amigos' },
    { time: '22:30', title: 'Cena / Pizza Party / Asado', description: 'Comida compartida en un ambiente relajado' },
    { time: '00:00', title: '¡Feliz Cumpleaños!', description: 'Cantar el feliz cumpleaños, soplar velas y brindis' },
    { time: '00:30', title: 'Música, Baile & Fiesta', description: 'Pista libre con toda la diversión' },
    { time: '03:30', title: 'Fin de Fiesta', description: 'Mesa dulce y despedida' }
  ],
  otros: [
    { time: '19:00', title: 'Acreditación & Recepción', description: 'Bienvenida a los asistentes y cóctel' },
    { time: '20:00', title: 'Palabras de Inicio', description: 'Presentación y mensaje de los anfitriones' },
    { time: '21:00', title: 'Cena / Catering', description: 'Momento para compartir y socializar' },
    { time: '23:00', title: 'Brindis de Cierre', description: 'Agradecimiento y despedida' }
  ]
};
