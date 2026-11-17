import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { initializeFirestore, getFirestore, setLogLevel, type Firestore } from 'firebase/firestore';

// Régler le niveau de journalisation pour éviter les avertissements verbeux du SDK
// liés aux tentatives de streaming WebSockets dans l'environnement iframe/proxy
try {
  setLogLevel('error');
} catch {
  // Ignorer si l'environnement ne le permet pas
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || '';
const hasValidFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// Initialisation unique de l'application Firebase si configurée
export const app: FirebaseApp | null = hasValidFirebaseConfig
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;

// Initialisation de Firestore avec experimentalForceLongPolling activé dans le navigateur.
function getInitializedFirestore(): Firestore {
  if (!app) {
    return null as unknown as Firestore;
  }

  const isBrowser = typeof window !== 'undefined';
  const settings = isBrowser
    ? { experimentalForceLongPolling: true }
    : {};

  try {
    return databaseId
      ? initializeFirestore(app, settings, databaseId)
      : initializeFirestore(app, settings);
  } catch {
    return databaseId
      ? getFirestore(app, databaseId)
      : getFirestore(app);
  }
}

export const db: Firestore = getInitializedFirestore();

