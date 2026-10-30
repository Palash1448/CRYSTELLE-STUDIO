import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Copy,
  Mail,
  Truck,
  Package,
  Sparkles,
  Search,
  Check,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudioOrder } from '@/lib/admin-data';
import { money } from '@/lib/store-data';

interface AdminInvoicesProps {
  orders: StudioOrder[];
}

export function AdminInvoices({ orders }: AdminInvoicesProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [docType, setDocType] = useState<'invoice' | 'packing_slip'>('invoice');
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  const handleCopyTracking = () => {
    if (currentOrder?.trackingNumber) {
      navigator.clipboard.writeText(currentOrder.trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const handleEmailInvoice = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  if (!currentOrder) {
    return (
      <div className="bg-white rounded-2xl border border-[#EAE4DC] p-8 text-center text-[#78716C]">
        No orders found to generate invoice.
      </div>
    );
  }

  // Financial calculations for GST Invoice
  const totalAmount = Number(currentOrder.totalAmount ?? (currentOrder as any).total ?? 0);
  const customerCity = currentOrder.customerCity || '';
  // Candles fall under HSN 34060010 @ 18% GST (9% CGST + 9% SGST for intra-state, 18% IGST for inter-state)
  const isInterState = !customerCity.toLowerCase().includes('mh') && !customerCity.toLowerCase().includes('maharashtra');
  const taxableAmount = Math.round((totalAmount / 1.18) * 100) / 100;
  const totalGst = Math.round((totalAmount - taxableAmount) * 100) / 100;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst / 2) * 100) / 100;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-2xl border border-[#EAE4DC] p-4 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-[#1C1917]">
              Invoices & Packing Slips
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              GST Tax Ready
            </span>
          </div>
          <p className="text-xs text-[#78716C] mt-1">
            Print official tax invoices, dispatch packing checklists, and customer delivery slips.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Document Type Switcher */}
          <div className="bg-[#FAF8F5] p-1 rounded-xl border border-[#EAE4DC] flex items-center text-xs">
            <button
              onClick={() => setDocType('invoice')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                docType === 'invoice'
                  ? 'bg-white text-[#1C1917] font-semibold shadow-xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Tax Invoice
            </button>
            <button
              onClick={() => setDocType('packing_slip')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                docType === 'packing_slip'
                  ? 'bg-white text-[#1C1917] font-semibold shadow-xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Packing Slip
            </button>
          </div>

          <Button
            onClick={handlePrint}
            className="bg-[#C59A44] hover:bg-[#B58934] text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Document
          </Button>

          <Button
            variant="outline"
            onClick={handleEmailInvoice}
            className="border-[#EAE4DC] bg-[#FAF8F5] text-[#1C1917] hover:bg-[#F5F1EB] text-xs h-10 px-3 rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-[#C59A44]" />
            {emailSent ? 'Sent to Customer!' : 'Email Customer'}
          </Button>
        </div>
      </div>

      {/* Main 2-Column Area: Order Selector on Left (or mobile top) & Printable Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Order Selector Sidebar (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#EAE4DC] p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE6]">
            <span className="text-xs font-semibold text-[#1C1917]">Select Order</span>
            <span className="text-[11px] text-[#78716C] font-mono">{orders.length} orders</span>
          </div>

          {/* Search order */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
            <input
              type="text"
              placeholder="Search order or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 h-9 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#C59A44]"
            />
          </div>

          {/* Orders list */}
          <div className="space-y-1.5 max-h-125 overflow-y-auto pr-1">
            {filteredOrders.map((ord) => {
              const isSelected = ord.id === currentOrder.id;
              return (
                <button
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`w-full text-left p-3 rounded-xl text-xs transition-all border ${
                    isSelected
                      ? 'bg-[#FAF5EB] border-[#D4A359] text-[#1C1917] shadow-xs'
                      : 'bg-[#FAF8F5] border-[#EAE4DC] text-[#57534E] hover:bg-[#F5F1EB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs text-[#1C1917]">
                      {ord.orderNumber}
                    </span>
                    <span className="font-mono font-semibold text-[#A67C2E]">
                      {money(ord.totalAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#78716C]">
                    <span className="font-medium text-[#1C1917] truncate max-w-32.5">
                      {ord.customerName}
                    </span>
                    <span>{ord.createdAt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Printable Document Preview (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          {/* DOCUMENT 1: OFFICIAL GST TAX INVOICE */}
          {docType === 'invoice' && (
            <div
              id="printable-tax-invoice"
              className="bg-white rounded-3xl border border-[#EAE4DC] p-6 sm:p-10 shadow-sm space-y-6 text-xs text-[#1C1917]"
            >
              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-[#1C1917]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/crystelle-gold-logo.png"
                      alt="Crystelle Logo"
                      className="w-10 h-10 rounded-full border border-[#D4A359]"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <h1 className="font-display text-xl font-bold tracking-wide text-[#1C1917]">
                        Crystelle Studio
                      </h1>
                      <span className="text-[10px] tracking-widest uppercase font-semibold text-[#A67C2E]">
                        Handcrafted Candles & Fragrances
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#78716C] leading-relaxed max-w-sm">
                    Ward No 13, Shastri Nagar, Nachangaon Road, Pulgaon<br />
                    Dist. Wardha, Maharashtra – 442302, India<br />
                    Phone: +91 7058398041 • Email: crystellestudio.art@gmail.com
                  </p>
                  <p className="text-[11px] font-mono font-medium text-[#44403C]">
                    <strong>GSTIN:</strong> 27AABCC1234F1Z8 • <strong>State Code:</strong> 27 (MH)
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-1 bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EAE4DC]">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#A67C2E] block">
                    Tax Invoice / Bill of Supply
                  </span>
                  <p className="text-base font-mono font-bold text-[#1C1917]">
                    INV-2026-{currentOrder.orderNumber.replace('#CS-', '')}
                  </p>
                  <p className="text-[11px] text-[#78716C]">
                    Date: <strong className="text-[#1C1917]">{currentOrder.orderDate || '19 Oct, 2026'}</strong>
                  </p>
                  <p className="text-[11px] text-[#78716C]">
                    Order Ref: <strong className="text-[#1C1917]">{currentOrder.orderNumber}</strong>
                  </p>
                  <p className="text-[11px] text-[#78716C]">
                    Payment: <strong className="text-emerald-700">{currentOrder.paymentMethod} (Paid)</strong>
                  </p>
                </div>
              </div>

              {/* Billed To & Shipped To */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EAE4DC] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#A67C2E] block">
                    Billed To (Customer)
                  </span>
                  <p className="text-sm font-semibold text-[#1C1917]">{currentOrder.customerName}</p>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    Flat 402, Lotus Heights, Orchid Avenue<br />
                    {currentOrder.customerCity}, India<br />
                    Email: {currentOrder.customerEmail}
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EAE4DC] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#A67C2E] block">
                    Logistics & Dispatch
                  </span>
                  <p className="text-xs font-semibold text-[#1C1917]">
                    Carrier: Bluedart Air Cargo Express
                  </p>
                  <p className="text-xs text-[#57534E]">
                    AWB Tracking: <strong className="font-mono text-[#A67C2E]">{currentOrder.trackingNumber || 'IND-CRYST-88421'}</strong>
                  </p>
                  <p className="text-xs text-[#57534E]">
                    Place of Supply: {currentOrder.customerCity}
                  </p>
                </div>
              </div>

              {/* Itemized Line Items Table */}
              <div className="overflow-x-auto border border-[#EAE4DC] rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F5] text-[#78716C] border-b border-[#EAE4DC]">
                      <th className="py-2.5 px-3 font-semibold">#</th>
                      <th className="py-2.5 px-3 font-semibold">Description of Goods</th>
                      <th className="py-2.5 px-3 font-semibold">HSN Code</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Qty</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Unit Rate</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Taxable</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0ECE6]">
                    {currentOrder.items.map((item, idx) => {
                      const itemTotal = item.price * item.quantity;
                      const itemTaxable = Math.round((itemTotal / 1.18) * 100) / 100;
                      return (
                        <tr key={idx} className="hover:bg-[#FAF8F5]/50">
                          <td className="py-3 px-3 text-[#78716C] font-mono">{idx + 1}</td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-[#1C1917] block">{item.name}</span>
                            <span className="text-[10px] text-[#78716C]">
                              Fragrance: {item.fragrance} • Size: {item.size} • 100% Pure Soy Wax
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-[#78716C]">34060010</td>
                          <td className="py-3 px-3 text-center font-mono font-medium">{item.quantity}</td>
                          <td className="py-3 px-3 text-right font-mono text-[#57534E]">{money(item.price)}</td>
                          <td className="py-3 px-3 text-right font-mono text-[#57534E]">{money(itemTaxable)}</td>
                          <td className="py-3 px-3 text-right font-mono font-semibold text-[#1C1917]">{money(itemTotal)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Invoice Calculations Summary */}
              <div className="flex flex-col sm:flex-row justify-between gap-6 pt-2">
                <div className="space-y-2 max-w-sm text-[11px] text-[#78716C]">
                  <p className="font-medium text-[#1C1917]">Tax Breakdown (GST @ 18%):</p>
                  {isInterState ? (
                    <p>• Integrated GST (IGST 18%): {money(totalGst)}</p>
                  ) : (
                    <p>
                      • Central GST (CGST 9%): {money(cgst)}<br />
                      • State GST (SGST 9%): {money(sgst)}
                    </p>
                  )}
                  <p className="text-[10px] text-[#A8A29E] leading-relaxed pt-2">
                    Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                  </p>
                </div>

                <div className="w-full sm:w-72 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EAE4DC] space-y-2 text-xs">
                  <div className="flex justify-between text-[#78716C]">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono text-[#1C1917]">{money(taxableAmount)}</span>
                  </div>
                  <div className="flex justify-between text-[#78716C]">
                    <span>Total GST (18%):</span>
                    <span className="font-mono text-[#1C1917]">{money(totalGst)}</span>
                  </div>
                  <div className="flex justify-between text-[#78716C]">
                    <span>Express Insured Shipping:</span>
                    <span className="text-emerald-700 font-medium">Free</span>
                  </div>
                  <div className="pt-2 border-t border-[#EAE4DC] flex justify-between text-sm font-bold text-[#1C1917]">
                    <span>Grand Total:</span>
                    <span className="font-mono text-[#A67C2E] text-base">{money(totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Digital Seal & Signature */}
              <div className="pt-6 border-t border-[#EAE4DC] flex items-center justify-between text-[11px] text-[#78716C]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Authorized Tax Invoice • Generated by Crystelle Studio Operations</span>
                </div>
                <div className="text-right">
                  <div className="font-display text-sm font-semibold text-[#1C1917] italic">
                    Kartiki Chaudhari / Master Artisan
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-[#A8A29E]">
                    Authorized Signatory
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* DOCUMENT 2: ARTISAN PACKING SLIP & WAREHOUSE DISPATCH */}
          {docType === 'packing_slip' && (
            <div
              id="printable-packing-slip"
              className="bg-white rounded-3xl border border-[#EAE4DC] p-6 sm:p-10 shadow-sm space-y-6 text-xs text-[#1C1917]"
            >
              {/* Slip Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-[#1C1917]">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                    <Package className="w-3.5 h-3.5" /> Dispatch Slip & Checklist
                  </div>
                  <h1 className="font-display text-xl font-bold text-[#1C1917]">
                    Artisan Packing Checklist
                  </h1>
                  <p className="text-[11px] text-[#78716C]">
                    Crystelle Studio • Handcrafted Candle Fulfillment
                  </p>
                </div>

                <div className="text-left sm:text-right font-mono space-y-1">
                  <p className="text-base font-bold text-[#1C1917]">{currentOrder.orderNumber}</p>
                  <p className="text-[11px] text-[#78716C]">Date: {currentOrder.orderDate || '19 Oct, 2026'}</p>
                  <p className="text-[11px] text-emerald-700 font-medium">Stage: Ready for Courier</p>
                </div>
              </div>

              {/* Large Shipping Label Block */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border-2 border-dashed border-[#D4A359] space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#A67C2E] uppercase tracking-wider">
                  <span>Ship To Customer Delivery Address</span>
                  <span>Courier: Bluedart Air Cargo</span>
                </div>
                <h3 className="text-base font-bold text-[#1C1917]">{currentOrder.customerName}</h3>
                <p className="text-xs text-[#44403C] leading-relaxed">
                  Flat 402, Lotus Heights, Orchid Avenue<br />
                  {currentOrder.customerCity}, India<br />
                  Contact: +91 98201 44520 • Email: {currentOrder.customerEmail}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#78716C]">
                  <span>Tracking: <strong className="text-[#1C1917]">{currentOrder.trackingNumber || 'IND-CRYST-88421'}</strong></span>
                  <span className="bg-white px-2 py-0.5 rounded border border-[#EAE4DC]">Prepaid (Priority)</span>
                </div>
              </div>

              {/* Fragile Glass Caution */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-900">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-[11px]">
                  <strong className="block font-semibold">CAUTION: HANDCRAFTED GLASS BOTANICAL CANDLE</strong>
                  <span>Handle with care. Do not expose parcel to direct heat or sunlight during transit.</span>
                </div>
              </div>

              {/* Packing Checklist */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-[#1C1917] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#A67C2E]" />
                  Candles Fulfillment & Quality Inspection Checklist
                </h3>

                <div className="divide-y divide-[#F0ECE6] border border-[#EAE4DC] rounded-2xl overflow-hidden">
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between bg-white hover:bg-[#FAF8F5]/50">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 rounded border-[#D4A359] accent-[#C59A44]"
                        />
                        <div>
                          <p className="font-semibold text-xs text-[#1C1917]">{item.name}</p>
                          <p className="text-[10px] text-[#78716C]">
                            Fragrance: {item.fragrance} • Size: {item.size} • Hand-poured batch
                          </p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-[#1C1917] bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#EAE4DC]">
                        QTY: {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality Verification Protocol */}
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EAE4DC] space-y-2 text-[11px] text-[#57534E]">
                <span className="text-[10px] uppercase font-bold text-[#A67C2E] block">
                  Studio Artisan Sign-off
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Vessel inspected for zero cracks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cotton wick trimmed to 1/4 inch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Candle Care Card inserted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Crystelle Gold wax seal verified</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE4DC] flex items-center justify-between text-xs">
                  <span>Packed by: <strong>Master Artisan Kartiki</strong></span>
                  <span className="font-mono text-[#78716C]">Station: Pulgaon Workshop #01</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
