import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ShieldCheck,
  Truck,
  Package,
  Scale,
  ChevronDown,
  Sparkle,
  MessageCircle,
  Lock,
  RefreshCcw,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';
import MiniNutField from '@/components/three/MiniNutField';

type InfoSection = {
  heading: string;
  body: string[];
};

type InfoPageProps = {
  title: string;
  eyebrow: string;
  intro: string;
  sections: InfoSection[];
  icon: typeof HelpCircle;
  accent: string;
  accentBg: string;
  nutColor?: string;
};

function InfoHero({
  title,
  eyebrow,
  intro,
  icon: Icon,
  accent,
  accentBg,
  nutColor = '#E91E73',
}: InfoPageProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-happi-cream via-white to-happi-cream pb-12 md:pb-16">
      <div className="blob-decoration w-96 h-96 bg-happi-pink -top-32 -left-32 animate-blob" />
      <div className="blob-decoration w-80 h-80 bg-happi-cyan top-40 -right-24 animate-blob" style={{ animationDelay: '3s' }} />
      <div className="absolute inset-0 bg-dots-pattern opacity-40" />

      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={`inline-flex items-center gap-2 bg-white/70 backdrop-blur border ${accentBg} ${accent} text-sm font-semibold px-4 py-2 rounded-full mb-5`}>
              <Icon className="w-4 h-4" />
              {eyebrow}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-happi-charcoal mb-4">
              {title.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-gradient-happi">
                {title.split(' ').slice(-1)}
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">{intro}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative h-[220px] md:h-[280px]"
          >
            <MiniNutField className="w-full h-full" color={nutColor} count={9} />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute top-4 right-2 glass-card-light rounded-2xl px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-happi-green" />
                <span className="font-semibold text-sm text-happi-charcoal">Happi Assurance</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InfoSectionCard({
  section,
  index,
  icon: Icon,
}: {
  section: InfoSection;
  index: number;
  icon: typeof HelpCircle;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="group relative bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-happi-pink via-happi-cyan to-happi-gold opacity-60 group-hover:opacity-100 transition-opacity" />
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-happi-cream flex items-center justify-center flex-shrink-0 group-hover:bg-happi-pink group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Icon className="w-6 h-6 text-happi-pink group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-2xl font-bold text-happi-charcoal group-hover:text-happi-pink transition-colors">
            {section.heading}
          </h2>
        </div>
        <div className="space-y-3 text-gray-700 leading-relaxed pl-16">
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function InfoCTA() {
  return (
    <div className="mt-14 bg-happi-charcoal text-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
      <div className="blob-decoration w-64 h-64 bg-happi-pink -top-20 -right-20 opacity-30 animate-blob" />
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-2">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Still have <span className="text-gradient-happi">questions?</span>
          </h2>
          <p className="text-white/80 text-lg">
            Our support team is here to help. Reach out and we'll respond within 24 hours.
          </p>
        </div>
        <div className="flex md:justify-end">
          <a href="/contact" className="btn-primary text-lg inline-flex items-center gap-2 btn-shine">
            <MessageCircle className="w-5 h-5" />
            Contact Us
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}

function StaticInfoPage({ ...props }: InfoPageProps) {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <InfoHero {...props} />

      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-happi-cream">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-happi-pink font-semibold mb-3">
              <Sparkle className="w-5 h-5" />
              Everything You Need to Know
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-4">
              Key <span className="text-gradient-happi">Information</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {props.sections.map((section, index) => (
              <InfoSectionCard
                key={section.heading}
                section={section}
                index={index}
                icon={props.icon}
              />
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <InfoCTA />
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqAccordion() {
  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Browse the store, add your favourite nuts, seeds, or dried fruits to the cart, and continue to checkout. You can complete the payment with Razorpay or choose cash on delivery where available. Once the payment is successful, you will receive a confirmation with your order summary and expected delivery timeline.',
    },
    {
      question: 'Do you offer fresh and hygienic packing?',
      answer: 'Yes. Every product is carefully packed in sealed, food-safe packaging to preserve freshness, aroma, and quality during transit. We recommend storing dry items in a cool, airtight container and using them within the suggested shelf life.',
    },
    {
      question: 'Can I order for gifting?',
      answer: 'Absolutely. Our gifting assortment is designed for festive occasions, wellness hampers, and thoughtful gifting for family and friends. If you want a custom hamper or special note, contact our team and we will help with a curated option.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major UPI apps, credit/debit cards, net banking, and cash on delivery where available. All online payments are processed through secure Razorpay gateway.',
    },
    {
      question: 'How long does delivery take?',
      answer: 'Most orders are dispatched within 24-48 hours and delivered within 3-5 business days across major cities in India. Remote locations may take a little longer.',
    },
    {
      question: 'What is your return policy?',
      answer: 'If your order arrives damaged, expired, or incorrect, contact us within 48 hours of delivery with your order ID and photos. We review each case individually and offer replacement or refund based on the issue.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <InfoHero
        title="Frequently Asked Questions"
        eyebrow="Support"
        intro="Everything you need to know before ordering, storing, and enjoying your healthy daily essentials from Happi Nuts."
        sections={[]}
        icon={HelpCircle}
        accent="text-happi-pink"
        accentBg="border-happi-pink/20"
      />

      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-happi-cream">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-happi-pink font-semibold mb-3">
              <HelpCircle className="w-5 h-5" />
              Quick Answers
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-4">
              Frequently Asked <span className="text-gradient-happi">Questions</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Find quick answers to the most common questions
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? 'bg-white border-happi-pink/30 shadow-xl'
                      : 'bg-white/60 border-gray-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 p-6 text-left"
                  >
                    <span className="font-semibold text-happi-charcoal flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isOpen ? 'bg-happi-pink text-white' : 'bg-happi-cream text-happi-pink'}`}>
                        <Sparkle className="w-4 h-4" />
                      </span>
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-happi-pink transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-gray-600 leading-relaxed ml-11">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <div className="max-w-3xl mx-auto">
            <InfoCTA />
          </div>
        </div>
      </section>
    </div>
  );
}

export function FaqPage() {
  return <FaqAccordion />;
}

export function TermsPage() {
  return (
    <StaticInfoPage
      title="Terms & Conditions"
      eyebrow="Agreement"
      intro="These terms govern your use of the Happi Nuts website and your purchase of products from our store. By placing an order, you agree to these terms and conditions."
      icon={Scale}
      accent="text-happi-gold"
      accentBg="border-happi-gold/20"
      nutColor="#D9A441"
      sections={[
        {
          heading: 'General terms',
          body: [
            'Happi Nuts reserves the right to update, revise, or modify these terms at any time without prior notice. Continued use of the website after changes are posted means you accept the revised terms.',
            'You agree to use the website for lawful purposes only and not to misuse, interfere with, or attempt to disrupt the website or its services.',
          ],
        },
        {
          heading: 'Orders and payments',
          body: [
            'All product prices are shown in Indian Rupees and are subject to change without notice. We make every effort to display accurate pricing, availability, and product information at the time of purchase.',
            'Orders are considered accepted only after successful confirmation by our team or a payment confirmation from the payment gateway. If a product becomes unavailable, we may cancel the order and refund the amount paid.',
          ],
        },
        {
          heading: 'Delivery and acceptance',
          body: [
            'Delivery timelines are estimates and may vary due to weather, logistics conditions, regional factors, or product demand. We do our best to ensure timely dispatch and delivery.',
            'Upon receiving your order, please inspect the package before accepting it. If the product is damaged, missing, or incorrect, contact us immediately and we will assist with a replacement or refund as applicable.',
          ],
        },
      ]}
    />
  );
}

export function PrivacyPolicyPage() {
  return (
    <StaticInfoPage
      title="Privacy Policy"
      eyebrow="Your trust matters"
      intro="We respect your privacy and keep your information secure. This policy explains how we handle your data while shopping with Happi Nuts."
      icon={Lock}
      accent="text-happi-cyan"
      accentBg="border-happi-cyan/20"
      nutColor="#19A9E5"
      sections={[
        {
          heading: 'Information we collect',
          body: [
            'We collect contact, order, and delivery information needed to process purchases and respond to your queries. This may include your name, email address, phone number, shipping address, and payment confirmation details.',
            'We may also collect usage data from our website such as browser information, page activity, and general analytics to improve the shopping experience.',
          ],
        },
        {
          heading: 'How we use your information',
          body: [
            'Your information is used to process orders, send confirmations, deliver products, support post-purchase service requests, and keep you informed about offers relevant to your shopping experience.',
            'We do not sell or rent your personal data to third parties for marketing purposes.',
          ],
        },
        {
          heading: 'Security',
          body: [
            'We use reasonable security measures to protect your data from unauthorised access, misuse, modification, or loss while it is in our custody or under our control.',
            'Payment processing is handled through secure gateways, and we do not store full card data on our own systems.',
          ],
        },
      ]}
    />
  );
}

export function ShippingInfoPage() {
  const shippingFeatures = [
    { icon: Truck, label: 'Fast Dispatch', desc: '24-48 hours' },
    { icon: ShieldCheck, label: 'Safe Packing', desc: 'Food-grade seals' },
    { icon: Package, label: 'Track Order', desc: 'Real-time updates' },
    { icon: RefreshCcw, label: 'Easy Returns', desc: '48h window' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <InfoHero
        title="Shipping Information"
        eyebrow="Fast and reliable"
        intro="We ship across India with a focus on freshness, safe packing, and timely delivery for every order."
        sections={[]}
        icon={Truck}
        accent="text-happi-cyan"
        accentBg="border-happi-cyan/20"
        nutColor="#19A9E5"
      />

      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-happi-cream">
        <div className="container">
          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-14">
            {shippingFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-happi-cream flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-happi-pink" />
                  </div>
                  <h3 className="font-bold text-happi-charcoal mb-1">{feature.label}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                heading: 'Delivery timeline',
                body: ['Most orders are dispatched within 24 to 48 hours of confirmation, depending on product availability and stock status. Delivery usually takes 3 to 5 business days for major cities and may take a little longer for remote locations.'],
              },
              {
                heading: 'Shipping charges',
                body: ['We offer free shipping on eligible orders above ₹500. Smaller orders may attract a nominal shipping fee based on the delivery location. Shipping charges are displayed in the cart before checkout, so you always know the final amount before paying.'],
              },
              {
                heading: 'Order tracking',
                body: ['Once your order is shipped, we will share the tracking details or dispatch confirmation through the contact information provided in the order. If you face any delay, our support team is happy to help you with the status and next steps.'],
              },
            ].map((section, index) => (
              <InfoSectionCard
                key={section.heading}
                section={section}
                index={index}
                icon={Truck}
              />
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <InfoCTA />
          </div>
        </div>
      </section>
    </div>
  );
}

export function ReturnsPage() {
  const steps = [
    { num: '01', title: 'Report Issue', desc: 'Contact us within 48 hours of delivery' },
    { num: '02', title: 'Share Details', desc: 'Send order ID and photos of the issue' },
    { num: '03', title: 'We Review', desc: 'We assess every case individually' },
    { num: '04', title: 'Resolution', desc: 'Replacement or refund processed fast' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <InfoHero
        title="Returns & Refunds"
        eyebrow="Simple and fair"
        intro="We want every order to feel right. If something is damaged, incorrect, or not as expected, our team will help resolve it quickly."
        sections={[]}
        icon={RefreshCcw}
        accent="text-happi-green"
        accentBg="border-happi-green/20"
        nutColor="#69A84F"
      />

      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-happi-cream">
        <div className="container">
          {/* Steps */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-happi-charcoal mb-4">
              How Returns <span className="text-gradient-happi">Work</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-14">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-happi-green to-happi-cyan mb-3">
                  {step.num}
                </div>
                <h3 className="font-bold text-happi-charcoal mb-1">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-10">
                    <ArrowRight className="w-4 h-4 text-happi-green" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                heading: 'Return window',
                body: ['If your order arrives damaged, expired, or incorrect, please contact us within 48 hours of delivery with your order ID and relevant photos. We review each case individually and aim to offer the fastest possible replacement or refund based on the issue.'],
              },
              {
                heading: 'What is not eligible?',
                body: ['Products that are opened, consumed, or damaged due to improper storage after delivery may not be eligible for return unless there is a genuine quality issue. Custom gift packages and products not in their original sealed condition may be subject to review before a refund is approved.'],
              },
              {
                heading: 'Refund process',
                body: ['Approved refunds are processed back to the original payment method within 5 to 7 business days, depending on your bank or payment provider. For any questions, contact todaymart2017@gmail.com with your order number and a brief description so we can assist promptly.'],
              },
            ].map((section, index) => (
              <InfoSectionCard
                key={section.heading}
                section={section}
                index={index}
                icon={RefreshCcw}
              />
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <InfoCTA />
          </div>
        </div>
      </section>
    </div>
  );
}