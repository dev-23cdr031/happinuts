import { motion } from 'framer-motion';
import { Check, TrendingUp, X, Sparkle, ShieldCheck, BadgeCheck, Award } from 'lucide-react';
import TiltCard from '@/components/three/TiltCard';
import MiniNutField from '@/components/three/MiniNutField';

export default function WhyHappiNuts() {
  const reasons = [
    {
      number: '01',
      title: 'Premium Quality',
      description: 'Carefully selected dry fruits sourced from trusted suppliers worldwide.',
      icon: Award,
    },
    {
      number: '02',
      title: 'Freshness',
      description: 'Packed to preserve taste and freshness. Delivered within days of packing.',
      icon: ShieldCheck,
    },
    {
      number: '03',
      title: 'Hygienic Packaging',
      description: 'Handled and packed with care in hygienic facilities.',
      icon: BadgeCheck,
    },
    {
      number: '04',
      title: 'Natural Goodness',
      description: 'No artificial additives, preservatives, or harmful chemicals.',
      icon: Check,
    },
    {
      number: '05',
      title: 'Trust',
      description: 'Quality customers can depend on. Trusted by thousands of happy customers.',
      icon: Sparkle,
    },
    {
      number: '06',
      title: 'Happiness',
      description: 'Because healthy choices should feel good. Every bite brings joy.',
      icon: TrendingUp,
    },
  ];

  const stats = [
    { value: '100%', label: 'Quality Focus' },
    { value: '60+', label: 'Premium Products' },
    { value: '100%', label: 'Care' },
    { value: '1', label: 'Happi Brand' },
  ];

  const comparison = [
    {
      category: 'Source Quality',
      happi: 'Premium, carefully selected',
      ordinary: 'Generic, bulk sourced',
    },
    {
      category: 'Freshness',
      happi: 'Packed within days',
      ordinary: 'Often months old',
    },
    {
      category: 'Packaging',
      happi: 'Hygienic, premium',
      ordinary: 'Basic, standard',
    },
    {
      category: 'Additives',
      happi: 'None - 100% natural',
      ordinary: 'May contain additives',
    },
    {
      category: 'Taste',
      happi: 'Rich, authentic flavor',
      ordinary: 'Bland, processed',
    },
    {
      category: 'Health Benefits',
      happi: 'Maximum nutrition retained',
      ordinary: 'Reduced nutrients',
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-happi-cream via-white to-happi-cream pb-12 md:pb-16">
        <div className="blob-decoration w-96 h-96 bg-happi-pink -top-32 -right-32 animate-blob" />
        <div className="blob-decoration w-80 h-80 bg-happi-gold -bottom-20 -left-20 animate-blob" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-dots-pattern opacity-40" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pt-10">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-happi-pink/20 text-happi-pink text-sm font-semibold px-4 py-2 rounded-full mb-5">
                <TrendingUp className="w-4 h-4" />
                The Happi Difference
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-happi-charcoal mb-4">
                Why <span className="text-gradient-happi">Happi Nuts?</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-xl">
                Discover what makes us different. We don't just sell nuts — we deliver quality, freshness, and happiness in every single bite.
              </p>
              <a href="/shop" className="btn-primary text-lg inline-flex items-center gap-2 btn-shine">
                Experience the Difference
                <TrendingUp className="w-5 h-5" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative h-[280px] md:h-[340px]"
            >
              <MiniNutField className="w-full h-full" color="#D9A441" count={10} />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute top-6 left-2 glass-card-light rounded-2xl px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-happi-green" />
                  <span className="font-semibold text-sm text-happi-charcoal">Quality Guaranteed</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SIX REASONS ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-happi-pink font-semibold mb-3">
              <Sparkle className="w-5 h-5" />
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-4">
              Six Reasons to <span className="text-gradient-happi">Choose Happi</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Every product we deliver passes through rigorous quality checks so you get nothing but the best
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((reason, idx) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="group relative bg-happi-cream p-8 rounded-2xl hover:shadow-2xl transition-all overflow-hidden"
                >
                  <div className="absolute -top-4 -right-4 text-8xl font-bold text-happi-pink/5 group-hover:text-happi-pink/10 transition-colors">
                    {reason.number}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-5 group-hover:bg-happi-pink group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Icon className="w-7 h-7 text-happi-pink group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-happi-charcoal mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed relative z-10">
                    {reason.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== STATISTICS ===== */}
      <section className="py-16 md:py-24 bg-happi-charcoal text-white relative overflow-hidden">
        <div className="blob-decoration w-80 h-80 bg-happi-pink -bottom-20 -right-20 opacity-30 animate-blob" />
        <div className="blob-decoration w-72 h-72 bg-happi-cyan -top-20 -left-20 opacity-20 animate-blob" style={{ animationDelay: '2s' }} />
        <div className="container relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              By The <span className="text-shimmer-white">Numbers</span>
            </h2>
            <p className="text-white/80 text-lg">
              The numbers that define our commitment
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-happi-pink to-happi-gold">
                  {stat.value}
                </div>
                <div className="text-lg text-white/80">{stat.label}</div>
                <div className="mx-auto mt-4 w-12 h-0.5 bg-gradient-to-r from-happi-pink to-happi-cyan" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPARISON ===== */}
      <section className="py-16 md:py-24 bg-happi-cream relative overflow-hidden">
        <div className="blob-decoration w-72 h-72 bg-happi-cyan -top-20 -right-20 animate-blob" />
        <div className="container relative">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-happi-green font-semibold mb-3">
              <ShieldCheck className="w-5 h-5" />
              The Clear Difference
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-4">
              Happi Nuts vs <span className="text-gradient-happi">Ordinary Snacking</span>
            </h2>
            <p className="text-gray-600 text-lg">
              See why thousands of customers made the switch
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-x-auto rounded-3xl shadow-xl"
          >
            <table className="w-full bg-white">
              <thead>
                <tr className="border-b-2 bg-gradient-to-r from-happi-pink to-happi-cyan text-white">
                  <th className="text-left py-5 px-6 font-bold rounded-tl-3xl">
                    Category
                  </th>
                  <th className="text-left py-5 px-6 font-bold">
                    <span className="flex items-center gap-2">
                      <Sparkle className="w-5 h-5" />
                      Happi Nuts
                    </span>
                  </th>
                  <th className="text-left py-5 px-6 font-bold rounded-tr-3xl">
                    Ordinary Snacking
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className={`border-b ${idx % 2 === 0 ? 'bg-happi-cream' : 'bg-white'} hover:bg-happi-cream/60 transition-colors`}
                  >
                    <td className="py-4 px-6 font-semibold text-happi-charcoal">
                      {row.category}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-2 text-happi-charcoal">
                        <span className="w-6 h-6 rounded-full bg-happi-green/15 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-happi-green" />
                        </span>
                        {row.happi}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-2 text-gray-600">
                        <span className="w-6 h-6 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0">
                          <X className="w-4 h-4 text-red-500" />
                        </span>
                        {row.ordinary}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ===== RECOMMENDATION ===== */}
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
                  alt="Why Happi Nuts"
                  className="w-full h-96 object-cover rounded-3xl"
                />
              </TiltCard>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 bg-happi-gold text-white px-5 py-3 rounded-2xl shadow-xl"
              >
                <div className="font-bold">Recommended</div>
                <div className="text-xs opacity-90">By health experts</div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 text-happi-pink font-semibold mb-3">
                <Award className="w-5 h-5" />
                The Happi Promise
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-6">
                We Promise <span className="text-gradient-happi">Nothing Less</span> Than the Best
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                When you choose Happi Nuts, you're choosing a brand that obsesses over every detail — from sourcing the finest ingredients to delivering them fresh to your door. Because you deserve nothing less.
              </p>
              <a href="/contact" className="btn-primary text-lg inline-flex items-center gap-2 btn-shine">
                Get In Touch
                <TrendingUp className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-happi-cyan to-happi-pink text-white animate-gradient-shift relative overflow-hidden">
        <div className="absolute inset-0 bg-dots-pattern opacity-10" />
        <div className="container text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience the <span className="text-shimmer-white">Difference?</span>
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of happy customers who've made the switch
            </p>
            <a href="/shop" className="inline-block bg-white text-happi-pink font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all hover:scale-105 btn-shine flex items-center gap-2 justify-center">
              Shop Now
              <TrendingUp className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
