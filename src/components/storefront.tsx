import {createContext, useContext, useState, useEffect, type ReactNode} from 'react';
import {Link, useNavigate} from '@tanstack/react-router';
import {Flame, Search, UserRound, ShoppingCart, Menu, X, Heart, ArrowRight, Minus, Plus, BadgeCheck, Leaf, PackageCheck, House, LockKeyhole, Flower2, UserCheck} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {products, type Product, money} from '@/lib/store-data';
import {type UserProfile, type Order, getStoredUser, saveStoredUser, createDefaultUser} from '@/lib/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export type CartItem = {id:string;size:number;quantity:number};
type Store = {
  cart: CartItem[];
  favorites: string[];
  add: (id:string,size?:number,quantity?:number)=>void;
  change: (id:string,size:number,quantity:number)=>void;
  clearCart: () => void;
  favorite: (id:string)=>void;
  notify: (text:string)=>void;
  notice: (text:string)=>void;
  user: UserProfile | null;
  login: (email: string, fullName?: string) => UserProfile;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addOrder: (order: Order, guestDetails?: Partial<UserProfile>) => void;
};
const StoreContext = createContext<Store|null>(null);
export function useStore(){const store=useContext(StoreContext);if(!store)throw new Error('Store is unavailable');return store;}
export function StoreProvider({children}:{children:ReactNode}){
 const [cart,setCart]=useState<CartItem[]>([]);
 const [favorites,setFavorites]=useState<string[]>([]);
 const [toast,setToast]=useState('');
 const [noticeText,setNotice]=useState('');
 const [user,setUser]=useState<UserProfile|null>(null);

 useEffect(()=>{
   const stored = getStoredUser();
   if (stored) setUser(stored);

   const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
     const userEmail = fbUser?.email;
     if (userEmail) {
       setUser((curr) => {
         if (!curr || curr.email !== userEmail) {
           const nextUser = createDefaultUser(userEmail, fbUser.displayName || undefined);
           saveStoredUser(nextUser);
           return nextUser;
         }
         return curr;
       });
     }
   });

   return () => unsubscribe();
 },[]);

 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),2500);return()=>clearTimeout(timer);},[toast]);

 const add=(id:string,size=200,quantity=1)=>{setCart(current=>{const item=current.find(p=>p.id===id&&p.size===size);return item?current.map(p=>p===item?{...p,quantity:p.quantity+quantity}:p):[...current,{id,size,quantity}];});setToast('Added to your cart');};
 const change=(id:string,size:number,quantity:number)=>setCart(c=>quantity<1?c.filter(p=>p.id!==id||p.size!==size):c.map(p=>p.id===id&&p.size===size?{...p,quantity}:p));

 const clearCart = () => setCart([]);

 const login = (email: string, fullName?: string) => {
   const loggedUser = createDefaultUser(email, fullName);
   setUser(loggedUser);
   saveStoredUser(loggedUser);
   setToast(`Welcome back, ${loggedUser.fullName}!`);
   return loggedUser;
 };

 const logout = () => {
   signOut(auth).catch(() => {});
   setUser(null);
   saveStoredUser(null);
   setToast('Signed out of your account.');
 };

 const updateProfile = (updates: Partial<UserProfile>) => {
   setUser(current => {
     if (!current) return null;
     const updated = { ...current, ...updates, profileCompleted: true };
     saveStoredUser(updated);
     return updated;
   });
   setToast('Profile preferences saved!');
 };

 const addOrder = (order: Order, guestDetails?: Partial<UserProfile>) => {
   setUser(current => {
     let baseUser = current;
     if (!baseUser) {
       baseUser = createDefaultUser(guestDetails?.email || 'customer@crystellestudio.com', guestDetails?.fullName);
     }
     const updated: UserProfile = {
       ...baseUser,
       ...(guestDetails || {}),
       orders: [order, ...(baseUser.orders || [])],
     };
     saveStoredUser(updated);
     return updated;
   });
   setCart([]);
 };

 return <StoreContext.Provider value={{
   cart,
   favorites,
   add,
   change,
   clearCart,
   favorite:id=>setFavorites(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]),
   notify:setToast,
   notice:setNotice,
   user,
   login,
   logout,
   updateProfile,
   addOrder,
 }}>{children}{toast&&<div role="status" className="toast">{toast}</div>}{noticeText&&<div className="modal-backdrop"><div className="notice-dialog" role="dialog" aria-modal="true" aria-labelledby="notice-title"><h2 id="notice-title">A little note</h2><p>{noticeText}</p><Button onClick={()=>setNotice('')}>Got it</Button></div></div>}</StoreContext.Provider>;
}
export function Brand(){return <Link to="/" className="brand" aria-label="Crystelle Studio home"><img src="/crystelle-gold-logo.png" alt="Crystelle Studio logo" className="brand-logo" width={44} height={44}/> <div className="brand-text"><strong>Crystelle</strong><span>Studio</span></div></Link>;}
export function Header(){const {cart,user}=useStore();const [open,setOpen]=useState(false);const [searchOpen,setSearchOpen]=useState(false);const [search,setSearch]=useState('');const navigate=useNavigate();const count=cart.reduce((n,p)=>n+p.quantity,0);
 return <><header className="site-header"><Brand/><nav aria-label="Main navigation" className={'nav'+(open?' open':'')}>
 <Link to="/" activeOptions={{exact:true}} activeProps={{className:'active'}} onClick={()=>setOpen(false)}>Home</Link><Link to="/shop" activeProps={{className:'active'}} onClick={()=>setOpen(false)}>Shop</Link><Link to="/collections" activeProps={{className:'active'}} onClick={()=>setOpen(false)}>Collections</Link><Link to="/about" activeProps={{className:'active'}} onClick={()=>setOpen(false)}>About</Link><Link to="/blog" activeProps={{className:'active'}} onClick={()=>setOpen(false)}>Blog</Link><Link to="/contact" activeProps={{className:'active'}} onClick={()=>setOpen(false)}>Contact</Link>
 {user ? (
   <Link to="/profile" className="mobile-only-link" onClick={()=>setOpen(false)}>My Profile ({user.fullName.split(' ')[0]})</Link>
 ) : (
   <Link to="/login" className="mobile-only-link" onClick={()=>setOpen(false)}>Sign In / Profile</Link>
 )}
 </nav><div className="header-actions"><Button size="icon" variant="ghost" title="Search candles" aria-label="Search candles" onClick={()=>setSearchOpen(!searchOpen)}><Search/></Button><Button asChild size="icon" variant="ghost" className="account-button" title={user ? `My Profile (${user.fullName})` : "Sign In / Profile"} aria-label={user ? `My Profile (${user.fullName})` : "Sign In / Profile"}><Link to={user ? "/profile" : "/login"}>{user ? <span className="header-avatar-badge" title={user.fullName}>{user.fullName.charAt(0).toUpperCase()}</span> : <UserRound/>}</Link></Button><Button asChild variant="ghost" size="icon" className="cart-link" title="Your cart"><Link to="/cart" aria-label={`Your cart, ${count} items`}><ShoppingCart/><span className="cart-count">{count}</span></Link></Button><Button className="mobile-menu" variant="ghost" size="icon" aria-label="Open navigation" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</Button></div></header>
 {searchOpen&&<form className="search-panel" onSubmit={e=>{e.preventDefault();navigate({to:'/shop',search:{q:search}});setSearchOpen(false);}}><input aria-label="Search by name or fragrance" autoFocus placeholder="Find your favorite fragrance…" value={search} onChange={e=>setSearch(e.target.value)}/><Button type="submit"><Search/>Search</Button><Button variant="ghost" size="icon" aria-label="Close search" onClick={()=>setSearchOpen(false)}><X/></Button></form>}</>;
}
const benefitItems=[{icon:BadgeCheck,text:<>Handcrafted<br/>with Love</>},{icon:Leaf,text:<>Natural & Safe<br/>Ingredients</>},{icon:House,text:<>Aromas for<br/>Every Mood</>},{icon:PackageCheck,text:<>Eco-Friendly<br/>Packaging</>}];
export function Benefits(){return <div className="benefits">{benefitItems.map(({icon:Icon,text},i)=><div className="benefit" key={i}><Icon/><span>{text}</span></div>)}</div>;}
export function DetailBenefits(){return <div className="detail-benefits">{[{icon:Leaf,text:'Natural Ingredients'},{icon:Flower2,text:'Long Lasting Fragrance'},{icon:PackageCheck,text:'Hand Poured'},{icon:Flame,text:'Eco Friendly'}].map(({icon:Icon,text})=><div key={text}><Icon/>{text}</div>)}</div>;}
export function ProductCard({product}:{product:Product}){const {add,favorites,favorite}=useStore();return <article className="product-card"><div className="product-photo"><Link to="/product/$slug" params={{slug:product.id}}><img src={product.image} alt={product.name+' candle'} width={512} height={512} loading="lazy"/></Link><Button className="favorite" size="icon" variant="ghost" aria-label={'Favorite '+product.name} aria-pressed={favorites.includes(product.id)} onClick={()=>favorite(product.id)}><Heart/></Button></div><div className="product-info"><Link to="/product/$slug" params={{slug:product.id}}><h3>{product.name}</h3></Link><p>{product.type}</p><span className="product-price">{money(product.price)}</span><div className="stars" aria-label="4.8 out of 5 stars">★★★★★</div><Button className="add-button" onClick={()=>add(product.id)}>Add to Cart</Button></div></article>;}
export function Quantity({value,onChange}:{value:number;onChange:(n:number)=>void}){return <div className="quantity"><Button variant="ghost" size="icon" aria-label="Decrease quantity" disabled={value<=1} onClick={()=>onChange(value-1)}><Minus/></Button><span>{value}</span><Button variant="ghost" size="icon" aria-label="Increase quantity" disabled={value>=99} onClick={()=>onChange(value+1)}><Plus/></Button></div>;}
export function Footer(){
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        {/* Top 4-Column Footer Grid */}
        <div className="footer-columns">
          {/* Col 1: Brand & Official Enterprise Identification */}
          <div className="footer-brand-col">
            <Brand />
            <p className="footer-tagline">
              Lovingly hand-poured botanical candles and home fragrances, crafted in small batches to illuminate your everyday rituals.
            </p>
          </div>

          {/* Col 2: Explore & Shop */}
          <div className="footer-col">
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-menu">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop All Candles</Link></li>
              <li><Link to="/collections">Fragrance Collections</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/blog">Candle Care Guide</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div className="footer-col">
            <h4 className="footer-heading">Customer Care</h4>
            <ul className="footer-menu">
              <li><Link to="/contact">Contact Our Studio</Link></li>
              <li><Link to="/shipping-policy">Shipping & Delivery Policy</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><Link to="/profile">My Account & Orders</Link></li>
              <li><Link to="/admin" className="text-amber-700/80 hover:text-amber-800 font-medium flex items-center gap-1.5"><span>Studio Admin</span> <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 border border-amber-500/25">Staff</span></Link></li>
            </ul>
          </div>

          {/* Col 4: Studio Contact & Workshop */}
          <div className="footer-col footer-contact-col">
            <h4 className="footer-heading">Studio & Workshop</h4>
            <p className="footer-address">
              Ward No 13, Shastri Nagar<br />
              Nachangaon Road, Pulgaon<br />
              Dist. Wardha, Maharashtra – 442302
            </p>
            <div className="footer-direct-contacts">
              <a href="tel:+917058398041" className="footer-contact-item">
                <span>+91 7058398041</span>
              </a>
              <a href="mailto:crystellestudio.art@gmail.com" className="footer-contact-item">
                <span>crystellestudio.art@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright-line">
            © {new Date().getFullYear()} Crystelle Studio. All rights reserved. &bull; Designed And Developed By{' '}
            <a
              href="https://alphabytesoftwares.in"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-credit-link"
            >
              alphabytesoftwares.in
            </a>
          </p>
          <div className="footer-trust-tags">
            <span>Hand-Poured in India</span>
            <span>•</span>
            <span>100% Botanical Wax</span>
            <span>•</span>
            <span>Safe Nationwide Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export {ArrowRight,LockKeyhole};
