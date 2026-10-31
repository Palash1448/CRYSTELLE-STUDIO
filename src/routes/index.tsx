import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Benefits, ProductCard, ArrowRight, useStore } from "@/components/storefront";
import { hero, ambience, categories, getStoredProducts } from "@/lib/store-data";
import { getStoredBannerSettings, BannerSettings } from "@/lib/admin-data";
import { seoHead, buildOrganizationSchema, buildWebSiteSchema } from "@/lib/seo";

const HOME_FAQS = [
  {
    question: "What wax does Crystelle Studio use in its handcrafted candles?",
    answer: "Every Crystelle Studio candle is lovingly hand-poured using 100% natural botanical soy and plant waxes, blended with IFRA-compliant fragrance oils and lead-free cotton wicks for a clean, non-toxic, and soot-free burn.",
  },
  {
    question: "How long does a Crystelle Studio jar candle burn?",
    answer: "Our standard 200g jar candles deliver approximately 40 to 50 hours of clean burn time, while our larger 350g luxury candles burn for up to 70 hours when properly trimmed to 5mm before each lighting.",
  },
  {
    question: "Do you offer nationwide delivery across India?",
    answer: "Yes, we safely dispatch handcrafted candles nationwide across India from our studio in Pulgaon, Maharashtra. We provide free doorstep delivery on all orders over ₹999.",
  },
  {
    question: "Can I order customized candle gift sets for weddings or corporate events?",
    answer: "Yes! Crystelle Studio specializes in bespoke wedding favors, festival hampers, and personalized bulk corporate gifting with custom fragrance curation and branded packaging.",
  },
];

export const Route = createFileRoute("/")({
  head: () =>
    seoHead({
      title: "Handcrafted Luxury Scented Candles & Home Fragrances",
      description:
        "Shop premium handcrafted scented candles, botanical soy wax jar candles, and luxury gift sets in India. Clean-burning, non-toxic, and artisanally poured in Maharashtra.",
      path: "/",
      schemas: [buildOrganizationSchema(), buildWebSiteSchema()],
      faqs: HOME_FAQS,
    }),
  component: Index,
});

function Index() {
  const { products: storeProducts } = useStore();
  const activeProducts =
    storeProducts && storeProducts.length > 0 ? storeProducts : getStoredProducts();

  const [banner, setBanner] = useState<BannerSettings>(getStoredBannerSettings);

  useEffect(() => {
    const handleUpdate = () => setBanner(getStoredBannerSettings());
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('crystelle_banner_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('crystelle_banner_updated', handleUpdate);
    };
  }, []);

  return (
    <main>
      {banner.isActive && (
        <section className="hero">
          <img
            src={banner.imageUrl || hero}
            alt={(banner.title || 'Crystelle Studio Handcrafted Candles').replace(/\n/g, ' ')}
            width={1536}
            height={1024}
            fetchPriority="high"
          />
          <div className="hero-copy">
            {banner.eyebrow && <div className="eyebrow">{banner.eyebrow}</div>}
            <h1 className="whitespace-pre-line">{banner.title}</h1>
            <p className="whitespace-pre-line">{banner.subtitle}</p>
            <div className="hero-actions">
              <Button asChild className="shop-button">
                <Link to={banner.buttonLink || "/shop"}>
                  {banner.buttonText || "Shop Now"} <ArrowRight />
                </Link>
              </Button>
              {banner.secondaryText && (
                <Link className="underlined" to={banner.secondaryLink || "/collections"}>
                  {banner.secondaryText}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      <Benefits />

      <div className="container">
        {/* Category Navigation Section */}
        <section className="section" aria-labelledby="category-heading">
          <div className="section-heading">
            <div>
              <h2 id="category-heading">Shop Handcrafted Candles by Category</h2>
              <p>Discover our range of handmade scented candles, classic jars, and artisanal accessories.</p>
            </div>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <Link
                to="/shop"
                search={{ category: category.name }}
                key={category.name}
                className="category-tile"
              >
                <img
                  src={category.image}
                  alt={`${category.name} — Handcrafted Crystelle Studio Collection`}
                  width={512}
                  height={512}
                  loading="lazy"
                />
                <div className="category-caption">
                  <h3>{category.name}</h3>
                  <p>
                    Shop Now <ArrowRight size={13} />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Best Sellers Section */}
        <section className="section" aria-labelledby="bestsellers-heading">
          <div className="section-heading">
            <div>
              <h2 id="bestsellers-heading">Best Selling Handcrafted Candles</h2>
              <p>Loved by candle lovers across India for long-lasting aroma &amp; clean burn</p>
            </div>
            <Link to="/shop" className="view-link">
              View All <ArrowRight size={15} />
            </Link>
          </div>
          <div className="product-grid">
            {activeProducts.length === 0 ? (
              <div className="col-span-full py-10 text-center text-[#78716C] bg-[#FAF8F5] rounded-3xl border border-[#EAE4DC] p-8">
                <p className="text-base font-serif italic text-[#1C1917] mb-1">
                  New Handcrafted Botanical Candles Coming Soon
                </p>
                <p className="text-xs text-[#78716C]">
                  Our artisans in Pulgaon are preparing fresh small-batch collections. Stay tuned!
                </p>
              </div>
            ) : (
              activeProducts.slice(0, 4).map((p) => <ProductCard product={p} key={p.id} />)
            )}
          </div>
        </section>

        {/* Search Engine Optimized FAQ Section */}
        <section className="section border-t border-[#EAE4DC] pt-12 pb-4" aria-labelledby="faq-heading">
          <div className="section-heading text-center max-w-2xl mx-auto mb-8">
            <h2 id="faq-heading" className="text-3xl font-serif text-[#1C1917]">
              Frequently Asked Questions
            </h2>
            <p className="text-[#78716C] text-sm mt-2">
              Learn about our clean-burning botanicals, scent profiles, and nationwide candle delivery.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-[#EAE4DC] bg-[#FAF8F5]/80 rounded-3xl p-6 sm:p-8 border border-[#EAE4DC]">
            {HOME_FAQS.map((faq, i) => (
              <details key={i} className="group py-4 first:pt-0 last:pb-0">
                <summary className="flex justify-between items-center cursor-pointer list-none font-medium text-[#1C1917] group-open:text-[#A67C2E] transition-colors">
                  <span className="text-base pr-4">{faq.question}</span>
                  <span className="text-[#A67C2E] font-serif text-xl group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-[#57534E] leading-relaxed pl-1">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>

      {/* Brand Story Section */}
      <section className="home-story">
        <div className="home-story-copy">
          <div className="eyebrow">Made slowly. Loved deeply.</div>
          <h2>A natural glow that feels like home.</h2>
          <p>
            We believe in the power of quiet everyday rituals. Each Crystelle Studio candle is
            handcrafted with pure plant waxes and therapeutic aroma notes in Pulgaon, Maharashtra,
            bringing gentle warmth, mindfulness, and timeless luxury into your personal space.
          </p>
          <Button asChild variant="outline">
            <Link to="/about">
              Our Story <ArrowRight />
            </Link>
          </Button>
        </div>
        <img
          src={ambience}
          alt="Artisanal hand-poured candles on a warm wooden tray in a cozy living room"
          width={512}
          height={512}
          loading="lazy"
        />
      </section>
    </main>
  );
}
