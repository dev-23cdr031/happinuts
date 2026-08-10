import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkle, Leaf, Sun, Wheat, Heart, Nut } from 'lucide-react';
import TiltCard from '@/components/three/TiltCard';
import { getCatalogCategories, syncCatalogFromSupabase } from '@/data/products';

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

const CATEGORY_GRADIENTS: Record<string, string> = {
  nuts: 'from-happi-pink/30 to-happi-cyan/30',
  seeds: 'from-happi-gold/30 to-happi-pink/20',
  dried: 'from-happi-cyan/30 to-happi-green/20',
  pantry: 'from-happi-green/30 to-happi-gold/20',
  sweets: 'from-happi-pink/30 to-happi-gold/30',
};

export default function Categories() {
  const [categories, setCategories] = useState(() => getCatalogCategories());

  // Pull in any products the admin added/saved to Supabase so category
  // counts stay accurate on the customer's Categories page.
  useEffect(() => {
    let cancelled = false;
    syncCatalogFromSupabase().then(() => {
      if (!cancelled) setCategories(getCatalogCategories());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-happi-cream via-white to-happi-cream pb-12 md:pb-16">
        <div className="blob-decoration w-96 h-96 bg-happi-pink -top-32 -right-32 animate-blob" />
        <div className="blob-decoration w-80 h-80 bg-happi-cyan -bottom-20 -left-20 animate-blob" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-dots-pattern opacity-40" />

        <div className="container relative text-center pt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-happi-pink/20 text-happi-pink text-sm font-semibold px-4 py-2 rounded-full mb-5">
              <Sparkle className="w-4 h-4" />
              Explore Our Collection
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-happi-charcoal mb-4">
              Find Your Favorite <span className="text-gradient-happi">Crunch</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our premium collection of dry fruits, nuts, seeds, and healthy pantry essentials
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== CATEGORIES GRID ===== */}
      <section className="py-10 md:py-16 bg-gradient-to-b from-white to-happi-cream">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const Icon = CATEGORY_ICONS[category.id] || Nut;
              const gradient = CATEGORY_GRADIENTS[category.id] || 'from-happi-pink/30 to-happi-cyan/30';
              const image = CATEGORY_IMAGES[category.id];

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="perspective-1000"
                >
                  <TiltCard
                    maxTilt={8}
                    scale={1.01}
                    className="rounded-3xl group"
                  >
                    <a
                      href={`/shop?category=${category.id}`}
                      className="relative block overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all h-80 bg-white"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0 overflow-hidden">
                        <img
                          src={image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} group-hover:opacity-75 transition-opacity duration-300`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-happi-charcoal via-happi-charcoal/30 to-transparent opacity-90" />
                      </div>

                      {/* Floating Icon */}
                      <div className="absolute top-6 right-6 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">
                          {category.name}
                        </h3>
                        <p className="text-white/70 text-sm mb-4">
                          {category.count} premium products
                        </p>
                        <div className="flex items-center gap-2 text-happi-gold font-semibold group-hover:gap-3 transition-all">
                          <span className="inline-block bg-white/20 backdrop-blur px-4 py-2 rounded-full text-white text-sm group-hover:bg-happi-pink group-hover:border-happi-pink transition-all">
                            Explore Category
                          </span>
                          <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {/* Decorative corner */}
                      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/40 rounded-tl-xl" />
                      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/40 rounded-br-xl" />
                    </a>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>

          {/* ===== CATEGORY STRIP ===== */}
          <div className="mt-16 md:mt-20 bg-happi-charcoal text-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="blob-decoration w-64 h-64 bg-happi-pink -top-20 -right-20 opacity-30 animate-blob" />
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Can't find what you're <span className="text-gradient-happi">looking for?</span>
                </h2>
                <p className="text-white/80 text-lg">
                  We source the finest products from trusted suppliers. Get in touch and we'll help you find the perfect product.
                </p>
              </div>
              <div className="flex md:justify-end">
                <a href="/contact" className="btn-primary text-lg inline-flex items-center gap-2 btn-shine">
                  Contact Us
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}