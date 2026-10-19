import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Search,
  Copy,
  Check,
  Percent,
  Truck,
  Sparkles,
  Calendar,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Clock,
  ShieldCheck,
  Edit2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StudioPromoCode } from '@/lib/admin-data';
import { money } from '@/lib/store-data';

interface AdminPromocodesProps {
  promoCodes: StudioPromoCode[];
  onToggleStatus: (promoId: string) => void;
  onAddPromo: (promo: StudioPromoCode) => void;
  onUpdatePromo?: (promo: StudioPromoCode) => void;
  onDeletePromo: (promoId: string) => void;
}

export function AdminPromocodes({
  promoCodes,
  onToggleStatus,
  onAddPromo,
  onUpdatePromo,
  onDeletePromo,
}: AdminPromocodesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<StudioPromoCode | null>(null);
  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed' | 'free_shipping'>('percentage');
  const [discountValue, setDiscountValue] = useState(15);
  const [minOrder, setMinOrder] = useState(499);
  const [usageLimit, setUsageLimit] = useState(500);
  const [expiresAt, setExpiresAt] = useState('Dec 31, 2026');
  const [description, setDescription] = useState('');

  const filtered = promoCodes.filter((p) => {
    const matchesSearch =
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && p.isActive) ||
      (statusFilter === 'Inactive' && !p.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateCode = () => {
    const prefixes = ['CRYSTELLE', 'GLOW', 'AROMA', 'FESTIVE', 'STUDIO', 'BOTANICAL'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    setNewCode(`${randomPrefix}${randomNum}`);
  };

  const handleOpenCreate = () => {
    setEditingPromo(null);
    handleGenerateCode();
    setDiscountType('percentage');
    setDiscountValue(15);
    setMinOrder(499);
    setUsageLimit(500);
    setExpiresAt('Dec 31, 2026');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (promo: StudioPromoCode) => {
    setEditingPromo(promo);
    setNewCode(promo.code);
    setDiscountType(promo.discountType);
    setDiscountValue(promo.discountValue);
    setMinOrder(promo.minOrderAmount);
    setUsageLimit(promo.usageLimit);
    setExpiresAt(promo.expiresAt);
    setDescription(promo.description || '');
    setIsModalOpen(true);
  };

  const handleSubmitNewPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    if (editingPromo && onUpdatePromo) {
      onUpdatePromo({
        ...editingPromo,
        code: newCode.trim().toUpperCase(),
        discountType,
        discountValue: discountType === 'free_shipping' ? 0 : Number(discountValue),
        minOrderAmount: Number(minOrder) || 0,
        usageLimit: Number(usageLimit) || 100,
        expiresAt: expiresAt || 'No expiry',
        description:
          description ||
          (discountType === 'percentage'
            ? `${discountValue}% off order`
            : discountType === 'fixed'
            ? `₹${discountValue} instant savings`
            : 'Complimentary shipping promo'),
      });
    } else {
      const promo: StudioPromoCode = {
        id: `promo-${Date.now()}`,
        code: newCode.trim().toUpperCase(),
        discountType,
        discountValue: discountType === 'free_shipping' ? 0 : Number(discountValue),
        minOrderAmount: Number(minOrder) || 0,
        usageCount: 0,
        usageLimit: Number(usageLimit) || 100,
        expiresAt: expiresAt || 'No expiry',
        isActive: true,
        description:
          description ||
          (discountType === 'percentage'
            ? `${discountValue}% off order`
            : discountType === 'fixed'
            ? `₹${discountValue} instant savings`
            : 'Complimentary shipping promo'),
      };
      onAddPromo(promo);
    }

    setIsModalOpen(false);
    setNewCode('');
    setDescription('');
    setEditingPromo(null);
  };

  const activeCount = promoCodes.filter((p) => p.isActive).length;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#EAE4DC] p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-[#1C1917]">
              Promocodes & Discount Engine
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              {activeCount} Active
            </span>
          </div>
          <p className="text-xs text-[#78716C] mt-1">
            Create promotional coupon codes, percentage reductions, or complimentary delivery tokens.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-[#C59A44] hover:bg-[#B58934] text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-sm self-start sm:self-auto flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Promo Code
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-[#EAE4DC] p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
          <Input
            placeholder="Search promocodes by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] focus-visible:ring-[#C59A44]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {(['All', 'Active', 'Inactive'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                statusFilter === st
                  ? 'bg-[#C59A44] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#78716C] hover:text-[#1C1917] border border-[#EAE4DC]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-[#EAE4DC] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] text-[#78716C] border-b border-[#EAE4DC]">
                <th className="py-3 px-4 font-semibold">Coupon Code</th>
                <th className="py-3 px-4 font-semibold">Benefit / Reduction</th>
                <th className="py-3 px-4 font-semibold">Min. Order</th>
                <th className="py-3 px-4 font-semibold">Redemption Rate</th>
                <th className="py-3 px-4 font-semibold">Expiry Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE6]">
              {filtered.map((promo) => {
                const usagePercent = Math.min(
                  100,
                  Math.round((promo.usageCount / promo.usageLimit) * 100)
                );
                return (
                  <tr key={promo.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#1C1917] tracking-wider bg-[#F5F1EB] px-2.5 py-1 rounded-lg border border-[#E4DDD3]">
                          {promo.code}
                        </span>
                        <button
                          onClick={() => handleCopy(promo.code, promo.id)}
                          className="p-1 rounded-md text-[#A8A29E] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                          title="Copy Code"
                        >
                          {copiedId === promo.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-[#78716C] mt-1 max-w-xs">{promo.description}</p>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#1C1917]">
                      {promo.discountType === 'percentage'
                        ? `${promo.discountValue}% Off Entire Order`
                        : promo.discountType === 'fixed'
                        ? `Flat ${money(promo.discountValue)} Off`
                        : 'Free Insured Delivery'}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#57534E]">
                      {promo.minOrderAmount > 0 ? money(promo.minOrderAmount) : 'No Minimum'}
                    </td>

                    <td className="py-3.5 px-4 min-w-[130px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-[#78716C]">
                          <span>{promo.usageCount} used</span>
                          <span>{promo.usageLimit} max</span>
                        </div>
                        <div className="w-full bg-[#EAE4DC] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#C59A44] h-full rounded-full"
                            style={{ width: `${usagePercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#78716C] font-mono text-[11px]">
                      {promo.expiresAt}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onToggleStatus(promo.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                          promo.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            promo.isActive ? 'bg-emerald-500' : 'bg-stone-400'
                          }`}
                        />
                        {promo.isActive ? 'Active' : 'Paused'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => handleOpenEdit(promo)}
                          className="p-1.5 rounded-lg border border-[#EAE4DC] bg-[#FAF8F5] text-[#57534E] hover:text-[#1C1917] hover:bg-white transition-colors"
                          title="Edit Promocode"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#A67C2E]" />
                        </button>
                        <button
                          onClick={() => onDeletePromo(promo.id)}
                          className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete Promocode"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (Optimized for Phones) */}
      <div className="md:hidden space-y-3">
        {filtered.map((promo) => {
          const usagePercent = Math.min(
            100,
            Math.round((promo.usageCount / promo.usageLimit) * 100)
          );
          return (
            <div
              key={promo.id}
              className="bg-white rounded-2xl border border-[#EAE4DC] p-4 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-base text-[#1C1917] tracking-wider bg-[#F5F1EB] px-2.5 py-1 rounded-lg border border-[#E4DDD3]">
                    {promo.code}
                  </span>
                  <button
                    onClick={() => handleCopy(promo.code, promo.id)}
                    className="p-1.5 rounded-md bg-[#FAF8F5] text-[#78716C] hover:text-[#1C1917] border border-[#EAE4DC]"
                  >
                    {copiedId === promo.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onToggleStatus(promo.id)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                      promo.isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-stone-100 text-stone-500 border-stone-200'
                    }`}
                  >
                    {promo.isActive ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(promo)}
                    className="p-1.5 rounded-lg border border-[#EAE4DC] bg-[#FAF8F5] text-[#57534E] hover:bg-white"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#A67C2E]" />
                  </button>
                  <button
                    onClick={() => onDeletePromo(promo.id)}
                    className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-[#57534E] space-y-0.5">
                <p className="font-medium text-[#1C1917]">{promo.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#F0ECE6]">
                <div>
                  <span className="text-[#A8A29E] block text-[10px]">Benefit</span>
                  <span className="font-semibold text-[#A67C2E]">
                    {promo.discountType === 'percentage'
                      ? `${promo.discountValue}% Off`
                      : promo.discountType === 'fixed'
                      ? `₹${promo.discountValue} Off`
                      : 'Free Shipping'}
                  </span>
                </div>
                <div>
                  <span className="text-[#A8A29E] block text-[10px]">Min. Order</span>
                  <span className="font-semibold text-[#1C1917]">
                    {promo.minOrderAmount > 0 ? money(promo.minOrderAmount) : 'None'}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-[#78716C]">
                  <span>Used: {promo.usageCount} times</span>
                  <span>Limit: {promo.usageLimit}</span>
                </div>
                <div className="w-full bg-[#EAE4DC] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#C59A44] h-full rounded-full"
                    style={{ width: `${usagePercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE6] text-[11px] text-[#78716C]">
                <span>Expires: {promo.expiresAt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Promo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#EAE4DC] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-[#EAE4DC] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  {editingPromo ? <Edit2 className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1C1917]">
                    {editingPromo ? `Edit Promo Code: ${editingPromo.code}` : 'Create Studio Promo Code'}
                  </h3>
                  <p className="text-xs text-[#78716C]">
                    {editingPromo
                      ? 'Modify discount rate, spend threshold, and expiry'
                      : 'Configure a new coupon discount for shoppers'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingPromo(null);
                }}
                className="p-1.5 rounded-lg text-[#A8A29E] hover:text-[#1C1917] hover:bg-[#F0ECE6] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewPromo} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-[#44403C]">Coupon Code *</Label>
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="text-[11px] text-[#C59A44] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-Generate
                  </button>
                </div>
                <Input
                  required
                  placeholder="e.g. FESTIVE20"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="font-mono uppercase font-bold text-sm h-11 bg-[#FAF8F5] border-[#EAE4DC] focus-visible:ring-[#C59A44]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-[#44403C]">Discount Type</Label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full h-10 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] px-3 text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#C59A44]"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="fixed">Fixed Cart Reduction (₹)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>

                {discountType !== 'free_shipping' && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-[#44403C]">
                      Discount Value {discountType === 'percentage' ? '(%)' : '(₹)'}
                    </Label>
                    <Input
                      type="number"
                      required
                      min={1}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      className="h-10 bg-[#FAF8F5] border-[#EAE4DC] text-xs focus-visible:ring-[#C59A44]"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-[#44403C]">Min Order Amount (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="h-10 bg-[#FAF8F5] border-[#EAE4DC] text-xs focus-visible:ring-[#C59A44]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-[#44403C]">Max Redemptions</Label>
                  <Input
                    type="number"
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="h-10 bg-[#FAF8F5] border-[#EAE4DC] text-xs focus-visible:ring-[#C59A44]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#44403C]">Expiry Schedule</Label>
                <Input
                  placeholder="e.g. Dec 31, 2026 or No expiry"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="h-10 bg-[#FAF8F5] border-[#EAE4DC] text-xs focus-visible:ring-[#C59A44]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#44403C]">Internal Description</Label>
                <Input
                  placeholder="e.g. Autumn promotional launch discount"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-10 bg-[#FAF8F5] border-[#EAE4DC] text-xs focus-visible:ring-[#C59A44]"
                />
              </div>

              <div className="pt-4 border-t border-[#EAE4DC] flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingPromo(null);
                  }}
                  className="text-xs text-[#78716C] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#C59A44] hover:bg-[#B58934] text-white font-semibold text-xs h-10 px-5 rounded-xl shadow-sm"
                >
                  {editingPromo ? 'Save Changes' : 'Publish Promo Code'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
