import { useEffect, useState, useRef, useCallback, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Leaf,
  Sun,
  Wheat,
  Heart,
  Nut,
  Package,
  Star,
  ShieldCheck,
  BadgeCheck,
  Gift,
  Flame,
  PlayCircle,
  TrendingUp,
  Award,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import TiltCard from '@/components/three/TiltCard';
import ThemedScene from '@/components/three/ThemedScene';
import { getCatalogCategories, getVisibleCatalogProducts, syncCatalogFromSupabase } from '@/data/products';

const CATEGORY_IMAGES: Record<string, string> = {
  nuts: '/assets/products/premium-almonds.webp',
  seeds: '/assets/products/pumpkin-seeds.webp',
  dried: '/assets/products/golden-raisins.jpg',
  pantry: '/assets/products/kodo-millet.jpg',
  sweets: '/assets/products/fruit-chips.webp',
};

const CATEGORY_ICONS: Record<string, typeof Nut> = {
  nuts: Nut,
  seeds: Sun,
  dried: Leaf,
  pantry: Wheat,
  sweets: Heart,
};

const CATEGORY_STYLES: Record<string, { gradient: string; badge: string }> = {
  nuts: {
    gradient: 'from-happi-pink/40 via-happi-cyan/20 to-transparent',
    badge: 'bg-happi-pink',
  },
  seeds: {
    gradient: 'from-happi-gold/40 via-happi-pink/20 to-transparent',
    badge: 'bg-happi-gold',
  },
  dried: {
    gradient: 'from-happi-cyan/40 via-happi-green/20 to-transparent',
    badge: 'bg-happi-cyan',
  },
  pantry: {
    gradient: 'from-happi-green/40 via-happi-gold/20 to-transparent',
    badge: 'bg-happi-green',
  },
  sweets: {
    gradient: 'from-fuchsia-500/40 via-happi-pink/20 to-transparent',
    badge: 'bg-fuchsia-500',
  },
};

/** Spotlight card that follows cursor */
function SpotlightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className={`card-spotlight ${className}`}>
      {children}
    </div>
  );
}

