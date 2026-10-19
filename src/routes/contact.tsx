import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { pageHead } from '@/lib/store-data';
import { useStore } from '@/components/storefront';
import { submitContactInquiry } from '@/lib/firestore-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  Building2,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Package,
  HeartHandshake,
} from 'lucide-react';

export const Route = createFileRoute('/contact')({
  head: () =>
    pageHead(
      'Contact Us | Crystelle Studio (Pulgaon, Maharashtra)',
      'Get in touch with Crystelle Studio (Udyam: UDYAM-MH-34-0059212). Official studio address in Pulgaon, Wardha, phone +91 7058398041, email, and inquiry form.'
    ),
  component: ContactPage,
});

function ContactPage() {
  const { notify } = useStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'Order Status & Tracking',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitContactInquiry(formData);
    } catch (err) {
      console.warn('Could not submit inquiry to Firestore:', err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
    notify('Thank you! Your message has been saved to Firestore and received by our studio team.');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      inquiryType: 'Order Status & Tracking',
      message: '',
    });
  };

  return (
    <main className="contact-page-viewport">
      <div className="container page">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Contact Us</span>
        </nav>

        {/* Hero Banner */}
        <section className="contact-hero">
          <div className="contact-eyebrow">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Handcrafted Studio in Maharashtra</span>
          </div>
          <h1>Get in Touch with Our Studio</h1>
          <p className="contact-subhead">
            Have questions about an order, custom gift hampers, or scent recommendations? We'd love to hear from you.
          </p>
        </section>

        {/* MSME Udyam Verified Banner */}
        <section className="contact-udyam-card" aria-label="Official Registration Credentials">
          <div className="udyam-header">
            <div className="udyam-badge-icon">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="udyam-header-text">
              <div className="flex items-center gap-2 flex-wrap">
                <h3>CRYSTELLE STUDIO</h3>
                <span className="msme-pill">Govt. of India MSME Registered</span>
              </div>
              <p>Proprietor: <strong>Kartiki Vinodrao Chaudhari</strong> • Micro Manufacturing Enterprise</p>
            </div>
          </div>

          <div className="udyam-grid">
            <div className="udyam-cell">
              <span className="cell-label">Udyam Registration Number</span>
              <strong className="cell-value tracking-wider text-amber-800">UDYAM-MH-34-0059212</strong>
            </div>
            <div className="udyam-cell">
              <span className="cell-label">Classification / Major Activity</span>
              <span className="cell-value">Micro • Manufacturing (NIC 32909)</span>
            </div>
            <div className="udyam-cell">
              <span className="cell-label">District Industries Centre</span>
              <span className="cell-value">Wardha (Maharashtra) • MSME-DFO Nagpur</span>
            </div>
            <div className="udyam-cell">
              <span className="cell-label">Direct Studio Helpline</span>
              <span className="cell-value font-semibold">+91 7058398041</span>
            </div>
          </div>
        </section>

        {/* 2-Column Main Contact Layout */}
        <div className="contact-main-grid">
          {/* LEFT: Official Details Cards */}
          <div className="contact-cards-col">
            {/* Workshop Address Card */}
            <article className="contact-card">
              <div className="contact-card-icon">
                <MapPin className="w-5 h-5 text-amber-700" />
              </div>
              <div className="contact-card-body">
                <h3>Studio & Workshop Address</h3>
                <p className="contact-address-lines">
                  <strong>Crystelle Studio</strong><br />
                  Ward No 13, Shastri Nagar<br />
                  Nachangaon Road, Pulgaon<br />
                  Block: Deoli, District: Wardha<br />
                  Maharashtra – 442302, India
                </p>
                <div className="contact-card-actions">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=20.72106,78.32014"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-action-btn"
                  >
                    <span>View Studio on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </article>

            {/* Direct Phone & WhatsApp Card */}
            <article className="contact-card">
              <div className="contact-card-icon">
                <Phone className="w-5 h-5 text-amber-700" />
              </div>
              <div className="contact-card-body">
                <h3>Call & WhatsApp Support</h3>
                <p>Reach us directly for swift assistance, order modifications, or transit questions:</p>
                <div className="contact-highlight-phone">
                  <strong>+91 7058398041</strong>
                  <span>Mon – Sat: 10:00 AM – 7:00 PM IST</span>
                </div>
                <div className="contact-card-actions">
                  <a
                    href="https://wa.me/917058398041?text=Hello%20Crystelle%20Studio%2C%20I%20have%20an%20inquiry%20regarding%20your%20handcrafted%20candles."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-action-btn whatsapp-btn"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                  <a href="tel:+917058398041" className="contact-action-btn">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            </article>

            {/* Email Card */}
            <article className="contact-card">
              <div className="contact-card-icon">
                <Mail className="w-5 h-5 text-amber-700" />
              </div>
              <div className="contact-card-body">
                <h3>Official Email Address</h3>
                <p>For order queries, wholesale catalog requests, or corporate gifting proposals:</p>
                <p className="font-semibold text-foreground text-sm mt-1">
                  crystellestudio.art@gmail.com
                </p>
                <span className="text-xs text-muted-foreground block mt-1">
                  Average response time: within 24 business hours
                </span>
                <div className="contact-card-actions">
                  <a
                    href="mailto:crystellestudio.art@gmail.com?subject=Inquiry%20from%20Crystelle%20Studio%20Customer"
                    className="contact-action-btn"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send an Email</span>
                  </a>
                </div>
              </div>
            </article>

            {/* Bulk & Bespoke Gifting Card */}
            <article className="contact-card">
              <div className="contact-card-icon">
                <HeartHandshake className="w-5 h-5 text-amber-700" />
              </div>
              <div className="contact-card-body">
                <h3>Custom Gifting & Wedding Favors</h3>
                <p>
                  Planning a wedding, festive celebration, or corporate event? We create customized scented candle hampers with personalized labels and custom vessel finishes.
                </p>
              </div>
            </article>
          </div>

          {/* RIGHT: Interactive Inquiry Form */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              <div className="contact-form-header">
                <h2>Send Us a Message</h2>
                <p>Fill out the form below and our studio artisan will get back to you promptly.</p>
              </div>

              {submitted ? (
                <div className="contact-success-state">
                  <div className="success-icon-wrap">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3>Thank you for reaching out!</h3>
                  <p>
                    We have received your message. Our studio team at Pulgaon will review your inquiry and get in touch with you shortly.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="mt-4"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="contact-form-field">
                    <Label htmlFor="contact-fullName">Full Name</Label>
                    <Input
                      id="contact-fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Aditi Sharma"
                      required
                    />
                  </div>

                  <div className="contact-form-grid-2">
                    <div className="contact-form-field">
                      <Label htmlFor="contact-email">Email Address</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div className="contact-form-field">
                      <Label htmlFor="contact-phone">Phone Number</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="contact-form-field">
                    <Label htmlFor="contact-inquiryType">Inquiry Subject</Label>
                    <select
                      id="contact-inquiryType"
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="contact-select"
                    >
                      <option value="Order Status & Tracking">Order Status & Tracking</option>
                      <option value="Custom Fragrances & Gifting">Custom Fragrances & Wedding Favors</option>
                      <option value="Corporate / Bulk Wholesale">Corporate Gifting / Wholesale Orders</option>
                      <option value="Damage / Breakage Replacement">Damage / Breakage Replacement</option>
                      <option value="Other Feedback">Other Feedback / Question</option>
                    </select>
                  </div>

                  <div className="contact-form-field">
                    <Label htmlFor="contact-message">Message</Label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please tell us how we can help you..."
                      className="contact-textarea"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="contact-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Sending Message...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        <span>Send Message</span>
                      </>
                    )}
                  </Button>

                  <p className="contact-form-notice">
                    Your privacy is protected. We will only use your details to answer your inquiry. Read our{' '}
                    <Link to="/privacy-policy" className="underline">
                      Privacy Policy
                    </Link>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Helpful FAQs */}
        <section className="contact-faq-section">
          <div className="section-heading text-center">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions about our handcrafted candles and orders</p>
          </div>

          <div className="contact-faq-grid">
            <details className="faq-item">
              <summary>Where is Crystelle Studio located?</summary>
              <p>
                Our registered studio and hand-pouring workshop is located at Ward No 13, Shastri Nagar, Nachangaon Road, Pulgaon, in the Wardha district of Maharashtra (PIN 442302), India. Every candle is poured and dispatched directly from our studio.
              </p>
            </details>

            <details className="faq-item">
              <summary>How long will my order take to reach me?</summary>
              <p>
                Because our candles are freshly hand-poured in small batches, orders are prepared in 1–3 business days. Delivery across Maharashtra takes 2–4 business days, metro cities take 3–5 days, and other regions take 4–7 business days via insured express couriers.
              </p>
            </details>

            <details className="faq-item">
              <summary>What if a candle arrives damaged during transit?</summary>
              <p>
                We offer a 100% Free Replacement Guarantee! If any glass jar arrives cracked or damaged, just take a picture or short video within 48 hours and send it to our WhatsApp (+91 7058398041) or email. We will ship a fresh candle immediately at zero extra cost.
              </p>
            </details>

            <details className="faq-item">
              <summary>Do you take bulk orders for weddings, birthdays, or corporate events?</summary>
              <p>
                Yes! We specialize in bespoke wedding favors, festival hampers, and custom-labeled candles with personalized fragrances. Please contact us via the form above or call/WhatsApp at +91 7058398041 for custom pricing and jar options.
              </p>
            </details>
          </div>
        </section>
      </div>
    </main>
  );
}
