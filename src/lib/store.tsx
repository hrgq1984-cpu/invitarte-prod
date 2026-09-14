import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Plan, 
  DesignTemplate, 
  Project, 
  EventSettings, 
  Guest, 
  Blessing, 
  EventPhoto, 
  DisplaySettings, 
  PaymentTransaction,
  User,
  ProjectStatus,
  PlanTier,
  EventType,
  Rsvp
} from '../types';
import { 
  INITIAL_PLANS, 
  INITIAL_TEMPLATES, 
  REFERENCE_PROJECT, 
  REFERENCE_EVENT_SETTINGS, 
  REFERENCE_GUESTS, 
  REFERENCE_BLESSINGS, 
  REFERENCE_EVENT_PHOTOS 
} from '../data/initialData';

interface StoreContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  logout: () => void;
  loginAdmin: (secretKey: string) => boolean;
  loginClient: (emailOrCode?: string) => boolean;
  plans: Plan[];
  updatePlanPrice: (planId: PlanTier, newPrice: number) => void;
  templates: DesignTemplate[];
  projects: Project[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  currentProject: Project;
  currentEventSettings: EventSettings;
  updateEventSettings: (projectId: string, settings: Partial<EventSettings>) => void;
  guests: Guest[];
  addGuest: (projectId: string, guest: Omit<Guest, 'id' | 'projectId' | 'updatedAt' | 'inviteToken' | 'attendance' | 'adultsConfirmed' | 'childrenConfirmed'>) => Guest;
  updateGuest: (projectId: string, guestId: string, updates: Partial<Guest>) => void;
  deleteGuest: (projectId: string, guestId: string) => void;
  importGuestsCsv: (projectId: string, csvContent: string) => number;
  blessings: Blessing[];
  addBlessing: (projectId: string, author: string, message: string) => Blessing;
  moderateBlessing: (projectId: string, blessingId: string, status: 'approved' | 'rejected') => void;
  photos: EventPhoto[];
  addPhoto: (projectId: string, photo: Omit<EventPhoto, 'id' | 'projectId' | 'createdAt'>) => EventPhoto;
  moderatePhoto: (projectId: string, photoId: string, status: 'approved' | 'rejected') => void;
  displaySettings: DisplaySettings;
  updateDisplaySettings: (projectId: string, settings: Partial<DisplaySettings>) => void;
  payments: PaymentTransaction[];
  createOrder: (data: { eventType: EventType; templateId: string; planId: PlanTier; clientEmail: string; honoreeName: string }) => Project;
  submitPayment: (projectId: string, provider: 'mercadopago' | 'transfer', receiptUrl?: string) => PaymentTransaction;
  confirmPaymentAdmin: (paymentId: string) => void;
  approveProjectByClient: (projectId: string) => void;
  requestClientCorrection: (projectId: string, notes: string) => void;
  adminSetProjectStatus: (projectId: string, status: ProjectStatus) => void;
  submitRsvp: (data: Omit<Rsvp, 'id' | 'createdAt'>) => void;
  previewTemplate: (template: DesignTemplate) => void;
  resetAllData: () => void;
  exportDatabaseJson: () => string;
}

const STORAGE_KEY = 'invitarte_v1_store';

export const ADMIN_USER: User = {
  id: 'user-admin-root',
  email: 'hrgq.1984@gmail.com',
  displayName: 'Administrador General (Horacio)',
  role: 'admin',
  phoneNumber: '3835438603',
  createdAt: '2026-09-01T00:00:00.000Z'
};

export const DEMO_CLIENT_USER: User = {
  id: 'client-hrgq-demo',
  email: 'hrgq.1984@gmail.com',
  displayName: 'Horacio Gómez (Cliente)',
  role: 'client',
  phoneNumber: '3835438603',
  createdAt: '2026-09-12T10:00:00.000Z'
};

export const DEMO_GUEST_USER: User = {
  id: 'guest-gomez-pereyra',
  email: 'invitado@familia.com',
  displayName: 'Familia Gómez Pereyra',
  role: 'guest',
  phoneNumber: '5493835438603',
  createdAt: '2026-09-12T15:00:00.000Z'
};

