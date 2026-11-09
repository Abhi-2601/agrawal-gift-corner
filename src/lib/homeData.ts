/**
 * Homepage content (frontend-only).
 *
 * ⚠️ DEMO DATA: the products, prices, ratings and review counts in this file are
 * sample values for the visual build. They are NOT read from the catalog and are
 * NOT real prices. When the backend step starts, replace SAMPLE_PRODUCTS with the
 * real featured/best-selling query and delete this notice.
 *
 * Shop links follow the existing storefront convention: /products?cat=<Category>
 * and /products?search=<text>.
 */
import heroImage from '../assets/home/hero.webp';
import flowersBanner from '../assets/home/banner-flowers.webp';
import personalizedBanner from '../assets/home/banner-personalized.webp';
import festiveBanner from '../assets/home/banner-festive.webp';
import corporateBanner from '../assets/home/banner-corporate.webp';

import catBirthday from '../assets/home/cat-birthday.webp';
import catAnniversary from '../assets/home/cat-anniversary.webp';
import catFlowers from '../assets/home/cat-flowers.webp';
import catPersonalized from '../assets/home/cat-personalized.webp';
import catHampers from '../assets/home/cat-hampers.webp';
import catFestive from '../assets/home/cat-festive.webp';
import catCorporate from '../assets/home/cat-corporate.webp';
import catCombos from '../assets/home/cat-combos.webp';

import chocolateHamper from '../assets/home/product-chocolate-hamper.webp';
import roseBouquet from '../assets/home/product-rose-bouquet.webp';
import photoLamp from '../assets/home/product-photo-lamp.webp';
import celebrationBox from '../assets/home/product-celebration-box.webp';
import teddyRoses from '../assets/home/product-teddy-roses.webp';

const cat = (name: string) => `/products?cat=${encodeURIComponent(name)}`;
const search = (text: string) => `/products?search=${encodeURIComponent(text)}`;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export interface NavChild {
  label: string;
  to: string;
}

