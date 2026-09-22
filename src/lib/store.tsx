import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, cleanForFirestore } from './firebase';
import { getFirebaseAuth } from './firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
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
  AdminNotification,
  User,
  ProjectStatus,
  PlanTier,
  EventType,
  Rsvp
} from '../types';
import { 
  INITIAL_PLANS, 
  INITIAL_TEMPLATES, 
  INITIAL_PROJECTS,
  INITIAL_EVENT_SETTINGS_MAP,
  INITIAL_PAYMENTS,
  INITIAL_NOTIFICATIONS,
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
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  loginClient: (email: string, password: string) => Promise<boolean>;
  registerClient: (email: string, password: string, displayName: string) => Promise<boolean>;
  loginDemoClient: () => void;
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
  adminNotifications: AdminNotification[];
  unreadAdminNotificationsCount: number;
  markAdminNotificationAsRead: (id: string) => void;
  markAllAdminNotificationsAsRead: () => void;
  deleteAdminNotification: (id: string) => void;
  createOrder: (data: { 
    eventType: EventType; 
    templateId: string; 
    planId: PlanTier; 
    clientEmail: string; 
    honoreeName: string;
    clientPhone?: string;
    eventDate?: string;
    receiptUrl?: string;
    paymentMethod?: 'transfer' | 'mercadopago';
  }) => Project;
  simulateTestOrder: () => Project;
  deleteAllOrders: () => void;
  deleteProject: (projectId: string) => void;
  deleteOrder: (projectId: string) => void;
  submitPayment: (projectId: string, provider: 'mercadopago' | 'transfer', receiptUrl?: string) => PaymentTransaction;
  confirmPaymentAdmin: (paymentId: string) => void;
  confirmOrderAdmin: (projectId: string) => void;
  rejectPaymentAdmin: (paymentId: string, reason?: string) => void;
  approveProjectByClient: (projectId: string) => void;
  requestClientCorrection: (projectId: string, notes: string) => void;
  adminSetProjectStatus: (projectId: string, status: ProjectStatus) => void;
  submitRsvp: (data: Omit<Rsvp, 'id' | 'createdAt'>) => void;
  activePreviewTemplate: DesignTemplate | null;
  previewTemplate: (template: DesignTemplate) => void;
  applyTemplateToProject: (projectId: string, template: DesignTemplate) => void;
  resetAllData: () => void;
  restoreDefaultOrders: () => void;
  reloadFromStorage: () => void;
  exportDatabaseJson: () => string;
}

const STORAGE_KEY = 'invitarte_v1_store';

export const DEMO_TEST_PROJECT_IDS = [
  'proj-boda-camila-lautaro',
  'proj-15anos-valentina',
  'proj-bautismo-mateo',
  'proj-boda-camila-lautaro-2026',
  'proj-15an-valentina-2026',
  'proj-bautismo-mateo-2026',
  'proj-comunion-santiago-2026',
  'proj-ref-comunion-001'
];

export const isDemoProject = (p: Partial<Project> | any): boolean => {
  if (!p) return false;
  // A real order may legitimately use the same name or email as old samples.
  // Only immutable fixture IDs are safe demo markers.
  return typeof p.id === 'string' && DEMO_TEST_PROJECT_IDS.includes(p.id);
};

export const safeSetLocalStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`LocalStorage quota exceeded writing ${key}, attempting cleanup...`, e);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_photos`);
      localStorage.removeItem(`${STORAGE_KEY}_blessings`);
      localStorage.setItem(key, value);
    } catch (innerErr) {
      console.error(`Fatal localStorage write failure for ${key}:`, innerErr);
    }
  }
};

const getDeletedIds = (): string[] => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_deleted_ids`);
    const saved: string[] = raw ? JSON.parse(raw) : [];
    return Array.from(new Set([...saved, ...DEMO_TEST_PROJECT_IDS]));
  } catch (e) {
    return DEMO_TEST_PROJECT_IDS;
  }
};

