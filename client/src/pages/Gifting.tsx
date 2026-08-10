import { motion } from 'framer-motion';
import { ArrowRight, Gift, Sparkle, Heart, Briefcase, Package, MessageCircle, BadgeCheck, Crown, PartyPopper } from 'lucide-react';
import GiftScene from '@/components/three/GiftScene';
import TiltCard from '@/components/three/TiltCard';

export default function Gifting() {
  const giftCategories = [
    { name: 'Festival Gifts', description: 'Perfect for Diwali, Pongal & more', icon: Sparkle, gradient: 'from-happi-pink/20 to-happi-gold/20' },
    { name: 'Wedding Gifts', description: 'Elegant and premium for the big day', icon: Heart, gradient: 'from-happi-pink/20 to-happi-cyan/20' },
    { name: 'Corporate Gifts', description: 'For lasting business relationships', icon: Briefcase, gradient: 'from-happi-cyan/20 to-happi-green/20' },
    { name: 'Birthday Gifts', description: 'Celebrate with joy and sweetness', icon: PartyPopper, gradient: 'from-happi-gold/20 to-happi-pink/20' },
    { name: 'Premium Hampers', description: 'Luxury curated collections', icon: Crown, gradient: 'from-happi-gold/20 to-happi-pink/20' },
    { name: 'Custom Gift Boxes', description: 'Personalized selections for everyone', icon: Package, gradient: 'from-happi-green/20 to-happi-cyan/20' },
  ];

  const steps = [
    { step: '01', title: 'Pick Your Products', description: 'Choose from our premium range of dry fruits, nuts and treats' },
    { step: '02', title: 'Customize The Box', description: 'Select packaging style, add a personal message and branding' },
    { step: '03', title: 'We Pack With Love', description: 'Hygienically packed and beautifully presented' },
    { step: '04', title: 'Delivered With Care', description: 'Freshly delivered to your door or gift recipient' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ===== HERO WITH 3D GIFT ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-happi-pink via-[#E91E73] to-happi-cyan text-white">
        <div className="blob-decoration w-96 h-96 bg-white top-10 -left-20 opacity-10 animate-blob" />
        <div className="blob-decoration w-80 h-80 bg-happi-gold -bottom-20 right-0 opacity-20 animate-blob" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-dots-pattern opacity-10" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pt-8 pb-16 md:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10"
            >
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/25 text-white text-sm font-semibold px-4 py-2 rounded-full mb-5">
                <Gift className="w-4 h-4" />
                Premium Gifting
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Give Health.{' '}
                <span className="text-shimmer-white">Give Happiness.</span>
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Thoughtfully packed dry fruit gifts for the moments that matter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/shop" className="inline-flex items-center justify-center gap-2 bg-white text-happi-pink font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all hover:scale-105 btn-shine">
                  Shop Gifts
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a href="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 transition-all">
                  Corporate Enquiry
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative h-[360px] md:h-[440px]"
            >
              <GiftScene className="w-full h-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== GIFT CATEGORIES ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-happi-pink font-semibold mb-3">
              <Sparkle className="w-5 h-5" />
              Gift Categories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-4">
              For Every <span className="text-gradient-happi">Occasion</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From intimate celebrations to grand corporate events, we have the perfect gift
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {giftCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} rounded-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative bg-white/90 backdrop-blur rounded-3xl p-8 text-center border border-gray-100 shadow-lg group-hover:shadow-2xl transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-happi-cream flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Icon className="w-8 h-8 text-happi-pink" />
                    </div>
                    <h3 className="text-xl font-bold text-happi-charcoal mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-gray-600 mb-5">{cat.description}</p>
                    <a href="/shop" className="text-happi-pink font-semibold hover:gap-2 flex items-center justify-center gap-1 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 md:py-24 bg-happi-cream relative overflow-hidden">
        <div className="blob-decoration w-72 h-72 bg-happi-cyan -top-20 -right-20 animate-blob" />
        <div className="container relative">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-happi-cyan font-semibold mb-3">
              <BadgeCheck className="w-5 h-5" />
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-4">
              How It <span className="text-gradient-happi">Works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-happi-pink to-happi-cyan mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-happi-charcoal mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 z-10">
                    <ArrowRight className="w-5 h-5 text-happi-pink" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MAKE YOUR OWN BOX ===== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden bg-happi-charcoal text-white rounded-3xl p-8 md:p-16 text-center"
          >
            <div className="blob-decoration w-80 h-80 bg-happi-pink -top-24 -left-24 opacity-30 animate-blob" />
            <div className="blob-decoration w-72 h-72 bg-happi-cyan -bottom-24 -right-24 opacity-20 animate-blob" style={{ animationDelay: '2s' }} />

            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-6 pulse-ring">
                <Gift className="w-10 h-10 text-happi-gold" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Make Your Own <span className="text-shimmer-white">Happi Box</span>
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Customize your gift box with your favorite dry fruits, select packaging, and add a personal message.
              </p>
              <a href="/shop" className="btn-primary text-lg inline-flex items-center gap-2 btn-shine">
                Create Your Gift
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== CORPORATE GIFTING ===== */}
      <section className="py-16 md:py-24 bg-happi-cream">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-happi-gold font-semibold mb-3">
                <Briefcase className="w-5 h-5" />
                Corporate Gifting
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-6">
                Strengthen Business <span className="text-gradient-happi">Relationships</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Strengthen business relationships with premium dry fruit gifts. Bulk orders, custom branding, and special pricing available.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Bulk order special pricing',
                  'Custom branding & packaging',
                  'Dedicated corporate account manager',
                  'Pan-India delivery options',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <BadgeCheck className="w-5 h-5 text-happi-green flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="/contact" className="btn-primary text-lg inline-flex items-center gap-2 btn-shine">
                Enquire Now
                <MessageCircle className="w-5 h-5" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="perspective-1000"
            >
              <TiltCard className="rounded-3xl shadow-2xl">
                <img
                  src="/assets/corporate-gift-box.png"
                  alt="Premium Happi Nuts corporate gift box"
                  className="w-full h-96 object-cover rounded-3xl"
                />
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
