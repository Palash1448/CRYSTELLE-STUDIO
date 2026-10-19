import lavender from '@/assets/lavender.jpg';
import vanilla from '@/assets/vanilla.jpg';

export type OrderItem = {
  id: string;
  name: string;
  size: number;
  quantity: number;
  price: number;
  image: string;
};

export type Order = {
  id: string;
  date: string;
  status: 'Delivered' | 'In Transit' | 'Processing';
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
};

export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orders: Order[];
  joinedDate: string;
};

const STORAGE_KEY = 'crystelle_user_session';

export function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch (e) {
    console.error('Failed to parse user session', e);
    return null;
  }
}

export function saveStoredUser(user: UserProfile | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Failed to save user session', e);
  }
}

export function createDefaultUser(email: string, fullName?: string): UserProfile {
  const emailPrefix = email.split('@')[0] || 'User';
  const name =
    fullName?.trim() ||
    emailPrefix
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    id: 'CS-' + Math.floor(10000 + Math.random() * 90000),
    email,
    fullName: name,
    phone: '+91 98201 44520',
    address: {
      street: 'Flat 402, Lotus Heights, Orchid Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India',
    },
    orders: [
      {
        id: 'ORD-98421',
        date: 'Oct 10, 2026',
        status: 'Delivered',
        total: 1048,
        trackingNumber: 'IND-CRYST-88419',
        items: [
          {
            id: 'lavender-bliss',
            name: 'Lavender Bliss Handcrafted Candle',
            size: 200,
            quantity: 1,
            price: 499,
            image: lavender,
          },
          {
            id: 'vanilla-dream',
            name: 'Vanilla Dream Scented Candle',
            size: 200,
            quantity: 1,
            price: 499,
            image: vanilla,
          },
        ],
      },
      {
        id: 'ORD-97103',
        date: 'Sep 24, 2026',
        status: 'Delivered',
        total: 699,
        trackingNumber: 'IND-CRYST-74120',
        items: [
          {
            id: 'candle-care-kit',
            name: 'Candle Care Kit (Trimmer & Snuffer)',
            size: 1,
            quantity: 1,
            price: 699,
            image: vanilla,
          },
        ],
      },
    ],
    joinedDate: 'Oct 2026',
  };
}
