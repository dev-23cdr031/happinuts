import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Zap, Leaf, Truck, Star, Sparkle, ShieldCheck, BadgeCheck, Gift, ThumbsUp } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import TiltCard from '@/components/three/TiltCard';
import { getVisibleCatalogProducts, syncCatalogFromSupabase } from '@/data/products';

export default function Home() {
  const [products, setProducts] = useState(() => getVisibleCatalogProducts());

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
  const featured = badgeProducts.length > 0
    ? badgeProducts
    : [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);

  const features = [
    {
      icon: BadgeCheck,
      title: 'Premium Quality',
      description: 'Carefully selected dry fruits from trusted sources',
    },
    {
      icon: Leaf,
      title: '100% Natural',
      description: 'No additives, no preservatives — pure goodness',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Freshly packed and delivered within days',
    },
    {
      icon: ShieldCheck,
      title: 'Hygienic Packaging',
      description: 'Handled with care in clean facilities',
    },
  ];

  const stats = [
    { number: '100%', label: 'Quality Focus' },
    { number: '60+', label: 'Premium Products' },
    { number: '100%', label: 'Care' },
    { number: '1', label: 'Happi Brand' },
  ];

  const testimonials = [
    {
      name: 'Priya R.',
      initials: 'PR',
      text: 'The cashews are incredibly fresh! You can taste the quality difference immediately. Happi Nuts has become our family\'s go-to. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Karthik S.',
      initials: 'KS',
      text: 'Ordered the gifting hamper for Diwali — presentation was stunning and the nuts were premium quality. Everyone loved them. Will definitely order again!',
      rating: 5,
    },
    {
      name: 'Meena L.',
      initials: 'ML',
      text: 'Finally found a brand that delivers on freshness. The almonds are crunchy and full of flavor. Packaging is beautiful and hygienic. 10/10!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-happi-cream via-white to-happi-cream pt-8 pb-16 md:pb-24">
        {/* Decorative blobs */}
        <div className="blob-decoration w-96 h-96 bg-happi-pink -top-20 -left-20 animate-blob" />
        <div className="blob-decoration w-80 h-80 bg-happi-cyan top-40 -right-32 animate-blob" style={{ animationDelay: '2s' }} />
        <div className="blob-decoration w-72 h-72 bg-happi-gold bottom-0 left-1/3 animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-dots-pattern opacity-40" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-8">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-happi-pink/20 text-happi-pink text-sm font-semibold px-4 py-2 rounded-full mb-6 pulse-ring">
                <Sparkle className="w-4 h-4" />
                Premium Dry Fruits & Nuts
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-happi-charcoal mb-6 leading-tight">
                Healthy Bites.{' '}
                <span className="text-shimmer">Happier</span>{' '}
                <span className="text-happi-cyan">Moments.</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Premium dry fruits, nuts and healthy delights — carefully selected to bring nutrition, freshness and happiness to every bite. Freshly packed, delivered with care.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
                <a href="/shop" className="btn-primary text-lg flex items-center justify-center gap-2 btn-shine">
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a href="/categories" className="btn-outline text-lg flex items-center justify-center gap-2">
                  Explore Collection
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-happi-gold fill-happi-gold" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">4.9/5 from happy customers</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ThumbsUp className="w-5 h-5 text-happi-green" />
                  <span>Trusted by thousands</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[300px] sm:h-[360px] md:h-[480px] lg:h-[540px]"
            >
              <img
                src="/assets/hero-nuts.png"
                alt="A vibrant mix of premium nuts and dried fruits"
                className="h-full w-full rounded-[2rem] object-cover shadow-2xl shadow-happi-charcoal/20"
              />

              {/* Floating badge cards */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute top-3 right-2 md:right-8 glass-card-light rounded-2xl px-3 py-2.5 sm:px-5 sm:py-4 z-10"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-happi-green/15 flex items-center justify-center">
                    <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-happi-green" />
                  </div>
                  <div>
                    <div className="font-bold text-happi-charcoal text-xs sm:text-sm">100% Natural</div>
                    <div className="text-[10px] sm:text-xs text-gray-500">No additives</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-6 left-1 md:left-6 glass-card-light rounded-2xl px-3 py-2.5 sm:px-5 sm:py-4 z-10"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-happi-pink/15 flex items-center justify-center">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-happi-pink" />
                  </div>
                  <div>
                    <div className="font-bold text-happi-charcoal text-xs sm:text-sm">Fast Delivery</div>
                    <div className="text-[10px] sm:text-xs text-gray-500">Packed fresh</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE STRIP ===== */}
      <div className="bg-happi-charcoal text-white py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee w-max">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-4 text-sm md:text-base font-medium">
              <span>✦ Premium Quality</span>
              <span>✦ Freshly Packed</span>
              <span>✦ 100% Natural</span>
              <span>✦ Hygienic</span>
              <span>✦ Fast Delivery</span>
              <span>✦ Loved by Customers</span>
              <span>✦ Trusted Brand</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== BRAND STATEMENT ===== */}
      <section className="py-16 bg-gradient-to-r from-happi-pink via-happi-cyan to-happi-pink animate-gradient-shift text-white">
        <div className="container text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            HappiNuts Gives <span className="text-shimmer-white">Healthy.</span>
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            HappiNuts Gives <span className="text-shimmer-white">Happiness.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-white/90"
          >
            Because healthy food should always taste this good.
          </motion.p>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-4">
              Why Customers <span className="text-gradient-happi">Choose Us</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Every detail matters when it comes to your health and happiness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="text-center group"
                >
                  <div className="relative mb-4 inline-flex justify-center">
                    <div className="p-4 bg-happi-cream rounded-full group-hover:bg-happi-pink group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-8 h-8 text-happi-pink group-hover:text-white transition-colors" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-happi-pink/20 scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-happi-charcoal">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== BESTSELLERS ===== */}
      <section className="py-16 md:py-24 bg-happi-cream relative overflow-hidden">
        <div className="blob-decoration w-72 h-72 bg-happi-pink -top-20 -right-20 animate-blob" />
        <div className="container relative">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-happi-pink font-semibold mb-3">
              <Sparkle className="w-5 h-5" />
              Customer Favorites
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-4">
              Our Bestsellers
            </h2>
            <p className="text-gray-600 text-lg">
              Loved by thousands of happy customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featured.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.12 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/shop" className="btn-primary text-lg inline-flex items-center gap-2 btn-shine">
              View All Products
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ===== SIGNATURE PRODUCT ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="perspective-1000"
            >
              <TiltCard className="rounded-2xl shadow-2xl">
                <img
                  src="/assets/signature-mascot.jpg"
                  alt="Happi Nuts mascot waving"
                  className="w-full h-96 object-contain rounded-2xl bg-white"
                />
              </TiltCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 text-happi-gold font-semibold mb-3">
                <BadgeCheck className="w-5 h-5" />
                Signature Collection
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-4">
                The Happi Nuts <span className="text-gradient-happi">Signature</span>
              </h2>
              <p className="text-xl text-happi-pink font-semibold mb-6">
                One perfect mix. Countless reasons to smile.
              </p>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Our signature blend combines the finest almonds, cashews, pistachios, walnuts, and premium dried fruits. Each bite is a perfect balance of nutrition, taste, and happiness.
              </p>
              <ul className="space-y-3 mb-8">
                {['Finest almonds, cashews & pistachios', 'Premium dried fruits & berries', 'Perfect balance of nutrition & taste'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-happi-green/15 flex items-center justify-center flex-shrink-0">
                      <span className="w-2 h-2 bg-happi-green rounded-full" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="/product/8" className="btn-primary inline-flex items-center gap-2 btn-shine">
                Discover More
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STATISTICS ===== */}
      <section className="py-16 md:py-24 bg-happi-charcoal text-white relative overflow-hidden">
        <div className="blob-decoration w-80 h-80 bg-happi-pink -bottom-20 -left-20 opacity-20 animate-blob" />
        <div className="container relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-happi-pink to-happi-gold">
                  {stat.number}
                </div>
                <div className="text-lg text-white/80">{stat.label}</div>
                <div className="mx-auto mt-4 w-12 h-0.5 bg-gradient-to-r from-happi-pink to-happi-cyan" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 md:py-24 bg-happi-cream">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-happi-pink font-semibold mb-3">
              <Heart className="w-5 h-5 fill-happi-pink" />
              Happy Customers
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-4">
              Stories of <span className="text-gradient-happi">Happiness</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Real reviews from real happy customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl p-8 shadow-lg relative"
              >
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-happi-pink rounded-full flex items-center justify-center rotate-6 shadow-lg">
                  <Heart className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-happi-gold fill-happi-gold" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-happi-pink to-happi-cyan flex items-center justify-center text-white font-bold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-happi-charcoal">{testimonial.name}</div>
                    <div className="text-xs text-gray-400">Verified Customer</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GIFTING PREVIEW ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-happi-gold font-semibold mb-3">
                <Gift className="w-5 h-5" />
                Gifting
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-4">
                Give Health.{' '}
                <span className="text-gradient-happi">Give Happiness.</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Thoughtfully packed dry fruit gifts for the moments that matter. Perfect for festivals, celebrations, and corporate gifting.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/gifting" className="btn-primary inline-flex items-center gap-2 btn-shine">
                  Explore Gifting
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a href="/contact" className="btn-outline inline-flex items-center gap-2">
                  Corporate Enquiry
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <TiltCard className="rounded-2xl shadow-2xl">
                <img
                  src="/assets/gifting-box.png"
                  alt="Premium gift box with a green and gold ribbon"
                  className="w-full h-96 object-cover rounded-2xl"
                />
              </TiltCard>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-happi-pink text-white px-4 py-2 rounded-xl shadow-xl"
              >
                <span className="font-semibold text-sm">✦ Perfect for every occasion</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-happi-pink via-[#E91E73] to-happi-cyan text-white animate-gradient-shift relative overflow-hidden">
        <div className="absolute inset-0 bg-dots-pattern opacity-10" />
        <div className="container text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/15 backdrop-blur mb-6 pulse-ring">
              <Zap className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get <span className="text-shimmer-white">Happi?</span>
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Discover the perfect blend of nutrition and happiness
            </p>
            <a
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-happi-pink font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all hover:scale-105 btn-shine"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
