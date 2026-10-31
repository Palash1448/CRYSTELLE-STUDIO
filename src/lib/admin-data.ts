import { products } from './store-data';

export interface StudioOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerCity: string;
  items: {
    name: string;
    fragrance: string;
    quantity: number;
    price: number;
    size: string;
  }[];
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
  paymentStatus: 'Paid' | 'Pending';
  status: 'Processing' | 'Poured' | 'Dispatched' | 'Delivered';
  createdAt: string;
  orderDate: string; // YYYY-MM-DD
  trackingNumber?: string | undefined;
  courier?: string | undefined;
  shippingLabelUrl?: string | undefined;
  shipprimeOrderId?: number | string | undefined;
  notes?: string | undefined;
}

export interface WorkshopBatch {
  id: string;
  batchCode: string;
  candleName: string;
  fragrance: string;
  quantity: number;
  waxType: '100% Pure Soy Wax' | 'Botanical Beeswax Blend';
  status: 'Pre-Wicking' | 'Pouring' | 'Curing' | 'Ready';
  progress: number; // 0 to 100
  pouredAt: string;
  cureReadyAt: string;
}

export interface StudioCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  tier: 'VIP Gold' | 'VIP Silver' | 'Artisan Collector';
  lastOrderDate: string;
}

export interface StudioPromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minOrderAmount: number;
  usageCount: number;
  usageLimit: number;
  expiresAt: string;
  isActive: boolean;
  description: string;
}

export interface StudioNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'order' | 'inventory' | 'batch' | 'system';
  unread: boolean;
}

export const initialOrders: StudioOrder[] = [];

export const initialBatches: WorkshopBatch[] = [
  {
    id: 'batch-01',
    batchCode: 'BATCH #2026-B42',
    candleName: 'Lavender Bliss',
    fragrance: 'Pure French Lavender',
    quantity: 50,
    waxType: '100% Pure Soy Wax',
    status: 'Curing',
    progress: 85,
    pouredAt: 'Today, 09:30 AM',
    cureReadyAt: 'Tomorrow, 10:00 AM',
  },
  {
    id: 'batch-02',
    batchCode: 'BATCH #2026-B43',
    candleName: 'Sandalwood Serenity',
    fragrance: 'Mysore Sandalwood & Amber',
    quantity: 40,
    waxType: '100% Pure Soy Wax',
    status: 'Pouring',
    progress: 45,
    pouredAt: 'Today, 01:15 PM',
    cureReadyAt: 'In 2 days',
  },
  {
    id: 'batch-03',
    batchCode: 'BATCH #2026-B44',
    candleName: 'Rose Petal Botanical',
    fragrance: 'English Rose & Geranium',
    quantity: 35,
    waxType: 'Botanical Beeswax Blend',
    status: 'Pre-Wicking',
    progress: 15,
    pouredAt: 'Scheduled for 04:00 PM',
    cureReadyAt: 'In 3 days',
  },
];

export const initialCustomers: StudioCustomer[] = [
  {
    id: 'cust-1',
    name: 'Ananya Sharma',
    email: 'ananya.s@gmail.com',
    phone: '+91 98201 44520',
    city: 'Mumbai',
    ordersCount: 8,
    totalSpent: 9450,
    tier: 'VIP Gold',
    lastOrderDate: 'Today',
  },
  {
    id: 'cust-2',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@outlook.com',
    phone: '+91 98112 33491',
    city: 'Bengaluru',
    ordersCount: 5,
    totalSpent: 6200,
    tier: 'VIP Silver',
    lastOrderDate: 'Today',
  },
  {
    id: 'cust-3',
    name: 'Tanya Kapoor',
    email: 'tanya.k@yahoo.com',
    phone: '+91 98991 77241',
    city: 'New Delhi',
    ordersCount: 6,
    totalSpent: 7800,
    tier: 'VIP Gold',
    lastOrderDate: '2 days ago',
  },
  {
    id: 'cust-4',
    name: 'Priya Nair',
    email: 'priya.nair@icloud.com',
    phone: '+91 97660 55198',
    city: 'Pune',
    ordersCount: 4,
    totalSpent: 4890,
    tier: 'VIP Silver',
    lastOrderDate: 'Today',
  },
  {
    id: 'cust-5',
    name: 'Vikram Singhania',
    email: 'v.singhania@corp.in',
    phone: '+91 99882 11090',
    city: 'Hyderabad',
    ordersCount: 3,
    totalSpent: 3890,
    tier: 'Artisan Collector',
    lastOrderDate: 'Yesterday',
  },
];

