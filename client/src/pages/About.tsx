import { useRef, useCallback, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Leaf,
  Zap,
  Award,
  Sparkles,
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  Sprout,
  Users,
  Target,
  Eye,
  Quote,
  Star,
  MapPin,
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

export default function About() {
  const timeline = [
    { step: 'Vision', description: 'Dreaming of healthier snacking', year: 'The Beginning', icon: Target },
    { step: 'Quality', description: 'Sourcing the finest ingredients', year: 'Our Promise', icon: BadgeCheck },
    { step: 'Care', description: 'Careful handling and packing', year: 'Every Day', icon: Heart },
    { step: 'Health', description: 'Delivering nutrition', year: 'To Your Door', icon: Leaf },
    { step: 'Happiness', description: 'Bringing joy to every bite', year: 'Always', icon: Star },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Premium Quality',
      description: 'Carefully selected dry fruits from trusted, vetted farms',
      tone: 'from-happi-pink/15 to-happi-pink/5 text-happi-pink',
      shadow: 'shadow-happi-pink/20',
    },
    {
      icon: Leaf,
      title: 'Natural Goodness',
      description: 'Zero additives, zero preservatives — pure goodness',
      tone: 'from-happi-green/15 to-happi-green/5 text-happi-green',
      shadow: 'shadow-happi-green/20',
    },
    {
      icon: Zap,
      title: 'Freshness',
      description: 'Packed in small batches to lock in taste & nutrition',
      tone: 'from-happi-cyan/15 to-happi-cyan/5 text-happi-cyan',
      shadow: 'shadow-happi-cyan/20',
    },
    {
      icon: Award,
      title: 'Trust',
      description: 'Quality that thousands of customers depend on',
      tone: 'from-happi-gold/15 to-happi-gold/5 text-happi-gold',
      shadow: 'shadow-happi-gold/20',
    },
  ];

  const stories = [
    {
      quote: 'Every healthy choice should come with a little happiness.',
      author: 'The Happi Nuts Team',
      gradient: 'from-happi-pink to-happi-cyan',
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ================================================================ */}
      {/* HERO — immersive hero                                            */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden bg-happi-cream">
        <div className="absolute inset-0 bg-hero-mesh" />
        <div className="blob-decoration w-[28rem] h-[28rem] bg-happi-pink -top-32 -left-32 opacity-20 animate-blob" />
        <div className="blob-decoration w-[24rem] h-[24rem] bg-happi-cyan top-20 -right-32 opacity-20 animate-blob" style={{ animationDelay: '3s' }} />
        <div className="blob-decoration w-80 h-80 bg-happi-gold bottom-0 left-1/3 opacity-15 animate-blob" style={{ animationDelay: '5s' }} />
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
                <Heart className="w-4 h-4 fill-happi-pink" />
                <span>Our Story</span>
                <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-happi-pink animate-pulse" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-happi-charcoal mb-5 tracking-tight leading-[1.08]">
                More Than Just{' '}
                <span className="text-gradient-happi">Nuts.</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                At Happi Nuts, we believe every healthy choice should come with a little happiness.
                Our story began with a simple question — what if nutritious could taste this good?
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
                <a
                  href="/shop"
                  className="group inline-flex items-center justify-center gap-2.5 bg-happi-pink text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-xl shadow-happi-pink/30 hover:shadow-2xl hover:shadow-happi-pink/40 hover:scale-[1.03] active:scale-95 transition-all duration-300 btn-shine"
                >
                  Shop Our Story
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="/why-happi-nuts"
                  className="group inline-flex items-center justify-center gap-2.5 border-2 border-happi-charcoal/10 bg-white/60 backdrop-blur text-happi-charcoal text-lg font-semibold px-8 py-4 rounded-2xl hover:border-happi-pink/40 hover:text-happi-pink hover:bg-white hover:shadow-lg transition-all duration-300"
                >
                  Why Happi Nuts?
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3">
                {['Since 2017', '60+ Products', '5,000+ Customers'].map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur border border-happi-green/20 text-happi-green text-xs font-semibold px-4 py-2 rounded-full"
                  >
                    <BadgeCheck className="w-3.5 h-3.5" />
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — Hero visuals */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative h-[320px] sm:h-[380px] md:h-[420px]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-tr from-happi-pink/15 via-happi-cyan/10 to-happi-gold/15 blur-2xl" />
              </div>

              <TiltCard maxTilt={7} scale={1.02} className="h-full w-full rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(44,44,44,0.3)]">
                <img
                  src="/assets/about-products.jpg"
                  alt="A selection of Happi Nuts products"
                  loading="lazy"
                  className="h-full w-full rounded-[2rem] object-cover"
                />
                <div className="absolute inset-0 rounded-[2rem] border-2 border-white/40 pointer-events-none" />
              </TiltCard>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 -right-2 md:right-4 glass-card-light rounded-2xl px-5 py-3.5 shadow-2xl z-10"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-happi-pink/15 flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-happi-pink" />
                  </div>
                  <div>
                    <div className="font-bold text-happi-charcoal text-sm leading-tight">Crafted with care</div>
                    <div className="text-[11px] text-gray-500">Since 2017</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute bottom-8 md:bottom-10 -left-2 md:left-4 glass-card-light rounded-2xl px-5 py-3.5 shadow-2xl z-10"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-happi-gold/15 flex items-center justify-center">
                    <Award className="w-5 h-5 text-happi-gold" />
                  </div>
                  <div>
                    <div className="font-bold text-happi-charcoal text-sm leading-tight">Premium quality</div>
                    <div className="text-[11px] text-gray-500">Vetted farms only</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* OUR STORY — narrative split section                              */}
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
                  src="/assets/happi-nuts-storefront.jpg"
                  alt="The Happi Nuts storefront, where our local story began"
                  loading="lazy"
                  className="w-full h-80 md:h-96 object-cover object-center rounded-[2rem]"
                />
              </TiltCard>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 left-6 bg-gradient-to-r from-happi-pink to-rose-500 text-white px-6 py-3.5 rounded-2xl shadow-xl shadow-happi-pink/30"
              >
                <div className="font-bold text-lg leading-tight">Since Day One</div>
                <div className="text-xs opacity-90">Committed to quality</div>
              </motion.div>

              {/* Floating quote chip */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                className="absolute -top-4 -right-2 md:right-6 bg-white rounded-2xl px-5 py-3 shadow-2xl border border-happi-pink/10"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💚</span>
                  <div className="text-xs font-bold text-happi-charcoal leading-tight">
                    Story of<br />happiness
                  </div>
                </div>
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
                <Sparkles className="w-5 h-5" />
                Our Story
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-6 tracking-tight">
                Born from a Simple{' '}
                <span className="text-gradient-happi">Belief</span>
              </h2>
              <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                Happi Nuts was born from a simple belief: <span className="font-semibold text-happi-charcoal">healthy food should always taste this good.</span> We started with a vision to bring premium, carefully selected dry fruits to health-conscious individuals who refuse to compromise on quality.
              </p>
              <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                Every product in our collection is <span className="font-semibold text-happi-charcoal">handpicked, tested for quality</span>, and packed with care. We work directly with trusted suppliers to ensure freshness, purity, and the best nutritional value.
              </p>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Today, <span className="font-semibold text-happi-charcoal">thousands of happy customers</span> trust Happi Nuts for their daily nutrition and special occasions. We're committed to making healthy snacking accessible, affordable, and absolutely delicious.
              </p>

              {/* Signature philosophy card */}
              <div className="rounded-2xl bg-gradient-to-br from-happi-cream via-white to-happi-cream border border-happi-pink/10 p-6 mb-8">
                <p className="text-happi-charcoal font-medium italic leading-relaxed">
                  "Healthy food should always taste this good."
                </p>
                <div className="mt-3 text-sm font-bold text-happi-pink">— The Happi Nuts Philosophy</div>
              </div>

              <a
                href="/why-happi-nuts"
                className="group inline-flex items-center gap-2.5 bg-happi-charcoal text-white font-bold px-8 py-4 rounded-2xl hover:bg-happi-pink transition-all duration-300 hover:shadow-xl hover:shadow-happi-pink/25 hover:scale-[1.02] active:scale-95 btn-shine"
              >
                Why Happi Nuts?
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 3D DIVIDER */}
      {/* ================================================================ */}
      <section className="relative bg-gradient-to-r from-happi-pink via-happi-cyan to-happi-pink py-6 md:py-8 animate-gradient-shift">
        <div className="container text-center text-white">
          <span className="text-sm md:text-base font-semibold tracking-widest uppercase opacity-90">
            ✦ Quality · Freshness · Care · Happiness ✦
          </span>
        </div>
      </section>

      {/* ================================================================ */}
      {/* OUR VALUES — spotlight cards                                      */}
      {/* ================================================================ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-flex items-center gap-2 text-happi-cyan font-bold uppercase tracking-[0.2em] text-sm mb-4">
              <span className="w-8 h-px bg-happi-cyan" />
              What We Stand For
              <span className="w-8 h-px bg-happi-cyan" />
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-4 tracking-tight">
              Our <span className="text-gradient-happi">Values</span>
            </h2>
            <p className="text-gray-600 text-lg">
              The principles that guide every decision we make
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: idx * 0.1 }}
                >
                  <SpotlightCard className="h-full">
                    <div className="group h-full bg-gradient-to-b from-white to-happi-cream/60 border border-gray-100 rounded-3xl p-8 text-center hover:shadow-2xl hover:shadow-happi-pink/10 transition-all duration-500 hover:-translate-y-2">
                      <div className="relative mb-6 inline-flex justify-center">
                        <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${value.tone} shadow-lg ${value.shadow} group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-happi-pink/15 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                      </div>
                      <h3 className="text-xl font-bold text-happi-charcoal mb-2.5 group-hover:text-happi-pink transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* OUR MISSION / VISION STRIP                                        */}
      {/* ================================================================ */}
      <section className="py-16 md:py-24 bg-happi-cream relative overflow-hidden">
        <div className="blob-decoration w-72 h-72 bg-happi-green -top-20 -left-20 opacity-15 animate-blob" />
        <div className="blob-decoration w-64 h-64 bg-happi-pink -bottom-20 -right-20 opacity-10 animate-blob" style={{ animationDelay: '4s' }} />
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
              Our Compass
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-4 tracking-tight">
              Why We <span className="text-gradient-happi">Exist</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Target,
                title: 'Our Mission',
                description: 'To make healthy snacking accessible, affordable, and absolutely delicious — without ever compromising on quality.',
                gradient: 'from-happi-pink/15 to-happi-cyan/10 text-happi-pink',
              },
              {
                icon: Eye,
                title: 'Our Vision',
                description: 'A world where every healthy choice is also a happy choice — one nut, one bite, one family at a time.',
                gradient: 'from-happi-green/15 to-happi-gold/10 text-happi-green',
              },
              {
                icon: Users,
                title: 'Our People',
                description: 'Farmers, craftsmen, and dreamers working together to bring the freshest selection from soil to shelf.',
                gradient: 'from-happi-gold/15 to-happi-pink/10 text-happi-gold',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.12 }}
                >
                  <SpotlightCard className="h-full">
                    <div className="group h-full bg-white rounded-3xl p-8 text-center shadow-lg shadow-happi-charcoal/5 hover:shadow-2xl hover:shadow-happi-pink/10 transition-all duration-500 border border-gray-100 hover:-translate-y-2">
                      <div className="relative mb-6 inline-flex justify-center">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                          <Icon className="w-8 h-8" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-happi-charcoal mb-3 group-hover:text-happi-pink transition-colors">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* JOURNEY TIMELINE                                                  */}
      {/* ================================================================ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="blob-decoration w-72 h-72 bg-happi-cyan -top-20 -right-20 opacity-15 animate-blob" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-flex items-center gap-2 text-happi-gold font-bold uppercase tracking-[0.2em] text-sm mb-4">
              <Sparkles className="w-5 h-5" />
              The Road So Far
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-4 tracking-tight">
              Our <span className="text-gradient-happi">Journey</span>
            </h2>
            <p className="text-gray-600 text-lg">Every step, driven by customer happiness</p>
          </motion.div>

          <div className="relative mx-auto max-w-5xl px-1 sm:px-4">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1.5 h-full bg-gradient-to-b from-happi-pink via-happi-gold to-happi-cyan rounded-full" />

            {/* Timeline Items */}
            <div className="space-y-8 md:space-y-10">
              {timeline.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className={`flex ${idx % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-5 md:gap-6 relative z-10`}
                  >
                    {/* Content */}
                    <div className="flex-1 text-left">
                      <div className={`w-full max-w-md ${idx % 2 === 0 ? 'md:ml-auto' : ''}`}>
                        <SpotlightCard>
                          <div className="bg-gradient-to-b from-white to-happi-cream/60 rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-100 group">
                            <div className="text-sm font-bold text-happi-pink mb-2 uppercase tracking-wider">{item.year}</div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-happi-pink/15 to-happi-cyan/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Icon className="w-4 h-4 text-happi-pink" />
                              </div>
                              <h3 className="text-2xl font-bold text-happi-charcoal">
                                {item.step}
                              </h3>
                            </div>
                            <p className="text-gray-600 pl-12">{item.description}</p>
                          </div>
                        </SpotlightCard>
                      </div>
                    </div>

                    {/* Dot */}
                    <div className="hidden md:flex w-10 h-10 bg-white rounded-full border-4 border-happi-pink/30 shadow-lg flex-shrink-0 items-center justify-center">
                      <div className="w-3 h-3 bg-gradient-to-br from-happi-pink to-happi-cyan rounded-full animate-pulse" />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 3D NUT FIELD — animated closing banner                           */}
      {/* ================================================================ */}
      <section className="relative bg-happi-charcoal text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <MiniNutField className="w-full h-full" color="#E91E73" count={8} />
        </div>
        <div className="absolute inset-0 bg-dots-pattern opacity-5" />
        <div className="container relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/10 backdrop-blur border border-white/20 mb-7 pulse-ring">
              <Heart className="w-8 h-8 text-happi-pink fill-happi-pink" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Every Nut. Every Bite.{' '}
              <span className="text-shimmer-white">Pure Happiness.</span>
            </h2>
            <p className="text-white/70 text-lg mb-0 max-w-xl mx-auto">
              Thank you for being part of our journey — here's to many more happy (and healthy!) moments together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CTA */}
      {/* ================================================================ */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-happi-pink via-[#c2185b] to-happi-charcoal animate-gradient-shift" />
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
              <Heart className="w-8 h-8 text-yellow-300 fill-yellow-300" />
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
              Join Our Happy <span className="text-shimmer-white">Community</span>
            </h2>

            <p className="text-xl text-white/90 mb-9 max-w-xl mx-auto leading-relaxed">
              Experience the Happi Nuts difference — where every bite brings a little more joy to your day.
            </p>

            <motion.a
              href="/shop"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group inline-flex items-center gap-3 bg-white text-happi-pink font-extrabold text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-black/20 hover:bg-gray-100 hover:shadow-happi-charcoal/40 transition-all btn-shine"
            >
              Shop Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </motion.a>

            <p className="mt-7 text-white/70 text-sm font-medium tracking-wide">
              Join thousands of happy families · Free shipping on orders ₹999+
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}