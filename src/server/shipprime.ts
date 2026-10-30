import fs from 'node:fs';
import path from 'node:path';

// Helper to get ShipPrime API Token from process.env or fallback to .env file
function getShipPrimeToken(): string {
  const envToken = process.env['SHIPPRIME_API_TOKEN'] || process.env['VITE_SHIPPRIME_API_TOKEN'];
  if (envToken) return envToken;

  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;
        const [k, ...rest] = trimmed.split('=');
        const key = k?.trim();
        const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
        if ((key === 'SHIPPRIME_API_TOKEN' || key === 'VITE_SHIPPRIME_API_TOKEN') && val) {
          return val;
        }
      }
    }
  } catch {
    // ignore
  }

  // Default seller token provided by user
  return 'sp_f89f9d4c23f8a06733aaca480447b552b0ac26a483fb3472d6c2a867d11924b0';
}

const SHIPPRIME_BASE_URL = 'https://api.shipprime.live/v1';

export interface ShipPrimeItemPayload {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  hsnCode?: string;
  imageUrl?: string;
}

export interface ShipPrimeAddressPayload {
  name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface ShipPrimeForwardOrderRequest {
  clientReferenceId: string;
  paymentMethod: 'PREPAID' | 'COD';
  collectibleAmount?: number;
  weightGrams: number;
  declaredValue: number;
  preferredTpls?: string[];
  items: ShipPrimeItemPayload[];
  pickupAddress: ShipPrimeAddressPayload;
  deliveryAddress: ShipPrimeAddressPayload;
}

export interface ShipPrimeForwardOrderResponse {
  awb: string;
  courier: string;
  labelUrl: string;
  orderId: number;
  status: 'SUCCESS' | 'FAILED';
  message?: string;
  code?: string;
}

/**
 * Creates forward shipment on ShipPrime
 */
export async function forwardOrderToShipPrime(
  payload: ShipPrimeForwardOrderRequest,
  customToken?: string
): Promise<{ status: number; data: any }> {
  const token = customToken || getShipPrimeToken();

  try {
    const res = await fetch(`${SHIPPRIME_BASE_URL}/forward`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await res.text();
    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText, status: 'FAILED' };
    }

    return {
      status: res.status,
      data: responseData,
    };
  } catch (error: any) {
    return {
      status: 500,
      data: {
        status: 'FAILED',
        message: error?.message || 'Failed to connect to ShipPrime API',
      },
    };
  }
}

/**
 * Cancels a shipment on ShipPrime by AWB
 */
export async function cancelShipPrimeShipment(
  awb: string,
  customToken?: string
): Promise<{ status: number; data: any }> {
  const token = customToken || getShipPrimeToken();

  try {
    const res = await fetch(`${SHIPPRIME_BASE_URL}/forward/${awb}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const responseText = await res.text();
    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    return {
      status: res.status,
      data: responseData,
    };
  } catch (error: any) {
    return {
      status: 500,
      data: {
        status: 'FAILED',
        message: error?.message || 'Failed to cancel shipment on ShipPrime',
      },
    };
  }
}

/**
 * Tracks a shipment on ShipPrime by AWB
 */
export async function trackShipPrimeShipment(
  awb: string,
  customToken?: string
): Promise<{ status: number; data: any }> {
  const token = customToken || getShipPrimeToken();

  try {
    const res = await fetch(`${SHIPPRIME_BASE_URL}/forward/track?awb=${encodeURIComponent(awb)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseText = await res.text();
    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    return {
      status: res.status,
      data: responseData,
    };
  } catch (error: any) {
    return {
      status: 500,
      data: {
        status: 'FAILED',
        message: error?.message || 'Failed to track shipment on ShipPrime',
      },
    };
  }
}

/**
 * Handles Web standard Request for ShipPrime endpoints (used in Tanstack Start / Nitro / server.ts)
 */
export async function handleWebShipPrimeRequest(request: Request): Promise<Response | null> {
  const url = new URL(request.url);

  if (url.pathname === '/api/shipprime/forward' && request.method === 'POST') {
    try {
      const payload = (await request.json()) as ShipPrimeForwardOrderRequest;
      const result = await forwardOrderToShipPrime(payload);
      return new Response(JSON.stringify(result.data), {
        status: result.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ status: 'FAILED', message: err?.message || 'Bad Request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (url.pathname === '/api/shipprime/cancel' && request.method === 'POST') {
    try {
      const { awb } = (await request.json()) as { awb: string };
      if (!awb) {
        return new Response(JSON.stringify({ status: 'FAILED', message: 'Missing awb' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const result = await cancelShipPrimeShipment(awb);
      return new Response(JSON.stringify(result.data), {
        status: result.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ status: 'FAILED', message: err?.message || 'Bad Request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (url.pathname === '/api/shipprime/track' && request.method === 'GET') {
    const awb = url.searchParams.get('awb');
    if (!awb) {
      return new Response(JSON.stringify({ status: 'FAILED', message: 'Missing awb param' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const result = await trackShipPrimeShipment(awb);
    return new Response(JSON.stringify(result.data), {
      status: result.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return null;
}
