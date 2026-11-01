import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { StudioOrder, StudioCustomer, StudioPromoCode } from './admin-data';
import { type Order, type UserProfile } from './auth';

// ==========================================
// 1. USER FORMS (Contact, Profile, Checkout)
// ==========================================

export interface ContactInquiry {
  fullName: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
  createdAt?: string;
}

/**
 * Saves a user contact message to Firestore collection 'contact_inquiries'
 */
export async function submitContactInquiry(inquiry: ContactInquiry): Promise<string> {
  try {
    const colRef = collection(db, 'contact_inquiries');
    const docRef = await addDoc(colRef, {
      ...inquiry,
      timestamp: serverTimestamp(),
      receivedAt: new Date().toISOString(),
      status: 'Unread',
    });
    return docRef.id;
  } catch (error) {
    console.warn('Firestore: Falling back from remote save for contact inquiry:', error);
    return 'local-inquiry-' + Date.now();
  }
}

/**
 * Saves/updates user profile address and details in Firestore collection 'users'
 */
export async function saveUserProfileToFirestore(
  email: string,
  profileData: Partial<UserProfile>
): Promise<void> {
  if (!email) return;
  const cleanEmail = email.toLowerCase().trim();
  try {
    const userDocRef = doc(db, 'users', cleanEmail);
    await setDoc(
      userDocRef,
      {
        ...profileData,
        email: cleanEmail,
        lastUpdated: serverTimestamp(),
        updatedAtISO: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Firestore: Could not save profile remotely:', error);
  }
}

/**
 * Loads a user's saved profile and all their orders from Cloud Firestore
 */
export async function fetchUserProfileFromFirestore(email: string): Promise<UserProfile | null> {
  if (!email) return null;
  const cleanEmail = email.toLowerCase().trim();

  try {
    const userDocRef = doc(db, 'users', cleanEmail);
    const userSnap = await getDoc(userDocRef);

    // Fetch all orders for this customer from the 'orders' collection
    let remoteOrders: Order[] = [];
    try {
      const ordersCol = collection(db, 'orders');
      const q = query(ordersCol, where('customerEmail', '==', cleanEmail));
      const ordersSnap = await getDocs(q);
      remoteOrders = ordersSnap.docs.map((docSnap) => {
        const d = docSnap.data() as any;
        return {
          id: d.orderNumber || d.id || docSnap.id,
          date: d.date || (d.placedAtISO ? d.placedAtISO.split('T')[0] : 'Recent'),
          status: d.status || 'Processing',
          total: Number(d.total || d.totalAmount || 0),
          subtotal: Number(d.subtotal || 0),
          shippingFee: Number(d.shippingFee || 0),
          discountAmount: Number(d.discountAmount || 0),
          appliedDiscountCode: d.appliedDiscountCode || null,
          paymentMethod: d.paymentMethod || 'Prepaid',
          paymentStatus: d.paymentStatus || 'Confirmed',
          trackingNumber: d.trackingNumber || '',
          courier: d.courier || undefined,
          shippingLabelUrl: d.shippingLabelUrl || undefined,
          shipprimeOrderId: d.shipprimeOrderId || undefined,
          shippingAddress: d.shippingAddress || undefined,
          items: (d.items || []).map((it: any) => ({
            id: it.id || 'candle',
            name: it.name || 'Handcrafted Candle',
            size: Number(it.size || 200),
            quantity: Number(it.quantity || 1),
            price: Number(it.price || 0),
            image: it.image || '/hero-candle.jpg',
          })),
        };
      });
    } catch (orderErr) {
      console.warn('Firestore: Could not query orders by customerEmail:', orderErr);
    }

    if (userSnap.exists()) {
      const data = userSnap.data() as any;
      const docOrders: Order[] = data.orders || [];
      const orderMap = new Map<string, Order>();
      docOrders.forEach((o) => {
        if (o && o.id) orderMap.set(o.id, o);
      });
      remoteOrders.forEach((o) => {
        if (o && o.id) orderMap.set(o.id, o);
      });
      const mergedOrders = Array.from(orderMap.values());

      return {
        id: data.id || `CS-${Math.floor(10000 + Math.random() * 90000)}`,
        email: cleanEmail,
        fullName: data.fullName || (cleanEmail.split('@')[0] || 'Customer'),
        phone: data.phone || '',
        address: data.address || {
          street: '',
          city: '',
          state: 'Maharashtra',
          postalCode: '',
          country: 'India',
        },
        orders: mergedOrders,
        joinedDate: data.joinedDate || '2026',
      };
    } else if (remoteOrders.length > 0) {
      const latestOrder = remoteOrders[0];
      return {
        id: `CS-${Math.floor(10000 + Math.random() * 90000)}`,
        email: cleanEmail,
        fullName: (cleanEmail.split('@')[0]) || 'Customer',
        phone: '',
        address: latestOrder?.shippingAddress || {
          street: '',
          city: '',
          state: 'Maharashtra',
          postalCode: '',
          country: 'India',
        },
        orders: remoteOrders,
        joinedDate: '2026',
      };
    }

    return null;
  } catch (error) {
    console.warn('Firestore fetchUserProfileFromFirestore failed:', error);
    return null;
  }
}

/**
 * Saves a customer checkout order in Firestore collection 'orders'
 * AND updates the user's order history in Firestore collection 'users'
 */
export async function saveCustomerOrderToFirestore(orderData: any): Promise<void> {
  try {
    const orderId = orderData.orderNumber || orderData.id || `CS-ORD-${Date.now()}`;
    const cleanEmail = (orderData.customerEmail || orderData.email || '').toLowerCase().trim();

    // 1. Save to main 'orders' collection
    const orderDocRef = doc(db, 'orders', orderId);
    const orderPayload = {
      ...orderData,
      id: orderId,
      orderNumber: orderId,
      customerEmail: cleanEmail,
      total: Number(orderData.total ?? orderData.totalAmount ?? 0),
      totalAmount: Number(orderData.totalAmount ?? orderData.total ?? 0),
      createdAt: serverTimestamp(),
      createdAtServer: serverTimestamp(),
      placedAtISO: new Date().toISOString(),
      createdAtISO: new Date().toISOString(),
    };
    await setDoc(orderDocRef, orderPayload, { merge: true });

    // 2. Also persist under 'users/{cleanEmail}' so it syncs immediately to customer's profile
    if (cleanEmail) {
      try {
        const userDocRef = doc(db, 'users', cleanEmail);
        const userSnap = await getDoc(userDocRef);

        const newOrderItem: Order = {
          id: orderId,
          date: orderData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: orderData.status || 'Processing',
          total: Number(orderData.total || orderData.totalAmount || 0),
          subtotal: Number(orderData.subtotal || 0),
          shippingFee: Number(orderData.shippingFee || 0),
          discountAmount: Number(orderData.discountAmount || 0),
          appliedDiscountCode: orderData.appliedDiscountCode || null,
          paymentMethod: orderData.paymentMethod || 'Prepaid',
          paymentStatus: orderData.paymentStatus || 'Confirmed',
          trackingNumber: orderData.trackingNumber || '',
          courier: orderData.courier || undefined,
          shippingLabelUrl: orderData.shippingLabelUrl || undefined,
          shipprimeOrderId: orderData.shipprimeOrderId || undefined,
          shippingAddress: orderData.shippingAddress || undefined,
          items: orderData.items || [],
        };

        if (userSnap.exists()) {
          const currentData = userSnap.data() as any;
          const currentOrders: Order[] = currentData.orders || [];
          const updatedOrders = [newOrderItem, ...currentOrders.filter((o) => o.id !== orderId)];
          const existingAddress = currentData.address;
          const shouldUpdateAddress = (!existingAddress || !existingAddress.street) && orderData.shippingAddress;

          await setDoc(
            userDocRef,
            {
              orders: updatedOrders,
              lastOrderAt: serverTimestamp(),
              ...(shouldUpdateAddress ? { address: orderData.shippingAddress } : {}),
              ...(orderData.customerPhone ? { phone: orderData.customerPhone } : {}),
            },
            { merge: true }
          );
        } else {
          await setDoc(
            userDocRef,
            {
              email: cleanEmail,
              fullName: orderData.customerName || cleanEmail.split('@')[0],
              phone: orderData.customerPhone || '',
              address: orderData.shippingAddress || {
                street: '',
                city: '',
                state: 'Maharashtra',
                postalCode: '',
                country: 'India',
              },
              orders: [newOrderItem],
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
      } catch (userErr) {
        console.warn('Firestore: Could not append order to user profile:', userErr);
      }
    }
  } catch (error) {
    console.warn('Firestore: Could not save checkout order remotely:', error);
  }
}

// ==========================================
// 2. ADMIN CRUD FIRESTORE OPERATIONS
// ==========================================

/**
 * Load all orders from Firestore with guaranteed fallback
 */
export async function fetchFirestoreOrders(): Promise<StudioOrder[]> {
  try {
    const colRef = collection(db, 'orders');
    let rawDocs: any[] = [];

    try {
      const q = query(colRef, orderBy('createdAt', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        rawDocs = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      }
    } catch (indexErr) {
      console.warn('Firestore orderBy index warning, using resilient fallback:', indexErr);
    }

    if (rawDocs.length === 0) {
      const fallbackSnapshot = await getDocs(colRef);
      if (!fallbackSnapshot.empty) {
        rawDocs = fallbackSnapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      }
    }

    const normalizedOrders: StudioOrder[] = rawDocs.map((d: any) => {
      const totalAmount = Number(d.totalAmount ?? d.total ?? d.totalPaid ?? 0);
      const rawCity = d.customerCity || (d.shippingAddress?.city ? `${d.shippingAddress.city}, ${d.shippingAddress.state || ''}`.trim() : 'India');
      const rawItems = Array.isArray(d.items) ? d.items : [];
      const items = rawItems.map((it: any) => ({
        name: it.name || 'Handcrafted Candle',
        fragrance: it.fragrance || it.scent || 'Botanical',
        quantity: Number(it.quantity) || 1,
        price: Number(it.price) || 0,
        size: typeof it.size === 'number' ? `${it.size}g` : String(it.size || '200g'),
      }));

      const dateStr = d.placedAtISO ? d.placedAtISO.split('T')[0] : (typeof d.date === 'string' && d.date.includes('-') ? d.date : new Date().toISOString().split('T')[0]);

      return {
        ...d,
        id: d.id || d.orderNumber || `ord-${Date.now()}`,
        orderNumber: d.orderNumber || d.id || `#CS-${Date.now()}`,
        customerName: d.customerName || d.fullName || 'Valued Customer',
        customerEmail: d.customerEmail || d.email || '',
        customerCity: rawCity,
        items,
        totalAmount,
        paymentMethod: (d.paymentMethod?.toLowerCase().includes('cod') ? 'COD' : d.paymentMethod) || 'UPI',
        paymentStatus: d.paymentStatus || 'Paid',
        status: d.status || 'Processing',
        createdAt: typeof d.createdAt === 'string' ? d.createdAt : (d.date || 'Recent'),
        orderDate: d.orderDate || dateStr,
        trackingNumber: d.trackingNumber || undefined,
        courier: d.courier || undefined,
        shippingLabelUrl: d.shippingLabelUrl || undefined,
        shipprimeOrderId: d.shipprimeOrderId || undefined,
        notes: d.notes || undefined,
      };
    });

    return normalizedOrders.sort((a, b) => {
      const tA = new Date(a.orderDate || a.createdAt || 0).getTime();
      const tB = new Date(b.orderDate || b.createdAt || 0).getTime();
      return tB - tA;
    });
  } catch (error) {
    console.warn('Firestore: fetch orders fallback:', error);
    return [];
  }
}

/**
 * Create or update an admin order in Firestore
 */
export async function saveAdminOrderToFirestore(order: StudioOrder): Promise<void> {
  try {
    const docRef = doc(db, 'orders', order.id || order.orderNumber);
    await setDoc(docRef, { ...order, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.warn('Firestore: saveAdminOrder failed:', error);
  }
}

/**
 * Delete an order from Firestore
 */
export async function deleteFirestoreOrder(orderId: string): Promise<void> {
  try {
    const docRef = doc(db, 'orders', orderId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore: deleteFirestoreOrder failed:', error);
  }
}

/**
 * Fetch all products from Firestore collection 'products' (excluding dummy products)
 */
export async function fetchFirestoreProducts(): Promise<any[]> {
  try {
    const colRef = collection(db, 'products');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const DUMMY_PRODUCT_IDS = new Set([
        'lavender-bliss',
        'vanilla-dream',
        'rose-petal',
        'citrus-fresh',
        'sandalwood-serenity',
        'candle-gift-set',
        'candle-care-kit',
      ]);
      return snapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .filter((p: any) => p && p.id && !DUMMY_PRODUCT_IDS.has(p.id));
    }
    return [];
  } catch (error) {
    console.warn('Firestore: fetchFirestoreProducts failed:', error);
    return [];
  }
}

/**
 * Fetch a single product from Firestore by ID or slug with robust fallback matching
 */
export async function fetchFirestoreProductById(productId: string): Promise<any | null> {
  if (!productId) return null;
  const cleanId = String(productId).trim();
  const DUMMY_PRODUCT_IDS = new Set([
    'lavender-bliss',
    'vanilla-dream',
    'rose-petal',
    'citrus-fresh',
    'sandalwood-serenity',
    'candle-gift-set',
    'candle-care-kit',
  ]);

  if (DUMMY_PRODUCT_IDS.has(cleanId)) return null;

  try {
    // 1. Direct document lookup (fastest O(1))
    const docRef = doc(db, 'products', cleanId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (!DUMMY_PRODUCT_IDS.has(snap.id)) {
        return { id: snap.id, ...data };
      }
    }
  } catch (directErr) {
    console.warn('Firestore direct product getDoc notice:', directErr);
  }

  // 2. Resilient fallback query across collection
  try {
    const all = await fetchFirestoreProducts();
    const cleanLower = cleanId.toLowerCase();
    const cleanNorm = cleanLower.replace(/[^a-z0-9]/g, '');

    const found = all.find((p) => {
      if (!p) return false;
      const pId = String(p.id || '').trim();
      if (pId === cleanId) return true;
      if (pId.toLowerCase() === cleanLower) return true;
      if (pId.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanNorm) return true;

      // Check if product name matches slug
      if (p.name) {
        const nameSlug = String(p.name)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        if (nameSlug === cleanLower || nameSlug.replace(/-/g, '') === cleanNorm) return true;
      }
      return false;
    });

    return found || null;
  } catch (err) {
    console.warn('Firestore fetchFirestoreProductById failed:', err);
    return null;
  }
}

/**
 * Save or update a product in Firestore collection 'products'
 */
export async function saveProductToFirestore(product: any): Promise<void> {
  try {
    const docRef = doc(db, 'products', String(product.id));
    await setDoc(docRef, { ...product, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.warn('Firestore: saveProduct failed:', error);
  }
}

/**
 * Delete a product from Firestore
 */
export async function deleteFirestoreProduct(productId: string): Promise<void> {
  try {
    const docRef = doc(db, 'products', String(productId));
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore: deleteFirestoreProduct failed:', error);
  }
}

/**
 * Save or update a customer in Firestore collection 'customers'
 */
export async function saveCustomerToFirestore(customer: StudioCustomer): Promise<void> {
  try {
    const docRef = doc(db, 'customers', customer.id);
    await setDoc(docRef, { ...customer, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.warn('Firestore: saveCustomer failed:', error);
  }
}

/**
 * Delete a customer from Firestore
 */
export async function deleteFirestoreCustomer(customerId: string): Promise<void> {
  try {
    const docRef = doc(db, 'customers', customerId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore: deleteFirestoreCustomer failed:', error);
  }
}

/**
 * Save or update a promo code in Firestore collection 'promocodes'
 */
export async function savePromoToFirestore(promo: StudioPromoCode): Promise<void> {
  try {
    const docRef = doc(db, 'promocodes', promo.id);
    await setDoc(docRef, { ...promo, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.warn('Firestore: savePromo failed:', error);
  }
}

/**
 * Delete a promo code from Firestore
 */
export async function deleteFirestorePromo(promoId: string): Promise<void> {
  try {
    const docRef = doc(db, 'promocodes', promoId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore: deleteFirestorePromo failed:', error);
  }
}

