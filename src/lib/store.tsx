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

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    return DEMO_CLIENT_USER;
  });

  const [plans, setPlans] = useState<Plan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_plans`);
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
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
