import React, { useState, useEffect } from 'react';
import { X, User, Check, Sparkles, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StudioCustomer } from '@/lib/admin-data';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerToEdit?: StudioCustomer | null;
  onSaveCustomer: (customer: StudioCustomer) => void;
}

export function CustomerFormModal({
  isOpen,
  onClose,
  customerToEdit,
  onSaveCustomer,
}: CustomerFormModalProps) {
  const isEditing = Boolean(customerToEdit);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [tier, setTier] = useState<StudioCustomer['tier']>('Artisan Collector');

  useEffect(() => {
    if (customerToEdit) {
      setName(customerToEdit.name || '');
      setEmail(customerToEdit.email || '');
      setPhone(customerToEdit.phone || '');
      setCity(customerToEdit.city || '');
      setTier(customerToEdit.tier || 'Artisan Collector');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setCity('');
      setTier('Artisan Collector');
    }
  }, [customerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (isEditing && customerToEdit) {
      onSaveCustomer({
        ...customerToEdit,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '+91 98000 00000',
        city: city.trim() || 'Mumbai, MH',
        tier,
      });
    } else {
      const newCustomer: StudioCustomer = {
        id: 'cust-' + Date.now().toString().slice(-6),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '+91 98000 00000',
        city: city.trim() || 'Mumbai, MH',
        ordersCount: 0,
        totalSpent: 0,
        tier,
        lastOrderDate: 'Just registered',
      };
      onSaveCustomer(newCustomer);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-[#EAE4DC] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#EAE4DC] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              {isEditing ? <Edit2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1C1917]">
                {isEditing && customerToEdit ? `Edit Customer: ${customerToEdit.name}` : 'Add New Customer'}
              </h2>
              <p className="text-xs text-[#78716C]">
                {isEditing ? 'Update patron contact details and tier' : 'Register a patron profile'}
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-[#44403C]">Full Name *</Label>
            <Input
              required
              placeholder="e.g. Ananya Deshmukh"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Email Address *</Label>
              <Input
                type="email"
                required
                placeholder="patron@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Phone Number</Label>
              <Input
                placeholder="+91 98201 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">City & State</Label>
              <Input
                placeholder="e.g. Pune, Maharashtra"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Membership Tier</Label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as StudioCustomer['tier'])}
                className="w-full h-10 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] px-3 text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#C59A44]"
              >
                <option value="Artisan Collector">Artisan Collector</option>
                <option value="VIP Silver">VIP Silver</option>
                <option value="VIP Gold">VIP Gold</option>
              </select>
            </div>
          </div>

          {/* Actions */}
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
              {isEditing ? 'Save Customer' : 'Create Customer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
