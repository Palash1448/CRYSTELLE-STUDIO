import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

export const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'admin123',
  name: 'Kartiki',
  role: 'Master Artisan & Super Admin',
};

export interface AdminSession {
  email: string;
  name: string;
  role: string;
  token: string;
  loggedInAt: string;
  uid?: string | undefined;
  isFirebaseAuth?: boolean;
}

const STORAGE_KEY = 'crystelle_admin_session';

export function getStoredAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminSession;
  } catch (e) {
    console.error('Failed to parse admin session', e);
    return null;
  }
}

export function saveStoredAdminSession(session: AdminSession | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!session) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  } catch (e) {
    console.error('Failed to save admin session', e);
  }
}

export function validateAdminCredentials(email: string, pass: string): boolean {
  return (
    email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
    pass === ADMIN_CREDENTIALS.password
  );
}

export function createAdminSession(email: string, uid?: string, isFirebaseAuth: boolean = false): AdminSession {
  const session: AdminSession = {
    email: email || ADMIN_CREDENTIALS.email,
    name: ADMIN_CREDENTIALS.name,
    role: ADMIN_CREDENTIALS.role,
    token: 'crystelle-sec-' + Math.random().toString(36).substring(2) + Date.now(),
    loggedInAt: new Date().toISOString(),
    isFirebaseAuth,
  };
  if (uid) {
    session.uid = uid;
  }
  return session;
}

/**
 * Signs in the admin with Firebase Authentication.
 * If user doesn't exist yet on new Firebase projects, attempts creation for admin credentials.
 * Has seamless fallback to studio credentials so admin is never locked out.
/**
 * Signs in the admin with Firebase Authentication.
 * If the user does not exist or credentials are new, provides informative error handling
 * or seamless setup for studio administration.
 */
export async function loginAdminWithFirebase(
  email: string,
  pass: string
): Promise<{ success: boolean; session?: AdminSession; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    return { success: false, error: 'Please enter your administrator email.' };
  }
  if (!pass) {
    return { success: false, error: 'Please enter your password.' };
  }

  // 1. Attempt standard Firebase Auth sign-in
  try {
    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    } catch (signInErr: any) {
      const code = signInErr?.code || '';

      // Auto-provision studio admin if user does not exist in Firebase Auth yet
      if (
        (code === 'auth/user-not-found' ||
          code === 'auth/invalid-credential' ||
          code === 'auth/invalid-login-credentials') &&
        cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase() &&
        pass === ADMIN_CREDENTIALS.password
      ) {
        try {
          userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        } catch (createErr) {
          console.warn('Could not auto-create Firebase admin user, falling back to local admin:', createErr);
        }
      } else {
        throw signInErr;
      }
    }

    if (userCredential?.user) {
      const session = createAdminSession(
        userCredential.user.email || cleanEmail,
        userCredential.user.uid,
        true
      );
      saveStoredAdminSession(session);
      return { success: true, session };
    }
  } catch (firebaseErr: any) {
    const code = firebaseErr?.code || '';
    console.warn('Firebase Admin Auth notice:', code, firebaseErr?.message);

    // If matching fallback studio admin credentials, allow entry
    if (validateAdminCredentials(cleanEmail, pass)) {
      const fallbackSession = createAdminSession(cleanEmail, 'studio-admin-uid', false);
      saveStoredAdminSession(fallbackSession);
      return { success: true, session: fallbackSession };
    }

    let errorMsg = 'Invalid email or password.';
    if (code === 'auth/operation-not-allowed') {
      errorMsg =
        'Email/Password sign-in is not enabled in Firebase. Please open Firebase Console > Authentication > Sign-in method and enable "Email/Password".';
    } else if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
      errorMsg =
        'Invalid credentials. Please verify your email and password, or use "Create Admin Account" if this user has not been added to Firebase yet.';
    } else if (code === 'auth/network-request-failed') {
      errorMsg = 'Network error connecting to Firebase. Please check your internet connection.';
    } else if (code === 'auth/too-many-requests') {
      errorMsg = 'Too many attempts. Access temporarily restricted by Firebase. Please try again shortly.';
    } else if (code === 'auth/invalid-email') {
      errorMsg = 'The email address format is not valid.';
    } else if (firebaseErr?.message) {
      errorMsg = firebaseErr.message;
    }

    return { success: false, error: errorMsg };
  }

  // Final check against studio credentials
  if (validateAdminCredentials(cleanEmail, pass)) {
    const session = createAdminSession(cleanEmail, undefined, false);
    saveStoredAdminSession(session);
    return { success: true, session };
  }

  return { success: false, error: 'Invalid administrator credentials.' };
}

/**
 * Register a new admin directly in Firebase Authentication
 */
export async function registerAdminWithFirebase(
  email: string,
  pass: string
): Promise<{ success: boolean; session?: AdminSession; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid administrator email.' };
  }
  if (!pass || pass.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    if (userCredential?.user) {
      const session = createAdminSession(
        userCredential.user.email || cleanEmail,
        userCredential.user.uid,
        true
      );
      saveStoredAdminSession(session);
      return { success: true, session };
    }
  } catch (err: any) {
    const code = err?.code || '';
    if (code === 'auth/email-already-in-use') {
      // User exists, attempt sign in
      try {
        const signin = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        if (signin?.user) {
          const session = createAdminSession(signin.user.email || cleanEmail, signin.user.uid, true);
          saveStoredAdminSession(session);
          return { success: true, session };
        }
      } catch {
        return {
          success: false,
          error: 'An account with this email already exists in Firebase with a different password. Please sign in instead.',
        };
      }
    } else if (code === 'auth/operation-not-allowed') {
      return {
        success: false,
        error:
          'Email/Password sign-in is disabled in Firebase Console. Please enable "Email/Password" under Authentication > Sign-in method.',
      };
    } else if (code === 'auth/weak-password') {
      return { success: false, error: 'Password should be at least 6 characters long.' };
    }
    return { success: false, error: err?.message || 'Could not create Firebase admin account.' };
  }

  return { success: false, error: 'Could not create admin account in Firebase.' };
}

/**
 * Log out admin from Firebase Auth and clear local session
 */
export async function logoutAdmin(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Firebase sign out error:', err);
  }
  saveStoredAdminSession(null);
}

/**
 * Subscribe to Firebase Auth state changes
 */
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
