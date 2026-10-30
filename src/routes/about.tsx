import { createFileRoute } from '@tanstack/react-router';
import { ambience } from '@/lib/store-data';
import { Benefits } from '@/components/storefront';
import { seoHead, buildOrganizationSchema } from '@/lib/seo';

export const Route = createFileRoute('/about')({
  head: () =>
    seoHead({
      title: 'Our Story & Artisanal Philosophy — Handcrafted Candles',
      description:
        'Meet Crystelle Studio. Handcrafting botanical soy candles in Pulgaon, Wardha, Maharashtra. Made slowly with pure plant wax, clean aroma oils, and sustainable craftsmanship.',
      path: '/about',
      breadcrumbs: [{ name: 'About Us', path: '/about' }],
      keywords:
        'about Crystelle Studio, artisanal candle maker Maharashtra, handcrafted soy wax candles India, botanical candle studio Pulgaon, sustainable candle brand',
      schemas: [
        buildOrganizationSchema(),
        {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Crystelle Studio',
          description:
            'The artisanal story and handcrafted philosophy of Crystelle Studio candle makers in Maharashtra, India.',
        },
      ],
    }),
  component: About,
});

function About() {
  return (
    <main>
      <div className="container page">
        <section className="about-intro">
          <div className="eyebrow">The heart behind the glow</div>
          <h1>About Crystelle Studio</h1>
          <p>
            We believe in the power of slow, mindful moments.
            <br />
            Every single candle is hand-poured with love and patience in our Maharashtra workshop,
            <br />
            bringing warmth, calmness, and natural beauty into your everyday spaces.
          </p>
        </section>

        <div className="stats">
          <div>
            <strong>100%</strong>
            <p>Hand-Poured Botanical Wax</p>
          </div>
          <div>
            <strong>10K+</strong>
            <p>Homes Illuminated</p>
          </div>
          <div>
            <strong>50+</strong>
            <p>Bespoke Scent Profiles</p>
          </div>
        </div>

        <img
          className="about-image"
          src={ambience}
          alt="Hand-poured Crystelle Studio botanical candles arranged on a rustic wooden tray"
          width={1024}
          height={512}
        />

        <section className="about-intro">
          <h2 className="text-4xl">Thoughtfully made, beautifully simple.</h2>
          <p>
            From the initial wick centering to the curing and gentle hand labeling, we obsess over
            every step of the candle-making craft. We use exclusively renewable plant waxes, IFRA-certified
            fragrance oils, and reusable glass vessels designed to be cherished long after the final burn.
          </p>
        </section>
      </div>

      <Benefits />
    </main>
  );
}