export const ADMIN_USER: User = {
  id: 'user-admin-root',
  email: 'hrgq.1984@gmail.com',
  displayName: 'Héctor René González Quiroga (Admin)',
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
  const [currentUser, setCurrentUserState] = useState<User>(VISITOR_USER);

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
  };

  const logout = () => {
    setCurrentUserState(VISITOR_USER);
    const auth = getFirebaseAuth();
    if (auth) signOut(auth).catch(() => {});
  };

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    const auth = getFirebaseAuth();
    if (!auth) return false;
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const token = await credential.user.getIdTokenResult(true);
      if (token.claims.admin !== true) {
        await signOut(auth);
        return false;
      }
      setCurrentUser({ ...ADMIN_USER, id: credential.user.uid, email: credential.user.email || email });
      return true;
    } catch {
      return false;
    }
  };

  const loginClient = async (email: string, password: string): Promise<boolean> => {
    const auth = getFirebaseAuth();
    if (!auth) return false;
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const project = projects.find(p => p.clientEmail.toLowerCase() === email.trim().toLowerCase());
      if (!project) {
        await signOut(auth);
        return false;
      }
      setCurrentUser({
        id: credential.user.uid,
        email: credential.user.email || email,
        displayName: project.honoreeName || 'Cliente InvitArte',
        role: 'client',
        phoneNumber: project.clientPhone,
        createdAt: new Date().toISOString()
      });
      setSelectedProjectId(project.id);
      return true;
    } catch {
      return false;
    }
  };

  const registerClient = async (email: string, password: string, displayName: string): Promise<boolean> => {
    const auth = getFirebaseAuth();
    if (!auth) return false;
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      setCurrentUser({
        id: credential.user.uid,
        email: credential.user.email || email,
        displayName: displayName || 'Cliente Registrado',
        role: 'client',
        createdAt: new Date().toISOString()
      });
      return true;
    } catch {
      return false;
    }
  };

  const loginDemoClient = () => {
    setCurrentUser(DEMO_CLIENT_USER);
  };

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUserState(VISITOR_USER);
        return;
      }
      const token = await firebaseUser.getIdTokenResult();
      const isAdmin = token.claims.admin === true;
      setCurrentUserState({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || (isAdmin ? ADMIN_USER.displayName : 'Cliente InvitArte'),
        role: isAdmin ? 'admin' : 'client',
        createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()).toISOString()
      });
    });
  }, []);

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
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<DesignTemplate | null>(null);

  const [projects, setProjects] = useState<Project[]>(() => {
    const deletedIds = getDeletedIds();
    const initialAvailable = INITIAL_PROJECTS.filter(p => !isDemoProject(p) && !deletedIds.includes(p.id));
    const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
    if (saved) {
      try {
        const parsed: Project[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(p => !isDemoProject(p) && !deletedIds.includes(p.id));
          return filtered;
        }
      } catch (e) {
        console.warn('Error reading saved projects:', e);
      }
    }
    return initialAvailable;
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    const deletedIds = getDeletedIds();
    const active = INITIAL_PROJECTS.find(p => !deletedIds.includes(p.id));
    return active ? active.id : REFERENCE_PROJECT.id;
  });

  const [eventSettingsMap, setEventSettingsMap] = useState<Record<string, EventSettings>>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_EVENT_SETTINGS_MAP, ...parsed };
      } catch (e) {}
    }
    return INITIAL_EVENT_SETTINGS_MAP;
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
    const deletedIds = getDeletedIds();
    const initialAvailable = INITIAL_PAYMENTS.filter(ip => !deletedIds.includes(ip.projectId));
    const saved = localStorage.getItem(`${STORAGE_KEY}_payments`);
    if (saved) {
      try {
        const parsed: PaymentTransaction[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(p => !deletedIds.includes(p.projectId));
          const missing = initialAvailable.filter(ip => !filtered.some(p => p.id === ip.id));
          return [...filtered, ...missing];
        }
      } catch (e) {}
    }
    return initialAvailable;
  });

  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>(() => {
    const deletedIds = getDeletedIds();
    const initialAvailable = INITIAL_NOTIFICATIONS.filter(inNotif => !deletedIds.includes(inNotif.projectId));
    const saved = localStorage.getItem(`${STORAGE_KEY}_admin_notifications`);
    if (saved) {
      try {
        const parsed: AdminNotification[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(n => !deletedIds.includes(n.projectId));
          const missing = initialAvailable.filter(inNotif => !filtered.some(n => n.id === inNotif.id));
          return [...filtered, ...missing];
        }
      } catch (e) {}
    }
    return initialAvailable;
  });

  // Sync state changes with localStorage & active cleanup of demo records
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem(`${STORAGE_KEY}_projects`);
      if (savedProjects) {
        const parsed: Project[] = JSON.parse(savedProjects);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(p => !isDemoProject(p));
          if (cleaned.length !== parsed.length) {
            safeSetLocalStorage(`${STORAGE_KEY}_projects`, JSON.stringify(cleaned));
            setProjects(cleaned);
          }
        }
      }
      const savedPayments = localStorage.getItem(`${STORAGE_KEY}_payments`);
      if (savedPayments) {
        const parsed: PaymentTransaction[] = JSON.parse(savedPayments);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(p => 
            !DEMO_TEST_PROJECT_IDS.includes(p.projectId) && 
            !p.id.includes('boda-camila') && 
            !p.id.includes('15anos-valentina') && 
            !p.id.includes('bautismo-mateo')
          );
          if (cleaned.length !== parsed.length) {
            safeSetLocalStorage(`${STORAGE_KEY}_payments`, JSON.stringify(cleaned));
            setPayments(cleaned);
          }
        }
      }
      const savedNotifs = localStorage.getItem(`${STORAGE_KEY}_admin_notifications`);
      if (savedNotifs) {
        const parsed: AdminNotification[] = JSON.parse(savedNotifs);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(n => 
            !DEMO_TEST_PROJECT_IDS.includes(n.projectId || '') && 
            !n.title.includes('5120') && 
            !n.title.includes('7842') && 
            !n.title.includes('9204')
          );
          if (cleaned.length !== parsed.length) {
            safeSetLocalStorage(`${STORAGE_KEY}_admin_notifications`, JSON.stringify(cleaned));
            setAdminNotifications(cleaned);
          }
        }
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    safeSetLocalStorage(`${STORAGE_KEY}_plans`, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    safeSetLocalStorage(`${STORAGE_KEY}_projects`, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    safeSetLocalStorage(`${STORAGE_KEY}_settings`, JSON.stringify(eventSettingsMap));
  }, [eventSettingsMap]);

  useEffect(() => {
    safeSetLocalStorage(`${STORAGE_KEY}_guests`, JSON.stringify(guestsMap));
  }, [guestsMap]);

  useEffect(() => {
    safeSetLocalStorage(`${STORAGE_KEY}_blessings`, JSON.stringify(blessingsMap));
  }, [blessingsMap]);

  useEffect(() => {
    safeSetLocalStorage(`${STORAGE_KEY}_photos`, JSON.stringify(photosMap));
  }, [photosMap]);

  useEffect(() => {
    safeSetLocalStorage(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    safeSetLocalStorage(`${STORAGE_KEY}_admin_notifications`, JSON.stringify(adminNotifications));
  }, [adminNotifications]);

  const reloadFromStorage = () => {
    try {
      const deletedIds = getDeletedIds();
      const initialProjectsAvailable = INITIAL_PROJECTS.filter(p => !isDemoProject(p) && !deletedIds.includes(p.id));
      const savedProjects = localStorage.getItem(`${STORAGE_KEY}_projects`);
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((p: any) => !isDemoProject(p) && !deletedIds.includes(p.id));
          setProjects(prev => {
            // Keep existing non-demo projects from memory that are active
            const map = new Map<string, Project>();
            for (const item of filtered) {
              map.set(item.id, item);
            }
            for (const item of prev) {
              if (!isDemoProject(item) && !deletedIds.includes(item.id) && !map.has(item.id)) {
                map.set(item.id, item);
              }
            }
            return Array.from(map.values());
          });
        }
      } else if (initialProjectsAvailable.length > 0) {
        setProjects(initialProjectsAvailable);
      }

      const initialPaymentsAvailable = INITIAL_PAYMENTS.filter(p => !deletedIds.includes(p.projectId));
      const savedPayments = localStorage.getItem(`${STORAGE_KEY}_payments`);
      if (savedPayments) {
        const parsed = JSON.parse(savedPayments);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((p: any) => !deletedIds.includes(p.projectId));
          setPayments(prev => {
            const map = new Map<string, PaymentTransaction>();
            for (const item of filtered) map.set(item.id, item);
            for (const item of prev) {
              if (!deletedIds.includes(item.projectId) && !map.has(item.id)) map.set(item.id, item);
            }
            return Array.from(map.values());
          });
        }
      } else if (initialPaymentsAvailable.length > 0) {
        setPayments(initialPaymentsAvailable);
      }

      const savedSettings = localStorage.getItem(`${STORAGE_KEY}_settings`);
      if (savedSettings) setEventSettingsMap(JSON.parse(savedSettings));
      const savedGuests = localStorage.getItem(`${STORAGE_KEY}_guests`);
      if (savedGuests) setGuestsMap(JSON.parse(savedGuests));
      const savedBlessings = localStorage.getItem(`${STORAGE_KEY}_blessings`);
      if (savedBlessings) setBlessingsMap(JSON.parse(savedBlessings));
      const savedPhotos = localStorage.getItem(`${STORAGE_KEY}_photos`);
      if (savedPhotos) setPhotosMap(JSON.parse(savedPhotos));

      const initialNotifsAvailable = INITIAL_NOTIFICATIONS.filter(n => !deletedIds.includes(n.projectId));
      const savedNotifs = localStorage.getItem(`${STORAGE_KEY}_admin_notifications`);
      if (savedNotifs) {
        const parsed = JSON.parse(savedNotifs);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((n: any) => !deletedIds.includes(n.projectId));
          setAdminNotifications(prev => {
            const map = new Map<string, AdminNotification>();
            for (const item of filtered) map.set(item.id, item);
            for (const item of prev) {
              if (!deletedIds.includes(item.projectId || '') && !map.has(item.id)) map.set(item.id, item);
            }
            return Array.from(map.values());
          });
        }
      } else if (initialNotifsAvailable.length > 0) {
        setAdminNotifications(initialNotifsAvailable);
      }
    } catch (e) {
      console.error('Error reloading from storage:', e);
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith(STORAGE_KEY)) {
        reloadFromStorage();
      }
    };
    const handleCustomChange = () => {
      reloadFromStorage();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('invitarte_store_updated', handleCustomChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('invitarte_store_updated', handleCustomChange);
    };
  }, []);

  // Real-time Cloud Synchronization with Firestore across all terminals & devices
  useEffect(() => {
    if (!db) return;

    // 1. Synchronize Projects across devices
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const deletedIds = getDeletedIds();
      const remoteProjects: Project[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as Project;
        if (data && data.id && !deletedIds.includes(data.id) && !isDemoProject(data)) {
          remoteProjects.push(data);
        }
      });

      setProjects(prev => {
        const map = new Map<string, Project>();
        // Remote projects are authoritative
        remoteProjects.forEach(p => map.set(p.id, p));
        // Keep active local projects that haven't been deleted
        prev.forEach(p => {
          if (!map.has(p.id) && !deletedIds.includes(p.id) && !isDemoProject(p)) {
            map.set(p.id, p);
          }
        });
        const merged = Array.from(map.values()).sort((a, b) => 
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        safeSetLocalStorage(`${STORAGE_KEY}_projects`, JSON.stringify(merged));
        return merged;
      });
    }, (err) => {
      console.warn('Firestore projects listener fallback to local cache:', err);
    });

    // 2. Synchronize Payments & Receipts
    const unsubPayments = onSnapshot(collection(db, 'payments'), (snapshot) => {
      const remotePayments: PaymentTransaction[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as PaymentTransaction;
        if (data && data.id && !isDemoProject({ id: data.projectId })) remotePayments.push(data);
      });

      setPayments(prev => {
        const map = new Map<string, PaymentTransaction>();
        remotePayments.forEach(p => map.set(p.id, p));
        prev.forEach(p => {
          if (!map.has(p.id)) map.set(p.id, p);
        });
        const merged = Array.from(map.values());
        safeSetLocalStorage(`${STORAGE_KEY}_payments`, JSON.stringify(merged));
        return merged;
      });
    }, (err) => {
      console.warn('Firestore payments listener fallback:', err);
    });

    // 3. Synchronize Admin Notifications
    const unsubNotifs = onSnapshot(collection(db, 'admin_notifications'), (snapshot) => {
      const remoteNotifs: AdminNotification[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as AdminNotification;
        if (data && data.id && !isDemoProject({ id: data.projectId })) remoteNotifs.push(data);
      });

      setAdminNotifications(prev => {
        const map = new Map<string, AdminNotification>();
        remoteNotifs.forEach(n => map.set(n.id, n));
        prev.forEach(n => {
          if (!map.has(n.id)) map.set(n.id, n);
        });
        const merged = Array.from(map.values()).sort((a, b) => 
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        safeSetLocalStorage(`${STORAGE_KEY}_admin_notifications`, JSON.stringify(merged));
        return merged;
      });
    }, (err) => {
      console.warn('Firestore notifications listener fallback:', err);
    });

    // 4. Synchronize Event Settings
    const unsubSettings = onSnapshot(collection(db, 'event_settings'), (snapshot) => {
      const remoteSettings: Record<string, EventSettings> = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as EventSettings;
        if (data && docSnap.id && !isDemoProject({ id: data.projectId || docSnap.id })) remoteSettings[docSnap.id] = data;
      });

      if (Object.keys(remoteSettings).length > 0) {
        setEventSettingsMap(prev => {
          const merged = { ...prev, ...remoteSettings };
          safeSetLocalStorage(`${STORAGE_KEY}_settings`, JSON.stringify(merged));
          return merged;
        });
      }
    }, (err) => {
      console.warn('Firestore event settings listener fallback:', err);
    });

    // 5. Synchronize Commercial Plans
    const unsubPlans = onSnapshot(collection(db, 'plans'), (snapshot) => {
      const remotePlans: Plan[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as Plan;
        if (data && data.id) remotePlans.push(data);
      });

      if (remotePlans.length > 0) {
        setPlans(prev => prev.map(p => {
          const remote = remotePlans.find(rp => rp.id === p.id);
          return remote ? { ...p, price: remote.price, active: remote.active } : p;
        }));
      }
    }, (err) => {
      console.warn('Firestore plans listener fallback:', err);
    });

    // 6. Synchronize Guests
    const unsubGuests = onSnapshot(collection(db, 'guests'), (snapshot) => {
      const grouped: Record<string, Guest[]> = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as Guest;
        if (data && data.projectId && !isDemoProject({ id: data.projectId })) {
          if (!grouped[data.projectId]) grouped[data.projectId] = [];
          grouped[data.projectId].push(data);
        }
      });
      if (Object.keys(grouped).length > 0) {
        setGuestsMap(prev => {
          const merged = { ...prev, ...grouped };
          safeSetLocalStorage(`${STORAGE_KEY}_guests`, JSON.stringify(merged));
          return merged;
        });
      }
    }, (err) => {
      console.warn('Firestore guests listener fallback:', err);
    });

    // 7. Synchronize Blessings
    const unsubBlessings = onSnapshot(collection(db, 'blessings'), (snapshot) => {
      const grouped: Record<string, Blessing[]> = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as Blessing;
        if (data && data.projectId && !isDemoProject({ id: data.projectId })) {
          if (!grouped[data.projectId]) grouped[data.projectId] = [];
          grouped[data.projectId].push(data);
        }
      });
      if (Object.keys(grouped).length > 0) {
        setBlessingsMap(prev => {
          const merged = { ...prev, ...grouped };
          safeSetLocalStorage(`${STORAGE_KEY}_blessings`, JSON.stringify(merged));
          return merged;
        });
      }
    }, (err) => {
      console.warn('Firestore blessings listener fallback:', err);
    });

    // 8. Synchronize Photos
    const unsubPhotos = onSnapshot(collection(db, 'photos'), (snapshot) => {
      const grouped: Record<string, EventPhoto[]> = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as EventPhoto;
        if (data && data.projectId && !isDemoProject({ id: data.projectId })) {
          if (!grouped[data.projectId]) grouped[data.projectId] = [];
          grouped[data.projectId].push(data);
        }
      });
      if (Object.keys(grouped).length > 0) {
        setPhotosMap(prev => {
          const merged = { ...prev, ...grouped };
          safeSetLocalStorage(`${STORAGE_KEY}_photos`, JSON.stringify(merged));
          return merged;
        });
      }
    }, (err) => {
      console.warn('Firestore photos listener fallback:', err);
    });

    return () => {
      unsubProjects();
      unsubPayments();
      unsubNotifs();
      unsubSettings();
      unsubPlans();
      unsubGuests();
      unsubBlessings();
      unsubPhotos();
    };
  }, [currentUser.role, currentUser.email]);

  const markAdminNotificationAsRead = (id: string) => {
    setAdminNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (db) {
      setDoc(doc(db, 'admin_notifications', id), { read: true }, { merge: true }).catch(() => {});
    }
  };

  const markAllAdminNotificationsAsRead = () => {
    setAdminNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      if (db) {
        updated.forEach(n => {
          setDoc(doc(db, 'admin_notifications', n.id), { read: true }, { merge: true }).catch(() => {});
        });
      }
      return updated;
    });
  };

  const deleteAdminNotification = (id: string) => {
    setAdminNotifications(prev => prev.filter(n => n.id !== id));
    if (db) {
      deleteDoc(doc(db, 'admin_notifications', id)).catch(() => {});
    }
  };

  const unreadAdminNotificationsCount = adminNotifications.filter(n => !n.read).length;

  // Current active project & settings
  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0] || REFERENCE_PROJECT;
  const currentEventSettings = eventSettingsMap[currentProject.id] || (
    currentProject.id === REFERENCE_PROJECT.id ? REFERENCE_EVENT_SETTINGS : {
      ...REFERENCE_EVENT_SETTINGS,
      projectId: currentProject.id,
      title: currentProject.honoreeName || REFERENCE_EVENT_SETTINGS.title,
      honoreeName: currentProject.honoreeName || REFERENCE_EVENT_SETTINGS.honoreeName,
      date: currentProject.eventDate || REFERENCE_EVENT_SETTINGS.date
    }
  );
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
    if (db) {
      setDoc(doc(db, 'plans', planId), { id: planId, price: newPrice }, { merge: true }).catch(() => {});
    }
  };

  const updateEventSettings = (projectId: string, settings: Partial<EventSettings>) => {
    setEventSettingsMap(prev => {
      const updated = {
        ...(prev[projectId] || REFERENCE_EVENT_SETTINGS),
        ...settings,
        projectId
      };
      const nextMap = {
        ...prev,
        [projectId]: updated
      };
      safeSetLocalStorage(`${STORAGE_KEY}_settings`, JSON.stringify(nextMap));
      if (db) {
        setDoc(doc(db, 'event_settings', projectId), cleanForFirestore(updated), { merge: true }).catch((err) => {
          console.warn('Firestore setDoc event_settings error:', err);
        });
      }
      return nextMap;
    });

    // Also synchronize projects if honoreeName, eventDate or title changed
    if (settings.honoreeName || settings.date) {
      setProjects(prev => {
        const next = prev.map(p => {
          if (p.id === projectId) {
            return {
              ...p,
              ...(settings.honoreeName ? { honoreeName: settings.honoreeName } : {}),
              ...(settings.date ? { eventDate: settings.date } : {}),
              updatedAt: new Date().toISOString()
            };
          }
          return p;
        });
        safeSetLocalStorage(`${STORAGE_KEY}_projects`, JSON.stringify(next));
        if (db) {
          const target = next.find(p => p.id === projectId);
          if (target) {
            setDoc(doc(db, 'projects', projectId), cleanForFirestore(target), { merge: true }).catch(() => {});
          }
        }
        return next;
      });
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('invitarte_store_updated'));
    }
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

    if (db) {
      setDoc(doc(db, 'guests', newGuest.id), cleanForFirestore(newGuest)).catch(() => {});
    }

    return newGuest;
  };

  const updateGuest = (projectId: string, guestId: string, updates: Partial<Guest>) => {
    setGuestsMap(prev => {
      const list = prev[projectId] || [];
      const updatedList = list.map(g => {
        if (g.id === guestId) {
          const updated = { ...g, ...updates, updatedAt: new Date().toISOString() };
          if (db) {
            setDoc(doc(db, 'guests', guestId), cleanForFirestore(updated), { merge: true }).catch(() => {});
          }
          return updated;
        }
        return g;
      });
      return {
        ...prev,
        [projectId]: updatedList
      };
    });
  };

  const deleteGuest = (projectId: string, guestId: string) => {
    setGuestsMap(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).filter(g => g.id !== guestId)
    }));
    if (db) {
      deleteDoc(doc(db, 'guests', guestId)).catch(() => {});
    }
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

        const gItem: Guest = {
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
        };
        newGuests.push(gItem);

        if (db) {
          setDoc(doc(db, 'guests', gItem.id), cleanForFirestore(gItem)).catch(() => {});
        }
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

    if (db) {
      setDoc(doc(db, 'blessings', newBlessing.id), cleanForFirestore(newBlessing)).catch(() => {});
    }

    return newBlessing;
  };

  const moderateBlessing = (projectId: string, blessingId: string, status: 'approved' | 'rejected') => {
    setBlessingsMap(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).map(b => b.id === blessingId ? { ...b, status } : b)
    }));
    if (db) {
      setDoc(doc(db, 'blessings', blessingId), { status }, { merge: true }).catch(() => {});
    }
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

    if (db) {
      setDoc(doc(db, 'photos', newPhoto.id), cleanForFirestore(newPhoto)).catch(() => {});
    }

    return newPhoto;
  };

  const moderatePhoto = (projectId: string, photoId: string, status: 'approved' | 'rejected') => {
    setPhotosMap(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).map(p => p.id === photoId ? { ...p, status } : p)
    }));
    if (db) {
      setDoc(doc(db, 'photos', photoId), { status }, { merge: true }).catch(() => {});
    }
  };

  const updateDisplaySettings = (projectId: string, settings: Partial<DisplaySettings>) => {
    setDisplaySettingsMap(prev => {
      const updated = {
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
      };
      if (db) {
        setDoc(doc(db, 'display_settings', projectId), cleanForFirestore(updated), { merge: true }).catch(() => {});
      }
      return {
        ...prev,
        [projectId]: updated
      };
    });
  };


  const createOrder = (data: { 
    eventType: EventType; 
    templateId: string; 
    planId: PlanTier; 
    clientEmail: string; 
    honoreeName: string;
    clientPhone?: string;
    eventDate?: string;
    receiptUrl?: string;
    paymentMethod?: 'transfer' | 'mercadopago';
  }): Project => {
    const tmpl = templates.find(t => t.id === data.templateId) || templates[0];
    const plan = plans.find(p => p.id === data.planId) || plans[0];
    const projectId = `proj-${data.eventType}-${Date.now().toString(36)}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${data.eventType.toUpperCase().slice(0, 4)}-${randomSuffix}`;
    const slug = `${data.eventType}-${data.honoreeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.floor(100 + Math.random() * 900)}`;

    const paymentMethod = data.paymentMethod || 'transfer';
    const isInstant = paymentMethod === 'mercadopago';
    const now = new Date();
    const reviewDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const newProject: Project = {
      id: projectId,
      orderNumber,
      clientId: currentUser.id,
      clientEmail: data.clientEmail || currentUser.email,
      clientPhone: data.clientPhone,
      honoreeName: data.honoreeName,
      eventDate: data.eventDate || tmpl.sampleDate,
      eventType: data.eventType,
      templateId: data.templateId,
      planId: data.planId,
      amount: plan.price,
      currency: plan.currency,
      status: isInstant ? 'preview_available' : 'payment_review',
      publicSlug: slug,
      previewToken: `tok-${Math.random().toString(36).substring(2, 10)}`,
      receiptUrl: data.receiptUrl,
      paymentMethod,
      paidAt: isInstant ? now.toISOString() : undefined,
      previewAvailableAt: isInstant ? now.toISOString() : undefined,
      expiresAt: isInstant ? reviewDeadline.toISOString() : undefined,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    // Initialize event settings from template
    const newSettings: EventSettings = {
      projectId,
      title: tmpl.name,
      honoreeName: data.honoreeName,
      subtitle: `Celebración de ${tmpl.name}`,
      date: data.eventDate || tmpl.sampleDate,
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

    // Create payment transaction
    const paymentId = `pay-${Date.now()}`;
    const newPayment: PaymentTransaction = {
      id: paymentId,
      projectId,
      provider: paymentMethod,
      providerPaymentId: isInstant ? `MP-${Math.floor(10000000 + Math.random() * 90000000)}` : undefined,
      amount: plan.price,
      currency: plan.currency,
      status: isInstant ? 'completed' : 'review',
      receiptUrl: data.receiptUrl,
      paidAt: isInstant ? now.toISOString() : undefined,
      createdAt: now.toISOString()
    };

    // Create Admin Notification for newly contracted service
    const planName = data.planId.toUpperCase();
    const notif: AdminNotification = {
      id: `notif-order-${Date.now()}`,
      type: data.receiptUrl ? 'receipt_uploaded' : 'order_created',
      title: `Nuevo Pedido #${orderNumber} (${planName})`,
      message: `El cliente ${data.honoreeName} (${data.clientEmail || 'nuevo'}, WhatsApp: ${data.clientPhone || 'No especificado'}) ingresó un nuevo pedido para "${tmpl.name}" (Plan ${planName}, $${plan.price.toLocaleString('es-AR')} ${plan.currency}). ${data.receiptUrl ? 'Comprobante bancario adjunto para validar.' : 'Pendiente de comprobante.'}`,
      projectId,
      paymentId,
      read: false,
      createdAt: now.toISOString()
    };

    // Ensure the new project ID is never blocked by deletedIds
    try {
      const deletedIds = getDeletedIds();
      if (deletedIds.includes(projectId)) {
        const cleaned = deletedIds.filter(id => id !== projectId);
        localStorage.setItem(`${STORAGE_KEY}_deleted_ids`, JSON.stringify(cleaned));
      }
    } catch (e) {}

    // Auto-login client session if not admin
    if (currentUser.role !== 'admin') {
      setCurrentUser({
        id: `client-${projectId}`,
        email: data.clientEmail || 'cliente@invitarte.com',
        displayName: data.honoreeName || 'Cliente Agasajado',
        role: 'client',
        createdAt: now.toISOString()
      });
    }

    // Update state
    setProjects(prev => [newProject, ...prev.filter(p => p.id !== projectId)]);
    setEventSettingsMap(prev => ({ ...prev, [projectId]: newSettings }));
    setPayments(prev => [newPayment, ...prev.filter(p => p.id !== paymentId)]);
    setAdminNotifications(prev => [notif, ...prev.filter(n => n.id !== notif.id)]);
    setSelectedProjectId(projectId);

    // Write immediately to localStorage to guarantee cross-view persistence
    try {
      const savedProjects = localStorage.getItem(`${STORAGE_KEY}_projects`);
      const existingProjects = savedProjects ? JSON.parse(savedProjects) : [];
      safeSetLocalStorage(`${STORAGE_KEY}_projects`, JSON.stringify([newProject, ...existingProjects.filter((p: any) => p.id !== projectId)]));

      const savedPayments = localStorage.getItem(`${STORAGE_KEY}_payments`);
      const existingPayments = savedPayments ? JSON.parse(savedPayments) : [];
      safeSetLocalStorage(`${STORAGE_KEY}_payments`, JSON.stringify([newPayment, ...existingPayments.filter((p: any) => p.id !== paymentId)]));

      const savedSettings = localStorage.getItem(`${STORAGE_KEY}_settings`);
      const existingSettings = savedSettings ? JSON.parse(savedSettings) : {};
      safeSetLocalStorage(`${STORAGE_KEY}_settings`, JSON.stringify({ ...existingSettings, [projectId]: newSettings }));

      const savedNotifs = localStorage.getItem(`${STORAGE_KEY}_admin_notifications`);
      const existingNotifs = savedNotifs ? JSON.parse(savedNotifs) : [];
      safeSetLocalStorage(`${STORAGE_KEY}_admin_notifications`, JSON.stringify([notif, ...existingNotifs]));
    } catch (e) {
      console.warn('LocalStorage write warning:', e);
    }

    // Persist immediately to Firestore cloud database so order syncs across all devices & terminals
    if (db) {
      setDoc(doc(db, 'projects', projectId), cleanForFirestore(newProject)).catch(e => console.warn('Firestore project write warning:', e));
      setDoc(doc(db, 'payments', paymentId), cleanForFirestore(newPayment)).catch(e => console.warn('Firestore payment write warning:', e));
      setDoc(doc(db, 'event_settings', projectId), cleanForFirestore(newSettings)).catch(e => console.warn('Firestore settings write warning:', e));
      setDoc(doc(db, 'admin_notifications', notif.id), cleanForFirestore(notif)).catch(e => console.warn('Firestore notif write warning:', e));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('invitarte_store_updated'));
    }

    return newProject;
  };


  const simulateTestOrder = (): Project => {
    const testSamples: Array<{
      eventType: EventType;
      templateId: string;
      planId: PlanTier;
      clientEmail: string;
      honoreeName: string;
      clientPhone: string;
      eventDate: string;
      paymentMethod: 'transfer';
      receiptUrl: string;
    }> = [
      {
        eventType: 'boda',
        templateId: 'boda-champagne',
        planId: 'oro',
        clientEmail: 'sofia.mateo@gmail.com',
        honoreeName: 'Sofía & Mateo',
        clientPhone: '+54 9 11 5566 7788',
        eventDate: '2026-11-21',
        paymentMethod: 'transfer',
        receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80'
      },
      {
        eventType: '15anos',
        templateId: '15-blush',
        planId: 'plata',
        clientEmail: 'martina.quince@gmail.com',
        honoreeName: 'Martina Paz',
        clientPhone: '+54 9 3835 441122',
        eventDate: '2026-10-18',
        paymentMethod: 'transfer',
        receiptUrl: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=900&auto=format&fit=crop&q=80'
      },
      {
        eventType: 'cumpleanos',
        templateId: 'cumple-colorido',
        planId: 'bronce',
        clientEmail: 'gonzalo.cumple@gmail.com',
        honoreeName: 'Gonzalo Fernández (40 Años)',
        clientPhone: '+54 9 351 998877',
        eventDate: '2026-12-05',
        paymentMethod: 'transfer',
        receiptUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=900&auto=format&fit=crop&q=80'
      },
      {
        eventType: 'bautismo',
        templateId: 'bautismo-celestial',
        planId: 'plata',
        clientEmail: 'lucia.bautismo@gmail.com',
        honoreeName: 'Lucía Milagros',
        clientPhone: '+54 9 383 552233',
        eventDate: '2026-10-30',
        paymentMethod: 'transfer',
        receiptUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=900&auto=format&fit=crop&q=80'
      }
    ];

    const pick = testSamples[Math.floor(Math.random() * testSamples.length)];
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    return createOrder({
      ...pick,
      honoreeName: `${pick.honoreeName} #${randomSuffix}`
    });
  };

  const deleteAllOrders = () => {
    try {
      const allIds = projects.map(p => p.id);
      const deletedIds = getDeletedIds();
      const updatedDeleted = Array.from(new Set([...deletedIds, ...allIds, ...DEMO_TEST_PROJECT_IDS]));
      localStorage.setItem(`${STORAGE_KEY}_deleted_ids`, JSON.stringify(updatedDeleted));
      localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify([]));
      localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify([]));
      localStorage.setItem(`${STORAGE_KEY}_admin_notifications`, JSON.stringify([]));

      setProjects([]);
      setPayments([]);
      setAdminNotifications([]);
      setSelectedProjectId(REFERENCE_PROJECT.id);

      if (db) {
        allIds.forEach(id => {
          deleteDoc(doc(db, 'projects', id)).catch(() => {});
          deleteDoc(doc(db, 'event_settings', id)).catch(() => {});
        });
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('invitarte_store_updated'));
      }
    } catch (e) {
      console.error('Error deleting all orders:', e);
    }
  };

  const deleteProject = (projectId: string) => {
    // 1. Record ID into deleted list to prevent resurrection
    try {
      const deletedIds = getDeletedIds();
      if (!deletedIds.includes(projectId)) {
        localStorage.setItem(`${STORAGE_KEY}_deleted_ids`, JSON.stringify([...deletedIds, projectId]));
      }
    } catch (e) {
      console.warn('Error recording deleted project ID:', e);
    }

    // 2. Remove from projects
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== projectId);
      try {
        localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // 3. Remove from payments
    setPayments(prev => {
      const updated = prev.filter(p => p.projectId !== projectId);
      try {
        localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // 4. Remove from admin notifications
    setAdminNotifications(prev => {
      const updated = prev.filter(n => n.projectId !== projectId);
      try {
        localStorage.setItem(`${STORAGE_KEY}_admin_notifications`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // 5. Remove from event settings
    setEventSettingsMap(prev => {
      const copy = { ...prev };
      delete copy[projectId];
      try {
        localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(copy));
      } catch (e) {}
      return copy;
    });

    // 6. Remove guests, blessings, photos
    setGuestsMap(prev => {
      const copy = { ...prev };
      delete copy[projectId];
      try {
        localStorage.setItem(`${STORAGE_KEY}_guests`, JSON.stringify(copy));
      } catch (e) {}
      return copy;
    });

    setBlessingsMap(prev => {
      const copy = { ...prev };
      delete copy[projectId];
      try {
        localStorage.setItem(`${STORAGE_KEY}_blessings`, JSON.stringify(copy));
      } catch (e) {}
      return copy;
    });

    setPhotosMap(prev => {
      const copy = { ...prev };
      delete copy[projectId];
      try {
        localStorage.setItem(`${STORAGE_KEY}_photos`, JSON.stringify(copy));
      } catch (e) {}
      return copy;
    });

    // 7. Adjust selected project if deleted
    setSelectedProjectId(prev => {
      if (prev === projectId) {
        const remaining = projects.filter(p => p.id !== projectId);
        return remaining[0]?.id || REFERENCE_PROJECT.id;
      }
      return prev;
    });

    // 8. Delete from Firestore cloud database
    if (db) {
      deleteDoc(doc(db, 'projects', projectId)).catch(() => {});
      deleteDoc(doc(db, 'event_settings', projectId)).catch(() => {});
    }

    // 9. Broadcast update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('invitarte_store_updated'));
    }
  };


  const deleteOrder = deleteProject;

  const submitPayment = (projectId: string, provider: 'mercadopago' | 'transfer', receiptUrl?: string): PaymentTransaction => {
    const proj = projects.find(p => p.id === projectId);
    const plan = proj ? (plans.find(p => p.id === proj.planId) || plans[0]) : plans[0];
    const settings = eventSettingsMap[projectId] || REFERENCE_EVENT_SETTINGS;

    const existingPayment = payments.find(p => p.projectId === projectId);
    const paymentId = existingPayment ? existingPayment.id : `pay-${Date.now()}`;
    const amount = proj?.amount || plan.price;
    const currency = proj?.currency || plan.currency;

    const updatedPayment: PaymentTransaction = {
      id: paymentId,
      projectId,
      provider,
      providerPaymentId: provider === 'mercadopago' ? `MP-${Math.floor(10000000 + Math.random() * 90000000)}` : undefined,
      amount,
      currency,
      status: provider === 'mercadopago' ? 'completed' : 'review',
      receiptUrl: receiptUrl || existingPayment?.receiptUrl,
      paidAt: provider === 'mercadopago' ? new Date().toISOString() : undefined,
      createdAt: existingPayment ? existingPayment.createdAt : new Date().toISOString()
    };

    setPayments(prev => [updatedPayment, ...prev.filter(p => p.id !== paymentId)]);

    // If instant Mercado Pago payment
    if (provider === 'mercadopago') {
      const now = new Date();
      const reviewDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours window
      setProjects(prev => prev.map(p => p.id === projectId ? {
        ...p,
        status: 'preview_available',
        receiptUrl: receiptUrl || p.receiptUrl,
        paidAt: now.toISOString(),
        previewAvailableAt: now.toISOString(),
        expiresAt: reviewDeadline.toISOString(),
        updatedAt: now.toISOString()
      } : p));

      if (db) {
        setDoc(doc(db, 'payments', paymentId), cleanForFirestore(updatedPayment), { merge: true }).catch(() => {});
        setDoc(doc(db, 'projects', projectId), {
          status: 'preview_available',
          receiptUrl: receiptUrl || undefined,
          paidAt: now.toISOString(),
          previewAvailableAt: now.toISOString(),
          expiresAt: reviewDeadline.toISOString(),
          updatedAt: now.toISOString()
        }, { merge: true }).catch(() => {});
      }
    } else {
      setProjects(prev => prev.map(p => p.id === projectId ? {
        ...p,
        status: 'payment_review',
        receiptUrl: receiptUrl || p.receiptUrl,
        updatedAt: new Date().toISOString()
      } : p));

      // Emit high-priority notification to Administrator for bank transfer receipt validation
      const notif: AdminNotification = {
        id: `notif-receipt-${Date.now()}`,
        type: 'receipt_uploaded',
        title: receiptUrl ? 'Nuevo Comprobante de Transferencia' : 'Transferencia Bancaria Registrada',
        message: `Se registró el pago de $${amount.toLocaleString('es-AR')} para "${settings.honoreeName}" (${proj?.clientEmail || 'cliente'}). Requiere validación de comprobante para habilitar la vista previa de 24h.`,
        projectId,
        paymentId,
        read: false,
        createdAt: new Date().toISOString()
      };
      setAdminNotifications(prev => [notif, ...prev]);

      if (db) {
        setDoc(doc(db, 'payments', paymentId), cleanForFirestore(updatedPayment), { merge: true }).catch(() => {});
        setDoc(doc(db, 'projects', projectId), {
          status: 'payment_review',
          receiptUrl: receiptUrl || undefined,
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(() => {});
        setDoc(doc(db, 'admin_notifications', notif.id), cleanForFirestore(notif)).catch(() => {});
      }
    }

    return updatedPayment;
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

    // Mark related notification as read if exists
    setAdminNotifications(prev => prev.map(n => n.paymentId === paymentId || n.projectId === pay.projectId ? { ...n, read: true } : n));

    if (db) {
      setDoc(doc(db, 'payments', paymentId), { status: 'completed', paidAt: now.toISOString() }, { merge: true }).catch(() => {});
      setDoc(doc(db, 'projects', pay.projectId), {
        status: 'preview_available',
        paidAt: now.toISOString(),
        previewAvailableAt: now.toISOString(),
        expiresAt: reviewDeadline.toISOString(),
        updatedAt: now.toISOString()
      }, { merge: true }).catch(() => {});
    }
  };

  const confirmOrderAdmin = (projectId: string) => {
    const now = new Date();
    const reviewDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      status: 'preview_available',
      paidAt: now.toISOString(),
      previewAvailableAt: now.toISOString(),
      expiresAt: reviewDeadline.toISOString(),
      updatedAt: now.toISOString()
    } : p));

    setPayments(prev => prev.map(p => p.projectId === projectId ? {
      ...p,
      status: 'completed',
      paidAt: now.toISOString()
    } : p));

    setAdminNotifications(prev => prev.map(n => n.projectId === projectId ? { ...n, read: true } : n));

    if (db) {
      setDoc(doc(db, 'projects', projectId), {
        status: 'preview_available',
        paidAt: now.toISOString(),
        previewAvailableAt: now.toISOString(),
        expiresAt: reviewDeadline.toISOString(),
        updatedAt: now.toISOString()
      }, { merge: true }).catch(() => {});
      payments.filter(p => p.projectId === projectId).forEach(p => {
        setDoc(doc(db, 'payments', p.id), { status: 'completed', paidAt: now.toISOString() }, { merge: true }).catch(() => {});
      });
    }
  };

  const rejectPaymentAdmin = (paymentId: string, reason?: string) => {
    const pay = payments.find(p => p.id === paymentId);
    if (!pay) return;

    setPayments(prev => prev.map(p => p.id === paymentId ? {
      ...p,
      status: 'failed',
      receiptNotes: reason || 'Comprobante no válido o importe insuficiente'
    } : p));

    setProjects(prev => prev.map(p => p.id === pay.projectId ? {
      ...p,
      status: 'pending_payment',
      correctionNotes: reason || 'El comprobante de transferencia bancaria no pudo ser validado. Por favor, vuelve a subir el comprobante correcto.',
      updatedAt: new Date().toISOString()
    } : p));

    // Mark related notification as read
    setAdminNotifications(prev => prev.map(n => n.paymentId === paymentId ? { ...n, read: true } : n));

    if (db) {
      setDoc(doc(db, 'payments', paymentId), {
        status: 'failed',
        receiptNotes: reason || 'Comprobante no válido o importe insuficiente'
      }, { merge: true }).catch(() => {});
      setDoc(doc(db, 'projects', pay.projectId), {
        status: 'pending_payment',
        correctionNotes: reason || 'El comprobante de transferencia bancaria no pudo ser validado. Por favor, vuelve a subir el comprobante correcto.',
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});
    }
  };

  const approveProjectByClient = (projectId: string) => {
    const now = new Date();
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      status: 'published',
      publishedAt: now.toISOString(),
      updatedAt: now.toISOString()
    } : p));

    if (db) {
      setDoc(doc(db, 'projects', projectId), {
        status: 'published',
        publishedAt: now.toISOString(),
        updatedAt: now.toISOString()
      }, { merge: true }).catch(() => {});
    }
  };

  const requestClientCorrection = (projectId: string, notes: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      correctionNotes: notes,
      updatedAt: new Date().toISOString()
    } : p));

    if (db) {
      setDoc(doc(db, 'projects', projectId), {
        correctionNotes: notes,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});
    }
  };

  const adminSetProjectStatus = (projectId: string, status: ProjectStatus) => {
    const now = new Date();
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p,
      status,
      publishedAt: status === 'published' ? (p.publishedAt || now.toISOString()) : p.publishedAt,
      updatedAt: now.toISOString()
    } : p));

    if (db) {
      setDoc(doc(db, 'projects', projectId), {
        status,
        publishedAt: status === 'published' ? now.toISOString() : undefined,
        updatedAt: now.toISOString()
      }, { merge: true }).catch(() => {});
    }
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
    setActivePreviewTemplate(template);
  };

  const applyTemplateToProject = (projectId: string, template: DesignTemplate) => {
    const existing = eventSettingsMap[projectId];
    if (existing) {
      const updatedSettings: EventSettings = {
        ...existing,
        primaryColor: template.palette.primary,
        secondaryColor: template.palette.secondary,
        accentColor: template.palette.accent,
        fontFamily: template.fontFamily,
        envelopeColor: template.envelopeColor,
        waxSealText: template.waxSealSymbol,
        updatedAt: new Date().toISOString()
      };

      setEventSettingsMap(prev => {
        const next = { ...prev, [projectId]: updatedSettings };
        safeSetLocalStorage(`${STORAGE_KEY}_settings`, JSON.stringify(next));
        if (db) {
          setDoc(doc(db, 'event_settings', projectId), cleanForFirestore(updatedSettings), { merge: true }).catch(() => {});
        }
        return next;
      });

      setProjects(prev => {
        const next = prev.map(p => p.id === projectId ? { 
          ...p, 
          templateId: template.id,
          eventType: template.eventType,
          planId: template.requiredPlan
        } : p);
        safeSetLocalStorage(`${STORAGE_KEY}_projects`, JSON.stringify(next));
        if (db) {
          const target = next.find(p => p.id === projectId);
          if (target) {
            setDoc(doc(db, 'projects', projectId), cleanForFirestore(target), { merge: true }).catch(() => {});
          }
        }
        return next;
      });
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
    localStorage.removeItem(`${STORAGE_KEY}_admin_notifications`);
    localStorage.removeItem(`${STORAGE_KEY}_deleted_ids`);
    setPlans(INITIAL_PLANS);
    setProjects(INITIAL_PROJECTS);
    setSelectedProjectId(INITIAL_PROJECTS[0]?.id || REFERENCE_PROJECT.id);
    setEventSettingsMap(INITIAL_EVENT_SETTINGS_MAP);
    setGuestsMap({ [REFERENCE_PROJECT.id]: REFERENCE_GUESTS });
    setBlessingsMap({ [REFERENCE_PROJECT.id]: REFERENCE_BLESSINGS });
    setPhotosMap({ [REFERENCE_PROJECT.id]: REFERENCE_EVENT_PHOTOS });
    setPayments(INITIAL_PAYMENTS);
    setAdminNotifications(INITIAL_NOTIFICATIONS);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('invitarte_store_updated'));
    }
  };

  const restoreDefaultOrders = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_deleted_ids`);
      const initialIds = INITIAL_PROJECTS.map(p => p.id);
      const customProjects = projects.filter(p => !initialIds.includes(p.id));
      const combinedProjects = [...customProjects, ...INITIAL_PROJECTS];
      
      setProjects(combinedProjects);
      localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(combinedProjects));

      const initialPaymentIds = INITIAL_PAYMENTS.map(p => p.id);
      const customPayments = payments.filter(p => !initialPaymentIds.includes(p.id));
      const combinedPayments = [...customPayments, ...INITIAL_PAYMENTS];
      setPayments(combinedPayments);
      localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(combinedPayments));

      const initialNotifIds = INITIAL_NOTIFICATIONS.map(n => n.id);
      const customNotifs = adminNotifications.filter(n => !initialNotifIds.includes(n.id));
      const combinedNotifs = [...customNotifs, ...INITIAL_NOTIFICATIONS];
      setAdminNotifications(combinedNotifs);
      localStorage.setItem(`${STORAGE_KEY}_admin_notifications`, JSON.stringify(combinedNotifs));

      if (combinedProjects.length > 0 && !selectedProjectId) {
        setSelectedProjectId(combinedProjects[0].id);
      }
    } catch (e) {
      console.error('Error restoring default orders:', e);
    }
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
      adminNotifications,
      unreadAdminNotificationsCount,
      markAdminNotificationAsRead,
      markAllAdminNotificationsAsRead,
      deleteAdminNotification,
      createOrder,
      simulateTestOrder,
      deleteAllOrders,
      deleteProject,
      deleteOrder,
      submitPayment,
      confirmPaymentAdmin,
      confirmOrderAdmin,
      rejectPaymentAdmin,
      approveProjectByClient,
      requestClientCorrection,
      adminSetProjectStatus,
      submitRsvp,
      activePreviewTemplate,
      previewTemplate,
      applyTemplateToProject,
      resetAllData,
      restoreDefaultOrders,
      reloadFromStorage,
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