/** Animated counter that counts up when scrolled into view */
function AnimatedStat({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;

    let raf = 0;
    const start = performance.now();
    const duration = 2000;

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * value);
      setDisplay(current.toLocaleString());
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative group text-center"
    >
      <div className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-happi-pink via-happi-gold to-happi-cyan">
        {display}
        {suffix}
      </div>
      <div className="text-white/80 text-sm md:text-base uppercase tracking-wider">{label}</div>
      <div className="mx-auto mt-4 w-12 h-1 rounded-full bg-gradient-to-r from-happi-pink via-happi-gold to-happi-cyan opacity-60 group-hover:opacity-100 group-hover:w-20 transition-all duration-500" />
    </motion.div>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState(() => getCatalogCategories());
  const [visibleProducts, setVisibleProducts] = useState(() => getVisibleCatalogProducts());

  // Pull in any products the admin added/saved to Supabase so category
  // counts stay accurate on the customer's Categories page.
  useEffect(() => {
    let cancelled = false;
    syncCatalogFromSupabase().then((catalog) => {
      if (!cancelled) {
        setCategories(getCatalogCategories());
        setVisibleProducts(catalog);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalProducts = visibleProducts.length;
  const topProducts = [...visibleProducts].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-happi-cream">
        <div className="absolute inset-0 bg-hero-mesh" />
        <div className="blob-decoration w-[28rem] h-[28rem] bg-happi-pink -top-32 -left-32 opacity-20 animate-blob" />
        <div className="blob-decoration w-[24rem] h-[24rem] bg-happi-cyan top-20 -right-32 opacity-20 animate-blob" style={{ animationDelay: '3s' }} />
        <div className="blob-decoration w-80 h-80 bg-happi-gold bottom-0 left-1/3 opacity-15 animate-blob" style={{ animationDelay: '5s' }} />
        <div className="absolute inset-0 bg-dots-pattern opacity-30" />

        <div className="container relative">
          <div className="text-center pt-12 md:pt-16 pb-12 md:pb-16 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur border border-happi-pink/20 text-happi-pink text-sm font-semibold px-5 py-2.5 rounded-full mb-7 shadow-sm animate-bounce-gentle">
                <Sparkles className="w-4 h-4" />
                <span>Crafted for Every Craving</span>
                <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-happi-pink animate-pulse" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-happi-charcoal mb-5 tracking-tight leading-[1.08]">
                Find Your <span className="text-gradient-happi">Crunch</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Explore our premium collection of dry fruits, nuts, seeds, pantry staples and
                guilt-free treats — each category hand-curated for quality and freshness.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-8">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <span className="w-9 h-9 rounded-full bg-happi-pink/10 flex items-center justify-center">
                    <Package className="w-4 h-4 text-happi-pink" />
                  </span>
                  {totalProducts}+ products
                </div>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <span className="w-9 h-9 rounded-full bg-happi-cyan/10 flex items-center justify-center">
                    <Award className="w-4 h-4 text-happi-cyan" />
                  </span>
                  {categories.length} categories
                </div>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <span className="w-9 h-9 rounded-full bg-happi-gold/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-happi-gold" />
                  </span>
                  100% natural
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/shop"
                  className="group inline-flex items-center justify-center gap-2.5 bg-happi-pink text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-xl shadow-happi-pink/30 hover:bg-pink-700 hover:shadow-2xl hover:shadow-happi-pink/40 hover:scale-[1.03] active:scale-95 transition-all duration-300 btn-shine"
                >
                  Shop All Products
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="/gifting"
                  className="group inline-flex items-center justify-center gap-2.5 border-2 border-happi-charcoal/10 bg-white/60 backdrop-blur text-happi-charcoal text-lg font-semibold px-8 py-4 rounded-2xl hover:border-happi-pink/40 hover:text-happi-pink hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <Gift className="w-5 h-5 text-happi-pink group-hover:scale-110 transition-transform" />
                  Explore Gift Packs
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES GRID ===== */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-white to-happi-cream">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-flex items-center gap-2 text-happi-pink font-bold uppercase tracking-[0.2em] text-sm mb-4">
              <span className="w-8 h-px bg-happi-pink" />
              Shop by Category
              <span className="w-8 h-px bg-happi-pink" />
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-4 tracking-tight">
              One Bite. <span className="text-gradient-happi">Endless Joy.</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Each category is hand-curated by our experts — so every product you see is one we'd proudly serve our own family.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category, index) => {
              const Icon = CATEGORY_ICONS[category.id] || Nut;
              const style = CATEGORY_STYLES[category.id] ?? CATEGORY_STYLES.nuts;
              const image = CATEGORY_IMAGES[category.id];

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: (index % 3) * 0.12 }}
                  className="perspective-1000 h-full"
                >
                  <SpotlightCard className="h-full">
                    <TiltCard maxTilt={7} scale={1.01} className="rounded-[1.75rem] h-full">
                      <a
                        href={`/shop?category=${category.id}`}
                        className="group relative block overflow-hidden rounded-[1.75rem] h-80 sm:h-88 md:h-96 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white"
                      >
                        {/* Background image */}
                        <div className="absolute inset-0 overflow-hidden">
                          <img
                            src={image}
                            alt={category.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-bl ${style.gradient} group-hover:opacity-80 transition-opacity duration-500`} />
                          <div className="absolute inset-0 bg-gradient-to-t from-happi-charcoal via-happi-charcoal/30 to-transparent" />
                        </div>

                        {/* Floating icon chip */}
                        <div className="absolute top-5 right-5 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                          <Icon className="w-7 h-7 text-white drop-shadow" />
                        </div>

                        {/* Content */}
                        <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                          <div className={`inline-block mb-3 px-3 py-1 rounded-full text-white text-[11px] font-bold uppercase tracking-wider ${style.badge} opacity-90`}>
                            {category.count} Products
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-1.5 group-hover:translate-x-1.5 transition-transform duration-300">
                            {category.name}
                          </h3>
                          <p className="text-white/70 text-sm mb-5">
                            Premium-quality picks in every pack
                          </p>

                          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-5 py-2.5 rounded-full text-white text-sm font-semibold group-hover:bg-happi-pink group-hover:gap-3 transition-all duration-300">
                            Explore Category
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Corner accents */}
                        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/40 rounded-tl-xl" />
                        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/40 rounded-br-xl" />

                        {/* Hover shine overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </a>
                    </TiltCard>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== QUALITY STRIP with 3D scene ===== */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-mesh opacity-50" />
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 text-happi-green font-bold uppercase tracking-[0.2em] text-sm mb-5">
                <Leaf className="w-5 h-5" />
                The Happi Difference
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-6 tracking-tight">
                Quality You Can <span className="text-gradient-happi">Taste</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Every product on our shelves goes through rigorous quality checks. Small batches,
                gentle processing, and zero shortcuts — that's the Happi promise.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: BadgeCheck, label: 'Farm-direct sourcing', color: 'text-happi-green bg-happi-green/10' },
                  { icon: ShieldCheck, label: 'Hygienic processing', color: 'text-happi-cyan bg-happi-cyan/10' },
                  { icon: Flame, label: 'Fresh small batches', color: 'text-happi-pink bg-happi-pink/10' },
                  { icon: Heart, label: 'No preservatives', color: 'text-happi-gold bg-happi-gold/10' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full ${item.color} font-semibold text-sm`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </motion.span>
                  );
                })}
              </div>

              <a
                href="/why-happi-nuts"
                className="group inline-flex items-center gap-2.5 text-happi-pink font-bold hover:gap-4 transition-all"
              >
                Learn more about our promise
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-[340px] md:h-[400px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-happi-cream via-white to-happi-cream border border-white shadow-2xl shadow-happi-charcoal/10">
                <ThemedScene variant="nuts" className="absolute inset-0" count={14} />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-white/90 to-transparent pointer-events-none">
                  <p className="text-center text-happi-charcoal font-bold">
                    60+ hand-picked products. One happy pantry.
                  </p>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.2, repeat: Infinity }}
                className="absolute -top-3 -right-3 bg-gradient-to-r from-happi-green to-emerald-500 text-white rounded-full px-5 py-2.5 shadow-xl text-sm font-bold"
              >
                🌿 Farm Fresh
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TOP RATED PRODUCTS ===== */}
      <section className="py-16 md:py-24 bg-happi-cream relative overflow-hidden">
        <div className="blob-decoration w-80 h-80 bg-happi-pink -top-24 -right-24 opacity-15 animate-blob" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
          >
            <div>
              <span className="inline-flex items-center gap-2 text-happi-gold font-bold uppercase tracking-[0.2em] text-sm mb-4">
                <Star className="w-4 h-4 fill-happi-gold" />
                Customer Favourites
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal tracking-tight">
                Most <span className="text-gradient-happi">Loved</span> Right Now
              </h2>
            </div>
            <a
              href="/shop"
              className="group inline-flex items-center gap-2 text-happi-pink font-semibold hover:gap-3 transition-all"
            >
              View Shop
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: (index % 3) * 0.12 }}
              >
                <SpotlightCard className="h-full">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    tamilName={product.tamilName}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    weight={product.weight}
                    rating={product.rating}
                    reviews={product.reviews}
                    badge={product.badge}
                    category={product.category}
                    image={product.image}
                    key={product.id}
                  />
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COUNTUP STATS ===== */}
      <section className="relative bg-happi-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-happi-charcoal via-[#3a1a2b] to-happi-charcoal animate-aurora opacity-90" />
        <div className="absolute inset-0 bg-hero-mesh opacity-20" />
        <div className="container relative py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '100', suffix: '%', label: 'Natural' },
              { num: '60', suffix: '+', label: 'Premium Products' },
              { num: '5000', suffix: '+', label: 'Happy Customers' },
              { num: '100', suffix: '%', label: 'Quality Focus' },
            ].map((stat, i) => (
              <AnimatedStat
                key={i}
                value={parseInt(stat.num)}
                suffix={stat.suffix}
                label={stat.label}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT CTA ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-happi-pink via-[#c2185b] to-happi-charcoal animate-gradient-shift text-white p-8 md:p-14"
          >
            <div className="absolute inset-0 bg-dots-pattern opacity-10" />
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

            <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/25 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
                  <Sparkles className="w-4 h-4" />
                  Need Help?
                </span>
                <h3 className="text-3xl md:text-4xl font-bold mb-3">
                  Can't Find What You're <span className="text-shimmer-white">Looking For?</span>
                </h3>
                <p className="text-white/85 text-lg mb-0 max-w-xl">
                  We source the finest products from trusted suppliers. Get in touch and we'll help
                  you find the perfect match — or source it just for you.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2.5 bg-white text-happi-pink font-bold px-8 py-4 rounded-2xl shadow-xl hover:bg-gray-100 hover:scale-[1.03] active:scale-95 transition-all duration-300 btn-shine"
                >
                  Contact Us
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="/gifting"
                  className="group inline-flex items-center justify-center gap-2.5 bg-white/10 backdrop-blur border border-white/25 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white hover:text-happi-pink transition-all duration-300"
                >
                  <PlayCircle className="w-5 h-5" />
                  Gifting Enquiry
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}