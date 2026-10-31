import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sparkles,
  Save,
  Store,
  ShieldCheck,
  CheckCircle2,
  Megaphone,
  Truck,
  Cloud,
  Image as ImageIcon,
  Sliders,
  DollarSign,
  Layers,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  StoreSettings,
  BannerSettings,
  initialStoreSettings,
  initialBannerSettings,
  getStoredStoreSettings,
  saveStoredStoreSettings,
  getStoredBannerSettings,
  saveStoredBannerSettings,
} from '@/lib/admin-data';
import { CloudinaryUploader } from './CloudinaryUploader';
import { money } from '@/lib/store-data';

export function AdminSettings() {
  const [settings, setSettings] = useState<StoreSettings>(getStoredStoreSettings);
  const [banner, setBanner] = useState<BannerSettings>(getStoredBannerSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getStoredStoreSettings());
    setBanner(getStoredBannerSettings());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredStoreSettings(settings);
    saveStoredBannerSettings(banner);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12 font-sans">
      {/* Top Notification / Title Banner */}
      <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#A67C2E] shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#1C1917]">
                Store Settings & Hero Banner Customizer
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-semibold">
                Live Sync
              </span>
            </div>
            <p className="text-xs text-[#78716C] mt-0.5">
              Configure Cash on Delivery (COD) handling fee, prepaid free shipping policy, homepage hero banner, and brand identity.
            </p>
          </div>
        </div>

        {saved && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Changes saved and synced across storefront!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ========================================================= */}
        {/* 1. SHIPPING & COMMERCE ECONOMICS (COD COST & PREPAID)      */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                  Shipping & Payment Economics
                </h3>
                <p className="text-[11px] text-[#78716C]">
                  Configure prepaid delivery pricing and cash on delivery handling charges
                </p>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
              Prepaid Shipping: FREE (Included)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Cash on Delivery (COD) Handling Cost */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC]">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-[#1C1917]">
                  COD Handling Cost (₹) *
                </Label>
                <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">
                  COD Only
                </span>
              </div>
              <Input
                type="number"
                min={0}
                required
                value={settings.codFee ?? 69}
                onChange={(e) =>
                  setSettings({ ...settings, codFee: Math.max(0, Number(e.target.value)) })
                }
                className="bg-white border-[#EAE4DC] text-xs font-mono font-semibold text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
              <p className="text-[11px] text-[#78716C] leading-snug">
                Added at checkout <strong>only</strong> when customer chooses Cash on Delivery. Current fee: <strong className="text-[#1C1917]">{money(settings.codFee ?? 69)}</strong>.
              </p>
            </div>

            {/* Prepaid Shipping Notice */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-emerald-900">
                  Prepaid Orders Shipping
                </Label>
                <span className="text-[10px] text-emerald-800 font-semibold">Included</span>
              </div>
              <div className="h-10 rounded-xl bg-white border border-emerald-200 px-3 flex items-center justify-between text-xs font-semibold text-emerald-800">
                <span>Free Nationwide Delivery</span>
                <span className="font-mono">₹0</span>
              </div>
              <p className="text-[11px] text-emerald-800/80 leading-snug">
                All prepaid orders (Razorpay UPI, Cards, NetBanking) automatically get complimentary shipping included in candle price.
              </p>
            </div>

            {/* GST Rate */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC]">
              <Label className="text-xs font-semibold text-[#1C1917]">GST / Tax Rate (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={settings.taxRatePercent ?? 18}
                onChange={(e) =>
                  setSettings({ ...settings, taxRatePercent: Number(e.target.value) })
                }
                className="bg-white border-[#EAE4DC] text-xs font-mono font-semibold text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
              <p className="text-[11px] text-[#78716C] leading-snug">
                Standard GST rate applied on decorative and scented candles (HSN 34060010).
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. HOMEPAGE HERO BANNER CUSTOMIZER                        */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#A67C2E]">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                  Storefront Hero Banner Section
                </h3>
                <p className="text-[11px] text-[#78716C]">
                  Customize the main headline, subtitle, action buttons, and background photograph on your homepage
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-[#44403C] cursor-pointer bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#EAE4DC]">
              <input
                type="checkbox"
                checked={banner.isActive}
                onChange={(e) => setBanner({ ...banner, isActive: e.target.checked })}
                className="rounded accent-[#C59A44] w-4 h-4"
              />
              <span>Banner Active</span>
            </label>
          </div>

          {/* Live Preview Card */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#78716C]">
              <Eye className="w-3.5 h-3.5 text-[#A67C2E]" />
              <span>Live Storefront Preview</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-[#EAE4DC] aspect-21/9 min-h-[220px] sm:min-h-[260px] flex items-center p-6 sm:p-10 shadow-inner group">
              <img
                src={banner.imageUrl || '/hero-candle.jpg'}
                alt="Banner preview"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent pointer-events-none" />

              <div className="relative z-10 max-w-lg space-y-2.5 text-white">
                <span className="inline-block text-[10px] tracking-widest font-semibold uppercase text-[#F3C77C] bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#F3C77C]/30">
                  {banner.eyebrow || 'A little light. A little luxury.'}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-semibold leading-tight whitespace-pre-line text-[#FAF8F5]">
                  {banner.title || 'Handcrafted Candles &\nLuxury Fragrances'}
                </h2>
                <p className="text-xs text-[#E7E5E4] max-w-md line-clamp-2 leading-relaxed">
                  {banner.subtitle || 'Artisanally poured botanical soy candles designed for your sanctuary.'}
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <div className="px-4 py-2 rounded-xl bg-[#C59A44] text-[#121110] font-semibold text-xs inline-flex items-center gap-1.5 shadow-md">
                    <span>{banner.buttonText || 'Shop Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  {banner.secondaryText && (
                    <span className="text-xs text-white/90 underline underline-offset-4 font-medium">
                      {banner.secondaryText}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Banner Editing Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#44403C]">Eyebrow Tagline</Label>
              <Input
                value={banner.eyebrow}
                onChange={(e) => setBanner({ ...banner, eyebrow: e.target.value })}
                placeholder="A little light. A little luxury."
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#44403C]">
                Banner Main Title (Use \n for new lines)
              </Label>
              <Input
                value={banner.title}
                onChange={(e) => setBanner({ ...banner, title: e.target.value })}
                placeholder="Handcrafted Candles &\nLuxury Fragrances"
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#44403C]">Banner Subtitle Description</Label>
            <Textarea
              rows={2}
              value={banner.subtitle}
              onChange={(e) => setBanner({ ...banner, subtitle: e.target.value })}
              placeholder="Artisanally poured botanical soy candles designed to create a warmer, brighter, and calmer sanctuary in your home."
              className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] focus-visible:ring-[#C59A44]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#44403C]">Primary Button Text</Label>
                <Input
                  value={banner.buttonText}
                  onChange={(e) => setBanner({ ...banner, buttonText: e.target.value })}
                  placeholder="Shop Now"
                  className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#44403C]">Primary Link</Label>
                <Input
                  value={banner.buttonLink}
                  onChange={(e) => setBanner({ ...banner, buttonLink: e.target.value })}
                  placeholder="/shop"
                  className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#44403C]">Secondary Link Text</Label>
                <Input
                  value={banner.secondaryText}
                  onChange={(e) => setBanner({ ...banner, secondaryText: e.target.value })}
                  placeholder="Explore Collections"
                  className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#44403C]">Secondary Link</Label>
                <Input
                  value={banner.secondaryLink}
                  onChange={(e) => setBanner({ ...banner, secondaryLink: e.target.value })}
                  placeholder="/collections"
                  className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
                />
              </div>
            </div>
          </div>

          {/* Banner Image Uploader */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-[#1C1917]">
                Hero Banner Background Image
              </Label>
              <span className="text-[10px] text-[#78716C]">
                Recommended: 1536 × 1024 px (High Resolution Landscape)
              </span>
            </div>

            <CloudinaryUploader
              label="Upload Banner Photo via Cloudinary or Local Fallback"
              mediaType="image"
              folder="crystelle_studio/banners"
              value={banner.imageUrl}
              onChange={(url) => setBanner({ ...banner, imageUrl: url })}
              onRemove={() => setBanner({ ...banner, imageUrl: '/hero-candle.jpg' })}
              helperText="Hosted on Cloudinary CDN with automatic responsive delivery."
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. STOREFRONT HEADER ANNOUNCEMENT BAR                     */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#EAE4DC]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#A67C2E]">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                  Top Header Announcement Marquee
                </h3>
                <p className="text-[11px] text-[#78716C]">
                  Show special promotional discount codes or festive offers on top of every page
                </p>
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs font-medium text-[#44403C] cursor-pointer bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#EAE4DC]">
              <input
                type="checkbox"
                checked={settings.isAnnouncementActive}
                onChange={(e) =>
                  setSettings({ ...settings, isAnnouncementActive: e.target.checked })
                }
                className="rounded accent-[#C59A44] w-4 h-4"
              />
              <span>Announcement Active</span>
            </label>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#44403C]">Announcement Text</Label>
            <Textarea
              rows={2}
              value={settings.announcementBar}
              onChange={(e) => setSettings({ ...settings, announcementBar: e.target.value })}
              className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] focus-visible:ring-[#C59A44]"
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. STUDIO & BRAND IDENTITY                                */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3.5 border-b border-[#EAE4DC]">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#A67C2E]">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                Artisan Studio & Brand Profile
              </h3>
              <p className="text-[11px] text-[#78716C]">
                Studio contact details printed on tax invoices and dispatch slips
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#44403C]">Brand Name</Label>
              <Input
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#44403C]">Tagline</Label>
              <Input
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#44403C]">Support Email</Label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#44403C]">Workshop Phone</Label>
              <Input
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#44403C]">Workshop Location</Label>
            <Input
              value={settings.workshopLocation}
              onChange={(e) => setSettings({ ...settings, workshopLocation: e.target.value })}
              className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All updates successfully saved!
            </span>
          )}
          <Button
            type="submit"
            className="bg-[#C59A44] hover:bg-[#B58934] text-white font-semibold text-xs px-7 h-11 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Store & Banner Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
