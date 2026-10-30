import { createFileRoute, Link, notFound, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Play, Sparkles, Film, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead, money, hero, getStoredProducts } from '@/lib/store-data';
import { seoHead } from '@/lib/seo';
import { fetchFirestoreProducts } from '@/lib/firestore-service';
import { Quantity, DetailBenefits, useStore, ProductCard } from '@/components/storefront';
import { CldImage } from '@/lib/cloudinary';

export const Route = createFileRoute('/product/$slug')({
  loader: async ({ params }) => {
    let all = getStoredProducts();
    let p = all.find((prod) => prod.id === params.slug);
    if (!p) {
      try {
        const remote = await fetchFirestoreProducts();
        p = remote.find((prod) => prod.id === params.slug);
      } catch {}
    }
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return seoHead({
        title: 'Candle Not Found',
        description: 'Explore the Crystelle Studio collection of handcrafted candles.',
        noindex: true,
      });
    }
    return seoHead({
      title: `${loaderData.name} — Handcrafted Scented Candle`,
      description: `${loaderData.description} Fragrance notes: ${loaderData.notes || 'Botanical oils'}. Hand-poured natural soy wax with nationwide India delivery.`,
      path: `/product/${params.slug}`,
      image: loaderData.image,
      type: 'product',
      product: loaderData,
      breadcrumbs: [
        { name: 'Shop All Candles', path: '/shop' },
        { name: loaderData.category || 'Handcrafted Candles', path: `/shop?category=${encodeURIComponent(loaderData.category || '')}` },
        { name: loaderData.name, path: `/product/${params.slug}` },
      ],
      keywords: `${loaderData.name}, ${loaderData.category}, ${loaderData.fragrance} candle, handcrafted candles India, soy wax candle`,
    });
  },
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const [size, setSize] = useState(200);
  const [quantity, setQuantity] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<'image' | 'video'>('image');
  const [activeImage, setActiveImage] = useState(product.image || '/hero-candle.jpg');
  const { add } = useStore();
  const navigate = useNavigate();

  const price = product.price + (size === 100 ? -150 : size === 350 ? 200 : 0);

  return (
    <main className="container page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/shop" search={{ category: product.category }}>
          {product.category}
        </Link>
        <span>›</span>
        <span>{product.name}</span>
      </div>

      <div className="product-detail">
        {/* Media Gallery (Cloudinary Hosted Photos & Videos) */}
        <div>
          <div className="relative rounded-3xl overflow-hidden border border-[#EAE4DC] bg-white aspect-square shadow-sm flex items-center justify-center">
            {selectedMedia === 'video' && product.video ? (
              <video
                src={product.video}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <CldImage
                className="main-product-image w-full h-full object-cover"
                src={activeImage}
                alt={product.name + ' candle'}
                width={700}
                height={700}
              />
            )}

            {/* Cloudinary media badge */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-medium text-[#78716C] border border-[#EAE4DC] shadow-2xs flex items-center gap-1.5 pointer-events-none">
              <Sparkles className="w-3 h-3 text-[#A67C2E]" />
              <span>Handcrafted Botanical</span>
            </div>
          </div>

          {/* Media Thumbnails */}
          <div className="thumbnails mt-3 flex items-center gap-2">
            {/* Primary Photo Thumbnail */}
            <Button
              variant="outline"
              className={`thumbnail relative p-0 overflow-hidden rounded-xl border ${
                selectedMedia === 'image' && activeImage === product.image
                  ? 'border-[#C59A44] ring-2 ring-[#C59A44]/30'
                  : 'border-[#EAE4DC]'
              }`}
              aria-label="View product main photo"
              onClick={() => {
                setSelectedMedia('image');
                setActiveImage(product.image);
              }}
            >
              <CldImage
                src={product.image}
                alt="Product main view"
                width={70}
                height={70}
                className="w-full h-full object-cover"
              />
            </Button>

            {/* Video Showcase Thumbnail (If Available on Cloudinary) */}
            {product.video && (
              <Button
                variant="outline"
                className={`thumbnail relative p-0 overflow-hidden rounded-xl border flex flex-col items-center justify-center bg-black/5 text-[#1C1917] ${
                  selectedMedia === 'video'
                    ? 'border-[#C59A44] ring-2 ring-[#C59A44]/30'
                    : 'border-[#EAE4DC]'
                }`}
                aria-label="Play candle video showcase"
                onClick={() => setSelectedMedia('video')}
              >
                <div className="w-6 h-6 rounded-full bg-[#C59A44] text-white flex items-center justify-center shadow-xs">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
                <span className="text-[9px] font-semibold tracking-wider uppercase mt-1 text-[#78716C]">
                  Video
                </span>
              </Button>
            )}

            {/* Additional gallery sample photo */}
            <Button
              variant="outline"
              className={`thumbnail relative p-0 overflow-hidden rounded-xl border ${
                selectedMedia === 'image' && activeImage === hero
                  ? 'border-[#C59A44] ring-2 ring-[#C59A44]/30'
                  : 'border-[#EAE4DC]'
              }`}
              aria-label="View atmospheric photo"
              onClick={() => {
                setSelectedMedia('image');
                setActiveImage(hero);
              }}
            >
              <img
                src={hero}
                alt="Atmospheric view"
                width={70}
                height={70}
                className="w-full h-full object-cover"
              />
            </Button>
          </div>
        </div>

        {/* Product Details & Purchase Form */}
        <div className="detail-copy">
          <h1>{product.name}</h1>
          <div className="rating-line">
            <span className="stars">★★★★★</span>
            <span>4.8 (124 reviews)</span>
          </div>

          <div className="price-line">
            <strong>{money(price)}</strong>
            <del>{money(price + 200)}</del>
            <span className="sale-label">
              {Math.round((200 / (price + 200)) * 100)}% OFF
            </span>
          </div>

          <p className="description">{product.description}</p>

          <p className="option-label">Size</p>
          <div className="size-options">
            {[100, 200, 350].map((s) => (
              <Button
                size="sm"
                variant={size === s ? 'default' : 'outline'}
                aria-pressed={size === s}
                onClick={() => setSize(s)}
                key={s}
              >
                {s}g
              </Button>
            ))}
          </div>

          <p className="option-label">Quantity</p>
          <Quantity value={quantity} onChange={setQuantity} />

          <div className="purchase-actions">
            <Button onClick={() => add(product.id, size, quantity)}>
              Add to Cart
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                add(product.id, size, quantity);
                navigate({ to: '/cart' });
              }}
            >
              Buy Now
            </Button>
          </div>

          <DetailBenefits />

          <details>
            <summary>Product Details</summary>
            <p>
              Hand-poured in small batches with {product.waxType || 'a natural botanical wax blend'} and a cotton wick.
              Burn time: {product.burnTime || '40-45 hours'}. Presented in a reusable amber glass vessel.
            </p>
          </details>

          <details>
            <summary>Fragrance Notes</summary>
            <p>{product.notes}</p>
          </details>

          <details>
            <summary>Shipping & Returns</summary>
            <p>
              Nationwide express delivery across India with ShipPrime tracked shipping.
              Safe transit packaging ensures your candles arrive in pristine condition.
            </p>
          </details>
        </div>
      </div>

      {/* Related Products */}
      <section className="section">
        <div className="section-heading">
          <h2>You May Also Love</h2>
        </div>
        <div className="product-grid">
          {getStoredProducts()
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
    </main>
  );
}
