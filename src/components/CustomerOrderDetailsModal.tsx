import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Printer,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  ExternalLink,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Order, type UserProfile } from '@/lib/auth';
import { money } from '@/lib/store-data';
import { downloadInvoice } from '@/lib/invoice';

interface CustomerOrderDetailsModalProps {
  order: Order | null;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerOrderDetailsModal({
  order,
  user,
  isOpen,
  onClose,
}: CustomerOrderDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  // Close on Escape & Lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const handleCopyTracking = () => {
    const code = order.trackingNumber || 'IND-CRYST-88419';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Fallback calculations if not recorded on historical sample orders
  const calculatedSubtotal =
    order.subtotal ??
    order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const calculatedShipping =
    order.shippingFee ?? (order.total > calculatedSubtotal ? order.total - calculatedSubtotal : 0);
  const address = order.shippingAddress || user.address;

  // Timeline stage tracking
  const isDelivered = order.status === 'Delivered';
  const isInTransit = order.status === 'In Transit' || isDelivered;
  const isProcessing = true; // Confirmed order is always at least processing

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-details-title"
    >
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#EAE4DC] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 font-sans">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#EAE4DC] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF5EB] border border-[#E3D7C5] flex items-center justify-center text-[#A67C2E] shadow-2xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="order-details-title"
                  className="font-display text-lg font-semibold text-[#1C1917] tracking-tight"
                >
                  Order {order.id}
                </h2>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isDelivered
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : order.status === 'In Transit'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-[#78716C] mt-0.5">
                Placed on {order.date} • {order.items.length}{' '}
                {order.items.length === 1 ? 'candle' : 'candles'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadInvoice(order, user)}
              className="bg-[#FAF5EB] border-[#E3D7C5] text-[#A67C2E] hover:bg-[#F5EFE6] hover:text-[#8C6520] text-xs h-8 px-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer font-medium shadow-2xs"
              title="Download Tax Invoice"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Invoice</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F1EB] transition-colors cursor-pointer"
              aria-label="Close order details"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          {/* Order Delivery & Fulfillment Timeline */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE4DC] shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#1C1917] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#A67C2E]" />
                Delivery Status & Tracking
              </span>
              {order.trackingNumber && (
                <button
                  type="button"
                  onClick={handleCopyTracking}
                  className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#78716C] hover:text-[#1C1917] bg-[#FAF8F5] border border-[#EAE4DC] px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  title="Click to copy tracking code"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#A8A29E]" />
                      <span>{order.trackingNumber}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {/* Step 1 */}
              <div className="space-y-1.5 text-center">
                <div
                  className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center border text-[11px] font-bold ${
                    isProcessing
                      ? 'bg-[#FAF5EB] text-[#A67C2E] border-[#D4A359]'
                      : 'bg-[#F5F1EB] text-[#A8A29E] border-[#EAE4DC]'
                  }`}
                >
                  ✓
                </div>
                <p className="font-medium text-[11px] text-[#1C1917]">Order Placed</p>
                <span className="text-[10px] text-[#78716C] block leading-tight">{order.date}</span>
              </div>

              {/* Step 2 */}
              <div className="space-y-1.5 text-center">
                <div
                  className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center border text-[11px] font-bold ${
                    isProcessing
                      ? 'bg-[#FAF5EB] text-[#A67C2E] border-[#D4A359]'
                      : 'bg-[#F5F1EB] text-[#A8A29E] border-[#EAE4DC]'
                  }`}
                >
                  ✓
                </div>
                <p className="font-medium text-[11px] text-[#1C1917]">Handcrafted</p>
                <span className="text-[10px] text-[#78716C] block leading-tight">Wax Cured</span>
              </div>

              {/* Step 3 */}
              <div className="space-y-1.5 text-center">
                <div
                  className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center border text-[11px] font-bold ${
                    isInTransit
                      ? 'bg-[#FAF5EB] text-[#A67C2E] border-[#D4A359]'
                      : 'bg-[#FAF8F5] text-[#A8A29E] border-[#EAE4DC]'
                  }`}
                >
                  {isInTransit ? '✓' : '3'}
                </div>
                <p
                  className={`font-medium text-[11px] ${
                    isInTransit ? 'text-[#1C1917]' : 'text-[#A8A29E]'
                  }`}
                >
                  In Transit
                </p>
                <span className="text-[10px] text-[#78716C] block leading-tight">
                  {isInTransit ? 'Express Courier' : 'Packaging'}
                </span>
              </div>

              {/* Step 4 */}
              <div className="space-y-1.5 text-center">
                <div
                  className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center border text-[11px] font-bold ${
                    isDelivered
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-[#FAF8F5] text-[#A8A29E] border-[#EAE4DC]'
                  }`}
                >
                  {isDelivered ? '✓' : '4'}
                </div>
                <p
                  className={`font-medium text-[11px] ${
                    isDelivered ? 'text-emerald-800' : 'text-[#A8A29E]'
                  }`}
                >
                  Delivered
                </p>
                <span className="text-[10px] text-[#78716C] block leading-tight">
                  {isDelivered ? 'Safely Received' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Items In Order */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE4DC] shadow-2xs space-y-3">
            <h3 className="font-semibold text-xs text-[#1C1917] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A67C2E]" />
              Items in this Order ({order.items.length})
            </h3>

            <div className="space-y-2.5 divide-y divide-[#F0ECE6]">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-2.5 first:pt-0 flex items-center gap-3.5">
                  <Link
                    to="/product/$slug"
                    params={{ slug: item.id }}
                    onClick={onClose}
                    className="w-14 h-15 rounded-xl overflow-hidden border border-[#EAE4DC] bg-[#FAF8F5] shrink-0 block hover:border-[#D4A359] transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/hero-candle.jpg';
                      }}
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to="/product/$slug"
                      params={{ slug: item.id }}
                      onClick={onClose}
                      className="font-semibold text-xs text-[#1C1917] hover:text-[#A67C2E] transition-colors truncate block"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#78716C]">
                      <span>Quantity: {item.quantity}</span>
                      <span>•</span>
                      <span>{item.size > 1 ? `${item.size}g Candle` : 'Set / Accessory'}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-semibold text-xs text-[#1C1917]">
                      {money(item.price * item.quantity)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="block text-[10px] text-[#A8A29E] font-mono">
                        ({money(item.price)} each)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Two-Column Info: Delivery Address & Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Delivery Address Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#EAE4DC] shadow-2xs space-y-2">
              <span className="font-semibold text-xs text-[#1C1917] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#A67C2E]" />
                Shipping Destination
              </span>
              <div className="text-[11px] text-[#57534E] space-y-0.5 leading-relaxed">
                <p className="font-semibold text-[#1C1917]">{user.fullName}</p>
                <p>{address.street || 'Address on file'}</p>
                <p>
                  {address.city}, {address.state} — {address.postalCode}
                </p>
                <p>{address.country || 'India'}</p>
                <p className="pt-1 text-[#78716C]">Phone: {user.phone}</p>
              </div>
            </div>

            {/* Payment & Courier Method */}
            <div className="p-4 rounded-2xl bg-white border border-[#EAE4DC] shadow-2xs space-y-2">
              <span className="font-semibold text-xs text-[#1C1917] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#A67C2E]" />
                Payment & Carrier
              </span>
              <div className="text-[11px] text-[#57534E] space-y-1 leading-relaxed">
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Method:</span>
                  <span className="font-medium text-[#1C1917]">
                    {order.paymentMethod || 'Prepaid (UPI / Cards)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Payment Status:</span>
                  <span className="font-medium text-emerald-700">
                    {order.paymentStatus || (isDelivered ? 'Paid & Verified' : 'Confirmed')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Carrier:</span>
                  <span className="font-medium text-[#1C1917]">Delhivery / Bluedart Express</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Customer Email:</span>
                  <span className="font-medium text-[#1C1917] truncate max-w-32">{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-4 rounded-2xl bg-white border border-[#EAE4DC] shadow-2xs space-y-2">
            <span className="font-semibold text-xs text-[#1C1917]">Order Financial Breakdown</span>
            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex justify-between text-[#78716C]">
                <span>Items Subtotal</span>
                <span className="font-mono text-[#1C1917]">{money(calculatedSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[#78716C]">
                <span>Delivery & Courier Fee</span>
                <span className="font-mono text-[#1C1917]">
                  {calculatedShipping === 0 ? (
                    <span className="text-emerald-700 font-semibold uppercase text-[10px]">
                      FREE
                    </span>
                  ) : (
                    money(calculatedShipping)
                  )}
                </span>
              </div>
              {order.discountAmount ? (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Special Discount {order.appliedDiscountCode ? `(${order.appliedDiscountCode})` : ''}</span>
                  <span className="font-mono">-{money(order.discountAmount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between pt-2 border-t border-[#F0ECE6] font-semibold text-sm text-[#1C1917]">
                <span>Total Amount Paid</span>
                <span className="font-mono text-base text-[#A67C2E]">{money(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#EAE4DC] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-[#78716C]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Artisan Batch Warranty • 100% Botanical Soy Wax</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => downloadInvoice(order, user)}
              className="text-xs h-9 rounded-xl border-[#EAE4DC] bg-[#FAF8F5] hover:bg-[#F5EFE6] text-[#A67C2E] font-medium cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1" /> Download Invoice
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs h-9 rounded-xl border-[#EAE4DC] hover:bg-[#FAF8F5] cursor-pointer"
            >
              <Link to="/contact" onClick={onClose}>
                <HelpCircle className="w-3.5 h-3.5 mr-1" /> Need Help?
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-[#1C1917] hover:bg-[#A67C2E] text-white text-xs h-9 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Link to="/shop" onClick={onClose}>
                Shop More <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
