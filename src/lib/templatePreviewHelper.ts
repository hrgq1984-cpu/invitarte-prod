import { DesignTemplate, EventSettings, EventScheduleItem, isCeremonySupported, Blessing, EventPhoto } from '../types';

/**
 * Builds rich, contextual sample event settings for any design template.
 * Guarantees that each of the 21 templates displays its unique honoree, date, 
 * photos, palette, font, and schedule without relying on or leaking contracted client data.
 */
export function buildTemplateSampleSettings(template: DesignTemplate): EventSettings {
  const eventTypeLabels: Record<string, string> = {
    boda: 'Nuestra Boda',
    cumpleanos: '¡Mi Cumpleaños!',
    '15anos': 'Mis Quince Años',
    bautismo: 'Mi Bautismo',
    comunion: 'Mi Primera Comunión',
    confirmacion: 'Mi Confirmación',
    otros: 'Gran Celebración'
  };

  const dressCodes: Record<string, string> = {
    boda: 'Elegante / Traje y Vestido de Fiesta',
    cumpleanos: 'Casual Chic / Fiesta y Baile',
    '15anos': 'Elegante Sport / Colores Vivos',
    bautismo: 'Elegante de Día / Tonos Pastel',
    comunion: 'Elegante Sport / Tonos Claros',
    confirmacion: 'Formal / Colores Cálidos',
    otros: 'Elegante / Gala'
  };

  const categoryPhotos: Record<string, string[]> = {
    boda: [
      template.previewImage,
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80'
    ],
    '15anos': [
      template.previewImage,
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop&q=80'
    ],
    cumpleanos: [
      template.previewImage,
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80'
    ],
    bautismo: [
      template.previewImage,
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80'
    ],
    comunion: [
      template.previewImage,
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80'
    ],
    confirmacion: [
      template.previewImage,
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80'
    ],
    otros: [
      template.previewImage,
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80'
    ]
  };

  const hasCeremony = isCeremonySupported(template.eventType);

  const schedules: Record<string, EventScheduleItem[]> = {
    boda: [
      { time: '18:00 hs', title: 'Ceremonia Religiosa', description: 'Intercambio de votos y bendición.' },
      { time: '19:30 hs', title: 'Cocktail en Jardines', description: 'Recepción y sesión de fotos.' },
      { time: '21:00 hs', title: 'Cena & Vals Nupcial', description: 'Plato principal y apertura de pista.' },
      { time: '23:30 hs', title: 'Fiesta & Cotillón', description: 'Baile, show y mesa dulce.' }
    ],
    '15anos': [
      { time: '21:00 hs', title: 'Recepción & Fotos', description: 'Bienvenida y fotos con amigos.' },
      { time: '22:15 hs', title: 'Entrada Triunfal & Vals', description: 'Entrada especial y vals con familia.' },
      { time: '23:00 hs', title: 'Cena & Brindis', description: 'Plato principal y video sorpresa.' },
      { time: '00:30 hs', title: 'Fiesta & Pista de Baile', description: 'Tanda carioca y diversión total.' }
    ],
    cumpleanos: [
      { time: '21:00 hs', title: 'Recepción & Barra Libre', description: 'Tragos de bienvenida y finger food.' },
      { time: '22:30 hs', title: 'Cena Principal', description: 'Comida y risas entre amigos.' },
      { time: '00:00 hs', title: 'Torta & Brindis', description: 'Canto de feliz cumpleaños y deseos.' },
      { time: '01:00 hs', title: 'Fiesta & DJ en Vivo', description: 'Pista encendida hasta el amanecer.' }
    ],
    bautismo: [
      { time: '11:00 hs', title: 'Sacramento del Bautismo', description: 'Ceremonia en la parroquia y bendición.' },
      { time: '12:30 hs', title: 'Almuerzo Familiar', description: 'Almuerzo y brindis con seres queridos.' },
      { time: '15:30 hs', title: 'Mesa Dulce & Souvenirs', description: 'Torta y entrega de recuerdos.' }
    ],
    comunion: [
      { time: '11:00 hs', title: 'Santa Misa de Comunión', description: 'Primer sacramento y bendición.' },
      { time: '13:00 hs', title: 'Almuerzo Campestre', description: 'Cocktail y juegos al aire libre.' },
      { time: '16:00 hs', title: 'Mesa Dulce & Souvenirs', description: 'Corte de torta y recuerdos bendecidos.' }
    ],
    confirmacion: [
      { time: '18:00 hs', title: 'Misa de Confirmación', description: 'Imposición de manos del Obispo.' },
      { time: '19:45 hs', title: 'Brindis de Padrinos', description: 'Felicitaciones y sesión de fotos.' },
      { time: '21:00 hs', title: 'Cena de Festejo', description: 'Cena familiar y brindis.' }
    ],
    otros: [
      { time: '20:30 hs', title: 'Alfombra Roja & Cocktail', description: 'Acreditación y bienvenida.' },
      { time: '21:45 hs', title: 'Distinciones Especiales', description: 'Discursos y reconocimientos.' },
      { time: '22:30 hs', title: 'Cena de Gala & Brindis', description: 'Menú por pasos y música en vivo.' }
    ]
  };

  const rawHonoree = template.sampleHonoree || 'Homenajeado';
  const cleanAliasName = rawHonoree.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '') || 'REGALO';

  return {
    projectId: `sample-${template.id}`,
    title: eventTypeLabels[template.eventType] || template.name,
    honoreeName: template.sampleHonoree,
    subtitle: template.name,
    date: template.sampleDate || '2026-11-20',
    time: hasCeremony ? '11:30' : '21:30',
    hasCeremony,
    ceremonyTime: hasCeremony ? '11:30' : undefined,
    ceremonyLocationName: hasCeremony ? 'Parroquia Nuestra Señora de la Merced' : undefined,
    ceremonyAddress: hasCeremony ? 'Av. San Martín 450, Centro' : undefined,
    ceremonyMapsUrl: hasCeremony ? 'https://maps.google.com' : undefined,
    partyTime: hasCeremony ? '13:00' : '21:30',
    timezone: 'America/Argentina/Buenos_Aires',
    locationName: template.sampleLocation.split(',')[0] || template.sampleLocation,
    address: template.sampleLocation,
    mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(template.sampleLocation)}`,
    initialPhrase: template.samplePhrase,
    dressCode: dressCodes[template.eventType] || 'Elegante',
    dressCodeNotes: 'Recomendamos puntualidad para disfrutar de cada instante.',
    bankAlias: `${cleanAliasName}.REGALO.2026`,
    bankCvu: '0000003100084592019842',
    bankHolder: template.sampleHonoree,
    bankNotes: 'Tu presencia es nuestro mayor regalo. Si deseas agasajarnos con una atención, puedes transferir a nuestra cuenta.',
    selectedMusicUrl: template.eventType === 'boda'
      ? 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3'
      : 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    musicTitle: `Melodía Especial - ${template.name}`,
    primaryColor: template.palette.primary,
    secondaryColor: template.palette.secondary,
    accentColor: template.palette.accent,
    fontFamily: template.fontFamily,
    envelopeColor: template.envelopeColor,
    waxSealText: template.waxSealSymbol,
    coverPhotoUrl: template.previewImage,
    carouselPhotos: categoryPhotos[template.eventType] || [template.previewImage],
    schedule: schedules[template.eventType] || [
      { time: '21:00 hs', title: 'Recepción', description: 'Bienvenida a los invitados.' },
      { time: '22:30 hs', title: 'Celebración', description: 'Cena y brindis conmemorativo.' }
    ]
  };
}

/**
 * Builds authentic sample blessings/wishes for a template preview
 */
export function buildTemplateSampleBlessings(template: DesignTemplate): Blessing[] {
  const pId = `sample-${template.id}`;
  const now = new Date().toISOString();

  switch (template.eventType) {
    case 'boda':
      return [
        {
          id: `sample-bless-${template.id}-1`,
          projectId: pId,
          author: 'Madrina Sofía & Familia',
          message: '¡Que el amor, la complicidad y la felicidad que sienten hoy se multipliquen cada día de sus vidas! Los amamos inmensamente.',
          status: 'approved',
          createdAt: now
        },
        {
          id: `sample-bless-${template.id}-2`,
          projectId: pId,
          author: 'Familia Rossi',
          message: '¡Una boda soñada para una pareja hermosa! Gracias por dejarnos ser testigos de este momento inolvidable.',
          status: 'approved',
          createdAt: now
        }
      ];
    case '15anos':
      return [
        {
          id: `sample-bless-${template.id}-1`,
          projectId: pId,
          author: 'Tía Lorena y Primos',
          message: `¡Felices 15 años ${template.sampleHonoree.split(' ')[0]}! Que Dios ilumine siempre tu camino y que nunca dejes de brillar como esta noche.`,
          status: 'approved',
          createdAt: now
        },
        {
          id: `sample-bless-${template.id}-2`,
          projectId: pId,
          author: 'Tus Amigas de Siempre',
          message: '¡Te queremos con el alma! ¡A disfrutar y romper esa pista de baile toda la noche!',
          status: 'approved',
          createdAt: now
        }
      ];
    case 'cumpleanos':
      return [
        {
          id: `sample-bless-${template.id}-1`,
          projectId: pId,
          author: 'Amigos de la Vida',
          message: `¡Muy feliz cumpleaños ${template.sampleHonoree.split(' ')[0]}! Brindamos por más risas, anécdotas y momentos compartidos.`,
          status: 'approved',
          createdAt: now
        },
        {
          id: `sample-bless-${template.id}-2`,
          projectId: pId,
          author: 'Familia González',
          message: '¡Feliz vuelta al sol! Te deseamos un año cargado de proyectos cumplidos, salud y alegría.',
          status: 'approved',
          createdAt: now
        }
      ];
    case 'bautismo':
      return [
        {
          id: `sample-bless-${template.id}-1`,
          projectId: pId,
          author: 'Padrinos Martín & Sol',
          message: `Que el Espíritu Santo guíe y proteja siempre los pasos de ${template.sampleHonoree}. ¡Siempre a tu lado!`,
          status: 'approved',
          createdAt: now
        },
        {
          id: `sample-bless-${template.id}-2`,
          projectId: pId,
          author: 'Abuelos Queridos',
          message: 'Bendiciones eternas para nuestro angelito en este sacramento de amor y luz.',
          status: 'approved',
          createdAt: now
        }
      ];
    case 'comunion':
      return [
        {
          id: `sample-bless-${template.id}-1`,
          projectId: pId,
          author: 'Tía Claudia y Tío Juan',
          message: `¡Querido ${template.sampleHonoree.split(' ')[0]}! Que Jesús sea siempre tu amigo fiel y guarde en tu corazón la pureza y ternura de este gran día.`,
          status: 'approved',
          createdAt: now
        },
        {
          id: `sample-bless-${template.id}-2`,
          projectId: pId,
          author: 'Catequistas de la Parroquia',
          message: 'Con inmensa alegría celebramos tu Primera Comunión. ¡Jesús camina siempre a tu lado!',
          status: 'approved',
          createdAt: now
        }
      ];
    default:
      return [
        {
          id: `sample-bless-${template.id}-1`,
          projectId: pId,
          author: 'Familia & Amigos',
          message: `¡Felicitaciones ${template.sampleHonoree}! Qué orgullo inmenso verte alcanzar esta hermosa meta.`,
          status: 'approved',
          createdAt: now
        }
      ];
  }
}

/**
 * Builds authentic sample live photos for a template preview
 */
export function buildTemplateSamplePhotos(template: DesignTemplate): EventPhoto[] {
  const pId = `sample-${template.id}`;
  const now = new Date().toISOString();
  const sampleUrls = [template.previewImage, ...((template as any).samplePhotos || [])];

  return sampleUrls.slice(0, 3).map((url, i) => ({
    id: `sample-live-photo-${template.id}-${i}`,
    projectId: pId,
    source: 'event',
    url,
    author: i === 0 ? 'Mesa 4' : i === 1 ? 'Fotocabina' : 'Amigos',
    status: 'approved',
    watermarkEnabled: true,
    createdAt: now
  }));
}

