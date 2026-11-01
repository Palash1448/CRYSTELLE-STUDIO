import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Play, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { money, getStoredProducts, type Product } from '@/lib/store-data';
import { seoHead } from '@/lib/seo';
import { fetchFirestoreProducts, fetchFirestoreProductById } from '@/lib/firestore-service';
import { Quantity, DetailBenefits, useStore, ProductCard } from '@/components/storefront';
import { CldImage } from '@/lib/cloudinary';

/**
 * Robust helper to match a product in a collection by exact id, lowercase id,
 * URL-decoded id, sanitized alphanumeric slug, or slugified product name.
 */
function findProductInList(list: any[] | undefined | null, slug: string | undefined): Product | null {
  if (!Array.isArray(list) || !slug) return null;
  const rawSlug = String(slug).trim();
  const decodedSlug = decodeURIComponent(rawSlug).trim();
  const cleanLower = rawSlug.toLowerCase();
  const decodedLower = decodedSlug.toLowerCase();
  const normSlug = cleanLower.replace(/[^a-z0-9]/g, '');

  return (
    list.find((p) => {
      if (!p) return false;
      const pId = String(p.id || '').trim();
      if (pId === rawSlug || pId === decodedSlug) return true;

      const pIdLower = pId.toLowerCase();
      if (pIdLower === cleanLower || pIdLower === decodedLower) return true;
      if (pIdLower.replace(/[^a-z0-9]/g, '') === normSlug) return true;

      if (p.name) {
        const nameSlug = String(p.name)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        if (
          nameSlug === cleanLower ||
          nameSlug === decodedLower ||
          nameSlug.replace(/-/g, '') === normSlug
        ) {
          return true;
        }
      }
      return false;
    }) || null
  );
}

export const Route = createFileRoute('/product/$slug')({
  loader: async ({ params }) => {
    const slug = params.slug;

    // 1. Check local / stored products
    let p = findProductInList(getStoredProducts(), slug);

    // 2. If not found, try direct Firestore document lookup
    if (!p) {
      try {
        p = await fetchFirestoreProductById(slug);
      } catch {}
    }

    // 3. Fallback: search across all Firestore products
    if (!p) {
      try {
        const remote = await fetchFirestoreProducts();
        p = findProductInList(remote, slug);
      } catch {}
    }

    // Return product if found, or null without throwing notFound()
    // so the client component hydrates seamlessly and can resolve from browser storage
    return p || null;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return seoHead({
        title: 'Handcrafted Scented Candle — Crystelle Studio',
        description: 'Explore the Crystelle Studio collection of handcrafted artisanal soy wax candles.',
        path: `/product/${params.slug}`,
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
      keywords: `${loaderData.name}, ${loaderData.category}, ${loaderData.fragrance || ''} candle, handcrafted candles India, soy wax candle`,
    });
  },
  component: ProductPage,
});

