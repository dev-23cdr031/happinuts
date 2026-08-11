import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Heart, Sparkle } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import BrandLogo from '../components/BrandLogo';
import ThemedScene from '../components/three/ThemedScene';
import { supabase } from '../lib/supabase';

const handleGoogleLogin = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/account`,
      },
    });

    if (error) {
      throw error;
    }

    if (!data?.url) {
      toast.error('Google sign-in is not configured yet. Please use email/password to sign in.');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Google sign-in is not configured yet. Please use email/password to sign in.';
    toast.error(message);
  }
};

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      toast.success('Welcome back! You are now signed in.');
      setLocation('/account');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in. Please try again.';
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
                  Welcome Back
                </div>
                <h2 className="text-4xl font-bold mb-4 leading-tight">
                  Healthy Bites.{' '}
                  <span className="text-shimmer-white">Happier Moments.</span>
                </h2>
                <p className="text-white/80 text-lg">
                  Sign in to continue your journey with premium dry fruits and nuts.
                </p>
              </div>

              <div className="relative h-[280px]">
                <ThemedScene className="w-full h-full" variant="hearts" color="#FF8FB3" count={10} />
              </div>

              <div className="relative flex items-center gap-4">
                <div className="flex-1 h-px bg-white/20" />
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <ShieldCheck className="w-5 h-5" />
                  Trusted by thousands
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
                    Welcome <span className="text-gradient-happi">Back</span>
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Sign in to your Happi Nuts account
                  </p>
                </div>

                {/* Form */}
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
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={`${inputClass} pr-12`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-happi-pink"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="w-4 h-4 text-happi-pink rounded accent-happi-pink"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <a href="/forgot-password" className="text-sm text-happi-pink hover:underline">
                      Forgot password?
                    </a>
                  </div>

                  {/* Login Button */}
                  <button type="submit" className="btn-primary w-full text-lg btn-shine" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Sparkle className="w-5 h-5 animate-spin" />
                        Signing In...
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-2">
                        Sign In
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-500">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-gray-700"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                  </button>
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-gray-600 mt-8">
                  Don't have an account?{' '}
                  <a href="/signup" className="text-happi-pink font-semibold hover:underline">
                    Sign up
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}