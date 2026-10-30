/**
 * ShipPrime Shipping & Logistics Integration for Crystelle Studio
 * API Base: https://api.shipprime.live/v1/forward
 */

export interface ShipPrimeItem {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  hsnCode?: string;
  imageUrl?: string;
}

export interface ShipPrimeAddress {
  name: string;
  phone: string; // exactly 10 digits
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string; // 6 digits
  country: string; // "India"
}

export interface ShipPrimeForwardPayload {
  clientReferenceId: string;
  paymentMethod: 'PREPAID' | 'COD';
  collectibleAmount?: number;
  weightGrams: number;
  declaredValue: number;
  preferredTpls?: string[];
  items: ShipPrimeItem[];
  pickupAddress: ShipPrimeAddress;
  deliveryAddress: ShipPrimeAddress;
}

export interface ShipPrimeForwardResponse {
  awb: string;
  courier: string;
  labelUrl: string;
  orderId: number | string;
  status: 'SUCCESS' | 'FAILED';
  message?: string;
  code?: string;
}

export const DEFAULT_SHIPPRIME_TOKEN =
  'sp_f89f9d4c23f8a06733aaca480447b552b0ac26a483fb3472d6c2a867d11924b0';

/**
 * Standard Studio Pickup Warehouse Configuration
 * Note: Pincode 122002 is verified with ShipPrime courier allocation.
 */
export const DEFAULT_STUDIO_PICKUP_ADDRESS: ShipPrimeAddress = {
  name: 'Crystelle Studio Warehouse',
  phone: '9876543210',
  address1: 'Plot 45, Phase II',
  address2: 'Udyog Vihar',
  city: 'Gurgaon',
  state: 'Haryana',
  pincode: '122002',
  country: 'India',
};

/**
 * Standard HSN Code for Candles under Indian GST (Chapter 34: Candles, tapers and the like)
 */
export const CANDLE_HSN_CODE = '34060010';

/**
 * Computes estimated total gross package weight (in grams) for candle products including glass jar & protective packaging.
 */
export function calculateCandleOrderWeight(items: any[] = []): number {
  if (!items || items.length === 0) return 450;

  const totalWeight = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 1;
    const nameLower = (item.name || '').toLowerCase();
    const sizeVal = String(item.size || '').toLowerCase();

    let itemWeight = 450; // default standard 200g wax + glass jar = ~450g

    if (nameLower.includes('gift set')) {
      itemWeight = 1200; // Gift box packaging
    } else if (nameLower.includes('care kit') || nameLower.includes('trimmer')) {
      itemWeight = 320;
    } else if (sizeVal.includes('100') || sizeVal.includes('mini')) {
      itemWeight = 260; // 100g wax + jar
    } else if (sizeVal.includes('350') || sizeVal.includes('large') || sizeVal.includes('grand')) {
      itemWeight = 720; // 350g wax + heavy jar
    } else if (sizeVal.includes('200')) {
      itemWeight = 450;
    }

    return sum + itemWeight * qty;
  }, 0);

  return Math.max(200, Math.round(totalWeight));
}

/**
 * Normalizes phone numbers to standard 10-digit Indian mobile format
 */
export function sanitizeIndianPhone(rawPhone?: string): string {
  if (!rawPhone) return '9876543210';
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length === 10) return digits;
  if (digits.length > 10 && digits.startsWith('91')) {
    const withoutCountry = digits.slice(2);
    if (withoutCountry.length === 10) return withoutCountry;
  }
  if (digits.length > 10) return digits.slice(-10);
  return digits.padEnd(10, '0');
}

/**
 * Builds standard ShipPrime forward payload tailored to Crystelle Studio candle products
 */
