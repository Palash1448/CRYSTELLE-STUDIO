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

export const initialOrders: StudioOrder[] = [
  {
    id: 'ord-101',
    orderNumber: '#CS-98425',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.s@gmail.com',
    customerCity: 'Mumbai, MH',
    items: [
      { name: 'Lavender Bliss', fragrance: 'Lavender', quantity: 2, price: 499, size: '200g' },
    ],
    totalAmount: 998,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Processing',
    createdAt: '14 minutes ago',
    orderDate: '2026-10-19',
    trackingNumber: 'IND-CRYST-98425',
  },
  {
    id: 'ord-102',
    orderNumber: '#CS-98424',
    customerName: 'Rohan Mehta',
    customerEmail: 'rohan.mehta@outlook.com',
    customerCity: 'Bengaluru, KA',
    items: [
      { name: 'Sandalwood Serenity', fragrance: 'Sandalwood', quantity: 1, price: 699, size: '200g' },
      { name: 'Candle Care Kit', fragrance: 'Others', quantity: 1, price: 699, size: '1 Set' },
    ],
    totalAmount: 1398,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    status: 'Poured',
    createdAt: '42 minutes ago',
    orderDate: '2026-10-19',
    trackingNumber: 'IND-CRYST-98424',
  },
  {
    id: 'ord-103',
    orderNumber: '#CS-98423',
    customerName: 'Priya Nair',
    customerEmail: 'priya.nair@icloud.com',
    customerCity: 'Pune, MH',
    items: [
      { name: 'The Crystelle Gift Set', fragrance: 'Vanilla', quantity: 1, price: 899, size: 'Gift Set' },
    ],
    totalAmount: 899,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Dispatched',
    createdAt: '2 hours ago',
    orderDate: '2026-10-19',
    trackingNumber: 'BLUEDART-884219',
  },
  {
    id: 'ord-104',
    orderNumber: '#CS-98422',
    customerName: 'Vikram Singhania',
    customerEmail: 'v.singhania@corp.in',
    customerCity: 'Hyderabad, TS',
    items: [
      { name: 'Vanilla Dream', fragrance: 'Vanilla', quantity: 3, price: 499, size: '200g' },
    ],
    totalAmount: 1497,
    paymentMethod: 'NetBanking',
    paymentStatus: 'Paid',
    status: 'Delivered',
    createdAt: 'Yesterday',
    orderDate: '2026-10-18',
    trackingNumber: 'DELHIVERY-774102',
  },
  {
    id: 'ord-105',
    orderNumber: '#CS-98421',
    customerName: 'Tanya Kapoor',
    customerEmail: 'tanya.k@yahoo.com',
    customerCity: 'New Delhi, DL',
    items: [
      { name: 'Rose Petal', fragrance: 'Rose', quantity: 1, price: 549, size: '200g' },
    ],
    totalAmount: 549,
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    status: 'Delivered',
    createdAt: '2 days ago',
    orderDate: '2026-10-17',
    trackingNumber: 'DELHIVERY-662310',
  },
  {
    id: 'ord-106',
    orderNumber: '#CS-98420',
    customerName: 'Aryan Deshmukh',
    customerEmail: 'aryan.d@gmail.com',
    customerCity: 'Nagpur, MH',
    items: [
      { name: 'Citrus Fresh', fragrance: 'Citrus', quantity: 2, price: 499, size: '200g' },
    ],
    totalAmount: 998,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Delivered',
    createdAt: '3 days ago',
    orderDate: '2026-10-16',
    trackingNumber: 'IND-CRYST-98420',
  },
  {
    id: 'ord-107',
    orderNumber: '#CS-98419',
    customerName: 'Meera Chawla',
    customerEmail: 'meera.c@gmail.com',
    customerCity: 'Jaipur, RJ',
    items: [
      { name: 'Rose Petal', fragrance: 'Rose', quantity: 2, price: 549, size: '200g' },
      { name: 'Lavender Bliss', fragrance: 'Lavender', quantity: 1, price: 499, size: '200g' },
    ],
    totalAmount: 1597,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    status: 'Delivered',
    createdAt: '4 days ago',
    orderDate: '2026-10-15',
    trackingNumber: 'BLUEDART-554109',
  },
  {
    id: 'ord-108',
    orderNumber: '#CS-98418',
    customerName: 'Kabir Varma',
    customerEmail: 'kabir.v@tech.io',
    customerCity: 'Ahmedabad, GJ',
    items: [
      { name: 'Sandalwood Serenity', fragrance: 'Sandalwood', quantity: 1, price: 699, size: '200g' },
    ],
    totalAmount: 699,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Delivered',
    createdAt: '5 days ago',
    orderDate: '2026-10-14',
    trackingNumber: 'DELHIVERY-339011',
  },
  {
    id: 'ord-109',
    orderNumber: '#CS-98417',
    customerName: 'Shreya Patel',
    customerEmail: 'shreya.p@gmail.com',
    customerCity: 'Surat, GJ',
    items: [
      { name: 'Amber & Cashmere Glow', fragrance: 'Amber', quantity: 2, price: 499, size: '200g' },
    ],
    totalAmount: 998,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Delivered',
    createdAt: '6 days ago',
    orderDate: '2026-10-13',
    trackingNumber: 'BLUEDART-441092',
  },
  {
    id: 'ord-110',
    orderNumber: '#CS-98416',
    customerName: 'Aditya Kulkarni',
    customerEmail: 'aditya.k@gmail.com',
    customerCity: 'Thane, MH',
    items: [
      { name: 'Vanilla Dream', fragrance: 'Vanilla', quantity: 1, price: 499, size: '200g' },
      { name: 'Rose Petal', fragrance: 'Rose', quantity: 1, price: 549, size: '200g' },
    ],
    totalAmount: 1048,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    status: 'Delivered',
    createdAt: '7 days ago',
    orderDate: '2026-10-12',
    trackingNumber: 'DELHIVERY-219481',
  },
  {
    id: 'ord-111',
    orderNumber: '#CS-98415',
    customerName: 'Kavita Menon',
    customerEmail: 'kavita.m@gmail.com',
    customerCity: 'Kochi, KL',
    items: [
      { name: 'Sandalwood Serenity', fragrance: 'Sandalwood', quantity: 2, price: 699, size: '200g' },
    ],
    totalAmount: 1398,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Delivered',
    createdAt: '8 days ago',
    orderDate: '2026-10-11',
    trackingNumber: 'IND-CRYST-98415',
  },
  {
    id: 'ord-112',
    orderNumber: '#CS-98414',
    customerName: 'Naveen Reddy',
    customerEmail: 'naveen.r@gmail.com',
    customerCity: 'Visakhapatnam, AP',
    items: [
      { name: 'Citrus Fresh', fragrance: 'Citrus', quantity: 1, price: 499, size: '200g' },
    ],
    totalAmount: 499,
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    status: 'Delivered',
    createdAt: '9 days ago',
    orderDate: '2026-10-10',
    trackingNumber: 'DELHIVERY-198421',
  },
  {
    id: 'ord-113',
    orderNumber: '#CS-98413',
    customerName: 'Deepak Joshi',
    customerEmail: 'deepak.j@gmail.com',
    customerCity: 'Dehradun, UK',
    items: [
      { name: 'The Crystelle Gift Set', fragrance: 'Vanilla', quantity: 2, price: 899, size: 'Gift Set' },
    ],
    totalAmount: 1798,
    paymentMethod: 'NetBanking',
    paymentStatus: 'Paid',
    status: 'Delivered',
    createdAt: '10 days ago',
    orderDate: '2026-10-09',
    trackingNumber: 'BLUEDART-339182',
  },
  {
    id: 'ord-114',
    orderNumber: '#CS-98412',
    customerName: 'Simran Walia',
    customerEmail: 'simran.w@gmail.com',
    customerCity: 'Chandigarh, CH',
    items: [
      { name: 'Lavender Bliss', fragrance: 'Lavender', quantity: 3, price: 499, size: '200g' },
    ],
    totalAmount: 1497,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Delivered',
    createdAt: '11 days ago',
    orderDate: '2026-10-08',
    trackingNumber: 'IND-CRYST-98412',
  },
  {
    id: 'ord-115',
    orderNumber: '#CS-98411',
    customerName: 'Gaurav Banerjee',
    customerEmail: 'gaurav.b@gmail.com',
    customerCity: 'Kolkata, WB',
    items: [
      { name: 'Rose Petal', fragrance: 'Rose', quantity: 1, price: 549, size: '200g' },
    ],
    totalAmount: 549,
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    status: 'Delivered',
    createdAt: '12 days ago',
    orderDate: '2026-10-07',
    trackingNumber: 'DELHIVERY-998231',
  },
];

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
  taxRatePercent: number;
  gstRatePercent?: number;
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
  standardShippingFee: 99,
  taxRatePercent: 18,
  gstRatePercent: 18,
};
