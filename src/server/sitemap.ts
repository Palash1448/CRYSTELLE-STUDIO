/**
 * Dynamic XML Sitemap and Robots generator for Crystelle Studio.
 * Ensures the sitemap always matches the exact domain and protocol
 * requested by Google Search Console or web visitors.
 */

export function generateSitemapXml(baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const today = new Date().toISOString().split('T')[0];

  const routes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/shop', priority: '0.9', changefreq: 'daily' },
    { path: '/collections', priority: '0.8', changefreq: 'weekly' },
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/shipping-policy', priority: '0.5', changefreq: 'monthly' },
    { path: '/privacy-policy', priority: '0.5', changefreq: 'monthly' },
    { path: '/terms-and-conditions', priority: '0.5', changefreq: 'monthly' },
  ];

  const urls = routes
    .map(
      (r) => `  <url>
    <loc>${cleanBase}${r.path === '/' ? '/' : r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function generateRobotsTxt(baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/$/, '');
  return `# Crystelle Studio Robots File
User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /cart
Disallow: /checkout
Disallow: /profile
Disallow: /login

User-agent: Googlebot-Image
Allow: /
Allow: /assets/

User-agent: Bingbot
Allow: /
Disallow: /admin
Disallow: /cart
Disallow: /checkout
Disallow: /profile
Disallow: /login

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /
Disallow: /admin
Disallow: /cart
Disallow: /checkout
Disallow: /profile
Disallow: /login

Sitemap: ${cleanBase}/sitemap.xml
`;
}
