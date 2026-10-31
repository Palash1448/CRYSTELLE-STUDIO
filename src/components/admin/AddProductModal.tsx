import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Edit2, Image as ImageIcon, Plus, Trash2, Star, AlertCircle, Layers } from 'lucide-react';
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

  // EXACT fields requested: Candle Name, Category, Price, Stock, Description, Image (all mandatory)
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Scented Candles');
  const [price, setPrice] = useState<number | ''>(499);
  const [stockQuantity, setStockQuantity] = useState<number | ''>(30);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setCategory(productToEdit.category || 'Scented Candles');
      setPrice(productToEdit.price ?? 499);
      setStockQuantity(productToEdit.stockQuantity ?? 30);
      setDescription(productToEdit.description || '');
      setImage(productToEdit.image || '');
      setGallery(Array.isArray(productToEdit.gallery) ? productToEdit.gallery.filter(Boolean) : []);
      setImageError('');
    } else {
      setName('');
      setCategory('Scented Candles');
      setPrice(499);
      setStockQuantity(30);
      setDescription('');
      setImage('');
      setGallery([]);
      setImageError('');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImageError('');

    if (!name.trim()) return;
    if (!category.trim()) return;
    if (price === '' || Number(price) <= 0) return;
    if (stockQuantity === '' || Number(stockQuantity) < 0) return;
    if (!description.trim()) return;

    const finalImage = image.trim() || (gallery.length > 0 && gallery[0] ? gallery[0] : '');
    if (!finalImage) {
      setImageError('Product image is mandatory. Please select or upload at least one image.');
      return;
    }

    const basePayload = {
      name: name.trim(),
      category: category.trim(),
      type: category.endsWith('s') ? category.slice(0, -1) : category,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      description: description.trim(),
      image: finalImage,
      gallery: gallery.filter((g) => Boolean(g && g.trim() && g !== finalImage)),
      // Automatic defaults for catalog consistency
      fragrance: productToEdit?.fragrance || category.trim(),
      notes: productToEdit?.notes || 'Natural botanical extracts with a warm amber base.',
      waxType: productToEdit?.waxType || '100% Pure Soy Wax',
      burnTime: productToEdit?.burnTime || '45-50 Hours',
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

  const previewImage = image || (gallery.length > 0 ? gallery[0] : '/hero-candle.jpg');

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
                All fields below are <strong className="text-amber-800">mandatory</strong> for product listing.
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

        {/* Form Body - ONLY 6 MANDATORY FIELDS: Name, Category, Price, Stock, Description, Image */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          {/* Field 1: Candle Name (Mandatory) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#1C1917]">
              Candle Name <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              placeholder="e.g. Amber & Cashmere Glow"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
            />
          </div>

          {/* Field 2 & 3 & 4: Category, Price, Stock (All Mandatory) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1C1917]">
                Category <span className="text-red-500">*</span>
              </Label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 rounded-xl bg-[#FAF8F5] border border-[#EAE4DC] px-3 text-xs text-[#1C1917] font-medium focus:outline-none focus:ring-1 focus:ring-[#C59A44]"
              >
                <option value="Scented Candles">Scented Candles</option>
                <option value="Jar Candles">Jar Candles</option>
                <option value="Candle Gift Sets">Candle Gift Sets</option>
                <option value="Candle Accessories">Candle Accessories</option>
                <option value="Pillar Candles">Pillar Candles</option>
                <option value="Tealight Candles">Tealight Candles</option>
              </select>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1C1917]">
                Price (₹ INR) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                required
                min={1}
                placeholder="499"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs font-mono font-semibold text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>

            {/* Stock */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1C1917]">
                Stock Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                required
                min={0}
                placeholder="30"
                value={stockQuantity}
                onChange={(e) =>
                  setStockQuantity(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="bg-[#FAF8F5] border-[#EAE4DC] text-xs font-mono font-semibold text-[#1C1917] h-10 focus-visible:ring-[#C59A44]"
              />
            </div>
          </div>

          {/* Field 5: Description (Mandatory) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#1C1917]">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              required
              placeholder="Describe the fragrance aroma, wax blend, and mood created by this handcrafted candle..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] leading-relaxed focus-visible:ring-[#C59A44]"
            />
          </div>

          {/* Field 6: Product Images (Mandatory with Multi-Image Support) */}
          <div className="p-4 rounded-2xl border border-amber-200/90 bg-amber-50/20 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#A67C2E]" />
                <Label className="text-xs font-semibold text-[#1C1917]">
                  Product Images <span className="text-red-500">*</span>
                </Label>
              </div>
              <span className="text-[10px] text-amber-800 font-medium">
                Mandatory • Multi-file selection supported
              </span>
            </div>

            {/* Multi-Image File Uploader */}
            <CloudinaryUploader
              label="Select Product Images (Hold Ctrl / Shift to pick multiple at once)"
              mediaType="image"
              multiple={true}
              value={image}
              onMultipleChange={(urls) => {
                if (urls.length === 0) return;
                setImageError('');
                if (!image) {
                  if (urls[0]) setImage(urls[0]);
                  if (urls.length > 1) {
                    setGallery((prev) => [
                      ...prev,
                      ...urls.slice(1).filter((u) => !prev.includes(u)),
                    ]);
                  }
                } else {
                  setGallery((prev) => [
                    ...prev,
                    ...urls.filter((u) => u !== image && !prev.includes(u)),
                  ]);
                }
              }}
              onChange={(url) => {
                setImageError('');
                if (!image) {
                  setImage(url);
                } else if (!gallery.includes(url) && url !== image) {
                  setGallery((prev) => [...prev, url]);
                }
              }}
              onRemove={() => {
                if (gallery.length > 0 && gallery[0]) {
                  setImage(gallery[0]);
                  setGallery((prev) => prev.slice(1));
                } else {
                  setImage('');
                }
              }}
              helperText="Upload 1 or multiple photos simultaneously. Click ⭐ on any thumbnail below to make it the Main Cover Photo."
            />

            {/* Gallery Thumbnails List */}
            {(image || gallery.length > 0) && (
              <div className="space-y-2 pt-2 border-t border-amber-200/60">
                <div className="flex items-center justify-between text-[11px] text-[#78716C]">
                  <span>Uploaded Product Photos ({gallery.length + (image ? 1 : 0)})</span>
                  <span className="text-[10px] text-amber-800 font-medium">
                    ⭐ = Main Cover Photo
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-2.5 bg-white rounded-xl border border-[#EAE4DC]">
                  {/* Primary Photo Badge */}
                  {image && (
                    <div className="group relative aspect-square rounded-xl overflow-hidden border-2 border-[#C59A44] bg-[#FAF8F5] shadow-xs">
                      <img
                        src={image}
                        alt="Main product photo"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full bg-[#C59A44] text-[#121110] font-bold text-[9px] flex items-center gap-0.5 shadow-xs">
                        <Star className="w-2.5 h-2.5 fill-current" /> Main
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (gallery.length > 0 && gallery[0]) {
                            setImage(gallery[0]);
                            setGallery((prev) => prev.slice(1));
                          } else {
                            setImage('');
                          }
                        }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Additional Gallery Photos */}
                  {gallery.map((imgUrl, idx) => (
                    <div
                      key={`${imgUrl}-${idx}`}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-[#EAE4DC] bg-[#FAF8F5] shadow-2xs hover:border-amber-300 transition-colors"
                    >
                      <img
                        src={imgUrl}
                        alt={`Gallery photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-1 right-1 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const oldPrimary = image;
                            setImage(imgUrl);
                            setGallery((prev) => [
                              ...(oldPrimary ? [oldPrimary] : []),
                              ...prev.filter((_, i) => i !== idx),
                            ]);
                          }}
                          className="w-5 h-5 rounded-full bg-amber-500/90 hover:bg-amber-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                          title="Set as Main Cover Photo"
                        >
                          <Star className="w-2.5 h-2.5 fill-white" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                          className="w-5 h-5 rounded-full bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                          title="Remove image from gallery"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-black/60 text-white font-mono text-[9px]">
                        #{idx + 2}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {imageError && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{imageError}</span>
              </div>
            )}
          </div>

          {/* Live Catalog Preview */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A67C2E]">
              Catalog Listing Preview
            </span>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#EAE4DC] bg-white shrink-0 relative flex items-center justify-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt={name || 'Candle Preview'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-5 h-5 text-[#A8A29E]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1C1917] truncate">
                  {name || 'Candle Name'}
                </p>
                <p className="text-xs text-[#78716C] truncate">
                  {category} • {stockQuantity !== '' ? `${stockQuantity} in stock` : '0 in stock'}
                </p>
              </div>
              <span className="text-sm font-semibold text-[#1C1917] font-mono">
                {price !== '' ? money(Number(price)) : '₹0'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#EAE4DC] flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-xs text-[#78716C] hover:bg-[#FAF8F5] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#C59A44] hover:bg-[#B58934] text-white font-semibold text-xs px-6 h-10 rounded-xl shadow-sm cursor-pointer"
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
