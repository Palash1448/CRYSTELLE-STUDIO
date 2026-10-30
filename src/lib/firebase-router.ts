import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile as updateAuthProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { logEvent } from 'firebase/analytics';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, analytics } from './firebase';
import { ADMIN_CREDENTIALS, saveStoredAdminSession, createAdminSession } from './admin-auth';
import { UserProfile, createDefaultUser } from './auth';

/**
 * Log page-to-page navigation in Firebase Analytics
 */
export function trackFirebaseRoute(pathname: string, pageTitle?: string): void {
  if (typeof window === 'undefined' || !analytics) return;

  try {
    const title = pageTitle || document.title || 'Crystelle Studio';
    logEvent(analytics, 'screen_view', {
      firebase_screen: pathname,
      firebase_screen_class: pathname,
    });
    logEvent(analytics, 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: title,
    });
  } catch (err) {
    // Analytics logging is best-effort
    console.debug('Firebase Analytics page tracking notice:', err);
  }
}

export interface FirebaseLoginResult {
  success: boolean;
  redirectRoute: '/admin' | '/profile';
  error?: string;
  user?: UserProfile;
}

/**
 * Handle user sign-in or account registration with Firebase Auth and sync with Firestore,
 * returning the appropriate destination route.
 */
export async function authenticateWithFirebase(
  email: string,
  pass: string,
  isRegister: boolean,
  fullName?: string
): Promise<FirebaseLoginResult> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Admin login check
  if (cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase()) {
    try {
      let fbUser: User | null = null;
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        fbUser = cred.user;
      } catch (authErr: any) {
        if (
          authErr.code === 'auth/user-not-found' ||
          authErr.code === 'auth/invalid-credential'
        ) {
          const newCred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
          fbUser = newCred.user;
        } else {
          throw authErr;
        }
      }

      const session = createAdminSession(cleanEmail, fbUser?.uid, true);
      saveStoredAdminSession(session);
      return {
        success: true,
        redirectRoute: '/admin',
      };
    } catch (err: any) {
      if (pass === ADMIN_CREDENTIALS.password) {
        // Fallback for offline/demo admin credentials
        const session = createAdminSession(cleanEmail, undefined, false);
        saveStoredAdminSession(session);
        return {
          success: true,
          redirectRoute: '/admin',
        };
      }
      return {
        success: false,
        redirectRoute: '/admin',
        error: err?.message || 'Invalid admin credentials.',
      };
    }
  }

  // 2. Regular Customer Login or Registration
  try {
    let firebaseUser: User;

    if (isRegister) {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      firebaseUser = cred.user;
      if (fullName?.trim()) {
        await updateAuthProfile(firebaseUser, { displayName: fullName.trim() });
      }

      // Save initial profile in Firestore
      try {
        const userRef = doc(db, 'users', cleanEmail);
        await setDoc(
          userRef,
          {
            email: cleanEmail,
            fullName: fullName?.trim() || cleanEmail.split('@')[0],
            createdAt: serverTimestamp(),
            registeredVia: 'firebase_auth',
          },
          { merge: true }
        );
      } catch (firestoreErr) {
        console.warn('Firestore user profile creation notice:', firestoreErr);
      }
    } else {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      firebaseUser = cred.user;
    }

    // Load full profile and all orders from Firestore
    let appUser: UserProfile | null = null;
    try {
      const { fetchUserProfileFromFirestore, saveUserProfileToFirestore } = await import('./firestore-service');
      appUser = await fetchUserProfileFromFirestore(cleanEmail);

      if (!appUser) {
        const defaultUser = createDefaultUser(cleanEmail, fullName || firebaseUser.displayName || undefined);
        appUser = defaultUser;
        await saveUserProfileToFirestore(cleanEmail, defaultUser).catch(() => {});
      } else if (fullName && (!appUser.fullName || appUser.fullName === cleanEmail.split('@')[0])) {
        appUser.fullName = fullName;
        await saveUserProfileToFirestore(cleanEmail, { fullName }).catch(() => {});
      }
    } catch (e) {
      console.warn('Firestore fetch user notice in auth:', e);
      appUser = createDefaultUser(cleanEmail, fullName || firebaseUser.displayName || undefined);
    }

    return {
      success: true,
      redirectRoute: '/profile',
      user: appUser,
    };
  } catch (err: any) {
    let friendlyMessage = 'Authentication failed. Please check your details.';
    if (err.code === 'auth/email-already-in-use') {
      friendlyMessage = 'This email is already registered. Please sign in instead.';
    } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      friendlyMessage = 'Invalid password. Please try again.';
    } else if (err.code === 'auth/user-not-found') {
      friendlyMessage = 'No account found with this email. Please create an account.';
    } else if (err.code === 'auth/weak-password') {
      friendlyMessage = 'Password must be at least 6 characters.';
    } else if (err.code === 'auth/invalid-email') {
      friendlyMessage = 'Please enter a valid email address.';
    }

    return {
      success: false,
      redirectRoute: '/profile',
      error: friendlyMessage,
    };
  }
}

/**
 * Sign out of Firebase Auth
 */
export async function logoutFirebaseAuth(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Firebase signOut notice:', err);
  }
}
