import React, { useState } from 'react';
import { Settings, Sparkles, Save, Store, ShieldCheck, CheckCircle2, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { initialStoreSettings } from '@/lib/admin-data';

export function AdminSettings() {
  const [settings, setSettings] = useState(initialStoreSettings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Ready For Customization Callout Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-[#1A1816] to-[#141311] border border-amber-500/30 flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-[#EDE8E1]">
                Store Settings & Studio Operations Hub Active
              </h3>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                Customizable
              </span>
            </div>
            <p className="text-[11px] text-[#9E978E] mt-0.5">
              Control studio identity, announcement banners, GST tax rate, and shipping fee rules. Tell me what payment gateway settings or invoice formats you would like added later!
            </p>
          </div>
        </div>

        {saved && (
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Preferences saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Studio Identity Card */}
        <div className="p-6 rounded-xl bg-[#141311] border border-[#262320] space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-[#262320]">
            <Store className="w-4 h-4 text-[#D4A359]" />
            <h3 className="text-xs font-semibold text-[#EDE8E1]">Studio & Brand Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#C8C2BA]">Artisan Studio Name</Label>
              <Input
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#C8C2BA]">Brand Tagline</Label>
              <Input
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#C8C2BA]">Official Support Email</Label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#C8C2BA]">Workshop Phone</Label>
              <Input
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-[#C8C2BA]">Studio Workshop Address</Label>
            <Input
              value={settings.workshopLocation}
              onChange={(e) => setSettings({ ...settings, workshopLocation: e.target.value })}
              className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1]"
            />
          </div>
        </div>

        {/* Storefront Announcement Bar */}
        <div className="p-6 rounded-xl bg-[#141311] border border-[#262320] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#262320]">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#D4A359]" />
              <h3 className="text-xs font-semibold text-[#EDE8E1]">Storefront Header Announcement Bar</h3>
            </div>
            <label className="flex items-center gap-2 text-xs text-[#C8C2BA] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isAnnouncementActive}
                onChange={(e) =>
                  setSettings({ ...settings, isAnnouncementActive: e.target.checked })
                }
                className="rounded accent-[#D4A359]"
              />
              <span>Banner Active</span>
            </label>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-[#C8C2BA]">Promo Message (Shown at top of storefront)</Label>
            <Textarea
              rows={2}
              value={settings.announcementBar}
              onChange={(e) => setSettings({ ...settings, announcementBar: e.target.value })}
              className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1]"
            />
          </div>

          {settings.isAnnouncementActive && (
            <div className="p-3 rounded-lg bg-[#181614] border border-[#2B2724] text-xs flex items-center justify-between">
              <span className="text-[10px] text-[#8C847B] uppercase font-bold">Preview:</span>
              <span className="text-[#F3C77C] font-medium">{settings.announcementBar}</span>
            </div>
          )}
        </div>

        {/* Shipping & GST Policies */}
        <div className="p-6 rounded-xl bg-[#141311] border border-[#262320] space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-[#262320]">
            <ShieldCheck className="w-4 h-4 text-[#D4A359]" />
            <h3 className="text-xs font-semibold text-[#EDE8E1]">Shipping & Commerce Economics</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#C8C2BA]">Free Shipping Threshold (₹)</Label>
              <Input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })
                }
                className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#C8C2BA]">Standard Flat Shipping Rate (₹)</Label>
              <Input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) =>
                  setSettings({ ...settings, standardShippingFee: Number(e.target.value) })
                }
                className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#C8C2BA]">GST / Tax Rate (%)</Label>
              <Input
                type="number"
                value={settings.taxRatePercent}
                onChange={(e) =>
                  setSettings({ ...settings, taxRatePercent: Number(e.target.value) })
                }
                className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="submit"
            className="bg-[#D4A359] hover:bg-[#E0B26D] text-[#121110] font-semibold text-xs px-6 h-10 shadow-lg shadow-[#D4A359]/20"
          >
            <Save className="w-4 h-4 mr-1.5" /> Save Studio Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
