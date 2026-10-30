import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  X,
  Play,
  Film,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { money } from '@/lib/store-data';
import { CldImage } from '@/lib/cloudinary';

interface AdminProductsProps {
  productsList: any[];
  onOpenAddProduct: () => void;
  onUpdateStock: (productId: string, delta: number) => void;
  onEditProduct?: (product: any) => void;
  onDeleteProduct?: (productId: string) => void;
}

export function AdminProducts({
  productsList,
  onOpenAddProduct,
  onUpdateStock,
  onEditProduct,
  onDeleteProduct,
}: AdminProductsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [productToDelete, setProductToDelete] = useState<any | null>(null);

  const filtered = productsList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.fragrance.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const confirmDelete = () => {
    if (productToDelete && onDeleteProduct) {
      onDeleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#EAE4DC] p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-[#1C1917]">
              Product Listing & Inventory
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
              {filtered.length} Active Candles
            </span>
          </div>
          <p className="text-xs text-[#78716C] mt-1">
            Manage your handcrafted fragrance catalog, inventory quantities, and pricing.
          </p>
        </div>

        <Button
          onClick={onOpenAddProduct}
          className="bg-[#C59A44] hover:bg-[#B58934] text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-sm self-start sm:self-auto flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Candle
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#EAE4DC] p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
          <Input
            placeholder="Search candles by name or fragrance..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] focus-visible:ring-[#C59A44]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Scented Candles', 'Jar Candles', 'Candle Gift Sets', 'Candle Accessories'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#C59A44] text-white shadow-sm'
                    : 'bg-[#FAF8F5] text-[#78716C] hover:text-[#1C1917] border border-[#EAE4DC]'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-[#EAE4DC] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] text-[#78716C] border-b border-[#EAE4DC]">
                <th className="py-3 px-4 font-semibold">Candle</th>
                <th className="py-3 px-4 font-semibold">Fragrance Family</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Price</th>
                <th className="py-3 px-4 font-semibold">Current Stock</th>
                <th className="py-3 px-4 font-semibold">Notes / Blend</th>
                <th className="py-3 px-4 font-semibold text-center">Quick Stock</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE6]">
              {filtered.map((prod) => {
                const stock = prod.stockQuantity ?? 32;
                const isLow = stock <= 10;
                return (
                  <tr key={prod.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#EAE4DC] bg-[#FAF8F5] shrink-0 shadow-2xs relative">
                          <CldImage
                            src={prod.image}
                            alt={prod.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                          {prod.video && (
                            <span className="absolute bottom-0 right-0 bg-black/70 text-white p-0.5 rounded-tl">
                              <Play className="w-2 h-2 fill-white" />
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1C1917] flex items-center gap-1.5">
                            {prod.name}
                            {prod.video && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                Video
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-[#78716C]">{prod.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#A67C2E]">{prod.fragrance}</td>
                    <td className="py-3.5 px-4 text-[#57534E]">{prod.category}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#1C1917]">
                      {money(prod.price)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${
                          isLow
                            ? 'bg-amber-50 text-amber-700 border-amber-200 font-bold'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium'
                        }`}
                      >
                        {stock} jars {isLow && '• Low Stock'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#78716C] max-w-xs truncate" title={prod.notes}>
                      {prod.notes || prod.description}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl p-0.5 shadow-2xs">
                        <button
                          onClick={() => onUpdateStock(prod.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold text-[#78716C] hover:text-[#1C1917] hover:bg-white transition-colors"
                          title="Decrease stock by 1"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-mono text-[11px] font-semibold text-[#1C1917]">
                          {stock}
                        </span>
                        <button
                          onClick={() => onUpdateStock(prod.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold text-[#78716C] hover:text-[#1C1917] hover:bg-white transition-colors"
                          title="Increase stock by 1"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => onEditProduct && onEditProduct(prod)}
                          className="p-1.5 rounded-lg border border-[#EAE4DC] bg-[#FAF8F5] text-[#57534E] hover:text-[#1C1917] hover:bg-white transition-colors"
                          title="Edit Candle Details"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#A67C2E]" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(prod)}
                          className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete Candle"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#78716C]">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] flex items-center justify-center mx-auto text-xl">
                        🕯️
                      </div>
                      <p className="font-semibold text-sm text-[#1C1917]">No Candles in Studio Inventory</p>
                      <p className="text-xs text-[#78716C]">
                        Your catalogue is clean. Click "+ Add New Candle" above to create your first handcrafted candle listing.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (Optimized for Phones) */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#EAE4DC] p-8 text-center text-[#78716C] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] flex items-center justify-center mx-auto text-xl">
              🕯️
            </div>
            <p className="font-semibold text-sm text-[#1C1917]">No Candles in Studio Inventory</p>
            <p className="text-xs text-[#78716C]">
              Click "+ Add New Candle" above to create your first real product listing.
            </p>
          </div>
        ) : (
          filtered.map((prod) => {
          const stock = prod.stockQuantity ?? 32;
          const isLow = stock <= 10;
          return (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-[#EAE4DC] p-4 shadow-sm space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#EAE4DC] bg-[#FAF8F5] shrink-0 relative">
                  <CldImage
                    src={prod.image}
                    alt={prod.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                  {prod.video && (
                    <span className="absolute bottom-0 right-0 bg-black/70 text-white p-0.5 rounded-tl">
                      <Play className="w-2.5 h-2.5 fill-white" />
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1C1917] truncate">{prod.name}</p>
                  <p className="text-xs text-[#A67C2E] font-medium">{prod.fragrance} • {prod.category}</p>
                </div>
                <span className="font-mono font-semibold text-sm text-[#1C1917]">
                  {money(prod.price)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F0ECE6]">
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono border ${
                    isLow
                      ? 'bg-amber-50 text-amber-700 border-amber-200 font-bold'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {stock} in stock {isLow && '• Low'}
                </span>

                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1 bg-[#FAF8F5] border border-[#EAE4DC] rounded-xl p-0.5">
                    <button
                      onClick={() => onUpdateStock(prod.id, -1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold text-[#78716C] hover:bg-white"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono text-xs font-semibold text-[#1C1917]">
                      {stock}
                    </span>
                    <button
                      onClick={() => onUpdateStock(prod.id, 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold text-[#78716C] hover:bg-white"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => onEditProduct && onEditProduct(prod)}
                    className="p-2 rounded-xl border border-[#EAE4DC] bg-[#FAF8F5] text-[#57534E] hover:bg-white"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4 text-[#A67C2E]" />
                  </button>

                  <button
                    onClick={() => setProductToDelete(prod)}
                    className="p-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        }))}
      </div>

      {/* Confirmation Modal for Product Delete */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-[#EAE4DC] p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1C1917]">Delete Candle?</h3>
                <p className="text-xs text-[#78716C]">
                  Are you sure you want to remove <span className="font-semibold text-[#1C1917]">{productToDelete.name}</span> from the catalog? This cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0ECE6]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setProductToDelete(null)}
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
