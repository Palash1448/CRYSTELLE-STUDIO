import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useStore } from '@/components/storefront';
import { pageHead, money } from '@/lib/store-data';
import { seoHead } from '@/lib/seo';
import { lookupPincode } from '@/lib/pincode';
import { saveUserProfileToFirestore, fetchUserProfileFromFirestore } from '@/lib/firestore-service';
import { logoutFirebaseAuth } from '@/lib/firebase-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  LogOut,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Download,
} from 'lucide-react';
import { type Order } from '@/lib/auth';
import { CustomerOrderDetailsModal } from '@/components/CustomerOrderDetailsModal';
import { downloadInvoice } from '@/lib/invoice';

export const Route = createFileRoute('/profile')({
  head: () =>
    seoHead({
      title: 'My Account & Orders',
      description: 'Manage your name, phone number, address, and order details.',
      noindex: true,
      path: '/profile',
    }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateProfile, logout, notify } = useStore();
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // If not logged in, redirect to login
  useEffect(() => {
    if (!user) {
      navigate({ to: '/login' });
    }
  }, [user, navigate]);

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || 'Maharashtra');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [country, setCountry] = useState(user?.address?.country || 'India');

  // React to asynchronous user profile loading/refresh from Firestore
  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.address) {
        if (user.address.street) setStreet(user.address.street);
        if (user.address.city) setCity(user.address.city);
        if (user.address.state) setState(user.address.state);
        if (user.address.postalCode) setPostalCode(user.address.postalCode);
        if (user.address.country) setCountry(user.address.country);
      }
    }
  }, [user]);

  // Fetch freshest profile & orders directly from Firestore on mount
  useEffect(() => {
    if (user?.email) {
      fetchUserProfileFromFirestore(user.email)
        .then((remote) => {
          if (remote) {
            updateProfile(remote);
          }
        })
        .catch((err) => {
          console.warn('Could not refresh remote profile on profile page:', err);
        });
    }
  }, [user?.email]);

  const [isDetectingPin, setIsDetectingPin] = useState(false);
  const [pinFeedback, setPinFeedback] = useState('');

  const handlePincodeChange = async (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setPostalCode(clean);

    if (clean.length === 6) {
      setIsDetectingPin(true);
      setPinFeedback('');
      try {
        const detected = await lookupPincode(clean);
        if (detected) {
          setCity(detected.city);
          setState(detected.state);
          setPinFeedback(`✨ Auto-detected: ${detected.city}, ${detected.state}`);
        } else {
          setPinFeedback('Please enter city and state manually');
        }
      } catch {
        setPinFeedback('');
      } finally {
        setIsDetectingPin(false);
      }
    } else {
      setPinFeedback('');
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Save to Firebase Firestore collection 'users'
      await saveUserProfileToFirestore(email, {
        fullName,
        email,
        phone,
        address: {
          street,
          city,
          state,
          postalCode,
          country,
        },
      });
    } catch (err) {
      console.warn('Profile save to Firestore error:', err);
    }

    updateProfile({
      fullName,
      email,
      phone,
      address: {
        street,
        city,
        state,
        postalCode,
        country,
      },
    });

    setIsSaving(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await logoutFirebaseAuth();
      logout();
      navigate({ to: '/login' });
    }
  };

  if (!user) {
    return null;
  }

  const orders = user.orders || [];

  return (
    <main className="min-profile-viewport">
      <div className="container page">
        {/* Minimalist Top Profile Header */}
        <section className="min-profile-header">
          <div className="min-header-user">
            <div className="min-avatar">
              {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="min-user-name">{fullName || 'Account Holder'}</h1>
              <p className="min-user-email">{email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="min-signout-btn"
            title="Sign out of your account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </section>

        {justSaved && (
          <div className="min-save-alert" role="status">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile details saved successfully.</span>
          </div>
        )}

        {/* 2-Column Minimalist Layout: Details on Left, Orders on Right */}
        <div className="min-profile-grid">
          {/* LEFT: Name, Phone & Address Form */}
          <div className="min-card">
            <div className="min-card-head">
              <div className="min-card-icon">
                <User className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <h2>Profile Details</h2>
                <p>Your name, contact phone, and delivery address.</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="min-card-body">
              <div className="min-form-group">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="min-input-wrap">
                  <User className="min-icon" />
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>

              <div className="min-form-row">
                <div className="min-form-group">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="min-input-wrap">
                    <Phone className="min-icon" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>

                <div className="min-form-group">
                  <Label htmlFor="email">Email</Label>
                  <div className="min-input-wrap">
                    <Mail className="min-icon" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="min-divider" />

              <div className="min-form-group">
                <Label htmlFor="street">Address (Flat, Building, Street)</Label>
                <div className="min-input-wrap">
                  <MapPin className="min-icon" />
                  <Input
                    id="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Flat / House no, Building, Street name"
                    required
                  />
                </div>
              </div>

              <div className="min-form-row">
                <div className="min-form-group">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="postalCode">PIN Code</Label>
                    {isDetectingPin && (
                      <span className="text-[11px] text-amber-700 animate-pulse font-medium">
                        Looking up...
                      </span>
                    )}
                  </div>
                  <Input
                    id="postalCode"
                    maxLength={6}
                    value={postalCode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="6-digit PIN (e.g. 400050)"
                    required
                  />
                  {pinFeedback && (
                    <span className="text-[11px] text-emerald-700 font-medium block mt-1">
                      {pinFeedback}
                    </span>
                  )}
                </div>

                <div className="min-form-group">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="India"
                    required
                  />
                </div>
              </div>

              <div className="min-form-row">
                <div className="min-form-group">
                  <Label htmlFor="city">City (Auto-detected)</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    required
                  />
                </div>

                <div className="min-form-group">
                  <Label htmlFor="state">State (Auto-detected)</Label>
                  <Input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    required
                  />
                </div>
              </div>

              <div className="min-form-foot">
                <Button type="submit" className="min-save-btn" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Profile Details'}
                </Button>
              </div>
            </form>
          </div>

          {/* RIGHT: Order Details */}
          <div className="min-card">
            <div className="min-card-head">
              <div className="min-card-icon">
                <Package className="w-4 h-4 text-foreground" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <h2>Order Details</h2>
                  <p>Track your current and previous candle purchases.</p>
                </div>
                <span className="min-orders-count">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>
            </div>

            <div className="min-card-body">
              {orders.length === 0 ? (
                <div className="min-empty-orders">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground stroke-1" />
                  <p className="font-medium text-sm mt-2">No orders placed yet</p>
                  <span className="text-xs text-muted-foreground mt-1">
                    When you order handcrafted candles, your order summary and delivery updates will
                    appear here.
                  </span>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link to="/shop">Explore Shop</Link>
                  </Button>
                </div>
              ) : (
                <div className="min-orders-list">
                  {orders.map((order) => (
                    <article
                      key={order.id}
                      className="min-order-item cursor-pointer hover:border-[#D4A359]/70 hover:shadow-md transition-all group relative"
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedOrder(order)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedOrder(order);
                        }
                      }}
                      title="Click to view all order details & tracking"
                    >
                      <div className="min-order-header">
                        <div className="min-order-id-wrap">
                          <div className="flex items-center gap-2">
                            <strong className="text-xs font-semibold text-[#1C1917] group-hover:text-[#A67C2E] transition-colors">
                              {order.id}
                            </strong>
                            <span className="text-[10px] text-[#A67C2E] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                              View details →
                            </span>
                          </div>
                          <span className="min-order-date">Placed on {order.date}</span>
                        </div>
                        <span
                          className={`min-status-badge ${
                            order.status === 'Delivered'
                              ? 'delivered'
                              : order.status === 'In Transit'
                              ? 'transit'
                              : 'processing'
                          }`}
                        >
                          <span className="status-dot" />
                          {order.status}
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="min-order-items">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="min-item-row">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="min-item-img"
                              width={44}
                              height={44}
                            />
                            <div className="min-item-info">
                              <span className="min-item-title">{item.name}</span>
                              <span className="min-item-meta">
                                Qty: {item.quantity} {item.size > 1 ? `• ${item.size}g` : ''}
                              </span>
                            </div>
                            <span className="min-item-price">{money(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Summary */}
                      <div className="min-order-footer">
                        <div className="flex items-center gap-2 flex-wrap">
                          {order.trackingNumber && (
                            <span className="min-tracking-text">
                              Tracking: <code>{order.trackingNumber}</code>
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadInvoice(order, user);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#A67C2E] hover:text-[#8C6520] bg-[#FAF5EB] hover:bg-[#F5EFE6] border border-[#E3D7C5] px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                            title="Download Official Tax Invoice"
                          >
                            <Download className="w-3 h-3" />
                            <span>Invoice</span>
                          </button>
                          <span className="text-[11px] font-medium text-[#57534E] flex items-center gap-1 group-hover:text-[#1C1917] transition-colors">
                            Details <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-[#A67C2E]" />
                          </span>
                        </div>
                        <div className="min-order-total">
                          <span className="text-muted-foreground text-xs">Total:</span>
                          <strong className="text-sm font-semibold">{money(order.total)}</strong>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Order Details Modal */}
      {selectedOrder && (
        <CustomerOrderDetailsModal
          order={selectedOrder}
          user={user}
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </main>
  );
}
