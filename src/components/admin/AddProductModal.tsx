import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Edit2, Image as ImageIcon, Film, Cloud, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { money } from '@/lib/store-data';
import { CloudinaryUploader } from './CloudinaryUploader';
import { CldImage } from '@/lib/cloudinary';

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: any) => void;
  productToEdit?: any | null;
  onUpdateProduct?: (product: any) => void;
}

export function AddProductModal({
  isOpen,
  onClose,
  onAddProduct,
  productToEdit,
  onUpdateProduct,
}: ProductModalProps) {
  const isEditing = Boolean(productToEdit);

  const [name, setName] = useState('');
  const [fragrance, setFragrance] = useState('');
  const [category, setCategory] = useState('Scented Candles');
  const [price, setPrice] = useState(499);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [waxType, setWaxType] = useState('100% Pure Soy Wax');
  const [burnTime, setBurnTime] = useState('45-50 Hours');
  const [stockQuantity, setStockQuantity] = useState(30);
  const [image, setImage] = useState('/hero-candle.jpg');
  const [gallery, setGallery] = useState<string[]>([]);
  const [video, setVideo] = useState('');
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState('');
  const [cloudinaryVideoPublicId, setCloudinaryVideoPublicId] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setFragrance(productToEdit.fragrance || '');
      setCategory(productToEdit.category || 'Scented Candles');
      setPrice(productToEdit.price || 499);
      setDescription(productToEdit.description || '');
      setNotes(productToEdit.notes || '');
      setWaxType(productToEdit.waxType || '100% Pure Soy Wax');
      setBurnTime(productToEdit.burnTime || '45-50 Hours');
      setStockQuantity(productToEdit.stockQuantity ?? 30);
      setImage(productToEdit.image || '/hero-candle.jpg');
      setGallery(Array.isArray(productToEdit.gallery) ? productToEdit.gallery.filter(Boolean) : []);
      setVideo(productToEdit.video || '');
      setCloudinaryPublicId(productToEdit.cloudinaryPublicId || '');
      setCloudinaryVideoPublicId(productToEdit.cloudinaryVideoPublicId || '');
    } else {
      setName('');
      setFragrance('');
      setCategory('Scented Candles');
      setPrice(499);
      setDescription('');
      setNotes('');
      setWaxType('100% Pure Soy Wax');
      setBurnTime('45-50 Hours');
      setStockQuantity(30);
      setImage('/hero-candle.jpg');
      setGallery([]);
      setVideo('');
      setCloudinaryPublicId('');
      setCloudinaryVideoPublicId('');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const basePayload = {
      name: name.trim(),
      fragrance: fragrance.trim() || 'Botanical Blend',
      category,
      type: category.endsWith('s') ? category.slice(0, -1) : category,
      price: Number(price) || 499,
      description:
        description.trim() ||
        'Artisan hand-poured candle crafted with natural botanical extracts.',
      notes: notes.trim() || 'Top notes of fresh florals with a soft warm amber base.',
      stockQuantity: Number(stockQuantity) >= 0 ? Number(stockQuantity) : 25,
      waxType: waxType.trim() || '100% Pure Soy Wax',
      burnTime: burnTime.trim() || '45-50 Hours',
      image: image.trim() || '/hero-candle.jpg',
      gallery: gallery.filter((g) => Boolean(g && g.trim())),
      video: video.trim() || undefined,
      cloudinaryPublicId: cloudinaryPublicId.trim() || undefined,
      cloudinaryVideoPublicId: cloudinaryVideoPublicId.trim() || undefined,
    };

    if (isEditing && productToEdit && onUpdateProduct) {
      onUpdateProduct({
        ...productToEdit,
        ...basePayload,
      });
    } else {
      const newProd = {
        ...basePayload,
        id:
          name.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
          '-' +
          Date.now().toString().slice(-4),
      };
      onAddProduct(newProd);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-[#EAE4DC] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#EAE4DC] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              {isEditing ? <Edit2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1C1917]">
                {isEditing ? `Edit Candle: ${productToEdit.name}` : 'Add New Candle'}
              </h2>
              <p className="text-xs text-[#78716C]">
                Photos & videos stored in <strong className="text-amber-800">Cloudinary</strong> • Product data saved in <strong className="text-amber-800">Firebase Firestore</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A8A29E] hover:text-[#1C1917] hover:bg-[#F0ECE6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          {/* Candle Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Candle Name *</Label>
              <Input
                required
                placeholder="e.g. Amber & Cashmere Glow"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Fragrance Family *</Label>
              <Input
                required
                placeholder="e.g. Warm Amber, French Lavender"
                value={fragrance}
                onChange={(e) => setFragrance(e.target.value)}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Category</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] px-3 text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#C59A44]"
              >
                <option value="Scented Candles">Scented Candles</option>
                <option value="Jar Candles">Jar Candles</option>
                <option value="Candle Gift Sets">Candle Gift Sets</option>
                <option value="Candle Accessories">Candle Accessories</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Price (₹ INR) *</Label>
              <Input
                type="number"
                required
                min={99}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Workshop Stock</Label>
              <Input
                type="number"
                min={0}
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Wax Composition</Label>
              <Input
                value={waxType}
                onChange={(e) => setWaxType(e.target.value)}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Burn Time</Label>
              <Input
                value={burnTime}
                onChange={(e) => setBurnTime(e.target.value)}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>
          </div>

          {/* ======================================================= */}
          {/* CLOUDINARY MEDIA UPLOADS (PHOTOS & VIDEOS)              */}
          {/* ======================================================= */}
          <div className="p-4 rounded-2xl border border-amber-200/90 bg-amber-50/20 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-[#A67C2E]" />
                <span className="text-xs font-semibold text-[#1C1917]">
                  Cloudinary Media Storage
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300 font-mono">
                  cloud: e6rnpzii
                </span>
              </div>
              <span className="text-[10px] text-[#78716C]">
                Stored on Cloudinary • String reference saved in Firebase
              </span>
            </div>

            {/* 1. Photo Uploader */}
            <CloudinaryUploader
              label="Primary Candle Photo (Auto-Crop & WebP Optimized)"
              mediaType="image"
              value={image}
              publicId={cloudinaryPublicId}
              onChange={(url, pid) => {
                setImage(url);
                setCloudinaryPublicId(pid || '');
              }}
              onRemove={() => {
                setImage('/hero-candle.jpg');
                setCloudinaryPublicId('');
              }}
              helperText="Hosted on Cloudinary CDN with automatic responsive delivery."
            />

            {/* 2. Additional Gallery Photos (Multi-Image Support) */}
            <div className="space-y-2.5 pt-3 border-t border-amber-200/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#A67C2E]" />
                  <Label className="text-xs font-semibold text-[#1C1917]">
                    Additional Gallery Images ({gallery.length})
                  </Label>
                </div>
                <span className="text-[10px] text-[#78716C]">
                  Shown in product photo gallery & thumbnails
                </span>
              </div>

              {gallery.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2.5 bg-white rounded-xl border border-[#EAE4DC]">
                  {gallery.map((imgUrl, idx) => (
                    <div
                      key={`${imgUrl}-${idx}`}
                      className="group relative aspect-square rounded-lg overflow-hidden border border-[#EAE4DC] bg-[#FAF8F5] shadow-2xs"
                    >
                      <img
                        src={imgUrl}
                        alt={`Product gallery image ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        type="button"
                        onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                        title="Remove image from gallery"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-black/60 text-white font-mono text-[9px]">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <CloudinaryUploader
                label="Add Another Image to Gallery"
                mediaType="image"
                value=""
                onChange={(url) => {
                  if (url && !gallery.includes(url)) {
                    setGallery((prev) => [...prev, url]);
                  }
                }}
                helperText="Upload any lifestyle angle, close-up, or packaging box photo."
              />
            </div>

            {/* 2. Video Uploader */}
            <CloudinaryUploader
              label="Candle Video Showcase (Optional - MP4/WebM)"
              mediaType="video"
              value={video}
              publicId={cloudinaryVideoPublicId}
              onChange={(url, pid) => {
                setVideo(url);
                setCloudinaryVideoPublicId(pid || '');
              }}
              onRemove={() => {
                setVideo('');
                setCloudinaryVideoPublicId('');
              }}
              helperText="Video streams directly from Cloudinary on product detail pages."
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-[#44403C]">Description</Label>
            <Textarea
              placeholder="Describe the aroma and mood of this candle..."
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] focus-visible:ring-[#C59A44]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-[#44403C]">Fragrance Notes</Label>
            <Input
              placeholder="e.g. Top: Bergamot • Heart: Fresh Lavender • Base: Amberwood"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
            />
          </div>

          {/* Live Preview Card */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A67C2E]">
              Live Catalog Preview
            </span>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#EAE4DC] bg-white shrink-0 relative">
                {video ? (
                  <video
                    src={video}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                ) : (
                  <CldImage
                    src={image}
                    alt={name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1C1917] truncate">
                  {name || 'Untitled Artisan Candle'}
                </p>
                <p className="text-xs text-[#78716C] truncate">
                  {fragrance || 'Fragrance Family'} • {category} • {stockQuantity} in stock
                  {video && ' • Includes Video'}
                </p>
              </div>
              <span className="text-sm font-semibold text-[#1C1917] font-mono">
                {money(price || 0)}
              </span>
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
              {isEditing ? 'Save Changes' : 'Publish Candle'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