export const initialNotifications: StudioNotification[] = [
  {
    id: 'notif-1',
    title: 'New Online Order Received',
    description: 'Ananya Sharma ordered 2x Lavender Bliss (₹998) via UPI.',
    time: '14m ago',
    type: 'order',
    unread: true,
  },
  {
    id: 'notif-2',
    title: 'Workshop Batch Ready for Curing',
    description: 'Batch #2026-B42 (50 Lavender candles) moved to temperature-controlled rack.',
    time: '1h ago',
    type: 'batch',
    unread: true,
  },
  {
    id: 'notif-3',
    title: 'Low Workshop Inventory Alert',
    description: 'Rose Petal candles have only 6 units left in ready-to-ship inventory.',
    time: '3h ago',
    type: 'inventory',
    unread: false,
  },
  {
    id: 'notif-4',
    title: 'Customer Left 5★ Review',
    description: '"The calming lavender aroma transformed our entire living space."',
    time: '5h ago',
    type: 'system',
    unread: false,
  },
];

export const revenueChartData7D = [
  { name: 'Mon', revenue: 18400, orders: 18, candles: 36 },
  { name: 'Tue', revenue: 22100, orders: 22, candles: 44 },
  { name: 'Wed', revenue: 19800, orders: 19, candles: 39 },
  { name: 'Thu', revenue: 26500, orders: 27, candles: 55 },
  { name: 'Fri', revenue: 31200, orders: 32, candles: 68 },
  { name: 'Sat', revenue: 38400, orders: 41, candles: 84 },
  { name: 'Sun', revenue: 27920, orders: 29, candles: 58 },
];

export const revenueChartData30D = [
  { name: 'Week 1', revenue: 84500, orders: 88, candles: 182 },
  { name: 'Week 2', revenue: 102400, orders: 106, candles: 219 },
  { name: 'Week 3', revenue: 124800, orders: 131, candles: 270 },
  { name: 'Week 4', revenue: 142850, orders: 148, candles: 304 },
];

export const fragranceDistribution = [
  { name: 'Lavender Bliss', sales: 38, revenue: 64200, color: '#A78BFA' },
  { name: 'Sandalwood Serenity', sales: 26, revenue: 47900, color: '#F59E0B' },
  { name: 'Vanilla Dream', sales: 21, revenue: 38400, color: '#FCD34D' },
  { name: 'Citrus Fresh', sales: 15, revenue: 27800, color: '#FB923C' },
];

export const initialPromoCodes: StudioPromoCode[] = [
  {
    id: 'promo-1',
    code: 'GLOW10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 499,
    usageCount: 142,
    usageLimit: 500,
    expiresAt: 'Dec 31, 2026',
    isActive: true,
    description: '10% off across all hand-poured candle collections',
  },
  {
    id: 'promo-2',
    code: 'FESTIVE250',
    discountType: 'fixed',
    discountValue: 250,
    minOrderAmount: 1299,
    usageCount: 88,
    usageLimit: 200,
    expiresAt: 'Nov 15, 2026',
    isActive: true,
    description: 'Flat ₹250 instant reduction on gift sets and jar hampers',
  },
  {
    id: 'promo-3',
    code: 'FREESHIP',
    discountType: 'free_shipping',
    discountValue: 0,
    minOrderAmount: 799,
    usageCount: 260,
    usageLimit: 1000,
    expiresAt: 'No expiry',
    isActive: true,
    description: 'Complimentary safe insured delivery anywhere in India',
  },
  {
    id: 'promo-4',
    code: 'VIPAROMA20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 1499,
    usageCount: 45,
    usageLimit: 100,
    expiresAt: 'Dec 10, 2026',
    isActive: true,
    description: 'Exclusive 20% discount for registered VIP collectors club',
  },
  {
    id: 'promo-5',
    code: 'WELCOME50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 399,
    usageCount: 310,
    usageLimit: 1000,
    expiresAt: 'Dec 31, 2026',
    isActive: false,
    description: 'New patron starter saving voucher',
  },
];

