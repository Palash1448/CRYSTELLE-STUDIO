import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProductCard, useStore } from '@/components/storefront';
import { categories, getStoredProducts } from '@/lib/store-data';
import { seoHead } from '@/lib/seo';

export const Route = createFileRoute('/shop')({
  validateSearch: (search: Record<string, unknown>): { q?: string; category?: string } => ({
    q: typeof search['q'] === 'string' ? search['q'] : undefined,
    category: typeof search['category'] === 'string' ? search['category'] : undefined,
  }),
  head: () =>
    seoHead({
      title: 'Shop Handcrafted Scented Candles, Jars & Gift Sets',
      description:
        'Browse our artisanal collection of hand-poured scented candles, soy wax jar candles, and aromatherapy gifts. Clean burn, non-toxic, free shipping on ₹999+.',
      path: '/shop',
      breadcrumbs: [{ name: 'Shop All Candles', path: '/shop' }],
      keywords:
        'buy scented candles online, handcrafted candles shop, soy wax jar candles India, aroma candle set, luxury candle shop',
    }),
  component: Shop,
});

function Shop() {
  const search = Route.useSearch();
  const { products: storeProducts } = useStore();
  const allProducts =
    storeProducts && storeProducts.length > 0 ? storeProducts : getStoredProducts();
  const [selected, setSelected] = useState<string[]>(
    search['category'] ? [search['category']] : []
  );
  const [fragrances, setFragrances] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sort, setSort] = useState('featured');
  const [stock, setStock] = useState(false);

  const toggle = (value: string, list: string[], setter: (v: string[]) => void) =>
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const filtered = allProducts
    .filter(
      (p) =>
        (!selected.length || selected.includes(p.category)) &&
        (!fragrances.length || fragrances.includes(p.fragrance)) &&
        p.price <= maxPrice &&
        (!stock || (p.stockQuantity ?? 1) > 0) &&
        (!search['q'] ||
          (p.name + ' ' + p.fragrance + ' ' + (p.description || ''))
            .toLowerCase()
            .includes(search['q'].toLowerCase()))
    )
    .sort((a, b) =>
      sort === 'low'
        ? a.price - b.price
        : sort === 'high'
        ? b.price - a.price
        : sort === 'name'
        ? a.name.localeCompare(b.name)
        : 0
    );

  return (
    <main className="container page">
      <div className="page-heading">
        <h1>Handcrafted Candles &amp; Fragrances Collection</h1>
        <p>
          Explore hand-poured botanical candles, aromatic jars, and gift sets made for your everyday peace.
        </p>
      </div>

      <div className="shop-layout">
        <aside className="filters" aria-label="Product filters">
          <h2>Filters</h2>
          <div className="filter-group">
            <h3>Category</h3>
            {categories.map((c) => (
              <label key={c.name}>
                <input
                  type="checkbox"
                  checked={selected.includes(c.name)}
                  onChange={() => toggle(c.name, selected, setSelected)}
                />
                {c.name}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h3>Price Range</h3>
            <input
              type="range"
              aria-label="Maximum price"
              min={200}
              max={2000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            <div className="shop-toolbar">
              <span>₹200</span>
              <span>₹{maxPrice}</span>
            </div>
          </div>

          <div className="filter-group fragrance-filter">
            <h3>Fragrance Notes</h3>
            {['Lavender', 'Vanilla', 'Rose', 'Citrus', 'Sandalwood', 'Others'].map((f) => (
              <label key={f}>
                <input
                  type="checkbox"
                  checked={fragrances.includes(f)}
                  onChange={() => toggle(f, fragrances, setFragrances)}
                />
                {f}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h3>Availability</h3>
            <label>
              <input
                type="checkbox"
                checked={stock}
                onChange={(e) => setStock(e.target.checked)}
              />
              In Stock Only
            </label>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                setSelected([]);
                setFragrances([]);
                setMaxPrice(2000);
                setStock(false);
              }}
            >
              Clear filters
            </Button>
          </div>
        </aside>

        <div>
          <div className="shop-toolbar">
            <span>
              {filtered.length} candle{filtered.length === 1 ? '' : 's'}
              {search['q'] ? ` for “${search['q']}”` : ''}
            </span>
            <label>
              Sort by &nbsp;
              <select
                aria-label="Sort products"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </label>
          </div>

          <div className="product-grid shop-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {!filtered.length && (
            <div className="empty-state">
              <h2>No candles matched your criteria</h2>
              <p>Try clearing your fragrance or price filters to see all studio creations.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
