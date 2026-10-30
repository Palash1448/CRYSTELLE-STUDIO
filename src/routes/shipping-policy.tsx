import { createFileRoute, Link } from '@tanstack/react-router';
import { pageHead } from '@/lib/store-data';
import { seoHead } from '@/lib/seo';
import {
  Truck,
  PackageCheck,
  ShieldAlert,
  Clock,
  MapPin,
  CheckCircle2,
  Building2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const Route = createFileRoute('/shipping-policy')({
  head: () =>
    seoHead({
      title: 'Shipping & Delivery Policy',
      description:
        'Official Shipping Policy for Crystelle Studio (Udyam: UDYAM-MH-34-0059212). Learn about our dispatch timelines, fragile glass packaging, and nationwide delivery across India.',
      path: '/shipping-policy',
      breadcrumbs: [{ name: 'Shipping Policy', path: '/shipping-policy' }],
      keywords: 'crystelle studio shipping policy, candle delivery timelines India, fragile packaging shipping',
    }),
  component: ShippingPolicyPage,
});

function ShippingPolicyPage() {
  return (
    <main className="legal-page-viewport">
      <div className="container page">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Shipping & Delivery Policy</span>
        </nav>

        {/* Page Hero */}
        <header className="legal-hero">
          <div className="legal-badge">
            <Truck className="w-4 h-4 text-amber-700" />
            <span>Pan-India Reliable Dispatch & Safe Fragile Packaging</span>
          </div>
          <h1>Shipping & Delivery Policy</h1>
          <p className="legal-subtitle">
            Transparent timelines, careful hand-packaging, and insured delivery from our Pulgaon studio.
          </p>
        </header>

        {/* Studio Origin Callout */}
        <section className="legal-entity-card" aria-label="Studio Dispatch Origin">
          <div className="entity-card-header">
            <Building2 className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <h3>Handcrafted & Dispatched from Pulgaon, Maharashtra</h3>
              <p>Every candle is poured, cured, inspected, and shipped directly from our registered manufacturing unit</p>
            </div>
          </div>
          <div className="entity-details-grid">
            <div className="entity-detail-col">
              <span className="label">Manufacturing Unit</span>
              <strong>CRYSTELLE STUDIO</strong>
            </div>
            <div className="entity-detail-col">
              <span className="label">Udyam Registration</span>
              <strong className="tracking-wide">UDYAM-MH-34-0059212</strong>
            </div>
            <div className="entity-detail-col">
              <span className="label">Dispatch Studio Address</span>
              <span>Nachangaon Road, Pulgaon, Wardha, MH – 442302</span>
            </div>
            <div className="entity-detail-col">
              <span className="label">Delivery Reach</span>
              <strong>All Serviceable PIN Codes across India</strong>
            </div>
          </div>
        </section>

        {/* Legal Document Content */}
        <article className="legal-content">
          <section className="legal-section">
            <h2>1. Handcrafting & Order Processing Time</h2>
            <p>
              Unlike mass-manufactured candles sitting in warehouses for months, every candle from <strong>Crystelle Studio</strong> is hand-poured in artisanal small batches using high-purity wax blends, lead-free wicks, and concentrated botanical fragrance oils.
            </p>
            <div className="timeline-cards-grid">
              <div className="timeline-card">
                <Clock className="w-5 h-5 text-amber-700" />
                <h4>1 to 3 Business Days</h4>
                <p>Order Processing, Hand-Pouring, Quality Check & Packaging</p>
              </div>
              <div className="timeline-card">
                <Truck className="w-5 h-5 text-emerald-600" />
                <h4>3 to 7 Business Days</h4>
                <p>Courier Transit to your destination anywhere in India</p>
              </div>
            </div>
            <p className="mt-3">
              Orders placed on Sundays or gazetted public holidays are processed on the subsequent working day. During festive rush periods (such as Diwali, Christmas, or New Year), small-batch curing may occasionally require 1 additional day.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Estimated Delivery Timelines Across India</h2>
            <p>
              Once your parcel departs our studio in Pulgaon (Wardha District, Maharashtra), estimated transit durations are as follows:
            </p>
            <div className="legal-table-wrap">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Destination Region</th>
                    <th>Courier Mode</th>
                    <th>Estimated Delivery Window</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Maharashtra & Western India</strong> (Mumbai, Pune, Nagpur, Nashik, etc.)</td>
                    <td>Surface / Express Courier</td>
                    <td>2 to 4 Business Days</td>
                  </tr>
                  <tr>
                    <td><strong>Tier-1 Metro Cities</strong> (Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata)</td>
                    <td>Air / Express Surface</td>
                    <td>3 to 5 Business Days</td>
                  </tr>
                  <tr>
                    <td><strong>Rest of India</strong> (Tier-2 & Tier-3 Cities, North & South Zones)</td>
                    <td>Standard Courier Partner</td>
                    <td>4 to 7 Business Days</td>
                  </tr>
                  <tr>
                    <td><strong>Remote & North-Eastern Locations</strong></td>
                    <td>India Post Speed Post / Partner Air</td>
                    <td>6 to 10 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="legal-section">
            <h2>3. Shipping Charges & Free Delivery Threshold</h2>
            <p>We believe in transparent, upfront pricing with no hidden surprises:</p>
            <ul>
              <li>
                <strong>Free Standard Delivery:</strong> On all domestic orders with a cart value of <strong>₹999 or above</strong>.
              </li>
              <li>
                <strong>Nominal Standard Delivery:</strong> For orders below ₹999, a flat subsidized shipping fee of <strong>₹69</strong> is applied at checkout to cover protective fragile packaging and reliable courier transit.
              </li>
              <li>
                <strong>No Hidden Surcharges:</strong> The total shown at your checkout summary is the exact amount payable.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Protective & Eco-Friendly Fragile Packaging</h2>
            <p>
              We know how heartbreaking it is to receive a cracked jar. Because our glass amber vessels and soy-blend wax are delicate, we take extraordinary care in our packing ritual:
            </p>
            <div className="legal-feature-grid">
              <div className="feature-item">
                <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Heavy-duty, 3-ply and 5-ply corrugated outer boxes resistant to transit drops.</span>
              </div>
              <div className="feature-item">
                <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Recycled honeycomb cushioning paper & biodegradable shock-absorbing padding.</span>
              </div>
              <div className="feature-item">
                <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Prominent &ldquo;FRAGILE &ndash; GLASS WITH CARE&rdquo; caution labels on every parcel.</span>
              </div>
              <div className="feature-item">
                <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Temperature-conscious packing to avoid heat softening during summer transit.</span>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>5. Real-Time Tracking & Notifications</h2>
            <p>
              As soon as our courier partner scans your parcel into their network, you will receive:
            </p>
            <ul>
              <li>An automated <strong>Email & WhatsApp/SMS notification</strong> with your unique Courier Tracking Number (AWB) and direct tracking link.</li>
              <li>Live updates right inside your <Link to="/profile" className="underline font-medium">Order Details Dashboard</Link> on our website.</li>
              <li>Delivery partner alerts with estimated delivery day and courier contact details.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Transit Breakage & Damage Guarantee (100% Free Replacement)</h2>
            <div className="grievance-box">
              <div className="grievance-head">
                <ShieldAlert className="w-5 h-5 text-amber-700" />
                <div>
                  <h4>Zero-Risk Fragile Guarantee</h4>
                  <p>In the unlikely event your candle arrives damaged or shattered in transit</p>
                </div>
              </div>
              <div className="grievance-body">
                <p>
                  We stand 100% behind our craft. If courier mishandling results in a chipped glass jar, broken lid, or crushed box:
                </p>
                <ol className="list-decimal pl-5 space-y-1 mt-2 text-sm">
                  <li>Please inspect your package upon delivery.</li>
                  <li>
                    Within <strong>48 hours of delivery</strong>, take a clear photo or short unboxing video showing the damaged item and outer shipping label.
                  </li>
                  <li>
                    Send the proof via WhatsApp to{' '}
                    <a href="https://wa.me/917058398041" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
                      +91 7058398041
                    </a>{' '}
                    or email us at{' '}
                    <a href="mailto:crystellestudio.art@gmail.com" className="underline font-semibold">
                      crystellestudio.art@gmail.com
                    </a>{' '}
                    along with your Order ID.
                  </li>
                  <li>
                    <strong>We will ship a brand-new free replacement candle or issue a 100% refund immediately</strong> — without any questions or return shipping hassle for broken glass!
                  </li>
                </ol>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>7. Delivery Address & Undelivered Parcels</h2>
            <p>
              Please ensure you provide complete address details with landmark and correct 6-digit postal PIN code, along with a working mobile phone number to receive delivery OTPs.
            </p>
            <p>
              Our courier partners attempt delivery up to 3 times. If an order is returned to our Pulgaon studio due to an incorrect/incomplete address, consignee unavailability, or continuous refusal, we will contact you to arrange re-dispatch upon address verification.
            </p>
          </section>
        </article>

        {/* Quick Nav Footbar */}
        <div className="legal-quick-links">
          <Link to="/privacy-policy" className="legal-link-card">
            <span>Customer Trust</span>
            <strong>Privacy Policy</strong>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link to="/terms-and-conditions" className="legal-link-card">
            <span>Rules & Terms</span>
            <strong>Terms & Conditions</strong>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link to="/contact" className="legal-link-card">
            <span>Questions on Shipping?</span>
            <strong>Contact Support</strong>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </div>
    </main>
  );
}
