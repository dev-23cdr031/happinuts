import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown, Sparkle, X, Package, TrendingUp } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getCatalogCategories, getVisibleCatalogProducts, syncCatalogFromSupabase } from '@/data/products';

export default function Shop() {
  const [products, setProducts] = useState(() => getVisibleCatalogProducts());
  const categories = useMemo(() => getCatalogCategories(), []);
  const maxMenuPrice = useMemo(
    () => Math.max(...products.map((product) => product.price)),
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

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ===== HEADER ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-happi-cream via-white to-happi-cream">
        <div className="blob-decoration w-96 h-96 bg-happi-pink -top-32 -left-32 animate-blob" />
        <div className="blob-decoration w-80 h-80 bg-happi-cyan top-20 right-0 animate-blob" style={{ animationDelay: '2.5s' }} />
        <div className="absolute inset-0 bg-dots-pattern opacity-40" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-8 pb-12 md:pb-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-happi-pink/20 text-happi-pink text-sm font-semibold px-4 py-2 rounded-full mb-4">
                <Package className="w-4 h-4" />
                Full Collection
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-happi-charcoal mb-4">
                Shop <span className="text-gradient-happi">Happi Nuts</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative h-[220px] md:h-[260px]"
            >
              <img
                src="/assets/shop-hero-nuts.png"
                alt="A premium in-store Happi Nuts display"
                className="h-full w-full rounded-3xl object-cover shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SEARCH & FILTERS ===== */}
      <section className="sticky top-20 z-30 bg-white/90 backdrop-blur-lg border-b border-gray-200 py-6 md:py-8 shadow-sm">
        <div className="container">
          {/* Search Bar */}
          <div className="mb-6 md:mb-0">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-happi-pink focus:ring-2 focus:ring-happi-pink/20 transition-all bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-happi-pink"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sort & Filters Row */}
          <div className="flex flex-col md:flex-row gap-4 mt-6 md:mt-0 md:justify-between md:items-center">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-happi-pink pr-8 bg-white text-gray-700"
              >
                <option value="popular">Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-600" />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-happi-pink text-happi-pink rounded-xl hover:bg-happi-pink/10 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Product Count */}
            <p className="text-gray-600 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-happi-green" />
              Showing {Math.min(visibleProducts.length, filteredProducts.length)} of {filteredProducts.length} products
            </p>
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className={`md:block ${showFilters ? 'block' : 'hidden'} md:col-span-1`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 bg-white rounded-2xl border border-gray-100 shadow-lg p-6"
            >
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-lg text-happi-charcoal mb-4 flex items-center gap-2">
                  <Sparkle className="w-4 h-4 text-happi-pink" />
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`block w-full text-left px-3 py-2 rounded-xl transition-all ${
                      selectedCategory === null
                        ? 'bg-gradient-to-r from-happi-pink to-happi-cyan text-white shadow-md'
                        : 'hover:bg-happi-cream text-gray-700'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`block w-full text-left px-3 py-2 rounded-xl transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-gradient-to-r from-happi-pink to-happi-cyan text-white shadow-md'
                          : 'hover:bg-happi-cream text-gray-700'
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        <span>{cat.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-happi-cream text-gray-500'}`}>
                          {cat.count}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-lg text-happi-charcoal mb-4">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max={maxMenuPrice}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-happi-pink"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span className="px-3 py-1 bg-happi-cream rounded-lg font-medium">₹{priceRange[0]}</span>
                  <span className="px-3 py-1 bg-happi-cream rounded-lg font-medium">₹{priceRange[1]}</span>
                </div>
              </div>

              {/* Reset Filters */}
              <button onClick={resetFilters} className="w-full btn-outline text-sm">
                Reset Filters
              </button>
            </motion.div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {visibleProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
                    >
                      <ProductCard {...product} />
                    </motion.div>
                  ))}
                </div>

                {visibleProducts.length < filteredProducts.length && (
                  <div className="mt-10 text-center">
                    <button onClick={() => setVisibleCount((count) => count + 12)} className="btn-outline">
                      Load 12 more products
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-happi-cream rounded-3xl"
              >
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg text-gray-600 mb-4">
                  No products found matching your criteria.
                </p>
                <button onClick={resetFilters} className="btn-primary">
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
