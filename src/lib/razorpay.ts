// Client-side Razorpay integration utilities

declare global {
  interface Window {
    Razorpay?: any;
  }
}

/**
 * Ensures the Razorpay checkout.js script is loaded safely in document.head
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Failed to load Razorpay checkout.js script');
      resolve(false);
    };

    document.head.appendChild(script);
  });
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface OpenCheckoutOptions {
  orderId: string;
  amount: number; // in paise
  currency?: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (response: RazorpaySuccessResponse) => void;
  onDismiss?: () => void;
  onFailure?: (error: any) => void;
}

/**
 * Opens Razorpay Standard Checkout modal
 */
export async function openRazorpayModal(options: OpenCheckoutOptions): Promise<void> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    throw new Error('Razorpay payment gateway failed to load. Please check your internet connection and try again.');
  }

  const keyId =
    (typeof import.meta !== 'undefined' && import.meta.env?.['VITE_RAZORPAY_KEY_ID']) ||
    'rzp_test_Tq8zXO9tg8iTzT';

  const fullOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  const razorpayOptions = {
    key: keyId,
    amount: options.amount,
    currency: options.currency || 'INR',
    name: options.name || 'Crystelle Studio',
    description: options.description || 'Handcrafted Luxury Candle Order',
    image: fullOrigin ? `${fullOrigin}/pearl-crystelle-favicon.png` : undefined,
    order_id: options.orderId,
    prefill: {
      name: options.prefill?.name || '',
      email: options.prefill?.email || '',
      contact: options.prefill?.contact || '',
    },
    theme: {
      color: '#d97706', // amber-600 matching Crystelle Studio brand
    },
    modal: {
      backdropclose: false,
      escape: true,
      handleback: true,
      confirm_close: true,
      ondismiss: () => {
        if (options.onDismiss) {
          options.onDismiss();
        }
      },
    },
    handler: (response: RazorpaySuccessResponse) => {
      options.onSuccess(response);
    },
  };

  const rzp = new window.Razorpay(razorpayOptions);

  rzp.on('payment.failed', (response: any) => {
    console.error('Razorpay payment failed:', response?.error);
    if (options.onFailure) {
      options.onFailure(response?.error);
    }
  });

  rzp.open();
}