export const VISITOR_USER: User = {
  id: 'visitor-public',
  email: '',
  displayName: 'Visitante Público',
  role: 'guest',
  createdAt: '2026-09-01T00:00:00.000Z'
};

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User>(() => {
    try {
      const savedUser = localStorage.getItem(`${STORAGE_KEY}_auth_user`);
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      // ignore
    }
    return VISITOR_USER;
  });

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    try {
      localStorage.setItem(`${STORAGE_KEY}_auth_user`, JSON.stringify(user));
    } catch (e) {}
  };

  const logout = () => {
    setCurrentUserState(VISITOR_USER);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_auth_user`);
    } catch (e) {}
  };

  const loginAdmin = (secretKey: string): boolean => {
    const clean = secretKey.trim().toLowerCase();
    // Valid keys: 'maximo1822', 'admin1822', 'admin'
    if (clean === 'maximo1822' || clean === 'admin1822' || clean === 'admin') {
      setCurrentUser(ADMIN_USER);
      return true;
    }
    return false;
  };

  const loginClient = (emailOrCode?: string): boolean => {
    const clean = (emailOrCode || '').trim().toLowerCase();
    if (clean && clean.includes('admin')) {
      return false; // not client
    }
    setCurrentUser(DEMO_CLIENT_USER);
    return true;
  };

  const [plans, setPlans] = useState<Plan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_plans`);
    if (saved) {
      try {
        const parsed: Plan[] = JSON.parse(saved);
        return INITIAL_PLANS.map(initPlan => {
          const found = parsed.find(p => p.id === initPlan.id);
          if (found) {
            return {
              ...initPlan,
              price: typeof found.price === 'number' ? found.price : initPlan.price,
              active: typeof found.active === 'boolean' ? found.active : initPlan.active
            };
          }
          return initPlan;
        });
      } catch (e) {
        return INITIAL_PLANS;
      }
    }
    return INITIAL_PLANS;
  });

  const [templates] = useState<DesignTemplate[]>(INITIAL_TEMPLATES);

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
    return saved ? JSON.parse(saved) : [REFERENCE_PROJECT];
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string>(REFERENCE_PROJECT.id);

  const [eventSettingsMap, setEventSettingsMap] = useState<Record<string, EventSettings>>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : { [REFERENCE_PROJECT.id]: REFERENCE_EVENT_SETTINGS };
  });

  const [guestsMap, setGuestsMap] = useState<Record<string, Guest[]>>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_guests`);
    return saved ? JSON.parse(saved) : { [REFERENCE_PROJECT.id]: REFERENCE_GUESTS };
  });

  const [blessingsMap, setBlessingsMap] = useState<Record<string, Blessing[]>>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_blessings`);
    return saved ? JSON.parse(saved) : { [REFERENCE_PROJECT.id]: REFERENCE_BLESSINGS };
  });

  const [photosMap, setPhotosMap] = useState<Record<string, EventPhoto[]>>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_photos`);
    return saved ? JSON.parse(saved) : { [REFERENCE_PROJECT.id]: REFERENCE_EVENT_PHOTOS };
  });

  const [displaySettingsMap, setDisplaySettingsMap] = useState<Record<string, DisplaySettings>>(() => {
    return {
      [REFERENCE_PROJECT.id]: {
        projectId: REFERENCE_PROJECT.id,
        rotationSeconds: 5,
        tvMode: true,
        showPhotos: true,
        showBlessings: true,
        updatedAt: new Date().toISOString()
      }
    };
  });

  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_payments`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'pay-ref-001',
        projectId: REFERENCE_PROJECT.id,
        provider: 'mercadopago',
        providerPaymentId: 'MP-98421054',
        amount: 60000,
        currency: 'ARS',
        status: 'completed',
        paidAt: '2026-09-12T14:30:00.000Z',
        createdAt: '2026-09-12T14:28:00.000Z'
      }
    ];
  });

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_plans`, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(eventSettingsMap));
  }, [eventSettingsMap]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_guests`, JSON.stringify(guestsMap));
  }, [guestsMap]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_blessings`, JSON.stringify(blessingsMap));
  }, [blessingsMap]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_photos`, JSON.stringify(photosMap));
  }, [photosMap]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
  }, [payments]);

  // Current active project & settings
  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0] || REFERENCE_PROJECT;
  const currentEventSettings = eventSettingsMap[currentProject.id] || REFERENCE_EVENT_SETTINGS;
  const guests = guestsMap[currentProject.id] || [];
  const blessings = blessingsMap[currentProject.id] || [];
  const photos = photosMap[currentProject.id] || [];
  const displaySettings = displaySettingsMap[currentProject.id] || {
    projectId: currentProject.id,
    rotationSeconds: 5,
    tvMode: true,
    showPhotos: true,
    showBlessings: true,
    updatedAt: new Date().toISOString()
  };

  const updatePlanPrice = (planId: PlanTier, newPrice: number) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, price: newPrice } : p));
  };

  const updateEventSettings = (projectId: string, settings: Partial<EventSettings>) => {
    setEventSettingsMap(prev => ({
      ...prev,
      [projectId]: {
        ...(prev[projectId] || REFERENCE_EVENT_SETTINGS),
        ...settings
      }
    }));
  };

  const addGuest = (projectId: string, guestData: Omit<Guest, 'id' | 'projectId' | 'updatedAt' | 'inviteToken' | 'attendance' | 'adultsConfirmed' | 'childrenConfirmed'>): Guest => {
    const slugName = guestData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
    const token = `${slugName}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGuest: Guest = {
      ...guestData,
      id: `guest-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      projectId,
      inviteToken: token,
      attendance: 'pending',
      adultsConfirmed: 0,
      childrenConfirmed: 0,
      updatedAt: new Date().toISOString()
    };

    setGuestsMap(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), newGuest]
    }));

    return newGuest;
  };

  const updateGuest = (projectId: string, guestId: string, updates: Partial<Guest>) => {
    setGuestsMap(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).map(g => g.id === guestId ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g)
    }));
  };

  const deleteGuest = (projectId: string, guestId: string) => {
    setGuestsMap(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).filter(g => g.id !== guestId)
    }));
  };

  const importGuestsCsv = (projectId: string, csvContent: string): number => {
    const lines = csvContent.split('\n').map(l => l.trim()).filter(Boolean);
    let count = 0;
    const newGuests: Guest[] = [];

    // Header check
    const startIndex = lines[0]?.toLowerCase().includes('nombre') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
      if (parts[0]) {
        const name = parts[0];
        const relationship = parts[1] || 'Invitado/a';
        const phone = parts[2] || '';
        const adultsMax = parseInt(parts[3], 10) || 1;
        const childrenMax = parseInt(parts[4], 10) || 0;

        const slugName = name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 18);
        const token = `${slugName}-${Math.floor(1000 + Math.random() * 9000)}`;

        newGuests.push({
          id: `guest-csv-${Date.now()}-${i}`,
          projectId,
          name,
          relationship,
          phone,
          adultsMax,
          childrenMax,
          inviteToken: token,
          attendance: 'pending',
          adultsConfirmed: 0,
          childrenConfirmed: 0,
          updatedAt: new Date().toISOString()
        });
        count++;
      }
    }

    if (newGuests.length > 0) {
      setGuestsMap(prev => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), ...newGuests]
      }));
    }

    return count;
  };

  const addBlessing = (projectId: string, author: string, message: string): Blessing => {
    const newBlessing: Blessing = {
      id: `blessing-${Date.now()}`,
      projectId,
      author,
      message,
      status: 'approved',
      createdAt: new Date().toISOString()
    };

    setBlessingsMap(prev => ({
      ...prev,
      [projectId]: [newBlessing, ...(prev[projectId] || [])]
    }));

    return newBlessing;
  };

  const moderateBlessing = (projectId: string, blessingId: string, status: 'approved' | 'rejected') => {
    setBlessingsMap(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).map(b => b.id === blessingId ? { ...b, status } : b)
    }));
  };

  const addPhoto = (projectId: string, photoData: Omit<EventPhoto, 'id' | 'projectId' | 'createdAt'>): EventPhoto => {
    const newPhoto: EventPhoto = {
      ...photoData,
      id: `photo-${Date.now()}`,
      projectId,
      createdAt: new Date().toISOString()
    };

    setPhotosMap(prev => ({
      ...prev,
      [projectId]: [newPhoto, ...(prev[projectId] || [])]
    }));

    return newPhoto;
  };

  const moderatePhoto = (projectId: string, photoId: string, status: 'approved' | 'rejected') => {
    setPhotosMap(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).map(p => p.id === photoId ? { ...p, status } : p)
    }));
  };

  const updateDisplaySettings = (projectId: string, settings: Partial<DisplaySettings>) => {
    setDisplaySettingsMap(prev => ({
      ...prev,
      [projectId]: {
        ...(prev[projectId] || {
          projectId,
          rotationSeconds: 5,
          tvMode: true,
          showPhotos: true,
          showBlessings: true,
          updatedAt: new Date().toISOString()
        }),
        ...settings,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  const createOrder = (data: { eventType: EventType; templateId: string; planId: PlanTier; clientEmail: string; honoreeName: string }): Project => {
    const tmpl = templates.find(t => t.id === data.templateId) || templates[0];
    const projectId = `proj-${data.eventType}-${Date.now().toString(36)}`;
    const slug = `${data.eventType}-${data.honoreeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.floor(100 + Math.random() * 900)}`;

    const newProject: Project = {
      id: projectId,
      clientId: currentUser.id,
      clientEmail: data.clientEmail || currentUser.email,
      eventType: data.eventType,
      templateId: data.templateId,
      planId: data.planId,
      status: 'pending_payment',
      publicSlug: slug,
      previewToken: `tok-${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Initialize event settings from template
    const newSettings: EventSettings = {
      projectId,
      title: tmpl.name,
      honoreeName: data.honoreeName,
      subtitle: `Celebración de ${tmpl.name}`,
      date: tmpl.sampleDate,
      time: '18:00',
      ceremonyTime: '18:00',
      partyTime: '20:00',
      timezone: 'America/Argentina/Buenos_Aires',
      locationName: tmpl.sampleLocation,
      address: tmpl.sampleLocation,
      mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(tmpl.sampleLocation)}`,
      initialPhrase: tmpl.samplePhrase,
      dressCode: 'Elegante',
      dressCodeNotes: 'Ven preparado para compartir momentos inolvidables.',
      bankAlias: 'MI.EVENTO.2026',
      bankCvu: '0000003100099887766554',
      bankHolder: data.honoreeName,
      bankNotes: 'Tu presencia es nuestro mayor regalo. Si deseas agasajarnos, puedes realizar una transferencia.',
      selectedMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3',
      musicTitle: 'Melodía de Celebración',
      primaryColor: tmpl.palette.primary,
      secondaryColor: tmpl.palette.secondary,
      accentColor: tmpl.palette.accent,
      fontFamily: tmpl.fontFamily,
      envelopeColor: tmpl.envelopeColor,
      waxSealText: tmpl.waxSealSymbol,
      coverPhotoUrl: tmpl.previewImage,
      carouselPhotos: [tmpl.previewImage],
      schedule: [
        { time: '18:00 hs', title: 'Recepción', description: 'Bienvenida a los invitados.' },
        { time: '19:30 hs', title: 'Brindis & Cena', description: 'Comida principal y agasajo.' },
        { time: '22:00 hs', title: 'Fiesta & Baile', description: 'Música y diversión en la pista.' }
      ]
    };

    setProjects(prev => [newProject, ...prev]);
    setEventSettingsMap(prev => ({ ...prev, [projectId]: newSettings }));
    setSelectedProjectId(projectId);

    return newProject;
  };

  const submitPayment = (projectId: string, provider: 'mercadopago' | 'transfer', receiptUrl?: string): PaymentTransaction => {
    const proj = projects.find(p => p.id === projectId) || currentProject;
    const plan = plans.find(p => p.id === proj.planId) || plans[0];

    const newPayment: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      projectId,
      provider,
      providerPaymentId: provider === 'mercadopago' ? `MP-${Math.floor(10000000 + Math.random() * 90000000)}` : undefined,
      amount: plan.price,
      currency: plan.currency,
      status: provider === 'mercadopago' ? 'completed' : 'review',
      receiptUrl,
      paidAt: provider === 'mercadopago' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString()
    };

    setPayments(prev => [newPayment, ...prev]);

    // If instant Mercado Pago payment
    if (provider === 'mercadopago') {
      const now = new Date();
      const reviewDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours window
      setProjects(prev => prev.map(p => p.id === projectId ? {
        ...p,
        status: 'preview_available',
        paidAt: now.toISOString(),
        previewAvailableAt: now.toISOString(),
        expiresAt: reviewDeadline.toISOString(),
        updatedAt: now.toISOString()
      } : p));
    } else {
      setProjects(prev => prev.map(p => p.id === projectId ? {
        ...p,
        status: 'payment_review',
        updatedAt: new Date().toISOString()
      } : p));
    }

    return newPayment;
  };

  const confirmPaymentAdmin = (paymentId: string) => {
    const pay = payments.find(p => p.id === paymentId);
    if (!pay) return;

    const now = new Date();
    const reviewDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    setPayments(prev => prev.map(p => p.id === paymentId ? {
      ...p,
      status: 'completed',
      paidAt: now.toISOString()
    } : p));

    setProjects(prev => prev.map(p => p.id === pay.projectId ? {
      ...p,
      status: 'preview_available',
      paidAt: now.toISOString(),
      previewAvailableAt: now.toISOString(),
      expiresAt: reviewDeadline.toISOString(),
      updatedAt: now.toISOString()
    } : p));
  };

  const approveProjectByClient = (projectId: string) => {
    const now = new Date();
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      status: 'published',
      publishedAt: now.toISOString(),
      updatedAt: now.toISOString()
    } : p));
  };

  const requestClientCorrection = (projectId: string, notes: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      correctionNotes: notes,
      updatedAt: new Date().toISOString()
    } : p));
  };

  const adminSetProjectStatus = (projectId: string, status: ProjectStatus) => {
    const now = new Date();
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      status,
      publishedAt: status === 'published' ? (p.publishedAt || now.toISOString()) : p.publishedAt,
      updatedAt: now.toISOString()
    } : p));
  };

  const submitRsvp = (rsvpData: Omit<Rsvp, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    // Update guest list
    setGuestsMap(prev => {
      const list = prev[rsvpData.projectId] || [];
      const updated = list.map(g => {
        if (g.id === rsvpData.guestId || g.name.toLowerCase() === rsvpData.guestName.toLowerCase()) {
          return {
            ...g,
            attendance: rsvpData.attendance,
            adultsConfirmed: rsvpData.attendance === 'confirmed' ? rsvpData.adultsCount : 0,
            childrenConfirmed: rsvpData.attendance === 'confirmed' ? rsvpData.childrenCount : 0,
            notes: rsvpData.message,
            updatedAt: now
          };
        }
        return g;
      });
      return { ...prev, [rsvpData.projectId]: updated };
    });

    if (rsvpData.message && rsvpData.message.trim().length > 2) {
      addBlessing(rsvpData.projectId, rsvpData.guestName, rsvpData.message);
    }
  };

  const previewTemplate = (template: DesignTemplate) => {
    // 1. Update active project metadata
    setProjects(prev => prev.map(p => {
      if (p.id === selectedProjectId) {
        return {
          ...p,
          templateId: template.id,
          eventType: template.eventType,
          planId: template.requiredPlan
        };
      }
      return p;
    }));

    // 2. Generate rich context for this template
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
      cumpleanos: 'Casual Chic / Colores Vivos',
      '15anos': 'Elegante Sport / Con mucho brillo',
      bautismo: 'Elegante de Día / Tonos Pastel',
      comunion: 'Elegante Sport / Colores Claros',
      confirmacion: 'Formal / Colores Cálidos',
      otros: 'Gala / Black Tie'
    };

    const schedules: Record<string, Array<{ time: string; title: string; description: string; iconName?: string }>> = {
      boda: [
        { time: '18:00 hs', title: 'Ceremonia Nupcial', description: 'Intercambio de votos y anillos.' },
        { time: '19:30 hs', title: 'Cocktail en Jardines', description: 'Recepción y fotos con los invitados.' },
        { time: '21:00 hs', title: 'Cena & Vals', description: 'Cena principal y apertura de pista.' },
        { time: '23:30 hs', title: 'Fiesta & Cotillón', description: 'Música, baile y mesa dulce.' }
      ],
      '15anos': [
        { time: '21:00 hs', title: 'Recepción & Fotos', description: 'Bienvenida y sesión de fotos con amigos.' },
        { time: '22:15 hs', title: 'Entrada Triunfal & Vals', description: 'Entrada con música especial y vals familiar.' },
        { time: '23:00 hs', title: 'Cena & Brindis', description: 'Plato principal, video sorpresa y brindis.' },
        { time: '00:30 hs', title: 'Fiesta & Pista de Baile', description: 'Baile, luces y tanda carioca.' }
      ],
      cumpleanos: [
        { time: '21:00 hs', title: 'Bienvenida & Tragos', description: 'Barra libre y recepción con música.' },
        { time: '22:30 hs', title: 'Cena / Pizza Party', description: 'Comida informal y risas entre amigos.' },
        { time: '00:00 hs', title: 'Torta & Brindis', description: 'Canto del Feliz Cumpleaños y deseos.' },
        { time: '01:00 hs', title: 'Fiesta & DJ Set', description: 'Pista encendida hasta el amanecer.' }
      ],
      bautismo: [
        { time: '11:00 hs', title: 'Sacramento del Bautismo', description: 'Ceremonia de fe y bendición del agua.' },
        { time: '12:30 hs', title: 'Almuerzo Familiar', description: 'Almuerzo y brindis con seres queridos.' },
        { time: '15:30 hs', title: 'Mesa Dulce & Souvenirs', description: 'Corte de torta y entrega de recuerditos.' }
      ],
      comunion: [
        { time: '11:00 hs', title: 'Misa de Comunión', description: 'Encuentro con Jesús y bendición.' },
        { time: '13:00 hs', title: 'Recepción & Jardín', description: 'Cocktail y juegos al aire libre.' },
        { time: '14:30 hs', title: 'Almuerzo Campestre', description: 'Comida familiar y momentos únicos.' },
        { time: '17:00 hs', title: 'Souvenirs Bendecidos', description: 'Recuerdos de este día sagrado.' }
      ],
      confirmacion: [
        { time: '18:00 hs', title: 'Santa Misa de Confirmación', description: 'Imposición de manos del Obispo.' },
        { time: '19:45 hs', title: 'Brindis de Padrinos', description: 'Fotos y felicitaciones especiales.' },
        { time: '21:00 hs', title: 'Cena de Festejo', description: 'Cena compartida en familia.' }
      ],
      otros: [
        { time: '20:30 hs', title: 'Alfombra Roja & Cocktail', description: 'Recepción de invitados y acreditación.' },
        { time: '21:45 hs', title: 'Entrega de Distinciones', description: 'Discursos y entrega de premios.' },
        { time: '22:30 hs', title: 'Cena de Gala & Brindis', description: 'Menú por pasos y música en vivo.' }
      ]
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

    const newSettings: EventSettings = {
      projectId: selectedProjectId,
      title: template.name,
      honoreeName: template.sampleHonoree,
      subtitle: eventTypeLabels[template.eventType] || `Celebración de ${template.name}`,
      date: template.sampleDate,
      time: '18:00',
      ceremonyTime: '18:00',
      partyTime: '20:00',
      timezone: 'America/Argentina/Buenos_Aires',
      locationName: template.sampleLocation,
      address: template.sampleLocation,
      mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(template.sampleLocation)}`,
      initialPhrase: template.samplePhrase,
      dressCode: dressCodes[template.eventType] || 'Elegante',
      dressCodeNotes: 'Recomendamos puntualidad para disfrutar de cada instante.',
      bankAlias: `${template.sampleHonoree.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '')}.REGALO.2026`,
      bankCvu: '0000003100084592019842',
      bankHolder: template.sampleHonoree,
      bankNotes: 'Tu presencia es nuestro mayor regalo. Si deseas agasajarnos con una atención, puedes transferir aquí.',
      selectedMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3',
      musicTitle: `Melodía de ${template.name}`,
      primaryColor: template.palette.primary,
      secondaryColor: template.palette.secondary,
      accentColor: template.palette.accent,
      fontFamily: template.fontFamily,
      envelopeColor: template.envelopeColor,
      waxSealText: template.waxSealSymbol,
      coverPhotoUrl: template.previewImage,
      carouselPhotos: categoryPhotos[template.eventType] || [template.previewImage],
      schedule: schedules[template.eventType] || [
        { time: '18:00 hs', title: 'Recepción', description: 'Bienvenida a los invitados.' },
        { time: '20:00 hs', title: 'Celebración', description: 'Festejo y brindis especial.' }
      ]
    };

    setEventSettingsMap(prev => ({
      ...prev,
      [selectedProjectId]: newSettings
    }));
  };

  const resetAllData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_plans`);
    localStorage.removeItem(`${STORAGE_KEY}_projects`);
    localStorage.removeItem(`${STORAGE_KEY}_settings`);
    localStorage.removeItem(`${STORAGE_KEY}_guests`);
    localStorage.removeItem(`${STORAGE_KEY}_blessings`);
    localStorage.removeItem(`${STORAGE_KEY}_photos`);
    localStorage.removeItem(`${STORAGE_KEY}_payments`);
    setPlans(INITIAL_PLANS);
    setProjects([REFERENCE_PROJECT]);
    setSelectedProjectId(REFERENCE_PROJECT.id);
    setEventSettingsMap({ [REFERENCE_PROJECT.id]: REFERENCE_EVENT_SETTINGS });
    setGuestsMap({ [REFERENCE_PROJECT.id]: REFERENCE_GUESTS });
    setBlessingsMap({ [REFERENCE_PROJECT.id]: REFERENCE_BLESSINGS });
    setPhotosMap({ [REFERENCE_PROJECT.id]: REFERENCE_EVENT_PHOTOS });
  };

  const exportDatabaseJson = (): string => {
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      plans,
      templates,
      projects,
      eventSettings: eventSettingsMap,
      guests: guestsMap,
      blessings: blessingsMap,
      photos: photosMap,
      payments
    }, null, 2);
  };

  return (
    <StoreContext.Provider value={{
      currentUser,
      setCurrentUser,
      logout,
      loginAdmin,
      loginClient,
      plans,
      updatePlanPrice,
      templates,
      projects,
      selectedProjectId,
      setSelectedProjectId,
      currentProject,
      currentEventSettings,
      updateEventSettings,
      guests,
      addGuest,
      updateGuest,
      deleteGuest,
      importGuestsCsv,
      blessings,
      addBlessing,
      moderateBlessing,
      photos,
      addPhoto,
      moderatePhoto,
      displaySettings,
      updateDisplaySettings,
      payments,
      createOrder,
      submitPayment,
      confirmPaymentAdmin,
      approveProjectByClient,
      requestClientCorrection,
      adminSetProjectStatus,
      submitRsvp,
      previewTemplate,
      resetAllData,
      exportDatabaseJson
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
