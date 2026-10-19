import React, { useState } from 'react';
import { X, Package, Truck, CheckCircle2, Copy, Printer, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudioOrder } from '@/lib/admin-data';
import { money } from '@/lib/store-data';

interface OrderDetailsModalProps {
  order: StudioOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: StudioOrder['status']) => void;
  onEditOrder?: (order: StudioOrder) => void;
  onDeleteOrder?: (orderId: string) => void;
}

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onEditOrder,
  onDeleteOrder,
}: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const [copied, setCopied] = useState(false);

  const handleCopyTracking = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = (status: StudioOrder['status']) => {
    switch (status) {
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Poured':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Dispatched':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-[#EAE4DC] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#EAE4DC] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#1C1917]">{order.orderNumber}</h2>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-[#78716C] mt-0.5">
                Placed {order.createdAt} • Paid via {order.paymentMethod}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A8A29E] hover:text-[#1C1917] hover:bg-[#F0ECE6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          {/* Quick Status Bar */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC]">
            <label className="text-xs font-semibold text-[#1C1917] block mb-2.5">
              Change Fulfillment Stage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Processing', 'Poured', 'Dispatched', 'Delivered'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(order.id, st)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center ${
                    order.status === st
                      ? 'bg-[#C59A44] text-white border-[#C59A44] font-semibold shadow-xs'
                      : 'bg-white text-[#57534E] border-[#EAE4DC] hover:text-[#1C1917] hover:bg-[#F5F2EC]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-[#EAE4DC] space-y-1.5 shadow-xs">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#A67C2E]">
                Customer Information
              </span>
              <p className="text-sm font-semibold text-[#1C1917]">{order.customerName}</p>
              <p className="text-xs text-[#78716C]">{order.customerEmail}</p>
              <p className="text-xs text-[#44403C]">Location: {order.customerCity}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#EAE4DC] space-y-1.5 shadow-xs">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#A67C2E]">
                Logistics & Dispatch
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#78716C]">Courier:</span>
                <span className="text-[#1C1917] font-medium">Bluedart Express</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#78716C]">Tracking:</span>
                <div className="flex items-center gap-1.5 font-mono text-[#A67C2E] font-medium">
                  <span>{order.trackingNumber || 'Pending'}</span>
                  {order.trackingNumber && (
                    <button
                      onClick={handleCopyTracking}
                      className="text-[#A8A29E] hover:text-[#1C1917]"
                      title="Copy Tracking ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              {copied && <span className="text-[10px] text-emerald-600 block">Copied to clipboard!</span>}
            </div>
          </div>

          {/* Order Items Table */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#1C1917]">Candles in this Order</span>
            <div className="divide-y divide-[#F0ECE6] rounded-2xl bg-white border border-[#EAE4DC] overflow-hidden shadow-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] flex items-center justify-center text-sm">
                      🕯️
                    </div>
                    <div>
                      <p className="font-semibold text-[#1C1917]">{item.name}</p>
                      <p className="text-[11px] text-[#78716C]">
                        {item.fragrance} • Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[#1C1917] font-medium">
                    {money(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#78716C]">
              <span>Subtotal</span>
              <span className="font-mono text-[#1C1917]">{money(order.totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#78716C]">
              <span>Insured Shipping</span>
              <span className="text-emerald-700 font-medium">Complimentary</span>
            </div>
            <div className="pt-2 border-t border-[#EAE4DC] flex items-center justify-between text-sm font-semibold text-[#1C1917]">
              <span>Total Paid</span>
              <span className="font-mono text-[#A67C2E] text-base">{money(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-[#EAE4DC] flex items-center justify-between bg-[#FAF8F5]">
          <span className="text-[11px] text-[#78716C]">INV-2026-{order.orderNumber.replace('#', '')}</span>
          <div className="flex items-center gap-2">
            {onEditOrder && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onEditOrder(order);
                }}
                className="text-xs border-[#EAE4DC] bg-white text-[#A67C2E] hover:bg-[#FAF8F5]"
              >
                <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
              </Button>
            )}
            {onDeleteOrder && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete order ${order.orderNumber}?`)) {
                    onDeleteOrder(order.id);
                    onClose();
                  }
                }}
                className="text-xs border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-xs border-[#EAE4DC] bg-white text-[#1C1917] hover:bg-[#FAF8F5]"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" /> Print
            </Button>
            <Button
              size="sm"
              onClick={onClose}
              className="bg-[#C59A44] hover:bg-[#B58934] text-white font-semibold text-xs rounded-xl"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
