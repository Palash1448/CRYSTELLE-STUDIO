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

export function createAdminSession(email: string): AdminSession {
  return {
    email: ADMIN_CREDENTIALS.email,
    name: ADMIN_CREDENTIALS.name,
    role: ADMIN_CREDENTIALS.role,
    token: 'crystelle-sec-' + Math.random().toString(36).substring(2) + Date.now(),
    loggedInAt: new Date().toISOString(),
  };
}
