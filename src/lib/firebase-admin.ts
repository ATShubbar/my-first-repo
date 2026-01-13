import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';

let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;
let adminStorage: Storage;

function initializeAdminApp() {
  if (getApps().length === 0) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccount) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
    }

    adminApp = initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } else {
    adminApp = getApps()[0];
  }

  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
  adminStorage = getStorage(adminApp);

  return { adminApp, adminAuth, adminDb, adminStorage };
}

export function getAdminAuth(): Auth {
  if (!adminAuth) {
    initializeAdminApp();
  }
  return adminAuth;
}

export function getAdminDb(): Firestore {
  if (!adminDb) {
    initializeAdminApp();
  }
  return adminDb;
}

export function getAdminStorage(): Storage {
  if (!adminStorage) {
    initializeAdminApp();
  }
  return adminStorage;
}
