import React, { useEffect, useRef } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  LockKeyhole,
  Truck,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products, money, getStoredProducts } from '@/lib/store-data';
import { useStore } from '@/components/storefront';

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, change, products: storeProducts } = useStore();
  const allProducts = storeProducts && storeProducts.length > 0 ? storeProducts : getStoredProducts();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const prevPathnameRef = useRef(pathname);

  // Automatically close cart drawer on route navigation
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      if (isCartOpen) {
        closeCart();
      }
    }
  }, [pathname, isCartOpen, closeCart]);

  // Close on Escape key and lock background scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const count = cart.reduce((n, p) => n + p.quantity, 0);

  const subtotal = cart.reduce((total, item) => {
    const p = allProducts.find((prod) => prod.id === item.id);
    if (!p) return total;
    const priceDelta = item.size === 100 ? -150 : item.size === 350 ? 200 : 0;
    return total + (p.price + priceDelta) * item.quantity;
  }, 0);

  // Prepaid shipping is included in the price (₹0). COD has customizable fee at checkout.
  const grandTotal = subtotal;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Bag"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={closeCart}
      />

      {/* Side-sliding Drawer Container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-8 z-50">
        <aside className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#EAE4DC] flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300 font-sans">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#EAE4DC] bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FAF5EB] border border-[#E3D7C5] flex items-center justify-center text-[#A67C2E]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-semibold text-lg text-[#1C1917] tracking-tight">
                    Your Shopping Bag
                  </h2>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FAF5EB] text-[#A67C2E] border border-[#E3D7C5] font-medium">
                    {count} {count === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <p className="text-[11px] text-[#78716C]">Hand-poured artisan candles</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={closeCart}
              className="w-8 h-8 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F1EB] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Free Shipping Included Notification */}
          <div className="px-4 sm:px-5 py-2.5 bg-[#FAF5EB] border-b border-[#EAE4DC] shrink-0 flex items-center justify-between text-xs text-[#57534E]">
            <div className="flex items-center gap-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-[#A67C2E]" />
              <span className="text-[#A67C2E] font-semibold">
                Prepaid Shipping Included • FREE Delivery
              </span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              ₹0 on UPI / Cards
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F5EFE6] border border-[#E3D7C5] flex items-center justify-center text-[#A67C2E] shadow-2xs">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-semibold text-xl text-[#1C1917]">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[#78716C] max-w-xs leading-relaxed">
                    Explore our botanical waxes and intoxicating scent bouquets to fill your sanctuary.
                  </p>
                </div>
                <Button
                  onClick={closeCart}
                  asChild
                  className="bg-[#1C1917] hover:bg-[#A67C2E] text-white text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <Link to="/shop">Explore All Candles</Link>
                </Button>
              </div>
            ) : (
              cart.map((item) => {
                const prod = allProducts.find((p) => p.id === item.id);
                if (!prod) return null;
                const priceDelta = item.size === 100 ? -150 : item.size === 350 ? 200 : 0;
                const unitPrice = prod.price + priceDelta;
                const lineTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="bg-white rounded-2xl border border-[#EAE4DC] p-3.5 shadow-2xs hover:border-[#D4A359]/40 transition-colors flex gap-3.5 items-center group"
                  >
                    <Link
                      to="/product/$slug"
                      params={{ slug: prod.id }}
                      onClick={closeCart}
                      className="w-18 h-20 rounded-xl overflow-hidden border border-[#EAE4DC] bg-[#FAF8F5] shrink-0 block"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/hero-candle.jpg';
                        }}
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            to="/product/$slug"
                            params={{ slug: prod.id }}
                            onClick={closeCart}
                            className="font-semibold text-xs text-[#1C1917] hover:text-[#A67C2E] transition-colors truncate block max-w-45"
                          >
                            {prod.name}
                          </Link>
                          <span className="text-[11px] text-[#A67C2E] font-medium">
                            {prod.type === '1 Set' ? '1 Set' : `${item.size}g Wax`} • {prod.category}
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => change(item.id, item.size, 0)}
                          className="h-7 w-7 rounded-lg text-[#A8A29E] hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                          title="Remove item"
                          aria-label={`Remove ${prod.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Compact Quantity Stepper */}
                        <div className="flex items-center border border-[#EAE4DC] rounded-lg bg-[#FAF8F5] h-7 px-1">
                          <button
                            type="button"
                            onClick={() => change(item.id, item.size, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center text-[#57534E] hover:text-[#1C1917] disabled:opacity-30 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-mono text-xs font-semibold text-[#1C1917]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => change(item.id, item.size, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="font-mono font-semibold text-xs text-[#1C1917]">
                            {money(lineTotal)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-[10px] text-[#A8A29E] font-mono">
                              ({money(unitPrice)} each)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-[#EAE4DC] space-y-3 shrink-0 shadow-lg">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#78716C]">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-[#1C1917]">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#78716C]">
                  <span>Shipping (Prepaid Orders)</span>
                  <span className="font-mono font-medium text-emerald-700 font-semibold uppercase text-[10px]">
                    FREE (Included in price)
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#F0ECE6] text-sm font-semibold text-[#1C1917]">
                  <span>Total (Prepaid)</span>
                  <span className="font-mono text-[#A67C2E] text-base">{money(grandTotal)}</span>
                </div>
              </div>

              {/* Main Checkout Button */}
              <Button
                asChild
                className="w-full h-11 bg-[#1C1917] hover:bg-[#A67C2E] text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Link to="/checkout" onClick={closeCart}>
                  <LockKeyhole className="w-3.5 h-3.5" />
                  Proceed to Checkout • {money(grandTotal)}
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </Button>

              {/* View Full Cart Page Link */}
              <Link
                to="/cart"
                onClick={closeCart}
                className="w-full py-2.5 text-center text-xs font-medium text-[#57534E] hover:text-[#1C1917] border border-[#EAE4DC] rounded-xl hover:bg-[#FAF8F5] transition-colors block cursor-pointer"
              >
                View Full Bag & Special Notes
              </Link>

              {/* Trust Tag */}
              <div className="pt-1 flex items-center justify-center gap-2 text-[10px] text-[#A8A29E]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>256-bit SSL Protected • Safe Fragile Courier Delivery</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
