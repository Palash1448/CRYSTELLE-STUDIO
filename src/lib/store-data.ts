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
export const products = [
 {id:'lavender-bliss', name:'Lavender Bliss', category:'Scented Candles', type:'Scented Candle', fragrance:'Lavender', price:499, image:lavender, description:'A calming blend of lavender to relax your mind and create a peaceful ambiance.', notes:'Fresh lavender, soft sage, and a gentle touch of musk.'},
 {id:'vanilla-dream', name:'Vanilla Dream', category:'Scented Candles', type:'Scented Candle', fragrance:'Vanilla', price:499, image:vanilla, description:'Warm, comforting vanilla that makes every space feel a little more like home.', notes:'Madagascar vanilla, warm caramel, and soft sandalwood.'},
 {id:'rose-petal', name:'Rose Petal', category:'Jar Candles', type:'Jar Candle', fragrance:'Rose', price:549, image:rose, description:'The delicate fragrance of fresh roses, captured in a beautifully hand-poured candle.', notes:'Fresh rose petals, geranium, and a whisper of cedar.'},
 {id:'citrus-fresh', name:'Citrus Fresh', category:'Scented Candles', type:'Scented Candle', fragrance:'Citrus', price:499, image:citrus, description:'A bright burst of sun-ripened citrus to refresh your space and lift your spirits.', notes:'Sweet orange, lemon zest, and green bergamot.'},
 {id:'sandalwood-serenity', name:'Sandalwood Serenity', category:'Jar Candles', type:'Jar Candle', fragrance:'Sandalwood', price:699, image:jar, description:'Earthy sandalwood and warm woods for quiet evenings and moments of stillness.', notes:'Sandalwood, cedarwood, and warm amber.'},
 {id:'candle-gift-set', name:'The Crystelle Gift Set', category:'Candle Gift Sets', type:'Gift Set', fragrance:'Vanilla', price:899, image:gift, description:'A thoughtfully wrapped candle gift for the people who light up your life.', notes:'Our signature comforting vanilla fragrance.'},
 {id:'candle-care-kit', name:'Candle Care Kit', category:'Candle Accessories', type:'1 Set', fragrance:'Others', price:699, image:accessories, description:'The essentials for caring for your candles: a wick trimmer and elegant snuffer.', notes:'Fragrance-free candle accessories.'},
];
export type Product = (typeof products)[number];
export const categories = [{name:'Scented Candles',image:vanilla},{name:'Jar Candles',image:jar},{name:'Candle Gift Sets',image:gift},{name:'Candle Accessories',image:accessories}];
export const money = (amount:number) => '₹'+amount.toLocaleString('en-IN');
export function pageHead(title:string,description:string){return {meta:[{title:title+' — Crystelle Studio'},{name:'description',content:description},{property:'og:title',content:title+' — Crystelle Studio'},{property:'og:description',content:description},{property:'og:image',content:'/crystelle-gold-logo.png'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'},{name:'twitter:image',content:'/crystelle-gold-logo.png'}]};}