export function buildCandleShipPrimePayload(
  order: any,
  customPickup?: Partial<ShipPrimeAddress>
): ShipPrimeForwardPayload {
  const isCod =
    String(order.paymentMethod || '').toUpperCase().includes('COD') ||
    String(order.paymentStatus || '').toUpperCase().includes('COD');

  const paymentMethod: 'PREPAID' | 'COD' = isCod ? 'COD' : 'PREPAID';
  const totalAmount = Number(order.totalAmount || order.total || 499);
  const rawItems = order.items || [];

  // Map order items to ShipPrime Item Schema
  const shipPrimeItems: ShipPrimeItem[] = (rawItems.length > 0 ? rawItems : [
    {
      name: 'Artisan Scented Candle',
      quantity: 1,
      price: totalAmount,
      size: '200g',
    },
  ]).map((item: any, idx: number) => {
    const rawName = item.name || 'Botanical Candle';
    const sizeStr = item.size ? `-${String(item.size).replace(/\s+/g, '')}` : '';
    const cleanSku =
      item.sku ||
      `CS-${rawName.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 14)}${sizeStr || '-200G'}-${idx + 1}`;

    return {
      name: rawName.slice(0, 180),
      sku: cleanSku.slice(0, 60),
      quantity: Math.max(1, Number(item.quantity) || 1),
      price: Math.max(0, Number(item.price) || totalAmount),
      hsnCode: item.hsnCode || CANDLE_HSN_CODE,
      imageUrl: item.image?.startsWith('http') ? item.image : undefined,
    };
  });

  const weightGrams = calculateCandleOrderWeight(rawItems);

  // Parse delivery address safely
  const shipAddr = order.shippingAddress || {};
  const cityFromOrder = order.customerCity ? order.customerCity.split(',')[0].trim() : '';
  const stateFromOrder = order.customerCity && order.customerCity.includes(',') ? order.customerCity.split(',')[1].trim() : '';

  const deliveryAddress: ShipPrimeAddress = {
    name: (order.customerName || 'Valued Collector').slice(0, 190),
    phone: sanitizeIndianPhone(order.customerPhone || shipAddr.phone),
    address1: (shipAddr.street || shipAddr.address1 || order.customerCity || 'Street Address').slice(0, 240),
    address2: (shipAddr.address2 || shipAddr.landmark || '').slice(0, 240),
    city: (shipAddr.city || cityFromOrder || 'Mumbai').slice(0, 95),
    state: (shipAddr.state || stateFromOrder || 'Maharashtra').slice(0, 95),
    pincode: String(shipAddr.postalCode || shipAddr.pincode || '400050').replace(/\D/g, '').slice(0, 6).padStart(6, '0'),
    country: 'India',
  };

  const pickupAddress: ShipPrimeAddress = {
    ...DEFAULT_STUDIO_PICKUP_ADDRESS,
    ...(customPickup || {}),
  };

  const clientReferenceId = String(order.orderNumber || order.id || `CS-ORD-${Date.now()}`).slice(0, 60);

  const payload: ShipPrimeForwardPayload = {
    clientReferenceId,
    paymentMethod,
    weightGrams,
    declaredValue: totalAmount,
    preferredTpls: ['DELHIVERY', 'SHADOWFAX', 'XPRESSBEES'],
    items: shipPrimeItems,
    pickupAddress,
    deliveryAddress,
  };

  if (isCod) {
    payload.collectibleAmount = totalAmount;
  }

  return payload;
}

/**
 * Creates forward shipment via ShipPrime API
 * Automatically tries internal server endpoint /api/shipprime/forward first,
 * with fallback to direct API call if running in client-isolated environment.
 */
export async function createShipPrimeForwardOrder(
  payload: ShipPrimeForwardPayload,
  authToken?: string
): Promise<ShipPrimeForwardResponse> {
  const token = authToken || DEFAULT_SHIPPRIME_TOKEN;

  // 1. Try internal backend proxy
  try {
    const proxyRes = await fetch('/api/shipprime/forward', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      return data as ShipPrimeForwardResponse;
    }
  } catch (err) {
    console.warn('ShipPrime: Proxy forward route unavailable, trying direct call:', err);
  }

  // 2. Direct fallback
  const directRes = await fetch('https://api.shipprime.live/v1/forward', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const resText = await directRes.text();
  try {
    return JSON.parse(resText) as ShipPrimeForwardResponse;
  } catch {
    return {
      awb: '',
      courier: '',
      labelUrl: '',
      orderId: 0,
      status: 'FAILED',
      message: resText || 'Failed to parse ShipPrime response',
    };
  }
}

/**
 * Cancels forward shipment on ShipPrime by AWB
 */
export async function cancelShipPrimeForwardOrder(
  awb: string,
  authToken?: string
): Promise<{ status: string; message: string }> {
  const token = authToken || DEFAULT_SHIPPRIME_TOKEN;

  try {
    const proxyRes = await fetch('/api/shipprime/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ awb }),
    });

    if (proxyRes.ok) {
      return await proxyRes.json();
    }
  } catch (err) {
    console.warn('ShipPrime: Proxy cancel route failed, trying direct:', err);
  }

  const directRes = await fetch(`https://api.shipprime.live/v1/forward/${encodeURIComponent(awb)}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return await directRes.json();
}

/**
 * Tracks forward shipment on ShipPrime by AWB
 */
export async function trackShipPrimeForwardOrder(
  awb: string,
  authToken?: string
): Promise<any> {
  const token = authToken || DEFAULT_SHIPPRIME_TOKEN;

  try {
    const proxyRes = await fetch(`/api/shipprime/track?awb=${encodeURIComponent(awb)}`);
    if (proxyRes.ok) {
      return await proxyRes.json();
    }
  } catch (err) {
    console.warn('ShipPrime: Proxy track route failed, trying direct:', err);
  }

  const directRes = await fetch(`https://api.shipprime.live/v1/forward/track?awb=${encodeURIComponent(awb)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await directRes.json();
}
