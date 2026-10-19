import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Trash2, Check, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StudioOrder } from '@/lib/admin-data';
import { products, money } from '@/lib/store-data';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderToEdit?: StudioOrder | null;
  onSaveOrder: (order: StudioOrder) => void;
}

export function OrderFormModal({
  isOpen,
  onClose,
  orderToEdit,
  onSaveOrder,
}: OrderFormModalProps) {
  const isEditing = Boolean(orderToEdit);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<StudioOrder['paymentMethod']>('UPI');
  const [paymentStatus, setPaymentStatus] = useState<StudioOrder['paymentStatus']>('Paid');
  const [status, setStatus] = useState<StudioOrder['status']>('Processing');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0] || '2026-10-19');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Items
  const [items, setItems] = useState<StudioOrder['items']>([
    {
      name: products[0]?.name || 'Amber & Cashmere Glow',
      fragrance: products[0]?.fragrance || 'Amber',
      quantity: 1,
      price: products[0]?.price || 499,
      size: '220g Glass Jar',
    },
  ]);

  useEffect(() => {
    if (orderToEdit) {
      setCustomerName(orderToEdit.customerName || '');
      setCustomerEmail(orderToEdit.customerEmail || '');
      setCustomerCity(orderToEdit.customerCity || '');
      setPaymentMethod(orderToEdit.paymentMethod || 'UPI');
      setPaymentStatus(orderToEdit.paymentStatus || 'Paid');
      setStatus(orderToEdit.status || 'Processing');
      setOrderDate(orderToEdit.orderDate || new Date().toISOString().split('T')[0] || '2026-10-19');
      setTrackingNumber(orderToEdit.trackingNumber || '');
      setItems(
        orderToEdit.items && orderToEdit.items.length
          ? orderToEdit.items
          : [
              {
                name: 'Amber & Cashmere Glow',
                fragrance: 'Amber',
                quantity: 1,
                price: 499,
                size: '220g Glass Jar',
              },
            ]
      );
    } else {
      setCustomerName('');
      setCustomerEmail('');
      setCustomerCity('');
      setPaymentMethod('UPI');
      setPaymentStatus('Paid');
      setStatus('Processing');
      setOrderDate(new Date().toISOString().split('T')[0] || '2026-10-19');
      setTrackingNumber('');
      setItems([
        {
          name: products[0]?.name || 'Amber & Cashmere Glow',
          fragrance: products[0]?.fragrance || 'Amber',
          quantity: 1,
          price: products[0]?.price || 499,
          size: '220g Glass Jar',
        },
      ]);
    }
  }, [orderToEdit, isOpen]);

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleAddItem = () => {
    const nextProd = products[items.length % products.length] || products[0];
    setItems([
      ...items,
      {
        name: nextProd?.name || 'French Lavender Velvet',
        fragrance: nextProd?.fragrance || 'Lavender',
        quantity: 1,
        price: nextProd?.price || 499,
        size: '200g Jar',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, val: any) => {
    setItems(
      items.map((it, i) => {
        if (i !== index) return it;
        if (field === 'productSelect') {
          const selected = products.find((p) => p.name === val);
          if (selected) {
            return {
              ...it,
              name: selected.name,
              fragrance: selected.fragrance,
              price: selected.price,
            };
          }
        }
        return { ...it, [field]: val };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    if (isEditing && orderToEdit) {
      onSaveOrder({
        ...orderToEdit,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || 'customer@example.com',
        customerCity: customerCity.trim() || 'Mumbai, MH',
        paymentMethod,
        paymentStatus,
        status,
        orderDate,
        trackingNumber: trackingNumber.trim() || orderToEdit.trackingNumber,
        items,
        totalAmount,
      });
    } else {
      const orderNumber = '#CS-' + Math.floor(10000 + Math.random() * 90000);
      const newOrder: StudioOrder = {
        id: 'ord-' + Date.now().toString().slice(-6),
        orderNumber,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || 'customer@example.com',
        customerCity: customerCity.trim() || 'Mumbai, MH',
        paymentMethod,
        paymentStatus,
        status,
        createdAt: 'Just now',
        orderDate,
        trackingNumber: trackingNumber.trim() || `DELHIVERY-${Math.floor(100000 + Math.random() * 900000)}`,
        items,
        totalAmount,
      };
      onSaveOrder(newOrder);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-[#EAE4DC] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#EAE4DC] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              {isEditing ? <Edit2 className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1C1917]">
                {isEditing && orderToEdit ? `Edit Order: ${orderToEdit.orderNumber}` : 'Create Manual Order'}
              </h2>
              <p className="text-xs text-[#78716C]">
                {isEditing
                  ? 'Update customer details, items, or fulfillment status'
                  : 'Record a studio walk-in, WhatsApp, or telephone patron order'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Customer Name *</Label>
              <Input
                required
                placeholder="Full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Email Address</Label>
              <Input
                type="email"
                placeholder="patron@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Delivery City / State</Label>
              <Input
                placeholder="e.g. Pune, MH"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>
          </div>

          {/* Payment & Status */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Order Date</Label>
              <Input
                type="date"
                required
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Payment Method</Label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as StudioOrder['paymentMethod'])}
                className="w-full h-10 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] px-3 text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#C59A44]"
              >
                <option value="UPI">UPI (GooglePay/PhonePe)</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="NetBanking">NetBanking</option>
                <option value="COD">Cash on Delivery</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Payment Status</Label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as StudioOrder['paymentStatus'])}
                className="w-full h-10 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] px-3 text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#C59A44]"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Fulfillment Stage</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StudioOrder['status'])}
                className="w-full h-10 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] px-3 text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#C59A44]"
              >
                <option value="Processing">Processing</option>
                <option value="Poured">Poured</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-[#44403C]">Tracking Number (Optional)</Label>
            <Input
              placeholder="e.g. DELHIVERY-778210"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
            />
          </div>

          {/* Candle Items Selection */}
          <div className="space-y-2 pt-2 border-t border-[#F0ECE6]">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-[#1C1917]">Order Items</Label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-[11px] font-medium text-[#A67C2E] hover:text-[#845E1B] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Candle
              </button>
            </div>

            <div className="space-y-2">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                >
                  <div className="flex-1">
                    <select
                      value={it.name}
                      onChange={(e) => handleItemChange(idx, 'productSelect', e.target.value)}
                      className="w-full h-9 rounded-xl bg-white border border-[#EAE4DC] px-2.5 text-xs text-[#1C1917] focus:outline-none"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.fragrance} - ₹{p.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-20">
                      <Input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) =>
                          handleItemChange(idx, 'quantity', Math.max(1, Number(e.target.value)))
                        }
                        className="bg-white border-[#EAE4DC] text-xs text-[#1C1917] h-9 text-center"
                        title="Quantity"
                      />
                    </div>

                    <div className="w-24 text-right font-mono font-semibold text-xs text-[#1C1917]">
                      {money(it.price * it.quantity)}
                    </div>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total & Summary */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#A67C2E] block">
                Calculated Total
              </span>
              <span className="text-xs text-[#78716C]">{items.length} candle items</span>
            </div>
            <span className="font-mono font-bold text-lg text-[#1C1917]">
              {money(totalAmount)}
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#EAE4DC] flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-xs text-[#78716C] hover:bg-[#FAF8F5]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#C59A44] hover:bg-[#B58934] text-white font-semibold text-xs px-5 h-10 rounded-xl shadow-sm"
            >
              <Check className="w-3.5 h-3.5 mr-1.5" />
              {isEditing ? 'Save Changes' : 'Create Order'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
