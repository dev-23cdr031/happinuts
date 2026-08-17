import { useEffect, useState, useRef, useCallback, type ReactNode } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
  ArrowRight,
  Heart,
  Zap,
  Leaf,
  Truck,
  Star,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  Gift,
  Quote,
  Nut,
  Sun,
  Wheat,
  PlayCircle,
  ChevronDown,
  Award,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import TiltCard from '@/components/three/TiltCard';
import { getVisibleCatalogProducts, syncCatalogFromSupabase, getCatalogCategories } from '@/data/products';

const CATEGORY_META: Record<string, { icon: typeof Nut; image: string; tone: string; blurb: string }> = {
  nuts: {
    icon: Nut,
    image: '/assets/products/premium-almonds.webp',
    tone: 'from-happi-pink/90 to-rose-500/80',
    blurb: 'Premium almonds, cashews & more',
  },
  seeds: {
    icon: Sun,
    image: '/assets/products/pumpkin-seeds.webp',
    tone: 'from-happi-gold/90 to-amber-500/80',
    blurb: 'Wholesome seeds for every day',
  },
  dried: {
    icon: Leaf,
    image: '/assets/products/golden-raisins.jpg',
    tone: 'from-happi-cyan/90 to-sky-500/80',
    blurb: 'Chewy, sun-kissed dried fruits',
  },
  pantry: {
    icon: Wheat,
    image: '/assets/products/kodo-millet.jpg',
    tone: 'from-happi-green/90 to-emerald-500/80',
    blurb: 'Millets, dals & healthy staples',
  },
  sweets: {
    icon: Heart,
    image: '/assets/products/fruit-chips.webp',
    tone: 'from-fuchsia-500/90 to-happi-pink/80',
    blurb: 'Guilt-free treats & indulgences',
  },
};

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
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 2200, bounce: 0 });

  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplay(Math.round(latest).toLocaleString());
    });
    return unsubscribe;
  }, [spring]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative group text-center"
    >
      <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center group-hover:bg-happi-pink group-hover:border-happi-pink transition-all duration-300 group-hover:scale-110">
        <Sparkles className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
      </div>
      <div className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-happi-pink via-happi-gold to-happi-cyan">
        {display}
        {suffix}
      </div>
      <div className="text-white/80 text-sm md:text-base uppercase tracking-wider">{label}</div>
      <div className="mx-auto mt-4 w-12 h-1 rounded-full bg-gradient-to-r from-happi-pink via-happi-gold to-happi-cyan opacity-60 group-hover:opacity-100 group-hover:w-20 transition-all duration-500" />
    </motion.div>
  );
}

/** Card that follows cursor with a soft spotlight glow */
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

