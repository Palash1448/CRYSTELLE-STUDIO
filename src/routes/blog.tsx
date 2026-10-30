import { createFileRoute } from '@tanstack/react-router';
import { ambience, hero, jar } from '@/lib/store-data';
import { seoHead, buildBlogPostingSchema } from '@/lib/seo';

const articles = [
  {
    title: 'How to Make Your Scented Candles Last Longer: The Ultimate Burn Guide',
    image: ambience,
    date: '2024-10-12',
    displayDate: '12 Oct 2024',
    time: '5 min read',
    slug: 'how-to-make-candles-last-longer',
    summary:
      'Learn how to prevent candle tunneling, properly trim wicks to 5mm, and maximize the scent throw and burn hours of your handcrafted candles.',
    body: 'The key to getting 50+ hours of clean, fragrant burn from your handcrafted candle is the first burn. Always let the molten wax pool reach the absolute edge of the glass container before extinguishing it (usually 2 to 3 hours). This prevents wax tunneling — where the wick burns down a narrow center hole leaving unused wax on the walls. Always trim the wick to approximately 5mm (1/4 inch) before relighting to eliminate black soot, mushrooming, and uneven flames. Keep burning candles away from open windows, fans, and drafts.',
  },
  {
    title: 'Best Aromatherapy Candle Scents for Every Mood & Room',
    image: jar,
    date: '2024-10-05',
    displayDate: '05 Oct 2024',
    time: '4 min read',
    slug: 'best-candle-scents-for-every-mood',
    summary:
      'Aromatherapy guide: which fragrance notes boost productivity, ease stress, encourage restful sleep, or create an inviting dining ambiance.',
    body: 'Fragrance directly triggers the limbic system of the brain, shaping our emotions and mindset. For deep relaxation, unwinding after work, or bedtime meditation, choose French Lavender or Chamomile notes. For refreshing your morning workspace, invigorating Citrus Mandarin and Bergamot increase mental focus and energy. In living rooms and cozy dining areas, warm Vanilla Bean and Spiced Amber create an inviting, comforting embrace that makes guests feel instantly at home. For quiet evening reading or grounding, rich Mysore Sandalwood delivers timeless earthy warmth.',
  },
  {
    title: 'Natural Botanical Soy Wax vs. Paraffin: Why Clean Wax Matters',
    image: hero,
    date: '2024-09-28',
    displayDate: '28 Sep 2024',
    time: '6 min read',
    slug: 'soy-wax-vs-paraffin-candles',
    summary:
      'Discover why plant-based soy wax offers a cleaner, slower burn compared to petroleum-derived paraffin wax for your indoor home air quality.',
    body: 'Paraffin wax is a byproduct of petroleum refining, which can release trace amounts of volatile organic compounds and petro-carbon soot into your indoor living environment. In contrast, 100% botanical soy wax is made from renewable, biodegradable soybeans. Soy wax burns up to 50% longer than paraffin because it has a lower melting point, meaning your candle lasts significantly longer and burns cooler. Additionally, natural soy wax allows the aromatic fragrance oils to release smoothly and evenly without being overpowered by harsh chemical undertones.',
  },
  {
    title: 'Creative DIY Ideas to Clean and Upcycle Your Finished Candle Jars',
    image: jar,
    date: '2024-09-15',
    displayDate: '15 Sep 2024',
    time: '4 min read',
    slug: 'diy-candle-jar-upcycling-ideas',
    summary:
      'Sustainable home decor: simple ways to remove remaining wax and repurpose luxury glass candle vessels into chic planters, pen stands, and vanity organizers.',
    body: 'Our heavy-base glass jars are thoughtfully designed to be repurposed rather than discarded. Once your candle reaches its last 1/2 inch of wax, safely melt the remaining wax using warm water or place the jar in the freezer for two hours so the leftover wax shrinks and easily pops out with a butter knife. Wash with warm soapy water to remove residue. Now you have a beautiful minimalist glass jar perfect for propagating plant cuttings, holding makeup brushes, storing desk stationery, or displaying cotton pads on your bathroom vanity.',
  },
];

export const Route = createFileRoute('/blog')({
  head: () =>
    seoHead({
      title: 'Candle Care Guides, Fragrance Tips & Upcycling Inspiration',
      description:
        'Discover expert candle care advice: how to prevent candle tunneling, choose aromatherapy scents for relaxation, and understand botanical soy wax vs paraffin.',
      path: '/blog',
      breadcrumbs: [{ name: 'Candle Care & Tips', path: '/blog' }],
      keywords:
        'candle care tips, prevent candle tunneling, aromatherapy candle guide, soy wax vs paraffin, how to reuse candle jars, candle burning instructions',
      schemas: articles.map((a) =>
        buildBlogPostingSchema(
          {
            title: a.title,
            body: a.body,
            image: typeof a.image === 'string' ? a.image : undefined,
            date: a.date,
          },
          `/blog#${a.slug}`
        )
      ),
    }),
  component: Blog,
});

function Blog() {
  return (
    <main className="container page">
      <div className="page-heading">
        <h1>Candle Care Guides &amp; Aromatic Living</h1>
        <p>
          Expert tips, mindful scent rituals, and care guides to help you get the longest, cleanest burn from your handcrafted candles.
        </p>
      </div>

      <div className="blog-grid">
        {articles.map((article) => (
          <article className="article" key={article.slug} id={article.slug}>
            <img
              src={article.image}
              alt={article.title}
              width={512}
              height={512}
              loading="lazy"
            />
            <div className="article-body">
              <h2>{article.title}</h2>
              <p className="article-meta">
                <time dateTime={article.date}>{article.displayDate}</time> &nbsp; · &nbsp;{' '}
                {article.time}
              </p>
              <p className="text-sm text-[#78716C] mb-3 leading-relaxed">{article.summary}</p>
              <details className="mt-2">
                <summary className="font-medium text-[#A67C2E] cursor-pointer hover:underline">
                  Read Full Guide
                </summary>
                <p className="mt-3 text-[#57534E] text-sm leading-relaxed border-t border-[#EAE4DC] pt-3">
                  {article.body}
                </p>
              </details>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
