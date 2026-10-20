import Razorpay from 'razorpay';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// Helper to load credentials from process.env or fallback to .env file
function getCredentials() {
  let keyId = process.env['RAZORPAY_KEY_ID'] || process.env['VITE_RAZORPAY_KEY_ID'];
  let keySecret = process.env['RAZORPAY_KEY_SECRET'];

  if (!keyId || !keySecret) {
    try {
      const envPath = path.resolve(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const lines = fs.readFileSync(envPath, 'utf8').split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;
          const parts = trimmed.split('=');
          const key = parts[0]?.trim() || '';
          const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
          if (key === 'RAZORPAY_KEY_ID' && !keyId) keyId = val;
          if (key === 'VITE_RAZORPAY_KEY_ID' && !keyId) keyId = val;
          if (key === 'RAZORPAY_KEY_SECRET' && !keySecret) keySecret = val;
        }
      }
    } catch {
      // ignore
    }
  }

  return {
    keyId: keyId || '',
    keySecret: keySecret || '',
  };
}

export function getRazorpayClient() {
  const { keyId, keySecret } = getCredentials();
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials missing: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set');
  }
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export interface CreateOrderParams {
  amount: number; // in paise
  currency?: string;
  receipt?: string;
}

export interface CreateOrderResult {
  order_id: string;
  amount: number;
  currency: string;
}

export async function createOrder(params: CreateOrderParams): Promise<{ status: number; data: any }> {
  const { amount, currency = 'INR', receipt } = params;

  // Validate amount >= 100 paise (₹1)
  if (!amount || typeof amount !== 'number' || amount < 100) {
    return {
      status: 400,
      data: { error: 'Invalid amount. Minimum amount is 100 paise (₹1.00).' },
    };
  }

  try {
    const { keyId, keySecret } = getCredentials();
    if (!keyId || !keySecret) {
      return {
        status: 401,
        data: { error: 'Razorpay authentication failed: Missing API keys.' },
      };
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(amount),
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await instance.orders.create(options);

    return {
      status: 200,
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    };
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    if (error?.statusCode === 401 || error?.error?.code === 'BAD_REQUEST_ERROR' && error?.message?.toLowerCase().includes('auth')) {
      return {
        status: 401,
        data: { error: 'Razorpay authentication failed. Please check your credentials.' },
      };
    }
    return {
      status: 500,
      data: { error: error?.error?.description || error?.message || 'Failed to create Razorpay order' },
    };
  }
}

export interface VerifyPaymentParams {
  order_id?: string;
  payment_id?: string;
  signature?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

export function verifyPaymentSignature(params: VerifyPaymentParams): { status: number; data: any } {
  const orderId = params.order_id || params.razorpay_order_id;
  const paymentId = params.payment_id || params.razorpay_payment_id;
  const signature = params.signature || params.razorpay_signature;

  // Check missing fields
  if (!orderId || !paymentId || !signature) {
    return {
      status: 400,
      data: {
        success: false,
        error: 'Missing required fields: order_id, payment_id, and signature are all required.',
      },
    };
  }

  const { keySecret } = getCredentials();
  if (!keySecret) {
    return {
      status: 500,
      data: { success: false, error: 'Server configuration error: RAZORPAY_KEY_SECRET missing.' },
    };
  }

  // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
  const bodyText = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(bodyText)
    .digest('hex');

  if (generatedSignature !== signature) {
    return {
      status: 400,
      data: {
        success: false,
        error: 'Payment verification failed: Signature mismatch. Do NOT fulfill order.',
      },
    };
  }

  return {
    status: 200,
    data: {
      success: true,
      message: 'Payment verified successfully.',
      order_id: orderId,
      payment_id: paymentId,
    },
  };
}

// Handler for Web standard Request/Response (e.g., src/server.ts)
export async function handleWebRazorpayRequest(request: Request): Promise<Response | null> {
  const url = new URL(request.url);

  if (url.pathname === '/api/create-order' && request.method === 'POST') {
    try {
      const body = await request.json();
      const result = await createOrder(body);
      return new Response(JSON.stringify(result.data), {
        status: result.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'Invalid JSON request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (url.pathname === '/api/verify-payment' && request.method === 'POST') {
    try {
      const body = await request.json();
      const result = verifyPaymentSignature(body);
      return new Response(JSON.stringify(result.data), {
        status: result.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return null;
}
