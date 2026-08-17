import { useRef, useCallback, useState, useEffect, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Check,
  TrendingUp,
  X,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  Award,
  Heart,
  Leaf,
  Star,
  ArrowRight,
} from 'lucide-react';
import TiltCard from '@/components/three/TiltCard';
import MiniNutField from '@/components/three/MiniNutField';

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
function AnimatedStat({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
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

export default function WhyHappiNuts() {
  const reasons = [
    {
      number: '01',
      title: 'Premium Quality',
      description: 'Carefully selected dry fruits sourced from trusted suppliers worldwide.',
      icon: Award,
      tone: 'from-happi-pink/15 to-happi-pink/5 text-happi-pink',
      shadow: 'shadow-happi-pink/20',
    },
    {
      number: '02',
      title: 'Freshness Guaranteed',
      description: 'Packed to preserve taste and freshness. Delivered within days of packing.',
      icon: Leaf,
      tone: 'from-happi-green/15 to-happi-green/5 text-happi-green',
      shadow: 'shadow-happi-green/20',
    },
    {
      number: '03',
      title: 'Hygienic Packaging',
      description: 'Handled and packed with care in clean, certified facilities.',
      icon: ShieldCheck,
      tone: 'from-happi-cyan/15 to-happi-cyan/5 text-happi-cyan',
      shadow: 'shadow-happi-cyan/20',
    },
    {
      number: '04',
      title: 'Natural Goodness',
      description: 'No artificial additives, preservatives, or harmful chemicals. Ever.',
      icon: BadgeCheck,
      tone: 'from-happi-gold/15 to-happi-gold/5 text-happi-gold',
      shadow: 'shadow-happi-gold/20',
    },
    {
      number: '05',
      title: 'Trusted By Many',
      description: 'Quality customers can depend on. Trusted by thousands of happy families.',
      icon: Heart,
      tone: 'from-happi-pink/15 to-happi-cyan/5 text-happi-pink',
      shadow: 'shadow-happi-pink/20',
    },
    {
      number: '06',
      title: 'Pure Happiness',
      description: 'Because healthy choices should feel good. Every single bite brings joy.',
      icon: Star,
      tone: 'from-happi-gold/15 to-happi-pink/5 text-happi-gold',
      shadow: 'shadow-happi-gold/20',
    },
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
      happi: 'None — 100% natural',
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
      {/* ================================================================ */}
      {/* HERO — immersive hero with 3D nut field                          */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden bg-happi-cream">
        <div className="absolute inset-0 bg-hero-mesh" />
        <div className="blob-decoration w-[28rem] h-[28rem] bg-happi-pink -top-32 -left-32 opacity-20 animate-blob" />
        <div className="blob-decoration w-[24rem] h-[24rem] bg-happi-gold top-20 -right-32 opacity-20 animate-blob" style={{ animationDelay: '3s' }} />
        <div className="blob-decoration w-80 h-80 bg-happi-cyan bottom-0 left-1/3 opacity-15 animate-blob" style={{ animationDelay: '5s' }} />
        <div className="absolute inset-0 bg-dots-pattern opacity-30" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center pt-10 pb-12 md:pb-16">
            {/* LEFT — Copy */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative z-10 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur border border-happi-pink/20 text-happi-pink text-sm font-semibold px-5 py-2.5 rounded-full mb-7 shadow-sm animate-bounce-gentle">
                <TrendingUp className="w-4 h-4" />
                <span>The Happi Difference</span>
                <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-happi-pink animate-pulse" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-happi-charcoal mb-5 tracking-tight leading-[1.08]">
                Why <span className="text-gradient-happi">Happi Nuts?</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                We don't just sell nuts — we deliver quality, freshness, and happiness in every single bite.
                Discover what makes thousands of customers choose us over ordinary packaged snacking.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
                <a
                  href="/shop"
                  className="group inline-flex items-center justify-center gap-2.5 bg-happi-pink text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-xl shadow-happi-pink/30 hover:shadow-2xl hover:shadow-happi-pink/40 hover:scale-[1.03] active:scale-95 transition-all duration-300 btn-shine"
                >
                  Experience the Difference
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="/about"
                  className="group inline-flex items-center justify-center gap-2.5 border-2 border-happi-charcoal/10 bg-white/60 backdrop-blur text-happi-charcoal text-lg font-semibold px-8 py-4 rounded-2xl hover:border-happi-pink/40 hover:text-happi-pink hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  Read Our Story
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Trust chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3">
                {['Premium Sourcing', 'Fresh in Days', 'Zero Additives', 'Hygienic Pack'].map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur border border-happi-green/20 text-happi-green text-xs font-semibold px-4 py-2 rounded-full"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — 3D display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative h-[320px] sm:h-[380px] md:h-[420px]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-tr from-happi-pink/15 via-happi-gold/10 to-happi-cyan/15 blur-2xl" />
              </div>

              {/* Interactive nuts display */}
              <div className="relative h-full w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-white via-happi-cream to-white border border-white shadow-2xl shadow-happi-charcoal/10">
                <MiniNutField className="absolute inset-0" color="#D9A441" count={12} />
              </div>

              {/* Floating badge — lock */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 right-0 md:right-4 glass-card-light rounded-2xl px-5 py-3.5 shadow-2xl z-10"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-happi-green/15 flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-happi-green" />
                  </div>
                  <div>
                    <div className="font-bold text-happi-charcoal text-sm leading-tight">Quality Guaranteed</div>
                    <div className="text-[11px] text-gray-500">Every single pack</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating badge — fresh */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute bottom-6 left-0 md:left-4 glass-card-light rounded-2xl px-5 py-3.5 shadow-2xl z-10"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-happi-cyan/15 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-happi-cyan" />
                  </div>
                  <div>
                    <div className="font-bold text-happi-charcoal text-sm leading-tight">Fresh Within Days</div>
                    <div className="text-[11px] text-gray-500">Small-batch packing</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SIX REASONS — spotlight cards                                     */}
      {/* ================================================================ */}
      <section className="py-16 md:py-24 bg-white">
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
              Why Choose Us
              <span className="w-8 h-px bg-happi-pink" />
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-4 tracking-tight">
              Six Reasons to <span className="text-gradient-happi">Choose Happi</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Every product we deliver passes through rigorous quality checks so you get nothing but the best
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {reasons.map((reason, idx) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: (idx % 3) * 0.1 }}
                >
                  <SpotlightCard className="h-full">
                    <div className="group h-full relative overflow-hidden bg-gradient-to-b from-white to-happi-cream/60 rounded-3xl p-8 hover:shadow-2xl hover:shadow-happi-pink/10 transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                      {/* Ghost number */}
                      <div className="absolute -top-3 -right-3 text-8xl font-extrabold text-happi-pink/5 group-hover:text-happi-pink/10 transition-colors">
                        {reason.number}
                      </div>

                      <div className="relative mb-6">
                        <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${reason.tone} shadow-lg ${reason.shadow} group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 inline-flex`}>
                          <Icon className="w-7 h-7" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-happi-charcoal mb-3 group-hover:text-happi-pink transition-colors">
                        {reason.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed relative z-10">
                        {reason.description}
                      </p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* ANIMATED STATISTICS */}
      {/* ================================================================ */}
      <section className="relative py-16 md:py-24 bg-happi-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-happi-charcoal via-[#3a1a2b] to-happi-charcoal animate-aurora opacity-90" />
        <div className="absolute inset-0 bg-dots-pattern opacity-5" />
        <div className="absolute inset-0 bg-hero-mesh opacity-30" />

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-flex items-center gap-2 text-happi-gold font-bold uppercase tracking-[0.2em] text-sm mb-4">
              <Award className="w-5 h-5" />
              By The Numbers
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Since Day One, <span className="text-shimmer-white">Only Quality.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedStat value={100} suffix="%" label="Quality Focus" delay={0} />
            <AnimatedStat value={60} suffix="+" label="Premium Products" delay={0.1} />
            <AnimatedStat value={5000} suffix="+" label="Happy Customers" delay={0.2} />
            <AnimatedStat value={100} suffix="%" label="Care & Passion" delay={0.3} />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* COMPARISON TABLE */}
      {/* ================================================================ */}
      <section className="py-16 md:py-24 bg-happi-cream relative overflow-hidden">
        <div className="blob-decoration w-72 h-72 bg-happi-cyan -top-20 -right-20 opacity-15 animate-blob" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-flex items-center gap-2 text-happi-green font-bold uppercase tracking-[0.2em] text-sm mb-4">
              <span className="w-8 h-px bg-happi-green" />
              The Clear Difference
              <span className="w-8 h-px bg-happi-green" />
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-4 tracking-tight">
              Happi Nuts vs{' '}
              <span className="text-gradient-happi">Ordinary Snacking</span>
            </h2>
            <p className="text-gray-600 text-lg">
              See why thousands of customers made the switch
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-x-auto rounded-[2rem] shadow-2xl shadow-happi-charcoal/10 border border-white"
          >
            <table className="w-full bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-happi-pink via-[#c2185b] to-happi-cyan text-white">
                  <th className="text-left py-5 px-6 font-bold rounded-tl-[2rem]">
                    Category
                  </th>
                  <th className="text-left py-5 px-6 font-bold">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Happi Nuts
                    </span>
                  </th>
                  <th className="text-left py-5 px-6 font-bold rounded-tr-[2rem]">
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
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className={`border-b ${idx % 2 === 0 ? 'bg-happi-cream/50' : 'bg-white'} hover:bg-happi-pink/5 transition-colors`}
                  >
                    <td className="py-4 px-6 font-bold text-happi-charcoal">
                      {row.category}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-2 text-happi-charcoal">
                        <span className="w-7 h-7 rounded-full bg-happi-green/15 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-happi-green" />
                        </span>
                        <span className="font-medium">{row.happi}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-2 text-gray-500">
                        <span className="w-7 h-7 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0">
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

      {/* ================================================================ */}
      {/* THE HAPPI PROMISE + RECOMMENDATION                                 */}
      {/* ================================================================ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="perspective-1000 relative order-2 md:order-1"
            >
              <TiltCard className="rounded-[2rem] shadow-2xl shadow-happi-charcoal/20">
                <img
                  src="/assets/happi-nuts-promise.jpg"
                  alt="Happi Nuts storefront sign and product range"
                  loading="lazy"
                  className="w-full h-80 md:h-96 object-cover object-center rounded-[2rem]"
                />
              </TiltCard>

              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 right-6 bg-gradient-to-r from-happi-gold to-amber-400 text-white px-6 py-3.5 rounded-2xl shadow-xl shadow-happi-gold/30"
              >
                <div className="font-bold text-lg leading-tight">Recommended</div>
                <div className="text-xs opacity-90">By health experts</div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="order-1 md:order-2"
            >
              <span className="inline-flex items-center gap-2 text-happi-pink font-bold uppercase tracking-[0.2em] text-sm mb-5">
                <Award className="w-5 h-5" />
                The Happi Promise
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-6 tracking-tight">
                We Promise{' '}
                <span className="text-gradient-happi">Nothing Less</span>
                {' '}Than the Best
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                When you choose Happi Nuts, you're choosing a brand that obsesses over every detail —
                from sourcing the finest ingredients to delivering them fresh to your door.
                Because you deserve nothing less.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  'Hand-picked premium selection',
                  'Small-batch freshness guarantee',
                  'Hygienic, food-safe packaging',
                  'Packages that build trust & happiness',
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3.5 text-gray-700 font-medium"
                  >
                    <span className="w-8 h-8 rounded-full bg-happi-green/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-happi-green" />
                    </span>
                    {item}
                  </motion.li>
                ))}
              </ul>

              <a
                href="/contact"
                className="group inline-flex items-center gap-2.5 bg-happi-charcoal text-white font-bold px-8 py-4 rounded-2xl hover:bg-happi-pink transition-all duration-300 hover:shadow-xl hover:shadow-happi-pink/25 hover:scale-[1.02] active:scale-95 btn-shine"
              >
                Get In Touch
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CTA */}
      {/* ================================================================ */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-happi-cyan via-[#19A9E5] to-happi-pink animate-gradient-shift" />
        <div className="absolute inset-0 bg-dots-pattern opacity-10" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-happi-gold/20 rounded-full blur-3xl" />

        <div className="container text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/15 backdrop-blur border border-white/30 mb-7 pulse-ring">
              <TrendingUp className="w-8 h-8 text-yellow-300" />
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
              Ready to Experience the <span className="text-shimmer-white">Difference?</span>
            </h2>

            <p className="text-xl text-white/90 mb-9 max-w-xl mx-auto leading-relaxed">
              Join thousands of happy customers who've made the switch to premium, natural snacking.
            </p>

            <motion.a
              href="/shop"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group inline-flex items-center gap-3 bg-white text-happi-pink font-extrabold text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-black/20 hover:bg-gray-100 transition-all btn-shine"
            >
              Shop Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </motion.a>

            <p className="mt-7 text-white/80 text-sm font-medium tracking-wide">
              100% fresh guarantee · Trusted by 5,000+ customers · Free shipping ₹999+
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}