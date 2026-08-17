import { useEffect, useMemo, useState, useRef, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  Sparkles,
  X,
  Package,
  TrendingUp,
  SlidersHorizontal,
  Leaf,
  Truck,
  ShieldCheck,
  BadgeCheck,
  Star,
  ArrowRight,
  Gift,
  Flame,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import TiltCard from '@/components/three/TiltCard';
import ThemedScene from '@/components/three/ThemedScene';
import { getCatalogCategories, getVisibleCatalogProducts, syncCatalogFromSupabase } from '@/data/products';

const CATEGORY_STYLES: Record<string, { emoji: string; gradient: string; chip: string; blurb: string }> = {
  nuts: {
    emoji: '🥜',
    gradient: 'from-happi-pink/20 via-happi-cyan/10 to-transparent',
    chip: 'from-happi-pink/15 to-happi-pink/5 text-happi-pink border-happi-pink/20',
    blurb: 'Almonds, cashews, pistachios',
  },
  seeds: {
    emoji: '🌻',
    gradient: 'from-happi-gold/25 via-happi-pink/10 to-transparent',
    chip: 'from-happi-gold/15 to-happi-gold/5 text-happi-gold border-happi-gold/20',
    blurb: 'Wholesome seeds & superfoods',
  },
  dried: {
    emoji: '🍇',
    gradient: 'from-happi-cyan/25 via-happi-green/10 to-transparent',
    chip: 'from-happi-cyan/15 to-happi-cyan/5 text-happi-cyan border-happi-cyan/20',
    blurb: 'Sun-kissed dried fruits & berries',
  },
  pantry: {
    emoji: '🌾',
    gradient: 'from-happi-green/25 via-happi-gold/10 to-transparent',
    chip: 'from-happi-green/15 to-happi-green/5 text-happi-green border-happi-green/20',
    blurb: 'Millets, dals & healthy staples',
  },
  sweets: {
    emoji: '🍬',
    gradient: 'from-fuchsia-500/25 via-happi-pink/10 to-transparent',
    chip: 'from-fuchsia-500/15 to-happi-pink/5 text-fuchsia-600 border-fuchsia-500/20',
    blurb: 'Guilt-free treats & indulgences',
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

export default function Shop() {
  const [products, setProducts] = useState(() => getVisibleCatalogProducts());
  const categories = useMemo(() => getCatalogCategories(), []);
  const maxMenuPrice = useMemo(
    () => Math.max(...products.map((product) => product.price), 1),
    [products],
  );

  // Pull in any products the admin added/saved to Supabase so they
  // appear on the customer's Shop page across browsers.
  useEffect(() => {
    let cancelled = false;
    syncCatalogFromSupabase().then((catalog) => {
      if (!cancelled) setProducts(catalog);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    const category = new URLSearchParams(window.location.search).get('category');
    return categories.some((item) => item.id === category) ? category : null;
  });
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, maxMenuPrice]);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    result = result.filter(
      (product, index, allProducts) => allProducts.findIndex((item) => item.name === product.name) === index,
    );

    // Search filter
    if (searchQuery) {
      const query = searchQuery.trim().toLocaleLowerCase();
      result = result.filter((p) =>
        p.name.toLocaleLowerCase().includes(query) || p.tamilName.includes(searchQuery.trim())
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Price filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.reverse();
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, priceRange]);

  useEffect(() => setVisibleCount(12), [searchQuery, selectedCategory, sortBy, priceRange]);
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortBy('popular');
    setPriceRange([0, maxMenuPrice]);
  };

  const activeFilterCount =
    (searchQuery ? 1 : 0) + (selectedCategory ? 1 : 0) + (sortBy !== 'popular' ? 1 : 0) +
    (priceRange[1] < maxMenuPrice ? 1 : 0);

  const featuredProduct = products.find((p) => p.badge === 'bestseller') ?? products[0];
  const avgRating = products.length > 0
    ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)
    : '4.9';

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ================================================================ */}
      {/* HERO — immersive shop header                                      */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden bg-happi-cream">
        <div className="absolute inset-0 bg-hero-mesh" />
        <div className="blob-decoration w-[26rem] h-[26rem] bg-happi-pink -top-32 -left-32 opacity-20 animate-blob" />
        <div className="blob-decoration w-[24rem] h-[24rem] bg-happi-cyan top-20 -right-32 opacity-20 animate-blob" style={{ animationDelay: '3s' }} />
        <div className="blob-decoration w-80 h-80 bg-happi-gold bottom-0 left-1/3 opacity-15 animate-blob" style={{ animationDelay: '5s' }} />
        <div className="absolute inset-0 bg-dots-pattern opacity-30" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center pt-10 pb-12 md:pb-16">
            {/* LEFT — Copy */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative z-10 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur border border-happi-pink/20 text-happi-pink text-sm font-semibold px-5 py-2.5 rounded-full mb-6 shadow-sm animate-bounce-gentle">
                <Package className="w-4 h-4" />
                <span>The Full Collection</span>
                <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-happi-pink animate-pulse" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-happi-charcoal mb-5 tracking-tight leading-[1.08]">
                Shop <span className="text-gradient-happi">Happi Nuts</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Explore our hand-picked collection of premium dry fruits, nuts, seeds and healthy
                delights — every pack crafted to bring happiness to your table.
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 mb-8">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <span className="w-8 h-8 rounded-full bg-happi-pink/10 flex items-center justify-center">
                    <Package className="w-4 h-4 text-happi-pink" />
                  </span>
                  {products.length}+ products
                </div>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <span className="w-8 h-8 rounded-full bg-happi-gold/10 flex items-center justify-center">
                    <Star className="w-4 h-4 text-happi-gold fill-happi-gold" />
                  </span>
                  {avgRating}/5 rated
                </div>
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <span className="w-8 h-8 rounded-full bg-happi-cyan/10 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-happi-cyan" />
                  </span>
                  Free shipping ₹999+
                </div>
              </div>
            </motion.div>

            {/* RIGHT — Imagery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative h-[280px] sm:h-[340px] md:h-[380px]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-tr from-happi-pink/15 via-happi-cyan/10 to-happi-gold/15 blur-2xl" />
              </div>

              <TiltCard maxTilt={7} scale={1.02} className="h-full w-full rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(44,44,44,0.3)]">
                <img
                  src="/assets/shop-hero-nuts.png"
                  alt="A premium in-store Happi Nuts display"
                  className="h-full w-full rounded-[2rem] object-cover"
                />
                <div className="absolute inset-0 rounded-[2rem] border border-white/40 pointer-events-none" />
              </TiltCard>

              {/* Floating ratings badge */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-3 -right-3 glass-card-light rounded-2xl px-4 py-3 shadow-xl z-10"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {['P', 'K', 'M'].map((i, idx) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-happi-pink to-happi-cyan border-2 border-white flex items-center justify-center text-[8px] font-bold text-white" style={{ zIndex: 3 - idx }}>
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-happi-charcoal text-xs leading-tight">4.9 rated</div>
                    <div className="text-[10px] text-gray-500">2k+ reviews</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating offer badge */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], rotate: [0, -3, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-6 left-4 md:left-2 z-10"
              >
                <div className="bg-gradient-to-r from-happi-pink to-rose-500 text-white rounded-2xl px-5 py-3 shadow-xl shadow-happi-pink/30">
                  <div className="flex items-center gap-2.5">
                    <Tag className="w-5 h-5" />
                    <div>
                      <div className="text-[11px] font-medium opacity-90">Special Offers</div>
                      <div className="text-sm font-extrabold leading-tight">Up to 40% OFF</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CATEGORY CHIPS ROW — quick filter pills                           */}
      {/* ================================================================ */}
      <section className="bg-white border-b border-gray-100 py-5">
        <div className="container">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
            <span className="hidden sm:flex items-center gap-1 text-sm font-bold text-happi-charcoal whitespace-nowrap shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-happi-pink" />
              Quick View:
            </span>
            {/* All chips */}
            <div className="flex gap-2.5 shrink-0">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === null
                    ? 'bg-happi-pink text-white border-happi-pink shadow-lg shadow-happi-pink/25 scale-[1.03]'
                    : 'border-gray-200 text-gray-600 hover:border-happi-pink/40 hover:text-happi-pink hover:bg-happi-pink/5'
                }`}
              >
                <Package className="w-4 h-4" />
                All Products
              </button>
              {categories.map((cat) => {
                const style = CATEGORY_STYLES[cat.id] ?? CATEGORY_STYLES.nuts;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                    className={`group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? `bg-gradient-to-r ${style.chip.split(' ').slice(0, 2).join(' ')} text-happi-charcoal border-transparent shadow-lg scale-[1.03]`
                        : 'border-gray-100 text-gray-600 hover:border-happi-pink/40 hover:bg-happi-pink/5'
                    }`}
                  >
                    <span className="text-base">{style.emoji}</span>
                    {cat.name}
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      selectedCategory === cat.id ? 'bg-white/50 text-happi-charcoal' : 'bg-gray-100 text-gray-500 group-hover:bg-happi-pink/10 group-hover:text-happi-pink'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SEARCH & TOOLBAR (sticky)                                          */}
      {/* ================================================================ */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-lg border-b border-gray-200 py-5 shadow-sm">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-6 items-center">
            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-happi-pink transition-colors" />
              <input
                type="text"
                placeholder="Search for almonds, cashews, dates, millets…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-happi-pink focus:ring-4 focus:ring-happi-pink/10 transition-all bg-white shadow-sm hover:shadow-md placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-happi-pink bg-gray-100 hover:bg-happi-pink/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort & count */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-happi-pink focus:ring-4 focus:ring-happi-pink/10 bg-white text-gray-700 font-medium text-sm cursor-pointer"
                >
                  <option value="popular">✨ Popular</option>
                  <option value="price-low">₹ Price: Low to High</option>
                  <option value="price-high">₹ Price: High to Low</option>
                  <option value="rating">⭐ Highest Rated</option>
                  <option value="newest">🆕 Newest</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-3.5 border-2 border-happi-pink/30 text-happi-pink rounded-2xl hover:bg-happi-pink/5 transition-all font-medium text-sm"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-6 h-6 rounded-full bg-happi-pink text-white text-[11px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Row: count + reset */}
          <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
            <p className="text-gray-600 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-happi-green" />
              Showing <span className="font-bold text-happi-charcoal">{Math.min(visibleProducts.length, filteredProducts.length)}</span> of{' '}
              <span className="font-bold text-happi-charcoal">{filteredProducts.length}</span> products
              {selectedCategory && (
                <span className="ml-1 hidden md:inline text-gray-400">· {categories.find((c) => c.id === selectedCategory)?.name}</span>
              )}
            </p>
            {activeFilterCount > 0 && (
              <button onClick={resetFilters} className="inline-flex items-center gap-1.5 text-xs font-semibold text-happi-pink hover:text-pink-700 transition-colors">
                <X className="w-3.5 h-3.5" />
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* MAIN CONTENT AREA                                                 */}
      {/* ================================================================ */}
      <div className="container py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">
          {/* ===== SIDEBAR FILTERS ===== */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-44 space-y-8 bg-gradient-to-b from-white to-happi-cream/60 rounded-3xl border border-gray-100 shadow-xl shadow-happi-charcoal/5 p-7"
            >
              {/* Sidebar heading */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-happi-charcoal flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-happi-pink" />
                  Refine
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-semibold text-happi-charcoal mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-gray-500">
                  <Sparkles className="w-4 h-4 text-happi-pink" />
                  Categories
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`group flex w-full items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                      selectedCategory === null
                        ? 'bg-gradient-to-r from-happi-pink to-happi-cyan text-white shadow-lg shadow-happi-pink/20'
                        : 'text-gray-700 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Package className="w-4 h-4" />
                      All Products
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${selectedCategory === null ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-happi-pink/10 group-hover:text-happi-pink'}`}>
                      {products.length}
                    </span>
                  </button>
                  {categories.map((cat) => {
                    const style = CATEGORY_STYLES[cat.id] ?? CATEGORY_STYLES.nuts;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                        className={`group flex w-full items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 ${
                          selectedCategory === cat.id
                            ? 'bg-gradient-to-r from-happi-pink to-happi-cyan text-white shadow-lg shadow-happi-pink/20'
                            : 'text-gray-700 hover:bg-white hover:shadow-md'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span>{style.emoji}</span>
                          {cat.name}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-happi-pink/10 group-hover:text-happi-pink'}`}>
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-happi-charcoal mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-gray-500">
                  <TrendingUp className="w-4 h-4 text-happi-pink" />
                  Price Range
                </h4>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={maxMenuPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-happi-pink h-2 rounded-full appearance-none bg-happi-pink/15"
                  />
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-happi-pink to-happi-cyan rounded-full pointer-events-none opacity-30" />
                </div>
                <div className="flex justify-between items-center mt-3 gap-3">
                  <span className="flex-1 px-4 py-2 bg-white rounded-xl border border-gray-100 font-bold text-happi-charcoal text-center shadow-sm">
                    ₹{priceRange[0]}
                  </span>
                  <span className="text-gray-300">—</span>
                  <span className="flex-1 px-4 py-2 bg-white rounded-xl border border-gray-100 font-bold text-happi-pink text-center shadow-sm">
                    ₹{priceRange[1]}
                  </span>
                </div>
              </div>

              {/* Trust box */}
              <div className="rounded-2xl bg-gradient-to-br from-happi-pink/10 via-happi-cyan/10 to-happi-gold/10 border border-white p-5">
                <h4 className="font-bold text-sm text-happi-charcoal mb-4">Why shop with us?</h4>
                <div className="space-y-3">
                  {[
                    { icon: Leaf, text: '100% natural, zero additives', color: 'text-happi-green bg-happi-green/10' },
                    { icon: ShieldCheck, text: 'Hygienic & tamper-proof pack', color: 'text-happi-cyan bg-happi-cyan/10' },
                    { icon: Truck, text: 'Express fresh delivery', color: 'text-happi-pink bg-happi-pink/10' },
                    { icon: BadgeCheck, text: 'Certified premium quality', color: 'text-happi-gold bg-happi-gold/10' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-center gap-2.5">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-sm text-gray-700 font-medium">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reset */}
              <button onClick={resetFilters} className="w-full btn-outline text-sm flex items-center justify-center gap-2">
                <X className="w-4 h-4" />
                Reset All Filters
              </button>
            </motion.div>
          </aside>

          {/* ===== PRODUCTS GRID ===== */}
          <div>
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  <AnimatePresence mode="popLayout">
                    {visibleProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: (index % 3) * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                      >
                        <SpotlightCard className="h-full">
                          <ProductCard {...product} />
                        </SpotlightCard>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {visibleProducts.length < filteredProducts.length && (
                  <div className="mt-12 text-center">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setVisibleCount((count) => count + 12)}
                      className="group inline-flex items-center gap-3 border-2 border-happi-pink/20 bg-white text-happi-pink font-bold px-8 py-4 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-happi-pink/10 hover:border-happi-pink/40 transition-all duration-300 btn-shine"
                    >
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-happi-pink opacity-50" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-happi-pink" />
                      </span>
                      Load 12 More Products
                      <span className="text-sm text-gray-400 font-medium">({filteredProducts.length - visibleProducts.length} remaining)</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-24 px-6 relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-happi-cream to-white border border-gray-100 shadow-xl"
              >
                <div className="blob-decoration w-64 h-64 bg-happi-pink -top-20 -left-20 opacity-15 animate-blob" />
                <div className="relative">
                  <div className="text-7xl mb-6 animate-bounce-gentle inline-block">🔍</div>
                  <h3 className="text-2xl font-bold text-happi-charcoal mb-3">No products found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We couldn't find anything matching your search. Try a different keyword or clear your filters to browse our full collection.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                      className="btn-primary inline-flex items-center gap-2 btn-shine"
                    >
                      <X className="w-4 h-4" />
                      Clear Filters
                    </button>
                    <a
                      href="/categories"
                      className="inline-flex items-center gap-2 border-2 border-happi-charcoal/10 text-happi-charcoal font-semibold px-6 py-3 rounded-xl hover:border-happi-pink/40 hover:text-happi-pink transition-all"
                    >
                      Browse Categories
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===== PROMO BANNER BELOW GRID ===== */}
            {filteredProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-16 relative overflow-hidden rounded-[2rem] bg-happi-charcoal text-white shadow-2xl shadow-happi-charcoal/25"
              >
                <div className="blob-decoration w-72 h-72 bg-happi-pink -top-24 -right-24 opacity-30 animate-blob" />
                <div className="blob-decoration w-64 h-64 bg-happi-cyan -bottom-24 -left-24 opacity-25 animate-blob" style={{ animationDelay: '3s' }} />
                <div className="absolute inset-0 bg-dots-pattern opacity-5" />

                <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center p-8 md:p-12">
                  <div>
                    <span className="inline-flex items-center gap-2 bg-happi-pink/20 border border-happi-pink/30 text-happi-pink text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
                      <Flame className="w-4 h-4" />
                      Limited Time
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold mb-3">
                      Get <span className="text-shimmer-white">Healthy.</span>{' '}
                      Get <span className="text-shimmer-white">Happi.</span>
                    </h3>
                    <p className="text-white/80 text-lg mb-6">
                      Order before midnight and enjoy free express delivery on orders over ₹999 + extra 5% off on your first order.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <a
                        href="/gifting"
                        className="group inline-flex items-center gap-2.5 bg-happi-pink text-white font-bold px-7 py-3.5 rounded-xl hover:bg-pink-600 transition-colors hover:scale-[1.03] active:scale-95 btn-shine"
                      >
                        Explore Gift Hampers
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>
                      <a
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white hover:text-happi-pink transition-colors"
                      >
                        Need Help?
                      </a>
                    </div>
                  </div>

                  {/* Mini scene / visual */}
                  <div className="hidden md:block w-64 h-64 relative">
                    <ThemedScene variant="nuts" className="absolute inset-0" count={10} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ===== TRUST STRIP ===== */}
      <section className="bg-happi-cream border-t border-gray-100">
        <div className="container py-8 md:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf, title: '100% Natural', desc: 'No additives, no preservatives' },
              { icon: Truck, title: 'Express Delivery', desc: 'Packed fresh & shipped fast' },
              { icon: ShieldCheck, title: 'Hygienic Pack', desc: 'Sealed in clean facilities' },
              { icon: BadgeCheck, title: 'Quality Assured', desc: 'Hand-picked & vetted' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-happi-pink" />
                  </div>
                  <div>
                    <div className="font-bold text-happi-charcoal leading-tight">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}