function ProductPage() {
  const loaderProduct = Route.useLoaderData();
  const { slug } = Route.useParams();
  const { products: storeProducts, add } = useStore();
  const navigate = useNavigate();

  // Initialize product from loader, store context, or localStorage
  const [product, setProduct] = useState<any>(() => {
    if (loaderProduct) return loaderProduct;
    const fromStore = findProductInList(storeProducts, slug);
    if (fromStore) return fromStore;
    const fromLocal = findProductInList(getStoredProducts(), slug);
    return fromLocal || null;
  });

  const [isLoading, setIsLoading] = useState(() => !loaderProduct && !product);
  const [quantity, setQuantity] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<'image' | 'video'>('image');
  const [activeImage, setActiveImage] = useState<string>(
    () => product?.image || '/hero-candle.jpg'
  );

  // Sync activeImage whenever product is loaded or changes
  useEffect(() => {
    if (product?.image && (!activeImage || activeImage === '/hero-candle.jpg')) {
      setActiveImage(product.image);
    }
  }, [product, activeImage]);

  // Attempt client-side resolution if product was not resolved during SSR
  useEffect(() => {
    if (product) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    // 1. Check current store context
    let found = findProductInList(storeProducts, slug);

    // 2. Check localStorage
    if (!found) {
      found = findProductInList(getStoredProducts(), slug);
    }

    if (found) {
      if (isMounted) {
        setProduct(found);
        setActiveImage(found.image || '/hero-candle.jpg');
        setIsLoading(false);
      }
      return;
    }

    // 3. Fetch from Firestore by ID directly
    fetchFirestoreProductById(slug)
      .then((remote) => {
        if (!isMounted) return;
        if (remote) {
          setProduct(remote);
          setActiveImage(remote.image || '/hero-candle.jpg');
          setIsLoading(false);
        } else {
          // 4. Fallback: query full Firestore collection
          fetchFirestoreProducts().then((allRemote) => {
            if (!isMounted) return;
            const match = findProductInList(allRemote, slug);
            if (match) {
              setProduct(match);
              setActiveImage(match.image || '/hero-candle.jpg');
            }
            setIsLoading(false);
          });
        }
      })
      .catch((err) => {
        console.warn('Client product lookup error:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug, storeProducts, product]);

  // While checking / loading
  if (isLoading && !product) {
    return (
      <main className="container page min-h-[60vh] flex flex-col items-center justify-center py-24 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#C59A44] border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wider text-[#78716C] uppercase">
          Loading Handcrafted Candle...
        </p>
      </main>
    );
  }

  // If exhausted and candle truly does not exist
  if (!product) {
    return (
      <main className="container page min-h-[60vh] flex flex-col items-center justify-center py-20 text-center">
        <div className="max-w-md mx-auto">
          <span className="text-4xl mb-4 inline-block">🕯️</span>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917] mb-2">Candle Not Found</h1>
          <p className="text-sm text-[#78716C] mb-6">
            The artisanal candle you are looking for may have been retired or moved to a new collection.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="rounded-full px-6 py-2.5">
              <Link to="/shop">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Browse All Candles
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6 py-2.5">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const allImages = Array.from(
    new Set([product.image, ...(Array.isArray(product.gallery) ? product.gallery : [])].filter(Boolean))
  );

  const price = product.price || 0;
  const currentImage = activeImage || product.image || '/hero-candle.jpg';

  // Related products from store or localStorage
  const availableProducts = storeProducts && storeProducts.length > 0 ? storeProducts : getStoredProducts();
  const related = availableProducts
    .filter((p) => p && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="container page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/shop" search={{ category: product.category }}>
          {product.category || 'Candles'}
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
                src={currentImage}
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

          {/* Media Thumbnails (All Uploaded Images & Video) */}
          <div className="thumbnails mt-3 flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {allImages.map((imgUrl, index) => (
              <Button
                key={`${imgUrl}-${index}`}
                variant="outline"
                className={`thumbnail relative p-0 overflow-hidden rounded-xl border shrink-0 transition-all ${
                  selectedMedia === 'image' && currentImage === imgUrl
                    ? 'border-[#C59A44] ring-2 ring-[#C59A44]/30'
                    : 'border-[#EAE4DC] hover:border-[#C59A44]/50'
                }`}
                aria-label={`View product photo ${index + 1}`}
                onClick={() => {
                  setSelectedMedia('image');
                  setActiveImage(imgUrl);
                }}
              >
                <CldImage
                  src={imgUrl}
                  alt={`${product.name} angle ${index + 1}`}
                  width={70}
                  height={70}
                  className="w-full h-full object-cover"
                />
              </Button>
            ))}

            {/* Video Showcase Thumbnail (If Available on Cloudinary) */}
            {product.video && (
              <Button
                variant="outline"
                className={`thumbnail relative p-0 overflow-hidden rounded-xl border flex flex-col items-center justify-center bg-black/5 text-[#1C1917] shrink-0 transition-all ${
                  selectedMedia === 'video'
                    ? 'border-[#C59A44] ring-2 ring-[#C59A44]/30'
                    : 'border-[#EAE4DC] hover:border-[#C59A44]/50'
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

          <p className="option-label">Quantity</p>
          <Quantity value={quantity} onChange={setQuantity} />

          <div className="purchase-actions">
            <Button onClick={() => add(product.id, 0, quantity)}>
              Add to Cart
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                add(product.id, 0, quantity);
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
            <p>{product.notes || 'Natural botanical extracts with delicate fragrance oils.'}</p>
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
      {related.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <h2>You May Also Love</h2>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
