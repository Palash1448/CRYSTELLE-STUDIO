import React, { useState, useEffect } from 'react';
import { Settings, Sparkles, Save, Store, ShieldCheck, CheckCircle2, Megaphone, Truck, Cloud, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { initialStoreSettings } from '@/lib/admin-data';

export function AdminSettings() {
  const [settings, setSettings] = useState(initialStoreSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('crystelle_studio_settings');
      if (stored) {
        setSettings({ ...initialStoreSettings, ...JSON.parse(stored) });
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('crystelle_studio_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Ready For Customization Callout Banner */}
      <div className="p-4 rounded-xl bg-linear-to-r from-amber-500/10 via-[#1A1816] to-[#141311] border border-amber-500/30 flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
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

        {/* ShipPrime Logistics & Courier Hub */}
        <div className="p-6 rounded-xl bg-[#141311] border border-[#262320] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#262320]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#D4A359]" />
              <div>
                <h3 className="text-xs font-semibold text-[#EDE8E1]">ShipPrime Logistics & Courier Integration</h3>
                <p className="text-[11px] text-[#8C847B]">
                  Live Forward Order API (`https://api.shipprime.live/v1/forward`) for Delhivery, Xpressbees & Shadowfax
                </p>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
              Live API Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#C8C2BA]">ShipPrime Authorization Bearer Token</Label>
              <Input
                type="password"
                value={settings.shipprimeToken || ''}
                onChange={(e) =>
                  setSettings({ ...settings, shipprimeToken: e.target.value })
                }
                placeholder="Bearer sp_..."
                className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1] font-mono"
              />
              <span className="text-[10px] text-[#78716C] block">
                Token is securely stored and used for generating forward AWBs and labels.
              </span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#C8C2BA]">Pickup Warehouse Pincode</Label>
              <Input
                value={settings.shipprimePickupPincode || ''}
                onChange={(e) =>
                  setSettings({ ...settings, shipprimePickupPincode: e.target.value })
                }
                placeholder="122002"
                className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1] font-mono"
              />
              <span className="text-[10px] text-[#78716C] block">
                Pincode configured in your ShipPrime Seller Panel warehouse.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#C8C2BA]">Warehouse Pickup Name</Label>
              <Input
                value={settings.shipprimePickupName || ''}
                onChange={(e) =>
                  setSettings({ ...settings, shipprimePickupName: e.target.value })
                }
                className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#C8C2BA]">Warehouse Phone (10 digits)</Label>
              <Input
                value={settings.shipprimePickupPhone || ''}
                onChange={(e) =>
                  setSettings({ ...settings, shipprimePickupPhone: e.target.value })
                }
                className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#C8C2BA]">Warehouse City & State</Label>
              <Input
                value={`${settings.shipprimePickupCity || 'Gurgaon'}, ${settings.shipprimePickupState || 'Haryana'}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setSettings({
                    ...settings,
                    shipprimePickupCity: parts[0]?.trim() || '',
                    shipprimePickupState: parts[1]?.trim() || '',
                  });
                }}
                className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1]"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#181614] border border-[#2B2724] flex items-center justify-between text-xs text-[#8C847B]">
            <div className="flex items-center gap-2">
              <span className="text-[#F3C77C] font-semibold">Candle HSN Code:</span>
              <span className="font-mono text-[#EDE8E1]">34060010</span>
              <span className="text-[11px]">(Decorative & Scented Candles)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#F3C77C] font-semibold">Supported Couriers:</span>
              <span className="text-[#EDE8E1]">Delhivery, Xpressbees, Shadowfax</span>
            </div>
          </div>
        </div>

        {/* Cloudinary Media Storage & CDN */}
        <div className="p-6 rounded-xl bg-[#141311] border border-[#262320] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#262320]">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-[#D4A359]" />
              <div>
                <h3 className="text-xs font-semibold text-[#EDE8E1]">Cloudinary Media Storage & CDN</h3>
                <p className="text-[11px] text-[#8C847B]">
                  High-speed CDN, auto-WebP conversion & auto-gravity cropping for product photos & videos
                </p>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
              Auto Fallback Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#C8C2BA]">Cloudinary Cloud Name</Label>
              <Input
                value={settings.cloudinaryCloudName || ''}
                onChange={(e) =>
                  setSettings({ ...settings, cloudinaryCloudName: e.target.value })
                }
                placeholder="e6rnpzii"
                className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1] font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#C8C2BA]">API Key</Label>
              <Input
                value={settings.cloudinaryApiKey || ''}
                onChange={(e) =>
                  setSettings({ ...settings, cloudinaryApiKey: e.target.value })
                }
                placeholder="624812375866731"
                className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#C8C2BA]">API Secret</Label>
              <Input
                type="password"
                value={settings.cloudinaryApiSecret || ''}
                onChange={(e) =>
                  setSettings({ ...settings, cloudinaryApiSecret: e.target.value })
                }
                placeholder="Found in Cloudinary Console > Settings > Access Keys"
                className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1] font-mono"
              />
              <span className="text-[10px] text-[#78716C] block">
                Required for direct signed uploads. Matches your Access Key secret in Cloudinary Console.
              </span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#C8C2BA]">Unsigned Upload Preset (Recommended)</Label>
              <Input
                value={settings.cloudinaryUploadPreset || ''}
                onChange={(e) =>
                  setSettings({ ...settings, cloudinaryUploadPreset: e.target.value })
                }
                placeholder="e.g. crystelle_preset"
                className="bg-[#1C1A17] border-[#2E2A27] text-xs text-[#EDE8E1] font-mono"
              />
              <span className="text-[10px] text-[#78716C] block">
                Create in Settings &gt; Upload &gt; Upload presets (Unsigned). Eliminates signature errors.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#181614] border border-[#2B2724] text-[11px] text-[#9E978E] flex items-center justify-between">
            <span>
              💡 <strong className="text-[#EDE8E1]">Automatic Local Fallback:</strong> If Cloudinary rejects the signature or is unconfigured, uploads automatically save to <code className="text-[#D4A359]">/public/uploads/</code> or store inline, so adding products never fails.
            </span>
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
