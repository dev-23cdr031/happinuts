import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Heart, ShieldCheck, Sparkle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import BrandLogo from '../components/BrandLogo';
import ThemedScene from '../components/three/ThemedScene';
import { supabase } from '../lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setSent(true);
      toast.success('Password reset link sent! Check your email.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to send reset link. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-happi-pink focus:ring-4 focus:ring-happi-pink/10 transition-all";

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Decorations */}
        <div className="blob-decoration w-96 h-96 bg-happi-pink -top-32 -left-32 animate-blob" />
        <div className="blob-decoration w-80 h-80 bg-happi-cyan -bottom-20 -right-24 animate-blob" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-dots-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-happi-pink/5 via-white to-happi-cyan/5" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl relative z-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left Panel - 3D & Branding */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex relative overflow-hidden rounded-3xl bg-gradient-to-br from-happi-pink via-[#E91E73] to-happi-cyan text-white flex-col justify-between p-10"
            >
              <div className="blob-decoration w-64 h-64 bg-white top-0 -left-16 opacity-10 animate-blob" />
              <div className="blob-decoration w-56 h-56 bg-happi-gold -bottom-16 -right-10 opacity-20 animate-blob" style={{ animationDelay: '2s' }} />

              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/25 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
                  <Heart className="w-4 h-4 fill-white" />
                  No Worries
                </div>
                <h2 className="text-4xl font-bold mb-4 leading-tight">
                  Reset Your <span className="text-shimmer-white">Password</span>
                </h2>
                <p className="text-white/80 text-lg">
                  We'll send you a secure link to reset your password and get you back to snacking happy.
                </p>
              </div>

              <div className="relative h-[280px]">
                <ThemedScene className="w-full h-full" variant="hearts" color="#FF8FB3" count={10} />
              </div>

              <div className="relative flex items-center gap-4">
                <div className="flex-1 h-px bg-white/20" />
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <ShieldCheck className="w-5 h-5" />
                  Secure & Private
                </div>
                <div className="flex-1 h-px bg-white/20" />
              </div>
            </motion.div>

            {/* Right Panel - Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 md:p-12 border border-white/40">
                {/* Logo */}
                <div className="text-center mb-8">
                  <div className="mb-4 flex justify-center">
                    <BrandLogo compact />
                  </div>
                  <h1 className="text-3xl font-bold text-happi-charcoal">
                    Forgot <span className="text-gradient-happi">Password?</span>
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Enter your email and we'll send you a reset link
                  </p>
                </div>

                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-happi-green/10 mb-4">
                      <CheckCircle2 className="w-8 h-8 text-happi-green" />
                    </div>
                    <h3 className="text-xl font-bold text-happi-charcoal mb-2">
                      Check Your Email
                    </h3>
                    <p className="text-gray-600 mb-2">
                      We've sent a password reset link to:
                    </p>
                    <p className="font-semibold text-happi-pink mb-4">{email}</p>
                    <p className="text-sm text-gray-500 mb-6">
                      Didn't receive it? Check your spam folder or try again.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSent(false);
                        setEmail('');
                      }}
                      className="text-happi-pink font-semibold hover:underline"
                    >
                      Send another link
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className={inputClass}
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn-primary w-full text-lg btn-shine" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="inline-flex items-center gap-2">
                          <Sparkle className="w-5 h-5 animate-spin" />
                          Sending Link...
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-2">
                          Send Reset Link
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </button>
                  </form>
                )}

                {/* Back to Login */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-center text-gray-600">
                    Remembered your password?{' '}
                    <a href="/login" className="text-happi-pink font-semibold hover:underline">
                      Back to Sign in
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}