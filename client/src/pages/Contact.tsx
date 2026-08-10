import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Send, Sparkle, Clock, ShieldCheck, BadgeCheck } from 'lucide-react';
import ThemedScene from '@/components/three/ThemedScene';
import TiltCard from '@/components/three/TiltCard';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    // Save the contact message so the admin can see it
    try {
      const messages = JSON.parse(localStorage.getItem('happi-nuts-contact-messages') || '[]');
      messages.unshift({
        id: `msg-${Date.now()}`,
        ...formData,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('happi-nuts-contact-messages', JSON.stringify(messages));
      window.dispatchEvent(new Event('happi-nuts-contact-messages-updated'));
    } catch (err) {
      console.warn('Failed to save contact message:', err);
    }

    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactCards = [
    {
      icon: Phone,
      title: 'Call Us',
      content: '+91 95857 59990',
      link: 'tel:+919585750990',
      gradient: 'from-happi-pink/15 to-happi-cyan/10',
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: 'hello@happinuts.com',
      link: 'mailto:hello@happinuts.com',
      gradient: 'from-happi-cyan/15 to-happi-green/10',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      content: 'Chat with us on WhatsApp',
      link: 'https://wa.me/919585750990',
      gradient: 'from-happi-green/15 to-happi-gold/10',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: '6/432, Sivanantham St, Hanumaan Nagar, Allampatti, Tamil Nadu 626001',
      link: '#',
      gradient: 'from-happi-gold/15 to-happi-pink/10',
    },
  ];

  const inputClass = "w-full px-5 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-happi-pink focus:ring-4 focus:ring-happi-pink/10 transition-all bg-white";

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-happi-pink via-[#E91E73] to-happi-cyan text-white">
        <div className="blob-decoration w-96 h-96 bg-white top-0 -left-20 opacity-10 animate-blob" />
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
                <MessageCircle className="w-4 h-4" />
                We'd Love to Hear From You
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Let's Talk <span className="text-shimmer-white">Happi</span>
              </h1>
              <p className="text-xl opacity-90 mb-8">
                Have a question, bulk order enquiry or gifting requirement? We'd love to hear from you.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="https://wa.me/919585750990" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-happi-pink font-bold px-6 py-3.5 rounded-xl hover:bg-gray-100 transition-all hover:scale-105">
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Us
                </a>
                <a href="tel:+919585750990" className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-6 py-3.5 rounded-xl hover:bg-white/10 transition-all">
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative h-[260px] md:h-[320px]"
            >
              <ThemedScene className="w-full h-full" variant="bubbles" color="#7FD4F3" count={10} />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute top-6 right-2 glass-morphism rounded-2xl px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">24h Response</div>
                    <div className="text-xs text-white/70">On business days</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT CARDS ===== */}
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
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`group relative bg-gradient-to-br ${card.gradient} p-8 rounded-3xl text-center hover:shadow-2xl transition-all border border-gray-100`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Icon className="w-8 h-8 text-happi-pink" />
                  </div>
                  <h3 className="text-xl font-bold text-happi-charcoal mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{card.content}</p>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CONTACT FORM & INFO ===== */}
      <section className="py-16 md:py-24 bg-happi-cream relative overflow-hidden">
        <div className="blob-decoration w-72 h-72 bg-happi-pink -top-20 -left-20 animate-blob" />
        <div className="blob-decoration w-64 h-64 bg-happi-cyan -bottom-20 -right-20 animate-blob" style={{ animationDelay: '25s' }} />
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
                <span className="inline-flex items-center gap-2 text-happi-pink font-semibold mb-3">
                  <Sparkle className="w-5 h-5" />
                  Send us a Message
                </span>
                <h2 className="text-3xl font-bold text-happi-charcoal mb-8">
                  We're Here to <span className="text-gradient-happi">Help</span>
                </h2>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-happi-green/10 border border-happi-green/30 text-happi-green font-medium"
                  >
                    ✅ Thank you! Your message has been sent. We'll get back to you within 24 hours.
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                        Email
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
                    <div>
                      <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                        Phone
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

                  <div>
                    <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="bulk">Bulk Order</option>
                      <option value="corporate">Corporate Gifting</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`${inputClass} resize-none`}
                      placeholder="Your message here..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full text-lg flex items-center justify-center gap-2 btn-shine"
                  >
                    Send Message
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-happi-charcoal mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-happi-pink" />
                  Business Hours
                </h3>
                <div className="space-y-3 text-gray-600">
                  {[
                    { days: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
                    { days: 'Saturday', hours: '10:00 AM - 4:00 PM' },
                    { days: 'Sunday', hours: 'Closed' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-happi-charcoal">{item.days}</span>
                      <span className="text-sm bg-happi-cream px-3 py-1 rounded-lg">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-happi-charcoal mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-happi-green" />
                  Response Time
                </h3>
                <p className="text-gray-600">
                  We typically respond to inquiries within <strong className="text-happi-pink">24 hours</strong> on business days. For urgent matters, please call us directly.
                </p>
              </div>

              <TiltCard className="bg-gradient-to-br from-happi-pink to-happi-cyan rounded-3xl p-8 shadow-xl border-2 border-happi-pink/20">
                <div className="relative">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <MessageCircle className="w-6 h-6" />
                    Quick Support
                  </h3>
                  <p className="text-white/85 mb-5">
                    For immediate assistance, chat with us on WhatsApp or call our customer support team.
                  </p>
                  <div className="flex flex-col gap-3">
                    <a
                      href="https://wa.me/919585750990"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-white text-happi-pink font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all hover:scale-105 btn-shine"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Chat on WhatsApp
                    </a>
                    <a
                      href="tel:+919585750990"
                      className="inline-flex items-center justify-center gap-2 border-2 border-white/60 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-all"
                    >
                      <Phone className="w-5 h-5" />
                      +91 95857 59990
                    </a>
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-white/70 text-sm">
                    <BadgeCheck className="w-4 h-4" />
                    Average response: under 2 hours
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-happi-cyan to-happi-pink text-white animate-gradient-shift relative overflow-hidden">
        <div className="absolute inset-0 bg-dots-pattern opacity-10" />
        <div className="container text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prefer to Browse First? <span className="text-shimmer-white">Shop Happi</span>
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Explore our premium collection of dry fruits and nuts
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