export default function Home() {
  const [products, setProducts] = useState(() => getVisibleCatalogProducts());
  const [categories] = useState(() => getCatalogCategories());

  // Pull in any products the admin added/saved to Supabase so they
  // appear on the customer's Home page across browsers.
  useEffect(() => {
    let cancelled = false;
    syncCatalogFromSupabase().then((catalog) => {
      if (!cancelled) setProducts(catalog);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const badgeProducts = products.filter((p) => p.badge).slice(0, 6);
  const featured =
    badgeProducts.length > 0
      ? badgeProducts
      : [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);

  const features = [
    {
      icon: BadgeCheck,
      title: 'Premium Quality',
      description: 'Hand-picked dry fruits from trusted, vetted farms.',
      tone: 'from-happi-pink/15 to-happi-pink/5 text-happi-pink',
      shadow: 'shadow-happi-pink/20',
    },
    {
      icon: Leaf,
      title: '100% Natural',
      description: 'No additives, no preservatives — pure, honest goodness.',
      tone: 'from-happi-green/15 to-happi-green/5 text-happi-green',
      shadow: 'shadow-happi-green/20',
    },
    {
      icon: Truck,
      title: 'Express Delivery',
      description: 'Freshly packed in small batches and delivered in days.',
      tone: 'from-happi-cyan/15 to-happi-cyan/5 text-happi-cyan',
      shadow: 'shadow-happi-cyan/20',
    },
    {
      icon: ShieldCheck,
      title: 'Hygienic Packaging',
      description: 'Sealed with care in certified clean facilities.',
      tone: 'from-happi-gold/15 to-happi-gold/5 text-happi-gold',
      shadow: 'shadow-happi-gold/20',
    },
  ];

  const stats = [
    { value: 100, suffix: '%', label: 'Quality Focus' },
    { value: 60, suffix: '+', label: 'Premium Products' },
    { value: 5000, suffix: '+', label: 'Happy Customers' },
    { value: 1, suffix: '', label: 'Happi Brand' },
  ];

  const testimonials = [
    {
      name: 'Priya R.',
      initials: 'PR',
      location: 'Madurai',
      text: 'The cashews are incredibly fresh! You can taste the quality difference the moment you open the pack. Happi Nuts has become our family\'s go-to for healthy snacking.',
      rating: 5,
      gradient: 'from-happi-pink to-happi-cyan',
    },
    {
      name: 'Karthik S.',
      initials: 'KS',
      location: 'Chennai',
      text: 'Ordered the gifting hamper for Diwali — the presentation was stunning and every single nut was premium quality. Everyone at home loved them. Will definitely order again!',
      rating: 5,
      gradient: 'from-happi-gold to-happi-pink',
    },
    {
      name: 'Meena L.',
      initials: 'ML',
      location: 'Coimbatore',
      text: 'Finally found a brand that delivers on freshness. The almonds are crunchy, full of flavor, and the packaging feels premium and hygienic. Truly a 10/10 experience!',
      rating: 5,
      gradient: 'from-happi-cyan to-happi-green',
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-happi-cream pt-6 pb-0">
        <div className="absolute inset-0 bg-hero-mesh" />
        <div className="blob-decoration w-[28rem] h-[28rem] bg-happi-pink -top-32 -left-32 opacity-25 animate-blob" />
        <div className="blob-decoration w-[26rem] h-[26rem] bg-happi-cyan top-24 -right-40 opacity-20 animate-blob" style={{ animationDelay: '3s' }} />
        <div className="blob-decoration w-96 h-96 bg-happi-gold bottom-0 left-1/4 opacity-15 animate-blob" style={{ animationDelay: '6s' }} />
        <div className="absolute inset-0 bg-dots-pattern opacity-30" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-10 md:pt-14 pb-10 md:pb-14">
            {/* LEFT — Copy */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative z-10 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur border border-happi-pink/20 text-happi-pink text-sm font-semibold px-5 py-2.5 rounded-full mb-7 shadow-sm hover:shadow-md transition-shadow animate-bounce-gentle">
                <Sparkles className="w-4 h-4" />
                <span>Premium Dry Fruits & Nuts — Freshly Packed</span>
                <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-happi-pink animate-pulse" />
              </div>

              <h1 className="text-[2.6rem] leading-[1.08] sm:text-5xl md:text-6xl xl:text-7xl font-extrabold text-happi-charcoal mb-6 tracking-tight">
                Healthy Bites.{' '}
                <span className="text-shimmer">Happier</span>{' '}
                <span className="relative inline-block">
                  <span className="text-happi-cyan">Moments.</span>
                  <svg
                    className="absolute -bottom-3 left-0 w-full text-happi-cyan/40"
                    viewBox="0 0 200 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path d="M2 9C50 3 150 3 198 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-9 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Premium dry fruits, nuts and healthy delights — carefully selected to bring
                <span className="font-semibold text-happi-charcoal"> nutrition</span>,
                <span className="font-semibold text-happi-charcoal"> freshness</span> and
                <span className="font-semibold text-happi-charcoal"> happiness</span> to every bite.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-9 justify-center lg:justify-start">
                <a
                  href="/shop"
                  className="group relative inline-flex items-center justify-center gap-2.5 bg-happi-pink text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-xl shadow-happi-pink/30 hover:shadow-2xl hover:shadow-happi-pink/40 hover:scale-[1.03] active:scale-95 transition-all duration-300 overflow-hidden btn-shine"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="/categories"
                  className="group inline-flex items-center justify-center gap-2.5 border-2 border-happi-charcoal/10 bg-white/60 backdrop-blur text-happi-charcoal text-lg font-semibold px-8 py-4 rounded-2xl hover:border-happi-pink/40 hover:text-happi-pink hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  <PlayCircle className="w-5 h-5 text-happi-pink group-hover:scale-110 transition-transform" />
                  Explore Collection
                </a>
              </div>

              {/* Social proof */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 mb-4">
                <div className="flex items-center">
                  <div className="flex -space-x-3">
                    {['PR', 'KS', 'ML', 'AR'].map((initials, i) => (
                      <div
                        key={initials}
                        style={{ background: `linear-gradient(135deg, hsl(${220 + i * 60} 65% 60%), hsl(${280 + i * 40} 70% 55%))` }}
                        className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold text-white shadow-md"
                      >
                        {initials}
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-happi-charcoal flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                      +2k
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-happi-gold fill-happi-gold" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 font-medium">4.9/5 from 2,000+ happy customers</p>
                  </div>
                </div>
              </div>

              {/* Trust chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                {['100% Natural', 'No Preservatives', 'Hygienic Pack', 'Tamper-proof Seal'].map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur border border-happi-green/20 text-happi-green text-xs font-semibold px-3.5 py-1.5 rounded-full"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-happi-green" />
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — Hero visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative h-[340px] sm:h-[420px] md:h-[500px] lg:h-[560px]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-tr from-happi-pink/20 via-happi-cyan/10 to-happi-gold/20 blur-2xl" />
              </div>

              <div className="relative h-full w-full">
                <TiltCard maxTilt={8} scale={1.02} className="h-full w-full rounded-[2.5rem] shadow-[0_30px_80px_-20px_rgba(44,44,44,0.35)]">
                  <img
                    src="/assets/hero-nuts.png"
                    alt="A vibrant mix of premium nuts and dried fruits"
                    className="h-full w-full rounded-[2.5rem] object-cover"
                  />
                  <div className="absolute inset-0 rounded-[2.5rem] border-2 border-white/40 pointer-events-none" />
                </TiltCard>

                <svg
                  className="absolute -top-5 -right-5 w-28 h-28 text-happi-pink/30 animate-spin-slow"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
                </svg>
                <svg
                  className="absolute -bottom-4 -left-4 w-24 h-24 text-happi-cyan/25 animate-spin-slow"
                  style={{ animationDirection: 'reverse' }}
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" strokeDasharray="4 10" />
                </svg>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -14, 0], rotate: [0, 2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-4 right-0 md:top-8 md:-right-2 glass-card-light rounded-2xl px-4 py-3 sm:px-6 sm:py-4 z-10 shadow-2xl shadow-happi-green/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full bg-happi-green/15 flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-happi-green" />
                      <span className="absolute inset-0 rounded-full border-2 border-happi-green/30 animate-ping" style={{ animationDuration: '2.5s' }} />
                    </div>
                    <div>
                      <div className="font-bold text-happi-charcoal text-sm sm:text-base leading-tight">100% Natural</div>
                      <div className="text-[11px] sm:text-xs text-gray-500">Zero additives</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 14, 0], rotate: [0, -1.5, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                  className="absolute bottom-8 left-2 md:bottom-14 md:-left-4 glass-card-light rounded-2xl px-4 py-3 sm:px-6 sm:py-4 z-10 shadow-2xl shadow-happi-cyan/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-happi-cyan/15 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-happi-cyan" />
                    </div>
                    <div>
                      <div className="font-bold text-happi-charcoal text-sm sm:text-base leading-tight">Express Delivery</div>
                      <div className="text-[11px] sm:text-xs text-gray-500">Packed fresh for you</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                  className="absolute bottom-24 -right-1 md:bottom-28 md:right-6 glass-card-light rounded-2xl px-4 py-3 hidden sm:block z-10 shadow-2xl shadow-happi-gold/10"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <div className="font-bold text-happi-charcoal text-sm leading-tight">Loved by thousands</div>
                      <div className="text-[11px] text-gray-500">Verified reviews</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ scale: [1, 1.08, 1], rotate: [0, 3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  className="absolute -top-4 left-4 md:-top-5 md:left-8 z-20"
                >
                  <div className="bg-gradient-to-br from-happi-pink to-rose-500 text-white rounded-2xl px-5 py-3 shadow-xl shadow-happi-pink/30 relative">
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-happi-pink rotate-45" />
                    <div className="text-xs font-medium opacity-90">Fresh from nature</div>
                    <div className="text-lg font-extrabold leading-tight">60+ Products</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.a
            href="#highlights"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-gray-400 hover:text-happi-pink transition-colors"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.2em]">Scroll to explore</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.a>
        </div>
      </section>

      {/* ===== MARQUEE STRIP ===== */}
      <div className="bg-happi-charcoal text-white py-5 overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-marquee w-max">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 px-4 text-sm md:text-base font-semibold tracking-wide">
              <span className="flex items-center gap-2"><span className="text-happi-gold">✦</span> Premium Quality</span>
              <span className="flex items-center gap-2"><span className="text-happi-pink">✦</span> Freshly Packed</span>
              <span className="flex items-center gap-2"><span className="text-happi-cyan">✦</span> 100% Natural</span>
              <span className="flex items-center gap-2"><span className="text-happi-green">✦</span> Hygienic</span>
              <span className="flex items-center gap-2"><span className="text-happi-gold">✦</span> Express Delivery</span>
              <span className="flex items-center gap-2"><span className="text-happi-pink">✦</span> Loved by 5000+ Customers</span>
              <span className="flex items-center gap-2"><span className="text-happi-cyan">✦</span> Trusted Brand</span>
              <span className="flex items-center gap-2"><span className="text-happi-green">✦</span> Gifting Ready</span>
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-happi-charcoal to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-happi-charcoal to-transparent pointer-events-none" />
      </div>

      {/* ===== FEATURES / WHY US ===== */}
      <section id="highlights" className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 md:mb-16"
          >
            <span className="inline-flex items-center gap-2 text-happi-pink font-bold uppercase tracking-[0.2em] text-sm mb-4">
              <span className="w-8 h-px bg-happi-pink" />
              Why Customers Choose Us
              <span className="w-8 h-px bg-happi-pink" />
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-4 tracking-tight">
              Everything Your Family{' '}
              <span className="text-gradient-happi">Deserves</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From farm-fresh sourcing to your doorstep — we obsess over every detail
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.1 }}
                >
                  <SpotlightCard className="h-full">
                    <div className="group h-full bg-gradient-to-b from-white to-happi-cream/60 border border-happi-charcoal/5 rounded-3xl p-8 text-center hover:shadow-2xl hover:shadow-happi-pink/10 transition-all duration-500 hover:-translate-y-2">
                      <div className="relative mb-6 inline-flex justify-center">
                        <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${feature.tone} shadow-lg ${feature.shadow} group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-happi-pink/15 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                      </div>
                      <h3 className="font-bold text-lg mb-2.5 text-happi-charcoal group-hover:text-happi-pink transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CATEGORY SHOWCASE ===== */}
      <section className="py-20 md:py-28 bg-happi-cream relative overflow-hidden">
        <div className="blob-decoration w-80 h-80 bg-happi-cyan -top-24 -right-20 opacity-15 animate-blob" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
          >
            <div>
              <span className="inline-flex items-center gap-2 text-happi-cyan font-bold uppercase tracking-[0.2em] text-sm mb-4">
                <Sparkles className="w-4 h-4" />
                Shop by Category
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal tracking-tight">
                Find Your Favourite <span className="text-gradient-happi">Crunch</span>
              </h2>
            </div>
            <a
              href="/categories"
              className="group inline-flex items-center gap-2 text-happi-pink font-semibold hover:gap-3 transition-all self-start md:self-auto"
            >
              View All Categories
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.slice(0, 3).map((category, index) => {
              const meta = CATEGORY_META[category.id] ?? CATEGORY_META.nuts;
              const Icon = meta.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.12 }}
                  className="perspective-1000"
                >
                  <TiltCard maxTilt={7} scale={1.02} className="rounded-[1.75rem]">
                    <a
                      href={`/shop?category=${category.id}`}
                      className="group relative block overflow-hidden rounded-[1.75rem] h-72 sm:h-80 shadow-lg hover:shadow-2xl transition-all duration-500"
                    >
                      <img
                        src={meta.image}
                        alt={category.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-bl ${meta.tone} opacity-30 group-hover:opacity-20 transition-opacity duration-500`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-happi-charcoal via-happi-charcoal/20 to-transparent" />

                      <div className="absolute top-5 right-5 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                        <Icon className="w-7 h-7 text-white drop-shadow" />
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-7">
                        <h3 className="text-2xl font-bold text-white mb-1.5 group-hover:translate-x-1.5 transition-transform duration-300">
                          {category.name}
                        </h3>
                        <p className="text-white/70 text-sm mb-4">{meta.blurb} · {category.count} items</p>
                        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-white text-sm font-semibold group-hover:bg-happi-pink group-hover:gap-3 transition-all duration-300">
                          Explore
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/40 rounded-tl-xl" />
                      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/40 rounded-br-xl" />
                    </a>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== BESTSELLERS ===== */}
      <section className="py-20 md:py-28 bg-happi-cream relative overflow-hidden">
        <div className="blob-decoration w-96 h-96 bg-happi-pink -top-24 -right-24 opacity-15 animate-blob" />
        <div className="blob-decoration w-72 h-72 bg-happi-cyan -bottom-24 -left-24 opacity-15 animate-blob" style={{ animationDelay: '4s' }} />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 md:mb-16"
          >
            <span className="inline-flex items-center gap-2 text-happi-pink font-bold uppercase tracking-[0.2em] text-sm mb-5">
              <Sparkles className="w-4 h-4" />
              Customer Favourites
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-4 tracking-tight">
              Our <span className="text-gradient-happi">Bestsellers</span>
            </h2>
            <p className="text-gray-600 text-lg">
              The crunches our customers can't stop talking about
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featured.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: (index % 3) * 0.12 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mt-12"
          >
            <a
              href="/shop"
              className="group inline-flex items-center gap-2.5 border-2 border-happi-charcoal/10 bg-white text-happi-charcoal font-bold px-8 py-4 rounded-2xl hover:border-happi-pink/40 hover:text-happi-pink hover:shadow-lg transition-all duration-300"
            >
              View All Products
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative py-20 md:py-28 bg-happi-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-happi-charcoal via-[#3a1a2b] to-happi-charcoal animate-aurora opacity-90" />
        <div className="absolute inset-0 bg-dots-pattern opacity-5" />
        <div className="absolute inset-0 bg-hero-mesh opacity-30" />

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 md:mb-16"
          >
            <span className="inline-flex items-center gap-2 text-happi-gold font-bold uppercase tracking-[0.2em] text-sm">
              <Award className="w-5 h-5" />
              Numbers We're Proud Of
            </span>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
            {stats.map((stat, index) => (
              <AnimatedStat
                key={index}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="blob-decoration w-80 h-80 bg-happi-green -top-20 -left-20 opacity-10 animate-blob" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 md:mb-16"
          >
            <span className="inline-flex items-center gap-2 text-happi-pink font-bold uppercase tracking-[0.2em] text-sm mb-5">
              <Heart className="w-4 h-4 fill-happi-pink" />
              Happy Customers
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-4 tracking-tight">
              Stories of <span className="text-gradient-happi">Happiness</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Real reviews from real happy customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.12 }}
                whileHover={{ y: -8 }}
                className="relative"
              >
                <div className="bg-gradient-to-b from-happi-cream to-white rounded-3xl p-8 shadow-lg shadow-happi-charcoal/5 hover:shadow-2xl hover:shadow-happi-pink/10 transition-all duration-500 border border-white">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center shadow-lg mb-6`}>
                    <Quote className="w-5 h-5 text-white fill-white" />
                  </div>

                  <div className="flex gap-1 mb-5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-happi-gold fill-happi-gold" />
                    ))}
                  </div>

                  <p className="text-gray-600 mb-8 leading-relaxed">"{testimonial.text}"</p>

                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold shadow-md`}>
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="font-bold text-happi-charcoal">{testimonial.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <BadgeCheck className="w-3.5 h-3.5 text-happi-cyan" />
                        Verified Customer · {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-2 -right-2 w-9 h-9 bg-happi-pink rounded-2xl flex items-center justify-center rotate-6 shadow-lg">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GIFTING PREVIEW ===== */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden border-t border-white">
        <div className="absolute inset-0 bg-hero-mesh opacity-50" />
        <div className="container relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 text-happi-gold font-bold uppercase tracking-[0.2em] text-sm mb-5">
                <Gift className="w-5 h-5" />
                Gifting
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-5 tracking-tight">
                Give Health.{' '}
                <span className="text-gradient-happi">Give Happiness.</span>
              </h2>
              <p className="text-gray-600 text-lg mb-9 leading-relaxed max-w-lg">
                Thoughtfully packed dry fruit gifts for the moments that matter.
                Perfect for festivals, celebrations, and corporate gifting.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/gifting"
                  className="group inline-flex items-center gap-2.5 bg-happi-pink text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-happi-pink/25 hover:bg-pink-700 hover:scale-[1.03] active:scale-95 transition-all duration-300 btn-shine"
                >
                  Explore Gifting
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2.5 border-2 border-happi-charcoal/10 bg-white/70 text-happi-charcoal font-semibold px-8 py-4 rounded-2xl hover:border-happi-pink/40 hover:text-happi-pink hover:shadow-lg transition-all duration-300"
                >
                  Corporate Enquiry
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="perspective-1000">
                <TiltCard className="rounded-[2rem] shadow-2xl shadow-happi-charcoal/25">
                  <img
                    src="/assets/gifting-box.png"
                    alt="Premium gift box with a green and gold ribbon"
                    loading="lazy"
                    className="w-full h-80 md:h-96 object-cover rounded-[2rem]"
                  />
                </TiltCard>

                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, -2, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-4 left-6 bg-gradient-to-r from-happi-pink to-rose-500 text-white px-6 py-3.5 rounded-2xl shadow-xl shadow-happi-pink/30"
                >
                  <span className="font-bold text-sm">✦ Perfect for every occasion</span>
                </motion.div>

                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -top-4 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center"
                >
                  <Sparkles className="w-6 h-6 text-happi-gold" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-happi-pink via-[#c2185b] to-happi-charcoal animate-gradient-shift" />
        <div className="absolute inset-0 bg-dots-pattern opacity-10" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-happi-gold/20 rounded-full blur-3xl" />

        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/15 backdrop-blur mb-8 pulse-ring border border-white/30">
              <Zap className="w-10 h-10 text-yellow-300 drop-shadow" />
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Ready to Get <span className="text-shimmer-white">Happi?</span>
            </h2>

            <p className="text-xl text-white/90 mb-10 max-w-xl mx-auto leading-relaxed">
              Discover the perfect blend of nutrition and happiness —
              your new favourite snack ritual awaits.
            </p>

            <motion.a
              href="/shop"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group inline-flex items-center gap-3 bg-white text-happi-pink font-extrabold text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-black/20 hover:shadow-happi-charcoal/40 transition-shadow btn-shine"
            >
              Start Shopping Today
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </motion.a>

            <p className="mt-7 text-white/70 text-sm font-medium tracking-wide">
              Free shipping on orders over ₹999 · 100% freshness guarantee
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}