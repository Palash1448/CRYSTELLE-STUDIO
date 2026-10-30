import React, { useState } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Download,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StudioCustomer } from '@/lib/admin-data';
import { money } from '@/lib/store-data';

interface AdminCustomersProps {
  customers: StudioCustomer[];
  onOpenAddCustomer?: () => void;
  onEditCustomer?: (customer: StudioCustomer) => void;
  onDeleteCustomer?: (customerId: string) => void;
}

export function AdminCustomers({
  customers,
  onOpenAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
}: AdminCustomersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customerToDelete, setCustomerToDelete] = useState<StudioCustomer | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTierBadge = (tier: StudioCustomer['tier']) => {
    switch (tier) {
      case 'VIP Gold':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'VIP Silver':
        return 'bg-stone-100 text-stone-700 border-stone-200';
      case 'Artisan Collector':
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  const confirmDelete = () => {
    if (customerToDelete && onDeleteCustomer) {
      onDeleteCustomer(customerToDelete.id);
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#EAE4DC] p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-[#1C1917]">
              Customer Directory & VIP Collectors
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
              {customers.length} Verified Buyers
            </span>
          </div>
          <p className="text-xs text-[#78716C] mt-1">
            View customer profiles, lifetime spending, and loyalty membership tiers.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenAddCustomer && (
            <Button
              onClick={onOpenAddCustomer}
              className="bg-[#C59A44] hover:bg-[#B58934] text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Customer
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => alert('Exporting customer contact list to CSV...')}
            className="border-[#EAE4DC] bg-[#FAF8F5] text-[#1C1917] hover:bg-[#F5F1EB] text-xs h-10 px-3.5 rounded-xl shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-[#C59A44]" /> Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-[#EAE4DC] p-3 sm:p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
          <Input
            placeholder="Search customers by name, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] focus-visible:ring-[#C59A44]"
          />
        </div>
      </div>

      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden md:block bg-white rounded-2xl border border-[#EAE4DC] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] text-[#78716C] border-b border-[#EAE4DC]">
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Contact Details</th>
                <th className="py-3 px-4 font-semibold">City</th>
                <th className="py-3 px-4 font-semibold">Orders Count</th>
                <th className="py-3 px-4 font-semibold">Lifetime Spend</th>
                <th className="py-3 px-4 font-semibold">Membership Tier</th>
                <th className="py-3 px-4 font-semibold">Last Purchase</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE6]">
              {filtered.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FAF5EB] border border-[#E3D7C5] flex items-center justify-center font-bold text-xs text-[#A67C2E]">
                        {cust.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-[#1C1917]">{cust.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#57534E]">
                    <p className="flex items-center gap-1.5 text-xs text-[#1C1917]">
                      <Mail className="w-3 h-3 text-[#A8A29E]" /> {cust.email}
                    </p>
                    <p className="flex items-center gap-1.5 text-[11px] text-[#78716C] mt-0.5">
                      <Phone className="w-3 h-3 text-[#A8A29E]" /> {cust.phone}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-[#57534E]">
                    <span className="flex items-center gap-1 text-xs">
                      <MapPin className="w-3 h-3 text-[#A8A29E]" /> {cust.city}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-[#1C1917]">
                    {cust.ordersCount} orders
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#A67C2E]">
                    {money(cust.totalSpent)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full border inline-block font-medium ${getTierBadge(
                        cust.tier
                      )}`}
                    >
                      {cust.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#78716C] font-medium">
                    {cust.lastOrderDate}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => onEditCustomer && onEditCustomer(cust)}
                        className="p-1.5 rounded-lg border border-[#EAE4DC] bg-[#FAF8F5] text-[#57534E] hover:text-[#1C1917] hover:bg-white transition-colors"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#A67C2E]" />
                      </button>
                      <button
                        onClick={() => setCustomerToDelete(cust)}
                        className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (Optimized for Phones) */}
      <div className="md:hidden space-y-3">
        {filtered.map((cust) => (
          <div
            key={cust.id}
            className="bg-white rounded-2xl border border-[#EAE4DC] p-4 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#FAF5EB] border border-[#E3D7C5] flex items-center justify-center font-bold text-xs text-[#A67C2E]">
                  {cust.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1C1917]">{cust.name}</p>
                  <p className="text-[11px] text-[#78716C] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {cust.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getTierBadge(
                    cust.tier
                  )}`}
                >
                  {cust.tier}
                </span>
                <button
                  onClick={() => onEditCustomer && onEditCustomer(cust)}
                  className="p-1.5 rounded-lg border border-[#EAE4DC] bg-[#FAF8F5] text-[#57534E] hover:bg-white"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#A67C2E]" />
                </button>
                <button
                  onClick={() => setCustomerToDelete(cust)}
                  className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-xs space-y-1 text-[#57534E] pt-1">
              <p className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-[#A8A29E]" /> {cust.email}
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-[#A8A29E]" /> {cust.phone}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE6] text-xs">
              <div>
                <span className="text-[#A8A29E] block text-[10px]">Total Purchases</span>
                <span className="font-semibold text-[#1C1917]">{cust.ordersCount} orders</span>
              </div>
              <div className="text-right">
                <span className="text-[#A8A29E] block text-[10px]">Lifetime Spend</span>
                <span className="font-mono font-semibold text-[#A67C2E]">
                  {money(cust.totalSpent)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1C1917]">Delete Customer?</h3>
                <p className="text-xs text-[#78716C]">
                  Are you sure you want to remove <span className="font-semibold text-[#1C1917]">{customerToDelete.name}</span> from the directory?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0ECE6]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCustomerToDelete(null)}
                className="text-xs text-[#78716C]"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
