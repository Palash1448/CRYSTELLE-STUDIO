import lavender from '@/assets/lavender.jpg';
import vanilla from '@/assets/vanilla.jpg';
import rose from '@/assets/rose.jpg';
import citrus from '@/assets/citrus.jpg';
import jar from '@/assets/jar.jpg';
import gift from '@/assets/gift.jpg';
import accessories from '@/assets/accessories.jpg';
import ambience from '@/assets/ambience.jpg';
import hero from '@/assets/hero-candle.jpg';
export { hero, ambience, accessories, gift, jar };
export interface Product {
  id: string;
  name: string;
  category: string;
  type: string;
  fragrance: string;
  price: number;
  image: string;
  video?: string;
  mediaType?: 'image' | 'video';
  gallery?: string[];
  cloudinaryPublicId?: string;
  cloudinaryVideoPublicId?: string;
  description: string;
  notes: string;
  stockQuantity?: number;
  waxType?: string;
  burnTime?: string;
}

export const DUMMY_PRODUCT_IDS = new Set([
  'lavender-bliss',
  'vanilla-dream',
  'rose-petal',
  'citrus-fresh',
  'sandalwood-serenity',
  'candle-gift-set',
  'candle-care-kit',
]);

// All dummy products removed - start with clean product list
export const products: Product[] = [];

export function getStoredProducts(): Product[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('crystelle_admin_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((p: any) => p && p.id && !DUMMY_PRODUCT_IDS.has(p.id));
        }
      }
    } catch {}
  }
  return products;
}

export const categories = [{name:'Scented Candles',image:vanilla},{name:'Jar Candles',image:jar},{name:'Candle Gift Sets',image:gift},{name:'Candle Accessories',image:accessories}];
export const money = (amount?: number | string | null) => {
  const num = typeof amount === 'number' ? amount : Number(amount);
  return '₹' + (isNaN(num) ? 0 : num).toLocaleString('en-IN');
};
import { seoHead } from './seo';

export function pageHead(title: string, description: string, path: string = '') {
  return seoHead({ title, description, path });
}
