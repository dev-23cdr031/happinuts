import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Heart, ShieldCheck, Sparkle, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import BrandLogo from '../components/BrandLogo';
import ThemedScene from '../components/three/ThemedScene';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Supabase puts the recovery tokens in the URL hash after the email link redirect.
    // detectSessionInUrl: true in the client config picks these up automatically.
    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        setIsValidSession(false);
        return;
      }
      setIsValidSession(true);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error('Please enter and confirm your new password.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      toast.success('Password updated successfully! Please sign in with your new password.');
      setLocation('/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update password. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength =
    formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password)
      ? 'strong'
      : formData.password.length >= 6
        ? 'medium'
        : 'weak';

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
                  Almost There
                </div>
                <h2 className="text-4xl font-bold mb-4 leading-tight">
                  Set a New <span className="text-shimmer-white">Password</span>
                </h2>
                <p className="text-white/80 text-lg">
                  Choose a strong password to keep your Happi Nuts account secure.
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
                    Reset <span className="text-gradient-happi">Password</span>
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Enter your new password below
                  </p>
                </div>

                {isValidSession === null ? (
                  <div className="text-center py-12">
                    <Sparkle className="w-8 h-8 text-happi-pink animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Verifying your reset link...</p>
                  </div>
                ) : isValidSession === false ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                      <Lock className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-happi-charcoal mb-2">
                      Invalid or Expired Link
                    </h3>
                    <p className="text-gray-600 mb-6">
                      This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <a href="/forgot-password" className="btn-primary inline-flex items-center gap-2">
                      Request New Link
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                        New Password
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
                      {formData.password && (
                        <div className="mt-2">
                          <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                passwordStrength === 'strong'
                                  ? 'w-full bg-happi-green'
                                  : passwordStrength === 'medium'
                                    ? 'w-2/3 bg-happi-gold'
                                    : 'w-1/3 bg-red-400'
                              }`}
                            />
                          </div>
                          <p className={`text-xs mt-1 font-medium ${passwordStrength === 'strong' ? 'text-happi-green' : passwordStrength === 'medium' ? 'text-happi-gold' : 'text-red-400'}`}>
                            Password strength: {passwordStrength}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-happi-charcoal mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className={`${inputClass} pr-12`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-happi-pink"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {formData.password && formData.confirmPassword && (
                        <p
                          className={`text-xs mt-2 flex items-center gap-1 ${
                            formData.password === formData.confirmPassword
                              ? 'text-happi-green'
                              : 'text-red-500'
                          }`}
                        >
                          {formData.password === formData.confirmPassword && (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          {formData.password === formData.confirmPassword
                            ? 'Passwords match'
                            : 'Passwords do not match'}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn-primary w-full text-lg btn-shine" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="inline-flex items-center gap-2">
                          <Sparkle className="w-5 h-5 animate-spin" />
                          Updating Password...
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-2">
                          Update Password
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