
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
  courier?: string;
  shippingLabelUrl?: string;
  shipprimeOrderId?: number | string;
  paymentMethod?: string;
  paymentStatus?: string;
  subtotal?: number;
  shippingFee?: number;
  discountAmount?: number;
  appliedDiscountCode?: string | null;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
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
    phone: '',
    address: {
      street: '',
      city: '',
      state: 'Maharashtra',
      postalCode: '',
      country: 'India',
    },
    orders: [],
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  };
}
