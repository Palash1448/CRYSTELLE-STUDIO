import { createFileRoute, Link } from '@tanstack/react-router';
import { categories, getStoredProducts } from '@/lib/store-data';
import { ArrowRight, ProductCard, useStore } from '@/components/storefront';
import { seoHead } from '@/lib/seo';

export const Route = createFileRoute('/collections')({
  head: () =>
    seoHead({
      title: 'Curated Candle Collections & Gift Hampers',
      description:
        'Discover curated candle collections: Scented Jar Candles, Botanical Gift Sets, and Candle Accessories crafted with natural plant wax in Maharashtra.',
      path: '/collections',
      breadcrumbs: [{ name: 'Collections', path: '/collections' }],
      keywords:
        'candle collections, scented jar candles, botanical candle gift set, luxury gift hampers India, handmade candle packs',
    }),
  component: Collections,
});

function Collections() {
  const { products: storeProducts } = useStore();
  const activeProducts =
    storeProducts && storeProducts.length > 0 ? storeProducts : getStoredProducts();

  return (
    <main className="container page">
      <div className="page-heading">
        <h1>Curated Handcrafted Collections</h1>
        <p>A fragrance for every feeling. A warm little light for every cherished moment.</p>
      </div>

      <div className="category-grid">
        {categories.map((c) => (
          <Link
            to="/shop"
            search={{ category: c.name }}
            key={c.name}
            className="category-tile"
          >
            <img
              src={c.image}
              alt={`${c.name} — Crystelle Studio Collection`}
              width={512}
              height={512}
              loading="lazy"
            />
            <div className="category-caption">
              <h3>{c.name}</h3>
              <p>
                Explore Collection <ArrowRight size={13} />
              </p>
            </div>
          </Link>
        ))}
      </div>

      <section className="section" aria-labelledby="ritual-heading">
        <div className="section-heading">
          <div>
            <h2 id="ritual-heading">The Everyday Ritual</h2>
            <p>Our most-loved handcrafted fragrances, poured for your mindful everyday moments.</p>
          </div>
        </div>
        <div className="product-grid">
          {activeProducts.length === 0 ? (
            <div className="col-span-full py-10 text-center text-[#78716C] bg-[#FAF8F5] rounded-3xl border border-[#EAE4DC] p-8">
              <p className="text-base font-serif italic text-[#1C1917] mb-1">
                New Handcrafted Candles Coming Soon
              </p>
              <p className="text-xs text-[#78716C]">
                Our studio collection is currently in small-batch artisanal preparation.
              </p>
            </div>
          ) : (
            activeProducts.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </div>
      </section>
    </main>
  );
}
