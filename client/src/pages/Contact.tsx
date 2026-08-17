import { useState, useRef, useCallback, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
  Clock,
  ShieldCheck,
  BadgeCheck,
  Heart,
  ArrowRight,
} from 'lucide-react';
import ThemedScene from '@/components/three/ThemedScene';
import TiltCard from '@/components/three/TiltCard';
import { createContactMessage } from '@/lib/admin-store';

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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    // Save the contact message to the DATABASE so the admin sees it on any device.
    const saved = await createContactMessage(formData);

    if (saved) {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      console.warn('Failed to save contact message to database.');
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const contactCards = [
    {
      icon: Phone,
      title: 'Call Us',
      content: '+91 95857 59990',
      link: 'tel:+919585750990',
      gradient: 'from-happi-pink/15 to-happi-pink/5',
      text: 'text-happi-pink',
      shadow: 'shadow-happi-pink/20',
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: 'todaymart2017@gmail.com',
      link: 'mailto:todaymart2017@gmail.com',
      gradient: 'from-happi-cyan/15 to-happi-cyan/5',
      text: 'text-happi-cyan',
      shadow: 'shadow-happi-cyan/20',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      content: 'Chat with us instantly',
      link: 'https://wa.me/919585750990',
      gradient: 'from-happi-green/15 to-happi-green/5',
      text: 'text-happi-green',
      shadow: 'shadow-happi-green/20',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: 'Allampatti, Tamil Nadu 626001',
      link: '#',
      gradient: 'from-happi-gold/15 to-happi-gold/5',
      text: 'text-happi-gold',
      shadow: 'shadow-happi-gold/20',
    },
  ];

  const inputClass =
    "w-full px-5 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-happi-pink focus:ring-4 focus:ring-happi-pink/10 transition-all bg-white shadow-sm hover:shadow-md placeholder:text-gray-400";

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ================================================================ */}
      {/* HERO — immersive gradient with 3D bubbles                        */}
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
                <MessageCircle className="w-4 h-4" />
                <span>We'd Love to Hear From You</span>
                <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-happi-gold animate-pulse" />
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-[1.08]">
                Let's Talk{' '}
                <span className="text-shimmer-white">Happi.</span>
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-9 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Have a question, bulk order enquiry, or gifting requirement? Our friendly team
                is here to help — we'd love to hear from you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
                <a
                  href="https://wa.me/919585750990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2.5 bg-white text-happi-pink font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-black/20 hover:bg-gray-100 hover:scale-[1.03] active:scale-95 transition-all duration-300 btn-shine"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Us
                </a>
                <a
                  href="tel:+919585750990"
                  className="group inline-flex items-center justify-center gap-2.5 border-2 border-white/40 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 hover:border-white/70 transition-all duration-300"
                >
                  <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Call Now
                </a>
              </div>

              {/* Trust chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3">
                {['24h Response', 'Friendly Support', 'Bulk Enquiries Welcome'].map((chip) => (
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

            {/* RIGHT — 3D Bubbles Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative h-[300px] md:h-[380px]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[85%] h-[85%] rounded-full bg-white/10 blur-3xl" />
              </div>

              <div className="relative h-full w-full rounded-[2rem] overflow-hidden bg-white/5 backdrop-blur-sm border border-white/20 shadow-2xl">
                <ThemedScene className="absolute inset-0" variant="bubbles" color="#7FD4F3" count={12} />
              </div>

              {/* Floating badge — 24h */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-5 right-2 md:right-6 glass-morphism rounded-2xl px-4 py-3.5 shadow-2xl z-10"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-happi-green/20 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm leading-tight">24h Response</div>
                    <div className="text-[10px] text-white/60">On business days</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating badge — support */}
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                className="absolute bottom-6 left-2 md:left-4 glass-morphism rounded-2xl px-4 py-3.5 shadow-2xl z-10"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-happi-pink" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm leading-tight">Friendly Support</div>
                    <div className="text-[10px] text-white/70">Real people, real help</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CONTACT CARDS — premium links                                    */}
      {/* ================================================================ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {contactCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.a
                  key={idx}
                  href={card.link}
                  target={card.link.startsWith('http') ? '_blank' : undefined}
                  rel={card.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: (idx % 4) * 0.1 }}
                  className="group h-full block"
                >
                  <SpotlightCard className="h-full">
                    <div className="group h-full bg-gradient-to-b from-white to-happi-cream/60 border border-gray-100 p-8 rounded-3xl text-center hover:shadow-2xl hover:shadow-happi-pink/10 transition-all duration-500 hover:-translate-y-2">
                      <div className="relative mb-5 inline-flex justify-center">
                        <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg ${card.shadow} group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500`}>
                          <Icon className={`w-8 h-8 ${card.text}`} />
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-happi-pink/15 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                      </div>
                      <h3 className="text-xl font-bold text-happi-charcoal mb-2 group-hover:text-happi-pink transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{card.content}</p>
                    </div>
                  </SpotlightCard>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CONTACT FORM & INFO                                               */}
      {/* ================================================================ */}
      <section className="py-16 md:py-24 bg-happi-cream relative overflow-hidden">
        <div className="blob-decoration w-72 h-72 bg-happi-pink -top-20 -left-20 opacity-15 animate-blob" />
        <div className="blob-decoration w-64 h-64 bg-happi-cyan -bottom-20 -right-20 opacity-10 animate-blob" style={{ animationDelay: '25s' }} />
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-3"
            >
              <SpotlightCard className="h-full">
                <div className="bg-gradient-to-b from-white to-happi-cream/60 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-happi-charcoal/10 border border-gray-100">
                  <span className="inline-flex items-center gap-2 text-happi-pink font-bold uppercase tracking-[0.2em] text-sm mb-4">
                    <Sparkles className="w-5 h-5" />
                    Send us a Message
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-8 tracking-tight">
                    We're Here to <span className="text-gradient-happi">Help</span>
                  </h2>

                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-5 rounded-2xl bg-happi-green/10 border border-happi-green/30 text-happi-green font-medium flex items-center gap-3"
                    >
                      <span className="text-2xl">✅</span>
                      Thank you! Your message has been sent. We'll get back to you within 24 hours.
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                        Your Name <span className="text-happi-pink">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder="Enter your name"
                      />
                    </div>

                    {/* Email + Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="group">
                        <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                          Email Address <span className="text-happi-pink">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={inputClass}
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                          Phone Number <span className="text-happi-pink">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className={inputClass}
                          placeholder="+91 XXXX XXXX XX"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                        Topic <span className="text-happi-pink">*</span>
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="bulk">Bulk Order</option>
                        <option value="corporate">Corporate Gifting</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                        Your Message <span className="text-happi-pink">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className={`${inputClass} resize-none`}
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-primary w-full text-lg flex items-center justify-center gap-2 btn-shine !py-4 !rounded-2xl"
                    >
                      Send Message
                      <Send className="w-5 h-5" />
                    </motion.button>

                    <p className="text-xs text-gray-400 text-center">
                      We typically respond within 24 hours on business days.
                    </p>
                  </form>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-2 space-y-8 relative z-10"
            >
              {/* Business Hours */}
              <SpotlightCard className="h-full">
                <div className="bg-gradient-to-br from-white to-happi-cream/60 rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-happi-charcoal/5">
                  <h3 className="text-2xl font-bold text-happi-charcoal mb-6 flex items-center gap-2.5">
                    <span className="w-10 h-10 rounded-xl bg-happi-pink/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-happi-pink" />
                    </span>
                    Business Hours
                  </h3>
                  <div className="space-y-3">
                    {[
                      { days: 'Monday - Friday', hours: '9:00 AM - 6:00 PM', open: true },
                      { days: 'Saturday', hours: '10:00 AM - 4:00 PM', open: true },
                      { days: 'Sunday', hours: 'Closed', open: false },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-3.5 px-4 bg-white rounded-xl border border-gray-100 hover:border-happi-pink/30 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2 h-2 rounded-full ${item.open ? 'bg-happi-green animate-pulse' : 'bg-red-400'}`} />
                          <span className="font-medium text-happi-charcoal text-sm">{item.days}</span>
                        </div>
                        <span className={`text-sm font-semibold px-3 py-1.5 rounded-lg ${item.open ? 'bg-happi-green/10 text-happi-green' : 'bg-red-500/10 text-red-500'}`}>
                          {item.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </SpotlightCard>

              {/* Response Time */}
              <SpotlightCard className="h-full">
                <div className="bg-gradient-to-br from-white to-happi-cream/60 rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-happi-charcoal/5">
                  <h3 className="text-2xl font-bold text-happi-charcoal mb-4 flex items-center gap-2.5">
                    <span className="w-10 h-10 rounded-xl bg-happi-green/10 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-happi-green" />
                    </span>
                    Response Time
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We typically respond to inquiries within{' '}
                    <strong className="text-happi-pink">24 hours</strong> on business days.
                    For urgent matters, please call us directly.
                  </p>
                </div>
              </SpotlightCard>

              {/* Quick Support */}
              <TiltCard glare={false} className="bg-gradient-to-br from-happi-pink via-[#c2185b] to-happi-charcoal rounded-[2rem] p-8 shadow-2xl shadow-happi-pink/25 border-2 border-white/20">
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur border border-white/25 mb-5">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Quick Support
                  </h3>
                  <p className="text-white/85 mb-6 leading-relaxed">
                    For immediate assistance, chat with us on WhatsApp or call our customer support team.
                  </p>
                  <div className="flex flex-col gap-3">
                    <a
                      href="https://wa.me/919585750990"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center gap-2 bg-white text-happi-pink font-bold px-6 py-3.5 rounded-2xl shadow-xl hover:bg-gray-100 hover:scale-[1.03] transition-all btn-shine"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Chat on WhatsApp
                    </a>
                    <a
                      href="tel:+919585750990"
                      className="group inline-flex items-center justify-center gap-2 border-2 border-white/60 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-white/10 hover:border-white transition-all"
                    >
                      <Phone className="w-5 h-5" />
                      +91 95857 59990
                    </a>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-white/80 text-sm">
                    <BadgeCheck className="w-4 h-4 text-happi-gold" />
                    Average response: under 2 hours
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CTA — BROWSE FIRST                                                     */}
      {/* ================================================================ */}
      <section className="relative py-16 md:py-20 overflow-hidden">
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
              className="relative z-10"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/15 backdrop-blur border border-white/30 mb-6 pulse-ring overflow-visible">
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">
              Prefer to Browse First?{' '}
              <span className="text-shimmer-white">Shop Happi</span>
            </h2>

            <p className="text-xl text-white/90 mb-9 max-w-xl mx-auto leading-relaxed">
              Explore our premium collection of dry fruits and nuts — no account needed to start browsing.
            </p>

            <motion.a
              href="/shop"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group inline-flex items-center gap-3 bg-white text-happi-pink font-extrabold text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-black/20 hover:shadow-happi-charcoal/40 transition-shadow btn-shine"
            >
              Shop Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
            </motion.a>

            <p className="mt-7 text-white/70 text-sm font-medium tracking-wide">
              60+ premium products · Freshly packed · Free shipping ₹999+
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}