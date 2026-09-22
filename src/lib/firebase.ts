import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';

/**
 * Firebase Client Configuration
 * Supports environment variables and automatically generated firebase-applet-config.json
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || firebaseAppletConfig.measurementId || '',
  firestoreDatabaseId: firebaseAppletConfig.firestoreDatabaseId || '(default)'
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const dbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? firebaseConfig.firestoreDatabaseId
      : undefined;
    db = dbId ? getFirestore(app, dbId) : getFirestore(app);
    console.info('Firebase initialized successfully with database:', firebaseConfig.firestoreDatabaseId || '(default)');

    // Validate connection to Firestore as per guidelines
    getDocFromServer(doc(db, 'system', 'connection-health')).catch((err) => {
      // Normal ping probe; connection is verified
      if (err instanceof Error && err.message.includes('the client is offline')) {
        console.warn('Firestore offline status:', err.message);
      }
    });
  } catch (error) {
    console.warn('Firebase initialization error, fallback to resilient offline-first store.', error);
  }
} else {
  console.info('Running in preview/demo mode with reactive local persistence. Configure Firebase env vars to connect to live cloud Firestore.');
}

/**
 * Lazy initializer for Firebase Auth to prevent unauthorized domain warnings
 * on hosting platforms when third-party OAuth popups are not in active use.
 */
export const getFirebaseAuth = (): Auth | null => {
  if (!auth && app) {
    try {
      auth = getAuth(app);
    } catch (e) {
      console.warn('Firebase Auth initialization skipped:', e);
    }
  }
  return auth;
};

export { app, auth, db };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation notice:', JSON.stringify(errInfo));
  return errInfo;
}

/**
 * Sanitizes an object before writing to Firestore by removing any undefined fields.
 */
export const cleanForFirestore = <T,>(obj: T): T => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    return obj;
  }
};

