/**
 * Meta (Facebook) Pixel integration
 * Pixel ID: 1742907886811644
 */

export const META_PIXEL_ID = '1742907886811644';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Low-level call to window.fbq if available
 */
export function fbqTrack(event: string, params?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.fbq === 'function') {
      if (params) {
        window.fbq('track', event, params);
      } else {
        window.fbq('track', event);
      }
    }
  } catch (err) {
    console.debug('Meta Pixel tracking error:', err);
  }
}

/**
 * Standard PageView event
 */
export function trackPixelPageView() {
  fbqTrack('PageView');
}

/**
 * Track ViewContent event
 */
export function trackPixelViewContent(product: {
  id: string;
  name: string;
  price?: number | undefined;
  category?: string | undefined;
}) {
  fbqTrack('ViewContent', {
    content_name: product.name,
    content_ids: [product.id],
    content_type: 'product',
    value: typeof product.price === 'number' ? product.price / 100 : undefined,
    currency: 'INR',
    content_category: product.category,
  });
}

/**
 * Track AddToCart event
 */
export function trackPixelAddToCart(item: {
  id: string;
  name?: string | undefined;
  price?: number | undefined;
  quantity?: number | undefined;
}) {
  fbqTrack('AddToCart', {
    content_name: item.name,
    content_ids: [item.id],
    content_type: 'product',
    value: typeof item.price === 'number' ? (item.price * (item.quantity || 1)) / 100 : undefined,
    currency: 'INR',
  });
}

/**
 * Track InitiateCheckout event
 */
export function trackPixelInitiateCheckout(totalAmountInPaise: number, numItems: number) {
  fbqTrack('InitiateCheckout', {
    value: totalAmountInPaise / 100,
    currency: 'INR',
    num_items: numItems,
  });
}

/**
 * Track Purchase event
 */
export function trackPixelPurchase(order: {
  orderId: string;
  totalInPaise: number;
  currency?: string | undefined;
  numItems?: number | undefined;
}) {
  fbqTrack('Purchase', {
    value: order.totalInPaise / 100,
    currency: order.currency || 'INR',
    content_type: 'product',
    order_id: order.orderId,
    num_items: order.numItems,
  });
}