export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  workshopLocation: string;
  isAnnouncementActive: boolean;
  announcementBar: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  codFee: number;
  prepaidShippingIncluded?: boolean;
  taxRatePercent: number;
  gstRatePercent?: number;
  shipprimeToken?: string;
  shipprimePickupName?: string;
  shipprimePickupPhone?: string;
  shipprimePickupAddress1?: string;
  shipprimePickupAddress2?: string;
  shipprimePickupCity?: string;
  shipprimePickupState?: string;
  shipprimePickupPincode?: string;
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  cloudinaryApiSecret?: string;
  cloudinaryUploadPreset?: string;
}

export const initialStoreSettings: StoreSettings = {
  storeName: 'Crystelle Studio',
  tagline: 'Hand-poured artisan botanical candles & luxury aromatics',
  contactEmail: 'concierge@crystellestudio.com',
  contactPhone: '+91 (020) 2567-8910',
  workshopLocation: 'Studio 4B, Koregaon Park Heritage Lane, Pune, Maharashtra 411001',
  isAnnouncementActive: true,
  announcementBar: 'Festive Season Special: Enjoy complimentary artisanal wick trimmer on orders above ₹1,499.',
  freeShippingThreshold: 999,
  standardShippingFee: 0, // Prepaid shipping is included in price
  codFee: 69, // Cash on Delivery handling fee
  prepaidShippingIncluded: true,
  taxRatePercent: 18,
  gstRatePercent: 18,
  shipprimeToken: 'sp_f89f9d4c23f8a06733aaca480447b552b0ac26a483fb3472d6c2a867d11924b0',
  shipprimePickupName: 'Crystelle Studio Warehouse',
  shipprimePickupPhone: '9876543210',
  shipprimePickupAddress1: 'Plot 45, Phase II',
  shipprimePickupAddress2: 'Udyog Vihar',
  shipprimePickupCity: 'Gurgaon',
  shipprimePickupState: 'Haryana',
  shipprimePickupPincode: '122002',
  cloudinaryCloudName: 'e6rnpzii',
  cloudinaryApiKey: '624812375866731',
  cloudinaryApiSecret: 'irXoLblOWNynTZ4Ti2bhD2aprtA',
  cloudinaryUploadPreset: '',
};

export function getStoredStoreSettings(): StoreSettings {
  if (typeof window === 'undefined') return initialStoreSettings;
  try {
    const stored = localStorage.getItem('crystelle_studio_settings');
    if (stored) {
      return { ...initialStoreSettings, ...JSON.parse(stored) };
    }
  } catch {}
  return initialStoreSettings;
}

export function saveStoredStoreSettings(settings: StoreSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('crystelle_studio_settings', JSON.stringify(settings));
    window.dispatchEvent(new Event('crystelle_settings_updated'));
  } catch {}
}

export interface BannerSettings {
  eyebrow: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  secondaryText: string;
  secondaryLink: string;
  imageUrl: string;
  isActive: boolean;
}

export const initialBannerSettings: BannerSettings = {
  eyebrow: 'A little light. A little luxury.',
  title: 'Handcrafted Candles &\nLuxury Fragrances',
  subtitle:
    'Artisanally poured botanical soy candles designed to create a warmer, brighter, and calmer sanctuary in your home.',
  buttonText: 'Shop Now',
  buttonLink: '/shop',
  secondaryText: 'Explore Collections',
  secondaryLink: '/collections',
  imageUrl: '/hero-candle.jpg',
  isActive: true,
};

export function getStoredBannerSettings(): BannerSettings {
  if (typeof window === 'undefined') return initialBannerSettings;
  try {
    const raw = localStorage.getItem('crystelle_banner_settings');
    if (raw) {
      return { ...initialBannerSettings, ...JSON.parse(raw) };
    }
  } catch {}
  return initialBannerSettings;
}

export function saveStoredBannerSettings(banner: BannerSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('crystelle_banner_settings', JSON.stringify(banner));
    window.dispatchEvent(new Event('crystelle_banner_updated'));
  } catch {}
}
