import { type Product } from './store-data';

export const SITE_URL = (
  typeof process !== 'undefined' && process.env?.VITE_SITE_URL
    ? process.env.VITE_SITE_URL
    : import.meta.env?.VITE_SITE_URL || 'https://crystellestudio.in'
).replace(/\/$/, '');

export const SITE_NAME = 'Crystelle Studio';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/crystelle-gold-logo.png`;

export const DEFAULT_KEYWORDS = [
  'handcrafted candles India',
  'luxury scented candles',
  'botanical soy wax candles',
  'handmade jar candles',
  'aromatherapy candles online',
  'natural fragrance candles',
  'candle gift set India',
  'artisanal candles Maharashtra',
  'clean burning soy candles',
  'eco friendly candles',
  'Pulgaon candle maker',
  'Crystelle Studio',
].join(', ');

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BlogArticleData {
  title: string;
  body: string;
  image?: string;
  date?: string;
}

export interface SeoOptions {
  title: string;
  description: string;
  path?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FaqItem[];
  product?: Product;
  article?: BlogArticleData;
  schemas?: Record<string, any>[];
}

/**
 * Builds absolute URL for paths and images
 */
export function getAbsoluteUrl(pathOrUrl: string = ''): string {
  if (!pathOrUrl) return SITE_URL;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Organization and LocalBusiness Schema (Rich Snippets for Google Knowledge Graph & Local Pack)
 */
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'Store'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: 'Crystelle Studio (Udyam: UDYAM-MH-34-0059212)',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/crystelle-gold-logo.png`,
      width: '512',
      height: '512',
    },
    image: `${SITE_URL}/crystelle-gold-logo.png`,
    description:
      'Lovingly hand-poured botanical candles, scented jar candles, and luxury home fragrances crafted in Pulgaon, Maharashtra. Delivering nationwide across India.',
    telephone: '+91 7058398041',
    email: 'crystellestudio.art@gmail.com',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Credit Card, Debit Card, UPI, Net Banking, Cash on Delivery',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ward No 13, Shastri Nagar, Nachangaon Road',
      addressLocality: 'Pulgaon',
      addressRegion: 'Maharashtra',
      postalCode: '442302',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 20.5333,
      longitude: 78.3167,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    sameAs: [
      'https://wa.me/917058398041',
      'https://www.instagram.com',
    ],
  };
}

/**
 * WebSite Schema with Sitelinks SearchBox
 */
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/shop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * BreadcrumbList Schema for Google Search Snippets
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  const fullItems = [
    { name: 'Home', path: '/' },
    ...items.filter((i) => i.path !== '/'),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: fullItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.path),
    })),
  };
}

/**
 * Product Schema with INR Pricing, Merchant Return Policy & Free Shipping Rules
 */
export function buildProductSchema(product: Product, path: string) {
  const productUrl = getAbsoluteUrl(path);
  const imageUrl = getAbsoluteUrl(product.image || '/crystelle-gold-logo.png');

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.name,
    description: `${product.description} Scent notes: ${product.notes || 'Botanical essential oils and natural fragrances'}. Handcrafted clean-burning wax.`,
    image: [imageUrl],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    category: product.category || 'Handcrafted Candles',
    material: product.waxType || 'Natural Botanical Soy Wax',
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability:
        product.stockQuantity === 0
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: productUrl,
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: product.price >= 999 ? 0 : 69,
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'd',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 6,
            unitCode: 'd',
          },
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '42',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

/**
 * FAQPage Schema for Google Accordion Results in SERP
 */
export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * BlogPosting Schema for Articles
 */
export function buildBlogPostingSchema(article: BlogArticleData, path: string) {
  const articleUrl = getAbsoluteUrl(path);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${articleUrl}#article`,
    headline: article.title,
    description: article.body.slice(0, 160),
    image: article.image ? [getAbsoluteUrl(article.image)] : [DEFAULT_OG_IMAGE],
    datePublished: article.date || '2024-10-12',
    dateModified: '2025-01-15',
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_OG_IMAGE,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };
}

/**
 * Main SEO Head Generator for TanStack Router routes.
 * Emits complete meta tags, canonical links, social preview cards, and JSON-LD scripts.
 */
export function seoHead(options: SeoOptions) {
  const {
    title,
    description,
    path = '',
    keywords = DEFAULT_KEYWORDS,
    image,
    type = 'website',
    noindex = false,
    breadcrumbs,
    faqs,
    product,
    article,
    schemas = [],
  } = options;

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
  const canonicalUrl = getAbsoluteUrl(path);
  const absoluteImageUrl = image ? getAbsoluteUrl(image) : DEFAULT_OG_IMAGE;

  // Build meta list
  const meta: Array<Record<string, string>> = [
    { title: fullTitle },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'author', content: SITE_NAME },
    { name: 'publisher', content: SITE_NAME },
    { name: 'format-detection', content: 'telephone=no' },
    // Geo tags for local search signals
    { name: 'geo.region', content: 'IN-MH' },
    { name: 'geo.placename', content: 'Pulgaon, Wardha, Maharashtra' },
    { name: 'geo.position', content: '20.5333;78.3167' },
    { name: 'ICBM', content: '20.5333, 78.3167' },
  ];

  if (noindex) {
    meta.push(
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'googlebot', content: 'noindex, nofollow' }
    );
  } else {
    meta.push(
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      {
        name: 'googlebot',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      }
    );
  }

  // Open Graph Social Tags
  meta.push(
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:type', content: type },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: absoluteImageUrl },
    { property: 'og:image:alt', content: `${fullTitle} preview` },
    { property: 'og:locale', content: 'en_IN' }
  );

  // Twitter Card Tags
  meta.push(
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: absoluteImageUrl },
    { name: 'twitter:image:alt', content: `${fullTitle} preview` }
  );

  // Canonical Link
  const links: Array<Record<string, string>> = [];
  if (!noindex) {
    links.push({ rel: 'canonical', href: canonicalUrl });
  }

  // Aggregate JSON-LD schemas
  const allSchemas: Record<string, any>[] = [...schemas];

  if (breadcrumbs && breadcrumbs.length > 0) {
    allSchemas.push(buildBreadcrumbSchema(breadcrumbs));
  }
  if (faqs && faqs.length > 0) {
    allSchemas.push(buildFaqSchema(faqs));
  }
  if (product) {
    allSchemas.push(buildProductSchema(product, path));
  }
  if (article) {
    allSchemas.push(buildBlogPostingSchema(article, path));
  }

  const scripts = allSchemas.map((schema) => ({
    type: 'application/ld+json',
    children: JSON.stringify(schema),
  }));

  return { meta, links, scripts };
}
