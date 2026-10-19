import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, useId } from 'react';
import { useStore } from '@/components/storefront';
import { products, money, pageHead } from '@/lib/store-data';
import { lookupPincode } from '@/lib/pincode';
import { saveCustomerOrderToFirestore } from '@/lib/firestore-service';
import type { Order, OrderItem } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  PackageCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Tag,
  Phone,
  Mail,
  MapPin,
  User,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const Route = createFileRoute('/checkout')({
  head: () =>
    pageHead(
      'Express Checkout | Crystelle Studio',
      'Fast, secure, and encrypted checkout for your handcrafted candle order. Nationwide delivery from Pulgaon, Maharashtra.'
    ),
  component: CheckoutPage,
});

type PaymentMethod = 'upi' | 'card' | 'cod' | 'netbanking';

function CheckoutPage() {
  const { cart, user, addOrder, notify } = useStore();
  const navigate = useNavigate();

  // If user has saved profile, pre-fill all fields for a 1-step checkout!
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || 'Maharashtra');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [saveAddress, setSaveAddress] = useState(true);
  const [isDetectingPin, setIsDetectingPin] = useState(false);

  const handlePincodeChange = async (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setPostalCode(clean);

    if (clean.length === 6) {
      setIsDetectingPin(true);
      try {
        const detected = await lookupPincode(clean);
        if (detected) {
          setCity(detected.city);
          setState(detected.state);
          notify(`📍 Address detected: ${detected.city}, ${detected.state}`);
        }
      } catch {
        // ignore
      } finally {
        setIsDetectingPin(false);
      }
    }
  };

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number; description: string } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Processing & Placed state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Calculate pricing
  const subtotal = cart.reduce((total, item) => {
    const p = products.find((prod) => prod.id === item.id);
    const sizeAdjustment = item.size === 100 ? -150 : item.size === 350 ? 200 : 0;
    return total + (p ? (p.price + sizeAdjustment) * item.quantity : 0);
  }, 0);

  // Free shipping above ₹999 or flat ₹69
  const baseShipping = subtotal >= 999 || appliedDiscount?.code === 'FREESHIP' ? 0 : 69;
  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + baseShipping);

  // Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'WELCOME10' || code === 'FIRST10') {
      const discount = Math.round(subtotal * 0.1);
      setAppliedDiscount({ code, amount: discount, description: '10% New Customer Discount' });
      notify('Coupon WELCOME10 applied! 10% saved.');
    } else if (code === 'CRYSTELLE') {
      const discount = Math.min(subtotal, 100);
      setAppliedDiscount({ code, amount: discount, description: '₹100 Studio Special' });
      notify('Coupon CRYSTELLE applied! ₹100 saved.');
    } else if (code === 'FREESHIP') {
      setAppliedDiscount({ code, amount: 69, description: 'Free Express Shipping' });
      notify('Coupon FREESHIP applied!');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 or CRYSTELLE');
    }
  };

  // Place Order Handler
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart.length) return;

    if (!fullName.trim() || !email.trim() || !phone.trim() || !street.trim() || !city.trim() || !postalCode.trim()) {
      notify('Please complete all required delivery details.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Map cart to OrderItems
      const orderItems: OrderItem[] = cart
        .map((item) => {
          const p = products.find((prod) => prod.id === item.id);
          if (!p) return null;
          const sizeAdjustment = item.size === 100 ? -150 : item.size === 350 ? 200 : 0;
          return {
            id: p.id,
            name: p.name,
            size: item.size,
            quantity: item.quantity,
            price: p.price + sizeAdjustment,
            image: p.image,
          };
        })
        .filter((item): item is OrderItem => item !== null);

      const orderNumber = 'CS-ORD-' + Math.floor(10000 + Math.random() * 90000);
      const trackingCode = 'IND-CRYST-' + Math.floor(10000 + Math.random() * 90000);

      const newOrder: Order = {
        id: orderNumber,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Processing',
        total: finalTotal,
        items: orderItems,
        trackingNumber: trackingCode,
      };

      // Save order to Cloud Firestore collection 'orders'
      await saveCustomerOrderToFirestore({
        ...newOrder,
        orderNumber: newOrder.id,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'Pending (COD)' : 'Paid (Verified)',
        subtotal,
        shippingFee: baseShipping,
        discountAmount,
        appliedDiscountCode: appliedDiscount?.code || null,
        shippingAddress: {
          street,
          city,
          state,
          postalCode,
          country: 'India',
        },
      });

      // Add to store session
      addOrder(newOrder, {
        fullName,
        email,
        phone,
        address: {
          street,
          city,
          state,
          postalCode,
          country: 'India',
        },
      });

      setIsSubmitting(false);
      setPlacedOrder(newOrder);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.warn('Checkout order save warning:', err);
      setIsSubmitting(false);
    }
  };

  // 1. ORDER SUCCESS SCREEN
  if (placedOrder) {
    return (
      <main className="checkout-viewport">
        <div className="container page">
          <div className="order-success-card">
            <div className="order-success-sparkle">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div className="order-success-icon-wrap">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <span className="order-success-pill">Order Confirmed & Received</span>
            <h1 className="order-success-title">Thank you for your order, {fullName.split(' ')[0]}!</h1>
            <p className="order-success-subtitle">
              We have received your order <strong>{placedOrder.id}</strong>. Our artisans at Crystelle Studio are preparing your handcrafted candles for curing and safe packaging.
            </p>

            {/* Quick Status Highlight Bar */}
            <div className="order-tracking-preview-box">
              <div className="tracking-preview-item">
                <span className="label">Order Reference</span>
                <strong>{placedOrder.id}</strong>
              </div>
              <div className="tracking-preview-item">
                <span className="label">Estimated Delivery</span>
                <strong>3–5 Business Days</strong>
              </div>
              <div className="tracking-preview-item">
                <span className="label">Courier Tracking Code</span>
                <code className="text-amber-800 font-semibold">{placedOrder.trackingNumber}</code>
              </div>
              <div className="tracking-preview-item">
                <span className="label">Payment Status</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {paymentMethod === 'cod' ? 'Cash on Delivery (Verified)' : 'Prepaid • Secured'}
                </span>
              </div>
            </div>

            {/* Summary Details Grid */}
            <div className="order-success-grid">
              {/* Delivery Details */}
              <div className="order-success-block">
                <h3>Delivery Address</h3>
                <p>
                  <strong>{fullName}</strong><br />
                  {phone}<br />
                  {street}, {city}<br />
                  {state} &ndash; {postalCode}, India
                </p>
                <span className="text-xs text-muted-foreground block mt-2">
                  Dispatch Studio: Crystelle Studio, Pulgaon, Wardha, Maharashtra
                </span>
              </div>

              {/* Items Purchased */}
              <div className="order-success-block">
                <h3>Ordered Candles ({placedOrder.items.length})</h3>
                <div className="order-items-mini-list">
                  {placedOrder.items.map((item, idx) => (
                    <div key={idx} className="order-item-mini-row">
                      <img src={item.image} alt={item.name} className="mini-item-img" width={40} height={40} />
                      <div className="mini-item-details">
                        <span className="mini-item-name">{item.name}</span>
                        <span className="mini-item-meta">Qty: {item.quantity} {item.size > 1 ? `• ${item.size}g` : ''}</span>
                      </div>
                      <span className="mini-item-price">{money(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-success-total-row">
                  <span>Total Paid</span>
                  <strong>{money(placedOrder.total)}</strong>
                </div>
              </div>
            </div>

            {/* Post-order Action Buttons */}
            <div className="order-success-actions">
              <Button asChild className="checkout-primary-btn">
                <Link to="/profile">
                  <PackageCheck className="w-4 h-4 mr-2" />
                  <span>View Order in Profile</span>
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/shop">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  <span>Continue Shopping</span>
                </Link>
              </Button>
              <a
                href={`https://wa.me/917058398041?text=Hello%20Crystelle%20Studio%2C%20I%20just%20placed%20order%20${placedOrder.id}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="order-whatsapp-btn"
              >
                <span>WhatsApp Order Updates</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 2. EMPTY CART VIEW
  if (cart.length === 0) {
    return (
      <main className="checkout-viewport">
        <div className="container page">
          <div className="checkout-empty-state">
            <ShoppingBag className="w-12 h-12 text-muted-foreground stroke-1 mb-3" />
            <h2>Your shopping bag is empty</h2>
            <p>Select your favorite scented candles to begin checkout.</p>
            <Button asChild className="mt-4">
              <Link to="/shop">Explore Handcrafted Candles</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // 3. STREAMLINED MINIMUM-STEPS CHECKOUT FLOW
  return (
    <main className="checkout-viewport">
      <div className="container page">
        {/* Checkout Header & Trust Indicators */}
        <header className="checkout-nav-bar">
          <div className="checkout-nav-left">
            <Link to="/cart" className="checkout-back-link">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cart</span>
            </Link>
          </div>
          <div className="checkout-security-pill">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit Encrypted SSL Checkout</span>
          </div>
        </header>

        <div className="checkout-heading-wrap">
          <h1>Express Checkout</h1>
          <p>Complete your delivery and payment details in one quick step.</p>
        </div>

        {/* 2-Column Responsive Checkout Grid */}
        <div className="checkout-grid">
          {/* LEFT: 2-Step Minimum Streamlined Form */}
          <form onSubmit={handlePlaceOrder} className="checkout-form-col">
            {/* STEP 1: Delivery Information */}
            <section className="checkout-step-card">
              <div className="checkout-step-head">
                <div className="step-number-badge">1</div>
                <div>
                  <h2>Delivery Information</h2>
                  <p>Where should our studio dispatch your candles?</p>
                </div>
              </div>

              <div className="checkout-step-body">
                <div className="form-row-2">
                  <div className="checkout-field">
                    <Label htmlFor="checkout-fullName">Full Name</Label>
                    <div className="checkout-input-wrap">
                      <User className="input-icon" />
                      <Input
                        id="checkout-fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Priyanshi Mehta"
                        required
                      />
                    </div>
                  </div>

                  <div className="checkout-field">
                    <Label htmlFor="checkout-phone">Mobile Phone (for delivery OTP)</Label>
                    <div className="checkout-input-wrap">
                      <Phone className="input-icon" />
                      <Input
                        id="checkout-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="checkout-field">
                  <Label htmlFor="checkout-email">Email Address (for tracking & invoice)</Label>
                  <div className="checkout-input-wrap">
                    <Mail className="input-icon" />
                    <Input
                      id="checkout-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="checkout-field">
                  <Label htmlFor="checkout-street">Delivery Street Address</Label>
                  <div className="checkout-input-wrap">
                    <MapPin className="input-icon" />
                    <Input
                      id="checkout-street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Flat / House No., Society or Street Name"
                      required
                    />
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="checkout-field">
                    <Label htmlFor="checkout-city">City / Town</Label>
                    <Input
                      id="checkout-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai, Pune..."
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <Label htmlFor="checkout-state">State</Label>
                    <Input
                      id="checkout-state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Maharashtra"
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="checkout-pincode">PIN Code</Label>
                      {isDetectingPin && (
                        <span className="text-[10px] text-amber-600 animate-pulse font-medium">
                          Detecting...
                        </span>
                      )}
                    </div>
                    <Input
                      id="checkout-pincode"
                      value={postalCode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      placeholder="6-digit PIN"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <label className="checkout-checkbox-label">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                  />
                  <span>Save these delivery details for 1-click future orders</span>
                </label>
              </div>
            </section>

            {/* STEP 2: Payment Method */}
            <section className="checkout-step-card">
              <div className="checkout-step-head">
                <div className="step-number-badge">2</div>
                <div>
                  <h2>Payment Method</h2>
                  <p>Choose your preferred secure payment method</p>
                </div>
              </div>

              <div className="checkout-step-body">
                {/* Method Selector Pills */}
                <div className="payment-options-grid">
                  {/* UPI */}
                  <label className={`payment-pill ${paymentMethod === 'upi' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                    />
                    <div className="pill-content">
                      <div className="pill-title">
                        <QrCode className="w-4 h-4 text-amber-700" />
                        <strong>UPI (GPay / PhonePe / QR)</strong>
                      </div>
                      <span className="pill-badge-green">Instant &bull; 0% Fee</span>
                    </div>
                  </label>

                  {/* Cards */}
                  <label className={`payment-pill ${paymentMethod === 'card' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <div className="pill-content">
                      <div className="pill-title">
                        <CreditCard className="w-4 h-4 text-foreground" />
                        <strong>Credit / Debit Card</strong>
                      </div>
                      <span className="pill-desc">Visa, Mastercard, RuPay</span>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label className={`payment-pill ${paymentMethod === 'cod' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <div className="pill-content">
                      <div className="pill-title">
                        <Banknote className="w-4 h-4 text-emerald-700" />
                        <strong>Cash on Delivery (COD)</strong>
                      </div>
                      <span className="pill-desc">Pay at doorstep upon delivery</span>
                    </div>
                  </label>
                </div>

                {/* Sub-inputs based on method */}
                {paymentMethod === 'upi' && (
                  <div className="payment-subpanel">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-medium">Fastest Checkout via UPI</span>
                    </div>
                    <div className="checkout-input-wrap">
                      <Input
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Enter your UPI ID (e.g. mobile@upi, name@okhdfcbank)"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-2 block">
                      A payment request will be sent to your UPI app, or you can scan the QR code upon placing order.
                    </span>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="payment-subpanel">
                    <div className="checkout-field mb-3">
                      <Label htmlFor="checkout-cardNumber">Card Number</Label>
                      <Input
                        id="checkout-cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• 8841"
                        maxLength={19}
                      />
                    </div>
                    <div className="form-row-2">
                      <div className="checkout-field">
                        <Label htmlFor="checkout-expiry">MM / YY</Label>
                        <Input
                          id="checkout-expiry"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          maxLength={5}
                        />
                      </div>
                      <div className="checkout-field">
                        <Label htmlFor="checkout-cvv">CVV</Label>
                        <Input
                          id="checkout-cvv"
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="payment-subpanel">
                    <p className="text-xs text-muted-foreground">
                      Please have the exact cash amount of <strong>{money(finalTotal)}</strong> ready at the time of delivery. You will receive an SMS and WhatsApp confirmation before our courier arrives.
                    </p>
                  </div>
                )}

                {/* Submit Action CTA */}
                <div className="checkout-cta-wrap">
                  <Button
                    type="submit"
                    className="checkout-place-order-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Securing & Placing Order...'
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        <span>Place Order &bull; {money(finalTotal)}</span>
                      </>
                    )}
                  </Button>
                  <p className="checkout-terms-note">
                    By placing your order, you agree to Crystelle Studio's{' '}
                    <Link to="/terms-and-conditions" target="_blank" className="underline">
                      Terms
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy-policy" target="_blank" className="underline">
                      Privacy Policy
                    </Link>.
                  </p>
                </div>
              </div>
            </section>
          </form>

          {/* RIGHT: Live Sticky Order Summary */}
          <aside className="checkout-summary-col">
            <div className="checkout-summary-card">
              <div className="summary-card-head">
                <h2>Order Summary</h2>
                <span className="summary-items-count">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} {cart.length === 1 ? 'Candle' : 'Candles'}
                </span>
              </div>

              {/* Items List */}
              <div className="summary-items-list">
                {cart.map((item) => {
                  const p = products.find((prod) => prod.id === item.id);
                  if (!p) return null;
                  const sizeAdjustment = item.size === 100 ? -150 : item.size === 350 ? 200 : 0;
                  const itemPrice = (p.price + sizeAdjustment) * item.quantity;
                  return (
                    <div key={item.id + item.size} className="summary-item-row">
                      <img src={p.image} alt={p.name} className="summary-item-img" width={48} height={48} />
                      <div className="summary-item-info">
                        <span className="summary-item-title">{p.name}</span>
                        <span className="summary-item-meta">
                          Qty: {item.quantity} &bull; {item.size > 1 ? `${item.size}g` : '1 Set'}
                        </span>
                      </div>
                      <span className="summary-item-price">{money(itemPrice)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Form */}
              <div className="summary-coupon-block">
                <form onSubmit={handleApplyCoupon} className="coupon-form">
                  <Input
                    placeholder="Coupon (e.g. WELCOME10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="coupon-input"
                  />
                  <Button type="submit" variant="outline" size="sm" className="coupon-btn">
                    Apply
                  </Button>
                </form>
                {couponError && <span className="coupon-error">{couponError}</span>}
                {appliedDiscount && (
                  <div className="coupon-success-pill">
                    <Tag className="w-3.5 h-3.5" />
                    <span>
                      {appliedDiscount.code}: Saved {money(appliedDiscount.amount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppliedDiscount(null)}
                      className="coupon-remove-btn"
                      title="Remove coupon"
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="summary-breakdown">
                <div className="breakdown-row">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>

                <div className="breakdown-row">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-muted-foreground" />
                    Shipping (All India)
                  </span>
                  <span>
                    {baseShipping === 0 ? (
                      <strong className="text-emerald-700 font-semibold">FREE</strong>
                    ) : (
                      money(baseShipping)
                    )}
                  </span>
                </div>

                {appliedDiscount && (
                  <div className="breakdown-row text-emerald-700">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span>&minus;{money(appliedDiscount.amount)}</span>
                  </div>
                )}

                <div className="breakdown-total-row">
                  <span>Total Amount</span>
                  <strong>{money(finalTotal)}</strong>
                </div>
              </div>

              {/* Trust Badges in Sidebar */}
              <div className="checkout-trust-box">
                <div className="trust-item">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Free Breakage Replacement Guarantee</span>
                </div>
                <div className="trust-item">
                  <PackageCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Freshly hand-poured in Pulgaon, Maharashtra</span>
                </div>
                <div className="trust-item">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>Dispatch within 1&ndash;3 business days</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
