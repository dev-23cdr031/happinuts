import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Sparkle, ShieldCheck } from 'lucide-react';
import ThemedScene from '@/components/three/ThemedScene';

export default function PageLocked({ pageName = 'This page' }: { pageName?: string }) {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <section className="relative overflow-hidden bg-gradient-to-br from-happi-cream via-white to-happi-cream min-h-[70vh] flex items-center justify-center">
        <div className="blob-decoration w-96 h-96 bg-happi-pink -top-32 -left-32 animate-blob" />
        <div className="blob-decoration w-80 h-80 bg-happi-cyan -bottom-20 -right-24 animate-blob" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-dots-pattern opacity-40" />

        <div className="container relative py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-happi-pink/20 text-happi-pink text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <Lock className="w-4 h-4" />
                Page Temporarily Locked
              </div>

              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-happi-pink/10 mb-6 pulse-ring">
                <Lock className="w-12 h-12 text-happi-pink" />
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-happi-charcoal mb-4">
                {pageName} is <span className="text-gradient-happi">Temporarily Locked</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                This page has been temporarily locked by the owner. It will be enabled soon. Please check back later or explore other parts of the store.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="/" className="btn-primary inline-flex items-center justify-center gap-2 btn-shine">
                  <ArrowLeft className="w-5 h-5" />
                  Go to Home
                </a>
                <a href="/shop" className="btn-outline inline-flex items-center justify-center gap-2">
                  <Sparkle className="w-5 h-5" />
                  Browse Shop
                </a>
              </div>

              <div className="mt-8 inline-flex items-center gap-2 text-sm text-gray-500">
                <ShieldCheck className="w-4 h-4 text-happi-green" />
                We apologize for the inconvenience. The page will be back soon.
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative h-[280px] md:h-[340px]"
            >
              <ThemedScene className="w-full h-full" variant="shields" color="#19A9E5" count={10} />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute top-4 right-2 glass-card-light rounded-2xl px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-happi-pink" />
                  <span className="font-semibold text-sm text-happi-charcoal">Owner Locked</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}