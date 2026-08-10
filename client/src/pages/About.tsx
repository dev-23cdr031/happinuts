import { motion } from 'framer-motion';
import { Heart, Leaf, Zap, Award, Sparkle, ArrowRight, BadgeCheck } from 'lucide-react';
import TiltCard from '@/components/three/TiltCard';
import MiniNutField from '@/components/three/MiniNutField';

export default function About() {
  const timeline = [
    { step: 'Vision', description: 'Dreaming of healthier snacking', year: 'The Beginning' },
    { step: 'Quality', description: 'Sourcing the finest ingredients', year: 'Our Promise' },
    { step: 'Care', description: 'Careful handling and packing', year: 'Every Day' },
    { step: 'Health', description: 'Delivering nutrition', year: 'To Your Door' },
    { step: 'Happiness', description: 'Bringing joy to every bite', year: 'Always' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Premium Quality',
      description: 'Carefully selected dry fruits from trusted sources',
    },
    {
      icon: Leaf,
      title: 'Natural Goodness',
      description: 'No artificial additives or preservatives',
    },
    {
      icon: Zap,
      title: 'Freshness',
      description: 'Packed to preserve taste and nutrition',
    },
    {
      icon: Award,
      title: 'Trust',
      description: 'Quality our customers can depend on',
    },
  ];

  const milestones = [
    { number: '60+', label: 'Premium Products' },
    { number: '100%', label: 'Quality Focus' },
    { number: '100%', label: 'Natural Goodness' },
    { number: '1', label: 'Happi Brand' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-happi-cream via-white to-happi-cream pb-12 md:pb-16">
        <div className="blob-decoration w-96 h-96 bg-happi-pink -top-32 -left-32 animate-blob" />
        <div className="blob-decoration w-80 h-80 bg-happi-cyan top-40 -right-20 animate-blob" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-dots-pattern opacity-40" />

        <div className="container relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-happi-pink/20 text-happi-pink text-sm font-semibold px-4 py-2 rounded-full mb-5">
              <Heart className="w-4 h-4 fill-happi-pink" />
              Our Story
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-happi-charcoal mb-4">
              More Than Just <span className="text-gradient-happi">Nuts</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto md:mx-0">
              At Happi Nuts, we believe every healthy choice should come with a little happiness.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="h-60 md:h-72"
          >
            <img
              src="/assets/about-products.jpg"
              alt="A selection of Happi Nuts products"
              className="h-full w-full rounded-3xl object-cover shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ===== OUR STORY ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="perspective-1000 relative"
            >
              <TiltCard className="rounded-3xl shadow-2xl">
                <img
                  src="/manus-storage/hero-almonds-cashews_6b5f2cb0.png"
                  alt="Our Story"
                  className="w-full h-96 object-cover rounded-3xl"
                />
              </TiltCard>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-happi-pink text-white px-5 py-3 rounded-2xl shadow-xl"
              >
                <div className="font-bold text-lg">Since Day One</div>
                <div className="text-xs opacity-90">Committed to quality</div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 text-happi-pink font-semibold mb-3">
                <Sparkle className="w-5 h-5" />
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-6">
                Born from a Simple <span className="text-gradient-happi">Belief</span>
              </h2>
              <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                Happi Nuts was born from a simple belief: healthy food should always taste this good. We started with a vision to bring premium, carefully selected dry fruits to health-conscious individuals who refuse to compromise on quality or taste.
              </p>
              <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                Every product in our collection is handpicked, tested for quality, and packed with care. We work directly with trusted suppliers to ensure freshness, purity, and the best nutritional value.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Today, thousands of happy customers trust Happi Nuts for their daily nutrition and special occasions. We're committed to making healthy snacking accessible, affordable, and absolutely delicious.
              </p>
              <a href="/why-happi-nuts" className="btn-primary mt-8 inline-flex items-center gap-2 btn-shine">
                Why Happi Nuts?
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== 3D DIVIDER ===== */}
      <section className="relative bg-gradient-to-r from-happi-pink via-happi-cyan to-happi-pink py-4" />

      {/* ===== MILESTONES ===== */}
      <section className="py-16 md:py-20 bg-happi-cream relative overflow-hidden">
        <div className="blob-decoration w-64 h-64 bg-happi-gold -bottom-20 -left-20 animate-blob" />
        <div className="container relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {milestones.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-happi-pink to-happi-gold mb-2">
                  {m.number}
                </div>
                <div className="text-gray-600">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR VALUES ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-happi-cyan font-semibold mb-3">
              <BadgeCheck className="w-5 h-5" />
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-4">
              Our <span className="text-gradient-happi">Values</span>
            </h2>
            <p className="text-gray-600 text-lg">
              The principles that guide every decision we make
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all border border-gray-100 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-happi-cream flex items-center justify-center mx-auto mb-5 group-hover:bg-happi-pink group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Icon className="w-8 h-8 text-happi-pink group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-happi-charcoal mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== JOURNEY TIMELINE ===== */}
      <section className="py-16 md:py-24 bg-happi-cream relative overflow-hidden">
        <div className="blob-decoration w-72 h-72 bg-happi-cyan -top-20 -right-20 animate-blob" />
        <div className="container relative">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-happi-gold font-semibold mb-3">
              <Sparkle className="w-5 h-5" />
              The Road So Far
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-4">
              Our <span className="text-gradient-happi">Journey</span>
            </h2>
          </div>

            <div className="relative mx-auto max-w-5xl px-1 sm:px-4">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-happi-pink via-happi-gold to-happi-cyan rounded-full" />

            {/* Timeline Items */}
            <div className="space-y-8 md:space-y-10">
              {timeline.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`flex ${idx % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-5 md:gap-6 relative z-10`}
                >
                  {/* Content */}
                  <div className="flex-1 text-left">
                    <div className={`w-full max-w-md bg-white rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all ${idx % 2 === 0 ? 'md:ml-auto' : ''}`}>
                      <div className="text-sm font-semibold text-happi-pink mb-1">{item.year}</div>
                      <h3 className="text-2xl font-bold text-happi-charcoal mb-2">
                        {item.step}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="hidden md:flex w-10 h-10 bg-gradient-to-br from-happi-pink to-happi-cyan rounded-full border-4 border-white shadow-lg flex-shrink-0 items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3D NUT FIELD ===== */}
      <section className="relative bg-happi-charcoal text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <MiniNutField className="w-full h-full" color="#E91E73" count={8} />
        </div>
        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Every Nut. Every Bite.{' '}
              <span className="text-shimmer-white">Pure Happiness.</span>
            </h2>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-happi-pink to-happi-cyan text-white animate-gradient-shift relative overflow-hidden">
        <div className="absolute inset-0 bg-dots-pattern opacity-10" />
        <div className="container text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Happy <span className="text-shimmer-white">Community</span>
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Experience the Happi Nuts difference today
            </p>
            <a href="/shop" className="inline-block bg-white text-happi-pink font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all hover:scale-105 btn-shine">
              Shop Now
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
