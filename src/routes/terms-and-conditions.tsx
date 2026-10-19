import { createFileRoute, Link } from '@tanstack/react-router';
import { pageHead } from '@/lib/store-data';
import { Scale, Building2, Flame, ShieldAlert, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Route = createFileRoute('/terms-and-conditions')({
  head: () =>
    pageHead(
      'Terms and Conditions | Crystelle Studio',
      'Official Terms and Conditions for Crystelle Studio (Udyam: UDYAM-MH-34-0059212). Operating terms, handcrafted product disclosures, candle safety, and governing laws.'
    ),
  component: TermsAndConditionsPage,
});

function TermsAndConditionsPage() {
  return (
    <main className="legal-page-viewport">
      <div className="container page">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Terms and Conditions</span>
        </nav>

        {/* Page Hero */}
        <header className="legal-hero">
          <div className="legal-badge">
            <Scale className="w-4 h-4 text-amber-700" />
            <span>Official Operating Terms & Patron Agreement</span>
          </div>
          <h1>Terms and Conditions</h1>
          <p className="legal-subtitle">
            Effective Date: October 15, 2026 • Official agreement with <strong>Crystelle Studio</strong>
          </p>
        </header>

        {/* Enterprise Registration Transparency Banner */}
        <section className="legal-entity-card" aria-label="Operating Legal Entity">
          <div className="entity-card-header">
            <Building2 className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <h3>Enterprise Identification & Commercial Details</h3>
              <p>Registered Micro Enterprise under Ministry of MSME, Government of India</p>
            </div>
          </div>
          <div className="entity-details-grid">
            <div className="entity-detail-col">
              <span className="label">Commercial Trade Name</span>
              <strong>CRYSTELLE STUDIO</strong>
            </div>
            <div className="entity-detail-col">
              <span className="label">Proprietor</span>
              <strong>Kartiki Vinodrao Chaudhari</strong>
            </div>
            <div className="entity-detail-col">
              <span className="label">Udyam Registration</span>
              <strong className="tracking-wide">UDYAM-MH-34-0059212</strong>
            </div>
            <div className="entity-detail-col">
              <span className="label">Legal Jurisdiction</span>
              <strong>Wardha, Maharashtra, India</strong>
            </div>
          </div>
        </section>

        {/* Legal Document Content */}
        <article className="legal-content">
          <section className="legal-section">
            <h2>1. Binding Agreement & Eligibility</h2>
            <p>
              These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and purchase of handcrafted candles, home fragrances, and related lifestyle items from the official website operated by <strong>Crystelle Studio</strong> (&ldquo;Studio&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), a sole proprietorship founded by <strong>Kartiki Vinodrao Chaudhari</strong>.
            </p>
            <p>
              By browsing this website, registering an account, or placing an order, you confirm that you are at least 18 years old (or possess legal parental/guardian consent) and agree to be bound by these Terms, our <Link to="/privacy-policy" className="underline">Privacy Policy</Link>, and our <Link to="/shipping-policy" className="underline">Shipping Policy</Link>. If you do not agree with any part of these Terms, please do not use our services.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Handcrafted & Artisanal Nature of Goods</h2>
            <p>
              Every single candle produced at Crystelle Studio is meticulously hand-poured in small batches in Pulgaon, Maharashtra.
            </p>
            <ul>
              <li>
                <strong>Natural Botanical Variations:</strong> Because we use pure botanical waxes (such as natural soy, coconut, or beeswax blends) and concentrated fragrance oils, minor surface variations, slight color deviations, subtle frosting, or tiny air bubbles are natural hallmarks of hand-poured artisan craftsmanship and are not manufacturing flaws.
              </li>
              <li>
                <strong>Photography & Display:</strong> We endeavor to display the color, texture, and container dimensions of our products as accurately as possible. However, individual screen display calibrations may exhibit slight differences.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Mandatory Candle Fire Safety & Usage Terms</h2>
            <div className="grievance-box">
              <div className="grievance-head">
                <Flame className="w-5 h-5 text-amber-700" />
                <div>
                  <h4>Essential Candle Safety Disclaimer</h4>
                  <p>Candles involve an open flame. Strict adherence to these safety rules is a condition of purchase.</p>
                </div>
              </div>
              <div className="grievance-body">
                <p>When purchasing or burning any Crystelle Studio candle, you explicitly agree to follow all candle care protocols:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div className="feature-item">
                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                    <span><strong>Trim the Wick:</strong> Always trim the cotton wick to 5mm (1/4 inch) before every lighting to prevent excessive flame or soot.</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                    <span><strong>Never Leave Unattended:</strong> Extinguish candles completely whenever you leave the room or retire for sleep.</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                    <span><strong>Heat-Safe Surface:</strong> Always place your candle on a flat, heat-resistant, level surface away from curtains, papers, and drafts.</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                    <span><strong>Keep Away from Children & Pets:</strong> Ensure burning candles are positioned well out of reach of curious hands and paws.</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                    <span><strong>Burn Time Limit:</strong> Do not burn any candle continuously for more than 4 hours at a single stretch.</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                    <span><strong>End of Life:</strong> Stop burning when approximately 10mm (1/2 inch) of un-melted wax remains at the bottom of the container.</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  <em>Disclaimer: Crystelle Studio and its proprietor shall not be held liable for personal injury, property damage, or fire hazards resulting from failure to adhere to standard candle burning safety guidelines.</em>
                </p>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>4. Pricing, Currency & Order Acceptance</h2>
            <ul>
              <li>All prices displayed on this website are in <strong>Indian Rupees (INR &ndash; ₹)</strong>.</li>
              <li>We reserve the right to revise product prices, launch seasonal scents, or modify bundle offerings without prior notice.</li>
              <li>Placing an order constitutes an offer to purchase. Order confirmation emails or notifications indicate receipt of your request. In rare cases of inventory shortage, unexpected material supply delay, or inadvertent typographical errors in pricing, we reserve the right to decline or cancel an order, in which case a 100% full refund is issued immediately.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Order Cancellations & Replacement Policy</h2>
            <p>
              We want your experience with Crystelle Studio to be entirely delightful:
            </p>
            <ul>
              <li>
                <strong>Cancellation Before Dispatch:</strong> You may cancel an order free of charge by contacting us via WhatsApp (+91 7058398041) or email before your package has been handed over to the courier. A full refund will be processed back to your original payment method.
              </li>
              <li>
                <strong>After Courier Dispatch:</strong> Once a courier shipping label has been generated and the parcel has left our studio, orders cannot be cancelled mid-transit.
              </li>
              <li>
                <strong>Hygiene & Safety Considerations:</strong> Due to the personal aroma nature and fire-safety properties of handcrafted wax products, items that have been lit, burned, or used cannot be returned or refunded.
              </li>
              <li>
                <strong>Transit Breakage Guarantee:</strong> If any candle arrives broken or damaged during courier transit, please notify us within 48 hours of delivery with photos/video, and we will send a 100% free replacement immediately as outlined in our <Link to="/shipping-policy" className="underline">Shipping Policy</Link>.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Intellectual Property Rights</h2>
            <p>
              The names <strong>Crystelle</strong> and <strong>Crystelle Studio</strong>, along with our brand logos, product names, bespoke fragrance blend formulations, product photographs, graphics, editorial articles, and website code, are the proprietary intellectual property of <strong>Kartiki Vinodrao Chaudhari</strong> / Crystelle Studio.
            </p>
            <p>
              No portion of this website or our branding may be copied, reproduced, repackaged, or exploited for commercial purposes without prior written authorization.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Governing Law & Dispute Jurisdiction</h2>
            <p>
              These Terms, transactions, and any dispute or claim arising out of or in connection with them shall be governed by, construed, and enforced exclusively in accordance with the substantive laws of <strong>India</strong>.
            </p>
            <p>
              In the event of any legal proceeding or dispute that cannot be amicably resolved through mutual dialogue, the courts located in <strong>Wardha, Maharashtra, India</strong> shall have sole and exclusive territorial jurisdiction.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Official Communication & Grievance Redressal</h2>
            <p>For any legal notices, queries regarding these terms, or bulk corporate partnerships, please contact:</p>
            <div className="p-4 bg-secondary/50 rounded-lg border text-sm space-y-1">
              <p><strong>Crystelle Studio (Proprietor: Kartiki Vinodrao Chaudhari)</strong></p>
              <p>Udyam Registration: UDYAM-MH-34-0059212</p>
              <p>Address: Ward No 13, Shastri Nagar, Nachangaon Road, Pulgaon, Dist. Wardha, Maharashtra – 442302</p>
              <p>Email: <a href="mailto:crystellestudio.art@gmail.com" className="underline">crystellestudio.art@gmail.com</a></p>
              <p>Phone / WhatsApp: <a href="tel:+917058398041" className="underline">+91 7058398041</a></p>
            </div>
          </section>
        </article>

        {/* Quick Nav Footbar */}
        <div className="legal-quick-links">
          <Link to="/privacy-policy" className="legal-link-card">
            <span>Customer Trust</span>
            <strong>Privacy Policy</strong>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link to="/shipping-policy" className="legal-link-card">
            <span>Delivery & Packaging</span>
            <strong>Shipping Policy</strong>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link to="/contact" className="legal-link-card">
            <span>Direct Inquiry</span>
            <strong>Contact Our Studio</strong>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </div>
    </main>
  );
}