export interface NavItem {
  label: string;
  /** Direct link. Items with `children` render a dropdown instead. */
  to?: string;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  {
    label: 'Gifts',
    children: [
      { label: 'Birthday Gifts', to: cat('Birthday') },
      { label: 'Anniversary Gifts', to: cat('Anniversary') },
      { label: 'Wedding Gifts', to: cat('Wedding') },
      { label: 'Festive Gifts', to: cat('Festive') },
      { label: 'All Gifts', to: '/products' },
    ],
  },
  {
    label: 'Hampers',
    children: [
      { label: 'All Gift Hampers', to: cat('Gift Hampers') },
      { label: 'Chocolate Hampers', to: search('Chocolate Hamper') },
      { label: 'Festive Hampers', to: cat('Festive') },
    ],
  },
  {
    label: 'Flowers',
    children: [
      { label: 'Fresh Flowers', to: cat('Flowers') },
      { label: 'Rose Bouquets', to: search('Rose') },
    ],
  },
  {
    label: 'Personalized',
    children: [
      { label: 'All Personalized Gifts', to: cat('Personalized Gifts') },
      { label: 'Photo Gifts', to: search('Photo') },
      { label: 'Mugs & Cushions', to: search('Mug') },
    ],
  },
  {
    label: 'Occasions',
    children: [
      { label: 'Birthday', to: cat('Birthday') },
      { label: 'Anniversary', to: cat('Anniversary') },
      { label: 'Wedding', to: cat('Wedding') },
      { label: 'Festive', to: cat('Festive') },
    ],
  },
  {
    label: 'Combos',
    children: [
      { label: 'All Combos', to: cat('Combos') },
      { label: 'Teddy & Roses', to: search('Teddy') },
    ],
  },
  { label: 'Corporate Gifting', to: cat('Corporate') },
  {
    label: 'More',
    children: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Help', to: '/help' },
      { label: 'Shipping', to: '/shipping' },
      { label: 'Returns', to: '/returns' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export interface HeroSlide {
  id: string;
  eyebrow: string;
  /** Two serif lines; `script` follows the second line in the script face. */
  lines: [string, string];
  script: string;
  text: string;
  cta: { label: string; to: string };
  image: string;
  alt: string;
}

/**
 * Only one hero photograph exists in the approved design, so all slides share it.
 * Swap `image` per slide once real banner photography is available.
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'moments',
    eyebrow: 'Premium gifts for every occasion',
    lines: ['Make Every', 'Moment'],
    script: 'Special',
    text: 'Explore our exclusive collection of gifts, hampers, flowers and personalized items to make your loved ones smile.',
    cta: { label: 'Shop Now', to: '/products' },
    image: heroImage,
    alt: 'Gift hamper with a teddy bear, scented candle, mug, chocolates and red roses',
  },
  {
    id: 'personal',
    eyebrow: 'Made just for them',
    lines: ['Gifts With', 'A Personal'],
    script: 'Touch',
    text: 'Custom mugs, photo lamps, cushions and frames, made with your special memories.',
    cta: { label: 'Shop Personalized', to: cat('Personalized Gifts') },
    image: heroImage,
    alt: 'Gift hamper with a teddy bear, scented candle, mug, chocolates and red roses',
  },
  {
    id: 'festive',
    eyebrow: 'Celebrate together',
    lines: ['Celebrate Every', 'Festival'],
    script: 'Together',
    text: 'Festive hampers, sweets and gift sets to make every celebration brighter.',
    cta: { label: 'Shop Festive Gifts', to: cat('Festive') },
    image: heroImage,
    alt: 'Gift hamper with a teddy bear, scented candle, mug, chocolates and red roses',
  },
];

export const HERO_HIGHLIGHTS = [
  { icon: 'truck', lines: ['Fast & Reliable', 'Delivery'] },
  { icon: 'shield', lines: ['Quality', 'Assured'] },
  { icon: 'heart', lines: ['Unique &', 'Personalized Gifts'] },
] as const;

/* ------------------------------------------------------------------ */
/* Category shortcuts                                                  */
/* ------------------------------------------------------------------ */

export interface CategoryShortcut {
  label: string;
  to: string;
  image: string;
}

export const CATEGORY_SHORTCUTS: CategoryShortcut[] = [
  { label: 'Birthday Gifts', to: cat('Birthday'), image: catBirthday },
  { label: 'Anniversary Gifts', to: cat('Anniversary'), image: catAnniversary },
  { label: 'Flowers', to: cat('Flowers'), image: catFlowers },
  { label: 'Personalized Gifts', to: cat('Personalized Gifts'), image: catPersonalized },
  { label: 'Gift Hampers', to: cat('Gift Hampers'), image: catHampers },
  { label: 'Festive Gifts', to: cat('Festive'), image: catFestive },
  { label: 'Corporate Gifts', to: cat('Corporate'), image: catCorporate },
  { label: 'Combos', to: cat('Combos'), image: catCombos },
];

/* ------------------------------------------------------------------ */
/* Promotional banners                                                 */
/* ------------------------------------------------------------------ */

export type BannerTone = 'blush' | 'sand' | 'wine' | 'stone';

export interface PromoBannerData {
  id: string;
  title: string;
  description: string;
  cta: string;
  to: string;
  image: string;
  imageAlt: string;
  tone: BannerTone;
  /** CSS object-position for the photo, to keep the subject in frame. */
  imagePosition?: string;
}

export const PROMO_BANNERS: PromoBannerData[] = [
  {
    id: 'flowers',
    title: 'Fresh Flowers for Every Emotion',
    description: 'Beautiful bouquets for birthdays, anniversaries, proposals and more.',
    cta: 'Explore Flowers',
    to: cat('Flowers'),
    image: flowersBanner,
    imageAlt: 'Bouquet of red and pink roses wrapped in pink paper',
    tone: 'blush',
  },
  {
    id: 'personalized',
    title: 'Personalized Gifts Make It Unique',
    description: 'Custom mugs, cushions, frames and more with your special touch.',
    cta: 'Explore Personalized Gifts',
    to: cat('Personalized Gifts'),
    image: personalizedBanner,
    imageAlt: 'Framed couple photo beside a mug printed with “Together Always”',
    tone: 'sand',
  },
];

export const FEATURE_BANNERS: PromoBannerData[] = [
  {
    id: 'festive',
    title: 'Festive Collection',
    description: 'Celebrate every occasion with our exclusive gifting range.',
    cta: 'Shop Festive Gifts',
    to: cat('Festive'),
    image: festiveBanner,
    imageAlt: 'Red and gold wrapped festive gifts with glowing candles',
    tone: 'wine',
  },
  {
    id: 'corporate',
    title: 'Corporate Gifting',
    description: 'Strengthen your business relationships with premium corporate gifts.',
    cta: 'Explore Corporate Gifts',
    to: cat('Corporate'),
    image: corporateBanner,
    imageAlt: 'Black corporate gift box with a flask, pen and notebook',
    tone: 'stone',
    imagePosition: '40% 50%',
  },
];

/* ------------------------------------------------------------------ */
/* Best sellers (DEMO DATA)                                            */
/* ------------------------------------------------------------------ */

export interface SampleProduct {
  /** Prefixed `demo-` so sample items can never be mistaken for catalog ids. */
  id: string;
  name: string;
  /** DEMO selling price in INR. */
  price: number;
  /** DEMO strike-through price in INR. */
  mrp: number;
  /** DEMO rating out of 5 (halves allowed). */
  rating: number;
  /** DEMO review count. */
  reviews: number;
  image: string;
  imageAlt: string;
  /** Where the card links until real product pages are wired to the catalog. */
  to: string;
}

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: 'demo-chocolate-hamper',
    name: 'Premium Chocolate Hamper',
    price: 1299,
    mrp: 1699,
    rating: 4.5,
    reviews: 128,
    image: chocolateHamper,
    imageAlt: 'Box of chocolates with a red ribbon and a “Best Friend Ever” mug',
    to: cat('Gift Hampers'),
  },
  {
    id: 'demo-red-rose-bouquet',
    name: 'Red Rose Bouquet',
    price: 599,
    mrp: 799,
    rating: 4.5,
    reviews: 96,
    image: roseBouquet,
    imageAlt: 'Bouquet of red roses in black wrapping',
    to: cat('Flowers'),
  },
  {
    id: 'demo-personalized-photo-lamp',
    name: 'Personalized Photo Lamp',
    price: 899,
    mrp: 1199,
    rating: 4,
    reviews: 74,
    image: photoLamp,
    imageAlt: 'Glowing photo lamp showing a couple with the text “I Love You”',
    to: cat('Personalized Gifts'),
  },
  {
    id: 'demo-chocolate-celebration-box',
    name: 'Chocolate Celebration Box',
    price: 799,
    mrp: 1099,
    rating: 4.5,
    reviews: 110,
    image: celebrationBox,
    imageAlt: 'Black gift box of assorted chocolates tied with a red ribbon',
    to: cat('Gift Hampers'),
  },
  {
    id: 'demo-teddy-roses-combo',
    name: 'Teddy with Roses Combo',
    price: 999,
    mrp: 1699,
    rating: 4.5,
    reviews: 143,
    image: teddyRoses,
    imageAlt: 'Teddy bear with red roses and a “Just For You” card',
    to: cat('Combos'),
  },
];

/* ------------------------------------------------------------------ */
/* Benefits strip                                                      */
/* ------------------------------------------------------------------ */

export const BENEFITS = [
  { icon: 'truck', title: 'Free & Fast Delivery', text: 'On orders above ₹499' },
  { icon: 'shield', title: 'Secure Payments', text: '100% safe & secure' },
  { icon: 'returns', title: 'Easy Returns', text: 'Hassle-free returns' },
  { icon: 'support', title: 'Customer Support', text: 'Always here to help' },
] as const;
