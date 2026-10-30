import { createFileRoute, Link } from '@tanstack/react-router';
import { pageHead } from '@/lib/store-data';
import { seoHead } from '@/lib/seo';
import { ShieldCheck, Mail, Phone, MapPin, Building2, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/privacy-policy')({
  head: () =>
    seoHead({
      title: 'Privacy Policy',
      description:
        'Official Privacy Policy for Crystelle Studio (Udyam: UDYAM-MH-34-0059212). Learn how we protect your personal customer data and payment transactions.',
      path: '/privacy-policy',
      breadcrumbs: [{ name: 'Privacy Policy', path: '/privacy-policy' }],
      keywords: 'crystelle studio privacy policy, customer data protection, e-commerce privacy India',
    }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <main className="legal-page-viewport">
      <div className="container page">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Privacy Policy</span>
        </nav>

        {/* Page Hero */}
        <header className="legal-hero">
          <div className="legal-badge">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Government of India MSME Registered Enterprise</span>
          </div>
          <h1>Privacy Policy</h1>
          <p className="legal-subtitle">
            Last Updated: October 15, 2026 • Official policy of <strong>Crystelle Studio</strong>
          </p>
        </header>

        {/* Enterprise Registration Transparency Banner */}
        <section className="legal-entity-card" aria-label="Official Enterprise Details">
          <div className="entity-card-header">
            <Building2 className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <h3>Official Legal Entity Identification</h3>
              <p>Registered under the Ministry of Micro, Small and Medium Enterprises (MSME), Government of India</p>
            </div>
          </div>
          <div className="entity-details-grid">
            <div className="entity-detail-col">
              <span className="label">Enterprise Name</span>
              <strong>CRYSTELLE STUDIO</strong>
            </div>
            <div className="entity-detail-col">
              <span className="label">Proprietor / Owner</span>
              <strong>Kartiki Vinodrao Chaudhari</strong>
            </div>
            <div className="entity-detail-col">
              <span className="label">Udyam Registration No.</span>
              <strong className="tracking-wide">UDYAM-MH-34-0059212</strong>
            </div>
            <div className="entity-detail-col">
              <span className="label">Registered Studio Location</span>
              <span>Pulgaon, Dist. Wardha, Maharashtra – 442302</span>
            </div>
          </div>
        </section>

        {/* Legal Document Content */}
        <article className="legal-content">
          <section className="legal-section">
            <h2>1. Introduction & Overview</h2>
            <p>
              Welcome to <strong>Crystelle Studio</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), a handcrafted candle manufacturing micro-enterprise founded by <strong>Kartiki Vinodrao Chaudhari</strong> and officially registered with the Ministry of MSME, Government of India (Udyam Registration: <code>UDYAM-MH-34-0059212</code>).
            </p>
            <p>
              We are committed to respecting and protecting your privacy. This Privacy Policy details how we collect, handle, store, and safeguard your personal information when you visit our website, explore our handcrafted artisanal collections, or purchase products from us.
            </p>
            <p>
              By accessing or using our services, you agree to the collection and use of information in accordance with this policy and Indian data privacy standards, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act (DPDP Act).
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            <p>To provide smooth order fulfillment and support, we collect the following types of information:</p>
            <ul>
              <li>
                <strong>Contact Information:</strong> Full name, email address, mobile phone number, and delivery addresses (street, city, state, postal PIN code, country).
              </li>
              <li>
                <strong>Order & Purchase Details:</strong> Candle products purchased, quantities, container sizes, total order amounts, delivery tracking numbers, and order history.
              </li>
              <li>
                <strong>Payment Information:</strong> All online payments are handled securely through RBI-authorized, PCI-DSS compliant third-party payment gateways. <em>We never store, see, or have access to your confidential payment card numbers, CVVs, net-banking passwords, or UPI PINs.</em>
              </li>
              <li>
                <strong>Technical & Browsing Data:</strong> IP address, device type, operating system, browser type, and essential cookies used to maintain your shopping cart and user session.
              </li>
              <li>
                <strong>Customer Inquiries & Communications:</strong> Records of communications when you contact our studio via WhatsApp, phone, email, or our contact form for inquiries, feedback, or custom gift orders.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use your personal data strictly for legitimate business and fulfillment purposes:</p>
            <div className="legal-feature-grid">
              <div className="feature-item">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Processing and handcrafting your candle orders from our Pulgaon studio.</span>
              </div>
              <div className="feature-item">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Generating courier waybills and dispatching parcels safely to your doorstep.</span>
              </div>
              <div className="feature-item">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transmitting order confirmations, tracking codes, and delivery notifications via SMS, WhatsApp, or email.</span>
              </div>
              <div className="feature-item">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Responding promptly to customer service requests, returns, or transit damage replacements.</span>
              </div>
              <div className="feature-item">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Maintaining accounting records and fulfilling legal obligations under Indian tax and commercial laws.</span>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>4. Information Sharing & Third-Party Disclosure</h2>
            <p>
              <strong>We respect your trust. We do NOT sell, rent, or trade your personal information to third-party data brokers, marketers, or advertisers under any circumstances.</strong>
            </p>
            <p>Your details are shared solely with verified service partners necessary for fulfilling your order:</p>
            <ul>
              <li>
                <strong>Logistics & Courier Partners:</strong> Third-party couriers (such as Delhivery, DTDC, Blue Dart, or India Post) receive your name, address, and phone number solely for physical parcel delivery.
              </li>
              <li>
                <strong>Payment Gateways:</strong> Secure transaction processors that facilitate encrypted payments in compliance with RBI regulations.
              </li>
              <li>
                <strong>Legal Compliance:</strong> If required by Indian law enforcement, court order, or governmental authorities to comply with applicable statutory requirements.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Data Security & Storage</h2>
            <p>
              We implement industry-standard 256-bit SSL (Secure Socket Layer) encryption for all data transmitted between your browser and our servers. Access to customer contact information is restricted strictly to authorized studio staff members handling packaging and dispatch.
            </p>
            <p>
              While no transmission over the internet is 100% impenetrable, we continually review and strengthen our technical and physical safeguards to prevent unauthorized access or disclosure.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Cookies & Session Storage</h2>
            <p>
              Our website uses basic functional cookies and browser storage (such as <code>localStorage</code>) to:
            </p>
            <ul>
              <li>Retain items in your shopping bag as you browse between fragrance pages.</li>
              <li>Remember your logged-in profile session so you do not need to re-enter your delivery address with every order.</li>
              <li>Save your favorite candle wishlists.</li>
            </ul>
            <p>You can choose to disable cookies through your browser settings; however, certain shopping cart features may not function properly without them.</p>
          </section>

          <section className="legal-section">
            <h2>7. Your Rights & Choices</h2>
            <p>As a valued patron, you have the right to:</p>
            <ul>
              <li>Access, review, and update your personal address or contact information at any time via your <Link to="/profile" className="underline font-medium">Profile Dashboard</Link>.</li>
              <li>Request correction or deletion of your account information by emailing us at <a href="mailto:crystellestudio.art@gmail.com" className="underline font-medium">crystellestudio.art@gmail.com</a>.</li>
              <li>Opt-out of any non-transactional marketing messages or promotional newsletters.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. Grievance Officer & Statutory Contact Details</h2>
            <p>
              In accordance with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act:
            </p>
            <div className="grievance-box">
              <div className="grievance-head">
                <FileText className="w-5 h-5 text-amber-700" />
                <div>
                  <h4>Designated Grievance Officer</h4>
                  <p>For any privacy inquiries, data requests, or complaints</p>
                </div>
              </div>
              <div className="grievance-body">
                <p><strong>Officer Name:</strong> Kartiki Vinodrao Chaudhari</p>
                <p><strong>Designation:</strong> Founder & Proprietor, Crystelle Studio</p>
                <p><strong>Udyam Registration:</strong> UDYAM-MH-34-0059212</p>
                <p>
                  <strong>Registered Office Address:</strong> Ward No 13, Shastri Nagar, Nachangaon Road, Pulgaon, Block: Deoli, District: Wardha, Maharashtra – 442302, India
                </p>
                <p>
                  <strong>Official Email:</strong>{' '}
                  <a href="mailto:crystellestudio.art@gmail.com" className="underline">
                    crystellestudio.art@gmail.com
                  </a>
                </p>
                <p>
                  <strong>Direct Phone / WhatsApp:</strong>{' '}
                  <a href="tel:+917058398041" className="underline">
                    +91 7058398041
                  </a>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  We acknowledge grievances within 24 to 48 business hours and endeavor to resolve all concerns within 15 working days.
                </p>
              </div>
            </div>
          </section>
        </article>

        {/* Quick Nav Footbar */}
        <div className="legal-quick-links">
          <Link to="/shipping-policy" className="legal-link-card">
            <span>Next Policy</span>
            <strong>Shipping & Delivery Policy</strong>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link to="/terms-and-conditions" className="legal-link-card">
            <span>Legal Agreement</span>
            <strong>Terms & Conditions</strong>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link to="/contact" className="legal-link-card">
            <span>Need Help?</span>
            <strong>Contact Our Studio</strong>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </div>
    </main>
  );
}
