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
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { StudioOrder, StudioCustomer, StudioPromoCode } from './admin-data';

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
  profileData: {
    fullName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  }
): Promise<void> {
  if (!email) return;
  try {
    const userDocRef = doc(db, 'users', email.toLowerCase().trim());
    await setDoc(
      userDocRef,
      {
        ...profileData,
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
 * Saves a customer checkout order in Firestore collection 'orders'
 */
export async function saveCustomerOrderToFirestore(orderData: any): Promise<void> {
  try {
    const orderId = orderData.orderNumber || orderData.id || `CS-ORD-${Date.now()}`;
    const orderDocRef = doc(db, 'orders', orderId);
    await setDoc(
      orderDocRef,
      {
        ...orderData,
        createdAtServer: serverTimestamp(),
        placedAtISO: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Firestore: Could not save checkout order remotely:', error);
  }
}

// ==========================================
// 2. ADMIN CRUD FIRESTORE OPERATIONS
// ==========================================

/**
 * Load all orders from Firestore
 */
export async function fetchFirestoreOrders(): Promise<StudioOrder[]> {
  try {
    const colRef = collection(db, 'orders');
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(100));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as any),
    }));
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
