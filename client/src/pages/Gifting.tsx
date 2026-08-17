import { useRef, useCallback, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Gift,
  Sparkles,
  Heart,
  Briefcase,
  Package,
  MessageCircle,
  BadgeCheck,
  Crown,
  PartyPopper,
  Star,
  Truck,
  ShieldCheck,
  Leaf,
  Phone,
  Calendar,
  Users,
  Palette,
  Wallet,
} from 'lucide-react';
import GiftScene from '@/components/three/GiftScene';
import TiltCard from '@/components/three/TiltCard';

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

export default function Gifting() {
  const giftCategories = [
    { name: 'Festival Gifts', description: 'Diwali, Pongal, Eid & more', icon: Sparkles, gradient: 'from-happi-pink/15 to-happi-gold/15', iconBg: 'from-happi-pink to-rose-500', ring: 'border-happi-pink/20' },
    { name: 'Wedding Gifts', description: 'Elegant & premium for the big day', icon: Heart, gradient: 'from-happi-pink/15 to-happi-cyan/15', iconBg: 'from-happi-pink to-happi-cyan', ring: 'border-happi-cyan/20' },
    { name: 'Corporate Gifts', description: 'For lasting business relationships', icon: Briefcase, gradient: 'from-happi-cyan/15 to-happi-green/15', iconBg: 'from-happi-cyan to-happi-green', ring: 'border-happi-green/20' },
    { name: 'Birthday Gifts', description: 'Celebrate with joy & sweetness', icon: PartyPopper, gradient: 'from-happi-gold/15 to-happi-pink/15', iconBg: 'from-happi-gold to-amber-500', ring: 'border-happi-gold/20' },
    { name: 'Premium Hampers', description: 'Luxury curated collections', icon: Crown, gradient: 'from-happi-gold/20 to-happi-pink/20', iconBg: 'from-happi-gold to-happi-pink', ring: 'border-happi-gold/25' },
    { name: 'Custom Boxes', description: 'Personalized selections for all', icon: Package, gradient: 'from-happi-green/15 to-happi-cyan/15', iconBg: 'from-happi-green to-happi-cyan', ring: 'border-happi-green/20' },
  ];

  const steps = [
    { step: '01', title: 'Pick Your Products', description: 'Choose from our premium range of dry fruits, nuts and treats', icon: Package },
    { step: '02', title: 'Customize The Box', description: 'Select packaging, add a personal message and branding', icon: Palette },
    { step: '03', title: 'We Pack With Love', description: 'Hygienically packed and beautifully presented', icon: Heart },
    { step: '04', title: 'Delivered With Care', description: 'Freshly delivered to your door or gift recipient', icon: Truck },
  ];

  const corporateFeatures = [
    { icon: Wallet, text: 'Bulk order special pricing' },
    { icon: BadgeCheck, text: 'Custom branding & packaging' },
    { icon: Users, text: 'Dedicated corporate account manager' },
    { icon: Truck, text: 'Pan-India delivery options' },
  ];

  const testimonials = [
    {
      name: 'Ananya V.',
      initials: 'AV',
      role: 'Festival Gifting · Diwali',
      text: 'The Diwali hampers we ordered for our clients were absolutely stunning. The packaging felt premium and the nuts were incredibly fresh. Our clients keep asking about them!',
      gradient: 'from-happi-pink to-happi-gold',
    },
    {
      name: 'Ramesh K.',
      initials: 'RK',
      role: 'Corporate Client · Chennai',
      text: 'Ordered 150 corporate gift boxes for Deepavali. The team handled everything flawlessly — branding, packing, delivery schedule. Payments and follow-up were seamless.',
      gradient: 'from-happi-cyan to-happi-green',
    },
    {
      name: 'Divya M.',
      initials: 'DM',
      role: 'Wedding Gift · Madurai',
      text: 'Created custom wedding favors for our guests. The personalised message cards and elegant packing made our celebration extra special. Truly memorable!',
      gradient: 'from-happi-gold to-happi-pink',
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ================================================================ */}
      {/* HERO — immersive gradient + 3D gift box                          */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-happi-pink via-[#c2185b] to-happi-charcoal text-white">
        <div className="blob-decoration w-[26rem] h-[26rem] bg-white top-10 -left-24 opacity-10 animate-blob" />
        <div className="blob-decoration w-[24rem] h-[24rem] bg-happi-gold -bottom-24 right-0 opacity-20 animate-blob" style={{ animationDelay: '3s' }} />
        <div className="blob-decoration w-80 h-80 bg-happi-cyan top-1/3 -right-24 opacity-10 animate-blob" style={{ animationDelay: '5s' }} />
        <div className="absolute inset-0 bg-dots-pattern opacity-10" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pt-10 pb-16 md:pb-24">
            {/* LEFT — Copy */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative z-10 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur border border-white/25 text-white text-sm font-semibold px-5 py-2.5 rounded-full mb-7 shadow-lg animate-bounce-gentle">
                <Gift className="w-4 h-4" />
                Premium Gifting
                <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-happi-gold animate-pulse" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-[1.08]">
                Give <span className="text-shimmer-white">Health.</span>
                <br />
                Give <span className="text-shimmer-white">Happiness.</span>
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-9 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Thoughtfully crafted dry fruit gifting experiences for the moments that matter most —
                from intimate celebrations to grand corporate milestones.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
                <a
                  href="/shop"
                  className="group inline-flex items-center justify-center gap-2.5 bg-white text-happi-pink font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-black/20 hover:bg-gray-100 hover:scale-[1.03] active:scale-95 transition-all duration-300 btn-shine"
                >
                  Shop Gifts
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2.5 border-2 border-white/40 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 hover:border-white/70 transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 text-happi-gold group-hover:scale-110 transition-transform" />
                  Corporate Enquiry
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3">
                {['Bulk Orders Welcome', 'Pan-India Delivery', 'Custom Branding'].map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full"
                  >
                    <BadgeCheck className="w-3.5 h-3.5 text-happi-gold" />
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — 3D Gift Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative h-[340px] md:h-[440px] lg:h-[480px]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[80%] h-[80%] rounded-full bg-white/10 blur-3xl" />
              </div>

              <div className="relative h-full w-full">
                <GiftScene className="w-full h-full" />

                {/* Floating badge — gift box */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-6 right-0 md:right-6 glass-morphism rounded-2xl px-4 py-3 shadow-2xl"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-happi-gold/20 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-happi-gold" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm leading-tight">Express Delivery</div>
                      <div className="text-[10px] text-white/60">Freshly packed & shipped fast</div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating badge — craftsmanship */}
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                  className="absolute bottom-10 left-0 md:left-2 glass-morphism rounded-2xl px-4 py-3 shadow-2xl"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-happi-pink" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm leading-tight">Packed With Love</div>
                      <div className="text-[10px] text-white/70">Premium quality, every time</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* GIFT CATEGORIES — premium occasion cards                         */}
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
              Gift Categories
              <span className="w-8 h-px bg-happi-pink" />
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-4 tracking-tight">
              For Every <span className="text-gradient-happi">Occasion</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From intimate celebrations to grand corporate events, we have the perfect gift
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {giftCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: (idx % 3) * 0.1 }}
                >
                  <SpotlightCard className="h-full">
                    <div className="group h-full bg-gradient-to-b from-white to-happi-cream/60 border border-gray-100 rounded-3xl p-8 text-center hover:shadow-2xl hover:shadow-happi-pink/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                      {/* Subtle gradient wash on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                      <div className="relative">
                        {/* Icon */}
                        <div className="relative mb-5 inline-flex justify-center">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.iconBg} text-white flex items-center justify-center shadow-xl shadow-happi-pink/20 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500`}>
                            <Icon className="w-8 h-8" />
                          </div>
                          <div className="absolute inset-0 rounded-2xl bg-happi-pink/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                        </div>

                        <h3 className="text-xl font-bold text-happi-charcoal mb-2 group-hover:text-happi-pink transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-gray-600 mb-5">{cat.description}</p>

                        <a
                          href="/shop"
                          className="group/link inline-flex items-center gap-1.5 text-happi-pink font-semibold hover:gap-3 transition-all"
                        >
                          Explore
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* HOW IT WORKS */}
      {/* ================================================================ */}
      <section className="py-16 md:py-24 bg-happi-cream relative overflow-hidden">
        <div className="blob-decoration w-72 h-72 bg-happi-cyan -top-20 -right-20 opacity-15 animate-blob" />
        <div className="blob-decoration w-64 h-64 bg-happi-gold -bottom-20 -left-20 opacity-10 animate-blob" style={{ animationDelay: '4s' }} />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-flex items-center gap-2 text-happi-cyan font-bold uppercase tracking-[0.2em] text-sm mb-4">
              <BadgeCheck className="w-5 h-5" />
              Simple Process
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-4 tracking-tight">
              How It <span className="text-gradient-happi">Works</span>
            </h2>
            <p className="text-gray-600 text-lg">Four simple steps to the perfect gift</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="relative"
                >
                  <div className="relative bg-white rounded-3xl p-8 text-center shadow-lg shadow-happi-charcoal/5 hover:shadow-2xl hover:shadow-happi-pink/10 transition-all h-full">
                    {/* Step number */}
                    <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-happi-pink to-happi-cyan mb-4 opacity-20 absolute top-4 right-6">
                      {item.step}
                    </div>

                    {/* Icon circle */}
                    <div className="relative mb-6 inline-flex justify-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-happi-pink/10 to-happi-cyan/10 border border-happi-pink/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-happi-pink" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-happi-charcoal mb-3">
                      <span className="text-happi-pink mr-1.5">{item.step}.</span>
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>

                    {/* Connector arrow (desktop only) */}
                    {idx < steps.length - 1 && (
                      <div className="hidden lg:flex absolute top-1/2 -right-5 z-10 w-9 h-9 rounded-full bg-white shadow-md items-center justify-center -translate-y-1/2 border border-gray-100">
                        <ArrowRight className="w-4 h-4 text-happi-pink" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* TESTIMONIALS */}
      {/* ================================================================ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="blob-decoration w-80 h-80 bg-happi-gold -top-20 -left-20 opacity-10 animate-blob" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-flex items-center gap-2 text-happi-gold font-bold uppercase tracking-[0.2em] text-sm mb-4">
              <Star className="w-4 h-4 fill-happi-gold" />
              Gift Stories
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-4 tracking-tight">
              Moments We've <span className="text-gradient-happi">Made Happi</span>
            </h2>
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
                <div className="bg-gradient-to-b from-happi-cream to-white rounded-3xl p-8 shadow-lg shadow-happi-charcoal/5 hover:shadow-2xl hover:shadow-happi-pink/10 transition-all duration-500 border border-white h-full">
                  {/* Quote mark */}
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center shadow-lg mb-6`}>
                    <span className="text-white font-serif text-xl font-bold">"</span>
                  </div>

                  <p className="text-gray-600 mb-8 leading-relaxed">"{testimonial.text}"</p>

                  {/* Author */}
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold shadow-md`}>
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="font-bold text-happi-charcoal">{testimonial.name}</div>
                      <div className="text-xs text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* MAKE YOUR OWN BOX */}
      {/* ================================================================ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden bg-happi-charcoal text-white rounded-[2rem] p-8 md:p-16 text-center shadow-2xl shadow-happi-charcoal/30"
          >
            <div className="blob-decoration w-80 h-80 bg-happi-pink -top-24 -left-24 opacity-30 animate-blob" />
            <div className="blob-decoration w-72 h-72 bg-happi-cyan -bottom-24 -right-24 opacity-20 animate-blob" style={{ animationDelay: '2s' }} />
            <div className="absolute inset-0 bg-dots-pattern opacity-5" />

            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 backdrop-blur border border-white/25 mb-7 pulse-ring">
                <Gift className="w-10 h-10 text-happi-gold" />
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 tracking-tight">
                Make Your Own <span className="text-shimmer-white">Happi Box</span>
              </h2>

              <p className="text-white/80 text-lg mb-9 max-w-2xl mx-auto leading-relaxed">
                Customize your gift box with your favourite dry fruits, choose elegant packaging,
                and add a personal message that warms the heart.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                <a
                  href="/shop"
                  className="group inline-flex items-center justify-center gap-2.5 btn-primary text-lg btn-shine !px-10 !py-4 rounded-2xl"
                >
                  Create Your Gift
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/25 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white hover:text-happi-pink transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  Speak to an Expert
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CORPORATE GIFTING */}
      {/* ================================================================ */}
      <section className="py-16 md:py-24 bg-happi-cream relative overflow-hidden">
        <div className="blob-decoration w-72 h-72 bg-happi-cyan -top-20 -right-20 opacity-15 animate-blob" />
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 text-happi-gold font-bold uppercase tracking-[0.2em] text-sm mb-5">
                <Briefcase className="w-5 h-5" />
                Corporate Gifting
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-happi-charcoal mb-6 tracking-tight">
                Strengthen Business{' '}
                <span className="text-gradient-happi">Relationships</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Premium dry fruit gifting for employers, clients and partners. Bulk orders,
                custom branding, and dedicated support from our corporate team.
              </p>

              <ul className="space-y-4 mb-10">
                {corporateFeatures.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-3.5 text-gray-700 font-medium"
                    >
                      <span className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                        <Icon className="w-4.5 h-4.5 text-happi-pink" />
                      </span>
                      {item.text}
                    </motion.li>
                  );
                })}
              </ul>

              <a
                href="/contact"
                className="group inline-flex items-center gap-2.5 bg-happi-charcoal text-white font-bold px-8 py-4 rounded-2xl hover:bg-happi-pink transition-all duration-300 hover:shadow-xl hover:shadow-happi-pink/25 hover:scale-[1.02] active:scale-95 btn-shine"
              >
                Enquire Now
                <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
              </a>
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
                    src="/assets/corporate-gift-box.png"
                    alt="Premium Happi Nuts corporate gift box"
                    loading="lazy"
                    className="w-full h-80 md:h-96 object-cover rounded-[2rem]"
                  />
                </TiltCard>
              </div>

              {/* Floating tag */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 left-6 bg-gradient-to-r from-happi-gold to-amber-400 text-white px-6 py-3.5 rounded-2xl shadow-xl shadow-happi-gold/30"
              >
                <span className="font-bold text-sm">✦ Bulk orders welcome</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FINAL CTA + TRUST STRIP */}
      {/* ================================================================ */}
      <section className="relative py-16 md:py-24 bg-white">
        <div className="container">
          {/* Trust strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {[
              { icon: Truck, title: 'Fast Delivery', desc: 'Fresh & on-time, every time' },
              { icon: BadgeCheck, title: 'Fresh Quality', desc: 'Small batches, always' },
              { icon: Heart, title: 'Made With Love', desc: 'Hand-packed with care' },
              { icon: Star, title: 'Loved By Many', desc: 'Trusted by thousands' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-center justify-center gap-3"
                >
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-happi-pink/15 to-happi-cyan/15 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-happi-pink" />
                  </div>
                  <div>
                    <div className="font-bold text-happi-charcoal leading-tight text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-happi-pink via-[#c2185b] to-happi-charcoal animate-gradient-shift text-white p-8 md:p-14 text-center shadow-2xl shadow-happi-pink/25"
          >
            <div className="absolute inset-0 bg-dots-pattern opacity-10" />
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-happi-gold/20 rounded-full blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/15 backdrop-blur border border-white/30 mb-6 pulse-ring">
                <Gift className="w-8 h-8 text-yellow-300" />
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 tracking-tight">
                Ready to Gift <span className="text-shimmer-white">Something Special?</span>
              </h2>

              <p className="text-lg text-white/85 mb-9 max-w-xl mx-auto leading-relaxed">
                Let us help you create the perfect gift experience — from premium selection
                to elegant presentation, we handle every detail.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/shop"
                  className="group inline-flex items-center justify-center gap-3 bg-white text-happi-pink font-extrabold text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-black/20 hover:bg-gray-100 hover:scale-[1.04] active:scale-95 transition-all duration-300 btn-shine"
                >
                  Start Gifting Today
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2.5 bg-white/10 backdrop-blur border border-white/25 text-white font-semibold px-10 py-5 rounded-2xl hover:bg-white hover:text-happi-pink transition-all duration-300"
                >
                  <Calendar className="w-5 h-5" />
                  Book a Consultation
                </a>
              </div>

              <p className="mt-7 text-white/70 text-sm font-medium tracking-wide">
                Free bulk consultation · Custom branding · Pan-India delivery
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}